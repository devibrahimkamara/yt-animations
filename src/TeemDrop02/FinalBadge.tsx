import { useCurrentFrame, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["600", "700"], subsets: ["latin"] });

const APPEAR_FRAME = 145;

export const FinalBadge: React.FC = () => {
  const frame = useCurrentFrame();
  const elapsed = frame - APPEAR_FRAME;

  if (elapsed < 0) return null;

  const scale = spring({ frame: elapsed, fps: 30, config: { damping: 8, stiffness: 180 } });
  const rotate = interpolate(elapsed, [0, 20], [-5, 0], { extrapolateRight: "clamp" });
  const opacity = interpolate(elapsed, [0, 6], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 180,
        left: "50%",
        transform: `translateX(-50%) scale(${scale}) rotate(${rotate}deg)`,
        transformOrigin: "center bottom",
        opacity,
        display: "flex",
        alignItems: "center",
        gap: 16,
        background: "rgba(16,185,129,0.12)",
        border: "1.5px solid #10B981",
        borderRadius: 20,
        padding: "18px 32px",
        backdropFilter: "blur(12px)",
        minWidth: 320,
      }}
    >
      {/* BadgeCheck icon */}
      <svg
        viewBox="0 0 24 24"
        width={36}
        height={36}
        fill="none"
        stroke="#10B981"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0 }}
      >
        <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>

      {/* Text */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontFamily, fontWeight: 700, fontSize: 22, color: "#FFFFFF", lineHeight: 1.2 }}>
          Premier client
        </span>
        <span style={{ fontFamily, fontWeight: 600, fontSize: 16, color: "#10B981", lineHeight: 1.2 }}>
          Objectif atteint ✓
        </span>
      </div>
    </div>
  );
};
