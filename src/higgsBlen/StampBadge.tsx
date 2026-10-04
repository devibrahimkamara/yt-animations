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
import { BLENDER_ORANGE, INK, FONT } from "./theme";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });

// Motif « série de tampons » du brief, unifié en un seul composant réutilisable.
// Tombe du haut avec une légère rotation, se pose avec un overshoot de spring
// à faible amortissement (« boum »), grain encreur (feTurbulence) + bordure
// irrégulière, flash blanc plein écran à l'impact.
//   Anim 1 : « 100 % BLENDER » / « 0 heure d'expérience »  (orange)
//   Anim 2 : « DÉBUTANT TOTAL »                            (FAIL_RED)

const PAD_X = 80;
const PAD_Y = 34;

export const StampBadge: React.FC<{
  text: string;
  subText?: string;
  startFrame: number;
  color?: string;
  restRotation?: number;
  fontSize?: number;
  fullScreenFlash?: boolean;
}> = ({
  text,
  subText,
  startFrame,
  color = BLENDER_ORANGE,
  restRotation = -8,
  fontSize = FONT.label,
  fullScreenFlash = true,
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

  // Chute + pose (spring sec, overshoot visible)
  const drop = spring({ frame: f, fps, config: { damping: 8, stiffness: 150 } });
  const y = interpolate(drop, [0, 1], [-260, 0], { extrapolateRight: "clamp" });
  const scale = interpolate(drop, [0, 0.55, 1], [1.4, 0.96, 1], { extrapolateRight: "clamp" });
  const rot = interpolate(drop, [0, 0.55, 1], [restRotation - 5, restRotation + 2, restRotation], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(f, [0, 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Flash d'impact (au moment où le tampon se pose ~ frame 10-13)
  const flash = interpolate(f, [10, 12, 16], [0, 0.7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sous-ligne : fade + translateY depuis le bas, 12 frames après le tampon
  const subT = interpolate(f, [12, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        <div
          style={{
            position: "relative",
            width: boxW,
            height: boxH,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // bordure volontairement asymétrique, style tampon
            borderRadius: "18px 30px 20px 34px",
            border: `6px solid ${color}`,
            transform: `translateY(${y}px) rotate(${rot}deg) scale(${scale})`,
            opacity,
            filter: `drop-shadow(0 0 34px ${color}55) contrast(1.08) saturate(0.9)`,
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
            <filter id={`grain-${startFrame}`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={startFrame} />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter={`url(#grain-${startFrame})`} />
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
              transform: `translateY(${interpolate(subT, [0, 1], [20, 0])}px)`,
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
