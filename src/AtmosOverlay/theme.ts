// Palette et helpers partagés pour les overlays Atmos (AtmosAnim09-18)
// Reprend l'identité visuelle réelle du projet (voir AtmosAnim01-08) :
// Plus Jakarta Sans, bleu #3060ff, gold #FFD700 — pas la palette générique
// (Poppins / violet #6C63FF) supposée par le brief d'origine.

export const ATMOS_BLUE = "#3060ff";
export const ATMOS_BLUE_LIGHT = "#88aaff";
export const ATMOS_GOLD = "#FFD700";
export const ATMOS_ERROR = "#ef4444";
export const ATMOS_SUCCESS = "#22c55e";

export const ATMOS_PANEL_BG =
  "linear-gradient(160deg, rgba(15,25,80,0.9) 0%, rgba(5,10,40,0.95) 100%)";

export const atmosPanelBorder = (alpha = 0.2) => `rgba(80,130,255,${alpha})`;

export const atmosGlow = (color: string, r1 = 60, r2 = 120) =>
  `0 0 ${r1}px ${color}30, 0 0 ${r2}px ${color}15`;

export const ATMOS_SPRING_POP = { mass: 0.6, damping: 12, stiffness: 160 };
export const ATMOS_SPRING_BOUNCY = { mass: 0.5, damping: 9, stiffness: 220 };

export const strokeDashDraw = (pathLength: number, progress: number) => ({
  strokeDasharray: pathLength,
  strokeDashoffset: pathLength * (1 - progress),
});
