import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "800"],
  subsets: ["latin"],
});

export const GenSparkAnim14ChapterCard: React.FC = () => {
  const frame = useCurrentFrame();

  // Halo (0→30)
  const haloOpacity = interpolate(frame, [0, 30], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Split masks (5→60) — slowed from 5→45
  const topMaskTranslateY = interpolate(frame, [5, 60], [0, -540], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bottomMaskTranslateY = interpolate(frame, [5, 60], [0, 540], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Split line (5→63)
  const splitLineOpacity = interpolate(frame, [5, 14, 55, 63], [0, 1.0, 1.0, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const splitLineScaleX = interpolate(frame, [5, 22], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pre-label ÉTAPE (33→50) — was 18→32, +15f
  const preLabelOpacity = interpolate(frame, [33, 50], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const preLabelTranslateY = interpolate(frame, [33, 50], [8, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Number "01" (37→70) — was 22→48, +15f
  const numberScale = interpolate(frame, [37, 70], [0.78, 1.0], {
    easing: Easing.out(Easing.back(1.2)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const numberOpacity = interpolate(frame, [37, 57], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const numberBlur = interpolate(frame, [37, 60], [8, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Shimmer on "1" (65→90) — was 50→70
  const shimmerProgress = interpolate(frame, [65, 90], [0, 1], {
    easing: Easing.inOut(Easing.sin),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shimmerY = interpolate(shimmerProgress, [0, 1], [-100, 150]);

  // Title (55→78) — was 40→56, +15f
  const titleOpacity = interpolate(frame, [55, 75], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleTranslateY = interpolate(frame, [55, 75], [14, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtitle (65→85) — was 48→64, +17f
  const subTitleOpacity = interpolate(frame, [65, 83], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subTitleTranslateY = interpolate(frame, [65, 83], [12, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Accent line (72→92) — was 52→68, +20f
  const accentWidth = interpolate(frame, [72, 92], [0, 320], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const accentOpacity = interpolate(frame, [72, 82], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Corner label (45→62) — was 30→45, +15f
  const cornerLabelOpacity = interpolate(frame, [45, 62], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Global exit (132→150) — was 72→88, hold extended to 150f
  const globalFadeOut = interpolate(frame, [132, 150], [1, 0], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitScale = interpolate(frame, [132, 150], [1.0, 0.96], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000000" }}>
      <AuroraBackground />

      {/* Grid */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      {/* Central halo */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 1000px 500px at 960px 540px, rgba(48,96,255,0.12) 0%, transparent 70%)`,
          opacity: haloOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: globalFadeOut,
          transform: `scale(${exitScale})`,
          transformOrigin: "center center",
        }}
      >
        {/* Corner label */}
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 50,
            fontFamily,
            fontWeight: 400,
            fontSize: 28,
            color: "rgba(255,255,255,0.20)",
            letterSpacing: "3px",
            opacity: cornerLabelOpacity,
          }}
        >
          01 / 04
        </div>

        {/* Pre-label */}
        <div
          style={{
            position: "absolute",
            top: 295,
            left: "50%",
            transform: `translateX(-50%) translateY(${preLabelTranslateY}px)`,
            opacity: preLabelOpacity,
            fontFamily,
            fontWeight: 600,
            fontSize: 36,
            color: "rgba(48,96,255,0.90)",
            letterSpacing: "8px",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          ÉTAPE
        </div>

        {/* Light texture behind number */}
        <div
          style={{
            position: "absolute",
            top: 370,
            left: "50%",
            transform: "translateX(-50%)",
            width: 400,
            height: 250,
            background:
              "radial-gradient(ellipse 400px 250px at center, rgba(255,255,255,0.06) 0%, transparent 70%)",
            filter: "blur(30px)",
            pointerEvents: "none",
          }}
        />

        {/* Number "01" */}
        <div
          style={{
            position: "absolute",
            top: 315,
            left: "50%",
            transform: `translateX(-50%) scale(${numberScale})`,
            transformOrigin: "center top",
            opacity: numberOpacity,
            filter: `blur(${numberBlur}px)`,
            fontFamily,
            fontWeight: 800,
            fontSize: 240,
            lineHeight: 1,
            letterSpacing: "-8px",
            display: "flex",
          }}
        >
          <span
            style={{
              background: "linear-gradient(to bottom, #FFFFFF 0%, rgba(255,255,255,0.75) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            0
          </span>
          <span
            style={{
              position: "relative",
              overflow: "hidden",
              display: "inline-block",
              background: "linear-gradient(to bottom, #3060ff 0%, #88aaff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            1
            <span
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                transform: `translateY(${shimmerY}%)`,
                pointerEvents: "none",
              }}
            />
          </span>
        </div>

        {/* Step title */}
        <div
          style={{
            position: "absolute",
            top: 622,
            left: "50%",
            transform: `translateX(-50%) translateY(${titleTranslateY}px)`,
            opacity: titleOpacity,
            fontFamily,
            fontWeight: 600,
            fontSize: 72,
            color: "#FFFFFF",
            whiteSpace: "nowrap",
          }}
        >
          Trouver une idée rentable
        </div>

        {/* Subtitle */}
        <div
          style={{
            position: "absolute",
            top: 706,
            left: "50%",
            transform: `translateX(-50%) translateY(${subTitleTranslateY}px)`,
            opacity: subTitleOpacity,
            fontFamily,
            fontWeight: 400,
            fontSize: 44,
            color: "rgba(255,255,255,0.45)",
            whiteSpace: "nowrap",
          }}
        >
          Identifier le bon business à lancer avec l'IA
        </div>

        {/* Accent line */}
        <div
          style={{
            position: "absolute",
            top: 768,
            left: "50%",
            transform: "translateX(-50%)",
            width: accentWidth,
            height: 4,
            background: "linear-gradient(to right, #3060ff, #88aaff)",
            borderRadius: 2,
            opacity: accentOpacity,
          }}
        />
      </div>

      {/* Split line */}
      <div
        style={{
          position: "absolute",
          top: 540,
          left: 0,
          width: 1920,
          height: 2,
          background:
            "linear-gradient(to right, transparent, rgba(48,96,255,0.8) 30%, rgba(136,170,255,0.9) 50%, rgba(48,96,255,0.8) 70%, transparent)",
          filter: "blur(1px)",
          opacity: splitLineOpacity,
          transform: `scaleX(${splitLineScaleX})`,
          transformOrigin: "center",
          pointerEvents: "none",
        }}
      />

      {/* Top mask */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1920,
          height: 540,
          background: "#0E0E16",
          transform: `translateY(${topMaskTranslateY}px)`,
          boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 2px 0px rgba(48,96,255,0.3)",
        }}
      />

      {/* Bottom mask */}
      <div
        style={{
          position: "absolute",
          top: 540,
          left: 0,
          width: 1920,
          height: 540,
          background: "#0E0E16",
          transform: `translateY(${bottomMaskTranslateY}px)`,
          boxShadow: "0 -8px 40px rgba(0,0,0,0.6), 0 -2px 0px rgba(48,96,255,0.3)",
        }}
      />

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 1600px 900px at center, transparent 55%, rgba(0,0,0,0.60) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
