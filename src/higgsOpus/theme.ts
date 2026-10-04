// Identité visuelle partagée — vidéo « Opus 5.5 × Higgsfield MCP : un seul
// prompt → un court métrage » (set « higgsOpus »).
//
// Le brief `animations higgs opus.rtf` propose une palette générique par
// animation ("fond #0A0A0F", "couleur de marque à définir", "rouge #D32F2F",
// "rouge YouTube #FF0000", etc.). On n'utilise AUCUN de ces placeholders pour
// le chrome structurel : on réapplique la charte réelle du projet, comme
// higgs2 / higgsGpt / higgsMarketing / maxdrop / higgsBlen / higgsApi.
// → Plus Jakarta Sans, accent #3060ff, fond aurora (Stage), glassmorphism,
//   easing bezier(0.16,1,0.3,1), échelle typo « mobile-first ».
//
// Décisions produit (mapping brief → charte, documentées animation par
// animation) :
//  • Anim 1 (pellicule de film) : barre de chat glassmorphism en ACCENT
//    (au lieu du "violet/cyan" placeholder). Texte du prompt tapé en Roboto
//    Mono (monospace déjà utilisé dans le projet pour un effet "code/IA",
//    ex. higgsMarketing Anim 7, pippit Anim 3) au lieu d'un monospace
//    générique.
//  • Anim 2 (schéma de connexion MCP) : bloc "Opus 5.5" en OPUS_TERRACOTTA
//    (= CLAUDE_TERRACOTTA, déjà définie dans higgs2/theme — coïncidence
//    heureuse, c'est la vraie couleur Anthropic). Bloc "Higgsfield" en
//    ACCENT (couleur de marque du projet, pas un cyan/violet inventé).
//    Connecteur MCP neutre en NEUTRAL_PANEL/NEUTRAL_BORDER. Le point
//    lumineux voyageur interpole de OPUS_TERRACOTTA vers ACCENT.
//  • Anim 3 (roadmap étape par étape) : ligne/checkpoints en ACCENT, tampon
//    final "RÉPLICABLE PAR TOI AUSSI" en ACCENT — reste dans le chrome du
//    projet plutôt qu'une couleur de marque générique.
//  • Anim 4 (calendrier du 22 sept) : tampon "NOUVEAU" en ATMOS_ERROR (rouge
//    existant de la charte) plutôt qu'un rouge custom #D32F2F. Le bloc
//    calendrier lui-même reste clair/crème car c'est une couleur de CONTENU
//    (objet physique), pas du chrome UI — précédent direct : étiquette kraft
//    de higgsMarketing Anim 1.
//  • Anim 5 (balance Fable vs Opus 5.5) : pile "Opus 5.5" en OPUS_TERRACOTTA
//    (sujet mis en avant, cohérent avec Anim 2/6), pile "Fable" en INK
//    (blanc neutre) pour un contraste net. Accolade et texte d'écart en INK
//    avec glow ACCENT.
//  • Anim 6 (promesse ou réalité) : côté "Ce qu'Anthropic annonce" en
//    OPUS_TERRACOTTA (cohérent avec Anim 2/5), côté point d'interrogation en
//    neutre (INK/DESATURATED). Diagonale et barre de chargement en ACCENT.
//  • Anim 7 (CTA abonnement + pouce) : bouton "S'abonner"→"Abonné" en
//    ACCENT→NEUTRAL_PANEL au lieu du rouge YouTube littéral #FF0000→gris —
//    même décision que higgsMarketing Anim 8 : rester cohérent avec la
//    charte du projet plutôt que reproduire la marque YouTube. Composition à
//    fond transparent (pensée pour incrustation en coin, comme demandé par
//    le brief).
//  • Anim 8 (transition wipe finale) : bande de wipe en ACCENT (couleur de
//    marque du projet), élément de chrome structurel pur.
//  • Échelle typo « mobile-first » agressive (cf. mémoire feedback-mobile-
//    sizing), pas les tailles en px du brief.
//  • Aucune randomisation non seedée : le shake caméra (Anim 3, Anim 4)
//    utilise mulberry32 (convention constante du projet), jamais
//    Math.random() ni random(seed) de Remotion.
//  • Pas de @remotion/paths ni @remotion/transitions (non installés, jamais
//    utilisés ailleurs dans le projet) : tracé de ligne via
//    strokeDasharray/strokeDashoffset + interpolate() sur une longueur de
//    path connue, point voyageur via le helper algébrique pointAtProgress
//    (voir ./utils.tsx), wipe final via un <div> transformé.

export * from "../higgs2/theme";
import { CLAUDE_TERRACOTTA } from "../higgs2/theme";

export const OPUS_TERRACOTTA = CLAUDE_TERRACOTTA; // #D97757 — vraie couleur Anthropic

// ── Échelle typo / icônes — « mobile-first » agressif ──
// Mêmes valeurs que higgsGpt2 / pippit / higgsGpt / freebeat / higgs /
// higgsAdobe / pdfelement / maxdrop / higgsBlen / higgsMarketing / higgsApi.
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
