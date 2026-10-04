import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsMarketing/Stage";
import { IconChatMark } from "../higgsMarketing/icons";
import { CHATGPT_TEAL, FONT, INK, NEUTRAL_BORDER, NEUTRAL_PANEL, mulberry32 } from "../higgsMarketing/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});

// Anim 6 — « L'implosion des outils » (180 frames / 6 s @ 30 fps)
// Phase 1 apparition 0–30 · Phase 2 flottement + liaisons 25–75 ·
// Phase 3 coupure 75–105 · Phase 4 convergence 100–140 ·
// Phase 5 flash + fusion 135–155 · Phase 6 maintien 155–180

export const higgsMarketingAnim06Schema = z.object({
  finalTool: z.string().default("ChatGPT"),
  finalMessage: z.string().default("1 seul outil"),
});
export type HiggsMarketingAnim06Props = z.infer<
  typeof higgsMarketingAnim06Schema
>;

const LABELS = ["Image", "Voix", "Lip-sync", "Montage", "Script", "Musique"];
const CENTER = { x: 960, y: 540 };
const rng = mulberry32(6001);
const BASE_POS = [
  { x: 560, y: 320 },
  { x: 1280, y: 300 },
  { x: 1420, y: 620 },
  { x: 1100, y: 800 },
  { x: 620, y: 780 },
  { x: 460, y: 560 },
].map((p) => ({ ...p, freqX: 0.02 + rng() * 0.02, freqY: 0.018 + rng() * 0.02, ampX: 20 + rng() * 15, ampY: 18 + rng() * 15, phase: rng() * 10 }));

const CHIP_ICON_SIZE = 100;

const CONNECTIONS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 0],
  [0, 3],
  [1, 4],
];

export const HiggsMarketingAnim06ImplosionOutils: React.FC<
  HiggsMarketingAnim06Props
> = ({ finalTool, finalMessage }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bubblePos = BASE_POS.map((b) => {
    const floatX = frame >= 25 && frame < 100 ? Math.sin(frame * b.freqX + b.phase) * b.ampX : 0;
    const floatY = frame >= 25 && frame < 100 ? Math.sin(frame * b.freqY + b.phase * 1.3) * b.ampY : 0;
    return { x: b.x + floatX, y: b.y + floatY };
  });

  const convergeStart = 100;
  const convergedPos = bubblePos.map((p, i) => {
    const delay = convergeStart + i * 3;
    const s = spring({ frame: frame - delay, fps, config: { damping: 9, stiffness: 90 } });
    if (frame < delay) return p;
    return {
      x: p.x + (CENTER.x - p.x) * s,
      y: p.y + (CENTER.y - p.y) * s,
    };
  });
  const convergeScale = bubblePos.map((_, i) => {
    const delay = convergeStart + i * 3;
    const s = spring({ frame: frame - delay, fps, config: { damping: 9, stiffness: 90 } });
    return frame < delay ? 1 : interpolate(s, [0, 1], [1, 0.35]);
  });

  const flashOpacity = interpolate(frame, [135, 142, 150], [0, 0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const chipSpring = spring({ frame: frame - 143, fps, config: { damping: 12, stiffness: 200 } });
  const chipScale = interpolate(chipSpring, [0, 1], [1.3, 1]);
  const chipOpacity = interpolate(frame, [143, 149], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const chipGlow = frame >= 155 ? 0.5 + Math.sin((frame - 155) * 0.15) * 0.2 : 0.5;
  const msgOpacity = interpolate(frame, [150, 160], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage outFrames={10}>
      <AbsoluteFill style={{ fontFamily }}>
        {frame < 150 && (
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            {CONNECTIONS.map(([a, b], i) => {
              const cutFrame = 75 + i * 4;
              if (frame >= cutFrame + 10 || frame >= 100) return null;
              const pa = bubblePos[a];
              const pb = bubblePos[b];
              const mx = (pa.x + pb.x) / 2;
              const my = (pa.y + pb.y) / 2;
              const retract =
                frame >= cutFrame
                  ? interpolate(frame, [cutFrame, cutFrame + 8], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    })
                  : 0;
              const opacity = frame >= cutFrame + 8 ? 0 : 1;
              return (
                <g key={i} opacity={opacity}>
                  <line
                    x1={pa.x}
                    y1={pa.y}
                    x2={mx + (pa.x - mx) * retract}
                    y2={my + (pa.y - my) * retract}
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth={2}
                  />
                  <line
                    x1={pb.x}
                    y1={pb.y}
                    x2={mx + (pb.x - mx) * retract}
                    y2={my + (pb.y - my) * retract}
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth={2}
                  />
                  {frame >= cutFrame && frame < cutFrame + 6 && (
                    <circle cx={mx} cy={my} r={8} fill="#fff" opacity={1 - (frame - cutFrame) / 6} />
                  )}
                </g>
              );
            })}
          </svg>
        )}

        {frame < 150 &&
          BASE_POS.map((_, i) => {
            const delay = i * 4;
            const s = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 150 } });
            const scale = interpolate(s, [0, 1], [0, 1]) * convergeScale[i];
            const opacity = interpolate(frame, [delay, delay + 6], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const pos = frame >= convergeStart ? convergedPos[i] : bubblePos[i];
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: pos.x - 90,
                  top: pos.y - 45,
                  width: 180,
                  height: 90,
                  borderRadius: 45,
                  background: NEUTRAL_PANEL,
                  border: `1px solid ${NEUTRAL_BORDER}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: INK,
                  fontWeight: 700,
                  fontSize: FONT.micro * 0.5,
                  transform: `scale(${scale}) rotate(${frame >= convergeStart ? (frame - convergeStart) * 3 : 0}deg)`,
                  opacity,
                }}
              >
                {LABELS[i]}
              </div>
            );
          })}

        <AbsoluteFill style={{ background: "#fff", opacity: flashOpacity }} />

        {frame >= 143 && (
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 28,
                opacity: chipOpacity,
                transform: `scale(${chipScale})`,
              }}
            >
              <div
                style={{
                  width: 220,
                  height: 220,
                  borderRadius: "50%",
                  background: CHATGPT_TEAL,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 0 90px rgba(16,163,127,${chipGlow})`,
                }}
              >
                <IconChatMark size={CHIP_ICON_SIZE} color="#fff" strokeWidth={4} />
              </div>
              <div style={{ fontSize: FONT.label, fontWeight: 700, color: INK }}>{finalTool}</div>
              <div
                style={{
                  fontSize: FONT.value,
                  fontWeight: 800,
                  color: INK,
                  opacity: msgOpacity,
                }}
              >
                {finalMessage}
              </div>
            </div>
          </AbsoluteFill>
        )}
      </AbsoluteFill>
    </Stage>
  );
};
