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

export const atmosAnim03Schema = z.object({
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(6),
});

export type AtmosAnim03Props = z.infer<typeof atmosAnim03Schema>;

const E = Easing.bezier(0.16, 1, 0.3, 1);

const MILESTONES = [
  {
    year: "2020",
    label: "Business en ligne",
    emoji: "💻",
    revenue: "X XXX€",
    revealFrame: 30,
  },
  {
    year: "2022",
    label: "Croissance x10",
    emoji: "📈",
    revenue: "XX XXX€",
    revealFrame: 70,
  },
  {
    year: "2025",
    label: "Apps SaaS IA",
    emoji: "🚀",
    revenue: "XXX XXX€",
    revealFrame: 110,
  },
];

export const AtmosAnim03CredibilityTimeline: React.FC<AtmosAnim03Props> = ({
  accentColor = "#3060ff",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Line draw progress
  const lineProgress = interpolate(frame, [10, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: E,
  });

  // Card appear
  const cardOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const cardScale = spring({ frame, fps, config: { mass: 0.6, damping: 12, stiffness: 160 }, from: 0.92, to: 1 });

  // Badge appear at end
  const badgeScale = spring({
    frame: Math.max(0, frame - 125),
    fps,
    config: { mass: 0.5, damping: 10, stiffness: 200 },
    from: 0,
    to: 1,
  });

  const CARD_W = 1380;
  const CARD_H = 420;
  const LINE_Y = CARD_H / 2 + 20;
  const DOT_POSITIONS = [0.12, 0.5, 0.88];

  return (
    <AbsoluteFill>
      <AuroraBackground />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
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
            opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          Pourquoi me faire confiance ?
        </div>

        {/* Timeline card */}
        <div
          style={{
            opacity: cardOpacity,
            transform: `scale(${cardScale})`,
            width: CARD_W,
            height: CARD_H,
            background: "linear-gradient(135deg, rgba(20,40,120,0.55) 0%, rgba(10,20,60,0.45) 100%)",
            border: "1px solid rgba(80,130,255,0.22)",
            borderRadius: 28,
            boxShadow: `0 0 60px ${accentColor}25, 0 0 120px ${accentColor}12`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Timeline line */}
          <svg
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
            viewBox={`0 0 ${CARD_W} ${CARD_H}`}
          >
            {/* Track */}
            <line
              x1={CARD_W * 0.07}
              y1={LINE_Y}
              x2={CARD_W * 0.93}
              y2={LINE_Y}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={3}
            />
            {/* Animated fill */}
            <line
              x1={CARD_W * 0.07}
              y1={LINE_Y}
              x2={CARD_W * 0.07 + (CARD_W * 0.86) * lineProgress}
              y2={LINE_Y}
              stroke={accentColor}
              strokeWidth={3}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 6px ${accentColor})` }}
            />
          </svg>

          {/* Milestones */}
          {MILESTONES.map((m, i) => {
            const dotX = CARD_W * DOT_POSITIONS[i];
            const dotReached = lineProgress >= DOT_POSITIONS[i] - 0.05;
            const dotScale = spring({
              frame: Math.max(0, frame - (10 + i * 35)),
              fps,
              config: { mass: 0.45, damping: 10, stiffness: 220 },
              from: 0,
              to: 1,
            });
            const contentOpacity = interpolate(
              frame,
              [10 + i * 35, 10 + i * 35 + 20],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            const contentY = interpolate(
              frame,
              [10 + i * 35, 10 + i * 35 + 20],
              [20, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: E },
            );

            // Blur reveal for revenue
            const blurAmount = interpolate(
              frame,
              [m.revealFrame, m.revealFrame + 20],
              [8, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: dotX,
                  top: 0,
                  bottom: 0,
                  transform: "translateX(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Year label — above */}
                <div
                  style={{
                    position: "absolute",
                    top: 48,
                    opacity: contentOpacity,
                    transform: `translateY(${-contentY}px)`,
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    fontSize: 20,
                    fontWeight: 700,
                    color: "rgba(136,170,255,0.7)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {m.year}
                </div>

                {/* Dot */}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: dotReached
                      ? `radial-gradient(circle, ${accentColor} 0%, ${accentColor}80 60%, transparent 100%)`
                      : "rgba(255,255,255,0.06)",
                    border: `2px solid ${dotReached ? accentColor : "rgba(255,255,255,0.1)"}`,
                    boxShadow: dotReached ? `0 0 24px ${accentColor}60, 0 0 48px ${accentColor}25` : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    transform: `scale(${dotScale})`,
                    transition: "none",
                  }}
                >
                  {m.emoji}
                </div>

                {/* Card below dot */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 36,
                    width: 320,
                    background: "linear-gradient(135deg, rgba(30,60,160,0.55) 0%, rgba(15,30,80,0.45) 100%)",
                    border: `1px solid ${dotReached ? "rgba(80,130,255,0.35)" : "rgba(80,130,255,0.1)"}`,
                    borderRadius: 18,
                    padding: "16px 20px",
                    opacity: contentOpacity,
                    transform: `translateY(${contentY}px)`,
                    boxShadow: dotReached ? `0 0 20px ${accentColor}20` : "none",
                  }}
                >
                  <div style={{
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#ffffff",
                    marginBottom: 8,
                    letterSpacing: "-0.01em",
                  }}>
                    {m.label}
                  </div>
                  <div style={{
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    fontSize: 22,
                    fontWeight: 800,
                    color: "#ffd700",
                    filter: `blur(${blurAmount}px)`,
                    letterSpacing: "-0.01em",
                    userSelect: "none",
                  }}>
                    {m.revenue}
                  </div>
                  <div style={{
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "rgba(136,170,255,0.5)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginTop: 2,
                  }}>
                    générés
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Experience badge */}
        <div
          style={{
            transform: `scale(${badgeScale})`,
            background: "linear-gradient(135deg, rgba(48,96,255,0.25) 0%, rgba(48,96,255,0.1) 100%)",
            border: "1px solid rgba(80,130,255,0.5)",
            borderRadius: 50,
            padding: "12px 32px",
            boxShadow: `0 0 30px ${accentColor}30`,
          }}
        >
          <span style={{
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontSize: 22,
            fontWeight: 800,
            color: "#88aaff",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}>
            ✦ 6 ans de business en ligne ✦
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
