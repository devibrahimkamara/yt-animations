import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700", "800"],
  subsets: ["latin"],
});

const EASE = Easing.bezier(0.16, 1, 0.3, 1);

export const icebergRevealSchema = z.object({
  chatgptQuestions: z
    .array(z.string())
    .default([
      "Comment gagner de l'argent ?",
      "Écris-moi un email",
      "Donne-moi des idées",
    ]),
  icebergVisible: z.string().default("Poser des questions"),
  icebergHidden: z
    .array(z.string())
    .default(["Automatisation", "Agents IA", "Systèmes", "Business"]),
  accentColor: z.string().default("#3b82f6"),
  durationSecs: z.number().default(8),
});

export type IcebergRevealProps = z.infer<typeof icebergRevealSchema>;

// ── Character SVG ────────────────────────────────────────────────────────────

const Character: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const s = spring({ frame, fps, config: { mass: 0.5, damping: 10, stiffness: 180 } });
  const armWave = Math.sin(frame * 0.12) * 12;

  return (
    <div style={{ opacity: s, transform: `scale(${s})`, transformOrigin: "bottom center" }}>
      <svg width="130" height="180" viewBox="0 0 130 180" fill="none">
        <defs>
          <radialGradient id="head-grad" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="rgba(225,235,255,0.95)" />
            <stop offset="100%" stopColor="rgba(170,195,240,0.9)" />
          </radialGradient>
          <radialGradient id="body-grad" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="rgba(180,205,255,0.85)" />
            <stop offset="100%" stopColor="rgba(120,155,220,0.8)" />
          </radialGradient>
          <filter id="char-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Shadow */}
        <ellipse cx="65" cy="176" rx="35" ry="6" fill="rgba(0,0,0,0.25)" />

        {/* Body */}
        <rect x="28" y="90" width="74" height="72" rx="18" fill="url(#body-grad)" filter="url(#char-glow)" />

        {/* Left arm (raised, pointing at screen) */}
        <path
          d={`M28,100 Q${8 - armWave * 0.3},${78 + armWave} ${20 - armWave * 0.5},${60 + armWave}`}
          stroke="rgba(170,195,240,0.9)"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
        />
        {/* Hand pointing */}
        <circle cx={`${20 - armWave * 0.5}`} cy={`${60 + armWave}`} r="7" fill="rgba(225,235,255,0.9)" />

        {/* Right arm (resting) */}
        <path
          d="M102,100 Q118,110 112,128"
          stroke="rgba(170,195,240,0.9)"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
        />

        {/* Neck */}
        <rect x="52" y="74" width="26" height="20" rx="6" fill="rgba(195,215,250,0.88)" />

        {/* Head */}
        <circle cx="65" cy="52" r="32" fill="url(#head-grad)" filter="url(#char-glow)" />

        {/* Eyes */}
        <ellipse cx="54" cy="48" rx="5" ry="6" fill="rgba(15,30,80,0.85)" />
        <ellipse cx="76" cy="48" rx="5" ry="6" fill="rgba(15,30,80,0.85)" />
        {/* Eye shine */}
        <circle cx="56" cy="46" r="2" fill="rgba(255,255,255,0.7)" />
        <circle cx="78" cy="46" r="2" fill="rgba(255,255,255,0.7)" />

        {/* Eyebrows (slightly raised = curious) */}
        <path d="M47,38 Q54,34 61,37" stroke="rgba(60,90,160,0.7)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M69,37 Q76,34 83,38" stroke="rgba(60,90,160,0.7)" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Smile */}
        <path d="M53,62 Q65,72 77,62" stroke="rgba(60,90,160,0.65)" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Legs */}
        <rect x="38" y="155" width="18" height="22" rx="7" fill="rgba(155,180,230,0.8)" />
        <rect x="74" y="155" width="18" height="22" rx="7" fill="rgba(155,180,230,0.8)" />
      </svg>
    </div>
  );
};

// ── Iceberg ───────────────────────────────────────────────────────────────────

