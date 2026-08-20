import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";
import { GensparkLogo } from "../components/GensparkLogo";

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

// Same seed as Anim01
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

const E = Easing.bezier(0.16, 1, 0.3, 1);

const CARD_W = 320;
const CARD_H = 190;
const GENSPARK_W = 920;
const GENSPARK_H = 420;

function getGridPos(i: number) {
  const col = i % 4;
  const row = Math.floor(i / 4);
  const x = 960 - 540 + col * 360;
  const y = 540 - 110 + row * 220;
  return { x, y };
}

export const GenSparkAnim02Convergence: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <AuroraBackground />

      {/* Converging chaos cards — glassmorphisme identical to Anim01 */}
      {CARDS.map((card, i) => {
        const { x, y } = getGridPos(i);
        const { x: dx, y: dy, rot: dRot } = OFFSETS[i];

        const stagger = i * 4;
        const convStart = 10 + stagger;
        const convEnd = 70 + stagger;

        const progress = interpolate(frame, [convStart, convEnd], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: E,
        });

        const startX = x - CARD_W / 2 + dx;
        const startY = y - CARD_H / 2 + dy;
        const targetX = 960 - CARD_W / 2;
        const targetY = 540 - CARD_H / 2;

        const cardX = startX + (targetX - startX) * progress;
        const cardY = startY + (targetY - startY) * progress;
        const cardScale = 1 - progress * 0.7;

        const fadeStart = Math.max(55, convStart + 20);
        const fadeEnd = Math.max(70, convEnd);
        const cardOpacity = interpolate(frame, [fadeStart, fadeEnd], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const totalRot = dRot + progress * (dRot > 0 ? 20 : -20);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: CARD_W,
              height: CARD_H,
              left: cardX,
              top: cardY,
              opacity: cardOpacity,
              transform: `scale(${cardScale}) rotate(${totalRot}deg)`,
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
              }}
            >
              {card.label}
            </span>
          </div>
        );
      })}

      {/* Flash */}
      {(() => {
        const flashOpacity = interpolate(frame, [60, 67, 75], [0, 0.7, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const flashSize = interpolate(frame, [60, 75], [0, 400], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        if (flashOpacity <= 0) return null;
        return (
          <div
            style={{
              position: "absolute",
              left: 960 - flashSize / 2,
              top: 540 - flashSize / 2,
              width: flashSize,
              height: flashSize,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 70%)",
              opacity: flashOpacity,
              pointerEvents: "none",
            }}
          />
        );
      })()}

      {/* GenSpark AI card */}
      {(() => {
        const cardAppear = spring({
          frame: Math.max(0, frame - 75),
          fps,
          config: { mass: 0.5, damping: 14, stiffness: 180 },
          from: 0,
          to: 1,
        });

        const glowBlur = Math.sin(frame * 0.1) * 25 + 80;

        const titleOpacity = interpolate(frame, [80, 95], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const subtitleOpacity = interpolate(frame, [100, 115], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            style={{
              position: "absolute",
              left: 960 - GENSPARK_W / 2,
              top: 540 - GENSPARK_H / 2,
              width: GENSPARK_W,
              height: GENSPARK_H,
              opacity: cardAppear,
              transform: `scale(${cardAppear})`,
              background: "linear-gradient(135deg, #3060ff, #22c55e)",
              borderRadius: 32,
              border: "1.5px solid rgba(255,255,255,0.25)",
              boxShadow: `0 0 ${glowBlur}px rgba(48,96,255,0.5), 0 0 ${glowBlur * 2}px rgba(48,96,255,0.15)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
            }}
          >
            <div style={{ opacity: titleOpacity }}>
              <GensparkLogo height={100} fontFamily="Plus Jakarta Sans, sans-serif" />
            </div>

            <div
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontSize: 38,
                fontWeight: 600,
                color: "rgba(255,255,255,0.85)",
                opacity: subtitleOpacity,
                letterSpacing: "-0.01em",
                textAlign: "center",
                padding: "0 48px",
              }}
            >
              Une seule IA. Toutes les possibilités.
            </div>
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};
