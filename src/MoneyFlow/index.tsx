import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });

export const moneyFlowSchema = z.object({
  totalAmount: z.string().default("1 000 €"),
  agencyLabel: z.string().default("AGENCE"),
  agencyPercent: z.number().default(25),
  netLabel: z.string().default("Pour toi"),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(4),
});

export type MoneyFlowProps = z.infer<typeof moneyFlowSchema>;

export const MoneyFlow: React.FC<MoneyFlowProps> = ({
  totalAmount, agencyLabel, agencyPercent, netLabel, accentColor, durationSecs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const netPercent = 100 - agencyPercent;
  const netAmount = `${netPercent * 10} €`;

  // Phase 1 (0-25f): Money bag appears
  // Phase 2 (25-55f): Arrow draws to agency
  // Phase 3 (55-75f): Agency takes cut (bills fly away)
  // Phase 4 (75-end): Net amount arrives

  const bagScale = spring({ frame, fps, config: { mass: 0.5, damping: 12, stiffness: 200 }, from: 0, to: 1 });
  const bagOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Arrow draw progress (frame 25 → 50)
  const arrow1Progress = interpolate(frame, [25, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Agency box (frame 50)
  const agencyScale = spring({ frame: Math.max(0, frame - 50), fps, config: { mass: 0.5, damping: 12, stiffness: 220 }, from: 0, to: 1 });
  const agencyOpacity = interpolate(frame, [50, 62], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Bills fly out from agency (frame 60 onwards)
  const billsFlying = frame >= 60;
  const billProgress = interpolate(frame, [60, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flyingBills = [0, 1, 2].map(i => ({
    x: (i - 1) * 80 * billProgress,
    y: -80 - i * 20 * billProgress,
    opacity: interpolate(frame, [60, 65, 82], [0, 1, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  }));

  // Arrow 2 (frame 70 → 95)
  const arrow2Progress = interpolate(frame, [70, 95], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Net amount (frame 90)
  const netScale = spring({ frame: Math.max(0, frame - 90), fps, config: { mass: 0.5, damping: 11, stiffness: 240 }, from: 0, to: 1 });
  const netOpacity = interpolate(frame, [90, 102], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />

      <AbsoluteFill style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
      }}>

        {/* Money bag */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          opacity: bagOpacity,
          transform: `scale(${bagScale})`,
          width: 220,
        }}>
          <div style={{ fontSize: 80 }}>💰</div>
          <div style={{
            fontFamily,
            fontWeight: 800,
            fontSize: 32,
            color: "#ffffff",
            letterSpacing: "0.02em",
          }}>
            {totalAmount}
          </div>
        </div>

        {/* Arrow 1 */}
        <svg width="120" height="50" viewBox="0 0 120 50" style={{ flexShrink: 0 }}>
          <defs>
            <marker id="arr1" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="rgba(200,200,200,0.7)" opacity={arrow1Progress} />
            </marker>
          </defs>
          <line
            x1={0} y1={25} x2={arrow1Progress * 105} y2={25}
            stroke="rgba(200,200,200,0.7)" strokeWidth="3"
            markerEnd={arrow1Progress > 0.9 ? "url(#arr1)" : undefined}
            strokeLinecap="round"
          />
        </svg>

        {/* Agency box */}
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          opacity: agencyOpacity,
          transform: `scale(${agencyScale})`,
          width: 200,
        }}>
          {/* Flying bills */}
          {billsFlying && flyingBills.map((bill, i) => (
            <div key={i} style={{
              position: "absolute",
              top: -20,
              left: "50%",
              fontSize: 28,
              opacity: bill.opacity,
              transform: `translate(calc(-50% + ${bill.x}px), ${bill.y}px)`,
              pointerEvents: "none",
            }}>
              💸
            </div>
          ))}

          <div style={{
            background: "rgba(80,10,10,0.7)",
            border: "1px solid rgba(239,68,68,0.5)",
            borderRadius: 16,
            padding: "20px 32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            boxShadow: "0 0 30px rgba(239,68,68,0.25)",
          }}>
            <div style={{ fontFamily, fontWeight: 800, fontSize: 26, color: "#ef4444", letterSpacing: "0.06em" }}>
              {agencyLabel}
            </div>
            <div style={{ fontFamily, fontWeight: 700, fontSize: 20, color: "rgba(255,150,150,0.8)" }}>
              prend {agencyPercent}%
            </div>
          </div>
        </div>

        {/* Arrow 2 */}
        <svg width="120" height="50" viewBox="0 0 120 50" style={{ flexShrink: 0 }}>
          <defs>
            <marker id="arr2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill={accentColor} opacity={arrow2Progress} />
            </marker>
          </defs>
          <line
            x1={0} y1={25} x2={arrow2Progress * 105} y2={25}
            stroke={accentColor} strokeWidth="3"
            markerEnd={arrow2Progress > 0.9 ? "url(#arr2)" : undefined}
            strokeLinecap="round"
          />
        </svg>

        {/* Net amount */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          opacity: netOpacity,
          transform: `scale(${netScale})`,
          width: 220,
        }}>
          <div style={{
            background: "rgba(10,60,30,0.7)",
            border: `1px solid rgba(34,197,94,0.5)`,
            borderRadius: 16,
            padding: "20px 32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            boxShadow: "0 0 30px rgba(34,197,94,0.2)",
          }}>
            <div style={{ fontFamily, fontWeight: 800, fontSize: 40, color: "#22c55e", letterSpacing: "0.02em" }}>
              {netAmount}
            </div>
            <div style={{ fontFamily, fontWeight: 700, fontSize: 18, color: "rgba(100,220,140,0.8)" }}>
              {netLabel} ✓
            </div>
          </div>
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
