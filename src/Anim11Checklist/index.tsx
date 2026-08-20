import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

export const anim11Schema = z.object({
  title: z.string().default("Comment mettre en place le système"),
  items: z.array(z.string()).default([
    "Trouver des prospects avec l'IA",
    "Rédiger les emails automatiquement",
    "Envoyer + suivre les réponses",
    "Négocier et closer les deals",
  ]),
  cta: z.string().default("La dernière étape → dans la vidéo"),
  accentColor: z.string().default("#3b82f6"),
  durationSecs: z.number().default(6),
});

export const Anim11Checklist: React.FC<z.infer<typeof anim11Schema>> = ({
  title, items, cta, accentColor, durationSecs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const STAGGER = 38;

  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 20], [-24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

  const ctaStart = 18 + items.length * STAGGER + 10;
  const ctaOp = interpolate(frame, [ctaStart, ctaStart + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaY = interpolate(frame, [ctaStart, ctaStart + 20], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 120px" }}>
        <div style={{ width: "100%", maxWidth: 1100, display: "flex", flexDirection: "column", gap: 40 }}>

          {/* Title */}
          <div style={{ opacity: titleOp, transform: `translateY(${titleY}px)`, textAlign: "center" }}>
            <div style={{ fontFamily, fontWeight: 800, fontSize: 58, color: "#fff", letterSpacing: "0.01em", lineHeight: 1.2 }}>
              {title}
            </div>
          </div>

          {/* Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {items.map((item, i) => {
              const itemStart = 18 + i * STAGGER;
              const itemOp = interpolate(frame, [itemStart, itemStart + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const itemX = interpolate(frame, [itemStart, itemStart + 18], [-30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

              const isLast = i === items.length - 1;
              const checkStart = itemStart + 14;
              const checkS = isLast ? 0 : spring({ frame: frame - checkStart, fps, config: { mass: 0.4, damping: 8, stiffness: 300 } });

              const isDone = !isLast && frame > checkStart + 5;

              return (
                <div key={i} style={{
                  opacity: itemOp,
                  transform: `translateX(${itemX}px)`,
                  display: "flex", alignItems: "center", gap: 24,
                  background: isDone
                    ? `linear-gradient(135deg, rgba(34,197,94,0.12), rgba(34,197,94,0.06))`
                    : "linear-gradient(135deg, rgba(14,30,90,0.72), rgba(8,18,58,0.68))",
                  border: `1.5px solid ${isDone ? "rgba(34,197,94,0.4)" : "rgba(80,130,255,0.28)"}`,
                  borderRadius: 20,
                  padding: "22px 30px",
                  boxShadow: isDone
                    ? "0 0 30px rgba(34,197,94,0.12), inset 0 1px 0 rgba(255,255,255,0.05)"
                    : "0 0 30px rgba(59,130,246,0.1), inset 0 1px 0 rgba(255,255,255,0.04)",
                  transition: "all 0.3s",
                }}>
                  {/* Checkbox */}
                  <div style={{
                    width: 46, height: 46, borderRadius: "50%", flexShrink: 0,
                    border: `2.5px solid ${isDone ? "#22c55e" : isLast ? "rgba(255,255,255,0.25)" : "rgba(80,130,255,0.5)"}`,
                    background: isDone ? "linear-gradient(135deg, #22c55e, #16a34a)" : "rgba(255,255,255,0.04)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: isDone ? "0 0 18px rgba(34,197,94,0.5)" : "none",
                    transform: `scale(${isDone ? 1 : isLast ? 1 : 0.85 + checkS * 0.15})`,
                  }}>
                    {isDone && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12L10 17L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {isLast && (
                      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
                    )}
                  </div>

                  {/* Step number */}
                  <div style={{
                    fontFamily, fontWeight: 800, fontSize: 22,
                    color: isDone ? "rgba(34,197,94,0.7)" : isLast ? "rgba(255,255,255,0.3)" : "rgba(100,140,255,0.6)",
                    minWidth: 32,
                  }}>
                    {i + 1}
                  </div>

                  {/* Label */}
                  <div style={{
                    fontFamily, fontWeight: 700, fontSize: 34,
                    color: isDone ? "rgba(220,255,225,0.9)" : isLast ? "rgba(255,255,255,0.45)" : "rgba(215,228,255,0.95)",
                    letterSpacing: "0.01em",
                  }}>
                    {item}
                  </div>

                  {/* Done tag */}
                  {isDone && (
                    <div style={{ marginLeft: "auto", fontFamily, fontWeight: 700, fontSize: 18, color: "#4ade80", letterSpacing: "0.08em" }}>
                      ✓ FAIT
                    </div>
                  )}
                  {isLast && (
                    <div style={{ marginLeft: "auto", fontFamily, fontWeight: 700, fontSize: 18, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em" }}>
                      ● BIENTÔT
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div style={{
            opacity: ctaOp, transform: `translateY(${ctaY}px)`,
            textAlign: "center",
            fontFamily, fontWeight: 800, fontSize: 38,
            background: `linear-gradient(90deg, #ffffff, ${accentColor})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            letterSpacing: "0.02em",
          }}>
            {cta}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
