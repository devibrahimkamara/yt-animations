import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const aiRobotIntroSchema = z.object({
  robotName: z.string().default("Agent IA"),
  subtitle: z.string().default("Ton système de prospection automatisé"),
  accentColor: z.string().default("#00d4ff"),
  durationSecs: z.number().default(5),
});

export type AIRobotIntroProps = z.infer<typeof aiRobotIntroSchema>;

const RobotBody: React.FC<{ color: string; eyeGlow: number; frame: number }> = ({ color, eyeGlow, frame }) => {
  const antennaGlow = 0.6 + 0.4 * Math.abs(Math.sin(frame * 0.15));
  return (
    <svg width="220" height="260" viewBox="0 0 220 260">
      <defs>
        <radialGradient id="robotGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity={0.4} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </radialGradient>
        <filter id="eyeGlowFilter">
          <feGaussianBlur stdDeviation={3 * eyeGlow} result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Glow halo */}
      <ellipse cx="110" cy="150" rx="100" ry="120" fill="url(#robotGlow)" />

      {/* Antenna */}
      <line x1="110" y1="40" x2="110" y2="10" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <circle cx="110" cy="8" r="8" fill={color} opacity={antennaGlow}
        style={{ filter: `drop-shadow(0 0 ${6 * antennaGlow}px ${color})` }} />

      {/* Head */}
      <rect x="40" y="40" width="140" height="110" rx="22"
        fill="rgba(8,20,55,0.95)"
        stroke={color} strokeWidth="2.5" />

      {/* Eyes */}
      <rect x="58" y="68" width="38" height="28" rx="8"
        fill={color} opacity={eyeGlow * 0.9} filter="url(#eyeGlowFilter)" />
      <rect x="124" y="68" width="38" height="28" rx="8"
        fill={color} opacity={eyeGlow * 0.9} filter="url(#eyeGlowFilter)" />
      {/* Pupil shimmer */}
      <rect x="62" y="72" width="10" height="10" rx="3" fill="white" opacity={0.6} />
      <rect x="128" y="72" width="10" height="10" rx="3" fill="white" opacity={0.6} />

      {/* Mouth — data processing bar */}
      <rect x="64" y="116" width="92" height="8" rx="4" fill="rgba(255,255,255,0.1)" />
      <rect x="64" y="116"
        width={Math.abs(Math.sin(frame * 0.12)) * 92}
        height="8" rx="4"
        fill={color} opacity={0.8} />

      {/* Neck */}
      <rect x="95" y="150" width="30" height="20" rx="6" fill="rgba(6,15,45,0.95)" stroke={`${color}50`} strokeWidth="1" />

      {/* Body */}
      <rect x="30" y="168" width="160" height="80" rx="18"
        fill="rgba(6,15,45,0.95)"
        stroke={color} strokeWidth="1.5" />

      {/* Chest panel */}
      <rect x="55" y="182" width="110" height="52" rx="10" fill="rgba(0,212,255,0.08)" stroke={`${color}40`} strokeWidth="1" />

      {/* Blinking status lights */}
      {[0, 1, 2, 3].map(j => {
        const blink = Math.abs(Math.sin(frame * 0.2 + j * 0.8)) > 0.6 ? 1 : 0.15;
        const colors = [color, "#22c55e", "#f59e0b", color];
        return (
          <circle key={j} cx={68 + j * 26} cy={208} r={7}
            fill={colors[j]} opacity={blink} />
        );
      })}

      {/* Arms */}
      <rect x="0" y="168" width="32" height="60" rx="10" fill="rgba(6,15,45,0.9)" stroke={`${color}50`} strokeWidth="1.5" />
      <rect x="188" y="168" width="32" height="60" rx="10" fill="rgba(6,15,45,0.9)" stroke={`${color}50`} strokeWidth="1.5" />
    </svg>
  );
};

export const AIRobotIntro: React.FC<AIRobotIntroProps> = ({ robotName, subtitle, accentColor, durationSecs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const robotScale = spring({ frame, fps, config: { mass: 0.6, damping: 10, stiffness: 160 }, from: 0, to: 1 });
  const robotOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Intro tilt: small left-right motion on entry
  const introTilt = interpolate(frame, [0, 15, 25, 35], [-8, 5, -3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const nameOpacity = interpolate(frame, [18, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });
  const nameY = interpolate(frame, [18, 35], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });

  const subtitleOpacity = interpolate(frame, [30, 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });

  const eyeGlow = 0.6 + 0.4 * Math.abs(Math.sin(frame * 0.12));

  // Energy rays radiating out
  const raysOpacity = interpolate(frame, [8, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const numRays = 8;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Dark custom aurora with cyan */}
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse at center, rgba(0,60,80,0.6) 0%, rgba(0,0,0,0) 70%)",
      }} />
      <AbsoluteFill style={{ opacity: 0.3 }}>
        <AuroraBackground />
      </AbsoluteFill>

      {/* Rotating rays */}
      <AbsoluteFill style={{ opacity: raysOpacity }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 1920 1080">
          {Array.from({ length: numRays }).map((_, i) => {
            const angle = (i / numRays) * 360 + frame * 0.3;
            const rad = (angle * Math.PI) / 180;
            const x1 = 960, y1 = 480;
            const x2 = x1 + Math.cos(rad) * 500;
            const y2 = y1 + Math.sin(rad) * 500;
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={accentColor} strokeWidth="1"
                opacity={0.06 + 0.04 * Math.abs(Math.sin(i * 0.8))}
              />
            );
          })}
        </svg>
      </AbsoluteFill>

      <AbsoluteFill style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        opacity: robotOpacity,
      }}>

        {/* Robot */}
        <div style={{
          transform: `scale(${robotScale}) rotate(${introTilt}deg)`,
          filter: `drop-shadow(0 0 30px ${accentColor}50)`,
        }}>
          <RobotBody color={accentColor} eyeGlow={eyeGlow} frame={frame} />
        </div>

        {/* Name */}
        <div style={{
          opacity: nameOpacity,
          transform: `translateY(${nameY}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}>
          <div style={{
            fontFamily, fontWeight: 800, fontSize: 58,
            background: `linear-gradient(90deg, ${accentColor}, #ffffff, ${accentColor})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}>
            {robotName}
          </div>

          <div style={{
            opacity: subtitleOpacity,
            fontFamily, fontWeight: 600, fontSize: 22,
            color: "rgba(150,220,255,0.7)",
            letterSpacing: "0.06em",
            textAlign: "center",
          }}>
            {subtitle}
          </div>
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
