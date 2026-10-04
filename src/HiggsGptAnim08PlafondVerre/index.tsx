import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsGpt/Stage";
import { shake } from "../higgsGpt/shake";
import { ACCENT, STRIKE_RED, INK } from "../higgsGpt/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["800"],
  subsets: ["latin"],
});

// Anim 8 — « Le plafond de verre » (195 frames / 6,5 s @ 30 fps)
// A courbe 0–60 · B impact 60–69 · C fissures 69–114 · D « LIMITATIONS » 114–174
// E sortie 174–195
// Charnière de la vidéo : pose le problème juste avant la révélation de l'outil.

export const higgsGptAnim08Schema = z.object({
  word: z.string().default("LIMITATIONS"),
});
export type HiggsGptAnim08Props = z.infer<typeof higgsGptAnim08Schema>;

const CEIL_Y = 300;
const IMPACT_X = 1400;
// Cubic Bézier de la courbe de puissance
const P0: [number, number] = [120, 980];
const P1: [number, number] = [520, 920];
const P2: [number, number] = [880, 470];
const P3: [number, number] = [IMPACT_X, CEIL_Y];
const CURVE_LEN = 1720; // approx., pour le strokeDasharray

const bez = (t: number): [number, number] => {
  const u = 1 - t;
  const x =
    u * u * u * P0[0] +
    3 * u * u * t * P1[0] +
    3 * u * t * t * P2[0] +
    t * t * t * P3[0];
  const y =
    u * u * u * P0[1] +
    3 * u * u * t * P1[1] +
    3 * u * t * t * P2[1] +
    t * t * t * P3[1];
  return [x, y];
};

const CRACKS: string[] = [
  "M0 0 l -140 -14 l -110 10 l -160 -8",
  "M0 0 l 150 12 l 120 -10 l 180 8 l 90 -6",
  "M0 0 l -90 16 l -120 -12 l -90 8",
  "M0 0 l 110 -16 l 140 12 l 100 -6",
  "M0 0 l -60 -18 l -80 14 l -120 -8",
];
const CRACK_LEN = 520;

export const HiggsGptAnim08PlafondVerre: React.FC<HiggsGptAnim08Props> = ({
  word,
}) => {
  const frame = useCurrentFrame();

  // A — tracé de la courbe
  const curveDraw = interpolate(frame, [0, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const [tipX, tipY] = bez(curveDraw);

  // B — impact
  const impacted = frame >= 60;
  const ceilSolid = interpolate(frame, [60, 64], [0.3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const camX = shake(frame, 60, 7, 8, 2.2);
  const camY = shake(frame, 60, 5, 8, 2.8);
  const flashT = interpolate(frame, [60, 68], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // D — mot « LIMITATIONS »
  const wordT = interpolate(frame, [114, 132], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // E — sortie (fondu sobre)
  const outT = interpolate(frame, [174, 195], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const compOpacity = 1 - outT;

  const tipPulse = 0.6 + Math.sin(frame / 7) * 0.4;
  const crackGlow = frame >= 114 ? 0.5 + Math.sin(frame / 20) * 0.4 : 1;

  return (
    <Stage outFrames={2}>
      <AbsoluteFill
        style={{
          opacity: compOpacity,
          transform: `translate(${camX}px, ${camY}px)`,
        }}
      >
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {/* plafond */}
          <line
            x1={120}
            y1={CEIL_Y}
            x2={1860}
            y2={CEIL_Y}
            stroke="#e8e8ef"
            strokeWidth={impacted ? 5 : 3}
            strokeDasharray={impacted ? "none" : "10 12"}
            style={{ opacity: ceilSolid }}
          />

          {/* courbe de puissance */}
          <path
            d={`M ${P0[0]} ${P0[1]} C ${P1[0]} ${P1[1]}, ${P2[0]} ${P2[1]}, ${P3[0]} ${P3[1]}`}
            fill="none"
            stroke={ACCENT}
            strokeWidth={7}
            strokeLinecap="round"
            style={{
              strokeDasharray: CURVE_LEN,
              strokeDashoffset: CURVE_LEN * (1 - curveDraw),
              filter: `drop-shadow(0 0 18px ${ACCENT}aa)`,
            }}
          />

          {/* fissures */}
          {impacted &&
            CRACKS.map((d, i) => {
              const startF = 69 + i * 7;
              const cd = interpolate(frame, [startF, startF + 16], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              });
              return (
                <path
                  key={i}
                  d={d}
                  transform={`translate(${IMPACT_X} ${CEIL_Y})`}
                  fill="none"
                  stroke={STRIKE_RED}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    strokeDasharray: CRACK_LEN,
                    strokeDashoffset: CRACK_LEN * (1 - cd),
                    filter: `drop-shadow(0 0 ${6 * crackGlow}px ${STRIKE_RED})`,
                    opacity: 0.85,
                  }}
                />
              );
            })}

          {/* flash localisé à l'impact */}
          {impacted && flashT < 1 && (
            <circle
              cx={IMPACT_X}
              cy={CEIL_Y}
              r={interpolate(flashT, [0, 1], [0, 120])}
              fill="#fff"
              opacity={1 - flashT}
            />
          )}

          {/* point lumineux qui trace / cherche à percer */}
          <circle
            cx={impacted ? IMPACT_X : tipX}
            cy={impacted ? CEIL_Y + 26 : tipY}
            r={impacted ? 10 + tipPulse * 6 : 9}
            fill="#fff"
            style={{
              filter: `drop-shadow(0 0 ${12 + tipPulse * 14}px ${ACCENT})`,
            }}
          />
        </svg>

        {/* mot « LIMITATIONS » */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: CEIL_Y + 120,
            width: 1920,
            textAlign: "center",
            fontFamily,
            fontWeight: 800,
            fontSize: 150,
            letterSpacing: "6px",
            color: INK,
            opacity: wordT,
            transform: `translateY(${interpolate(wordT, [0, 1], [15, 0])}px)`,
          }}
        >
          {word}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
