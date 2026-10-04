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
import { IconLockBody, IconLockShackle } from "../higgsMarketing/icons";
import { ACCENT, DESATURATED, FONT, INK } from "../higgsMarketing/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});

// Anim 9 — « Le cadenas du modèle » (195 frames / 6,5 s @ 30 fps)
// Phase 1 apparition cartes 0–25 · Phase 2 verrouillé (Gratuit) 25–55 ·
// Phase 3 pause 55–70 · Phase 4 déverrouillage (Payant) 70–110 ·
// Phase 5 illumination 100–145 · Phase 6 maintien 145–195

export const higgsMarketingAnim09Schema = z.object({
  modelName: z.string().default("GPT-6 Astra"),
});
export type HiggsMarketingAnim09Props = z.infer<
  typeof higgsMarketingAnim09Schema
>;

const CARD_W = 560;
const CARD_H = 460;
const GAP = 80;

const LockRow: React.FC<{
  modelName: string;
  variant: "free" | "paid";
}> = ({ modelName, variant }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lockDelay = variant === "free" ? 25 : 70;
  const lockSpring = spring({ frame: frame - lockDelay, fps, config: { damping: 11, stiffness: 180 } });
  const lockScale = interpolate(lockSpring, [0, 1], [0, 1]);

  const shakeStart = 40;
  const shakeLocal = frame - shakeStart;
  const shakeX = variant === "free" && shakeLocal >= 0 && shakeLocal < 18 ? Math.sin(shakeLocal * 2.2) * 5 : 0;

  const openStart = 90;
  const openSpring = spring({ frame: frame - openStart, fps, config: { damping: 10, stiffness: 160 } });
  const shackleAngle = variant === "paid" ? interpolate(openSpring, [0, 1], [0, -55]) : 0;
  const flashOpacity = variant === "paid" ? interpolate(frame, [95, 100, 108], [0, 0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const lockGone = variant === "paid" ? interpolate(frame, [108, 118], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;

  const illuminateT = variant === "paid" ? interpolate(frame, [100, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const lineColor = variant === "free" ? DESATURATED : `rgb(${255 + (parseInt(ACCENT.slice(1, 3), 16) - 255) * illuminateT}, ${255 + (parseInt(ACCENT.slice(3, 5), 16) - 255) * illuminateT}, ${255 + (parseInt(ACCENT.slice(5, 7), 16) - 255) * illuminateT})`;

  const cardSpring = spring({ frame: frame - (variant === "free" ? 0 : 8), fps, config: { damping: 14, stiffness: 120 } });
  const cardScaleIn = interpolate(cardSpring, [0, 1], [0.9, 1]);
  const cardOpacityIn = interpolate(frame, [variant === "free" ? 0 : 8, variant === "free" ? 8 : 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const finalScale = variant === "paid"
    ? interpolate(frame, [130, 145], [1, 1.09], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : interpolate(frame, [130, 145], [1, 0.95], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const finalOpacity = variant === "free" ? interpolate(frame, [130, 145], [1, 0.75], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  const glow = variant === "paid" ? interpolate(frame, [130, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;

  return (
    <div
      style={{
        width: CARD_W,
        height: CARD_H,
        borderRadius: 20,
        background: "rgba(255,255,255,0.05)",
        border: variant === "paid" ? `2px solid ${ACCENT}` : "1px solid rgba(255,255,255,0.15)",
        boxShadow: variant === "paid" ? `0 0 ${60 * glow}px ${ACCENT}77` : "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        opacity: cardOpacityIn * finalOpacity,
        transform: `scale(${cardScaleIn * finalScale})`,
      }}
    >
      <div style={{ fontSize: FONT.label, fontWeight: 700, color: INK }}>
        {variant === "free" ? "Gratuit" : "Payant"}
      </div>
      <div
        style={{
          fontSize: FONT.value * 0.55,
          fontWeight: 700,
          color: lineColor,
          filter: variant === "free" ? "grayscale(1)" : "none",
          opacity: variant === "free" ? 0.55 : 1,
        }}
      >
        {modelName}
      </div>
      <div
        style={{
          position: "relative",
          width: 90,
          height: 90,
          opacity: lockGone,
          transform: `scale(${lockScale}) translateX(${shakeX}px)`,
        }}
      >
        <IconLockBody size={90} color={variant === "free" ? "#999" : ACCENT} strokeWidth={4} />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transformOrigin: "34% 62%",
            transform: `rotate(${shackleAngle}deg)`,
          }}
        >
          <IconLockShackle size={90} color={variant === "free" ? "#999" : ACCENT} strokeWidth={4} />
        </div>
      </div>
      {variant === "paid" && (
        <div
          style={{
            position: "absolute",
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: ACCENT,
            filter: "blur(30px)",
            opacity: flashOpacity,
          }}
        />
      )}
    </div>
  );
};

export const HiggsMarketingAnim09CadenasModele: React.FC<
  HiggsMarketingAnim09Props
> = ({ modelName }) => {
  return (
    <Stage outFrames={10}>
      <AbsoluteFill style={{ fontFamily, alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", gap: GAP }}>
          <LockRow modelName={modelName} variant="free" />
          <LockRow modelName={modelName} variant="paid" />
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
