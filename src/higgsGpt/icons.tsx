import React from "react";

// Pictogrammes stroke-only, formes génériques (aucune marque réelle : l'« icône
// Astra » est une étoile/rosace abstraite, pas un logo OpenAI). `draw` (0 → 1)
// anime le tracé via strokeDashoffset ; par défaut 1 (dessiné).
//
//  Anim 2 : IconAstra · IconLock · IconPuzzleSlot
//  Anim 3 : IconLock
//  Anim 4 : IconPin
//  Anim 6 : IconInfinity
//  Anim 7 : IconPan

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

// Étoile 8 branches inscrite dans un hexagone — « signifiant Astra » abstrait.
export const IconAstra: React.FC<IconProps & { glowId?: string }> = (p) => (
  <Svg {...p} len={260}>
    <path d="M24 4 L40 13 V31 L24 44 L8 31 V13 Z" />
    <path d="M24 12 L27 21 L36 24 L27 27 L24 36 L21 27 L12 24 L21 21 Z" />
    <circle cx="24" cy="24" r="2.4" />
  </Svg>
);

// Cadenas : corps + anse en arc.
export const IconLock: React.FC<IconProps> = (p) => (
  <Svg {...p} len={150}>
    <rect x="12" y="21" width="24" height="19" rx="3" />
    <path d="M17 21 v-5 a7 7 0 0 1 14 0 v5" />
    <line x1="24" y1="28" x2="24" y2="33" />
  </Svg>
);

// Emplacement de puzzle vide, contour pointillé (le « ? » est ajouté par la
// composition pour pouvoir l'animer séparément).
export const IconPuzzleSlot: React.FC<IconProps> = ({
  size = 96,
  color = "#8a8a92",
  strokeWidth = 4,
  draw = 1,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ opacity: Math.max(0, Math.min(1, draw)) }}
  >
    <path
      d="M8 10 h11 a3 3 0 0 1 6 0 h13 v13 a3 3 0 0 1 0 6 v13 h-13 a3 3 0 0 0 -6 0 h-11 v-13 a3 3 0 0 0 0 -6 Z"
      strokeDasharray="6 8"
    />
  </svg>
);

// Marqueur type épingle qui pointe vers le bas.
export const IconPin: React.FC<IconProps & { fill?: string }> = ({
  size = 96,
  color = "#ef4444",
  strokeWidth = 4,
  fill = "#ef4444",
  draw = 1,
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
    style={{ opacity: Math.max(0, Math.min(1, draw)) }}
  >
    <path d="M24 44 C24 44 9 27 9 17 A15 15 0 0 1 39 17 C39 27 24 44 24 44 Z" />
    <circle cx="24" cy="17" r="5.5" fill="#fff" stroke="none" />
  </svg>
);

// Symbole infini, tracé continu (path unique -> strokeDashoffset propre).
export const INFINITY_PATH =
  "M16 24 C16 16 8 16 8 24 C8 32 16 32 24 24 C32 16 40 16 40 24 C40 32 32 32 24 24";
export const INFINITY_LEN = 96;
export const IconInfinity: React.FC<IconProps & { fillMix?: number }> = ({
  size = 120,
  color = "#10A37F",
  strokeWidth = 5,
  draw = 1,
}) => (
  <svg
    width={size}
    height={size * 0.55}
    viewBox="0 4 48 40"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      strokeDasharray: INFINITY_LEN,
      strokeDashoffset: INFINITY_LEN * (1 - Math.max(0, Math.min(1, draw))),
    }}
  >
    <path d={INFINITY_PATH} />
  </svg>
);

// Poêle + crêpe — tâche « banale » du panneau gauche (Anim 7).
export const IconPan: React.FC<IconProps> = (p) => (
  <Svg {...p} len={190}>
    <ellipse cx="21" cy="26" rx="13" ry="9" />
    <path d="M34 26 h10" />
    <path d="M14 25 q7 -5 14 0" />
  </Svg>
);
