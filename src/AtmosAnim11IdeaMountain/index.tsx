import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { ATMOS_BLUE, ATMOS_BLUE_LIGHT, ATMOS_GOLD } from "../AtmosOverlay/theme";
import { AtmosBackground } from "../AtmosOverlay/AtmosBackground";

const { fontFamily } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });

export const atmosAnim11Schema = z.object({
  durationSecs: z.number().default(3.5),
});

export type AtmosAnim11Props = z.infer<typeof atmosAnim11Schema>;

// Réduit de 18 à 10 bulles pour rester lisible sur mobile (texte 32px). Réparties
// par longueur de texte selon l'espacement disponible à chaque niveau de la pyramide
// (sommet à 1 bulle = le plus de place -> base à 4 bulles = le plus resserré),
// pour éviter que deux libellés longs se chevauchent.
const LABELS = [
  // Base (4, espacement ~333px) — libellés les plus courts
  "Freelance", "Agence IA", "Coaching", "SaaS",
  // Intermédiaire (3, espacement ~400px)
  "Newsletter", "E-commerce", "Consulting",
  // Supérieur (2, espacement ~520px)
  "Dropshipping", "Affiliation",
  // Sommet (1) — libellé le plus long, seul, aucun voisin
  "Automatisation",
];

const GOLD_INDICES = new Set([1, 3]);

type Bubble = {
  text: string;
  finalX: number;
  finalY: number;
  startFrame: number;
  startXOffset: number;
  isGold: boolean;
};

const BUBBLES: Bubble[] = (() => {
  const positions: { x: number; y: number }[] = [];
  // Base: 4 bulles, y: 880, x: 460 -> 1460
  for (let i = 0; i < 4; i++) positions.push({ x: 460 + (i * (1460 - 460)) / 3, y: 880 });
  // Intermédiaire: 3 bulles, y: 700, x: 560 -> 1360
  for (let i = 0; i < 3; i++) positions.push({ x: 560 + (i * (1360 - 560)) / 2, y: 700 });
  // Supérieur: 2 bulles, y: 520, x: 700 et 1220
  positions.push({ x: 700, y: 520 }, { x: 1220, y: 520 });
  // Sommet: 1 bulle, y: 340, x: 960
  positions.push({ x: 960, y: 340 });

  return positions.map((pos, i) => {
    let startFrame: number;
    if (i < 4) startFrame = i * 5; // vague 1: 0-15
    else if (i < 7) startFrame = 20 + (i - 4) * 7.5; // vague 2: 20-35
    else startFrame = 40 + (i - 7) * 5; // vague 3: 40-50

    const startXOffset = interpolate(random(`mountain-${i}`), [0, 1], [-60, 60]);

    return {
      text: LABELS[i],
      finalX: pos.x,
      finalY: pos.y,
      startFrame,
      startXOffset,
      isGold: GOLD_INDICES.has(i),
    };
  });
})();

const BubbleTag: React.FC<{ bubble: Bubble; fps: number }> = ({ bubble, fps }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - bubble.startFrame;

  if (localFrame < -1) return null;

  const translateY = interpolate(localFrame, [0, 18], [-100 - bubble.finalY, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const translateX = interpolate(localFrame, [0, 18], [bubble.startXOffset, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const opacity = interpolate(localFrame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const impactSpring = spring({
    frame: localFrame - 18,
    fps,
    config: { damping: 6, mass: 0.5, stiffness: 180 },
  });
  const scaleY = localFrame >= 18
    ? interpolate(impactSpring, [0, 0.5, 1], [1, 0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;
  const scaleX = localFrame >= 18
    ? interpolate(impactSpring, [0, 0.5, 1], [1, 1.1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

  return (
    <div
      style={{
        position: "absolute",
        left: bubble.finalX,
        top: bubble.finalY,
        transform: `translate(-50%, -50%) translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`,
        opacity,
        minWidth: 170,
        padding: "16px 26px",
        borderRadius: 30,
        textAlign: "center",
        whiteSpace: "nowrap",
        fontFamily,
        fontWeight: 700,
        fontSize: 32,
        boxShadow: "0px 6px 18px rgba(0,0,0,0.4)",
        background: bubble.isGold
          ? "linear-gradient(135deg, #FFD700, #FFA500)"
          : `linear-gradient(135deg, ${ATMOS_BLUE}, ${ATMOS_BLUE_LIGHT})`,
        color: bubble.isGold ? "#0A0A0F" : "#FFFFFF",
      }}
    >
      {bubble.text}
    </div>
  );
};

export const AtmosAnim11IdeaMountain: React.FC<AtmosAnim11Props> = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const glowPulse = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.15, 0.3]);
  const showGlow = frame >= 68;

  return (
    <AbsoluteFill>
      <AtmosBackground />
      {showGlow && (
        <svg
          width={1920}
          height={1080}
          style={{ position: "absolute", inset: 0, opacity: glowPulse }}
        >
          <path
            d="M 380 940 L 960 280 L 1540 940 Z"
            fill="none"
            stroke={ATMOS_GOLD}
            strokeWidth={2}
            strokeDasharray="8 8"
          />
        </svg>
      )}
      <AbsoluteFill>
        {BUBBLES.map((bubble, i) => (
          <BubbleTag key={i} bubble={bubble} fps={fps} />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
