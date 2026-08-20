import { AbsoluteFill, Easing, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "800"], subsets: ["latin"] });

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export type ChapterCardProps = {
  stepNumber: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  color: string;
  tag1?: string;
  tag2: string;
  completedSteps: number[];
  frame: number;
  fps: number;
};

export const ChapterCard: React.FC<ChapterCardProps> = ({
  stepNumber,
  totalSteps,
  title,
  subtitle,
  color,
  tag1 = "Étape clé",
  tag2,
  completedSteps,
  frame,
  fps,
}) => {
  const { r, g, b } = hexToRgb(color);

  // ── Phase 0: 6 particles converge f0→f12 ─────────────────────────────────
  const particles = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2;
    const progress = interpolate(frame, [0, 12], [0, 1], clamp);
    const dist = interpolate(progress, [0, 1], [400, 0]);
    const x = 960 + Math.cos(angle) * dist;
    const y = 480 + Math.sin(angle) * dist;
    const opacity = interpolate(frame, [0, 8, 12], [0, 0.8, 0], clamp);
    return { x, y, opacity };
  });

  // Flash init f10
  const flashOpacity = interpolate(frame, [8, 10, 12], [0, 0.08, 0], clamp);

  // ── Phase 1: Card enters from left f12→f45 ────────────────────────────────
  const borderElapsed = Math.max(0, frame - 12);
  const borderSpring = spring({ frame: borderElapsed, fps, config: { damping: 14, stiffness: 200 } });
  const borderScaleY = borderSpring;

  const bodyElapsed = Math.max(0, frame - 18);
  const bodySpring = spring({ frame: bodyElapsed, fps, config: { damping: 18, stiffness: 120, mass: 1.2 } });
  const bodyX = interpolate(bodySpring, [0, 1], [-900, 0]);

  // Sweep f18→f35
  const sweepX = interpolate(frame, [18, 35], [-820, 1640], {
    easing: Easing.bezier(0.4, 0, 0.6, 1),
    ...clamp,
  });
  const sweepOpacity = interpolate(frame, [18, 22, 32, 35], [0, 0.6, 0.6, 0], clamp);

  // ── Phase 2: Step number f28→f50 ──────────────────────────────────────────
  const stepLabelOpacity = interpolate(frame, [28, 34], [0, 1], clamp);

  const numElapsed = Math.max(0, frame - 35);
  const numSpring = spring({ frame: numElapsed, fps, config: { damping: 8, stiffness: 160 } });
  const numScale = interpolate(numSpring, [0, 1], [0.6, 1]);

  const dividerOpacity = interpolate(frame, [42, 48], [0, 1], clamp);

  // ── Phase 3: Title + tags f42→f68 ─────────────────────────────────────────
  const titleElapsed = Math.max(0, frame - 42);
  const titleSpring = spring({ frame: titleElapsed, fps, config: { damping: 16, stiffness: 180 } });
  const titleX = interpolate(titleSpring, [0, 1], [20, 0]);
  const titleOpacity = interpolate(frame, [42, 48], [0, 1], clamp);

  const subtitleOpacity = interpolate(frame, [52, 58], [0, 1], clamp);

  const tag1Elapsed = Math.max(0, frame - 60);
  const tag1Spring = spring({ frame: tag1Elapsed, fps, config: { damping: 14, stiffness: 300 } });
  const tag1Scale = tag1Spring;

  const tag2Elapsed = Math.max(0, frame - 64);
  const tag2Spring = spring({ frame: tag2Elapsed, fps, config: { damping: 14, stiffness: 300 } });
  const tag2Scale = tag2Spring;

  // ── Phase 4: Progress bar f55→f75 ─────────────────────────────────────────
  const progressLabelOpacity = interpolate(frame, [55, 61], [0, 1], clamp);

  // ── Phase 5: Hold pulse f68→f90 ───────────────────────────────────────────
  const currentSegmentPulse = frame >= 68
    ? 1 + Math.sin((frame - 68) / 12) * 0.125
    : 1;
  const borderGlow = frame >= 68
    ? Math.sin((frame - 68) / 15) * 0.5 + 0.5
    : 0;
  const numGlow = frame >= 68
    ? Math.sin((frame - 68) / 15 + 1.2) * 0.5 + 0.5
    : 0;

  // Residual sweep f75→f85
  const resSweepX = interpolate(frame, [75, 85], [-820, 1640], {
    easing: Easing.bezier(0.4, 0, 0.6, 1),
    ...clamp,
  });
  const resSweepOpacity = interpolate(frame, [75, 78, 83, 85], [0, 0.3, 0.3, 0], clamp);

  const cardLeft = 550;
  const cardTop = 370;
  const cardWidth = 820;
  const cardHeight = 340;

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily }}>
      {/* Background */}
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse at center, #0F172A 0%, #020617 100%)",
      }} />

      {/* Background glow matching card color */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 50% 50%, rgba(${r},${g},${b},0.06) 0%, transparent 60%)`,
        pointerEvents: "none",
      }} />

      {/* Init flash */}
      <AbsoluteFill style={{
        background: `rgba(${r},${g},${b},${flashOpacity})`,
        pointerEvents: "none",
      }} />

      {/* Particles */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}>
        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={6} fill={color} opacity={p.opacity} />
        ))}
      </svg>

      {/* Card container */}
      <div style={{
        position: "absolute",
        left: cardLeft,
        top: cardTop,
        width: cardWidth,
        height: cardHeight,
        transform: `translateX(${bodyX}px)`,
        display: "flex",
      }}>
        {/* Left accent border */}
        <div style={{
          width: 6,
          height: cardHeight,
          background: color,
          borderRadius: "3px 0 0 3px",
          transformOrigin: "top",
          transform: `scaleY(${borderScaleY})`,
          boxShadow: `0 0 ${12 + borderGlow * 16}px rgba(${r},${g},${b},${0.4 + borderGlow * 0.4})`,
          flexShrink: 0,
        }} />

        {/* Card body */}
        <div style={{
          flex: 1,
          background: "linear-gradient(135deg, #0D1B2A, #0F2744)",
          borderRadius: "0 16px 16px 0",
          padding: "36px 44px",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          gap: 36,
        }}>
          {/* Sweep */}
          <div style={{
            position: "absolute",
            left: sweepX,
            top: 0,
            width: 40,
            height: "100%",
            background: `linear-gradient(to right, transparent, rgba(${r},${g},${b},${sweepOpacity}), transparent)`,
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute",
            left: resSweepX,
            top: 0,
            width: 30,
            height: "100%",
            background: `linear-gradient(to right, transparent, rgba(${r},${g},${b},${resSweepOpacity}), transparent)`,
            pointerEvents: "none",
          }} />

          {/* Left panel: step number */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 120,
          }}>
            <div style={{
              fontSize: 13,
              fontWeight: 600,
              color,
              letterSpacing: "0.18em",
              textTransform: "uppercase" as const,
              opacity: stepLabelOpacity,
              fontFamily,
            }}>
              ÉTAPE
            </div>
            <div style={{
              fontSize: 96,
              fontWeight: 800,
              color,
              lineHeight: 1,
              fontFamily,
              transform: `scale(${numScale})`,
              textShadow: `0 0 ${20 + numGlow * 20}px rgba(${r},${g},${b},${0.4 + numGlow * 0.5})`,
            }}>
              {stepNumber}
            </div>
            <div style={{
              fontSize: 11,
              color: "#475569",
              fontFamily,
              opacity: stepLabelOpacity,
            }}>
              sur {totalSteps}
            </div>
          </div>

          {/* Vertical divider */}
          <div style={{
            width: 1,
            alignSelf: "stretch",
            background: "rgba(255,255,255,0.08)",
            opacity: dividerOpacity,
            flexShrink: 0,
          }} />

          {/* Right panel: title + tags */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 10,
          }}>
            <div style={{
              fontSize: 44,
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1.1,
              fontFamily,
              transform: `translateX(${titleX}px)`,
              opacity: titleOpacity,
            }}>
              {title}
            </div>

            <div style={{
              fontSize: 22,
              fontWeight: 400,
              color: "#64748B",
              fontFamily,
              opacity: subtitleOpacity,
            }}>
              {subtitle}
            </div>

            {/* Tags */}
            <div style={{
              display: "flex",
              gap: 10,
              marginTop: 4,
            }}>
              <div style={{
                transform: `scale(${tag1Scale})`,
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: `rgba(${r},${g},${b},0.15)`,
                border: `1px solid rgba(${r},${g},${b},0.3)`,
                borderRadius: 8,
                padding: "5px 12px",
                fontSize: 14,
                fontWeight: 600,
                color,
                fontFamily,
              }}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <circle cx={12} cy={12} r={10} />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {tag1}
              </div>

              <div style={{
                transform: `scale(${tag2Scale})`,
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(100,116,139,0.15)",
                border: "1px solid rgba(100,116,139,0.3)",
                borderRadius: 8,
                padding: "5px 12px",
                fontSize: 14,
                fontWeight: 600,
                color: "#94A3B8",
                fontFamily,
              }}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                {tag2}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar section */}
      <div style={{
        position: "absolute",
        left: 556,
        top: 768,
        opacity: progressLabelOpacity,
      }}>
        <div style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#475569",
          letterSpacing: "0.12em",
          textTransform: "uppercase" as const,
          marginBottom: 10,
          fontFamily,
        }}>
          PROGRESSION DE LA VIDÉO
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {Array.from({ length: totalSteps }, (_, i) => {
            const segIdx = i + 1;
            const isCompleted = completedSteps.includes(segIdx);
            const isCurrent = segIdx === stepNumber;
            const isFuture = !isCompleted && !isCurrent;

            const segElapsed = Math.max(0, frame - (55 + i * 3));
            const segSpring = spring({ frame: segElapsed, fps, config: { damping: 16, stiffness: 200 } });

            let bg = "#1E293B";
            let segOpacity = 0.5;
            let glowShadow = "none";
            let segScaleY = 1;

            if (isCompleted) {
              const { r: cr, g: cg, b: cb } = hexToRgb(color);
              bg = `rgba(${cr},${cg},${cb},0.6)`;
              segOpacity = 0.8;
            } else if (isCurrent) {
              bg = color;
              segOpacity = 1;
              segScaleY = currentSegmentPulse;
              glowShadow = `0 0 12px rgba(${r},${g},${b},0.8)`;
            }

            return (
              <div key={i} style={{
                width: 140,
                height: 8,
                borderRadius: 4,
                background: isFuture ? "#1E293B" : bg,
                opacity: isFuture ? 0.5 : segOpacity,
                transform: `scaleX(${segSpring}) scaleY(${segScaleY})`,
                transformOrigin: "left center",
                boxShadow: glowShadow,
              }} />
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
