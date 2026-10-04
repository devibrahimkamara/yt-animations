import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../aisa/Stage";
import {
  ACCENT,
  GLASS_BORDER,
  GLASS_BG,
  GLASS_CARD,
  INK,
  MONEY_GREEN,
  MUTED,
  SOFT,
  STAR_GOLD,
  ATMOS_ERROR,
  AD_YELLOW,
} from "../aisa/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});

// Anim 3 — « Conversation avec une IA » (240 frames / 8 s @ 30 fps)

export const aisaAnim03Schema = z.object({
  question: z.string().default("Où manger un bon garba à Abidjan ?"),
  intro: z.string().default("Voici 3 adresses très bien notées :"),
  restaurants: z
    .array(z.object({ name: z.string(), stars: z.number() }))
    .default([
      { name: "Chez Tantie Marie", stars: 5 },
      { name: "Maquis Le Palmier", stars: 4 },
      { name: "Garba Express", stars: 4 },
    ]),
  caption: z.string().default("L'IA recommande."),
  captionAccent: z.string().default("Tu es dedans ?"),
  badge: z.string().default("Recommandé"),
});
export type AisaAnim03Props = z.infer<typeof aisaAnim03Schema>;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Fenêtre
const WIN_W = 1500;
const WIN_H = 770;
const WIN_X = (1920 - WIN_W) / 2;
const WIN_Y = 56;
const BAR_H = 72;

// Réponse
const RESP_W = 1380;
const CARD_H = 112;
const CARD_GAP = 14;
const RESP_PAD = 24;
const INTRO_H = 56;
const RESP_H = RESP_PAD * 2 + INTRO_H + 16 + CARD_H * 3 + CARD_GAP * 2; // 3 cartes

