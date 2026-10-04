#!/bin/bash
# Envoie au serveur le code + les médias d'une vidéo (rsync : seuls les fichiers modifiés partent).
# Usage : sync.sh <IP> <slug>   (ex. sync.sh 204.168.149.62 hostinger)
set -euo pipefail
IP=$1; SLUG=$2
KEY=~/.ssh/hetzner_remotion
SSH="ssh -i $KEY -o StrictHostKeyChecking=accept-new -o ServerAliveInterval=30 root@$IP"
cd /Users/ibrahimkamara/yt-animations
rsync -az -e "ssh -i $KEY" --delete --exclude node_modules --exclude out --exclude public \
  src package.json package-lock.json tsconfig.json remotion.config.ts root@$IP:/root/rendu/
$SSH -n "mkdir -p /root/rendu/public/montage /root/rendu/public/epidemic"
rsync -az -e "ssh -i $KEY" public/montage/$SLUG root@$IP:/root/rendu/public/montage/
rsync -az -e "ssh -i $KEY" --exclude mix public/epidemic/hq public/epidemic/$SLUG root@$IP:/root/rendu/public/epidemic/ 2>/dev/null || \
  rsync -az -e "ssh -i $KEY" public/epidemic/hq root@$IP:/root/rendu/public/epidemic/
$SSH -n "cd /root/rendu && [ -d node_modules/@remotion/cli ] || npm ci --silent --no-audit --no-fund >/dev/null 2>&1 || npm install --silent --no-audit --no-fund >/dev/null"
echo SYNC_OK
