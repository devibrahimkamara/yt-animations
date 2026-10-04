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
import { Stage } from "../higgsMarketing/Stage";
import { MONEY_GREEN, mulberry32 } from "../higgsMarketing/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});

// Anim 4 — « Le mur d'offres » (210 frames / 7 s @ 30 fps)
// Phase 1 apparition 0–20 · Phase 2 défilement parallaxe 20–110 ·
// Phase 3 ralentissement + sélection 110–140 · Phase 4 zoom 140–180 ·
// Phase 5 maintien 180–210

export const higgsMarketingAnim04Schema = z.object({
  finalTitle: z.string().default("Vidéo perso du Père Noël"),
  finalPrice: z.string().default("25 €"),
});
export type HiggsMarketingAnim04Props = z.infer<
  typeof higgsMarketingAnim04Schema
>;

const CARD_W = 320;
const CARD_H = 400;
const CARD_GAP = 34;
const COL_COUNT = 3;
const CARDS_PER_COL = 6;
const COL_SPEEDS = [0.6, 1, 1.4];
const TITLES = [
  "Vidéo perso Noël",
  "Message vidéo enfant",
  "Père Noël personnalisé",
  "Vidéo perso du Père Noël",
  "Appel vidéo Noël IA",
  "Lettre vidéo du Père Noël",
];
const PRICES = ["15 €", "20 €", "25 €", "30 €", "18 €", "22 €"];

const rng = mulberry32(4001);
const OFFSETS = [rng() * 80, rng() * 80, rng() * 80];

const Card: React.FC<{ title: string; price: string }> = ({ title, price }) => (
  <div
    style={{
      width: CARD_W,
      height: CARD_H,
      borderRadius: 12,
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.15)",
      boxSizing: "border-box",
      padding: 18,
      display: "flex",
      flexDirection: "column",
      gap: 12,
      color: "#fff",
    }}
  >
    <div
      style={{
        width: "100%",
        height: CARD_H * 0.55,
        borderRadius: 8,
        background: "linear-gradient(135deg, #7a1010, #2e0505)",
      }}
    />
    <div style={{ fontSize: 20, fontWeight: 700 }}>{title}</div>
    <div style={{ flex: 1 }} />
    <div
      style={{
        alignSelf: "flex-end",
        background: MONEY_GREEN,
        color: "#04210f",
        fontWeight: 800,
        borderRadius: 999,
        padding: "6px 16px",
        fontSize: 18,
      }}
    >
      {price}
    </div>
  </div>
);

export const HiggsMarketingAnim04MurOffres: React.FC<
  HiggsMarketingAnim04Props
> = ({ finalTitle, finalPrice }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wallOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wallScale = interpolate(frame, [0, 20], [0.96, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scrollSpeedFactor = interpolate(frame, [110, 140], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const effectiveFrame = frame < 110 ? frame : 110 + (frame - 110) * scrollSpeedFactor;

  const bgBlur = interpolate(frame, [110, 140], [0, 9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bgDark = interpolate(frame, [110, 140], [0, 0.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const heroSpring = spring({
    frame: frame - 140,
    fps,
    config: { damping: 16, stiffness: 90 },
  });
  const heroScale = interpolate(heroSpring, [0, 1], [1, 2.4]);
  const heroOpacity = interpolate(frame, [138, 148], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const heroShadow = interpolate(frame, [140, 180], [0, 60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const colTotalH = CARDS_PER_COL * (CARD_H + CARD_GAP);
  const colLeft = (1920 - (CARD_W * COL_COUNT + CARD_GAP * (COL_COUNT - 1))) / 2;

  return (
    <Stage outFrames={10}>
      <AbsoluteFill style={{ fontFamily, justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
        <div
          style={{
            position: "relative",
            width: 1920,
            height: 1080,
            opacity: wallOpacity,
            transform: `scale(${wallScale})`,
            filter: `blur(${bgBlur}px) brightness(${1 - bgDark})`,
          }}
        >
          {[0, 1, 2].map((col) => {
            const y = ((effectiveFrame * COL_SPEEDS[col] * 4 + OFFSETS[col]) % colTotalH);
            return (
              <div
                key={col}
                style={{
                  position: "absolute",
                  left: colLeft + col * (CARD_W + CARD_GAP),
                  top: -y - CARD_H,
                  display: "flex",
                  flexDirection: "column",
                  gap: CARD_GAP,
                }}
              >
                {Array.from({ length: CARDS_PER_COL * 2 }, (_, i) => {
                  const idx = i % CARDS_PER_COL;
                  return <Card key={i} title={TITLES[idx]} price={PRICES[idx]} />;
                })}
              </div>
            );
          })}
        </div>

        {frame >= 138 && (
          <div
            style={{
              position: "absolute",
              opacity: heroOpacity,
              transform: `scale(${heroScale})`,
              boxShadow: `0 ${heroShadow}px ${heroShadow * 2}px rgba(0,0,0,0.6)`,
              borderRadius: 12,
            }}
          >
            <Card title={finalTitle} price={finalPrice} />
          </div>
        )}
      </AbsoluteFill>
    </Stage>
  );
};
