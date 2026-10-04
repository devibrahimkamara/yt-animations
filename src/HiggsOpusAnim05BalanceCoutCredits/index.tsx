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
import { Stage } from "../higgsOpus/Stage";
import { ACCENT, FONT, INK, OPUS_TERRACOTTA } from "../higgsOpus/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});

// Anim 5 — « La balance Fable vs Opus 5.5 » (240 frames / 8 s @ 30 fps)
// TEMPS 1 Puissance : Phase 1 cadre 0–15 · Phase 2 montée barres 15–70 · Phase 3 signe "=" 70–115
// TEMPS 2 Coût en crédits : Phase 4 morph titre 115–130 · Phase 5 morph piles 128–165 ·
// Phase 6 divergence 165–205 · Phase 7 accolade 205–240

export const higgsOpusAnim05Schema = z.object({
  fableLabel: z.string().default("Fable"),
  opusLabel: z.string().default("Opus 5.5"),
  powerTitle: z.string().default("PUISSANCE"),
  costTitle: z.string().default("COÛT EN CRÉDITS"),
  gapText: z.string().default("BEAUCOUP MOINS CHER"),
});
export type HiggsOpusAnim05Props = z.infer<typeof higgsOpusAnim05Schema>;

const BAR_MAX_HEIGHT = 480;
const BAR_WIDTH = 140;
const FABLE_X = 760;
const OPUS_X = 1160;
const BASE_Y = 860;
const TOKEN_H = 34;
const OPUS_TOKENS = 6;
const FABLE_TOKENS = 13;
const PILE_TOP = FABLE_TOKENS * (TOKEN_H - 6) + TOKEN_H;

