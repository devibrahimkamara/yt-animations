import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";
import { GensparkIcon } from "../components/GensparkLogo";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
});

const IMPACT_PARTICLES = [
  { dx: 30,  dy: -30, size: 5 },
  { dx: 50,  dy: -15, size: 3 },
  { dx: 40,  dy: 0,   size: 4 },
  { dx: 50,  dy: 15,  size: 3 },
  { dx: 30,  dy: 30,  size: 5 },
  { dx: 20,  dy: -5,  size: 4 },
];

const TIME_MARKERS = [
  { label: "Départ",   x: 460,  isKey: false },
  { label: "6 mois",   x: 760,  isKey: false },
  { label: "12 mois ✓", x: 1060, isKey: true  },
  { label: "18 mois",  x: 1210, isKey: false },
  { label: "2 ans",    x: 1360, isKey: false },
  { label: "3 ans+",   x: 1510, isKey: false },
];

export const GenSparkAnim13ComparisonRace: React.FC = () => {
  const frame = useCurrentFrame();

  // Title
  const titleOpacity = interpolate(frame, [0, 22], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleTranslateY = interpolate(frame, [0, 22], [10, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Axis
  const axisOpacity = interpolate(frame, [8, 28], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const axisWidth = interpolate(frame, [8, 28], [0, 1100], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const markersOpacity = interpolate(frame, [18, 36], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dottedLineOpacity = interpolate(frame, [18, 36], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dottedLineIntensity = interpolate(frame, [113, 119, 125], [0.35, 0.85, 0.50], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Rails & labels
  const railsOpacity = interpolate(frame, [12, 32], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelsOpacity = interpolate(frame, [20, 38], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelsTranslateX = interpolate(frame, [20, 38], [-14, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const legendOpacity = interpolate(frame, [18, 36], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Bar widths — GenSpark race stretched to 35→115 (was 35→95)
  const startWidth = interpolate(frame, [30, 38], [0, 40], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gensparkProgress = interpolate(frame, [35, 115], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gensparkWidth = startWidth + gensparkProgress * 560;

  // Competitors keep racing until frame 200
  const concAProgress = interpolate(frame, [35, 200], [0, 1], {
    easing: Easing.out(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const concAWidth = startWidth + concAProgress * 680;

  const concBProgress = interpolate(frame, [35, 200], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const concBWidth = startWidth + concBProgress * 520;

  // GenSpark scaleY at impact (frame 115)
  let gensparkScaleY = 1.0;
  if (frame >= 115 && frame < 117) {
    gensparkScaleY = interpolate(frame, [115, 117], [1.0, 0.85], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (frame >= 117 && frame < 126) {
    gensparkScaleY = interpolate(frame, [117, 126], [0.85, 1.0], {
      easing: Easing.out(Easing.back(2.0)),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  // Impact effects shifted to frame 113
  const lineFlashOpacity = interpolate(frame, [113, 116, 123], [0, 0.8, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const impactProgress = interpolate(frame, [113, 135], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const impactParticleOpacity = interpolate(frame, [113, 118, 135], [0, 0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Badge
  const badgeScale = interpolate(frame, [118, 132], [0.5, 1.0], {
    easing: Easing.out(Easing.back(2.2)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const badgeOpacity = interpolate(frame, [118, 130], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Competitor labels ("encore en route...")
  const competitorLabelOpacity = interpolate(frame, [128, 142], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Arrow ping-pong
  const arrowOffset = frame >= 140 ? 5 * Math.sin(((frame - 140) / 20) * 2 * Math.PI) : 0;
  const arrowOpacity = interpolate(frame, [140, 158], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // GenSpark glow pulse
  const pulseProgress = frame >= 132 ? Math.sin(((frame - 132) / 30) * 2 * Math.PI) : 0;
  const glowIntensity = 0.5 + 0.2 * pulseProgress;

  // Streaks
  const streakOpacity = interpolate(frame, [40, 60, 100, 115], [0, 0.8, 0.8, 0], {
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
            "radial-gradient(ellipse 1600px 900px at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: "50%",
          transform: `translateX(-50%) translateY(${titleTranslateY}px)`,
          opacity: titleOpacity,
          fontFamily,
          fontWeight: 500,
          fontSize: 54,
          color: "rgba(255,255,255,0.50)",
          letterSpacing: "1px",
          whiteSpace: "nowrap",
        }}
      >
        Temps pour atteindre 250M$ de revenus
      </div>

      {/* Background band */}
      <div
        style={{
          position: "absolute",
          left: 460,
          top: 340,
          width: 1100,
          height: 400,
          background: "rgba(255,255,255,0.015)",
          borderRadius: 20,
          opacity: railsOpacity,
        }}
      />

      {/* Axis line */}
      <div
        style={{
          position: "absolute",
          left: 460,
          top: 278,
          width: axisWidth,
          height: 2,
          background: "rgba(255,255,255,0.12)",
          opacity: axisOpacity,
        }}
      />

      {/* Time markers */}
      {TIME_MARKERS.map((m, i) => (
        <div key={i} style={{ opacity: markersOpacity }}>
          <div
            style={{
              position: "absolute",
              left: m.x,
              top: 270,
              width: m.isKey ? 2 : 1,
              height: m.isKey ? 16 : 10,
              background: m.isKey ? "rgba(255,215,0,0.80)" : "rgba(255,255,255,0.20)",
              transform: "translateX(-50%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: m.x,
              top: 238,
              transform: "translateX(-50%)",
              fontFamily,
              fontWeight: m.isKey ? 700 : 400,
              fontSize: m.isKey ? 30 : 26,
              color: m.isKey ? "#FFD700" : "rgba(255,255,255,0.35)",
              whiteSpace: "nowrap",
            }}
          >
            {m.label}
          </div>
        </div>
      ))}

      {/* Dotted 12-month line */}
      <div
        style={{
          position: "absolute",
          left: 1060,
          top: 248,
          width: 2,
          height: 500,
          background: `repeating-linear-gradient(to bottom, rgba(255,215,0,${dottedLineIntensity}) 0px, rgba(255,215,0,${dottedLineIntensity}) 6px, transparent 6px, transparent 12px)`,
          opacity: dottedLineOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Bar labels (outside clip) */}
      {[
        { name: "Genspark",  showIcon: true,  y: 406, fontSize: 40, color: "rgba(136,170,255,0.9)", translateX: labelsTranslateX },
        { name: "Autre IA A", showIcon: false, y: 520, fontSize: 36, color: "rgba(255,255,255,0.50)", translateX: labelsTranslateX },
        { name: "Autre IA B", showIcon: false, y: 640, fontSize: 36, color: "rgba(255,255,255,0.50)", translateX: labelsTranslateX },
      ].map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: b.showIcon ? 160 : 240,
            top: b.y,
            display: "flex",
            alignItems: "center",
            gap: b.showIcon ? 12 : 0,
            justifyContent: "flex-end",
            transform: `translateY(-50%) translateX(${b.translateX}px)`,
            opacity: labelsOpacity,
            whiteSpace: "nowrap",
          }}
        >
          {b.showIcon && <GensparkIcon size={38} />}
          <span
            style={{
              fontFamily,
              fontWeight: 600,
              fontSize: b.fontSize,
              color: b.color,
            }}
          >
            {b.name}
          </span>
        </div>
      ))}

      {/* Bar container (clipped) */}
      <div
        style={{
          position: "absolute",
          left: 460,
          top: 340,
          width: 1100,
          height: 400,
          overflow: "hidden",
          borderRadius: 20,
        }}
      >
        {/* GenSpark rail */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 66 - 34,
            width: 1100,
            height: 68,
            background: "rgba(255,255,255,0.05)",
            borderRadius: 34,
            border: "1px solid rgba(255,255,255,0.08)",
            opacity: railsOpacity,
          }}
        />
        {/* GenSpark bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 66 - 34,
            width: gensparkWidth,
            height: 68,
            background: "linear-gradient(to right, #3060ff, #88aaff, #FFD700)",
            borderRadius: 34,
            transform: `scaleY(${gensparkScaleY})`,
            transformOrigin: "left center",
            overflow: "hidden",
          }}
        >
          {/* Speed streaks */}
          <div style={{ position: "absolute", top: 18, left: `${0.2 * gensparkWidth}px`, width: `${0.6 * gensparkWidth}px`, height: 3, background: "linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent)", opacity: streakOpacity }} />
          <div style={{ position: "absolute", top: 33, left: `${0.2 * gensparkWidth}px`, width: `${0.6 * gensparkWidth}px`, height: 2, background: "linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)", opacity: streakOpacity }} />
          <div style={{ position: "absolute", top: 48, left: `${0.2 * gensparkWidth}px`, width: `${0.6 * gensparkWidth}px`, height: 3, background: "linear-gradient(to right, transparent, rgba(255,255,255,0.35), transparent)", opacity: streakOpacity }} />
        </div>
        {/* GenSpark glow */}
        <div
          style={{
            position: "absolute",
            left: gensparkWidth - 34,
            top: 66 - 34,
            width: 68,
            height: 68,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(255,215,0,${glowIntensity * 0.6}) 0%, rgba(48,96,255,0.3) 40%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        {/* Concurrent A rail */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 180 - 28,
            width: 1100,
            height: 56,
            background: "rgba(255,255,255,0.05)",
            borderRadius: 28,
            border: "1px solid rgba(255,255,255,0.08)",
            opacity: railsOpacity,
          }}
        />
        {/* Concurrent A bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 180 - 28,
            width: concAWidth,
            height: 56,
            background: "#4A4A5A",
            borderRadius: 28,
            overflow: "hidden",
          }}
        >
          <span style={{ position: "absolute", top: "50%", left: 22, transform: "translateY(-50%)", fontFamily, fontWeight: 400, fontSize: 24, color: "rgba(255,255,255,0.35)", fontStyle: "italic", opacity: competitorLabelOpacity, whiteSpace: "nowrap" }}>encore en route...</span>
        </div>
        {/* Arrow A */}
        <div style={{ position: "absolute", left: concAWidth + 14, top: 180 - 15, fontSize: 30, color: "rgba(255,255,255,0.30)", transform: `translateX(${arrowOffset}px)`, opacity: arrowOpacity, fontFamily }}>→</div>

        {/* Concurrent B rail */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 300 - 28,
            width: 1100,
            height: 56,
            background: "rgba(255,255,255,0.05)",
            borderRadius: 28,
            border: "1px solid rgba(255,255,255,0.08)",
            opacity: railsOpacity,
          }}
        />
        {/* Concurrent B bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 300 - 28,
            width: concBWidth,
            height: 56,
            background: "#3A3A4A",
            borderRadius: 28,
            overflow: "hidden",
          }}
        >
          <span style={{ position: "absolute", top: "50%", left: 22, transform: "translateY(-50%)", fontFamily, fontWeight: 400, fontSize: 24, color: "rgba(255,255,255,0.35)", fontStyle: "italic", opacity: competitorLabelOpacity, whiteSpace: "nowrap" }}>encore en route...</span>
        </div>
        {/* Arrow B */}
        <div style={{ position: "absolute", left: concBWidth + 14, top: 300 - 15, fontSize: 30, color: "rgba(255,255,255,0.30)", transform: `translateX(${arrowOffset}px)`, opacity: arrowOpacity, fontFamily }}>→</div>
      </div>

      {/* Impact flash at 12 months line */}
      <div
        style={{
          position: "absolute",
          left: 1020,
          top: 378,
          width: 80,
          height: 70,
          borderRadius: "50%",
          background: "radial-gradient(rgba(255,215,0,0.8), transparent)",
          filter: "blur(12px)",
          opacity: lineFlashOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Impact particles */}
      {frame >= 113 && frame <= 135 && (
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          viewBox="0 0 1920 1080"
        >
          {IMPACT_PARTICLES.map((p, i) => (
            <circle
              key={i}
              cx={1060 + p.dx * impactProgress}
              cy={406 + p.dy * impactProgress}
              r={p.size}
              fill="#FFD700"
              opacity={impactParticleOpacity}
            />
          ))}
        </svg>
      )}

      {/* Trophy badge */}
      {frame >= 118 && (
        <div
          style={{
            position: "absolute",
            left: 1068,
            top: 378,
            background: "rgba(255,215,0,0.20)",
            border: "1.5px solid rgba(255,215,0,0.70)",
            borderRadius: 12,
            padding: "8px 18px",
            opacity: badgeOpacity,
            transform: `scale(${badgeScale})`,
            transformOrigin: "left center",
          }}
        >
          <span style={{ fontFamily, fontWeight: 700, fontSize: 30, color: "#FFD700" }}>
            🏆 12 mois
          </span>
        </div>
      )}

      {/* Legend */}
      <div
        style={{
          position: "absolute",
          top: 840,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 56,
          opacity: legendOpacity,
        }}
      >
        {[
          { label: "Genspark",  showIcon: true,  color: "linear-gradient(135deg, #3060ff, #FFD700)" },
          { label: "Autre IA A", showIcon: false, color: "#4A4A5A" },
          { label: "Autre IA B", showIcon: false, color: "#3A3A4A" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {item.showIcon
              ? <GensparkIcon size={30} />
              : <div style={{ width: 16, height: 16, borderRadius: 4, background: item.color }} />
            }
            <span style={{
              fontFamily,
              fontWeight: i === 0 ? 600 : 400,
              fontSize: 30,
              color: i === 0 ? "#FFFFFF" : "rgba(255,255,255,0.50)",
            }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
