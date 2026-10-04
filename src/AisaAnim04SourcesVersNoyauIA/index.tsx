import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../aisa/Stage";
import {
  ACCENT,
  ACCENT_LIGHT,
  GLASS_BORDER,
  INK,
  MONEY_GREEN,
  STAR_GOLD,
  mulberry32,
} from "../aisa/theme";
import { quadBezier } from "../aisa/utils";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});

// Anim 4 — « D'où l'IA tire ses réponses » (210 frames / 7 s @ 30 fps)

export const aisaAnim04Schema = z.object({
  nomEntreprise: z.string().default("Ton entreprise"),
  legende: z.string().default("L'IA puise dans"),
  legendeAccent: z.string().default("Internet"),
  badge: z.string().default("Recommandation"),
});
export type AisaAnim04Props = z.infer<typeof aisaAnim04Schema>;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const SRC_W = 440;
const SRC_H = 120;
const SRC_CX = 300; // bord gauche = 80 px
const CORE_X = 960;
const CORE_Y = 540;
const CORE_R = 170;
const OUT_W = 520;
const OUT_H = 280;
const OUT_CX = 1560;

// ── Icônes maison ──
const IconGlobe: React.FC<{ c: string }> = ({ c }) => (
  <svg width={68} height={68} viewBox="0 0 48 48" fill="none" stroke={c} strokeWidth={3} strokeLinecap="round">
    <circle cx={24} cy={24} r={18} />
    <ellipse cx={24} cy={24} rx={8} ry={18} />
    <path d="M6 24h36M9 14h30M9 34h30" />
  </svg>
);
const IconStar: React.FC<{ c: string }> = ({ c }) => (
  <svg width={68} height={68} viewBox="0 0 24 24">
    <path
      d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z"
      fill={c}
      stroke={c}
      strokeWidth={1}
      strokeLinejoin="round"
    />
  </svg>
);
const IconBook: React.FC<{ c: string }> = ({ c }) => (
  <svg width={68} height={68} viewBox="0 0 48 48" fill="none" stroke={c} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <path d="M24 12c-4-3-10-4-17-4v28c7 0 13 1 17 4 4-3 10-4 17-4V8c-7 0-13 1-17 4z" />
    <path d="M24 12v28" />
  </svg>
);
const IconDoc: React.FC<{ c: string }> = ({ c }) => (
  <svg width={68} height={68} viewBox="0 0 48 48" fill="none" stroke={c} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5h17l9 9v29H12z" />
    <path d="M29 5v9h9M18 24h14M18 31h14M18 38h8" />
  </svg>
);

type Source = { label: string; color: string; y: number; Icon: React.FC<{ c: string }>; ctrl: number };
const SOURCES: Source[] = [
  { label: "Sites web", color: ACCENT_LIGHT, y: 270, Icon: IconGlobe, ctrl: -120 },
  { label: "Avis Google", color: "#FACC15", y: 450, Icon: IconStar, ctrl: 120 },
  { label: "Annuaires", color: "#A78BFA", y: 630, Icon: IconBook, ctrl: -120 },
  { label: "Articles", color: "#FB923C", y: 810, Icon: IconDoc, ctrl: 120 },
];

const EMIT_START = 66;
const EMIT_STEP = 8;
const EMIT_LAST = 150; // plus d'émission à partir de 150
const FLIGHT = 36;

const StarPath = "M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z";

// Réseau de neurones : 7 points relatifs au centre du noyau
const NODES = [
  { x: 0, y: 0 },
  { x: -70, y: -45 },
  { x: 70, y: -45 },
  { x: -80, y: 35 },
  { x: 80, y: 35 },
  { x: -20, y: 85 },
  { x: 25, y: -90 },
];
const EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 6], [2, 6], [1, 3], [2, 4], [3, 5], [4, 5],
];

