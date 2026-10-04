import { interpolate, useCurrentFrame } from "remotion";

// Reveal d'un bloc de texte : fade + léger translateY vers le haut.
// `accent` change la couleur pour marquer un contraste (Anim 8 : 2e ligne).
export const RevealText: React.FC<{
  text: string;
  startFrame: number;
  durationInFrames?: number;
  fontFamily: string;
  fontSize: number;
  color: string;
  weight?: number;
  offsetY?: number;
  style?: React.CSSProperties;
}> = ({
  text,
  startFrame,
  durationInFrames = 10,
  fontFamily,
  fontSize,
  color,
  weight = 800,
  offsetY = 15,
  style,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [startFrame, startFrame + durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity: t,
        transform: `translateY(${interpolate(t, [0, 1], [offsetY, 0])}px)`,
        fontFamily,
        fontWeight: weight,
        fontSize,
        color,
        textAlign: "center",
        textShadow: "0 4px 30px rgba(0,0,0,0.65)",
        whiteSpace: "pre-line",
        ...style,
      }}
    >
      {text}
    </div>
  );
};
