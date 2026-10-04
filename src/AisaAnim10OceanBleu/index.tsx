import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import {
  ACCENT,
  ACCENT_LIGHT,
  GLASS_BG,
  GLASS_BORDER,
  GEMINI_PURPLE,
  MONEY_GREEN,
  MUTED,
  PERPLEXITY_CYAN,
  SOFT,
  mulberry32,
} from "../aisa/theme";
import { Stage } from "../aisa/Stage";
import { wobble } from "../aisa/utils";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});

// Anim 10 — « L'océan bleu » (150 frames / 5 s @ 30 fps)
// Timeline du brief conservée. Écarts : palette charte, textes mobile-first,
// bruit maison wobble() (pas de @remotion/noise), mulberry32 (pas de random()),
// 3e point droit en cyan (pour ne pas être confondu avec le point « Toi » vert),
// compteurs sous les panneaux estompés pendant le zoom (sinon collision avec la légende),
// légende hors du conteneur zoomé, positionnement `top:` dans le wrapper zoomé.

export const aisaAnim10Schema = z.object({
  leftTitle: z.string().default("SEO"),
  leftSub: z.string().default("Marché saturé"),
  rightTitle: z.string().default("Visibilité IA"),
  rightSub: z.string().default("Presque personne"),
  leftCounter: z.string().default("des milliers de concurrents"),
  rightCounter: z.string().default("quelques acteurs"),
  youLabel: z.string().default("Toi"),
});
export type AisaAnim10Props = z.infer<typeof aisaAnim10Schema>;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const PW = 800;
const PH = 640;
const LX = 100; // panneau gauche : x 100..900
const RX = 1020; // panneau droit : x 1020..1820
const PY = 180; // y 180..820
const N = 56;
const COLS = 8;
const ROWS = 7;

// positions du panneau droit (coordonnées locales au panneau)
const R_DOTS = [
  { x: 150, y: 300, c: ACCENT, r: 26 },
  { x: 600, y: 250, c: GEMINI_PURPLE, r: 26 },
  { x: 650, y: 510, c: PERPLEXITY_CYAN, r: 26 },
];
const YOU = { x: 340, y: 470 };

