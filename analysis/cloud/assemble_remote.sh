#!/bin/bash
# Assemblage final sur le serveur (étape 7) : blocs bruts mis bout à bout sans réencodage,
# bande son reconstruite depuis l'audio brut de chaque bloc (amorce AAC de 2048 échantillons retirée,
# longueur calée à l'échantillon près), master −14 LUFS en 2 passes, puis version accélérée SPEED (défaut 1.10, PLAYBOOK §6bis).
# Usage : assemble_remote.sh <IP> <NomFinal> <dossier_local> bloc_raw.mp4:nb_images …
#   (fichiers dans /root/rendu/blocs/ sur le serveur, dans l'ordre de la timeline)
set -euo pipefail
IP=$1; NAME=$2; LOCAL=$3; shift 3
KEY=~/.ssh/hetzner_remotion
SSH="ssh -i $KEY -o ServerAliveInterval=30 root@$IP"
SPECS="$*"
scp -q -i $KEY "$(dirname "$0")/assemble_server_side.sh" root@$IP:/root/rendu/assemble_server_side.sh
SPEED=${SPEED:-1.10}
$SSH -n "SPEED=$SPEED bash /root/rendu/assemble_server_side.sh $NAME $SPECS"
mkdir -p "$LOCAL"
for v in "${NAME}.mp4" "${NAME}_x${SPEED}.mp4"; do rsync -az -e "ssh -i $KEY" "root@$IP:/root/rendu/blocs/final/$v" "$LOCAL/"; done  # rsync 2.6.9 : une source distante à la fois
echo "ASSEMBLAGE_OK $LOCAL"
