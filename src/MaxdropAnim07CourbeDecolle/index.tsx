import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../maxdrop/Stage";
import { GROWTH, GROWTH_SOFT, GROWTH_GLOW, RAIL, INK, CARD_BG, CARD_BORDER, DARK_SCENE, FONT } from "../maxdrop/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const maxdropAnim07Schema = z.object({
  years: z.array(z.string()).default(["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"]),
  calloutText: z.string().default("3 Md€ (France seule)"),
  covidLabel: z.string().default("COVID"),
});
export type MaxdropAnim07Props = z.infer<typeof maxdropAnim07Schema>;

const X0 = 260;
const X1 = 1660;
const Y_BASE = 820;
const Y_TOP = 200;
const LEVELS = [0.06, 0.09, 0.13, 0.16, 0.24, 0.42, 0.7, 1.0];

export const MaxdropAnim07CourbeDecolle: React.FC<MaxdropAnim07Props> = ({ years, calloutText, covidLabel }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const n = years.length;
  const xs = years.map((_, i) => X0 + (i * (X1 - X0)) / (n - 1));
  const ys = LEVELS.map((v) => Y_BASE - v * (Y_BASE - Y_TOP));

  const axisDraw = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const curveP = interpolate(frame, [30, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const fillOpacity = interpolate(frame, [38, 128], [0, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  let d = `M ${xs[0]} ${ys[0]}`;
  for (let i = 1; i < n; i++) {
    const cx = (xs[i - 1] + xs[i]) / 2;
    d += ` Q ${cx} ${ys[i - 1]} ${cx} ${(ys[i - 1] + ys[i]) / 2} T ${xs[i]} ${ys[i]}`;
  }
  const fillD = `${d} L ${xs[n - 1]} ${Y_BASE} L ${xs[0]} ${Y_BASE} Z`;

  const covidP = interpolate(frame, [90, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const endPoint = spring({ frame: frame - 120, fps, config: { damping: 14, stiffness: 300 } });
  const endScale = interpolate(endPoint, [0, 0.5, 1], [0, 1.3, 1], { extrapolateRight: "clamp" });
  const calloutIn = interpolate(frame, [150, 174], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const calloutY = interpolate(calloutIn, [0, 1], [10, 0]);
  const extP = interpolate(frame, [180, 210], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <Stage bare background={DARK_SCENE} outFrames={15}>
      <AbsoluteFill style={{ fontFamily }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {/* axes */}
          <line x1={X0} y1={Y_BASE} x2={X0 + (X1 - X0) * axisDraw} y2={Y_BASE} stroke={RAIL} strokeWidth={3} />
          <line x1={X0} y1={Y_BASE} x2={X0} y2={Y_BASE - (Y_BASE - Y_TOP) * axisDraw} stroke={RAIL} strokeWidth={3} />

          {/* remplissage sous la courbe (sillage) */}
          <path d={fillD} fill={GROWTH_SOFT} opacity={fillOpacity} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - curveP} stroke="transparent" />

          {/* courbe */}
          <path
            d={d}
            fill="none"
            stroke={GROWTH}
            strokeWidth={5}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - curveP}
            style={{ filter: `drop-shadow(0 0 12px ${GROWTH_GLOW})` }}
          />

          {/* extension pointillée au-delà de 2025 */}
          {frame >= 180 && (
            <line
              x1={xs[n - 1]}
              y1={ys[n - 1]}
              x2={xs[n - 1] + 180 * extP}
              y2={ys[n - 1] - 120 * extP}
              stroke={GROWTH}
              strokeWidth={4}
              strokeDasharray="4 8"
              opacity={0.4}
            />
          )}

          {/* marqueur COVID (année 2020 = index 2) */}
          {frame >= 90 && (
            <g opacity={covidP}>
              <line x1={xs[2]} y1={ys[2]} x2={xs[2]} y2={Y_BASE} stroke={"#8A8F98"} strokeWidth={2} strokeDasharray="3 6" />
            </g>
          )}

          {/* point final */}
          {frame >= 120 && (
            <circle
              cx={xs[n - 1]}
              cy={ys[n - 1]}
              r={14 * endScale}
              fill={GROWTH}
              style={{ filter: `drop-shadow(0 0 18px ${GROWTH_GLOW})` }}
            />
          )}

          {/* ligne de callout */}
          {frame >= 150 && (
            <line
              x1={xs[n - 1]}
              y1={ys[n - 1]}
              x2={xs[n - 1] + 40}
              y2={ys[n - 1] - 120}
              stroke={INK}
              strokeWidth={2}
              opacity={calloutIn}
            />
          )}
        </svg>

        {/* labels années */}
        {years.map((y, i) => {
          const op = interpolate(axisDraw, [i / n, i / n + 0.12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div
              key={y}
              style={{
                position: "absolute",
                left: xs[i] - 40,
                top: Y_BASE + 16,
                width: 80,
                textAlign: "center",
                fontSize: FONT.micro * 0.62,
                fontWeight: 700,
                color: "#8A8F98",
                opacity: op,
              }}
            >
              {y}
            </div>
          );
        })}

        {/* label COVID */}
        {frame >= 100 && (
          <div
            style={{
              position: "absolute",
              left: xs[2] - 50,
              top: (ys[2] + Y_BASE) / 2,
              width: 100,
              textAlign: "center",
              fontSize: FONT.micro * 0.55,
              fontWeight: 700,
              color: "#8A8F98",
              opacity: covidP,
            }}
          >
            {covidLabel}
          </div>
        )}

        {/* bulle callout */}
        {frame >= 150 && (
          <div
            style={{
              position: "absolute",
              left: xs[n - 1] - 40,
              top: ys[n - 1] - 200,
              transform: `translateY(${calloutY}px)`,
              opacity: calloutIn,
              padding: "20px 30px",
              borderRadius: 14,
              background: CARD_BG,
              border: `2px solid ${CARD_BORDER}`,
              fontSize: FONT.label,
              fontWeight: 800,
              color: INK,
              whiteSpace: "nowrap",
            }}
          >
            {calloutText}
          </div>
        )}
      </AbsoluteFill>
    </Stage>
  );
};
