import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

export const anim04Schema = z.object({
  keyword: z.string().default("ChatGPT"),
  xLabels: z.array(z.string()).default(["2020", "2021", "2022", "2023", "2024"]),
  explosionLabel: z.string().default("× 10 000 recherches"),
  accentColor: z.string().default("#3b82f6"),
  durationSecs: z.number().default(6),
});

// Curve shape: flat (0-2), flat (2-5), slight rise (5-8), EXPLOSION (8-10)
function curveY(t: number): number {
  if (t <= 0.55) return 0.04 + t * 0.04; // almost flat with tiny noise
  if (t <= 0.72) return 0.06 + (t - 0.55) * 0.3; // slight rise
  // Exponential explosion
  const ex = (t - 0.72) / 0.28;
  return 0.11 + ex * ex * 0.87;
}

export const Anim04TrendGraph: React.FC<z.infer<typeof anim04Schema>> = ({
  keyword, xLabels, explosionLabel, accentColor, durationSecs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = durationSecs * fps;

  const DRAW_START = 18, DRAW_END = Math.round(totalFrames * 0.78);
  const LABEL_START = Math.round(totalFrames * 0.72);

  const drawProgress = interpolate(frame, [DRAW_START, DRAW_END], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const titleOp = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 18], [-18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

  const keywordS = spring({ frame: frame - LABEL_START, fps, config: { mass: 0.5, damping: 9, stiffness: 200 } });
  const explosionOp = interpolate(frame, [LABEL_START + 10, LABEL_START + 28], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Chart dimensions
  const W = 1100, H = 460;
  const PL = 70, PR = 70, PT = 40, PB = 60;
  const CW = W - PL - PR, CH = H - PT - PB;

  // Build path points
  const POINTS = 120;
  const pts: [number, number][] = [];
  for (let i = 0; i <= POINTS; i++) {
    const t = i / POINTS;
    const x = PL + t * CW;
    const y = PT + CH - curveY(t) * CH;
    pts.push([x, y]);
  }

  // Clip to drawProgress
  const visiblePts = pts.slice(0, Math.floor(drawProgress * POINTS) + 2);
  const pathD = visiblePts.length >= 2
    ? "M " + visiblePts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L ")
    : "";

  // Area fill path (close bottom)
  const areaD = visiblePts.length >= 2
    ? pathD + ` L ${visiblePts[visiblePts.length - 1][0].toFixed(1)},${(PT + CH).toFixed(1)} L ${PL},${(PT + CH).toFixed(1)} Z`
    : "";

  // Current tip position for glow dot
  const tipPt = visiblePts[visiblePts.length - 1] ?? [PL, PT + CH];

  // Keyword label position (near peak)
  const peakX = PL + 0.78 * CW;
  const peakY = PT + CH - curveY(0.78) * CH;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 80px", gap: 32 }}>

        {/* Title */}
        <div style={{ opacity: titleOp, transform: `translateY(${titleY}px)`, textAlign: "center" }}>
          <div style={{ fontFamily, fontWeight: 800, fontSize: 52, color: "#fff" }}>
            Popularité de l'IA dans le monde
          </div>
        </div>

        {/* Chart card */}
        <div style={{
          background: "linear-gradient(135deg, rgba(12,25,78,0.82), rgba(6,14,50,0.78))",
          border: "1.5px solid rgba(80,130,255,0.28)",
          borderRadius: 24,
          padding: "28px 32px",
          boxShadow: "0 0 50px rgba(59,130,246,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
          position: "relative",
          opacity: interpolate(frame, [5, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
            <defs>
              <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={`${accentColor}35`} />
                <stop offset="100%" stopColor={`${accentColor}02`} />
              </linearGradient>
              <linearGradient id="curve-stroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={`rgba(80,130,255,0.7)`} />
                <stop offset="60%" stopColor={accentColor} />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
              <filter id="glow-tip">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Grid lines */}
            {[0.25, 0.5, 0.75, 1].map((v, i) => (
              <line key={i}
                x1={PL} y1={PT + CH - v * CH}
                x2={W - PR} y2={PT + CH - v * CH}
                stroke="rgba(80,130,255,0.1)" strokeWidth="1" strokeDasharray="6,6"
              />
            ))}

            {/* Y-axis */}
            <line x1={PL} y1={PT} x2={PL} y2={PT + CH} stroke="rgba(80,130,255,0.3)" strokeWidth="1.5" />
            {/* X-axis */}
            <line x1={PL} y1={PT + CH} x2={W - PR} y2={PT + CH} stroke="rgba(80,130,255,0.3)" strokeWidth="1.5" />

            {/* X labels */}
            {xLabels.map((label, i) => {
              const x = PL + (i / (xLabels.length - 1)) * CW;
              const op = interpolate(frame, [DRAW_START + i * 8, DRAW_START + i * 8 + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <text key={i} x={x} y={H - 12} textAnchor="middle"
                  fill={`rgba(160,180,230,${op * 0.75})`}
                  fontFamily={fontFamily} fontSize="24" fontWeight="600"
                >
                  {label}
                </text>
              );
            })}

            {/* Area fill */}
            {areaD && <path d={areaD} fill="url(#area-fill)" />}

            {/* Curve line */}
            {pathD && (
              <path d={pathD}
                stroke="url(#curve-stroke)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Tip glow dot */}
            {visiblePts.length > 1 && (
              <circle
                cx={tipPt[0]} cy={tipPt[1]} r="8"
                fill={accentColor}
                filter="url(#glow-tip)"
                style={{ opacity: 0.9 }}
              />
            )}

            {/* Explosion marker line */}
            {drawProgress > 0.7 && (
              <line
                x1={peakX} y1={peakY}
                x2={peakX} y2={PT + CH}
                stroke="rgba(255,215,0,0.4)"
                strokeWidth="1.5"
                strokeDasharray="6,5"
                opacity={interpolate(drawProgress, [0.7, 0.85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
              />
            )}
          </svg>

          {/* ChatGPT keyword label */}
          {frame > LABEL_START && (
            <div style={{
              position: "absolute",
              left: PL + 32 + 0.65 * CW,
              top: 28 + PT + CH - curveY(0.68) * CH - 70,
              opacity: keywordS,
              transform: `scale(${0.8 + keywordS * 0.2})`,
            }}>
              <div style={{
                fontFamily, fontWeight: 800, fontSize: 56,
                background: "linear-gradient(90deg, #ffffff, #60a5fa)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                letterSpacing: "0.01em",
                textShadow: "none",
                whiteSpace: "nowrap",
              }}>
                {keyword} 🚀
              </div>
              <div style={{
                opacity: explosionOp,
                fontFamily, fontWeight: 700, fontSize: 24,
                color: "rgba(239,68,68,0.85)",
                letterSpacing: "0.04em",
                marginTop: 4,
              }}>
                {explosionLabel}
              </div>
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
