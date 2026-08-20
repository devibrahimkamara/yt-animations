import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const partProgressSchema = z.object({
  partLabel: z.string().default("PARTIE 1"),
  partNumber: z.number().default(1),
  totalParts: z.number().default(3),
  durationSecs: z.number().default(60),
});

type PartProgressProps = z.infer<typeof partProgressSchema>;

export const PartProgress: React.FC<PartProgressProps> = ({
  partLabel,
  partNumber,
  totalParts,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: "clamp",
    easing: EASING,
  });

  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const glow = 0.6 + 0.4 * Math.abs(Math.sin(frame * 0.06));

  const SIDE_MARGIN = 80;
  const BAR_HEIGHT = 12;
  const BAR_WIDTH = 1920 - SIDE_MARGIN * 2;
  const BOTTOM_MARGIN = 52;
  const BAR_Y = 1080 - BAR_HEIGHT - BOTTOM_MARGIN;
  const TEXT_Y = BAR_Y - 18 - 40;

  return (
    <div style={{ position: "absolute", inset: 0, background: "transparent", overflow: "hidden" }}>
      {/* Vignette gradient bottom */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 220,
        background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.4) 55%, transparent 100%)",
        opacity: fadeIn,
      }} />

      {/* Label row */}
      <div style={{
        position: "absolute",
        left: SIDE_MARGIN,
        right: SIDE_MARGIN,
        top: TEXT_Y,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        opacity: fadeIn,
      }}>
        {/* Left: glowing dot + part label */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#3060ff",
            flexShrink: 0,
            boxShadow: `0 0 ${10 * glow}px rgba(48,96,255,1), 0 0 ${22 * glow}px rgba(48,96,255,0.55)`,
          }} />
          <span style={{
            fontFamily,
            fontWeight: 800,
            fontSize: 32,
            letterSpacing: "0.14em",
            color: "rgba(255,255,255,0.95)",
            textTransform: "uppercase" as const,
          }}>
            {partLabel}
          </span>
        </div>

        {/* Right: part counter pills */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {Array.from({ length: totalParts }).map((_, i) => (
            <div key={i} style={{
              width: i + 1 === partNumber ? 32 : 10,
              height: 10,
              borderRadius: 5,
              background: i + 1 < partNumber
                ? "rgba(48,96,255,0.9)"
                : i + 1 === partNumber
                ? "#3060ff"
                : "rgba(255,255,255,0.25)",
              boxShadow: i + 1 === partNumber
                ? `0 0 ${10 * glow}px rgba(48,96,255,0.9)`
                : "none",
            }} />
          ))}
        </div>
      </div>

      {/* Bar track */}
      <div style={{
        position: "absolute",
        left: SIDE_MARGIN,
        top: BAR_Y,
        width: BAR_WIDTH,
        height: BAR_HEIGHT,
        borderRadius: BAR_HEIGHT / 2,
        background: "rgba(255,255,255,0.15)",
        opacity: fadeIn,
      }} />

      {/* Bar fill */}
      <div style={{
        position: "absolute",
        left: SIDE_MARGIN,
        top: BAR_Y,
        width: BAR_WIDTH * progress,
        height: BAR_HEIGHT,
        borderRadius: BAR_HEIGHT / 2,
        background: "linear-gradient(to right, #1a3aff, #88aaff)",
        boxShadow: `0 0 ${12 * glow}px rgba(48,96,255,0.8), 0 0 ${26 * glow}px rgba(48,96,255,0.4)`,
        opacity: fadeIn,
      }} />

      {/* Leading edge bright dot */}
      {progress > 0.01 && (
        <div style={{
          position: "absolute",
          left: SIDE_MARGIN + BAR_WIDTH * progress - 8,
          top: BAR_Y - 4,
          width: 16,
          height: BAR_HEIGHT + 8,
          borderRadius: 8,
          background: "rgba(255,255,255,0.95)",
          boxShadow: `0 0 ${14 * glow}px rgba(136,170,255,1), 0 0 ${30 * glow}px rgba(48,96,255,0.8)`,
          opacity: fadeIn,
        }} />
      )}
    </div>
  );
};
