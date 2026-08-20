import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";
import { GensparkIcon } from "../components/GensparkLogo";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "700", "800"],
  subsets: ["latin"],
});

const CIRCUMFERENCE = 2 * Math.PI * 280;
const ARC_LENGTH = CIRCUMFERENCE * 0.75;

const BURSTS = [
  { dx: 0,    dy: -120, size: 6 },
  { dx: 85,   dy: -85,  size: 4 },
  { dx: 120,  dy: 0,    size: 5 },
  { dx: 85,   dy: 85,   size: 4 },
  { dx: 0,    dy: 120,  size: 6 },
  { dx: -85,  dy: 85,   size: 4 },
  { dx: -120, dy: 0,    size: 5 },
  { dx: -85,  dy: -85,  size: 4 },
];

function getCounterValue(frame: number): number {
  const phaseAProgress = interpolate(frame, [8, 40], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const phaseBProgress = interpolate(frame, [40, 85], [0, 1], {
    easing: Easing.in(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Phase C stretched from [85,130] to [85,145] — 60f deceleration
  const phaseCProgress = interpolate(frame, [85, 145], [0, 1], {
    easing: Easing.out(Easing.poly(4)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    phaseAProgress * 5_000_000 +
    phaseBProgress * 195_000_000 +
    phaseCProgress * 50_000_000
  );
}

export const GenSparkAnim12Counter250M: React.FC = () => {
  const frame = useCurrentFrame();

  const counterValue = Math.min(getCounterValue(frame), 250_000_000);
  const prevValue = Math.min(getCounterValue(Math.max(0, frame - 1)), 250_000_000);
  const deltaPerFrame = counterValue - prevValue;
  const deltaPerSecond = deltaPerFrame * 30;
  const speedText =
    frame < 145 && frame > 30
      ? `+${(deltaPerSecond / 1_000_000).toFixed(1)} M$/s`
      : "";

  const formattedValue = Math.floor(counterValue).toLocaleString("fr-FR").replace(/\s/g, " ");

  const surTextOpacity = interpolate(frame, [0, 22], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const surTextTranslateY = interpolate(frame, [0, 22], [8, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const speedBlur = interpolate(frame, [40, 62, 85], [0, 3, 0], {
    easing: Easing.inOut(Easing.sin),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // tensionScale updated to match new phase C range [85,145]
  const tensionScale = interpolate(frame, [85, 145], [1.0, 1.04], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const goldProgress = interpolate(frame, [128, 148], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gVal = Math.round(interpolate(goldProgress, [0, 1], [255, 215]));
  const bVal = Math.round(interpolate(goldProgress, [0, 1], [255, 0]));
  const counterColor = `rgb(255, ${gVal}, ${bVal})`;

  const subTextOpacity = interpolate(frame, [100, 122], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subTextTranslateY = interpolate(frame, [100, 122], [12, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const badgeScale = interpolate(frame, [108, 128], [0.7, 1.0], {
    easing: Easing.out(Easing.back(2.0)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const badgeOpacity = interpolate(frame, [108, 120], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const arcOpacity = interpolate(frame, [5, 22], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const counterProgress = counterValue / 250_000_000;
  const currentDashOffset = ARC_LENGTH * (1 - counterProgress);

  // Impact effects shifted to align with new phase C end (145)
  const impactFlashOpacity = interpolate(frame, [142, 146, 158], [0, 0.18, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const finalGlowOpacity = interpolate(frame, [142, 155, 170], [0, 0.6, 0.3], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const burstProgress = interpolate(frame, [142, 162], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const particleOpacityRaw = interpolate(frame, [142, 148, 162], [0, 0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const particleScale = interpolate(frame, [142, 146, 162], [0, 1.0, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bgGlowIntensity = interpolate(frame, [128, 148], [0.06, 0.12], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const speedOpacity = interpolate(frame, [30, 38], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000000" }}>
      <AuroraBackground />

      {/* Gold bg glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 1100px 600px at 960px 500px, rgba(255,215,0,${bgGlowIntensity}) 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 1600px 900px at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Arc SVG */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        viewBox="0 0 1920 1080"
      >
        <defs>
          <linearGradient id="arcGrad" gradientUnits="userSpaceOnUse" x1="680" y1="780" x2="1240" y2="220">
            <stop offset="0%" stopColor="#3060ff" />
            <stop offset="50%" stopColor="#88aaff" />
            <stop offset="100%" stopColor="#FFD700" />
          </linearGradient>
        </defs>

        {/* Rail */}
        <circle
          cx="960" cy="500" r="280"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="4"
          strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE - ARC_LENGTH}`}
          strokeDashoffset={0}
          transform="rotate(-225, 960, 500)"
          opacity={arcOpacity}
        />
        {/* Progress arc */}
        <circle
          cx="960" cy="500" r="280"
          fill="none"
          stroke="url(#arcGrad)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE - ARC_LENGTH}`}
          strokeDashoffset={currentDashOffset}
          transform="rotate(-225, 960, 500)"
          opacity={arcOpacity}
        />

        {/* Burst particles */}
        {frame >= 142 &&
          BURSTS.map((b, i) => (
            <circle
              key={i}
              cx={960 + b.dx * burstProgress}
              cy={500 + b.dy * burstProgress}
              r={b.size * particleScale}
              fill="#FFD700"
              opacity={particleOpacityRaw}
            />
          ))}
      </svg>

      {/* Flash */}
      <AbsoluteFill
        style={{ background: "#FFFFFF", opacity: impactFlashOpacity, pointerEvents: "none" }}
      />

      {/* Surtexte */}
      <div
        style={{
          position: "absolute",
          top: 260,
          left: "50%",
          transform: `translateX(-50%) translateY(${surTextTranslateY}px)`,
          opacity: surTextOpacity,
          display: "flex",
          alignItems: "center",
          gap: 18,
          whiteSpace: "nowrap",
        }}
      >
        <GensparkIcon size={52} />
        <span
          style={{
            fontFamily,
            fontWeight: 500,
            fontSize: 52,
            color: "rgba(255,255,255,0.50)",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          Genspark a atteint
        </span>
      </div>

      {/* Counter block */}
      <div
        style={{
          position: "absolute",
          top: 370,
          left: "50%",
          transform: `translateX(-50%) scale(${tensionScale})`,
          display: "flex",
          alignItems: "baseline",
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize: 110,
            color: "#FFD700",
            position: "relative",
            top: -24,
            marginRight: 10,
          }}
        >
          $
        </span>
        <span
          style={{
            fontFamily,
            fontWeight: 800,
            fontSize: 148,
            color: counterColor,
            letterSpacing: "-2px",
            filter: frame >= 40 && frame < 85 ? `blur(${speedBlur}px)` : "none",
            textShadow: `0 0 60px rgba(255,215,0,${finalGlowOpacity}), 0 0 120px rgba(255,215,0,${
              finalGlowOpacity * 0.5
            })`,
          }}
        >
          {formattedValue}
        </span>
      </div>

      {/* Sous-texte + badge */}
      <div
        style={{
          position: "absolute",
          top: 660,
          left: "50%",
          transform: `translateX(-50%) translateY(${subTextTranslateY}px)`,
          opacity: subTextOpacity,
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <span
          style={{
            fontFamily,
            fontWeight: 400,
            fontSize: 48,
            color: "rgba(255,255,255,0.55)",
            whiteSpace: "nowrap",
          }}
        >
          en seulement
        </span>
        <div
          style={{
            background: "rgba(255,215,0,0.15)",
            border: "1.5px solid rgba(255,215,0,0.45)",
            borderRadius: 10,
            padding: "8px 24px",
            opacity: badgeOpacity,
            transform: `scale(${badgeScale})`,
          }}
        >
          <span
            style={{
              fontFamily,
              fontWeight: 700,
              fontSize: 42,
              color: "#FFD700",
              letterSpacing: "2px",
            }}
          >
            12 MOIS
          </span>
        </div>
      </div>

      {/* Speed indicator */}
      {speedText !== "" && (
        <div
          style={{
            position: "absolute",
            top: 800,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily,
            fontWeight: 500,
            fontSize: 30,
            color: "rgba(255,255,255,0.40)",
            opacity: speedOpacity,
          }}
        >
          {speedText}
        </div>
      )}
    </AbsoluteFill>
  );
};
