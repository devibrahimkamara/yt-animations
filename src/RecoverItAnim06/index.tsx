import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

export const recoverItAnim06Schema = z.object({});

export const RecoverItAnim06: React.FC<z.infer<typeof recoverItAnim06Schema>> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Explorer window scales in
  const windowS = spring({ frame, fps, config: { mass: 0.5, damping: 10, stiffness: 200 } });

  // Cursor appears at f32, moves to center-ish at f50
  const cursorOp = interpolate(frame, [32, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cursorX = interpolate(frame, [44, 65], [600, 400], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const cursorY = interpolate(frame, [44, 65], [500, 350], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

  // Ctrl+A: all files selected at f70
  const allSelected = frame >= 70;

  // "Suppr" key appears at f100
  const keyS = spring({ frame: frame - 100, fps, config: { mass: 0.4, damping: 8, stiffness: 260 } });

  // Files start disappearing: f130+ each file disappears with a small delay
  const disappearStart = 130;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />

      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>

        {/* File Explorer Window */}
        <div style={{
          opacity: windowS,
          transform: `scale(${0.92 + windowS * 0.08})`,
          width: 860,
          background: "linear-gradient(135deg, rgba(14,20,40,0.95), rgba(8,12,30,0.92))",
          border: "1.5px solid rgba(80,130,255,0.28)",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 0 60px rgba(48,96,255,0.12), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}>
          {/* Title bar */}
          <div style={{
            background: "rgba(20,30,60,0.9)",
            borderBottom: "1px solid rgba(80,130,255,0.18)",
            padding: "12px 20px",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffd700" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ fontFamily, fontWeight: 600, fontSize: 30, color: "rgba(160,175,220,0.8)", marginLeft: 16 }}>
              SD Card (E:) — 9 fichiers
            </span>
            {allSelected && (
              <span style={{
                marginLeft: "auto",
                fontFamily, fontWeight: 700, fontSize: 30,
                color: "#3060ff",
                background: "rgba(48,96,255,0.12)",
                borderRadius: 8, padding: "6px 18px",
                border: "1px solid rgba(48,96,255,0.3)",
              }}>
                9 éléments sélectionnés
              </span>
            )}
          </div>

          {/* File grid — 3×3 */}
          <div style={{ padding: "24px 28px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
            {[0, 1, 2].map(row => (
              <div key={row} style={{ display: "flex", gap: 16 }}>
                {[0, 1, 2].map(col => {
                  const idx = row * 3 + col;
                  const delayStart = disappearStart + idx * 6;
                  const disappeared = frame >= delayStart + 14;
                  const fadeOp = disappeared ? 0 : interpolate(frame, [delayStart, delayStart + 14], [1, 0], {
                    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE,
                  });
                  const fadeScale = disappeared ? 0.5 : interpolate(frame, [delayStart, delayStart + 14], [1, 0.5], {
                    extrapolateLeft: "clamp", extrapolateRight: "clamp",
                  });
                  return (
                    <div key={col} style={{
                      flex: 1, height: 110,
                      opacity: fadeOp,
                      transform: `scale(${fadeScale})`,
                      borderRadius: 12,
                      background: allSelected ? "rgba(48,96,255,0.18)" : "rgba(255,255,255,0.04)",
                      border: `2px solid ${allSelected ? "rgba(48,96,255,0.6)" : "rgba(255,255,255,0.1)"}`,
                      boxShadow: allSelected ? "0 0 14px rgba(48,96,255,0.18)" : "none",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="44" height="36" viewBox="0 0 44 36">
                        <rect x="1" y="6" width="42" height="28" rx="4" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
                        <circle cx="12" cy="15" r="4.5" fill="rgba(255,255,255,0.18)" />
                        <polyline points="1,28 12,20 21,25 30,17 43,28" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
                      </svg>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Cursor SVG */}
        {frame >= 30 && (
          <div style={{
            position: "absolute",
            left: cursorX, top: cursorY,
            opacity: cursorOp,
            pointerEvents: "none",
            zIndex: 20,
          }}>
            <svg width="24" height="32" viewBox="0 0 24 32">
              <polygon points="2,2 2,26 8,20 13,30 17,28 12,18 20,18" fill="#fff" stroke="#000" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
        )}

        {/* "Suppr" key */}
        {frame >= 98 && (
          <div style={{
            position: "absolute",
            bottom: 120, right: 180,
            opacity: keyS, transform: `scale(${0.85 + keyS * 0.15})`,
          }}>
            <div style={{
              background: "linear-gradient(135deg, rgba(60,8,8,0.9), rgba(40,5,5,0.85))",
              border: "2px solid rgba(239,68,68,0.5)",
              borderRadius: 12, padding: "16px 28px",
              boxShadow: "0 0 30px rgba(239,68,68,0.25), 0 4px 0 rgba(0,0,0,0.6)",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{ fontFamily, fontWeight: 800, fontSize: 44, color: "#ef4444", letterSpacing: "0.04em" }}>
                ⌦ Suppr
              </span>
            </div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
