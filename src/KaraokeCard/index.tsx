import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";
import { GlassCard } from "../GlassMotionCard/GlassCard";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const karaokeCardSchema = z.object({
  lyrics: z.string(),
  wordsPerSecond: z.number().default(1.8),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(6),
});

export type KaraokeCardProps = z.infer<typeof karaokeCardSchema>;

// Confettis déterministes
const CONFETTI_COLORS = ["#FFD700", "#FF6B6B", "#4ECDC4", "#88aaff", "#FF8C42", "#A8FF3E"];
const confettiItems = Array.from({ length: 22 }, (_, i) => ({
  x: (i * 83) % 1920,
  startY: -40 - (i * 37) % 120,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  size: 8 + (i * 13) % 14,
  speed: 0.7 + (i * 0.17) % 0.6,
  delay: (i * 7) % 40,
  rotation: (i * 47) % 360,
}));

export const KaraokeCard: React.FC<KaraokeCardProps> = ({
  lyrics,
  wordsPerSecond,
  accentColor,
  durationSecs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = durationSecs * fps;

  const words = lyrics.split(" ");
  const framesPerWord = fps / wordsPerSecond;
  const lyricsStartFrame = 20;

  const entryOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });

  // Confettis apparaissent après la moitié de l'animation
  const confettiStart = Math.round(totalFrames * 0.4);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AuroraBackground />

      {/* Confettis */}
      {frame >= confettiStart && confettiItems.map((c, i) => {
        const elapsed = frame - confettiStart - c.delay;
        if (elapsed < 0) return null;
        const progress = elapsed / (totalFrames - confettiStart);
        const y = c.startY + progress * (1200 + 100) * c.speed;
        const rot = c.rotation + elapsed * 4;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: c.x,
              top: y,
              width: c.size,
              height: c.size * 0.5,
              background: c.color,
              borderRadius: 2,
              transform: `rotate(${rot}deg)`,
              opacity: 0.85,
            }}
          />
        );
      })}

      <GlassCard layout="wide" accentColor={accentColor}>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px 16px",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          opacity: entryOpacity,
          padding: "8px 0",
        }}>
          {words.map((word, i) => {
            const wordFrame = lyricsStartFrame + i * framesPerWord;
            const isActive = frame >= wordFrame && frame < wordFrame + framesPerWord;
            const isPast = frame >= wordFrame + framesPerWord;

            const wordOpacity = interpolate(frame, [wordFrame - 3, wordFrame + 5], [0.25, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });
            const wordScale = isActive
              ? interpolate(frame, [wordFrame, wordFrame + 5], [1, 1.08], {
                  extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
                })
              : 1;

            return (
              <span
                key={i}
                style={{
                  fontFamily,
                  fontWeight: 800,
                  fontSize: 52,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                  color: isActive ? "#ffffff" : isPast ? "rgba(136,170,255,0.6)" : "rgba(255,255,255,0.25)",
                  opacity: wordOpacity,
                  transform: `scale(${wordScale})`,
                  display: "inline-block",
                  textShadow: isActive ? `0 0 20px ${accentColor}80, 0 0 40px ${accentColor}40` : "none",
                  transition: "color 0.05s",
                  background: isActive
                    ? "linear-gradient(180deg, #ffffff 0%, #88aaff 100%)"
                    : "none",
                  WebkitBackgroundClip: isActive ? "text" : "unset",
                  WebkitTextFillColor: isActive ? "transparent" : "unset",
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </GlassCard>
    </AbsoluteFill>
  );
};
