#!/bin/bash
# Rendu complet sur le serveur, master −14 LUFS en ×1,00 et ×1,10 sur le serveur, rapatriement des deux versions.
set -euo pipefail
IP=204.168.164.197; KEY=~/.ssh/hetzner_remotion; SSH="ssh -i $KEY -o ServerAliveInterval=30 root@$IP"
cd /Users/ibrahimkamara/yt-animations
analysis/cloud/sync.sh $IP minimax >/dev/null
$SSH -n "cd /root/rendu && rm -f raw.mp4 DONE && setsid nohup bash -c 'node node_modules/@remotion/cli/remotion-cli.js render src/index.ts MontageMinimaxFull /root/rendu/raw.mp4 --codec=h264 --crf=14 --image-format=jpeg --jpeg-quality=95 --concurrency=16 --audio-bitrate=320k --log=error > /root/rendu/render.log 2>&1; echo \$? > /root/rendu/DONE' > /dev/null 2>&1 < /dev/null &"
until $SSH -n -o ConnectTimeout=15 "test -f /root/rendu/DONE" 2>/dev/null; do sleep 30; done
echo "rendu rc=$($SSH -n cat /root/rendu/DONE)"
rsync -az -e "ssh -i $KEY" montages/minimax/05-hook/master.py root@$IP:/root/rendu/
$SSH -n "cd /root/rendu && python3 master.py raw.mp4 MiniMax_montage_final"
rsync -az -e "ssh -i $KEY" "root@$IP:/root/rendu/MiniMax_montage_final_x1.*.mp4" montages/minimax/07-final/
echo FULL_OK
