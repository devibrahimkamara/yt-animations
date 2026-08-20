import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });

export const highsfieldAnim07Schema = z.object({
  accentColor: z.string().default("#ef4444"),
  durationSecs: z.number().default(2.5),
});

type Props = z.infer<typeof highsfieldAnim07Schema>;

// Price-tag notch shape: rectangle with a small triangular notch on the right
const TAG_W = 720;
const TAG_H = 160;
const NOTCH_R = 22;
const tagPath = `
  M ${-TAG_W / 2 + 20},${-TAG_H / 2}
  Q ${-TAG_W / 2},${-TAG_H / 2} ${-TAG_W / 2},${-TAG_H / 2 + 20}
  L ${-TAG_W / 2},${TAG_H / 2 - 20}
  Q ${-TAG_W / 2},${TAG_H / 2} ${-TAG_W / 2 + 20},${TAG_H / 2}
  L ${TAG_W / 2 - 20},${TAG_H / 2}
  Q ${TAG_W / 2},${TAG_H / 2} ${TAG_W / 2},${TAG_H / 2 - 20}
  L ${TAG_W / 2},${NOTCH_R}
  Q ${TAG_W / 2 - NOTCH_R * 0.3},0 ${TAG_W / 2},${-NOTCH_R}
  L ${TAG_W / 2},${-TAG_H / 2 + 20}
  Q ${TAG_W / 2},${-TAG_H / 2} ${TAG_W / 2 - 20},${-TAG_H / 2}
  Z
`;

export const HighsfieldAnim07StampBadge: React.FC<Props> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Phase 1: stamp approach (0–10) — easeIn, NOT spring
  const approachScale = interpolate(frame, [0, 10], [1.4, 1.0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.in(Easing.ease),
  });
  const approachOp = interpolate(frame, [0, 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 2: impact bounce (10–22)
  const compressScale = interpolate(frame, [10, 16], [1.0, 0.92], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const overshootScale = interpolate(frame, [16, 22], [0.92, 1.05], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const settleScale = interpolate(frame, [22, 28], [1.05, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  let impactScale = 1;
  if (frame >= 10 && frame < 16) impactScale = compressScale;
  else if (frame >= 16 && frame < 22) impactScale = overshootScale;
  else if (frame >= 22 && frame < 28) impactScale = settleScale;

  const totalScale = frame < 10 ? approachScale : impactScale;

  // Flash radial burst (10–22)
  const flashScale = interpolate(frame, [10, 22], [0.1, 1.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flashOp = interpolate(frame, [10, 22], [0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 3: subtle icon pulse (22–75)
  const iconPulse = frame >= 22 ? 1 + Math.sin((frame - 22) * 0.18) * 0.08 : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity: fadeOut }}>
      <AuroraBackground />

      {/* Flash burst */}
      {frame >= 10 && frame < 22 && (
        <div style={{
          position: "absolute",
          left: "50%", top: "50%",
          transform: `translate(-50%, -50%) scale(${flashScale})`,
          width: 800, height: 800,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.7) 0%, transparent 70%)",
          opacity: flashOp,
          pointerEvents: "none",
        }} />
      )}

      <AbsoluteFill style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          opacity: approachOp,
          transform: `scale(${totalScale})`,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <svg width={TAG_W + 40} height={TAG_H + 40} style={{ overflow: "visible" }}>
            <defs>
              <filter id="stampGlow">
                <feGaussianBlur stdDeviation={6} result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <g transform={`translate(${(TAG_W + 40) / 2}, ${(TAG_H + 40) / 2})`}>
              <path d={tagPath} fill={accentColor} filter="url(#stampGlow)" />
              {/* Hole in notch */}
              <circle cx={TAG_W / 2 - 4} cy={0} r={8} fill="rgba(0,0,0,0.5)" />
            </g>
          </svg>

          {/* Badge text */}
          <div style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            transform: `scale(${iconPulse})`,
          }}>
            <div style={{
              fontFamily, fontWeight: 800, fontSize: 42,
              color: "#ffffff",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              lineHeight: 1,
              textShadow: "0 2px 8px rgba(0,0,0,0.4)",
            }}>
              MOINS DE 100$/MOIS
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
