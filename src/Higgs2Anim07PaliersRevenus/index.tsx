import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgs2/Stage";
import { ACCENT, INK, MONEY_GREEN, FONT } from "../higgs2/theme";

const { fontFamily } = loadFont("normal", { weights: ["600", "800"], subsets: ["latin"] });

export const higgs2Anim07Schema = z.object({
  niches: z.array(z.string()).default(["Lifestyle", "Tech", "Make Money"]),
  viewRatio: z.number().default(420),
});

export type Higgs2Anim07Props = z.infer<typeof higgs2Anim07Schema>;

const STOP_STARTS = [63, 129, 198];
const FADE_STARTS = [93, 159, 9999];
const FRAME_W = 640;
const FRAME_H = 300;
const PERIM = 2 * (FRAME_W + FRAME_H);

// Format compact FR pour garder les gros nombres larges mais lisibles : 2 100 000 -> "2,1 M"
const compact = (n: number): string => {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `${m.toFixed(m < 10 ? 1 : 0).replace(".", ",")} M`;
  }
  if (n >= 1_000) {
    const k = n / 1_000;
    return `${k.toFixed(k < 10 ? 1 : 0).replace(".", ",")} k`;
  }
  return String(Math.round(n));
};

const Counter: React.FC<{
  text: string;
  unit: string;
  color: string;
  intro: number;
  digitScale: number;
}> = ({ text, unit, color, intro, digitScale }) => (
  <div
    style={{
      opacity: intro,
      transform: `translateY(${interpolate(intro, [0, 1], [15, 0], { extrapolateRight: "clamp" })}px)`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
    }}
  >
    <div
      style={{
        fontFamily,
        fontWeight: 800,
        fontSize: FONT.counter,
        color,
        fontVariantNumeric: "tabular-nums",
        transform: `scale(${digitScale})`,
        letterSpacing: "-2px",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
    <div style={{ fontFamily, fontWeight: 700, fontSize: FONT.micro, color: "#94A3B8" }}>{unit}</div>
  </div>
);

export const Higgs2Anim07PaliersRevenus: React.FC<Higgs2Anim07Props> = ({ niches, viewRatio }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const introL = spring({ frame, fps, config: { damping: 15, stiffness: 140 } });
  const introR = spring({ frame: frame - 3, fps, config: { damping: 15, stiffness: 140 } });

  const euros = interpolate(
    frame,
    [18, 63, 93, 129, 159, 198],
    [0, 1000, 1000, 2000, 2000, 5000],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const views = Math.round(euros * viewRatio);

  const digitScale = interpolate(frame, [159, 198], [1, 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // flash blanc à chaque palier
  const flash = STOP_STARTS.reduce((acc, s, i) => {
    const peak = i === 2 ? 1 : 0.8;
    return (
      acc +
      interpolate(frame, [s, s + 1, s + 4], [0, peak, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    );
  }, 0);

  const breath = frame >= 198 ? 1 + Math.sin(frame / 18) * 0.12 : 0;

  // libellé de niche
  const curIdx = frame < 63 ? 0 : frame < 129 ? 1 : 2;
  const curStart = [-999, 63, 129][curIdx];
  const entryT = interpolate(frame, [curStart, curStart + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const showPrev = curIdx > 0 && frame < curStart + 6;

  return (
    <Stage outFrames={30}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 110 }}>
          <Counter text={compact(views)} unit="vues" color="#E5E5E7" intro={introL} digitScale={digitScale} />
          <div style={{ width: 3, height: 260, background: "rgba(255,255,255,0.18)" }} />
          <div style={{ position: "relative" }}>
            <Counter
              text={`${Math.round(euros).toLocaleString("fr-FR")} €`}
              unit="par mois"
              color={MONEY_GREEN}
              intro={introR}
              digitScale={digitScale}
            />
            {/* cadres lumineux par palier */}
            <svg
              width={FRAME_W}
              height={FRAME_H}
              viewBox={`0 0 ${FRAME_W} ${FRAME_H}`}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                overflow: "visible",
              }}
            >
              {STOP_STARTS.map((s, i) => {
                const draw = interpolate(frame, [s, s + 9], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                const fade = interpolate(frame, [FADE_STARTS[i], FADE_STARTS[i] + 10], [1, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                if (draw <= 0) return null;
                const last = i === 2;
                return (
                  <rect
                    key={i}
                    x={2}
                    y={2}
                    width={FRAME_W - 4}
                    height={FRAME_H - 4}
                    rx={18}
                    fill="none"
                    stroke={ACCENT}
                    strokeWidth={last ? 4 + breath * 2 : 2.5}
                    strokeDasharray={PERIM}
                    strokeDashoffset={PERIM * (1 - draw)}
                    opacity={fade}
                    style={{
                      filter: `drop-shadow(0 0 ${last ? 16 + breath * 8 : 8}px ${ACCENT})`,
                    }}
                  />
                );
              })}
            </svg>
          </div>
        </div>

        {/* étiquette de niche */}
        <div style={{ position: "relative", height: 100, marginTop: 110, width: 900, textAlign: "center" }}>
          {showPrev && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                fontFamily,
                fontWeight: 600,
                fontSize: FONT.label,
                color: "#94A3B8",
                opacity: 1 - entryT,
                transform: `translateY(${-8 * entryT}px)`,
              }}
            >
              {niches[curIdx - 1]}
            </div>
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              fontFamily,
              fontWeight: 600,
              fontSize: FONT.label,
              color: ACCENT,
              opacity: entryT,
              transform: `translateY(${8 * (1 - entryT)}px)`,
            }}
          >
            {niches[curIdx]}
          </div>
        </div>
      </AbsoluteFill>

      {/* flash blanc global sur les compteurs */}
      <AbsoluteFill style={{ background: INK, opacity: Math.min(1, flash), pointerEvents: "none" }} />
    </Stage>
  );
};
