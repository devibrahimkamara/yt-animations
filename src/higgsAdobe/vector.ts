// Générateurs vectoriels en data-URI SVG — aucune dépendance à un asset externe.
//  • abstractThumb : vignette « miniature générée par IA » abstraite et seedée
//    (formes géométriques + dégradé bleu de marque, jamais un arc-en-ciel — même
//    esprit que `src/freebeat` COVER_PALETTE). Utilisée par l'Anim 4.
//  • prMark : pastille « Pr » vectorielle, fallback affiché si le vrai logo
//    Adobe Premiere Pro (public/higgs-adobe/premiere-pro.png) n'est pas encore
//    déposé. Utilisée par l'Anim 9.

import { ACCENT, ACCENT_LIGHT } from "../higgs2/theme";

// PRNG déterministe (seed fixe) — rendu reproductible entre les renders.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const dataUri = (body: string, w: number, h: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>${body}</svg>`,
  )}`;

export function abstractThumb(seed: number, w = 440, h = 300): string {
  const rand = mulberry32(seed * 2654435761 + 12345);
  const shapes: string[] = [];
  const nShapes = 3 + Math.floor(rand() * 3);
  for (let i = 0; i < nShapes; i++) {
    const kind = Math.floor(rand() * 3);
    const op = (0.18 + rand() * 0.5).toFixed(2);
    const col = rand() > 0.5 ? ACCENT_LIGHT : "#ffffff";
    if (kind === 0) {
      const r = 40 + rand() * 90;
      shapes.push(
        `<circle cx='${(rand() * w).toFixed(0)}' cy='${(rand() * h).toFixed(0)}' r='${r.toFixed(0)}' fill='${col}' opacity='${op}'/>`,
      );
    } else if (kind === 1) {
      const bw = 60 + rand() * 180;
      const bh = 40 + rand() * 130;
      shapes.push(
        `<rect x='${(rand() * w).toFixed(0)}' y='${(rand() * h).toFixed(0)}' width='${bw.toFixed(0)}' height='${bh.toFixed(0)}' rx='14' fill='${col}' opacity='${op}'/>`,
      );
    } else {
      const x0 = (rand() * w).toFixed(0);
      const y0 = (rand() * h).toFixed(0);
      shapes.push(
        `<path d='M ${x0} ${y0} l ${(60 + rand() * 150).toFixed(0)} ${(20 + rand() * 60).toFixed(0)} l ${(-40 - rand() * 110).toFixed(0)} ${(60 + rand() * 110).toFixed(0)} z' fill='${col}' opacity='${op}'/>`,
      );
    }
  }
  return dataUri(
    `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
      `<stop offset='0%' stop-color='${ACCENT}' stop-opacity='0.55'/>` +
      `<stop offset='100%' stop-color='#0b1230' stop-opacity='0.95'/>` +
      `</linearGradient></defs>` +
      `<rect width='${w}' height='${h}' fill='url(#g)'/>${shapes.join("")}`,
    w,
    h,
  );
}

export const prMark = (w = 240, h = 240): string =>
  dataUri(
    `<rect width='${w}' height='${h}' rx='36' fill='#1b1030'/>` +
      `<rect x='12' y='12' width='${w - 24}' height='${h - 24}' rx='28' fill='none' stroke='${ACCENT_LIGHT}' stroke-width='4'/>` +
      `<text x='50%' y='50%' text-anchor='middle' dominant-baseline='central' ` +
      `font-family='Plus Jakarta Sans, Arial, sans-serif' font-weight='800' ` +
      `font-size='${(w * 0.4).toFixed(0)}' fill='${ACCENT_LIGHT}'>Pr</text>`,
    w,
    h,
  );
