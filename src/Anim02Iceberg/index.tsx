import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

export const anim02Schema = z.object({
  visibleLabel: z.string().default("ChatGPT pour les questions"),
  hiddenItems: z.array(z.string()).default([
    "Agents IA",
    "Systèmes automatiques",
    "Revenus passifs",
    "Business autonome",
  ]),
  accentColor: z.string().default("#3b82f6"),
  durationSecs: z.number().default(7),
});

export const Anim02Iceberg: React.FC<z.infer<typeof anim02Schema>> = ({
  visibleLabel, hiddenItems, accentColor, durationSecs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = durationSecs * fps;

  // Tip entrance
  const tipReveal = interpolate(frame, [15, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

  // Water surface
  const waterOp = interpolate(frame, [45, 62], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const waveOffset = Math.sin(frame * 0.07) * 5;

  // Body reveal
  const bodyReveal = interpolate(frame, [60, totalFrames - 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Ocean overlay
  const oceanOp = interpolate(frame, [0, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />

      {/* Ocean gradient bottom half */}
      <div style={{
        position: "absolute", top: "42%", left: 0, right: 0, bottom: 0,
        background: "linear-gradient(180deg, rgba(2,12,45,0.7) 0%, rgba(1,6,28,0.92) 100%)",
        opacity: oceanOp,
      }} />

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0 }}>

        {/* "Ce que tu utilises" label */}
        <div style={{
          fontFamily, fontWeight: 700, fontSize: 24,
          color: "rgba(160,180,230,0.65)",
          letterSpacing: "0.1em", textTransform: "uppercase",
          marginBottom: 18,
          opacity: interpolate(frame, [12, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          Ce que tu utilises
        </div>

        {/* Tip */}
        <div style={{
          position: "relative",
          clipPath: `inset(${interpolate(tipReveal, [0, 1], [100, 0])}% 0 0 0)`,
        }}>
          <svg width="480" height="200" viewBox="0 0 480 200" fill="none" style={{ display: "block" }}>
            <defs>
              <linearGradient id="tip2" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="rgba(225,242,255,0.97)" />
                <stop offset="55%" stopColor="rgba(155,205,248,0.93)" />
                <stop offset="100%" stopColor="rgba(90,158,230,0.88)" />
              </linearGradient>
              <filter id="tipglow2" x="-15%" y="-15%" width="130%" height="130%">
                <feGaussianBlur stdDeviation="5" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <polygon points="240,8 472,198 8,198" fill="url(#tip2)" stroke="rgba(190,225,255,0.55)" strokeWidth="1.5" filter="url(#tipglow2)" />
            <polygon points="240,8 472,198 356,103" fill="rgba(255,255,255,0.07)" />
            <polygon points="240,8 8,198 124,103" fill="rgba(255,255,255,0.05)" />
          </svg>

          {/* Label on tip */}
          <div style={{
            position: "absolute", bottom: 36, left: 0, right: 0, textAlign: "center",
            fontFamily, fontWeight: 800, fontSize: 26,
            color: "rgba(5,20,60,0.92)",
          }}>
            {visibleLabel}
          </div>
        </div>

        {/* Water surface */}
        <div style={{ width: 680, opacity: waterOp }}>
          <svg width="100%" height="30" viewBox="0 0 680 30" preserveAspectRatio="none">
            <defs>
              <linearGradient id="wg2" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="15%" stopColor="rgba(100,185,255,0.65)" />
                <stop offset="85%" stopColor="rgba(100,185,255,0.65)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path d={`M0,15 Q85,${15+waveOffset} 170,15 Q255,${15-waveOffset} 340,15 Q425,${15+waveOffset} 510,15 Q595,${15-waveOffset} 680,15`}
              stroke="url(#wg2)" strokeWidth="2.5" fill="none" />
          </svg>
          <div style={{ fontFamily, fontWeight: 600, fontSize: 14, color: "rgba(100,185,255,0.45)", letterSpacing: "0.14em", textTransform: "uppercase", textAlign: "right", marginTop: -4 }}>
            ≈ surface ≈
          </div>
        </div>

        {/* Body underwater */}
        <div style={{
          position: "relative", width: 640,
          clipPath: `inset(${interpolate(bodyReveal, [0, 1], [100, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}% 0 0 0 round 0 0 28px 28px)`,
        }}>
          <svg width="640" height="390" viewBox="0 0 640 390" preserveAspectRatio="none" style={{ display: "block" }}>
            <defs>
              <linearGradient id="body2" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="rgba(4,18,58,0.96)" />
                <stop offset="100%" stopColor="rgba(1,6,22,0.99)" />
              </linearGradient>
              <linearGradient id="bodystroke2" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="rgba(80,140,255,0.5)" />
                <stop offset="100%" stopColor="rgba(40,80,200,0.18)" />
              </linearGradient>
            </defs>
            <path d="M20,0 L620,0 L590,390 L50,390 Z"
              fill="url(#body2)" stroke="url(#bodystroke2)" strokeWidth="1.5" />
            <path d="M55,20 L585,20 L558,370 L82,370 Z" fill="rgba(80,130,255,0.04)" />
          </svg>

          {/* Hidden items */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "space-evenly",
            padding: "28px 20px",
          }}>
            {hiddenItems.map((item, i) => {
              const iStart = 60 + i * 20;
              const iS = spring({ frame: frame - iStart, fps, config: { mass: 0.4, damping: 8, stiffness: 280 } });
              const glow = 22 + 14 * Math.abs(Math.sin(frame * 0.1 + i));
              return (
                <div key={i} style={{
                  fontFamily, fontWeight: 800,
                  fontSize: 38 - i * 1.5,
                  color: accentColor,
                  opacity: iS,
                  transform: `scale(${iS}) translateY(${interpolate(iS, [0, 1], [12, 0])}px)`,
                  letterSpacing: "0.05em",
                  textShadow: `0 0 ${glow}px ${accentColor}70, 0 0 ${glow * 2}px ${accentColor}28`,
                  textAlign: "center",
                }}>
                  {item}
                </div>
              );
            })}
          </div>
        </div>

        {/* "Le vrai potentiel" label */}
        <div style={{
          marginTop: 14,
          fontFamily, fontWeight: 700, fontSize: 24,
          color: "rgba(100,145,255,0.7)",
          letterSpacing: "0.1em", textTransform: "uppercase",
          opacity: interpolate(frame, [55, 72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          Le vrai potentiel de l'IA
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
