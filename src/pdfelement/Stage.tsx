// Scène commune aux 10 animations « PDFelement » : fond aurora + dot-grid +
// vignette (AtmosBackground) et fondu de sortie global sur les dernières frames.
// Réexporte le Stage du set higgs2 pour un rendu 100 % identique d'une vidéo à
// l'autre.
//
// Usages :
//  • plein cadre (Anims 2, 3, 4, 5, 6, 7, 9, 10) → <Stage>
//  • Anims 1 (scan) & 8 (radar) veulent un fond plus sombre pour faire ressortir
//    le glow → <Stage bare background="linear-gradient(...)">
export { Stage } from "../higgs2/Stage";
