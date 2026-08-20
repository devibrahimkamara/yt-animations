import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";
import { GensparkIcon } from "../components/GensparkLogo";

const BAR_W = 1100;
const BAR_H = 80;

export const GenSparkAnim04Comparison: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rowsOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const gensparkProgress = interpolate(frame, [15, 55], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const othersProgress = interpolate(frame, [55, 140], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const label1 = spring({
    frame: Math.max(0, frame - 55),
    fps,
    config: { mass: 0.5, damping: 12, stiffness: 250 },
    from: 0,
    to: 1,
  });

  const label2 = spring({
    frame: Math.max(0, frame - 140),
    fps,
    config: { mass: 0.5, damping: 12, stiffness: 250 },
    from: 0,
    to: 1,
  });

  const gensparkGlow =
    gensparkProgress > 0 && gensparkProgress < 100
      ? `${(BAR_W * gensparkProgress) / 100}px 0 20px rgba(96,165,250,0.8)`
      : "none";

  const rowStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 24,
    padding: "32px 40px",
    display: "flex",
    flexDirection: "column" as const,
    gap: 18,
    opacity: rowsOpacity,
  };

  return (
    <AbsoluteFill>
      <AuroraBackground />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 140,
        }}
      >
        {/* GenSpark row */}
        <div style={rowStyle}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <GensparkIcon size={50} />
            <span
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontSize: 44,
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "-0.01em",
              }}
            >
              Genspark
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
            <div
              style={{
                width: BAR_W,
                height: BAR_H,
                borderRadius: 40,
                background: "rgba(255,255,255,0.08)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${gensparkProgress}%`,
                  borderRadius: 40,
                  background: "linear-gradient(90deg, #60a5fa, #34d399)",
                  boxShadow: gensparkGlow,
                }}
              />
            </div>
            <div
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontSize: 64,
                fontWeight: 800,
                color: "#ffffff",
                opacity: label1,
                transform: `scale(${label1})`,
                minWidth: 230,
                whiteSpace: "nowrap" as const,
              }}
            >
              ⚡ 12 mois
            </div>
          </div>
        </div>

        {/* Others row */}
        <div style={rowStyle}>
          <div
            style={{
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontSize: 44,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.01em",
            }}
          >
            Autres applications
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
            <div
              style={{
                width: BAR_W,
                height: BAR_H,
                borderRadius: 40,
                background: "rgba(255,255,255,0.08)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${othersProgress}%`,
                  borderRadius: 40,
                  background: "linear-gradient(90deg, #64748B, #475569)",
                }}
              />
            </div>
            <div
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontSize: 60,
                fontWeight: 800,
                color: "rgba(255,255,255,0.45)",
                opacity: label2,
                transform: `scale(${label2})`,
                minWidth: 230,
                whiteSpace: "nowrap" as const,
              }}
            >
              3 à 5 ans
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
