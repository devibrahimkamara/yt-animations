import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const APPEAR_FRAME = 100;
const HALO_START   = 115;
const HALO_END     = 150;
const SCREEN_ON    = 130;

const W = 300;
const H = 620;

export const IPhoneReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance: smooth premium spring (no overshoot)
  const appearProgress = spring({
    frame: Math.max(0, frame - APPEAR_FRAME),
    fps,
    config: { damping: 200, stiffness: 100 },
  });
  const scale = interpolate(appearProgress, [0, 1], [0.7, 1], { extrapolateRight: "clamp" });
  const opacity = interpolate(appearProgress, [0, 0.15], [0, 1], { extrapolateRight: "clamp" });

  // Halo glow
  const haloOpacity = interpolate(frame, [HALO_START, HALO_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const haloSize = interpolate(frame, [HALO_START, HALO_END], [180, 480], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Screen lights up
  const screenOn = interpolate(frame, [SCREEN_ON, SCREEN_ON + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
    }}>
      <div style={{ position: "relative", width: W, height: H, opacity, transform: `scale(${scale})` }}>

        {/* Outer diffuse halo */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: haloSize,
          height: haloSize,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(48,96,255,0.32) 0%, rgba(136,170,255,0.14) 45%, transparent 70%)",
          filter: "blur(32px)",
          opacity: haloOpacity,
        }} />

        {/* Inner tighter halo */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: haloSize * 0.55,
          height: haloSize * 0.55,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(136,170,255,0.28) 0%, transparent 60%)",
          filter: "blur(18px)",
          opacity: haloOpacity,
        }} />

        {/* iPhone chassis */}
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: 44,
          border: "4px solid #8E8E93",
          background: "linear-gradient(145deg, #3a3a3c 0%, #1c1c1e 45%, #2c2c2e 100%)",
          boxShadow: [
            "0 30px 80px rgba(0,0,0,0.75)",
            "0 0 0 1px rgba(255,255,255,0.07)",
            "inset 0 1px 0 rgba(255,255,255,0.10)",
          ].join(", "),
          overflow: "hidden",
        }}>
          {/* Screen bezel */}
          <div style={{
            position: "absolute",
            top: 8,
            left: 6,
            right: 6,
            bottom: 8,
            borderRadius: 38,
            overflow: "hidden",
            background: "#000",
          }}>
            {/* Screen content — off state shows nothing, on state shows blue gradient */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, #1a3a8f 0%, #3060ff 58%, #88aaff 100%)",
              opacity: screenOn,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              {/* App icon */}
              <div style={{
                width: 76,
                height: 76,
                borderRadius: 18,
                background: "rgba(255,255,255,0.18)",
                border: "1.5px solid rgba(255,255,255,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 34,
                boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
              }}>📱</div>
            </div>
          </div>

          {/* Dynamic Island */}
          <div style={{
            position: "absolute",
            top: 18,
            left: "50%",
            transform: "translateX(-50%)",
            width: 120,
            height: 34,
            background: "#000",
            borderRadius: 17,
            zIndex: 10,
          }} />

          {/* Power button (right side) */}
          <div style={{
            position: "absolute",
            right: -5,
            top: 130,
            width: 4,
            height: 52,
            background: "#636366",
            borderRadius: "0 3px 3px 0",
          }} />

          {/* Volume buttons (left side) */}
          {([104, 152, 200] as number[]).map((top, i) => (
            <div key={i} style={{
              position: "absolute",
              left: -5,
              top,
              width: 4,
              height: i === 0 ? 32 : 44,
              background: "#636366",
              borderRadius: "3px 0 0 3px",
            }} />
          ))}

          {/* Glass sheen diagonal */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 48%)",
            pointerEvents: "none",
          }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
