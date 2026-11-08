// Coupes de rythme (retour Ibrahim 6 oct. : démo Character Builder trop longue). Temps T d'origine, [début, fin) retirés.
// Lu aussi par analysis/tools/apply_cuts.py (serveur) : garder une paire [a, b] par ligne.
export const CUTS: [number, number][] = [
  [153.43, 164.07], // énumération des morphologies,
  [167.4, 169.53], // « pas trop mince, pas trop musclé »,
  [171.47, 174.07], // « il y a une variété de coupes »,
  [194.13, 196.93], // « cheveux noirs » dit deux fois,
  [222.13, 224.2], // « pas trop grand mais assez grand »,
  [229.17, 230.23], // blanc,
  [235.57, 239.57], // le cou,
  [242.27, 244.03], // « envie d'être spécial » répété,
  [258.97, 259.67], // blanc,
];
