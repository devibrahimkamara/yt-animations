#!/bin/bash
set -e
cd /Users/ibrahimkamara/yt-animations

CLI="node /Users/ibrahimkamara/yt-animations/node_modules/@remotion/cli/remotion-cli.js"

VERD_IDS=(
  VerdAnim02-LevelUp
  VerdAnim03-Autopilot
  VerdAnim04-Timeline
  VerdAnim05-ChatGPTHistory
  VerdAnim06-Comparison
  VerdAnim07-OrgChart
  VerdAnim08-LegoBlocks
  VerdAnim09-MysteryVault
  VerdAnim10-VideoWall
  VerdAnim11-YoutubeWorkflow
  VerdAnim12-DecisionTree
  VerdAnim13-MoneyFlow
  VerdAnim14-ManualWork
  VerdAnim15-SaaSMockup
  VerdAnim16-MoneyCounter
  VerdAnim17-AIRobot
  VerdAnim18-WorldMap
  VerdAnim19-Gmail
  VerdAnim20-EmailBlast
  VerdAnim21-Inbox
  VerdAnim22-ManualApproval
  VerdAnim23-FullWorkflow
  VerdAnim24-DoubleGraph
  VerdAnim25-BlurredReveal
  VerdAnim26-StepsChecklist
)

for id in "${VERD_IDS[@]}"; do
  echo "=== Rendering $id ==="
  $CLI render src/index.ts "$id" "out/verd/${id}.mp4" --codec=h264 2>&1 | tail -2
  echo ""
done

echo "=== ALL DONE ==="
ls -lh out/verd/
