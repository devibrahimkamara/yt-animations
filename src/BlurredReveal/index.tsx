import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const blurredRevealSchema = z.object({
  blurredAmount: z.string().default("XX XXX €"),
  revealText: z.string().default("Révélé dans quelques minutes"),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(3),
});

export type BlurredRevealProps = z.infer<typeof blurredRevealSchema>;

const PadlockIcon: React.FC<{ color: string; glowIntensity: number }> = ({ color, glowIntensity }) => (
  <svg width="80" height="96" viewBox="0 0 80 96">
    <defs>
      <filter id="lockGlow">
        <feGaussianBlur stdDeviation={4 * glowIntensity} result="coloredBlur" />
        <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    {/* Shackle */}
    <path d="M22 44 V28 A18 18 0 0 1 58 28 V44" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" filter="url(#lockGlow)" />
    {/* Body */}
    <rect x="8" y="44" width="64" height="48" rx="10" fill="rgba(20,40,120,0.9)" stroke={color} strokeWidth="2" filter="url(#lockGlow)" />
    {/* Keyhole */}
    <circle cx="40" cy="64" r="9" fill={color} opacity={0.9} />
    <rect x="36" y="68" width="8" height="12" rx="2" fill={color} opacity={0.9} />
  </svg>
);

export const BlurredReveal: React.FC<BlurredRevealProps> = ({ blurredAmount, revealText, accentColor, durationSecs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = durationSecs * 30;

  const containerScale = spring({ frame, fps, config: { mass: 0.5, damping: 12, stiffness: 200 }, from: 0.85, to: 1 });
  const containerOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });

  // Pulsing blur effect
  const blurAmount = 14 + 3 * Math.sin(frame * 0.14);

  // Pulsing glow on the amount
  const glowIntensity = 0.5 + 0.5 * Math.abs(Math.sin(frame * 0.1));

  // Typewriter for reveal text (starts at frame 18)
  const textStart = 18;
  const textDuration = 50;
  const charProgress = interpolate(frame, [textStart, textStart + textDuration], [0, revealText.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const displayText = revealText.slice(0, Math.floor(charProgress));
  const showCursor = frame >= textStart && frame < totalFrames - 5;

  // Lock scale animation
  const lockScale = spring({ frame, fps, config: { mass: 0.4, damping: 10, stiffness: 220 }, from: 0, to: 1 });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />

      <AbsoluteFill style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        opacity: containerOpacity,
        transform: `scale(${containerScale})`,
      }}>

        {/* Blurred amount with padlock */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 24 }}>
          {/* Amount */}
          <div style={{
            fontFamily,
            fontWeight: 800,
            fontSize: 96,
            color: "#ffffff",
            filter: `blur(${blurAmount}px)`,
            letterSpacing: "0.04em",
            userSelect: "none",
            textShadow: `0 0 60px ${accentColor}${Math.round(glowIntensity * 150).toString(16).padStart(2, '0')}`,
          }}>
            {blurredAmount}
          </div>

          {/* Padlock */}
          <div style={{
            transform: `scale(${lockScale})`,
            filter: `drop-shadow(0 0 12px ${accentColor}80)`,
          }}>
            <PadlockIcon color={accentColor} glowIntensity={glowIntensity} />
          </div>
        </div>

        {/* Separator line */}
        <div style={{
          width: interpolate(frame, [20, 50], [0, 600], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          height: 1,
          background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)`,
        }} />

        {/* Typewriter reveal text */}
        <div style={{
          fontFamily,
          fontWeight: 700,
          fontSize: 28,
          color: "rgba(136,170,255,0.85)",
          letterSpacing: "0.05em",
          minHeight: 40,
          display: "flex",
          alignItems: "center",
        }}>
          {displayText}
          {showCursor && (
            <span style={{
              display: "inline-block",
              width: 3,
              height: 32,
              background: accentColor,
              marginLeft: 4,
              opacity: Math.abs(Math.sin(frame * 0.25)) > 0.5 ? 1 : 0,
            }} />
          )}
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
