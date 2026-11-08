#!/bin/bash
set -e
cd /Users/ibrahimkamara/yt-animations

CLI="node /Users/ibrahimkamara/yt-animations/node_modules/@remotion/cli/remotion-cli.js"
OUT="out/higgs-gpt"
mkdir -p "$OUT"

# 8 animations plein cadre → MP4 h264
IDS=(
  HiggsGptAnim01Rembobinage
  HiggsGptAnim02EquationIncomplete
  HiggsGptAnim03TroisVerrous
  HiggsGptAnim04RampeDates
  HiggsGptAnim05MurSuperlatifs
  HiggsGptAnim06CarteAbonnement
  HiggsGptAnim07BazookaCrepe
  HiggsGptAnim08PlafondVerre
)

for id in "${IDS[@]}"; do
  echo "=== Rendering $id ==="
  $CLI render src/index.ts "$id" "$OUT/${id}.mp4" --codec=h264 2>&1 | tail -3
  echo ""
done

echo "=== ALL DONE ==="
ls -lh "$OUT/"
