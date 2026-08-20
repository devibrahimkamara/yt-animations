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
import { measureText } from "@remotion/layout-utils";
import { ATMOS_BLUE, ATMOS_ERROR, ATMOS_GOLD, ATMOS_PANEL_BG, atmosGlow, atmosPanelBorder, strokeDashDraw } from "../AtmosOverlay/theme";
import { AtmosBackground } from "../AtmosOverlay/AtmosBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "800"], subsets: ["latin"] });

export const atmosAnim09Schema = z.object({
  question: z.string().default("Suis-je capable de lancer un business en ligne ?"),
  answer: z.string().default("LEQUEL CHOISIR ?"),
  durationSecs: z.number().default(4),
});

export type AtmosAnim09Props = z.infer<typeof atmosAnim09Schema>;

const QUESTION_SIZE = 64;
const ANSWER_SIZE = 104;

export const AtmosAnim09QuestionMorph: React.FC<AtmosAnim09Props> = ({
  question,
  answer,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase A (0-15): entrée du texte 1 + backdrop
  const text1Opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const text1TranslateY = interpolate(frame, [0, 15], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const text1Scale = interpolate(frame, [0, 15], [0.96, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const backdropOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase C (45-69): dessin du strikethrough
  const strikeProgress = interpolate(frame, [45, 69], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Phase D (69-93): dissolution du texte 1 + ligne
  const dissolveOpacity = interpolate(frame, [69, 93], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const dissolveBlur = interpolate(frame, [69, 93], [0, 12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const dissolveScale = interpolate(frame, [69, 93], [1, 1.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  // Phase E (93-120): entrée du texte 2, spring overshoot
  const answerSpring = spring({
    frame: frame - 93,
    fps,
    config: { damping: 10, mass: 0.8, stiffness: 120 },
  });
  const answerScale = interpolate(answerSpring, [0, 1], [0.7, 1]);
  const answerOpacity = interpolate(frame, [93, 102], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const text1Visible = frame < 93;
  const answerVisible = frame >= 93;

  const { width: questionWidth, height: questionHeight } = measureText({
    text: question,
    fontFamily,
    fontSize: QUESTION_SIZE,
    fontWeight: 600,
    letterSpacing: "-0.5px",
  });

  const strikeY = questionHeight / 2;

  return (
    <AbsoluteFill>
      <AtmosBackground />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* Panneau carte */}
        <div
          style={{
            position: "absolute",
            width: Math.max(questionWidth + 200, 900),
            height: 360,
            borderRadius: 32,
            background: ATMOS_PANEL_BG,
            border: `1px solid ${atmosPanelBorder(0.3)}`,
            boxShadow: atmosGlow(ATMOS_BLUE, 50, 100),
            opacity: backdropOpacity,
          }}
        />

        {text1Visible && (
          <div
            style={{
              position: "relative",
              opacity: text1Opacity * dissolveOpacity,
              transform: `translateY(${text1TranslateY}px) scale(${text1Scale * dissolveScale})`,
              filter: `blur(${dissolveBlur}px)`,
              fontFamily,
              fontWeight: 600,
              fontSize: QUESTION_SIZE,
              letterSpacing: "-0.5px",
              lineHeight: 1.3,
              color: "#FFFFFF",
              textAlign: "center",
            }}
          >
            {question}
            <svg
              width={questionWidth + 20}
              height={strikeY * 2 + 8}
              style={{
                position: "absolute",
                left: -10,
                top: 0,
                overflow: "visible",
              }}
            >
              <line
                x1={10}
                y1={strikeY}
                x2={questionWidth + 10}
                y2={strikeY}
                stroke={ATMOS_ERROR}
                strokeWidth={6}
                strokeLinecap="round"
                style={strokeDashDraw(questionWidth, strikeProgress)}
              />
            </svg>
          </div>
        )}

        {answerVisible && (
          <div
            style={{
              opacity: answerOpacity,
              transform: `scale(${answerScale})`,
              fontFamily,
              fontWeight: 800,
              fontSize: ANSWER_SIZE,
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: ATMOS_GOLD,
              textShadow: `0px 0px 40px rgba(255, 215, 0, 0.35)`,
              textAlign: "center",
            }}
          >
            {answer}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
