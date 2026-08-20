import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const moneyCounterSchema = z.object({
  label: z.string().default("Dépenses mensuelles"),
  currency: z.string().default("$"),
  amounts: z.array(z.number()).default([200, 400, 600, 800]),
  unit: z.string().default("/ mois"),
  accentColor: z.string().default("#ef4444"),
  durationSecs: z.number().default(3),
});

export type MoneyCounterProps = z.infer<typeof moneyCounterSchema>;

export const MoneyCounter: React.FC<MoneyCounterProps> = ({
  label, currency, amounts, unit, accentColor, durationSecs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = durationSecs * 30;

  const containerScale = spring({ frame, fps, config: { mass: 0.6, damping: 14, stiffness: 160 }, from: 0.8, to: 1 });
  const containerOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });

  // Each step occupies an equal slice
  const stepFrames = Math.floor(totalFrames / amounts.length);
  const currentStep = Math.min(Math.floor(frame / stepFrames), amounts.length - 1);
  const stepProgress = (frame % stepFrames) / stepFrames;

  // Interpolate between current and next amount
  const currentAmount = amounts[currentStep];
  const nextAmount = amounts[Math.min(currentStep + 1, amounts.length - 1)];
  const displayAmount = Math.round(currentAmount + (nextAmount - currentAmount) * stepProgress);

  // Flash effect on each step change
  const flashOpacity = interpolate(frame % stepFrames, [0, 6, 15], [0.4, 0, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Label animation
  const labelOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });

  // Bill icons fly out
  const bills = [0, 1, 2, 3, 4, 5].map(i => {
    const billStart = i * 8;
    const billOpacity = interpolate(frame, [billStart, billStart + 6, billStart + 24], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const billX = interpolate(frame, [billStart, billStart + 24], [0, (i % 2 === 0 ? 1 : -1) * (80 + i * 20)], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const billY = interpolate(frame, [billStart, billStart + 24], [0, -60 - i * 15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { billOpacity, billX, billY };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Red-tinted aurora */}
      <AbsoluteFill style={{ opacity: 0.6 }}>
        <AuroraBackground />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(100,10,10,0.3) 0%, rgba(0,0,0,0) 70%))" }} />

      {/* Flash on step change */}
      <AbsoluteFill style={{
        background: `rgba(239,68,68,${flashOpacity})`,
        pointerEvents: "none",
      }} />

      <AbsoluteFill style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        opacity: containerOpacity,
        transform: `scale(${containerScale})`,
      }}>

        {/* Label */}
        <div style={{
          fontFamily,
          fontWeight: 700,
          fontSize: 28,
          color: "rgba(255,180,180,0.8)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          opacity: labelOpacity,
        }}>
          {label}
        </div>

        {/* Counter card */}
        <div style={{
          position: "relative",
          background: "rgba(80,10,10,0.5)",
          border: "1px solid rgba(239,68,68,0.4)",
          borderRadius: 24,
          padding: "40px 80px",
          boxShadow: `0 0 60px rgba(239,68,68,0.3)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}>
          {/* Flying bills */}
          {bills.map((bill, i) => (
            <div key={i} style={{
              position: "absolute",
              fontSize: 32,
              opacity: bill.billOpacity,
              transform: `translate(${bill.billX}px, ${bill.billY}px)`,
              pointerEvents: "none",
            }}>
              💸
            </div>
          ))}

          {/* Main counter */}
          <div style={{
            fontFamily,
            fontWeight: 800,
            fontSize: 110,
            color: accentColor,
            letterSpacing: "-0.02em",
            lineHeight: 1,
            textShadow: `0 0 40px ${accentColor}60`,
            fontVariantNumeric: "tabular-nums",
          }}>
            {currency}{displayAmount.toLocaleString()}
          </div>

          {/* Unit */}
          <div style={{
            fontFamily,
            fontWeight: 700,
            fontSize: 24,
            color: "rgba(255,150,150,0.7)",
            letterSpacing: "0.06em",
          }}>
            {unit}
          </div>
        </div>

        {/* Step indicators */}
        <div style={{ display: "flex", gap: 12 }}>
          {amounts.map((amount, i) => (
            <div key={i} style={{
              fontFamily,
              fontWeight: 700,
              fontSize: 18,
              color: i <= currentStep ? accentColor : "rgba(255,255,255,0.2)",
              transition: "none",
              letterSpacing: "0.04em",
            }}>
              {currency}{amount}
            </div>
          ))}
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
