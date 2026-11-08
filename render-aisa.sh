#!/bin/bash
set -e
cd /Users/ibrahimkamara/yt-animations

CLI="node /Users/ibrahimkamara/yt-animations/node_modules/@remotion/cli/remotion-cli.js"
OUT="out/aisa"
mkdir -p "$OUT"

IDS=(
  AisaAnim01RapportFlip3D
  AisaAnim02OrbiteMoteursIA
  AisaAnim03ConversationRestaurants
  AisaAnim04SourcesVersNoyauIA
  AisaAnim05ClassementRemontee
  AisaAnim06GlobeUtilisateurs
  AisaAnim07RecherchesQuotidien
  AisaAnim08BalanceGoogleVsIA
  AisaAnim09SeoVersGeo
  AisaAnim10OceanBleu
  AisaAnim11TransitionStatistiques
)

for id in "${IDS[@]}"; do
  echo "=== Rendering $id ==="
  $CLI render src/index.ts "$id" "$OUT/${id}.mp4" --codec=h264 2>&1 | tail -3
done

echo "=== ALL DONE ==="
ls -lh "$OUT/"
