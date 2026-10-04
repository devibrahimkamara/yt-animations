import React from "react";
import { useCurrentFrame } from "remotion";
import { GLITCH_RED, INK } from "./theme";

const CHROMA_CYAN = "#22d3ee";

// Aberration chromatique : 3 copies superposées (rouge / cyan / blanc). L'offset
// oscille via Math.sin(frame) — jamais Math.random() par frame, pour un
// mouvement fluide. Sert le mot « LACUNES » (Anim 5) et le texte du tampon
// (Anim 10).
export const ChromaText: React.FC<{
  text: string;
  active?: boolean;
  amplitude?: number;
  baseColor?: string;
  style?: React.CSSProperties;
}> = ({ text, active = true, amplitude = 3, baseColor = INK, style }) => {
  const frame = useCurrentFrame();
  const o = active ? Math.sin(frame * 0.9) * amplitude : 0;

  const ghost = (color: string, dx: number): React.CSSProperties => ({
    position: "absolute",
    left: 0,
    top: 0,
    color,
    opacity: 0.7,
    transform: `translateX(${dx}px)`,
    ...style,
  });

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <span style={ghost(GLITCH_RED, -o)}>{text}</span>
      <span style={ghost(CHROMA_CYAN, o)}>{text}</span>
      <span style={{ position: "relative", color: baseColor, ...style }}>{text}</span>
    </div>
  );
};
