import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const levelUpCardSchema = z.object({
  levels: z.array(z.object({
    number: z.number(),
    label: z.string(),
    color: z.string(),
  })).default([
    { number: 1, label: "UTILISATEUR CHATGPT", color: "#888888" },
    { number: 2, label: "CRÉATEUR DE SYSTÈME IA", color: "#3060ff" },
    { number: 3, label: "BUSINESS AUTOMATISÉ", color: "#ffd700" },
  ]),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(4),
});

export type LevelUpCardProps = z.infer<typeof levelUpCardSchema>;

export const LevelUpCard: React.FC<LevelUpCardProps> = ({ levels, accentColor, durationSecs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = durationSecs * 30;

  const levelStagger = 28;
  const levelsStart = 8;

  // XP bar fills across total duration
  const xpProgress = interpolate(frame, [20, totalFrames - 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Flash on each level unlock
  const levelFlashes = levels.map((_, i) => {
    const unlockFrame = levelsStart + i * levelStagger;
    return interpolate(frame, [unlockFrame, unlockFrame + 3, unlockFrame + 10], [0.5, 0, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  });
  const flashOpacity = Math.max(...levelFlashes);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />

      {/* Flash overlay */}
      <AbsoluteFill style={{ background: `rgba(255,220,50,${flashOpacity * 0.35})`, pointerEvents: "none" }} />

      <AbsoluteFill style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        padding: "0 160px",
      }}>

        {/* Level rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%", maxWidth: 900 }}>
          {levels.map((level, i) => {
            const start = levelsStart + i * levelStagger;
            const opacity = interpolate(frame, [start, start + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });
            const xVal = interpolate(frame, [start, start + 16], [-30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });
            const scaleVal = spring({ frame: Math.max(0, frame - start), fps, config: { mass: 0.5, damping: 10, stiffness: 240 }, from: 0.85, to: 1 });

            const isTop = i === levels.length - 1;

            return (
              <div key={i}>
                {/* Arrow between levels */}
                {i > 0 && (
                  <div style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: 12,
                    opacity: interpolate(frame, [levelsStart + (i - 1) * levelStagger + 8, levelsStart + (i - 1) * levelStagger + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                    fontSize: 28,
                  }}>
                    ⬆️
                  </div>
                )}

                <div style={{
                  opacity,
                  transform: `translateX(${xVal}px) scale(${scaleVal})`,
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  background: isTop
                    ? "linear-gradient(135deg, rgba(80,60,0,0.7), rgba(50,35,0,0.6))"
                    : i === 1
                    ? "linear-gradient(135deg, rgba(15,40,100,0.7), rgba(10,25,60,0.6))"
                    : "rgba(30,30,30,0.5)",
                  border: `1.5px solid ${level.color}50`,
                  borderRadius: 18,
                  padding: "18px 32px",
                  boxShadow: isTop ? `0 0 50px ${level.color}30` : i === 1 ? `0 0 30px ${level.color}20` : "none",
                }}>
                  {/* Level badge */}
                  <div style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${level.color}80, ${level.color}40)`,
                    border: `2px solid ${level.color}60`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: `0 0 16px ${level.color}40`,
                  }}>
                    <span style={{
                      fontFamily, fontWeight: 800,
                      fontSize: 22,
                      color: level.color,
                    }}>
                      {level.number}
                    </span>
                  </div>

                  {/* Label */}
                  <div style={{
                    fontFamily, fontWeight: 800,
                    fontSize: isTop ? 34 : i === 1 ? 30 : 26,
                    color: level.color,
                    letterSpacing: "0.04em",
                    textShadow: isTop ? `0 0 20px ${level.color}60` : "none",
                  }}>
                    {level.label}
                  </div>

                  {/* Crown for top level */}
                  {isTop && (
                    <div style={{ fontSize: 36, marginLeft: "auto" }}>👑</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* XP Bar */}
        <div style={{
          width: "100%",
          maxWidth: 900,
          opacity: interpolate(frame, [10, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
          }}>
            <span style={{ fontFamily, fontWeight: 700, fontSize: 16, color: "rgba(255,215,0,0.7)", letterSpacing: "0.08em" }}>
              XP
            </span>
            <span style={{ fontFamily, fontWeight: 700, fontSize: 16, color: "rgba(255,215,0,0.7)", letterSpacing: "0.04em" }}>
              {Math.round(xpProgress * 100)}%
            </span>
          </div>
          <div style={{
            width: "100%",
            height: 12,
            background: "rgba(50,50,50,0.6)",
            borderRadius: 6,
            overflow: "hidden",
            border: "1px solid rgba(255,215,0,0.2)",
          }}>
            <div style={{
              width: `${xpProgress * 100}%`,
              height: "100%",
              background: "linear-gradient(90deg, #888888, #3060ff, #ffd700)",
              borderRadius: 6,
              boxShadow: "0 0 12px rgba(255,215,0,0.5)",
              transition: "none",
            }} />
          </div>
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
