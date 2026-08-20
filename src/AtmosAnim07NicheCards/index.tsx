import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

export const atmosAnim07Schema = z.object({
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(6),
});

export type AtmosAnim07Props = z.infer<typeof atmosAnim07Schema>;

const NICHES = [
  { emoji: "💇", label: "Salon de coiffure", badge: "NICHE", badgeColor: "#3060ff" },
  { emoji: "🍽️", label: "Restaurant", badge: "NICHE", badgeColor: "#8b5cf6" },
  { emoji: "💅", label: "Institut de beauté", badge: "NICHE", badgeColor: "#ec4899" },
  { emoji: "🏋️", label: "Salle de sport", badge: "NICHE", badgeColor: "#f59e0b" },
  { emoji: "🏡", label: "Agence immobilière", badge: "BONUS", badgeColor: "#22c55e" },
];

// Grid: 2x2 then 1 centered
const POSITIONS: Array<{ col: number; row: number }> = [
  { col: 0, row: 0 },
  { col: 1, row: 0 },
  { col: 0, row: 1 },
  { col: 1, row: 1 },
  { col: 0.5, row: 2 },
];

const CARD_W = 380;
const CARD_H = 220;
const GAP_X = 48;
const GAP_Y = 32;

export const AtmosAnim07NicheCards: React.FC<AtmosAnim07Props> = ({
  accentColor = "#3060ff",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalW = 2 * CARD_W + GAP_X;
  const totalH = 3 * CARD_H + 2 * GAP_Y;
  const startX = (1920 - totalW) / 2;
  const startY = (1080 - totalH) / 2 + 60;

  // Stagger by diagonal (col + row)
  const staggerDelay = (col: number, row: number) => {
    const diag = col + row;
    return 15 + diag * 18;
  };

  // Title reveal
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 20], [-20, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <AuroraBackground />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div style={{
          fontFamily: "Plus Jakarta Sans, sans-serif",
          fontSize: 36,
          fontWeight: 700,
          color: "rgba(136,170,255,0.85)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}>
          Des sous-niches à exploiter
        </div>
      </div>

      {/* Niche cards */}
      {NICHES.map((niche, i) => {
        const pos = POSITIONS[i];
        const delay = staggerDelay(pos.col, pos.row);

        const cardX = startX + pos.col * (CARD_W + GAP_X);
        const cardY = startY + pos.row * (CARD_H + GAP_Y);

        const cardScale = spring({
          frame: Math.max(0, frame - delay),
          fps,
          config: { mass: 0.5, damping: 11, stiffness: 200 },
          from: 0,
          to: 1,
        });
        const cardOpacity = interpolate(frame, [delay, delay + 12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        // Breathing effect
        const breatheScale = 1 + Math.sin((frame - delay) * 0.04 + i * 0.8) * 0.008;

        // Badge pop
        const badgeScale = spring({
          frame: Math.max(0, frame - (delay + 8)),
          fps,
          config: { mass: 0.4, damping: 8, stiffness: 260 },
          from: 0,
          to: 1,
        });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cardX,
              top: cardY,
              width: CARD_W,
              height: CARD_H,
              opacity: cardOpacity,
              transform: `scale(${cardScale * breatheScale})`,
              transformOrigin: "center center",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, rgba(20,40,120,0.65) 0%, rgba(10,20,60,0.55) 100%)",
                border: `1px solid ${niche.badgeColor}40`,
                borderRadius: 24,
                boxShadow: `0 0 40px ${niche.badgeColor}20, 0 0 80px ${niche.badgeColor}08, inset 0 1px 0 rgba(255,255,255,0.06)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Badge */}
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  transform: `scale(${badgeScale})`,
                  background: `${niche.badgeColor}25`,
                  border: `1px solid ${niche.badgeColor}70`,
                  borderRadius: 50,
                  padding: "4px 12px",
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  color: niche.badgeColor,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  boxShadow: `0 0 10px ${niche.badgeColor}30`,
                }}
              >
                {niche.badge}
              </div>

              {/* Emoji */}
              <span style={{
                fontSize: 52,
                filter: `drop-shadow(0 0 16px ${niche.badgeColor}40)`,
              }}>
                {niche.emoji}
              </span>

              {/* Label */}
              <div style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "-0.01em",
                textAlign: "center",
              }}>
                {niche.label}
              </div>

              {/* Subtle bottom glow */}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 3,
                background: `linear-gradient(90deg, transparent, ${niche.badgeColor}, transparent)`,
                opacity: 0.6,
              }} />
            </div>
          </div>
        );
      })}

      {/* Bottom CTA */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [100, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <div style={{
          fontFamily: "Plus Jakarta Sans, sans-serif",
          fontSize: 22,
          fontWeight: 600,
          color: `${accentColor}`,
          letterSpacing: "0.04em",
          background: "rgba(48,96,255,0.12)",
          border: "1px solid rgba(48,96,255,0.3)",
          borderRadius: 50,
          padding: "10px 28px",
        }}>
          Choisis ta niche → commence à coder
        </div>
      </div>
    </AbsoluteFill>
  );
};
