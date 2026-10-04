import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsAdobe/Stage";
import { ACCENT, INK, FONT, RAIL_GREY } from "../higgsAdobe/theme";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });

export const higgsAdobeAnim02Schema = z.object({
  question: z.string().default("L'IA va-t-elle remplacer les monteurs vidéo ?"),
});
export type HiggsAdobeAnim02Props = z.infer<typeof higgsAdobeAnim02Schema>;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CX = 960;
const CY = 540;
const N = 60;

const rand = mulberry32(0x9e3779b9);
const MARKS = Array.from({ length: N }).map((_, i) => {
  const startX = 120 + rand() * 1680;
  const startY = 120 + rand() * 840;
  const dist = Math.hypot(startX - CX, startY - CY);
  return {
    id: i,
    startX,
    startY,
    size: 44 + rand() * 84, // agrandi pour lisibilité mobile
    speed: 0.03 + rand() * 0.05,
    phase: rand() * Math.PI * 2,
    amplitude: 10 + rand() * 16,
    baseOpacity: 0.3 + rand() * 0.4,
    lighter: rand() > 0.6,
    dist,
  };
});
const MAX_DIST = Math.max(...MARKS.map((m) => m.dist));

export const HiggsAdobeAnim02QuestionsConvergent: React.FC<HiggsAdobeAnim02Props> = ({
  question,
}) => {
  const frame = useCurrentFrame();
  const words = question.split(" ");

  // Glow pulsant derrière le texte (phase 4)
  const glowPulse = interpolate(
    Math.sin((frame / 60) * Math.PI * 2),
    [-1, 1],
    [0.14, 0.26],
  );

  // Sortie du texte (146 → 165)
  const outT = interpolate(frame, [146, 165], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const textBlur = interpolate(outT, [0, 1], [0, 8]);

  return (
    <Stage>
      {/* Nuage de « ? » */}
      <AbsoluteFill>
        {MARKS.map((m) => {
          // convergence : stagger 0-10 frames selon la distance (les plus loin partent d'abord)
          const stagger = 10 * (1 - m.dist / MAX_DIST);
          const conv = interpolate(frame, [45 + stagger, 69], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.in(Easing.cubic),
          });

          const floatY = Math.sin(frame * m.speed + m.phase) * m.amplitude;
          const rot = Math.sin(frame * m.speed * 0.7 + m.phase) * 8;

          const x = interpolate(conv, [0, 1], [m.startX, CX]);
          const y = interpolate(conv, [0, 1], [m.startY + floatY, CY]);
          const scale = interpolate(conv, [0, 1], [1, 0.2]);
          const opacity = interpolate(conv, [0, 1], [m.baseOpacity, 0]);

          return (
            <span
              key={m.id}
              style={{
                position: "absolute",
                left: x,
                top: y,
                transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`,
                fontFamily,
                fontWeight: 700,
                fontSize: m.size,
                color: m.lighter ? "#9CA3AF" : RAIL_GREY,
                opacity,
              }}
            >
              ?
            </span>
          );
        })}
      </AbsoluteFill>

      {/* Phrase finale mot par mot */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "relative",
            maxWidth: 1400,
            textAlign: "center",
            filter: textBlur > 0.1 ? `blur(${textBlur}px)` : undefined,
            opacity: 1 - outT,
          }}
        >
          {/* glow */}
          <div
            style={{
              position: "absolute",
              inset: "-80px -120px",
              background: `radial-gradient(ellipse at center, ${ACCENT}55, transparent 70%)`,
              opacity: glowPulse,
              filter: "blur(40px)",
            }}
          />
          <div
            style={{
              position: "relative",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "0 20px",
              fontFamily,
              fontWeight: 800,
              fontSize: FONT.label * 1.15,
              color: INK,
              lineHeight: 1.25,
            }}
          >
            {words.map((w, i) => {
              const t = interpolate(frame, [65 + i * 3, 65 + i * 3 + 8], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.back(1.4)),
              });
              return (
                <span
                  key={`${w}-${i}`}
                  style={{
                    display: "inline-block",
                    opacity: interpolate(t, [0, 0.6], [0, 1], { extrapolateRight: "clamp" }),
                    transform: `scale(${interpolate(t, [0, 1], [0.92, 1])})`,
                  }}
                >
                  {w}
                </span>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
