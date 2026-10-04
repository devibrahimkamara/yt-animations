import React from "react";
import { useCurrentFrame } from "remotion";
import { mulberry32 } from "./theme";

// Helpers partagés par plusieurs animations du set (courbe de saison, circuit
// de l'argent) : un tracé est défini comme une liste de points fixes, sa
// longueur totale et la position à une progression donnée (0→1) sont
// calculées algébriquement — pas de dépendance à getPointAtLength() du DOM,
// pour un rendu stable et déterministe pendant le render Remotion.

export type Pt = { x: number; y: number };

export function polylineLength(points: Pt[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  }
  return total;
}

export function pathFromPoints(points: Pt[]): string {
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
}

export function pointAtProgress(points: Pt[], t: number): Pt {
  const clamped = Math.max(0, Math.min(1, t));
  const total = polylineLength(points);
  const target = total * clamped;
  let acc = 0;
  for (let i = 1; i < points.length; i++) {
    const segLen = Math.hypot(
      points[i].x - points[i - 1].x,
      points[i].y - points[i - 1].y,
    );
    if (acc + segLen >= target || i === points.length - 1) {
      const segT = segLen === 0 ? 0 : (target - acc) / segLen;
      return {
        x: points[i - 1].x + (points[i].x - points[i - 1].x) * segT,
        y: points[i - 1].y + (points[i].y - points[i - 1].y) * segT,
      };
    }
    acc += segLen;
  }
  return points[points.length - 1];
}

// <ShakeWrapper> — tremblement décroissant sur `durationFrames` à partir de
// `startFrame`, amplitude en px. Convention mulberry32 : jamais de
// Math.random() non seedé.
export const ShakeWrapper: React.FC<{
  children: React.ReactNode;
  startFrame: number;
  durationFrames?: number;
  amplitude?: number;
  seed?: number;
}> = ({ children, startFrame, durationFrames = 6, amplitude = 4, seed = 777 }) => {
  const frame = useCurrentFrame();
  const rng = mulberry32(seed);
  const offsets = Array.from({ length: durationFrames }, () => ({
    x: (rng() * 2 - 1) * amplitude,
    y: (rng() * 2 - 1) * amplitude,
  }));
  const localFrame = frame - startFrame;
  let tx = 0;
  let ty = 0;
  if (localFrame >= 0 && localFrame < durationFrames) {
    const decay = 1 - localFrame / durationFrames;
    tx = offsets[localFrame].x * decay;
    ty = offsets[localFrame].y * decay;
  }
  return (
    <div style={{ transform: `translate(${tx}px, ${ty}px)` }}>{children}</div>
  );
};
