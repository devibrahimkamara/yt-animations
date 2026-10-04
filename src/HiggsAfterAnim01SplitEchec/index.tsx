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
import { Stage } from "../higgsAfter/Stage";
import { ACCENT, FAIL_RED, INK, FONT, mulberry32 } from "../higgsAfter/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});

// Anim 1 — Plan 1 « Split-screen rendu pro / niveau réel » (195 frames / 6,5s)
// A sweep diagonale 0–24 · B repos 24–60 · C jauge tremble 60–120 ·
// D freeze + pulse "0%" 120–165 · E hold 165–195

export const higgsAfterAnim01Schema = z.object({});
export type HiggsAfterAnim01Props = z.infer<typeof higgsAfterAnim01Schema>;

const W = 1920;
const H = 1080;
const SPLIT_X_FINAL = 54; // % — position finale de la diagonale
const SPLIT_SKEW = 11; // % — décalage horizontal haut/bas pour l'angle

export const HiggsAfterAnim01SplitEchec: React.FC<
  HiggsAfterAnim01Props
> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rng = mulberry32(0x11);

  // A — sweep de la diagonale (clip-path du conteneur droit)
  const sweep = interpolate(frame, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const splitX = interpolate(sweep, [0, 1], [104, SPLIT_X_FINAL]);

  // C — jauge tremblante (0–60 local, frame - 60)
  const gLocal = frame - 60;
  const gaugeRaw = interpolate(
    gLocal,
    [0, 15, 21, 27, 33, 39, 48, 60],
    [0, 8, 14, 10, 17, 13, 19, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    },
  );
  const gaugeValue = frame < 60 ? 0 : gaugeRaw;
  const gaugeDisplay = Math.round(gaugeValue);

  // D — pulse du "0%" une fois figé
  const pulse = spring({
    frame: frame - 132,
    fps,
    config: { damping: 6, stiffness: 120 },
  });
  const pulseScale = interpolate(pulse, [0, 0.5, 1], [1, 1.15, 1]);

  // Titre côté droit
  const titleIn = interpolate(frame, [24, 33], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Vignettes de rendu (côté gauche)
  const thumbs = new Array(6).fill(0).map(() => {
    const hue = 210 + rng() * 60;
    return `linear-gradient(135deg, hsl(${hue} 55% 28%), hsl(${hue + 30} 55% 14%))`;
  });
  const thumbTravel = ((frame * 1.4) % (280 * 6)) - 280 * 6;

  const gaugeH = 480;
  const gaugeW = 64;
  const gaugeFillPx = (Math.min(gaugeValue, 20) / 100) * gaugeH * 4; // échelle 0-25% visible confortablement

  return (
    <Stage outFrames={2}>
      <AbsoluteFill style={{ background: "#000" }}>
        {/* ── Gauche : "Rendu pro" ── */}
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              top: H * 0.22,
              left: -100,
              width: W + 200,
              display: "flex",
              gap: 24,
              transform: `translateX(${thumbTravel}px) scale(1.1)`,
            }}
          >
            {[...thumbs, ...thumbs].map((g, i) => (
              <div
                key={i}
                style={{
                  flex: "0 0 auto",
                  width: 260,
                  height: 146,
                  borderRadius: 14,
                  background: g,
                  boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                }}
              />
            ))}
          </div>
          <div
            style={{
              position: "absolute",
              left: 60,
              bottom: 56,
              fontFamily,
              fontWeight: 600,
              fontSize: FONT.micro,
              color: INK,
              opacity: 0.7,
              letterSpacing: 1,
            }}
          >
            Généré avec After Effects
          </div>
        </AbsoluteFill>

        {/* ── Droite : "Niveau réel" (clip-path diagonal) ── */}
        <AbsoluteFill
          style={{
            background: "#161618",
            clipPath: `polygon(${splitX}% 0%, 100% 0%, 100% 100%, ${
              splitX - SPLIT_SKEW
            }% 100%)`,
          }}
        >
          <AbsoluteFill
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 48,
              }}
            >
              <div
                style={{
                  fontFamily,
                  fontWeight: 700,
                  fontSize: FONT.value,
                  color: INK,
                  opacity: titleIn,
                  transform: `translateY(${(1 - titleIn) * 24}px)`,
                }}
              >
                Mon niveau After Effects
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 40,
                }}
              >
                <div
                  style={{
                    width: gaugeW,
                    height: gaugeH,
                    borderRadius: gaugeW,
                    background: "rgba(255,255,255,0.08)",
                    border: "2px solid rgba(255,255,255,0.14)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      height: Math.max(0, gaugeFillPx),
                      background: frame >= 118 ? FAIL_RED : ACCENT,
                      boxShadow: `0 0 30px ${frame >= 118 ? FAIL_RED : ACCENT}77`,
                      transition: "background 0.1s",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontFamily,
                    fontWeight: 800,
                    fontSize: FONT.hero,
                    color: frame >= 118 ? FAIL_RED : INK,
                    transform: `scale(${frame >= 118 ? pulseScale : 1})`,
                    minWidth: 260,
                  }}
                >
                  {gaugeDisplay}%
                </div>
              </div>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>

        {/* Ligne de séparation lumineuse */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: `${splitX}%`,
            width: 3,
            height: "100%",
            background: ACCENT,
            transform: `skewX(${-SPLIT_SKEW * 0.25}deg)`,
            filter: `drop-shadow(0 0 18px ${ACCENT})`,
          }}
        />
      </AbsoluteFill>
    </Stage>
  );
};
