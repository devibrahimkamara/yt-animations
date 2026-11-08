#!/bin/bash
set -e
cd /Users/ibrahimkamara/yt-animations

CLI="node /Users/ibrahimkamara/yt-animations/node_modules/@remotion/cli/remotion-cli.js"
OUT="out/higgs-blen"
mkdir -p "$OUT"

# 7 animations plein cadre → MP4 h264
IDS=(
  HiggsBlenAnim01MurRendus
  HiggsBlenAnim02FicheVide
  HiggsBlenAnim03ChaosRange
  HiggsBlenAnim04Odometre
  HiggsBlenAnim05Constellation
  HiggsBlenAnim06DeuxCourbes
  HiggsBlenAnim08BandeauUnivers
)

for id in "${IDS[@]}"; do
  echo "=== Rendering $id ==="
  $CLI render src/index.ts "$id" "$OUT/${id}.mp4" --codec=h264 2>&1 | tail -3
  echo ""
done

# Anim 07 — overlay posé sur la face-cam : WebM à fond transparent (canal alpha).
echo "=== Rendering HiggsBlenAnim07CarteIdentite (WebM transparent) ==="
$CLI render src/index.ts HiggsBlenAnim07CarteIdentite \
  "$OUT/HiggsBlenAnim07CarteIdentite.webm" \
  --codec=vp8 --pixel-format=yuva420p 2>&1 | tail -3
echo ""

echo "=== ALL DONE ==="
ls -lh "$OUT/"
