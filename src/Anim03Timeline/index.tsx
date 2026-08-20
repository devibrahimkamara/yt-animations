import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

export const anim03Schema = z.object({
  name: z.string().default("Ibrahim Camara"),
  subtitle: z.string().default("6 ans de business sur Internet"),
  milestones: z.array(z.object({
    year: z.string(),
    label: z.string(),
    emoji: z.string(),
    isHighlight: z.boolean().default(false),
  })).default([
    { year: "2019", label: "Début", emoji: "💻", isHighlight: false },
    { year: "2020", label: "1ers revenus", emoji: "💰", isHighlight: false },
    { year: "2021", label: "Croissance", emoji: "📈", isHighlight: false },
    { year: "2022", label: "Scale", emoji: "🚀", isHighlight: false },
    { year: "2023", label: "IA intégrée", emoji: "🤖", isHighlight: false },
    { year: "2024", label: "Automatisation", emoji: "⚡", isHighlight: false },
    { year: "2025", label: "Business autonome", emoji: "🏆", isHighlight: true },
  ]),
  accentColor: z.string().default("#3b82f6"),
  durationSecs: z.number().default(7),
});

export const Anim03Timeline: React.FC<z.infer<typeof anim03Schema>> = ({
  name, subtitle, milestones, accentColor, durationSecs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  void durationSecs;
  const STAGGER = 22;
  const LINE_START = 20;
  const LINE_END = LINE_START + milestones.length * STAGGER;

  // Header
  const headerOp = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const headerY = interpolate(frame, [0, 18], [-20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

  // Line draw
  const lineProgress = interpolate(frame, [LINE_START, LINE_END + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 80px", gap: 56 }}>

        {/* Header */}
        <div style={{ opacity: headerOp, transform: `translateY(${headerY}px)`, textAlign: "center", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontFamily, fontWeight: 800, fontSize: 62, color: "#fff", letterSpacing: "0.01em" }}>{name}</div>
          <div style={{ fontFamily, fontWeight: 600, fontSize: 34, color: `rgba(140,170,230,0.8)`, letterSpacing: "0.04em" }}>{subtitle}</div>
        </div>

        {/* Timeline */}
        <div style={{ position: "relative", width: "100%", paddingTop: 60, paddingBottom: 60 }}>
          {/* Background track */}
          <div style={{
            position: "absolute", top: "50%", left: 0, right: 0,
            height: 3, background: "rgba(80,100,160,0.25)", borderRadius: 2,
            transform: "translateY(-50%)",
          }} />

          {/* Animated fill line */}
          <div style={{
            position: "absolute", top: "50%", left: 0,
            height: 3,
            width: `${lineProgress * 100}%`,
            background: `linear-gradient(90deg, rgba(59,130,246,0.6), ${accentColor})`,
            borderRadius: 2,
            transform: "translateY(-50%)",
            boxShadow: `0 0 12px ${accentColor}60`,
          }} />

          {/* Dots */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
            {milestones.map((m, i) => {
              const dotStart = LINE_START + i * STAGGER;
              const dotS = spring({ frame: frame - dotStart, fps, config: { mass: 0.4, damping: 8, stiffness: 280 } });
              const labelOp = interpolate(frame, [dotStart + 4, dotStart + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const isAbove = i % 2 === 0;

              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", flex: 1 }}>
                  {/* Label above */}
                  {isAbove && (
                    <div style={{
                      opacity: labelOp, marginBottom: 16,
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                    }}>
                      <div style={{ fontSize: 34 }}>{m.emoji}</div>
                      <div style={{ fontFamily, fontWeight: 700, fontSize: 22, color: m.isHighlight ? "#ffd700" : "rgba(200,215,255,0.85)", letterSpacing: "0.02em", textAlign: "center", maxWidth: 120 }}>{m.label}</div>
                    </div>
                  )}
                  {!isAbove && <div style={{ height: 90 }} />}

                  {/* Dot */}
                  <div style={{
                    width: m.isHighlight ? 52 : 40, height: m.isHighlight ? 52 : 40,
                    borderRadius: "50%",
                    background: m.isHighlight
                      ? "linear-gradient(135deg, #ffd700, #f59e0b)"
                      : `linear-gradient(135deg, ${accentColor}, rgba(30,80,200,0.9))`,
                    border: `2.5px solid ${m.isHighlight ? "rgba(255,220,0,0.6)" : "rgba(120,170,255,0.5)"}`,
                    boxShadow: m.isHighlight
                      ? "0 0 30px rgba(255,215,0,0.6), 0 0 60px rgba(255,215,0,0.25)"
                      : `0 0 20px ${accentColor}50`,
                    transform: `scale(${dotS})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    zIndex: 2,
                    position: "relative",
                  }}>
                    {m.isHighlight && <div style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(255,255,255,0.9)" }} />}
                  </div>

                  {/* Year */}
                  <div style={{
                    opacity: labelOp, marginTop: 10,
                    fontFamily, fontWeight: 800, fontSize: 26,
                    color: m.isHighlight ? "#ffd700" : "rgba(180,205,255,0.9)",
                    letterSpacing: "0.05em",
                  }}>{m.year}</div>

                  {/* Label below */}
                  {!isAbove && (
                    <div style={{
                      opacity: labelOp, marginTop: 6,
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                    }}>
                      <div style={{ fontSize: 34 }}>{m.emoji}</div>
                      <div style={{ fontFamily, fontWeight: 700, fontSize: 22, color: m.isHighlight ? "#ffd700" : "rgba(200,215,255,0.85)", letterSpacing: "0.02em", textAlign: "center", maxWidth: 120 }}>{m.label}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
