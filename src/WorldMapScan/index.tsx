import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const worldMapScanSchema = z.object({
  collectibles: z.array(z.object({ emoji: z.string(), label: z.string(), x: z.number(), y: z.number() })).default([
    { emoji: "🏷️", label: "Marque", x: 0.22, y: 0.3 },
    { emoji: "✉️", label: "Email", x: 0.65, y: 0.25 },
    { emoji: "👤", label: "Contact", x: 0.45, y: 0.55 },
    { emoji: "🏷️", label: "Marque", x: 0.78, y: 0.6 },
    { emoji: "✉️", label: "Email", x: 0.15, y: 0.65 },
  ]),
  accentColor: z.string().default("#00d4ff"),
  durationSecs: z.number().default(7),
});

export type WorldMapScanProps = z.infer<typeof worldMapScanSchema>;

// Simplified world continent shapes (normalized 0-1)
const CONTINENTS = [
  // North America
  "M 0.08 0.15 L 0.12 0.12 L 0.22 0.14 L 0.28 0.22 L 0.24 0.32 L 0.18 0.38 L 0.14 0.35 L 0.1 0.28 Z",
  // South America
  "M 0.22 0.42 L 0.28 0.4 L 0.32 0.45 L 0.3 0.62 L 0.24 0.68 L 0.19 0.62 L 0.2 0.5 Z",
  // Europe
  "M 0.44 0.14 L 0.5 0.12 L 0.54 0.16 L 0.52 0.24 L 0.46 0.26 L 0.43 0.2 Z",
  // Africa
  "M 0.44 0.28 L 0.52 0.26 L 0.56 0.32 L 0.55 0.5 L 0.5 0.58 L 0.44 0.52 L 0.42 0.42 Z",
  // Asia
  "M 0.54 0.12 L 0.78 0.1 L 0.84 0.2 L 0.82 0.35 L 0.72 0.4 L 0.6 0.38 L 0.56 0.28 Z",
  // Australia
  "M 0.74 0.52 L 0.84 0.5 L 0.86 0.58 L 0.8 0.64 L 0.74 0.62 Z",
];

const MAP_W = 1000;
const MAP_H = 500;

