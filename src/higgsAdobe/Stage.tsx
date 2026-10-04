// Scène commune aux 10 animations « higgs adobe » : fond aurora + dot-grid +
// vignette (AtmosBackground) et fondu de sortie global sur les dernières frames.
// Réexporte le Stage du set higgs2 pour un rendu 100 % identique d'une vidéo à
// l'autre.
//
// Usages :
//  • plein cadre (Anims 1, 2, 3, 4, 6, 7, 10) → <Stage>
//  • Anim 5 (Cassure) enchaîne sur le dernier frame de l'Anim 4 → <Stage bare>
//  • Anims 8 & 9 sont des overlays transparents sur la face cam → PAS de Stage,
//    fondu de sortie géré localement.
export { Stage } from "../higgs2/Stage";
