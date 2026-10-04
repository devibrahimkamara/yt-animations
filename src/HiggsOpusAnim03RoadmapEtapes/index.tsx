import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsOpus/Stage";
import { ACCENT, FONT, INK, NEUTRAL_BORDER } from "../higgsOpus/theme";
import { ShakeWrapper } from "../higgsOpus/utils";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});

// Anim 3 — « La roadmap étape par étape » (180 frames / 6 s @ 30 fps)
// Phase 1 cadre 0–10 · Phase 2 ligne+étape1 10–45 · Phase 3 étape2 45–80 ·
// Phase 4 étape3 80–115 · Phase 5 étape4 115–150 · Phase 6 tampon final 150–180

export const higgsOpusAnim03Schema = z.object({
  steps: z
    .array(z.string())
    .default(["Le prompt", "La connexion MCP", "La génération", "Le résultat"]),
  finalBadge: z.string().default("RÉPLICABLE PAR TOI AUSSI"),
});
export type HiggsOpusAnim03Props = z.infer<typeof higgsOpusAnim03Schema>;

const STEP_Y = [190, 400, 610, 820];
const LINE_X = 300;
const LINE_TOP = 150;
const LINE_BOTTOM = 870;
const LINE_SEGMENTS = [
  [10, 25],
  [45, 60],
  [80, 95],
  [115, 130],
] as const;
const CHECKPOINT_FRAMES = [22, 58, 93, 128];
const LABEL_RANGES = [
  [25, 33],
  [60, 68],
  [95, 103],
  [130, 138],
] as const;
const PASS_FRAMES = [45, 80, 115, 150];

export const HiggsOpusAnim03RoadmapEtapes: React.FC<HiggsOpusAnim03Props> = ({
  steps,
  finalBadge,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineProgress = LINE_SEGMENTS.reduce((acc, [start, end], i) => {
    const p = interpolate(frame, [start, end], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return Math.max(acc, (i + p) / LINE_SEGMENTS.length);
  }, 0);

  const stampSpring = spring({
    frame: frame - 150,
    fps,
    config: { damping: 15, stiffness: 400 },
  });
  const stampScale = interpolate(stampSpring, [0, 1], [1.8, 1]);
  const stampOpacity = interpolate(frame, [150, 158], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage>
      <AbsoluteFill style={{ fontFamily }}>
        <ShakeWrapper startFrame={158} durationFrames={6} amplitude={5} seed={42}>
          <AbsoluteFill>
            <svg width={1920} height={1080} style={{ position: "absolute" }}>
              <line
                x1={LINE_X}
                y1={LINE_TOP}
                x2={LINE_X}
                y2={LINE_BOTTOM}
                stroke={NEUTRAL_BORDER}
                strokeWidth={3}
                opacity={interpolate(frame, [0, 10], [0, 0.3], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })}
              />
              <line
                x1={LINE_X}
                y1={LINE_TOP}
                x2={LINE_X}
                y2={interpolate(lineProgress, [0, 1], [LINE_TOP, LINE_BOTTOM])}
                stroke={ACCENT}
                strokeWidth={3}
                style={{ filter: `drop-shadow(0 0 6px ${ACCENT})` }}
              />
            </svg>

            {steps.map((label, i) => {
              const cpFrame = CHECKPOINT_FRAMES[i];
              const cpSpring = spring({
                frame: frame - cpFrame,
                fps,
                config: { damping: 10, stiffness: 250 },
              });
              const cpScale = interpolate(cpSpring, [0, 1], [0.6, 1]);
              const active = frame >= cpFrame;
              const passed = frame >= PASS_FRAMES[i];
              const isLast = i === steps.length - 1;
              const opacity = passed ? interpolate(frame, [PASS_FRAMES[i], PASS_FRAMES[i] + 5], [1, 0.5], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }) : 1;
              const [labelStart, labelEnd] = LABEL_RANGES[i];
              const labelOpacity = interpolate(frame, [labelStart, labelEnd], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const labelX = interpolate(frame, [labelStart, labelEnd], [-20, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <div key={label} style={{ position: "absolute", left: LINE_X, top: STEP_Y[i] }}>
                  <div
                    style={{
                      position: "absolute",
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      transform: `translate(-25px, -25px) scale(${active ? cpScale : 1})`,
                      background: active ? ACCENT : "transparent",
                      border: `2px solid ${active ? ACCENT : NEUTRAL_BORDER}`,
                      boxShadow: active
                        ? `0 0 ${isLast ? 40 : 20}px ${ACCENT}${isLast ? "cc" : "80"}`
                        : "none",
                      opacity: active ? opacity : 0.4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: INK,
                      fontWeight: 800,
                      fontSize: FONT.micro * 0.7,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: 44,
                      top: -22,
                      color: INK,
                      fontWeight: 700,
                      fontSize: FONT.value,
                      whiteSpace: "nowrap",
                      opacity: labelOpacity * (active ? opacity : 1),
                      transform: `translateX(${labelX}px)`,
                    }}
                  >
                    {label}
                  </div>
                </div>
              );
            })}

            {frame >= 150 && (
              <div
                style={{
                  position: "absolute",
                  right: 90,
                  top: 900,
                  width: 620,
                  padding: "24px 20px",
                  border: `4px solid ${ACCENT}`,
                  borderRadius: 16,
                  color: ACCENT,
                  fontWeight: 800,
                  fontSize: FONT.micro,
                  textAlign: "center",
                  lineHeight: 1.15,
                  transform: `rotate(-5deg) scale(${stampScale})`,
                  opacity: stampOpacity,
                }}
              >
                {finalBadge}
              </div>
            )}
          </AbsoluteFill>
        </ShakeWrapper>
      </AbsoluteFill>
    </Stage>
  );
};
