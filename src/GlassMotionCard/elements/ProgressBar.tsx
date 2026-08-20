import { Easing, interpolate, useCurrentFrame } from "remotion";

const EASING = Easing.bezier(0.16, 1, 0.3, 1);
const START_FRAME = 20;
const DURATION = 40;

export const ProgressBar: React.FC<{
  value: number;       // 0–100
  barWidth?: number;
  color?: string;
}> = ({ value, barWidth = 560, color = "#4a90ff" }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame - START_FRAME, [0, DURATION], [0, value / 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASING,
  });
  const opacity = interpolate(frame - START_FRAME, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const filledWidth = progress * barWidth;

  return (
    <div style={{ opacity, width: barWidth }}>
      <svg width={barWidth} height={44} viewBox={`0 0 ${barWidth} 44`}>
        <defs>
          <linearGradient id="barGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#88ccff" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
          <clipPath id="barClip">
            <rect x={0} y={0} width={barWidth} height={44} rx={22} />
          </clipPath>
        </defs>
        {/* Track */}
        <rect x={0} y={0} width={barWidth} height={44} rx={22} fill="rgba(255,255,255,0.08)" />
        {/* Fill */}
        <rect
          x={0}
          y={0}
          width={filledWidth}
          height={44}
          rx={22}
          fill="url(#barGrad)"
          clipPath="url(#barClip)"
        />
        {/* Shimmer highlight */}
        <rect
          x={0}
          y={0}
          width={filledWidth}
          height={22}
          rx={0}
          fill="rgba(255,255,255,0.12)"
          clipPath="url(#barClip)"
        />
      </svg>
    </div>
  );
};
