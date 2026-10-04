import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";

// Séparateur de milliers avec espace fine insécable : 2400 → « 2 400 ».
export function formatThousands(n: number): string {
  const s = String(Math.round(n));
  let out = "";
  for (let i = 0; i < s.length; i++) {
    if (i > 0 && (s.length - i) % 3 === 0) out += " ";
    out += s[i];
  }
  return out;
}

// Compteur scripté : interpole [0 → target] sur [startFrame → endFrame], arrondi
// à l'affichage, avec un léger scale-pulse (1 → 1.08 → 1) sur les 6 dernières
// frames à l'arrivée. La valeur est volontairement scriptée à part, pas dérivée
// d'un autre calcul (cf. brief Anim 3).
export const Counter: React.FC<{
  target: number;
  startFrame: number;
  endFrame: number;
  easing?: (n: number) => number;
  format?: (n: number) => string;
  prefix?: string;
  suffix?: string;
  style?: React.CSSProperties;
}> = ({
  target,
  startFrame,
  endFrame,
  easing = Easing.out(Easing.cubic),
  format = (n) => String(Math.round(n)),
  prefix = "",
  suffix = "",
  style,
}) => {
  const frame = useCurrentFrame();
  const value = interpolate(frame, [startFrame, endFrame], [0, target], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
  const pulse = interpolate(frame, [endFrame - 6, endFrame - 3, endFrame], [1, 1.08, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <span style={{ display: "inline-block", transform: `scale(${pulse})`, ...style }}>
      {prefix}
      {format(value)}
      {suffix}
    </span>
  );
};
