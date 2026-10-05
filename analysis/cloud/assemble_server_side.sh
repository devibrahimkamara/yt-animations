#!/bin/bash
# Exécuté SUR le serveur par assemble_remote.sh. Usage : assemble_server_side.sh <NomFinal> bloc_raw.mp4:nb_images …
set -euo pipefail
NAME=$1; shift
SPEED=${SPEED:-1.10}  # vitesse finale (PLAYBOOK §6bis)
SFX=x$SPEED
cd /root/rendu/blocs
rm -rf final && mkdir final
: > final/list.txt
IN=(); FA=""; CAT=""; i=0
for s in "$@"; do
  f=${s%%:*}; want=${s##*:}
  got=$(ffprobe -v error -count_packets -select_streams v:0 -show_entries stream=nb_read_packets -of default=nw=1:nk=1 "$f")
  echo "$f : $got images (attendu $want)"
  [ "$got" = "$want" ] || { echo "ÉCART D'IMAGES sur $f"; exit 1; }
  echo "file '/root/rendu/blocs/$f'" >> final/list.txt
  n=$(( want * 48000 / 30 ))
  IN+=(-i "$f")
  FA+="[$i:a]aresample=48000,atrim=start_sample=2048,apad=whole_len=$n,atrim=end_sample=$n,asetpts=N/SR/TB[a$i];"
  CAT+="[a$i]"
  i=$((i+1))
done
ffmpeg -v error -y "${IN[@]}" -filter_complex "${FA}${CAT}concat=n=$i:v=0:a=1[a]" -map "[a]" -c:a pcm_f32le final/bande.wav
ffmpeg -v error -y -f concat -safe 0 -i final/list.txt -an -c:v copy final/video.mp4
measure() { # $1 = filtre avant loudnorm
  J=$(ffmpeg -hide_banner -i final/bande.wav -af "${1}loudnorm=I=-14:TP=-1:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
  python3 -c "import json,sys;d=json.loads(sys.argv[1]);print(f\"measured_I={d['input_i']}:measured_TP={d['input_tp']}:measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}:offset={d['target_offset']}\")" "$J"
}
MI=$(measure "")
ffmpeg -v error -y -i final/video.mp4 -i final/bande.wav -map 0:v -map 1:a -c:v copy -af "loudnorm=I=-14:TP=-1:LRA=11:$MI:linear=true,aresample=48000" -c:a aac -b:a 320k -movflags +faststart -shortest "final/$NAME.mp4"
MI2=$(measure "atempo=$SPEED,")
ffmpeg -v error -y -i final/video.mp4 -i final/bande.wav -filter_complex "[0:v]setpts=PTS/$SPEED[v];[1:a]atempo=$SPEED,loudnorm=I=-14:TP=-1:LRA=11:$MI2:linear=true,aresample=48000[a]" -map "[v]" -map "[a]" -c:v libx264 -crf 14 -preset medium -pix_fmt yuv420p -c:a aac -b:a 320k -movflags +faststart "final/${NAME}_$SFX.mp4"
for v in "final/$NAME.mp4" "final/${NAME}_$SFX.mp4"; do
  echo "$v : $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$v") s"
  ffmpeg -hide_banner -i "$v" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | tail -2
done
