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
import {
  IconJoystick,
  IconCamera,
  IconMegaphone,
  IconBuilding,
  IconCube,
} from "../higgsBlen/icons";
import {
  INK,
  FONT,
  BLENDER_ORANGE,
  BLENDER_ORANGE_DARK,
  BLENDER_ORANGE_MUTED,
} from "../higgsBlen/theme";

const { fontFamily } = loadFont("normal", { weights: ["600", "800"], subsets: ["latin"] });

// Anim 5 — « Constellation des débouchés » (330 frames)
// A Nœud central 0–30 · B 5 branches 30–240 (42 f/branche) · C Hold 240–330

export const higgsBlenAnim05Schema = z.object({
  centerLabel: z.string().default("Blender"),
  branches: z
    .array(z.string())
    .default([
      "Jeux vidéo",
      "Films d'animation",
      "Pub & VFX",
      "Architecture 3D",
      "Produit & packaging",
    ]),
});

export type HiggsBlenAnim05Props = z.infer<typeof higgsBlenAnim05Schema>;

const C = { x: 960, y: 540 };
const CENTER_R = 120;
const CENTER_FS = 60;
const LINE_LEN = 330;
const NODE_R = 72;
const ICONS = [IconJoystick, IconCamera, IconMegaphone, IconBuilding, IconCube];

const Branch: React.FC<{ index: number; label: string; delay: number }> = ({
  index,
  label,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - delay;
  if (f < 0) return null;

  const ang = ((-90 + index * 72) * Math.PI) / 180;
  const ux = Math.cos(ang);
  const uy = Math.sin(ang);
  const x1 = C.x + ux * CENTER_R;
  const y1 = C.y + uy * CENTER_R;
  const x2 = C.x + ux * (CENTER_R + LINE_LEN);
  const y2 = C.y + uy * (CENTER_R + LINE_LEN);

  const lineT = interpolate(f, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const nodeIn = spring({ frame: f - 18, fps, config: { damping: 12, stiffness: 150 } });
  const iconDraw = interpolate(f, [24, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelT = interpolate(f, [30, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // pulsation d'opacité de ligne, fréquence désynchronisée par branche
  const linePulse =
    f > 42 ? Math.sin(frame * (0.05 + index * 0.007)) * 0.125 + 0.725 : 0.7 * lineT;

  const Icon = ICONS[index % ICONS.length];

  return (
    <>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={BLENDER_ORANGE_MUTED}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={LINE_LEN}
          strokeDashoffset={LINE_LEN * (1 - lineT)}
          opacity={linePulse}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: x2,
          top: y2,
          transform: `translate(-50%,-50%) scale(${nodeIn})`,
        }}
      >
        <div
          style={{
            width: NODE_R * 2,
            height: NODE_R * 2,
            borderRadius: "50%",
            background: "#1a1a24",
            border: `2px solid ${BLENDER_ORANGE}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={NODE_R * 1.1} color={INK} strokeWidth={3} draw={iconDraw} />
        </div>
        <div
          style={{
            position: "absolute",
            top: NODE_R * 2 + 16,
            left: "50%",
            transform: `translateX(-50%) translateY(${interpolate(labelT, [0, 1], [10, 0])}px)`,
            opacity: labelT,
            fontFamily,
            fontWeight: 600,
            fontSize: FONT.micro,
            color: INK,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      </div>
    </>
  );
};

export const HiggsBlenAnim05Constellation: React.FC<HiggsBlenAnim05Props> = ({
  centerLabel,
  branches,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({ frame, fps, config: { damping: 10, stiffness: 130 } });
  const labelOpacity = interpolate(frame, [5, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const halo = 1 + Math.sin(frame / 14) * 0.05;
  const globalRot = interpolate(frame, [240, 330], [0, 1.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage outFrames={14}>
      <AbsoluteFill style={{ transform: `rotate(${globalRot}deg)`, transformOrigin: "960px 540px" }}>
        {/* halo pulsant */}
        <div
          style={{
            position: "absolute",
            left: C.x,
            top: C.y,
            width: CENTER_R * 2,
            height: CENTER_R * 2,
            marginLeft: -CENTER_R,
            marginTop: -CENTER_R,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${BLENDER_ORANGE}44 0%, transparent 70%)`,
            transform: `scale(${halo * 2.2})`,
            opacity: frame > 24 ? 0.8 : 0,
          }}
        />

        {branches.map((label, i) => (
          <Branch key={i} index={i} label={label} delay={30 + i * 42} />
        ))}

        {/* nœud central */}
        <div
          style={{
            position: "absolute",
            left: C.x,
            top: C.y,
            width: CENTER_R * 2,
            height: CENTER_R * 2,
            marginLeft: -CENTER_R,
            marginTop: -CENTER_R,
            borderRadius: "50%",
            background: `radial-gradient(circle at 50% 40%, ${BLENDER_ORANGE} 0%, ${BLENDER_ORANGE_DARK} 100%)`,
            boxShadow: `0 0 60px ${BLENDER_ORANGE}66`,
            transform: `scale(${pop})`,
            opacity: pop,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontFamily, fontWeight: 800, fontSize: CENTER_FS, color: INK, opacity: labelOpacity }}>
            {centerLabel}
          </span>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
