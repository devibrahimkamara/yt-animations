// Identité visuelle partagée — vidéo « apprendre Blender avec l'IA » (set
// « higgsBlen »).
//
// Le brief `animations higgs blen.rtf` laisse toute l'identité en placeholder
// (fond #0a0a0f radial → noir, orange Blender #EA7600, polices « Archivo Black /
// Anton » pour les tampons). On n'utilise AUCUN de ces placeholders pour la
// structure : on réapplique la charte réelle du projet, comme les sets higgs2 /
// freebeat / higgs / higgsAdobe / pdfelement / maxdrop.
// → Plus Jakarta Sans, accent #3060ff, fond aurora (Stage), glassmorphism.
//
// Décisions produit (validées par Ibrahim) :
//  • L'orange Blender du brief est conservé comme ACCENT THÉMATIQUE uniquement
//    (le « signifiant Blender » : tampons, nœud central, courbe « avec l'IA »),
//    sur le modèle de PDFE_RED (PDFelement) / MAXDROP_BLUE (Maxdrop). Toute la
//    structure/UI passe en ACCENT #3060ff.
//  • Rouge d'échec du brief #E63946 → ATMOS_ERROR #ef4444.
//  • Vert « avec l'IA » du brief #4CAF50 → MONEY_GREEN #22c55e.
//  • Tailles de police « mobile-first » agressives (cf. mémoire
//    feedback-mobile-sizing), pas les px du brief.

export * from "../higgs2/theme";

import { ATMOS_ERROR, MONEY_GREEN } from "../higgs2/theme";

// ── Accent thématique « Blender » (tampons, nœud central, courbe IA) ──
export const BLENDER_ORANGE = "#EA7600";
export const BLENDER_ORANGE_DARK = "#C25D00";
export const BLENDER_ORANGE_MUTED = "#D89860";
export const BLENDER_ORANGE_LIGHT = "#F0A868";
export const BLENDER_ORANGE_GLOW = "rgba(234,118,0,0.40)";

// ── Alias sémantiques (placeholders du brief → charte) ──
export const FAIL_RED = ATMOS_ERROR; // #ef4444 — remplace #E63946 (Anims 2, 6, 7)
export const FAIL_RED_TINT = "rgba(239,68,68,0.08)"; // teinte de ligne « échec »
export const AI_GREEN = MONEY_GREEN; // #22c55e — remplace #4CAF50 (Anim 6, « avec l'IA »)

// ── Échelle typo / icônes — « mobile-first » agressif ──
// Mêmes valeurs que freebeat / higgs / higgsAdobe / pdfelement / maxdrop.
// Ces déclarations masquent les `FONT` / `ICON` réexportés par higgs2.
export const FONT = {
  micro: 58, // textes secondaires / unités / labels
  label: 88, // labels, titres de cartes, texte de bouton
  value: 128, // sous-valeurs
  counter: 220, // gros compteurs
  hero: 300, // mot héros plein écran
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
