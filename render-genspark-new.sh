#!/bin/bash
set -e
cd /Users/ibrahimkamara/yt-animations

CLI="node /Users/ibrahimkamara/yt-animations/node_modules/@remotion/cli/remotion-cli.js"
OUT="out/genspark"

for id in GenSparkAnim10LogoReveal GenSparkAnim11RadialDiagram GenSparkAnim12Counter250M GenSparkAnim13ComparisonRace; do
  echo "=== Rendering $id ==="
  $CLI render src/index.ts "$id" "$OUT/${id}.mp4" --codec=h264 2>&1 | tail -3
  echo ""
done

echo "=== DONE ==="
ls -lh "$OUT"/GenSparkAnim1{0,1,2,3}*.mp4
