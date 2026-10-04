import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AtmosBackground } from "../AtmosOverlay/AtmosBackground";

// Même Stage que higgs2 (fond aurora + fondu de sortie), mais `outFrames={0}`
// = aucune sortie animée (coupe franche). Le Stage higgs2 plante avec 0
// (inputRange [d, d-1] non monotone avec ce Remotion).
export const Stage: React.FC<{
  children: React.ReactNode;
  outFrames?: number;
  bare?: boolean;
  background?: string;
}> = ({ children, outFrames = 12, bare = false, background }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity =
    outFrames <= 0
      ? 1
      : interpolate(frame, [durationInFrames - outFrames - 1, durationInFrames - 1], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  return (
    <AbsoluteFill style={{ opacity, background }}>
      {!bare && <AtmosBackground />}
      {children}
    </AbsoluteFill>
  );
};
