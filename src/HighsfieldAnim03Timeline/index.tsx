import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

export const highsfieldAnim03Schema = z.object({
  accentColor: z.string().default("#ef4444"),
  durationSecs: z.number().default(3.5),
});

type Props = z.infer<typeof highsfieldAnim03Schema>;

const LINE_W = 700;
const LINE_Y = 540;
const LINE_X_START = 610;
const LINE_X_END = LINE_X_START + LINE_W;

export const HighsfieldAnim03Timeline: React.FC<Props> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Phase 1: line draws (0–20)
  const lineProgress = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const lineLength = LINE_W;
  const lineDash = lineLength;
  const lineOffset = lineDash * (1 - lineProgress);

  // Phase 2: endpoint circles (15–35)
  const leftDotSpring = spring({ frame: frame - 15, fps, config: { mass: 0.4, damping: 10, stiffness: 260 } });
  const rightDotSpring = spring({ frame: frame - 22, fps, config: { mass: 0.4, damping: 10, stiffness: 260 } });

  // Phase 3: marker slides (35–80)
  const markerProgress = interpolate(frame, [35, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const markerX = LINE_X_START + markerProgress * LINE_W;

  // colored trail progress
  const trailWidth = markerProgress * LINE_W;

  // label "il y a 3 semaines" appears at frame 35
  const pastLabelOp = interpolate(frame, [35, 48], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 4: arrival (80–105)
  const markerPulse = frame >= 80 ? 1 + Math.sin((frame - 80) * 0.25) * 0.12 : 1;
  const todayLabelOp = interpolate(frame, [80, 95], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const todayLabelY = interpolate(frame, [80, 95], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity: fadeOut }}>
      <AuroraBackground />

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* Gray base line */}
        <line
          x1={LINE_X_START} y1={LINE_Y}
          x2={LINE_X_END} y2={LINE_Y}
          stroke="#444" strokeWidth={4} strokeLinecap="round"
          strokeDasharray={lineDash}
          strokeDashoffset={lineOffset}
        />
        {/* Colored progress trail */}
        {frame >= 35 && (
          <line
            x1={LINE_X_START} y1={LINE_Y}
            x2={LINE_X_START + trailWidth} y2={LINE_Y}
            stroke={accentColor} strokeWidth={4} strokeLinecap="round"
          />
        )}

        {/* Left endpoint circle */}
        <circle
          cx={LINE_X_START} cy={LINE_Y} r={10 * leftDotSpring}
          fill="#666"
        />
        {/* Right endpoint circle */}
        <circle
          cx={LINE_X_END} cy={LINE_Y} r={10 * rightDotSpring}
          fill={accentColor}
        />

        {/* Sliding marker */}
        {frame >= 35 && (
          <circle
            cx={markerX} cy={LINE_Y} r={16 * markerPulse}
            fill="#fff"
            filter={frame >= 80 ? `drop-shadow(0 0 8px ${accentColor})` : undefined}
          />
        )}

        {/* "il y a 3 semaines" label above left point */}
        {frame >= 35 && (
          <text
            x={LINE_X_START} y={LINE_Y - 40}
            textAnchor="middle"
            fontFamily={fontFamily}
            fontWeight={600}
            fontSize={24}
            fill="rgba(200,200,200,0.85)"
            opacity={pastLabelOp}
          >
            il y a 3 semaines
          </text>
        )}

        {/* "AUJOURD'HUI" label */}
        {frame >= 80 && (
          <text
            x={LINE_X_END} y={LINE_Y - 44 + todayLabelY}
            textAnchor="middle"
            fontFamily={fontFamily}
            fontWeight={700}
            fontSize={28}
            fill={accentColor}
            opacity={todayLabelOp}
          >
            AUJOURD&apos;HUI
          </text>
        )}
      </svg>
    </AbsoluteFill>
  );
};
