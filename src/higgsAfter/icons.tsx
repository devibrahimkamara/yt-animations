import React from "react";

// Pictogrammes stroke-only, formes génériques (aucune marque réelle : "Pr" et
// "Ae" sont des badges monogramme abstraits, pas les vrais logos Adobe ; le
// "cerveau" IA est un symbole générique, pas le logo ChatGPT). `draw` (0 → 1)
// anime le tracé via strokeDashoffset ; par défaut 1 (dessiné).
//
//  Anim 3 : IconPremiere · IconAfterEffects
//  Anim 2 / 9 : IconBrainAI
//  Anim 9 : IconFolder · IconAfterEffects

type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
  draw?: number;
};

const Svg: React.FC<
  IconProps & { len: number; children: React.ReactNode; fill?: string }
> = ({
  size = 96,
  color = "#fff",
  strokeWidth = 4,
  draw = 1,
  len,
  fill = "none",
  children,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill={fill}
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      strokeDasharray: len,
      strokeDashoffset: len * (1 - Math.max(0, Math.min(1, draw))),
    }}
  >
    {children}
  </svg>
);

// Monogramme "Pr" dans un carré arrondi — Premiere Pro (abstrait).
export const IconPremiere: React.FC<IconProps> = (p) => (
  <Svg {...p} len={220}>
    <rect x="6" y="6" width="36" height="36" rx="9" />
    <path d="M15 32 V16 h6 a5 5 0 0 1 0 10 h-6" />
    <path d="M29 32 V16" />
  </Svg>
);

// Monogramme "Ae" dans un carré arrondi — After Effects (abstrait).
export const IconAfterEffects: React.FC<IconProps> = (p) => (
  <Svg {...p} len={220}>
    <rect x="6" y="6" width="36" height="36" rx="9" />
    <path d="M13 30 L19 17 L25 30 M15.5 24.5 h7" />
    <path d="M29 30 v-13 h6 M29 24 h5" />
  </Svg>
);

// Cerveau stylisé — signifiant IA générique.
export const IconBrainAI: React.FC<IconProps> = (p) => (
  <Svg {...p} len={260}>
    <path d="M18 10 a7 7 0 0 0 -7 7 a6 6 0 0 0 -2 11 a7 7 0 0 0 9 9 a6 6 0 0 0 6 -4" />
    <path d="M30 10 a7 7 0 0 1 7 7 a6 6 0 0 1 2 11 a7 7 0 0 1 -9 9 a6 6 0 0 1 -6 -4" />
    <path d="M24 14 v20" />
  </Svg>
);

// Dossier générique — "tes fichiers".
export const IconFolder: React.FC<IconProps> = (p) => (
  <Svg {...p} len={150}>
    <path d="M6 15 v22 a2 2 0 0 0 2 2 h32 a2 2 0 0 0 2 -2 V18 a2 2 0 0 0 -2 -2 H23 l-4 -5 H8 a2 2 0 0 0 -2 2 Z" />
  </Svg>
);

// Fenêtre app générique (barre de titre + corps) — utilisée pour icônes de
// nœud secondaires si besoin.
export const IconWindow: React.FC<IconProps> = (p) => (
  <Svg {...p} len={170}>
    <rect x="6" y="10" width="36" height="28" rx="4" />
    <path d="M6 18 h36" />
  </Svg>
);
