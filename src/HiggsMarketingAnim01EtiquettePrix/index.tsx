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
import { ShakeWrapper } from "../higgsMarketing/utils";
import { ACCENT, ATMOS_ERROR, FONT, KRAFT_BG, KRAFT_INK } from "../higgsMarketing/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});

// Anim 1 — « L'étiquette de prix » (135 frames / 4,5 s @ 30 fps)
// Phase 1 entrée du cadre 0–25 · Phase 2 chute + pendule 20–70 ·
// Phase 3 tampon "VENDU" 70–100 · Phase 4 maintien 100–135

export const higgsMarketingAnim01Schema = z.object({
  labelText: z.string().default("Vidéo perso"),
  stampText: z.string().default("VENDU"),
});
export type HiggsMarketingAnim01Props = z.infer<
  typeof higgsMarketingAnim01Schema
>;

const FRAME_SIZE = 620;

export const HiggsMarketingAnim01EtiquettePrix: React.FC<
  HiggsMarketingAnim01Props
> = ({ labelText, stampText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 — cadre vidéo
  const frameSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  const frameScale = interpolate(frameSpring, [0, 1], [1.4, 1]);
  const frameOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 2 — chute de l'étiquette
  const dropSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 11, stiffness: 90 },
  });
  const labelY = interpolate(dropSpring, [0, 1], [-260, 0]);
  const labelOpacity = interpolate(frame, [20, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const t = Math.max(0, (frame - 34) / 30);
  const amplitude = 15 * Math.exp(-2.4 * t);
  const swing = frame >= 34 ? Math.sin((frame - 34) * 0.45) * amplitude : 0;
  const residual = frame >= 100 ? Math.sin(frame * 0.3) * 1.2 : 0;

  // Phase 3 — tampon VENDU
  const stampSpring = spring({
    frame: frame - 70,
    fps,
    config: { damping: 14, stiffness: 260 },
  });
  const stampScale = interpolate(stampSpring, [0, 1], [1.8, 1]);
  const stampX = interpolate(stampSpring, [0, 1], [-380, 0]);
  const stampYIn = interpolate(stampSpring, [0, 1], [-320, 0]);
  const stampOpacity = interpolate(frame, [70, 74], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage outFrames={10}>
      <AbsoluteFill
        style={{
          fontFamily,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ShakeWrapper startFrame={78} durationFrames={6} amplitude={4}>
          <div
            style={{
              position: "relative",
              width: FRAME_SIZE,
              height: FRAME_SIZE,
              borderRadius: 24,
              border: "6px solid #fff",
              boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
              overflow: "visible",
              opacity: frameOpacity,
              transform: `scale(${frameScale})`,
              background:
                "linear-gradient(160deg, #b71c1c 0%, #7a1010 55%, #2e0505 100%)",
            }}
          >
            <AbsoluteFill
              style={{
                borderRadius: 18,
                overflow: "hidden",
                background:
                  "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.15), transparent 60%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 28,
                left: 0,
                right: 0,
                textAlign: "center",
                color: "#fff",
                fontSize: FONT.label,
                fontWeight: 800,
                textShadow: "0 4px 20px rgba(0,0,0,0.6)",
              }}
            >
              🎅 Joyeux Noël !
            </div>

            {/* Ficelle */}
            <svg
              width={4}
              height={140}
              style={{
                position: "absolute",
                top: -140,
                right: 90,
                overflow: "visible",
              }}
            >
              <line
                x1={2}
                y1={0}
                x2={2}
                y2={140}
                stroke="rgba(255,255,255,0.7)"
                strokeWidth={2}
              />
            </svg>

            {/* Étiquette */}
            <div
              style={{
                position: "absolute",
                top: -4,
                right: 40,
                width: 200,
                height: 120,
                transformOrigin: "top center",
                opacity: labelOpacity,
                transform: `translateY(${labelY}px) rotate(${swing + residual}deg)`,
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  background: KRAFT_BG,
                  borderRadius: 12,
                  border: `2px solid ${KRAFT_INK}55`,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: "#00000030",
                    border: `2px solid ${KRAFT_INK}66`,
                  }}
                />
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: KRAFT_INK,
                    fontStyle: "italic",
                    marginTop: 12,
                  }}
                >
                  {labelText}
                </div>

                {/* Tampon VENDU */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: stampOpacity,
                    transform: `translate(${stampX}px, ${stampYIn}px) scale(${stampScale}) rotate(-8deg)`,
                  }}
                >
                  <div
                    style={{
                      padding: "10px 18px",
                      border: `4px solid ${ATMOS_ERROR}`,
                      borderRadius: 8,
                      color: ATMOS_ERROR,
                      fontSize: 26,
                      fontWeight: 800,
                      letterSpacing: 2,
                      background: "rgba(255,255,255,0.05)",
                    }}
                  >
                    {stampText}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ShakeWrapper>

        <div
          style={{
            position: "absolute",
            bottom: 90,
            fontSize: FONT.micro,
            fontWeight: 700,
            color: ACCENT,
            opacity: interpolate(frame, [100, 112], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Un side hustle qui se revend à l'infini
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
