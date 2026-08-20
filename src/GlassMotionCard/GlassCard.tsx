import { Easing, interpolate, useCurrentFrame } from "remotion";

const CARD_SIZES = {
  default:    { width: 700,  height: 500 },
  wide:       { width: 1100, height: 440 },
  horizontal: { width: 1100, height: 360 },
};

const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const GlassCard: React.FC<{
  layout: "default" | "wide" | "horizontal";
  accentColor: string;
  children: React.ReactNode;
}> = ({ layout, accentColor, children }) => {
  const frame = useCurrentFrame();
  const { width, height } = CARD_SIZES[layout];

  const opacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASING,
  });
  const scale = interpolate(frame, [0, 25], [0.94, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASING,
  });

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width,
        height,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        borderRadius: 28,
        background: `linear-gradient(135deg, rgba(20,40,120,0.55) 0%, rgba(10,20,60,0.45) 100%)`,
        border: `1px solid rgba(80,130,255,0.22)`,
        boxShadow: `0 0 60px ${accentColor}30, 0 0 120px ${accentColor}15, inset 0 1px 0 rgba(255,255,255,0.08)`,
        padding: 48,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: layout === "horizontal" ? "row" : "column",
        gap: 24,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};
