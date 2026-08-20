import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

export const recoverItAnim07Schema = z.object({});

// 9 files disappear in waves (3×3 grid)
const FILES = Array.from({ length: 9 }, (_, i) => ({
  col: i % 3,
  row: Math.floor(i / 3),
  delayStart: 20 + Math.floor(i / 3) * 22 + (i % 3) * 8,
}));

const WARNING_LINES = [-350, -200, -50, 100, 250, 400];

export const RecoverItAnim07: React.FC<z.infer<typeof recoverItAnim07Schema>> = () => {
  const frame = useCurrentFrame();

  // Red vignette builds up from f80
  const vignetteOp = interpolate(frame, [80, 160], [0, 0.72], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE,
  });

  // Trash icon appears at f85
  const trashOp = interpolate(frame, [85, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const trashScale = interpolate(frame, [85, 100], [0.7, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

  // Warning lines flash (f130+)
  const warnOp = interpolate(frame, [130, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // PANIQUE text slams in at f160
  const paniqueScale = interpolate(frame, [160, 178], [2.2, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE,
  });
  const paniqueOp = interpolate(frame, [158, 168], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // PANIQUE glow pulse
  const glowPulse = 0.7 + 0.3 * Math.abs(Math.sin(frame * 0.18));

  return (
    <AbsoluteFill style={{ backgroundColor: "#070707" }}>

      {/* Red vignette frame */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 85% 80% at 50% 50%, transparent 30%, rgba(239,68,68,${vignetteOp}) 100%)`,
        pointerEvents: "none",
        zIndex: 5,
      }} />

      {/* Warning scan lines */}
      {frame >= 128 && WARNING_LINES.map((lineY, i) => {
        const lineOp = warnOp * (0.6 + 0.4 * Math.abs(Math.sin(frame * 0.15 + i)));
        return (
          <div key={i} style={{
            position: "absolute",
            left: 0, right: 0,
            top: `calc(50% + ${lineY}px)`,
            height: 2,
            background: `rgba(239,68,68,${lineOp * 0.35})`,
            pointerEvents: "none",
            zIndex: 4,
          }} />
        );
      })}

      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>

        {/* File explorer */}
        <div style={{
          width: 820,
          background: "rgba(14,20,40,0.9)",
          border: "1.5px solid rgba(80,130,255,0.2)",
          borderRadius: 16,
          overflow: "hidden",
        }}>
          {/* Title bar */}
          <div style={{
            background: "rgba(20,30,60,0.9)",
            borderBottom: "1px solid rgba(80,130,255,0.15)",
            padding: "10px 18px",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ef4444" }} />
            <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ffd700" }} />
            <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ fontFamily, fontWeight: 600, fontSize: 30, color: "rgba(160,175,220,0.75)", marginLeft: 14 }}>
              SD Card (E:)
            </span>
          </div>

          {/* 3×3 grid */}
          <div style={{ padding: "20px 24px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
            {[0, 1, 2].map(row => (
              <div key={row} style={{ display: "flex", gap: 14 }}>
                {[0, 1, 2].map(col => {
                  const idx = row * 3 + col;
                  const file = FILES[idx];
                  const t = frame - file.delayStart;
                  const gone = t >= 20;
                  if (gone) return <div key={col} style={{ flex: 1, height: 100 }} />;
                  const fadeOp = t < 0 ? 1 : interpolate(t, [0, 20], [1, 0], {
                    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE,
                  });
                  const fadeScale = t < 0 ? 1 : interpolate(t, [0, 20], [1, 0.3], {
                    extrapolateLeft: "clamp", extrapolateRight: "clamp",
                  });
                  return (
                    <div key={col} style={{
                      flex: 1, height: 100,
                      opacity: fadeOp,
                      transform: `scale(${fadeScale})`,
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="44" height="36" viewBox="0 0 44 36">
                        <rect x="1" y="5" width="42" height="29" rx="4" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                        <circle cx="12" cy="14" r="4" fill="rgba(255,255,255,0.12)" />
                        <polyline points="1,28 12,20 21,25 30,18 43,28" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.8" />
                      </svg>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Trash icon — bottom right of explorer */}
        {frame >= 83 && (
          <div style={{
            position: "absolute",
            bottom: 100, right: 200,
            opacity: trashOp, transform: `scale(${trashScale})`,
          }}>
            <svg width="96" height="108" viewBox="0 0 60 68">
              <rect x="8" y="16" width="44" height="48" rx="6" fill="#1a1a1a" stroke="#ef4444" strokeWidth="2" />
              <rect x="0" y="10" width="60" height="8" rx="4" fill="#ef4444" />
              <rect x="22" y="2" width="16" height="10" rx="3" fill="#1a1a1a" stroke="#ef4444" strokeWidth="2" />
              <line x1="20" y1="26" x2="20" y2="56" stroke="rgba(239,68,68,0.5)" strokeWidth="2" strokeLinecap="round" />
              <line x1="30" y1="26" x2="30" y2="56" stroke="rgba(239,68,68,0.5)" strokeWidth="2" strokeLinecap="round" />
              <line x1="40" y1="26" x2="40" y2="56" stroke="rgba(239,68,68,0.5)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        )}

        {/* PANIQUE text */}
        {frame >= 156 && (
          <div style={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: `translate(-50%, -50%) scale(${paniqueScale})`,
            opacity: paniqueOp,
            zIndex: 10,
            textAlign: "center",
            whiteSpace: "nowrap",
          }}>
            <div style={{
              fontFamily, fontWeight: 800,
              fontSize: 180,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              textShadow: `0 0 ${60 * glowPulse}px rgba(239,68,68,${0.9 * glowPulse}), 0 0 120px rgba(239,68,68,0.4)`,
            }}>
              PANIQUE
            </div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
