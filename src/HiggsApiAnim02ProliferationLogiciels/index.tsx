import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsApi/Stage";
import { IconSparkle } from "../higgsApi/icons";
import { INK, FONT, atmosPanelBorder, ATMOS_SPRING_POP } from "../higgsApi/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});

// Anim 2 — « La prolifération des logiciels » (210 frames / 7 s @ 30 fps)
// Phase 1 (0-15)    : tuile unique au centre, compteur "2020"
// Phase 2 (15-135)  : 4 vagues de duplication en cascade, stagger décroissant
// Phase 3 (135-180) : saturation, respiration d'opacité + vignettage
// Phase 4 (180-210) : fondu de sortie (Stage)

export const higgsApiAnim02Schema = z.object({});
export type HiggsApiAnim02Props = z.infer<typeof higgsApiAnim02Schema>;

const COLS = 8;
const ROWS = 5;
const TILE = 90;
const GAP = 16;
const GRID_W = COLS * TILE + (COLS - 1) * GAP;
const GRID_H = ROWS * TILE + (ROWS - 1) * GAP;
const ORIGIN_X = (1920 - GRID_W) / 2;
const ORIGIN_Y = (1080 - GRID_H) / 2 - 40;

const CENTER_COL = 3.5;
const CENTER_ROW = 2;

const ACCENT_POOL = ["#3060ff", "#22c55e", "#ef4444", "#FFD700", "#C77DFF", "#FF9F5A", "#4ECDC4", "#FF5E9E"];

type Slot = { col: number; row: number; dist: number; wave: number };

const slots: Slot[] = [];
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const dist = Math.hypot(c - CENTER_COL, r - CENTER_ROW);
    slots.push({ col: c, row: r, dist, wave: 0 });
  }
}
slots.sort((a, b) => a.dist - b.dist);
// Vagues cumulatives : 1, 4, 12, 24, 40
const waveCounts = [1, 4, 12, 24, 40];
slots.forEach((s, i) => {
  const idx = i + 1;
  s.wave = waveCounts.findIndex((c) => idx <= c);
});

// Frame ranges par vague, avec stagger qui se resserre
const waveRanges = [
  { start: 0, end: 15 }, // vague 0 : tuile unique
  { start: 15, end: 35 }, // vague 1 : 1→4
  { start: 35, end: 60 }, // vague 2 : 4→12
  { start: 60, end: 90 }, // vague 3 : 12→24
  { start: 90, end: 135 }, // vague 4 : 24→40
];
const waveStagger = [0, 3.5, 2.5, 1.5, 1];

// Le stagger « brut » (issu du brief) donne la forme de l'accélération ;
// on l'étire ensuite pour que la dernière tuile de chaque vague arrive
// juste avant la fin de la fenêtre qui lui est allouée (au lieu de finir
// la vague en avance et de laisser un temps mort avant la suivante).
const spawnFrames: number[] = new Array(40);
const waveMembers: number[][] = [[], [], [], [], []];
slots.forEach((s, i) => waveMembers[s.wave].push(i));
waveMembers.forEach((members, wave) => {
  const { start, end } = waveRanges[wave];
  const duration = end - start;
  const lastRawOffset = (members.length - 1) * waveStagger[wave];
  const margin = 5; // dernière tuile arrive un peu avant la fin de la fenêtre
  const scale = lastRawOffset > 0 ? (duration - margin) / lastRawOffset : 1;
  members.forEach((slotIdx, order) => {
    spawnFrames[slotIdx] = start + order * waveStagger[wave] * scale;
  });
});

const yearForFrame = (frame: number) => {
  if (frame < 15) return "2020";
  if (frame < 35) return "2021";
  if (frame < 60) return "2022";
  if (frame < 75) return "2023";
  if (frame < 90) return "2024";
  if (frame < 135) return "2025";
  return "2026";
};

const seededRotation = (index: number) => ((index * 37) % 17) - 8;

const LogoTile: React.FC<{ slot: Slot; index: number; spawnFrame: number; frame: number; fps: number }> = ({
  slot,
  index,
  spawnFrame,
  frame,
  fps,
}) => {
  if (frame < spawnFrame) return null;
  const s = spring({ frame: frame - spawnFrame, fps, config: ATMOS_SPRING_POP });
  const scale = interpolate(s, [0, 1], [0, 1]);
  const rotation = interpolate(s, [0, 1], [seededRotation(index), 0]);
  const breatheOffset = (index * 13) % 40;
  const breathe =
    frame >= 135
      ? interpolate(Math.sin(((frame - 135 + breatheOffset) / 40) * Math.PI * 2), [-1, 1], [0.85, 1])
      : 1;
  const color = ACCENT_POOL[index % ACCENT_POOL.length];
  const x = ORIGIN_X + slot.col * (TILE + GAP);
  const y = ORIGIN_Y + slot.row * (TILE + GAP);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: TILE,
        height: TILE,
        borderRadius: 12,
        background: "rgba(15,22,55,0.9)",
        border: `2px solid ${atmosPanelBorder(0.5)}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${scale}) rotate(${rotation}deg)`,
        opacity: scale * breathe,
        boxShadow: `0 0 24px ${color}40`,
      }}
    >
      <IconSparkle size={40} color={color} />
    </div>
  );
};

export const HiggsApiAnim02ProliferationLogiciels: React.FC<HiggsApiAnim02Props> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const vignette = interpolate(frame, [150, 180], [0, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage outFrames={20}>
      <AbsoluteFill style={{ fontFamily }}>
        {slots.map((slot, i) => (
          <LogoTile key={i} slot={slot} index={i} spawnFrame={spawnFrames[i]} frame={frame} fps={fps} />
        ))}

        <div
          style={{
            position: "absolute",
            bottom: 90,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: FONT.hero * 0.55,
            fontWeight: 800,
            fontVariantNumeric: "tabular-nums",
            color: INK,
            letterSpacing: 2,
          }}
        >
          {yearForFrame(frame)}
        </div>

        <AbsoluteFill
          style={{
            boxShadow: `inset 0 0 ${180 * vignette}px ${120 * vignette}px rgba(0,0,0,${vignette})`,
            pointerEvents: "none",
          }}
        />
      </AbsoluteFill>
    </Stage>
  );
};
