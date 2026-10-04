import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Lettre qui apparaît en cascade (Anim 1 « BUSINESS »).
// translateY +20 → 0 + opacité 0 → 1, effet spring. `delay` en frames.
export const AnimatedLetter: React.FC<{
  char: string;
  delay: number;
  fontFamily: string;
  fontSize: number;
  color: string;
}> = ({ char, delay, fontFamily, fontSize, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 180, mass: 0.5 },
  });
  const y = interpolate(s, [0, 1], [20, 0], { extrapolateRight: "clamp" });

  return (
    <span
      style={{
        display: "inline-block",
        transform: `translateY(${y}px)`,
        opacity: s,
        fontFamily,
        fontWeight: 800,
        fontSize,
        color,
        whiteSpace: "pre",
      }}
    >
      {char}
    </span>
  );
};
