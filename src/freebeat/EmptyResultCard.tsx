import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CARD_GREY, NEUTRAL_BORDER } from "./theme";

// Carte de résultat vide (Anim 3) : contour gris, fond très légèrement plus
// clair que la scène, petite icône « aucun résultat » (rond barré).
export const EmptyResultCard: React.FC<{
  delay: number;
  width: number;
  height: number;
}> = ({ delay, width, height }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 180 } });
  const y = interpolate(s, [0, 1], [15, 0], { extrapolateRight: "clamp" });
  const iconSize = Math.min(width, height) * 0.42;

  return (
    <div
      style={{
        width,
        height,
        opacity: s,
        transform: `translateY(${y}px)`,
        background: CARD_GREY,
        border: `3px solid ${NEUTRAL_BORDER}`,
        borderRadius: 26,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" fill="none" stroke="#8E8E93" strokeWidth="2" />
        <line x1="6" y1="6" x2="18" y2="18" stroke="#8E8E93" strokeWidth="2" />
      </svg>
    </div>
  );
};
