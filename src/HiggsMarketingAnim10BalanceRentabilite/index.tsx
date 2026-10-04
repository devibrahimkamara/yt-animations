import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsMarketing/Stage";
import { ACCENT_LIGHT, FONT, MONEY_GREEN } from "../higgsMarketing/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});

// Anim 10 — « La balance de rentabilité » (180 frames / 6 s @ 30 fps)
// Phase 1 apparition balance 0–20 · Phase 2 jeton coût 20–45 ·
// Phase 3 premier jeton gain 50–80 · Phase 4 bascule décisive 85–115 ·
// Phase 5 mot "Rentable" 110–140 · Phase 6 maintien 140–180

export const higgsMarketingAnim10Schema = z.object({
  costLabel: z.string().default("20 €/mois"),
  saleLabel: z.string().default("1 vidéo vendue"),
  resultLabel: z.string().default("Rentable"),
});
export type HiggsMarketingAnim10Props = z.infer<
  typeof higgsMarketingAnim10Schema
>;

const STAGE_W = 1000;
const PIVOT = { x: 500, y: 260 };
const BEAM_HALF = 340;
const CHAIN_LEN = 150;

const Coin: React.FC<{
  x: number;
  yTarget: number;
  dropStart: number;
  fps: number;
  color: string;
  label: string;
}> = ({ x, yTarget, dropStart, fps, color, label }) => {
  const frame = useCurrentFrame();
  const s = spring({ frame: frame - dropStart, fps, config: { damping: 9, stiffness: 140 } });
  if (frame < dropStart) return null;
  const y = interpolate(s, [0, 1], [-260, yTarget]);
  return (
    <div
      style={{
        position: "absolute",
        left: x - 75,
        top: y,
        width: 150,
        height: 62,
        borderRadius: 31,
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 19,
        fontWeight: 800,
        color: "#04210f",
        textAlign: "center",
        boxShadow: "0 10px 24px rgba(0,0,0,0.4)",
      }}
    >
      {label}
    </div>
  );
};

export const HiggsMarketingAnim10BalanceRentabilite: React.FC<
  HiggsMarketingAnim10Props
> = ({ costLabel, saleLabel, resultLabel }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const introOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const introScale = interpolate(frame, [0, 20], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Angles du fléau (degrés, positif = plateau gauche descend) :
  // 0 → +9° (impact jeton coût, frame 35) → +4° (impact 1er gain, frame 65)
  // → -13° (bascule décisive, frame 100)
  const a1 = spring({ frame: frame - 35, fps, config: { damping: 9, stiffness: 140 } });
  const a2 = spring({ frame: frame - 65, fps, config: { damping: 9, stiffness: 140 } });
  const a3 = spring({ frame: frame - 100, fps, config: { damping: 7, stiffness: 130 } });
  const angleAfter1 = interpolate(a1, [0, 1], [0, 9]);
  const angleAfter2 = interpolate(a2, [0, 1], [angleAfter1, 4]);
  const angleAfter3 = interpolate(a3, [0, 1], [angleAfter2, -13]);
  const residual = frame >= 140 ? Math.sin(frame * 0.2) * 1.5 : 0;
  const finalAngle = angleAfter3 + residual;

  const rad = (finalAngle * Math.PI) / 180;
  const leftPlateY = PIVOT.y + Math.sin(rad) * BEAM_HALF + CHAIN_LEN;
  const rightPlateY = PIVOT.y - Math.sin(rad) * BEAM_HALF + CHAIN_LEN;
  const leftPlateX = PIVOT.x - Math.cos(rad) * BEAM_HALF;
  const rightPlateX = PIVOT.x + Math.cos(rad) * BEAM_HALF;

  const resultSpring = spring({ frame: frame - 110, fps, config: { damping: 10, stiffness: 180 } });
  const resultScale = interpolate(resultSpring, [0, 1], [0.7, 1]);
  const resultOpacity = interpolate(frame, [110, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage outFrames={10}>
      <AbsoluteFill style={{ fontFamily, alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "relative",
            width: STAGE_W,
            height: 680,
            opacity: introOpacity,
            transform: `scale(${introScale})`,
          }}
        >
          <svg width={STAGE_W} height={680} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {/* Pied */}
            <line x1={PIVOT.x} y1={PIVOT.y} x2={PIVOT.x} y2={620} stroke="rgba(255,255,255,0.5)" strokeWidth={10} />
            <line x1={PIVOT.x - 80} y1={620} x2={PIVOT.x + 80} y2={620} stroke="rgba(255,255,255,0.5)" strokeWidth={10} />
            {/* Fléau */}
            <line
              x1={leftPlateX}
              y1={PIVOT.y - Math.sin(rad) * BEAM_HALF}
              x2={rightPlateX}
              y2={PIVOT.y + Math.sin(rad) * BEAM_HALF}
              stroke="rgba(255,255,255,0.7)"
              strokeWidth={8}
            />
            <line x1={leftPlateX} y1={PIVOT.y - Math.sin(rad) * BEAM_HALF} x2={leftPlateX} y2={leftPlateY} stroke="rgba(255,255,255,0.4)" strokeWidth={3} />
            <line x1={rightPlateX} y1={PIVOT.y + Math.sin(rad) * BEAM_HALF} x2={rightPlateX} y2={rightPlateY} stroke="rgba(255,255,255,0.4)" strokeWidth={3} />
            <ellipse cx={leftPlateX} cy={leftPlateY} rx={130} ry={18} fill="rgba(255,255,255,0.15)" />
            <ellipse cx={rightPlateX} cy={rightPlateY} rx={130} ry={18} fill="rgba(255,255,255,0.15)" />
            <circle cx={PIVOT.x} cy={PIVOT.y} r={14} fill="rgba(255,255,255,0.6)" />
          </svg>

          <Coin x={leftPlateX} yTarget={leftPlateY - 60} dropStart={20} fps={fps} color={ACCENT_LIGHT} label={costLabel} />
          <Coin x={rightPlateX} yTarget={rightPlateY - 60} dropStart={50} fps={fps} color={MONEY_GREEN} label={saleLabel} />
          <Coin x={rightPlateX - 40} yTarget={rightPlateY - 110} dropStart={85} fps={fps} color={MONEY_GREEN} label={saleLabel} />
        </div>

        {frame >= 110 && (
          <div
            style={{
              position: "absolute",
              top: 90,
              fontSize: FONT.hero * 0.5,
              fontWeight: 800,
              color: MONEY_GREEN,
              opacity: resultOpacity,
              transform: `scale(${resultScale})`,
              textShadow: `0 0 40px ${MONEY_GREEN}88`,
            }}
          >
            {resultLabel}
          </div>
        )}
      </AbsoluteFill>
    </Stage>
  );
};
