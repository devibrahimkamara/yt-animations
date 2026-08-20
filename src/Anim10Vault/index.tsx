import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

export const anim10Schema = z.object({
  title: z.string().default("Ce système m'a changé la vie"),
  suspenseLabel: z.string().default("Les vrais chiffres →"),
  blurredAmount: z.string().default("XX XXX €"),
  accentColor: z.string().default("#3b82f6"),
  durationSecs: z.number().default(6),
});

export const Anim10Vault: React.FC<z.infer<typeof anim10Schema>> = ({
  title, suspenseLabel, blurredAmount, accentColor, durationSecs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = durationSecs * fps;
  const OPEN_FRAME = Math.round(totalFrames * 0.62);

  // Title
  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 20], [-20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

  // Vault spring-in
  const vaultS = spring({ frame: frame - 5, fps, config: { mass: 0.6, damping: 12, stiffness: 160 } });

  // Dial continuous rotation
  const dialAngle = frame * 2.5;

  // Glow pulse (closed state)
  const glowBase = 25 + 18 * Math.abs(Math.sin(frame * 0.08));

  // Door opening animation
  const doorOpen = interpolate(frame, [OPEN_FRAME, OPEN_FRAME + 22], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE,
  });
  const doorAngle = doorOpen * -105; // degrees of rotation

  // Flash on open
  const flashOp = interpolate(frame, [OPEN_FRAME, OPEN_FRAME + 8, OPEN_FRAME + 18], [0, 0.85, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Amount reveal
  const revealStart = OPEN_FRAME + 18;
  const blurAmount = interpolate(frame, [revealStart, revealStart + 25], [12, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const amountOp = interpolate(frame, [revealStart, revealStart + 20], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const amountScale = spring({ frame: frame - revealStart, fps, config: { mass: 0.4, damping: 8, stiffness: 250 } });

  // Suspense label
  const suspenseOp = interpolate(frame, [totalFrames - 25, totalFrames - 8], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const isOpen = frame >= OPEN_FRAME;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />

      {/* Flash overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(255,255,255,0.95)",
        opacity: flashOp, pointerEvents: "none", zIndex: 10,
      }} />

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 120px", gap: 40 }}>

        {/* Title */}
        <div style={{ opacity: titleOp, transform: `translateY(${titleY}px)`, textAlign: "center" }}>
          <div style={{ fontFamily, fontWeight: 800, fontSize: 54, color: "#fff", letterSpacing: "0.01em" }}>{title}</div>
        </div>

        {/* Vault */}
        <div style={{
          opacity: vaultS, transform: `scale(${0.85 + vaultS * 0.15})`,
          position: "relative",
          width: 420, height: 420,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {/* Outer ring glow */}
          <div style={{
            position: "absolute", inset: -20,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${isOpen ? "rgba(255,215,0,0.15)" : `${accentColor}18`} 0%, transparent 70%)`,
            filter: `blur(${glowBase}px)`,
          }} />

          {/* Vault body SVG */}
          <svg width="420" height="420" viewBox="0 0 420 420" fill="none" style={{ position: "absolute" }}>
            <defs>
              <radialGradient id="vault-body" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor={isOpen ? "rgba(70,52,8,0.95)" : "rgba(25,40,90,0.95)"} />
                <stop offset="100%" stopColor={isOpen ? "rgba(40,30,5,0.98)" : "rgba(10,20,60,0.98)"} />
              </radialGradient>
              <filter id="vault-shadow">
                <feDropShadow dx="0" dy="0" stdDeviation="12"
                  floodColor={isOpen ? "rgba(255,215,0,0.4)" : `${accentColor}60`} />
              </filter>
            </defs>

            {/* Outer frame */}
            <rect x="20" y="20" width="380" height="380" rx="28"
              fill="url(#vault-body)"
              stroke={isOpen ? "rgba(255,215,0,0.6)" : "rgba(80,130,255,0.5)"}
              strokeWidth="2.5"
              filter="url(#vault-shadow)"
            />

            {/* Bolt details - corners */}
            {[[52, 52], [368, 52], [52, 368], [368, 368]].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="10"
                fill="rgba(255,255,255,0.08)"
                stroke={isOpen ? "rgba(255,215,0,0.3)" : "rgba(100,150,255,0.3)"}
                strokeWidth="1.5"
              />
            ))}

            {/* Handle bars (4 sides) */}
            {[[210, 42, 0], [210, 378, 0], [42, 210, 90], [378, 210, 90]].map(([cx, cy, rot], i) => (
              <g key={i} transform={`rotate(${rot}, ${cx}, ${cy})`}>
                <rect x={cx - 22} y={cy - 7} width={44} height={14} rx="7"
                  fill="rgba(255,255,255,0.12)"
                  stroke={isOpen ? "rgba(255,215,0,0.25)" : "rgba(100,150,255,0.25)"}
                  strokeWidth="1"
                />
              </g>
            ))}
          </svg>

          {/* Door (rotates open) */}
          <div style={{
            position: "absolute",
            width: 260, height: 260,
            transformOrigin: "left center",
            transform: `perspective(800px) rotateY(${doorAngle}deg)`,
            transition: "none",
          }}>
            <svg width="260" height="260" viewBox="0 0 260 260" fill="none">
              <defs>
                <radialGradient id="door-face" cx="45%" cy="38%" r="60%">
                  <stop offset="0%" stopColor="rgba(40,65,150,0.95)" />
                  <stop offset="100%" stopColor="rgba(18,32,88,0.98)" />
                </radialGradient>
              </defs>
              <circle cx="130" cy="130" r="128"
                fill="url(#door-face)"
                stroke="rgba(80,130,255,0.55)"
                strokeWidth="2"
              />
              {/* Locking bolts */}
              {[0, 90, 180, 270].map((angle, i) => (
                <g key={i} transform={`rotate(${angle}, 130, 130)`}>
                  <rect x="108" y="14" width="44" height="16" rx="8"
                    fill="rgba(255,255,255,0.1)"
                    stroke="rgba(100,150,255,0.35)"
                    strokeWidth="1.5"
                  />
                </g>
              ))}
            </svg>

            {/* Dial on door center */}
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: `translate(-50%, -50%) rotate(${dialAngle}deg)`,
              width: 110, height: 110,
            }}>
              <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
                <circle cx="55" cy="55" r="52"
                  fill="rgba(10,18,55,0.92)"
                  stroke="rgba(80,130,255,0.5)"
                  strokeWidth="2"
                />
                {/* Tick marks */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const a = (i / 12) * Math.PI * 2;
                  const inner = 38, outer = 46;
                  return (
                    <line key={i}
                      x1={55 + Math.sin(a) * inner} y1={55 - Math.cos(a) * inner}
                      x2={55 + Math.sin(a) * outer} y2={55 - Math.cos(a) * outer}
                      stroke="rgba(120,160,255,0.5)" strokeWidth="2" strokeLinecap="round"
                    />
                  );
                })}
                {/* Center knob */}
                <circle cx="55" cy="55" r="10"
                  fill="rgba(80,130,255,0.6)"
                  stroke="rgba(140,180,255,0.5)"
                  strokeWidth="1.5"
                />
                {/* Pointer */}
                <line x1="55" y1="20" x2="55" y2="38"
                  stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Vault interior (visible when open) */}
          {isOpen && (
            <div style={{
              position: "absolute",
              width: 260, height: 260,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,215,0,0.06) 0%, rgba(40,30,5,0.95) 70%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "2px solid rgba(255,215,0,0.15)",
            }}>
              <div style={{ fontSize: 52 }}>💰</div>
            </div>
          )}
        </div>

        {/* Amount reveal */}
        <div style={{
          opacity: amountOp,
          transform: `scale(${amountScale})`,
          textAlign: "center",
          display: "flex", flexDirection: "column", gap: 10, alignItems: "center",
        }}>
          <div style={{
            fontFamily, fontWeight: 800, fontSize: 88,
            color: "#ffd700",
            letterSpacing: "-0.02em",
            filter: `blur(${blurAmount}px)`,
            textShadow: "0 0 50px rgba(255,215,0,0.6)",
          }}>
            {blurredAmount}
          </div>
          <div style={{ fontFamily, fontWeight: 600, fontSize: 24, color: "rgba(255,220,100,0.6)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            par mois — partenariats de marques
          </div>
        </div>

        {/* Suspense CTA */}
        <div style={{
          opacity: suspenseOp,
          fontFamily, fontWeight: 800, fontSize: 40,
          background: `linear-gradient(90deg, #ffffff, ${accentColor})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          letterSpacing: "0.02em",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          {suspenseLabel}
          <span style={{ fontSize: 36 }}>→</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
