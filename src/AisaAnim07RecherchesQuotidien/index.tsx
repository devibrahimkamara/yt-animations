import React from "react";
import {
  Easing,
  Sequence,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../aisa/Stage";
import {
  ACCENT,
  GLASS_BG,
  GLASS_BORDER,
  GLASS_CARD,
  INK,
  MUTED,
  SOFT,
  STAR_GOLD,
} from "../aisa/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["500", "600", "700", "800"],
  subsets: ["latin"],
});

// Anim 7 — « Recherches du quotidien » (240 frames / 8 s @ 30 fps)
// Barre 6–28 · blocs A=24, B=96, C=168 (72 f chacun) · légende 196–216 · maintien 216–240

const ORANGE = "#FB923C";
const VIOLET = "#A78BFA";
const DOT_OFF = "rgba(120,150,255,0.25)";

export const aisaAnim07Schema = z.object({
  queries: z
    .array(
      z.object({
        text: z.string(),
        icon: z.enum(["food", "scissors", "cap"]),
        color: z.string(),
        city: z.string(),
        result: z.string(),
      }),
    )
    .default([
      { text: "Meilleur restaurant près de moi", icon: "food", color: ORANGE, city: "Abidjan", result: "Chez Tantie Marie" },
      { text: "Bon coiffeur à Paris", icon: "scissors", color: VIOLET, city: "Paris", result: "Salon Éclat" },
      { text: "Meilleures universités au Canada", icon: "cap", color: ACCENT, city: "Montréal", result: "Université Horizon" },
    ]),
  legendPre: z.string().default("Tout se passe dans "),
  legendAccent: z.string().default("l'IA"),
});
export type AisaAnim07Props = z.infer<typeof aisaAnim07Schema>;

const STARTS = [24, 96, 168];
const BLOCK = 72;

const clamp01 = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const cubicOut = Easing.out(Easing.cubic);

// ── Géométrie ──
const BAR_X = 180;
const BAR_W = 1560;
const BAR_Y = 365;
const BAR_H = 150;

// ── Icônes SVG maison ──
const Icon: React.FC<{ kind: "food" | "scissors" | "cap"; size: number; color: string }> = ({
  kind,
  size,
  color,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
    {kind === "food" && (
      <>
        <path d="M5 3v6c0 1.7 1.3 3 3 3s3-1.3 3-3V3" />
        <path d="M8 3v18" />
        <path d="M17 21V3c-2.2 1.3-3 4-3 7s1 4 3 4" />
      </>
    )}
    {kind === "scissors" && (
      <>
        <circle cx={6} cy={6} r={3} />
        <circle cx={6} cy={18} r={3} />
        <path d="M8.2 7.8L21 18" />
        <path d="M8.2 16.2L21 6" />
      </>
    )}
    {kind === "cap" && (
      <>
        <path d="M2 9l10-5 10 5-10 5z" />
        <path d="M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5" />
        <path d="M22 9v6" />
      </>
    )}
  </svg>
);

const Sparkle: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M12 2 C12.8 7.5 16.5 11.2 22 12 C16.5 12.8 12.8 16.5 12 22 C11.2 16.5 7.5 12.8 2 12 C7.5 11.2 11.2 7.5 12 2Z"
      fill={color}
    />
  </svg>
);

const Pin: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
    <circle cx={12} cy={10} r={2.6} />
  </svg>
);

const Star: React.FC<{ size: number; fill: number }> = ({ size, fill }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ transform: `scale(${1 + 0.35 * Math.sin(fill * Math.PI)})` }}>
    <polygon
      points="12,2 14.9,8.6 22,9.3 16.6,14 18.2,21 12,17.3 5.8,21 7.4,14 2,9.3 9.1,8.6"
      fill={interpolateColors(fill, [0, 1], ["rgba(120,150,255,0.18)", STAR_GOLD])}
      stroke={interpolateColors(fill, [0, 1], ["rgba(120,150,255,0.35)", STAR_GOLD])}
      strokeWidth={1}
      strokeLinejoin="round"
    />
  </svg>
);

type Query = AisaAnim07Props["queries"][number];

