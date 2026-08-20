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
import { measureText } from "@remotion/layout-utils";
import { ATMOS_GOLD, strokeDashDraw } from "../AtmosOverlay/theme";
import { AtmosBackground } from "../AtmosOverlay/AtmosBackground";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });

export const atmosAnim17Schema = z.object({
  text: z.string().default("PASSER À L'ACTION"),
  durationSecs: z.number().default(3),
});

export type AtmosAnim17Props = z.infer<typeof atmosAnim17Schema>;

const FONT_SIZE = 92;
const LETTER_SPACING = 2;

export const AtmosAnim17KeywordIsolate: React.FC<AtmosAnim17Props> = ({
  text,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const vignetteOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const chars = text.split("");
  const charWidths = chars.map(
    (c) =>
      measureText({
        text: c === " " ? " " : c,
        fontFamily,
        fontSize: FONT_SIZE,
        fontWeight: 800,
        letterSpacing: `${LETTER_SPACING}px`,
      }).width,
  );
  const totalWidth = charWidths.reduce((a, b) => a + b, 0);
  const cumulativeOffsets = charWidths.reduce<number[]>((acc, w, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + charWidths[i - 1]);
    return acc;
  }, []);

  const underlineProgress = interpolate(frame, [50, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const glowOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AtmosBackground />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.75) 70%)`,
          opacity: vignetteOpacity,
        }}
      />

      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: totalWidth, height: FONT_SIZE * 1.2 }}>
          {chars.map((char, i) => {
            const charStart = 15 + i * 1.8;
            const local = frame - charStart;
            if (local < -1) return null;

            const opacity = interpolate(local, [0, 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.quad),
            });
            const translateY = interpolate(local, [0, 10], [20, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const charSpring = spring({
              frame: local,
              fps,
              config: { damping: 9, mass: 0.5, stiffness: 170 },
            });
            const scale = interpolate(charSpring, [0, 1], [0.5, 1]);

            return (
              <span
                key={i}
                style={{
                  position: "absolute",
                  left: cumulativeOffsets[i],
                  top: 0,
                  display: "inline-block",
                  opacity,
                  transform: `translateY(${translateY}px) scale(${scale})`,
                  fontFamily,
                  fontWeight: 800,
                  fontSize: FONT_SIZE,
                  letterSpacing: `${LETTER_SPACING}px`,
                  color: ATMOS_GOLD,
                  textTransform: "uppercase",
                  textShadow: `0px 0px 45px rgba(255, 215, 0, ${0.4 * glowOpacity})`,
                  whiteSpace: "pre",
                }}
              >
                {char}
              </span>
            );
          })}

          <svg
            width={totalWidth + 40}
            height={20}
            style={{ position: "absolute", left: -20, top: FONT_SIZE * 1.05, overflow: "visible" }}
          >
            <line
              x1={20}
              y1={5}
              x2={totalWidth + 20}
              y2={5}
              stroke={ATMOS_GOLD}
              strokeWidth={6}
              strokeLinecap="round"
              style={strokeDashDraw(totalWidth, underlineProgress)}
            />
          </svg>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
