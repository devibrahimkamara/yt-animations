// Identité visuelle partagée — vidéo sponsorisée « analyser un contrat avec l'IA »
// (fonctionnalité Agreement de PDFelement v13). Set « pdfelement ».
//
// Le brief `animations pdfelement.rtf` laisse toute l'identité en placeholder
// (fond sombre #14161A / #0F1115, cyan électrique #00D9FF, orange #FF6B35, rouge
// #E53935, or/argent #D4AF37 / #C0C0C0, « ta police habituelle »). On n'utilise
// AUCUN de ces placeholders : on réapplique la charte réelle du projet, comme les
// sets higgs2 / freebeat / higgs / higgsAdobe.
// → Plus Jakarta Sans, accent #3060ff, fond aurora (Stage), glassmorphism.
//
// Exception assumée : les couleurs de MARQUE PDFelement (sponsor) sur les Anims
// 04 et 07 uniquement — cf. section « Couleurs sponsor » plus bas.

export * from "../higgs2/theme";

import {
  ACCENT,
  ACCENT_LIGHT,
  NEUTRAL_PANEL,
  ATMOS_ERROR,
  ATMOS_GOLD,
  MONEY_GREEN,
  atmosPanelBorder,
} from "../higgs2/theme";

// ── La feuille de contrat ─────────────────────────────────────────────
// Décision produit : on garde la feuille claire réaliste du brief (métaphore
// « document » lisible) ; seuls les accents passent à la charte. La feuille est
// juste ancrée dans l'aurora par une ombre portée + un liseré bleu discret pour
// ne pas « flotter » brutalement.
export const PAPER = "#FAFAFA";
export const PAPER_LINE = "#E0E0E0"; // lignes de texte simulé (<rect>)
export const PAPER_LINE_FAINT = "#9E9E9E"; // petits caractères / mentions légales (Anim 2)
export const PAPER_HEADER = "#CFCFCF"; // bandeau titre / en-tête de document
export const PAPER_SHADOW = "0 40px 120px rgba(0,0,0,0.55)";
export const PAPER_BORDER = atmosPanelBorder(0.22); // liseré bleu charte

// ── Alias sémantiques (placeholders du brief → charte) ────────────────
export const SCAN_LINE = ACCENT_LIGHT; // ligne de scan lumineuse (remplace cyan #00D9FF)

export const ALERT = ATMOS_ERROR; // #ef4444 — clauses dangereuses (remplace #E53935)
export const ALERT_TINT = "#FDECEC"; // surbrillance de clause sur la feuille claire
export const ALERT_BORDER = ATMOS_ERROR;

export const RADAR = ACCENT; // onde radar (Anim 8, remplace cyan)
export const CONNECTOR = "rgba(48,96,255,0.45)"; // lignes marqueur → étiquette (Anim 8)

export const MAGNIFIER_METAL = "#C9CED9"; // cercle + manche de la loupe (remplace or #D4AF37)
export const MAGNIFIER_SHADOW = "rgba(0,0,0,0.35)";

export const TOOLBAR_BG = NEUTRAL_PANEL; // fond de la barre d'outils (Anim 7)
export const ICON_OFF = "#5A5D66"; // icônes éteintes / non ciblées (Anims 5, 7)

// Anim 8 — 4 teintes de risque volontairement distinctes, mais toutes dérivées
// de la charte (le brief demandait rouge / orange / jaune-or / violet) :
// « Risque élevé » / « Date limite » / « Montant » / « Résiliation »
export const RISK = [ATMOS_ERROR, ATMOS_GOLD, MONEY_GREEN, ACCENT] as const;

// Anim 10 — volet de transition
export const WIPE = ACCENT;

// Fonds sombres locaux pour les scènes « scan » / « radar » (Stage bare) —
// même approche que src/Higgs2Anim08DissolutionVisage/index.tsx.
export const DARK_SCENE = "linear-gradient(180deg, #0D1330 0%, #05060F 100%)";

// ── Couleurs sponsor PDFelement (HORS charte, Anims 04 & 07 seulement) ─
// Rouge de marque Wondershare / PDFelement. ⚠️ Hex à confirmer sur les assets
// officiels PDFelement si dispo ; ajuster ici le cas échéant.
export const PDFE_RED = "#E60012";
export const PDFE_RED_DARK = "#B3000E";

// ── Échelle typo / icônes — « mobile-first » agressif ──────────────────
// La chaîne est regardée quasi exclusivement sur téléphone : tout doit remplir
// l'écran et rester lisible d'un coup d'œil sur 6 pouces (cf. mémoire
// feedback-mobile-sizing). Mêmes valeurs que les sets freebeat / higgs /
// higgsAdobe pour un rendu homogène d'une vidéo à l'autre. Ces déclarations
// masquent les `FONT` / `ICON` réexportés par higgs2 via `export *`.
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
