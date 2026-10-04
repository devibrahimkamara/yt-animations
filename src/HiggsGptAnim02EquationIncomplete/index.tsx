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
import { Stage } from "../higgsGpt/Stage";
import { IconAstra, IconLock, IconPuzzleSlot } from "../higgsGpt/icons";
import {
  ASTRA_TEAL,
  ASTRA_TEAL_GLOW,
  INK,
  FONT,
  ICON,
} from "../higgsGpt/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "800"],
  subsets: ["latin"],
});

// Anim 2 — « L'équation incomplète » (210 frames / 7 s @ 30 fps)
// A Astra 0–24 · B « + » & slot vide 24–48 · C « = » & carte cadenassée 48–72
// D hold 72–168 · E sortie 168–210
// Curiosity gap : Astra + [inconnu] = la vidéo. L'outil n'est jamais montré.

export const higgsGptAnim02Schema = z.object({
  astraLabel: z.string().default("GPT-6 Astra"),
  slotLabel: z.string().default("?"),
  resultLabel: z.string().default("La vidéo"),
});
export type HiggsGptAnim02Props = z.infer<typeof higgsGptAnim02Schema>;

const OP_FS = 110;
const CARD_W = 460;
const CARD_H = 259;

export const HiggsGptAnim02EquationIncomplete: React.FC<
  HiggsGptAnim02Props
> = ({ astraLabel, slotLabel, resultLabel }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // A — icône Astra
  const astraPop = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 140, mass: 0.8 },
  });
  const astraScale = interpolate(astraPop, [0, 0.6, 1], [0, 1.1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const astraX = interpolate(astraPop, [0, 1], [-50, 0]);
  const astraGlow = 0.5 + Math.sin(frame / 12) * 0.25;

  // B — « + » puis slot vide
  const plusIn = interpolate(frame, [32, 44], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const slotIn = interpolate(frame, [40, 52], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const qPulse =
    frame >= 44 ? Math.sin(frame / 8) * 0.3 + 0.7 : 0;

  // C — « = » puis carte cadenassée
  const eqIn = interpolate(frame, [48, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const cardIn = interpolate(frame, [56, 72], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const lockShakeX = frame >= 60 ? Math.sin(frame / 3.1) * 1.6 : 0;
  const lockShakeY = frame >= 60 ? Math.cos(frame / 2.3) * 1.4 : 0;

  // D — respiration globale
  const breathe =
    frame >= 72 && frame < 168 ? 1 + Math.sin((frame - 72) / 26) * 0.01 : 1;

  // E — sortie (fondu + montée légère)
  const outT = interpolate(frame, [168, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const compOpacity = 1 - outT;
  const compY = outT * -20;

  return (
    <Stage outFrames={2}>
      <AbsoluteFill
        style={{
          opacity: compOpacity,
          transform: `translateY(${compY}px) scale(${breathe})`,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 56,
          }}
        >
          {/* Astra — plein, saturé, en accent thématique */}
          <div
            style={{
              transform: `translateX(${astraX}px) scale(${astraScale})`,
              filter: `drop-shadow(0 0 ${28 + astraGlow * 26}px ${ASTRA_TEAL_GLOW})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 18,
            }}
          >
            <IconAstra size={ICON.lg} color={ASTRA_TEAL} strokeWidth={3} />
            <span
              style={{
                fontFamily,
                fontWeight: 800,
                fontSize: FONT.micro,
                color: ASTRA_TEAL,
                letterSpacing: "1px",
              }}
            >
              {astraLabel}
            </span>
          </div>

          {/* + */}
          <span
            style={{
              fontFamily,
              fontWeight: 800,
              fontSize: OP_FS,
              color: INK,
              opacity: plusIn,
              transform: `scale(${interpolate(plusIn, [0, 1], [0.6, 1])})`,
            }}
          >
            +
          </span>

          {/* Slot puzzle vide */}
          <div
            style={{
              position: "relative",
              width: ICON.lg,
              height: ICON.lg,
              opacity: slotIn,
              transform: `scale(${interpolate(slotIn, [0, 1], [0.8, 1])})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconPuzzleSlot size={ICON.lg} />
            <span
              style={{
                position: "absolute",
                fontFamily,
                fontWeight: 800,
                fontSize: FONT.label,
                color: "#9a9aa2",
                opacity: qPulse,
              }}
            >
              {slotLabel}
            </span>
          </div>

          {/* = */}
          <span
            style={{
              fontFamily,
              fontWeight: 800,
              fontSize: OP_FS,
              color: INK,
              opacity: eqIn,
              transform: `scale(${interpolate(eqIn, [0, 1], [0.6, 1])})`,
            }}
          >
            =
          </span>

          {/* Carte « la vidéo » cadenassée */}
          <div
            style={{
              position: "relative",
              width: CARD_W,
              height: CARD_H,
              borderRadius: 18,
              background:
                "linear-gradient(150deg, #23252b 0%, #14151a 100%)",
              border: "1px solid rgba(120,150,255,0.18)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
              opacity: cardIn,
              transform: `translateX(${interpolate(cardIn, [0, 1], [40, 0])}px) scale(${interpolate(
                cardIn,
                [0, 1],
                [0.9, 1],
              )})`,
              filter: "saturate(0.5) brightness(0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                transform: `translate(${lockShakeX}px, ${lockShakeY}px)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 14,
              }}
            >
              <IconLock size={ICON.md} color="#c9c9d0" strokeWidth={3.5} />
              <span
                style={{
                  fontFamily,
                  fontWeight: 600,
                  fontSize: FONT.micro,
                  color: "#c9c9d0",
                }}
              >
                {resultLabel}
              </span>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
