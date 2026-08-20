import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });

export const highsfieldAnim06Schema = z.object({
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(3.5),
});

type Props = z.infer<typeof highsfieldAnim06Schema>;

export const HighsfieldAnim06DesignersList: React.FC<Props> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Phase 1: container fades in (0–12)
  const containerOp = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 2: Designers row (12–45)
  const iconSpring1 = spring({ frame: frame - 12, fps, config: { mass: 0.5, damping: 14, stiffness: 180 } });
  const iconX1 = interpolate(iconSpring1, [0, 1], [-60, 0]);
  const textX1 = interpolate(iconSpring1, [0, 1], [60, 0]);
  const row1Op = interpolate(frame, [12, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 3: Motion Graphics row (45–80)
  const iconSpring2 = spring({ frame: frame - 45, fps, config: { mass: 0.5, damping: 14, stiffness: 180 } });
  const iconX2 = interpolate(iconSpring2, [0, 1], [-60, 0]);
  const textX2 = interpolate(iconSpring2, [0, 1], [60, 0]);
  const row2Op = interpolate(frame, [45, 58], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 4: clarification text (80–105)
  const clarOp = interpolate(frame, [80, 95], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const clarY = interpolate(frame, [80, 95], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity: fadeOut }}>
      <AuroraBackground />

      <AbsoluteFill style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          opacity: containerOp,
          background: "rgba(0,0,0,0.82)",
          border: "1.5px solid rgba(48,96,255,0.3)",
          borderRadius: 24,
          padding: "40px 60px",
          display: "flex",
          flexDirection: "column",
          gap: 28,
          minWidth: 520,
          boxShadow: "0 0 40px rgba(48,96,255,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}>

          {/* Row 1: Designers */}
          <div style={{
            opacity: row1Op,
            display: "flex",
            alignItems: "center",
            gap: 20,
            overflow: "hidden",
          }}>
            <span style={{
              fontSize: 36,
              transform: `translateX(${iconX1}px)`,
              display: "block",
            }}>🎨</span>
            <span style={{
              fontFamily, fontWeight: 600, fontSize: 28,
              color: "#ffffff",
              transform: `translateX(${textX1}px)`,
              display: "block",
            }}>Designers</span>
          </div>

          {/* Divider */}
          {frame >= 30 && (
            <div style={{
              height: 1,
              background: "rgba(255,255,255,0.08)",
              opacity: interpolate(frame, [30, 42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }} />
          )}

          {/* Row 2: Motion Graphics */}
          <div style={{
            opacity: row2Op,
            display: "flex",
            alignItems: "center",
            gap: 20,
            overflow: "hidden",
          }}>
            <span style={{
              fontSize: 36,
              transform: `translateX(${iconX2}px)`,
              display: "block",
              filter: `drop-shadow(0 0 6px ${accentColor}88)`,
            }}>🎬</span>
            <span style={{
              fontFamily, fontWeight: 600, fontSize: 28,
              color: "#ffffff",
              transform: `translateX(${textX2}px)`,
              display: "block",
            }}>Motion Graphics</span>
          </div>

          {/* Clarification text */}
          <div style={{
            opacity: clarOp,
            transform: `translateY(${clarY}px)`,
            fontFamily, fontWeight: 400, fontSize: 18,
            color: "#aaaaaa",
            textAlign: "center",
            letterSpacing: "0.02em",
          }}>
            = créateurs d&apos;animations vidéo
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
