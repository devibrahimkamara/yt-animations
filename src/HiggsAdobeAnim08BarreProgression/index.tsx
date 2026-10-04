import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { AI_FROM, AI_GRAD_CSS, AI_TO } from "../higgsAdobe/theme";

export const higgsAdobeAnim08Schema = z.object({
  fillPercent: z.number().default(15),
});
export type HiggsAdobeAnim08Props = z.infer<typeof higgsAdobeAnim08Schema>;

// Overlay discret par-dessus la face cam — composition transparente, pas de Stage.
const TRACK_W = 1100;
const TRACK_X = (1920 - TRACK_W) / 2;
const TRACK_Y = 980;
const TRACK_H = 8;

export const HiggsAdobeAnim08BarreProgression: React.FC<HiggsAdobeAnim08Props> = ({
  fillPercent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const trackOpacity = interpolate(frame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const fillP = interpolate(frame, [6, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const fillW = (TRACK_W * fillPercent * fillP) / 100;

  const glowPulse = interpolate(Math.sin((frame / 30) * Math.PI * 2), [-1, 1], [0.3, 0.5]);

  // Drapeau (42 → 54)
  const flagS = spring({
    frame: frame - 42,
    fps,
    config: { damping: 10, stiffness: 250, mass: 0.6 },
  });
  const flagScale = interpolate(flagS, [0, 0.6, 1], [0, 1.15, 1], { extrapolateRight: "clamp" });
  const flagY = interpolate(flagS, [0, 1], [8, 0], { extrapolateRight: "clamp" });
  const flagX = TRACK_X + fillW;

  const outT = interpolate(frame, [84, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ opacity: 1 - outT }}>
      {/* piste vide */}
      <div
        style={{
          position: "absolute",
          left: TRACK_X,
          top: TRACK_Y,
          width: TRACK_W,
          height: TRACK_H,
          borderRadius: TRACK_H,
          background: "rgba(255,255,255,0.15)",
          opacity: trackOpacity,
        }}
      />
      {/* glow sous le remplissage */}
      <div
        style={{
          position: "absolute",
          left: TRACK_X,
          top: TRACK_Y - 4,
          width: fillW,
          height: TRACK_H + 8,
          borderRadius: TRACK_H,
          background: AI_TO,
          filter: "blur(10px)",
          opacity: glowPulse,
        }}
      />
      {/* remplissage */}
      <div
        style={{
          position: "absolute",
          left: TRACK_X,
          top: TRACK_Y,
          width: fillW,
          height: TRACK_H,
          borderRadius: TRACK_H,
          background: AI_GRAD_CSS,
        }}
      />
      {/* drapeau */}
      {frame >= 42 && (
        <svg
          width={40}
          height={56}
          style={{
            position: "absolute",
            left: flagX - 2,
            top: TRACK_Y - 52,
            transform: `translateY(${flagY}px) scale(${flagScale})`,
            transformOrigin: "bottom left",
            overflow: "visible",
          }}
        >
          <line x1={2} y1={4} x2={2} y2={52} stroke={AI_TO} strokeWidth={3} strokeLinecap="round" />
          <path d="M2 4 L34 12 L2 24 Z" fill={AI_FROM} />
        </svg>
      )}
    </AbsoluteFill>
  );
};