export const AisaAnim10OceanBleu: React.FC<AisaAnim10Props> = ({
  leftTitle,
  leftSub,
  rightTitle,
  rightSub,
  leftCounter,
  rightCounter,
  youLabel,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgIn = interpolate(frame, [0, 10], [0, 1], clamp);
  const panelSpring = spring({ frame: frame - 6, fps, config: { damping: 15, stiffness: 100 } });
  const panelOp = interpolate(frame, [6, 32], [0, 1], clamp);
  const dx = interpolate(panelSpring, [0, 1], [120, 0]);
  const titleOp = interpolate(frame, [28, 40], [0, 1], clamp);
  const cOp = interpolate(frame, [70, 82], [0, 1], clamp);
  const cDy = interpolate(frame, [70, 82], [12, 0], clamp);

  const zoom = interpolate(frame, [82, 118], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const scale = 1 + 0.35 * zoom;
  const tx = -460 * zoom;
  const leftOp = 1 - 0.65 * zoom;
  const blur = 6 * zoom;
  const sepOp = 1 - interpolate(frame, [82, 100], [0, 1], clamp);
  const counterFade = 1 - interpolate(frame, [86, 108], [0, 1], clamp);

  const legP = interpolate(frame, [124, 138], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  // Points gauche (grille serrée + jitter seedé)
  const rng = mulberry32(1010);
  const cellW = 700 / COLS;
  const cellH = 450 / ROWS;
  const dots = Array.from({ length: N }, (_, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    return {
      x: 50 + cellW * (col + 0.5) + (rng() * 2 - 1) * 20,
      y: 160 + cellH * (row + 0.5) + (rng() * 2 - 1) * 14,
      seed: rng() * 100,
    };
  });
  // paires voisines pour les petits traits de choc
  const shocks = Array.from({ length: 12 }, () => {
    const a = Math.floor(rng() * (N - COLS - 1));
    const b = rng() < 0.5 ? a + 1 : a + COLS;
    return { a, b, phase: rng() * 40, period: 22 + Math.floor(rng() * 12) };
  });
  const wp = (i: number) => {
    const d = dots[i];
    const t = frame * 0.12;
    return { x: d.x + wobble(d.seed, t) * 7, y: d.y + wobble(d.seed + 7, t * 1.1) * 7 };
  };

  // Points droite
  const rDotScale = (i: number) =>
    spring({ frame: frame - (56 + i * 8), fps, config: { damping: 11 } });
  const youSpring = spring({ frame: frame - 104, fps, config: { damping: 12, stiffness: 110 } });
  const youY = interpolate(youSpring, [0, 1], [-200, 0]);
  const youOp = interpolate(frame, [104, 112], [0, 1], clamp);
  const labelSpring = spring({ frame: frame - 118, fps, config: { damping: 12 } });
  const labelScale = interpolate(labelSpring, [0, 1], [0.6, 1]);
  const halo = 0.5 + 0.5 * Math.sin(frame / 6);

  const title = (t: string, sub: string, tc: string, sc: string) => (
    <div style={{ position: "absolute", left: 40, top: 28, opacity: titleOp }}>
      <div style={{ fontSize: 60, fontWeight: 800, color: tc, lineHeight: 1.1 }}>{t}</div>
      <div style={{ fontSize: 40, fontWeight: 600, color: sc, marginTop: 4 }}>{sub}</div>
    </div>
  );

  return (
    <Stage outFrames={0}>
      <AbsoluteFill style={{ fontFamily, opacity: bgIn }}>
        {/* Conteneur zoomé : tout positionné avec top/left */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1920,
            height: 1080,
            transformOrigin: "1420px 500px",
            transform: `translate(${tx}px, ${-30 * zoom}px) scale(${scale})`,
          }}
        >
          {/* Panneau gauche */}
          <div
            style={{
              position: "absolute",
              left: LX,
              top: PY,
              width: PW,
              height: PH,
              borderRadius: 28,
              background: GLASS_BG,
              border: `2px solid ${GLASS_BORDER}`,
              boxShadow: "0 40px 90px rgba(0,0,0,0.5)",
              opacity: panelOp * leftOp,
              transform: `translateX(${-dx}px)`,
              filter: `blur(${blur}px)`,
            }}
          >
            {title(leftTitle, leftSub, SOFT, MUTED)}
            <svg width={PW} height={PH} style={{ position: "absolute", left: 0, top: 0 }}>
              {shocks.map((s, k) => {
                if (frame < 56) return null;
                const ph = ((frame - 56 + s.phase) % s.period) / s.period;
                const o = ph < 0.3 ? Math.sin((ph / 0.3) * Math.PI) : 0;
                if (o <= 0.02) return null;
                const A = wp(s.a);
                const B = wp(s.b);
                const mx = (A.x + B.x) / 2;
                const my = (A.y + B.y) / 2;
                const ang = Math.atan2(B.y - A.y, B.x - A.x) + Math.PI / 2;
                const L = 16;
                return (
                  <line
                    key={k}
                    x1={mx - Math.cos(ang) * L}
                    y1={my - Math.sin(ang) * L}
                    x2={mx + Math.cos(ang) * L}
                    y2={my + Math.sin(ang) * L}
                    stroke={SOFT}
                    strokeWidth={3}
                    strokeLinecap="round"
                    opacity={o}
                  />
                );
              })}
              {dots.map((d, i) => {
                const s = interpolate(frame, [30 + i * 0.5, 38 + i * 0.5], [0, 1], clamp);
                if (s <= 0) return null;
                const q = wp(i);
                return <circle key={i} cx={q.x} cy={q.y} r={15 * s} fill="#5B6B9A" />;
              })}
            </svg>
          </div>

          {/* Panneau droit */}
          <div
            style={{
              position: "absolute",
              left: RX,
              top: PY,
              width: PW,
              height: PH,
              borderRadius: 28,
              background: GLASS_BG,
              border: `2px solid rgba(48,96,255,0.55)`,
              boxShadow: "0 40px 90px rgba(0,0,0,0.5), 0 0 60px rgba(48,96,255,0.25)",
              opacity: panelOp,
              transform: `translateX(${dx}px)`,
            }}
          >
            {title(rightTitle, rightSub, "#fff", ACCENT_LIGHT)}
            <svg width={PW} height={PH} style={{ position: "absolute", left: 0, top: 0 }}>
              <defs>
                <filter id="g10" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="9" />
                </filter>
              </defs>
              {Array.from({ length: 9 }, (_, i) => (
                <line key={"v" + i} x1={50 + i * 87.5} y1={170} x2={50 + i * 87.5} y2={600} stroke="rgba(120,150,255,0.12)" strokeWidth={2} />
              ))}
              {Array.from({ length: 6 }, (_, i) => (
                <line key={"h" + i} x1={50} y1={170 + i * 86} x2={750} y2={170 + i * 86} stroke="rgba(120,150,255,0.12)" strokeWidth={2} />
              ))}
              {R_DOTS.map((d, i) => {
                const s = rDotScale(i);
                const fx = Math.sin(frame / 22 + i * 2) * 8;
                const fy = Math.cos(frame / 26 + i * 1.7) * 8;
                return (
                  <g key={i} transform={`translate(${d.x + fx} ${d.y + fy}) scale(${s})`}>
                    <circle r={d.r} fill={d.c} opacity={0.7} filter="url(#g10)" />
                    <circle r={d.r} fill={d.c} />
                  </g>
                );
              })}
              {frame >= 104 && (
                <g transform={`translate(${YOU.x} ${YOU.y + youY})`} opacity={youOp}>
                  <circle r={44 + 18 * halo} fill={MONEY_GREEN} opacity={0.18 + 0.12 * halo} />
                  <circle r={30} fill={MONEY_GREEN} opacity={0.7} filter="url(#g10)" />
                  <circle r={30} fill={MONEY_GREEN} />
                </g>
              )}
            </svg>
            {frame >= 118 && (
              <div
                style={{
                  position: "absolute",
                  left: YOU.x - 60,
                  top: YOU.y + 52,
                  width: 120,
                  height: 58,
                  borderRadius: 29,
                  background: MONEY_GREEN,
                  color: "#fff",
                  fontSize: 40,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${labelScale})`,
                  boxShadow: "0 0 24px rgba(34,197,94,0.5)",
                }}
              >
                {youLabel}
              </div>
            )}
          </div>

          {/* Séparateur */}
          <div
            style={{
              position: "absolute",
              left: 959,
              top: PY + 20,
              width: 2,
              height: PH - 40,
              background: GLASS_BORDER,
              opacity: sepOp * panelOp,
            }}
          />

          {/* Compteurs */}
          <div
            style={{
              position: "absolute",
              left: LX,
              top: 855,
              width: PW,
              textAlign: "center",
              fontSize: 40,
              fontWeight: 600,
              color: MUTED,
              opacity: cOp * counterFade * leftOp,
              transform: `translateY(${cDy}px)`,
            }}
          >
            {leftCounter}
          </div>
          <div
            style={{
              position: "absolute",
              left: RX,
              top: 855,
              width: PW,
              textAlign: "center",
              fontSize: 40,
              fontWeight: 600,
              color: ACCENT_LIGHT,
              opacity: cOp * counterFade,
              transform: `translateY(${cDy}px)`,
            }}
          >
            {rightCounter}
          </div>
        </div>

        {/* Légende hors du conteneur zoomé */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 930,
            width: 1920,
            textAlign: "center",
            fontSize: 56,
            fontWeight: 800,
            color: "#fff",
            opacity: legP,
            transform: `translateY(${(1 - legP) * 20}px)`,
          }}
        >
          Peu de monde. <span style={{ color: MONEY_GREEN }}>Beaucoup de place.</span>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
