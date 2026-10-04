// Utilitaire technique (pas une signature visuelle) : tremblement décroissant
// « erreur système ». Le brief le signale réutilisable — Anims 2 (chute du
// compteur) et 4 (odomètre qui tourne).

/**
 * Décalage horizontal oscillant à amplitude décroissante.
 * @param frame      frame courante
 * @param startFrame frame de déclenchement
 * @param amplitude  amplitude initiale en px
 * @param decay      nombre de frames sur lequel l'amplitude retombe à 0
 * @param freq       vitesse d'oscillation (rad/frame)
 */
export const shake = (
  frame: number,
  startFrame: number,
  amplitude: number,
  decay: number,
  freq = 1.6,
): number => {
  const f = frame - startFrame;
  if (f < 0 || f >= decay) return 0;
  const falloff = 1 - f / decay;
  return Math.sin(f * freq) * amplitude * falloff;
};
