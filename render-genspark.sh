#!/bin/bash
set -e
cd /Users/ibrahimkamara/yt-animations

CLI="node /Users/ibrahimkamara/yt-animations/node_modules/@remotion/cli/remotion-cli.js"
OUT="out/genspark"
mkdir -p "$OUT"

GS_IDS=(
  GenSparkAnim01SoftwareChaos
  GenSparkAnim02Convergence
  GenSparkAnim03Stats
  GenSparkAnim04Comparison
  GenSparkAnim05ChaosToClarity
  GenSparkAnim06KineticType
  GenSparkAnim07RoadmapTeaser
  GenSparkAnim08LowerThird
  GenSparkAnim09CTASubscribe
  GenSparkAnim10LogoReveal
  GenSparkAnim11RadialDiagram
  GenSparkAnim12Counter250M
  GenSparkAnim13ComparisonRace
  GenSparkAnim14ChapterCard
)

for id in "${GS_IDS[@]}"; do
  echo "=== Rendering $id ==="
  $CLI render src/index.ts "$id" "$OUT/${id}.mp4" --codec=h264 2>&1 | tail -3
  echo ""
done

echo "=== ALL DONE ==="
ls -lh "$OUT/"
