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
import {
  ACCENT,
  INK,
  FONT,
  CARD_IA_GRAD,
  CARD_AE_GRAD,
  CARD_RESULT_GRAD,
} from "../higgsAfter/theme";
import { IconBrainAI, IconAfterEffects } from "../higgsAfter/icons";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});

// Anim 2 — Plan 2 « Équation IA + AE = résultat » (210 frames / 7s)
// A carte IA 0–15 · B "+" pop 39–48 · C carte AE pop 48–63 · D "=" pop 99–108
// · E fusion 108–150 · F hold résultat plein cadre 150–210

export const higgsAfterAnim02Schema = z.object({});
export type HiggsAfterAnim02Props = z.infer<typeof higgsAfterAnim02Schema>;

const CARD_W = 320;
const CARD_H = 380;

const popSpring = (frame: number, fps: number) =>
  spring({ frame, fps, config: { damping: 12, stiffness: 200 } });

const Card: React.FC<{
  grad: string;
  icon: React.ReactNode;
  label: string;
  scale: number;
  opacity: number;
  translateY?: number;
}> = ({ grad, icon, label, scale, opacity, translateY = 0 }) => (
  <div
    style={{
      width: CARD_W,
      height: CARD_H,
      borderRadius: 32,
      background: grad,
      border: "2px solid rgba(255,255,255,0.10)",
      boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 28,
      transform: `scale(${scale}) translateY(${translateY}px)`,
      opacity,
    }}
  >
    {icon}
    <div
      style={{
        fontFamily,
        fontWeight: 700,
        fontSize: FONT.label,
        color: INK,
        textAlign: "center",
        padding: "0 20px",
      }}
    >
      {label}
    </div>
  </div>
);

const Operator: React.FC<{ symbol: string; frame: number; fps: number }> = ({
  symbol,
  frame,
  fps,
}) => {
  const s = popSpring(frame, fps);
  const scale = interpolate(s, [0, 0.6, 1], [0, 1.2, 1]);
  return (
    <div
      style={{
        fontFamily,
        fontWeight: 800,
        fontSize: FONT.hero,
        color: ACCENT,
        transform: `scale(${Math.max(0, scale)})`,
        width: 90,
        textAlign: "center",
      }}
    >
      {symbol}
    </div>
  );
};

export const HiggsAfterAnim02EquationIAAE: React.FC<
  HiggsAfterAnim02Props
> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iaPop = popSpring(frame, fps);
  const iaScale = interpolate(iaPop, [0, 0.6, 1], [0, 1.12, 1]);
  const iaOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const aePop = popSpring(frame - 48, fps);
  const aeScale = interpolate(aePop, [0, 0.6, 1], [0, 1.12, 1]);
  const aeOpacity = interpolate(frame, [48, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fusion 108 → 150 (1,4s)
  const fuse = interpolate(frame, [108, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const sideScale = interpolate(fuse, [0, 1], [1, 0]);
  const sideOpacity = interpolate(fuse, [0, 1], [1, 0]);
  const opFade = interpolate(frame, [102, 110], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const resultW = interpolate(fuse, [0, 1], [0, 1600]);
  const resultH = interpolate(fuse, [0, 1], [0, 700]);
  const resultOpacity = interpolate(frame, [108, 122], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const resultRadius = interpolate(fuse, [0, 1], [32, 44]);

  // Brillance qui traverse une fois (150 → 210)
  const shine = interpolate(frame, [150, 210], [-40, 140], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const showResultText = frame >= 122;

  return (
    <Stage outFrames={2}>
      <AbsoluteFill
        style={{
          background: "#0a0a0c",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 44,
            position: "relative",
          }}
        >
          <Card
            grad={CARD_IA_GRAD}
            icon={<IconBrainAI size={110} color={ACCENT} />}
            label="Intelligence Artificielle"
            scale={Math.max(0, iaScale) * sideScale}
            opacity={iaOpacity * sideOpacity}
          />
          <Operator symbol="+" frame={frame - 39} fps={fps} />
          <div style={{ opacity: opFade < 1 ? opFade : 1 }} />
          <Card
            grad={CARD_AE_GRAD}
            icon={<IconAfterEffects size={110} color={ACCENT} />}
            label="After Effects"
            scale={Math.max(0, aeScale) * sideScale}
            opacity={aeOpacity * sideOpacity}
          />
          <Operator symbol="=" frame={frame - 99} fps={fps} />

          {/* Carte résultat */}
          <div
            style={{
              position: "absolute",
              width: Math.max(0, resultW),
              height: Math.max(0, resultH),
              borderRadius: resultRadius,
              background: CARD_RESULT_GRAD,
              border: `2px solid ${ACCENT}55`,
              boxShadow: `0 40px 100px rgba(0,0,0,0.6), 0 0 80px ${ACCENT}22`,
              opacity: resultOpacity,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {showResultText && (
              <div
                style={{
                  fontFamily,
                  fontWeight: 800,
                  fontSize: FONT.hero,
                  textAlign: "center",
                  backgroundImage: `linear-gradient(100deg, ${INK} 40%, ${ACCENT} 48%, ${INK} 56%)`,
                  backgroundSize: "300% 100%",
                  backgroundPositionX: `${shine}%`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                Animations professionnelles
              </div>
            )}
          </div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
