#!/bin/bash
cd /Users/ibrahimkamara/yt-animations/analysis
# 2 vidéos en parallèle à la fois (CPU)
(tools/prepare.sh wtaRjOFqdyU martell-ai-full; tools/prepare.sh 8ujbxFtVzBM martell-habits) > ref/run_a.log 2>&1 &
(tools/prepare.sh TL8V41Ea6oM swadia-agents; tools/prepare.sh 08QmhuCd61U sanji-grandma) > ref/run_b.log 2>&1 &
wait; echo "ALL DONE" >> ref/progress.log
