#!/bin/bash
set -e
cd /Users/ibrahimkamara/yt-animations

CLI="node /Users/ibrahimkamara/yt-animations/node_modules/@remotion/cli/remotion-cli.js"
OUT="out/higgsOpus"
mkdir -p "$OUT"

IDS=(
  HiggsOpusAnim01PelliculeFilm
  HiggsOpusAnim02SchemaConnexionMCP
  HiggsOpusAnim03RoadmapEtapes
  HiggsOpusAnim04CalendrierSeptembre
  HiggsOpusAnim05BalanceCoutCredits
  HiggsOpusAnim06PromesseRealite
  HiggsOpusAnim07CtaAbonnementPouce
  HiggsOpusAnim08TransitionWipe
)

for id in "${IDS[@]}"; do
  echo "=== Rendering $id ==="
  $CLI render src/index.ts "$id" "$OUT/${id}.mp4" --codec=h264 2>&1 | tail -3
  echo ""
done

echo "=== ALL DONE ==="
ls -lh "$OUT/"
