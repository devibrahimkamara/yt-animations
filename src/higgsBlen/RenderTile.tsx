import React from "react";
import { Img, staticFile } from "remotion";
import {
  BLENDER_ORANGE,
  BLENDER_ORANGE_DARK,
  BLENDER_ORANGE_LIGHT,
  ACCENT_LIGHT,
  mulberry32,
} from "./theme";

// Une vignette de « rendu Blender ».
//  • `src` fourni  → <Img> avec le filtre « wireframe » unifié (désaturation +
//    teinte orange), pour homogénéiser des rendus hétérogènes (Anim 8).
//  • `src` absent  → vignette abstraite seedée (formes géométriques + dégradé
//    orange de marque), dérivée de higgsAdobe `abstractThumb`. Permet de
//    construire les Anims 1 & 8 sans assets ; déposer les PNG dans
//    public/higgs-blen/ plus tard ne demande qu'un changement de defaultProps.

// Filtre « mode wireframe » : contraste + désaturation + teinte orange.
export const WIREFRAME_FILTER =
  "contrast(1.15) saturate(0) sepia(0.55) hue-rotate(-12deg) brightness(0.92)";

const ProceduralTile: React.FC<{ seed: number; w: number; h: number; radius: number }> = ({
  seed,
  w,
  h,
  radius,
}) => {
  const rand = mulberry32(seed * 2654435761 + 12345);
  const gid = `htg${seed}`;
  const nShapes = 3 + Math.floor(rand() * 3);
  const shapes: React.ReactNode[] = [];
  for (let i = 0; i < nShapes; i++) {
    const kind = Math.floor(rand() * 3);
    const op = 0.18 + rand() * 0.5;
    const col = rand() > 0.5 ? BLENDER_ORANGE_LIGHT : rand() > 0.5 ? ACCENT_LIGHT : "#ffffff";
    if (kind === 0) {
      shapes.push(
        <circle
          key={i}
          cx={rand() * w}
          cy={rand() * h}
          r={30 + rand() * 70}
          fill={col}
          opacity={op}
        />,
      );
    } else if (kind === 1) {
      shapes.push(
        <rect
          key={i}
          x={rand() * w}
          y={rand() * h}
          width={50 + rand() * 150}
          height={35 + rand() * 110}
          rx={12}
          fill={col}
          opacity={op}
        />,
      );
    } else {
      const x0 = rand() * w;
      const y0 = rand() * h;
      shapes.push(
        <path
          key={i}
          d={`M ${x0} ${y0} l ${50 + rand() * 130} ${20 + rand() * 50} l ${-35 - rand() * 90} ${50 + rand() * 90} z`}
          fill={col}
          opacity={op}
        />,
      );
    }
  }
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ display: "block", borderRadius: radius }}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={BLENDER_ORANGE} stopOpacity={0.5} />
          <stop offset="100%" stopColor={BLENDER_ORANGE_DARK} stopOpacity={0.95} />
        </linearGradient>
      </defs>
      <rect width={w} height={h} fill={`url(#${gid})`} />
      {shapes}
    </svg>
  );
};

export const RenderTile: React.FC<{
  seed: number;
  src?: string;
  size: number;
  height?: number;
  radius?: number;
  wireframe?: boolean;
}> = ({ seed, src, size, height, radius = 14, wireframe = false }) => {
  const w = size;
  const h = height ?? size;
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: radius,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.14)",
        boxShadow: "inset 0 0 30px rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.4)",
        flexShrink: 0,
      }}
    >
      {src ? (
        <Img
          src={src.startsWith("http") || src.startsWith("data:") ? src : staticFile(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: wireframe ? WIREFRAME_FILTER : undefined,
          }}
        />
      ) : (
        <div style={{ width: "100%", height: "100%", filter: wireframe ? WIREFRAME_FILTER : undefined }}>
          <ProceduralTile seed={seed} w={w} h={h} radius={radius} />
        </div>
      )}
    </div>
  );
};
