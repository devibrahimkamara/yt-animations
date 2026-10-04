import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../freebeat/Stage";
import { AnimatedLetter } from "../freebeat/AnimatedLetter";
import { ACCENT, INK, FONT } from "../freebeat/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const freebeatAnim01Schema = z.object({
  topWord: z.string().default("BUSINESS"),
  year: z.string().default("2026"),
});

export type FreebeatAnim01Props = z.infer<typeof freebeatAnim01Schema>;

const SVG_W = 1760;
const SVG_H = 520;
const YEAR_FS = 500;

export const FreebeatAnim01MasqueTypo2026: React.FC<FreebeatAnim01Props> = ({ topWord, year }) => {
  const frame = useCurrentFrame();

  // ── Contour de "2026" : opacité 0 → 1 (frames 36-41)
  const outlineOpacity = interpolate(frame, [36, 41], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Remplissage liquide (frames 36-70), easeInOut
  const fillProgress = interpolate(frame, [36, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const fillTop = SVG_H * (1 - fillProgress);

  // ── Flash d'impact (frames 75-78)
  const flash = interpolate(frame, [75, 76, 78], [0, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Respiration lente de la couleur après le hold
  const breathe = frame >= 78 ? 0.975 + 0.025 * Math.cos((frame - 78) / 18) : 1;

  return (
    <Stage outFrames={12}>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 40,
        }}
      >
        {/* BUSINESS — lettre par lettre */}
        <div style={{ display: "flex", letterSpacing: 16 }}>
          {topWord.split("").map((c, i) => (
            <AnimatedLetter
              key={i}
              char={c}
              delay={i * 3}
              fontFamily={fontFamily}
              fontSize={FONT.counter}
              color={INK}
            />
          ))}
        </div>

        {/* 2026 — contour creux puis remplissage liquide */}
        <svg
          width={SVG_W}
          height={SVG_H}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ opacity: outlineOpacity }}
        >
          <defs>
            <clipPath id="yearClip">
              <text
                x={SVG_W / 2}
                y={SVG_H / 2}
                textAnchor="middle"
                dominantBaseline="central"
                style={{ fontFamily, fontWeight: 800, fontSize: YEAR_FS }}
              >
                {year}
              </text>
            </clipPath>
          </defs>

          {/* contour creux */}
          <text
            x={SVG_W / 2}
            y={SVG_H / 2}
            textAnchor="middle"
            dominantBaseline="central"
            style={{ fontFamily, fontWeight: 800, fontSize: YEAR_FS }}
            fill="none"
            stroke={ACCENT}
            strokeWidth={5}
          >
            {year}
          </text>

          {/* remplissage */}
          <g clipPath="url(#yearClip)" style={{ opacity: breathe }}>
            <rect x={0} y={fillTop} width={SVG_W} height={SVG_H - fillTop} fill={ACCENT} />
          </g>
        </svg>
      </AbsoluteFill>

      <AbsoluteFill style={{ background: INK, opacity: flash }} />
    </Stage>
  );
};
