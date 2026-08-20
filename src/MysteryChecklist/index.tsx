import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";
import { GlassCard } from "../GlassMotionCard/GlassCard";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

const STAGGER = 20; // frames entre chaque item

export const mysteryChecklistSchema = z.object({
  title: z.string().default("Méthodes qui fonctionnent en 2026"),
  items: z.array(z.string()).default([
    "Méthode #1 ████████████",
    "Méthode #2 ████████████",
    "Méthode #3 ████████████",
    "Méthode #4 ████████████",
  ]),
  callToAction: z.string().default("▶ Révélé dans cette vidéo"),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(8),
});

export type MysteryChecklistProps = z.infer<typeof mysteryChecklistSchema>;

export const MysteryChecklist: React.FC<MysteryChecklistProps> = ({
  title,
  items,
  callToAction,
  accentColor,
  durationSecs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Titre
  const titleOpacity = interpolate(frame, [0, 22], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });
  const titleY = interpolate(frame, [0, 22], [24, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });

  // Chaque item apparaît en stagger
  const itemStartFrame = (i: number) => 25 + i * STAGGER;

  // CTA apparaît après le dernier item
  const ctaStartFrame = 25 + items.length * STAGGER + 10;
  const ctaOpacity = interpolate(frame, [ctaStartFrame, ctaStartFrame + 18], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });
  const ctaX = interpolate(frame, [ctaStartFrame, ctaStartFrame + 18], [-20, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />
      <GlassCard layout="wide" accentColor={accentColor}>
        <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 28, padding: "8px 24px" }}>

          {/* Titre */}
          <div style={{
            fontFamily,
            fontWeight: 800,
            fontSize: 32,
            letterSpacing: "0.04em",
            background: "linear-gradient(90deg, #ffffff 0%, #88aaff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}>
            {title}
          </div>

          {/* Ligne séparatrice */}
          <div style={{
            width: interpolate(frame, [20, 40], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) + "%",
            height: 1,
            background: `linear-gradient(90deg, ${accentColor}80, transparent)`,
          }} />

          {/* Items */}
          {items.map((item, i) => {
            const start = itemStartFrame(i);
            const itemOpacity = interpolate(frame, [start, start + 12], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
            });
            const itemX = interpolate(frame, [start, start + 12], [20, 0], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
            });

            // Coche spring
            const checkScale = spring({ frame: Math.max(0, frame - (start + 4)), fps, config: { mass: 0.4, damping: 8, stiffness: 220 }, from: 0, to: 1 });
            const checkOpacity = frame >= start + 4 ? 1 : 0;

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  opacity: itemOpacity,
                  transform: `translateX(${itemX}px)`,
                }}
              >
                {/* Coche */}
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${accentColor}, rgba(136,170,255,0.6))`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  opacity: checkOpacity,
                  transform: `scale(${checkScale})`,
                  boxShadow: `0 0 12px ${accentColor}60`,
                }}>
                  <span style={{ fontSize: 20, color: "#fff", fontWeight: 800 }}>✓</span>
                </div>

                {/* Texte flouté */}
                <div style={{
                  fontFamily,
                  fontWeight: 700,
                  fontSize: 26,
                  color: "rgba(136,170,255,0.9)",
                  letterSpacing: "0.02em",
                  filter: "blur(5px)",
                  userSelect: "none",
                  flexGrow: 1,
                }}>
                  {item}
                </div>
              </div>
            );
          })}

          {/* CTA */}
          <div style={{
            opacity: ctaOpacity,
            transform: `translateX(${ctaX}px)`,
            marginTop: 8,
            fontFamily,
            fontWeight: 700,
            fontSize: 22,
            color: accentColor,
            letterSpacing: "0.06em",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: accentColor,
              boxShadow: `0 0 8px ${accentColor}`,
              animation: "none",
              opacity: 0.6 + 0.4 * Math.abs(Math.sin(frame * 0.18)),
            }} />
            {callToAction}
          </div>

        </div>
      </GlassCard>
    </AbsoluteFill>
  );
};
