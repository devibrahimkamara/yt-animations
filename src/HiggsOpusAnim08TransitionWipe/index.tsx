import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { ACCENT } from "../higgsOpus/theme";

// Anim 8 — « Transition finale : On est parti » (36 frames / 1,2 s @ 30 fps)
// Phase 1 entrée du wipe 0–15 · Phase 2 couverture complète ~15 · Phase 3 sortie 20–36

export const higgsOpusAnim08Schema = z.object({});
export type HiggsOpusAnim08Props = z.infer<typeof higgsOpusAnim08Schema>;

export const HiggsOpusAnim08TransitionWipe: React.FC<HiggsOpusAnim08Props> = () => {
  const frame = useCurrentFrame();

  const enterX = interpolate(frame, [0, 15], [-1920 * 1.3, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const exitX = interpolate(frame, [20, 36], [0, 1920 * 1.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const x = frame < 20 ? enterX : exitX;

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      <div
        style={{
          position: "absolute",
          top: -200,
          left: 0,
          width: "130%",
          height: "150%",
          background: `linear-gradient(100deg, transparent, ${ACCENT} 15%, ${ACCENT} 85%, transparent)`,
          transform: `rotate(18deg) translateX(${x}px)`,
        }}
      />
    </AbsoluteFill>
  );
};
