import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

export const highsfieldAnim08Schema = z.object({
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(4),
});

type Props = z.infer<typeof highsfieldAnim08Schema>;

// Chart bounds
const CHART_L = 280;
const CHART_R = 1640;
const CHART_T = 200;
const CHART_B = 800;
const CHART_W = CHART_R - CHART_L;
const CHART_H = CHART_B - CHART_T;

// Cubic Bézier path: from upper-left to lower-right with steep drop near end
const P0 = { x: CHART_L, y: CHART_T + 40 };
const P1 = { x: CHART_L + CHART_W * 0.35, y: CHART_T + 80 };
const P2 = { x: CHART_L + CHART_W * 0.65, y: CHART_B - 120 };
const P3 = { x: CHART_R, y: CHART_B - 20 };

const CURVE_PATH = `M ${P0.x},${P0.y} C ${P1.x},${P1.y} ${P2.x},${P2.y} ${P3.x},${P3.y}`;
// Rough perimeter for dasharray
const CURVE_LEN = 1600;

export const HighsfieldAnim08CostCurve: React.FC<Props> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Phase 1: axes draw (0–15)
  const axisProgress = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const labelOp = interpolate(frame, [8, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 2: curve draws (15–85)
  const curveProgress = interpolate(frame, [15, 85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const curveDash = CURVE_LEN;
  const curveOffset = curveDash * (1 - curveProgress);

  // Phase 3: endpoint red dot (85–105)
  const dotSpring = spring({ frame: frame - 85, fps, config: { mass: 0.4, damping: 9, stiffness: 260 } });
  const dotOp = interpolate(frame, [85, 95], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dottedLineH = interpolate(frame, [88, 102], [0, P3.y - CHART_T], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 4: synthesis text (105–120)
  const textOp = interpolate(frame, [105, 118], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textY = interpolate(frame, [105, 118], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const xAxisW = CHART_W * axisProgress;
  const yAxisH = CHART_H * axisProgress;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity: fadeOut }}>
      <AuroraBackground />

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="curveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={accentColor} stopOpacity={0.9} />
            <stop offset="100%" stopColor="#818cf8" stopOpacity={0.9} />
          </linearGradient>
          <linearGradient id="fillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={accentColor} stopOpacity={0.35} />
            <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
          </linearGradient>
          <clipPath id="curveClip">
            <rect x={CHART_L} y={CHART_T} width={CHART_W * curveProgress} height={CHART_H + 20} />
          </clipPath>
        </defs>

        {/* Y axis */}
        <line
          x1={CHART_L} y1={CHART_T}
          x2={CHART_L} y2={CHART_T + yAxisH}
          stroke="rgba(255,255,255,0.35)" strokeWidth={2.5} strokeLinecap="round"
        />
        {/* X axis */}
        <line
          x1={CHART_L} y1={CHART_B}
          x2={CHART_L + xAxisW} y2={CHART_B}
          stroke="rgba(255,255,255,0.35)" strokeWidth={2.5} strokeLinecap="round"
        />

        {/* Axis labels */}
        <text x={CHART_L + 20} y={CHART_B + 44} fontFamily={fontFamily} fontSize={22} fontWeight={600} fill="#aaaaaa" opacity={labelOp}>
          Il y a 2 ans
        </text>
        <text x={CHART_R - 10} y={CHART_B + 44} textAnchor="end" fontFamily={fontFamily} fontSize={22} fontWeight={600} fill="#aaaaaa" opacity={labelOp}>
          Aujourd&apos;hui
        </text>
        <text x={CHART_L - 20} y={CHART_T + 10} textAnchor="end" fontFamily={fontFamily} fontSize={20} fontWeight={600} fill="#aaaaaa" opacity={labelOp}>
          Coût
        </text>

        {/* Area fill under curve */}
        {frame >= 15 && (
          <path
            d={`${CURVE_PATH} L ${P3.x},${CHART_B} L ${P0.x},${CHART_B} Z`}
            fill="url(#fillGrad)"
            clipPath="url(#curveClip)"
          />
        )}

        {/* Curve itself */}
        {frame >= 15 && (
          <path
            d={CURVE_PATH}
            fill="none"
            stroke="url(#curveGrad)"
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={curveDash}
            strokeDashoffset={curveOffset}
          />
        )}

        {/* Vertical dotted line at endpoint */}
        {frame >= 88 && (
          <line
            x1={P3.x} y1={P3.y}
            x2={P3.x} y2={P3.y - dottedLineH}
            stroke="#ef4444" strokeWidth={2}
            strokeDasharray="6 6" opacity={0.6}
          />
        )}

        {/* Red endpoint dot */}
        {frame >= 85 && (
          <circle
            cx={P3.x} cy={P3.y}
            r={14 * dotSpring}
            fill="#ef4444"
            opacity={dotOp}
            filter={`drop-shadow(0 0 8px #ef4444)`}
          />
        )}

        {/* Synthesis text */}
        {frame >= 105 && (
          <text
            x={960} y={920 + textY}
            textAnchor="middle"
            fontFamily={fontFamily} fontSize={32} fontWeight={700}
            fill="#ffffff"
            opacity={textOp}
          >
            Une fraction du prix
          </text>
        )}
      </svg>
    </AbsoluteFill>
  );
};
