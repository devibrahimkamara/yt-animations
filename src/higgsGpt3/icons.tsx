import React from "react";

// Pictogrammes stroke-only génériques (aucune marque réelle), même pattern
// que higgsGpt2/icons.tsx : `draw` (0→1) anime le tracé via strokeDashoffset.
//
//  Anim 2 : IconImage · IconFilmReel · IconCoin
//  Anim 3 : IconCamera · IconDrone · IconSofa (colonne classique)
//           IconComputer · IconWand · IconCloud (colonne setup IA)
//  Anim 4 : IconBuilding
//  Anim 6 : IconCheck
//  Anim 7 : IconImage · IconWand · IconMic · IconScissors

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

export const IconImage: React.FC<IconProps> = (p) => (
  <Svg {...p} len={170}>
    <rect x="6" y="8" width="36" height="32" rx="3" />
    <circle cx="17" cy="19" r="4" />
    <path d="M10 36 L20 24 L28 32 L34 24 L40 30" />
  </Svg>
);

export const IconFilmReel: React.FC<IconProps> = (p) => (
  <Svg {...p} len={190}>
    <circle cx="24" cy="24" r="18" />
    <circle cx="24" cy="14" r="4" />
    <circle cx="24" cy="34" r="4" />
    <circle cx="14" cy="24" r="4" />
    <circle cx="34" cy="24" r="4" />
    <circle cx="24" cy="24" r="3" />
  </Svg>
);

export const IconCoin: React.FC<IconProps> = (p) => (
  <Svg {...p} len={150}>
    <circle cx="24" cy="24" r="18" />
    <path d="M24 14 v20 M18 19 a6 5 0 0 1 12 0 a6 5 0 0 1 -12 9 a6 5 0 0 1 12 0" />
  </Svg>
);

export const IconCamera: React.FC<IconProps> = (p) => (
  <Svg {...p} len={170}>
    <path d="M6 16 h8 l4 -6 h12 l4 6 h8 v22 h-36 Z" />
    <circle cx="24" cy="27" r="8" />
  </Svg>
);

export const IconDrone: React.FC<IconProps> = (p) => (
  <Svg {...p} len={190}>
    <rect x="18" y="20" width="12" height="8" rx="2" />
    <path d="M18 22 L8 12 M30 22 L40 12 M18 26 L8 36 M30 26 L40 36" />
    <circle cx="8" cy="12" r="4" />
    <circle cx="40" cy="12" r="4" />
    <circle cx="8" cy="36" r="4" />
    <circle cx="40" cy="36" r="4" />
  </Svg>
);

export const IconSofa: React.FC<IconProps> = (p) => (
  <Svg {...p} len={170}>
    <path d="M8 26 v-6 a4 4 0 0 1 4 -4 h24 a4 4 0 0 1 4 4 v6" />
    <path d="M6 26 h36 v8 a2 2 0 0 1 -2 2 h-32 a2 2 0 0 1 -2 -2 Z" />
    <path d="M9 36 v4 M39 36 v4" />
  </Svg>
);

export const IconComputer: React.FC<IconProps> = (p) => (
  <Svg {...p} len={150}>
    <rect x="6" y="10" width="36" height="24" rx="2" />
    <path d="M16 40 h16 M24 34 v6" />
  </Svg>
);

export const IconWand: React.FC<IconProps> = (p) => (
  <Svg {...p} len={160}>
    <path d="M10 38 L32 16" />
    <path d="M32 6 L34 12 L40 14 L34 16 L32 22 L30 16 L24 14 L30 12 Z" />
  </Svg>
);

export const IconCloud: React.FC<IconProps> = (p) => (
  <Svg {...p} len={150}>
    <path d="M14 32 a8 8 0 0 1 1 -15.9 A10 10 0 0 1 34 18 a7 7 0 0 1 -1 14 Z" />
    <path d="M24 26 v10 M19 32 l5 5 l5 -5" />
  </Svg>
);

export const IconBuilding: React.FC<IconProps> = (p) => (
  <Svg {...p} len={180}>
    <rect x="12" y="8" width="18" height="34" />
    <rect x="30" y="18" width="10" height="24" />
    <path d="M17 15 h3 M23 15 h3 M17 22 h3 M23 22 h3 M17 29 h3 M23 29 h3 M34 25 h3 M34 32 h3" />
  </Svg>
);

export const IconMic: React.FC<IconProps> = (p) => (
  <Svg {...p} len={150}>
    <rect x="18" y="6" width="12" height="22" rx="6" />
    <path d="M12 22 a12 12 0 0 0 24 0 M24 34 v8 M17 42 h14" />
  </Svg>
);

export const IconScissors: React.FC<IconProps> = (p) => (
  <Svg {...p} len={170}>
    <circle cx="12" cy="14" r="5" />
    <circle cx="12" cy="34" r="5" />
    <path d="M16 17 L40 40 M16 31 L40 8" />
  </Svg>
);

export const IconCheck: React.FC<IconProps> = (p) => (
  <Svg {...p} len={60}>
    <path d="M10 25 L19 34 L38 13" />
  </Svg>
);
