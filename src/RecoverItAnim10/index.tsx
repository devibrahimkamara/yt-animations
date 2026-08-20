import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

export const recoverItAnim10Schema = z.object({});

// Confetti pieces
const CONFETTI = Array.from({ length: 28 }, (_, i) => ({
  x: 80 + ((i * 67) % 760),
  color: ["#22c55e", "#ffd700", "#3060ff", "#ef4444", "#ffffff"][i % 5],
  size: 8 + (i * 3) % 10,
  delay: (i * 5) % 35,
  speed: 3 + (i * 0.7) % 4,
  rot: (i * 37) % 360,
}));

export const RecoverItAnim10: React.FC<z.infer<typeof recoverItAnim10Schema>> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade from red glow (start of scene)
  const redGlowOp = interpolate(frame, [0, 30], [0.4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Scanner beam top→bottom (f30–130): beam at y%
  const scannerY = interpolate(frame, [30, 130], [-5, 105], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.linear,
  });

  // 2×3 grid: row 0 at ~30%, row 1 at ~55%, row 2 at ~75%
  const rowRevealY = [22, 50, 76];

  // Progress bar (f132–178)
  const progress = interpolate(frame, [132, 178], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE,
  });

  // Check mark at 100%
  const checkS = spring({ frame: frame - 176, fps, config: { mass: 0.4, damping: 8, stiffness: 280 } });

  // File bounce celebration (f186+) — wave from center
  const bounceStart = 186;

  // Badge (f200+)
  const badgeS = spring({ frame: frame - 200, fps, config: { mass: 0.4, damping: 9, stiffness: 200 } });

  // Fade to black (f215–240)
  const fadeOp = interpolate(frame, [215, 240], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#060606" }}>
      <AuroraBackground />

      {/* Residual red glow fading */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 80% 75% at 50% 50%, transparent 30%, rgba(239,68,68,${redGlowOp}) 100%)`,
        pointerEvents: "none",
      }} />

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 120px", gap: 32 }}>

        {/* File grid with scanner */}
        <div style={{ position: "relative", width: 720 }}>

          {/* Scanner beam */}
          {frame >= 28 && frame < 135 && (
            <div style={{
              position: "absolute",
              left: -20, right: -20,
              top: `${scannerY}%`,
              height: 6,
              background: "linear-gradient(90deg, transparent, #22c55e, #4ade80, #22c55e, transparent)",
              boxShadow: "0 0 30px rgba(34,197,94,0.8), 0 0 60px rgba(34,197,94,0.4)",
              borderRadius: 3,
              zIndex: 10,
              pointerEvents: "none",
            }} />
          )}

          {/* File grid — 2×3 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {[0, 1, 2].map(row => (
              <div key={row} style={{ display: "flex", gap: 18 }}>
                {[0, 1].map(col => {
                  const idx = row * 2 + col;
                  const rowY = rowRevealY[row];
                  const revealFrame = 30 + (rowY / 100) * 100 + col * 8;
                  const fileS = spring({ frame: frame - revealFrame, fps, config: { mass: 0.4, damping: 9, stiffness: 240 } });
                  const fileOp = interpolate(frame, [revealFrame, revealFrame + 14], [0, 1], {
                    extrapolateLeft: "clamp", extrapolateRight: "clamp",
                  });

                  // Bounce wave at f186
                  const distFromCenter = Math.abs(idx - 2.5);
                  const bounceDelay = bounceStart + distFromCenter * 6;
                  const bounceAmt = frame >= bounceStart
                    ? Math.exp(-(frame - bounceDelay) * 0.06) * Math.abs(Math.sin((frame - bounceDelay) * 0.5)) * 18
                    : 0;

                  return (
                    <div key={col} style={{
                      flex: 1, height: 130,
                      opacity: fileOp,
                      transform: `scale(${0.88 + fileS * 0.12}) translateY(-${Math.max(0, bounceAmt)}px)`,
                      borderRadius: 14,
                      background: "linear-gradient(135deg, rgba(20,55,25,0.6), rgba(12,38,16,0.5))",
                      border: `2px solid ${frame >= revealFrame + 8 ? "rgba(34,197,94,0.5)" : "rgba(34,197,94,0.15)"}`,
                      boxShadow: frame >= revealFrame + 8 ? "0 0 20px rgba(34,197,94,0.18)" : "none",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="52" height="44" viewBox="0 0 52 44">
                        <rect x="1" y="6" width="50" height="36" rx="5" fill="none" stroke="rgba(34,197,94,0.4)" strokeWidth="2" />
                        <circle cx="14" cy="17" r="6" fill="rgba(34,197,94,0.2)" />
                        <polyline points="1,36 14,26 24,31 35,22 51,36" fill="none" stroke="rgba(34,197,94,0.3)" strokeWidth="2" />
                        {frame >= revealFrame + 8 && (
                          <polyline points="8,20 14,27 30,13" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        )}
                      </svg>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          width: 720,
          opacity: interpolate(frame, [128, 136], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontFamily, fontWeight: 700, fontSize: 44, color: "rgba(134,239,172,0.75)" }}>
              Récupération en cours…
            </span>
            <span style={{ fontFamily, fontWeight: 800, fontSize: 44, color: "#22c55e" }}>
              {Math.round(progress * 100)}%
            </span>
          </div>
          <div style={{ height: 14, borderRadius: 7, background: "rgba(255,255,255,0.06)", overflow: "visible", position: "relative" }}>
            <div style={{
              height: "100%", borderRadius: 7,
              width: `${progress * 100}%`,
              background: "linear-gradient(90deg, #16a34a, #22c55e, #4ade80)",
              boxShadow: "0 0 20px rgba(34,197,94,0.6)",
              position: "relative",
              transition: "width 0.05s linear",
            }}>
              {/* Particle trail */}
              {progress > 0.05 && (
                <div style={{
                  position: "absolute", right: -3, top: "50%",
                  transform: "translateY(-50%)",
                  width: 20, height: 20,
                  background: "#4ade80",
                  borderRadius: "50%",
                  boxShadow: "0 0 16px rgba(74,222,128,0.9)",
                }} />
              )}
            </div>
          </div>

          {/* Check mark at 100% */}
          {frame >= 174 && (
            <div style={{
              display: "flex", justifyContent: "center", marginTop: 16,
              opacity: checkS, transform: `scale(${0.85 + checkS * 0.15})`,
            }}>
              <div style={{
                background: "linear-gradient(135deg, rgba(20,55,25,0.88), rgba(12,38,16,0.82))",
                border: "2px solid rgba(34,197,94,0.55)",
                borderRadius: 50, padding: "12px 32px",
                display: "flex", alignItems: "center", gap: 12,
                boxShadow: "0 0 40px rgba(34,197,94,0.25)",
              }}>
                <svg width="44" height="44" viewBox="0 0 28 28">
                  <circle cx="14" cy="14" r="13" fill="none" stroke="#22c55e" strokeWidth="2" />
                  <polyline points="7,14 12,19 21,10" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontFamily, fontWeight: 800, fontSize: 48, color: "#22c55e", textShadow: "0 0 20px rgba(34,197,94,0.5)" }}>
                  Récupération réussie ! 6 / 6
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Confetti */}
        {frame >= 188 && CONFETTI.map((c, i) => {
          const t = frame - (188 + c.delay);
          if (t < 0) return null;
          const y = t * c.speed;
          const wobble = Math.sin(t * 0.3 + i) * 20;
          const rot = c.rot + t * 3;
          const opacity = interpolate(t, [0, 8, 40, 55], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={i} style={{
              position: "absolute",
              left: c.x + wobble, top: 80 + y,
              opacity, transform: `rotate(${rot}deg)`,
              width: c.size, height: c.size * 0.5,
              background: c.color,
              borderRadius: 2,
              pointerEvents: "none",
            }} />
          );
        })}
      </AbsoluteFill>

      {/* Identity badge — top right */}
      {frame >= 198 && (
        <div style={{
          position: "absolute",
          top: 60, right: 80,
          opacity: badgeS, transform: `scale(${0.85 + badgeS * 0.15})`,
          background: "linear-gradient(135deg, rgba(20,40,120,0.55), rgba(10,20,60,0.45))",
          border: "1px solid rgba(80,130,255,0.35)",
          borderRadius: 14, padding: "22px 40px",
          boxShadow: "0 0 30px rgba(48,96,255,0.15)",
          display: "flex", alignItems: "center", gap: 16,
        }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#3060ff", boxShadow: "0 0 8px #3060ff" }} />
          <span style={{ fontFamily, fontWeight: 700, fontSize: 36, color: "#fff" }}>Ibrahim Camara</span>
        </div>
      )}

      {/* Fade to black */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundColor: "#000",
        opacity: fadeOp,
        pointerEvents: "none",
        zIndex: 100,
      }} />
    </AbsoluteFill>
  );
};
