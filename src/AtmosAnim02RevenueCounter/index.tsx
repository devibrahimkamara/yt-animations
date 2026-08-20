import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

export const atmosAnim02Schema = z.object({
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(4),
});

export type AtmosAnim02Props = z.infer<typeof atmosAnim02Schema>;

const E = Easing.bezier(0.16, 1, 0.3, 1);

const MILESTONES = [
  { value: 3000, color: "#3060ff", label: "POSSIBLE", frame: 10 },
  { value: 4000, color: "#22c55e", label: "RÉALISTE", frame: 45 },
  { value: 5000, color: "#ffd700", label: "OBJECTIF", frame: 80 },
];

function formatEuro(n: number): string {
  return Math.round(n).toLocaleString("fr-FR") + "€";
}

// Draws an SVG arc
function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const x1 = cx + r * Math.cos(toRad(startAngle - 90));
  const y1 = cy + r * Math.sin(toRad(startAngle - 90));
  const x2 = cx + r * Math.cos(toRad(endAngle - 90));
  const y2 = cy + r * Math.sin(toRad(endAngle - 90));
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
}

export const AtmosAnim02RevenueCounter: React.FC<AtmosAnim02Props> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Which milestone are we on?
  const milestoneIdx = MILESTONES.reduce((acc, m, i) => (frame >= m.frame ? i : acc), 0);
  const currentMilestone = MILESTONES[milestoneIdx];

  // Count-up value
  const countValue = interpolate(
    frame,
    [0, 10, 45, 80, 110],
    [0, 0, 3000, 4000, 5000],
    { extrapolateRight: "clamp", easing: E },
  );

  // Main card appear
  const cardOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const cardScale = spring({ frame, fps, config: { mass: 0.6, damping: 12, stiffness: 160 }, from: 0.88, to: 1 });

  // Arcs - each draws progressively
  const arcRadius = [130, 160, 190];
  const arcColors = ["#3060ff", "#22c55e", "#ffd700"];
  const arcStartFrames = [10, 45, 80];
  const arcDuration = 30;

  // Badge pulse for each milestone
  const badgePop = (mIdx: number) =>
    spring({
      frame: Math.max(0, frame - MILESTONES[mIdx].frame),
      fps,
      config: { mass: 0.4, damping: 9, stiffness: 220 },
      from: 0,
      to: 1,
    });

  const SIZE = 440;
  const CX = SIZE / 2;
  const CY = SIZE / 2;

  return (
    <AbsoluteFill>
      <AuroraBackground />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        {/* Title */}
        <div
          style={{
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontSize: 40,
            fontWeight: 700,
            color: "rgba(136,170,255,0.85)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 32,
            opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          Potentiel mensuel
        </div>

        {/* Arc gauge card */}
        <div
          style={{
            opacity: cardOpacity,
            transform: `scale(${cardScale})`,
            background: "linear-gradient(135deg, rgba(20,40,120,0.55) 0%, rgba(10,20,60,0.45) 100%)",
            border: "1px solid rgba(80,130,255,0.22)",
            borderRadius: 36,
            boxShadow: `0 0 60px ${currentMilestone.color}30, 0 0 120px ${currentMilestone.color}15`,
            padding: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <svg width={SIZE} height={SIZE} style={{ overflow: "visible" }}>
            {/* Background track arcs */}
            {arcRadius.map((r, i) => (
              <path
                key={`track-${i}`}
                d={describeArc(CX, CY, r, -30, 210)}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={12}
                fill="none"
                strokeLinecap="round"
              />
            ))}

            {/* Animated arcs */}
            {arcRadius.map((r, i) => {
              const progress = interpolate(
                frame,
                [arcStartFrames[i], arcStartFrames[i] + arcDuration],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: E },
              );
              const endAngle = -30 + 240 * progress;
              if (progress <= 0) return null;
              return (
                <g key={`arc-${i}`}>
                  {/* Glow */}
                  <path
                    d={describeArc(CX, CY, r, -30, endAngle)}
                    stroke={arcColors[i]}
                    strokeWidth={16}
                    fill="none"
                    strokeLinecap="round"
                    opacity={0.25}
                    style={{ filter: `blur(6px)` }}
                  />
                  {/* Main arc */}
                  <path
                    d={describeArc(CX, CY, r, -30, endAngle)}
                    stroke={arcColors[i]}
                    strokeWidth={10}
                    fill="none"
                    strokeLinecap="round"
                  />
                  {/* Tip dot */}
                  <circle
                    cx={CX + r * Math.cos(((endAngle - 90) * Math.PI) / 180)}
                    cy={CY + r * Math.sin(((endAngle - 90) * Math.PI) / 180)}
                    r={7}
                    fill={arcColors[i]}
                    style={{ filter: `drop-shadow(0 0 8px ${arcColors[i]})` }}
                  />
                </g>
              );
            })}

            {/* Central value */}
            <text
              x={CX}
              y={CY - 16}
              textAnchor="middle"
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontSize: 72,
                fontWeight: 800,
                fill: "#ffffff",
                letterSpacing: "-2px",
              }}
            >
              {formatEuro(countValue)}
            </text>

            {/* /mois label */}
            <text
              x={CX}
              y={CY + 28}
              textAnchor="middle"
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontSize: 24,
                fontWeight: 600,
                fill: "rgba(136,170,255,0.7)",
                letterSpacing: "0.06em",
              }}
            >
              PAR MOIS
            </text>
          </svg>
        </div>

        {/* Milestone badges */}
        <div style={{ display: "flex", gap: 20, marginTop: 36 }}>
          {MILESTONES.map((m, i) => {
            const pop = badgePop(i);
            const isActive = frame >= m.frame;
            return (
              <div
                key={i}
                style={{
                  transform: `scale(${pop})`,
                  opacity: isActive ? 1 : 0.25,
                  background: isActive
                    ? `linear-gradient(135deg, ${m.color}25, ${m.color}10)`
                    : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isActive ? m.color + "80" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 50,
                  padding: "10px 24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  boxShadow: isActive ? `0 0 20px ${m.color}30` : "none",
                }}
              >
                <span style={{
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  fontSize: 22,
                  fontWeight: 800,
                  color: isActive ? m.color : "rgba(255,255,255,0.3)",
                  letterSpacing: "-0.01em",
                }}>
                  {formatEuro(m.value)}
                </span>
                <span style={{
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  color: isActive ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}>
                  {m.label}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
