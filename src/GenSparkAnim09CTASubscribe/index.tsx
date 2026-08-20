import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
});

const ThumbSVG: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
  </svg>
);

const BellSVG: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
  </svg>
);

const CursorSVG: React.FC = () => (
  <svg width={24} height={32} viewBox="0 0 24 32" fill="none">
    <path d="M0 0L0 22L6 17L10 26L13 25L9 16L16 16L0 0Z" fill="white" stroke="black" strokeWidth={1} />
  </svg>
);

export const GenSparkAnim09CTASubscribe: React.FC = () => {
  const frame = useCurrentFrame();

  // All timings shifted +20f relative to original
  const titleOpacity = interpolate(frame, [20, 35], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- SUBSCRIBE BUTTON ---
  const buttonOpacity = interpolate(frame, [20, 32], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const buttonTranslateY = interpolate(frame, [20, 32], [14, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const hoverScale = interpolate(frame, [44, 48], [1.0, 1.03], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const clickScale = interpolate(frame, [48, 52], [1.03, 0.94], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bounceScale = interpolate(frame, [52, 65], [0.94, 1.0], {
    easing: Easing.out(Easing.back(2.5)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  let btnScale = 1.0;
  if (frame >= 44 && frame < 48) btnScale = hoverScale;
  else if (frame >= 48 && frame < 52) btnScale = clickScale;
  else if (frame >= 52 && frame < 65) btnScale = bounceScale;

  const colorProgress = interpolate(frame, [50, 62], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const btnG = Math.round(interpolate(colorProgress, [0, 1], [255, 0]));
  const btnB = Math.round(interpolate(colorProgress, [0, 1], [255, 0]));
  const btnA = interpolate(colorProgress, [0, 1], [0.12, 1]);
  const btnBg = `rgba(255, ${btnG}, ${btnB}, ${btnA})`;
  const textOpacity = interpolate(frame, [50, 62], [0.7, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rippleScale = interpolate(frame, [49, 64], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rippleOpacity = interpolate(frame, [49, 64], [0.4, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cursor
  const cursorX = interpolate(frame, [35, 48], [760, 730], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursorY = interpolate(frame, [35, 48], [460, 530], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursorOpacity = interpolate(frame, [35, 42, 58, 68], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursorClickScale = interpolate(frame, [48, 51], [1.0, 0.85], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subscribe label
  const subscribeLabelOpacity = interpolate(frame, [62, 74], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subscribeLabelY = interpolate(frame, [62, 74], [8, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- THUMB ---
  const thumbContainerOpacity = interpolate(frame, [58, 70], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const thumbContainerScale = interpolate(frame, [58, 70], [0.7, 1.0], {
    easing: Easing.out(Easing.back(1.5)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fillProgress = interpolate(frame, [70, 88], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const clipY = 60 * (1 - fillProgress);
  const containerBgProgress = interpolate(frame, [70, 88], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const thumbBgA = interpolate(containerBgProgress, [0, 1], [0.08, 0.2]);

  let thumbIconScale = 1.0;
  if (frame >= 88 && frame < 92) {
    thumbIconScale = interpolate(frame, [88, 92], [1.0, 1.25], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (frame >= 92 && frame < 100) {
    thumbIconScale = interpolate(frame, [92, 100], [1.25, 1.0], {
      easing: Easing.out(Easing.back(2.0)),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  const LIKE_OFFSETS = [[-60, -60], [60, -60], [-60, 60], [60, 60]];
  const thumbLabelOpacity = interpolate(frame, [90, 102], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const thumbLabelY = interpolate(frame, [90, 102], [8, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- BELL ---
  const bellContainerOpacity = interpolate(frame, [82, 94], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bellContainerScale = interpolate(frame, [82, 96], [0.7, 1.0], {
    easing: Easing.out(Easing.back(1.5)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bellColorProgress = interpolate(frame, [92, 102], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bellColor = bellColorProgress > 0
    ? `rgba(255,${Math.round(interpolate(bellColorProgress, [0, 1], [255, 185]))},0,${interpolate(bellColorProgress, [0, 1], [0.4, 1])})`
    : "rgba(255,255,255,0.40)";

  const shakeFrame = Math.max(0, frame - 98);
  const shakeAmplitude = interpolate(Math.min(shakeFrame, 24), [0, 24], [22, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bellRotation = frame >= 98 ? shakeAmplitude * Math.sin((shakeFrame / 8) * 2 * Math.PI) : 0;

  const wave1Opacity = interpolate(frame, [100, 104, 114], [0, 0.8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wave1Scale = interpolate(frame, [100, 114], [0.5, 1.3], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wave2Opacity = interpolate(frame, [108, 112, 125], [0, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wave2Scale = interpolate(frame, [108, 125], [0.5, 1.4], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const notifBadgeScale = interpolate(frame, [96, 104], [0, 1], {
    easing: Easing.out(Easing.back(2.5)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bellLabelOpacity = interpolate(frame, [102, 114], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bellLabelY = interpolate(frame, [102, 114], [8, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000000" }}>
      <AuroraBackground />

      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 1600px 900px at center, transparent 60%, rgba(0,0,0,0.5) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 350,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily,
          fontWeight: 500,
          fontSize: 48,
          color: "rgba(255,255,255,0.40)",
          opacity: titleOpacity,
          whiteSpace: "nowrap",
        }}
      >
        Rejoins la communauté
      </div>

      {/* Group */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 200,
        }}
      >
        {/* SUBSCRIBE BUTTON */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 300,
              height: 80,
              borderRadius: 40,
              background: btnBg,
              border: `2px solid ${colorProgress > 0.5 ? "#FF0000" : "rgba(255,255,255,0.25)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              position: "relative",
              opacity: buttonOpacity,
              transform: `translateY(${buttonTranslateY}px) scale(${btnScale})`,
            }}
          >
            <span
              style={{
                fontFamily,
                fontWeight: 700,
                fontSize: 34,
                color: "#FFFFFF",
                opacity: textOpacity,
                position: "relative",
                zIndex: 2,
              }}
            >
              S&apos;abonner
            </span>
            {/* Ripple */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 360 * rippleScale,
                height: 360 * rippleScale,
                transform: "translate(-50%, -50%)",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.6)",
                opacity: rippleOpacity,
                pointerEvents: "none",
              }}
            />
          </div>
          <div
            style={{
              fontFamily,
              fontWeight: 600,
              fontSize: 30,
              color: "#FF0000",
              opacity: subscribeLabelOpacity,
              transform: `translateY(${subscribeLabelY}px)`,
            }}
          >
            Abonné ✓
          </div>
        </div>

        {/* THUMB */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <div
            style={{
              position: "relative",
              width: 130,
              height: 130,
              borderRadius: "50%",
              background: `rgba(29,155,240,${thumbBgA})`,
              border: "1.5px solid rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: thumbContainerOpacity,
              transform: `scale(${thumbContainerScale})`,
            }}
          >
            {/* Like particles */}
            {LIKE_OFFSETS.map(([ox, oy], i) => {
              const pProgress = interpolate(frame, [88, 104], [0, 1], {
                easing: Easing.out(Easing.cubic),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const pOpacity = interpolate(frame, [88, 95, 104], [0, 0.9, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const pScale = interpolate(frame, [88, 93, 104], [0, 1, 0.3], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#1D9BF0",
                    opacity: pOpacity,
                    transform: `translate(calc(-50% + ${ox * pProgress}px), calc(-50% + ${oy * pProgress}px)) scale(${pScale})`,
                    pointerEvents: "none",
                  }}
                />
              );
            })}
            {/* Grey thumb (base) */}
            <div style={{ position: "absolute" }}>
              <ThumbSVG color="rgba(255,255,255,0.40)" size={60} />
            </div>
            {/* Blue thumb (clip fill) */}
            <div
              style={{
                position: "absolute",
                clipPath: `inset(${clipY}px 0 0 0)`,
                transform: `scale(${thumbIconScale})`,
              }}
            >
              <ThumbSVG color="#1D9BF0" size={60} />
            </div>
          </div>
          <div
            style={{
              fontFamily,
              fontWeight: 600,
              fontSize: 30,
              color: "#1D9BF0",
              opacity: thumbLabelOpacity,
              transform: `translateY(${thumbLabelY}px)`,
            }}
          >
            Liké ✓
          </div>
        </div>

        {/* BELL */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <div
            style={{
              position: "relative",
              width: 130,
              height: 130,
              borderRadius: "50%",
              background: `rgba(255,185,0,${interpolate(bellColorProgress, [0, 1], [0.08, 0.2])})`,
              border: `1.5px solid rgba(255,185,0,${interpolate(bellColorProgress, [0, 1], [0.15, 0.4])})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: bellContainerOpacity,
              transform: `scale(${bellContainerScale})`,
            }}
          >
            {/* Sound waves */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(42px, -50%) scale(${wave1Scale})`,
                transformOrigin: "left center",
                opacity: wave1Opacity,
                pointerEvents: "none",
              }}
            >
              <svg width={60} height={60} viewBox="0 0 60 60" fill="none">
                <path d="M10 30 Q24 12, 38 30 Q24 48, 10 30" stroke="#FFB900" strokeWidth={2.5} fill="none" />
              </svg>
            </div>
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(55px, -50%) scale(${wave2Scale})`,
                transformOrigin: "left center",
                opacity: wave2Opacity,
                pointerEvents: "none",
              }}
            >
              <svg width={72} height={72} viewBox="0 0 72 72" fill="none">
                <path d="M10 36 Q28 10, 46 36 Q28 62, 10 36" stroke="#FFB900" strokeWidth={2} fill="none" />
              </svg>
            </div>

            {/* Notification badge */}
            <div
              style={{
                position: "absolute",
                top: -8,
                right: -8,
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#FF0000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${notifBadgeScale})`,
                zIndex: 10,
              }}
            >
              <span style={{ fontFamily, fontWeight: 700, fontSize: 18, color: "#fff" }}>1</span>
            </div>

            {/* Bell icon */}
            <div
              style={{
                transform: `rotate(${bellRotation}deg)`,
                transformOrigin: "center top",
              }}
            >
              <BellSVG color={bellColor} size={60} />
            </div>
          </div>
          <div
            style={{
              fontFamily,
              fontWeight: 600,
              fontSize: 30,
              color: "#FFB900",
              opacity: bellLabelOpacity,
              transform: `translateY(${bellLabelY}px)`,
              whiteSpace: "nowrap",
            }}
          >
            Notif activée ✓
          </div>
        </div>
      </div>

      {/* Cursor */}
      <div
        style={{
          position: "absolute",
          left: cursorX,
          top: cursorY,
          opacity: cursorOpacity,
          transform: `scale(${cursorClickScale})`,
          pointerEvents: "none",
        }}
      >
        <CursorSVG />
      </div>
    </AbsoluteFill>
  );
};