// Bloc paramétré : une Sequence par requête (frame locale t)
const Block: React.FC<{ q: Query; last: boolean }> = ({ q, last }) => {
  const t = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exit = last ? 0 : interpolate(t, [64, 72], [0, 1], { ...clamp01 });
  const exitOpacity = 1 - exit;
  const exitY = -16 * exit;

  // pastille icône
  const pSp = spring({ frame: t, fps, config: { damping: 11, stiffness: 120 } });
  const pScale = interpolate(pSp, [0, 1], [0.6, 1]);
  const pOpacity = interpolate(t, [0, 8], [0, 1], clamp01);

  // ville
  const cT = interpolate(t, [8, 20], [0, 1], { ...clamp01, easing: cubicOut });

  // texte
  const n = q.text.length;
  const typed = Math.floor(interpolate(t, [8, 36], [0, n], clamp01));
  const erase = last ? 0 : interpolate(t, [66, 72], [0, 1], clamp01);
  const shown = Math.floor(typed * (1 - erase));
  const cursorOn = Math.floor(t / 8) % 2 === 0;

  // carte
  const kSp = spring({ frame: t - 44, fps, config: { damping: 14, stiffness: 120 } });
  const kY = interpolate(kSp, [0, 1], [30, 0]);
  const kOpacity = interpolate(t, [44, 54], [0, 1], clamp01);
  const float = last && t >= 60 ? Math.sin((t - 60) * 0.18) * 6 : 0;

  return (
    <>
      {/* Pastille icône */}
      <div
        style={{
          position: "absolute",
          left: 960 - 85,
          top: 140,
          width: 170,
          height: 170,
          borderRadius: 85,
          boxSizing: "border-box",
          background: `${q.color}2E`,
          border: `4px solid ${q.color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 50px ${q.color}44`,
          opacity: pOpacity * exitOpacity,
          transform: `translateY(${exitY}px) scale(${pScale})`,
        }}
      >
        <Icon kind={q.icon} size={96} color={q.color} />
      </div>

      {/* Texte de la requête (dans la barre fixe) */}
      <div
        style={{
          position: "absolute",
          left: BAR_X + 130,
          top: BAR_Y,
          height: BAR_H,
          display: "flex",
          alignItems: "center",
          fontSize: 56,
          fontWeight: 600,
          color: INK,
          whiteSpace: "pre",
          letterSpacing: -0.5,
        }}
      >
        {q.text.slice(0, shown)}
        <span style={{ opacity: cursorOn ? 1 : 0, color: q.color, marginLeft: 2, fontWeight: 500 }}>|</span>
      </div>

      {/* Étiquette ville */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 560,
          display: "flex",
          justifyContent: "center",
          opacity: cT * exitOpacity,
          transform: `translateY(${(1 - cT) * 12 + exitY}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "12px 34px 12px 24px",
            borderRadius: 50,
            background: GLASS_CARD,
            border: `2px solid ${GLASS_BORDER}`,
            fontSize: 44,
            fontWeight: 700,
            color: SOFT,
          }}
        >
          <Pin size={44} color={q.color} />
          {q.city}
        </div>
      </div>

      {/* Carte de résultat */}
      <div
        style={{
          position: "absolute",
          left: 960 - 560,
          top: 650,
          width: 1120,
          height: 150,
          boxSizing: "border-box",
          borderRadius: 40,
          background: GLASS_CARD,
          border: `3px solid ${q.color}`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${q.color}33`,
          display: "flex",
          alignItems: "center",
          padding: "0 40px 0 30px",
          gap: 26,
          opacity: kOpacity * exitOpacity,
          transform: `translateY(${kY + exitY + float}px)`,
        }}
      >
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: 42,
            background: q.color,
            color: "#fff",
            fontSize: 50,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          1
        </div>
        <div style={{ flex: 1, fontSize: 54, fontWeight: 800, color: INK, whiteSpace: "nowrap", letterSpacing: -0.6 }}>
          {q.result}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={54} fill={interpolate(t, [48 + i * 3, 52 + i * 3], [0, 1], clamp01)} />
          ))}
        </div>
      </div>
    </>
  );
};