export const WorldMapScan: React.FC<WorldMapScanProps> = ({
  collectibles, accentColor, durationSecs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = durationSecs * 30;

  // Robot starts top-left, travels through map
  const robotProgress = interpolate(frame, [10, totalFrames - 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Path: left→right zigzag
  const robotX = interpolate(robotProgress, [0, 0.5, 1], [0.05, 0.9, 0.5]) * MAP_W;
  const robotY = interpolate(robotProgress, [0, 0.25, 0.5, 0.75, 1], [0.2, 0.5, 0.25, 0.6, 0.4]) * MAP_H;

  // Collectibles appear when robot is near them
  const collectibleRadius = 0.18; // fraction of map size

  // Database appears at frame 120+
  const dbStart = 120;
  const dbOpacity = interpolate(frame, [dbStart, dbStart + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });
  const dbScale = spring({ frame: Math.max(0, frame - dbStart), fps, config: { mass: 0.5, damping: 12, stiffness: 200 }, from: 0, to: 1 });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ opacity: 0.3 }}>
        <AuroraBackground />
      </AbsoluteFill>
      {/* Space-like dark background */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,20,40,0.8) 0%, rgba(0,0,0,0) 80%)" }} />

      <AbsoluteFill style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
      }}>

        {/* Title */}
        <div style={{
          fontFamily, fontWeight: 800, fontSize: 28,
          color: accentColor,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          opacity: interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          textShadow: `0 0 20px ${accentColor}60`,
        }}>
          🤖 Scan mondial en cours...
        </div>

        {/* Map */}
        <div style={{
          position: "relative",
          background: "rgba(5,15,35,0.85)",
          border: `1px solid ${accentColor}25`,
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: `0 0 60px ${accentColor}15`,
        }}>
          <svg width={MAP_W} height={MAP_H} viewBox={`0 0 ${MAP_W} ${MAP_H}`}>
            {/* Grid */}
            {[0.2, 0.4, 0.6, 0.8].map(t => (
              <g key={t}>
                <line x1={t * MAP_W} y1={0} x2={t * MAP_W} y2={MAP_H} stroke={`${accentColor}08`} strokeWidth="1" />
                <line x1={0} y1={t * MAP_H} x2={MAP_W} y2={t * MAP_H} stroke={`${accentColor}08`} strokeWidth="1" />
              </g>
            ))}

            {/* Continents */}
            {CONTINENTS.map((path, i) => {
              // Scale path coords from 0-1 to MAP dimensions
              const scaledPath = path.replace(/(-?\d+\.?\d*)\s+(-?\d+\.?\d*)/g, (_, x, y) =>
                `${parseFloat(x) * MAP_W} ${parseFloat(y) * MAP_H}`
              );
              return (
                <path key={i} d={scaledPath}
                  fill={`${accentColor}12`}
                  stroke={`${accentColor}30`}
                  strokeWidth="1.5"
                />
              );
            })}

            {/* Robot trail */}
            <circle cx={robotX} cy={robotY} r={60}
              fill="none" stroke={accentColor} strokeWidth="1"
              opacity={0.08}
            />
            <circle cx={robotX} cy={robotY} r={30}
              fill={`${accentColor}12`} stroke={accentColor} strokeWidth="1.5"
              opacity={0.4}
            />

            {/* Robot icon */}
            <text x={robotX} y={robotY} textAnchor="middle" dominantBaseline="middle" fontSize={26}>
              🤖
            </text>

            {/* Robot trail dots */}
            {[0.05, 0.1, 0.15, 0.2, 0.25].map(lag => {
              const lagProgress = Math.max(0, robotProgress - lag);
              const lx = interpolate(lagProgress, [0, 0.5, 1], [0.05, 0.9, 0.5]) * MAP_W;
              const ly = interpolate(lagProgress, [0, 0.25, 0.5, 0.75, 1], [0.2, 0.5, 0.25, 0.6, 0.4]) * MAP_H;
              return (
                <circle key={lag} cx={lx} cy={ly} r={3}
                  fill={accentColor}
                  opacity={0.15 + lag * 1.2}
                />
              );
            })}

            {/* Collectible points */}
            {collectibles.map((c, i) => {
              const cx = c.x * MAP_W;
              const cy = c.y * MAP_H;
              const dx = robotX - cx;
              const dy = robotY - cy;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const isNear = dist < collectibleRadius * MAP_W;
              const isCollected = dist < 40 && frame > 20;

              const pointOpacity = interpolate(frame, [15 + i * 8, 25 + i * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

              if (isCollected) return null;

              return (
                <g key={i} opacity={pointOpacity}>
                  <circle cx={cx} cy={cy} r={isNear ? 18 : 12}
                    fill={`${accentColor}20`}
                    stroke={accentColor}
                    strokeWidth={isNear ? 2 : 1}
                    opacity={isNear ? 0.8 : 0.5}
                  />
                  <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize={16}>
                    {c.emoji}
                  </text>
                  <text x={cx} y={cy + 24} textAnchor="middle" fontSize={11}
                    fill={accentColor} fontFamily={fontFamily} fontWeight={700} opacity={0.7}>
                    {c.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Database collecting */}
        <div style={{
          opacity: dbOpacity,
          transform: `scale(${dbScale})`,
          background: "rgba(5,15,35,0.85)",
          border: `1px solid ${accentColor}30`,
          borderRadius: 14,
          padding: "16px 40px",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}>
          <span style={{ fontSize: 28 }}>🗄️</span>
          <div style={{ fontFamily, fontWeight: 700, fontSize: 20, color: "rgba(150,220,255,0.85)" }}>
            Base de données — {Math.floor(interpolate(frame, [dbStart, totalFrames - 10], [0, 47], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))} contacts collectés
          </div>
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
