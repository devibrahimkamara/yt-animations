import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const fullWorkflowZoomSchema = z.object({
  steps: z.array(z.object({ label: z.string(), emoji: z.string(), color: z.string() })).default([
    { label: "Prospect", emoji: "🎯", color: "#3060ff" },
    { label: "Recherche", emoji: "🔍", color: "#8b5cf6" },
    { label: "Email", emoji: "✉️", color: "#ec4899" },
    { label: "Envoi", emoji: "📤", color: "#f59e0b" },
    { label: "Réponse", emoji: "💬", color: "#22c55e" },
    { label: "Partenariat", emoji: "🤝", color: "#06b6d4" },
    { label: "Argent", emoji: "💰", color: "#ffd700" },
  ]),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(9),
});

export type FullWorkflowZoomProps = z.infer<typeof fullWorkflowZoomSchema>;

const STEP_STAGGER = 22;
const STEPS_START = 10;

export const FullWorkflowZoom: React.FC<FullWorkflowZoomProps> = ({ steps, accentColor, durationSecs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const allStepsEnd = STEPS_START + steps.length * STEP_STAGGER + 20;

  // Zoom out to reveal full machine
  const zoomStart = allStepsEnd;
  const zoomProgress = interpolate(frame, [zoomStart, zoomStart + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });
  const containerScale = interpolate(zoomProgress, [0, 1], [1, 0.82], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Connection line illumination after zoom out
  const connectorProgress = interpolate(frame, [zoomStart + 30, zoomStart + 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />

      <AbsoluteFill style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        transform: `scale(${containerScale})`,
      }}>

        {/* Title */}
        <div style={{
          fontFamily, fontWeight: 800, fontSize: 28,
          color: "rgba(200,220,255,0.7)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          opacity: interpolate(frame, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          marginBottom: 8,
        }}>
          Système complet automatisé
        </div>

        {/* Steps row */}
        <div style={{ display: "flex", alignItems: "center", flexWrap: "nowrap", gap: 0 }}>
          {steps.map((step, i) => {
            const start = STEPS_START + i * STEP_STAGGER;
            const opacity = interpolate(frame, [start, start + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });
            const scale = spring({ frame: Math.max(0, frame - start), fps, config: { mass: 0.4, damping: 9, stiffness: 260 }, from: 0.6, to: 1 });

            const isLast = i === steps.length - 1;

            // Arrow between steps
            const arrowStart = start + 12;
            const arrowProgress = interpolate(frame, [arrowStart, arrowStart + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

            // Glow pulse after all revealed
            const glowPulse = frame >= allStepsEnd
              ? 0.6 + 0.4 * Math.abs(Math.sin(frame * 0.12 + i * 0.5))
              : 0.6;

            return (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                {/* Step node */}
                <div style={{
                  opacity,
                  transform: `scale(${scale})`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  background: isLast
                    ? "linear-gradient(135deg, rgba(80,60,0,0.8), rgba(50,35,0,0.7))"
                    : "linear-gradient(135deg, rgba(10,25,60,0.85), rgba(5,15,40,0.75))",
                  border: `1.5px solid ${step.color}${Math.round(glowPulse * 160).toString(16).padStart(2, '0')}`,
                  borderRadius: 16,
                  padding: "16px 18px",
                  minWidth: 108,
                  boxShadow: `0 0 ${20 * glowPulse}px ${step.color}25`,
                }}>
                  <span style={{ fontSize: 32 }}>{step.emoji}</span>
                  <div style={{
                    fontFamily, fontWeight: 800, fontSize: 15,
                    color: isLast ? "#ffd700" : "rgba(200,220,255,0.9)",
                    letterSpacing: "0.03em",
                    textAlign: "center",
                  }}>
                    {step.label}
                  </div>
                </div>

                {/* Arrow connector */}
                {!isLast && (
                  <svg width="44" height="30" viewBox="0 0 44 30" style={{ flexShrink: 0 }}>
                    <defs>
                      <marker id={`a${i}`} markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
                        <polygon points="0 0, 7 2.5, 0 5"
                          fill={step.color}
                          opacity={Math.min(arrowProgress * 1.5, 1) * (0.4 + connectorProgress * 0.5)}
                        />
                      </marker>
                    </defs>
                    <line
                      x1={0} y1={15}
                      x2={arrowProgress * 36} y2={15}
                      stroke={step.color}
                      strokeWidth={1.5 + connectorProgress * 1.5}
                      opacity={0.4 + connectorProgress * 0.5}
                      markerEnd={arrowProgress > 0.9 ? `url(#a${i})` : undefined}
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </div>
            );
          })}
        </div>

        {/* "La machine" label after zoom */}
        {frame >= zoomStart + 20 && (
          <div style={{
            opacity: interpolate(frame, [zoomStart + 20, zoomStart + 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING }),
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}>
            <div style={{
              fontFamily, fontWeight: 800, fontSize: 32,
              background: `linear-gradient(90deg, ${accentColor}, #ffffff, #ffd700)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.04em",
            }}>
              ⚙️ La machine est en marche
            </div>
            <div style={{
              fontFamily, fontWeight: 600, fontSize: 18,
              color: "rgba(136,170,255,0.6)",
              letterSpacing: "0.06em",
            }}>
              100% automatisé • Tourne en permanence
            </div>
          </div>
        )}

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
