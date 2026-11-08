#!/bin/bash
set -e
cd /Users/ibrahimkamara/yt-animations

CLI="node /Users/ibrahimkamara/yt-animations/node_modules/@remotion/cli/remotion-cli.js"
OUT="out/higgs-api"
mkdir -p "$OUT"

IDS=(
  HiggsApiAnim01PlanArchitecte
  HiggsApiAnim02ProliferationLogiciels
  HiggsApiAnim03ReleveBancaire
  HiggsApiAnim04BalayageProfils
  HiggsApiAnim05BasculePrix
  HiggsApiAnim06DeuxEmplacements
  HiggsApiAnim07MurGeneration
  HiggsApiAnim08OutilBrique
  HiggsApiAnim09TuyauAPI
)

for id in "${IDS[@]}"; do
  echo "=== Rendering $id ==="
  $CLI render src/index.ts "$id" "$OUT/${id}.mp4" --codec=h264 2>&1 | tail -3
  echo ""
done

echo "=== ALL DONE ==="
ls -lh "$OUT/"
