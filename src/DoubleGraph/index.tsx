import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const doubleGraphSchema = z.object({
  revenueLabel: z.string().default("Revenus"),
  expensesLabel: z.string().default("Dépenses"),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(4),
});

export type DoubleGraphProps = z.infer<typeof doubleGraphSchema>;

const W = 860;
const H = 380;
const PAD_L = 60;
const PAD_R = 60;
const PAD_T = 40;
const PAD_B = 60;
const CHART_W = W - PAD_L - PAD_R;
const CHART_H = H - PAD_T - PAD_B;

// Revenue rises: starts low, ends high
const revenueY = (progress: number) => {
  const t = progress;
  return CHART_H - t * CHART_H * 0.85;
};

// Expenses fall: starts high, ends low
const expensesY = (progress: number) => {
  const t = progress;
  return CHART_H * 0.85 - t * CHART_H * 0.65;
};

function buildPath(totalPoints: number, yFn: (t: number) => number, drawProgress: number): string {
  const points = Math.ceil(totalPoints * drawProgress);
  if (points < 2) return "";
  let d = "";
  for (let i = 0; i < points; i++) {
    const t = i / (totalPoints - 1);
    const x = PAD_L + t * CHART_W;
    const y = PAD_T + yFn(t);
    if (i === 0) d += `M ${x} ${y}`;
    else d += ` L ${x} ${y}`;
  }
  return d;
}

export const DoubleGraph: React.FC<DoubleGraphProps> = ({ revenueLabel, expensesLabel, accentColor, durationSecs }) => {
  const frame = useCurrentFrame();
  const totalFrames = durationSecs * 30;

  const containerOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });

  // Both curves draw from frame 20 to totalFrames - 10
  const drawProgress = interpolate(frame, [20, totalFrames - 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const POINTS = 50;
  const revPath = buildPath(POINTS, revenueY, drawProgress);
  const expPath = buildPath(POINTS, expensesY, drawProgress);

  // Intersection happens roughly at t=0.6 (y of revenue = y of expenses)
  // revenue: CHART_H - t*CHART_H*0.85 = expenses: CHART_H*0.85 - t*CHART_H*0.65
  // CHART_H(1 - 0.85t) = CHART_H(0.85 - 0.65t) → 1 - 0.85t = 0.85 - 0.65t → 0.15 = 0.2t → t=0.75
  const intersectT = 0.75;
  const intersectX = PAD_L + intersectT * CHART_W;
  const intersectY = PAD_T + revenueY(intersectT);

  // Intersection flash
  const flashProgress = Math.max(0, drawProgress - intersectT) / (1 - intersectT);
  const flashOpacity = flashProgress > 0
    ? interpolate(flashProgress, [0, 0.05, 0.3], [0.6, 0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  // Label positions
  const revLabelX = PAD_L + CHART_W * drawProgress - 10;
  const revLabelY = PAD_T + revenueY(drawProgress);
  const expLabelX = PAD_L + CHART_W * drawProgress - 10;
  const expLabelY = PAD_T + expensesY(drawProgress);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />

      {/* Flash at intersection */}
      {flashOpacity > 0 && (
        <AbsoluteFill style={{ background: `rgba(255,255,255,${flashOpacity * 0.2})`, pointerEvents: "none" }} />
      )}

      <AbsoluteFill style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: containerOpacity,
        gap: 24,
      }}>

        {/* Title */}
        <div style={{
          fontFamily, fontWeight: 800, fontSize: 34,
          color: "#ffffff",
          letterSpacing: "0.04em",
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          Faire plus, dépenser moins
        </div>

        {/* Chart */}
        <div style={{
          background: "rgba(10,20,50,0.7)",
          border: "1px solid rgba(80,130,255,0.25)",
          borderRadius: 24,
          padding: 0,
          overflow: "hidden",
        }}>
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
            {/* Grid lines */}
            {[0.25, 0.5, 0.75].map(t => (
              <line key={t}
                x1={PAD_L} y1={PAD_T + t * CHART_H}
                x2={PAD_L + CHART_W} y2={PAD_T + t * CHART_H}
                stroke="rgba(80,130,255,0.1)" strokeWidth="1" strokeDasharray="4,6"
              />
            ))}

            {/* Axes */}
            <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + CHART_H} stroke="rgba(80,130,255,0.25)" strokeWidth="1.5" />
            <line x1={PAD_L} y1={PAD_T + CHART_H} x2={PAD_L + CHART_W} y2={PAD_T + CHART_H} stroke="rgba(80,130,255,0.25)" strokeWidth="1.5" />

            {/* Revenue curve */}
            {revPath && (
              <path d={revPath} fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            )}

            {/* Expenses curve */}
            {expPath && (
              <path d={expPath} fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            )}

            {/* Intersection glow dot */}
            {drawProgress >= intersectT && (
              <circle cx={intersectX} cy={intersectY} r={8 + flashOpacity * 8}
                fill="white" opacity={0.3 + flashOpacity * 0.5}
              />
            )}
            {drawProgress >= intersectT && (
              <circle cx={intersectX} cy={intersectY} r={5}
                fill="white" opacity={0.9}
              />
            )}

            {/* Revenue label at end of curve */}
            {drawProgress > 0.15 && (
              <text x={Math.min(revLabelX + 10, W - 140)} y={revLabelY} fontFamily={fontFamily} fontWeight={700} fontSize={18} fill="#22c55e" dominantBaseline="middle">
                {revenueLabel} ↗
              </text>
            )}

            {/* Expenses label at end of curve */}
            {drawProgress > 0.15 && (
              <text x={Math.min(expLabelX + 10, W - 140)} y={expLabelY} fontFamily={fontFamily} fontWeight={700} fontSize={18} fill="#ef4444" dominantBaseline="middle">
                {expensesLabel} ↘
              </text>
            )}
          </svg>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 40 }}>
          {[{ color: "#22c55e", label: revenueLabel + " ↗" }, { color: "#ef4444", label: expensesLabel + " ↘" }].map(({ color, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 4, background: color, borderRadius: 2 }} />
              <span style={{ fontFamily, fontWeight: 700, fontSize: 18, color, letterSpacing: "0.04em" }}>{label}</span>
            </div>
          ))}
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
