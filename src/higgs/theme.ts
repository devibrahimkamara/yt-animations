// Identité visuelle partagée — vidéo « influenceur IA » (set higgs).
// Le brief `animations higgs.rtf` laissait toute l'identité en placeholder
// (« ta couleur de marque », fond #0a0a0a, dégradés bleu→violet / orange→rouge).
// On n'utilise AUCUN de ces placeholders : on réapplique la charte réelle du
// projet, exactement comme pour les sets higgs2 et freebeat.
// → Plus Jakarta Sans, accent #3060ff, fond aurora (Stage), glassmorphism.

export * from "../higgs2/theme";

import { ACCENT, ACCENT_LIGHT, MONEY_GREEN, NEUTRAL_LINE, NEUTRAL_PANEL } from "../higgs2/theme";

// ── Alias sémantiques propres à ce brief ────────────────────────────────
// Contraste « froid / chaud » du brief (Anims 2, 4, 6, 7) rendu dans la charte :
export const COLD = ACCENT; //  créer / fabriquer / technique
export const WARM = MONEY_GREEN; //  monétiser / revenus / résultat / bouton validé

// Silhouettes & mur de verre (Anims 8, 9)
export const SILHOUETTE_GREY = "#6b7ea6"; // repris du data-URI de Higgs2Anim08
export const SILHOUETTE_DARK = "#141821";
export const WALL_LINE = ACCENT_LIGHT; // ligne / paroi lumineuse
export const BLOCKED_GREY = NEUTRAL_LINE; // silhouette restée anonyme

// Ancienne méthode barrée (Anim 2)
export const STRIKE_RED = "#ef4444";
export const STALE_PANEL = NEUTRAL_PANEL;

// ── Échelle typo / icônes — « mobile-first » agressif ───────────────────
// La vidéo est regardée quasi exclusivement sur téléphone : tout doit remplir
// l'écran et rester lisible d'un coup d'œil sur 6 pouces (cf. mémoire
// feedback-mobile-sizing). Mêmes valeurs que le set freebeat pour garder un
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
