import { useCurrentFrame, spring, interpolate } from "remotion";

export interface CheckpointProps {
  x: number;
  y: number;
  icon: React.ReactNode;
  label: string;
  labelSide: "above" | "below";
  appearFrame: number;
  fontFamily: string;
}

export const Checkpoint: React.FC<CheckpointProps> = ({
  x, y, icon, label, labelSide, appearFrame, fontFamily,
}) => {
  const frame = useCurrentFrame();
  const elapsed = frame - appearFrame;

  if (elapsed < 0) return null;

  const scale = spring({ frame: elapsed, fps: 30, config: { damping: 10, stiffness: 200 } });
  const labelOpacity = interpolate(Math.max(0, elapsed - 5), [0, 8], [0, 1], { extrapolateRight: "clamp" });

  // Ping ring expands from r=24 to r=52 over 18 frames
  const pingR = interpolate(elapsed, [0, 18], [24, 52], { extrapolateRight: "clamp" });
  const pingOpacity = interpolate(elapsed, [0, 18], [0.7, 0], { extrapolateRight: "clamp" });

  const RADIUS = 24;
  const labelOffset = RADIUS + 20;
  const labelY = labelSide === "above" ? y - labelOffset : y + labelOffset;
  const labelBaseline = labelSide === "above" ? "auto" : "hanging";

  return (
    <g>
      {/* Ping ring */}
      <circle
        cx={x}
        cy={y}
        r={pingR}
        fill="none"
        stroke="#3060ff"
        strokeWidth={2}
        opacity={pingOpacity}
      />

      {/* Circle + icon, scaled together */}
      <g style={{ transform: `translate(${x}px, ${y}px) scale(${scale})` }}>
        <circle cx={0} cy={0} r={RADIUS} fill="#3060ff" />
        {/* Icon: 24×24 content centered at (0,0) via translate(-12,-12) */}
        <g transform="translate(-12 -12)" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          {icon}
        </g>
      </g>

      {/* Label */}
      <text
        x={x}
        y={labelY}
        textAnchor="middle"
        dominantBaseline={labelBaseline}
        fill="rgba(136,170,255,0.92)"
        fontFamily={fontFamily}
        fontWeight={600}
        fontSize={18}
        opacity={labelOpacity}
      >
        {label}
      </text>
    </g>
  );
};
