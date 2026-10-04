#!/bin/bash
# Images de contrôle rendues sur le serveur : 1 bundle, puis toutes les images en parallèle.
# Usage : stills_remote.sh <IP> <slug> <Composition> <dossier_local> <t1> <t2> …   (t en secondes)
set -euo pipefail
IP=$1; SLUG=$2; COMP=$3; OUT=$4; shift 4
KEY=~/.ssh/hetzner_remotion
SSH="ssh -i $KEY -o ServerAliveInterval=30 root@$IP"
"$(dirname "$0")/sync.sh" "$IP" "$SLUG" >/dev/null
LIST=$(for t in "$@"; do echo -n "$t:$(python3 -c "print(round($t*30))") "; done)
$SSH -n "cd /root/rendu && rm -rf stills && mkdir stills && node node_modules/@remotion/cli/remotion-cli.js bundle src/index.ts --out-dir=/root/rendu/bundle --log=error >/dev/null && \
  for p in $LIST; do echo \$p; done | xargs -P 8 -I{} bash -c 'p={}; t=\${p%%:*}; fr=\${p##*:}; node node_modules/@remotion/cli/remotion-cli.js still /root/rendu/bundle $COMP stills/t\$t.jpg --frame=\$fr --image-format=jpeg --log=error >/dev/null 2>stills/err_\$t.txt || echo FAIL \$t'"
mkdir -p "$OUT"
rsync -az -e "ssh -i $KEY" "root@$IP:/root/rendu/stills/" "$OUT/"
find "$OUT" -name 'err_*' -empty -delete
echo STILLS_OK
