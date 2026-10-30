#!/bin/bash
# Suite de l'étape 1 : détection du regard (sur la face réduite) + rapatriement, puis envoi des rushes en pleine qualité.
set -euo pipefail
IP=65.108.151.88
KEY=~/.ssh/hetzner_remotion
SSH="ssh -i $KEY -o ServerAliveInterval=30 -o BatchMode=yes root@$IP"
D=/Users/ibrahimkamara/yt-animations/montages/higgs-kling4/01-analyse
$SSH -n "cd /root/kling4 && /root/venv/bin/python /root/derush/gaze.py face_proxy.mp4 gaze.json 5 > gaze.log 2>&1"
scp -q -i $KEY root@$IP:/root/kling4/micro.json root@$IP:/root/kling4/gaze.json root@$IP:/root/kling4/fw.log root@$IP:/root/kling4/gaze.log "$D/"
echo ANALYSE_OK
rsync -a --partial -e "ssh -i $KEY" "/Users/ibrahimkamara/Downloads/Higgsfield Kling Footage.mp4" root@$IP:/root/kling4/face_full.mp4
rsync -a --partial -e "ssh -i $KEY" "/Users/ibrahimkamara/Downloads/Higgsfield Kling Screen Record.mp4" root@$IP:/root/kling4/screen_full.mp4
echo UPLOAD_OK
