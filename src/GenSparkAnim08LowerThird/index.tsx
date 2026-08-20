import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const GenSparkAnim08LowerThird: React.FC = () => {
  const frame = useCurrentFrame();

  // Phase 1 — Band entrance (0→30) — was 0→22, slowed +15f
  const translateX = interpolate(frame, [0, 30, 140, 160], [-80, 0, 0, -100], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bandOpacity = interpolate(frame, [0, 24, 140, 158], [0, 1, 1, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bandScaleY = interpolate(frame, [0, 28], [0.85, 1.0], {
    easing: Easing.out(Easing.back(1.2)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 2 — Accent bar (15→38) — was 10→28
  const barHeight = interpolate(frame, [15, 38], [0, 90], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barOpacity = interpolate(frame, [15, 28], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 3 — Name (30→52) — was 20→36
  const nameOpacity = interpolate(frame, [30, 50], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const nameTranslateY = interpolate(frame, [30, 50], [10, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 4 — Separator line (44→62) — was 28→42
  const lineWidth = interpolate(frame, [44, 62], [0, 640], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lineOpacity = interpolate(frame, [46, 56], [0, 0.8], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 5 — Subtitle (58→78) — was 42→58
  const titleOpacity = interpolate(frame, [58, 76], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleTranslateY = interpolate(frame, [58, 76], [8, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 6 — Badge (72→90) — was 54→68
  const badgeScale = interpolate(frame, [72, 90], [0.7, 1.0], {
    easing: Easing.out(Easing.back(1.8)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const badgeOpacity = interpolate(frame, [72, 86], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Preview background — transparent in final render */}
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.4)", pointerEvents: "none" }} />

      {/* Band */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 820,
          width: 820,
          height: 150,
          opacity: bandOpacity,
          transform: `translateX(${translateX}px) scaleY(${bandScaleY})`,
          transformOrigin: "left center",
        }}
      >
        {/* Band background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(10, 10, 15, 0.88)",
            borderRadius: 14,
          }}
        />

        {/* Accent bar */}
        <div
          style={{
            position: "absolute",
            left: 22,
            top: 24,
            width: 6,
            height: barHeight,
            background: "linear-gradient(to bottom, #3060ff, #88aaff)",
            borderRadius: 3,
            opacity: barOpacity,
          }}
        />

        {/* Separator line */}
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 84,
            width: lineWidth,
            height: 1.5,
            background: "linear-gradient(to right, #3060ff, rgba(48,96,255,0))",
            opacity: lineOpacity,
          }}
        />

        {/* Name */}
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 22,
            fontFamily,
            fontWeight: 700,
            fontSize: 60,
            color: "#FFFFFF",
            opacity: nameOpacity,
            transform: `translateY(${nameTranslateY}px)`,
            whiteSpace: "nowrap",
          }}
        >
          Ibrahim Camara
        </div>

        {/* Subtitle */}
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 96,
            fontFamily,
            fontWeight: 500,
            fontSize: 32,
            color: "rgba(255,255,255,0.60)",
            opacity: titleOpacity,
            transform: `translateY(${titleTranslateY}px)`,
            whiteSpace: "nowrap",
          }}
        >
          Business & Créateur de contenu · Depuis 2020
        </div>

        {/* Badge */}
        <div
          style={{
            position: "absolute",
            right: 28,
            top: 55,
            width: 90,
            height: 32,
            background: "rgba(48,96,255,0.25)",
            border: "1px solid rgba(48,96,255,0.5)",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: badgeOpacity,
            transform: `scale(${badgeScale})`,
          }}
        >
          <span
            style={{
              fontFamily,
              fontWeight: 600,
              fontSize: 24,
              color: "#88aaff",
            }}
          >
            YouTube
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
