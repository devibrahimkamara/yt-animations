#!/bin/bash
set -e
cd /Users/ibrahimkamara/yt-animations

CLI="node /Users/ibrahimkamara/yt-animations/node_modules/@remotion/cli/remotion-cli.js"
OUT="out/higgs-after"
mkdir -p "$OUT"

# 9 animations plein cadre → MP4 h264
IDS=(
  HiggsAfterAnim01SplitEchec
  HiggsAfterAnim02EquationIAAE
  HiggsAfterAnim03DeuxPiliers
  HiggsAfterAnim04MosaiqueZoom
  HiggsAfterAnim05CourbeDifficulte
  HiggsAfterAnim06ChecklistFloutee
  HiggsAfterAnim07CarteAbonnementOdometre
  HiggsAfterAnim08MorphFenetre
  HiggsAfterAnim09SchemaConnexion
)

for id in "${IDS[@]}"; do
  echo "=== Rendering $id ==="
  $CLI render src/index.ts "$id" "$OUT/${id}.mp4" --codec=h264 2>&1 | tail -3
  echo ""
done

echo "=== ALL DONE ==="
ls -lh "$OUT/"
