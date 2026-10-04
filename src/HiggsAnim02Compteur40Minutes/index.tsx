import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgs/Stage";
import { Emoji } from "../higgs/Emoji";
import { COLD, WARM, INK, STRIKE_RED, STALE_PANEL, FONT, ICON } from "../higgs/theme";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });

export const higgsAnim02Schema = z.object({
  targetMinutes: z.number().default(40),
  unit: z.string().default("MINUTES"),
  compareLabel: z.string().default("Shooting photo classique"),
  compareTime: z.string().default("3 semaines"),
  compareCost: z.string().default("2 400 €"),
});

export type HiggsAnim02Props = z.infer<typeof higgsAnim02Schema>;

const ARC_CX = 660;
const ARC_CY = 540;
const ARC_R = 300;
const STROKE = 30;
const CIRC = 2 * Math.PI * ARC_R;
const ARC_SPAN = 0.75; // 270°
const VISIBLE = CIRC * ARC_SPAN;

const GAUGE_END = 60;
const COMPARE_START = 45;
const STRIKE_START = 70;

export const HiggsAnim02Compteur40Minutes: React.FC<HiggsAnim02Props> = ({
  targetMinutes,
  unit,
  compareLabel,
  compareTime,
  compareCost,
}) => {
  const frame = useCurrentFrame();

  const gaugeT = interpolate(frame, [0, GAUGE_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const dashoffset = VISIBLE * (1 - gaugeT);

  const count = Math.round(interpolate(frame, [0, GAUGE_END], [0, targetMinutes], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));
  const numScale = interpolate(gaugeT, [0, 1], [0.9, 1]);

  // Bloc de comparaison (droite) : fade + slide
  const compT = interpolate(frame, [COMPARE_START, COMPARE_START + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const compX = interpolate(compT, [0, 1], [90, 0]);
  const strikeT = interpolate(frame, [STRIKE_START, STRIKE_START + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <Stage outFrames={12}>
      <AbsoluteFill>
        {/* ── Jauge 270° ─────────────────────────────── */}
        <svg width="1920" height="1080" style={{ position: "absolute" }}>
          <defs>
            <linearGradient id="charge" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor={COLD} />
              <stop offset="1" stopColor={WARM} />
            </linearGradient>
          </defs>
          {/* piste */}
          <circle
            cx={ARC_CX}
            cy={ARC_CY}
            r={ARC_R}
            fill="none"
            stroke="#2b3242"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={`${VISIBLE} ${CIRC}`}
            transform={`rotate(135 ${ARC_CX} ${ARC_CY})`}
          />
          {/* remplissage */}
          <circle
            cx={ARC_CX}
            cy={ARC_CY}
            r={ARC_R}
            fill="none"
            stroke="url(#charge)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={`${VISIBLE} ${CIRC}`}
            strokeDashoffset={dashoffset}
            transform={`rotate(135 ${ARC_CX} ${ARC_CY})`}
            style={{ filter: `drop-shadow(0 0 16px ${COLD}aa)` }}
          />
        </svg>

        {/* Compteur au centre de l'arc */}
        <div
          style={{
            position: "absolute",
            left: ARC_CX,
            top: ARC_CY,
            transform: `translate(-50%, -50%) scale(${numScale})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontFamily,
          }}
        >
          <span style={{ fontWeight: 800, fontSize: FONT.hero, color: INK, lineHeight: 1 }}>
            {count}
          </span>
          <span
            style={{
              fontWeight: 700,
              fontSize: FONT.label,
              color: WARM,
              letterSpacing: "0.12em",
              marginTop: 8,
            }}
          >
            {unit}
          </span>
        </div>

        {/* ── Bloc « ancienne méthode » barré ─────────── */}
        <div
          style={{
            position: "absolute",
            left: 1230,
            top: ARC_CY,
            transform: `translateY(-50%) translateX(${compX}px)`,
            opacity: compT * 0.6,
            width: 560,
            padding: "48px 52px",
            borderRadius: 24,
            background: STALE_PANEL,
            border: "2px solid #48484A",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            fontFamily,
          }}
        >
          <Emoji size={ICON.sm}>📷</Emoji>
          <span style={{ fontWeight: 700, fontSize: FONT.micro, color: "#c7c7cc" }}>
            {compareLabel}
          </span>
          <span style={{ fontWeight: 800, fontSize: FONT.label, color: INK }}>{compareTime}</span>
          <span style={{ fontWeight: 800, fontSize: FONT.label, color: INK }}>{compareCost}</span>

          {/* diagonale barrée */}
          <div
            style={{
              position: "absolute",
              left: "6%",
              top: "50%",
              width: "88%",
              height: 8,
              background: STRIKE_RED,
              borderRadius: 4,
              transform: `translateY(-50%) rotate(-15deg) scaleX(${strikeT})`,
              transformOrigin: "left center",
              boxShadow: `0 0 18px ${STRIKE_RED}aa`,
            }}
          />
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
