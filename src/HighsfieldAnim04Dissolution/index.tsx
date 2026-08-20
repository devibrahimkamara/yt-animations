import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
void fontFamily;

export const highsfieldAnim04Schema = z.object({
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(4.5),
});

type Props = z.infer<typeof highsfieldAnim04Schema>;

const AVATAR_COLORS = ["#14A800", "#2D8F5C", "#1B6B47", "#0D4D33", "#145C3D"];
const AVATAR_INITIALS = ["JD", "SM", "AL", "KP", "RB"];
const PARTICLES_PER_AVATAR = 20;

// Deterministic pseudo-random based on seed
function seededRand(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const HEX_POINTS = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");

export const HighsfieldAnim04Dissolution: React.FC<Props> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const CX = 960;
  const CY = 540;
  const AVATAR_RADIUS = 36;
  const AVATAR_SPACING = 90;
  const totalW = (AVATAR_COLORS.length - 1) * AVATAR_SPACING;
  const startX = CX - totalW / 2;

  // Dissolve progress per avatar (staggered): avatars dissolve 10–70
  // They dissolve in reverse order
  const getDissolveProgress = (i: number) => {
    const reverseI = AVATAR_COLORS.length - 1 - i;
    const dStart = 10 + reverseI * 8;
    const dEnd = 55 + reverseI * 4;
    return interpolate(frame, [dStart, dEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  };

  // Hexagon draw (55–100)
  const hexProgress = interpolate(frame, [55, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hexR = 90;
  const hexPerimeter = 6 * hexR; // approx
  const hexDash = hexPerimeter;
  const hexOffset = hexDash * (1 - hexProgress);
  const hexOpacity = interpolate(frame, [55, 68], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Pulse (100–135)
  const glowPulse = frame >= 100 ? 0.5 + 0.5 * Math.sin((frame - 100) * 0.15) : 0;
  const hexScale = frame >= 100
    ? 1 + Math.sin((frame - 100) * 0.15) * 0.04
    : 1;

  // Lightning symbol spring
  const boltSpring = spring({ frame: frame - 105, fps, config: { mass: 0.5, damping: 10, stiffness: 180 } });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity: fadeOut }}>
      <AuroraBackground />

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={accentColor} />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
          <filter id="hexGlow">
            <feGaussianBlur stdDeviation={8 + glowPulse * 12} result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Avatars + their particles */}
        {AVATAR_COLORS.map((color, avatarIdx) => {
          const ax = startX + avatarIdx * AVATAR_SPACING;
          const ay = CY;
          const dissolveP = getDissolveProgress(avatarIdx);
          const avatarOp = 1 - dissolveP;

          return (
            <g key={avatarIdx}>
              {/* Avatar circle */}
              <circle cx={ax} cy={ay} r={AVATAR_RADIUS} fill={color} opacity={avatarOp} />
              <text
                x={ax} y={ay + 8}
                textAnchor="middle"
                fontSize={20}
                fontWeight={700}
                fill="rgba(255,255,255,0.9)"
                opacity={avatarOp}
                fontFamily="sans-serif"
              >
                {AVATAR_INITIALS[avatarIdx]}
              </text>

              {/* Particles */}
              {dissolveP > 0 && Array.from({ length: PARTICLES_PER_AVATAR }, (_, pIdx) => {
                const seed = avatarIdx * 137 + pIdx * 31;
                const angle = seededRand(seed) * Math.PI * 2;
                const speed = 60 + seededRand(seed + 1) * 80;
                // convergence: particles move toward center in phase 3
                const convergeFactor = interpolate(frame, [55, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                const dx = Math.cos(angle) * speed * dissolveP * (1 - convergeFactor)
                  + (CX - ax) * convergeFactor * dissolveP;
                const dy = -Math.abs(Math.sin(angle)) * speed * dissolveP * (1 - convergeFactor)
                  + (CY - ay) * convergeFactor * dissolveP;
                const pOp = interpolate(dissolveP, [0, 0.5, 1], [0, 0.8, convergeFactor > 0.8 ? 0 : 0.5]);
                const pSize = 3 + seededRand(seed + 2) * 4;

                return (
                  <rect
                    key={pIdx}
                    x={ax + dx - pSize / 2}
                    y={ay + dy - pSize / 2}
                    width={pSize}
                    height={pSize}
                    fill={color}
                    opacity={pOp}
                    transform={`rotate(${seededRand(seed + 3) * 360 * dissolveP}, ${ax + dx}, ${ay + dy})`}
                  />
                );
              })}
            </g>
          );
        })}

        {/* AI Hexagon */}
        {frame >= 55 && (
          <g transform={`translate(${CX}, ${CY}) scale(${hexScale}) translate(${-CX}, ${-CY})`}>
            <polygon
              points={HEX_POINTS(CX, CY, hexR)}
              fill="none"
              stroke="url(#hexGrad)"
              strokeWidth={4}
              strokeDasharray={hexDash}
              strokeDashoffset={hexOffset}
              opacity={hexOpacity}
              filter={frame >= 100 ? "url(#hexGlow)" : undefined}
            />
            {/* Inner glow fill */}
            <polygon
              points={HEX_POINTS(CX, CY, hexR - 4)}
              fill={`rgba(48,96,255,${0.06 + glowPulse * 0.08})`}
              opacity={hexOpacity}
            />
          </g>
        )}

        {/* Lightning bolt ⚡ at center */}
        {frame >= 105 && (
          <text
            x={CX} y={CY + 18}
            textAnchor="middle"
            fontSize={56 * boltSpring}
            opacity={boltSpring}
            style={{ userSelect: "none" }}
          >
            ⚡
          </text>
        )}
      </svg>
    </AbsoluteFill>
  );
};
