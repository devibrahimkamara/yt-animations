import { Easing, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../aisa/Stage";
import { ACCENT, INK, MONEY_GREEN, MUTED, SOFT, mulberry32 } from "../aisa/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});

// Anim 6 — « Globe d'utilisateurs » (150 frames / 5 s @ 30 fps)
// Globe 6–36 · accroche 34–52 · points 50–118 · compteur 58–122 · pop 122–130 ·
// source 124–136 · maintien 136–150

export const aisaAnim06Schema = z.object({
  chiffre: z.number().default(800000000),
  label: z.string().default("utilisateurs actifs chaque semaine"),
  source: z.string().default("Source : annonce officielle de l'éditeur (à vérifier)"),
  hookPre: z.string().default("Des centaines de millions de personnes utilisent "),
  hookAccent: z.string().default("l'IA"),
  hookPost: z.string().default(""),
});
export type AisaAnim06Props = z.infer<typeof aisaAnim06Schema>;

const CX = 960;
const CY = 432;
const R = 270;
const N = 900;
const N_LIT = 70;
const ROT_SPEED = 0.004; // rad/frame (≈0,6 rad sur 5 s : rotation lente)
const TILT = 0.28;
const BASE = "#7487BD";
const GOLDEN = 2.39996;

type P3 = { x: number; y: number; z: number };

const POINTS: P3[] = Array.from({ length: N }, (_, i) => {
  const y = 1 - (2 * (i + 0.5)) / N;
  const r = Math.sqrt(1 - y * y);
  const a = i * GOLDEN;
  return { x: Math.cos(a) * r, y, z: Math.sin(a) * r };
});

// Projection : rotation autour de l'axe vertical puis léger basculement
const project = (p: P3, theta: number) => {
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  const x1 = p.x * c + p.z * s;
  const z1 = -p.x * s + p.z * c;
  const ct = Math.cos(TILT);
  const st = Math.sin(TILT);
  const y2 = p.y * ct - z1 * st;
  const z2 = p.y * st + z1 * ct;
  return { x: CX + R * x1, y: CY + R * y2, z: z2 };
};

// Sélection des 70 points allumés (mulberry32) : uniquement des points de face
// sur toute la durée pour qu'ils restent visibles.
const LIT = (() => {
  const rnd = mulberry32(2026);
  const candidates = POINTS.map((p, i) => i).filter((i) => {
    const a = project(POINTS[i], 0).z;
    const b = project(POINTS[i], ROT_SPEED * 150).z;
    return a > 0.3 && b > 0.3;
  });
  // mélange Fisher–Yates seedé
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  return candidates.slice(0, N_LIT).map((idx, k) => {
    const u = k / (N_LIT - 1);
    // rythme croissant : écart de ~3 frames au début → ~1 frame à la fin
    const start = Math.round(50 + 68 * (1 - Math.pow(1 - u, 1.55)));
    return { idx, start, color: k % 2 === 0 ? MONEY_GREEN : ACCENT };
  });
})();
const LIT_SET = new Map(LIT.map((l) => [l.idx, l]));

const clamp01 = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const cubicOut = Easing.out(Easing.cubic);
// Ease-out exponentiel normalisé (atteint exactement 1 en t=1)
const expoOut = (x: number) => (1 - Math.pow(2, -10 * x)) / (1 - Math.pow(2, -10));

export const AisaAnim06GlobeUtilisateurs: React.FC<AisaAnim06Props> = ({
  chiffre,
  label,
  source,
  hookPre,
  hookAccent,
  hookPost,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 10], [0, 1], clamp01);

  const globeSp = spring({ frame: frame - 6, fps, config: { damping: 16, stiffness: 90 } });
  const globeScale = interpolate(globeSp, [0, 1], [0.85, 1]);
  const globeOpacity = interpolate(frame, [6, 24], [0, 1], clamp01);

  const theta = Math.max(0, frame - 6) * ROT_SPEED + 0.1;

  const hookT = interpolate(frame, [34, 52], [0, 1], { ...clamp01, easing: cubicOut });

  // Compteur
  const counterIn = interpolate(frame, [56, 64], [0, 1], clamp01);
  const value = Math.round(
    interpolate(frame, [58, 122], [0, chiffre], { easing: Easing.out(Easing.exp), ...clamp01 }),
  );
  const counting = frame >= 58 && frame < 122;
  const speed = counting ? Math.max(0, 1 - (frame - 58) / 64) : 0;
  const blur = counting ? 0.5 + speed * 3.5 : 0;
  const text = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const head = text.slice(0, -1);
  const lastDigit = text.slice(-1);
  const popSp = spring({ frame: frame - 122, fps, config: { damping: 12, stiffness: 160 } });
  const popScale = frame >= 122 ? 1 + 0.05 * Math.sin(Math.min(1, popSp) * Math.PI) * 1.0 + 0 : 1;
  const counterColor = interpolateColors(frame, [122, 130], [INK, MONEY_GREEN]);

  const sourceIn = interpolate(frame, [124, 136], [0, 1], clamp01);

  // Points
  const base: React.ReactNode[] = [];
  const litNodes: React.ReactNode[] = [];
  POINTS.forEach((p, i) => {
    const pr = project(p, theta);
    if (pr.z <= 0) return;
    const lit = LIT_SET.get(i);
    const ls = lit ? interpolate(frame, [lit.start, lit.start + 8], [0, 1], { ...clamp01, easing: cubicOut }) : 0;
    const size = (3 + 3.5 * pr.z) * (1 + 1.2 * ls);
    if (!lit || ls === 0) {
      base.push(
        <circle
          key={i}
          cx={pr.x}
          cy={pr.y}
          r={size / 2}
          fill={BASE}
          opacity={0.25 + 0.6 * pr.z}
        />,
      );
      return;
    }
    const vis = Math.min(1, pr.z * 4);
    const color = interpolateColors(ls, [0, 1], [BASE, lit.color]);
    // ondes : une à l'allumage puis renouvelée toutes les 40 frames
    const dt = frame - lit.start;
    const waves: React.ReactNode[] = [];
    if (dt >= 0) {
      const phase = dt % 40;
      if (phase < 24) {
        const w = interpolate(phase, [0, 24], [0, 1], { easing: cubicOut, ...clamp01 });
        waves.push(
          <circle
            key="w"
            cx={pr.x}
            cy={pr.y}
            r={10 + 50 * w}
            fill="none"
            stroke={lit.color}
            strokeWidth={3}
            opacity={0.8 * (1 - w) * vis}
          />,
        );
      }
    }
    litNodes.push(
      <g key={i}>
        {waves}
        <circle cx={pr.x} cy={pr.y} r={size * 1.1} fill={lit.color} opacity={0.22 * ls * vis} />
        <circle cx={pr.x} cy={pr.y} r={size / 2} fill={color} opacity={vis} />
      </g>,
    );
  });

  return (
    <Stage outFrames={0}>
      <div style={{ position: "absolute", inset: 0, fontFamily, opacity: bgOpacity }}>
        <svg
          width={1920}
          height={1080}
          viewBox="0 0 1920 1080"
          style={{ position: "absolute", inset: 0, opacity: globeOpacity }}
        >
          <defs>
            <radialGradient id="aisa6halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={ACCENT} stopOpacity={0.26} />
              <stop offset="70%" stopColor={ACCENT} stopOpacity={0.1} />
              <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
            </radialGradient>
          </defs>
          <g
            transform={`translate(${CX} ${CY}) scale(${globeScale}) translate(${-CX} ${-CY})`}
          >
            <circle cx={CX} cy={CY} r={R + 24} fill="url(#aisa6halo)" />
            <circle cx={CX} cy={CY} r={R + 24} fill="none" stroke={ACCENT} strokeOpacity={0.35} strokeWidth={2} />
            {base}
            {litNodes}
          </g>
        </svg>

        {/* Accroche */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 62,
            textAlign: "center",
            fontSize: 56,
            fontWeight: 800,
            color: INK,
            letterSpacing: -0.8,
            opacity: hookT,
            transform: `translateY(${(1 - hookT) * -16}px)`,
          }}
        >
          {hookPre}
          <span style={{ color: ACCENT }}>{hookAccent}</span>
          {hookPost}
        </div>

        {/* Compteur */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 752,
            textAlign: "center",
            opacity: counterIn,
            transform: `translateY(${(1 - counterIn) * 20}px)`,
          }}
        >
          <div
            style={{
              fontSize: 140,
              fontWeight: 800,
              lineHeight: 1.05,
              color: counterColor,
              fontVariantNumeric: "tabular-nums",
              transform: `scale(${popScale})`,
              letterSpacing: -2,
              textShadow: frame >= 122 ? "0 0 50px rgba(34,197,94,0.35)" : "0 0 40px rgba(48,96,255,0.25)",
            }}
          >
            {head}
            <span style={{ filter: `blur(${blur.toFixed(2)}px)`, display: "inline-block" }}>{lastDigit}</span>
          </div>
          <div style={{ marginTop: 6, fontSize: 48, fontWeight: 600, color: SOFT }}>{label}</div>
        </div>

        {/* Source */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 985,
            textAlign: "center",
            fontSize: 30,
            fontWeight: 600,
            color: MUTED,
            opacity: sourceIn,
          }}
        >
          {source}
        </div>
      </div>
    </Stage>
  );
};
