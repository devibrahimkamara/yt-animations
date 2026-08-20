#!/bin/bash
set -e
cd /Users/ibrahimkamara/yt-animations

CLI="node /Users/ibrahimkamara/yt-animations/node_modules/@remotion/cli/remotion-cli.js"
OUT="out/higgsfield"
mkdir -p "$OUT"

IDS=(
  HighsfieldAnim01MoneyCounter
  HighsfieldAnim02UpworkAvatars
  HighsfieldAnim03Timeline
  HighsfieldAnim04Dissolution
  HighsfieldAnim05SplitScreen
  HighsfieldAnim06DesignersList
  HighsfieldAnim07StampBadge
  HighsfieldAnim08CostCurve
)

for id in "${IDS[@]}"; do
  echo "=== Rendering $id ==="
  $CLI render src/index.ts "$id" "$OUT/${id}.mp4" --codec=h264 2>&1 | tail -3
  echo ""
done

echo "=== ALL DONE ==="
ls -lh "$OUT/"
