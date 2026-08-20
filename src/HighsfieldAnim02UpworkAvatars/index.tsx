import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASE = Easing.bezier(0.16, 1, 0.3, 1);
void EASE;

const AVATAR_COLORS = ["#14A800", "#2D8F5C", "#1B6B47", "#0D4D33", "#145C3D"];
const AVATAR_INITIALS = ["JD", "SM", "AL", "KP", "RB"];

export const highsfieldAnim02Schema = z.object({
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(4),
});

type Props = z.infer<typeof highsfieldAnim02Schema>;

export const HighsfieldAnim02UpworkAvatars: React.FC<Props> = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Phase 1: Upwork text (0–25)
  const titleSpring = spring({ frame, fps, config: { mass: 0.5, damping: 12, stiffness: 180 } });
  const titleOp = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const underlineWidth = interpolate(frame, [8, 28], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 3: badge (95–120)
  const badgeOp = interpolate(frame, [95, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const badgeY = interpolate(frame, [95, 112], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity: fadeOut }}>
      <AuroraBackground />

      <AbsoluteFill style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          background: "rgba(0,0,0,0.82)",
          border: "1.5px solid rgba(20,168,0,0.35)",
          borderRadius: 24,
          padding: "44px 64px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
          minWidth: 560,
          boxShadow: "0 0 40px rgba(20,168,0,0.12), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}>

          {/* Upwork title + underline */}
          <div style={{
            opacity: titleOp,
            transform: `scale(${0.85 + titleSpring * 0.15})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}>
            <span style={{
              fontFamily, fontWeight: 800, fontSize: 52,
              color: "#14A800",
              letterSpacing: "-0.01em",
            }}>
              Upwork
            </span>
            <div style={{
              height: 3,
              width: `${underlineWidth}%`,
              background: "linear-gradient(90deg, transparent, #14A800, transparent)",
              borderRadius: 2,
            }} />
          </div>

          {/* Avatar stack */}
          <div style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            height: 80,
          }}>
            {AVATAR_COLORS.map((color, i) => {
              const delay = 25 + i * 13;
              const avatarSpring = spring({ frame: frame - delay, fps, config: { mass: 0.5, damping: 12, stiffness: 200 } });
              const avatarOp = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <div key={i} style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: `radial-gradient(circle at 35% 35%, ${color}ee, ${color}88)`,
                  border: "3px solid rgba(0,0,0,0.6)",
                  marginLeft: i === 0 ? 0 : -18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: avatarOp,
                  transform: `scale(${avatarSpring}) translateY(${(1 - avatarSpring) * 20}px)`,
                  zIndex: i,
                  boxShadow: `0 4px 16px rgba(0,0,0,0.4)`,
                  position: "relative",
                }}>
                  <span style={{
                    fontFamily, fontWeight: 700, fontSize: 22,
                    color: "rgba(255,255,255,0.9)",
                    letterSpacing: "0.02em",
                  }}>
                    {AVATAR_INITIALS[i]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Badge "Talents payés" */}
          <div style={{
            opacity: badgeOp,
            transform: `translateY(${badgeY}px)`,
            background: "rgba(20,168,0,0.15)",
            border: "1.5px solid rgba(20,168,0,0.45)",
            borderRadius: 50,
            padding: "10px 28px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}>
            <span style={{ fontSize: 20 }}>✅</span>
            <span style={{
              fontFamily, fontWeight: 700, fontSize: 24,
              color: "#4ade80",
              letterSpacing: "0.04em",
            }}>
              Talents payés
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
