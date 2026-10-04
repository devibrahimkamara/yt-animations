import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AtmosBackground } from "../AtmosOverlay/AtmosBackground";

// Scène commune aux 10 animations higgs2 : fond aurora + dot-grid + vignette
// (AtmosBackground) et fondu de sortie global sur les `outFrames` dernières frames.
// Option `bare` pour les compos qui fournissent leur propre fond (Anim 8).
export const Stage: React.FC<{
  children: React.ReactNode;
  outFrames?: number;
  bare?: boolean;
  background?: string;
}> = ({ children, outFrames = 12, bare = false, background }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [durationInFrames - outFrames, durationInFrames - 1],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ opacity, background }}>
      {!bare && <AtmosBackground />}
      {children}
    </AbsoluteFill>
  );
};
