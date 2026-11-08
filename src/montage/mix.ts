// Mixage audio (PLAYBOOK §5ter) : automation de la musique au service de l'émotion, pas seulement un niveau fixe.
//  - stop  : la musique s'arrête net (ou en fondu court) sur un moment fort, silence, puis repart (fondu d'entrée)
//  - dip   : la musique s'efface de `db` dB pendant une phrase importante ou une explication dense
//  - swell : la musique remonte (+db) dans un passage sans voix (respiration, plan d'illustration)
// Les gains se multiplient. Temps absolus de la timeline (s).
import { interpolate } from "remotion";

export type MixEvent =
  | { k: "stop"; at: number; back: number; fadeOut?: number; fadeIn?: number }
  | { k: "dip"; from: number; to: number; db: number; ramp?: number }
  | { k: "swell"; from: number; to: number; db: number; ramp?: number };

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const dbToGain = (db: number) => Math.pow(10, db / 20);

export const mixGain = (t: number, events: MixEvent[]) => {
  let g = 1;
  for (const e of events) {
    if (e.k === "stop") {
      const fo = e.fadeOut ?? 0.15, fi = e.fadeIn ?? 1.2;
      if (t < e.at - fo || t > e.back + fi) continue;
      const x = t <= e.back ? interpolate(t, [e.at - fo, e.at], [1, 0], cl) : interpolate(t, [e.back, e.back + fi], [0, 1], cl);
      g *= Math.sin((x * Math.PI) / 2); // courbe à puissance constante
    } else {
      const r = e.ramp ?? 0.6;
      if (t < e.from - r || t > e.to + r) continue;
      const x = interpolate(t, [e.from - r, e.from, e.to, e.to + r], [0, 1, 1, 0], cl);
      g *= dbToGain((e.k === "dip" ? -e.db : e.db) * x);
    }
  }
  return g;
};
