import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const CARDS = [
  { label: "Idées", emoji: "💡", color: "#7C3AED" },
  { label: "No-code", emoji: "🔧", color: "#EC4899" },
  { label: "Images IA", emoji: "🖼️", color: "#F97316" },
  { label: "Hébergement", emoji: "🖥️", color: "#3B82F6" },
  { label: "Code", emoji: "💻", color: "#10B981" },
  { label: "Design", emoji: "🎨", color: "#FBBF24" },
  { label: "Base de données", emoji: "🗄️", color: "#EF4444" },
  { label: "Chat support", emoji: "💬", color: "#06B6D4" },
];

const OFFSETS = [
  { x: 8, y: -12, rot: -5 },
  { x: -10, y: 7, rot: 3 },
  { x: 12, y: -8, rot: 6 },
  { x: -6, y: 10, rot: -4 },
  { x: 10, y: -15, rot: -7 },
  { x: -14, y: 5, rot: 5 },
  { x: 7, y: -10, rot: -3 },
  { x: -8, y: 12, rot: 7 },
];

const PHASES = [0, 0.7, 1.4, 2.1, 0.35, 1.05, 1.75, 2.45];

const CARD_W = 320;
const CARD_H = 190;

// 4×2 grid — larger cards, wider spacing
function getGridPos(i: number) {
  const col = i % 4;
  const row = Math.floor(i / 4);
  const x = 960 - 540 + col * 360;  // centres: 420, 780, 1140, 1500
  const y = 540 - 110 + row * 220;  // centres: 430, 650
  return { x, y };
}

export const GenSparkAnim01SoftwareChaos: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const vignetteOpacity = interpolate(frame, [150, 180], [0, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const shakeAmplitude = interpolate(frame, [100, 180], [0, 3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AuroraBackground />

      {CARDS.map((card, i) => {
        const delay = i * 17;
        const s = spring({
          frame: Math.max(0, frame - delay),
          fps,
          config: { mass: 0.5, damping: 12, stiffness: 200 },
          from: 0,
          to: 1,
        });

        const { x, y } = getGridPos(i);
        const { x: dx, y: dy, rot: dRot } = OFFSETS[i];
        const shake = shakeAmplitude > 0 ? Math.sin(frame * 0.5 + PHASES[i]) * shakeAmplitude : 0;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: CARD_W,
              height: CARD_H,
              left: x - CARD_W / 2 + dx,
              top: y - CARD_H / 2 + dy,
              opacity: s,
              transform: `translateY(${(1 - s) * 40}px) rotate(${dRot + shake}deg)`,
              background: `${card.color}22`,
              border: `1.5px solid ${card.color}99`,
              borderRadius: 24,
              backdropFilter: "blur(8px)",
              boxShadow: `0 0 50px ${card.color}40, 0 20px 40px rgba(0,0,0,0.5)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 64, lineHeight: 1 }}>{card.emoji}</span>
            <span
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontSize: 36,
                fontWeight: 700,
                color: "#ffffff",
                textAlign: "center",
                padding: "0 16px",
                letterSpacing: "-0.01em",
              }}
            >
              {card.label}
            </span>
          </div>
        );
      })}

      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,${vignetteOpacity}) 100%)`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
