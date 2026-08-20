import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";
import { GensparkIcon } from "../components/GensparkLogo";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "800"],
  subsets: ["latin"],
});

// Center of the diagram — slightly below canvas center to leave room for title
const CX = 960;
const CY = 590;
const DEG_TO_RAD = Math.PI / 180;

// 7 satellites evenly distributed (360/7 ≈ 51.4°) starting from upper-left,
// going clockwise. No satellite at the very top so the title has clear space.
// Positions computed at center (960,590), radius 330.
// labelDir: "left" for x < CX, "right" for x > CX.
const SATELLITES = [
  {
    label: "Génération images", sub: "IA générative",  icon: "🖼️",
    angle: -101.4, x: 895,  y: 266, color: "#A855F7",
    len: 200, labelDir: "left",  startFrame: 22,
  },
  {
    label: "Création d'apps",   sub: "Sans code",      icon: "🛠️",
    angle: -50,    x: 1172, y: 337, color: "#3060ff",
    len: 200, labelDir: "right", startFrame: 46,
  },
  {
    label: "Recherche web",     sub: "En temps réel",  icon: "🔍",
    angle: 1.4,    x: 1290, y: 598, color: "#88aaff",
    len: 200, labelDir: "right", startFrame: 70,
  },
  {
    label: "Rédaction IA",      sub: "Multilingue",    icon: "✍️",
    angle: 52.9,   x: 1159, y: 853, color: "#EC4899",
    len: 200, labelDir: "right", startFrame: 94,
  },
  {
    label: "Analyse données",   sub: "Instantanée",    icon: "📈",
    angle: 104.3,  x: 878,  y: 910, color: "#F59E0B",
    len: 200, labelDir: "left",  startFrame: 118,
  },
  {
    label: "Automatisation",    sub: "Multi-tâches",   icon: "⚙️",
    angle: 155.7,  x: 660,  y: 727, color: "#10B981",
    len: 200, labelDir: "left",  startFrame: 142,
  },
  {
    label: "Slides & docs",     sub: "En un clic",     icon: "📊",
    angle: -152.9, x: 666,  y: 440, color: "#06B6D4",
    len: 200, labelDir: "left",  startFrame: 166,
  },
];

const PHASE_OFFSETS = [0, 8, 16, 24, 32, 40, 48];
const PING_DELAYS   = [0, 5, 10, 15, 20, 25, 30];

