import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { ACCENT, FONT, INK, NEUTRAL_PANEL } from "../higgsOpus/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});

// Anim 7 — « Le CTA abonnement et pouce » (135 frames / 4,5 s @ 30 fps)
// Pensée pour incrustation en coin (bas-droite) : fond transparent.
// Phase 1 apparition 0–12 · Phase 2 curseur entre 8–25 · Phase 3 clic 25–45 ·
// Phase 4 cloche 35–65 · Phase 5 curseur->pouce 60–85 · Phase 6 pouce+ "+1" 85–110 · Phase 7 stabilisation 110–135

export const higgsOpusAnim07Schema = z.object({
  subscribeLabel: z.string().default("S'ABONNER"),
  subscribedLabel: z.string().default("ABONNÉ"),
});
export type HiggsOpusAnim07Props = z.infer<typeof higgsOpusAnim07Schema>;

export const HiggsOpusAnim07CtaAbonnementPouce: React.FC<HiggsOpusAnim07Props> = ({
  subscribeLabel,
  subscribedLabel,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const btnSpring = interpolate(
    spring({ frame, fps, config: { damping: 14, stiffness: 190 } }),
    [0, 1],
    [0.8, 1],
  );
  const btnOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cursor1Progress = interpolate(frame, [8, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const clicked = frame >= 25;
  const clickBounce = interpolate(
    spring({ frame: frame - 25, fps, config: { damping: 12, stiffness: 300 } }),
    [0, 1],
    [0.85, 1],
  );
  const btnColor = interpolateColors(
    interpolate(frame, [25, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    [0, 1],
    [ACCENT, NEUTRAL_PANEL],
  );
  const flash1Opacity = interpolate(frame, [25, 33], [0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cloche : deux balancements amortis
  const bellFirst = frame >= 35 && frame < 50 ? Math.sin(((frame - 35) / 15) * Math.PI) * 15 : 0;
  const bellSecond = frame >= 50 && frame < 65 ? Math.sin(((frame - 50) / 15) * Math.PI) * 8 : 0;
  const bellRotate = bellFirst || bellSecond;

  const thumbAppearOpacity = interpolate(frame, [60, 68], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursor2Progress = interpolate(frame, [65, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const thumbBounce = interpolate(
    spring({ frame: frame - 85, fps, config: { damping: 10, stiffness: 300 } }),
    [0, 1],
    [1, 1.3],
  );
  const thumbFilled = frame >= 85;
  const plusOneY = interpolate(frame, [95, 110], [0, -15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const plusOneOpacity = interpolate(frame, [95, 110], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cursorExitOpacity = interpolate(frame, [115, 125], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "transparent", fontFamily }}>
      <div style={{ position: "absolute", right: 120, bottom: 140, display: "flex", alignItems: "center", gap: 24 }}>
        {/* Bouton S'abonner / Abonné */}
        <div
          style={{
            width: 260,
            height: 90,
            borderRadius: 16,
            background: btnColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${btnSpring * (clicked ? clickBounce : 1)})`,
            opacity: btnOpacity,
            position: "relative",
          }}
        >
          <span style={{ color: INK, fontWeight: 800, fontSize: FONT.micro }}>
            {clicked ? subscribedLabel : subscribeLabel}
          </span>
          {frame >= 25 && frame < 33 && (
            <div
              style={{
                position: "absolute",
                width: 140,
                height: 140,
                borderRadius: "50%",
                border: `2px solid ${ACCENT}`,
                opacity: flash1Opacity,
              }}
            />
          )}
        </div>

        {/* Cloche */}
        <svg
          width={ 70 }
          height={70}
          viewBox="0 0 24 24"
          style={{
            transform: `rotate(${bellRotate}deg)`,
            transformOrigin: "50% 10%",
            opacity: btnOpacity,
          }}
        >
          <path
            d="M12 2a5 5 0 00-5 5v3c0 1.5-.6 2.9-1.6 4H18.6c-1-1.1-1.6-2.5-1.6-4V7a5 5 0 00-5-5zM9.5 19a2.5 2.5 0 005 0h-5z"
            fill="none"
            stroke={INK}
            strokeWidth={1.5}
          />
        </svg>

        {/* Pouce */}
        <div
          style={{
            position: "relative",
            width: 100,
            height: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: thumbAppearOpacity,
            transform: `scale(${thumbFilled ? thumbBounce : 1})`,
          }}
        >
          <svg width={64} height={64} viewBox="0 0 24 24">
            <path
              d="M2 21h3V9H2v12zm19-9.5c0-.8-.7-1.5-1.5-1.5H14l1-4.5c.1-.6-.1-1.2-.5-1.6L13.5 3 8 8.6V21h11c.6 0 1.2-.4 1.4-1l2-6.3c.1-.2.1-.4.1-.7v-1.5z"
              fill={thumbFilled ? ACCENT : "none"}
              stroke={INK}
              strokeWidth={1.2}
            />
          </svg>
          {frame >= 95 && frame < 110 && (
            <div
              style={{
                position: "absolute",
                top: -20,
                color: ACCENT,
                fontWeight: 800,
                fontSize: FONT.value,
                transform: `translateY(${plusOneY}px)`,
                opacity: plusOneOpacity,
              }}
            >
              +1
            </div>
          )}
        </div>

        {/* Curseur */}
        {frame >= 8 && frame < 125 && (
          <div
            style={{
              position: "absolute",
              right: -40,
              bottom: -40,
              transform: `translate(${interpolate(
                frame < 65 ? cursor1Progress : cursor2Progress,
                [0, 1],
                frame < 65 ? [60, -180] : [-40, -320],
              )}px, ${interpolate(
                frame < 65 ? cursor1Progress : cursor2Progress,
                [0, 1],
                frame < 65 ? [60, -20] : [-20, 30],
              )}px)`,
              opacity: cursorExitOpacity,
            }}
          >
            <svg width={40} height={40} viewBox="0 0 24 24">
              <path d="M4 3l16 8-7 2-2 7-7-17z" fill={INK} stroke="#00000055" />
            </svg>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