export const AisaAnim04SourcesVersNoyauIA: React.FC<AisaAnim04Props> = ({
  nomEntreprise,
  legende,
  legendeAccent,
  badge,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 10], [0, 1], clamp);

  // Sources (8–56) décalées de 10 frames
  const srcState = SOURCES.map((_, i) => {
    const sp = spring({ frame: frame - (8 + i * 10), fps, config: { damping: 14, stiffness: 100 } });
    return {
      x: interpolate(sp, [0, 1], [-300, 0]),
      op: interpolate(frame, [8 + i * 10, 20 + i * 10], [0, 1], clamp),
    };
  });

  // Noyau (40–66)
  const coreSp = spring({ frame: frame - 40, fps, config: { damping: 12, stiffness: 90 } });
  const accumulate = interpolate(frame, [66, 150], [0, 1], clamp);
  const glowI = 0.6 + 0.4 * accumulate;
  const breath = interpolate(frame, [184, 190], [0, 1], clamp) * Math.sin(frame * 0.12) * 0.012;

  // Particules
  const particles: {
    s: number;
    k: number;
    start: number;
    jy: number;
  }[] = [];
  SOURCES.forEach((_, s) => {
    for (let k = 0; EMIT_START + k * EMIT_STEP < EMIT_LAST; k++) {
      const rnd = mulberry32(100 + s * 31 + k);
      particles.push({ s, k, start: EMIT_START + k * EMIT_STEP, jy: (rnd() - 0.5) * 36 });
    }
  });

  // Micro pulse du noyau à l'arrivée (5 frames)
  let pulse = 0;
  particles.forEach((p) => {
    const t = frame - (p.start + FLIGHT);
    if (t >= 0 && t < 5) pulse = Math.max(pulse, 1 - Math.abs(t - 2.5) / 2.5);
  });
  const coreScale =
    interpolate(coreSp, [0, 1], [0, 1]) * (1 + accumulate * 0.05 + pulse * 0.04 + breath);

  // Légende (100–118)
  const legP = interpolate(frame, [100, 118], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  // Trait de lumière noyau → carte (138–152) + impulsion (150–166)
  const lineX1 = CORE_X + CORE_R * coreScale;
  const lineX2 = OUT_CX - OUT_W / 2 - 6;
  const lineLen = lineX2 - lineX1;
  const lineP = interpolate(frame, [138, 152], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const bigT = interpolate(frame, [150, 166], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const showBig = frame >= 150 && frame <= 168;

  // Carte de sortie (154–184)
  const outSp = spring({ frame: frame - 154, fps, config: { damping: 13, stiffness: 95 } });
  const outScale = interpolate(outSp, [0, 1], [0.3, 1]);
  const outX = interpolate(outSp, [0, 1], [-250, 0]);
  const outOp = interpolate(frame, [154, 164], [0, 1], clamp);
  const float = interpolate(frame, [184, 194], [0, 1], clamp) * Math.sin(frame * 0.12) * 4;
  const badgePop = spring({ frame: frame - 166, fps, config: { damping: 9, stiffness: 150 } });

  return (
    <Stage outFrames={0}>
      <div style={{ position: "absolute", inset: 0, opacity: bgOpacity, fontFamily }}>
        {/* Calque SVG : particules + trait + anneaux (sous le noyau) */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {/* Anneaux */}
          {[210, 245, 280].map((r, i) => (
            <g
              key={r}
              transform={`rotate(${(i % 2 === 0 ? 1 : -1) * frame * 0.8} ${CORE_X} ${CORE_Y})`}
              opacity={interpolate(frame, [56, 70], [0, 0.35], clamp)}
            >
              <circle
                cx={CORE_X}
                cy={CORE_Y}
                r={r}
                fill="none"
                stroke={ACCENT_LIGHT}
                strokeWidth={3}
                strokeDasharray={i === 1 ? "40 22" : i === 0 ? "120 40" : "8 24"}
              />
            </g>
          ))}

          {/* Trait de lumière */}
          <line
            x1={lineX1}
            y1={CORE_Y}
            x2={lineX2}
            y2={CORE_Y}
            stroke={INK}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={lineLen}
            strokeDashoffset={lineLen * (1 - lineP)}
            opacity={0.85}
          />
          {showBig && (
            <g>
              <circle cx={lineX1 + lineLen * bigT} cy={CORE_Y} r={22} fill={INK} opacity={0.35} />
              <circle cx={lineX1 + lineLen * bigT} cy={CORE_Y} r={13} fill={INK} />
            </g>
          )}

          {/* Particules */}
          {particles.map((p) => {
            const src = SOURCES[p.s];
            if (frame < p.start || frame > p.start + FLIGHT) return null;
            const P0 = { x: SRC_CX + SRC_W / 2, y: src.y + p.jy * 0.4 };
            const dirx = P0.x - CORE_X;
            const diry = P0.y - CORE_Y;
            const d = Math.hypot(dirx, diry);
            const P2 = {
              x: CORE_X + (dirx / d) * (CORE_R * 0.9),
              y: CORE_Y + (diry / d) * (CORE_R * 0.9),
            };
            const P1 = { x: (P0.x + P2.x) / 2, y: (P0.y + P2.y) / 2 + src.ctrl + p.jy };
            const t = interpolate(frame, [p.start, p.start + FLIGHT], [0, 1], {
              ...clamp,
              easing: Easing.inOut(Easing.quad),
            });
            const pt = quadBezier(P0, P1, P2, t);
            const sc =
              interpolate(t, [0, 0.12], [0, 1], clamp) * interpolate(t, [0.82, 1], [1, 0], clamp);
            const srcOp = srcState[p.s].op;
            return (
              <g key={`${p.s}-${p.k}`} opacity={srcOp}>
                <circle cx={pt.x} cy={pt.y} r={22 * sc} fill={src.color} opacity={0.3} />
                <circle cx={pt.x} cy={pt.y} r={13 * sc} fill={src.color} />
              </g>
            );
          })}
        </svg>

        {/* Sources */}
        {SOURCES.map((s, i) => (
          <div
            key={s.label}
            style={{
              position: "absolute",
              left: SRC_CX - SRC_W / 2,
              top: s.y - SRC_H / 2,
              width: SRC_W,
              height: SRC_H,
              borderRadius: 26,
              background: "rgba(27,35,64,0.9)",
              border: `3px solid ${GLASS_BORDER}`,
              boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
              opacity: srcState[i].op,
              transform: `translateX(${srcState[i].x}px)`,
              display: "flex",
              alignItems: "center",
              gap: 22,
              padding: "0 28px",
            }}
          >
            <s.Icon c={s.color} />
            <div style={{ fontSize: 44, fontWeight: 800, color: INK, whiteSpace: "nowrap" }}>
              {s.label}
            </div>
          </div>
        ))}

        {/* Carte de sortie */}
        <div
          style={{
            position: "absolute",
            left: OUT_CX - OUT_W / 2,
            top: CORE_Y - OUT_H / 2,
            width: OUT_W,
            height: OUT_H,
            borderRadius: 32,
            background: "#FFFFFF",
            boxShadow: "0 40px 90px rgba(0,0,0,0.5)",
            opacity: outOp,
            transform: `translate(${outX}px, ${float}px) scale(${outScale})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 22,
          }}
        >
          <div
            style={{
              background: MONEY_GREEN,
              color: INK,
              fontSize: 34,
              fontWeight: 800,
              padding: "10px 28px",
              borderRadius: 28,
              transform: `scale(${interpolate(badgePop, [0, 1], [0.6, 1])})`,
            }}
          >
            {badge}
          </div>
          <div style={{ fontSize: 58, fontWeight: 800, color: "#0B1020", whiteSpace: "nowrap" }}>
            {nomEntreprise}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[0, 1, 2, 3, 4].map((s) => {
              const f = interpolate(frame, [170 + s * 5, 176 + s * 5], [0, 1], clamp);
              return (
                <svg key={s} width={56} height={56} viewBox="0 0 24 24">
                  <path d={StarPath} fill="#E3E7F0" />
                  <g transform={`translate(12 12) scale(${0.5 + f * 0.5}) translate(-12 -12)`} opacity={f}>
                    <path d={StarPath} fill={STAR_GOLD} stroke={STAR_GOLD} strokeWidth={1} strokeLinejoin="round" />
                  </g>
                </svg>
              );
            })}
          </div>
        </div>

        {/* Noyau IA */}
        <div
          style={{
            position: "absolute",
            left: CORE_X - CORE_R,
            top: CORE_Y - CORE_R,
            width: CORE_R * 2,
            height: CORE_R * 2,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${ACCENT}, #8B5CF6)`,
            boxShadow: `0 0 ${90 * glowI}px rgba(99,102,241,${0.6 * glowI})`,
            transform: `scale(${coreScale})`,
          }}
        >
          <svg width={CORE_R * 2} height={CORE_R * 2} viewBox={`${-CORE_R} ${-CORE_R} ${CORE_R * 2} ${CORE_R * 2}`}>
            {EDGES.map(([a, b], i) => (
              <line
                key={i}
                x1={NODES[a].x}
                y1={NODES[a].y}
                x2={NODES[b].x}
                y2={NODES[b].y}
                stroke={INK}
                strokeWidth={3}
                opacity={0.6 * (0.55 + 0.45 * Math.sin(frame * 0.2 + i * 0.9))}
              />
            ))}
            {NODES.map((n, i) => (
              <circle
                key={i}
                cx={n.x}
                cy={n.y}
                r={9 + Math.sin(frame * 0.2 + i) * 1.5}
                fill={INK}
              />
            ))}
          </svg>
        </div>
        <div
          style={{
            position: "absolute",
            left: CORE_X - 100,
            width: 200,
            top: CORE_Y + CORE_R + 26,
            textAlign: "center",
            fontSize: 64,
            fontWeight: 800,
            color: INK,
            opacity: interpolate(coreSp, [0, 1], [0, 1]),
          }}
        >
          IA
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
              opacity: legP,
              transform: `translateY(${(1 - legP) * 20}px)`,
              whiteSpace: "nowrap",
            }}
          >
            {legende} <span style={{ color: ACCENT_LIGHT }}>{legendeAccent}</span>
          </div>
        </div>
      </div>
    </Stage>
  );
};