export const AisaAnim07RecherchesQuotidien: React.FC<AisaAnim07Props> = ({
  queries,
  legendPre,
  legendAccent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 10], [0, 1], clamp01);

  const barSp = spring({ frame: frame - 6, fps, config: { damping: 15, stiffness: 100 } });
  const barScale = interpolate(barSp, [0, 1], [0.92, 1]);
  const barOpacity = interpolate(frame, [6, 20], [0, 1], clamp01);

  // Accent courant, interpolé pendant les 8 f de transition entre blocs
  const [a, b, c] = queries.map((q) => q.color);
  const accent = interpolateColors(frame, [0, 88, 96, 160, 168], [a, a, b, b, c]);

  // Pulse du bouton d'envoi par bloc (t 36–46)
  let sendScale = 1;
  STARTS.forEach((s) => {
    const t = frame - s;
    if (t >= 36 && t <= 46) sendScale = 1 + 0.12 * Math.sin(((t - 36) / 10) * Math.PI);
  });

  // Points de progression
  const dotsIn = interpolate(frame, [24, 32], [0, 1], clamp01);
  const legendIn = interpolate(frame, [196, 216], [0, 1], { ...clamp01, easing: cubicOut });

  return (
    <Stage outFrames={0}>
      <div style={{ position: "absolute", inset: 0, fontFamily, opacity: bgOpacity }}>
        {/* Barre de chat fixe */}
        <div
          style={{
            position: "absolute",
            left: BAR_X,
            top: BAR_Y,
            width: BAR_W,
            height: BAR_H,
            boxSizing: "border-box",
            borderRadius: BAR_H / 2,
            background: GLASS_BG,
            border: `3px solid ${accent}`,
            boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
            opacity: barOpacity,
            transform: `scale(${barScale})`,
          }}
        >
          <div style={{ position: "absolute", left: 44, top: BAR_H / 2 - 28 }}>
            <Sparkle size={56} color={ACCENT} />
          </div>
          <div
            style={{
              position: "absolute",
              right: 24,
              top: (BAR_H - 6 - 100) / 2,
              width: 100,
              height: 100,
              borderRadius: 50,
              background: ACCENT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${sendScale})`,
              boxShadow: sendScale > 1.01 ? "0 0 40px rgba(48,96,255,0.7)" : "none",
            }}
          >
            <svg width={52} height={52} viewBox="0 0 24 24" fill="none">
              <path d="M12 19V5M5.5 11.5L12 5l6.5 6.5" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Blocs A, B, C */}
        {queries.map((q, i) => (
          <Sequence key={i} from={STARTS[i]} durationInFrames={BLOCK + (i === 2 ? 60 : 0)} layout="none">
            <Block q={q} last={i === queries.length - 1} />
          </Sequence>
        ))}

        {/* Points de progression */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 838,
            display: "flex",
            justifyContent: "center",
            gap: 26,
            opacity: dotsIn,
          }}
        >
          {queries.map((q, i) => {
            const s = STARTS[i];
            const on = interpolate(frame, [s, s + 12], [0, 1], clamp01);
            const off = i < queries.length - 1 ? interpolate(frame, [s + BLOCK, s + BLOCK + 8], [0, 1], clamp01) : 0;
            const f = on * (1 - off);
            const pop = frame >= s && frame <= s + 12 ? 1 + 0.4 * Math.sin(((frame - s) / 12) * Math.PI) : 1;
            return (
              <div
                key={i}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  background: interpolateColors(f, [0, 1], [DOT_OFF, q.color]),
                  transform: `scale(${pop})`,
                }}
              />
            );
          })}
        </div>

        {/* Légende */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 915,
            textAlign: "center",
            fontSize: 68,
            fontWeight: 800,
            color: INK,
            letterSpacing: -1,
            opacity: legendIn,
            transform: `translateY(${(1 - legendIn) * 20}px)`,
          }}
        >
          {legendPre}
          <span style={{ color: ACCENT }}>{legendAccent}</span>
        </div>
      </div>
    </Stage>
  );
};
