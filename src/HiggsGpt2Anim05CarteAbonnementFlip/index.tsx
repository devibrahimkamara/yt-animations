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
import { Stage } from "../higgsGpt2/Stage";
import { IconChatMark, IconCheck } from "../higgsGpt2/icons";
import {
  ASTRA_TEAL,
  INK,
  FONT,
  ICON,
  atmosPanelBorder,
  atmosGlow,
} from "../higgsGpt2/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});

// Anim 5 — « La carte d'abonnement qui se retourne » (255 frames / 8,5 s @ 30 fps)
// A entrée 0–20 · B hold face avant 20–60 · C flip rotateY 60–90
// D compteur prix 90–135 · E "/mois" 120–150 · F bénéfices 150–222
// G hold 222–245 · H sortie 245–255

export const higgsGpt2Anim05Schema = z.object({
  planName: z.string().default("ChatGPT Pro"),
  price: z.number().default(20),
  benefits: z
    .array(z.string())
    .default([
      "Accès à GPT-6 Astra",
      "Extension Higgsfield compatible",
      "Génération illimitée",
    ]),
});
export type HiggsGpt2Anim05Props = z.infer<typeof higgsGpt2Anim05Schema>;

const CARD_W = 420;
const CARD_H = 560;

export const HiggsGpt2Anim05CarteAbonnementFlip: React.FC<
  HiggsGpt2Anim05Props
> = ({ planName, price, benefits }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 180 },
  });
  const cardScale = interpolate(enterSpring, [0, 1], [0.85, 1]);
  const cardOpacity = interpolate(enterSpring, [0, 1], [0, 1]);

  const flip = interpolate(frame, [60, 90], [0, 180], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const flashOpacity = interpolate(frame, [72, 75, 78], [0, 0.15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const priceCount = Math.round(
    interpolate(frame, [90, 135], [0, price], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }),
  );

  const perMonthSpring = spring({
    frame: frame - 120,
    fps,
    config: { damping: 16, stiffness: 200 },
  });
  const perMonthX = interpolate(perMonthSpring, [0, 1], [30, 0]);
  const perMonthOpacity = interpolate(perMonthSpring, [0, 1], [0, 1]);

  return (
    <Stage outFrames={10}>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          perspective: 1200,
          fontFamily,
        }}
      >
        <div
          style={{
            width: CARD_W,
            height: CARD_H,
            position: "relative",
            transformStyle: "preserve-3d",
            transform: `scale(${cardScale}) rotateY(${flip}deg)`,
            opacity: cardOpacity,
          }}
        >
          {/* Face avant */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 20,
              background:
                "linear-gradient(160deg, rgba(20,40,120,0.75) 0%, rgba(10,20,60,0.65) 100%)",
              border: `1px solid ${atmosPanelBorder(0.3)}`,
              boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
              backfaceVisibility: "hidden",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 32,
            }}
          >
            <IconChatMark size={ICON.lg} color={ASTRA_TEAL} strokeWidth={4} />
            <div style={{ fontSize: FONT.label * 0.55, fontWeight: 800, color: INK }}>
              {planName}
            </div>
          </div>

          {/* Face arrière */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 20,
              background:
                "linear-gradient(160deg, rgba(20,40,120,0.75) 0%, rgba(10,20,60,0.65) 100%)",
              border: `1px solid ${atmosPanelBorder(0.3)}`,
              boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              boxSizing: "border-box",
              padding: 48,
              display: "flex",
              flexDirection: "column",
              gap: 28,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
              <span style={{ fontSize: FONT.value * 0.5, fontWeight: 800, color: INK }}>
                ${priceCount}
              </span>
              <span
                style={{
                  fontSize: FONT.micro * 0.55,
                  fontWeight: 600,
                  color: "#AAAAAA",
                  opacity: perMonthOpacity,
                  transform: `translateX(${perMonthX}px)`,
                  marginBottom: 8,
                }}
              >
                /mois
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 22, marginTop: 16 }}>
              {benefits.map((b, i) => {
                const start = 150 + i * 36;
                const checkSpring = spring({
                  frame: frame - start,
                  fps,
                  config: { damping: 12, stiffness: 200 },
                });
                const checkScale = interpolate(checkSpring, [0, 0.6, 1], [0, 1.2, 1]);
                const textOpacity = interpolate(frame, [start, start + 15], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                const textX = interpolate(frame, [start, start + 15], [-15, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ transform: `scale(${checkScale})` }}>
                      <IconCheck size={ICON.sm * 0.4} color={ASTRA_TEAL} strokeWidth={4} />
                    </div>
                    <div
                      style={{
                        fontSize: FONT.micro * 0.5,
                        fontWeight: 600,
                        color: INK,
                        opacity: textOpacity,
                        transform: `translateX(${textX}px)`,
                      }}
                    >
                      {b}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Flash de reflet au point milieu du flip */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 20,
              background: "#fff",
              opacity: flashOpacity,
              boxShadow: atmosGlow(ASTRA_TEAL, 20, 40),
            }}
          />
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
