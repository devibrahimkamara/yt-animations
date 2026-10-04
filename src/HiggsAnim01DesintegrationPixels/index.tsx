import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgs/Stage";
import { AnimatedLetter } from "../higgs/AnimatedLetter";
import { INK, ACCENT } from "../higgs/theme";
import { aiFacePortrait } from "../higgs/vector";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });

export const higgsAnim01Schema = z.object({
  text: z.string().default("N'EXISTE PAS"),
  // Passer une vraie image (URL / staticFile) remplace le portrait vectoriel.
  portraitSrc: z.string().optional(),
});

export type HiggsAnim01Props = z.infer<typeof higgsAnim01Schema>;

const COLS = 24;
const ROWS = 24;
const COUNT = COLS * ROWS;
const CELL = 33;
const BOX_W = COLS * CELL; // 792
const BOX_H = ROWS * CELL; // 792
const CENTER_X = 960;
const CENTER_Y = 468;

// Phases (frames @ 30fps)
const FREEZE_END = 12;
const TEXT_START = 45;
const LETTER_DELAY = 3;

export const HiggsAnim01DesintegrationPixels: React.FC<HiggsAnim01Props> = ({
  text,
  portraitSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const image = portraitSrc ?? aiFacePortrait({ w: BOX_W, h: BOX_H, bg: "#20242e" });

  const gridCX = (COLS - 1) / 2;
  const gridCY = (ROWS - 1) / 2;
  const maxDist = Math.hypot(gridCX, gridCY);

  return (
    <Stage outFrames={12} bare background="linear-gradient(180deg, #1C1C1E 0%, #0A0A0A 100%)">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "absolute",
            left: CENTER_X - BOX_W / 2,
            top: CENTER_Y - BOX_H / 2,
            width: BOX_W,
            height: BOX_H,
          }}
        >
          {Array.from({ length: COUNT }, (_, i) => {
            const col = i % COLS;
            const row = Math.floor(i / COLS);

            // délai piloté par la distance au centre → « trou » central d'abord
            const dist = Math.hypot(col - gridCX, row - gridCY);
            const delay = FREEZE_END + (dist / maxDist) * 26;

            const s = spring({
              frame: frame - delay,
              fps,
              config: { damping: 12 },
            });

            const tx = (random(`x-${i}`) - 0.5) * 80 * s;
            const ty = (random(`y-${i}`) - 0.5) * 80 * s;
            const rot = (random(`r-${i}`) - 0.5) * 50 * s;
            const opacity = interpolate(s, [0, 1], [1, 0], { extrapolateRight: "clamp" });

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: col * CELL,
                  top: row * CELL,
                  width: CELL + 1,
                  height: CELL + 1,
                  backgroundImage: `url("${image}")`,
                  backgroundSize: `${BOX_W}px ${BOX_H}px`,
                  backgroundPosition: `${-col * CELL}px ${-row * CELL}px`,
                  transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg)`,
                  opacity,
                }}
              />
            );
          })}
        </div>

        {/* Texte révélé lettre par lettre */}
        {frame >= TEXT_START && (
          <div
            style={{
              position: "absolute",
              display: "flex",
              justifyContent: "center",
              width: 1840,
              letterSpacing: "-0.02em",
            }}
          >
            {text.split("").map((char, i) => (
              <AnimatedLetter
                key={`${char}-${i}`}
                char={char}
                delay={TEXT_START + i * LETTER_DELAY}
                fontFamily={fontFamily}
                fontSize={172}
                color={char === "'" ? ACCENT : INK}
                fromScale={0.8}
              />
            ))}
          </div>
        )}
      </AbsoluteFill>
    </Stage>
  );
};
