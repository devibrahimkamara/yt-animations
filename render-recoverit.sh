#!/bin/bash
set -e
cd /Users/ibrahimkamara/yt-animations

CLI="node /Users/ibrahimkamara/yt-animations/node_modules/@remotion/cli/remotion-cli.js"
OUT="out/recoverit"
mkdir -p "$OUT"

IDS=(
  RecoverItAnim01
  RecoverItAnim02
  RecoverItAnim03
  RecoverItAnim04
  RecoverItAnim05
  RecoverItAnim06
  RecoverItAnim07
  RecoverItAnim08
  RecoverItAnim09
  RecoverItAnim10
)

for id in "${IDS[@]}"; do
  echo "=== Rendering $id ==="
  $CLI render src/index.ts "$id" "$OUT/${id}.mp4" --codec=h264 2>&1 | tail -3
  echo ""
done

echo "=== ALL DONE ==="
ls -lh "$OUT/"
