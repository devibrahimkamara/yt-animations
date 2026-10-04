import { interpolate, useCurrentFrame } from "remotion";
import { ACCENT, INK, NEUTRAL_LINE } from "./theme";

// Ligne qui relie deux nœuds d'un pipeline (Anim 6) : trait gris permanent,
// puis tronçon accent qui se trace de gauche à droite (strokeDashoffset) avec
// un point lumineux à glow qui parcourt le tracé en même temps.
export const ConnectorLine: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  startFrame: number;
  drawDuration: number;
  frameW?: number;
  frameH?: number;
}> = ({ x1, y1, x2, y2, startFrame, drawDuration, frameW = 1920, frameH = 1080 }) => {
  const frame = useCurrentFrame();
  const len = Math.hypot(x2 - x1, y2 - y1);

  const progress = interpolate(frame, [startFrame, startFrame + drawDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const px = x1 + (x2 - x1) * progress;
  const py = y1 + (y2 - y1) * progress;

  return (
    <svg
      width={frameW}
      height={frameH}
      viewBox={`0 0 ${frameW} ${frameH}`}
      style={{ position: "absolute", left: 0, top: 0 }}
    >
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={NEUTRAL_LINE} strokeWidth={4} />
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={ACCENT}
        strokeWidth={6}
        strokeDasharray={len}
        strokeDashoffset={len * (1 - progress)}
        style={{ filter: `drop-shadow(0 0 10px ${ACCENT})` }}
      />
      {progress > 0 && progress < 1 && (
        <circle
          cx={px}
          cy={py}
          r={13}
          fill={INK}
          style={{ filter: `drop-shadow(0 0 20px ${ACCENT})` }}
        />
      )}
    </svg>
  );
};