export const HiggsOpusAnim05BalanceCoutCredits: React.FC<HiggsOpusAnim05Props> = ({
  fableLabel,
  opusLabel,
  powerTitle,
  costTitle,
  gapText,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1
  const frameOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelSpring = interpolate(
    spring({ frame: frame - 5, fps, config: { damping: 13, stiffness: 170 } }),
    [0, 1],
    [0.7, 1],
  );

  // Phase 2 — montée des barres
  const barHeight = interpolate(frame, [15, 65], [0, BAR_MAX_HEIGHT], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Phase 3 — signe "="
  const eqSpring = spring({ frame: frame - 70, fps, config: { damping: 11, stiffness: 260 } });
  const eqScale = interpolate(eqSpring, [0, 1], [0, 1]);
  const eqExitOpacity = interpolate(frame, [115, 122], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 4 — morph titre
  const powerTitleY = interpolate(frame, [115, 128], [0, -40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const powerTitleOpacity = interpolate(frame, [115, 128], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const costTitleY = interpolate(frame, [115, 128], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const costTitleOpacity = interpolate(frame, [115, 128], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 5 — morph barre -> pile de jetons
  const morphProgress = interpolate(frame, [128, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 6 — divergence
  const fableGrowProgress = interpolate(frame, [165, 205], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const fableTokenCount = Math.round(
    interpolate(fableGrowProgress, [0, 1], [OPUS_TOKENS, FABLE_TOKENS]),
  );
  const opusBreathe = 1 + Math.sin(frame / 14) * 0.02;

  // Phase 7 — accolade
  const braceOpacity = interpolate(frame, [205, 214], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gapTextOpacity = interpolate(frame, [215, 226], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gapTextX = interpolate(frame, [215, 226], [-20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const renderStack = (x: number, color: string, count: number, breathe = 1) => {
    const tokens = [];
    for (let i = 0; i < count; i++) {
      const staggerFrame = 128 + i * 2;
      const tokenOpacity = interpolate(frame, [staggerFrame, staggerFrame + 4], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      tokens.push(
        <div
          key={i}
          style={{
            position: "absolute",
            left: x - BAR_WIDTH / 2,
            bottom: BASE_Y - 860 + i * (TOKEN_H - 6),
            width: BAR_WIDTH,
            height: TOKEN_H,
            borderRadius: TOKEN_H / 2,
            background: color,
            boxShadow: "inset 0 -6px 10px rgba(0,0,0,0.25), inset 0 4px 6px rgba(255,255,255,0.25)",
            opacity: tokenOpacity * morphProgress,
            transform: `scale(${breathe})`,
          }}
        />,
      );
    }
    return tokens;
  };

  return (
    <Stage>
      <AbsoluteFill style={{ fontFamily }}>
        {/* Titres */}
        {frame < 128 && (
          <div
            style={{
              position: "absolute",
              top: 60,
              width: "100%",
              textAlign: "center",
              color: INK,
              fontWeight: 800,
              fontSize: FONT.counter,
              transform: `translateY(${powerTitleY}px)`,
              opacity: powerTitleOpacity,
            }}
          >
            {powerTitle}
          </div>
        )}
        {frame >= 115 && (
          <div
            style={{
              position: "absolute",
              top: 60,
              width: "100%",
              textAlign: "center",
              color: INK,
              fontWeight: 800,
              fontSize: FONT.counter,
              transform: `translateY(${costTitleY}px)`,
              opacity: costTitleOpacity,
            }}
          >
            {costTitle}
          </div>
        )}

        {/* Barres (Temps 1) */}
        {frame < 150 && (
          <>
            <div
              style={{
                position: "absolute",
                left: FABLE_X - BAR_WIDTH / 2,
                bottom: 1080 - BASE_Y,
                width: BAR_WIDTH,
                height: barHeight,
                borderRadius: 16,
                background: `linear-gradient(180deg, ${INK}, ${INK}aa)`,
                opacity: 1 - morphProgress,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: OPUS_X - BAR_WIDTH / 2,
                bottom: 1080 - BASE_Y,
                width: BAR_WIDTH,
                height: barHeight,
                borderRadius: 16,
                background: `linear-gradient(180deg, ${OPUS_TERRACOTTA}, ${OPUS_TERRACOTTA}aa)`,
                opacity: 1 - morphProgress,
              }}
            />
          </>
        )}

        {/* Labels */}
        <div
          style={{
            position: "absolute",
            left: FABLE_X,
            bottom: 1080 - BASE_Y - 110,
            whiteSpace: "nowrap",
            textAlign: "center",
            color: INK,
            fontWeight: 800,
            fontSize: FONT.micro,
            transform: `translateX(-50%) scale(${labelSpring})`,
            opacity: frameOpacity,
          }}
        >
          {fableLabel}
        </div>
        <div
          style={{
            position: "absolute",
            left: OPUS_X,
            bottom: 1080 - BASE_Y - 110,
            whiteSpace: "nowrap",
            textAlign: "center",
            color: INK,
            fontWeight: 800,
            fontSize: FONT.micro,
            transform: `translateX(-50%) scale(${labelSpring})`,
            opacity: frameOpacity,
          }}
        >
          {opusLabel}
        </div>

        {/* Signe = */}
        {frame >= 70 && frame < 122 && (
          <div
            style={{
              position: "absolute",
              top: 460,
              left: (FABLE_X + OPUS_X) / 2 - 40,
              fontSize: FONT.hero,
              color: INK,
              fontWeight: 800,
              transform: `scale(${eqScale})`,
              opacity: eqExitOpacity,
              textShadow: `0 0 30px ${ACCENT}`,
            }}
          >
            =
          </div>
        )}

        {/* Piles de jetons (Temps 2) */}
        {frame >= 128 && renderStack(FABLE_X, INK, fableTokenCount)}
        {frame >= 128 && renderStack(OPUS_X, OPUS_TERRACOTTA, OPUS_TOKENS, frame >= 165 ? opusBreathe : 1)}

        {/* Accolade + texte d'écart */}
        {frame >= 205 && (
          <>
            <svg
              width={200}
              height={PILE_TOP}
              style={{
                position: "absolute",
                left: FABLE_X + BAR_WIDTH / 2 + 20,
                bottom: 1080 - BASE_Y,
                opacity: braceOpacity,
              }}
              viewBox={`0 0 100 ${PILE_TOP}`}
            >
              <path
                d={`M10,0 Q60,0 60,${PILE_TOP * 0.25} Q60,${PILE_TOP * 0.5} 90,${PILE_TOP * 0.5} Q60,${PILE_TOP * 0.5} 60,${PILE_TOP * 0.75} Q60,${PILE_TOP} 10,${PILE_TOP}`}
                stroke={INK}
                strokeWidth={4}
                fill="none"
              />
            </svg>
            <div
              style={{
                position: "absolute",
                left: FABLE_X + BAR_WIDTH / 2 + 220,
                bottom: 1080 - BASE_Y + 60,
                width: 700,
                color: INK,
                fontWeight: 800,
                fontSize: FONT.micro,
                lineHeight: 1.2,
                opacity: gapTextOpacity,
                transform: `translateX(${gapTextX}px)`,
              }}
            >
              {gapText}
            </div>
          </>
        )}
      </AbsoluteFill>
    </Stage>
  );
};
