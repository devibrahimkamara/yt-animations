import { Easing, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

const EASING = Easing.bezier(0.16, 1, 0.3, 1);
const DELAY = 15;
const DURATION = 22;
const COLOR = "rgba(100, 160, 255, 0.75)";

function hashVariant(title: string): 0 | 1 | 2 {
  const sum = title.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return (sum % 3) as 0 | 1 | 2;
}

// Variant 0: horizontal line that expands left→right under the title
const UnderlineExpand: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const lineWidth = 480;
  const progress = interpolate(frame - DELAY, [0, DURATION], [0, lineWidth], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASING,
  });
  const opacity = interpolate(frame - DELAY, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg
      width={width}
      height={4}
      style={{ position: "absolute", left: 0, top: "calc(50% + 82px)", overflow: "visible" }}
    >
      <line
        x1={(width - progress) / 2}
        y1={0}
        x2={(width + progress) / 2}
        y2={0}
        stroke={COLOR}
        strokeWidth={1.5}
        opacity={opacity}
      />
    </svg>
  );
};

// Variant 1: two short vertical bars flanking the subtitle, sliding outward
const SideBars: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const barHeight = 56;
  const startX = width / 2;
  const targetOffset = 360;

  const offset = interpolate(frame - DELAY, [0, DURATION], [0, targetOffset], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASING,
  });
  const opacity = interpolate(frame - DELAY, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const heightProgress = interpolate(frame - DELAY, [0, DURATION], [0, barHeight], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASING,
  });

  const centerY = "calc(50% + 8px)";

  return (
    <>
      {/* Left bar */}
      <svg
        width={4}
        height={barHeight}
        style={{
          position: "absolute",
          left: startX - offset - 2,
          top: centerY,
          transform: "translateY(-50%)",
          overflow: "visible",
          opacity,
        }}
      >
        <rect x={0} y={(barHeight - heightProgress) / 2} width={1.5} height={heightProgress} fill={COLOR} />
      </svg>
      {/* Right bar */}
      <svg
        width={4}
        height={barHeight}
        style={{
          position: "absolute",
          left: startX + offset - 2,
          top: centerY,
          transform: "translateY(-50%)",
          overflow: "visible",
          opacity,
        }}
      >
        <rect x={0} y={(barHeight - heightProgress) / 2} width={1.5} height={heightProgress} fill={COLOR} />
      </svg>
    </>
  );
};

// Variant 2: 4 small L-shaped corner ticks around the title block
const CornerTicks: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const tickLen = 28;
  const blockW = 900;
  const blockH = 180;
  const cx = width / 2;
  const cy = 540;

  const progress = interpolate(frame - DELAY, [0, DURATION], [0, tickLen], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASING,
  });
  const opacity = interpolate(frame - DELAY, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const hw = blockW / 2;
  const hh = blockH / 2;

  // Each L = two lines meeting at a corner
  const corners: [number, number, number, number, number, number, number, number][] = [
    // [cx, cy, hx, hy, dx, dy] — corner point + two end points for the L
    // top-left
    [cx - hw, cy - hh, cx - hw + progress, cy - hh, cx - hw, cy - hh + progress],
    // top-right
    [cx + hw, cy - hh, cx + hw - progress, cy - hh, cx + hw, cy - hh + progress],
    // bottom-left
    [cx - hw, cy + hh, cx - hw + progress, cy + hh, cx - hw, cy + hh - progress],
    // bottom-right
    [cx + hw, cy + hh, cx + hw - progress, cy + hh, cx + hw, cy + hh - progress],
  ] as any;

  return (
    <svg
      width={width}
      height={1080}
      style={{ position: "absolute", inset: 0, opacity }}
    >
      {corners.map(([px, py, lx1, ly1, lx2, ly2]: number[], i) => (
        <g key={i}>
          <line x1={px} y1={py} x2={lx1} y2={ly1} stroke={COLOR} strokeWidth={1.5} />
          <line x1={px} y1={py} x2={lx2} y2={ly2} stroke={COLOR} strokeWidth={1.5} />
        </g>
      ))}
    </svg>
  );
};

export const AccentDecoration: React.FC<{ title: string }> = ({ title }) => {
  const variant = hashVariant(title);
  return (
    <Sequence from={DELAY} layout="none">
      {variant === 0 && <UnderlineExpand />}
      {variant === 1 && <SideBars />}
      {variant === 2 && <CornerTicks />}
    </Sequence>
  );
};
