import React from "react";
import { useCurrentFrame } from "remotion";
import { mulberry32 } from "./theme";

// Décomposition procédurale d'un élément en grille de fragments carrés avec
// chute parabolique simulée (gravité) + rotation continue + assombrissement.
// Valeurs aléatoires (drift, vitesse de rotation) précalculées via mulberry32
// pour un rendu déterministe. Partagé Anim 5 (« Les trois sans ») ↔ Anim 14
// (« La chute du MOQ »).
//
// Le composant n'affiche RIEN avant `startFrame` : l'appelant montre la forme
// intacte, puis la masque et laisse Fragmentize prendre le relais.

export type DriftBias = "center" | "left" | "right";

export const Fragmentize: React.FC<{
  /** bounding box de la forme à désintégrer, en px écran */
  x: number;
  y: number;
  width: number;
  height: number;
  /** résolution de la grille de fragments */
  cols?: number;
  rows?: number;
  color: string;
  startFrame: number;
  /** frames sur lesquelles l'ensemble a fini de sortir du cadre */
  fallDuration?: number;
  seed: number;
  driftBias?: DriftBias;
  /** décalage max (frames) entre fragments pour désynchroniser la chute */
  stagger?: number;
}> = ({
  x,
  y,
  width,
  height,
  cols = 6,
  rows = 6,
  color,
  startFrame,
  fallDuration = 40,
  seed,
  driftBias = "center",
  stagger = 2,
}) => {
  const frame = useCurrentFrame();
  const f = frame - startFrame;
  if (f < 0) return null;

  const cw = width / cols;
  const ch = height / rows;
  const rand = mulberry32(seed * 2654435761 + 99991);

  // Précalcul déterministe des paramètres par fragment.
  const frags = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const biasX =
        driftBias === "left" ? -1 : driftBias === "right" ? 1 : rand() * 2 - 1;
      frags.push({
        c,
        r,
        delay: rand() * stagger,
        driftX: (biasX * 0.6 + (rand() * 2 - 1) * 0.5) * 6, // px / frame
        gravity: 0.9 + rand() * 0.5, // px / frame²
        rotSpeed: (rand() * 2 - 1) * 8, // deg / frame
        vy0: -2 - rand() * 3, // petit rebond initial vers le haut
      });
    }
  }

  return (
    <div style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
      {frags.map((fr, i) => {
        const t = Math.max(0, f - fr.delay);
        const dy = fr.vy0 * t + 0.5 * fr.gravity * t * t;
        const dx = fr.driftX * t;
        const rot = fr.rotSpeed * t;
        const opacity = Math.max(0, 1 - (dy / (height * 4 + fallDuration * 6)) - t / (fallDuration * 2.4));
        if (opacity <= 0.01) return null;
        // Assombrissement progressif en tombant (1 → 0.6).
        const dark = Math.max(0.6, 1 - t / (fallDuration * 1.5));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + fr.c * cw + dx,
              top: y + fr.r * ch + dy,
              width: cw + 1,
              height: ch + 1,
              background: color,
              opacity,
              filter: `brightness(${dark})`,
              transform: `rotate(${rot}deg)`,
              transformOrigin: "center",
              borderRadius: 2,
            }}
          />
        );
      })}
    </div>
  );
};
