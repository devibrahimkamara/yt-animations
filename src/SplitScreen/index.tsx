import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const splitScreenSchema = z.object({
  leftTitle: z.string(),
  leftItems: z.array(z.string()),
  rightTitle: z.string(),
  rightItems: z.array(z.string()),
  leftIsNegative: z.boolean().default(true),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(5),
});

export type SplitScreenProps = z.infer<typeof splitScreenSchema>;

const Panel: React.FC<{
  title: string;
  items: string[];
  isNegative: boolean;
  translateX: number;
  opacity: number;
  accentColor: string;
  frame: number;
}> = ({ title, items, isNegative, translateX, opacity, accentColor, frame }) => {
  const panelColor = isNegative
    ? "linear-gradient(135deg, rgba(80,20,20,0.55), rgba(40,10,10,0.45))"
    : "linear-gradient(135deg, rgba(10,50,20,0.55), rgba(5,30,10,0.45))";
  const borderColor = isNegative ? "rgba(255,80,80,0.2)" : "rgba(80,255,120,0.2)";
  const glowColor = isNegative ? "#ff4040" : "#40ff80";
  const icon = isNegative ? "❌" : "✅";

  return (
    <div style={{
      flex: 1,
      height: 520,
      borderRadius: 28,
      background: panelColor,
      border: `1px solid ${borderColor}`,
      boxShadow: `0 0 60px ${glowColor}20`,
      padding: 60,
      display: "flex",
      flexDirection: "column",
      gap: 24,
      opacity,
      transform: `translateX(${translateX}px)`,
    }}>
      {/* Titre du panneau */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontSize: 52 }}>{icon}</span>
        <span style={{
          fontFamily,
          fontWeight: 800,
          fontSize: 42,
          color: isNegative ? "rgba(255,130,130,0.95)" : "rgba(130,255,160,0.95)",
          lineHeight: 1.2,
        }}>
          {title}
        </span>
      </div>

      {/* Séparateur */}
      <div style={{ height: 1, background: borderColor }} />

      {/* Items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {items.map((item, i) => {
          const itemOpacity = interpolate(frame, [20 + i * 8, 35 + i * 8], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          const itemX = interpolate(frame, [20 + i * 8, 35 + i * 8], [isNegative ? -20 : 20, 0], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
          });
          return (
            <div key={i} style={{
              opacity: itemOpacity,
              transform: `translateX(${itemX}px)`,
              fontFamily,
              fontWeight: 600,
              fontSize: 34,
              color: "rgba(255,255,255,0.85)",
            }}>
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const SplitScreen: React.FC<SplitScreenProps> = ({
  leftTitle,
  leftItems,
  rightTitle,
  rightItems,
  leftIsNegative,
  accentColor,
  durationSecs,
}) => {
  const frame = useCurrentFrame();

  const leftX = interpolate(frame, [0, 20], [-120, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });
  const rightX = interpolate(frame, [0, 20], [120, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });

  // Ligne de séparation
  const lineProgress = interpolate(frame, [15, 35], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />
      <AbsoluteFill style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0, width: "100%", maxWidth: 1600 }}>

          {/* Panneau gauche */}
          <Panel
            title={leftTitle}
            items={leftItems}
            isNegative={leftIsNegative}
            translateX={leftX}
            opacity={opacity}
            accentColor={accentColor}
            frame={frame}
          />

          {/* Séparateur lumineux */}
          <div style={{ width: 60, display: "flex", justifyContent: "center", flexShrink: 0 }}>
            <svg width={4} height={440} viewBox="0 0 4 440">
              <defs>
                <linearGradient id="sepGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(136,170,255,0)" />
                  <stop offset="50%" stopColor="rgba(136,170,255,0.8)" />
                  <stop offset="100%" stopColor="rgba(136,170,255,0)" />
                </linearGradient>
              </defs>
              <rect
                x={0} y={0}
                width={4}
                height={440 * lineProgress}
                rx={2}
                fill="url(#sepGrad)"
              />
            </svg>
          </div>

          {/* Panneau droit */}
          <Panel
            title={rightTitle}
            items={rightItems}
            isNegative={!leftIsNegative}
            translateX={rightX}
            opacity={opacity}
            accentColor={accentColor}
            frame={frame}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
