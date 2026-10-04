import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Lettre qui apparaît en cascade : translateY +offset → 0 + opacité 0 → 1 +
// léger scale, effet spring. `delay` en frames. Sert les Anims 1, 5, 8.
export const AnimatedLetter: React.FC<{
  char: string;
  delay: number;
  fontFamily: string;
  fontSize: number;
  color: string;
  offsetY?: number;
  fromScale?: number;
}> = ({ char, delay, fontFamily, fontSize, color, offsetY = 0, fromScale = 0.8 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 180, mass: 0.5 },
  });
  const y = interpolate(s, [0, 1], [offsetY, 0], { extrapolateRight: "clamp" });
  const scale = interpolate(s, [0, 1], [fromScale, 1], { extrapolateRight: "clamp" });

  return (
    <span
      style={{
        display: "inline-block",
        transform: `translateY(${y}px) scale(${scale})`,
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

// Découpe une chaîne et renvoie une rangée de lettres animées.
export const AnimatedWord: React.FC<{
  text: string;
  startDelay: number;
  letterDelay: number;
  fontFamily: string;
  fontSize: number;
  color: string;
  offsetY?: number;
  fromScale?: number;
}> = ({ text, startDelay, letterDelay, fontFamily, fontSize, color, offsetY, fromScale }) => (
  <span style={{ display: "inline-flex", whiteSpace: "pre" }}>
    {text.split("").map((char, i) => (
      <AnimatedLetter
        key={`${char}-${i}`}
        char={char}
        delay={startDelay + i * letterDelay}
        fontFamily={fontFamily}
        fontSize={fontSize}
        color={color}
        offsetY={offsetY}
        fromScale={fromScale}
      />
    ))}
  </span>
);
