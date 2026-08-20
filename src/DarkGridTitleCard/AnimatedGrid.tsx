import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

const GRID_SIZE = 130;
const WARP_AMPLITUDE = 5;
const WARP_SPEED = 0.018;

function buildWarpedLine(
  isHorizontal: boolean,
  fixedCoord: number,
  width: number,
  height: number,
  frame: number,
  gridIndex: number
): string {
  const steps = isHorizontal ? Math.ceil(width / 8) : Math.ceil(height / 8);
  const points: [number, number][] = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const varying = t * (isHorizontal ? width : height);
    const phase = (varying / GRID_SIZE) * Math.PI * 2;
    const offset =
      Math.sin(phase + frame * WARP_SPEED + gridIndex * 0.4) * WARP_AMPLITUDE;

    if (isHorizontal) {
      points.push([varying, fixedCoord + offset]);
    } else {
      points.push([fixedCoord + offset, varying]);
    }
  }

  return points
    .map(([x, y], idx) => `${idx === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");
}

export const AnimatedGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const hLines: number[] = [];
  for (let y = GRID_SIZE; y < height; y += GRID_SIZE) hLines.push(y);

  const vLines: number[] = [];
  for (let x = GRID_SIZE; x < width; x += GRID_SIZE) vLines.push(x);

  return (
    <AbsoluteFill>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "absolute", inset: 0 }}
      >
        {hLines.map((y, i) => (
          <path
            key={`h-${i}`}
            d={buildWarpedLine(true, y, width, height, frame, i)}
            stroke="#6080b8"
            strokeWidth={0.9}
            fill="none"
            opacity={0.45}
          />
        ))}
        {vLines.map((x, i) => (
          <path
            key={`v-${i}`}
            d={buildWarpedLine(false, x, width, height, frame, i + hLines.length)}
            stroke="#6080b8"
            strokeWidth={0.9}
            fill="none"
            opacity={0.45}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
