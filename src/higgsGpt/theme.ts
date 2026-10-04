// Identité visuelle partagée — vidéo « GPT-6 Astra + l'outil mystère » (set
// « higgsGpt »).
//
// Le brief `animations higgs gpt.rtf` laisse toute l'identité en placeholder
// (« garde la même palette que le reste de la série », « ta couleur d'accent »,
// « fond cohérent avec la série », « police condensed/bold »). On n'utilise
// AUCUN placeholder : on réapplique la charte réelle du projet, comme les sets
// higgs2 / freebeat / higgs / higgsAdobe / pdfelement / maxdrop / higgsBlen.
// → Plus Jakarta Sans, accent #3060ff, fond aurora (Stage), glassmorphism,
//   easing bezier(0.16,1,0.3,1), échelle typo « mobile-first ».
//
// Décisions produit (validées par Ibrahim) :
//  • Accent THÉMATIQUE « Astra » = teal OpenAI #10A37F (déjà dans le thème
//    higgs2 sous CHATGPT_TEAL), réservé au SEUL signifiant Astra : badge
//    « 100 % GPT-6 ASTRA » (Anim 1), icône Astra + carte de l'équation
//    (Anim 2), nom du plan + symbole ∞ (Anim 6). Modèle PDFE_RED / MAXDROP_BLUE
//    / BLENDER_ORANGE. Toute la structure/UI reste en ACCENT #3060ff.
//  • Rouge « satire / blocage » du brief (marqueur, tampon, fissures, censure)
//    → ATMOS_ERROR #ef4444 (STRIKE_RED).
//  • Curseur « aujourd'hui » Anim 4 (« couleur froide contrastante ») →
//    ACCENT_LIGHT #88aaff.
//  • Anim 5 : bandeaux « putaclic » volontairement HORS charte (dégradés
//    rouge/orange/jaune) — le contraste avec la charte sobre EST la blague.
//  • Panneau « clair/banal » Anim 7 → #FAFAFA ancré dans l'aurora (ombre +
//    liseré accent), même traitement que la feuille blanche pdfelement.
//  • Échelle typo « mobile-first » agressive (cf. mémoire feedback-mobile-
//    sizing), pas les px du brief.

export * from "../higgs2/theme";

import { CHATGPT_TEAL, ATMOS_ERROR, ACCENT_LIGHT } from "../higgs2/theme";

// ── Accent thématique « Astra » (badge Anim 1, icône/équation Anim 2, carte Anim 6) ──
export const ASTRA_TEAL = CHATGPT_TEAL; // #10A37F
export const ASTRA_TEAL_DARK = "#0B7A5E";
export const ASTRA_TEAL_LIGHT = "#4FD1AE";
export const ASTRA_TEAL_GLOW = "rgba(16,163,127,0.40)";

// ── Alias sémantiques (placeholders du brief → charte) ──
export const STRIKE_RED = ATMOS_ERROR; // #ef4444 — marqueur, tampon, fissures, censure
export const STRIKE_RED_GLOW = "rgba(239,68,68,0.40)";
export const STRIKE_RED_TINT = "rgba(239,68,68,0.10)";
export const TODAY_CURSOR = ACCENT_LIGHT; // #88aaff — curseur « aujourd'hui » (Anim 4)
export const CENSOR_BLACK = "#0D0D12"; // barre de censure (Anim 3)

// Dégradés « putaclic » assumés hors charte (Anim 5 uniquement)
export const HYPE_GRADS = [
  "linear-gradient(100deg, #FF3B30 0%, #FF6A00 100%)",
  "linear-gradient(100deg, #FF9500 0%, #FFCC00 100%)",
  "linear-gradient(100deg, #FF2D55 0%, #FF7A00 100%)",
  "linear-gradient(100deg, #FF6A00 0%, #FFD60A 100%)",
  "linear-gradient(100deg, #E4002B 0%, #FF8C00 100%)",
  "linear-gradient(100deg, #FF9F0A 0%, #FFE14D 100%)",
  "linear-gradient(100deg, #FF375F 0%, #FF9500 100%)",
] as const;

// ── Échelle typo / icônes — « mobile-first » agressif ──
// Mêmes valeurs que freebeat / higgs / higgsAdobe / pdfelement / maxdrop /
// higgsBlen. Ces déclarations masquent les `FONT` / `ICON` réexportés par higgs2.
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
