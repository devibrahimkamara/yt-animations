#!/bin/bash
set -e
cd /Users/ibrahimkamara/yt-animations

CLI="node /Users/ibrahimkamara/yt-animations/node_modules/@remotion/cli/remotion-cli.js"
OUT="out/pdfelement"
mkdir -p "$OUT"

IDS=(
  PdfelementAnim01ScanContratHook
  PdfelementAnim02LoupePetitsCaracteres
  PdfelementAnim03CourseIAVsManuel
  PdfelementAnim04UpgradeVersion13Badge
  PdfelementAnim05QuatreProfilsGrid
  PdfelementAnim06CarrouselContratsPerspective
  PdfelementAnim07BarreOutilsAllumage
  PdfelementAnim08RadarDetectionIA
  PdfelementAnim09DisclaimerAvocat
  PdfelementAnim10TransitionTutoriel
)

for id in "${IDS[@]}"; do
  echo "=== Rendering $id ==="
  $CLI render src/index.ts "$id" "$OUT/${id}.mp4" --codec=h264 2>&1 | tail -3
  echo ""
done

echo "=== ALL DONE ==="
ls -lh "$OUT/"
