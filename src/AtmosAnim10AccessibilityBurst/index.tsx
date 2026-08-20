import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { ATMOS_BLUE, ATMOS_GOLD } from "../AtmosOverlay/theme";
import { AtmosBackground } from "../AtmosOverlay/AtmosBackground";

export const atmosAnim10Schema = z.object({
  durationSecs: z.number().default(2.5),
});

export type AtmosAnim10Props = z.infer<typeof atmosAnim10Schema>;

// Réduit de 54 (9x6) à 16 (4x4) icônes bien plus grandes — le chiffre exact
// reste porté par la voix-off, pas par le nombre d'unités affichées à l'écran.
const COLS = 4;
const ROWS = 4;
const MARGIN = 260;
const SPACING_X = (1920 - MARGIN * 2) / COLS;
const SPACING_Y = (1080 - MARGIN * 2) / ROWS;
const BASE_SIZE = 110;

type IconConfig = {
  x: number;
  y: number;
  scale: number;
  isGold: boolean;
  startFrame: number;
};

const ICONS: IconConfig[] = (() => {
  const centerCol = (COLS - 1) / 2;
  const centerRow = (ROWS - 1) / 2;
  const maxDist = Math.sqrt(centerCol * centerCol + centerRow * centerRow);

  const list: IconConfig[] = [];
  let index = 0;
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const seed = `icon-${index}`;
      const jitterX = interpolate(random(seed + "-x"), [0, 1], [-24, 24]);
      const jitterY = interpolate(random(seed + "-y"), [0, 1], [-24, 24]);
      const scaleJitter = interpolate(random(seed + "-scale"), [0, 1], [0.85, 1.15]);
      const isGold = random(seed + "-gold") < 0.15;

      const dist = Math.sqrt((col - centerCol) ** 2 + (row - centerRow) ** 2) / maxDist;
      const startFrame = dist * 45;

      list.push({
        x: MARGIN + col * SPACING_X + SPACING_X / 2 + jitterX,
        y: MARGIN + row * SPACING_Y + SPACING_Y / 2 + jitterY,
        scale: scaleJitter,
        isGold,
        startFrame,
      });
      index++;
    }
  }
  return list;
})();

const PersonIcon: React.FC<{ config: IconConfig; fps: number }> = ({ config, fps }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - config.startFrame;

  if (localFrame < -1) return null;

  const scaleSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 9, mass: 0.6, stiffness: 140 },
  });
  const opacity = interpolate(localFrame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const rotate = interpolate(localFrame, [0, 12], [-8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const glowOpacity = interpolate(localFrame, [0, 5], [0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const color = config.isGold ? ATMOS_GOLD : ATMOS_BLUE;
  const size = BASE_SIZE * config.scale;

  return (
    <div
      style={{
        position: "absolute",
        left: config.x - size / 2,
        top: config.y - size / 2,
        width: size,
        height: size,
        opacity,
        transform: `scale(${scaleSpring}) rotate(${rotate}deg)`,
        filter: glowOpacity > 0 ? `drop-shadow(0 0 18px rgba(48,96,255,${glowOpacity}))` : undefined,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="14" r="9" fill={color} />
        <path
          d="M24 26c-10 0-16 6-16 14v2h32v-2c0-8-6-14-16-14z"
          fill={color}
        />
      </svg>
    </div>
  );
};

export const AtmosAnim10AccessibilityBurst: React.FC<AtmosAnim10Props> = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <AtmosBackground />
      <AbsoluteFill>
        {ICONS.map((config, i) => (
          <PersonIcon key={i} config={config} fps={fps} />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
