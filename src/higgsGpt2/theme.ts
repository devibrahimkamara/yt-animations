// Identité visuelle partagée — vidéo « Astra construit une chaîne YouTube de
// A à Z » (set « higgsGpt2 »), suite thématique de « higgsGpt » (même sujet
// GPT-6 Astra + Higgsfield) mais brief/vidéo distincts.
//
// Le brief `animations higgs gpt 6 - 2.rtf` laisse toute l'identité en
// placeholder générique (fond #0F0F0F, dégradé violet/cyan #6C63FF→#4ECDC4,
// police Inter). On n'utilise AUCUN placeholder : on réapplique la charte
// réelle du projet, comme higgsGpt / higgs2 / freebeat / higgsAdobe / etc.
// → Plus Jakarta Sans, accent #3060ff, fond aurora (Stage), glassmorphism,
//   easing bezier(0.16,1,0.3,1), échelle typo « mobile-first ».
//
// Décisions produit (validées par Ibrahim) :
//  • Accent thématique « Astra »/ChatGPT = teal OpenAI #10A37F, même constante
//    que higgsGpt/theme.ts (ASTRA_TEAL) : réservé au signifiant Astra/ChatGPT
//    (icône, prix, coche de bénéfices Anim 5 ; ligne débloquée Anim 6).
//  • Le module Higgsfield qui se clipse (Anim 7) reste sur l'accent bleu
//    structurel ACCENT/ACCENT_LIGHT — pas de nouvelle teinte de marque,
//    Higgsfield est présenté comme un outil qui s'ajoute, pas un logo à
//    distinguer visuellement (décision explicite, pas un oubli).
//  • Cellule « Films réalistes » (Anim 8) : rupture chaude assumée hors
//    charte, sur le modèle des HYPE_GRADS de higgsGpt — signale le « haut de
//    gamme » de cette capacité par contraste avec les 3 cellules froides.
//  • Aucun rouge dans l'Anim 3 (brief : réservé aux alertes ailleurs dans la
//    série) — respecté.
//  • Échelle typo « mobile-first » agressive (cf. mémoire feedback-mobile-
//    sizing), pas les px du brief.

export * from "../higgs2/theme";

import { CHATGPT_TEAL } from "../higgs2/theme";

// ── Accent thématique « Astra »/ChatGPT (Anim 5, Anim 6) ──
export const ASTRA_TEAL = CHATGPT_TEAL; // #10A37F
export const ASTRA_TEAL_DARK = "#0B7A5E";
export const ASTRA_TEAL_LIGHT = "#4FD1AE";
export const ASTRA_TEAL_GLOW = "rgba(16,163,127,0.40)";

// Rupture chaude assumée hors charte, réservée à la cellule "Films réalistes"
// (Anim 8).
export const WARM_BREAK_GRAD =
  "linear-gradient(135deg, #6e4a1a 0%, #2e1a0a 100%)";
export const WARM_BREAK_GLOW = "rgba(255,215,0,0.35)";

// ── Échelle typo / icônes — « mobile-first » agressif ──
// Mêmes valeurs que higgsGpt / freebeat / higgs / higgsAdobe / pdfelement /
// maxdrop / higgsBlen. Masque le FONT/ICON plus petit réexporté par higgs2.
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
