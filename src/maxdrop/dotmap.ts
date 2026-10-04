import { mulberry32 } from "./theme";

// Carte du monde stylisée en points (dot map) pour l'Anim 12 « Le réseau
// mondial ». On ne recalcule PAS une projection en temps réel : on scatter des
// points de façon déterministe (mulberry32) à l'intérieur de blobs elliptiques
// qui approximent les masses continentales — largement suffisant pour un rendu
// « tech / épuré » de fond de vidéo YouTube.
//
// Repère : boîte MAP_W × MAP_H, origine (0,0) en haut-gauche de la carte.
// L'appelant place la carte où il veut sur le canvas 1920 × 1080.

export const MAP_W = 1560;
export const MAP_H = 780;

type Blob = { cx: number; cy: number; rx: number; ry: number; density: number };

// Ellipses grossières (fraction de MAP_W / MAP_H) : Amérique du N, Amérique du S,
// Europe, Afrique, Asie, Asie du SE, Océanie.
const BLOBS: Blob[] = [
  { cx: 0.16, cy: 0.32, rx: 0.13, ry: 0.2, density: 70 }, // Amérique du Nord
  { cx: 0.26, cy: 0.72, rx: 0.08, ry: 0.18, density: 45 }, // Amérique du Sud
  { cx: 0.5, cy: 0.26, rx: 0.06, ry: 0.1, density: 38 }, // Europe
  { cx: 0.54, cy: 0.56, rx: 0.1, ry: 0.2, density: 70 }, // Afrique
  { cx: 0.74, cy: 0.34, rx: 0.16, ry: 0.16, density: 95 }, // Asie
  { cx: 0.83, cy: 0.56, rx: 0.06, ry: 0.08, density: 26 }, // Asie du Sud-Est
  { cx: 0.88, cy: 0.74, rx: 0.06, ry: 0.06, density: 20 }, // Océanie
];

export type Dot = { x: number; y: number; r: number };

export function buildDots(seed = 42): Dot[] {
  const rand = mulberry32(seed);
  const dots: Dot[] = [];
  for (const b of BLOBS) {
    for (let i = 0; i < b.density; i++) {
      // point uniforme dans le disque unité → ellipse
      const a = rand() * Math.PI * 2;
      const rr = Math.sqrt(rand());
      const x = (b.cx + Math.cos(a) * rr * b.rx) * MAP_W;
      const y = (b.cy + Math.sin(a) * rr * b.ry) * MAP_H;
      dots.push({ x, y, r: 2 + rand() * 2 });
    }
  }
  return dots;
}

// Points nommés (mêmes coordonnées que la boîte MAP_W × MAP_H).
export const ORIGIN_CHINA = { x: 0.78 * MAP_W, y: 0.32 * MAP_H };

export const DESTINATIONS: { label: string; x: number; y: number }[] = [
  { label: "Europe de l'Ouest", x: 0.5 * MAP_W, y: 0.26 * MAP_H },
  { label: "Afrique de l'Ouest", x: 0.47 * MAP_W, y: 0.52 * MAP_H },
  { label: "Amérique du Nord", x: 0.16 * MAP_W, y: 0.3 * MAP_H },
  { label: "Asie du Sud-Est", x: 0.83 * MAP_W, y: 0.56 * MAP_H },
  { label: "Europe du Nord", x: 0.52 * MAP_W, y: 0.18 * MAP_H },
  { label: "Océanie", x: 0.88 * MAP_W, y: 0.74 * MAP_H },
];

// Arc Bézier quadratique origine → destination : point de contrôle au-dessus du
// milieu, hauteur ∝ distance (arcs longs = plus hauts).
export function arcPath(
  from: { x: number; y: number },
  to: { x: number; y: number },
): { d: string } {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dist = Math.hypot(to.x - from.x, to.y - from.y);
  const lift = Math.min(260, dist * 0.4);
  const cx = mx;
  const cy = my - lift;
  return { d: `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}` };
}
