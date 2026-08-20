import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";
import { GlassCard } from "../GlassMotionCard/GlassCard";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const starReviewsSchema = z.object({
  rating: z.number().min(1).max(5).default(5),
  reviewCount: z.number().default(336),
  label: z.string().default("Avis clients"),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(4),
});

export type StarReviewsProps = z.infer<typeof starReviewsSchema>;

const Star: React.FC<{ filled: boolean; index: number; frame: number }> = ({ filled, index, frame }) => {
  const startFrame = 15 + index * 6;
  const opacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });
  const translateY = interpolate(frame, [startFrame, startFrame + 12], [-60, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });
  const scale = interpolate(frame, [startFrame, startFrame + 8, startFrame + 12], [0.5, 1.15, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <svg
      width={72}
      height={72}
      viewBox="0 0 24 24"
      style={{ opacity, transform: `translateY(${translateY}px) scale(${scale})` }}
    >
      <polygon
        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
        fill={filled ? "#FFD700" : "rgba(255,255,255,0.15)"}
        stroke={filled ? "#FFB800" : "rgba(255,255,255,0.1)"}
        strokeWidth={0.5}
        style={{
          filter: filled ? "drop-shadow(0 0 8px #FFD70080)" : "none",
        }}
      />
    </svg>
  );
};

export const StarReviews: React.FC<StarReviewsProps> = ({
  rating,
  reviewCount,
  label,
  accentColor,
  durationSecs,
}) => {
  const frame = useCurrentFrame();

  const labelOpacity = interpolate(frame, [5, 18], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });

  // CountUp pour le nombre d'avis
  const countStart = 50;
  const countEnd = 80;
  const displayCount = Math.floor(
    interpolate(frame, [countStart, countEnd], [0, reviewCount], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
    })
  );
  const countOpacity = interpolate(frame, [countStart - 5, countStart + 10], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />
      <GlassCard layout="default" accentColor={accentColor}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", gap: 28 }}>

          {/* Label */}
          <div style={{ opacity: labelOpacity, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: accentColor, boxShadow: `0 0 12px ${accentColor}` }} />
            <span style={{ fontFamily, fontWeight: 600, fontSize: 22, color: "rgba(136,170,255,0.9)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {label}
            </span>
          </div>

          {/* Étoiles */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} filled={i < rating} index={i} frame={frame} />
            ))}
          </div>

          {/* Nombre d'avis */}
          <div style={{ opacity: countOpacity, display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{
              fontFamily, fontWeight: 800, fontSize: 80,
              background: "linear-gradient(180deg, #FFD700 0%, #ffffff 60%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 20px rgba(255,215,0,0.5))",
            }}>
              {displayCount.toLocaleString()}
            </span>
            <span style={{ fontFamily, fontWeight: 600, fontSize: 28, color: "rgba(136,170,255,0.8)" }}>
              avis
            </span>
          </div>

        </div>
      </GlassCard>
    </AbsoluteFill>
  );
};
