#!/bin/bash
# Test de rendu sur serveur loué : envoie le projet, rend, rapatrie, compare au rendu local.
# Usage : render_remote.sh <IP> <Composition> <premiere-derniere> <sortie_locale.mp4> [concurrency]
set -euo pipefail
IP=$1; COMP=$2; FRAMES=$3; OUT=$4; CONC=${5:-32}
KEY=~/.ssh/hetzner_remotion
SSH="ssh -i $KEY -o StrictHostKeyChecking=accept-new root@$IP"
ROOT=/Users/ibrahimkamara/yt-animations; cd "$ROOT"
now() { python3 -c "import time;print(time.time())"; }
t0=$(now)
# 1. Code (sans node_modules : réinstallé sous Linux) + seulement les médias utiles
rsync -az -e "ssh -i $KEY" --delete --exclude node_modules --exclude out --exclude public \
  src package.json package-lock.json tsconfig.json remotion.config.ts root@$IP:/root/rendu/
$SSH "mkdir -p /root/rendu/public/montage/aisa /root/rendu/public/epidemic"
rsync -az -e "ssh -i $KEY" \
  public/montage/aisa/face_full_dn.mp4 public/montage/aisa/screen_full.mp4 public/montage/aisa/voice_full.wav \
  public/montage/aisa/face_0-70_dn.mp4 public/montage/aisa/screen_125-150.mp4 public/montage/aisa/screen_655-700.mp4 \
  root@$IP:/root/rendu/public/montage/aisa/
rsync -az -e "ssh -i $KEY" public/epidemic/hq root@$IP:/root/rendu/public/epidemic/
t1=$(now)
$SSH -n "cd /root/rendu && [ -d node_modules/@remotion/cli ] || npm ci --silent --no-audit --no-fund >/dev/null 2>&1 || npm install --silent --no-audit --no-fund >/dev/null"
t2=$(now)
# 2. Rendu (pas de GPU sur ce serveur : rendu logiciel, beaucoup de cœurs)
$SSH -n "cd /root/rendu && rm -f raw.mp4 && node node_modules/@remotion/cli/remotion-cli.js render src/index.ts $COMP /root/rendu/raw.mp4 \
  --frames=$FRAMES --codec=h264 --crf=12 --image-format=jpeg --jpeg-quality=95 --concurrency=$CONC --audio-bitrate=320k --log=error < /dev/null > /root/rendu/render.log 2>&1; echo rc=\$?"
t3=$(now)
rsync -az -e "ssh -i $KEY" root@$IP:/root/rendu/raw.mp4 "$OUT"
t4=$(now)
python3 - <<PY
t=[$t0,$t1,$t2,$t3,$t4]
print(f"Envoi des fichiers : {t[1]-t[0]:6.0f} s")
print(f"Installation npm   : {t[2]-t[1]:6.0f} s")
print(f"RENDU              : {t[3]-t[2]:6.0f} s")
print(f"Rapatriement       : {t[4]-t[3]:6.0f} s")
PY
echo "REMOTE_OK $OUT"
