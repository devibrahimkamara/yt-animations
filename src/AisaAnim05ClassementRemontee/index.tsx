import {
  Easing,
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
  EASE,
  GLASS_BG,
  GLASS_BORDER,
  GLASS_CARD,
  INK,
  MONEY_GREEN,
  MUTED,
} from "../aisa/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["500", "600", "700", "800"],
  subsets: ["latin"],
});

// Anim 5 — « Classement qui se réorganise » (180 frames / 6 s @ 30 fps)
// Panneau 0–34 · lignes 30–62 · pause 62–80 · remontée 6×9f 80–134 ·
// illumination 134–150 · légende 148–164 · maintien 164–180

export const aisaAnim05Schema = z.object({
  companies: z
    .array(z.object({ name: z.string(), score: z.number() }))
    .default([
      { name: "Atelier Nova", score: 96 },
      { name: "Studio Kora", score: 88 },
      { name: "Digital Plus", score: 81 },
      { name: "Agence Lumen", score: 73 },
      { name: "WebPro Conseil", score: 64 },
      { name: "Média Express", score: 52 },
    ]),
  yourName: z.string().default("Ton entreprise"),
  yourStartScore: z.number().default(18),
  title: z.string().default("Meilleures entreprises recommandées"),
  badgeText: z.string().default("Recommandé"),
  positionLabel: z.string().default("Ta position"),
  legendPre: z.string().default("De invisible à "),
  legendAccent: z.string().default("recommandé"),
});
export type AisaAnim05Props = z.infer<typeof aisaAnim05Schema>;

// ── Géométrie ──
const PANEL_X = 100;
const PANEL_Y = 66;
const PANEL_W = 1060;
const HEADER_H = 84;
const ROW_H = 92;
const ROW_GAP = 8;
const ROW_STEP = ROW_H + ROW_GAP;
const ROW_X = 64;
const ROW_W = 940;
const ROWS_TOP = HEADER_H + 6;
const PANEL_H = ROWS_TOP + 7 * ROW_STEP + 14;

const STEP_STARTS = [80, 89, 98, 107, 116, 125];
const GRAY = "#5A6488";

const clamp01 = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Sparkle: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M12 2 C12.8 7.5 16.5 11.2 22 12 C16.5 12.8 12.8 16.5 12 22 C11.2 16.5 7.5 12.8 2 12 C7.5 11.2 11.2 7.5 12 2Z"
      fill={color}
    />
  </svg>
);

