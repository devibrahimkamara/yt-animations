import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const autopilotDashboardSchema = z.object({
  avatarLabel: z.string().default("Ibrahim"),
  tasks: z.array(z.object({
    emoji: z.string(),
    label: z.string(),
    value: z.string().optional(),
  })).default([
    { emoji: "✉️", label: "Emails envoyés", value: "47" },
    { emoji: "🔔", label: "Notifications", value: "12" },
    { emoji: "💰", label: "Revenus générés", value: "+340€" },
    { emoji: "✅", label: "Tâches complétées", value: "8/8" },
  ]),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(7),
});

export type AutopilotDashboardProps = z.infer<typeof autopilotDashboardSchema>;

const TASK_STAGGER = 28;
const TASKS_START = 35;

export const AutopilotDashboard: React.FC<AutopilotDashboardProps> = ({
  avatarLabel, tasks, accentColor, durationSecs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = durationSecs * 30;

  // Avatar appears first
  const avatarScale = spring({ frame, fps, config: { mass: 0.5, damping: 12, stiffness: 180 }, from: 0, to: 1 });
  const avatarOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ZZZ animation
  const zzzItems = [0, 1, 2].map(i => {
    const t = (frame * 0.04 + i * 0.6) % (Math.PI * 2);
    const y = -30 - i * 18 - Math.sin(t) * 6;
    const x = 10 + i * 12;
    const opacity = 0.4 + 0.6 * Math.abs(Math.sin(t * 0.5));
    const scale = 0.7 + i * 0.15;
    return { x, y, opacity, scale };
  });

  // Email counter ticks up
  const emailCount = Math.floor(interpolate(frame, [TASKS_START, totalFrames - 10], [0, 47], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />

      <AbsoluteFill style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 80,
        padding: "0 100px",
      }}>

        {/* ── LEFT: Sleeping avatar ── */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          opacity: avatarOpacity,
          transform: `scale(${avatarScale})`,
          width: 280,
        }}>
          {/* Avatar face */}
          <div style={{ position: "relative" }}>
            <div style={{
              width: 160,
              height: 160,
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(20,40,100,0.9), rgba(10,25,60,0.8))",
              border: `2px solid ${accentColor}40`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 80,
              boxShadow: `0 0 40px ${accentColor}20`,
            }}>
              😴
            </div>
            {/* ZZZ */}
            {zzzItems.map((z, i) => (
              <div key={i} style={{
                position: "absolute",
                top: 0,
                right: -20,
                fontFamily, fontWeight: 800,
                fontSize: 20 + i * 4,
                color: "rgba(136,170,255,0.7)",
                opacity: z.opacity,
                transform: `translate(${z.x}px, ${z.y}px) scale(${z.scale})`,
              }}>
                Z
              </div>
            ))}
          </div>

          <div style={{ fontFamily, fontWeight: 700, fontSize: 22, color: "rgba(200,220,255,0.8)", letterSpacing: "0.04em" }}>
            {avatarLabel}
          </div>
          <div style={{ fontFamily, fontWeight: 600, fontSize: 16, color: "rgba(100,130,200,0.6)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            En train de dormir
          </div>
        </div>

        {/* Arrow / while */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          opacity: interpolate(frame, [20, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          <div style={{ fontFamily, fontWeight: 700, fontSize: 18, color: "rgba(100,130,200,0.6)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            pendant ce temps
          </div>
          <div style={{ fontSize: 32 }}>→</div>
        </div>

        {/* ── RIGHT: Dashboard ── */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}>
          {/* Dashboard header */}
          <div style={{
            fontFamily, fontWeight: 800, fontSize: 24,
            color: "#ffffff",
            letterSpacing: "0.04em",
            marginBottom: 4,
            opacity: interpolate(frame, [28, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}>
            🤖 AI Agent — En cours
          </div>

          {tasks.map((task, i) => {
            const start = TASKS_START + i * TASK_STAGGER;
            const opacity = interpolate(frame, [start, start + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });
            const x = interpolate(frame, [start, start + 14], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });
            const taskScale = spring({ frame: Math.max(0, frame - start), fps, config: { mass: 0.4, damping: 9, stiffness: 260 }, from: 0.85, to: 1 });

            // Special counter for email task
            const displayValue = i === 0 && task.value === "47"
              ? String(Math.min(emailCount, 47))
              : task.value;

            return (
              <div key={i} style={{
                opacity,
                transform: `translateX(${x}px) scale(${taskScale})`,
                background: "rgba(10,25,60,0.7)",
                border: `1px solid ${accentColor}30`,
                borderRadius: 14,
                padding: "16px 24px",
                display: "flex",
                alignItems: "center",
                gap: 16,
                boxShadow: `0 0 20px ${accentColor}10`,
              }}>
                <span style={{ fontSize: 32, flexShrink: 0 }}>{task.emoji}</span>
                <div style={{ fontFamily, fontWeight: 700, fontSize: 20, color: "rgba(180,200,255,0.9)", flex: 1 }}>
                  {task.label}
                </div>
                {displayValue && (
                  <div style={{
                    fontFamily, fontWeight: 800, fontSize: 22,
                    color: accentColor,
                    background: `${accentColor}18`,
                    borderRadius: 8,
                    padding: "4px 14px",
                    letterSpacing: "0.04em",
                    boxShadow: `0 0 10px ${accentColor}30`,
                  }}>
                    {displayValue}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
