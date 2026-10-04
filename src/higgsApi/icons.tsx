import React from "react";

// Pictogrammes stroke-only génériques (aucune marque réelle), même pattern
// que higgsGpt2/icons.tsx : `draw` (0→1) anime le tracé via strokeDashoffset.
//
//  Anim 4 : IconPerson · IconGraduate · IconBriefcase
//  Anim 6 : IconCheck
//  Anim 7 : IconSparkle
//  Anim 9 : IconLoaderDots · IconArrowRight

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

export const IconPerson: React.FC<IconProps> = (p) => (
  <Svg {...p} len={90}>
    <circle cx="24" cy="14" r="7" />
    <path d="M9 40 C9 28 16 24 24 24 C32 24 39 28 39 40" />
  </Svg>
);

export const IconGraduate: React.FC<IconProps> = (p) => (
  <Svg {...p} len={140}>
    <path d="M4 18 L24 9 L44 18 L24 27 Z" />
    <path d="M14 22.5 V32 C14 35 18 38 24 38 C30 38 34 35 34 32 V22.5" />
    <path d="M44 18 V29" />
  </Svg>
);

export const IconBriefcase: React.FC<IconProps> = (p) => (
  <Svg {...p} len={130}>
    <rect x="6" y="16" width="36" height="24" rx="3" />
    <path d="M17 16 V11 C17 9 18.5 8 20 8 H28 C29.5 8 31 9 31 11 V16" />
    <path d="M6 27 H42" />
  </Svg>
);

export const IconCheck: React.FC<IconProps> = (p) => (
  <Svg {...p} len={44} strokeWidth={p.strokeWidth ?? 5}>
    <path d="M10 25 L20 35 L39 12" />
  </Svg>
);

export const IconSparkle: React.FC<IconProps> = (p) => (
  <Svg {...p} len={110} fill={p.color ?? "#fff"}>
    <path d="M24 4 L28 20 L44 24 L28 28 L24 44 L20 28 L4 24 L20 20 Z" />
  </Svg>
);

export const IconArrowRight: React.FC<IconProps> = (p) => (
  <Svg {...p} len={70}>
    <path d="M6 24 H40" />
    <path d="M28 12 L40 24 L28 36" />
  </Svg>
);

export const IconLoaderDots: React.FC<{
  size?: number;
  color?: string;
  frame: number;
}> = ({ size = 40, color = "#fff", frame }) => {
  const dotR = size / 10;
  const gap = size / 3.2;
  return (
    <svg width={size} height={size / 2.5} viewBox={`0 0 ${gap * 3} ${dotR * 4}`}>
      {[0, 1, 2].map((i) => {
        const o = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(frame * 0.2 + i * 1.5));
        return (
          <circle
            key={i}
            cx={gap * i + gap / 2}
            cy={dotR * 2}
            r={dotR}
            fill={color}
            opacity={o}
          />
        );
      })}
    </svg>
  );
};
