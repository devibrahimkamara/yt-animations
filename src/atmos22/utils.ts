import { interpolate } from "remotion";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Sortie standard du brief : fondu 1→0 et scale 1→0.97 sur les `len` dernières frames. */
export const exitFx = (frame: number, duration: number, len = 12) => {
  const t = interpolate(frame, [duration - len, duration - 1], [0, 1], clamp);
  return { opacity: 1 - t, scale: 1 - 0.03 * t };
};

/** Respiration sinusoïdale 1 → 1+amp → 1 entre `from` et `to` (0 en dehors). */
export const breathe = (frame: number, from: number, to: number, amp: number) => {
  if (frame <= from || frame >= to) return 1;
  return 1 + amp * Math.sin(((frame - from) / (to - from)) * Math.PI);
};

/** Shake amorti ±amp px sur `len` frames à partir de `start`. */
export const dampedShake = (frame: number, start: number, len: number, amp: number) => {
  const t = frame - start;
  if (t < 0 || t > len) return 0;
  return amp * Math.sin(t * 2.6) * (1 - t / len);
};
