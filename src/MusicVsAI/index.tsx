import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";
import { GlassCard } from "../GlassMotionCard/GlassCard";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const musicVsAISchema = z.object({
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(8),
});

export type MusicVsAIProps = z.infer<typeof musicVsAISchema>;

// SVG note de musique
const MusicNote: React.FC<{ size: number; color: string; opacity: number }> = ({ size, color, opacity }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ opacity }}>
    <path
      d="M65,10 L65,60 Q65,75 50,75 Q35,75 35,62 Q35,50 50,50 Q58,50 65,55 L65,25 L85,18 L85,30 L65,37 Z"
      fill={color}
    />
  </svg>
);

// SVG chip IA
const AIChip: React.FC<{ size: number; color: string; opacity: number; glow: number }> = ({ size, color, opacity, glow }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ opacity, filter: `drop-shadow(0 0 ${glow}px ${color})` }}>
    {/* Corps du chip */}
    <rect x="25" y="25" width="50" height="50" rx="8" fill={color} />
    {/* Connecteurs */}
    {[35, 50, 65].map((x) => (
      <g key={x}>
        <rect x={x - 2} y="15" width="4" height="10" rx="2" fill={color} opacity={0.7} />
        <rect x={x - 2} y="75" width="4" height="10" rx="2" fill={color} opacity={0.7} />
      </g>
    ))}
    {[35, 50, 65].map((y) => (
      <g key={y}>
        <rect x="15" y={y - 2} width="10" height="4" rx="2" fill={color} opacity={0.7} />
        <rect x="75" y={y - 2} width="10" height="4" rx="2" fill={color} opacity={0.7} />
      </g>
    ))}
    {/* Texte AI */}
    <text x="50" y="57" textAnchor="middle" fontSize="22" fontWeight="800" fill="#000" fontFamily="sans-serif">AI</text>
  </svg>
);

export const MusicVsAI: React.FC<MusicVsAIProps> = ({ accentColor, durationSecs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === ACTE 1 : Note de musique + croix (frames 0→60) ===
  const noteOpacity = interpolate(frame, [0, 15, 55, 70], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });
  const noteScale = spring({ frame, fps, config: { mass: 0.6, damping: 12, stiffness: 180 }, from: 0, to: 1 });

  // Croix rouge
  const crossScale = spring({ frame: Math.max(0, frame - 20), fps, config: { mass: 0.5, damping: 8, stiffness: 200 }, from: 0, to: 1 });
  const crossOpacity = interpolate(frame, [20, 30, 55, 70], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // === ACTE 2 : Flash de transition (frames 65→72) ===
  const flashOpacity = interpolate(frame, [65, 68, 75], [0, 0.85, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // === ACTE 3 : Chip IA (frames 75→fin) ===
  const aiScale = spring({ frame: Math.max(0, frame - 75), fps, config: { mass: 0.6, damping: 11, stiffness: 160 }, from: 0, to: 1 });
  const aiOpacity = interpolate(frame, [75, 90], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });
  const aiGlow = 15 + 10 * Math.abs(Math.sin(frame * 0.12));

  // Label IA
  const labelOpacity = interpolate(frame, [90, 105], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });
  const labelY = interpolate(frame, [90, 105], [20, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });

  // Fond rouge (acte 1)
  const redBgOpacity = interpolate(frame, [15, 30, 55, 70], [0, 0.15, 0.15, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />

      {/* Fond rouge léger pendant acte 1 */}
      <AbsoluteFill style={{ backgroundColor: `rgba(220,50,50,${redBgOpacity})` }} />

      {/* Flash blanc transition */}
      <AbsoluteFill style={{ backgroundColor: `rgba(255,255,255,${flashOpacity})` }} />

      <GlassCard layout="default" accentColor={accentColor}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32, width: "100%" }}>

          {/* ACTE 1 : Note + croix */}
          {frame < 75 && (
            <div style={{ position: "relative", opacity: noteOpacity, transform: `scale(${noteScale})` }}>
              <MusicNote size={160} color="rgba(136,170,255,0.9)" opacity={1} />
              {/* Croix rouge */}
              <div style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: crossOpacity,
                transform: `scale(${crossScale})`,
              }}>
                <svg width={160} height={160} viewBox="0 0 160 160">
                  <line x1="30" y1="30" x2="130" y2="130" stroke="#ff4444" strokeWidth="12" strokeLinecap="round" />
                  <line x1="130" y1="30" x2="30" y2="130" stroke="#ff4444" strokeWidth="12" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          )}

          {/* ACTE 3 : Chip IA */}
          {frame >= 70 && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, opacity: aiOpacity, transform: `scale(${aiScale})` }}>
              <AIChip size={160} color={accentColor} opacity={1} glow={aiGlow} />
              <div style={{
                opacity: labelOpacity,
                transform: `translateY(${labelY}px)`,
                fontFamily,
                fontWeight: 800,
                fontSize: 36,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                background: `linear-gradient(90deg, #ffffff, ${accentColor})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                Généré par IA
              </div>
              <div style={{
                opacity: interpolate(frame, [100, 115], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                fontFamily,
                fontWeight: 600,
                fontSize: 22,
                color: "rgba(136,170,255,0.7)",
                letterSpacing: "0.06em",
                textAlign: "center",
              }}>
                Aucune compétence musicale requise
              </div>
            </div>
          )}
        </div>
      </GlassCard>
    </AbsoluteFill>
  );
};
