#!/bin/bash
# Étape 1 (Higgs Kling 4.0) : envoi au serveur, transcription Whisper mot à mot, détection de la lecture du script (gaze.py),
# puis rapatriement. Lancé en arrière-plan depuis le Mac (règle §13.3 : script bash dans un fichier).
set -euo pipefail
IP=65.108.151.88
KEY=~/.ssh/hetzner_remotion
SSH="ssh -i $KEY -o ServerAliveInterval=30 -o BatchMode=yes root@$IP"
D=/Users/ibrahimkamara/yt-animations/montages/higgs-kling4/01-analyse
SRC="/Users/ibrahimkamara/Downloads/Higgsfield Kling Footage.mp4"
cd "$D"
[ -f voix16k.wav ] || ffmpeg -v error -y -i "$SRC" -vn -ac 1 -ar 16000 -c:a pcm_s16le voix16k.wav
$SSH -n "mkdir -p /root/kling4"
# Connexion lente (Airbnb, ~0,3 Mbit/s) : on envoie des versions légères (voix Opus 24 kb/s, face 640×360 à 5 i/s).
[ -f voix.opus ] || ffmpeg -v error -y -i voix16k.wav -c:a libopus -b:a 24k voix.opus
[ -f face_proxy.mp4 ] || ffmpeg -v error -y -i "$SRC" -an -vf "fps=5,scale=640:360" -c:v libx264 -preset veryfast -crf 30 face_proxy.mp4
rsync -a --partial -e "ssh -i $KEY" voix.opus face_proxy.mp4 root@$IP:/root/kling4/
$SSH -n "cd /root/kling4 && ffmpeg -v error -y -i voix.opus -ac 1 -ar 16000 -c:a pcm_s16le voix16k.wav && /root/venv/bin/python /root/fw.py large-v3 voix16k.wav micro.json > fw.log 2>&1"
$SSH -n "cd /root/kling4 && /root/venv/bin/python /root/derush/gaze.py face_proxy.mp4 gaze.json 5 > gaze.log 2>&1"
scp -q -i $KEY root@$IP:/root/kling4/micro.json root@$IP:/root/kling4/gaze.json root@$IP:/root/kling4/fw.log root@$IP:/root/kling4/gaze.log "$D/"
echo ANALYSE_OK
