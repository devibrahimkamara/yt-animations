// Scène commune aux 17 animations « Maxdrop » : fond aurora + dot-grid +
// vignette (AtmosBackground) et fondu de sortie global sur les dernières frames.
// Réexporte le Stage du set higgs2 pour un rendu 100 % identique d'une vidéo à
// l'autre.
//
// Usages :
//  • plein cadre (Anims 2, 5, 6, 9, 10, 11, 13, 14, 15, 17) → <Stage>
//  • scènes sombres pour faire ressortir un glow (Anims 1, 4, 7, 12, 16) →
//    <Stage bare background={DARK_SCENE}>
//  • coupe nette voulue par le brief (Anims 3, 5, 8, 17) → <Stage outFrames={2}>
//    ⚠️ ne JAMAIS passer outFrames={1} : interpolate([x, x]) plante
//    (« inputRange must be strictly monotonically increasing »).
//  • Anim 8 fournit son propre fond sobre → <Stage bare background={SOBER_BG}>
export { Stage } from "../higgs2/Stage";
