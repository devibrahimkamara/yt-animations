// Identité visuelle partagée — vidéo « 47 idées business → 1 lancée avec l'IA » (set « atmos22 »).
//
// Le brief `animations atmos22.rtf` impose une palette générique (fond #0B0B0F,
// Montserrat / Inter, jaune #FFD60A, rouge #FF3B30). On garde la chorégraphie
// et le timing du brief, mais on réapplique la charte réelle du projet :
//  • fond #0B0B0F + radial + vignette → Stage aurora (AtmosBackground)
//  • Montserrat / Inter → Plus Jakarta Sans
//  • jaune #FFD60A (choix, survivant, compteurs) → ACCENT (+ glow ACCENT_LIGHT)
//  • rouge #FF3B30 (barrage, élimination, tampon, BLOQUÉ, REC) → ATMOS_ERROR
//  • cartes #14141B / #1A1A22 → glass sombre (GLASS_*)
//  • gris #9A9AA8 / #4A4A55 → MUTED / DESATURATED
//  • tailles de texte remontées « mobile-first » (cf. feedback-mobile-sizing)
//  • hasard : random('seed') de Remotion avec les seeds nommées du brief.

export * from "../higgsOpus/theme";

export const GLASS_BG = "rgba(17,23,43,0.82)";
export const GLASS_CARD = "rgba(35,44,77,0.85)";
export const GLASS_BORDER = "rgba(120,150,255,0.22)";
export const MUTED = "#8A94B8";
export const SOFT = "#C7CEE6";
export const DIM_TILE = "rgba(20,24,40,0.9)"; // tuile éliminée (#121216 du brief)
export const DIM_TEXT = "#4A5170"; // chiffre éliminé (#4A4A55 du brief)
