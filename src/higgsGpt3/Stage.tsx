import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AtmosBackground } from "../AtmosOverlay/AtmosBackground";

// Scène commune aux 7 animations higgsGpt3 : fond aurora + dot-grid +
// vignette (AtmosBackground) et fondu de sortie global sur les `outFrames`
// dernières frames — même pattern que higgsGpt2/Stage.tsx.
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
