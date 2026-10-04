import React from "react";

// Pictogrammes stroke-only génériques (aucune marque réelle), même pattern
// que higgsGpt/icons.tsx : `draw` (0→1) anime le tracé via strokeDashoffset.
//
//  Anim 1 : IconPlay · IconEye · IconClock
//  Anim 2 : IconTarget · IconFilmPen · IconBroadcast
//  Anim 5 : IconCheck
//  Anim 7 : IconChatMark
//  Anim 8 : IconClapper · IconPhotoFrame · IconSparkle · IconFilmStrip

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

export const IconPlay: React.FC<IconProps> = (p) => (
  <Svg {...p} len={90} fill={p.color ?? "#fff"}>
    <path d="M16 10 L38 24 L16 38 Z" />
  </Svg>
);

export const IconEye: React.FC<IconProps> = (p) => (
  <Svg {...p} len={110}>
    <path d="M4 24 C10 12 38 12 44 24 C38 36 10 36 4 24 Z" />
    <circle cx="24" cy="24" r="6" />
  </Svg>
);

export const IconClock: React.FC<IconProps> = (p) => (
  <Svg {...p} len={130}>
    <circle cx="24" cy="24" r="18" />
    <path d="M24 14 v10 l7 6" />
  </Svg>
);

// Cible — signifiant « niche ».
export const IconTarget: React.FC<IconProps> = (p) => (
  <Svg {...p} len={190}>
    <circle cx="24" cy="24" r="18" />
    <circle cx="24" cy="24" r="10" />
    <circle cx="24" cy="24" r="2.4" fill={p.color ?? "#fff"} />
  </Svg>
);

// Stylo + bobine — signifiant « script + vidéo ».
export const IconFilmPen: React.FC<IconProps> = (p) => (
  <Svg {...p} len={170}>
    <circle cx="18" cy="26" r="10" />
    <circle cx="18" cy="26" r="3.5" />
    <path d="M30 10 L40 20 L22 38 L12 40 L14 30 Z" />
  </Svg>
);

// Flèche montante dans un cercle — signifiant « publication/diffusion ».
export const IconBroadcast: React.FC<IconProps> = (p) => (
  <Svg {...p} len={160}>
    <circle cx="24" cy="24" r="18" />
    <path d="M24 32 V16 M16 22 L24 14 L32 22" />
  </Svg>
);

export const IconCheck: React.FC<IconProps> = (p) => (
  <Svg {...p} len={60}>
    <path d="M10 25 L19 34 L38 13" />
  </Svg>
);

// Signifiant abstrait de "modèle de langage" — spirale inscrite dans un
// hexagone (même esprit que IconAstra de higgsGpt, forme différente pour ne
// pas dupliquer le pictogramme).
export const IconChatMark: React.FC<IconProps> = (p) => (
  <Svg {...p} len={210}>
    <path d="M24 4 L42 14 V34 L24 44 L6 34 V14 Z" />
    <path d="M16 22 a8 8 0 1 1 8 8" />
    <circle cx="24" cy="30" r="1.8" fill={p.color ?? "#fff"} />
  </Svg>
);

export const IconClapper: React.FC<IconProps> = (p) => (
  <Svg {...p} len={180}>
    <path d="M6 20 L42 20 L42 40 L6 40 Z" />
    <path d="M6 20 L12 10 L20 10 L16 20 M22 10 L30 10 L26 20 M32 10 L40 10 L38 20" />
  </Svg>
);

export const IconPhotoFrame: React.FC<IconProps> = (p) => (
  <Svg {...p} len={170}>
    <rect x="6" y="8" width="36" height="32" rx="3" />
    <circle cx="17" cy="19" r="4" />
    <path d="M10 36 L20 24 L28 32 L34 24 L40 30" />
  </Svg>
);

export const IconSparkle: React.FC<IconProps> = (p) => (
  <Svg {...p} len={150}>
    <path d="M24 4 L28 20 L44 24 L28 28 L24 44 L20 28 L4 24 L20 20 Z" />
  </Svg>
);

export const IconFilmStrip: React.FC<IconProps> = (p) => (
  <Svg {...p} len={200}>
    <rect x="6" y="8" width="36" height="32" rx="3" />
    <line x1="6" y1="16" x2="14" y2="16" />
    <line x1="6" y1="24" x2="14" y2="24" />
    <line x1="6" y1="32" x2="14" y2="32" />
    <line x1="34" y1="16" x2="42" y2="16" />
    <line x1="34" y1="24" x2="42" y2="24" />
    <line x1="34" y1="32" x2="42" y2="32" />
  </Svg>
);
