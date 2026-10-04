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
import { loadFont as loadMono } from "@remotion/google-fonts/RobotoMono";
import { Stage } from "../higgsOpus/Stage";
import { ACCENT, FONT, INK, NEUTRAL_BORDER, NEUTRAL_PANEL } from "../higgsOpus/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});
const { fontFamily: monoFamily } = loadMono("normal", {
  weights: ["500", "600"],
  subsets: ["latin"],
});

// Anim 1 — « Un seul prompt → le film qui se déroule » (195 frames / 6,5 s @ 30 fps)
// Phase 1 barre de chat 0–15 · Phase 2 typewriter 15–90 · Phase 3 clic envoyer 90–100 ·
// Phase 4 rétraction 100–115 · Phase 5 pellicule 110–175 · Phase 6 synthèse 160–195

export const higgsOpusAnim01Schema = z.object({
  promptText: z
    .string()
    .default("Crée un court métrage cinématique sur le lancement d'Opus 5.5"),
  badgeText: z.string().default("Opus 5.5"),
  summaryText: z.string().default("1 PROMPT = 1 FILM"),
});
export type HiggsOpusAnim01Props = z.infer<typeof higgsOpusAnim01Schema>;

const CELL_COUNT = 5;
const CELL_STARTS = [115, 122, 129, 136, 143];

