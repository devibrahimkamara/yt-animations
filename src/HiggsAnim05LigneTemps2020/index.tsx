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
import { Stage } from "../higgs/Stage";
import { RevealText } from "../higgs/RevealText";
import { ACCENT, INK, FONT } from "../higgs/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const higgsAnim05Schema = z.object({
  years: z.array(z.number()).default([2020, 2021, 2022, 2023, 2024, 2025, 2026]),
  centerYear: z.number().default(2026),
  finalText: z.string().default("6 ANS SUR INTERNET"),
});

export type HiggsAnim05Props = z.infer<typeof higgsAnim05Schema>;

const SPACING = 470;
const AXIS_Y = 430;
const SCROLL_END = 90;
const CENTER_X = 960;

export const HiggsAnim05LigneTemps2020: React.FC<HiggsAnim05Props> = ({
  years,
  centerYear,
  finalText,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const centerIdx = Math.max(0, years.indexOf(centerYear));
  const travel = -centerIdx * SPACING;

  const tx = interpolate(frame, [0, SCROLL_END], [0, travel], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const pulse = spring({ frame: frame - SCROLL_END, fps, config: { damping: 8, stiffness: 240 } });
  const pointScale = frame >= SCROLL_END
    ? interpolate(pulse, [0, 0.5, 1], [1, 1.3, 1], { extrapolateRight: "clamp" })
    : 1;

  return (
    <Stage outFrames={12}>
      <AbsoluteFill>
        {/* décor parallax (0.6x) */}
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${tx * 0.6}px)` }}>
          {Array.from({ length: 40 }, (_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: i * 260 - 2000,
                top: 0,
                width: 2,
                height: 1080,
                background: "rgba(255,255,255,0.05)",
              }}
            />
          ))}
        </div>

        {/* axe */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: AXIS_Y,
            height: 4,
            background: "rgba(255,255,255,0.18)",
          }}
        />

        {/* piste des années */}
        <div style={{ position: "absolute", left: CENTER_X, top: AXIS_Y, transform: `translateX(${tx}px)` }}>
          {years.map((year, i) => {
            const dist = Math.abs(i * SPACING + tx);
            const k = interpolate(dist, [0, 700], [1, 0], { extrapolateRight: "clamp" });
            const isCenter = frame >= SCROLL_END - 4 && year === centerYear && dist < 40;
            const past = i * SPACING + tx < -20;
            return (
              <span
                key={year}
                style={{
                  position: "absolute",
                  left: i * SPACING,
                  top: 40,
                  transform: `translateX(-50%) scale(${interpolate(k, [0, 1], [0.55, 1.15])})`,
                  fontFamily,
                  fontWeight: 800,
                  fontSize: FONT.counter,
                  color: isCenter ? ACCENT : INK,
                  opacity: interpolate(k, [0, 1], [0.18, past && !isCenter ? 0.4 : 1]),
                  whiteSpace: "nowrap",
                }}
              >
                {year}
              </span>
            );
          })}
        </div>

        {/* point fixe central */}
        <div
          style={{
            position: "absolute",
            left: CENTER_X,
            top: AXIS_Y,
            width: 34,
            height: 34,
            marginLeft: -17,
            marginTop: -17,
            borderRadius: "50%",
            background: ACCENT,
            transform: `scale(${pointScale})`,
            boxShadow: `0 0 30px ${ACCENT}, 0 0 70px ${ACCENT}88`,
          }}
        />

        {/* texte final */}
        {frame >= 100 && (
          <div style={{ position: "absolute", left: 0, right: 0, top: AXIS_Y + 340 }}>
            <RevealText
              text={finalText}
              startFrame={100}
              fontFamily={fontFamily}
              fontSize={FONT.label}
              color={INK}
            />
          </div>
        )}
      </AbsoluteFill>
    </Stage>
  );
};
