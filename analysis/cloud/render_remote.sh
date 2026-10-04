#!/bin/bash
# Test de rendu sur serveur loué : envoie le projet, rend, rapatrie, compare au rendu local.
# Usage : SLUG=<slug> [PREVIEW=1] render_remote.sh <IP> <Composition> <premiere-derniere> <sortie_locale.mp4> [concurrency]
set -euo pipefail
IP=$1; COMP=$2; FRAMES=$3; OUT=$4; CONC=${5:-32}
KEY=~/.ssh/hetzner_remotion
SSH="ssh -i $KEY -o StrictHostKeyChecking=accept-new -o ServerAliveInterval=30 -o ServerAliveCountMax=4 root@$IP"
ROOT=/Users/ibrahimkamara/yt-animations; cd "$ROOT"
now() { python3 -c "import time;print(time.time())"; }
t0=$(now)
# 1. Code + médias de la vidéo (SLUG=<slug>, défaut aisa), npm si besoin
"$(dirname "$0")/sync.sh" "$IP" "${SLUG:-aisa}" >/dev/null
t1=$(now)
$SSH -n "cd /root/rendu && [ -d node_modules/@remotion/cli ] || npm ci --silent --no-audit --no-fund >/dev/null 2>&1 || npm install --silent --no-audit --no-fund >/dev/null"
t2=$(now)
# 2. Rendu (pas de GPU sur ce serveur : rendu logiciel, beaucoup de cœurs)
# Rendu détaché sur le serveur (aucune connexion SSH ouverte pendant le rendu), puis attente du marqueur DONE
$SSH -n "cd /root/rendu && rm -f raw.mp4 DONE && setsid nohup bash -c 'node node_modules/@remotion/cli/remotion-cli.js render src/index.ts $COMP /root/rendu/raw.mp4 --frames=$FRAMES --codec=h264 --crf=12 --image-format=jpeg --jpeg-quality=95 --concurrency=$CONC --audio-bitrate=320k --log=error > /root/rendu/render.log 2>&1; echo \$? > /root/rendu/DONE' > /dev/null 2>&1 < /dev/null &"
until $SSH -n -o ConnectTimeout=15 "test -f /root/rendu/DONE" 2>/dev/null; do sleep 15; done
echo "rc distant : $($SSH -n cat /root/rendu/DONE)"
t3=$(now)
# Le brut (CRF 12) reste sur le serveur pour l'assemblage : /root/rendu/blocs/<nom>_raw.mp4
NAME=$(basename "$OUT" .mp4)
$SSH -n "mkdir -p /root/rendu/blocs && cp /root/rendu/raw.mp4 /root/rendu/blocs/${NAME}_raw.mp4"
if [ "${PREVIEW:-0}" = "1" ]; then
  # Aperçu à valider : compressé sur le serveur (≈ 3× plus léger à rapatrier)
  $SSH -n "ffmpeg -v error -y -i /root/rendu/raw.mp4 -c:v libx264 -crf 21 -preset veryfast -c:a aac -b:a 256k /root/rendu/preview.mp4"
  rsync -az -e "ssh -i $KEY" root@$IP:/root/rendu/preview.mp4 "$OUT"
else
  rsync -az -e "ssh -i $KEY" root@$IP:/root/rendu/raw.mp4 "$OUT"
fi
t4=$(now)
python3 - <<PY
t=[$t0,$t1,$t2,$t3,$t4]
print(f"Envoi des fichiers : {t[1]-t[0]:6.0f} s")
print(f"Installation npm   : {t[2]-t[1]:6.0f} s")
print(f"RENDU              : {t[3]-t[2]:6.0f} s")
print(f"Rapatriement       : {t[4]-t[3]:6.0f} s")
PY
echo "REMOTE_OK $OUT"
