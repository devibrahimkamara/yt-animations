import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";
import { GlassCard } from "../GlassMotionCard/GlassCard";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const toggleCardSchema = z.object({
  offLabel: z.string().default("Paroles"),
  onLabel: z.string().default("Instrumental"),
  title: z.string().default("Sélectionne ton style"),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(4),
});

export type ToggleCardProps = z.infer<typeof toggleCardSchema>;

export const ToggleCard: React.FC<ToggleCardProps> = ({
  offLabel,
  onLabel,
  title,
  accentColor,
  durationSecs,
}) => {
  const frame = useCurrentFrame();
  const toggleFrame = 35; // moment du toggle

  // Entrée
  const entryOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });

  // Position du thumb : 0 (OFF gauche) → 1 (ON droite) au frame 35
  const thumbProgress = interpolate(frame, [toggleFrame, toggleFrame + 12], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });

  // Couleur du track : gris → accent
  const trackR = Math.round(interpolate(thumbProgress, [0, 1], [60, parseInt(accentColor.slice(1, 3), 16)]));
  const trackG = Math.round(interpolate(thumbProgress, [0, 1], [60, parseInt(accentColor.slice(3, 5), 16)]));
  const trackB = Math.round(interpolate(thumbProgress, [0, 1], [70, parseInt(accentColor.slice(5, 7), 16)]));
  const trackColor = `rgb(${trackR},${trackG},${trackB})`;

  // Bounce du thumb au moment du toggle
  const thumbBounce = interpolate(frame, [toggleFrame + 12, toggleFrame + 15, toggleFrame + 18], [1, 1.15, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const trackW = 220;
  const trackH = 80;
  const thumbSize = 64;
  const thumbMaxX = trackW - thumbSize - 8;
  const thumbX = 8 + thumbProgress * thumbMaxX;

  // Opacité labels (inversés)
  const offOpacity = interpolate(thumbProgress, [0, 1], [0.9, 0.35], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const onOpacity = interpolate(thumbProgress, [0, 1], [0.35, 0.95], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Title fade-in
  const titleOpacity = interpolate(frame, [8, 22], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />
      <GlassCard layout="default" accentColor={accentColor}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", gap: 40, opacity: entryOpacity }}>

          {/* Titre */}
          <div style={{ opacity: titleOpacity, fontFamily, fontWeight: 600, fontSize: 26, color: "rgba(136,170,255,0.85)", letterSpacing: "0.06em" }}>
            {title}
          </div>

          {/* Toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>

            {/* Label OFF */}
            <span style={{
              fontFamily, fontWeight: 700, fontSize: 30,
              color: `rgba(255,100,100,${offOpacity})`,
              letterSpacing: "0.04em",
              minWidth: 130,
              textAlign: "right",
            }}>
              {offLabel}
            </span>

            {/* Track SVG */}
            <svg width={trackW} height={trackH} viewBox={`0 0 ${trackW} ${trackH}`}>
              {/* Track fond */}
              <rect x={0} y={0} width={trackW} height={trackH} rx={trackH / 2}
                fill={trackColor}
                style={{ filter: `drop-shadow(0 0 12px ${trackColor}80)` }}
              />
              {/* Thumb */}
              <circle
                cx={thumbX + thumbSize / 2}
                cy={trackH / 2}
                r={(thumbSize / 2) * thumbBounce}
                fill="#ffffff"
                style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))" }}
              />
            </svg>

            {/* Label ON */}
            <span style={{
              fontFamily, fontWeight: 700, fontSize: 30,
              color: `rgba(136,255,160,${onOpacity})`,
              letterSpacing: "0.04em",
              minWidth: 130,
              textAlign: "left",
            }}>
              {onLabel}
            </span>
          </div>

          {/* Sous-label dynamique */}
          <div style={{
            fontFamily, fontWeight: 600, fontSize: 22,
            color: thumbProgress > 0.5 ? "rgba(136,255,160,0.7)" : "rgba(255,100,100,0.7)",
            letterSpacing: "0.04em",
            opacity: interpolate(frame, [20, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}>
            {thumbProgress > 0.5 ? `✅ ${onLabel} activé` : `❌ ${offLabel} désactivé`}
          </div>

        </div>
      </GlassCard>
    </AbsoluteFill>
  );
};
