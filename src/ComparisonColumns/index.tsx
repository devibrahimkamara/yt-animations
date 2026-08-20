import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const comparisonColumnsSchema = z.object({
  leftTitle: z.string().default("CHATGPT"),
  leftItems: z.array(z.string()).default(["Idées", "Emails", "Réponses"]),
  rightTitle: z.string().default("AGENT IA"),
  rightItems: z.array(z.string()).default(["Prospecte", "Écrit", "Envoie", "Analyse", "Automatise"]),
  highlightRight: z.boolean().default(true),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(5),
});

export type ComparisonColumnsProps = z.infer<typeof comparisonColumnsSchema>;

const STAGGER = 16;

export const ComparisonColumns: React.FC<ComparisonColumnsProps> = ({
  leftTitle, leftItems, rightTitle, rightItems, highlightRight, accentColor, durationSecs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const containerOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Left column starts at frame 8, right at frame 12
  const leftTitleOpacity = interpolate(frame, [8, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });
  const rightTitleOpacity = interpolate(frame, [12, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });

  // Big checkmark appears near end
  const checkStart = 10 + Math.max(leftItems.length, rightItems.length) * STAGGER + 20;
  const checkScale = spring({ frame: Math.max(0, frame - checkStart), fps, config: { mass: 0.4, damping: 8, stiffness: 280 }, from: 0, to: 1 });
  const checkOpacity = interpolate(frame, [checkStart, checkStart + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />

      <AbsoluteFill style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: containerOpacity,
        padding: "0 100px",
        gap: 60,
      }}>

        {/* Left column - ChatGPT */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 20,
          background: "rgba(30,30,30,0.5)",
          border: "1px solid rgba(150,150,150,0.2)",
          borderRadius: 24,
          padding: "40px 48px",
          boxShadow: "0 0 40px rgba(100,100,100,0.15)",
        }}>
          <div style={{
            fontFamily, fontWeight: 800, fontSize: 36,
            color: "rgba(200,200,200,0.9)",
            letterSpacing: "0.06em",
            opacity: leftTitleOpacity,
            marginBottom: 8,
          }}>
            {leftTitle}
          </div>
          {leftItems.map((item, i) => {
            const start = 20 + i * STAGGER;
            const opacity = interpolate(frame, [start, start + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });
            const x = interpolate(frame, [start, start + 12], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, opacity, transform: `translateX(${x}px)` }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: "rgba(150,150,150,0.6)",
                  flexShrink: 0,
                }} />
                <div style={{ fontFamily, fontWeight: 700, fontSize: 26, color: "rgba(180,180,180,0.85)" }}>
                  {item}
                </div>
              </div>
            );
          })}
        </div>

        {/* VS divider */}
        <div style={{
          fontFamily, fontWeight: 800, fontSize: 28,
          color: "rgba(100,100,100,0.5)",
          letterSpacing: "0.1em",
          flexShrink: 0,
          opacity: interpolate(frame, [15, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          VS
        </div>

        {/* Right column - Agent IA */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 20,
          background: highlightRight ? `linear-gradient(135deg, rgba(15,40,100,0.7), rgba(10,25,60,0.6))` : "rgba(30,30,30,0.5)",
          border: `1px solid ${highlightRight ? `rgba(80,130,255,0.45)` : "rgba(150,150,150,0.2)"}`,
          borderRadius: 24,
          padding: "40px 48px",
          boxShadow: highlightRight ? `0 0 60px ${accentColor}25` : "none",
          position: "relative",
        }}>
          <div style={{
            fontFamily, fontWeight: 800, fontSize: 36,
            color: highlightRight ? "#ffffff" : "rgba(200,200,200,0.9)",
            letterSpacing: "0.06em",
            opacity: rightTitleOpacity,
            marginBottom: 8,
          }}>
            {rightTitle}
          </div>
          {rightItems.map((item, i) => {
            const start = 24 + i * STAGGER;
            const opacity = interpolate(frame, [start, start + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });
            const x = interpolate(frame, [start, start + 12], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, opacity, transform: `translateX(${x}px)` }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: accentColor,
                  flexShrink: 0,
                  boxShadow: `0 0 6px ${accentColor}80`,
                }} />
                <div style={{ fontFamily, fontWeight: 700, fontSize: 26, color: "rgba(220,235,255,0.9)" }}>
                  {item}
                </div>
              </div>
            );
          })}

          {/* Big checkmark */}
          {highlightRight && (
            <div style={{
              position: "absolute",
              bottom: -20,
              right: -20,
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: `linear-gradient(135deg, #22c55e, #16a34a)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: checkOpacity,
              transform: `scale(${checkScale})`,
              boxShadow: "0 0 30px rgba(34,197,94,0.6)",
            }}>
              <span style={{ fontSize: 38, color: "#fff", fontWeight: 800 }}>✓</span>
            </div>
          )}
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
