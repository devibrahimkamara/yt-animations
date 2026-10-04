import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../maxdrop/Stage";
import { Emoji } from "../higgs2/Emoji";
import { MAXDROP_BLUE, INK, DARK_SCENE, FONT } from "../maxdrop/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const maxdropAnim16Schema = z.object({
  formats: z
    .array(z.object({ label: z.string(), emoji: z.string() }))
    .default([
      { label: "Capsules", emoji: "💊" },
      { label: "Tablettes", emoji: "🟠" },
      { label: "Poudre", emoji: "🥄" },
      { label: "Gummies", emoji: "🐻" },
      { label: "Energy drink", emoji: "🥤" },
    ]),
  finalText: z.string().default("Tous les formats."),
});
export type MaxdropAnim16Props = z.infer<typeof maxdropAnim16Schema>;

const CX = 960;
const CY = 500;
const SPACING = 520;
const ICON_SIZE = 170;

const KEYS: [number, number][] = [
  [30, 0],
  [66, 0],
  [96, 1],
  [132, 1],
  [162, 2],
  [198, 2],
  [228, 3],
  [264, 3],
  [294, 4],
  [318, 4],
  [330, 4],
  [348, 10],
];

function railOffset(frame: number): number {
  if (frame <= KEYS[0][0]) return 0;
  for (let i = 0; i < KEYS.length - 1; i++) {
    const [f0, v0] = KEYS[i];
    const [f1, v1] = KEYS[i + 1];
    if (frame >= f0 && frame < f1) {
      const ease = i === KEYS.length - 2 ? Easing.in(Easing.cubic) : Easing.inOut(Easing.cubic);
      return interpolate(frame, [f0, f1], [v0, v1], { easing: ease });
    }
  }
  return KEYS[KEYS.length - 1][1];
}

export const MaxdropAnim16CarrouselFormats: React.FC<MaxdropAnim16Props> = ({ formats, finalText }) => {
  const frame = useCurrentFrame();
  const offset = railOffset(frame);

  const globalBlur = interpolate(frame, [345, 360], [0, 8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const finalIn = interpolate(frame, [342, 356], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const finalScale = interpolate(finalIn, [0, 1], [0.95, 1]);

  return (
    <Stage bare background={DARK_SCENE} outFrames={12}>
      <AbsoluteFill style={{ fontFamily }}>
        <div style={{ position: "absolute", inset: 0, filter: `blur(${globalBlur}px)` }}>
          {formats.map((fmt, i) => {
            const dist = Math.abs(i - offset);
            const x = CX + (i - offset) * SPACING;
            const scale = Math.max(0.4, 1 - dist * 0.45);
            const blur = Math.min(6, dist * 3);
            const opacity = Math.max(0, 1 - dist * 0.5);
            const isCenter = dist < 0.35 && frame < 336;

            // micro-anim gélatineuse pour les gummies au centre
            const jelly =
              fmt.label.toLowerCase().includes("gumm") && isCenter
                ? 1 + 0.06 * Math.sin(frame / 5)
                : 1;

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: x,
                  top: CY,
                  transform: `translate(-50%,-50%) scale(${scale}) scaleY(${jelly}) scaleX(${2 - jelly})`,
                  filter: `blur(${blur}px)`,
                  opacity,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 300,
                    height: 300,
                    borderRadius: 28,
                    background: "rgba(255,255,255,0.05)",
                    border: `2px solid ${isCenter ? MAXDROP_BLUE : "rgba(255,255,255,0.12)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Emoji size={ICON_SIZE}>{fmt.emoji}</Emoji>
                </div>
                {isCenter && (
                  <div
                    style={{
                      marginTop: 28,
                      fontSize: FONT.label,
                      fontWeight: 800,
                      color: INK,
                    }}
                  >
                    {fmt.label}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* texte final net */}
        {frame >= 340 && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: CY - 60,
              textAlign: "center",
              fontSize: FONT.counter,
              fontWeight: 800,
              color: INK,
              opacity: finalIn,
              transform: `scale(${finalScale})`,
            }}
          >
            {finalText}
          </div>
        )}
      </AbsoluteFill>
    </Stage>
  );
};
