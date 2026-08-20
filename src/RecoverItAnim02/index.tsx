import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

export const recoverItAnim02Schema = z.object({});

const ICONS = [
  { label: "🔓", dx: -220, dy: -110, delay: 0 },
  { label: "💡", dx:  220, dy: -110, delay: 8 },
  { label: "🪙", dx: -220, dy:  110, delay: 16 },
  { label: "🙈", dx:  220, dy:  110, delay: 24 },
];

export const RecoverItAnim02: React.FC<z.infer<typeof recoverItAnim02Schema>> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Safe entrance
  const safeS = spring({ frame, fps, config: { mass: 0.5, damping: 10, stiffness: 180 } });

  // Door opens: rotation 0 → -75deg (f35–90)
  const doorAngle = interpolate(frame, [35, 90], [0, -75], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE,
  });

  // "SECRET" reveal
  const secretOp = interpolate(frame, [85, 105], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const secretS = spring({ frame: frame - 85, fps, config: { mass: 0.4, damping: 8, stiffness: 220 } });

  // Glow pulse on SECRET
  const glowPulse = 0.6 + 0.4 * Math.abs(Math.sin(frame * 0.1));

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />

      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>

        <div style={{
          position: "relative",
          opacity: safeS,
          transform: `scale(${0.85 + safeS * 0.15})`,
        }}>
          {/* Safe body SVG */}
          <svg width="360" height="400" viewBox="0 0 360 400" style={{ display: "block" }}>
            {/* Body */}
            <rect x="20" y="20" width="320" height="340" rx="20" fill="#1c1c1c" stroke="rgba(80,130,255,0.5)" strokeWidth="2.5" />
            {/* Inner recess */}
            <rect x="40" y="40" width="280" height="300" rx="14" fill="#111" stroke="rgba(80,130,255,0.18)" strokeWidth="1.5" />
            {/* Door — rendered separately below via div transform */}
            {/* Hinges */}
            <rect x="20" y="70" width="22" height="30" rx="5" fill="#2a2a2a" stroke="#3060ff" strokeWidth="1" />
            <rect x="20" y="290" width="22" height="30" rx="5" fill="#2a2a2a" stroke="#3060ff" strokeWidth="1" />
            {/* Legs */}
            <rect x="60" y="360" width="30" height="30" rx="6" fill="#1c1c1c" />
            <rect x="270" y="360" width="30" height="30" rx="6" fill="#1c1c1c" />
          </svg>

          {/* Door (rotates open) */}
          <div style={{
            position: "absolute",
            top: 40, left: 40,
            width: 280, height: 300,
            transformOrigin: "0% 50%",
            transform: `perspective(600px) rotateY(${doorAngle}deg)`,
          }}>
            <svg width="280" height="300" viewBox="0 0 280 300">
              <rect x="0" y="0" width="280" height="300" rx="14" fill="#222" stroke="rgba(80,130,255,0.4)" strokeWidth="2" />
              {/* Dial */}
              <circle cx="140" cy="140" r="60" fill="#1a1a1a" stroke="rgba(80,130,255,0.5)" strokeWidth="2.5" />
              <circle cx="140" cy="140" r="40" fill="#141414" stroke="rgba(80,130,255,0.25)" strokeWidth="1.5" />
              <line x1="140" y1="100" x2="140" y2="115" stroke="#3060ff" strokeWidth="3" strokeLinecap="round" />
              {/* Handle */}
              <rect x="220" y="120" width="40" height="60" rx="10" fill="#1c1c1c" stroke="rgba(80,130,255,0.4)" strokeWidth="2" />
            </svg>
          </div>

          {/* SECRET text revealed when door opens */}
          <div style={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: `translate(-50%, -55%) scale(${secretS})`,
            opacity: secretOp,
          }}>
            <div style={{
              fontFamily, fontWeight: 800, fontSize: 72,
              color: "#ffffff",
              letterSpacing: "0.12em",
              textShadow: `0 0 ${40 * glowPulse}px rgba(48,96,255,${0.8 * glowPulse}), 0 0 80px rgba(48,96,255,0.3)`,
              whiteSpace: "nowrap",
            }}>
              SECRET
            </div>
          </div>
        </div>

        {/* 4 icons around the safe */}
        {ICONS.map((icon, i) => {
          const iconS = spring({ frame: frame - (100 + icon.delay), fps, config: { mass: 0.4, damping: 8, stiffness: 260 } });
          if (frame < 98 + icon.delay) return null;
          return (
            <div key={i} style={{
              position: "absolute",
              top: "50%", left: "50%",
              transform: `translate(calc(-50% + ${icon.dx}px), calc(-50% + ${icon.dy}px)) scale(${iconS})`,
              opacity: iconS,
              fontSize: 52,
              filter: "drop-shadow(0 0 16px rgba(48,96,255,0.5))",
            }}>
              {icon.label}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
