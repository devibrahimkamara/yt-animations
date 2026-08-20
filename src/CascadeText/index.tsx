import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["800", "600"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const cascadeTextSchema = z.object({
  lines: z.array(z.string()).default([
    "Donner des idées.",
    "Écrire des emails.",
    "C'est bien... mais c'est basique.",
  ]),
  highlight: z.string().optional(),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(4),
});

export type CascadeTextProps = z.infer<typeof cascadeTextSchema>;

const STAGGER = 14; // frames between each line entrance
const ENTRANCE_DURATION = 18; // frames for a single line to enter

export const CascadeText: React.FC<CascadeTextProps> = ({
  lines,
  highlight,
  accentColor,
  durationSecs,
}) => {
  const frame = useCurrentFrame();
  const totalFrames = durationSecs * 30;

  const fadeOut = interpolate(frame, [totalFrames - 14, totalFrames - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Font size scales down if more lines
  const fontSize = lines.length <= 2 ? 92 : lines.length === 3 ? 76 : 62;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AuroraBackground />

      {/* Decorative horizontal rule */}
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
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 24,
            padding: "0 180px",
            maxWidth: 1600,
          }}
        >
          {lines.map((line, i) => {
            const startFrame = i * STAGGER;

            const lineOpacity = interpolate(
              frame,
              [startFrame, startFrame + ENTRANCE_DURATION],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING }
            );
            const lineY = interpolate(
              frame,
              [startFrame, startFrame + ENTRANCE_DURATION],
              [36, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING }
            );

            const isHighlighted = !!highlight && line.includes(highlight);
            const isLast = i === lines.length - 1;

            // Left accent bar for last highlighted line
            const accentBarOpacity = interpolate(
              frame,
              [startFrame + ENTRANCE_DURATION, startFrame + ENTRANCE_DURATION + 8],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  opacity: lineOpacity,
                  transform: `translateY(${lineY}px)`,
                }}
              >
                {/* Accent bar for last/highlighted line */}
                {(isLast || isHighlighted) && (
                  <div
                    style={{
                      width: 6,
                      height: fontSize * 0.9,
                      borderRadius: 3,
                      background: `linear-gradient(180deg, ${accentColor}, ${accentColor}60)`,
                      boxShadow: `0 0 12px ${accentColor}80`,
                      opacity: accentBarOpacity,
                      flexShrink: 0,
                    }}
                  />
                )}

                <span
                  style={{
                    fontFamily,
                    fontWeight: 800,
                    fontSize,
                    letterSpacing: "-0.025em",
                    lineHeight: 1.15,
                    color: isHighlighted
                      ? accentColor
                      : isLast
                      ? "rgba(255,255,255,0.7)"
                      : "rgba(255,255,255,0.95)",
                    filter: isHighlighted
                      ? `drop-shadow(0 0 24px ${accentColor}90)`
                      : isLast
                      ? "none"
                      : "drop-shadow(0 0 16px rgba(136,170,255,0.25))",
                  }}
                >
                  {line}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
