import { useCurrentFrame } from "remotion";
import { ACCENT } from "./theme";

// Fine ligne d'égaliseur audio qui pulse en continu (Anim 4).
// Mouvement de vague organique, non synchronisé entre les barres.
export const WaveBars: React.FC<{
  width: number;
  barCount?: number;
  maxHeight?: number;
  amplitude?: number;
  color?: string;
}> = ({ width, barCount = 64, maxHeight = 120, amplitude = 1, color = ACCENT }) => {
  const frame = useCurrentFrame();
  const gap = 6;
  const barWidth = (width - gap * (barCount - 1)) / barCount;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap,
        width,
        height: maxHeight,
      }}
    >
      {Array.from({ length: barCount }).map((_, i) => {
        const phase = i * 0.5;
        const ratio = Math.abs(
          0.45 * Math.sin(frame * 0.15 + phase) +
            0.3 * Math.sin(frame * 0.09 + phase * 1.6 + 1) +
            0.25 * Math.sin(frame * 0.21 + phase * 0.7 + 2),
        );
        const h = Math.max(4, ratio * maxHeight * amplitude);
        return (
          <div
            key={i}
            style={{
              width: barWidth,
              height: h,
              borderRadius: barWidth / 2,
              background: color,
              opacity: 0.7,
            }}
          />
        );
      })}
    </div>
  );
};
