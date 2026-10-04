// Identité visuelle partagée — vidéo « affiliation avec pipit.ai » (set
// « pippit »).
//
// Le brief `Animations pippit.rtf` propose une palette et une typographie
// génériques par animation (crème/serif Playfair pour la fiche dico, bleu-
// violet #5B8DEF→#8B6EF5 pour le circuit de commission, rouge encre custom
// pour le tampon, Inter/Manrope pour les textes, etc.). On n'utilise AUCUN
// de ces placeholders pour le chrome structurel : on réapplique la charte
// réelle du projet, comme higgs2 / higgsGpt2 / maxdrop / higgsBlen / etc.
// → Plus Jakarta Sans, accent #3060ff, fond aurora (Stage), glassmorphism,
//   easing bezier(0.16,1,0.3,1), échelle typo « mobile-first ».
//
// Décisions produit (validées par Ibrahim, sans logo/couleur de marque
// pipit.ai fournis) :
//  • Pas de nouvel accent thématique dédié à pipit.ai : ACCENT/ACCENT_LIGHT
//    restent l'accent structurel (liens, anneau de progression, noyau IA,
//    point voyageur). MONEY_GREEN pour toute validation/succès (badge
//    « Acheté ✓ », check vert, badge « 100 % réaliste »). COIN_GOLD pour la
//    pièce de commission (Anim 2). ATMOS_ERROR pour toute négation forte
//    (mot « non » Anim 5).
//  • Anim 3 (tampon « PAS BESOIN ») : le rouge encre custom du brief est
//    remplacé par ATMOS_ERROR (#ef4444), cohérent avec la charte (rouge =
//    alerte/négation dans tout le projet).
//  • Anim 1 (fiche dictionnaire) : seule exception typographique — le mot
//    défini et sa définition restent en serif (Playfair Display) car c'est
//    un choix de CONTENU (effet « page de dictionnaire »), pas du chrome UI.
//    Le fond derrière la carte devient l'AtmosBackground standard au lieu du
//    dégradé sombre custom du brief.
//  • Étiquettes orbitantes Anim 6 : libellés génériques plausibles (Script /
//    Visuels / Voix / Montage), pas de vraies fonctionnalités pipit.ai
//    (non fournies). Logo final « pipit.ai » en texte blanc, pas d'asset.
//  • Échelle typo « mobile-first » agressive (cf. mémoire feedback-mobile-
//    sizing), pas les px du brief.
//  • Aucune randomisation non seedée : tout jitter/tremblement/dispersion
//    utilise mulberry32 (convention constante du projet, pas de dépendance
//    @remotion/noise).

export * from "../higgs2/theme";

// ── Échelle typo / icônes — « mobile-first » agressif ──
// Mêmes valeurs que higgsGpt2 / higgsGpt / freebeat / higgs / higgsAdobe /
// pdfelement / maxdrop / higgsBlen. Masque le FONT/ICON plus petit réexporté
// par higgs2.
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

// ── Fiche dictionnaire (Anim 1) — palette papier, réservée au contenu ──
export const PAPER_BG = "#F7F3EA";
export const PAPER_INK = "#1A1A1A";
export const PAPER_SLATE = "#4A4A4A";
export const HIGHLIGHT_YELLOW = "#FFD93D";

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
