#!/bin/bash
# Rendu d'un montage avec les réglages validés par Ibrahim le 4 octobre 2026
# (banc d'essai : analysis/bench/RAPPORT.md, gain mesuré −46 % à image équivalente).
#   GPU (--gl=angle) + images JPEG qualité 95 + 3 rendus en parallèle, H.264 CRF 12,
#   puis master audio 2 passes −14 LUFS / −1 dBTP.
# Usage : render_montage.sh <Composition> <sortie.mp4> [premiere-derniere image]
# Retour arrière : git checkout avant-optim (rendu PNG sans GPU, --image-format=png --concurrency=4).
set -euo pipefail
COMP=$1; OUT=$2; FRAMES=${3:-}
ROOT=/Users/ibrahimkamara/yt-animations; cd "$ROOT"
RAW=$(mktemp -d)/raw.mp4
node node_modules/@remotion/cli/remotion-cli.js render src/index.ts "$COMP" "$RAW" \
  ${FRAMES:+--frames=$FRAMES} \
  --codec=h264 --crf=12 --image-format=jpeg --jpeg-quality=95 --gl=angle --concurrency=3 --audio-bitrate=320k
J=$(ffmpeg -hide_banner -i "$RAW" -af loudnorm=I=-14:TP=-1:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
MI=$(echo "$J" | python3 -c "import json,sys;d=json.load(sys.stdin);print(f\"measured_I={d['input_i']}:measured_TP={d['input_tp']}:measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}:offset={d['target_offset']}\")")
ffmpeg -hide_banner -loglevel error -y -i "$RAW" -c:v copy -af "loudnorm=I=-14:TP=-1:LRA=11:${MI}:linear=true,aresample=48000" -c:a aac -b:a 320k "$OUT"
rm -f "$RAW"
echo "MASTER_OK $OUT"
