#!/bin/bash
# Enchaîne le rendu distant de plusieurs blocs : <IP> <nom:premiere-derniere> ...
set -u
IP=$1; shift
ROOT=/Users/ibrahimkamara/yt-animations; cd "$ROOT"
TMP=$(mktemp -d)
for spec in "$@"; do
  name=${spec%%:*}; fr=${spec##*:}
  echo "== $name ($fr) $(date +%T)"
  analysis/cloud/render_remote.sh "$IP" MontageAisa "$fr" "$TMP/$name.mp4" 14 2>&1 | tail -6 || { echo "ECHEC $name"; continue; }
  J=$(ffmpeg -hide_banner -i "$TMP/$name.mp4" -af loudnorm=I=-14:TP=-1:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
  MI=$(echo "$J" | python3 -c "import json,sys;d=json.load(sys.stdin);print(f\"measured_I={d['input_i']}:measured_TP={d['input_tp']}:measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}:offset={d['target_offset']}\")")
  ffmpeg -hide_banner -loglevel error -y -i "$TMP/$name.mp4" -c:v copy -af "loudnorm=I=-14:TP=-1:LRA=11:${MI}:linear=true,aresample=48000" -c:a aac -b:a 320k "montages/aisa/06-blocs/$name.mp4" && echo "MASTER_OK $name $(date +%T)"
done
