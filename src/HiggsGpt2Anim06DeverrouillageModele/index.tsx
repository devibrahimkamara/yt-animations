import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsGpt2/Stage";
import { ASTRA_TEAL, ASTRA_TEAL_GLOW, FONT, NEUTRAL_PANEL } from "../higgsGpt2/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});

// Anim 6 — « Le déverrouillage du modèle » (180 frames / 6 s @ 30 fps)
// A 4 lignes qui arrivent 0–45 · B hold verrouillé 45–75
// C anse qui pivote (ligne 4) 75–105 · D fond + halo ligne 4 105–140
// E hold contraste 140–170 · F sortie 170–180

export const higgsGpt2Anim06Schema = z.object({
  models: z
    .array(z.string())
    .default(["GPT-5", "GPT-5.2", "GPT-6", "GPT-6 Astra"]),
});
export type HiggsGpt2Anim06Props = z.infer<typeof higgsGpt2Anim06Schema>;

const interpolateColor = (
  frame: number,
  range: [number, number],
  channel: [number, number],
) => {
  const v = interpolate(frame, range, channel, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return `rgb(${v}, ${v}, ${v})`;
};

const ROW_W = 900;
const ROW_H = 110;
const ROW_GAP = 30;
const TOTAL_H = ROW_H * 4 + ROW_GAP * 3;
const TOP = (1080 - TOTAL_H) / 2;
const LEFT = (1920 - ROW_W) / 2;

const Lock: React.FC<{ open: number; color: string; size: number }> = ({
  open,
  color,
  size,
}) => {
  const shackleRotation = open * -35;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Anse pivotante, ancrée à droite */}
      <g
        style={{
          transformOrigin: "34px 21px",
          transform: `rotate(${shackleRotation}deg)`,
        }}
      >
        <path
          d="M14 21 v-5 a10 10 0 0 1 20 0 v5"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          fill="none"
        />
      </g>
      {/* Corps, fixe */}
      <rect x="9" y="21" width="30" height="22" rx="4" stroke={color} strokeWidth={4} fill="none" />
      <line x1="24" y1="29" x2="24" y2="35" stroke={color} strokeWidth={4} strokeLinecap="round" />
    </svg>
  );
};

export const HiggsGpt2Anim06DeverrouillageModele: React.FC<
  HiggsGpt2Anim06Props
> = ({ models }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const shackleSpring = spring({
    frame: frame - 75,
    fps,
    config: { damping: 10, stiffness: 150 },
  });
  const brightness = interpolate(frame, [95, 105, 115], [1, 1.4, 1.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rowFill = interpolate(frame, [105, 125], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const haloSpring = spring({
    frame: frame - 105,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const halo = interpolate(haloSpring, [0, 1], [0, 0.25]);

  return (
    <Stage outFrames={10}>
      <AbsoluteFill style={{ fontFamily }}>
        {models.map((m, i) => {
          const rowSpring = spring({
            frame: frame - i * 10,
            fps,
            config: { damping: 14, stiffness: 180 },
          });
          const y = interpolate(rowSpring, [0, 1], [15, 0]);
          const opacity = interpolate(rowSpring, [0, 1], [0, 1]);
          const isLast = i === models.length - 1;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: LEFT,
                top: TOP + i * (ROW_H + ROW_GAP),
                width: ROW_W,
                height: ROW_H,
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                gap: 36,
                paddingLeft: 32,
                boxSizing: "border-box",
                opacity,
                transform: `translateY(${y}px)`,
                background: isLast
                  ? `linear-gradient(90deg, rgba(16,163,127,${rowFill * 0.28}) 0%, rgba(16,163,127,${rowFill * 0.1}) 100%)`
                  : "transparent",
                boxShadow: isLast
                  ? `0 0 60px ${halo * 200}px ${ASTRA_TEAL_GLOW}`
                  : "none",
              }}
            >
              {isLast ? (
                <div style={{ filter: `brightness(${brightness})` }}>
                  <Lock
                    open={shackleSpring}
                    color={frame >= 95 ? ASTRA_TEAL : "#666666"}
                    size={56}
                  />
                </div>
              ) : (
                <Lock open={0} color="#666666" size={56} />
              )}
              <div
                style={{
                  fontSize: FONT.label * 0.6,
                  fontWeight: 800,
                  color: isLast
                    ? interpolateColor(frame, [95, 105], [119, 255])
                    : "#777777",
                  filter: isLast ? `brightness(${brightness})` : "none",
                }}
              >
                {m}
              </div>
              {!isLast && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 16,
                    background: NEUTRAL_PANEL,
                    opacity: 0.15,
                    zIndex: -1,
                  }}
                />
              )}
            </div>
          );
        })}
      </AbsoluteFill>
    </Stage>
  );
};
