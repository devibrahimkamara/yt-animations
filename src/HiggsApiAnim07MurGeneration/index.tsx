import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsApi/Stage";
import { INK, FONT } from "../higgsApi/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});

// Anim 7 — « Le mur de génération Higgsfield » (210 frames / 7 s @ 30 fps)
// Phase 1 (0-45)    : montée des 3 bandes en fade-in échelonné + logo au centre
// Phase 2 (45-165)  : défilement infini à vitesses/sens différents, logo statique
// Phase 3 (165-210) : fondu de sortie plus long (Stage outFrames=45)

export const higgsApiAnim07Schema = z.object({});
export type HiggsApiAnim07Props = z.infer<typeof higgsApiAnim07Schema>;

const VIG_W = 140;
const VIG_H = 90;
const VIG_GAP = 20;
const VIG_COUNT = 10;
const BAND_UNIT_W = (VIG_W + VIG_GAP) * VIG_COUNT;

const GRADS = [
  "linear-gradient(135deg,#FF9F5A,#C77DFF)",
  "linear-gradient(135deg,#3060ff,#4ECDC4)",
  "linear-gradient(135deg,#22c55e,#FFD700)",
  "linear-gradient(135deg,#FF5E9E,#3060ff)",
  "linear-gradient(135deg,#C77DFF,#4ECDC4)",
];

const ScrollingRow: React.FC<{
  top: number;
  speed: number;
  direction: 1 | -1;
  blur: boolean;
  rotateX: number;
  frame: number;
}> = ({ top, speed, direction, blur, rotateX, frame }) => {
  const offset = ((frame * speed * direction) % BAND_UNIT_W + BAND_UNIT_W) % BAND_UNIT_W;
  const vignettes = Array.from({ length: VIG_COUNT * 3 });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top,
        width: 1920,
        height: VIG_H,
        overflow: "hidden",
        filter: blur ? "blur(5px) brightness(0.6)" : "none",
        opacity: blur ? 0.45 : 1,
        transform: rotateX !== 0 ? `perspective(600px) rotateX(${rotateX}deg)` : undefined,
        transformOrigin: rotateX > 0 ? "top" : "bottom",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: -offset - BAND_UNIT_W,
          top: 0,
          display: "flex",
          gap: VIG_GAP,
        }}
      >
        {vignettes.map((_, i) => (
          <div
            key={i}
            style={{
              width: VIG_W,
              height: VIG_H,
              borderRadius: 8,
              background: GRADS[i % GRADS.length],
            }}
          />
        ))}
      </div>
    </div>
  );
};

export const HiggsApiAnim07MurGeneration: React.FC<HiggsApiAnim07Props> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const topBandOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const midBandOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const botBandOpacity = interpolate(frame, [20, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const logoSpring = spring({ frame: frame - 30, fps, config: { damping: 14, stiffness: 160 } });
  const logoScale = frame >= 30 ? interpolate(logoSpring, [0, 1], [0.9, 1]) : 0.9;
  const logoOpacity = interpolate(frame, [30, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const haloOpacity = interpolate(Math.sin((frame / 60) * Math.PI * 2), [-1, 1], [0.3, 0.6]);

  return (
    <Stage outFrames={45}>
      <AbsoluteFill style={{ fontFamily }}>
        <div style={{ opacity: topBandOpacity }}>
          <ScrollingRow top={280} speed={1.2} direction={-1} blur rotateX={18} frame={frame} />
        </div>
        <div style={{ opacity: midBandOpacity }}>
          <ScrollingRow top={495} speed={3} direction={1} blur={false} rotateX={0} frame={frame} />
        </div>
        <div style={{ opacity: botBandOpacity }}>
          <ScrollingRow top={710} speed={1.2} direction={-1} blur rotateX={-18} frame={frame} />
        </div>

        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              position: "absolute",
              width: 420,
              height: 420,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(48,96,255,0.5) 0%, transparent 70%)",
              filter: "blur(20px)",
              opacity: haloOpacity * logoOpacity,
            }}
          />
          <div
            style={{
              fontSize: FONT.hero * 0.5,
              fontWeight: 800,
              color: INK,
              letterSpacing: 1,
              transform: `scale(${logoScale})`,
              opacity: logoOpacity,
              position: "relative",
            }}
          >
            higgsfield
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </Stage>
  );
};
