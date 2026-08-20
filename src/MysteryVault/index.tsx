import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const mysteryVaultSchema = z.object({
  title: z.string().default("Système #1"),
  blurredAmount: z.string().default("XX XXX €"),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(3),
});

export type MysteryVaultProps = z.infer<typeof mysteryVaultSchema>;

const VaultDoor: React.FC<{ dialAngle: number; glowIntensity: number; accentColor: string }> = ({
  dialAngle, glowIntensity, accentColor
}) => (
  <svg width="280" height="280" viewBox="0 0 280 280">
    <defs>
      <radialGradient id="vaultGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={accentColor} stopOpacity={0.3 * glowIntensity} />
        <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
      </radialGradient>
    </defs>
    {/* Outer ring glow */}
    <circle cx="140" cy="140" r="135" fill="url(#vaultGlow)" />
    {/* Main vault body */}
    <rect x="20" y="20" width="240" height="240" rx="20" fill="rgba(15,25,60,0.95)"
      stroke="rgba(100,140,255,0.4)" strokeWidth="2" />
    {/* Outer door ring */}
    <circle cx="140" cy="140" r="110" fill="none" stroke="rgba(80,120,255,0.5)" strokeWidth="3" />
    <circle cx="140" cy="140" r="100" fill="rgba(10,20,50,0.9)" stroke="rgba(60,100,220,0.6)" strokeWidth="2" />
    {/* Handle bars (4 rotated) */}
    {[0, 90, 180, 270].map(angle => (
      <rect
        key={angle}
        x="136" y="48" width="8" height="34"
        rx="4"
        fill="rgba(120,160,255,0.7)"
        transform={`rotate(${angle + dialAngle}, 140, 140)`}
      />
    ))}
    {/* Dial center */}
    <circle cx="140" cy="140" r="28" fill="rgba(20,40,100,0.95)" stroke="rgba(80,120,255,0.6)" strokeWidth="2" />
    <circle cx="140" cy="140" r="8" fill={accentColor} opacity={0.8} />
    {/* Dial marker */}
    <line
      x1="140" y1="118"
      x2="140" y2="126"
      stroke={accentColor}
      strokeWidth="3"
      strokeLinecap="round"
      transform={`rotate(${dialAngle}, 140, 140)`}
    />
    {/* Bolt holes */}
    {[30, 150, 210, 330].map(angle => {
      const rad = (angle * Math.PI) / 180;
      const cx = 140 + 78 * Math.cos(rad);
      const cy = 140 + 78 * Math.sin(rad);
      return <circle key={angle} cx={cx} cy={cy} r="7" fill="rgba(40,70,160,0.8)" stroke="rgba(80,120,255,0.4)" strokeWidth="1.5" />;
    })}
  </svg>
);

export const MysteryVault: React.FC<MysteryVaultProps> = ({ title, blurredAmount, accentColor, durationSecs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const containerScale = spring({ frame, fps, config: { mass: 0.6, damping: 12, stiffness: 180 }, from: 0.7, to: 1 });
  const containerOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });

  const titleY = interpolate(frame, [0, 22], [-20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });
  const titleOpacity = interpolate(frame, [0, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });

  const amountOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });

  // Slow dial rotation
  const dialAngle = frame * 1.2;

  // Pulsing glow
  const glowIntensity = 0.6 + 0.4 * Math.sin(frame * 0.15);

  // Vignette pulsing intensity
  const vignettePulse = 0.7 + 0.3 * Math.sin(frame * 0.12);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />

      {/* Dark vignette overlay for mystery */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at center, transparent 30%, rgba(0,0,10,${vignettePulse * 0.7}) 100%)`,
      }} />

      <AbsoluteFill style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        opacity: containerOpacity,
        transform: `scale(${containerScale})`,
      }}>

        {/* Title */}
        <div style={{
          fontFamily,
          fontWeight: 800,
          fontSize: 42,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#ffffff",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          textShadow: `0 0 30px ${accentColor}80`,
        }}>
          {title}
        </div>

        {/* Vault */}
        <div style={{
          filter: `drop-shadow(0 0 ${20 * glowIntensity}px ${accentColor}60)`,
        }}>
          <VaultDoor dialAngle={dialAngle} glowIntensity={glowIntensity} accentColor={accentColor} />
        </div>

        {/* Blurred amount */}
        <div style={{
          opacity: amountOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}>
          <div style={{
            fontFamily,
            fontWeight: 800,
            fontSize: 56,
            color: "#ffffff",
            filter: "blur(14px)",
            letterSpacing: "0.05em",
            userSelect: "none",
          }}>
            {blurredAmount}
          </div>
          <div style={{
            fontFamily,
            fontWeight: 600,
            fontSize: 18,
            color: "rgba(136,170,255,0.6)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}>
            Montant confidentiel
          </div>
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
