import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const screenHighlightSchema = z.object({
  annotationText: z.string().default("Zone clé"),
  arrowDirection: z.enum(["left", "right", "up", "down"]).default("right"),
  boxColor: z.string().default("#FFD700"),
  centerX: z.number().default(0.5),
  centerY: z.number().default(0.5),
  boxWidth: z.number().default(380),
  boxHeight: z.number().default(54),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(3),
});

export type ScreenHighlightProps = z.infer<typeof screenHighlightSchema>;

const ARROW_SIZE = 52;
const ARROW_OFFSET = 36; // gap between box edge and arrow

const arrowAngles: Record<string, number> = {
  right: 0,
  down: 90,
  left: 180,
  up: 270,
};

export const ScreenHighlight: React.FC<ScreenHighlightProps> = ({
  annotationText,
  arrowDirection,
  boxColor,
  centerX,
  centerY,
  boxWidth,
  boxHeight,
  accentColor,
  durationSecs,
}) => {
  const frame = useCurrentFrame();
  const totalFrames = durationSecs * 30;

  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASING,
  });
  const fadeOut = interpolate(frame, [totalFrames - 10, totalFrames - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulsing glow
  const glowPulse = 0.55 + 0.45 * Math.abs(Math.sin(frame * 0.14));

  // Arrow blink
  const arrowOpacity = 0.45 + 0.55 * Math.abs(Math.sin(frame * 0.18));
  // Arrow bounce toward the box
  const arrowBounce = Math.sin(frame * 0.18) * 6;

  const rotation = arrowAngles[arrowDirection] ?? 0;

  // Arrow offset based on direction
  const arrowX = arrowDirection === "right"
    ? -(boxWidth / 2 + ARROW_OFFSET + ARROW_SIZE)
    : arrowDirection === "left"
    ? boxWidth / 2 + ARROW_OFFSET
    : 0;
  const arrowY = arrowDirection === "down"
    ? -(boxHeight / 2 + ARROW_OFFSET + ARROW_SIZE)
    : arrowDirection === "up"
    ? boxHeight / 2 + ARROW_OFFSET
    : 0;

  // Annotation pill — below the box by default
  const pillY = boxHeight / 2 + 20;

  const left = centerX * 1920;
  const top = centerY * 1080;

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      <div
        style={{
          position: "absolute",
          left,
          top,
          opacity: opacity * fadeOut,
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Highlight rectangle */}
        <div
          style={{
            position: "absolute",
            top: -boxHeight / 2,
            left: -boxWidth / 2,
            width: boxWidth,
            height: boxHeight,
            border: `3px solid ${boxColor}`,
            borderRadius: 8,
            boxShadow: `0 0 ${18 * glowPulse}px ${boxColor}90, inset 0 0 ${8 * glowPulse}px ${boxColor}25`,
            background: `${boxColor}08`,
          }}
        />

        {/* Corner accents */}
        {[
          { top: -boxHeight / 2 - 3, left: -boxWidth / 2 - 3 },
          { top: -boxHeight / 2 - 3, left: boxWidth / 2 - 14 },
          { top: boxHeight / 2 - 14, left: -boxWidth / 2 - 3 },
          { top: boxHeight / 2 - 14, left: boxWidth / 2 - 14 },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              ...pos,
              width: 16,
              height: 16,
              border: `3px solid ${boxColor}`,
              borderRadius: 2,
              background: "transparent",
              boxShadow: `0 0 6px ${boxColor}`,
            }}
          />
        ))}

        {/* Arrow */}
        <div
          style={{
            position: "absolute",
            top: arrowY - ARROW_SIZE / 2,
            left: arrowX - ARROW_SIZE / 2,
            opacity: arrowOpacity,
            transform: `rotate(${rotation}deg) translateX(${arrowBounce}px)`,
            transformOrigin: "center",
            filter: `drop-shadow(0 0 6px ${boxColor})`,
          }}
        >
          <svg width={ARROW_SIZE} height={ARROW_SIZE} viewBox="0 0 52 52" fill="none">
            <path
              d="M8 26 L44 26 M30 12 L44 26 L30 40"
              stroke={boxColor}
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Annotation pill */}
        {annotationText && (
          <div
            style={{
              position: "absolute",
              top: pillY,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(0,0,0,0.78)",
              backdropFilter: "blur(12px)",
              border: `1.5px solid ${boxColor}50`,
              borderRadius: 100,
              padding: "8px 20px",
              whiteSpace: "nowrap",
              fontFamily,
              fontWeight: 700,
              fontSize: 24,
              color: "rgba(255,255,255,0.95)",
              letterSpacing: "0.03em",
              boxShadow: `0 0 16px ${boxColor}35`,
            }}
          >
            <span style={{ color: boxColor, marginRight: 6 }}>▸</span>
            {annotationText}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
