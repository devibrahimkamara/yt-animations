#!/bin/bash
# Exécuté SUR le serveur. Assemblage quand l'image vient de plusieurs rendus partiels (correctifs recollés)
# et que la bande son a été rendue d'un seul tenant (remotion render --codec=wav, pas d'amorce AAC).
# Usage : assemble_mixed_server.sh <NomFinal> <bande.wav> fichier.mp4:première_image:nb_images …   (fichiers dans /root/rendu/blocs)
set -euo pipefail
NAME=$1; WAV=$2; shift 2
SPEED=${SPEED:-1.10}
cd /root/rendu/blocs
rm -rf final && mkdir final
IN=(); FV=""; CAT=""; i=0; total=0
for s in "$@"; do
  IFS=: read -r f a n <<< "$s"
  IN+=(-i "$f")
  FV+="[$i:v]trim=start_frame=$a:end_frame=$((a+n)),setpts=PTS-STARTPTS[v$i];"
  CAT+="[v$i]"; i=$((i+1)); total=$((total+n))
done
ffmpeg -v error -y "${IN[@]}" -filter_complex "${FV}${CAT}concat=n=$i:v=1:a=0[v]" -map "[v]" -c:v libx264 -crf 12 -preset fast -pix_fmt yuv420p -r 30 final/video.mp4
got=$(ffprobe -v error -count_packets -select_streams v:0 -show_entries stream=nb_read_packets -of default=nw=1:nk=1 final/video.mp4)
echo "images : $got (attendu $total)"; [ "$got" = "$total" ] || { echo "ÉCART D'IMAGES"; exit 1; }
ns=$(( total * 48000 / 30 ))
ffmpeg -v error -y -i "$WAV" -af "aresample=48000,apad=whole_len=$ns,atrim=end_sample=$ns" -c:a pcm_f32le final/bande.wav
measure() {
  J=$(ffmpeg -hide_banner -i final/bande.wav -af "${1}loudnorm=I=-14:TP=-1:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
  python3 -c "import json,sys;d=json.loads(sys.argv[1]);print(f\"measured_I={d['input_i']}:measured_TP={d['input_tp']}:measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}:offset={d['target_offset']}\")" "$J"
}
MI=$(measure "")
ffmpeg -v error -y -i final/video.mp4 -i final/bande.wav -map 0:v -map 1:a -c:v copy -af "loudnorm=I=-14:TP=-1:LRA=11:$MI:linear=true,aresample=48000" -c:a aac -b:a 320k -movflags +faststart -shortest "final/$NAME.mp4"
MI2=$(measure "atempo=$SPEED,")
ffmpeg -v error -y -i final/video.mp4 -i final/bande.wav -filter_complex "[0:v]setpts=PTS/$SPEED[v];[1:a]atempo=$SPEED,loudnorm=I=-14:TP=-1:LRA=11:$MI2:linear=true,aresample=48000[a]" -map "[v]" -map "[a]" -c:v libx264 -crf 14 -preset medium -pix_fmt yuv420p -c:a aac -b:a 320k -movflags +faststart "final/${NAME}_x$SPEED.mp4"
for v in "final/$NAME.mp4" "final/${NAME}_x$SPEED.mp4"; do
  echo "$v : $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$v") s"
  ffmpeg -hide_banner -i "$v" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | tail -2
done
