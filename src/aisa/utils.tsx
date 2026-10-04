export { pointAtProgress, polylineLength, pathFromPoints } from "../higgsOpus/utils";
export type { Pt } from "../higgsOpus/utils";

// Bézier quadratique : P = (1-t)² P0 + 2(1-t)t P1 + t² P2
export const quadBezier = (
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  t: number,
) => ({
  x: (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t ** 2 * p2.x,
  y: (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t ** 2 * p2.y,
});

// Bruit déterministe lisse (remplace @remotion/noise) : somme de sinus à phases seedées
export const wobble = (seed: number, t: number) =>
  Math.sin(t * 1.0 + seed * 12.9898) * 0.6 + Math.sin(t * 2.3 + seed * 78.233) * 0.4;

export const nbsp = (n: number) =>
  Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
