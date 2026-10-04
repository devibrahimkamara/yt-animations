import React from "react";

// Pictogrammes stroke-only, formes génériques (aucune marque réelle, aucun
// icône Blender). `draw` (0 → 1) anime le tracé via strokeDashoffset ; par
// défaut 1 (dessiné). `len` = longueur de tracé approx. par icône.
//
//  Anim 5 : Joystick / Camera / Megaphone / Building / Cube
//  Anim 2 : Folder      Anim 7 : ThumbUp

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

export const IconJoystick: React.FC<IconProps> = (p) => (
  <Svg {...p} len={170}>
    <line x1="24" y1="12" x2="24" y2="26" />
    <circle cx="24" cy="9" r="4" />
    <path d="M12 40 q12 -14 24 0 q-12 6 -24 0 Z" />
  </Svg>
);

export const IconCamera: React.FC<IconProps> = (p) => (
  <Svg {...p} len={180}>
    <rect x="7" y="16" width="26" height="18" rx="3" />
    <path d="M33 22 l8 -4 v12 l-8 -4 Z" />
    <circle cx="20" cy="25" r="5" />
  </Svg>
);

export const IconMegaphone: React.FC<IconProps> = (p) => (
  <Svg {...p} len={170}>
    <path d="M10 20 v8 l20 8 V12 Z" />
    <path d="M10 22 h-3 v4 h3" />
    <path d="M30 18 q8 6 0 12" />
  </Svg>
);

export const IconBuilding: React.FC<IconProps> = (p) => (
  <Svg {...p} len={200}>
    <rect x="14" y="8" width="20" height="32" />
    <line x1="20" y1="16" x2="20" y2="16.5" />
    <line x1="28" y1="16" x2="28" y2="16.5" />
    <line x1="20" y1="24" x2="20" y2="24.5" />
    <line x1="28" y1="24" x2="28" y2="24.5" />
    <line x1="20" y1="32" x2="28" y2="32" />
  </Svg>
);

export const IconCube: React.FC<IconProps> = (p) => (
  <Svg {...p} len={180}>
    <path d="M24 8 l14 8 v16 l-14 8 -14 -8 V16 Z" />
    <path d="M10 16 l14 8 14 -8" />
    <line x1="24" y1="24" x2="24" y2="40" />
  </Svg>
);

export const IconFolder: React.FC<IconProps> = (p) => (
  <Svg {...p} len={120}>
    <path d="M8 14 h10 l4 4 h18 v20 H8 Z" />
  </Svg>
);

export const IconThumbUp: React.FC<IconProps> = (p) => (
  <Svg {...p} len={150}>
    <path d="M14 22 h6 v18 h-6 Z" />
    <path d="M20 22 l6 -12 q4 0 4 4 v6 h8 q3 0 2 4 l-3 10 q-1 4 -5 4 H20 Z" />
  </Svg>
);
