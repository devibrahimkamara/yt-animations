import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsBlen/Stage";
import { RenderTile } from "../higgsBlen/RenderTile";
import { INK, FONT, BLENDER_ORANGE } from "../higgsBlen/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

// Anim 8 — « Le bandeau des univers 3D » (270 frames)
// A Défilement 0–150 · B Décélération + assombrissement 150–195 · C Hold 195–270

export const higgsBlenAnim08Schema = z.object({
  // Rendus Blender par rangée ; vide → vignettes procédurales seedées.
  row1: z.array(z.string()).default([]),
  row2: z.array(z.string()).default([]),
  row3: z.array(z.string()).default([]),
  heroWord: z.string().default("La référence"),
  subtitle: z.string().default("Studios, jeux vidéo, films d'animation"),
});

export type HiggsBlenAnim08Props = z.infer<typeof higgsBlenAnim08Schema>;

const TILE = 300;
const GAP = 20;
const STEP = TILE + GAP;
const PER_ROW = 9;
const ROW_H = 360;

// base = px/frame (rangées désynchronisées : 35 → · 28 ← · 32 →)
const ROWS = [
  { dir: 1, base: 35, y: 20, seedBase: 100 },
  { dir: -1, base: 28, y: 20 + ROW_H, seedBase: 200 },
  { dir: 1, base: 32, y: 20 + ROW_H * 2, seedBase: 300 },
];

export const HiggsBlenAnim08BandeauUnivers: React.FC<HiggsBlenAnim08Props> = ({
  row1,
  row2,
  row3,
  heroWord,
  subtitle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const srcRows = [row1, row2, row3];

  // vitesse globale : plein régime → 0 entre 150 et 195 (un seul point de
  // contrôle, décliné par rangée via `base * facteur`).
  const decelDist = (base: number) =>
    frame > 150
      ? interpolate(frame, [150, 195], [0, base * 18], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        })
      : 0;
  const residual = Math.max(0, frame - 195) * 0.3;

  const blur = interpolate(frame, [150, 195], [1.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const brightness = interpolate(frame, [150, 195], [1, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const wordIn = spring({ frame: frame - 195, fps, config: { damping: 12, stiffness: 130 } });
  const wordScale = interpolate(wordIn, [0, 1], [1.15, 1]);
  const subT = interpolate(frame, [205, 220], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wordGlow = frame > 220 ? 0.3 + Math.sin(frame / 10) * 0.15 : 0.3;

  const loopW = PER_ROW * STEP;

  return (
    <Stage outFrames={12}>
      <AbsoluteFill style={{ filter: `brightness(${brightness})` }}>
        {ROWS.map((row, r) => {
          const scrolled = row.base * Math.min(frame, 150) + decelDist(row.base) + residual;
          const shift = ((row.dir * scrolled) % loopW) - loopW;
          return (
            <div
              key={r}
              style={{
                position: "absolute",
                top: row.y,
                left: 0,
                right: 0,
                height: ROW_H - 40,
                overflow: "hidden",
                maskImage: "linear-gradient(90deg, transparent 0%, #000 12%, #000 88%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 12%, #000 88%, transparent 100%)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: GAP,
                  transform: `translateX(${shift}px)`,
                  filter: `blur(${blur}px)`,
                }}
              >
                {Array.from({ length: PER_ROW * 3 }, (_, i) => {
                  const idx = i % PER_ROW;
                  return (
                    <RenderTile
                      key={i}
                      seed={row.seedBase + idx}
                      src={srcRows[r][idx]}
                      size={TILE}
                      radius={12}
                      wireframe
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>

      {/* mot central */}
      {frame >= 195 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <div
            style={{
              fontFamily,
              fontWeight: 800,
              fontSize: 172,
              color: INK,
              letterSpacing: "10px",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              transform: `scale(${wordScale})`,
              opacity: wordIn,
              textShadow: `0 0 ${20 + wordGlow * 60}px ${BLENDER_ORANGE}, 0 0 30px rgba(234,118,0,0.3)`,
            }}
          >
            {heroWord}
          </div>
          <div
            style={{
              marginTop: 30,
              fontFamily,
              fontWeight: 700,
              fontSize: FONT.micro,
              color: "#B0B0B8",
              opacity: subT,
              transform: `translateY(${interpolate(subT, [0, 1], [15, 0])}px)`,
            }}
          >
            {subtitle}
          </div>
        </AbsoluteFill>
      )}
    </Stage>
  );
};
