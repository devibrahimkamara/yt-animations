import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

export const recoverItAnim01Schema = z.object({});

const ITEMS = [
  { type: "bill", delay: 0,  angle: -65 },
  { type: "coin", delay: 5,  angle: -40 },
  { type: "bill", delay: 10, angle: -15 },
  { type: "coin", delay: 15, angle:  15 },
  { type: "bill", delay: 20, angle:  45 },
  { type: "coin", delay: 25, angle:  70 },
];

export const RecoverItAnim01: React.FC<z.infer<typeof recoverItAnim01Schema>> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Laptop entrance
  const laptopS = spring({ frame, fps, config: { mass: 0.5, damping: 10, stiffness: 200 } });

  // Year counter 0 → 2026 on screen
  const counterValue = Math.round(
    interpolate(frame, [30, 105], [0, 2026], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE })
  );

  // White flash at lock-in
  const flashOp = interpolate(frame, [105, 112, 122], [0, 0.85, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Padlock spring
  const padlockS = spring({ frame: frame - 110, fps, config: { mass: 0.4, damping: 8, stiffness: 280 } });

  // Revenue card
  const cardS = spring({ frame: frame - 140, fps, config: { mass: 0.4, damping: 10, stiffness: 200 } });
  const revenueVal = Math.round(
    interpolate(frame, [148, 176], [0, 3500], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE })
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />

      {/* Flash overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundColor: "#fff", opacity: flashOp, pointerEvents: "none", zIndex: 20 }} />

      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>

        {/* Laptop */}
        <div style={{
          opacity: laptopS,
          transform: `scale(${0.85 + laptopS * 0.15}) translateY(${(1 - laptopS) * 40}px)`,
          position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="520" height="360" viewBox="0 0 520 360" style={{ display: "block" }}>
            {/* Screen housing */}
            <rect x="40" y="8" width="440" height="288" rx="14" fill="#1e1e1e" stroke="#ffffff" strokeWidth="2.5" />
            {/* Screen bezel */}
            <rect x="56" y="22" width="408" height="258" rx="7" fill="#080808" />
            {/* Subtle screen glow */}
            <rect x="56" y="22" width="408" height="258" rx="7" fill="none"
              stroke="rgba(48,96,255,0.18)" strokeWidth="3" />
            {/* Base */}
            <rect x="0" y="304" width="520" height="32" rx="8" fill="#1e1e1e" stroke="#fff" strokeWidth="1.5" />
            <rect x="180" y="304" width="160" height="9" rx="5" fill="#2a2a2a" />
            {/* Hinge */}
            <rect x="0" y="296" width="520" height="12" rx="4" fill="#161616" />
          </svg>

          {/* Counter overlay on screen */}
          <div style={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: "translate(-50%, -58%)",
            fontFamily, fontWeight: 800, fontSize: 88,
            color: "#ffffff",
            letterSpacing: "0.08em",
            textShadow: "0 0 30px rgba(48,96,255,0.6)",
            userSelect: "none",
          }}>
            {String(counterValue).padStart(4, "0")}
          </div>

          {/* Padlock */}
          {frame >= 108 && (
            <div style={{
              position: "absolute",
              top: "50%", left: "50%",
              transform: `translate(-50%, -58%) scale(${padlockS})`,
              opacity: padlockS,
              zIndex: 30,
            }}>
              <svg width="90" height="90" viewBox="0 0 90 90">
                <rect x="18" y="40" width="54" height="40" rx="8" fill="#3060ff" />
                <path d="M28 40 V30 A17 17 0 0 1 62 30 V40" fill="none" stroke="#3060ff" strokeWidth="8" strokeLinecap="round" />
                <circle cx="45" cy="60" r="7" fill="#fff" />
              </svg>
            </div>
          )}
        </div>

        {/* Burst items: bills & coins */}
        {ITEMS.map((item, i) => {
          const t = frame - (115 + item.delay);
          if (t < 0) return null;
          const rad = (item.angle * Math.PI) / 180;
          const dist = t * 9;
          const x = Math.sin(rad) * dist;
          const y = -Math.abs(Math.cos(rad)) * dist - t * t * 0.12;
          const rot = item.angle * 0.4 * Math.min(t / 20, 1);
          const opacity = interpolate(t, [28, 45], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={i} style={{
              position: "absolute",
              top: "50%", left: "50%",
              transform: `translate(${x - 20}px, ${y - 20}px) rotate(${rot}deg)`,
              opacity,
              pointerEvents: "none",
              zIndex: 15,
            }}>
              {item.type === "bill" ? (
                <svg width="80" height="44" viewBox="0 0 80 44">
                  <rect x="1" y="1" width="78" height="42" rx="7" fill="#22c55e" stroke="#16a34a" strokeWidth="2" />
                  <rect x="12" y="10" width="56" height="24" rx="4" fill="rgba(255,255,255,0.15)" />
                  <line x1="20" y1="22" x2="60" y2="22" stroke="rgba(255,255,255,0.3)" strokeWidth="3" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="56" height="56" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="26" fill="#ffd700" stroke="#b45309" strokeWidth="2" />
                  <circle cx="28" cy="28" r="18" fill="rgba(0,0,0,0.12)" />
                  <line x1="18" y1="28" x2="38" y2="28" stroke="rgba(0,0,0,0.25)" strokeWidth="3" strokeLinecap="round" />
                </svg>
              )}
            </div>
          );
        })}

        {/* Revenue card — bottom right */}
        {frame >= 138 && (
          <div style={{
            position: "absolute",
            bottom: 80, right: 100,
            opacity: cardS,
            transform: `scale(${0.85 + cardS * 0.15}) translateY(${(1 - cardS) * 20}px)`,
            background: "linear-gradient(135deg, rgba(20,55,25,0.88), rgba(12,38,16,0.82))",
            border: "1.5px solid rgba(34,197,94,0.45)",
            borderRadius: 24,
            padding: "28px 48px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            boxShadow: "0 0 50px rgba(34,197,94,0.18), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}>
            <div style={{ fontFamily, fontWeight: 600, fontSize: 40, color: "rgba(134,239,172,0.75)", letterSpacing: "0.1em" }}>
              REVENUS MENSUELS
            </div>
            <div style={{
              fontFamily, fontWeight: 800, fontSize: 72,
              color: "#22c55e",
              textShadow: "0 0 32px rgba(34,197,94,0.55)",
              lineHeight: 1,
            }}>
              +{revenueVal.toLocaleString("fr-FR")} €
            </div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
