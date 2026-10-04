import React from "react";

// Pictogrammes stroke-only génériques (aucune marque réelle), même pattern
// que pippit/icons.tsx : `draw` (0→1) anime le tracé via strokeDashoffset.
//
//  Anim 3 : IconCoin · IconVideoClap
//  Anim 3 : IconStar
//  Anim 6 : IconChatMark
//  Anim 9 : IconLockBody · IconLockShackle
//  Anim 2 : IconSnowflake

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

export const IconCoin: React.FC<IconProps> = (p) => (
  <Svg {...p} len={150}>
    <circle cx="24" cy="24" r="18" />
    <text
      x="24"
      y="30"
      textAnchor="middle"
      fontSize="18"
      fontWeight={800}
      fill={p.color ?? "#fff"}
      stroke="none"
    >
      €
    </text>
  </Svg>
);

export const IconVideoClap: React.FC<IconProps> = (p) => (
  <Svg {...p} len={170}>
    <path d="M8 18 L40 18 L40 40 L8 40 Z" />
    <path d="M8 18 L14 10 L20 18" />
    <path d="M20 18 L26 10 L32 18" />
    <path d="M32 18 L38 10 L44 18" />
  </Svg>
);

export const IconStar: React.FC<IconProps> = (p) => (
  <Svg {...p} len={190}>
    <path d="M24 6 L28.5 18.5 L42 19 L31 27 L35 40 L24 32 L13 40 L17 27 L6 19 L19.5 18.5 Z" />
  </Svg>
);

export const IconChatMark: React.FC<IconProps> = (p) => (
  <Svg {...p} len={130}>
    <path d="M8 12 h32 v18 h-16 l-8 8 v-8 h-8 Z" />
  </Svg>
);

export const IconLockBody: React.FC<IconProps> = (p) => (
  <Svg {...p} len={120}>
    <rect x="10" y="22" width="28" height="20" rx="4" />
    <circle cx="24" cy="32" r="2.5" fill={p.color ?? "#fff"} stroke="none" />
  </Svg>
);

export const IconLockShackle: React.FC<IconProps> = (p) => (
  <Svg {...p} len={70}>
    <path d="M15 22 V16 a9 9 0 0 1 18 0 v6" />
  </Svg>
);

export const IconSnowflake: React.FC<IconProps> = (p) => (
  <Svg {...p} len={140}>
    <line x1="24" y1="6" x2="24" y2="42" />
    <line x1="8" y1="16" x2="40" y2="32" />
    <line x1="8" y1="32" x2="40" y2="16" />
  </Svg>
);
