import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const emailBlastSchema = z.object({
  stages: z.array(z.number()).default([50, 100, 200]),
  label: z.string().default("emails envoyés simultanément"),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(5),
});

export type EmailBlastProps = z.infer<typeof emailBlastSchema>;

// Seeded random using simple LCG
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export const EmailBlast: React.FC<EmailBlastProps> = ({ stages, label, accentColor, durationSecs }) => {
  const frame = useCurrentFrame();
  const totalFrames = durationSecs * 30;

  // Stage timing
  const stageFrames = Math.floor(totalFrames * 0.55 / stages.length);
  const currentStageIdx = Math.min(Math.floor(frame / stageFrames), stages.length - 1);
  const currentCount = stages[currentStageIdx];

  // Blast happens when all envelopes fly out — last 35% of animation
  const blastStart = Math.floor(totalFrames * 0.65);
  const isBlasting = frame >= blastStart;
  const blastProgress = interpolate(frame, [blastStart, totalFrames - 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });

  // Counter display
  const counterOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const displayCount = isBlasting
    ? currentCount
    : Math.round(interpolate(frame, [(currentStageIdx * stageFrames), ((currentStageIdx + 1) * stageFrames)], [stages[Math.max(0, currentStageIdx - 1)] || 0, currentCount], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  // Generate envelope positions — fixed grid
  const rand = seededRandom(42);
  const maxEnvelopes = stages[stages.length - 1];
  const envelopes = Array.from({ length: maxEnvelopes }, (_, i) => {
    const cols = Math.ceil(Math.sqrt(maxEnvelopes * 1.5));
    const rows = Math.ceil(maxEnvelopes / cols);
    const col = i % cols;
    const row = Math.floor(i / cols);
    const jitterX = (rand() - 0.5) * 20;
    const jitterY = (rand() - 0.5) * 20;
    const angle = rand() * 360;
    const speed = 0.5 + rand() * 1.5;
    const launchAngle = rand() * 360;
    return { col, row, cols, rows, jitterX, jitterY, angle, speed, launchAngle };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />

      <AbsoluteFill style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
      }}>

        {/* Counter */}
        <div style={{
          opacity: counterOpacity,
          display: "flex",
          alignItems: "baseline",
          gap: 16,
        }}>
          <div style={{
            fontFamily, fontWeight: 800,
            fontSize: 96,
            color: accentColor,
            letterSpacing: "-0.02em",
            textShadow: `0 0 40px ${accentColor}60`,
            fontVariantNumeric: "tabular-nums",
            minWidth: 200,
            textAlign: "right",
          }}>
            {displayCount}
          </div>
          <div style={{
            fontFamily, fontWeight: 700,
            fontSize: 26,
            color: "rgba(136,170,255,0.7)",
            letterSpacing: "0.04em",
            maxWidth: 220,
            lineHeight: 1.3,
          }}>
            {label}
          </div>
        </div>

        {/* Envelope grid */}
        <div style={{
          position: "relative",
          width: 900,
          height: 400,
          overflow: "visible",
        }}>
          {envelopes.map((env, i) => {
            const isVisible = i < currentCount;
            if (!isVisible) return null;

            const { col, row, cols, rows, jitterX, jitterY, angle, speed, launchAngle } = env;
            const gridX = (col / cols) * 860 + jitterX + 20;
            const gridY = (row / rows) * 360 + jitterY + 20;

            // Appear animation
            const appearFrame = Math.floor((i / currentCount) * (stageFrames * 0.7));
            const opacity = isBlasting
              ? interpolate(blastProgress, [0, 0.15, 0.8, 1], [1, 1, 0.3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
              : interpolate(frame, [appearFrame, appearFrame + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

            // Blast: fly out in random directions
            const launchRad = (launchAngle * Math.PI) / 180;
            const blastX = isBlasting ? Math.cos(launchRad) * blastProgress * 600 * speed : 0;
            const blastY = isBlasting ? Math.sin(launchRad) * blastProgress * 600 * speed : 0;
            const blastRotate = isBlasting ? blastProgress * angle * 2 : 0;

            const scale = isBlasting
              ? interpolate(blastProgress, [0, 0.3, 1], [1, 1.1, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
              : interpolate(frame, [appearFrame, appearFrame + 6], [0.5, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

            return (
              <div key={i} style={{
                position: "absolute",
                left: gridX,
                top: gridY,
                transform: `translate(${blastX}px, ${blastY}px) scale(${scale}) rotate(${blastRotate}deg)`,
                opacity,
                fontSize: maxEnvelopes > 100 ? 18 : maxEnvelopes > 50 ? 22 : 28,
              }}>
                ✉️
              </div>
            );
          })}
        </div>

        {/* Stage indicators */}
        <div style={{ display: "flex", gap: 24 }}>
          {stages.map((s, i) => (
            <div key={i} style={{
              fontFamily, fontWeight: 700, fontSize: 20,
              color: i <= currentStageIdx ? accentColor : "rgba(80,80,80,0.5)",
              letterSpacing: "0.04em",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}>
              {i < currentStageIdx && "✓ "}
              {i === currentStageIdx && "▶ "}
              {s}
            </div>
          ))}
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
