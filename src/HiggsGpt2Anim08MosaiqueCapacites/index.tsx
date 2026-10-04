import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsGpt2/Stage";
import {
  IconClapper,
  IconPhotoFrame,
  IconSparkle,
  IconFilmStrip,
} from "../higgsGpt2/icons";
import {
  ACCENT,
  ACCENT_LIGHT,
  INK,
  FONT,
  ICON,
  WARM_BREAK_GRAD,
  atmosPanelBorder,
} from "../higgsGpt2/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});

// Anim 8 — « La mosaïque des capacités » (270 frames / 9 s @ 30 fps)
// A 4 contours 0–20 · B cellule 1 (wipe TL→BR) 20–95
// C cellule 2 (wipe TL→BR, décalé) 85–150 · D cellule 3 (wipe inversé) 150–215
// E cellule 4 (dégradé chaud, wipe rapide) + resserrement groupe 215–270

export const higgsGpt2Anim08Schema = z.object({
  labels: z
    .array(z.string())
    .default(["Vidéos IA", "Photos IA", "Animations IA", "Films réalistes"]),
});
export type HiggsGpt2Anim08Props = z.infer<typeof higgsGpt2Anim08Schema>;

const CELL_W = 480;
const CELL_H = 330;
const GAP = 40;
const GRID_W = CELL_W * 2 + GAP;
const GRID_H = CELL_H * 2 + GAP;
const GRID_LEFT = (1920 - GRID_W) / 2;
const GRID_TOP = (1080 - GRID_H) / 2;

const CELLS = [
  { icon: IconClapper, grad: `linear-gradient(135deg, #16213e 0%, ${ACCENT} 100%)`, wipeStart: 20, wipeEnd: 95, reverse: false },
  { icon: IconPhotoFrame, grad: `linear-gradient(135deg, #0d2137 0%, ${ACCENT_LIGHT} 100%)`, wipeStart: 85, wipeEnd: 150, reverse: false },
  { icon: IconSparkle, grad: "linear-gradient(135deg, #1a0a2e 0%, #4a1a6e 100%)", wipeStart: 150, wipeEnd: 215, reverse: true },
  { icon: IconFilmStrip, grad: WARM_BREAK_GRAD, wipeStart: 215, wipeEnd: 250, reverse: false },
];

export const HiggsGpt2Anim08MosaiqueCapacites: React.FC<
  HiggsGpt2Anim08Props
> = ({ labels }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const groupSpring = spring({
    frame: frame - 250,
    fps,
    config: { damping: 16, stiffness: 140 },
  });
  const groupScale = frame >= 250 ? interpolate(groupSpring, [0, 1], [1, 0.96]) : 1;

  const positions = [
    { left: GRID_LEFT, top: GRID_TOP },
    { left: GRID_LEFT + CELL_W + GAP, top: GRID_TOP },
    { left: GRID_LEFT, top: GRID_TOP + CELL_H + GAP },
    { left: GRID_LEFT + CELL_W + GAP, top: GRID_TOP + CELL_H + GAP },
  ];

  return (
    <Stage outFrames={12}>
      <AbsoluteFill
        style={{
          fontFamily,
          transform: `scale(${groupScale})`,
          transformOrigin: "960px 540px",
        }}
      >
        {CELLS.map((cell, i) => {
          const Icon = cell.icon;
          const outlineOpacity = interpolate(frame, [0, 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const wipe = interpolate(frame, [cell.wipeStart, cell.wipeEnd], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const clipPath = cell.reverse
            ? `polygon(100% 100%, ${100 - wipe * 100}% 100%, 100% ${100 - wipe * 100}%)`
            : `polygon(0 0, ${wipe * 100}% 0, 0 ${wipe * 100}%)`;
          const fullClip = wipe >= 1 ? "none" : clipPath;

          const iconSpring = spring({
            frame: frame - (wipe >= 0.6 ? cell.wipeStart + (cell.wipeEnd - cell.wipeStart) * 0.6 : 1e9),
            fps,
            config: { damping: 12, stiffness: 180 },
          });
          const iconScale = wipe >= 0.6 ? interpolate(iconSpring, [0, 1], [0, 1]) : 0;

          const labelOpacity = interpolate(
            frame,
            [cell.wipeStart + (cell.wipeEnd - cell.wipeStart) * 0.7, cell.wipeEnd],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const labelY = interpolate(
            frame,
            [cell.wipeStart + (cell.wipeEnd - cell.wipeStart) * 0.7, cell.wipeEnd],
            [10, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: positions[i].left,
                top: positions[i].top,
                width: CELL_W,
                height: CELL_H,
                borderRadius: 16,
                border: `2px solid ${atmosPanelBorder(0.5)}`,
                opacity: outlineOpacity,
                overflow: "hidden",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: cell.grad,
                  clipPath: fullClip,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 20,
                }}
              >
                <div style={{ transform: `scale(${iconScale})` }}>
                  <Icon size={ICON.md} color={INK} strokeWidth={4} />
                </div>
                <div
                  style={{
                    fontSize: FONT.micro * 0.65,
                    fontWeight: 800,
                    color: INK,
                    opacity: labelOpacity,
                    transform: `translateY(${labelY}px)`,
                  }}
                >
                  {labels[i]}
                </div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </Stage>
  );
};
