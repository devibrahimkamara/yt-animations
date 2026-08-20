import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["800", "700"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const iconPairSchema = z.object({
  leftIcon: z.string().default("🤖"),
  rightIcon: z.string().default("💰"),
  leftBadge: z.string().optional(),
  mode: z.enum(["spin", "pulse", "badge"]).default("pulse"),
  subtitle: z.string().optional(),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(3),
});

export type IconPairProps = z.infer<typeof iconPairSchema>;

export const IconPair: React.FC<IconPairProps> = ({
  leftIcon,
  rightIcon,
  leftBadge,
  mode,
  subtitle,
  accentColor,
  durationSecs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = durationSecs * fps;

  const fadeOut = interpolate(frame, [totalFrames - 10, totalFrames - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cardOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASING,
  });

  // Staggered icon entrances
  const leftScale = spring({ frame, fps, config: { damping: 13, stiffness: 185 }, delay: 4 });
  const rightScale = spring({ frame, fps, config: { damping: 13, stiffness: 185 }, delay: 14 });

  // Badge entrance
  const badgeScale = spring({ frame, fps, config: { damping: 11, stiffness: 200 }, delay: 26 });
  const badgeOpacity = interpolate(frame, [26, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Mode animations
  const spinDeg = (frame / totalFrames) * 360;
  const leftSpin = mode === "spin" ? spinDeg : 0;
  const rightSpin = mode === "spin" ? -spinDeg : 0;

  const pulseFactor = mode === "pulse" ? 1 + 0.07 * Math.sin(frame * 0.13) : 1;
  const rightPulseFactor = mode === "pulse" ? 1 + 0.07 * Math.sin(frame * 0.13 + Math.PI) : 1;

  const subtitleOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASING,
  });

  // Card glow pulse
  const cardGlow = 0.55 + 0.45 * Math.abs(Math.sin(frame * 0.09));

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: fadeOut,
        }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, rgba(20,40,120,0.55) 0%, rgba(10,20,60,0.45) 100%)`,
            border: `1px solid rgba(80,130,255,0.22)`,
            borderRadius: 32,
            padding: "64px 110px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 44,
            opacity: cardOpacity,
            boxShadow: `0 0 ${60 * cardGlow}px ${accentColor}28, 0 0 120px ${accentColor}12, inset 0 1px 0 rgba(255,255,255,0.08)`,
          }}
        >
          {/* Icons row */}
          <div style={{ display: "flex", alignItems: "center", gap: 56 }}>

            {/* Left icon with optional badge */}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  fontSize: 128,
                  lineHeight: 1,
                  transform: `scale(${leftScale * pulseFactor}) rotate(${leftSpin}deg)`,
                  filter: `drop-shadow(0 0 22px ${accentColor}60)`,
                  display: "block",
                }}
              >
                {leftIcon}
              </div>
              {leftBadge && (
                <div
                  style={{
                    position: "absolute",
                    top: -14,
                    right: -22,
                    fontSize: 52,
                    lineHeight: 1,
                    transform: `scale(${badgeScale})`,
                    opacity: badgeOpacity,
                    filter: "drop-shadow(0 0 10px rgba(239,68,68,0.9))",
                  }}
                >
                  {leftBadge}
                </div>
              )}
            </div>

            {/* Connector */}
            <div
              style={{
                fontFamily,
                fontWeight: 800,
                fontSize: 64,
                color: `${accentColor}70`,
                lineHeight: 1,
                filter: `drop-shadow(0 0 12px ${accentColor}40)`,
              }}
            >
              +
            </div>

            {/* Right icon */}
            <div
              style={{
                fontSize: 128,
                lineHeight: 1,
                transform: `scale(${rightScale * rightPulseFactor}) rotate(${rightSpin}deg)`,
                filter: `drop-shadow(0 0 22px ${accentColor}60)`,
              }}
            >
              {rightIcon}
            </div>
          </div>

          {/* Subtitle */}
          {subtitle && (
            <div
              style={{
                fontFamily,
                fontWeight: 700,
                fontSize: 34,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(136,170,255,0.9)",
                opacity: subtitleOpacity,
                filter: `drop-shadow(0 0 10px ${accentColor}40)`,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
