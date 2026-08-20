#!/bin/bash
set -e
cd /Users/ibrahimkamara/yt-animations

CLI="node /Users/ibrahimkamara/yt-animations/node_modules/@remotion/cli/remotion-cli.js"
mkdir -p out/atmos

ATMOS_IDS=(
  AtmosAnim01-HateScene
  AtmosAnim02-RevenueCounter
  AtmosAnim03-CredibilityTimeline
  AtmosAnim04-GeneralistTrap
  AtmosAnim05-NicheZoom
  AtmosAnim06-SageVsApp
  AtmosAnim07-NicheCards
  AtmosAnim08-AIBuilder
)

for id in "${ATMOS_IDS[@]}"; do
  echo "=== Rendering $id ==="
  $CLI render src/index.ts "$id" "out/atmos/${id}.mp4" --codec=h264 2>&1 | tail -3
  echo ""
done

echo "✅ Toutes les animations atmos rendues dans out/atmos/"
