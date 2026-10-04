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
import { Stage } from "../pdfelement/Stage";
import {
  PAPER,
  PAPER_LINE_FAINT,
  PAPER_SHADOW,
  PAPER_BORDER,
  MAGNIFIER_METAL,
  MAGNIFIER_SHADOW,
  ALERT,
  DARK_SCENE,
} from "../pdfelement/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

const PAGE_W = 900;
const PAGE_H = 620;
const PAGE_LEFT = (1920 - PAGE_W) / 2;
const PAGE_TOP = (1080 - PAGE_H) / 2;

// Cible : centre de la phrase piège (~57 % de la hauteur du paragraphe).
const TARGET_X = 960;
const TARGET_Y = PAGE_TOP + 96 + 0.57 * (PAGE_H - 150);
const LENS_R = 150;
const CLIP_R = 132;
const REVEAL_W = 240;

export const pdfelementAnim02Schema = z.object({
  trapSentence: z.string().default("Le prestataire renonce à tout recours"),
});

export type PdfelementAnim02Props = z.infer<typeof pdfelementAnim02Schema>;

const tinyLines = Array.from({ length: 34 }, (_, i) => ({
  w: 0.82 + ((i * 53) % 16) / 100,
  faint: i % 7 === 3,
}));

export const PdfelementAnim02LoupePetitsCaracteres: React.FC<PdfelementAnim02Props> = ({
  trapSentence,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── A : paragraphe illisible en fondu
  const paraOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── B : entrée de la loupe (scale + fondu)
  const lensIn = spring({ frame: frame - 15, fps, config: { damping: 14, stiffness: 120 } });

  // ── C : déplacement diagonal + flou progressif du fond
  const move = interpolate(frame, [30, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const lensX = interpolate(move, [0, 1], [200, TARGET_X]);
  const lensY = interpolate(move, [0, 1], [-150, TARGET_Y]);
  const wobble = frame > 30 && frame < 75 ? Math.sin((frame - 30) / 3) * 3 : 0;
  const bgBlur = interpolate(frame, [30, 75], [0, 2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── D : révélation — la phrase grossit dans la lentille
  const revealSpring = spring({
    frame: frame - 75,
    fps,
    config: { damping: 13, stiffness: 140 },
  });
  const revealFont = interpolate(revealSpring, [0, 1], [24, 38]);

  // Surlignage rouge autour de la phrase (strokeDashoffset)
  const highlight = interpolate(frame, [95, 112], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const highlightW = REVEAL_W + 24;
  const highlightH = 210;
  const highlightPerim = 2 * (highlightW + highlightH);

  return (
    <Stage outFrames={15} bare background={DARK_SCENE}>
      <AbsoluteFill style={{ fontFamily }}>
        {/* ── Feuille + petits caractères (couche floutée à partir de C) ── */}
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
            opacity: paraOpacity,
            filter: `blur(${bgBlur}px)`,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", left: 60, top: 48, right: 60, display: "flex", flexDirection: "column", gap: 9 }}>
            {tinyLines.map((l, i) => (
              <div
                key={i}
                style={{
                  height: 6,
                  width: `${l.w * 100}%`,
                  borderRadius: 2,
                  background: l.faint ? "#C4C4C4" : PAPER_LINE_FAINT,
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Phrase révélée : grande & nette, visible seulement dans la lentille ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: `circle(${CLIP_R}px at ${lensX}px ${lensY}px)`,
          }}
        >
          {/* fond blanc pur sous la lentille */}
          <div
            style={{
              position: "absolute",
              left: PAGE_LEFT,
              top: PAGE_TOP,
              width: PAGE_W,
              height: PAGE_H,
              borderRadius: 6,
              background: "#FFFFFF",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: TARGET_X,
              top: TARGET_Y,
              transform: "translate(-50%, -50%)",
              width: REVEAL_W,
              textAlign: "center",
              fontFamily,
              fontWeight: 800,
              fontSize: revealFont,
              lineHeight: 1.2,
              color: "#7A1414",
            }}
          >
            {trapSentence}
          </div>
        </div>

        {/* surlignage rouge autour de la phrase (dans la lentille) */}
        <svg
          width={1920}
          height={1080}
          style={{
            position: "absolute",
            inset: 0,
            clipPath: `circle(${CLIP_R}px at ${lensX}px ${lensY}px)`,
          }}
        >
          <rect
            x={TARGET_X - highlightW / 2}
            y={TARGET_Y - highlightH / 2}
            width={highlightW}
            height={highlightH}
            rx={12}
            fill="none"
            stroke={ALERT}
            strokeWidth={3}
            strokeDasharray={highlightPerim}
            strokeDashoffset={highlightPerim * (1 - highlight)}
          />
        </svg>

        {/* ── La loupe ── */}
        {frame >= 15 && (
          <svg
            width={LENS_R * 4}
            height={LENS_R * 4}
            viewBox={`${-LENS_R * 2} ${-LENS_R * 2} ${LENS_R * 4} ${LENS_R * 4}`}
            style={{
              position: "absolute",
              left: lensX,
              top: lensY,
              transform: `translate(-50%, -50%) scale(${interpolate(lensIn, [0, 1], [0.6, 1])}) rotate(${wobble}deg)`,
              opacity: lensIn,
              filter: `drop-shadow(0 18px 30px ${MAGNIFIER_SHADOW})`,
            }}
          >
            {/* manche */}
            <rect
              x={LENS_R * 0.62}
              y={LENS_R * 0.62}
              width={38}
              height={150}
              rx={19}
              transform={`rotate(45 ${LENS_R * 0.62} ${LENS_R * 0.62})`}
              fill={MAGNIFIER_METAL}
            />
            {/* verre */}
            <circle cx={0} cy={0} r={LENS_R} fill="rgba(255,255,255,0.06)" />
            {/* monture */}
            <circle cx={0} cy={0} r={LENS_R} fill="none" stroke={MAGNIFIER_METAL} strokeWidth={18} />
          </svg>
        )}
      </AbsoluteFill>
    </Stage>
  );
};
