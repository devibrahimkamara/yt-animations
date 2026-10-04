// Identité visuelle partagée — vidéo « marché des compléments alimentaires /
// marque blanche » (set « maxdrop », sponsor Max Dropshipping).
//
// Le brief `animations maxdrop.rtf` laisse toute l'identité en placeholder
// (fond #0B0F14, vert-lime #C4F542, rouge-corail #E85D4E, blanc cassé #F5F5F0,
// gris #8A8F98 / #2A2F38 / #1A1F28, « sans-serif bold / Inter Bold »). On
// n'utilise AUCUN de ces placeholders : on réapplique la charte réelle du
// projet, exactement comme les sets higgs2 / freebeat / higgs / higgsAdobe /
// pdfelement.
// → Plus Jakarta Sans, accent #3060ff, fond aurora (Stage), glassmorphism.
//
// Décisions produit (validées par Ibrahim) :
//  • vert-lime #C4F542 du brief → MONEY_GREEN #22c55e (lecture « croissance /
//    positif », contraste net avec le rouge des obstacles).
//  • Anims 12–16 (segment sponsor) → accent de marque Max Dropshipping dédié
//    (MAXDROP_BLUE), sur le modèle de PDFE_RED pour PDFelement.
//  • Anim 8 (« Les causes », sujet sensible) → volontairement HORS charte :
//    gris / blanc cassé, easing doux, aucun spring, aucun accent vif.

export * from "../higgs2/theme";

import {
  ACCENT,
  ACCENT_LIGHT,
  MONEY_GREEN,
  ATMOS_ERROR,
  ATMOS_GOLD,
  INK,
  NEUTRAL_LINE,
  NEUTRAL_PANEL,
  NEUTRAL_BORDER,
  atmosPanelBorder,
} from "../higgs2/theme";

// ── Alias sémantiques (placeholders du brief → charte) ────────────────
export const GROWTH = MONEY_GREEN; // #22c55e — remplace le vert-lime #C4F542
export const GROWTH_SOFT = "rgba(34,197,94,0.30)"; // remplissages / halos verts
export const GROWTH_GLOW = "rgba(34,197,94,0.55)";

export const STRIKE = ATMOS_ERROR; // #ef4444 — remplace le rouge-corail #E85D4E
export const STRIKE_SOFT = "rgba(239,68,68,0.10)"; // overlays / teintes rouges

export const TEXT_DIM = "rgba(255,255,255,0.66)"; // sous-titres (#B8BEC7)
export const TEXT_FAINT = "rgba(255,255,255,0.40)";

export const OBSTACLE = NEUTRAL_BORDER; // #48484A — gris « obstacle » (#8A8F98)
export const OBSTACLE_DIM = "#3A3A3C";

export const RAIL = NEUTRAL_LINE; // #3A3A3C — contours / rails / axes (#2A2F38)
export const CARD_BG = NEUTRAL_PANEL; // #2C2C2E — fond de carte (#1A1F28)
export const CARD_BORDER = atmosPanelBorder(0.25); // contour de carte (#2A2F38)

// Anim 9 — briques mur → fossé
export const WALL_RED = "#7a4a44";
export const WALL_GREEN = "#2f6f4f";
export const WALL_GREEN_FILL = "rgba(74,155,110,0.10)"; // intérieur du cercle

// Tampons / bleu-gris du brief (#5A7A9B) → accent charte
export const STAMP_BLUE = ACCENT;

// Anim 15 — 4 strates d'ingrédients (représentations littérales, dérivées charte)
export const STRATA = [ATMOS_GOLD, INK, ACCENT_LIGHT, MONEY_GREEN] as const;

// Fond sombre local pour les scènes « scan / réseau / carrousel » (Stage bare)
export const DARK_SCENE = "linear-gradient(180deg, #0D1330 0%, #05060F 100%)";

// ── Anim 8 uniquement — hors charte assumé (sujet sensible) ───────────
export const SOBER_BG = "#0D1116";
export const SOBER_LINE = "#8A8F98";
export const SOBER_NODE_BG = "#1A1F28";
export const SOBER_TEXT = "#B8BEC7";

// ── Accent sponsor Max Dropshipping (Anims 12–16 seulement) ───────────
// ⚠️ Hex de marque à confirmer sur les assets officiels Max Dropshipping ;
// ajuster ici le cas échéant.
export const MAXDROP_BLUE = "#2E6BE6";
export const MAXDROP_BLUE_DARK = "#1E4FB0";
export const MAXDROP_GLOW = "rgba(46,107,230,0.55)";

// ── Échelle typo / icônes — « mobile-first » agressif ─────────────────
// La chaîne est regardée quasi exclusivement sur téléphone : tout doit remplir
// l'écran et rester lisible d'un coup d'œil sur 6 pouces (cf. mémoire
// feedback-mobile-sizing). Mêmes valeurs que les sets freebeat / higgs /
// higgsAdobe / pdfelement. Ces déclarations masquent les `FONT` / `ICON`
// réexportés par higgs2 via `export *`.
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

// ── PRNG déterministe partagé (fragments Anims 5 & 14, jitter, drift…) ─
// Rendu reproductible entre les renders — jamais de Math.random() non seedé.
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
