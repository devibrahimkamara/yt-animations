import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const legoBlocksSchema = z.object({
  blocks: z.array(z.object({
    label: z.string(),
    color: z.string(),
    emoji: z.string().optional(),
  })).default([
    { label: "Recherche", color: "#3b82f6", emoji: "🔍" },
    { label: "Emails", color: "#8b5cf6", emoji: "✉️" },
    { label: "Prospection", color: "#ec4899", emoji: "📊" },
    { label: "CRM", color: "#f59e0b", emoji: "🗂️" },
    { label: "Réponses", color: "#10b981", emoji: "💬" },
  ]),
  resultLabel: z.string().default("SYSTÈME"),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(5),
});

export type LegoBlocksProps = z.infer<typeof legoBlocksSchema>;

export const LegoBlocks: React.FC<LegoBlocksProps> = ({ blocks, resultLabel, accentColor, durationSecs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const blockStagger = 16;
  const blocksDropEnd = 8 + blocks.length * blockStagger + 20;

  // SYSTEM label appears after all blocks land
  const systemStart = blocksDropEnd;
  const systemScale = spring({ frame: Math.max(0, frame - systemStart), fps, config: { mass: 0.5, damping: 9, stiffness: 200 }, from: 0, to: 1 });
  const systemOpacity = interpolate(frame, [systemStart, systemStart + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });

  // Flash when SYSTEM appears
  const flashOpacity = interpolate(frame, [systemStart, systemStart + 3, systemStart + 14], [0.5, 0, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />

      {/* Flash */}
      <AbsoluteFill style={{ background: `rgba(255,255,255,${flashOpacity * 0.3})`, pointerEvents: "none" }} />

      <AbsoluteFill style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
      }}>

        {/* Blocks row */}
        <div style={{ display: "flex", gap: 20, alignItems: "flex-end" }}>
          {blocks.map((block, i) => {
            const start = 8 + i * blockStagger;
            // Block falls from above
            const yDrop = interpolate(frame, [start, start + 18], [-200, 0], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
            });
            const opacity = interpolate(frame, [start, start + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            // Small bounce at landing
            const bounce = spring({ frame: Math.max(0, frame - (start + 14)), fps, config: { mass: 0.4, damping: 5, stiffness: 400 }, from: 1.15, to: 1 });

            return (
              <div key={i} style={{
                opacity,
                transform: `translateY(${yDrop}px) scale(${frame >= start + 14 ? bounce : 1})`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                background: `linear-gradient(135deg, ${block.color}40, ${block.color}25)`,
                border: `2px solid ${block.color}70`,
                borderRadius: 18,
                padding: "24px 20px",
                width: 155,
                boxShadow: `0 0 30px ${block.color}30`,
              }}>
                {block.emoji && (
                  <span style={{ fontSize: 40 }}>{block.emoji}</span>
                )}
                <div style={{
                  fontFamily, fontWeight: 800,
                  fontSize: 20,
                  color: block.color,
                  letterSpacing: "0.04em",
                  textAlign: "center",
                }}>
                  {block.label}
                </div>
                {/* Lego studs on top */}
                <div style={{
                  position: "absolute",
                  top: -8,
                  display: "flex",
                  gap: 8,
                }}>
                  {[0, 1].map(j => (
                    <div key={j} style={{
                      width: 16, height: 16, borderRadius: "50%",
                      background: block.color,
                      border: `2px solid ${block.color}90`,
                      opacity: 0.8,
                    }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Assembly indicator */}
        <div style={{
          opacity: interpolate(frame, [blocksDropEnd - 20, blocksDropEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          fontSize: 32,
        }}>
          🔩
        </div>

        {/* SYSTEM result */}
        <div style={{
          opacity: systemOpacity,
          transform: `scale(${systemScale})`,
          background: `linear-gradient(135deg, rgba(15,40,100,0.8), rgba(10,25,60,0.7))`,
          border: `2px solid ${accentColor}60`,
          borderRadius: 24,
          padding: "28px 80px",
          boxShadow: `0 0 60px ${accentColor}40`,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}>
          <span style={{ fontSize: 42 }}>⚙️</span>
          <div style={{
            fontFamily, fontWeight: 800,
            fontSize: 52,
            background: `linear-gradient(90deg, #ffffff 0%, ${accentColor} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "0.1em",
          }}>
            {resultLabel}
          </div>
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
