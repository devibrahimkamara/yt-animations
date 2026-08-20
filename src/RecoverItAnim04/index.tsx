import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

export const recoverItAnim04Schema = z.object({});

export const RecoverItAnim04: React.FC<z.infer<typeof recoverItAnim04Schema>> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title
  const titleOp = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 18], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

  // Subscribe button
  const subS = spring({ frame: frame - 28, fps, config: { mass: 0.4, damping: 9, stiffness: 240 } });

  // Thumbs up
  const thumbS = spring({ frame: frame - 65, fps, config: { mass: 0.4, damping: 7, stiffness: 280 } });
  const thumbPulse = frame >= 65 ? 1 + 0.06 * Math.abs(Math.sin(frame * 0.12)) : 0;

  // Bell: gray → gold (f100–130)
  const bellProgress = interpolate(frame, [100, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const bellS = spring({ frame: frame - 98, fps, config: { mass: 0.4, damping: 8, stiffness: 260 } });
  const bellColor = frame >= 100
    ? `rgb(${Math.round(interpolate(bellProgress, [0, 1], [156, 255]))}, ${Math.round(interpolate(bellProgress, [0, 1], [163, 215]))}, ${Math.round(interpolate(bellProgress, [0, 1], [175, 0]))})`
    : "#9ca3af";
  const bellGlow = bellProgress > 0.5 ? `0 0 30px rgba(255,215,0,${bellProgress * 0.7})` : "none";

  // "Notification activée"
  const notifS = spring({ frame: frame - 132, fps, config: { mass: 0.4, damping: 9, stiffness: 220 } });

  // Counter card
  const cardS = spring({ frame: frame - 158, fps, config: { mass: 0.4, damping: 10, stiffness: 200 } });
  const countVal = Math.round(
    interpolate(frame, [162, 178], [0, 24700], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE })
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />

      {/* Blue center glow */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 600, height: 400,
        background: "radial-gradient(ellipse, rgba(48,96,255,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40 }}>

        {/* Title */}
        <div style={{
          opacity: titleOp,
          transform: `translateY(${titleY}px)`,
          fontFamily, fontWeight: 800, fontSize: 72,
          color: "#ffffff", letterSpacing: "-0.01em",
          textShadow: "0 0 30px rgba(48,96,255,0.4)",
          textAlign: "center",
        }}>
          Rejoins la famille 👊
        </div>

        {/* CTA row */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>

          {/* Subscribe button */}
          {frame >= 26 && (
            <div style={{
              opacity: subS,
              transform: `scale(${0.85 + subS * 0.15})`,
              background: "#ff0000",
              borderRadius: 10,
              padding: "20px 40px",
              display: "flex", alignItems: "center", gap: 14,
              boxShadow: "0 0 40px rgba(255,0,0,0.35)",
              cursor: "pointer",
            }}>
              <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
                <rect width="32" height="24" rx="5" fill="#ff0000" />
                <polygon points="12,6 12,18 24,12" fill="#fff" />
              </svg>
              <span style={{ fontFamily, fontWeight: 800, fontSize: 28, color: "#fff", letterSpacing: "0.02em" }}>
                S'abonner
              </span>
            </div>
          )}

          {/* Thumbs up */}
          {frame >= 63 && (
            <div style={{
              transform: `scale(${thumbPulse * (0.85 + thumbS * 0.15)})`,
              opacity: thumbS,
              fontSize: 64,
              filter: "drop-shadow(0 0 12px rgba(48,96,255,0.5))",
            }}>
              👍
            </div>
          )}

          {/* Bell */}
          {frame >= 96 && (
            <div style={{
              position: "relative",
              opacity: bellS, transform: `scale(${0.85 + bellS * 0.15})`,
            }}>
              <svg width="60" height="64" viewBox="0 0 60 64" style={{ filter: bellGlow }}>
                <path d="M30 4 C18 4 10 14 10 26 L10 42 L4 50 L56 50 L50 42 L50 26 C50 14 42 4 30 4Z"
                  fill={bellColor} />
                <ellipse cx="30" cy="55" rx="8" ry="6" fill={bellColor} />
                <circle cx="30" cy="4" r="4" fill={bellColor} />
              </svg>

            </div>
          )}
        </div>

        {/* Notification activée */}
        {frame >= 130 && (
          <div style={{
            opacity: notifS,
            transform: `scale(${0.85 + notifS * 0.15})`,
            background: "linear-gradient(135deg, rgba(20,55,25,0.88), rgba(12,38,16,0.82))",
            border: "1.5px solid rgba(34,197,94,0.45)",
            borderRadius: 16,
            padding: "16px 36px",
            display: "flex", alignItems: "center", gap: 14,
            boxShadow: "0 0 40px rgba(34,197,94,0.2)",
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="11" fill="none" stroke="#22c55e" strokeWidth="2" />
              <polyline points="6,12 10,16 18,8" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontFamily, fontWeight: 700, fontSize: 30, color: "#22c55e" }}>
              Notification activée
            </span>
          </div>
        )}

        {/* Subscriber counter card */}
        {frame >= 156 && (
          <div style={{
            opacity: cardS, transform: `scale(${0.85 + cardS * 0.15})`,
            background: "linear-gradient(135deg, rgba(20,40,120,0.55), rgba(10,20,60,0.45))",
            border: "1px solid rgba(80,130,255,0.28)",
            borderRadius: 20, padding: "18px 44px",
            boxShadow: "0 0 40px rgba(48,96,255,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <span style={{ fontFamily, fontWeight: 600, fontSize: 40, color: "rgba(160,175,220,0.75)" }}>
              Abonnés
            </span>
            <span style={{ fontFamily, fontWeight: 800, fontSize: 56, color: "#ffffff" }}>
              {countVal.toLocaleString("fr-FR")}
            </span>
            <span style={{ fontFamily, fontWeight: 700, fontSize: 40, color: "#22c55e" }}>↑</span>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
