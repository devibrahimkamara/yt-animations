// Identité visuelle partagée — vidéo « clips musicaux 100 % IA » (freebeat).
// Réutilise la charte du projet (set higgs2) : Plus Jakarta Sans, accent
// #3060ff, fond aurora + glassmorphism. Le brief freebeat laissait l'identité
// en placeholder (« ta couleur d'accent », « Inter Black / Poppins », fond
// #0A0A0A) — on n'utilise AUCUN de ces placeholders.
//
// Échelle typo/icônes VOLONTAIREMENT plus grande que higgs2 : la chaîne YouTube
// est regardée quasi exclusivement sur téléphone, tout doit remplir l'écran et
// rester lisible d'un coup d'œil sur 6 pouces (cf. [[feedback_mobile_sizing]]).
// Ces déclarations locales masquent les `FONT` / `ICON` réexportés par higgs2.

export * from "../higgs2/theme";

import { ACCENT, ACCENT_LIGHT, MONEY_GREEN, NEUTRAL_BORDER, NEUTRAL_PANEL } from "../higgs2/theme";

// Palette restreinte des pochettes d'album (Anim 4) — 3 teintes + variations
// de luminosité générées au render, jamais un arc-en-ciel (cf. brief).
export const COVER_PALETTE = [ACCENT, ACCENT_LIGHT, MONEY_GREEN] as const;

// Alias sémantiques
export const TRACK_GREY = NEUTRAL_BORDER; // piste de fond des barres (Anim 5)
export const CARD_GREY = NEUTRAL_PANEL; // cartes de résultat vides (Anim 3)

// Tailles de police — « mobile-first » agressif
export const FONT = {
  micro: 58, // textes secondaires / unités / labels de nœuds
  label: 88, // labels, titres de cartes
  value: 128, // sous-valeurs, valeurs de barres
  counter: 220, // gros compteurs
  hero: 300, // chiffre héros plein écran
} as const;

// Tailles d'emoji/icônes
export const ICON = {
  sm: 100,
  md: 150,
  lg: 210,
} as const;
