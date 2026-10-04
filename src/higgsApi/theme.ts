// Identité visuelle partagée — vidéo « API Higgsfield / construire son app IA »
// (set « higgsApi »), suite de la série higgs2/higgsGpt2.
//
// Le brief `higgs api animations.rtf` propose sa propre palette générique
// (fond #0A0E14, bleu technique #4A9EFF, vert #00D9A3, police monospace,
// easing Easing.inOut(Easing.ease) générique). On n'utilise AUCUN de ces
// placeholders : on réapplique la charte réelle du projet, comme higgsGpt2 /
// higgs2 / freebeat / higgsAdobe / etc. → Plus Jakarta Sans, accent #3060ff,
// fond aurora (Stage), glassmorphism, easing bezier(0.16,1,0.3,1), échelle
// typo mobile-first, PRNG déterministe mulberry32.
//
// Mapping de charte (brief → réel) :
//   fond #0A0E14 uni        → Stage/AtmosBackground (aurora + dot-grid)
//   bleu #4A9EFF            → ACCENT / ACCENT_LIGHT (#3060ff / #88aaff)
//   vert #00D9A3            → MONEY_GREEN (#22c55e, alias ATMOS_SUCCESS)
//   rouge #E63946           → ATMOS_ERROR (#ef4444)
//   jaune #FFD93D           → ATMOS_GOLD / AD_YELLOW
//   texte #E8EDF2           → INK (#FFFFFF)
//   panneaux #1E2A3A/#12161F → ATMOS_PANEL_BG + atmosPanelBorder()
//   badge ChatGPT (Anim 6)  → CHATGPT_TEAL (#10A37F) — déjà dans la charte
//   badge Claude (Anim 6)   → CLAUDE_TERRACOTTA (#D97757) — déjà dans la charte
//   Easing.inOut(Easing.ease) générique → EASE = bezier(0.16,1,0.3,1)
//
// Décision produit : le ticket de caisse (Anim 3) garde son papier crème et
// sa police monospace — rupture volontaire assumée (façon WARM_BREAK de
// higgsGpt2), c'est un objet physique identifiable, pas une UI produit.

export * from "../higgs2/theme";

// Échelle typo / icônes — « mobile-first » agressif, comme higgsGpt/higgsGpt2/
// freebeat/higgs/higgsAdobe/pdfelement/maxdrop/higgsBlen (cf. mémoire
// feedback-mobile-sizing : vidéo regardée sur téléphone, tout doit être grand
// et lisible d'un coup d'œil). Masque le FONT/ICON plus petit réexporté par
// higgs2.
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

// Palette « papier » du ticket de caisse (Anim 3) — rupture assumée hors charte
export const RECEIPT_PAPER = "#F5F1E8";
export const RECEIPT_INK = "#2A2A2A";
export const RECEIPT_DASH = "#B8B0A0";
export const RECEIPT_MONO = '"IBM Plex Mono", "Courier New", monospace';

// PRNG déterministe partagé — jamais de Math.random() non seedé (cf. higgsGpt2/theme.ts)
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
