#!/bin/bash
# Assemblage final sur le serveur (étape 7) : blocs bruts mis bout à bout sans réencodage,
# bande son reconstruite depuis l'audio brut de chaque bloc (amorce AAC de 2048 échantillons retirée,
# longueur calée à l'échantillon près), master −14 LUFS en 2 passes, puis version ×1,15 (PLAYBOOK §6bis).
# Usage : assemble_remote.sh <IP> <NomFinal> <dossier_local> bloc_raw.mp4:nb_images …
#   (fichiers dans /root/rendu/blocs/ sur le serveur, dans l'ordre de la timeline)
set -euo pipefail
IP=$1; NAME=$2; LOCAL=$3; shift 3
KEY=~/.ssh/hetzner_remotion
SSH="ssh -i $KEY -o ServerAliveInterval=30 root@$IP"
SPECS="$*"
$SSH -n "bash -s" <<EOF
set -euo pipefail
cd /root/rendu/blocs
rm -rf final && mkdir final
: > final/list.txt
IN=""; FA=""; i=0
for s in $SPECS; do
  f=\${s%%:*}; want=\${s##*:}
  got=\$(ffprobe -v error -count_packets -select_streams v:0 -show_entries stream=nb_read_packets -of default=nw=1:nk=1 \$f)
  echo "\$f : \$got images (attendu \$want)"
  [ "\$got" = "\$want" ] || { echo "ÉCART D'IMAGES sur \$f"; exit 1; }
  echo "file '/root/rendu/blocs/\$f'" >> final/list.txt
  n=\$(( want * 48000 / 30 ))
  IN="\$IN -i \$f"
  FA="\$FA[\$i:a]aresample=48000,atrim=start_sample=2048,apad=whole_len=\$n,atrim=end_sample=\$n,asetpts=N/SR/TB[a\$i];"
  i=\$((i+1))
done
CAT=""; for k in \$(seq 0 \$((i-1))); do CAT="\$CAT[a\$k]"; done
ffmpeg -v error -y \$IN -filter_complex "\${FA}\${CAT}concat=n=\$i:v=0:a=1[a]" -map "[a]" -c:a pcm_f32le final/bande.wav
ffmpeg -v error -y -f concat -safe 0 -i final/list.txt -an -c:v copy final/video.mp4
master() { # \$1 = wav d'entrée, \$2 = filtre avant loudnorm
  J=\$(ffmpeg -hide_banner -i "\$1" -af "\$2loudnorm=I=-14:TP=-1:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
  python3 -c "import json,sys;d=json.loads(sys.argv[1]);print(f\"measured_I={d['input_i']}:measured_TP={d['input_tp']}:measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}:offset={d['target_offset']}\")" "\$J"
}
MI=\$(master final/bande.wav "")
ffmpeg -v error -y -i final/video.mp4 -i final/bande.wav -map 0:v -map 1:a -c:v copy -af "loudnorm=I=-14:TP=-1:LRA=11:\$MI:linear=true,aresample=48000" -c:a aac -b:a 320k -movflags +faststart -shortest final/${NAME}.mp4
MI2=\$(master final/bande.wav "atempo=1.15,")
ffmpeg -v error -y -i final/video.mp4 -i final/bande.wav -filter_complex "[0:v]setpts=PTS/1.15[v];[1:a]atempo=1.15,loudnorm=I=-14:TP=-1:LRA=11:\$MI2:linear=true,aresample=48000[a]" -map "[v]" -map "[a]" -c:v libx264 -crf 14 -preset medium -pix_fmt yuv420p -c:a aac -b:a 320k -movflags +faststart final/${NAME}_x1.15.mp4
for v in final/${NAME}.mp4 final/${NAME}_x1.15.mp4; do
  echo "\$v : \$(ffprobe -v error -show_entries format=duration -of csv=p=0 \$v) s"
  ffmpeg -hide_banner -i \$v -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | tail -2
done
EOF
mkdir -p "$LOCAL"
rsync -az -e "ssh -i $KEY" "root@$IP:/root/rendu/blocs/final/${NAME}.mp4" "root@$IP:/root/rendu/blocs/final/${NAME}_x1.15.mp4" "$LOCAL/"
echo "ASSEMBLAGE_OK $LOCAL"
