import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { ATMOS_BLUE, ATMOS_GOLD, ATMOS_PANEL_BG, atmosGlow, atmosPanelBorder } from "../AtmosOverlay/theme";
import { AtmosBackground } from "../AtmosOverlay/AtmosBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "800"], subsets: ["latin"] });

export const atmosAnim12Schema = z.object({
  targetNumber: z.number().default(47),
  label: z.string().default("IDÉES"),
  durationSecs: z.number().default(2.5),
});

export type AtmosAnim12Props = z.infer<typeof atmosAnim12Schema>;

const DECOY_COUNT = 8;
const DECOYS = Array.from({ length: DECOY_COUNT }).map((_, i) => {
  const seed = `decoy-${i}`;
  const startFrame = interpolate(random(seed + "-start"), [0, 1], [8, 40]);
  const angle = interpolate(random(seed + "-angle"), [0, 1], [0, Math.PI * 2]);
  const radius = interpolate(random(seed + "-radius"), [0, 1], [300, 450]);
  const number = Math.floor(interpolate(random(seed + "-num"), [0, 1], [1, 46]));
  return {
    startFrame,
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
    label: `Idée #${number}`,
  };
});

export const AtmosAnim12Counter47: React.FC<AtmosAnim12Props> = ({
  targetNumber,
  label,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panelOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rawCount = interpolate(frame, [8, 53], [0, targetNumber], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const displayNumber = Math.floor(rawCount);

  const colorProgress = interpolate(frame, [53, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const numberColor = interpolateColors(colorProgress, [0, 1], [ATMOS_BLUE, ATMOS_GOLD]);

  const impactSpring = spring({
    frame: frame - 53,
    fps,
    config: { damping: 8, mass: 0.7, stiffness: 150 },
  });
  const numberScale = frame >= 53
    ? interpolate(impactSpring, [0, 0.5, 1], [1, 1.15, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

  const glowOpacity = interpolate(frame, [53, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const decoysOpacity = interpolate(frame, [53, 58], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const labelOpacity = interpolate(frame, [60, 68], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const labelTranslateY = interpolate(frame, [60, 68], [15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <AbsoluteFill>
      <AtmosBackground />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "absolute",
            width: 760,
            height: 540,
            borderRadius: 36,
            background: ATMOS_PANEL_BG,
            border: `1px solid ${atmosPanelBorder(0.3)}`,
            boxShadow: atmosGlow(ATMOS_BLUE, 50, 100),
            opacity: panelOpacity,
          }}
        />

        {frame < 58 &&
          DECOYS.map((decoy, i) => {
            const localFrame = frame - decoy.startFrame;
            if (localFrame < 0 || localFrame > 8) return null;
            const decoyOpacity =
              interpolate(localFrame, [0, 4, 8], [0, 0.4, 0]) * decoysOpacity;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  transform: `translate(${decoy.x}px, ${decoy.y}px)`,
                  opacity: decoyOpacity,
                  filter: "blur(3px)",
                  fontFamily,
                  fontWeight: 700,
                  fontSize: 32,
                  color: ATMOS_BLUE,
                }}
              >
                {decoy.label}
              </div>
            );
          })}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              minWidth: 400,
              textAlign: "center",
              transform: `scale(${numberScale})`,
              fontFamily,
              fontWeight: 800,
              fontSize: 180,
              letterSpacing: "-2px",
              color: numberColor,
              textShadow: `0px 0px 50px rgba(255, 215, 0, ${0.4 * glowOpacity})`,
            }}
          >
            {displayNumber}
          </div>
          <div
            style={{
              opacity: labelOpacity,
              transform: `translateY(${labelTranslateY}px)`,
              fontFamily,
              fontWeight: 700,
              fontSize: 48,
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: "#FFFFFF",
            }}
          >
            {label}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
