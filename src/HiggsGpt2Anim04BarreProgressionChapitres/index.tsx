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
import { ACCENT, ACCENT_LIGHT, INK, FONT, NEUTRAL_LINE } from "../higgsGpt2/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});

// Anim 4 — « La barre de progression avec chapitres » (165 frames / 5,5 s @ 30 fps)
// A bar + points 0–15 · B lecture linéaire + 4 chapitres 15–105
// C texte d'anticipation 90–120 · D pulsation continue dès 105 · E sortie 150–165

export const higgsGpt2Anim04Schema = z.object({
  anticipationText: z.string().default("la partie la plus importante"),
});
export type HiggsGpt2Anim04Props = z.infer<typeof higgsGpt2Anim04Schema>;

const BAR_W = 1344; // 70% de 1920
const BAR_LEFT = (1920 - BAR_W) / 2;
const BAR_TOP = 620;
const CHAPTERS = [0.15, 0.4, 0.65, 0.9];

export const HiggsGpt2Anim04BarreProgressionChapitres: React.FC<
  HiggsGpt2Anim04Props
> = ({ anticipationText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const barOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const progress = interpolate(frame, [15, 105], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.linear,
  });

  const chapterFrames = CHAPTERS.map(
    (c) => 15 + c * 90,
  );

  const textOpacity = interpolate(frame, [90, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const textY = interpolate(frame, [90, 110], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const breathe = frame >= 105 ? Math.sin(frame * 0.15) * 0.075 + 1.075 : 1;

  return (
    <Stage outFrames={15}>
      <AbsoluteFill style={{ fontFamily }}>
        <div
          style={{
            position: "absolute",
            left: BAR_LEFT,
            top: BAR_TOP,
            width: BAR_W,
            height: 6,
            borderRadius: 3,
            background: NEUTRAL_LINE,
            opacity: barOpacity,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              width: `${progress * 100}%`,
              borderRadius: 3,
              background: `linear-gradient(90deg, ${ACCENT} 0%, ${ACCENT_LIGHT} 100%)`,
            }}
          />
          {/* Playhead */}
          <div
            style={{
              position: "absolute",
              left: `${progress * 100}%`,
              top: "50%",
              width: 18,
              height: 18,
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              background: `radial-gradient(circle, ${ACCENT_LIGHT} 0%, ${ACCENT} 100%)`,
              boxShadow: `0 0 20px 6px rgba(80,130,255,0.5)`,
            }}
          />

          {CHAPTERS.map((c, i) => {
            const reached = frame >= chapterFrames[i];
            const pulseSpring = spring({
              frame: frame - chapterFrames[i],
              fps,
              config: { damping: 5, stiffness: 250 },
            });
            const isLast = i === CHAPTERS.length - 1;
            const scale = isLast && frame >= 105
              ? breathe
              : interpolate(pulseSpring, [0, 0.5, 1], [1, 1.3, 1]);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${c * 100}%`,
                  top: "50%",
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  transform: `translate(-50%, -50%) scale(${scale})`,
                  background: reached ? ACCENT_LIGHT : "#0F0F14",
                  border: `2px solid ${INK}`,
                  boxShadow:
                    isLast && frame >= 105
                      ? `0 0 ${20 * breathe}px 6px rgba(80,130,255,${0.4 * breathe})`
                      : "none",
                }}
              />
            );
          })}
        </div>

        <div
          style={{
            position: "absolute",
            left: BAR_LEFT + BAR_W * CHAPTERS[3] - 500,
            top: BAR_TOP - 90,
            width: 1000,
            textAlign: "center",
            fontSize: FONT.micro * 0.85,
            fontWeight: 700,
            color: INK,
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
          }}
        >
          {anticipationText}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
