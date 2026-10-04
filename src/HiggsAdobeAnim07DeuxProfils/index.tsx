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
import { Stage } from "../higgsAdobe/Stage";
import { Counter, formatThousands } from "../higgsAdobe/Counter";
import {
  ACCENT,
  AI_TO,
  INK,
  FONT,
  RAIL_GREY,
  ATMOS_PANEL_BG,
} from "../higgsAdobe/theme";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });

const profil = z.object({
  label: z.string(),
  value: z.number(),
  unit: z.string(),
  caption: z.string(),
});

export const higgsAdobeAnim07Schema = z.object({
  card1: profil.default({
    label: "CRÉATEUR",
    value: 12,
    unit: "h / semaine",
    caption: "de temps libéré",
  }),
  card2: profil.default({
    label: "PRESTATAIRE",
    value: 2400,
    unit: "$ / mois",
    caption: "de revenu en plus",
  }),
});
export type HiggsAdobeAnim07Props = z.infer<typeof higgsAdobeAnim07Schema>;

const CARD_W = 620;
const CARD_H = 760;

const Card: React.FC<{
  x: number;
  flipStart: number;
  fromAngle: number;
  accent: string;
  data: z.infer<typeof profil>;
  counterStart: number;
  bigNumber: boolean;
}> = ({ x, flipStart, fromAngle, accent, data, counterStart, bigNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({
    frame: frame - flipStart,
    fps,
    config: { damping: 11, stiffness: 150 },
  });
  const rotateY = interpolate(s, [0, 1], [fromAngle, 0]);
  const opacity = interpolate(frame, [flipStart, flipStart + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const unitOpacity = interpolate(frame, [counterStart - 8, counterStart], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // glow pulsant autour du badge (phase 5)
  const glow = interpolate(Math.sin((frame / 60) * Math.PI * 2), [-1, 1], [0.15, 0.3]);

  return (
    <div style={{ position: "absolute", left: x, top: 540, transform: "translate(-50%, -50%)", perspective: 1200 }}>
      <div
        style={{
          width: CARD_W,
          height: CARD_H,
          transform: `rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          opacity,
          background: ATMOS_PANEL_BG,
          border: `3px solid ${accent}`,
          borderRadius: 24,
          boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 ${60 * glow * 3}px ${accent}${Math.round(glow * 255).toString(16).padStart(2, "0")}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          padding: 48,
        }}
      >
        <div style={{ fontFamily, fontWeight: 800, fontSize: FONT.label, color: INK, letterSpacing: "1px" }}>
          {data.label}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 8,
            fontFamily,
            fontWeight: 800,
            fontSize: data.value >= 1000 ? FONT.counter * 0.66 : FONT.counter,
            letterSpacing: "-3px",
            whiteSpace: "nowrap",
          }}
        >
          {/* dégradé appliqué sur chaque élément (le background-clip:text d'un
              ancêtre ne traverse pas un enfant transformé) */}
          <span
            style={{
              opacity: unitOpacity,
              backgroundImage: `linear-gradient(90deg, ${accent}, ${AI_TO})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            +
          </span>
          <Counter
            target={data.value}
            startFrame={counterStart}
            endFrame={counterStart + 30}
            easing={bigNumber ? Easing.inOut(Easing.cubic) : Easing.out(Easing.cubic)}
            format={bigNumber ? formatThousands : (n) => String(Math.round(n))}
            style={{
              backgroundImage: `linear-gradient(90deg, ${accent}, ${AI_TO})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          />
        </div>
        <div style={{ opacity: unitOpacity, fontFamily, fontWeight: 700, fontSize: FONT.micro, color: INK }}>
          {data.unit}
        </div>
        <div style={{ opacity: unitOpacity, fontFamily, fontWeight: 600, fontSize: FONT.micro * 0.8, color: RAIL_GREY }}>
          {data.caption}
        </div>
      </div>
    </div>
  );
};

export const HiggsAdobeAnim07DeuxProfils: React.FC<HiggsAdobeAnim07Props> = ({ card1, card2 }) => {
  const frame = useCurrentFrame();

  const outT = interpolate(frame, [178, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  return (
    <Stage>
      <AbsoluteFill style={{ opacity: 1 - outT, transform: `scale(${interpolate(outT, [0, 1], [1, 0.97])})` }}>
        <Card
          x={650}
          flipStart={0}
          fromAngle={-80}
          accent={ACCENT}
          data={card1}
          counterStart={21}
          bigNumber={false}
        />
        <Card
          x={1270}
          flipStart={15}
          fromAngle={80}
          accent={AI_TO}
          data={card2}
          counterStart={36}
          bigNumber
        />
      </AbsoluteFill>
    </Stage>
  );
};
