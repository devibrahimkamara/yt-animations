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
import { ATMOS_BLUE } from "../AtmosOverlay/theme";
import { AtmosBackground } from "../AtmosOverlay/AtmosBackground";

const { fontFamily } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });

export const atmosAnim15Schema = z.object({
  buttonText: z.string().default("S'ABONNER"),
  durationSecs: z.number().default(2.5),
});

export type AtmosAnim15Props = z.infer<typeof atmosAnim15Schema>;

const BUTTON_W = 340;
const BUTTON_H = 96;
const BUTTON_X = 960;
const BUTTON_Y = 480;

const Ring: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  if (local < 0 || local > 15) return null;

  const scale = interpolate(local, [0, 15], [1, 1.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = interpolate(local, [0, 15], [0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <rect
      x={BUTTON_X - (BUTTON_W / 2) * scale}
      y={BUTTON_Y - (BUTTON_H / 2) * scale}
      width={BUTTON_W * scale}
      height={BUTTON_H * scale}
      rx={48 * scale}
      fill="none"
      stroke="#FFFFFF"
      strokeWidth={3}
      strokeOpacity={opacity}
    />
  );
};

export const AtmosAnim15CTASubscribe: React.FC<AtmosAnim15Props> = ({
  buttonText,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const buttonSpring = spring({
    frame,
    fps,
    config: { damping: 8, mass: 0.6, stiffness: 150 },
  });
  const buttonOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bounceSpring = spring({
    frame: frame - 45,
    fps,
    config: { damping: 5, mass: 0.5, stiffness: 200 },
  });
  const bounceScale = frame >= 45
    ? interpolate(bounceSpring, [0, 0.5, 1], [1, 1.1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

  const buttonScale = buttonSpring * bounceScale;

  // Pouce bleu
  const thumbTranslateX = interpolate(frame, [50, 62], [1500, 1250], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const thumbRotate = interpolate(frame, [50, 59, 68], [-25, 8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const thumbOpacity = interpolate(frame, [50, 58], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const thumbSpring = spring({
    frame: frame - 50,
    fps,
    config: { damping: 7, mass: 0.6, stiffness: 160 },
  });
  const thumbScale = interpolate(thumbSpring, [0, 1], [0.7, 1]);

  const thumbGlow = interpolate(frame, [65, 72], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AtmosBackground />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <Ring startFrame={15} />
        <Ring startFrame={25} />
      </svg>

      {/* Bouton S'ABONNER */}
      <div
        style={{
          position: "absolute",
          left: BUTTON_X - BUTTON_W / 2,
          top: BUTTON_Y - BUTTON_H / 2,
          width: BUTTON_W,
          height: BUTTON_H,
          borderRadius: 48,
          background: "#FF0000",
          opacity: buttonOpacity,
          transform: `scale(${buttonScale})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize: 36,
            color: "#FFFFFF",
            textTransform: "uppercase",
          }}
        >
          {buttonText}
        </span>
      </div>

      {/* Cloche */}
      <div
        style={{
          position: "absolute",
          left: BUTTON_X + BUTTON_W / 2 + 36,
          top: BUTTON_Y - 32,
          opacity: buttonOpacity,
          transform: `scale(${buttonSpring})`,
        }}
      >
        <svg width={64} height={64} viewBox="0 0 56 56" fill="none">
          <path
            d="M28 8c-8 0-14 6-14 16v8l-4 6h36l-4-6v-8c0-10-6-16-14-16z"
            stroke="#FFFFFF"
            strokeWidth={4}
            strokeLinejoin="round"
          />
          <path d="M22 44a6 6 0 0 0 12 0" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" />
        </svg>
      </div>

      {/* Pouce bleu */}
      {frame >= 50 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: BUTTON_Y - 52,
            opacity: thumbOpacity,
            transform: `translateX(${thumbTranslateX}px) scale(${thumbScale}) rotate(${thumbRotate}deg)`,
            transformOrigin: "50% 90%",
            filter: frame >= 65 ? `drop-shadow(0 0 ${20 * thumbGlow}px rgba(48,96,255,${0.5 * thumbGlow}))` : undefined,
          }}
        >
          <svg width={104} height={104} viewBox="0 0 90 90" fill="none">
            <path
              d="M30 40 L30 78 L18 78 C13 78 9 74 9 69 L9 49 C9 44 13 40 18 40 Z M30 40 L38 14 C39 9 44 7 48 10 C51 12 52 16 51 20 L47 36 L70 36 C76 36 81 42 79 48 L72 70 C70 75 65 78 60 78 L30 78"
              fill={ATMOS_BLUE}
            />
          </svg>
        </div>
      )}
    </AbsoluteFill>
  );
};
