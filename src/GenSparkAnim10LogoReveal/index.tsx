import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";
import { GensparkLogo } from "../components/GensparkLogo";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700", "800"],
  subsets: ["latin"],
});

// 8 ambient particles
const PARTICLES = [
  { x: 820, y: 490, size: 4,  phase: 0,  period: 70, ampX: 12, ampY: 8  },
  { x: 1080, y: 510, size: 3, phase: 15, period: 80, ampX: 10, ampY: 14 },
  { x: 900,  y: 580, size: 5, phase: 30, period: 65, ampX: 15, ampY: 10 },
  { x: 1040, y: 480, size: 3, phase: 8,  period: 90, ampX: 8,  ampY: 12 },
  { x: 860,  y: 540, size: 4, phase: 22, period: 75, ampX: 14, ampY: 9  },
  { x: 1100, y: 560, size: 3, phase: 40, period: 68, ampX: 11, ampY: 15 },
  { x: 950,  y: 460, size: 5, phase: 5,  period: 85, ampX: 9,  ampY: 11 },
  { x: 1010, y: 600, size: 3, phase: 35, period: 72, ampX: 13, ampY: 7  },
];

export const GenSparkAnim10LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();

  // Phase 1 — Outer glow (0→33)
  const outerGlowOpacity = interpolate(frame, [0, 33], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const outerGlowScale = interpolate(frame, [0, 33], [0.3, 1.0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 2 — Inner glow (18→42)
  const innerGlowOpacity = interpolate(frame, [18, 42], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const innerGlowScale = interpolate(frame, [18, 42], [0.2, 1.0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 3 — Text (28→64)
  const textOpacity = interpolate(frame, [28, 52], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textScale = interpolate(frame, [28, 64], [0.82, 1.0], {
    easing: Easing.out(Easing.back(1.3)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textBlur = interpolate(frame, [28, 58], [12, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 4 — Flash (50→62)
  const flashOpacity = interpolate(frame, [50, 54, 62], [0, 0.25, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 5 — Tagline (61→83)
  const taglineOpacity = interpolate(frame, [61, 80], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineTranslateY = interpolate(frame, [61, 80], [12, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineLetterSpacing = interpolate(frame, [61, 83], [10, 4], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 6 — Accent line (78→100)
  const accentLineWidth = interpolate(frame, [78, 100], [0, 280], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const accentLineOpacity = interpolate(frame, [78, 90], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 7 — Breathing glow (90→150)
  const breathScale = interpolate(frame, [90, 108, 126, 144], [1.0, 1.12, 1.0, 1.12], {
    easing: Easing.inOut(Easing.sin),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const breathOpacityMult = interpolate(frame, [90, 108, 126, 144], [1.0, 1.2, 1.0, 1.2], {
    easing: Easing.inOut(Easing.sin),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000000" }}>
      <AuroraBackground />

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 1600px 900px at center, transparent 60%, rgba(0,0,0,0.5) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Particles */}
      {PARTICLES.map((p, i) => {
        const offsetX = p.ampX * Math.sin(((frame + p.phase) / p.period) * 2 * Math.PI);
        const offsetY = p.ampY * Math.cos(((frame + p.phase) / p.period) * 2 * Math.PI);
        const pOpacity = interpolate(frame, [18 + i * 2, 36 + i * 2], [0, 0.7], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x + offsetX - p.size / 2,
              top: p.y + offsetY - p.size / 2,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: i % 2 === 0 ? "rgba(48,96,255,0.6)" : "rgba(136,170,255,0.5)",
              opacity: pOpacity,
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* Outer halo */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${outerGlowScale})`,
          width: 900,
          height: 400,
          background:
            "radial-gradient(ellipse 900px 400px at center, rgba(48,96,255,0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
          opacity: outerGlowOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Inner halo */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${innerGlowScale * breathScale})`,
          width: 500,
          height: 200,
          background:
            "radial-gradient(ellipse 500px 200px at center, rgba(136,170,255,0.30) 0%, transparent 65%)",
          filter: "blur(20px)",
          opacity: Math.min(innerGlowOpacity * breathOpacityMult, 1),
          pointerEvents: "none",
        }}
      />

      {/* Flash */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 900,
          height: 400,
          background: "#FFFFFF",
          opacity: flashOpacity,
          borderRadius: "50%",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Text block */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${textScale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: textOpacity,
          filter: `blur(${textBlur}px)`,
        }}
      >
        <GensparkLogo height={170} fontFamily={fontFamily} />

        {/* Tagline */}
        <div
          style={{
            fontFamily,
            fontWeight: 400,
            fontSize: 46,
            color: "rgba(255,255,255,0.45)",
            letterSpacing: `${taglineLetterSpacing}px`,
            textTransform: "uppercase",
            marginTop: 52,
            opacity: taglineOpacity,
            transform: `translateY(${taglineTranslateY}px)`,
          }}
        >
          Intelligence Artificielle · Tout-en-un
        </div>

        {/* Accent line */}
        <div
          style={{
            marginTop: 14,
            width: accentLineWidth,
            height: 4,
            background: "linear-gradient(to right, #3060ff, #88aaff, #3060ff)",
            borderRadius: 2,
            opacity: accentLineOpacity,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
