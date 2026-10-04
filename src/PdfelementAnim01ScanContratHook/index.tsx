import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../pdfelement/Stage";
import {
  PAPER,
  PAPER_LINE,
  PAPER_HEADER,
  PAPER_SHADOW,
  PAPER_BORDER,
  SCAN_LINE,
  ALERT,
  ALERT_TINT,
  DARK_SCENE,
} from "../pdfelement/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

// ── Layout ────────────────────────────────────────────────────────────
const PAGE_W = 540;
const PAGE_H = 780;
const PAGE_LEFT = 190; // décalée à gauche pour laisser la place aux badges
const PAGE_TOP = 150;
const PAD = 44;
const BADGE_FONT = 40;
const CONNECTOR_LEN = 190;
const LINE_H = 26;

export const pdfelementAnim01Schema = z.object({
  clauses: z
    .array(z.object({ label: z.string(), yPct: z.number() }))
    .default([
      { label: "Clause de non-concurrence", yPct: 0.35 },
      { label: "Pénalité 15 %", yPct: 0.55 },
      { label: "Renouvellement automatique", yPct: 0.75 },
    ]),
  badgeStartFrames: z.array(z.number()).default([30, 55, 80]),
});

export type PdfelementAnim01Props = z.infer<typeof pdfelementAnim01Schema>;

// Position verticale (dans la feuille) d'une ligne de texte simulé.
const textLines = Array.from({ length: 24 }, (_, i) => ({
  y: PAD + 96 + i * LINE_H,
  w: 0.6 + ((i * 37) % 30) / 100, // 60 % → 90 %
}));

export const PdfelementAnim01ScanContratHook: React.FC<PdfelementAnim01Props> = ({
  clauses,
  badgeStartFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Séquence A : entrée de la page (fondu + scale 0,95 → 1)
  const pageIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const pageScale = interpolate(pageIn, [0, 1], [0.95, 1]);

  // ── Séquence B : descente du scan (linéaire, façon scanner mécanique)
  const scanY = interpolate(frame, [15, 87], [40, PAGE_H], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.linear,
  });
  const scanOpacity =
    frame < 15
      ? 0
      : interpolate(frame, [87, 97], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  const clauseAbsY = clauses.map((c) => PAD + 96 + c.yPct * (PAGE_H - PAD * 2 - 96));

  return (
    <Stage outFrames={12} bare background={DARK_SCENE}>
      <AbsoluteFill style={{ fontFamily }}>
        {/* ── La feuille de contrat ── */}
        <div
          style={{
            position: "absolute",
            left: PAGE_LEFT,
            top: PAGE_TOP,
            width: PAGE_W,
            height: PAGE_H,
            borderRadius: 6,
            background: PAPER,
            boxShadow: PAPER_SHADOW,
            border: `1px solid ${PAPER_BORDER}`,
            opacity: pageIn,
            transform: `scale(${pageScale})`,
            transformOrigin: "center center",
            overflow: "hidden",
          }}
        >
          {/* bandeau titre */}
          <div
            style={{
              position: "absolute",
              left: PAD,
              top: PAD,
              width: PAGE_W - PAD * 2,
              height: 46,
              borderRadius: 4,
              background: PAPER_HEADER,
            }}
          />
          {/* lignes de texte simulé */}
          {textLines.map((l, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: PAD,
                top: l.y,
                width: (PAGE_W - PAD * 2) * l.w,
                height: 8,
                borderRadius: 2,
                background: PAPER_LINE,
              }}
            />
          ))}

          {/* clauses piégées — révélées au passage du scan */}
          {clauses.map((c, i) => {
            const y = clauseAbsY[i];
            const reveal = interpolate(scanY, [y - 6, y + 8], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const bg = interpolateColors(reveal, [0, 1], ["rgba(255,255,255,0)", ALERT_TINT]);
            const textColor = interpolateColors(reveal, [0, 1], [PAPER_LINE, "#7A1414"]);
            return (
              <div
                key={c.label}
                style={{
                  position: "absolute",
                  left: PAD - 10,
                  top: y - 20,
                  width: PAGE_W - PAD * 2 + 20,
                  padding: "10px 12px",
                  borderRadius: 6,
                  background: bg,
                  border: `${2 * reveal}px solid ${ALERT}`,
                  fontFamily,
                  fontWeight: 800,
                  fontSize: 24,
                  color: textColor,
                  whiteSpace: "nowrap",
                }}
              >
                {c.label}
              </div>
            );
          })}

          {/* ligne de scan */}
          <div
            style={{
              position: "absolute",
              left: -10,
              top: scanY,
              width: PAGE_W + 20,
              height: 4,
              opacity: scanOpacity,
              background: `linear-gradient(90deg, transparent, ${SCAN_LINE}, transparent)`,
              boxShadow: `0 0 32px 6px ${SCAN_LINE}, 0 0 80px 12px ${SCAN_LINE}88`,
            }}
          />
        </div>

        {/* ── Badges d'alerte + connecteurs pointillés ── */}
        <svg
          width={1920}
          height={1080}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          {clauses.map((c, i) => {
            const startF = badgeStartFrames[i];
            const s = spring({
              frame: frame - startF,
              fps,
              config: { damping: 10, stiffness: 120 },
            });
            if (frame < startF) return null;
            const y = PAGE_TOP + clauseAbsY[i];
            const x1 = PAGE_LEFT + PAGE_W + 8;
            const x2 = PAGE_LEFT + PAGE_W + CONNECTOR_LEN;
            const dash = CONNECTOR_LEN;
            return (
              <line
                key={c.label}
                x1={x1}
                y1={y}
                x2={x2}
                y2={y}
                stroke={ALERT}
                strokeWidth={2}
                strokeDasharray="4 6"
                strokeDashoffset={dash * (1 - s)}
                opacity={0.8}
              />
            );
          })}
        </svg>
        {clauses.map((c, i) => {
          const startF = badgeStartFrames[i];
          const s = spring({
            frame: frame - startF,
            fps,
            config: { damping: 10, stiffness: 120 },
          });
          if (frame < startF) return null;
          const y = PAGE_TOP + clauseAbsY[i];
          const tx = interpolate(s, [0, 1], [40, 0]);
          const sc = interpolate(s, [0, 1], [0.8, 1]);
          return (
            <div
              key={c.label}
              style={{
                position: "absolute",
                left: PAGE_LEFT + PAGE_W + CONNECTOR_LEN + 14,
                top: y,
                transform: `translateY(-50%) translateX(${tx}px) scale(${sc})`,
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "20px 28px",
                borderRadius: 14,
                background: PAPER,
                border: `2px solid ${ALERT}`,
                boxShadow: `0 20px 60px rgba(0,0,0,0.45)`,
                fontFamily,
                fontWeight: 800,
                fontSize: BADGE_FONT,
                color: "#7A1414",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontSize: BADGE_FONT, lineHeight: 1 }}>⚠️</span>
              {c.label}
            </div>
          );
        })}
      </AbsoluteFill>
    </Stage>
  );
};
