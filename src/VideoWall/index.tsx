import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

// Fictional thumbnail colors and titles
const DEFAULT_THUMBNAILS = [
  { title: "J'ai gagné 3K€", bg: "#1a0533", accent: "#a855f7" },
  { title: "IA Business 2026", bg: "#0a1a4a", accent: "#3060ff" },
  { title: "Automatiser tout", bg: "#0f2a0f", accent: "#22c55e" },
  { title: "Revenus ×10", bg: "#3a1a00", accent: "#f97316" },
  { title: "ChatGPT Avancé", bg: "#1a1a00", accent: "#eab308" },
  { title: "Faire €€ en dormant", bg: "#1a002a", accent: "#ec4899" },
  { title: "Business en ligne", bg: "#002020", accent: "#06b6d4" },
  { title: "Mon système IA", bg: "#200a00", accent: "#ef4444" },
  { title: "YouTube Faceless", bg: "#0a1a0a", accent: "#4ade80" },
  { title: "Freelance IA 2026", bg: "#1a1a2a", accent: "#818cf8" },
  { title: "Prospect Auto", bg: "#0a0a1a", accent: "#67e8f9" },
  { title: "Revenus passifs", bg: "#1a0a00", accent: "#fb923c" },
];

export const videoWallSchema = z.object({
  channelName: z.string().default("Ibrahim Camara"),
  softwareLogos: z.array(z.object({ name: z.string(), emoji: z.string() })).default([
    { name: "ChatGPT", emoji: "🤖" },
    { name: "Claude AI", emoji: "✦" },
    { name: "Make.com", emoji: "⚙️" },
    { name: "Verdant.ai", emoji: "🌿" },
  ]),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(4),
});

export type VideoWallProps = z.infer<typeof videoWallSchema>;

export const VideoWall: React.FC<VideoWallProps> = ({
  channelName, softwareLogos, accentColor, durationSecs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const thumbnailStagger = 5;
  const thumbsStart = 5;
  const totalThumbs = DEFAULT_THUMBNAILS.length;
  const thumbsEnd = thumbsStart + totalThumbs * thumbnailStagger + 20;

  // YouTube logo appears after thumbnails
  const ytStart = thumbsEnd;
  const ytScale = spring({ frame: Math.max(0, frame - ytStart), fps, config: { mass: 0.5, damping: 10, stiffness: 220 }, from: 0, to: 1 });
  const ytOpacity = interpolate(frame, [ytStart, ytStart + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });

  // Software logos appear after YouTube
  const swStart = ytStart + 20;
  const swStagger = 12;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />

      <AbsoluteFill style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        padding: "40px 120px",
      }}>

        {/* Channel label */}
        <div style={{
          fontFamily, fontWeight: 700, fontSize: 22,
          color: "rgba(136,170,255,0.7)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          opacity: interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          {channelName}
        </div>

        {/* Thumbnail grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14,
          width: "100%",
        }}>
          {DEFAULT_THUMBNAILS.map((thumb, i) => {
            const start = thumbsStart + i * thumbnailStagger;
            const opacity = interpolate(frame, [start, start + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });
            const scale = spring({ frame: Math.max(0, frame - start), fps, config: { mass: 0.4, damping: 10, stiffness: 260 }, from: 0.7, to: 1 });
            const y = interpolate(frame, [start, start + 10], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });

            return (
              <div key={i} style={{
                opacity,
                transform: `scale(${scale}) translateY(${y}px)`,
                background: thumb.bg,
                border: `1px solid ${thumb.accent}40`,
                borderRadius: 12,
                height: 100,
                padding: "12px 14px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                overflow: "hidden",
                position: "relative",
                boxShadow: `0 0 20px ${thumb.accent}15`,
              }}>
                {/* Gradient overlay */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: `linear-gradient(to bottom, transparent 30%, ${thumb.bg}cc 100%)`,
                }} />
                {/* Play icon */}
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%, -65%)",
                  width: 28, height: 28, borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14,
                }}>
                  ▶
                </div>
                <div style={{
                  position: "relative", zIndex: 1,
                  fontFamily, fontWeight: 800, fontSize: 13,
                  color: "#ffffff", lineHeight: 1.3,
                }}>
                  {thumb.title}
                </div>
                <div style={{
                  position: "relative", zIndex: 1,
                  fontFamily, fontWeight: 600, fontSize: 11,
                  color: thumb.accent, marginTop: 3,
                }}>
                  {channelName}
                </div>
              </div>
            );
          })}
        </div>

        {/* YouTube logo */}
        {frame >= ytStart && (
          <div style={{
            opacity: ytOpacity,
            transform: `scale(${ytScale})`,
            display: "flex",
            alignItems: "center",
            gap: 14,
            background: "rgba(10,10,10,0.8)",
            border: "1px solid rgba(255,0,0,0.3)",
            borderRadius: 14,
            padding: "12px 28px",
            boxShadow: "0 0 30px rgba(255,0,0,0.2)",
          }}>
            <div style={{
              width: 44, height: 32, borderRadius: 8,
              background: "#ff0000",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16,
            }}>▶</div>
            <div style={{ fontFamily, fontWeight: 800, fontSize: 24, color: "#ffffff", letterSpacing: "-0.01em" }}>
              YouTube
            </div>
          </div>
        )}

        {/* Software logos */}
        {frame >= swStart && (
          <div style={{ display: "flex", gap: 16 }}>
            {softwareLogos.map((sw, i) => {
              const start = swStart + i * swStagger;
              const opacity = interpolate(frame, [start, start + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });
              const scale = spring({ frame: Math.max(0, frame - start), fps, config: { mass: 0.4, damping: 9, stiffness: 280 }, from: 0, to: 1 });
              return (
                <div key={i} style={{
                  opacity, transform: `scale(${scale})`,
                  background: "rgba(10,20,50,0.8)",
                  border: `1px solid ${accentColor}30`,
                  borderRadius: 10,
                  padding: "8px 18px",
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span style={{ fontSize: 20 }}>{sw.emoji}</span>
                  <span style={{ fontFamily, fontWeight: 700, fontSize: 16, color: "rgba(180,200,255,0.8)" }}>{sw.name}</span>
                </div>
              );
            })}
          </div>
        )}

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
