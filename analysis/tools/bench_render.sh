#!/bin/bash
# Banc d'essai du rendu Remotion (optimisation, 4 octobre 2026).
# Rend 3 extraits représentatifs de MontageAisa (4 s chacun) avec un jeu d'options,
# mesure le temps, puis compare l'image à la référence (SSIM / PSNR).
# Usage : bench_render.sh <nom_variante> <dossier_bundle> [options CLI remotion...]
set -u
NAME=$1; BUNDLE=$2; shift 2
ROOT=/Users/ibrahimkamara/yt-animations
OUT=$ROOT/analysis/bench/$NAME
mkdir -p "$OUT"
# lourd = phrase-thèse sur face cam floutée (prototype) · ecran = Bing + médaillon + chiffre héros · visage = face cam + icônes
SEGS="lourd:1530-1649 ecran:4260-4379 visage:2310-2429"
cd "$ROOT"
total=0
for s in $SEGS; do
  seg=${s%%:*}; fr=${s##*:}
  t0=$(python3 -c "import time;print(time.time())")
  node node_modules/@remotion/cli/remotion-cli.js render "$BUNDLE" MontageAisa "$OUT/$seg.mp4" --frames="$fr" --codec=h264 --crf=12 --muted --log=error "$@" > "$OUT/$seg.log" 2>&1
  rc=$?
  t1=$(python3 -c "import time;print(time.time())")
  dt=$(python3 -c "print(round($t1-$t0,1))")
  total=$(python3 -c "print(round($total+$dt,1))")
  q=""
  REF=$ROOT/analysis/bench/V0_base/$seg.mp4
  if [ "$NAME" != "V0_base" ] && [ -f "$REF" ] && [ $rc -eq 0 ]; then
    ssim=$(ffmpeg -hide_banner -i "$OUT/$seg.mp4" -i "$REF" -lavfi ssim -f null - 2>&1 | grep -oE "All:[0-9.]+" | cut -d: -f2)
    psnr=$(ffmpeg -hide_banner -i "$OUT/$seg.mp4" -i "$REF" -lavfi psnr -f null - 2>&1 | grep -oE "average:[0-9.inf]+" | cut -d: -f2)
    q="ssim=$ssim psnr=${psnr}dB"
  fi
  echo "$NAME $seg rc=$rc ${dt}s $(python3 -c "print(round(120/$dt,2))") img/s $q" | tee -a "$OUT/result.txt"
done
echo "$NAME TOTAL ${total}s (360 images)" | tee -a "$OUT/result.txt"