const IcebergTip: React.FC<{ revealProgress: number; label: string }> = ({
  revealProgress,
  label,
}) => {
  const clipTop = interpolate(revealProgress, [0, 1], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

  return (
    <div
      style={{
        position: "relative",
        clipPath: `inset(${clipTop}% 0 0 0)`,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <svg width="340" height="160" viewBox="0 0 340 160" style={{ display: "block" }}>
        <defs>
          <linearGradient id="tip-fill" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="rgba(220,238,255,0.97)" />
            <stop offset="55%" stopColor="rgba(150,195,240,0.92)" />
            <stop offset="100%" stopColor="rgba(90,150,220,0.88)" />
          </linearGradient>
          <linearGradient id="tip-stroke" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="rgba(200,225,255,0.8)" />
            <stop offset="100%" stopColor="rgba(120,175,230,0.5)" />
          </linearGradient>
          <filter id="tip-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <polygon
          points="170,8 335,158 5,158"
          fill="url(#tip-fill)"
          stroke="url(#tip-stroke)"
          strokeWidth="1.5"
          filter="url(#tip-glow)"
        />
        {/* Inner highlight facets */}
        <polygon points="170,8 335,158 252,83" fill="rgba(255,255,255,0.08)" />
        <polygon points="170,8 5,158 88,83" fill="rgba(255,255,255,0.05)" />
        <line x1="170" y1="8" x2="170" y2="158" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      </svg>
      {/* Label on tip */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          fontFamily,
          fontWeight: 800,
          fontSize: 22,
          color: "rgba(4,18,55,0.92)",
          letterSpacing: "0.02em",
          textAlign: "center",
          textShadow: "0 1px 4px rgba(180,215,255,0.5)",
          userSelect: "none",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </div>
  );
};

const WaterSurface: React.FC<{ frame: number; opacity: number }> = ({ frame, opacity }) => {
  const w1 = Math.sin(frame * 0.07) * 5;
  const w2 = Math.cos(frame * 0.05) * 4;

  const wavePath = `M0,16 Q50,${16 + w1} 100,16 Q150,${16 - w1} 200,16 Q250,${16 + w2} 300,16 Q350,${16 - w2} 400,16`;
  const wavePathB = `M0,22 Q60,${22 - w2 * 0.7} 120,22 Q180,${22 + w2 * 0.7} 240,22 Q300,${22 - w1 * 0.5} 400,22`;

  return (
    <div style={{ width: "100%", opacity }}>
      <svg width="100%" height="36" viewBox="0 0 400 36" preserveAspectRatio="none">
        <defs>
          <linearGradient id="wave-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="15%" stopColor="rgba(100,185,255,0.65)" />
            <stop offset="85%" stopColor="rgba(100,185,255,0.65)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id="wave-grad-b" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="20%" stopColor="rgba(80,150,230,0.3)" />
            <stop offset="80%" stopColor="rgba(80,150,230,0.3)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path d={wavePath} stroke="url(#wave-grad)" strokeWidth="2.5" fill="none" />
        <path d={wavePathB} stroke="url(#wave-grad-b)" strokeWidth="1.5" fill="none" />
      </svg>
      <div
        style={{
          fontFamily,
          fontWeight: 600,
          fontSize: 12,
          color: "rgba(100,185,255,0.45)",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          textAlign: "right",
          paddingRight: 8,
          marginTop: -2,
        }}
      >
        ≈ surface ≈
      </div>
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────

const QUESTION_FRAMES = 55;
const ICEBERG_REVEAL_START = 55;

export const IcebergReveal: React.FC<IcebergRevealProps> = ({
  chatgptQuestions,
  icebergVisible,
  icebergHidden,
  accentColor,
  durationSecs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = durationSecs * fps;

  // Global fade in
  const globalOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Divider
  const dividerScale = interpolate(frame, [5, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

  // Typewriter
  const questionIdx = Math.min(
    Math.floor(Math.max(0, frame - 20) / QUESTION_FRAMES),
    chatgptQuestions.length - 1
  );
  const questionFrame = Math.max(0, frame - 20) % QUESTION_FRAMES;
  const currentQ = chatgptQuestions[questionIdx];
  const charCount = Math.floor(
    interpolate(questionFrame, [0, QUESTION_FRAMES - 12], [0, currentQ.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const cursorOn = Math.round(frame / 7) % 2 === 0;

  // Chat window entrance
  const chatOpacity = interpolate(frame, [12, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const chatY = interpolate(frame, [12, 30], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

  // Iceberg tip
  const tipReveal = interpolate(frame, [ICEBERG_REVEAL_START, ICEBERG_REVEAL_START + 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Water surface
  const waterOpacity = interpolate(frame, [ICEBERG_REVEAL_START + 30, ICEBERG_REVEAL_START + 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Iceberg body clip
  const bodyReveal = interpolate(frame, [ICEBERG_REVEAL_START + 40, totalFrames - 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Labels (above/below iceberg)
  const labelOpacity = interpolate(frame, [ICEBERG_REVEAL_START, ICEBERG_REVEAL_START + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Badge
  const badgeSpring = spring({
    frame: frame - 195,
    fps,
    config: { mass: 0.5, damping: 9, stiffness: 200 },
  });

  // Right panel ocean gradient opacity
  const oceanOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />

      {/* Ocean overlay on right half */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "50%",
          height: "100%",
          background:
            "linear-gradient(180deg, rgba(2,12,42,0.7) 0%, rgba(1,7,28,0.88) 100%)",
          opacity: oceanOpacity,
        }}
      />

      <AbsoluteFill style={{ opacity: globalOpacity, display: "flex" }}>

        {/* ── LEFT PANEL ────────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 52px",
            gap: 28,
          }}
        >
          {/* Character */}
          <Character frame={frame} fps={fps} />

          {/* ChatGPT window */}
          <div
            style={{
              opacity: chatOpacity,
              transform: `translateY(${chatY}px)`,
              width: "100%",
              background:
                "linear-gradient(135deg, rgba(14,22,60,0.82) 0%, rgba(8,14,42,0.78) 100%)",
              border: "1px solid rgba(80,130,255,0.22)",
              borderRadius: 20,
              padding: "22px 28px 26px",
              boxShadow:
                `0 0 50px ${accentColor}22, 0 0 100px ${accentColor}10, inset 0 1px 0 rgba(255,255,255,0.07)`,
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 18,
                paddingBottom: 14,
                borderBottom: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #10a37f, #087b5e)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 17,
                  boxShadow: "0 0 14px rgba(16,163,127,0.4)",
                }}
              >
                ✦
              </div>
              <span
                style={{
                  fontFamily,
                  fontWeight: 800,
                  fontSize: 22,
                  color: "rgba(255,255,255,0.92)",
                  letterSpacing: "0.01em",
                }}
              >
                ChatGPT
              </span>
              {/* Dot status */}
              <div
                style={{
                  marginLeft: "auto",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#10a37f",
                  boxShadow: "0 0 8px rgba(16,163,127,0.8)",
                }}
              />
            </div>

            {/* Messages */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {chatgptQuestions.slice(0, questionIdx).map((q, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    opacity: 0.38,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "rgba(80,130,255,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      flexShrink: 0,
                    }}
                  >
                    👤
                  </div>
                  <div
                    style={{
                      fontFamily,
                      fontWeight: 600,
                      fontSize: 18,
                      color: "rgba(180,210,255,0.75)",
                    }}
                  >
                    {q}
                  </div>
                </div>
              ))}

              {/* Active question */}
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: `rgba(59,130,246,0.35)`,
                    border: `1px solid ${accentColor}60`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    flexShrink: 0,
                    boxShadow: `0 0 10px ${accentColor}30`,
                  }}
                >
                  👤
                </div>
                <div
                  style={{
                    fontFamily,
                    fontWeight: 700,
                    fontSize: 20,
                    color: "rgba(210,228,255,0.97)",
                    minHeight: 28,
                    letterSpacing: "0.01em",
                  }}
                >
                  {currentQ.slice(0, charCount)}
                  <span
                    style={{
                      display: "inline-block",
                      width: 2,
                      height: 19,
                      background: accentColor,
                      marginLeft: 2,
                      verticalAlign: "middle",
                      opacity: cursorOn ? 1 : 0,
                      boxShadow: `0 0 8px ${accentColor}`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Badge 10% */}
          {frame >= 195 && (
            <div
              style={{
                transform: `scale(${badgeSpring})`,
                opacity: badgeSpring,
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(239,60,60,0.1)",
                border: "1.5px solid rgba(239,60,60,0.45)",
                borderRadius: 14,
                padding: "11px 22px",
                boxShadow: "0 0 30px rgba(239,60,60,0.12)",
              }}
            >
              <span style={{ fontSize: 20 }}>⚠️</span>
              <div
                style={{
                  fontFamily,
                  fontWeight: 800,
                  fontSize: 19,
                  color: "#f07070",
                  letterSpacing: "0.02em",
                }}
              >
                10 % du potentiel utilisé
              </div>
            </div>
          )}
        </div>

        {/* ── DIVIDER ─────────────────────────────────────────── */}
        <div
          style={{
            width: 1,
            background:
              "linear-gradient(180deg, transparent, rgba(80,130,255,0.35) 20%, rgba(80,130,255,0.35) 80%, transparent)",
            flexShrink: 0,
            margin: "0",
            transform: `scaleY(${dividerScale})`,
            transformOrigin: "center",
          }}
        />

        {/* ── RIGHT PANEL — ICEBERG ───────────────────────────── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px 40px",
            gap: 0,
            position: "relative",
          }}
        >
          {/* "Ce que tu vois" label */}
          <div
            style={{
              fontFamily,
              fontWeight: 700,
              fontSize: 16,
              color: "rgba(140,165,210,0.65)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 10,
              opacity: labelOpacity,
            }}
          >
            Ce que tu vois
          </div>

          {/* Iceberg tip */}
          <IcebergTip revealProgress={tipReveal} label={icebergVisible} />

          {/* Water surface */}
          <WaterSurface frame={frame} opacity={waterOpacity} />

          {/* Underwater body */}
          <div
            style={{
              position: "relative",
              width: "78%",
              clipPath: `inset(${interpolate(bodyReveal, [0, 1], [100, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}% 0 0 0 round 0 0 24px 24px)`,
              overflow: "hidden",
            }}
          >
            {/* Body background SVG */}
            <svg
              width="100%"
              height="320"
              viewBox="0 0 400 320"
              preserveAspectRatio="none"
              style={{ display: "block" }}
            >
              <defs>
                <linearGradient id="body-fill" x1="0.5" y1="0" x2="0.5" y2="1">
                  <stop offset="0%" stopColor="rgba(4,18,58,0.95)" />
                  <stop offset="60%" stopColor="rgba(2,10,38,0.97)" />
                  <stop offset="100%" stopColor="rgba(1,6,22,0.99)" />
                </linearGradient>
                <linearGradient id="body-stroke" x1="0.5" y1="0" x2="0.5" y2="1">
                  <stop offset="0%" stopColor="rgba(80,140,255,0.45)" />
                  <stop offset="100%" stopColor="rgba(40,80,200,0.18)" />
                </linearGradient>
                {/* Depth shimmer */}
                <linearGradient id="shimmer" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(60,110,255,0.06)" />
                  <stop offset="50%" stopColor="rgba(80,130,255,0.12)" />
                  <stop offset="100%" stopColor="rgba(60,110,255,0.06)" />
                </linearGradient>
              </defs>
              {/* Main trapezoid — wider at bottom */}
              <path
                d="M20,0 L380,0 L360,320 L40,320 Z"
                fill="url(#body-fill)"
                stroke="url(#body-stroke)"
                strokeWidth="1.5"
              />
              {/* Shimmer layer */}
              <path d="M40,20 L360,20 L345,300 L55,300 Z" fill="url(#shimmer)" />
              {/* Subtle vertical crack lines (iceberg realism) */}
              <line x1="130" y1="0" x2="110" y2="320" stroke="rgba(100,160,255,0.05)" strokeWidth="1" />
              <line x1="250" y1="0" x2="270" y2="320" stroke="rgba(100,160,255,0.04)" strokeWidth="1" />
            </svg>

            {/* Hidden labels */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-evenly",
                padding: "28px 16px",
              }}
            >
              {icebergHidden.map((item, i) => {
                const itemStart = ICEBERG_REVEAL_START + 40 + 18 + i * 20;
                const itemSpring = spring({
                  frame: frame - itemStart,
                  fps,
                  config: { mass: 0.4, damping: 8, stiffness: 280 },
                });
                const fontSize = 30 - i * 2.5;
                const glow = 20 + 12 * Math.abs(Math.sin(frame * 0.1 + i));
                return (
                  <div
                    key={i}
                    style={{
                      fontFamily,
                      fontWeight: 800,
                      fontSize,
                      color: accentColor,
                      opacity: itemSpring,
                      transform: `scale(${itemSpring}) translateY(${interpolate(itemSpring, [0, 1], [10, 0])}px)`,
                      letterSpacing: "0.06em",
                      textShadow: `0 0 ${glow}px ${accentColor}70, 0 0 ${glow * 2}px ${accentColor}30`,
                      textAlign: "center",
                    }}
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          </div>

          {/* "Le vrai potentiel" label */}
          <div
            style={{
              marginTop: 14,
              fontFamily,
              fontWeight: 700,
              fontSize: 16,
              color: `rgba(100,145,255,0.7)`,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: interpolate(frame, [ICEBERG_REVEAL_START + 35, ICEBERG_REVEAL_START + 55], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            Le vrai potentiel
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
