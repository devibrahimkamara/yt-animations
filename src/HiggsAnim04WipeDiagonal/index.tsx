import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgs/Stage";
import { COLD, WARM, INK } from "../higgs/theme";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });

export const higgsAnim04Schema = z.object({
  leftLabel: z.string().default("LE CRÉER"),
  rightLabel: z.string().default("LE MONÉTISER"),
});

export type HiggsAnim04Props = z.infer<typeof higgsAnim04Schema>;

// Ligne de coupe commune, partagée à l'identique par les deux polygones.
const CUT_LEFT = "42% 0%";
const CUT_RIGHT = "58% 100%";
const LEFT_CLIP = `polygon(0% 0%, ${CUT_LEFT}, ${CUT_RIGHT}, 0% 100%)`;
const RIGHT_CLIP = `polygon(${CUT_LEFT}, 100% 0%, 100% 100%, ${CUT_RIGHT})`;

const IMPACT = 36;

export const HiggsAnim04WipeDiagonal: React.FC<HiggsAnim04Props> = ({ leftLabel, rightLabel }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({ frame, fps, config: { damping: 10, stiffness: 120 } });
  const leftX = interpolate(s, [0, 1], [-1920, 0]);
  const rightX = interpolate(s, [0, 1], [1920, 0]);

  // flash blanc bref à l'impact
  const flash = interpolate(frame, [IMPACT, IMPACT + 2, IMPACT + 7], [0, 0.3, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // micro-vibration décroissante
  const shakeAmp = interpolate(frame, [IMPACT, IMPACT + 12], [4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shake = frame >= IMPACT && frame < IMPACT + 12 ? Math.sin((frame - IMPACT) * 2.4) * shakeAmp : 0;

  // ligne de jonction
  const junction = interpolate(frame, [IMPACT, IMPACT + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // respiration en phase de maintien
  const breathe = frame >= 48 ? 1 + Math.sin((frame - 48) / 20) * 0.005 : 1;

  const half = (color: string, clip: string, x: number): React.CSSProperties => ({
    position: "absolute",
    inset: 0,
    clipPath: clip,
    background: color,
    transform: `translateX(${x}px)`,
  });

  const stack = (label: string): React.CSSProperties => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    lineHeight: 0.95,
    fontFamily,
    fontWeight: 800,
    fontSize: label.length > 8 ? 132 : 188,
    color: INK,
    textShadow: "0 6px 40px rgba(0,0,0,0.35)",
    whiteSpace: "nowrap",
  });

  const renderLabel = (label: string, side: "left" | "right", x: number) => {
    const parts = label.split(" ");
    return (
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: side === "left" ? 480 : 1440,
          transform: `translate(-50%, -50%) translateX(${x}px)`,
        }}
      >
        <div style={stack(label)}>
          {parts.length > 1 ? (
            <>
              <span>{parts[0]}</span>
              <span>{parts.slice(1).join(" ")}</span>
            </>
          ) : (
            label
          )}
        </div>
      </div>
    );
  };

  return (
    <Stage outFrames={12} bare background="#0A0A0A">
      <AbsoluteFill style={{ transform: `translateX(${shake}px) scale(${breathe})` }}>
        <div style={half(COLD, LEFT_CLIP, leftX)} />
        <div style={half(WARM, RIGHT_CLIP, rightX)} />
        {renderLabel(leftLabel, "left", leftX)}
        {renderLabel(rightLabel, "right", rightX)}

        {/* ligne lumineuse sur la diagonale de jonction */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 6,
            height: 1400,
            marginLeft: -3,
            marginTop: -700,
            background: INK,
            opacity: junction * 0.9,
            transform: "rotate(15.9deg)",
            boxShadow: `0 0 24px ${INK}, 0 0 60px ${WARM}`,
          }}
        />

        {/* flash d'impact */}
        <AbsoluteFill style={{ background: INK, opacity: flash }} />
      </AbsoluteFill>
    </Stage>
  );
};
