import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";
import { GlassCard } from "../GlassMotionCard/GlassCard";

const { fontFamily } = loadFont("normal", { weights: ["600", "700"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);
const BAR_COUNT = 60;

export const waveformVisualizerSchema = z.object({
  mode: z.enum(["musique", "nom", "chargement"]).default("musique"),
  label: z.string().default("Génération en cours..."),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(4),
});

export type WaveformVisualizerProps = z.infer<typeof waveformVisualizerSchema>;

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  mode,
  label,
  accentColor,
  durationSecs,
}) => {
  const frame = useCurrentFrame();
  const totalFrames = durationSecs * 30;

  // Entrée globale
  const entryOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });

  // Amplitude : 0→1 sur 20 frames
  const amplitude = interpolate(frame, [5, 25], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });

  // Fadeout final
  const fadeOut = interpolate(frame, [totalFrames - 10, totalFrames], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const waveWidth = 900;
  const maxBarHeight = 160;
  const barWidth = 10;
  const barGap = 5;

  // Texte central (mode "nom")
  const nameOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });

  // Loading dots animation
  const dotCount = Math.floor(interpolate(frame, [0, 60], [0, 3], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  })) % 4;
  const dots = ".".repeat(dotCount);

  const labelOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />
      <GlassCard layout="wide" accentColor={accentColor}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", gap: 32 }}>

          {/* Label */}
          <div style={{ opacity: labelOpacity }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: accentColor, boxShadow: `0 0 12px ${accentColor}`,
                // Pulsation
                opacity: 0.6 + 0.4 * Math.abs(Math.sin(frame * 0.15)),
              }} />
              <span style={{
                fontFamily, fontWeight: 600, fontSize: 22,
                color: "rgba(136,170,255,0.9)", letterSpacing: "0.08em", textTransform: "uppercase",
              }}>
                {mode === "chargement" ? `${label}${dots}` : label}
              </span>
            </div>
          </div>

          {/* Waveform SVG */}
          <div style={{ position: "relative", width: waveWidth, height: maxBarHeight * 2 + 10 }}>
            <svg width={waveWidth} height={maxBarHeight * 2 + 10} viewBox={`0 0 ${waveWidth} ${maxBarHeight * 2 + 10}`}>
              <defs>
                <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(100,160,255,0.2)" />
                  <stop offset="30%" stopColor="rgba(136,170,255,0.85)" />
                  <stop offset="50%" stopColor="rgba(180,210,255,0.95)" />
                  <stop offset="70%" stopColor="rgba(136,170,255,0.85)" />
                  <stop offset="100%" stopColor="rgba(100,160,255,0.2)" />
                </linearGradient>
              </defs>
              {Array.from({ length: BAR_COUNT }).map((_, i) => {
                const x = i * (barWidth + barGap);
                const phase = i * 0.4;
                // Hauteur de la barre selon le mode
                let heightRatio: number;
                if (mode === "chargement") {
                  // Pulsation régulière lente
                  heightRatio = 0.3 + 0.5 * Math.abs(Math.sin(frame * 0.08 + phase));
                } else {
                  // Waveform organique
                  heightRatio = Math.abs(
                    0.4 * Math.sin(frame * 0.12 + phase) +
                    0.3 * Math.sin(frame * 0.07 + phase * 1.5 + 1) +
                    0.3 * Math.sin(frame * 0.19 + phase * 0.7 + 2)
                  );
                }
                const h = Math.max(4, heightRatio * maxBarHeight * amplitude);
                const cy = maxBarHeight + 5;
                return (
                  <rect
                    key={i}
                    x={x}
                    y={cy - h}
                    width={barWidth}
                    height={h * 2}
                    rx={barWidth / 2}
                    fill="url(#waveGrad)"
                  />
                );
              })}
            </svg>

            {/* Texte au centre en mode "nom" */}
            {mode === "nom" && (
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                opacity: nameOpacity,
                fontFamily,
                fontWeight: 700,
                fontSize: 64,
                color: "#ffffff",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                pointerEvents: "none",
                background: "linear-gradient(180deg, #88aaff 0%, #ffffff 60%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 20px rgba(136,170,255,0.6))",
                whiteSpace: "nowrap",
              }}>
                {label}
              </div>
            )}
          </div>

        </div>
      </GlassCard>
    </AbsoluteFill>
  );
};
