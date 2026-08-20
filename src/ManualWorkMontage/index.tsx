import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const manualWorkMontageSchema = z.object({
  tasks: z.array(z.object({ emoji: z.string(), label: z.string() })).default([
    { emoji: "🔍", label: "Cherche sur Google" },
    { emoji: "📋", label: "Copie-colle" },
    { emoji: "📧", label: "Trouve les emails" },
    { emoji: "📤", label: "Envoie les emails" },
  ]),
  endLabel: z.string().default("FASTIDIEUX"),
  accentColor: z.string().default("#ef4444"),
  durationSecs: z.number().default(6),
});

export type ManualWorkMontageProps = z.infer<typeof manualWorkMontageSchema>;

const TASK_DURATION = 30;

export const ManualWorkMontage: React.FC<ManualWorkMontageProps> = ({
  tasks, endLabel, accentColor, durationSecs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tasksEnd = tasks.length * TASK_DURATION;

  const currentTask = Math.min(Math.floor(frame / TASK_DURATION), tasks.length - 1);
  const taskLocalFrame = frame % TASK_DURATION;

  const task = tasks[currentTask];

  // Task card animation
  const cardOpacity = interpolate(taskLocalFrame, [0, 8, TASK_DURATION - 8, TASK_DURATION], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cardY = interpolate(taskLocalFrame, [0, 8], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });

  // Energy bar drains progressively
  const energyProgress = interpolate(frame, [0, tasksEnd], [1, 0.05], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const energyColor = energyProgress > 0.5 ? "#22c55e" : energyProgress > 0.25 ? "#f59e0b" : accentColor;

  // FASTIDIEUX label at end
  const endFrame = tasksEnd + 10;
  const endOpacity = interpolate(frame, [endFrame, endFrame + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });
  const endScale = spring({ frame: Math.max(0, frame - endFrame), fps, config: { mass: 0.5, damping: 7, stiffness: 300 }, from: 2, to: 1 });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ opacity: 0.4 }}>
        <AuroraBackground />
      </AbsoluteFill>
      {/* Red tint */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(80,10,10,0.3) 0%, rgba(0,0,0,0) 70%))" }} />

      <AbsoluteFill style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 48,
      }}>

        {/* Task card — switches every TASK_DURATION frames */}
        {frame < tasksEnd && (
          <div style={{
            opacity: cardOpacity,
            transform: `translateY(${cardY}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}>
            {/* Step counter */}
            <div style={{
              fontFamily, fontWeight: 700, fontSize: 18,
              color: "rgba(150,150,150,0.7)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}>
              Étape {currentTask + 1} / {tasks.length}
            </div>

            {/* Icon */}
            <div style={{ fontSize: 100, lineHeight: 1 }}>{task.emoji}</div>

            {/* Label */}
            <div style={{
              fontFamily, fontWeight: 800, fontSize: 42,
              color: "#ffffff",
              letterSpacing: "0.02em",
              textAlign: "center",
            }}>
              {task.label}
            </div>
          </div>
        )}

        {/* FASTIDIEUX */}
        {frame >= endFrame && (
          <div style={{
            opacity: endOpacity,
            transform: `scale(${endScale})`,
            fontFamily, fontWeight: 800,
            fontSize: 96,
            color: accentColor,
            letterSpacing: "0.08em",
            textShadow: `0 0 40px ${accentColor}60`,
            textTransform: "uppercase",
          }}>
            {endLabel}
          </div>
        )}

        {/* Energy bar */}
        <div style={{ width: 700, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontFamily, fontWeight: 700, fontSize: 18, color: "rgba(200,200,200,0.7)", letterSpacing: "0.06em" }}>
              ⚡ Énergie
            </div>
            <div style={{ fontFamily, fontWeight: 700, fontSize: 18, color: energyColor, letterSpacing: "0.04em" }}>
              {Math.round(energyProgress * 100)}%
            </div>
          </div>
          <div style={{
            width: "100%", height: 14,
            background: "rgba(40,40,40,0.6)",
            borderRadius: 7,
            overflow: "hidden",
            border: "1px solid rgba(100,100,100,0.2)",
          }}>
            <div style={{
              width: `${energyProgress * 100}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${energyColor}90, ${energyColor})`,
              borderRadius: 7,
              boxShadow: `0 0 10px ${energyColor}50`,
              transition: "none",
            }} />
          </div>
        </div>

        {/* Task dots progress */}
        <div style={{ display: "flex", gap: 14 }}>
          {tasks.map((_, i) => (
            <div key={i} style={{
              width: 12, height: 12,
              borderRadius: "50%",
              background: i <= currentTask ? accentColor : "rgba(80,80,80,0.5)",
              boxShadow: i <= currentTask ? `0 0 8px ${accentColor}60` : "none",
              transition: "none",
            }} />
          ))}
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
