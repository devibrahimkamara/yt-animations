// Identité visuelle partagée — vidéo « De A à Z : maison IA + nouvelle
// méthode immobilier 2026 » (set « higgsGpt3 »), suite de « higgsGpt2 »
// (« Astra construit une chaîne YouTube de A à Z »).
//
// Le brief `animations higgs gpt 6 - 3.rtf` propose sa propre palette
// (cyan #00E5FF / vert néon #39FF88) et ses propres polices — on N'UTILISE
// AUCUN de ces placeholders : on réapplique la charte réelle du projet,
// comme higgsGpt2 / higgs2 / higgsGpt / etc.
// → Plus Jakarta Sans, accent bleu structurel #3060ff, fond aurora (Stage),
//   glassmorphism, easing bezier(0.16,1,0.3,1), échelle typo mobile-first.
//
// Décisions produit :
//  • Accent unique du brief (cyan/vert) → remplacé par ACCENT/ACCENT_LIGHT
//    (#3060ff/#88aaff) partout : scan Anim 1, rail Anim 2, jauge Anim 6,
//    pipeline Anim 7.
//  • Comparaison de coûts Anim 3 : colonne « Setup IA 2026 » + badge « -98% »
//    en MONEY_GREEN (déjà la convention argent/économies du reste du repo),
//    colonne « Méthode classique » en ATMOS_ERROR (rouge d'alerte existant).
//  • Police monospace des étiquettes techniques (Anim 1) : le brief exige
//    explicitement une police à chasse fixe pour l'effet « donnée
//    technique » — aucune monospace de marque n'existe dans la charte, donc
//    pile système neutre (MONO_FONT_STACK), pas une police de la charte
//    détournée.
//  • Toutes les autres polices (titres, tampon, CTA, cartes) : Plus Jakarta
//    Sans, comme le reste de la série.
//  • Springs/easings/frames du brief conservés tels quels : ce sont des
//    paramètres de mouvement, pas d'identité visuelle.

export * from "../higgs2/theme";

// ── Échelle typo / icônes — « mobile-first » agressif ──
// Mêmes valeurs que higgsGpt2 / higgsGpt / freebeat / higgs / higgsAdobe.
// Masque le FONT/ICON plus petit réexporté par higgs2.
export const FONT = {
  micro: 58,
  label: 88,
  value: 128,
  counter: 220,
  hero: 300,
} as const;

export const ICON = {
  sm: 100,
  md: 150,
  lg: 210,
} as const;

// Pile monospace système pour les étiquettes « donnée technique » (Anim 1).
export const MONO_FONT_STACK =
  'ui-monospace, "SF Mono", "SFMono-Regular", Menlo, Consolas, monospace';

// ── PRNG déterministe — jamais de Math.random() non seedé (Anim 5) ──
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
