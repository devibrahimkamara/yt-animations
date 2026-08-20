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

export const ctaCardSchema = z.object({
  linkText: z.string().default("👇 Lien dans la description"),
  badgeText: z.string().default("S'abonner"),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(5),
});

export type CTACardProps = z.infer<typeof ctaCardSchema>;

export const CTACard: React.FC<CTACardProps> = ({
  linkText,
  badgeText,
  accentColor,
  durationSecs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = durationSecs * fps;

  const fadeOut = interpolate(frame, [totalFrames - 14, totalFrames - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Card entrance
  const cardScale = spring({ frame, fps, config: { damping: 15, stiffness: 155 } });
  const cardOpacity = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASING,
  });

  // Arrow entrance + continuous bounce
  const arrowEntrance = spring({ frame, fps, config: { damping: 11, stiffness: 200 }, delay: 8 });
  const arrowBounce = frame > 28 ? Math.sin(frame * 0.13) * 14 : 0;

  // Link text entrance
  const linkOpacity = interpolate(frame, [18, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASING,
  });
  const linkY = interpolate(frame, [18, 38], [22, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASING,
  });

  // Badge entrance + pulse
  const badgeEntrance = spring({ frame, fps, config: { damping: 13, stiffness: 170 }, delay: 32 });
  const badgePulse = 1 + 0.055 * Math.abs(Math.sin(frame * 0.09));
  const badgeGlow = 0.5 + 0.5 * Math.abs(Math.sin(frame * 0.08));

  // Card glow pulse
  const cardGlow = 0.55 + 0.45 * Math.abs(Math.sin(frame * 0.07));

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
            padding: "64px 96px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 44,
            opacity: cardOpacity,
            transform: `scale(${cardScale})`,
            boxShadow: `0 0 ${60 * cardGlow}px ${accentColor}28, 0 0 120px ${accentColor}12, inset 0 1px 0 rgba(255,255,255,0.08)`,
          }}
        >
          {/* Bouncing arrow */}
          <div
            style={{
              transform: `translateY(${arrowBounce}px) scale(${arrowEntrance})`,
              filter: `drop-shadow(0 0 18px ${accentColor}90)`,
            }}
          >
            <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
              <path
                d="M34 8 L34 52 M18 36 L34 54 L50 36"
                stroke={accentColor}
                strokeWidth="5.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Link text */}
          <div
            style={{
              fontFamily,
              fontWeight: 800,
              fontSize: 54,
              letterSpacing: "-0.01em",
              color: "rgba(255,255,255,0.95)",
              opacity: linkOpacity,
              transform: `translateY(${linkY}px)`,
              textAlign: "center",
              filter: "drop-shadow(0 0 20px rgba(136,170,255,0.4))",
              lineHeight: 1.2,
            }}
          >
            {linkText}
          </div>

          {/* Subscribe badge */}
          <div
            style={{
              background: "linear-gradient(135deg, #c0392b 0%, #e74c3c 50%, #c0392b 100%)",
              borderRadius: 100,
              padding: "20px 52px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              transform: `scale(${badgeEntrance * badgePulse})`,
              boxShadow: `0 0 ${32 * badgeGlow}px rgba(231,76,60,0.65), 0 0 ${64 * badgeGlow}px rgba(231,76,60,0.25), inset 0 1px 0 rgba(255,255,255,0.15)`,
            }}
          >
            {/* Bell icon */}
            <svg width="30" height="30" viewBox="0 0 30 30" fill="white">
              <path d="M15 3C10 3 6 7 6 12v6l-2 2.5V22h22v-1.5L24 18v-6c0-5-4-9-9-9zm0 0zM12.5 23a2.5 2.5 0 005 0h-5z" />
            </svg>
            <span
              style={{
                fontFamily,
                fontWeight: 800,
                fontSize: 34,
                color: "#ffffff",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {badgeText}
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
