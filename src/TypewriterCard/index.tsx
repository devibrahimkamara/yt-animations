import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";
import { GlassCard } from "../GlassMotionCard/GlassCard";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const typewriterCardSchema = z.object({
  prompt: z.string(),
  label: z.string().default("Prompt IA"),
  cursorColor: z.string().default("#88aaff"),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(4),
});

export type TypewriterCardProps = z.infer<typeof typewriterCardSchema>;

export const TypewriterCard: React.FC<TypewriterCardProps> = ({
  prompt,
  label,
  cursorColor,
  accentColor,
  durationSecs,
}) => {
  const frame = useCurrentFrame();
  const totalFrames = durationSecs * 30;

  const labelOpacity = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASING,
  });

  const typeStart = 18;
  const typeEnd = Math.round(totalFrames * 0.8);
  const charsVisible = Math.floor(
    interpolate(frame, [typeStart, typeEnd], [0, prompt.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const visibleText = prompt.slice(0, charsVisible);

  // Curseur clignotant toutes les 8 frames
  const cursorVisible = Math.round(frame / 8) % 2 === 0;

  const promptOpacity = interpolate(frame, [typeStart - 5, typeStart + 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />
      <GlassCard layout="wide" accentColor={accentColor}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%" }}>

          {/* Puce label */}
          <div style={{ opacity: labelOpacity, display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: accentColor,
                boxShadow: `0 0 12px ${accentColor}`,
              }}
            />
            <span
              style={{
                fontFamily,
                fontWeight: 600,
                fontSize: 22,
                color: "rgba(136,170,255,0.9)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {label}
            </span>
          </div>

          {/* Texte tapé + curseur */}
          <div style={{ opacity: promptOpacity, display: "flex", alignItems: "center", minHeight: 80 }}>
            <span
              style={{
                fontFamily,
                fontWeight: 700,
                fontSize: 52,
                color: "#ffffff",
                lineHeight: 1.25,
                letterSpacing: "-0.01em",
              }}
            >
              {visibleText}
            </span>
            <span
              style={{
                display: "inline-block",
                width: 3,
                height: 56,
                background: cursorColor,
                marginLeft: 4,
                borderRadius: 2,
                opacity: cursorVisible ? 1 : 0,
                boxShadow: `0 0 10px ${cursorColor}`,
                verticalAlign: "middle",
              }}
            />
          </div>

        </div>
      </GlassCard>
    </AbsoluteFill>
  );
};
