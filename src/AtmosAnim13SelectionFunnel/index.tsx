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
import { ATMOS_BLUE, ATMOS_GOLD } from "../AtmosOverlay/theme";
import { AtmosBackground } from "../AtmosOverlay/AtmosBackground";

const { fontFamily } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });

export const atmosAnim13Schema = z.object({
  resultLabel: z.string().default("CELLE-LÀ."),
  durationSecs: z.number().default(3.5),
});

export type AtmosAnim13Props = z.infer<typeof atmosAnim13Schema>;

// Réduit de 47 à 14 points bien plus grands pour rester lisible sur mobile — le
// chiffre "47" reste porté par la voix-off, pas par le nombre de points à l'écran.
const CHOSEN_INDEX = 3;
const TOTAL_DOTS = 14;
const DOT_SIZE = 36;

type DotConfig = {
  startX: number;
  startY: number;
  midX: number;
  startFrame: number;
  appearStart: number;
};

const DOTS: DotConfig[] = Array.from({ length: TOTAL_DOTS }).map((_, i) => {
  const col = i % 7;
  const row = Math.floor(i / 7);
  const startX = 500 + col * ((1420 - 500) / 6);
  const startY = 60 + row * 160;
  const midX = 960 + interpolate(random(`funnel-${i}`), [0, 1], [-40, 40]);
  const startFrame = interpolate(random(`funnel-start-${i}`), [0, 1], [15, 25]);
  return { startX, startY, midX, startFrame, appearStart: i * 1.2 };
});

const FUNNEL_PATH =
  "M 460 180 C 700 190, 1220 190, 1460 180 C 1300 400, 1150 600, 990 780 L 930 780 C 770 600, 620 400, 460 180 Z";

export const AtmosAnim13SelectionFunnel: React.FC<AtmosAnim13Props> = ({
  resultLabel,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const funnelOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const chosenSpring = spring({
    frame: frame - 65,
    fps,
    config: { damping: 7, mass: 0.6, stiffness: 160 },
  });

  const glowOpacity = interpolate(frame, [80, 88], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textOpacity = interpolate(frame, [85, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textTranslateY = interpolate(frame, [85, 95], [15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AtmosBackground />
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0, opacity: funnelOpacity }}
      >
        <path d={FUNNEL_PATH} fill={`${ATMOS_BLUE}0D`} stroke={ATMOS_BLUE} strokeOpacity={0.6} strokeWidth={3} />
      </svg>

      {DOTS.map((dot, i) => {
        const isChosen = i === CHOSEN_INDEX;
        const appearOpacity = interpolate(frame, [dot.appearStart, dot.appearStart + 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        // Convergence: startFrame_i -> 65, vers (midX, 650)
        const convergeY = interpolate(frame, [dot.startFrame, 65], [dot.startY, 650], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.in(Easing.cubic),
        });
        const convergeX = interpolate(frame, [dot.startFrame, 65], [dot.startX, dot.midX], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.quad),
        });
        const convergeScale = interpolate(frame, [dot.startFrame, 65], [1, 0.6], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        if (!isChosen) {
          // Phase C: descente vers le col puis absorption
          const neckY = interpolate(frame, [65, 71], [650, 780], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const absorbOpacity = interpolate(frame, [71, 79], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const y = frame < 65 ? convergeY : neckY;
          const opacity = appearOpacity * (frame < 71 ? 1 : absorbOpacity);

          if (frame >= 79) return null;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: convergeX,
                top: y,
                width: DOT_SIZE,
                height: DOT_SIZE,
                borderRadius: "50%",
                background: ATMOS_BLUE,
                opacity,
                transform: `translate(-50%, -50%) scale(${convergeScale})`,
              }}
            />
          );
        }

        // Point élu : continue à travers le col, grossit et devient gold
        const chosenY = frame < 65
          ? convergeY
          : interpolate(frame, [65, 80], [650, 540], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
        const chosenX = frame < 65 ? convergeX : dot.midX;
        const chosenScale = frame < 65
          ? convergeScale
          : interpolate(chosenSpring, [0, 1], [0.6, 4.2]);
        const colorProgress = interpolate(frame, [65, 80], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const chosenColor = frame < 65 ? ATMOS_BLUE : interpolateColors(colorProgress, [0, 1], [ATMOS_BLUE, ATMOS_GOLD]);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: chosenX,
              top: chosenY,
              width: DOT_SIZE,
              height: DOT_SIZE,
              borderRadius: "50%",
              background: chosenColor,
              opacity: appearOpacity,
              transform: `translate(-50%, -50%) scale(${chosenScale})`,
              filter: frame >= 80 ? `drop-shadow(0 0 ${50 * glowOpacity}px rgba(255, 215, 0, ${0.6 * glowOpacity}))` : undefined,
            }}
          />
        );
      })}

      {frame >= 85 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 620,
            transform: `translate(-50%, 0) translateY(${textTranslateY}px)`,
            opacity: textOpacity,
            fontFamily,
            fontWeight: 700,
            fontSize: 52,
            color: "#FFFFFF",
            whiteSpace: "nowrap",
          }}
        >
          {resultLabel}
        </div>
      )}
    </AbsoluteFill>
  );
};
