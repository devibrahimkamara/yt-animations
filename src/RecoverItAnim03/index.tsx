import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

export const recoverItAnim03Schema = z.object({});

const POINTS = [
  "Aucune formation technique requise",
  "Tu suis un process simple, étape par étape",
  "Un logiciel fait le travail pour toi",
];

export const RecoverItAnim03: React.FC<z.infer<typeof recoverItAnim03Schema>> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title entrance
  const titleS = spring({ frame, fps, config: { mass: 0.5, damping: 10, stiffness: 200 } });
  const titleOp = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Subtitle
  const subOp = interpolate(frame, [22, 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Bullet points stagger
  const bulletStarts = [50, 72, 94];

  // Circular vignette (dark edges, bright center)
  const vignetteOp = 0.65 + 0.1 * Math.abs(Math.sin(frame * 0.06));

  // Gentle breathing on content
  const breathe = 1 + 0.012 * Math.abs(Math.sin(frame * 0.07));

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />

      {/* Radial vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 60% 55% at 50% 50%, transparent 0%, rgba(0,0,0,${vignetteOp}) 100%)`,
        pointerEvents: "none",
      }} />

      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "60px 160px", gap: 48,
      }}>

        {/* Main title */}
        <div style={{
          opacity: titleOp,
          transform: `scale(${breathe}) translateY(${(1 - titleS) * 50}px)`,
          textAlign: "center",
        }}>
          <div style={{
            fontFamily, fontWeight: 800, fontSize: 96,
            color: "#ffffff",
            letterSpacing: "-0.02em", lineHeight: 1.1,
            textShadow: "0 0 40px rgba(48,96,255,0.35)",
          }}>
            Sans être un expert
          </div>
        </div>

        {/* Subtitle */}
        <div style={{
          opacity: subOp,
          transform: `translateY(${interpolate(frame, [22, 38], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE })}px)`,
          fontFamily, fontWeight: 600, fontSize: 44,
          color: "rgba(160,175,220,0.8)",
          letterSpacing: "0.04em", textAlign: "center",
        }}>
          N'importe qui peut le faire
        </div>

        {/* Bullet points */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%", maxWidth: 900 }}>
          {POINTS.map((point, i) => {
            const start = bulletStarts[i];
            const pointS = spring({ frame: frame - start, fps, config: { mass: 0.4, damping: 9, stiffness: 220 } });
            const pointOp = interpolate(frame, [start, start + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={i} style={{
                opacity: pointOp,
                transform: `translateX(${(1 - pointS) * -40}px)`,
                display: "flex", alignItems: "center", gap: 20,
                background: "linear-gradient(135deg, rgba(20,40,120,0.45), rgba(10,20,60,0.35))",
                border: "1px solid rgba(80,130,255,0.22)",
                borderRadius: 16, padding: "18px 28px",
                boxShadow: "0 0 30px rgba(48,96,255,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}>
                <svg width="40" height="40" viewBox="0 0 40 40" style={{ flexShrink: 0 }}>
                  <circle cx="20" cy="20" r="18" fill="none" stroke="#22c55e" strokeWidth="2.5" />
                  <polyline points="10,20 17,27 30,14" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontFamily, fontWeight: 700, fontSize: 44, color: "#ffffff" }}>
                  {point}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
