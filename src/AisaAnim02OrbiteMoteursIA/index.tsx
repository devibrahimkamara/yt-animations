import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../aisa/Stage";
import {
  ACCENT,
  ACCENT_LIGHT,
  CHATGPT_TEAL,
  CLAUDE_TERRACOTTA,
  GEMINI_BLUE,
  GEMINI_PURPLE,
  INK,
  MONEY_GREEN,
  PERPLEXITY_CYAN,
} from "../aisa/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});

// Anim 2 — « Orbite des moteurs IA » (150 frames / 5 s @ 30 fps)

export const aisaAnim02Schema = z.object({
  centre1: z.string().default("Ton"),
  centre2: z.string().default("entreprise"),
  conclusion: z.string().default("Visible dans toutes les IA"),
  motMisEnValeur: z.string().default("toutes"),
});
export type AisaAnim02Props = z.infer<typeof aisaAnim02Schema>;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const CX = 960;
const CY = 520; // orbite légèrement remontée pour laisser la place au texte du bas
const RX = 520;
const RY = 290;
const CORE_R = 160;
const PILL_W = 420;
const PILL_H = 112;

type Engine = {
  name: string;
  color: string;
  bg: string;
  angle: number; // degrés
  enter: number;
  connDelay: number;
};

const ENGINES: Engine[] = [
  { name: "ChatGPT", color: CHATGPT_TEAL, bg: CHATGPT_TEAL, angle: 200, enter: 28, connDelay: 8 },
  { name: "Claude", color: CLAUDE_TERRACOTTA, bg: CLAUDE_TERRACOTTA, angle: 340, enter: 48, connDelay: 8 },
  { name: "Perplexity", color: PERPLEXITY_CYAN, bg: PERPLEXITY_CYAN, angle: 160, enter: 68, connDelay: 8 },
  {
    name: "Gemini",
    color: GEMINI_BLUE,
    bg: `linear-gradient(90deg, ${GEMINI_BLUE}, ${GEMINI_PURPLE})`,
    angle: 20,
    enter: 88,
    connDelay: 0, // écart au brief : la ligne de Gemini doit exister avant l'impulsion collective
  },
];

const ENTER_DUR = 24;
const SYNC_START = 116;
const SYNC_DUR = 14;
const ARRIVAL = SYNC_START + SYNC_DUR; // 130

