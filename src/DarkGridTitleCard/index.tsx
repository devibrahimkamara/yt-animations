import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const darkGridTitleCardSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  footer: z.string().optional(),
  durationSecs: z.number().default(5),
  accentColor: z.string().default("#3060ff"),
  fontKey: z.string().default("jakarta"),
});

export type DarkGridTitleCardProps = z.infer<typeof darkGridTitleCardSchema>;

function useSlideUp(startFrame: number, durationFrames = 45) {
  const frame = useCurrentFrame();
  const progress = frame - startFrame;
  const opacity = interpolate(progress, [0, durationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASING,
  });
  const translateY = interpolate(progress, [0, durationFrames], [50, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASING,
  });
  return { opacity, transform: `translateY(${translateY}px)` };
}

export const DarkGridTitleCard: React.FC<DarkGridTitleCardProps> = ({
  title,
  subtitle,
  footer,
  accentColor,
}) => {
  const { fps } = useVideoConfig();
  const titleStyle = useSlideUp(0, Math.round(fps * 1.5));
  const subtitleStyle = useSlideUp(20, Math.round(fps * 1.2));
  const footerStyle = useSlideUp(35, Math.round(fps * 1.0));

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />

      {/* Ligne de séparation décorative */}
      <AbsoluteFill style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          width: 2,
          height: "40%",
          background: `linear-gradient(180deg, transparent 0%, ${accentColor}60 50%, transparent 100%)`,
          position: "absolute",
          left: 140,
        }} />
        <div style={{
          width: 2,
          height: "40%",
          background: `linear-gradient(180deg, transparent 0%, ${accentColor}60 50%, transparent 100%)`,
          position: "absolute",
          right: 140,
        }} />
      </AbsoluteFill>

      {/* Contenu texte centré */}
      <AbsoluteFill style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
        gap: 28,
      }}>

        {/* Titre principal */}
        <div style={{
          ...titleStyle,
          fontFamily,
          fontWeight: 800,
          fontSize: title.length > 35 ? 130 : title.length > 20 ? 160 : 200,
          letterSpacing: "-0.02em",
          textAlign: "center",
          lineHeight: 1.1,
          background: "linear-gradient(180deg, #ffffff 0%, #88aaff 70%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: `drop-shadow(0 0 40px ${accentColor}50)`,
        }}>
          {title}
        </div>

        {/* Sous-titre */}
        {subtitle && (
          <Sequence from={20} layout="none">
            <div style={{
              ...subtitleStyle,
              fontFamily,
              fontWeight: 600,
              fontSize: 40,
              color: "rgba(136,170,255,0.85)",
              letterSpacing: "0.08em",
              textAlign: "center",
              textTransform: "uppercase",
            }}>
              {subtitle}
            </div>
          </Sequence>
        )}

        {/* Footer */}
        {footer && (
          <Sequence from={35} layout="none">
            <div style={{
              ...footerStyle,
              position: "absolute",
              bottom: 52,
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily,
              fontWeight: 600,
              fontSize: 22,
              color: "rgba(136,170,255,0.5)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}>
              {footer}
            </div>
          </Sequence>
        )}

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
