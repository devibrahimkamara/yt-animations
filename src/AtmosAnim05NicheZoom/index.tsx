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

export const atmosAnim05Schema = z.object({
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(5),
});

export type AtmosAnim05Props = z.infer<typeof atmosAnim05Schema>;

const E = Easing.bezier(0.16, 1, 0.3, 1);

const LAYERS = [
  {
    label: "TOUTES LES ENTREPRISES",
    sublabel: "Des milliers de cibles",
    emoji: "🏢",
    color: "#3060ff",
    startFrame: 0,
    endFrame: 40,
    dotCount: 24,
    dotColor: "rgba(136,170,255,0.4)",
  },
  {
    label: "PETITES ENTREPRISES",
    sublabel: "Le bon segment",
    emoji: "🏪",
    color: "#22c55e",
    startFrame: 40,
    endFrame: 80,
    dotCount: 10,
    dotColor: "rgba(34,197,94,0.5)",
  },
  {
    label: "SALONS DE COIFFURE",
    sublabel: "Ta niche gagnante 💰",
    emoji: "💇",
    color: "#ffd700",
    startFrame: 80,
    endFrame: 140,
    dotCount: 1,
    dotColor: "rgba(255,215,0,0.8)",
  },
];

// Stable positions for dots (seeded)
function getDotPositions(count: number, seed: number): Array<{ x: number; y: number }> {
  const positions: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < count; i++) {
    const angle = ((i * 137.508 + seed) * Math.PI) / 180;
    const r = 0.25 + (((i * 17 + seed) % 100) / 100) * 0.5;
    positions.push({
      x: 0.5 + r * Math.cos(angle) * 0.7,
      y: 0.5 + r * Math.sin(angle) * 0.55,
    });
  }
  return positions;
}

export const AtmosAnim05NicheZoom: React.FC<AtmosAnim05Props> = ({
  accentColor = "#3060ff",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const W = 1920;
  const H = 1080;

  // Current active layer
  const layerIdx = LAYERS.reduce((acc, l, i) => (frame >= l.startFrame ? i : acc), 0);
  const currentLayer = LAYERS[layerIdx];

  // Funnel progress
  const funnelProgress = interpolate(frame, [0, 130], [0, 1], {
    extrapolateRight: "clamp",
    easing: E,
  });

  // Label transition
  const labelOpacity = (i: number) => {
    const l = LAYERS[i];
    return interpolate(
      frame,
      [l.startFrame, l.startFrame + 15, l.endFrame - 5, l.endFrame + 5],
      [0, 1, 1, i < LAYERS.length - 1 ? 0 : 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
  };

  // Focus circle
  const focusScale = interpolate(frame, [80, 110], [1.4, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: E,
  });

  // Final niche card
  const nicheCardScale = spring({
    frame: Math.max(0, frame - 90),
    fps,
    config: { mass: 0.5, damping: 10, stiffness: 200 },
    from: 0,
    to: 1,
  });

  const allDots = getDotPositions(24, 42);
  const midDots = getDotPositions(10, 99);

  return (
    <AbsoluteFill>
      <AuroraBackground />

      <AbsoluteFill>
        {/* Funnel SVG in background */}
        <svg
          style={{ position: "absolute", inset: 0, opacity: 0.18 }}
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
        >
          {[0, 1, 2].map((i) => {
            const p = Math.min(1, Math.max(0, funnelProgress - i * 0.33) * 3);
            const topW = W * (0.9 - i * 0.28) * p;
            const botW = W * (0.62 - i * 0.28) * p;
            const y1 = H * (0.08 + i * 0.22);
            const y2 = H * (0.3 + i * 0.22);
            return (
              <path
                key={i}
                d={`M ${W / 2 - topW / 2} ${y1} L ${W / 2 + topW / 2} ${y1} L ${W / 2 + botW / 2} ${y2} L ${W / 2 - botW / 2} ${y2} Z`}
                fill={LAYERS[i].color}
                opacity={0.5}
              />
            );
          })}
        </svg>

        {/* All companies dots layer (phase 0) */}
        {frame < 85 && allDots.map((d, i) => {
          const appear = interpolate(frame, [i * 1.2, i * 1.2 + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const fadeOut = frame >= 40
            ? interpolate(frame, [40 + i * 1.5, 40 + i * 1.5 + 12], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
            : 1;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: d.x * W - 18,
                top: d.y * H - 18,
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "rgba(48,96,255,0.2)",
                border: "1px solid rgba(80,130,255,0.3)",
                fontSize: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: appear * fadeOut,
              }}
            >
              🏢
            </div>
          );
        })}

        {/* Small business dots (phase 1) */}
        {frame >= 35 && frame < 95 && midDots.map((d, i) => {
          const appear = interpolate(frame, [40 + i * 2, 40 + i * 2 + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const fadeOut = frame >= 80
            ? interpolate(frame, [80 + i * 2, 80 + i * 2 + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
            : 1;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: d.x * W - 22,
                top: d.y * H - 22,
                width: 44,
                height: 44,
                borderRadius: 10,
                background: "rgba(34,197,94,0.2)",
                border: "1px solid rgba(34,197,94,0.4)",
                fontSize: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: appear * fadeOut,
                boxShadow: "0 0 12px rgba(34,197,94,0.2)",
              }}
            >
              🏪
            </div>
          );
        })}

        {/* Focus zoom circle */}
        {frame >= 30 && (
          <div style={{
            position: "absolute",
            left: W / 2,
            top: H / 2,
            transform: `translate(-50%,-50%) scale(${focusScale})`,
            width: 800,
            height: 800,
            borderRadius: "50%",
            border: `2px solid ${currentLayer.color}`,
            boxShadow: `0 0 40px ${currentLayer.color}30, inset 0 0 80px ${currentLayer.color}08`,
            opacity: interpolate(frame, [30, 50], [0, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            pointerEvents: "none",
          }} />
        )}

        {/* Final niche card */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) scale(${nicheCardScale})`,
            opacity: interpolate(frame, [90, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          <div style={{
            background: "linear-gradient(135deg, rgba(255,215,0,0.18) 0%, rgba(255,180,0,0.08) 100%)",
            border: "2px solid rgba(255,215,0,0.6)",
            borderRadius: 32,
            padding: "40px 64px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            boxShadow: "0 0 60px rgba(255,215,0,0.25), 0 0 120px rgba(255,215,0,0.1)",
            minWidth: 500,
          }}>
            <span style={{ fontSize: 80 }}>💇</span>
            <div style={{
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontSize: 48,
              fontWeight: 800,
              color: "#ffd700",
              letterSpacing: "-0.02em",
              textAlign: "center",
              textShadow: "0 0 40px rgba(255,215,0,0.5)",
            }}>
              Salons de coiffure
            </div>
            <div style={{
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontSize: 20,
              fontWeight: 600,
              color: "rgba(255,255,255,0.6)",
              letterSpacing: "0.04em",
            }}>
              Ta niche. Ton marché. Ton argent.
            </div>
          </div>
        </div>

        {/* Bottom labels — layer transition */}
        <div style={{
          position: "absolute",
          bottom: 72,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}>
          {LAYERS.map((l, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                opacity: labelOpacity(i),
                textAlign: "center",
              }}
            >
              <div style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontSize: 32,
                fontWeight: 800,
                color: l.color,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textShadow: `0 0 30px ${l.color}60`,
              }}>
                {l.label}
              </div>
              <div style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontSize: 18,
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
                marginTop: 4,
              }}>
                {l.sublabel}
              </div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
