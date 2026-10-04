import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../maxdrop/Stage";
import { Emoji } from "../higgs2/Emoji";
import { MAXDROP_BLUE, MAXDROP_GLOW, RAIL, INK, TEXT_DIM, CARD_BG, CARD_BORDER, FONT } from "../maxdrop/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const maxdropAnim13Schema = z.object({
  milestones: z
    .array(z.object({ label: z.string(), emoji: z.string(), frac: z.number(), appear: z.number() }))
    .default([
      { label: "Choix de la formule", emoji: "🧪", frac: 0.06, appear: 40 },
      { label: "Envoi du branding", emoji: "🎨", frac: 0.22, appear: 115 },
      { label: "Impression packaging", emoji: "📦", frac: 0.5, appear: 190 },
      { label: "Produit prêt", emoji: "✅", frac: 1, appear: 265 },
    ]),
  finalText: z.string().default("10 jours."),
});
export type MaxdropAnim13Props = z.infer<typeof maxdropAnim13Schema>;

const LX = 200;
const RX = 1720;
const LY = 560;
const SPAN = RX - LX;

// keyframes [frame, fraction] — durées proportionnelles par étape
const KEYS: [number, number][] = [
  [30, 0],
  [105, 2 / 9],
  [180, 3 / 9],
  [255, 6 / 9],
  [330, 1],
];

function cursorFrac(frame: number): number {
  if (frame <= KEYS[0][0]) return 0;
  if (frame >= KEYS[KEYS.length - 1][0]) return 1;
  for (let i = 0; i < KEYS.length - 1; i++) {
    const [f0, v0] = KEYS[i];
    const [f1, v1] = KEYS[i + 1];
    if (frame >= f0 && frame < f1) return interpolate(frame, [f0, f1], [v0, v1]);
  }
  return 1;
}

export const MaxdropAnim13Timeline10Jours: React.FC<MaxdropAnim13Props> = ({ milestones, finalText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineDraw = interpolate(frame, [0, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const frac = cursorFrac(frame);
  const cursorX = LX + frac * SPAN;

  const arrived = spring({ frame: frame - 330, fps, config: { damping: 14, stiffness: 300 } });
  const cursorScale = interpolate(arrived, [0, 1], [1, 1.3], { extrapolateRight: "clamp" });
  const finalIn = interpolate(frame, [330, 348], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <Stage outFrames={8}>
      <AbsoluteFill style={{ fontFamily }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {/* ligne de base */}
          <line x1={LX} y1={LY} x2={LX + SPAN * lineDraw} y2={LY} stroke={RAIL} strokeWidth={5} strokeLinecap="round" />
          {/* segment parcouru (coloré) */}
          <line x1={LX} y1={LY} x2={cursorX} y2={LY} stroke={MAXDROP_BLUE} strokeWidth={5} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${MAXDROP_GLOW})` }} />

          {/* graduations J1..J10 */}
          {Array.from({ length: 10 }, (_, i) => {
            const x = LX + (i / 9) * SPAN;
            const op = interpolate(lineDraw, [i / 10, i / 10 + 0.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <g key={i} opacity={op}>
                <line x1={x} y1={LY} x2={x} y2={LY + 18} stroke={RAIL} strokeWidth={2} />
              </g>
            );
          })}

          {/* curseur */}
          {frame >= 30 && (
            <circle
              cx={cursorX}
              cy={LY}
              r={12 * cursorScale}
              fill={MAXDROP_BLUE}
              style={{ filter: frame >= 330 ? `drop-shadow(0 0 20px ${MAXDROP_GLOW})` : "none" }}
            />
          )}
        </svg>

        {/* labels J1..J10 */}
        {Array.from({ length: 10 }, (_, i) => {
          const x = LX + (i / 9) * SPAN;
          const op = interpolate(lineDraw, [i / 10, i / 10 + 0.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x - 30,
                top: LY + 26,
                width: 60,
                textAlign: "center",
                fontSize: FONT.micro * 0.6,
                fontWeight: 700,
                color: TEXT_DIM,
                opacity: op,
              }}
            >
              J{i + 1}
            </div>
          );
        })}

        {/* vignettes des jalons */}
        {milestones.map((m, i) => {
          const x = LX + m.frac * SPAN;
          const s = spring({ frame: frame - m.appear, fps, config: { damping: 200, stiffness: 100 } });
          if (frame < m.appear) return null;
          const y = interpolate(s, [0, 1], [15, 0]);
          const last = i === milestones.length - 1;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x - 110,
                top: LY - 230 + y,
                width: 220,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                opacity: s,
              }}
            >
              <div
                style={{
                  width: 140,
                  height: 110,
                  borderRadius: 14,
                  background: CARD_BG,
                  border: `2px solid ${last ? MAXDROP_BLUE : CARD_BORDER}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Emoji size={64}>{m.emoji}</Emoji>
              </div>
              <div
                style={{
                  marginTop: 12,
                  fontSize: last ? FONT.micro * 0.95 : FONT.micro * 0.75,
                  fontWeight: 800,
                  color: last ? MAXDROP_BLUE : TEXT_DIM,
                  textAlign: "center",
                }}
              >
                {m.label}
              </div>
            </div>
          );
        })}

        {/* texte final */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: LY - 340,
            textAlign: "center",
            fontSize: FONT.counter,
            fontWeight: 800,
            color: INK,
            opacity: finalIn,
          }}
        >
          {finalText}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
