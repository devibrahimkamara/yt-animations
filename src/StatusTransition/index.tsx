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

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const statusTransitionSchema = z.object({
  errorText: z.string().default("BUG"),
  successText: z.string().default("RÉGLÉ"),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(4),
});

export type StatusTransitionProps = z.infer<typeof statusTransitionSchema>;

const ERROR_COLOR = "#ef4444";
const SUCCESS_COLOR = "#22c55e";

export const StatusTransition: React.FC<StatusTransitionProps> = ({
  errorText,
  successText,
  accentColor,
  durationSecs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = durationSecs * fps;

  // Switch to success at 48% of duration
  const midFrame = Math.floor(totalFrames * 0.48);
  const isSuccess = frame >= midFrame;

  // Flash around midpoint
  const flashOpacity = interpolate(
    frame,
    [midFrame - 3, midFrame, midFrame + 5, midFrame + 10],
    [0, 1, 0.8, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Error badge entrance
  const errorScale = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 190 },
    delay: 4,
  });

  // Success badge entrance (starts from midFrame)
  const successScale = spring({
    frame: frame - midFrame,
    fps,
    config: { damping: 11, stiffness: 175 },
  });

  const fadeOut = interpolate(frame, [totalFrames - 10, totalFrames - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const currentColor = isSuccess ? SUCCESS_COLOR : ERROR_COLOR;
  const currentText = isSuccess ? successText : errorText;
  const currentEmoji = isSuccess ? "✅" : "❌";
  const currentScale = isSuccess ? successScale : errorScale;

  // Subtle tint on background
  const tintOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASING,
  });

  // Pulsing glow on card
  const cardGlow = 0.6 + 0.4 * Math.abs(Math.sin(frame * 0.1));

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />

      {/* Colored tint overlay */}
      <AbsoluteFill
        style={{
          background: isSuccess
            ? `rgba(34, 197, 94, 0.07)`
            : `rgba(239, 68, 68, 0.07)`,
          opacity: tintOpacity,
        }}
      />

      {/* White flash */}
      <AbsoluteFill
        style={{
          background: "#ffffff",
          opacity: flashOpacity,
          pointerEvents: "none",
        }}
      />

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
            border: `1.5px solid ${currentColor}45`,
            borderRadius: 32,
            padding: "64px 96px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 36,
            transform: `scale(${currentScale})`,
            boxShadow: `0 0 ${60 * cardGlow}px ${currentColor}28, 0 0 120px ${currentColor}12, inset 0 1px 0 rgba(255,255,255,0.08)`,
          }}
        >
          {/* Emoji */}
          <div
            style={{
              fontSize: 112,
              lineHeight: 1,
              filter: `drop-shadow(0 0 24px ${currentColor}70)`,
            }}
          >
            {currentEmoji}
          </div>

          {/* Status text */}
          <div
            style={{
              fontFamily,
              fontWeight: 800,
              fontSize: 80,
              letterSpacing: "-0.025em",
              color: currentColor,
              filter: `drop-shadow(0 0 28px ${currentColor}80)`,
              lineHeight: 1,
            }}
          >
            {currentText}
          </div>

          {/* Accent line */}
          <div
            style={{
              width: 80,
              height: 4,
              borderRadius: 2,
              background: currentColor,
              boxShadow: `0 0 12px ${currentColor}90`,
              opacity: 0.7,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
