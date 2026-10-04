import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsAfter/Stage";
import { INK, FONT } from "../higgsAfter/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "700"],
  subsets: ["latin"],
});

// Anim 6 — Plan 6 « Checklist floutée en teasing » (165 frames / 5,5s)
// A titre 0–9 · B lignes floutées 9–24 · C ligne 1 se dénette 24–39 ·
// D hold, lignes 2-3 respirent en flou 39–165

export const higgsAfterAnim06Schema = z.object({});
export type HiggsAfterAnim06Props = z.infer<typeof higgsAfterAnim06Schema>;

const LINES = [
  { text: "ChatGPT Pro", locked: false },
  { text: "ChatGPT Desktop installé", locked: true },
  { text: "Un projet After Effects prêt", locked: true },
];

const Checkbox: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div
    style={{
      width: 34,
      height: 34,
      borderRadius: 8,
      border: "2px solid rgba(255,255,255,0.35)",
      opacity,
    }}
  />
);

export const HiggsAfterAnim06ChecklistFloutee: React.FC<
  HiggsAfterAnim06Props
> = () => {
  const frame = useCurrentFrame();

  const titleIn = interpolate(frame, [0, 9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const linesIn = interpolate(frame, [9, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const line1Blur = interpolate(frame, [24, 39], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const breathe = 13 + Math.sin(frame / 20) * 1;

  return (
    <Stage outFrames={2}>
      <AbsoluteFill
        style={{
          background: "#0a0a0c",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 40,
            width: 900,
          }}
        >
          <div
            style={{
              fontFamily,
              fontWeight: 700,
              fontSize: FONT.value,
              color: INK,
              opacity: titleIn,
              transform: `translateY(${(1 - titleIn) * 20}px)`,
            }}
          >
            Ce qu'il te faut
          </div>

          {LINES.map((line, i) => {
            const blur = line.locked ? breathe : line1Blur;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 26,
                  opacity: linesIn,
                }}
              >
                <Checkbox opacity={1} />
                <div
                  style={{
                    fontFamily,
                    fontWeight: 600,
                    fontSize: FONT.label,
                    color: INK,
                    filter: `blur(${Math.max(0, blur)}px)`,
                  }}
                >
                  {line.text}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
