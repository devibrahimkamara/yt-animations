#!/bin/bash
# À exécuter UNE fois sur un serveur Ubuntu 24.04 neuf (Hetzner) : dépendances du rendu Remotion.
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
# Dépendances de Chrome Headless Shell (doc Remotion, Ubuntu 24.04)
apt-get install -y -qq libnss3 libdbus-1-3 libatk1.0-0 libasound2t64 libxrandr2 libxkbcommon-dev libxfixes3 \
  libxcomposite1 libxdamage1 libgbm-dev libcups2 libcairo2 libpango-1.0-0 libatk-bridge2.0-0 \
  ffmpeg python3 rsync curl ca-certificates
# Node.js 22 (même version majeure que le Mac)
curl -fsSL https://deb.nodesource.com/setup_22.x | bash - >/dev/null
apt-get install -y -qq nodejs
mkdir -p /root/rendu
echo "SETUP_OK $(node --version) $(nproc) cœurs $(free -g | awk '/Mem/{print $2}') Go"