const Star: React.FC<{ fill: number; size: number }> = ({ fill, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block" }}>
    <path
      d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z"
      fill="rgba(255,255,255,0.14)"
      stroke="rgba(255,255,255,0.25)"
      strokeWidth={0.8}
      strokeLinejoin="round"
    />
    <g opacity={fill} transform={`translate(12 12) scale(${0.6 + fill * 0.4}) translate(-12 -12)`}>
      <path
        d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z"
        fill={STAR_GOLD}
        stroke={STAR_GOLD}
        strokeWidth={1}
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

export const AisaAnim03ConversationRestaurants: React.FC<AisaAnim03Props> = ({
  question,
  intro,
  restaurants,
  caption,
  captionAccent,
  badge,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 10], [0, 1], clamp);

  // Fenêtre (8–36)
  const winSp = spring({ frame: frame - 8, fps, config: { damping: 15, stiffness: 100 } });
  const winScale = interpolate(winSp, [0, 1], [0.92, 1]);
  const winOpacity = interpolate(frame, [8, 20], [0, 1], clamp);

  // Bulle utilisateur (40–52) + machine à écrire (52–100)
  const userIn = interpolate(frame, [40, 52], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const typed = Math.floor(interpolate(frame, [52, 100], [0, question.length], clamp));
  const cursorOn = frame >= 52 && frame < 104 && Math.floor(frame / 4) % 2 === 0;

  // Réflexion (112–150)
  const thinkIn = interpolate(frame, [112, 124], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const thinkOut = interpolate(frame, [144, 150], [1, 0], clamp);
  const thinkOp = thinkIn * thinkOut;

  // Réponse (150–172)
  const respP = interpolate(frame, [150, 172], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const respScale = interpolate(respP, [0, 1], [0.95, 1]);

  // Surbrillance carte 1 (196–214)
  const hiSp = spring({ frame: frame - 196, fps, config: { damping: 14, stiffness: 120 } });
  const dim = interpolate(frame, [196, 214], [1, 0.55], clamp);
  const badgeSp = spring({ frame: frame - 204, fps, config: { damping: 10, stiffness: 130 } });

  // Légende (212–228)
  const capP = interpolate(frame, [212, 228], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const breath = interpolate(frame, [228, 240], [0, 1], clamp);
  const glowPulse = 0.45 + Math.sin((frame - 228) * 0.35) * 0.12 * breath;

  const respTop = BAR_H + 30 + 112 + 24; // sous la bulle utilisateur

  return (
    <Stage outFrames={0}>
      <div style={{ position: "absolute", inset: 0, opacity: bgOpacity, fontFamily }}>
        {/* Fenêtre de chat */}
        <div
          style={{
            position: "absolute",
            left: WIN_X,
            top: WIN_Y,
            width: WIN_W,
            height: WIN_H,
            borderRadius: 32,
            background: GLASS_BG,
            border: `2px solid ${GLASS_BORDER}`,
            boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
            opacity: winOpacity,
            transform: `scale(${winScale})`,
            overflow: "visible",
          }}
        >
          {/* Barre du haut */}
          <div
            style={{
              height: BAR_H,
              borderBottom: `2px solid ${GLASS_BORDER}`,
              display: "flex",
              alignItems: "center",
              paddingLeft: 30,
              position: "relative",
            }}
          >
            <div style={{ display: "flex", gap: 14 }}>
              {[ATMOS_ERROR, AD_YELLOW, MONEY_GREEN].map((c) => (
                <div key={c} style={{ width: 20, height: 20, borderRadius: "50%", background: c }} />
              ))}
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                textAlign: "center",
                fontSize: 32,
                fontWeight: 600,
                color: MUTED,
              }}
            >
              Assistant IA
            </div>
          </div>

          {/* Bulle utilisateur */}
          <div
            style={{
              position: "absolute",
              right: 40,
              top: BAR_H + 30,
              background: ACCENT,
              color: INK,
              fontSize: 48,
              fontWeight: 700,
              lineHeight: 1.2,
              padding: "24px 36px",
              borderRadius: "32px 32px 8px 32px",
              opacity: userIn,
              transform: `translateX(${(1 - userIn) * 60}px)`,
              whiteSpace: "nowrap",
            }}
          >
            <span>{question.slice(0, typed)}</span>
            <span style={{ display: "inline-block", width: 0, overflow: "visible", opacity: cursorOn ? 1 : 0 }}>|</span>
            <span style={{ opacity: 0 }}>{question.slice(typed)}</span>
          </div>

          {/* Réflexion */}
          <div
            style={{
              position: "absolute",
              left: 40,
              top: respTop,
              background: GLASS_CARD,
              border: `2px solid ${GLASS_BORDER}`,
              borderRadius: "32px 32px 32px 8px",
              padding: "34px 44px",
              display: "flex",
              gap: 18,
              opacity: thinkOp,
              transform: `translateY(${(1 - thinkIn) * 16}px)`,
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: SOFT,
                  transform: `translateY(${Math.sin(frame * 0.35 + i * 0.9) * 10}px)`,
                }}
              />
            ))}
          </div>

          {/* Réponse */}
          <div
            style={{
              position: "absolute",
              left: 40,
              top: respTop,
              width: RESP_W,
              height: RESP_H,
              background: GLASS_CARD,
              border: `2px solid ${GLASS_BORDER}`,
              borderRadius: "32px 32px 32px 8px",
              opacity: respP,
              transform: `scale(${respScale})`,
              transformOrigin: "left top",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: RESP_PAD + 8,
                top: RESP_PAD,
                height: INTRO_H,
                fontSize: 40,
                fontWeight: 600,
                color: INK,
                lineHeight: `${INTRO_H}px`,
                whiteSpace: "nowrap",
              }}
            >
              {intro}
            </div>

            {restaurants.map((r, i) => {
              const cardTop = RESP_PAD + INTRO_H + 16 + i * (CARD_H + CARD_GAP);
              const sp = spring({
                frame: frame - (164 + i * 12),
                fps,
                config: { damping: 14, stiffness: 110 },
              });
              const op = interpolate(frame, [164 + i * 12, 176 + i * 12], [0, 1], clamp);
              const isFirst = i === 0;
              const hi = isFirst ? hiSp : 0;
              const scale = isFirst ? 1 + 0.03 * hiSp : 1;
              const cardOpacity = op * (isFirst ? 1 : dim);
              return (
                <div
                  key={r.name}
                  style={{
                    position: "absolute",
                    left: RESP_PAD,
                    top: cardTop,
                    width: RESP_W - RESP_PAD * 2,
                    height: CARD_H,
                    borderRadius: 22,
                    background: "rgba(48,60,104,0.9)",
                    border: isFirst && hi > 0.02 ? `3px solid ${MONEY_GREEN}` : "3px solid transparent",
                    boxShadow: isFirst
                      ? `0 0 ${40 * hi}px rgba(34,197,94,${glowPulse * hi})`
                      : "none",
                    opacity: cardOpacity,
                    transform: `translateY(${(1 - sp) * 30}px) scale(${scale})`,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 28px",
                    gap: 24,
                    zIndex: isFirst ? 2 : 1,
                  }}
                >
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      background: isFirst && hi > 0.5 ? MONEY_GREEN : ACCENT,
                      color: INK,
                      fontSize: 40,
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div style={{ fontSize: 46, fontWeight: 700, color: INK, flex: 1, whiteSpace: "nowrap" }}>
                    {r.name}
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[0, 1, 2, 3, 4].map((s) => {
                      const start = 164 + i * 12 + 8 + s * 6;
                      const f = s < r.stars ? interpolate(frame, [start, start + 6], [0, 1], clamp) : 0;
                      return <Star key={s} fill={f} size={44} />;
                    })}
                  </div>

                  {isFirst && (
                    <div
                      style={{
                        position: "absolute",
                        right: -22,
                        top: -30,
                        background: MONEY_GREEN,
                        color: INK,
                        fontSize: 34,
                        fontWeight: 800,
                        padding: "10px 24px 10px 18px",
                        borderRadius: 30,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        transform: `scale(${interpolate(badgeSp, [0, 1], [0.6, 1])})`,
                        opacity: Math.min(1, badgeSp * 2),
                        boxShadow: "0 10px 30px rgba(34,197,94,0.45)",
                      }}
                    >
                      <svg width={32} height={32} viewBox="0 0 24 24">
                        <path
                          d="M5 12.5l4.5 4.5L19 7.5"
                          fill="none"
                          stroke={INK}
                          strokeWidth={3.6}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {badge}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Légende */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1920,
            height: 1080,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: 70,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: INK,
              opacity: capP,
              transform: `translateY(${(1 - capP) * 20}px)`,
              whiteSpace: "nowrap",
            }}
          >
            {caption} <span style={{ color: MONEY_GREEN }}>{captionAccent}</span>
          </div>
        </div>
      </div>
    </Stage>
  );
};
