#!/bin/bash
set -e
cd /Users/ibrahimkamara/yt-animations

CLI="node /Users/ibrahimkamara/yt-animations/node_modules/@remotion/cli/remotion-cli.js"
OUT="out/maxdrop"
mkdir -p "$OUT"

IDS=(
  MaxdropAnim01CompteurEchelle
  MaxdropAnim02Duel2018vs2025
  MaxdropAnim03EliminationSuspects
  MaxdropAnim04BoucleRachat
  MaxdropAnim05TroisSans
  MaxdropAnim06ConstructionBouteille
  MaxdropAnim07CourbeDecolle
  MaxdropAnim08CausesSobre
  MaxdropAnim09MurDevientFosse
  MaxdropAnim10MecaniqueMarqueBlanche
  MaxdropAnim11PartageDesTaches
  MaxdropAnim12ReseauMondial
  MaxdropAnim13Timeline10Jours
  MaxdropAnim14ChuteDuMOQ
  MaxdropAnim15LaboFormulation
  MaxdropAnim16CarrouselFormats
  MaxdropAnim17CTAFinal
)

for id in "${IDS[@]}"; do
  echo "=== Rendering $id ==="
  $CLI render src/index.ts "$id" "$OUT/${id}.mp4" --codec=h264 2>&1 | tail -3
  echo ""
done

echo "=== ALL DONE ==="
ls -lh "$OUT/"