const ArrowUp: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 20V5M5 11.5L12 4.5L19 11.5"
      stroke={MONEY_GREEN}
      strokeWidth={3.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Check: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12.5L10 17.5L19 7"
      stroke="#fff"
      strokeWidth={3.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const AisaAnim05ClassementRemontee: React.FC<AisaAnim05Props> = ({
  companies,
  yourName,
  yourStartScore,
  title,
  badgeText,
  positionLabel,
  legendPre,
  legendAccent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 10], [0, 1], clamp01);

  // Panneau
  const panelSp = spring({ frame: frame - 8, fps, config: { damping: 15, stiffness: 100 } });
  const panelScale = interpolate(panelSp, [0, 1], [0.94, 1]);
  const panelOpacity = interpolate(frame, [8, 24], [0, 1], clamp01);

  // Springs d'échange (un par étape)
  const stepSprings = STEP_STARTS.map((s) =>
    spring({ frame: frame - s, fps, config: { damping: 16, stiffness: 140 } }),
  );
  const P = stepSprings.reduce((a, b) => a + b, 0); // 0..6 : places gagnées
  const progress = Math.min(1, Math.max(0, P / 6));
  const stepsDone = STEP_STARTS.filter((s) => frame >= s).length;

  // Illumination finale
  const litSp = spring({ frame: frame - 134, fps, config: { damping: 14, stiffness: 120 } });
  const litScale = 1 + 0.03 * litSp;
  const breath = frame >= 164 ? Math.sin((frame - 164) * 0.3) * 0.12 : 0;
  const glowAlpha = (0.45 + breath) * litSp;

  // Lignes : [nom, score, rang interpolé]
  type Row = { name: string; score: number; rank: number; isYou: boolean; idx: number };
  const rows: Row[] = [
    ...companies.map((c, k) => {
      // le concurrent k est dépassé à l'étape 5-k (k=5 → étape 0)
      const stepIdx = companies.length - 1 - k;
      const sp = stepSprings[stepIdx] ?? 0;
      return { name: c.name, score: c.score, rank: k + sp, isYou: false, idx: k };
    }),
    {
      name: yourName,
      score: yourStartScore + (companies[0].score - yourStartScore) * progress,
      rank: companies.length - P,
      isYou: true,
      idx: companies.length,
    },
  ];

  // Compteur de position
  const counterIn = interpolate(frame, [56, 70], [0, 1], { ...clamp01, easing: EASE });
  const lastStart = stepsDone > 0 ? STEP_STARTS[stepsDone - 1] : 56;
  const popSp = spring({ frame: frame - lastStart, fps, config: { damping: 9, stiffness: 220 } });
  const popScale = stepsDone > 0 ? interpolate(popSp, [0, 1], [1.15, 1]) : interpolate(popSp, [0, 1], [0.8, 1]);
  const positionNumber = 7 - stepsDone;
  const counterColor = interpolateColors(frame, [134, 146], [INK, MONEY_GREEN]);

  // Légende
  const legendIn = interpolate(frame, [148, 164], [0, 1], { ...clamp01, easing: Easing.out(Easing.cubic) });

  // Badge final
  const badgeSp = spring({ frame: frame - 136, fps, config: { damping: 10, stiffness: 130 } });

  return (
    <Stage outFrames={0}>
      <div style={{ position: "absolute", inset: 0, fontFamily, opacity: bgOpacity }}>
        {/* Panneau glass */}
        <div
          style={{
            position: "absolute",
            left: PANEL_X,
            top: PANEL_Y,
            width: PANEL_W,
            height: PANEL_H,
            borderRadius: 36,
            background: GLASS_BG,
            border: `2px solid ${GLASS_BORDER}`,
            boxShadow: "0 40px 100px rgba(0,0,0,0.55)",
            opacity: panelOpacity,
            transform: `scale(${panelScale})`,
          }}
        >
          {/* En-tête */}
          <div
            style={{
              position: "absolute",
              left: 40,
              right: 40,
              top: 0,
              height: HEADER_H,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: `1px solid ${GLASS_BORDER}`,
            }}
          >
            <span style={{ fontSize: 38, fontWeight: 600, color: MUTED, letterSpacing: -0.3 }}>
              {title}
            </span>
            <Sparkle size={44} color={ACCENT} />
          </div>

          {/* Lignes */}
          {rows.map((r) => {
            const enter = interpolate(frame, [30 + r.idx * 4, 42 + r.idx * 4], [0, 1], {
              ...clamp01,
              easing: EASE,
            });
            const youOpacity = r.isYou
              ? (interpolate(progress, [0, 1], [0.45, 1]) +
                  (frame >= 62 && frame < 80
                    ? 0.15 * Math.sin(((frame - 62) / 18) * Math.PI)
                    : 0))
              : 1;
            const lit = r.isYou ? litSp : 0;
            const barColor = r.isYou
              ? interpolateColors(progress, [0, 1], [GRAY, MONEY_GREEN])
              : ACCENT;
            const nameColor = r.isYou
              ? interpolateColors(progress, [0, 1], [MUTED, INK])
              : INK;
            const circleBg = r.isYou
              ? interpolateColors(progress, [0, 1], ["rgba(90,100,136,0.45)", MONEY_GREEN])
              : "rgba(120,150,255,0.22)";
            const displayRank = Math.round(r.rank) + 1;
            const arrowT = r.isYou
              ? STEP_STARTS.reduce((acc, s) => {
                  const t = frame - s;
                  return t >= 0 && t < 10 ? Math.max(acc, 1 - t / 10) : acc;
                }, 0)
              : 0;
            const arrowStep = r.isYou
              ? STEP_STARTS.reduce((acc, s) => (frame >= s && frame < s + 10 ? s : acc), -1)
              : -1;
            const arrowSlide = arrowStep >= 0 ? interpolate(frame - arrowStep, [0, 10], [14, -6], clamp01) : 0;

            return (
              <div
                key={r.name}
                style={{
                  position: "absolute",
                  left: ROW_X,
                  width: ROW_W,
                  top: ROWS_TOP + r.rank * ROW_STEP,
                  height: ROW_H,
                  zIndex: r.isYou ? 10 : 1,
                  opacity: enter * Math.min(1, youOpacity),
                  transform: `translateY(${(1 - enter) * 24}px) scale(${r.isYou ? litScale : 1})`,
                }}
              >
                {/* flèche montante, dans la gouttière gauche */}
                {r.isYou && arrowT > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      left: -52,
                      top: ROW_H / 2 - 22,
                      opacity: arrowT,
                      transform: `translateY(${arrowSlide}px)`,
                    }}
                  >
                    <ArrowUp size={44} />
                  </div>
                )}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    boxSizing: "border-box",
                    borderRadius: 24,
                    background: GLASS_CARD,
                    border: lit > 0.01
                      ? `3px solid ${MONEY_GREEN}`
                      : `2px solid ${GLASS_BORDER}`,
                    boxShadow: lit > 0.01 ? `0 0 40px rgba(34,197,94,${glowAlpha.toFixed(3)})` : "none",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 24px 0 16px",
                    gap: 20,
                  }}
                >
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      background: circleBg,
                      color: INK,
                      fontSize: 34,
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {displayRank}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      fontSize: 42,
                      fontWeight: 700,
                      color: nameColor,
                      whiteSpace: "nowrap",
                      letterSpacing: -0.4,
                    }}
                  >
                    {r.name}
                  </div>
                  {r.isYou && frame >= 134 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: MONEY_GREEN,
                        borderRadius: 40,
                        padding: "8px 18px 8px 10px",
                        transform: `scale(${interpolate(badgeSp, [0, 1], [0.6, 1])})`,
                        opacity: Math.min(1, badgeSp * 2),
                        flexShrink: 0,
                      }}
                    >
                      <Check size={30} />
                      <span style={{ fontSize: 30, fontWeight: 800, color: "#fff" }}>{badgeText}</span>
                    </div>
                  )}
                  {/* barre de score */}
                  <div
                    style={{
                      width: 200,
                      height: 18,
                      borderRadius: 9,
                      background: "rgba(120,150,255,0.2)",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.max(0, Math.min(100, r.score))}%`,
                        height: "100%",
                        borderRadius: 9,
                        background: barColor,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Compteur de position */}
        <div
          style={{
            position: "absolute",
            left: 1200,
            width: 640,
            top: 270,
            textAlign: "center",
            opacity: counterIn,
          }}
        >
          <div
            style={{
              fontSize: 230,
              fontWeight: 800,
              lineHeight: 1,
              color: counterColor,
              transform: `scale(${popScale})`,
              textShadow:
                frame >= 134
                  ? `0 0 60px rgba(34,197,94,${(0.45 + breath).toFixed(3)})`
                  : `0 0 50px rgba(48,96,255,0.35)`,
              letterSpacing: -6,
            }}
          >
            #{positionNumber}
          </div>
          <div style={{ marginTop: 18, fontSize: 52, fontWeight: 600, color: MUTED }}>
            {positionLabel}
          </div>
        </div>

        {/* Légende */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 930,
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
          <span style={{ color: MONEY_GREEN }}>{legendAccent}</span>
        </div>
      </div>
    </Stage>
  );
};
