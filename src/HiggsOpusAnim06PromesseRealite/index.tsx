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
import { ACCENT, DESATURATED, FONT, INK, OPUS_TERRACOTTA } from "../higgsOpus/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});

// Anim 6 — « Promesse ou réalité ? » (120 frames / 4 s @ 30 fps)
// Phase 1 diagonale 0–15 · Phase 2 côté gauche 12–45 · Phase 3 point d'interrogation 30–55 ·
// Phase 4 case à cocher + barre 55–90 · Phase 5 pause finale 90–120

export const higgsOpusAnim06Schema = z.object({
  title: z.string().default("Ce qu'Anthropic annonce"),
  points: z
    .array(z.string())
    .default(["Aussi puissant que Fable", "Moins cher en crédits"]),
  testLabel: z.string().default("À TESTER"),
});
export type HiggsOpusAnim06Props = z.infer<typeof higgsOpusAnim06Schema>;

export const HiggsOpusAnim06PromesseRealite: React.FC<HiggsOpusAnim06Props> = ({
  title,
  points,
  testLabel,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const diagonalProgress = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const leftOpacity = interpolate(frame, [12, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [20, 28], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleOpacity = interpolate(frame, [20, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const qSpring = spring({ frame: frame - 30, fps, config: { damping: 13, stiffness: 170 } });
  const qScale = interpolate(qSpring, [0, 1], [0.7, 1]);
  const qOpacity = interpolate(frame, [30, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const qPulse = frame > 42 ? 1 + Math.sin((frame - 42) / 20) * 0.05 : 1;

  const checkSpring = spring({ frame: frame - 55, fps, config: { damping: 13, stiffness: 180 } });
  const checkScale = interpolate(checkSpring, [0, 1], [0.7, 1]);
  const testOpacity = interpolate(frame, [63, 71], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barProgress = interpolate(frame, [71, 88], [0, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const percentOpacity = interpolate(frame, [88, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage>
      <AbsoluteFill style={{ fontFamily }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: `polygon(0 0, ${diagonalProgress * 100}% 0, ${
              diagonalProgress * 100
            }% 100%, 0 100%)`,
            background: `linear-gradient(135deg, ${OPUS_TERRACOTTA}18, transparent)`,
          }}
        />
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          <line
            x1={0}
            y1={0}
            x2={1920 * diagonalProgress}
            y2={1080 * diagonalProgress}
            stroke={INK}
            strokeWidth={3}
            style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.5))" }}
          />
        </svg>

        {/* Côté gauche — Promesse */}
        <div style={{ position: "absolute", left: 140, top: 220, width: 560, opacity: leftOpacity }}>
          <div
            style={{
              color: OPUS_TERRACOTTA,
              fontWeight: 800,
              fontSize: FONT.label,
              transform: `translateY(${titleY}px)`,
              opacity: titleOpacity,
            }}
          >
            {title}
          </div>
          {points.map((p, i) => {
            const start = 28 + i * 6;
            const o = interpolate(frame, [start, start + 6], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={p}
                style={{
                  marginTop: 24,
                  color: INK,
                  fontWeight: 600,
                  fontSize: FONT.value,
                  opacity: o,
                }}
              >
                • {p}
              </div>
            );
          })}
        </div>

        {/* Côté droit — point d'interrogation */}
        <div
          style={{
            position: "absolute",
            right: 300,
            top: 300,
            fontSize: 320,
            color: DESATURATED,
            WebkitTextStroke: `4px ${INK}`,
            fontWeight: 800,
            transform: `scale(${qScale * qPulse})`,
            opacity: qOpacity,
          }}
        >
          ?
        </div>

        {/* Case à cocher + barre */}
        <div
          style={{
            position: "absolute",
            bottom: 140,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                width: 40,
                height: 40,
                border: `3px solid ${INK}`,
                borderRadius: 8,
                transform: `scale(${checkScale})`,
              }}
            />
            <div
              style={{
                color: INK,
                fontWeight: 800,
                fontSize: FONT.micro,
                opacity: testOpacity,
              }}
            >
              {testLabel}
            </div>
          </div>
          <div style={{ width: 500, height: 14, borderRadius: 7, background: "#ffffff22" }}>
            <div
              style={{
                width: `${barProgress * 100}%`,
                height: "100%",
                borderRadius: 7,
                background: ACCENT,
              }}
            />
          </div>
          <div style={{ color: ACCENT, fontWeight: 800, fontSize: FONT.micro, opacity: percentOpacity }}>
            50%
          </div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
