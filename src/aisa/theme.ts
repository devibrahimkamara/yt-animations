// Identité visuelle partagée — vidéo « rapports de visibilité IA / GEO » (set « aisa »).
//
// Le brief `animations aisa.rtf` impose sa propre palette (fond #0B1020→#151B34,
// Inter, vert #22C55E, bleu #3B82F6). On ne l'utilise PAS pour le chrome
// structurel : on réapplique la charte réelle du projet (higgs2 / higgsOpus…) :
// Plus Jakarta Sans, ACCENT #3060ff, fond aurora (Stage), glassmorphism,
// EASE bezier(0.16,1,0.3,1), échelle typo « mobile-first ».
//
// Mapping brief → charte :
//  • bleu #3B82F6 → ACCENT ; vert #22C55E → MONEY_GREEN ; fond dégradé → Stage aurora
//  • panneaux #11172B / #1B2340 / bordure #26304F → glass sombre (GLASS_*)
//  • couleurs de marque des moteurs IA (ChatGPT, Claude, Perplexity, Gemini) :
//    gardées, ce sont des couleurs de CONTENU, pas du chrome.
//  • feuille blanche du rapport (anim 1) et carte blanche (anim 4) : objets
//    physiques, restent blancs (précédent pdfelement / higgsMarketing).
//  • tailles de texte du brief (16–30 px) remontées (mobile-first).
//  • aucun Math.random() ni random() Remotion : mulberry32 partout.
//  • pas de @remotion/noise (non installé) : bruit maison `wobble()`.

export * from "../higgsOpus/theme";

export const PERPLEXITY_CYAN = "#1FB6C9";
export const GEMINI_BLUE = "#4285F4";
export const GEMINI_PURPLE = "#9B72F2";
export const STAR_GOLD = "#FACC15";

export const GLASS_BG = "rgba(17,23,43,0.82)";
export const GLASS_CARD = "rgba(35,44,77,0.85)";
export const GLASS_BORDER = "rgba(120,150,255,0.22)";
export const MUTED = "#8A94B8";
export const SOFT = "#C7CEE6";
