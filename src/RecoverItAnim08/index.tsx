import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

export const recoverItAnim08Schema = z.object({});

// ECG path: one QRS complex unit
function ecgSegment(startX: number, baseY: number, scale: number): string {
  const s = scale;
  return [
    `M ${startX} ${baseY}`,
    `L ${startX + 18 * s} ${baseY}`,
    `L ${startX + 22 * s} ${baseY - 8 * s}`,
    `L ${startX + 26 * s} ${baseY + 28 * s}`,
    `L ${startX + 30 * s} ${baseY - 48 * s}`,
    `L ${startX + 34 * s} ${baseY + 18 * s}`,
    `L ${startX + 38 * s} ${baseY - 6 * s}`,
    `L ${startX + 46 * s} ${baseY}`,
  ].join(" ");
}

export const RecoverItAnim08: React.FC<z.infer<typeof recoverItAnim08Schema>> = () => {
  const frame = useCurrentFrame();

  // Organic screen shake
  const shakeX = Math.sin(frame * 0.7) * 6 + Math.sin(frame * 1.3) * 4 + Math.sin(frame * 2.1) * 2;
  const shakeY = Math.cos(frame * 0.9) * 5 + Math.cos(frame * 1.7) * 3;

  // Strong red vignette
  const vignetteOp = 0.55 + 0.15 * Math.abs(Math.sin(frame * 0.08));

  // ECG: 2.5 cycles visible, each cycle ~36 frames, starts at f0
  const ecgProgress = interpolate(frame, [0, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // BPM display
  const showNormal = frame < 120;
  const bpmBlink = frame >= 120 && Math.floor(frame / 10) % 2 === 0;

  // Stress gauge (0→100% over f0→70)
  const gaugeH = interpolate(frame, [0, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

  // Big red X (f80+)
  const xOp = interpolate(frame, [78, 94], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const xScale = interpolate(frame, [78, 94], [2, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const xPulse = 1 + 0.04 * Math.abs(Math.sin(frame * 0.15));

  // ECG line reveal
  const ecgVisibleWidth = ecgProgress * 540;

  // Flat line after f90
  const flatLineOp = interpolate(frame, [90, 105], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#060606" }}>
      {/* Scan lines overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px)",
        pointerEvents: "none", zIndex: 50,
      }} />

      {/* Red vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 80% 75% at 50% 50%, transparent 20%, rgba(239,68,68,${vignetteOp}) 100%)`,
        pointerEvents: "none", zIndex: 6,
      }} />

      {/* Shaking content */}
      <div style={{
        position: "absolute", inset: 0,
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}>

        {/* ECG monitor — center */}
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 820,
          background: "linear-gradient(135deg, rgba(8,16,8,0.95), rgba(4,10,4,0.9))",
          border: "1.5px solid rgba(34,197,94,0.3)",
          borderRadius: 16,
          padding: "20px 24px",
          boxShadow: "0 0 40px rgba(34,197,94,0.1)",
        }}>
          <div style={{
            fontFamily, fontWeight: 700, fontSize: 40,
            color: "rgba(34,197,94,0.75)", letterSpacing: "0.08em", marginBottom: 14,
          }}>
            MONITEUR CARDIAQUE
          </div>

          {/* ECG display */}
          <div style={{ position: "relative", height: 120, overflow: "hidden" }}>
            <svg width="572" height="120" viewBox="0 0 572 120" style={{ overflow: "visible" }}>
              {/* Grid */}
              {[0, 1, 2, 3].map(i => (
                <line key={`h${i}`} x1="0" y1={i * 30 + 15} x2="572" y2={i * 30 + 15}
                  stroke="rgba(34,197,94,0.08)" strokeWidth="1" />
              ))}
              {[0, 1, 2, 3, 4].map(i => (
                <line key={`v${i}`} x1={i * 114} y1="0" x2={i * 114} y2="120"
                  stroke="rgba(34,197,94,0.08)" strokeWidth="1" />
              ))}

              {/* ECG path — 2.5 cycles */}
              {frame < 90 && (
                <g style={{ clipPath: `inset(0 ${572 - ecgVisibleWidth}px 0 0)` }}>
                  <path
                    d={[
                      ecgSegment(0, 60, 1),
                      ecgSegment(180, 60, 1),
                      ecgSegment(360, 60, 1),
                    ].join(" ")}
                    fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  />
                </g>
              )}

              {/* Flat line */}
              {flatLineOp > 0 && (
                <line x1="0" y1="60" x2={flatLineOp * 572} y2="60"
                  stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"
                  style={{ opacity: flatLineOp }}
                />
              )}
            </svg>
          </div>

          {/* BPM readout */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
            {showNormal ? (
              <div style={{
                fontFamily, fontWeight: 800, fontSize: 52,
                color: "#22c55e",
                textShadow: "0 0 20px rgba(34,197,94,0.5)",
              }}>
                142 BPM
              </div>
            ) : (
              <div style={{
                fontFamily, fontWeight: 800, fontSize: 52,
                color: bpmBlink ? "#ef4444" : "transparent",
                textShadow: bpmBlink ? "0 0 20px rgba(239,68,68,0.6)" : "none",
              }}>
                --- BPM
              </div>
            )}
          </div>
        </div>

        {/* Stress gauge — top right */}
        <div style={{
          position: "absolute",
          top: 60, right: 140,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        }}>
          <div style={{ fontFamily, fontWeight: 700, fontSize: 40, color: "rgba(239,68,68,0.85)", letterSpacing: "0.08em" }}>
            STRESS
          </div>
          <div style={{
            width: 64, height: 220,
            background: "rgba(20,8,8,0.8)",
            border: "1.5px solid rgba(239,68,68,0.3)",
            borderRadius: 14,
            overflow: "hidden",
            display: "flex", flexDirection: "column-reverse",
          }}>
            <div style={{
              height: `${gaugeH * 100}%`,
              background: "linear-gradient(0deg, #ef4444, #fbbf24)",
              borderRadius: "0 0 12px 12px",
              boxShadow: "0 0 12px rgba(239,68,68,0.4)",
            }} />
          </div>
          <div style={{
            fontFamily, fontWeight: 800, fontSize: 44,
            color: "#ef4444",
            textShadow: "0 0 10px rgba(239,68,68,0.5)",
          }}>
            {Math.round(gaugeH * 100)}%
          </div>
        </div>

        {/* Big red X */}
        {frame >= 76 && (
          <div style={{
            position: "absolute",
            top: "50%", left: "55%",
            transform: `translate(-50%, -50%) scale(${xScale * xPulse})`,
            opacity: xOp,
          }}>
            <svg width="200" height="200" viewBox="0 0 200 200">
              <line x1="20" y1="20" x2="180" y2="180" stroke="#ef4444" strokeWidth="20" strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 20px rgba(239,68,68,0.8))" }} />
              <line x1="180" y1="20" x2="20" y2="180" stroke="#ef4444" strokeWidth="20" strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 20px rgba(239,68,68,0.8))" }} />
            </svg>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
