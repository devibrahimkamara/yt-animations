import React from "react";

// Pictogrammes stroke-only, formes génériques (aucune marque réelle).
// `draw` (0 → 1) anime le tracé via strokeDashoffset ; par défaut 1
// (dessiné). `len` = longueur de tracé approx. par icône.
//
//  Anim 2 : Person · ProductBox
//  Anim 4 : Check

type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
  draw?: number;
};

const Svg: React.FC<IconProps & { len: number; children: React.ReactNode }> = ({
  size = 96,
  color = "#fff",
  strokeWidth = 4,
  draw = 1,
  len,
  children,
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
    style={{
      strokeDasharray: len,
      strokeDashoffset: len * (1 - Math.max(0, Math.min(1, draw))),
    }}
  >
    {children}
  </svg>
);

export const IconPerson: React.FC<IconProps> = (p) => (
  <Svg {...p} len={140}>
    <circle cx="24" cy="14" r="7" />
    <path d="M10 40 q0 -16 14 -16 q14 0 14 16" />
  </Svg>
);

export const IconProductBox: React.FC<IconProps> = (p) => (
  <Svg {...p} len={170}>
    <path d="M8 16 L24 8 L40 16 L40 34 L24 42 L8 34 Z" />
    <path d="M8 16 L24 24 L40 16" />
    <line x1="24" y1="24" x2="24" y2="42" />
  </Svg>
);

export const IconCheck: React.FC<IconProps> = (p) => (
  <Svg {...p} len={40}>
    <path d="M10 25 L20 35 L38 12" />
  </Svg>
);
