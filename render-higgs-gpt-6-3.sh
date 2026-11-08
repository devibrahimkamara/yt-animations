#!/bin/bash
set -e
cd /Users/ibrahimkamara/yt-animations

CLI="node /Users/ibrahimkamara/yt-animations/node_modules/@remotion/cli/remotion-cli.js"
OUT="out/higgs-gpt-6-3"
mkdir -p "$OUT"

# 7 animations plein cadre → MP4 h264
IDS=(
  HiggsGpt3Anim01ScanMetadonnees
  HiggsGpt3Anim02RailAZ
  HiggsGpt3Anim03DoubleColonneBudget
  HiggsGpt3Anim04CarteIdentite
  HiggsGpt3Anim05MosaiqueMiniatures
  HiggsGpt3Anim06JaugeAbonnement
  HiggsGpt3Anim07AssemblagePipeline
)

for id in "${IDS[@]}"; do
  echo "=== Rendering $id ==="
  $CLI render src/index.ts "$id" "$OUT/${id}.mp4" --codec=h264 2>&1 | tail -3
  echo ""
done

echo "=== ALL DONE ==="
ls -lh "$OUT/"
