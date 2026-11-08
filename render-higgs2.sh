#!/bin/bash
set -e
cd /Users/ibrahimkamara/yt-animations

CLI="node /Users/ibrahimkamara/yt-animations/node_modules/@remotion/cli/remotion-cli.js"
OUT="out/higgs2"
mkdir -p "$OUT"

IDS=(
  Higgs2Anim01FriseVieChaine
  Higgs2Anim02ChaineProductionIA
  Higgs2Anim03Split2020vs2026
  Higgs2Anim04CTAAbonnementCompteur
  Higgs2Anim05PodiumPlateformes
  Higgs2Anim06AnatomieRevenuPub
  Higgs2Anim07PaliersRevenus
  Higgs2Anim08DissolutionVisage
  Higgs2Anim09CerveauEtMembres
  Higgs2Anim10ClaudeVsChatGPT
)

for id in "${IDS[@]}"; do
  echo "=== Rendering $id ==="
  $CLI render src/index.ts "$id" "$OUT/${id}.mp4" --codec=h264 2>&1 | tail -3
  echo ""
done

echo "=== ALL DONE ==="
ls -lh "$OUT/"
