import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

export const anim06Schema = z.object({
  title: z.string().default("3 façons d'avoir des partenariats"),
  cards: z.array(z.object({
    emoji: z.string(),
    title: z.string(),
    description: z.string(),
    tag: z.string(),
    variant: z.enum(["neutral", "warning", "winner"]),
  })).default([
    { emoji: "👥", title: "Grosse communauté", description: "Les marques te contactent directement", tag: "Passif", variant: "neutral" },
    { emoji: "🏢", title: "Agence d'influence", description: "−20 à 25% de commission sur chaque deal", tag: "−25%", variant: "warning" },
    { emoji: "👑", title: "Tu contactes toi-même", description: "Maximum de revenus, zéro intermédiaire", tag: "Recommandé", variant: "winner" },
  ]),
  accentColor: z.string().default("#3b82f6"),
  durationSecs: z.number().default(7),
});

const CARD_COLORS = {
  neutral: { bg: "linear-gradient(135deg, rgba(30,35,60,0.82), rgba(18,22,45,0.78))", border: "rgba(100,120,180,0.3)", tag: "#8899cc", glow: "rgba(100,120,180,0.15)" },
  warning: { bg: "linear-gradient(135deg, rgba(80,20,20,0.82), rgba(50,12,12,0.78))", border: "rgba(220,60,60,0.4)", tag: "#ef4444", glow: "rgba(220,60,60,0.15)" },
  winner: { bg: "linear-gradient(135deg, rgba(70,52,0,0.88), rgba(45,32,0,0.82))", border: "rgba(255,215,0,0.55)", tag: "#ffd700", glow: "rgba(255,215,0,0.2)" },
};

export const Anim06Partnerships: React.FC<z.infer<typeof anim06Schema>> = ({
  title, cards, accentColor, durationSecs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const STAGGER = 35;

  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 20], [-20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 80px", gap: 50 }}>

        {/* Title */}
        <div style={{ opacity: titleOp, transform: `translateY(${titleY}px)`, textAlign: "center" }}>
          <div style={{ fontFamily, fontWeight: 800, fontSize: 58, color: "#fff", letterSpacing: "0.01em" }}>{title}</div>
        </div>

        {/* Cards */}
        <div style={{ display: "flex", gap: 28, width: "100%", alignItems: "stretch" }}>
          {cards.map((card, i) => {
            const colors = CARD_COLORS[card.variant];
            const cardStart = 20 + i * STAGGER;
            const s = spring({ frame: frame - cardStart, fps, config: { mass: 0.5, damping: 10, stiffness: 200 } });
            const cardY = interpolate(s, [0, 1], [-50, 0]);
            const isWinner = card.variant === "winner";
            const winnerGlow = isWinner ? 20 + 12 * Math.abs(Math.sin(frame * 0.08)) : 0;

            return (
              <div key={i} style={{
                flex: 1,
                opacity: s, transform: `translateY(${cardY}px) scale(${0.92 + s * 0.08})`,
                background: colors.bg,
                border: `2px solid ${colors.border}`,
                borderRadius: 24,
                padding: "36px 32px",
                display: "flex", flexDirection: "column", gap: 20,
                boxShadow: isWinner
                  ? `0 0 ${winnerGlow}px rgba(255,215,0,0.35), 0 0 ${winnerGlow * 2}px rgba(255,215,0,0.15), inset 0 1px 0 rgba(255,255,255,0.08)`
                  : `0 0 30px ${colors.glow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
                position: "relative",
              }}>
                {/* Card number */}
                <div style={{
                  position: "absolute", top: 20, left: 28,
                  fontFamily, fontWeight: 800, fontSize: 18,
                  color: card.variant === "winner" ? "rgba(255,215,0,0.5)" : "rgba(150,160,200,0.4)",
                  letterSpacing: "0.12em",
                }}>
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Emoji */}
                <div style={{ fontSize: 58, lineHeight: 1, textAlign: "center", marginTop: 14 }}>{card.emoji}</div>

                {/* Title */}
                <div style={{
                  fontFamily, fontWeight: 800, fontSize: 34,
                  color: card.variant === "winner" ? "#ffd700" : card.variant === "warning" ? "#fca5a5" : "rgba(210,222,255,0.92)",
                  textAlign: "center", lineHeight: 1.2, letterSpacing: "0.01em",
                }}>
                  {card.title}
                </div>

                {/* Description */}
                <div style={{
                  fontFamily, fontWeight: 600, fontSize: 24,
                  color: card.variant === "winner" ? "rgba(255,235,150,0.8)" : card.variant === "warning" ? "rgba(252,165,165,0.7)" : "rgba(165,180,220,0.75)",
                  textAlign: "center", lineHeight: 1.4,
                }}>
                  {card.description}
                </div>

                {/* Tag */}
                <div style={{
                  alignSelf: "center",
                  background: card.variant === "winner" ? "rgba(255,215,0,0.15)" : card.variant === "warning" ? "rgba(239,68,68,0.15)" : "rgba(100,120,180,0.15)",
                  border: `1.5px solid ${colors.tag}60`,
                  borderRadius: 30, padding: "8px 22px",
                  fontFamily, fontWeight: 700, fontSize: 20,
                  color: colors.tag,
                  letterSpacing: "0.06em",
                }}>
                  {card.tag}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
