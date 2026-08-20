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

export const atmosAnim04Schema = z.object({
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(5),
});

export type AtmosAnim04Props = z.infer<typeof atmosAnim04Schema>;

const E = Easing.bezier(0.16, 1, 0.3, 1);

const COMPANIES = [
  { emoji: "🏪", name: "Boutique", angle: 0 },
  { emoji: "🍽️", name: "Restaurant", angle: 60 },
  { emoji: "💇", name: "Coiffeur", angle: 120 },
  { emoji: "🏋️", name: "Gym", angle: 180 },
  { emoji: "💄", name: "Beauté", angle: 240 },
  { emoji: "🏡", name: "Immo", angle: 300 },
];

export const AtmosAnim04GeneralistTrap: React.FC<AtmosAnim04Props> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const W = 1920;
  const H = 1080;
  const CX = W / 2;
  const CY = H / 2;
  const ORBIT_R = 280;

  // Center logo appear
  const logoScale = spring({ frame, fps, config: { mass: 0.6, damping: 12, stiffness: 160 }, from: 0, to: 1 });
  const logoOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // After frame 40: companies start bouncing off and flying away
  const rejectStart = 50;

  // Logo cracks/dims after companies leave
  const logoCrack = interpolate(frame, [rejectStart + 20, rejectStart + 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: E,
  });
  const logoRed = interpolate(frame, [rejectStart + 20, rejectStart + 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AuroraBackground />

      <AbsoluteFill>
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          {/* Orbit ring */}
          <circle
            cx={CX}
            cy={CY}
            r={ORBIT_R}
            fill="none"
            stroke="rgba(80,130,255,0.12)"
            strokeWidth={2}
            strokeDasharray="8 6"
          />

          {/* Connection lines */}
          {COMPANIES.map((c, i) => {
            const rad = (c.angle * Math.PI) / 180;
            const cx2 = CX + ORBIT_R * Math.cos(rad);
            const cy2 = CY + ORBIT_R * Math.sin(rad);
            const lineOpacity = interpolate(
              frame,
              [10 + i * 4, 10 + i * 4 + 12, rejectStart + i * 5, rejectStart + i * 5 + 10],
              [0, 0.4, 0.4, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            return (
              <line
                key={`line-${i}`}
                x1={CX}
                y1={CY}
                x2={cx2}
                y2={cy2}
                stroke="#3060ff"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                opacity={lineOpacity}
                style={{ filter: "drop-shadow(0 0 4px #3060ff)" }}
              />
            );
          })}
        </svg>

        {/* Company icons orbiting */}
        {COMPANIES.map((c, i) => {
          const rad = (c.angle * Math.PI) / 180;
          const baseX = CX + ORBIT_R * Math.cos(rad);
          const baseY = CY + ORBIT_R * Math.sin(rad);

          // Appear with spring
          const appear = spring({
            frame: Math.max(0, frame - i * 4),
            fps,
            config: { mass: 0.45, damping: 10, stiffness: 220 },
            from: 0,
            to: 1,
          });

          // Reject: bounce toward center then fly away
          const rejectFrame = rejectStart + i * 5;
          const bounceX = interpolate(
            frame,
            [rejectFrame, rejectFrame + 8, rejectFrame + 18],
            [0, (CX - baseX) * 0.3, (baseX - CX) * 1.6],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: E },
          );
          const bounceY = interpolate(
            frame,
            [rejectFrame, rejectFrame + 8, rejectFrame + 18],
            [0, (CY - baseY) * 0.3, (baseY - CY) * 1.6],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: E },
          );
          const rejectOpacity = interpolate(
            frame,
            [rejectFrame + 12, rejectFrame + 22],
            [1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );

          // X badge pop
          const xScale = spring({
            frame: Math.max(0, frame - (rejectFrame + 4)),
            fps,
            config: { mass: 0.4, damping: 8, stiffness: 250 },
            from: 0,
            to: 1,
          });
          const showX = frame >= rejectFrame + 4;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: baseX + bounceX - 44,
                top: baseY + bounceY - 44,
                width: 88,
                height: 88,
                transform: `scale(${appear})`,
                opacity: rejectOpacity,
              }}
            >
              <div
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: 22,
                  background: "linear-gradient(135deg, rgba(20,40,120,0.7) 0%, rgba(10,20,60,0.6) 100%)",
                  border: `1px solid ${frame >= rejectFrame ? "rgba(239,68,68,0.4)" : "rgba(80,130,255,0.3)"}`,
                  boxShadow: frame >= rejectFrame ? "0 0 16px rgba(239,68,68,0.3)" : "0 0 12px rgba(48,96,255,0.2)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  position: "relative",
                }}
              >
                <span style={{ fontSize: 28 }}>{c.emoji}</span>
                <span style={{
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.6)",
                  letterSpacing: "0.06em",
                }}>
                  {c.name}
                </span>
                {showX && (
                  <div
                    style={{
                      position: "absolute",
                      top: -12,
                      right: -12,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: "#ef4444",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 800,
                      transform: `scale(${xScale})`,
                      boxShadow: "0 0 12px rgba(239,68,68,0.6)",
                    }}
                  >
                    ✕
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Central ALL-IN-ONE logo */}
        <div
          style={{
            position: "absolute",
            left: CX - 100,
            top: CY - 100,
            width: 200,
            height: 200,
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
          }}
        >
          <div
            style={{
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${logoRed > 0 ? `rgba(${Math.round(60 + 100 * logoRed)},${Math.round(80 - 70 * logoRed)},${Math.round(200 - 160 * logoRed)},0.7)` : "rgba(20,60,200,0.7)"} 0%, rgba(10,20,80,0.6) 100%)`,
              border: `2px solid ${logoRed > 0.5 ? `rgba(239,68,68,${0.4 + logoRed * 0.4})` : "rgba(80,130,255,0.4)"}`,
              boxShadow: logoRed > 0 ? `0 0 ${40 + logoCrack * 40}px rgba(239,68,68,${0.3 + logoCrack * 0.4})` : `0 0 60px rgba(48,96,255,0.4)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              position: "relative",
            }}
          >
            <span style={{ fontSize: 36 }}>🎯</span>
            <span style={{
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontSize: 13,
              fontWeight: 800,
              color: logoRed > 0.5 ? "#ef4444" : "#88aaff",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              textAlign: "center",
              lineHeight: 1.2,
            }}>
              ALL-IN-<br />ONE
            </span>
          </div>
        </div>

        {/* Bottom label */}
        <div style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [rejectStart + 30, rejectStart + 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(239,68,68,0.2) 0%, rgba(239,68,68,0.1) 100%)",
            border: "1px solid rgba(239,68,68,0.4)",
            borderRadius: 50,
            padding: "12px 32px",
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontSize: 24,
            fontWeight: 700,
            color: "#ef4444",
            letterSpacing: "0.04em",
            boxShadow: "0 0 24px rgba(239,68,68,0.2)",
          }}>
            ❌ Trop généraliste — personne ne l'achètera
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
