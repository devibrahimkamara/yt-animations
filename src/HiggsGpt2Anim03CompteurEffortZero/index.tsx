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
import { Stage } from "../higgsGpt2/Stage";
import { ACCENT, ACCENT_LIGHT, INK, FONT, atmosPanelBorder } from "../higgsGpt2/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});

// Anim 3 — « Le compteur d'effort à zéro » (150 frames / 5 s @ 30 fps)
// A cut-in clavier + compteur 100, hold 0–10 · B vague diagonale + décompte
// 10–85 · C bounce du 0 + dernière touche + label blanc 85–115
// D hold 115–140 · E sortie 140–150

export const higgsGpt2Anim03Schema = z.object({
  label: z.string().default("Ton travail"),
});
export type HiggsGpt2Anim03Props = z.infer<typeof higgsGpt2Anim03Schema>;

const ROWS = 6;
const COLS = 10;
const KEY_W = 78;
const KEY_H = 60;
const KEY_GAP = 8;
const GRID_LEFT = 130;
const GRID_TOP = 340;

export const HiggsGpt2Anim03CompteurEffortZero: React.FC<
  HiggsGpt2Anim03Props
> = ({ label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const counter = Math.round(
    interpolate(frame, [10, 85], [100, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }),
  );

  const zeroSpring =
    frame >= 85
      ? spring({ frame: frame - 85, fps, config: { damping: 6, stiffness: 200 } })
      : 0;
  const zeroScale = interpolate(zeroSpring, [0, 0.5, 1], [1, 1.15, 1]);

  const labelWhite = interpolate(frame, [95, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage outFrames={10}>
      <AbsoluteFill style={{ fontFamily }}>
        {/* Clavier */}
        <div
          style={{
            position: "absolute",
            left: GRID_LEFT,
            top: GRID_TOP,
          }}
        >
          {Array.from({ length: ROWS }).map((_, y) =>
            Array.from({ length: COLS }).map((__, x) => {
              const delay = (x + y) * 2 + 10;
              const isLast = x === COLS - 1 && y === ROWS - 1;
              const opacity = interpolate(
                frame,
                [delay, delay + 8],
                [1, 0.15],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) },
              );
              const flashOpacity = isLast
                ? interpolate(frame, [85, 88, 91], [1, 0.3, 0.15], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })
                : opacity;
              return (
                <div
                  key={`${x}-${y}`}
                  style={{
                    position: "absolute",
                    left: x * (KEY_W + KEY_GAP),
                    top: y * (KEY_H + KEY_GAP),
                    width: KEY_W,
                    height: KEY_H,
                    borderRadius: 10,
                    border: `2px solid ${atmosPanelBorder(0.5)}`,
                    background: `linear-gradient(135deg, ${ACCENT_LIGHT} 0%, ${ACCENT} 100%)`,
                    opacity: flashOpacity,
                  }}
                />
              );
            }),
          )}
        </div>

        {/* Compteur + label */}
        <div
          style={{
            position: "absolute",
            right: 220,
            top: 360,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: FONT.counter,
              fontWeight: 800,
              color: INK,
              transform: `scale(${zeroScale})`,
              lineHeight: 1,
            }}
          >
            {counter}
          </div>
          <div
            style={{
              fontSize: FONT.micro * 0.6,
              fontWeight: 700,
              color: `rgba(${interpolate(labelWhite, [0, 1], [170, 255])},${interpolate(
                labelWhite,
                [0, 1],
                [170, 255],
              )},${interpolate(labelWhite, [0, 1], [170, 255])},1)`,
            }}
          >
            {label}
          </div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
