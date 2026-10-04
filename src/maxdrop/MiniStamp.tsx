import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });

// Petit tampon circulaire positionné (≠ StampReveal de freebeat qui est un
// overlay plein écran). Tombe du haut, s'écrase avec un spring sec, laisse une
// marque qui reste visible. Sert l'Anim 10 (3 tampons sur la bouteille) et
// l'Anim 15 (tampon « Approuvé UE » sur la capsule).

export const MiniStamp: React.FC<{
  label: string;
  startFrame: number;
  cx: number;
  cy: number;
  color: string;
  /** rotation au repos (deg) — varier pour éviter le chevauchement des marques */
  restAngle?: number;
  radius?: number;
  fontSize?: number;
}> = ({ label, startFrame, cx, cy, color, restAngle = 0, radius = 70, fontSize = 20 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;
  if (f < 0) return null;

  const drop = spring({ frame: f, fps, config: { damping: 10, stiffness: 350 } });
  const y = interpolate(drop, [0, 1], [-160, 0], { extrapolateRight: "clamp" });
  const scale = interpolate(drop, [0, 0.6, 1], [1.3, 0.94, 1], { extrapolateRight: "clamp" });
  const impactAngle = interpolate(drop, [0, 0.5, 1], [restAngle - 6, restAngle + 3, restAngle], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(f, [0, 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        left: cx,
        top: cy,
        transform: `translate(-50%, -50%) translateY(${y}px) rotate(${impactAngle}deg) scale(${scale})`,
        opacity,
      }}
    >
      <svg width={radius * 2} height={radius * 2} style={{ overflow: "visible" }}>
        <circle cx={radius} cy={radius} r={radius - 5} fill={`${color}22`} stroke={color} strokeWidth={4} />
        <circle cx={radius} cy={radius} r={radius - 14} fill="none" stroke={color} strokeWidth={2} opacity={0.7} />
        <text
          x={radius}
          y={radius}
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fontFamily, fontWeight: 800, fontSize, fill: color, letterSpacing: "0.5px" }}
        >
          {label}
        </text>
      </svg>
    </div>
  );
};
