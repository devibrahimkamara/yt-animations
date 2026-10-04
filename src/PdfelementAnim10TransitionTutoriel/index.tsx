import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../pdfelement/Stage";
import { WIPE, INK } from "../pdfelement/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

const W = 3200; // largeur du volet (large pour couvrir tout le cadre en diagonale)
const SKEW = 480; // décalage X entre haut et bas → bord diagonal constant

export const pdfelementAnim10Schema = z.object({
  word: z.string().default("TUTORIEL"),
});

export type PdfelementAnim10Props = z.infer<typeof pdfelementAnim10Schema>;

export const PdfelementAnim10TransitionTutoriel: React.FC<PdfelementAnim10Props> = ({ word }) => {
  const frame = useCurrentFrame();

  // Position globale du volet (le bord diagonal garde le même angle).
  let s: number;
  if (frame <= 21) {
    s = interpolate(frame, [0, 21], [-W, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.cubic),
    });
  } else if (frame <= 39) {
    s = 0; // recouvrement total
  } else {
    s = interpolate(frame, [39, 60], [0, W], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
  }

  const clip = `polygon(${s}px 0, ${s + W}px 0, ${s + W - SKEW}px 100%, ${s - SKEW}px 100%)`;

  // Texte « TUTORIEL » — variante robuste : blanc plein, fondu calé sur la
  // fenêtre de recouvrement (plus fiable que mix-blend-mode au rendu).
  const wordOpacity = interpolate(frame, [18, 22, 38, 42], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage outFrames={3} bare>
      <AbsoluteFill style={{ fontFamily }}>
        <div style={{ position: "absolute", inset: 0, background: WIPE, clipPath: clip }} />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <span
            style={{
              fontWeight: 800,
              fontSize: 104,
              letterSpacing: "6px",
              color: INK,
              opacity: wordOpacity,
            }}
          >
            {word}
          </span>
        </AbsoluteFill>
      </AbsoluteFill>
    </Stage>
  );
};
