import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

export const recoverItAnim05Schema = z.object({});

// 6 thumbnail cells (2 cols × 3 rows)
const THUMBS = Array.from({ length: 6 }, (_, i) => ({
  col: i % 2,
  row: Math.floor(i / 2),
  delay: i * 10,
}));

export const RecoverItAnim05: React.FC<z.infer<typeof recoverItAnim05Schema>> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Laptop entrance
  const laptopS = spring({ frame, fps, config: { mass: 0.5, damping: 10, stiffness: 180 } });

  // SD card slides in from left (f32–72)
  const sdX = interpolate(frame, [32, 72], [-300, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE,
  });
  const sdOp = interpolate(frame, [32, 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Progress bar (f165–210)
  const progress = interpolate(frame, [165, 210], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE,
  });

  // Badge (f212+)
  const badgeS = spring({ frame: frame - 212, fps, config: { mass: 0.4, damping: 9, stiffness: 220 } });

  // Screen glow pulse
  const glowOp = 0.25 + 0.1 * Math.abs(Math.sin(frame * 0.08));

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0 }}>

        {/* Laptop frame */}
        <div style={{
          opacity: laptopS,
          transform: `scale(${0.85 + laptopS * 0.15}) translateY(${(1 - laptopS) * 30}px)`,
          position: "relative",
        }}>
          {/* Screen housing */}
          <svg width="760" height="500" viewBox="0 0 760 500" style={{ display: "block" }}>
            <rect x="20" y="10" width="720" height="440" rx="16" fill="#1e1e1e" stroke="#333" strokeWidth="2" />
            {/* Screen area */}
            <rect x="40" y="28" width="680" height="406" rx="8" fill="#080808" />
            {/* Blue screen glow */}
            <rect x="40" y="28" width="680" height="406" rx="8" fill="none"
              stroke={`rgba(48,96,255,${glowOp})`} strokeWidth="3" />
            {/* Base */}
            <rect x="0" y="458" width="760" height="36" rx="10" fill="#1e1e1e" stroke="#333" strokeWidth="1.5" />
            <rect x="280" y="458" width="200" height="10" rx="5" fill="#2a2a2a" />
          </svg>

          {/* Thumbnail grid overlaid on screen */}
          <div style={{
            position: "absolute",
            top: 28, left: 40,
            width: 680, height: 406,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[0, 1, 2].map(row => (
                <div key={row} style={{ display: "flex", gap: 16 }}>
                  {[0, 1].map(col => {
                    const idx = row * 2 + col;
                    const t = THUMBS[idx];
                    const thumbS = spring({ frame: frame - (80 + t.delay), fps, config: { mass: 0.4, damping: 9, stiffness: 240 } });
                    const thumbOp = interpolate(frame, [80 + t.delay, 80 + t.delay + 14], [0, 1], {
                      extrapolateLeft: "clamp", extrapolateRight: "clamp",
                    });
                    const shade = 20 + (idx * 7) % 30;
                    return (
                      <div key={col} style={{
                        width: 280, height: 130,
                        opacity: thumbOp,
                        transform: `scale(${0.88 + thumbS * 0.12})`,
                        borderRadius: 12,
                        background: `rgb(${shade},${shade},${shade + 8})`,
                        border: "2px solid rgba(48,96,255,0.4)",
                        boxShadow: "0 0 16px rgba(48,96,255,0.12)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <svg width="52" height="44" viewBox="0 0 52 44" style={{ opacity: 0.5 }}>
                          <rect width="52" height="44" rx="6" fill="none" />
                          <circle cx="16" cy="16" r="7" fill="rgba(255,255,255,0.3)" />
                          <polyline points="0,32 16,20 28,28 38,22 52,34 52,44 0,44" fill="rgba(255,255,255,0.2)" />
                        </svg>
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Progress bar */}
              <div style={{
                width: "100%", marginTop: 12,
                opacity: interpolate(frame, [160, 170], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily, fontWeight: 600, fontSize: 40, color: "rgba(160,175,220,0.8)" }}>
                    Importation SD Card…
                  </span>
                  <span style={{ fontFamily, fontWeight: 700, fontSize: 40, color: "#3060ff" }}>
                    {Math.round(progress * 100)}%
                  </span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 4,
                    width: `${progress * 100}%`,
                    background: "linear-gradient(90deg, #3060ff, #6090ff)",
                    boxShadow: "0 0 12px rgba(48,96,255,0.5)",
                    transition: "width 0.05s linear",
                  }} />
                </div>
              </div>
            </div>
          </div>

          {/* SD card sliding in */}
          {frame >= 30 && frame < 160 && (
            <div style={{
              position: "absolute",
              top: "50%", left: 0,
              transform: `translate(${sdX}px, -50%)`,
              opacity: sdOp,
            }}>
              <svg width="72" height="96" viewBox="0 0 72 96">
                <rect x="4" y="4" width="64" height="88" rx="6" fill="#2a2a2a" stroke="#3060ff" strokeWidth="2" />
                <rect x="12" y="12" width="48" height="30" rx="3" fill="#1a1a1a" stroke="rgba(48,96,255,0.3)" strokeWidth="1" />
                <rect x="16" y="48" width="6" height="30" rx="2" fill="#333" />
                <rect x="26" y="48" width="6" height="36" rx="2" fill="#333" />
                <rect x="36" y="48" width="6" height="30" rx="2" fill="#333" />
                <rect x="46" y="48" width="6" height="36" rx="2" fill="#333" />
                <text x="36" y="32" textAnchor="middle" dominantBaseline="middle" fontSize="10"
                  fill="rgba(255,255,255,0.5)" style={{ fontFamily }}>SD</text>
              </svg>
            </div>
          )}
        </div>

        {/* Status badge — top right of screen */}
        {frame >= 210 && (
          <div style={{
            position: "absolute",
            top: 100, right: 200,
            opacity: badgeS, transform: `scale(${0.85 + badgeS * 0.15})`,
            background: "linear-gradient(135deg, rgba(20,40,120,0.55), rgba(10,20,60,0.45))",
            border: "1px solid rgba(80,130,255,0.35)",
            borderRadius: 18, padding: "20px 40px",
            boxShadow: "0 0 30px rgba(48,96,255,0.15)",
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#22c55e",
              boxShadow: "0 0 10px #22c55e", flexShrink: 0 }} />
            <span style={{ fontFamily, fontWeight: 700, fontSize: 40, color: "#fff" }}>
              SD Card connectée
            </span>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
