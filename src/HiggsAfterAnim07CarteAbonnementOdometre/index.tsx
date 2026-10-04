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
import { Stage } from "../higgsAfter/Stage";
import { ASTRA_TEAL, INK, FONT } from "../higgsAfter/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});

// Anim 7 — Plan 7 « Carte pricing + odomètre » (240 frames / 8s)
// A carte se pose 0–30 · B badge tombe/rebondit 42–66 ·
// C odomètre 00→20 84–159/159 · D "$/mois" 159–174 · E hold 174–240

export const higgsAfterAnim07Schema = z.object({});
export type HiggsAfterAnim07Props = z.infer<typeof higgsAfterAnim07Schema>;

const DIGIT_H = 120;

const DigitReel: React.FC<{ pos: number }> = ({ pos }) => (
  <div
    style={{
      width: 100,
      height: DIGIT_H,
      overflow: "hidden",
      position: "relative",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        transform: `translateY(${-pos * DIGIT_H}px)`,
      }}
    >
      {new Array(11).fill(0).map((_, d) => (
        <div
          key={d}
          style={{
            height: DIGIT_H,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily,
            fontWeight: 800,
            fontSize: FONT.hero,
            color: INK,
          }}
        >
          {d % 10}
        </div>
      ))}
    </div>
  </div>
);

export const HiggsAfterAnim07CarteAbonnementOdometre: React.FC<
  HiggsAfterAnim07Props
> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rotX = interpolate(frame, [0, 30], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const cardIn = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const badgeSpring = spring({
    frame: frame - 42,
    fps,
    config: { damping: 8, stiffness: 150, mass: 1 },
  });
  const badgeY = interpolate(badgeSpring, [0, 1], [-320, 0]);
  const badgeOpacity = interpolate(frame, [42, 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tensCount = interpolate(frame, [84, 150], [0, 20], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });
  const unitsCount = interpolate(frame, [84, 159], [0, 20], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });
  const tensPos = tensCount / 10;
  const unitsPos = unitsCount % 10;

  const labelIn = interpolate(frame, [159, 174], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage outFrames={2}>
      <AbsoluteFill
        style={{
          background: "#0a0a0c",
          alignItems: "center",
          justifyContent: "center",
          perspective: 1000,
        }}
      >
        <div
          style={{
            width: 700,
            height: 780,
            borderRadius: 40,
            background: "linear-gradient(160deg, #1c1c22 0%, #0e0e12 100%)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 50px 100px rgba(0,0,0,0.55)",
            transform: `rotateX(${rotX}deg)`,
            opacity: cardIn,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 30,
          }}
        >
          {/* Badge */}
          <div
            style={{
              position: "absolute",
              top: 90,
              transform: `translateY(${badgeY}px)`,
              opacity: badgeOpacity,
              background: `${ASTRA_TEAL}22`,
              border: `2px solid ${ASTRA_TEAL}`,
              borderRadius: 999,
              padding: "14px 32px",
              fontFamily,
              fontWeight: 700,
              fontSize: FONT.micro,
              color: ASTRA_TEAL,
              whiteSpace: "nowrap",
            }}
          >
            GPT-6 Astra
          </div>

          {/* Odomètre */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginTop: 60,
            }}
          >
            <DigitReel pos={tensPos} />
            <DigitReel pos={unitsPos} />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 10,
              opacity: labelIn,
              transform: `translateX(${(1 - labelIn) * -16}px)`,
              fontFamily,
              fontWeight: 700,
              fontSize: FONT.label,
              color: INK,
            }}
          >
            $ / mois
          </div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
