import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsAfter/Stage";
import { ACCENT, INK, FONT } from "../higgsAfter/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["500", "700", "800"],
  subsets: ["latin"],
});

// Anim 5 — Plan 5 « Courbe de la difficulté » (210 frames / 7s)
// A axes 0–12 · B tracé 12–132 (plateau puis léger décollage) ·
// C obstacles 45–69 / 78–102 / 111–132 · D mot final typewriter 132–156 ·
// E hold 156–210

export const higgsAfterAnim05Schema = z.object({});
export type HiggsAfterAnim05Props = z.infer<typeof higgsAfterAnim05Schema>;

const PATH_D =
  "M0,440 C 260,432 520,424 720,414 C 900,405 1030,380 1150,330 C 1260,285 1340,220 1400,180";
const STROKE_LEN = 2200;

const OBSTACLES: {
  x: number;
  y: number;
  label: string;
  frames: [number, number];
}[] = [
  { x: 560, y: 421, label: "Keyframes", frames: [45, 55] },
  { x: 920, y: 402, label: "Courbes de vitesse", frames: [78, 88] },
  { x: 1200, y: 300, label: "Expressions", frames: [111, 121] },
];

const WORD = "très demandant";

export const HiggsAfterAnim05CourbeDifficulte: React.FC<
  HiggsAfterAnim05Props
> = () => {
  const frame = useCurrentFrame();

  const axesIn = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const draw = interpolate(frame, [12, 132], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });
  const offset = STROKE_LEN * (1 - draw);

  return (
    <Stage outFrames={2}>
      <AbsoluteFill
        style={{
          background: "#0a0a0c",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ position: "relative", width: 1500, height: 620 }}>
          <svg
            width={1500}
            height={620}
            viewBox="-40 -60 1500 620"
            style={{ position: "absolute", inset: 0, overflow: "visible" }}
          >
            {/* Axes */}
            <line
              x1={0}
              y1={480}
              x2={1420}
              y2={480}
              stroke="#555"
              strokeWidth={2}
              opacity={axesIn}
            />
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={480}
              stroke="#555"
              strokeWidth={2}
              opacity={axesIn}
            />
            {/* Courbe */}
            <path
              d={PATH_D}
              fill="none"
              stroke={ACCENT}
              strokeWidth={4}
              strokeLinecap="round"
              style={{
                strokeDasharray: STROKE_LEN,
                strokeDashoffset: offset,
                filter: `drop-shadow(0 0 14px ${ACCENT})`,
              }}
            />
          </svg>

          <div
            style={{
              position: "absolute",
              left: 1420,
              top: 486,
              fontFamily,
              fontWeight: 500,
              fontSize: FONT.micro * 0.6,
              color: "#999",
              opacity: axesIn,
            }}
          >
            Temps investi
          </div>
          <div
            style={{
              position: "absolute",
              left: -40,
              top: -50,
              fontFamily,
              fontWeight: 500,
              fontSize: FONT.micro * 0.6,
              color: "#999",
              opacity: axesIn,
            }}
          >
            Qualité du rendu
          </div>

          {OBSTACLES.map((o, i) => {
            const in_ = interpolate(frame, o.frames, [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });
            return (
              <div key={i}>
                <div
                  style={{
                    position: "absolute",
                    left: o.x - 6,
                    top: o.y - 6,
                    width: 12,
                    height: 12,
                    borderRadius: 12,
                    background: ACCENT,
                    opacity: in_,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: o.x - 60,
                    top: o.y - 44 - (1 - in_) * 14,
                    width: 120,
                    textAlign: "center",
                    fontFamily,
                    fontWeight: 500,
                    fontSize: FONT.micro * 0.55,
                    color: "#bbb",
                    opacity: in_,
                  }}
                >
                  {o.label}
                </div>
              </div>
            );
          })}

          {/* Mot final — typewriter */}
          <div
            style={{
              position: "absolute",
              left: 1150,
              top: 120,
              fontFamily,
              fontWeight: 800,
              fontSize: FONT.value,
              color: INK,
              whiteSpace: "nowrap",
            }}
          >
            {WORD.split("").map((ch, i) => {
              const chFrame = 132 + i * 1.2;
              const op = interpolate(frame, [chFrame, chFrame + 2], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <span key={i} style={{ opacity: op }}>
                  {ch}
                </span>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
