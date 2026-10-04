import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { z } from "zod";
import { Stage } from "../higgs/Stage";
import { ACCENT, ACCENT_LIGHT, SILHOUETTE_GREY } from "../higgs/theme";
import { bustSilhouette, aiFacePortrait } from "../higgs/vector";

export const higgsAnim09Schema = z.object({
  // Passer une vraie image remplace le visage IA vectoriel.
  faceSrc: z.string().optional(),
});

export type HiggsAnim09Props = z.infer<typeof higgsAnim09Schema>;

const LINE_Y = 560;
const SIL_W = 300;
const SIL_H = 400;
const SIL_CX = 960;
const SIL_CY = 520; // position figée dès la frame 10

const BODY = bustSilhouette({ w: SIL_W, h: SIL_H, tone: SILHOUETTE_GREY });

// Boîte visage, calée sur la tête de la silhouette
const FACE_W = 240;
const FACE_H = 300;
const FACE_CX = SIL_CX;
const FACE_CY = SIL_CY - SIL_H / 2 + FACE_H / 2 - 6;

const SWEEP_START = 15;
const SWEEP_END = 60;

export const HiggsAnim09MasqueRevelateur: React.FC<HiggsAnim09Props> = ({ faceSrc }) => {
  const frame = useCurrentFrame();

  const aiFace = faceSrc ?? aiFacePortrait({ w: FACE_W, h: FACE_H });

  // franchissement (0 → 10) puis figé
  const crossY = interpolate(frame, [0, 10], [SIL_CY + 40, SIL_CY], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const crossFlash = interpolate(frame, [6, 9, 16], [0, 0.8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // netteté / couleur globale de la silhouette
  const revealT = interpolate(frame, [8, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bodyBlur = interpolate(revealT, [0, 1], [4, 0]);
  const bodyGray = interpolate(revealT, [0, 1], [1, 0]);

  // balayage circulaire du masque
  const sweep = interpolate(frame, [SWEEP_START, SWEEP_END], [0, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const sweepPx = (sweep / 100) * FACE_W;

  // dissolution de la paroi
  const wallOpacity = interpolate(frame, [45, 75], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wallBlur = interpolate(frame, [45, 75], [0, 8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // respiration finale
  const breathe = frame >= 75 ? 1 + Math.sin((frame - 75) / 18) * 0.01 : 1;

  return (
    <Stage outFrames={12} bare background="radial-gradient(120% 90% at 50% 40%, #1c2230 0%, #0A0A0A 75%)">
      <AbsoluteFill>
        {/* paroi qui se dissout */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: LINE_Y,
            height: 4,
            background: ACCENT_LIGHT,
            opacity: wallOpacity,
            filter: `blur(${wallBlur}px)`,
            boxShadow: `0 0 20px ${ACCENT_LIGHT}, 0 0 50px ${ACCENT}`,
          }}
        />

        {/* silhouette */}
        <div
          style={{
            position: "absolute",
            left: SIL_CX,
            top: crossY,
            width: SIL_W,
            height: SIL_H,
            transform: `translate(-50%, -50%) scale(${breathe})`,
            filter: `blur(${bodyBlur}px) grayscale(${bodyGray}) saturate(${interpolate(bodyGray, [0, 1], [1.1, 0.4])})`,
          }}
        >
          <Img src={BODY} style={{ width: "100%", height: "100%" }} />
        </div>

        {/* visages superposés */}
        <div
          style={{
            position: "absolute",
            left: FACE_CX,
            top: FACE_CY,
            width: FACE_W,
            height: FACE_H,
            transform: `translate(-50%, -50%) scale(${breathe})`,
            borderRadius: 20,
            overflow: "hidden",
            background: "#1a1e28",
          }}
        >
          {/* dessous : vrai visage resté anonyme */}
          <Img
            src={aiFace}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              filter: "grayscale(1) blur(6px) brightness(0.8)",
            }}
          />
          {/* dessus : visage IA révélé par masque circulaire */}
          <Img
            src={aiFace}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              clipPath: `circle(${FACE_H * 0.75}px at ${sweepPx}px ${FACE_H / 2}px)`,
            }}
          />
          {/* ligne lumineuse au bord du balayage */}
          {frame >= SWEEP_START && frame <= SWEEP_END && (
            <div
              style={{
                position: "absolute",
                left: sweepPx,
                top: 0,
                width: 4,
                height: "100%",
                marginLeft: -2,
                background: ACCENT_LIGHT,
                boxShadow: `0 0 16px ${ACCENT_LIGHT}, 0 0 34px ${ACCENT}`,
              }}
            />
          )}
        </div>

        {/* flash de franchissement */}
        <AbsoluteFill style={{ background: ACCENT_LIGHT, opacity: crossFlash * 0.25 }} />
      </AbsoluteFill>
    </Stage>
  );
};
