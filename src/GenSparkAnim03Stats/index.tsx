import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

export const GenSparkAnim03Stats: React.FC = () => {
  const frame = useCurrentFrame();

  const counterValue = Math.round(
    interpolate(frame, [15, 90], [0, 250], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.13, 0.62, 0.23, 0.98),
    })
  );

  const barProgress = interpolate(frame, [15, 90], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.13, 0.62, 0.23, 0.98),
  });

  const punchScale =
    frame >= 90
      ? interpolate(frame, [90, 96, 104], [1, 1.08, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  // White glow on arrival (no blue-on-blue)
  const glowOpacity = interpolate(frame, [90, 97, 108], [0, 0.35, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const labelTopOpacity = interpolate(frame, [10, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelTopY = interpolate(frame, [10, 22], [-16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const labelBottomOpacity = interpolate(frame, [95, 112], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelBottomY = interpolate(frame, [95, 112], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Decorative lines appear with the counter
  const lineOpacity = interpolate(frame, [12, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AuroraBackground />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 44,
        }}
      >
        {/* "En seulement 12 mois" */}
        <div
          style={{
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontSize: 52,
            fontWeight: 700,
            color: "rgba(255,255,255,0.75)",
            letterSpacing: "3px",
            textTransform: "uppercase",
            opacity: labelTopOpacity,
            transform: `translateY(${labelTopY}px)`,
          }}
        >
          En seulement 12 mois
        </div>

        {/* Decorative line above counter */}
        <div
          style={{
            width: 1100,
            height: 1,
            background: "rgba(255,255,255,0.15)",
            opacity: lineOpacity,
            marginBottom: -20,
          }}
        />

        {/* Counter */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* White glow halo */}
          <div
            style={{
              position: "absolute",
              inset: -80,
              background: `radial-gradient(circle, rgba(255,255,255,${glowOpacity}) 0%, transparent 65%)`,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontSize: 180,
              fontWeight: 800,
              color: "#ffffff",
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-6px",
              lineHeight: 1,
              transform: `scale(${punchScale})`,
            }}
          >
            ${counterValue}M
          </div>
        </div>

        {/* Decorative line below counter */}
        <div
          style={{
            width: 1100,
            height: 1,
            background: "rgba(255,255,255,0.15)",
            opacity: lineOpacity,
            marginTop: -20,
          }}
        />

        {/* Progress bar */}
        <div
          style={{
            width: 1100,
            height: 20,
            borderRadius: 10,
            background: "rgba(255,255,255,0.1)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${barProgress}%`,
              borderRadius: 10,
              background: "linear-gradient(90deg, #60a5fa, #34d399)",
            }}
          />
        </div>

        {/* "de chiffre d'affaires" */}
        <div
          style={{
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontSize: 44,
            fontWeight: 600,
            color: "rgba(255,255,255,0.75)",
            opacity: labelBottomOpacity,
            transform: `translateY(${labelBottomY}px)`,
          }}
        >
          de chiffre d'affaires
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
