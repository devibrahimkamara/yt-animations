#!/bin/bash
set -e
cd /Users/ibrahimkamara/yt-animations

CLI="node /Users/ibrahimkamara/yt-animations/node_modules/@remotion/cli/remotion-cli.js"
OUT="out/atmos22"
mkdir -p "$OUT"

IDS=(
  Atmos22Anim01QuestionReecrite
  Atmos22Anim02AvalancheIdees
  Atmos22Anim03Prompt47Idees
  Atmos22Anim04Elimination47a1
  Atmos22Anim05TimelineDocumentee
  Atmos22Anim08TroisFaussesExcuses
  Atmos22Anim09ChargementBloque
  Atmos22Anim10DispersionFocus
  Atmos22Anim11RegleCompteRebours
)

for id in "${IDS[@]}"; do
  echo "=== Rendering $id ==="
  $CLI render src/index.ts "$id" "$OUT/${id}.mp4" --codec=h264 2>&1 | tail -3
done

# Fond transparent (incrustation sur la face cam)
for id in Atmos22Anim06LowerThirdAnnees Atmos22Anim07AbonneCinetique; do
  echo "=== Rendering $id (alpha) ==="
  $CLI render src/index.ts "$id" "$OUT/${id}.webm" \
    --codec=vp8 --pixel-format=yuva420p --image-format=png 2>&1 | tail -3
done

echo "=== ALL DONE ==="
ls -lh "$OUT/"