export const HiggsOpusAnim01PelliculeFilm: React.FC<HiggsOpusAnim01Props> = ({
  promptText,
  badgeText,
  summaryText,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 — barre de chat
  const barSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.5 },
  });
  const barScale = interpolate(barSpring, [0, 1], [0.8, 1]);
  const barOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const badgeSpring = spring({
    frame: frame - 3,
    fps,
    config: { damping: 12, stiffness: 240, mass: 0.4 },
  });
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.8, 1]);
  const badgeOpacity = interpolate(frame, [3, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 2 — typewriter
  const chars = Math.floor(
    interpolate(frame, [15, 85], [0, promptText.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const visibleText = promptText.slice(0, chars);
  const cursorOn = Math.floor(frame / 15) % 2 === 0;

  // Phase 3 — clic envoyer
  const cursorProgress = interpolate(frame, [90, 97], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const cursorX = interpolate(cursorProgress, [0, 1], [520, 300]);
  const cursorY = interpolate(cursorProgress, [0, 1], [140, 0]);
  const clickBounce = spring({
    frame: frame - 97,
    fps,
    config: { damping: 12, stiffness: 400 },
  });
  const clickScale = interpolate(clickBounce, [0, 1], [0.85, 1]);
  const flashOpacity = interpolate(frame, [97, 105], [0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 4 — rétraction
  const retractProgress = interpolate(frame, [100, 115], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const barScaleX = interpolate(retractProgress, [0, 1], [1, 0.05]);
  const barTranslateY = interpolate(retractProgress, [0, 1], [0, -20]);
  const barFadeOut = interpolate(retractProgress, [0, 1], [1, 0]);
  const dotOpacity = interpolate(frame, [108, 115], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 5 — pellicule
  const filmEnterProgress = interpolate(frame, [110, 135], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const filmDrift = Math.min(frame, 175) > 135 ? (Math.min(frame, 175) - 135) * -2 : 0;
  const filmX = interpolate(filmEnterProgress, [0, 1], [-1600, 0]) + filmDrift;
  const filmOpacity = interpolate(frame, [110, 118], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 6 — synthèse
  const textSpring = spring({
    frame: frame - 165,
    fps,
    config: { damping: 14, stiffness: 160 },
  });
  const textY = interpolate(textSpring, [0, 1], [20, 0]);
  const textOpacity = interpolate(frame, [165, 175], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const underlineScale = interpolate(frame, [170, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <Stage>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          fontFamily,
        }}
      >
        {/* Barre de chat */}
        <div
          style={{
            position: "absolute",
            width: 1680,
            height: 170,
            borderRadius: 30,
            background: "rgba(20,26,48,0.55)",
            border: `1.5px solid ${ACCENT}55`,
            backdropFilter: "blur(18px)",
            boxShadow: `0 0 60px ${ACCENT}30`,
            transform: `scale(${barScale * barScaleX}, ${barScale}) translateY(${barTranslateY}px)`,
            opacity: barOpacity * barFadeOut,
            display: "flex",
            alignItems: "center",
            padding: "0 56px",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -40,
              left: 48,
              padding: "10px 28px",
              borderRadius: 30,
              background: `${ACCENT}25`,
              border: `1.5px solid ${ACCENT}`,
              color: INK,
              fontWeight: 800,
              fontSize: FONT.micro * 0.7,
              transform: `scale(${badgeScale})`,
              opacity: badgeOpacity,
            }}
          >
            {badgeText}
          </div>
          <div
            style={{
              fontFamily: monoFamily,
              color: INK,
              fontSize: 40,
              whiteSpace: "nowrap",
            }}
          >
            {visibleText}
            <span style={{ opacity: cursorOn ? 1 : 0, color: ACCENT }}>|</span>
          </div>
          <div
            style={{
              position: "absolute",
              right: 36,
              top: "50%",
              transform: `translateY(-50%) scale(${clickScale})`,
              width: 70,
              height: 70,
              borderRadius: "50%",
              background: ACCENT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={34} height={34} viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12h14m0 0l-6-6m6 6l-6 6"
                stroke={INK}
                strokeWidth={2.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          {frame >= 90 && frame < 108 && (
            <div
              style={{
                position: "absolute",
                right: 20,
                top: "50%",
                transform: `translate(${cursorX - 500}px, calc(-50% + ${cursorY}px))`,
              }}
            >
              <svg width={40} height={40} viewBox="0 0 24 24">
                <path d="M4 3l16 8-7 2-2 7-7-17z" fill={INK} stroke="#00000055" />
              </svg>
            </div>
          )}
          {frame >= 97 && frame < 106 && (
            <div
              style={{
                position: "absolute",
                right: 66,
                top: "50%",
                width: 90,
                height: 90,
                borderRadius: "50%",
                border: `2px solid ${ACCENT}`,
                transform: "translateY(-50%)",
                opacity: flashOpacity,
              }}
            />
          )}
        </div>

        {/* Point lumineux (ancre) */}
        <div
          style={{
            position: "absolute",
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: ACCENT,
            boxShadow: `0 0 24px 8px ${ACCENT}80`,
            opacity: frame >= 108 && frame < 175 ? dotOpacity : 0,
          }}
        />

        {/* Pellicule de film */}
        {frame >= 110 && frame < 195 && (
          <div
            style={{
              position: "absolute",
              display: "flex",
              gap: 24,
              transform: `translateX(${filmX}px)`,
              opacity: filmOpacity,
            }}
          >
            {Array.from({ length: CELL_COUNT }).map((_, i) => {
              const start = CELL_STARTS[i];
              const cellOpacity = interpolate(frame, [start, start + 6], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const cellSpring = spring({
                frame: frame - start,
                fps,
                config: { damping: 14, stiffness: 140 },
              });
              const cellScale = interpolate(cellSpring, [0, 1], [0.9, 1]);
              return (
                <div
                  key={i}
                  style={{
                    width: 180,
                    height: 110,
                    borderRadius: 6,
                    border: `4px solid ${NEUTRAL_BORDER}`,
                    background: `linear-gradient(135deg, ${ACCENT}55, ${NEUTRAL_PANEL})`,
                    opacity: cellOpacity,
                    transform: `scale(${cellScale})`,
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Texte de synthèse */}
        <div
          style={{
            position: "absolute",
            bottom: 120,
            textAlign: "center",
            transform: `translateY(${textY}px)`,
            opacity: textOpacity,
          }}
        >
          <div
            style={{
              fontWeight: 800,
              fontSize: FONT.label,
              color: INK,
              letterSpacing: 2,
            }}
          >
            {summaryText}
          </div>
          <div
            style={{
              height: 4,
              background: ACCENT,
              marginTop: 12,
              transform: `scaleX(${underlineScale})`,
              transformOrigin: "left",
            }}
          />
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
