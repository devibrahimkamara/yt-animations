// Layout de la grille 4×3 de vignettes — PARTAGÉ entre l'Anim 4 (MosaiqueScan)
// et l'Anim 5 (Cassure) pour que la fissure de l'Anim 5 tombe exactement sur les
// mêmes vignettes que celles affichées en fin d'Anim 4 (continuité sans coupure
// prévue par le brief).

const FRAME_W = 1920;
const FRAME_H = 1080;

export const GRID = {
  cols: 4,
  rows: 3,
  margin: 90, // marge externe pour ne pas toucher les bords
  gap: 28,
} as const;

export const TILE_W = Math.round(
  (FRAME_W - GRID.margin * 2 - GRID.gap * (GRID.cols - 1)) / GRID.cols,
);
export const TILE_H = Math.round(
  (FRAME_H - GRID.margin * 2 - GRID.gap * (GRID.rows - 1)) / GRID.rows,
);

export type TileRect = {
  i: number;
  col: number;
  row: number;
  x: number;
  y: number;
  cx: number;
  cy: number;
};

export const TILES: TileRect[] = Array.from({ length: GRID.cols * GRID.rows }).map((_, i) => {
  const col = i % GRID.cols;
  const row = Math.floor(i / GRID.cols);
  const x = GRID.margin + col * (TILE_W + GRID.gap);
  const y = GRID.margin + row * (TILE_H + GRID.gap);
  return { i, col, row, x, y, cx: x + TILE_W / 2, cy: y + TILE_H / 2 };
});

// Vignettes traversées par la fissure diagonale (haut-gauche → bas-droite),
// centrées autour du milieu du cadre (indices de la rangée du milieu).
export const CRACKED_TILES = [5, 6];
