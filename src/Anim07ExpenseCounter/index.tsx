import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

export const anim07Schema = z.object({
  toolName: z.string().default("Apollo.io"),
  maxAmount: z.number().default(200),
  currency: z.string().default("$"),
  unit: z.string().default("/ mois"),
  accentColor: z.string().default("#3b82f6"),
  durationSecs: z.number().default(6),
});

export const Anim07ExpenseCounter: React.FC<z.infer<typeof anim07Schema>> = ({
  toolName, maxAmount, currency, unit, accentColor, durationSecs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  void durationSecs;

  // Phase 1: count up 0 → maxAmount (frames 20 → 110)
  // Phase 2: hold (frames 110 → 130)
  // Phase 3: drop to 0 (frames 130 → 155)
  // Phase 4: savings celebration (frames 155+)
  const RISE_START = 20, RISE_END = 110;
  const FALL_START = 130, FALL_END = 155;
  const SAVE_START = 158;

  const risingAmount = interpolate(frame, [RISE_START, RISE_END], [0, maxAmount], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const fallingAmount = interpolate(frame, [FALL_START, FALL_END], [maxAmount, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE,
  });

  const amount = frame < FALL_START ? risingAmount : fallingAmount;
  const isRising = frame >= RISE_START && frame < FALL_START;
  const isSaved = frame >= SAVE_START;

  // Flash on count-up
  const flashOp = isRising
    ? Math.max(0, 0.35 - ((frame - RISE_START) / (RISE_END - RISE_START)) * 0.35)
    : 0;

  // Save spring
  const saveS = spring({ frame: frame - SAVE_START, fps, config: { mass: 0.4, damping: 8, stiffness: 260 } });

  // Container
  const containerS = spring({ frame, fps, config: { mass: 0.5, damping: 10, stiffness: 180 } });

  // Particles
  const particles = ["💸", "💸", "🔥", "💸", "💸", "🔥"];
  const toolOp = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />

      {/* Red tint when rising */}
      {isRising && (
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(220,40,40,0.12)",
          opacity: flashOp,
          pointerEvents: "none",
        }} />
      )}

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 120px", gap: 36 }}>

        {/* Tool label */}
        <div style={{
          opacity: toolOp,
          fontFamily, fontWeight: 700, fontSize: 32,
          color: "rgba(160,175,220,0.75)",
          letterSpacing: "0.12em", textTransform: "uppercase",
        }}>
          {toolName} — Coût mensuel
        </div>

        {/* Main counter card */}
        <div style={{
          opacity: containerS,
          transform: `scale(${0.88 + containerS * 0.12})`,
          background: isSaved
            ? "linear-gradient(135deg, rgba(20,55,25,0.88), rgba(12,38,16,0.82))"
            : "linear-gradient(135deg, rgba(60,12,12,0.85), rgba(38,8,8,0.8))",
          border: `2px solid ${isSaved ? "rgba(34,197,94,0.55)" : "rgba(239,68,68,0.5)"}`,
          borderRadius: 28,
          padding: "52px 80px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
          boxShadow: isSaved
            ? "0 0 60px rgba(34,197,94,0.2), inset 0 1px 0 rgba(255,255,255,0.06)"
            : "0 0 60px rgba(239,68,68,0.2), inset 0 1px 0 rgba(255,255,255,0.04)",
          position: "relative",
          overflow: "hidden",
          minWidth: 600,
        }}>

          {/* Flying particles */}
          {isRising && particles.map((p, i) => (
            <div key={i} style={{
              position: "absolute",
              fontSize: 36,
              left: `${15 + (i * 14) % 70}%`,
              top: `${10 + (i * 18) % 60}%`,
              opacity: 0.4 + Math.abs(Math.sin(frame * 0.15 + i * 0.8)) * 0.4,
              transform: `translateY(${Math.sin(frame * 0.2 + i) * 15}px)`,
              pointerEvents: "none",
            }}>
              {p}
            </div>
          ))}

          {/* Amount */}
          <div style={{
            fontFamily, fontWeight: 800,
            fontSize: 120,
            color: isSaved ? "#4ade80" : "#ef4444",
            letterSpacing: "-0.02em",
            lineHeight: 1,
            textShadow: isSaved
              ? "0 0 40px rgba(74,222,128,0.5)"
              : "0 0 40px rgba(239,68,68,0.5)",
            zIndex: 1,
          }}>
            {currency}{Math.round(amount)}
          </div>

          <div style={{
            fontFamily, fontWeight: 600, fontSize: 28,
            color: isSaved ? "rgba(134,239,172,0.75)" : "rgba(252,165,165,0.7)",
            letterSpacing: "0.06em", zIndex: 1,
          }}>
            {unit}
          </div>
        </div>

        {/* Before / after labels */}
        <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
          <div style={{
            opacity: interpolate(frame, [RISE_START, RISE_START + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            fontFamily, fontWeight: 700, fontSize: 26,
            color: "rgba(252,165,165,0.8)",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span>🔥</span> Avant : coût énorme
          </div>

          {isSaved && (
            <div style={{
              opacity: saveS, transform: `scale(${saveS})`,
              fontFamily, fontWeight: 800, fontSize: 36,
              color: "#4ade80",
              display: "flex", alignItems: "center", gap: 12,
              background: "rgba(34,197,94,0.12)",
              border: "1.5px solid rgba(34,197,94,0.4)",
              borderRadius: 16, padding: "12px 28px",
              boxShadow: "0 0 30px rgba(34,197,94,0.25)",
            }}>
              ✅ Maintenant : 0€ économisé !
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
