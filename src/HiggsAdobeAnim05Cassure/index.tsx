import { useLayoutEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Easing,
  Img,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsAdobe/Stage";
import { CRACKED_TILES, TILES, TILE_H, TILE_W } from "../higgsAdobe/grid";
import { abstractThumb } from "../higgsAdobe/vector";
import { GLITCH_RED, INK, FONT, atmosPanelBorder } from "../higgsAdobe/theme";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });

export const higgsAdobeAnim05Schema = z.object({
  word: z.string().default("LACUNES"),
});
export type HiggsAdobeAnim05Props = z.infer<typeof higgsAdobeAnim05Schema>;

const THUMBS = TILES.map((t) => abstractThumb(t.i + 1));

// Fissure diagonale en zigzag (haut-gauche → bas-droite), passe au milieu des
// vignettes CRACKED_TILES.
const CRACK_D = "M 120 70 L 520 330 L 720 520 L 1180 770 L 1560 1000";

export const HiggsAdobeAnim05Cassure: React.FC<HiggsAdobeAnim05Props> = ({ word }) => {
  const frame = useCurrentFrame();

  const crackRef = useRef<SVGPathElement>(null);
  const [handle] = useState(() => delayRender("Measuring crack path"));
  const [len, setLen] = useState<number | null>(null);
  useLayoutEffect(() => {
    if (!crackRef.current || len !== null) return;
    setLen(crackRef.current.getTotalLength());
  }, [len]);
  useLayoutEffect(() => {
    if (len !== null) continueRender(handle);
  }, [len, handle]);

  // Phase 1 — tracé de la fissure (0 → 18)
  const crackP = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Phase 2 — décalage + aberration des 2 vignettes (15 → 24, puis maintenu)
  const shiftP = interpolate(frame, [15, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glitchOsc = Math.sin(frame * 0.8) * 2;

  // Phase 3 — fond semi-transparent + mot
  const bgP = interpolate(frame, [22, 28], [0, 0.72], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wordShake = frame > 34 ? Math.sin(frame * 1.7) * 1.5 : 0;

  // Phase 5 — sortie sèche (100 → 120)
  const outT = interpolate(frame, [100, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  return (
    <Stage bare>
      <AbsoluteFill style={{ background: "#0b0d14", opacity: 1 - outT }}>
        {/* Grille héritée de l'Anim 4 (état résolu, figé) */}
        {TILES.map((t) => {
          const cracked = CRACKED_TILES.indexOf(t.i);
          const isCracked = cracked >= 0;
          const dir = cracked === 0 ? -1 : 1;
          const dx = isCracked
            ? dir * interpolate(shiftP, [0, 1], [0, 7]) + glitchOsc * dir
            : 0;
          const dy = isCracked ? dir * interpolate(shiftP, [0, 1], [0, 5]) : 0;
          // tremblement bref au passage de la fissure
          const passFrame = 4 + t.col * 3;
          const tremble =
            isCracked && frame > passFrame && frame < passFrame + 6
              ? Math.sin(frame * 3) * 3
              : 0;
          return (
            <div
              key={t.i}
              style={{
                position: "absolute",
                left: t.x,
                top: t.y,
                width: TILE_W,
                height: TILE_H,
                borderRadius: 10,
                border: `1px solid ${atmosPanelBorder(0.25)}`,
                background: "#12151f",
                overflow: "hidden",
                transform: `translate(${dx + tremble}px, ${dy}px)`,
              }}
            >
              <Img src={THUMBS[t.i]} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              {/* copies chromatiques sur les vignettes touchées */}
              {cracked >= 0 && (
                <>
                  <Img
                    src={THUMBS[t.i]}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: 0.5 * shiftP,
                      mixBlendMode: "screen",
                      filter: "sepia(1) saturate(6) hue-rotate(-35deg)",
                      transform: `translateX(${glitchOsc}px)`,
                    }}
                  />
                  <Img
                    src={THUMBS[t.i]}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: 0.5 * shiftP,
                      mixBlendMode: "screen",
                      filter: "sepia(1) saturate(6) hue-rotate(140deg)",
                      transform: `translateX(${-glitchOsc}px)`,
                    }}
                  />
                </>
              )}
            </div>
          );
        })}

        {/* Fissure */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <path
            ref={crackRef}
            d={CRACK_D}
            fill="none"
            stroke={INK}
            strokeWidth={3}
            strokeLinejoin="round"
            style={
              len != null
                ? { strokeDasharray: len, strokeDashoffset: len * (1 - crackP) }
                : { opacity: 0 }
            }
          />
          <path
            d={CRACK_D}
            fill="none"
            stroke={GLITCH_RED}
            strokeWidth={7}
            strokeLinejoin="round"
            opacity={0.25 * crackP}
            style={
              len != null
                ? { strokeDasharray: len, strokeDashoffset: len * (1 - crackP) }
                : { opacity: 0 }
            }
          />
        </svg>

        {/* Mot LACUNES */}
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              padding: "40px 90px",
              background: `rgba(10,10,15,${bgP})`,
              borderRadius: 20,
              transform: `translateX(${wordShake}px)`,
              display: "flex",
            }}
          >
            {word.split("").map((ch, i) => {
              const t = interpolate(frame, [22 + i * 2, 22 + i * 2 + 7], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.back(1.6)),
              });
              return (
                <span
                  key={`${ch}-${i}`}
                  style={{
                    display: "inline-block",
                    fontFamily,
                    fontWeight: 800,
                    fontSize: FONT.hero * 0.62,
                    color: INK,
                    letterSpacing: "2px",
                    opacity: interpolate(t, [0, 0.5], [0, 1], { extrapolateRight: "clamp" }),
                    transform: `scale(${interpolate(t, [0, 1], [1.4, 1])})`,
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </Stage>
  );
};
