#!/bin/bash
set -e
cd /Users/ibrahimkamara/yt-animations

CLI="node /Users/ibrahimkamara/yt-animations/node_modules/@remotion/cli/remotion-cli.js"
OUT="out/higgs"
mkdir -p "$OUT"

IDS=(
  HiggsAnim01DesintegrationPixels
  HiggsAnim02Compteur40Minutes
  HiggsAnim03RailAtoZ
  HiggsAnim04WipeDiagonal
  HiggsAnim05LigneTemps2020
  HiggsAnim06BarreAbonnement
  HiggsAnim07TuyauxRevenus
  HiggsAnim08MurDeVerre
  HiggsAnim09MasqueRevelateur
)

for id in "${IDS[@]}"; do
  echo "=== Rendering $id ==="
  $CLI render src/index.ts "$id" "$OUT/${id}.mp4" --codec=h264 2>&1 | tail -3
  echo ""
done

echo "=== ALL DONE ==="
ls -lh "$OUT/"
