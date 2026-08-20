import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";
import { GlassCard } from "../GlassMotionCard/GlassCard";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const skillMeterSchema = z.object({
  title: z.string().default("Niveau d'expérience requis"),
  badgeLabel: z.string().default("DÉBUTANT"),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(7),
});

export type SkillMeterProps = z.infer<typeof skillMeterSchema>;

export const SkillMeter: React.FC<SkillMeterProps> = ({ title, badgeLabel, accentColor, durationSecs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Titre fade-in
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });
  const titleY = interpolate(frame, [0, 20], [20, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });

  // Barre tente de monter jusqu'à ~5% puis se bloque (frames 20→60)
  const barAttempt = interpolate(frame, [20, 55], [0, 0.05], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });

  // Micro-shake quand la barre se bloque (frames 55→62)
  const shakeX = frame >= 55 && frame <= 62
    ? Math.sin((frame - 55) * 3.5) * 6 * interpolate(frame, [55, 62], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  // Indicateur "0%" qui clignote après le shake
  const percentBlinkOpacity = frame >= 62
    ? interpolate(Math.sin((frame - 62) * 0.25), [-1, 1], [0.5, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  // Badge DÉBUTANT (spring dès frame 68)
  const badgeScale = spring({ frame: Math.max(0, frame - 68), fps, config: { mass: 0.5, damping: 9, stiffness: 200 }, from: 0, to: 1 });
  const badgeOpacity = frame >= 68 ? 1 : 0;
  const badgeGlow = 8 + 6 * Math.abs(Math.sin(frame * 0.1));

  // Sous-texte ✓
  const checkOpacity = interpolate(frame, [88, 105], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });
  const checkY = interpolate(frame, [88, 105], [15, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });

  const BAR_WIDTH = 480;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />
      <GlassCard layout="default" accentColor={accentColor}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", gap: 36 }}>

          {/* Titre */}
          <div style={{
            fontFamily,
            fontWeight: 700,
            fontSize: 28,
            color: "rgba(136,170,255,0.85)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            textAlign: "center",
          }}>
            {title}
          </div>

          {/* Barre de progression */}
          <div style={{ transform: `translateX(${shakeX}px)`, width: BAR_WIDTH }}>
            {/* Track */}
            <div style={{
              width: BAR_WIDTH,
              height: 24,
              borderRadius: 12,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(136,170,255,0.2)",
              overflow: "hidden",
              position: "relative",
            }}>
              {/* Fill — bloqué à ~5% */}
              <div style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                width: `${barAttempt * 100}%`,
                background: `linear-gradient(90deg, ${accentColor}, rgba(136,170,255,0.9))`,
                borderRadius: 12,
                boxShadow: `0 0 12px ${accentColor}80`,
              }} />
            </div>

            {/* Labels min/max */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <span style={{ fontFamily, fontWeight: 600, fontSize: 16, color: "rgba(136,170,255,0.5)" }}>0%</span>
              <span style={{ fontFamily, fontWeight: 600, fontSize: 16, color: "rgba(136,170,255,0.3)" }}>100%</span>
            </div>

            {/* Indicateur 0% clignotant */}
            {frame >= 62 && (
              <div style={{
                textAlign: "center",
                marginTop: 4,
                fontFamily,
                fontWeight: 800,
                fontSize: 48,
                opacity: percentBlinkOpacity,
                background: "linear-gradient(180deg, #ffffff 0%, #88aaff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                0%
              </div>
            )}
          </div>

          {/* Badge DÉBUTANT */}
          <div style={{
            opacity: badgeOpacity,
            transform: `scale(${badgeScale})`,
            background: "linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.1))",
            border: "2px solid #22c55e",
            borderRadius: 50,
            padding: "12px 40px",
            boxShadow: `0 0 ${badgeGlow}px rgba(34,197,94,0.6), inset 0 1px 0 rgba(255,255,255,0.1)`,
          }}>
            <span style={{
              fontFamily,
              fontWeight: 800,
              fontSize: 28,
              letterSpacing: "0.15em",
              color: "#4ade80",
            }}>
              {badgeLabel}
            </span>
          </div>

          {/* Sous-texte ✓ */}
          <div style={{
            opacity: checkOpacity,
            transform: `translateY(${checkY}px)`,
            fontFamily,
            fontWeight: 600,
            fontSize: 22,
            color: "#4ade80",
            letterSpacing: "0.04em",
          }}>
            ✓ Aucune compétence requise
          </div>

        </div>
      </GlassCard>
    </AbsoluteFill>
  );
};