export const GenSparkAnim11RadialDiagram: React.FC = () => {
  const frame = useCurrentFrame();

  // Center node
  const centerScale = interpolate(frame, [0, 22], [0, 1], {
    easing: Easing.out(Easing.back(1.8)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const centerOpacity = interpolate(frame, [0, 16], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ringRotation = (frame / 180) * 360;
  const pulseProgress = Math.sin(((frame - 15) / 60) * 2 * Math.PI);
  const glowScale = 1 + 0.12 * pulseProgress;
  const glowOpacity = 0.25 + 0.10 * pulseProgress;

  // Title
  const titleOpacity = interpolate(frame, [5, 20], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Branch geometry — center radius 90px (180/2), satellite radius 48px (96/2)
  const branches = SATELLITES.map((sat) => {
    const θ = sat.angle * DEG_TO_RAD;
    return {
      startX: CX + 90 * Math.cos(θ),
      startY: CY + 90 * Math.sin(θ),
      endX:   sat.x - 48 * Math.cos(θ),
      endY:   sat.y - 48 * Math.sin(θ),
    };
  });

  return (
    <AbsoluteFill style={{ background: "#000000" }}>
      <AuroraBackground />

      {/* Dot grid */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />
      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 1400px 800px at center, transparent 50%, rgba(0,0,0,0.65) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Title — sits at the very top, above all satellites */}
      <div
        style={{
          position: "absolute",
          top: 55,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily,
          fontWeight: 500,
          fontSize: 50,
          color: "rgba(255,255,255,0.35)",
          opacity: titleOpacity,
          whiteSpace: "nowrap",
        }}
      >
        Une seule IA. Tout faire.
      </div>

      {/* SVG branches + travel pings */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
        viewBox="0 0 1920 1080"
      >
        <defs>
          {SATELLITES.map((sat, i) => (
            <linearGradient
              key={i}
              id={`branchGrad${i}`}
              gradientUnits="userSpaceOnUse"
              x1={branches[i].startX}
              y1={branches[i].startY}
              x2={branches[i].endX}
              y2={branches[i].endY}
            >
              <stop offset="0%"   stopColor="#3060ff" stopOpacity="0.6" />
              <stop offset="100%" stopColor={sat.color} stopOpacity="0.5" />
            </linearGradient>
          ))}
        </defs>

        {SATELLITES.map((sat, i) => {
          const ns = sat.startFrame;
          const dashOffset = interpolate(frame, [ns, ns + 24], [sat.len, 0], {
            easing: Easing.out(Easing.cubic),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const branchOpacity = interpolate(frame, [ns, ns + 12], [0, 1], {
            easing: Easing.out(Easing.cubic),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          // Travel ping after frame 200
          const pingProgress =
            frame >= 200
              ? ((frame - 200 + PING_DELAYS[i % PING_DELAYS.length]) % 32) / 32
              : 0;
          const pingOpacity =
            frame >= 200
              ? pingProgress < 0.5
                ? pingProgress * 2 * 0.8
                : (1 - pingProgress) * 2 * 0.8
              : 0;
          const pingX =
            branches[i].startX +
            (branches[i].endX - branches[i].startX) * pingProgress;
          const pingY =
            branches[i].startY +
            (branches[i].endY - branches[i].startY) * pingProgress;

          return (
            <g key={i}>
              <line
                x1={branches[i].startX}
                y1={branches[i].startY}
                x2={branches[i].endX}
                y2={branches[i].endY}
                stroke={`url(#branchGrad${i})`}
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={sat.len}
                strokeDashoffset={dashOffset}
                opacity={branchOpacity}
              />
              {frame >= 200 && (
                <circle
                  cx={pingX}
                  cy={pingY}
                  r={3.5}
                  fill={sat.color}
                  opacity={pingOpacity}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Center node — 180×180px */}
      <div
        style={{
          position: "absolute",
          left: CX,
          top: CY,
          transform: `translate(-50%, -50%) scale(${centerScale})`,
          opacity: centerOpacity,
          width: 180,
          height: 180,
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 240,
            height: 240,
            transform: `translate(-50%, -50%) scale(${glowScale})`,
            background:
              "radial-gradient(circle, rgba(48,96,255,0.25) 0%, transparent 70%)",
            filter: "blur(20px)",
            opacity: glowOpacity,
            borderRadius: "50%",
          }}
        />
        {/* Outer ring */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "2px solid rgba(48,96,255,0.5)",
            background: "rgba(48,96,255,0.08)",
          }}
        />
        {/* Rotating dashed ring */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "1.5px dashed rgba(48,96,255,0.25)",
            transform: `rotate(${ringRotation}deg)`,
          }}
        />
        {/* Inner circle with "GS" */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 120,
            height: 120,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background: "rgba(10,10,15,0.95)",
            border: "1.5px solid rgba(48,96,255,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GensparkIcon size={76} />
        </div>
      </div>

      {/* Satellite nodes — 96×96px */}
      {SATELLITES.map((sat, i) => {
        const ns = sat.startFrame;

        const nodeScale = interpolate(frame, [ns + 18, ns + 36], [0, 1], {
          easing: Easing.out(Easing.back(2.0)),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const nodeOpacity = interpolate(frame, [ns + 18, ns + 30], [0, 1], {
          easing: Easing.out(Easing.cubic),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const iconScale = interpolate(frame, [ns + 26, ns + 42], [0.4, 1.0], {
          easing: Easing.out(Easing.back(1.5)),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const iconOpacity = interpolate(frame, [ns + 26, ns + 38], [0, 1], {
          easing: Easing.out(Easing.cubic),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const labelOpacity = interpolate(frame, [ns + 34, ns + 52], [0, 1], {
          easing: Easing.out(Easing.cubic),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const subLabelOpacity = interpolate(frame, [ns + 40, ns + 56], [0, 1], {
          easing: Easing.out(Easing.cubic),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        // Label slides in from its natural direction
        const slideDir = sat.labelDir === "left" ? 14 : -14;
        const labelSlide = interpolate(frame, [ns + 34, ns + 52], [slideDir, 0], {
          easing: Easing.out(Easing.cubic),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        // Subtle pulse in hold phase
        const phaseOff = PHASE_OFFSETS[i % PHASE_OFFSETS.length];
        const nodePulse =
          frame >= 200
            ? 1 + 0.04 * Math.sin(((frame - 200 + phaseOff) / 25) * 2 * Math.PI)
            : 1;

        // Label positioned to the left or right of the node
        const labelStyle: React.CSSProperties =
          sat.labelDir === "left"
            ? {
                position: "absolute",
                right: "calc(100% + 20px)",
                top: "50%",
                width: 180,
                textAlign: "right",
                transform: `translateY(-50%) translateX(${labelSlide}px)`,
              }
            : {
                position: "absolute",
                left: "calc(100% + 20px)",
                top: "50%",
                width: 180,
                textAlign: "left",
                transform: `translateY(-50%) translateX(${labelSlide}px)`,
              };

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: sat.x,
              top: sat.y,
              width: 96,
              height: 96,
              transform: `translate(-50%, -50%) scale(${nodeScale * nodePulse})`,
              opacity: nodeOpacity,
            }}
          >
            {/* Outer ring */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: `rgba(${hexToRgb(sat.color)}, 0.12)`,
                border: `1.5px solid rgba(${hexToRgb(sat.color)}, 0.45)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Inner disc */}
              <div
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: "50%",
                  background: `rgba(${hexToRgb(sat.color)}, 0.18)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 28,
                    display: "inline-block",
                    opacity: iconOpacity,
                    transform: `scale(${iconScale})`,
                  }}
                >
                  {sat.icon}
                </span>
              </div>
            </div>

            {/* Label */}
            <div style={{ ...labelStyle, opacity: labelOpacity }}>
              <div
                style={{
                  fontFamily,
                  fontWeight: 600,
                  fontSize: 28,
                  color: "#E0E0E0",
                  lineHeight: 1.25,
                }}
              >
                {sat.label}
              </div>
              <div
                style={{
                  fontFamily,
                  fontWeight: 400,
                  fontSize: 22,
                  color: "rgba(255,255,255,0.45)",
                  marginTop: 4,
                  opacity: subLabelOpacity,
                }}
              >
                {sat.sub}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
