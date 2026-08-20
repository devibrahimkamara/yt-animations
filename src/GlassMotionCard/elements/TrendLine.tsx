import { Easing, interpolate, useCurrentFrame } from "remotion";

const EASING = Easing.bezier(0.4, 0, 0.2, 1);
const START_FRAME = 15;
const DURATION = 45;

function buildPath(points: number[], w: number, h: number): string {
  if (points.length < 2) return "";
  const step = w / (points.length - 1);
  const coords = points.map((p, i) => [i * step, h - p * h * 0.85 - h * 0.05]);
  return coords
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
}

// Approximate total path length for a given set of points
function approxLength(points: number[], w: number, h: number): number {
  if (points.length < 2) return 0;
  const step = w / (points.length - 1);
  let len = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = step;
    const dy = (points[i] - points[i - 1]) * h * 0.85;
    len += Math.sqrt(dx * dx + dy * dy);
  }
  return len;
}

export const TrendLine: React.FC<{
  points: number[]; // normalized 0–1
  width?: number;
  height?: number;
  color?: string;
}> = ({ points, width = 380, height = 200, color = "rgba(200,220,255,0.85)" }) => {
  const frame = useCurrentFrame();
  const pathLength = approxLength(points, width, height);
  const drawn = interpolate(frame - START_FRAME, [0, DURATION], [0, pathLength], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASING,
  });
  const opacity = interpolate(frame - START_FRAME, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const d = buildPath(points, width, height);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ opacity, flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={1} />
        </linearGradient>
      </defs>
      <path
        d={d}
        fill="none"
        stroke="url(#lineGrad)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={pathLength}
        strokeDashoffset={pathLength - drawn}
      />
    </svg>
  );
};
