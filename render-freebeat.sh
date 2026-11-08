#!/bin/bash
set -e
cd /Users/ibrahimkamara/yt-animations

CLI="node /Users/ibrahimkamara/yt-animations/node_modules/@remotion/cli/remotion-cli.js"
OUT="out/freebeat"
mkdir -p "$OUT"

IDS=(
  FreebeatAnim01MasqueTypo2026
  FreebeatAnim02OdometreTarif
  FreebeatAnim03RechercheVide
  FreebeatAnim04DelugeSorties
  FreebeatAnim05MurBudget
  FreebeatAnim06ChaineProduction
  FreebeatAnim07WipeAvantApres
)

for id in "${IDS[@]}"; do
  echo "=== Rendering $id ==="
  $CLI render src/index.ts "$id" "$OUT/${id}.mp4" --codec=h264 2>&1 | tail -3
  echo ""
done

echo "=== ALL DONE ==="
ls -lh "$OUT/"
