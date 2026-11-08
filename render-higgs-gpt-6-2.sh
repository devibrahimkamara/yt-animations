#!/bin/bash
set -e
cd /Users/ibrahimkamara/yt-animations

CLI="node /Users/ibrahimkamara/yt-animations/node_modules/@remotion/cli/remotion-cli.js"
OUT="out/higgs-gpt-6-2"
mkdir -p "$OUT"

# 9 animations plein cadre → MP4 h264
IDS=(
  HiggsGpt2Anim01ChaineQuiSeConstruit
  HiggsGpt2Anim02ChaineProduction3Maillons
  HiggsGpt2Anim03CompteurEffortZero
  HiggsGpt2Anim04BarreProgressionChapitres
  HiggsGpt2Anim05CarteAbonnementFlip
  HiggsGpt2Anim06DeverrouillageModele
  HiggsGpt2Anim07ModuleClipse
  HiggsGpt2Anim08MosaiqueCapacites
  HiggsGpt2Anim09FlecheDescription
)

for id in "${IDS[@]}"; do
  echo "=== Rendering $id ==="
  $CLI render src/index.ts "$id" "$OUT/${id}.mp4" --codec=h264 2>&1 | tail -3
  echo ""
done

echo "=== ALL DONE ==="
ls -lh "$OUT/"
