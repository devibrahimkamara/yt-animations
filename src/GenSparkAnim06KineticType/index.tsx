import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "800"],
  subsets: ["latin"],
});

type Token = {
  text: string;
  type: "normal" | "strong";
  start: number;
  duration: number;
  color: string;
  fontSize: number;
};

// Each token start shifted +5f relative to original, with +5f between tokens
// Original: 0,14,26,38,52,75,90,112  → New: 0,19,36,51,66,90,112,138
const TOKENS: Token[] = [
  { text: "Et si je te disais", type: "normal", start: 0,   duration: 18, color: "rgba(255,255,255,0.90)", fontSize: 90  },
  { text: "qu'on pouvait lancer",  type: "normal", start: 19,  duration: 18, color: "rgba(255,255,255,0.90)", fontSize: 90  },
  { text: "un business",           type: "normal", start: 36,  duration: 16, color: "rgba(255,255,255,0.90)", fontSize: 90  },
  { text: "qui va te rapporter",   type: "normal", start: 51,  duration: 16, color: "rgba(255,255,255,0.90)", fontSize: 90  },
  { text: "DE L'ARGENT",           type: "strong", start: 66,  duration: 24, color: "#FFD700",               fontSize: 115 },
  { text: "avec juste",            type: "normal", start: 95,  duration: 16, color: "rgba(255,255,255,0.90)", fontSize: 90  },
  { text: "UNE SEULE IA",          type: "strong", start: 112, duration: 24, color: "#3060ff",               fontSize: 115 },
  { text: "?",                     type: "normal", start: 138, duration: 10, color: "rgba(255,255,255,0.90)", fontSize: 90  },
];

const AnimatedToken: React.FC<{ token: Token; frame: number }> = ({ token, frame }) => {
  const { start, duration, type, text, color, fontSize } = token;

  if (type === "normal") {
    const opacity = interpolate(frame, [start, start + 12], [0, 1], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const translateY = interpolate(frame, [start, start + duration], [14, 0], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return (
      <span
        style={{
          display: "inline-block",
          fontWeight: 600,
          fontSize,
          color,
          opacity,
          transform: `translateY(${translateY}px)`,
          marginRight: "0.28em",
        }}
      >
        {text}
      </span>
    );
  }

  // Strong token
  const scale = interpolate(frame, [start, start + 10], [1.4, 1.0], {
    easing: Easing.out(Easing.back(2.0)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [start, start + 6], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glowIntensity = interpolate(frame, [start + 10, start + 32], [1.0, 0.15], {
    easing: Easing.out(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isGold = color === "#FFD700";
  const glowColor = isGold ? "255,215,0" : "48,96,255";
  const textShadow =
    `0px 0px 50px rgba(${glowColor},${0.8 * glowIntensity}), ` +
    `0px 0px 100px rgba(${glowColor},${0.4 * glowIntensity})`;

  const lineWidth = interpolate(frame, [start + 8, start + 22], [0, fontSize * text.length * 0.52], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <span
      style={{
        display: "inline-block",
        position: "relative",
        marginRight: "0.28em",
      }}
    >
      <span
        style={{
          display: "inline-block",
          fontWeight: 800,
          fontSize,
          color,
          opacity,
          transform: `scale(${scale})`,
          textShadow,
        }}
      >
        {text}
      </span>
      <div
        style={{
          position: "absolute",
          bottom: -8,
          left: 0,
          width: lineWidth,
          height: 5,
          borderRadius: 3,
          background: color,
          opacity: 0.8,
          overflow: "hidden",
        }}
      />
    </span>
  );
};

export const GenSparkAnim06KineticType: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AuroraBackground />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 1600px 900px at center, transparent 60%, rgba(0,0,0,0.5) 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          maxWidth: 1500,
          textAlign: "center",
          lineHeight: 1.4,
          position: "relative",
          fontFamily,
          padding: "0 200px",
        }}
      >
        {TOKENS.map((token, i) => (
          <AnimatedToken key={i} token={token} frame={frame} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
