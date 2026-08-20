import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const kineticTypographySchema = z.object({
  word: z.string(),
  subtitle: z.string().optional(),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(3),
});

export type KineticTypographyProps = z.infer<typeof kineticTypographySchema>;

export const KineticTypography: React.FC<KineticTypographyProps> = ({
  word,
  subtitle,
  accentColor,
  durationSecs,
}) => {
  const frame = useCurrentFrame();
  const totalFrames = durationSecs * 30;

  // Impact : scale 4→1 sur 10 frames, overshoot léger
  const impactScale = interpolate(frame, [0, 8, 10, 13], [4, 0.9, 1.05, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Opacité globale
  const opacity = interpolate(frame, [0, 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fadeout final
  const fadeOut = interpolate(frame, [totalFrames - 10, totalFrames - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // RGB split : diverge en 0-6, converge en 6-14
  const rgbSplit = interpolate(frame, [0, 4, 14], [40, 22, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASING,
  });

  // Glitch vertical slices : actif frames 0-12
  const glitchActive = frame < 14;
  const glitchOffset = glitchActive ? Math.sin(frame * 7.3) * 12 : 0;
  const glitchOffset2 = glitchActive ? Math.sin(frame * 11.7 + 2) * 8 : 0;

  // Subtitle apparaît après l'impact
  const subtitleOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASING,
  });

  // Font size proportionnel à la longueur du texte
  const len = word.length;
  const fontSize = len <= 8 ? 220 : len <= 15 ? 170 : len <= 25 ? 130 : len <= 38 ? 100 : 78;
  const glowColor = accentColor;

  const textStyle: React.CSSProperties = {
    fontFamily,
    fontWeight: 800,
    fontSize,
    letterSpacing: "-0.03em",
    lineHeight: 1.12,
    userSelect: "none",
    textAlign: "center",
    display: "block",
    width: "100%",
  };

  const CONTAINER_WIDTH = 1560;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AuroraBackground />

      {/* Flash d'impact (frames 0-3) */}
      {frame < 4 && (
        <AbsoluteFill
          style={{
            background: "rgba(255,255,255,0.15)",
            opacity: interpolate(frame, [0, 4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        />
      )}

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: opacity * fadeOut,
        }}
      >
        {/* Couches RGB split */}
        <div style={{ position: "relative", transform: `scale(${impactScale})`, width: CONTAINER_WIDTH, textAlign: "center" }}>

          {/* Couche rouge (décalée à gauche) */}
          <span
            style={{
              ...textStyle,
              position: "absolute",
              top: 0,
              left: 0,
              color: "transparent",
              WebkitTextStroke: "0px",
              textShadow: "none",
              mixBlendMode: "screen",
              transform: `translate(${-rgbSplit}px, ${glitchOffset}px)`,
              WebkitTextFillColor: `rgba(255,40,80,${Math.min(1, rgbSplit / 20)})`,
            }}
          >
            {word}
          </span>

          {/* Couche bleue (décalée à droite) */}
          <span
            style={{
              ...textStyle,
              position: "absolute",
              top: 0,
              left: 0,
              mixBlendMode: "screen",
              transform: `translate(${rgbSplit}px, ${glitchOffset2}px)`,
              WebkitTextFillColor: `rgba(40,140,255,${Math.min(1, rgbSplit / 20)})`,
            }}
          >
            {word}
          </span>

          {/* Texte principal blanc */}
          <span
            style={{
              ...textStyle,
              position: "relative",
              background: `linear-gradient(180deg, #ffffff 0%, #c8d8ff 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "none",
              filter: `drop-shadow(0 0 30px ${glowColor}80) drop-shadow(0 0 60px ${glowColor}40)`,
            }}
          >
            {word}
          </span>
        </div>

        {/* Sous-titre */}
        {subtitle && (
          <div
            style={{
              opacity: subtitleOpacity,
              marginTop: 36,
              fontFamily,
              fontWeight: 600,
              fontSize: 38,
              color: "rgba(136,170,255,0.85)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            {subtitle}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
