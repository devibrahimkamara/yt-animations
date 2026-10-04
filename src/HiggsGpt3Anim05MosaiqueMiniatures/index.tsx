import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsGpt3/Stage";
import { ACCENT, ACCENT_LIGHT, INK, FONT, mulberry32, atmosGlow } from "../higgsGpt3/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});

// Anim 5 — « Mosaïque de miniatures » (165 frames / 5,5 s @ 30 fps)
// A grille qui se remplit (délais déterministes, seed fixe) 0–54
// B grille complète, respiration légère 54–99
// C zoom out + apparition avatar (delay 108) 99–141 · D sortie 141–165
//
// Déterminisme critique (souligné explicitement par le brief) : les délais
// de remplissage sont calculés UNE FOIS avec un PRNG seedé (mulberry32),
// jamais avec Math.random() qui donnerait un flickering incohérent au
// rendu final (frames potentiellement recalculées hors ordre).

export const higgsGpt3Anim05Schema = z.object({
  channelInitials: z.string().default("IC"),
});
export type HiggsGpt3Anim05Props = z.infer<typeof higgsGpt3Anim05Schema>;

const COLS = 5;
const ROWS = 3;
const CELL_GAP = 6;
const GRID_W = 1600;
const CELL_W = (GRID_W - CELL_GAP * (COLS - 1)) / COLS;
const CELL_H = (CELL_W * 9) / 16;
const GRID_H = CELL_H * ROWS + CELL_GAP * (ROWS - 1);
const GRID_LEFT = (1920 - GRID_W) / 2;
const GRID_TOP = (1080 - GRID_H) / 2;

const rand = mulberry32(1337);
const shuffled = Array.from({ length: COLS * ROWS }, (_, i) => i)
  .map((i) => ({ i, r: rand() }))
  .sort((a, b) => a.r - b.r)
  .map((x, order) => ({ index: x.i, delay: Math.round(order * (45 / (COLS * ROWS - 1))) }));

const cellDelay = (i: number) => shuffled.find((s) => s.index === i)!.delay;

export const HiggsGpt3Anim05MosaiqueMiniatures: React.FC<
  HiggsGpt3Anim05Props
> = ({ channelInitials }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const zoomOut = interpolate(frame, [99, 141], [1, 0.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const zoomOutExit = interpolate(frame, [141, 165], [0.55, 0.48], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gridScale = frame < 141 ? zoomOut : zoomOutExit;
  const gridOpacity = interpolate(frame, [99, 141, 165], [1, 0.85, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const avatarSpring = spring({
    frame: frame - 108,
    fps,
    config: { damping: 12, stiffness: 200 },
  });
  const avatarScale = interpolate(avatarSpring, [0, 1], [0.7, 1]);
  const avatarOpacity = interpolate(frame, [108, 118], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage outFrames={12}>
      <AbsoluteFill style={{ fontFamily }}>
        <div
          style={{
            position: "absolute",
            left: GRID_LEFT,
            top: GRID_TOP,
            width: GRID_W,
            height: GRID_H,
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gridTemplateRows: `repeat(${ROWS}, 1fr)`,
            gap: CELL_GAP,
            transform: `scale(${gridScale})`,
            transformOrigin: "center",
            opacity: gridOpacity,
          }}
        >
          {Array.from({ length: COLS * ROWS }, (_, i) => {
            const delay = cellDelay(i);
            const s = spring({
              frame: frame - delay,
              fps,
              config: { damping: 10, stiffness: 220 },
            });
            const cellScale = interpolate(s, [0, 0.7, 1], [0, 1.08, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const cellOpacity = interpolate(frame, [delay, delay + 8], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const breathe =
              frame >= 54
                ? 0.92 + (Math.sin((frame + i * 7) / fps * 1.5 * Math.PI * 2) + 1) * 0.04
                : 1;
            const hue = (i * 37) % 360;

            return (
              <div
                key={i}
                style={{
                  borderRadius: 4,
                  background: `linear-gradient(135deg, hsl(${hue},70%,45%) 0%, hsl(${(hue + 40) % 360},70%,25%) 100%)`,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                  opacity: cellOpacity * breathe,
                  transform: `scale(${cellScale})`,
                }}
              />
            );
          })}
        </div>

        {/* Avatar de chaîne */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 220,
            height: 220,
            transform: `translate(-50%, -50%) scale(${avatarScale})`,
            opacity: avatarOpacity,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: -30,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${ACCENT}40 0%, transparent 70%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: `radial-gradient(circle at 35% 30%, ${ACCENT_LIGHT} 0%, ${ACCENT} 100%)`,
              boxShadow: atmosGlow(ACCENT, 40, 90),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: FONT.label * 0.7, fontWeight: 800, color: INK }}>
              {channelInitials}
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
