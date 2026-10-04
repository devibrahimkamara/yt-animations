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
import { Stage } from "../higgs2/Stage";
import { INK, CLAUDE_TERRACOTTA, CHATGPT_TEAL, FONT } from "../higgs2/theme";

const { fontFamily } = loadFont("normal", { weights: ["600", "800"], subsets: ["latin"] });

export const higgs2Anim10Schema = z.object({
  leftName: z.string().default("Claude"),
  leftFeature: z.string().default("Raisonnement long, style naturel"),
  rightName: z.string().default("ChatGPT"),
  rightFeature: z.string().default("Large écosystème d'outils"),
});

export type Higgs2Anim10Props = z.infer<typeof higgs2Anim10Schema>;

const CARD_W = 460;
const CARD_H = 300;

const shake = (frame: number, start: number, dur: number, maxAmp: number) => {
  if (frame < start || frame > start + dur) return 0;
  const amp = interpolate(frame, [start, start + dur], [maxAmp, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return Math.sin((frame - start) * 3) * amp;
};

export const Higgs2Anim10ClaudeVsChatGPT: React.FC<Higgs2Anim10Props> = ({
  leftName,
  leftFeature,
  rightName,
  rightFeature,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterT = interpolate(frame, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const opacityIn = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const leftBaseX = interpolate(enterT, [0, 1], [-400, -CARD_W / 2 - 30]);
  const rightBaseX = interpolate(enterT, [0, 1], [400, CARD_W / 2 + 30]);

  const shakeX = shake(frame, 24, 6, 8);
  const compression =
    frame >= 24 && frame < 29
      ? interpolate(frame, [24, 26, 29], [1, 0.97, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;
  const impactFlash = interpolate(frame, [24, 25, 27], [0, 0.7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Claude se soulève
  const lift = spring({ frame: frame - 30, fps, config: { damping: 13, stiffness: 150 } });
  const claudeY = interpolate(lift, [0, 1], [0, -18], { extrapolateRight: "clamp" });
  const claudeScale = 1 + lift * 0.04;
  const glowPulse = frame >= 60 ? 0.3 + 0.15 * Math.sin(frame / 20) : 0;
  const claudeBlur = interpolate(lift, [0, 1], [10, 40], { extrapolateRight: "clamp" });
  const claudeSpread = interpolate(lift, [0, 1], [0, 8], { extrapolateRight: "clamp" });
  const claudeShadowA = 0.25 + lift * 0.15 + glowPulse * 0.2;

  // ChatGPT recule + désature
  const gptRecede = interpolate(frame, [30, 60], [0, 12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gray = interpolate(frame, [30, 60, 84], [0, 0.6, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gptOpacity = interpolate(frame, [60, 84], [1, 0.7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage outFrames={25}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        {/* Carte Claude */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: CARD_W,
            height: CARD_H,
            transform: `translate(-50%, -50%) translate(${leftBaseX + shakeX}px, ${claudeY}px) scale(${
              claudeScale * compression
            })`,
            opacity: opacityIn,
            borderRadius: 20,
            background: `linear-gradient(150deg, ${CLAUDE_TERRACOTTA}, ${CLAUDE_TERRACOTTA}cc)`,
            boxShadow: `0 ${claudeBlur / 2}px ${claudeBlur}px ${claudeSpread}px rgba(217,119,87,${claudeShadowA})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            zIndex: 2,
          }}
        >
          <div style={{ fontFamily, fontWeight: 800, fontSize: FONT.label, color: INK }}>{leftName}</div>
          <div style={{ fontFamily, fontWeight: 600, fontSize: 34, color: INK, opacity: 0.92, textAlign: "center", padding: "0 28px", lineHeight: 1.15 }}>
            {leftFeature}
          </div>
        </div>

        {/* Carte ChatGPT */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: CARD_W,
            height: CARD_H,
            transform: `translate(-50%, -50%) translate(${rightBaseX + gptRecede - shakeX}px, 0px) scale(${compression})`,
            opacity: opacityIn * gptOpacity,
            filter: `grayscale(${gray})`,
            borderRadius: 20,
            background: `linear-gradient(150deg, ${CHATGPT_TEAL}, ${CHATGPT_TEAL}cc)`,
            boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            zIndex: 1,
          }}
        >
          <div style={{ fontFamily, fontWeight: 800, fontSize: FONT.label, color: INK }}>{rightName}</div>
          <div style={{ fontFamily, fontWeight: 600, fontSize: 34, color: INK, opacity: 0.92, textAlign: "center", padding: "0 28px", lineHeight: 1.15 }}>
            {rightFeature}
          </div>
        </div>

        {/* flash d'impact au centre */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 6,
            height: CARD_H,
            transform: "translate(-50%, -50%)",
            background: INK,
            filter: "blur(4px)",
            opacity: impactFlash,
          }}
        />
      </AbsoluteFill>
    </Stage>
  );
};
