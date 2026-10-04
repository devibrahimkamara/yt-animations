import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { measureText } from "@remotion/layout-utils";
import { ASTRA_TEAL, INK, FONT } from "./theme";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });

// Tampon administratif : tombe du haut avec une légère rotation, se pose avec un
// overshoot de spring à faible amortissement (« clac »), grain encreur
// (feTurbulence) + bordure irrégulière, flash blanc plein écran à l'impact.
//   Anim 1 : « 100 % GPT-6 ASTRA »  (ASTRA_TEAL, pose douce, restRotation -6)
//   Anim 5 : « BARATIN »            (STRIKE_RED, pose sèche, restRotation -12)

const PAD_X = 90;
const PAD_Y = 40;

export const StampBadge: React.FC<{
  text: string;
  subText?: string;
  startFrame: number;
  color?: string;
  restRotation?: number;
  fontSize?: number;
  fullScreenFlash?: boolean;
  /** « clac » sec : spring plus raide + overshoot d'échelle marqué (Anim 5). */
  dry?: boolean;
}> = ({
  text,
  subText,
  startFrame,
  color = ASTRA_TEAL,
  restRotation = -6,
  fontSize = FONT.label,
  fullScreenFlash = true,
  dry = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;
  if (f < 0) return null;

  const label = text.toUpperCase();
  const { width: textW } = measureText({
    text: label,
    fontFamily,
    fontSize,
    fontWeight: 800,
    letterSpacing: "3px",
  });
  const boxW = textW + PAD_X * 2;
  const boxH = fontSize + PAD_Y * 2;

  // Chute + pose
  const drop = spring({
    frame: f,
    fps,
    config: dry
      ? { damping: 14, stiffness: 260, mass: 0.7 }
      : { damping: 10, stiffness: 140, mass: 0.8 },
  });
  const y = interpolate(drop, [0, 1], [dry ? -80 : -260, 0], { extrapolateRight: "clamp" });
  const scale = interpolate(
    drop,
    [0, 0.55, 1],
    dry ? [3, 0.94, 1] : [1.35, 1.06, 1],
    { extrapolateRight: "clamp" },
  );
  const rot = interpolate(
    drop,
    [0, 0.55, 1],
    [restRotation - 5, restRotation + 2, restRotation],
    { extrapolateRight: "clamp" },
  );
  const opacity = interpolate(f, [0, 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Flash d'impact (au moment où le tampon se pose)
  const impactF = dry ? 6 : 11;
  const flash = interpolate(
    f,
    [impactF - 1, impactF + 1, impactF + 5],
    [0, 0.75, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Micro-respiration en hold (évite le freeze total)
  const breathe = f > impactF + 8 ? 1 + Math.sin((f - impactF - 8) / 15) * 0.012 : 1;

  // Sous-ligne : fade + translateY depuis le bas
  const subT = interpolate(f, [14, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div
          style={{
            position: "relative",
            width: boxW,
            height: boxH,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "18px 30px 20px 34px",
            border: `8px solid ${color}`,
            background: "rgba(10,10,14,0.62)",
            backdropFilter: "blur(2px)",
            transform: `translateY(${y}px) rotate(${rot}deg) scale(${scale * breathe})`,
            opacity,
            filter: `drop-shadow(0 0 44px ${color}66) contrast(1.08) saturate(0.92)`,
          }}
        >
          <span
            style={{
              fontFamily,
              fontWeight: 800,
              fontSize,
              letterSpacing: "3px",
              color,
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </span>
          {/* grain encreur */}
          <svg
            width={boxW}
            height={boxH}
            style={{
              position: "absolute",
              inset: 0,
              mixBlendMode: "overlay",
              opacity: 0.35,
              borderRadius: "18px 30px 20px 34px",
            }}
          >
            <filter id={`stampgrain-${startFrame}`}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.9"
                numOctaves="2"
                seed={startFrame}
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter={`url(#stampgrain-${startFrame})`} />
          </svg>
        </div>

        {subText && (
          <div
            style={{
              fontFamily,
              fontWeight: 800,
              fontSize: FONT.micro,
              color: INK,
              opacity: subT,
              transform: `translateY(${interpolate(subT, [0, 1], [22, 0])}px)`,
            }}
          >
            {subText}
          </div>
        )}
      </div>

      {fullScreenFlash && <AbsoluteFill style={{ background: INK, opacity: flash }} />}
    </AbsoluteFill>
  );
};
