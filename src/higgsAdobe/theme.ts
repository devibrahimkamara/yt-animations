// Identité visuelle partagée — vidéo « l'IA + Adobe Premiere Pro remplacent le
// monteur vidéo » (set « higgs adobe »).
//
// Le brief `animations higgs adobe.rtf` laisse toute l'identité en placeholder
// (fond #0A0A0F, dégradé violet→cyan #8B5CF6→#22D3EE, gris ardoise #3A3A45,
// blanc cassé #F5F5F7, « sans-serif bold »). On n'utilise AUCUN de ces
// placeholders : on réapplique la charte réelle du projet, exactement comme les
// sets higgs2 / freebeat / higgs.
// → Plus Jakarta Sans, accent #3060ff, fond aurora (Stage), glassmorphism.

export * from "../higgs2/theme";

import { ACCENT, ACCENT_LIGHT, NEUTRAL_LINE, NEUTRAL_BORDER, ATMOS_ERROR } from "../higgs2/theme";

// ── Alias sémantiques propres à ce brief ───────────────────────────────
// Le dégradé « généré par IA » du brief (violet→cyan) rendu dans la charte :
// dégradé bleu de marque #3060ff → #88aaff. Présent partout (courbe Anim 1,
// remplissage timeline Anim 3, coches Anim 6, barre Anim 8, badge Anim 9).
export const AI_FROM = ACCENT; // #3060ff
export const AI_TO = ACCENT_LIGHT; // #88aaff
export const AI_GRAD_CSS = `linear-gradient(90deg, ${ACCENT}, ${ACCENT_LIGHT})`;
export const AI_GRAD_ID = "higgsAdobeAiGrad";

export const SCAN_LINE = ACCENT_LIGHT; // ligne de scan lumineuse (Anim 4)
export const GLITCH_RED = ATMOS_ERROR; // #ef4444 — fissure / tampon (Anims 5, 10)
export const RAIL_GREY = NEUTRAL_LINE; // axes, grille, pistes vides
export const CLIP_EMPTY = NEUTRAL_BORDER; // clips non remplis (Anim 3)

// ── Échelle typo / icônes — « mobile-first » agressif ──────────────────
// La chaîne est regardée quasi exclusivement sur téléphone : tout doit remplir
// l'écran et rester lisible d'un coup d'œil sur 6 pouces (cf. mémoire
// feedback-mobile-sizing). Mêmes valeurs que les sets freebeat / higgs pour un
// rendu homogène d'une vidéo à l'autre. Ces déclarations masquent les
// `FONT` / `ICON` réexportés par higgs2 via `export *`.
export const FONT = {
  micro: 58, // textes secondaires / unités / labels
  label: 88, // labels, titres de cartes, texte de bouton
  value: 128, // sous-valeurs
  counter: 220, // gros compteurs
  hero: 300, // chiffre / mot héros plein écran
} as const;

export const ICON = {
  sm: 100,
  md: 150,
  lg: 210,
} as const;
