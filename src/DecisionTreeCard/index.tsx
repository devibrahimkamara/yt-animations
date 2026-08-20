import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const decisionTreeCardSchema = z.object({
  startLabel: z.string().default("START"),
  paths: z.array(z.object({
    label: z.string(),
    sublabel: z.string().optional(),
    isHighlighted: z.boolean().default(false),
  })).default([
    { label: "Grande audience", sublabel: "Les marques viennent à toi", isHighlighted: false },
    { label: "Agence", sublabel: "20–25% de commission", isHighlighted: false },
    { label: "Prospection directe", sublabel: "✅ La meilleure option", isHighlighted: true },
  ]),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(5),
});

export type DecisionTreeCardProps = z.infer<typeof decisionTreeCardSchema>;

export const DecisionTreeCard: React.FC<DecisionTreeCardProps> = ({
  startLabel, paths, accentColor, durationSecs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // START node appears at 0
  const startOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });
  const startScale = spring({ frame, fps, config: { mass: 0.5, damping: 12, stiffness: 200 }, from: 0.6, to: 1 });

  // Vertical line draws down (frame 18 → 38)
  const vertLineH = interpolate(frame, [18, 38], [0, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Horizontal bar appears (frame 38 → 52)
  const horizBarW = interpolate(frame, [38, 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Each path appears with stagger
  const pathStagger = 15;
  const pathsStartFrame = 52;

  // Highlight dim appears near end
  const highlightFrame = pathsStartFrame + paths.length * pathStagger + 20;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />

      <AbsoluteFill style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 40,
      }}>

        {/* START node */}
        <div style={{
          opacity: startOpacity,
          transform: `scale(${startScale})`,
          background: `linear-gradient(135deg, ${accentColor}, rgba(80,160,255,0.9))`,
          borderRadius: 16,
          padding: "16px 48px",
          boxShadow: `0 0 40px ${accentColor}40`,
        }}>
          <div style={{ fontFamily, fontWeight: 800, fontSize: 32, color: "#fff", letterSpacing: "0.12em" }}>
            {startLabel}
          </div>
        </div>

        {/* Vertical line down */}
        <div style={{
          width: 3,
          height: vertLineH,
          background: `linear-gradient(to bottom, ${accentColor}80, rgba(80,130,255,0.4))`,
          borderRadius: 2,
        }} />

        {/* Horizontal bar spanning 3 paths */}
        <div style={{
          position: "relative",
          width: 900,
          height: 3,
          background: `linear-gradient(90deg, transparent, rgba(80,130,255,0.4) ${50 - horizBarW * 50}%, rgba(80,130,255,0.4) ${50 + horizBarW * 50}%, transparent)`,
          overflow: "visible",
        }}>
          {/* Path connectors drop down */}
          {paths.map((path, i) => {
            const xPositions = [-340, 0, 340];
            const x = xPositions[i] || 0;
            const pathFrame = pathsStartFrame + i * pathStagger;
            const pathOpacity = interpolate(frame, [pathFrame, pathFrame + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });
            const pathY = interpolate(frame, [pathFrame, pathFrame + 14], [-10, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });

            const isHighlighted = path.isHighlighted;
            // Dim non-highlighted after highlight frame
            const dimOpacity = !isHighlighted && frame >= highlightFrame
              ? interpolate(frame, [highlightFrame, highlightFrame + 20], [1, 0.25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
              : 1;

            // Pulse for highlighted
            const pulseScale = isHighlighted && frame >= highlightFrame
              ? 1 + 0.03 * Math.sin(frame * 0.2)
              : 1;

            return (
              <div key={i} style={{
                position: "absolute",
                left: "50%",
                top: 0,
                transform: `translateX(calc(-50% + ${x}px)) translateY(${pathY}px)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                opacity: pathOpacity * dimOpacity,
              }}>
                {/* Vertical drop line */}
                <div style={{
                  width: 3,
                  height: 40,
                  background: isHighlighted ? "#22c55e80" : `${accentColor}50`,
                  borderRadius: 2,
                }} />

                {/* Path node */}
                <div style={{
                  background: isHighlighted
                    ? "linear-gradient(135deg, rgba(10,60,25,0.9), rgba(5,40,15,0.85))"
                    : "linear-gradient(135deg, rgba(15,30,80,0.8), rgba(10,20,50,0.75))",
                  border: `1.5px solid ${isHighlighted ? "rgba(34,197,94,0.6)" : "rgba(80,130,255,0.3)"}`,
                  borderRadius: 16,
                  padding: "20px 28px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  minWidth: 240,
                  boxShadow: isHighlighted ? "0 0 40px rgba(34,197,94,0.3)" : "none",
                  transform: `scale(${pulseScale})`,
                }}>
                  <div style={{
                    fontFamily, fontWeight: 800,
                    fontSize: isHighlighted ? 26 : 24,
                    color: isHighlighted ? "#22c55e" : "rgba(180,200,255,0.9)",
                    letterSpacing: "0.03em",
                    textAlign: "center",
                  }}>
                    {i + 1}. {path.label}
                  </div>
                  {path.sublabel && (
                    <div style={{
                      fontFamily, fontWeight: 600,
                      fontSize: 16,
                      color: isHighlighted ? "rgba(100,220,140,0.8)" : "rgba(120,150,220,0.65)",
                      textAlign: "center",
                    }}>
                      {path.sublabel}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
