import { AbsoluteFill } from "remotion";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

// Fond opaque plein écran partagé par AtmosAnim09-18 : reprend AuroraBackground
// (signature déjà établie par AtmosAnim01-08) et y ajoute le grain/dot-grid +
// vignette déjà éprouvés dans les compositions les plus récentes du projet
// (GenSparkAnim13ComparisonRace / GenSparkAnim14ChapterCard) pour un rendu plus abouti.
export const AtmosBackground: React.FC = () => (
  <AbsoluteFill>
    <AuroraBackground />
    <AbsoluteFill
      style={{
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}
    />
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse 1600px 900px at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
      }}
    />
  </AbsoluteFill>
);
