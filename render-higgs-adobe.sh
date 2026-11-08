#!/bin/bash
set -e
cd /Users/ibrahimkamara/yt-animations

CLI="node /Users/ibrahimkamara/yt-animations/node_modules/@remotion/cli/remotion-cli.js"
OUT="out/higgs-adobe"
mkdir -p "$OUT"

IDS=(
  HiggsAdobeAnim01Courbe3Ans
  HiggsAdobeAnim02QuestionsConvergent
  HiggsAdobeAnim03TimelineRemplissage
  HiggsAdobeAnim04MosaiqueScan
  HiggsAdobeAnim05Cassure
  HiggsAdobeAnim06AvantMaintenant
  HiggsAdobeAnim07DeuxProfils
  HiggsAdobeAnim08BarreProgression
  HiggsAdobeAnim09StackAssemblage
  HiggsAdobeAnim10TamponReference
)

for id in "${IDS[@]}"; do
  echo "=== Rendering $id ==="
  $CLI render src/index.ts "$id" "$OUT/${id}.mp4" --codec=h264 2>&1 | tail -3
  echo ""
done

echo "=== ALL DONE ==="
ls -lh "$OUT/"
