#!/bin/bash
# Assemblage final (étape 7) : images des blocs mises bout à bout sans réencodage
# + bande son complète masterisée une seule fois (−14 LUFS / −1 dBTP).
# Usage : assemble_final.sh <bande_son.wav> <sortie.mp4>
set -euo pipefail
WAV=$1; OUT=$2
ROOT=/Users/ibrahimkamara/yt-animations; cd "$ROOT"
B=montages/aisa/06-blocs
TMP=$(mktemp -d)
# Images attendues par bloc (timeline MontageAisa, 30 i/s)
EXPECT="bloc-H:1936 bloc-1:5444 bloc-2:8957 bloc-3:8079 bloc-4:7843 bloc-5:6771"
: > "$TMP/list.txt"
for e in $EXPECT; do
  n=${e%%:*}; want=${e##*:}
  got=$(ffprobe -v error -count_packets -select_streams v:0 -show_entries stream=nb_read_packets -of default=nw=1:nk=1 "$B/$n.mp4")
  echo "$n : $got images (attendu $want)"
  [ "$got" = "$want" ] || { echo "ÉCART D'IMAGES sur $n"; exit 1; }
  ffmpeg -hide_banner -loglevel error -y -i "$B/$n.mp4" -an -c:v copy "$TMP/$n.mp4"
  echo "file '$TMP/$n.mp4'" >> "$TMP/list.txt"
done
ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i "$TMP/list.txt" -c copy "$TMP/video.mp4"
# Master audio 2 passes
J=$(ffmpeg -hide_banner -i "$WAV" -af loudnorm=I=-14:TP=-1:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
MI=$(echo "$J" | python3 -c "import json,sys;d=json.load(sys.stdin);print(f\"measured_I={d['input_i']}:measured_TP={d['input_tp']}:measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}:offset={d['target_offset']}\")")
ffmpeg -hide_banner -loglevel error -y -i "$TMP/video.mp4" -i "$WAV" -map 0:v -map 1:a -c:v copy \
  -af "loudnorm=I=-14:TP=-1:LRA=11:${MI}:linear=true,aresample=48000" -c:a aac -b:a 320k -movflags +faststart -shortest "$OUT"
echo "durée : $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT") s"
ffmpeg -hide_banner -i "$OUT" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | tail -2
echo "ASSEMBLAGE_OK $OUT"
