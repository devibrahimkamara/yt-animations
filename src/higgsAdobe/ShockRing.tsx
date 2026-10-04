import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { INK } from "./theme";

// Anneau de choc : cercle SVG stroke (pas de fill) qui scale + fade à partir de
// `startFrame`. Sert les Anims 9 (fusion) et 10 (impact du tampon).
export const ShockRing: React.FC<{
  startFrame: number;
  durationInFrames?: number;
  cx?: number;
  cy?: number;
  fromScale?: number;
  toScale?: number;
  color?: string;
  strokeWidth?: number;
  size?: number;
  fromOpacity?: number;
}> = ({
  startFrame,
  durationInFrames = 15,
  cx = 960,
  cy = 540,
  fromScale = 0.5,
  toScale = 2.4,
  color = INK,
  strokeWidth = 4,
  size = 420,
  fromOpacity = 0.85,
}) => {
  const frame = useCurrentFrame();
  if (frame < startFrame) return null;
  const p = interpolate(frame, [startFrame, startFrame + durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const scale = interpolate(p, [0, 1], [fromScale, toScale]);
  const opacity = interpolate(p, [0, 1], [fromOpacity, 0]);
  return (
    <svg
      width={size}
      height={size}
      style={{
        position: "absolute",
        left: cx - size / 2,
        top: cy - size / 2,
        transform: `scale(${scale})`,
        transformOrigin: "center",
        opacity,
        overflow: "visible",
      }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - strokeWidth}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};
