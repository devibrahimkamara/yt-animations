import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

export const anim08Schema = z.object({
  title: z.string().default("Mon agent IA en action"),
  steps: z.array(z.object({
    emoji: z.string(),
    label: z.string(),
    sublabel: z.string().optional(),
    isHuman: z.boolean().default(false),
  })).default([
    { emoji: "🔍", label: "Recherche de marques", sublabel: "Automatique", isHuman: false },
    { emoji: "✍️", label: "Rédaction emails", sublabel: "Personnalisé", isHuman: false },
    { emoji: "📤", label: "Envoi automatique", sublabel: "24h/24", isHuman: false },
    { emoji: "📥", label: "Réponses reçues", sublabel: "Notifié", isHuman: false },
    { emoji: "👤", label: "Tu prends le relais", sublabel: "Closing", isHuman: true },
  ]),
  accentColor: z.string().default("#3b82f6"),
  durationSecs: z.number().default(7),
});

export const Anim08Flowchart: React.FC<z.infer<typeof anim08Schema>> = ({
  title, steps, accentColor, durationSecs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const STAGGER = 28;
  const STEP_START = 22;

  const titleOp = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 18], [-20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 80px", gap: 52 }}>

        {/* Title */}
        <div style={{ opacity: titleOp, transform: `translateY(${titleY}px)`, textAlign: "center" }}>
          <div style={{ fontFamily, fontWeight: 800, fontSize: 56, color: "#fff" }}>{title}</div>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", alignItems: "center", width: "100%", gap: 0 }}>
          {steps.map((step, i) => {
            const stepStart = STEP_START + i * STAGGER;
            const s = spring({ frame: frame - stepStart, fps, config: { mass: 0.4, damping: 9, stiffness: 240 } });
            const stepY = interpolate(s, [0, 1], [30, 0]);

            const arrowStart = stepStart + 10;
            const arrowProgress = interpolate(frame, [arrowStart, arrowStart + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
            const isLast = i === steps.length - 1;
            const isHuman = step.isHuman;
            const humanGlow = isHuman ? 16 + 10 * Math.abs(Math.sin(frame * 0.1)) : 0;

            return (
              <React.Fragment key={i}>
                {/* Step box */}
                <div style={{
                  flex: 1,
                  opacity: s, transform: `translateY(${stepY}px)`,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
                  background: isHuman
                    ? "linear-gradient(135deg, rgba(70,52,0,0.88), rgba(45,32,0,0.82))"
                    : "linear-gradient(135deg, rgba(14,30,90,0.82), rgba(8,18,58,0.78))",
                  border: `2px solid ${isHuman ? "rgba(255,215,0,0.55)" : "rgba(80,130,255,0.35)"}`,
                  borderRadius: 22,
                  padding: "28px 18px",
                  boxShadow: isHuman
                    ? `0 0 ${humanGlow}px rgba(255,215,0,0.4), 0 0 ${humanGlow * 2}px rgba(255,215,0,0.15)`
                    : `0 0 24px rgba(59,130,246,0.2)`,
                }}>
                  <div style={{ fontSize: 46 }}>{step.emoji}</div>
                  <div style={{ fontFamily, fontWeight: 800, fontSize: 22, color: isHuman ? "#ffd700" : "rgba(210,228,255,0.95)", textAlign: "center", lineHeight: 1.3 }}>
                    {step.label}
                  </div>
                  {step.sublabel && (
                    <div style={{
                      fontFamily, fontWeight: 600, fontSize: 17,
                      color: isHuman ? "rgba(255,220,100,0.65)" : "rgba(100,150,255,0.65)",
                      letterSpacing: "0.06em", textTransform: "uppercase",
                    }}>
                      {step.sublabel}
                    </div>
                  )}
                </div>

                {/* Arrow */}
                {!isLast && (
                  <div style={{ flexShrink: 0, width: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
                      <line
                        x1="0" y1="12" x2={arrowProgress * 38} y2="12"
                        stroke={`rgba(80,130,255,${arrowProgress * 0.7})`}
                        strokeWidth="2.5"
                      />
                      {arrowProgress > 0.85 && (
                        <path
                          d={`M${34 + arrowProgress * 4},${12 - 6} L48,12 L${34 + arrowProgress * 4},${12 + 6}`}
                          stroke={`rgba(80,130,255,${arrowProgress * 0.7})`}
                          strokeWidth="2.5" strokeLinecap="round" fill="none"
                        />
                      )}
                    </svg>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* AI badge */}
        <div style={{
          opacity: interpolate(frame, [STEP_START + 10, STEP_START + 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          display: "flex", alignItems: "center", gap: 16,
          background: "rgba(14,30,90,0.6)", border: "1px solid rgba(80,130,255,0.25)",
          borderRadius: 16, padding: "14px 28px",
        }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: accentColor, boxShadow: `0 0 10px ${accentColor}` }} />
          <div style={{ fontFamily, fontWeight: 700, fontSize: 22, color: "rgba(140,175,255,0.8)" }}>
            🤖 Géré automatiquement par l'agent IA — sauf la dernière étape
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
