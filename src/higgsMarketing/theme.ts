// Identité visuelle partagée — vidéo « vendre des vidéos IA personnalisées
// (Père Noël) — side hustle de fin d'année » (set « higgsMarketing »).
//
// Le brief `animations higgs marketing.rtf` propose une palette générique par
// animation ("ta couleur de marque", "rouge Noël", "police manuscrite ou
// display", "vert terminal classique", etc.). On n'utilise AUCUN de ces
// placeholders pour le chrome structurel : on réapplique la charte réelle du
// projet, comme higgs2 / higgsGpt2 / pippit / maxdrop / etc.
// → Plus Jakarta Sans, accent #3060ff, fond aurora (Stage), glassmorphism,
//   easing bezier(0.16,1,0.3,1), échelle typo « mobile-first ».
//
// Décisions produit (mapping brief → charte, documentées animation par
// animation) :
//  • Anim 1 (étiquette de prix) : étiquette en ton kraft/beige — conservée
//    telle quelle car c'est une couleur de CONTENU (objet physique), pas du
//    chrome UI, comme le Playfair Display de pippit Anim 1. Tampon « VENDU »
//    en ATMOS_ERROR (rouge existant de la charte) plutôt qu'un rouge custom.
//  • Anim 2 (courbe de saison) : ligne de tendance en ACCENT, label « Noël »
//    en ATMOS_ERROR (rouge = highlight/alerte, cohérent avec le reste du
//    projet). Flocons blancs semi-transparents (contenu neutre, pas de
//    charte à appliquer). mulberry32 pour positions/vitesses des flocons —
//    jamais random(seed) de Remotion ni Math.random() non seedé.
//  • Anim 3 (circuit de l'argent) : icône « Toi » en ACCENT (point central du
//    circuit), chemin paiement en COIN_GOLD, chemin livraison en
//    ACCENT_LIGHT — contraste net entre les deux flux demandé par le brief.
//  • Anim 4 (mur d'offres) : badge de prix en MONEY_GREEN (validation/gain),
//    fond AtmosBackground au lieu du fond neutre générique du brief.
//  • Anim 5 (machine à prénoms) : halo de sélection en COIN_GOLD (chaud/
//    doré, comme demandé par le brief), encart compteur « +1 vente » en
//    ACCENT.
//  • Anim 6 (implosion des outils) : bulles neutres (NEUTRAL_PANEL /
//    NEUTRAL_BORDER), puce finale « ChatGPT » en CHATGPT_TEAL — couleur de
//    marque ChatGPT déjà définie dans higgs2/theme et réutilisée dans
//    higgsGpt/higgsGpt2, pas une couleur de marque du projet inventée.
//  • Anim 7 (terminal whoami) : rupture assumée hors charte sur le vert
//    terminal classique (#00ff9c) pour le prompt/les commandes tapées —
//    c'est un choix esthétique fort et authentique au concept « terminal »,
//    similaire à la rupture chaude de higgsGpt2 Anim 8. La mise en valeur du
//    chiffre « 2020 » utilise ACCENT (couleur de marque du projet) pour
//    rester ancrée dans la charte malgré la rupture du fond terminal. Police
//    Roboto Mono (déjà utilisée ailleurs, ex. pippit Anim 3) au lieu de Fira
//    Code/JetBrains Mono.
//  • Anim 8 (bouton physique) : le bouton « pouce bleu » colle exactement à
//    ACCENT (aucune adaptation nécessaire, coïncidence heureuse avec le
//    concept). Le toggle « Abonné » actif utilise ACCENT plutôt que le rouge
//    littéral suggéré par le brief : la marque du projet est bleue, donc
//    rester cohérent avec la charte plutôt que reproduire un rouge YouTube.
//  • Anim 9 (cadenas du modèle) : carte « Gratuit » grisée en DESATURATED,
//    carte « Payant » illuminée en ACCENT avec halo. Nom du modèle IA repris
//    du transcript : « GPT-6 Astra ».
//  • Anim 10 (balance de rentabilité) : jeton dépense en ACCENT_LIGHT (froid,
//    neutre), jetons gain en MONEY_GREEN, mot « Rentable » en MONEY_GREEN.
//  • Échelle typo « mobile-first » agressive (cf. mémoire feedback-mobile-
//    sizing), pas les tailles en px du brief.
//  • Aucune randomisation non seedée : tout jitter/tremblement/dispersion
//    utilise mulberry32 (convention constante du projet).

export * from "../higgs2/theme";

// ── Échelle typo / icônes — « mobile-first » agressif ──
// Mêmes valeurs que higgsGpt2 / pippit / higgsGpt / freebeat / higgs /
// higgsAdobe / pdfelement / maxdrop / higgsBlen. Masque le FONT/ICON plus
// petit réexporté par higgs2.
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

// ── Rupture assumée, réservée au terminal (Anim 7) ──
export const TERMINAL_BG = "#0d0d0d";
export const TERMINAL_GREEN = "#00ff9c";

// ── Fiche « étiquette de prix » (Anim 1) — palette kraft, réservée au contenu ──
export const KRAFT_BG = "#e8dcc8";
export const KRAFT_INK = "#3a2f22";

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
