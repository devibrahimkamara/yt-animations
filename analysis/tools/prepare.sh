#!/bin/bash
# Prépare une vidéo YouTube de référence pour l'analyse :
#   téléchargement, sous-titres horodatés, stems audio (Demucs), mesures image (OpenCV),
#   événements audio (librosa), planches 1 img/s, résumé digest.md.
# Usage : prepare.sh <youtube_id> <slug>
set -e
ID="$1"; SLUG="$2"
ROOT=/Users/ibrahimkamara/yt-animations/analysis
PY=$ROOT/.venv/bin/python
D=$ROOT/ref/$SLUG
mkdir -p "$D/sheets"; cd "$D"
log(){ echo "[$(date +%H:%M:%S)] $SLUG: $*" | tee -a "$ROOT/ref/progress.log"; }

[ -f src.mp4 ] || { log "téléchargement"; yt-dlp -q -f "bv*[height<=1080][ext=mp4]+ba[ext=m4a]/b[height<=1080]" --merge-output-format mp4 -o "src.%(ext)s" "https://www.youtube.com/watch?v=$ID"; }
[ -f subs.en.json3 ] || yt-dlp -q --skip-download --write-auto-subs --write-subs --sub-langs "en.*,en" --sub-format json3 -o "subs" "https://www.youtube.com/watch?v=$ID" || true
ls subs*.json3 >/dev/null 2>&1 && [ ! -f subs.en.json3 ] && mv "$(ls subs*.json3 | head -1)" subs.en.json3 || true
[ -f audio.wav ] || ffmpeg -v error -y -i src.mp4 -vn -ac 1 -ar 44100 audio.wav

[ -f sheets/s_001.jpg ] || { log "planches 1 img/s"; ffmpeg -v error -y -i src.mp4 -filter_script:v "$ROOT/tools/sheet_filter.txt" sheets/s_%03d.jpg; }
[ -f shots.json ] || { log "analyse image (toutes les frames)"; $PY "$ROOT/tools/visual_analyze.py" src.mp4 shots.json; }
[ -f sep/htdemucs/audio/no_vocals.wav ] || { log "séparation voix/musique (Demucs)"; python3 -m demucs --two-stems=vocals -n htdemucs -o sep audio.wav > demucs.log 2>&1; }
[ -f audio_events.json ] || { log "analyse audio"; $PY "$ROOT/tools/audio_analyze.py" sep/htdemucs/audio/vocals.wav sep/htdemucs/audio/no_vocals.wav audio_events.json 2>&1 | grep -v Warn; }
if [ ! -f subs.en.json3 ] && [ ! -f audio.json ]; then log "pas de sous-titres → Whisper"; whisper audio.wav --model small --language en --word_timestamps True --output_format json --output_dir . > whisper.log 2>&1; fi
$PY "$ROOT/tools/digest.py" "$D"
log "TERMINÉ ($(ls sheets | wc -l | tr -d ' ') planches)"
