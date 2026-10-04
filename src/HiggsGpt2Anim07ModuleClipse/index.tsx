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
import { IconChatMark } from "../higgsGpt2/icons";
import {
  ACCENT,
  ACCENT_LIGHT,
  INK,
  FONT,
  ICON,
  atmosPanelBorder,
} from "../higgsGpt2/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});

// Anim 7 — « Le module qui vient se clipser » (210 frames / 7 s @ 30 fps)
// A cercle ChatGPT seul 0–20 · B bloc Higgsfield arrive (motion blur) 20–60
// C impact + flash + tremblement 60–72 · D arc de jauge 72–130
// E anneau concentrique 130–140 · F hold 140–190 · G sortie 190–210

export const higgsGpt2Anim07Schema = z.object({
  gainLabel: z.string().default("+300% de capacités"),
});
export type HiggsGpt2Anim07Props = z.infer<typeof higgsGpt2Anim07Schema>;

const CIRCLE_D = 200;
const BLOCK_W = 260;
const BLOCK_H = 140;
const CX = 1920 / 2 - 90;
const CY = 540;
const TARGET_BLOCK_X = CX + CIRCLE_D / 2 + 30;

export const HiggsGpt2Anim07ModuleClipse: React.FC<HiggsGpt2Anim07Props> = ({
  gainLabel,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const circleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 160 } });
  const circleScale = interpolate(circleSpring, [0, 1], [0.7, 1]);
  const circleOpacity = interpolate(circleSpring, [0, 1], [0, 1]);

  const blockT = interpolate(frame, [20, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const blockX = interpolate(blockT, [0, 1], [2100, TARGET_BLOCK_X]);
  const blockBlur = interpolate(blockT, [0, 0.6, 1], [18, 6, 0]);
  const blockOpacity = interpolate(frame, [20, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const impactSpring = spring({
    frame: frame - 60,
    fps,
    config: { damping: 6, stiffness: 300 },
  });
  const impactScale = frame >= 60 ? interpolate(impactSpring, [0, 1], [0.9, 1]) : 1;
  const flash = interpolate(frame, [60, 63, 66], [0, 0.7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shake =
    frame >= 60 && frame < 72
      ? Math.sin((frame - 60) * 2.4) * 3 * (1 - (frame - 60) / 12)
      : 0;

  const gaugeProgress = interpolate(frame, [72, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const gaugeR = CIRCLE_D / 2 + 20;
  const gaugeCirc = 2 * Math.PI * gaugeR;
  const textOpacity = interpolate(frame, [90, 105], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ringSpring = spring({
    frame: frame - 130,
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  return (
    <Stage outFrames={15}>
      <AbsoluteFill style={{ fontFamily }}>
        <div
          style={{
            position: "absolute",
            left: CX - CIRCLE_D / 2 + shake,
            top: CY - CIRCLE_D / 2,
            width: CIRCLE_D,
            height: CIRCLE_D,
            borderRadius: "50%",
            background: "rgba(20,30,70,0.7)",
            border: `3px solid ${INK}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${circleScale})`,
            opacity: circleOpacity,
          }}
        >
          <IconChatMark size={ICON.md} color={ACCENT_LIGHT} strokeWidth={4} />
        </div>

        {/* Bloc Higgsfield entrant avec traînée de flou */}
        {[3, 2, 1].map((k) => (
          <div
            key={k}
            style={{
              position: "absolute",
              left: blockX + k * 22,
              top: CY - BLOCK_H / 2,
              width: BLOCK_W,
              height: BLOCK_H,
              borderRadius: 16,
              background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_LIGHT} 100%)`,
              opacity: blockOpacity * (0.15 - k * 0.03),
              filter: `blur(${blockBlur}px)`,
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            left: blockX,
            top: CY - BLOCK_H / 2,
            width: BLOCK_W,
            height: BLOCK_H,
            borderRadius: 16,
            background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_LIGHT} 100%)`,
            border: `1px solid ${atmosPanelBorder(0.4)}`,
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            opacity: blockOpacity,
            transform: `scale(${impactScale})`,
            filter: `blur(${blockBlur}px)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: FONT.micro * 0.5,
            fontWeight: 800,
            color: INK,
          }}
        >
          Higgsfield
        </div>

        {/* Flash d'impact */}
        <div
          style={{
            position: "absolute",
            left: TARGET_BLOCK_X - 20,
            top: CY - 20,
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "#fff",
            opacity: flash,
          }}
        />

        {/* Arc de jauge */}
        <svg
          width={1920}
          height={1080}
          style={{ position: "absolute", inset: 0 }}
        >
          <circle
            cx={CX}
            cy={CY}
            r={gaugeR}
            fill="none"
            stroke={ACCENT_LIGHT}
            strokeWidth={4}
            strokeLinecap="round"
            transform={`rotate(-90 ${CX} ${CY})`}
            style={{
              strokeDasharray: gaugeCirc,
              strokeDashoffset: gaugeCirc * (1 - gaugeProgress),
            }}
          />
          {frame >= 130 && (
            <circle
              cx={CX}
              cy={CY}
              r={gaugeR + 8}
              fill="none"
              stroke={ACCENT_LIGHT}
              strokeWidth={2}
              opacity={interpolate(ringSpring, [0, 1], [0, 1])}
              style={{
                transform: `scale(${interpolate(ringSpring, [0, 1], [0.9, 1])})`,
                transformOrigin: `${CX}px ${CY}px`,
              }}
            />
          )}
        </svg>

        <div
          style={{
            position: "absolute",
            left: CX - 300,
            top: CY + gaugeR + 40,
            width: 600,
            textAlign: "center",
            fontSize: FONT.micro * 0.55,
            fontWeight: 700,
            color: "#CCCCCC",
            opacity: textOpacity,
          }}
        >
          {gainLabel}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
