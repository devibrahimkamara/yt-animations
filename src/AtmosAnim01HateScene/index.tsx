import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

export const atmosAnim01Schema = z.object({
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(5),
});

const EASING = (x: number) =>
  interpolate(x, [0, 1], [0, 1], {
    easing: (t) => {
      // bezier(0.16, 1, 0.3, 1)
      const c1 = 0.16,
        c2 = 1,
        c3 = 0.3,
        c4 = 1;
      const cx = 3 * c1,
        bx = 3 * (c3 - c1) - cx,
        ax = 1 - cx - bx;
      const cy = 3 * c2,
        by = 3 * (c4 - c2) - cy,
        ay = 1 - cy - by;
      const sampleCurveX = (t: number) => ((ax * t + bx) * t + cx) * t;
      const sampleCurveY = (t: number) => ((ay * t + by) * t + cy) * t;
      const solveCurveX = (x: number) => {
        let t2 = x;
        for (let i = 0; i < 8; i++) {
          const x2 = sampleCurveX(t2) - x;
          const d2 = (3 * ax * t2 + 2 * bx) * t2 + cx;
          if (Math.abs(d2) < 1e-6) break;
          t2 -= x2 / d2;
        }
        return t2;
      };
      return sampleCurveY(solveCurveX(t));
    },
  });

export type AtmosAnim01Props = z.infer<typeof atmosAnim01Schema>;

export const AtmosAnim01HateScene: React.FC<AtmosAnim01Props> = ({
  accentColor = "#3060ff",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phone appear: 0→20 frames
  const phoneScale = spring({ frame, fps, config: { mass: 0.6, damping: 12, stiffness: 180 }, from: 0.7, to: 1 });
  const phoneOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // Face expression
  const faceScale = spring({ frame: Math.max(0, frame - 10), fps, config: { mass: 0.5, damping: 9, stiffness: 200 }, from: 0.5, to: 1 });

  // Notification slides in at frame 30
  const notifY = interpolate(frame, [30, 50], [-120, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => EASING(t),
  });
  const notifOpacity = interpolate(frame, [30, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Gold glow on notification
  const glowPulse = interpolate(
    Math.sin(frame * 0.15),
    [-1, 1],
    [0.4, 1],
  );

  // Face tremble after notification
  const trembleX = frame > 55 ? Math.sin(frame * 1.8) * 4 * interpolate(frame, [55, 90], [1, 0], { extrapolateRight: "clamp" }) : 0;
  const trembleY = frame > 55 ? Math.cos(frame * 2.1) * 3 * interpolate(frame, [55, 90], [1, 0], { extrapolateRight: "clamp" }) : 0;

  // Screen red flash at notification arrival
  const redFlash = interpolate(frame, [30, 35, 45], [0, 0.18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AuroraBackground />

      {/* Red flash overlay */}
      {redFlash > 0 && (
        <AbsoluteFill style={{ background: `rgba(239,68,68,${redFlash})` }} />
      )}

      {/* Central phone mockup */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${phoneScale})`,
          opacity: phoneOpacity,
        }}
      >
        {/* Phone body */}
        <div
          style={{
            width: 320,
            height: 560,
            borderRadius: 48,
            border: "3px solid rgba(80,130,255,0.4)",
            background: "linear-gradient(160deg, rgba(15,25,80,0.9) 0%, rgba(5,10,40,0.95) 100%)",
            boxShadow: `0 0 60px ${accentColor}30, 0 0 120px ${accentColor}15, inset 0 1px 0 rgba(255,255,255,0.08)`,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Phone notch */}
          <div style={{
            position: "absolute",
            top: 16,
            width: 80,
            height: 20,
            borderRadius: 10,
            background: "rgba(0,0,0,0.8)",
          }} />

          {/* Notification toast */}
          <div
            style={{
              position: "absolute",
              top: 52,
              left: 12,
              right: 12,
              transform: `translateY(${notifY}px)`,
              opacity: notifOpacity,
              background: "linear-gradient(135deg, rgba(255,215,0,0.18) 0%, rgba(255,180,0,0.08) 100%)",
              border: "1px solid rgba(255,215,0,0.55)",
              borderRadius: 16,
              padding: "12px 16px",
              boxShadow: `0 0 24px rgba(255,215,0,${0.35 * glowPulse}), 0 0 48px rgba(255,215,0,${0.15 * glowPulse})`,
            }}
          >
            <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 13, fontWeight: 700, color: "#ffd700", letterSpacing: "0.04em", marginBottom: 4 }}>
              🚀 App lancée
            </div>
            <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 18, fontWeight: 800, color: "#ffffff", letterSpacing: "-0.01em" }}>
              10 000€ / mois
            </div>
          </div>

          {/* Large emoji face */}
          <div
            style={{
              fontSize: 120,
              transform: `scale(${faceScale}) translate(${trembleX}px, ${trembleY}px)`,
              marginTop: 60,
              filter: "drop-shadow(0 0 20px rgba(239,68,68,0.5))",
            }}
          >
            😤
          </div>

          {/* Sub text */}
          <div style={{
            position: "absolute",
            bottom: 60,
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: "rgba(136,170,255,0.7)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}>
            Ça t'a déjà fait ça ?
          </div>
        </div>
      </AbsoluteFill>

      {/* Side text label */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", paddingLeft: 120, pointerEvents: "none" }}>
        <div
          style={{
            opacity: interpolate(frame, [20, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            transform: `translateX(${interpolate(frame, [20, 40], [-30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
          }}
        >
          <div style={{
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontSize: 52,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            textShadow: `0 0 40px ${accentColor}50`,
            maxWidth: 480,
          }}>
            T'as déjà eu
          </div>
          <div style={{
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontSize: 52,
            fontWeight: 800,
            background: "linear-gradient(90deg, #ef4444 0%, #ffd700 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}>
            la haine ?
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
