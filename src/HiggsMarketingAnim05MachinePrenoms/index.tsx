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
import { ACCENT, COIN_GOLD, FONT, INK } from "../higgsMarketing/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});

// Anim 5 — « La machine à prénoms » (165 frames / 5,5 s @ 30 fps)
// Phase 1 texte fixe 0–15 · Phase 2 défilement rapide 15–75 ·
// Phase 3 ralentissement 75–130 · Phase 4 stabilisation 130–145 ·
// Phase 5 compteur 130–165 · Phase 6 maintien 145–165

export const higgsMarketingAnim05Schema = z.object({
  finalName: z.string().default("Aïcha"),
  saleCount: z.number().default(47),
});
export type HiggsMarketingAnim05Props = z.infer<
  typeof higgsMarketingAnim05Schema
>;

const NAMES = [
  "Léa",
  "Moussa",
  "Aïcha",
  "Lucas",
  "Fatou",
  "Noah",
  "Chloé",
  "Coumba",
  "Nathan",
  "Awa",
  "Gabriel",
  "Mariame",
];
const REEL_ITEM_H = 140;

export const HiggsMarketingAnim05MachinePrenoms: React.FC<
  HiggsMarketingAnim05Props
> = ({ finalName, saleCount }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textY = interpolate(frame, [0, 15], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Construit la bande de prénoms de façon à ce que finalName tombe
  // exactement au centre à la frame 130.
  const finalIdx = NAMES.indexOf(finalName) >= 0 ? NAMES.indexOf(finalName) : 0;
  const REPEATS = 6;
  const reel = Array.from({ length: NAMES.length * REPEATS }, (_, i) => NAMES[i % NAMES.length]);
  const targetIndex = NAMES.length * (REPEATS - 1) + finalIdx;

  const scrollProgress = interpolate(frame, [15, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.poly(4)),
  });
  const totalDistance = targetIndex * REEL_ITEM_H;
  const scrollDist = frame < 15 ? 0 : frame < 130 ? scrollProgress * totalDistance : totalDistance;

  const settleSpring = spring({ frame: frame - 130, fps, config: { damping: 7, stiffness: 220 } });
  const settleOffset = frame >= 130 ? interpolate(settleSpring, [0, 1], [0, 0]) : 0;

  const isFast = frame < 90;
  const blurAmt = interpolate(frame, [15, 40, 90, 130], [0, 3, 3, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exclamSpring = spring({ frame: frame - 130, fps, config: { damping: 10, stiffness: 200 } });
  const exclamScale = interpolate(exclamSpring, [0, 1], [0.8, 1]);
  const exclamOpacity = interpolate(frame, [130, 138], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const haloOpacity = interpolate(frame, [130, 136, 144], [0, 0.8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const counterOpacity = interpolate(frame, [130, 138], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const counterY = interpolate(frame, [130, 138], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tickProgress = interpolate(frame, [130, 145], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const displayedCount = Math.floor(interpolate(tickProgress, [0, 1], [saleCount - 20, saleCount]));

  return (
    <Stage outFrames={10}>
      <AbsoluteFill style={{ fontFamily, justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 36,
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
          }}
        >
          <div style={{ fontSize: FONT.hero * 0.42, fontWeight: 800, color: INK }}>
            Joyeux Noël,
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              position: "relative",
              width: 640,
              height: REEL_ITEM_H,
              overflow: "hidden",
              borderRadius: 16,
              background: "rgba(255,255,255,0.08)",
              border: `2px solid ${ACCENT}55`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: REEL_ITEM_H / 2 - REEL_ITEM_H / 2 - (scrollDist - settleOffset),
                filter: isFast || frame < 130 ? `blur(${blurAmt}px)` : "none",
              }}
            >
              {reel.map((name, i) => (
                <div
                  key={i}
                  style={{
                    height: REEL_ITEM_H,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: FONT.hero * 0.42,
                    fontWeight: 800,
                    color: INK,
                  }}
                >
                  {name}
                </div>
              ))}
            </div>
            {frame >= 130 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 16,
                  boxShadow: `inset 0 0 60px ${COIN_GOLD}`,
                  opacity: haloOpacity,
                }}
              />
            )}
          </div>
          <div
            style={{
              fontSize: FONT.hero * 0.42,
              fontWeight: 800,
              color: INK,
              opacity: exclamOpacity,
              transform: `scale(${exclamScale})`,
            }}
          >
            !
          </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: 90,
            right: 100,
            opacity: counterOpacity,
            transform: `translateY(${counterY}px)`,
            background: ACCENT,
            color: "#fff",
            borderRadius: 16,
            padding: "16px 28px",
            fontSize: FONT.micro * 0.6,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span>💰</span>
          <span>+1 vente · {displayedCount}</span>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
