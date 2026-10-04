#!/bin/bash
# Enchaîne toutes les variantes du banc d'essai (après la fin du rendu du bloc 1).
set -u
ROOT=/Users/ibrahimkamara/yt-animations; cd $ROOT
B=$ROOT/analysis/bench; mkdir -p $B
CLI="node node_modules/@remotion/cli/remotion-cli.js"
# 1. Tuile de grain exacte (rendue par Chrome à partir du même filtre SVG)
mkdir -p public/textures
$CLI still src/index.ts GrainTile public/textures/grain.png --image-format=png --log=error
# 2. Deux bundles : référence, et grain précalculé
$CLI bundle src/index.ts --out-dir $B/bundle_base --log=error
REMOTION_GRAIN_TEXTURE=1 $CLI bundle src/index.ts --out-dir $B/bundle_grain --log=error
echo "grain dans bundle_grain : $(grep -l 'textures/grain.png' $B/bundle_grain/*.js | wc -l) fichier(s)" | tee $B/notes.txt
T=analysis/tools/bench_render.sh
$T V0_base     $B/bundle_base  --image-format=png --concurrency=4
$T V1_jpeg     $B/bundle_base  --image-format=jpeg --jpeg-quality=95 --concurrency=4
$T V2_gl_angle $B/bundle_base  --image-format=png --concurrency=4 --gl=angle
$T V3_grain    $B/bundle_grain --image-format=png --concurrency=4
$T V4_combo    $B/bundle_grain --image-format=jpeg --jpeg-quality=95 --concurrency=4 --gl=angle
$T V5_combo_c3 $B/bundle_grain --image-format=jpeg --jpeg-quality=95 --concurrency=3 --gl=angle
$T V6_combo_c6 $B/bundle_grain --image-format=jpeg --jpeg-quality=95 --concurrency=6 --gl=angle
echo BENCH_FINI
