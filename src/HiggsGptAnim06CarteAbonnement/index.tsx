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
import { INFINITY_PATH, INFINITY_LEN } from "../higgsGpt/icons";
import {
  ASTRA_TEAL,
  ASTRA_TEAL_LIGHT,
  ASTRA_TEAL_GLOW,
  INK,
  FONT,
} from "../higgsGpt/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "800"],
  subsets: ["latin"],
});

// Anim 6 — « La carte d'abonnement » (195 frames / 6,5 s @ 30 fps)
// A entrée 3D 0–24 · B nom du plan 24–48 · C « ILLIMITÉ » + ∞ 48–93
// D hold flottement 93–156 · E sortie 156–195
// Ton premium/sobre (contraste avec la satire de l'Anim 5). Accent Astra.

export const higgsGptAnim06Schema = z.object({
  planName: z.string().default("GPT-6 Astra"),
  planSub: z.string().default("ChatGPT Plus"),
  unlimitedLabel: z.string().default("ILLIMITÉ"),
});
export type HiggsGptAnim06Props = z.infer<typeof higgsGptAnim06Schema>;

const CARD_W = 780;
const CARD_H = 488;

export const HiggsGptAnim06CarteAbonnement: React.FC<
  HiggsGptAnim06Props
> = ({ planName, planSub, unlimitedLabel }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // A — entrée 3D
  const enter = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 90, mass: 1 },
  });
  const rotY = interpolate(enter, [0, 1], [28, 9]);
  const cardScale = interpolate(enter, [0, 1], [0.8, 1]);
  const cardY = interpolate(enter, [0, 1], [60, 0]);
  const sweepEnter = interpolate(frame, [2, 26], [-1.2, 1.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // B — nom du plan
  const titleT = interpolate(frame, [24, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const subT = interpolate(frame, [32, 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // C — « ILLIMITÉ » (clip-path L→R) + ∞ (tracé puis « énergie »)
  const unlimClip = interpolate(frame, [48, 66], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const infDraw = interpolate(frame, [52, 76], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const infFill = interpolate(frame, [76, 88], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const infPulse =
    frame >= 88 ? 1 + (Math.sin((frame - 88) / 6.4) * 0.5 + 0.5) * 0.05 : 1;
  // dash « énergie » qui circule le long du tracé une fois rempli
  const flow = ((frame * 1.4) % 40) - 40;

  // D — flottement premium
  const floatY = frame >= 93 ? Math.sin(frame / 30) * 3 : 0;
  const sweepHold = interpolate(frame, [110, 150], [-1.2, 1.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // E — sortie
  const outT = interpolate(frame, [156, 195], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const compOpacity = 1 - outT;
  const rotYOut = rotY + outT * 18;

  const sweepX = frame < 40 ? sweepEnter : sweepHold;

  return (
    <Stage outFrames={2}>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          perspective: 1400,
          opacity: compOpacity,
        }}
      >
        <div
          style={{
            width: CARD_W,
            height: CARD_H,
            borderRadius: 30,
            position: "relative",
            overflow: "hidden",
            background:
              "linear-gradient(135deg, #1b2140 0%, #0c1024 55%, #16112e 100%)",
            border: "1px solid rgba(120,150,255,0.22)",
            boxShadow:
              "0 40px 120px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)",
            transform: `translateY(${cardY + floatY}px) scale(${cardScale}) rotateY(${rotYOut}deg)`,
            transformStyle: "preserve-3d",
            padding: 52,
            boxSizing: "border-box",
            fontFamily,
          }}
        >
          {/* reflet lumineux diagonal */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.16) 50%, transparent 60%)",
              transform: `translateX(${sweepX * CARD_W}px)`,
            }}
          />

          {/* nom du plan */}
          <div
            style={{
              opacity: titleT,
              transform: `translateX(${interpolate(titleT, [0, 1], [-15, 0])}px)`,
              fontWeight: 600,
              fontSize: FONT.label,
              color: INK,
              letterSpacing: "0.5px",
            }}
          >
            <span style={{ color: ASTRA_TEAL }}>{planName}</span>
          </div>
          <div
            style={{
              marginTop: 10,
              opacity: subT * 0.8,
              transform: `translateX(${interpolate(subT, [0, 1], [-15, 0])}px)`,
              fontWeight: 400,
              fontSize: FONT.micro,
              color: INK,
            }}
          >
            {planSub}
          </div>

          {/* ILLIMITÉ + ∞ */}
          <div
            style={{
              position: "absolute",
              left: 52,
              bottom: 44,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <span
              style={{
                fontWeight: 800,
                fontSize: 64,
                letterSpacing: "3px",
                color: ASTRA_TEAL,
                clipPath: `inset(0 ${100 - unlimClip}% 0 0)`,
              }}
            >
              {unlimitedLabel}
            </span>
            <svg
              width={260}
              height={150}
              viewBox="0 4 48 40"
              style={{ transform: `scale(${infPulse})`, overflow: "visible" }}
            >
              {/* tracé de base */}
              <path
                d={INFINITY_PATH}
                fill="none"
                stroke={ASTRA_TEAL}
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: INFINITY_LEN,
                  strokeDashoffset: INFINITY_LEN * (1 - infDraw),
                  filter: `drop-shadow(0 0 ${infFill * 16}px ${ASTRA_TEAL_GLOW})`,
                }}
              />
              {/* « énergie » qui circule */}
              {infFill > 0 && (
                <path
                  d={INFINITY_PATH}
                  fill="none"
                  stroke={ASTRA_TEAL_LIGHT}
                  strokeWidth={5}
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: "10 30",
                    strokeDashoffset: flow,
                    opacity: infFill * 0.9,
                  }}
                />
              )}
            </svg>
          </div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
