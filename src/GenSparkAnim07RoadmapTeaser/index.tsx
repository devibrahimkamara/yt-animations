import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
});

const STEPS = [
  { label: "Trouver une idée", icon: "💡", x: 360, color: "#3060ff", num: "01" },
  { label: "Créer le business", icon: "🛠️", x: 760, color: "#3060ff", num: "02" },
  { label: "Tester & lancer",  icon: "🚀", x: 1160, color: "#3060ff", num: "03" },
  { label: "Résultat ?",       icon: "❓", x: 1560, color: "#FFD700", num: "04" },
];

const Y = 540;
const SEG_STARTS = [396, 796, 1196];
const SEG_ENDS   = [724, 1124, 1524];

export const GenSparkAnim07RoadmapTeaser: React.FC = () => {
  const frame = useCurrentFrame();

  const railOpacity = interpolate(frame, [0, 16], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleOpacity = interpolate(frame, [0, 25], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Progress segments — slowed by +10f each
  const seg1FillWidth = interpolate(frame, [42, 62], [0, 328], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const seg2FillWidth = interpolate(frame, [82, 102], [0, 328], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const seg3FillWidth = interpolate(frame, [122, 144], [0, 328], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const segWidths = [seg1FillWidth, seg2FillWidth, seg3FillWidth];

  // Node appearance timings: node 1 at 10, node 2 at 58, node 3 at 98, node 4 at 138
  // (original 8, 46, 76, 108 + ~10f each)
  const NODE_STARTS = [10, 58, 98, 138];

  // Pulse for node 4
  const pulseFrame = frame >= 155 ? (frame - 155) % 36 : 0;
  const pulseScale = frame >= 155
    ? interpolate(pulseFrame, [0, 36], [1.0, 2.0], {
        easing: Easing.out(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  const pulseOpacity = frame >= 155
    ? interpolate(pulseFrame, [0, 36], [0.6, 0], {
        easing: Easing.in(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const bobY = frame >= 155 ? 5 * Math.sin(((frame - 155) / 30) * 2 * Math.PI) : 0;

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

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 170,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily,
          fontWeight: 500,
          fontSize: 56,
          color: "rgba(255,255,255,0.40)",
          opacity: titleOpacity,
          whiteSpace: "nowrap",
        }}
      >
        Le défi en 4 étapes
      </div>

      {/* Rail segments */}
      {SEG_STARTS.map((startX, i) => (
        <div key={`rail-${i}`}>
          <div
            style={{
              position: "absolute",
              left: startX,
              top: Y - 1,
              width: SEG_ENDS[i] - startX,
              height: 2,
              background: "rgba(255,255,255,0.12)",
              borderRadius: 1,
              opacity: railOpacity,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: startX,
              top: Y - 1,
              width: segWidths[i],
              height: 2,
              background:
                i === 2
                  ? "linear-gradient(to right, #3060ff, #FFD700)"
                  : "linear-gradient(to right, #3060ff, #88aaff)",
              borderRadius: 1,
              overflow: "hidden",
            }}
          />
        </div>
      ))}

      {/* Nodes */}
      {STEPS.map((step, i) => {
        const ns = NODE_STARTS[i];
        const ringScale = interpolate(frame, [ns, ns + 18], [0, 1], {
          easing: Easing.out(Easing.back(1.8)),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const ringOpacity = interpolate(frame, [ns, ns + 12], [0, 1], {
          easing: Easing.out(Easing.cubic),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const fillScale = interpolate(frame, [ns + 8, ns + 22], [0, 1], {
          easing: Easing.out(Easing.back(1.5)),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const iconOpacity = interpolate(frame, [ns + 14, ns + 26], [0, 1], {
          easing: Easing.out(Easing.cubic),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const iconScale = interpolate(frame, [ns + 14, ns + 26], [0.5, 1], {
          easing: Easing.out(Easing.back(1.3)),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const labelOpacity = interpolate(frame, [ns + 18, ns + 34], [0, 1], {
          easing: Easing.out(Easing.cubic),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const labelTranslateY = interpolate(frame, [ns + 18, ns + 34], [10, 0], {
          easing: Easing.out(Easing.cubic),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const isLast = i === 3;
        const iconBobY = isLast ? bobY : 0;
        const glowShadow = isLast
          ? "0 0 24px rgba(255,215,0,0.30), 0 0 48px rgba(255,215,0,0.15)"
          : "none";

        return (
          <div key={i}>
            {/* Pulse ring (node 4 only) */}
            {isLast && (
              <div
                style={{
                  position: "absolute",
                  left: step.x,
                  top: Y,
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  border: `2px solid ${step.color}`,
                  transform: `translate(-50%, -50%) scale(${pulseScale})`,
                  opacity: pulseOpacity,
                  pointerEvents: "none",
                }}
              />
            )}

            {/* Ring */}
            <div
              style={{
                position: "absolute",
                left: step.x,
                top: Y,
                width: 96,
                height: 96,
                borderRadius: "50%",
                border: `2.5px solid ${step.color}`,
                background: "transparent",
                transform: `translate(-50%, -50%) scale(${ringScale})`,
                opacity: ringOpacity,
                boxShadow: glowShadow,
              }}
            >
              {/* Fill */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 68,
                  height: 68,
                  borderRadius: "50%",
                  background:
                    isLast
                      ? "rgba(255,215,0,0.18)"
                      : "rgba(48,96,255,0.18)",
                  transform: `translate(-50%, -50%) scale(${fillScale})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Icon */}
                <span
                  style={{
                    fontSize: 30,
                    opacity: iconOpacity,
                    transform: `scale(${iconScale}) translateY(${iconBobY}px)`,
                    display: "inline-block",
                  }}
                >
                  {step.icon}
                </span>
              </div>
            </div>

            {/* Step number */}
            <div
              style={{
                position: "absolute",
                left: step.x,
                top: 448,
                transform: "translateX(-50%)",
                fontFamily,
                fontWeight: 700,
                fontSize: 30,
                color: isLast ? "rgba(255,215,0,0.70)" : "rgba(48,96,255,0.70)",
                opacity: labelOpacity,
                whiteSpace: "nowrap",
              }}
            >
              {step.num}
            </div>

            {/* Label */}
            <div
              style={{
                position: "absolute",
                left: step.x,
                top: 648,
                width: 220,
                transform: `translateX(-50%) translateY(${labelTranslateY}px)`,
                fontFamily,
                fontWeight: 600,
                fontSize: 50,
                color: "#FFFFFF",
                opacity: labelOpacity,
                textAlign: "center",
                wordWrap: "break-word",
              }}
            >
              {step.label}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
