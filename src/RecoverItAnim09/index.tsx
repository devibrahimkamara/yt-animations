import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

export const recoverItAnim09Schema = z.object({});

const TEXT_LINES = [
  { text: "Les photos sont irrécupérables", color: "#ffffff", delay: 112 },
  { text: "Ton client a payé 2 500 €", color: "#ffd700", delay: 124 },
  { text: "Peux-tu faire quelque chose ?", color: "#3060ff", delay: 136 },
];

export const RecoverItAnim09: React.FC<z.infer<typeof recoverItAnim09Schema>> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Broken photo
  const photoS = spring({ frame, fps, config: { mass: 0.5, damping: 10, stiffness: 180 } });

  // Padlock overlay on photo
  const padlockOp = interpolate(frame, [28, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // IRRECUPERABLE stamp crashes down
  const stampScale = interpolate(frame, [60, 78], [3.5, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE,
  });
  const stampOp = interpolate(frame, [58, 68], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stampRotate = interpolate(frame, [60, 78], [-4, -2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Bounce after slam
  const stampBounce = frame >= 78
    ? 1 + 0.06 * Math.exp(-(frame - 78) * 0.08) * Math.abs(Math.sin((frame - 78) * 0.5))
    : 1;

  // Status card (right side)
  const cardS = spring({ frame: frame - 92, fps, config: { mass: 0.4, damping: 10, stiffness: 200 } });

  // Red X overlay
  const xOp = interpolate(frame, [98, 112], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Red vignette
  const vignetteOp = 0.55 + 0.1 * Math.abs(Math.sin(frame * 0.07));

  return (
    <AbsoluteFill style={{ backgroundColor: "#060606" }}>
      {/* Red vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 85% 80% at 50% 50%, transparent 25%, rgba(239,68,68,${vignetteOp}) 100%)`,
        pointerEvents: "none", zIndex: 5,
      }} />

      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 80px", gap: 60 }}>

        {/* Left: broken wedding photo */}
        <div style={{
          opacity: photoS,
          transform: `scale(${0.85 + photoS * 0.15}) translateY(${(1 - photoS) * 30}px)`,
          position: "relative",
          flexShrink: 0,
          width: 240,
        }}>
          <svg width="240" height="290" viewBox="0 0 340 410">
            {/* Photo frame */}
            <rect x="6" y="6" width="328" height="398" rx="8" fill="#1a1010" stroke="rgba(239,68,68,0.35)" strokeWidth="2.5" />
            <rect x="20" y="20" width="300" height="370" rx="5" fill="#0d0606" />
            {/* Photo silhouettes (couple) */}
            <ellipse cx="120" cy="130" rx="32" ry="40" fill="rgba(255,255,255,0.06)" />
            <ellipse cx="120" cy="200" rx="38" ry="55" fill="rgba(255,255,255,0.05)" />
            <ellipse cx="210" cy="125" rx="28" ry="36" fill="rgba(255,255,255,0.06)" />
            <ellipse cx="210" cy="200" rx="34" ry="55" fill="rgba(255,255,255,0.05)" />
            {/* Cracks */}
            <line x1="50" y1="100" x2="200" y2="250" stroke="rgba(239,68,68,0.55)" strokeWidth="3" />
            <line x1="200" y1="250" x2="130" y2="360" stroke="rgba(239,68,68,0.5)" strokeWidth="2.5" />
            <line x1="200" y1="250" x2="300" y2="320" stroke="rgba(239,68,68,0.4)" strokeWidth="2" />
            <line x1="140" y1="140" x2="200" y2="250" stroke="rgba(239,68,68,0.35)" strokeWidth="1.5" />
          </svg>

          {/* Padlock */}
          {frame >= 26 && (
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: padlockOp,
            }}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                <rect x="14" y="36" width="52" height="38" rx="9" fill="rgba(239,68,68,0.9)" />
                <path d="M24 36 V26 A16 16 0 0 1 56 26 V36" fill="none" stroke="rgba(239,68,68,0.9)" strokeWidth="9" strokeLinecap="round" />
                <circle cx="40" cy="55" r="7" fill="#fff" />
              </svg>
            </div>
          )}

          {/* IRRECUPERABLE stamp */}
          {frame >= 56 && (
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: `translate(-50%, -50%) scale(${stampScale * stampBounce}) rotate(${stampRotate}deg)`,
              opacity: stampOp,
              whiteSpace: "nowrap",
            }}>
              <div style={{
                fontFamily, fontWeight: 800, fontSize: 34,
                color: "#ef4444",
                border: "4px solid #ef4444",
                borderRadius: 6, padding: "8px 16px",
                letterSpacing: "0.06em",
                background: "rgba(239,68,68,0.1)",
                boxShadow: "0 0 20px rgba(239,68,68,0.4)",
                textShadow: "0 0 10px rgba(239,68,68,0.5)",
              }}>
                IRRECUPERABLE
              </div>
            </div>
          )}

          {/* Red X over photo */}
          {frame >= 96 && (
            <div style={{ position: "absolute", inset: 0, opacity: xOp, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="200" height="200" viewBox="0 0 200 200" style={{ opacity: 0.6 }}>
                <line x1="20" y1="20" x2="180" y2="180" stroke="#ef4444" strokeWidth="14" strokeLinecap="round" />
                <line x1="180" y1="20" x2="20" y2="180" stroke="#ef4444" strokeWidth="14" strokeLinecap="round" />
              </svg>
            </div>
          )}
        </div>

        {/* Right: status card + text */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 28 }}>

          {/* Payment status card */}
          {frame >= 90 && (
            <div style={{
              opacity: cardS, transform: `scale(${0.85 + cardS * 0.15})`,
              position: "relative",
              background: "linear-gradient(135deg, rgba(60,8,8,0.88), rgba(40,5,5,0.85))",
              border: "1.5px solid rgba(239,68,68,0.4)",
              borderRadius: 20, padding: "24px 32px",
              boxShadow: "0 0 40px rgba(239,68,68,0.14), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}>
              <div style={{ fontFamily, fontWeight: 700, fontSize: 40, color: "rgba(252,165,165,0.75)", letterSpacing: "0.06em", marginBottom: 16 }}>
                STATUT CLIENT
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                  <span style={{ fontFamily, fontWeight: 600, fontSize: 36, color: "rgba(255,255,255,0.75)" }}>Service photo mariage</span>
                  <span style={{ fontFamily, fontWeight: 800, fontSize: 44, color: "#ffd700" }}>2 500 €</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                  <span style={{ fontFamily, fontWeight: 600, fontSize: 36, color: "rgba(255,255,255,0.75)" }}>Fichiers récupérés</span>
                  <span style={{ fontFamily, fontWeight: 800, fontSize: 44, color: "#ef4444" }}>0 / 847</span>
                </div>
              </div>

              {/* Red X overlay on card */}
              {frame >= 96 && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: xOp * 0.5 }}>
                  <svg width="120" height="80" viewBox="0 0 120 80">
                    <line x1="10" y1="10" x2="110" y2="70" stroke="#ef4444" strokeWidth="10" strokeLinecap="round" />
                    <line x1="110" y1="10" x2="10" y2="70" stroke="#ef4444" strokeWidth="10" strokeLinecap="round" />
                  </svg>
                </div>
              )}
            </div>
          )}

          {/* Text lines */}
          {TEXT_LINES.map((line, i) => {
            const lineOp = interpolate(frame, [line.delay, line.delay + 14], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });
            const lineX = interpolate(frame, [line.delay, line.delay + 14], [30, 0], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE,
            });
            return (
              <div key={i} style={{
                opacity: lineOp,
                transform: `translateX(${lineX}px)`,
                fontFamily, fontWeight: 700, fontSize: 44,
                color: line.color,
                textShadow: line.color !== "#ffffff" ? `0 0 20px ${line.color}60` : "none",
              }}>
                {line.text}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
