#!/bin/bash
set -e
cd /Users/ibrahimkamara/yt-animations

CLI="node /Users/ibrahimkamara/yt-animations/node_modules/@remotion/cli/remotion-cli.js"
OUT="out/higgsMarketing"
mkdir -p "$OUT"

IDS=(
  HiggsMarketingAnim01EtiquettePrix
  HiggsMarketingAnim02CourbeSaison
  HiggsMarketingAnim03CircuitArgent
  HiggsMarketingAnim04MurOffres
  HiggsMarketingAnim05MachinePrenoms
  HiggsMarketingAnim06ImplosionOutils
  HiggsMarketingAnim07TerminalWhoami
  HiggsMarketingAnim08BoutonPhysique
  HiggsMarketingAnim09CadenasModele
  HiggsMarketingAnim10BalanceRentabilite
)

for id in "${IDS[@]}"; do
  echo "=== Rendering $id ==="
  $CLI render src/index.ts "$id" "$OUT/${id}.mp4" --codec=h264 2>&1 | tail -3
  echo ""
done

echo "=== ALL DONE ==="
ls -lh "$OUT/"
