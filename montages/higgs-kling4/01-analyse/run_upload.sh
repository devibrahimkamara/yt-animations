#!/bin/bash
# Envoi des rushes en pleine qualité (connexion du coworking).
set -euo pipefail
IP=5.223.66.26
KEY=~/.ssh/hetzner_remotion
rsync -a --partial -e "ssh -i $KEY -o ServerAliveInterval=15 -o ServerAliveCountMax=4" "/Users/ibrahimkamara/Downloads/Higgsfield Kling Footage.mp4" root@$IP:/root/kling4/face_full.mp4
rsync -a --partial -e "ssh -i $KEY -o ServerAliveInterval=15 -o ServerAliveCountMax=4" "/Users/ibrahimkamara/Downloads/Higgsfield Kling Screen Record.mp4" root@$IP:/root/kling4/screen_full.mp4
echo UPLOAD_OK
