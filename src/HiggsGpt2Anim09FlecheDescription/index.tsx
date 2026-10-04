import {
  AbsoluteFill,
  Easing,
  Loop,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsGpt2/Stage";
import { ACCENT, ACCENT_LIGHT, INK, FONT, atmosPanelBorder } from "../higgsGpt2/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});

// Anim 9 — « La flèche vers la description » (135 frames / 4,5 s @ 30 fps)
// A encadré 0–15 · B courbe qui se dessine 15–45 · C tête de flèche 45–52
// D + E deux rebonds identiques (Loop) 52–125 · F sortie 115–135

export const higgsGpt2Anim09Schema = z.object({
  text: z.string().default("Lien dans la description"),
});
export type HiggsGpt2Anim09Props = z.infer<typeof higgsGpt2Anim09Schema>;

const BOX_W = 620;
const BOX_H = 130;
const BOX_X = (1920 - BOX_W) / 2;
const BOX_Y = 260;
const CURVE_LEN = 260;

// Un seul rebond, rejoué 2x via <Loop> (seule utilisation de <Loop> de la
// série — contraste volontaire avec la pulsation en Math.sin de l'Anim 4).
const ArrowheadBounce: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bounceSpring = spring({ frame, fps, config: { damping: 8, stiffness: 120 } });
  const y = interpolate(bounceSpring, [0, 0.5, 1], [0, 15, 0]);
  return <div style={{ transform: `translateY(${y}px)` }}>{children}</div>;
};

export const HiggsGpt2Anim09FlecheDescription: React.FC<
  HiggsGpt2Anim09Props
> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const boxSpring = spring({ frame, fps, config: { damping: 14, stiffness: 200 } });
  const boxScale = interpolate(boxSpring, [0, 1], [0.9, 1]);
  const boxOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const curveDraw = interpolate(frame, [15, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const headSpring = spring({
    frame: frame - 45,
    fps,
    config: { damping: 10, stiffness: 200 },
  });
  const headScale = interpolate(headSpring, [0, 0.6, 1], [0, 1.2, 1]);

  const curveEndX = BOX_X + BOX_W / 2 + 40;
  const curveEndY = BOX_Y + BOX_H + CURVE_LEN * 0.85;

  return (
    <Stage outFrames={15}>
      <AbsoluteFill style={{ fontFamily }}>
        <div
          style={{
            position: "absolute",
            left: BOX_X,
            top: BOX_Y,
            width: BOX_W,
            height: BOX_H,
            borderRadius: 16,
            border: `2px solid ${INK}`,
            background: "rgba(20,40,120,0.28)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${boxScale})`,
            opacity: boxOpacity,
            boxSizing: "border-box",
            boxShadow: `0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 ${atmosPanelBorder(0.2)}`,
          }}
        >
          <div style={{ fontSize: FONT.micro * 0.55, fontWeight: 800, color: INK, textAlign: "center" }}>
            {text}
          </div>
        </div>

        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <path
            id="cta-curve"
            d={`M ${BOX_X + BOX_W / 2} ${BOX_Y + BOX_H} C ${BOX_X + BOX_W / 2 + 40} ${
              BOX_Y + BOX_H + CURVE_LEN * 0.4
            }, ${curveEndX - 20} ${curveEndY - CURVE_LEN * 0.3}, ${curveEndX} ${curveEndY}`}
            fill="none"
            stroke={ACCENT_LIGHT}
            strokeWidth={3}
            strokeLinecap="round"
            style={{
              strokeDasharray: CURVE_LEN,
              strokeDashoffset: CURVE_LEN * (1 - curveDraw),
            }}
          />
        </svg>

        {frame >= 45 && (
          <div
            style={{
              position: "absolute",
              left: curveEndX - 14,
              top: curveEndY - 10,
              transform: `scale(${headScale})`,
            }}
          >
            <Sequence from={52} durationInFrames={84} layout="none">
              <Loop durationInFrames={42} times={2} layout="none">
                <ArrowheadBounce>
                  <svg width={28} height={24} viewBox="0 0 28 24">
                    <polygon points="14,24 0,4 28,4" fill={ACCENT} />
                  </svg>
                </ArrowheadBounce>
              </Loop>
            </Sequence>
            {frame < 52 && (
              <svg width={28} height={24} viewBox="0 0 28 24">
                <polygon points="14,24 0,4 28,4" fill={ACCENT} />
              </svg>
            )}
          </div>
        )}
      </AbsoluteFill>
    </Stage>
  );
};
