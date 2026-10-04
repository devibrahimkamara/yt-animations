// Identité visuelle partagée — vidéo « IA + After Effects » (set « higgsAfter »).
//
// Le brief `animations higgs after.rtf` liste des placeholders explicites
// ("couleur d'accent de ta charte", "police de ta charte graphique
// habituelle", "vrai logo Adobe/ChatGPT"). On applique la charte réelle du
// projet, comme tous les sets précédents (higgs2 / higgs / higgsAdobe /
// freebeat / pdfelement / maxdrop / higgsBlen / higgsGpt), et on remplace les
// logos de marque réels par des pictogrammes stroke abstraits (cf. icons.tsx)
// — convention constante de la série, décision validée par Ibrahim.
//
// → Plus Jakarta Sans, accent #3060ff, fond aurora (Stage), glassmorphism,
//   easing bezier(0.16,1,0.3,1), échelle typo « mobile-first ».

export * from "../higgs2/theme";

import { ATMOS_ERROR } from "../higgs2/theme";

// ── Alias sémantiques (placeholders du brief → charte) ──
// Ligne de séparation / jauge qui échoue (Plan 1) : accent standard, mais le
// point d'échec "0%" utilise une teinte d'alerte discrète pour marquer le raté
// sans sortir de la charte sombre.
export const FAIL_RED = ATMOS_ERROR; // #ef4444 — "0%" qui pulse (Plan 1)
export const FAIL_RED_GLOW = "rgba(239,68,68,0.35)";

// Cartes de l'équation IA + AE (Plan 2) — dégradés sombres avec touche vive,
// pas des couleurs de marque réelles.
export const CARD_IA_GRAD =
  "linear-gradient(145deg, #241a4a 0%, #120c26 100%)";
export const CARD_AE_GRAD =
  "linear-gradient(145deg, #14213d 0%, #0a1120 100%)";
export const CARD_RESULT_GRAD =
  "linear-gradient(145deg, #1a2550 0%, #0c1230 100%)";

// Badge "GPT-6 Astra" / pricing (Plan 7) — reprend l'accent thématique déjà
// défini dans higgsGpt pour rester cohérent visuellement entre les deux vidéos
// qui partagent le même sujet (ChatGPT Pro / GPT-6 Astra).
export { CHATGPT_TEAL as ASTRA_TEAL } from "../higgs2/theme";

// ── Échelle typo / icônes — « mobile-first » agressif ──
// Mêmes valeurs que freebeat / higgs / higgsAdobe / pdfelement / maxdrop /
// higgsBlen / higgsGpt. Masque les `FONT` / `ICON` réexportés par higgs2.
export const FONT = {
  micro: 44,
  label: 66,
  value: 96,
  counter: 180,
  hero: 250,
} as const;

export const ICON = {
  sm: 100,
  md: 150,
  lg: 210,
} as const;

// ── PRNG déterministe partagé — jamais de Math.random() non seedé ──
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
