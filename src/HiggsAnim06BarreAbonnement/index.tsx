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
import { Stage } from "../higgs/Stage";
import { Emoji } from "../higgs/Emoji";
import { ACCENT, ACCENT_LIGHT, WARM, INK, FONT, ICON } from "../higgs/theme";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });

export const higgsAnim06Schema = z.object({
  idleLabel: z.string().default("S'ABONNER"),
  doneLabel: z.string().default("ABONNÉ"),
});

export type HiggsAnim06Props = z.infer<typeof higgsAnim06Schema>;

const BAR_W = 660;
const BAR_H = 150;
const FILL_START = 8;
const FILL_END = 45;
const DONE = 45;

export const HiggsAnim06BarreAbonnement: React.FC<HiggsAnim06Props> = ({ idleLabel, doneLabel }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const intro = spring({ frame, fps, config: { damping: 14, stiffness: 170 } });

  const fill = interpolate(frame, [FILL_START, FILL_END], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const doneSpring = spring({ frame: frame - DONE, fps, config: { damping: 12, stiffness: 160 } });
  const radius = interpolate(doneSpring, [0, 1], [16, 999], { extrapolateRight: "clamp" });
  const bg = frame >= DONE ? WARM : "transparent";
  const labelCross = interpolate(frame, [DONE, DONE + 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bounce = spring({ frame: frame - DONE, fps, config: { damping: 8, stiffness: 260 } });
  const bounceScale = frame >= DONE
    ? interpolate(bounce, [0, 0.5, 1], [1, 1.08, 1], { extrapolateRight: "clamp" })
    : 1;

  // pouce
  const thumbSpring = spring({ frame: frame - 55, fps, config: { damping: 13, stiffness: 150 } });
  const thumbX = interpolate(thumbSpring, [0, 1], [420, 0], { extrapolateRight: "clamp" });
  const thumbY = interpolate(thumbSpring, [0, 1], [360, 0], { extrapolateRight: "clamp" });
  const thumbRot = interpolate(thumbSpring, [0, 1], [-15, 0], { extrapolateRight: "clamp" });
  const thumbPulse = spring({ frame: frame - 72, fps, config: { damping: 9, stiffness: 240 } });
  const thumbScale = frame >= 72
    ? interpolate(thumbPulse, [0, 0.5, 1], [1, 1.15, 1], { extrapolateRight: "clamp" })
    : 1;

  return (
    <Stage outFrames={10}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "relative",
            opacity: intro,
            transform: `scale(${interpolate(intro, [0, 1], [0.9, 1]) * bounceScale})`,
          }}
        >
          <div
            style={{
              position: "relative",
              width: BAR_W,
              height: BAR_H,
              borderRadius: radius,
              border: `4px solid ${ACCENT}`,
              background: bg,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* remplissage */}
            {frame < DONE && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${fill}%`,
                  background: `linear-gradient(90deg, ${ACCENT} 0%, ${ACCENT_LIGHT} 50%, ${ACCENT} 100%)`,
                  backgroundSize: "200% 100%",
                  backgroundPosition: `${100 - fill}% 0`,
                }}
              />
            )}
            <span
              style={{
                position: "absolute",
                fontFamily,
                fontWeight: 800,
                fontSize: FONT.label,
                color: INK,
                opacity: 1 - labelCross,
              }}
            >
              {idleLabel}
            </span>
            <span
              style={{
                position: "absolute",
                fontFamily,
                fontWeight: 800,
                fontSize: FONT.label,
                color: INK,
                opacity: labelCross,
              }}
            >
              {doneLabel}
            </span>
          </div>

          {/* pouce */}
          {frame >= 55 && (
            <div
              style={{
                position: "absolute",
                right: -60,
                top: -60,
                transform: `translate(${thumbX}px, ${thumbY}px) rotate(${thumbRot}deg) scale(${thumbScale})`,
              }}
            >
              <Emoji size={ICON.lg}>👍</Emoji>
            </div>
          )}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
