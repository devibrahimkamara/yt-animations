import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);
const STEP_STAGGER = 18;

export const flowDiagramSchema = z.object({
  steps: z.array(z.object({
    label: z.string(),
    emoji: z.string().optional(),
    isReward: z.boolean().default(false),
  })),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(5),
});

export type FlowDiagramProps = z.infer<typeof flowDiagramSchema>;

const Arrow: React.FC<{ progress: number; color: string }> = ({ progress, color }) => {
  const w = 70;
  const drawn = progress * w;
  return (
    <svg width={w} height={50} viewBox={`0 0 ${w} 50`} style={{ flexShrink: 0 }}>
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill={color} opacity={progress} />
        </marker>
      </defs>
      <line
        x1={0} y1={25} x2={drawn} y2={25}
        stroke={color}
        strokeWidth={2.5}
        markerEnd={progress > 0.9 ? "url(#arrowhead)" : undefined}
        strokeLinecap="round"
      />
    </svg>
  );
};

export const FlowDiagram: React.FC<FlowDiagramProps> = ({ steps, accentColor, durationSecs }) => {
  const frame = useCurrentFrame();

  const containerOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", opacity: containerOpacity }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {steps.map((step, i) => {
            const stepStart = 10 + i * STEP_STAGGER;
            const opacity = interpolate(frame, [stepStart, stepStart + 15], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
            });
            const scale = interpolate(frame, [stepStart, stepStart + 15], [0.7, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
            });
            const arrowStart = stepStart + 10;
            const arrowProgress = interpolate(frame, [arrowStart, arrowStart + 15], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });

            const isLast = i === steps.length - 1;
            const glowColor = step.isReward ? "#ffd700" : accentColor;
            const borderColor = step.isReward ? "rgba(255,215,0,0.5)" : "rgba(80,130,255,0.35)";
            const bgColor = step.isReward
              ? "linear-gradient(135deg, rgba(120,90,0,0.6), rgba(80,60,0,0.5))"
              : "linear-gradient(135deg, rgba(20,40,120,0.65), rgba(10,20,60,0.55))";

            return (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                {/* Bulle étape */}
                <div
                  style={{
                    opacity,
                    transform: `scale(${scale})`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 260,
                    height: 260,
                    borderRadius: 32,
                    background: bgColor,
                    border: `1px solid ${borderColor}`,
                    boxShadow: `0 0 40px ${glowColor}25, 0 0 80px ${glowColor}10`,
                    gap: 12,
                  }}
                >
                  {step.emoji && (
                    <span style={{ fontSize: 72, lineHeight: 1 }}>{step.emoji}</span>
                  )}
                  <span
                    style={{
                      fontFamily,
                      fontWeight: 800,
                      fontSize: step.label.length > 10 ? 28 : step.label.length > 6 ? 34 : 42,
                      color: step.isReward ? "#ffd700" : "#ffffff",
                      textAlign: "center",
                      lineHeight: 1.2,
                      letterSpacing: "-0.01em",
                      padding: "0 16px",
                    }}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Flèche entre étapes */}
                {!isLast && (
                  <Arrow progress={arrowProgress} color={accentColor === "#3060ff" ? "rgba(136,170,255,0.8)" : accentColor} />
                )}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
