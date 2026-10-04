import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../pdfelement/Stage";
import { StampReveal } from "../freebeat/StampReveal";
import { INK, ALERT, DARK_SCENE, FONT, strokeDashDraw } from "../pdfelement/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const pdfelementAnim09Schema = z.object({
  message: z.string().default("Ne remplace pas un avocat"),
  stampText: z.string().default("Avertissement"),
});

export type PdfelementAnim09Props = z.infer<typeof pdfelementAnim09Schema>;

export const PdfelementAnim09DisclaimerAvocat: React.FC<PdfelementAnim09Props> = ({
  message,
  stampText,
}) => {
  const frame = useCurrentFrame();
  const p = (a: number, b: number) =>
    interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── A : tracé progressif de la balance
  const rod = p(0, 10);
  const bar = p(8, 20);
  const pans = p(16, 30);
  const socle = p(26, 36);

  // ── B : apparition du texte
  const textT = interpolate(frame, [36, 54], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <Stage outFrames={12} bare background={DARK_SCENE}>
      <AbsoluteFill style={{ fontFamily, alignItems: "center", justifyContent: "center" }}>
        {/* ── Balance de justice ── */}
        <svg width={520} height={520} viewBox="0 0 400 400" style={{ marginTop: -80 }}>
          <line
            x1={200}
            y1={70}
            x2={200}
            y2={330}
            stroke={INK}
            strokeWidth={4}
            strokeLinecap="round"
            {...strokeDashDraw(260, rod)}
          />
          <line
            x1={70}
            y1={90}
            x2={330}
            y2={90}
            stroke={INK}
            strokeWidth={4}
            strokeLinecap="round"
            {...strokeDashDraw(260, bar)}
          />
          {/* chaînes + plateaux */}
          <path
            d="M70,90 L70,150 M40,150 Q70,205 100,150"
            fill="none"
            stroke={INK}
            strokeWidth={4}
            strokeLinecap="round"
            {...strokeDashDraw(180, pans)}
          />
          <path
            d="M330,90 L330,150 M300,150 Q330,205 360,150"
            fill="none"
            stroke={INK}
            strokeWidth={4}
            strokeLinecap="round"
            {...strokeDashDraw(180, pans)}
          />
          {/* socle */}
          <path
            d="M160,330 L240,330 L260,355 L140,355 Z"
            fill="none"
            stroke={INK}
            strokeWidth={4}
            strokeLinejoin="round"
            {...strokeDashDraw(320, socle)}
          />
        </svg>

        {/* ── Message du disclaimer ── */}
        <div
          style={{
            position: "absolute",
            top: "74%",
            opacity: textT,
            transform: `translateY(${interpolate(textT, [0, 1], [15, 0])}px)`,
            fontWeight: 800,
            fontSize: FONT.label,
            color: INK,
            textAlign: "center",
          }}
        >
          {message}
        </div>

        {/* ── Tampon d'impact (réutilise le helper freebeat) ── */}
        <StampReveal text={stampText} startFrame={54} color={ALERT} restRotation={-16} />
      </AbsoluteFill>
    </Stage>
  );
};
