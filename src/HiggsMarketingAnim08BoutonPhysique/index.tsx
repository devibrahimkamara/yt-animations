import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsMarketing/Stage";
import { ACCENT, FONT, INK } from "../higgsMarketing/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});

// Anim 8 — « Le bouton physique » (135 frames / 4,5 s @ 30 fps)
// Phase 1 apparition bouton 0–15 · Phase 2 appui 15–45 ·
// Phase 3 rebond 45–60 · Phase 4 transition toggle 60–75 ·
// Phase 5 bascule toggle 75–105 · Phase 6 maintien 105–135

export const higgsMarketingAnim08Schema = z.object({
  subscribeLabel: z.string().default("Abonné"),
});
export type HiggsMarketingAnim08Props = z.infer<
  typeof higgsMarketingAnim08Schema
>;

export const HiggsMarketingAnim08BoutonPhysique: React.FC<
  HiggsMarketingAnim08Props
> = ({ subscribeLabel }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const btnSpring = spring({ frame, fps, config: { damping: 10, stiffness: 150 } });
  const btnScale = interpolate(btnSpring, [0, 1], [0, 1]);
  const btnOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cursorX = interpolate(frame, [15, 35], [-500, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursorScale = frame >= 35 && frame < 45 ? 0.9 : 1;

  const pressed = frame >= 35 && frame < 45;
  const bounceSpring = spring({ frame: frame - 45, fps, config: { damping: 6, stiffness: 260 } });
  const pressDepth = pressed ? interpolate(frame, [35, 40], [0, 14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const bounceLift = frame >= 45 ? interpolate(bounceSpring, [0, 1], [0, -10]) : 0;
  const buttonY = frame < 45 ? pressDepth : bounceLift;
  const shadowSpread = frame >= 35 && frame < 45 ? interpolate(frame, [35, 40], [30, 10], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 30;

  const toggleOpacity = interpolate(frame, [60, 68], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const toggleY = interpolate(frame, [60, 68], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const toggleSpring = spring({ frame: frame - 75, fps, config: { damping: 12, stiffness: 200 } });
  const knobX = frame >= 75 ? interpolate(toggleSpring, [0, 1], [0, 60]) : 0;
  const colorT = interpolate(frame, [75, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const trackColor = `rgba(${72 + (48 - 72) * colorT}, ${72 + (96 - 72) * colorT}, ${74 + (255 - 74) * colorT}, 1)`;
  const validatePulse = frame >= 100 && frame < 112 ? 1 + Math.sin((frame - 100) * 0.5) * 0.08 : 1;

  return (
    <Stage outFrames={10}>
      <AbsoluteFill style={{ fontFamily, alignItems: "center", justifyContent: "center", gap: 60 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 60 }}>
          <div
            style={{
              position: "relative",
              width: 260,
              height: 260,
              opacity: btnOpacity,
              transform: `scale(${btnScale})`,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: `radial-gradient(circle at 35% 25%, #7fa0ff, ${ACCENT})`,
                transform: `translateY(${buttonY}px)`,
                boxShadow: `0 ${shadowSpread + buttonY}px ${shadowSpread * 2}px rgba(0,0,0,0.45)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 120,
              }}
            >
              👍
            </div>
            {frame >= 15 && frame < 46 && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: `translate(-50%, -50%) translateX(${cursorX}px) scale(${cursorScale})`,
                  fontSize: 70,
                }}
              >
                👆
              </div>
            )}
          </div>

          {frame >= 60 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                opacity: toggleOpacity,
                transform: `translateY(${toggleY}px) scale(${validatePulse})`,
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: 130,
                  height: 68,
                  borderRadius: 999,
                  background: trackColor,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 6,
                    left: 6 + knobX,
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "#fff",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.35)",
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: FONT.label,
                  fontWeight: frame >= 100 ? 800 : 700,
                  color: INK,
                }}
              >
                {subscribeLabel}
              </div>
            </div>
          )}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