export const AisaAnim02OrbiteMoteursIA: React.FC<AisaAnim02Props> = ({
  centre1,
  centre2,
  conclusion,
  motMisEnValeur,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 10], [0, 1], clamp);

  const coreSpring = spring({ frame: frame - 6, fps, config: { damping: 13, stiffness: 110 } });
  const ringsIn = interpolate(frame, [20, 32], [0, 1], clamp);
  const ringPulse = (phase: number) => 1 + Math.sin(((frame + phase) / 60) * Math.PI * 2) * 0.04;

  // Positions / états des moteurs
  const engines = ENGINES.map((e) => {
    const sp = spring({
      frame: frame - e.enter,
      fps,
      config: { damping: 14, stiffness: 80 },
      durationInFrames: 40,
    });
    const radiusMul = interpolate(sp, [0, 1], [1.9, 1]);
    const opacity = interpolate(frame, [e.enter, e.enter + ENTER_DUR], [0, 1], clamp);
    const scale = interpolate(sp, [0, 1], [0.7, 1]);
    const ang = (e.angle * Math.PI) / 180 + frame * 0.0045;
    const x = CX + RX * radiusMul * Math.cos(ang);
    const y = CY + RY * radiusMul * Math.sin(ang);
    const connStart = e.enter + ENTER_DUR + e.connDelay;
    const draw = interpolate(frame, [connStart, connStart + 12], [0, 1], clamp);
    // Point de départ (pastille) → bord du cercle central
    const dx = CX - x;
    const dy = CY - y;
    const dist = Math.hypot(dx, dy) || 1;
    const ex = CX - (dx / dist) * (CORE_R + 4);
    const ey = CY - (dy / dist) * (CORE_R + 4);
    return { ...e, x, y, opacity, scale, draw, ex, ey, connStart };
  });

  // Impulsions : régulières (toutes les 36 frames) + impulsion collective
  type Pulse = { engine: number; start: number; dur: number };
  const pulses: Pulse[] = [];
  engines.forEach((e, i) => {
    for (let k = 0; ; k++) {
      const s = e.connStart + 12 + k * 36;
      if (s > 150) break;
      if (s > SYNC_START - 22 && s < SYNC_START + 24) continue; // laisse la place à la collective
      pulses.push({ engine: i, start: s, dur: 18 });
    }
    pulses.push({ engine: i, start: SYNC_START, dur: SYNC_DUR });
  });

  // Flash central : 6 frames à chaque arrivée
  let flash = 0;
  pulses.forEach((p) => {
    const a = p.start + p.dur;
    const t = frame - a;
    if (t >= 0 && t < 6) flash = Math.max(flash, 1 - Math.abs(t - 3) / 3);
  });
  const coreScale = interpolate(coreSpring, [0, 1], [0, 1]) * (1 + flash * 0.06);

  // Passage au vert (frame 130)
  const green = interpolate(frame, [ARRIVAL, ARRIVAL + 8], [0, 1], clamp);
  const checkSpring = spring({ frame: frame - ARRIVAL, fps, config: { damping: 11, stiffness: 140 } });

  const textP = interpolate(frame, [118, 136], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  const borderColor = green > 0.5 ? MONEY_GREEN : ACCENT;
  const glowRgb = green > 0.5 ? "34,197,94" : "48,96,255";
  const glowAlpha = 0.45 + flash * 0.25;

  const words = conclusion.split(" ");

  return (
    <Stage outFrames={0}>
      <div style={{ position: "absolute", inset: 0, opacity: bgOpacity, fontFamily }}>
        {/* Anneaux */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {[205, 255].map((r, i) => (
            <circle
              key={r}
              cx={CX}
              cy={CY}
              r={r * ringPulse(i * 20)}
              fill="none"
              stroke={green > 0.5 ? MONEY_GREEN : ACCENT_LIGHT}
              strokeWidth={3}
              opacity={0.18 * ringsIn}
            />
          ))}

          {/* Lignes de connexion */}
          {engines.map((e) => {
            const x2 = e.x + (e.ex - e.x) * e.draw;
            const y2 = e.y + (e.ey - e.y) * e.draw;
            return (
              <line
                key={e.name}
                x1={e.x}
                y1={e.y}
                x2={x2}
                y2={y2}
                stroke={e.color}
                strokeOpacity={0.7 * e.opacity}
                strokeWidth={5}
                strokeDasharray="10 8"
                strokeDashoffset={-frame * 1.5}
                strokeLinecap="round"
              />
            );
          })}

          {/* Impulsions */}
          {pulses.map((p, i) => {
            const t = interpolate(frame, [p.start, p.start + p.dur], [0, 1], {
              ...clamp,
              easing: Easing.inOut(Easing.quad),
            });
            if (frame < p.start || frame > p.start + p.dur) return null;
            const e = engines[p.engine];
            const px = e.x + (e.ex - e.x) * t;
            const py = e.y + (e.ey - e.y) * t;
            return (
              <g key={i}>
                <circle cx={px} cy={py} r={22} fill={e.color} opacity={0.35} />
                <circle cx={px} cy={py} r={11} fill={INK} />
                <circle cx={px} cy={py} r={7} fill={e.color} />
              </g>
            );
          })}
        </svg>

        {/* Cercle central */}
        <div
          style={{
            position: "absolute",
            left: CX - CORE_R,
            top: CY - CORE_R,
            width: CORE_R * 2,
            height: CORE_R * 2,
            borderRadius: "50%",
            background: "#1E2A52",
            border: `5px solid ${borderColor}`,
            boxShadow: `0 0 70px rgba(${glowRgb},${glowAlpha})`,
            transform: `scale(${coreScale})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: INK,
            fontSize: 50,
            fontWeight: 800,
            lineHeight: 1.12,
          }}
        >
          <div>{centre1}</div>
          <div>{centre2}</div>
        </div>

        {/* Badge check */}
        <div
          style={{
            position: "absolute",
            left: CX + CORE_R * 0.707 - 36,
            top: CY - CORE_R * 0.707 - 36,
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: MONEY_GREEN,
            border: "4px solid #1E2A52",
            transform: `scale(${checkSpring})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 30px rgba(34,197,94,0.6)`,
          }}
        >
          <svg width={40} height={40} viewBox="0 0 24 24">
            <path
              d="M5 12.5l4.5 4.5L19 7.5"
              fill="none"
              stroke={INK}
              strokeWidth={3.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Pastilles */}
        {engines.map((e) => (
          <div
            key={e.name}
            style={{
              position: "absolute",
              left: e.x - PILL_W / 2,
              top: e.y - PILL_H / 2,
              width: PILL_W,
              height: PILL_H,
              borderRadius: 56,
              background: e.bg,
              opacity: e.opacity,
              transform: `scale(${e.scale})`,
              boxShadow: "0 18px 40px rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              color: INK,
              fontSize: 52,
              fontWeight: 800,
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: INK,
                boxShadow: "0 0 18px rgba(255,255,255,0.9)",
              }}
            />
            {e.name}
          </div>
        ))}

        {/* Conclusion */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: 1080,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: 90,
          }}
        >
          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              color: INK,
              opacity: textP,
              transform: `translateY(${(1 - textP) * 20}px)`,
              whiteSpace: "nowrap",
            }}
          >
            {words.map((w, i) => (
              <span key={i} style={{ color: w === motMisEnValeur ? MONEY_GREEN : INK }}>
                {w}
                {i < words.length - 1 ? " " : ""}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Stage>
  );
};
