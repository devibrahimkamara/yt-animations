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
import { IconTarget, IconFilmPen, IconBroadcast } from "../higgsGpt2/icons";
import {
  ACCENT,
  ACCENT_LIGHT,
  INK,
  FONT,
  ICON,
  NEUTRAL_LINE,
  atmosPanelBorder,
  atmosGlow,
} from "../higgsGpt2/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});

// Anim 2 — « La chaîne de production en 3 maillons » (240 frames / 8 s @ 30 fps)
// A cartes vides 0–15 · B trajet 1→2 + carte 1 s'allume 15–75
// C trajet 2→3 + carte 2 s'allume 75–150 · D carte 3 s'allume 150–195
// E hold 195–225 · F sortie 225–240

export const higgsGpt2Anim02Schema = z.object({
  titles: z
    .array(z.string())
    .default(["NICHE", "SCRIPT + VIDÉO", "PUBLICATION"]),
});
export type HiggsGpt2Anim02Props = z.infer<typeof higgsGpt2Anim02Schema>;

const CARD_W = 480;
const CARD_H = 280;
const GAP = 120;
const TOTAL_W = CARD_W * 3 + GAP * 2;
const START_X = (1920 - TOTAL_W) / 2;
const CY = 540;

const CARD_GRADS = [
  "linear-gradient(135deg, rgba(20,40,120,0.65) 0%, rgba(45,27,78,0.55) 100%)",
  "linear-gradient(135deg, rgba(13,33,55,0.65) 0%, rgba(26,74,110,0.55) 100%)",
  "linear-gradient(135deg, rgba(26,10,46,0.65) 0%, rgba(74,26,110,0.55) 100%)",
];

const ICONS = [IconTarget, IconFilmPen, IconBroadcast];

export const HiggsGpt2Anim02ChaineProduction3Maillons: React.FC<
  HiggsGpt2Anim02Props
> = ({ titles }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardX = (i: number) => START_X + i * (CARD_W + GAP) + CARD_W / 2;
  const lineY = CY;

  // Progression du point sur les 2 segments : 15→75 (seg 1), 75→150 (seg 2)
  const seg1 = interpolate(frame, [15, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const seg2 = interpolate(frame, [75, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  let dotX = cardX(0);
  if (frame >= 15 && frame < 75) {
    dotX = interpolate(seg1, [0, 1], [cardX(0), cardX(1)]);
  } else if (frame >= 75 && frame < 150) {
    dotX = interpolate(seg2, [0, 1], [cardX(1), cardX(2)]);
  } else if (frame >= 150) {
    dotX = cardX(2);
  }
  const dotVisible = frame >= 15 && frame < 150;

  const lightUp = (start: number, span: number) =>
    interpolate(frame, [start, start + span], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });

  const cardLight = [lightUp(20, 25), lightUp(75, 25), lightUp(150, 25)];

  const iconSpring = (start: number) =>
    spring({ frame: frame - start, fps, config: { damping: 12, stiffness: 150 } });
  const iconPop = [iconSpring(30), iconSpring(85), iconSpring(160)];

  const glowPulse = (start: number) =>
    interpolate(
      frame,
      [start, start + 10, start + 20],
      [0, 8, 4],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
  const pulse = [glowPulse(20), glowPulse(75), glowPulse(150)];

  return (
    <Stage outFrames={15}>
      <AbsoluteFill style={{ fontFamily }}>
        {/* Ligne de connexion */}
        <svg
          width={1920}
          height={1080}
          style={{ position: "absolute", inset: 0 }}
        >
          <line
            x1={cardX(0)}
            y1={lineY}
            x2={cardX(2)}
            y2={lineY}
            stroke={NEUTRAL_LINE}
            strokeWidth={3}
            opacity={interpolate(frame, [0, 15], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
          />
          <line
            x1={cardX(0)}
            y1={lineY}
            x2={interpolate(seg1, [0, 1], [cardX(0), cardX(1)], {
              extrapolateRight: "clamp",
            })}
            y2={lineY}
            stroke={ACCENT}
            strokeWidth={4}
            opacity={frame >= 15 ? 1 : 0}
          />
          {frame >= 75 && (
            <line
              x1={cardX(1)}
              y1={lineY}
              x2={interpolate(seg2, [0, 1], [cardX(1), cardX(2)], {
                extrapolateRight: "clamp",
              })}
              y2={lineY}
              stroke={ACCENT}
              strokeWidth={4}
            />
          )}
          {dotVisible && (
            <circle
              cx={dotX}
              cy={lineY}
              r={12}
              fill={ACCENT_LIGHT}
              style={{ filter: `drop-shadow(0 0 14px ${ACCENT})` }}
            />
          )}
        </svg>

        {[0, 1, 2].map((i) => {
          const Icon = ICONS[i];
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: START_X + i * (CARD_W + GAP),
                top: CY - CARD_H / 2,
                width: CARD_W,
                height: CARD_H,
                borderRadius: 16,
                background:
                  cardLight[i] > 0
                    ? CARD_GRADS[i]
                    : "transparent",
                border: `2px solid ${
                  cardLight[i] > 0.05
                    ? atmosPanelBorder(0.6)
                    : "rgba(58,58,60,0.8)"
                }`,
                opacity: interpolate(frame, [0, 15], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                boxShadow:
                  cardLight[i] > 0.05
                    ? atmosGlow(ACCENT, 20, 50)
                    : "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 24,
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  transform: `scale(${interpolate(iconPop[i], [0, 1], [0, 1])})`,
                  opacity: cardLight[i],
                }}
              >
                <Icon size={ICON.md} color={ACCENT_LIGHT} strokeWidth={4} />
              </div>
              <div
                style={{
                  fontSize: FONT.micro,
                  fontWeight: 800,
                  letterSpacing: "1px",
                  color: cardLight[i] > 0.5 ? INK : "#555555",
                  textShadow:
                    pulse[i] > 0
                      ? `0 0 ${pulse[i]}px rgba(120,150,255,0.8)`
                      : "none",
                }}
              >
                {titles[i]}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </Stage>
  );
};
