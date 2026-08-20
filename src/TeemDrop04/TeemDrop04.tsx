import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "800"], subsets: ["latin"] });

export const teemDrop04Schema = z.object({});
export type TeemDrop04Props = z.infer<typeof teemDrop04Schema>;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const BLOBS = [
  { color: "rgba(20,60,220,0.20)", x: 18, y: 22, size: 580, blur: 120, phase: 0.0 },
  { color: "rgba(48,96,255,0.17)", x: 78, y: 68, size: 520, blur: 140, phase: 2.2 },
  { color: "rgba(10,30,160,0.22)", x: 50, y: 88, size: 680, blur: 130, phase: 4.4 },
];

export const TeemDrop04: React.FC<TeemDrop04Props> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame * 0.006;

  // ── Phase 1: Thumb enters from below ──────────────────────────────────────
  const thumbElapsed = Math.max(0, frame);
  const thumbSpring = spring({ frame: thumbElapsed, fps, config: { damping: 14, stiffness: 120 } });
  const thumbY = interpolate(thumbSpring, [0, 1], [80, 0]);
  const thumbOpacity = interpolate(frame, [0, 10], [0, 1], clamp);

  // Halo appears with thumb
  const haloOpacity = interpolate(frame, [0, 20], [0, 0.6], clamp);

  // ── Phase 2: Fill gauge f20→f68 ───────────────────────────────────────────
  const fillHeight = interpolate(frame, [20, 68], [0, 220], {
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    ...clamp,
  });

  const percent = Math.round(interpolate(frame, [20, 68], [0, 100], clamp));

  // Rail fill height
  const railFill = interpolate(frame, [20, 68], [0, 180], {
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    ...clamp,
  });

  // Vibration at f44
  const vibrationX = frame >= 42 && frame <= 50
    ? Math.sin((frame - 44) * 2.5) * 4
    : 0;

  // ── Phase 3: Impact 100% at f68 ───────────────────────────────────────────
  const impactElapsed = Math.max(0, frame - 68);
  const impactSpring = spring({ frame: impactElapsed, fps, config: { damping: 8, stiffness: 200 } });
  const impactScale = frame >= 68 ? interpolate(impactSpring, [0, 1], [1, 1.12]) : 1;

  const flashOpacity = interpolate(frame, [68, 69, 72, 73], [0, 0.12, 0.12, 0], clamp);

  // Two expanding rings
  const ring1Progress = interpolate(frame, [68, 82], [0, 1], clamp);
  const ring1R = interpolate(ring1Progress, [0, 1], [110, 220]);
  const ring1Opacity = interpolate(ring1Progress, [0, 1], [0.4, 0]);

  const ring2Progress = interpolate(frame, [74, 88], [0, 1], clamp);
  const ring2R = interpolate(ring2Progress, [0, 1], [110, 220]);
  const ring2Opacity = interpolate(ring2Progress, [0, 1], [0.4, 0]);

  // Rail fades out
  const railOpacity = interpolate(frame, [68, 78], [1, 0], clamp);

  // ── Phase 4: CTA text f75→f90 ─────────────────────────────────────────────
  const ctaElapsed = Math.max(0, frame - 75);
  const ctaSpring = spring({ frame: ctaElapsed, fps, config: { damping: 12, stiffness: 160 } });
  const ctaX = interpolate(ctaSpring, [0, 1], [300, 0]);
  const ctaOpacity = interpolate(frame, [75, 80], [0, 1], clamp);

  const subtitleOpacity = interpolate(frame, [80, 86], [0, 1], clamp);
  const chevronPulse = frame >= 78 ? 1 + Math.sin((frame - 78) / 15) * 0.08 : 1;

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily }}>
      {/* Background */}
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse at center, #0F172A 0%, #020617 100%)",
      }} />

      {/* Aurora blobs */}
      {BLOBS.map((b, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${b.x}%`,
          top: `${b.y}%`,
          width: b.size + Math.sin(t + b.phase) * 30,
          height: b.size + Math.sin(t + b.phase + 1) * 30,
          borderRadius: "50%",
          background: b.color,
          filter: `blur(${b.blur}px)`,
          transform: "translate(-50%, -50%)",
        }} />
      ))}

      {/* Flash overlay */}
      <AbsoluteFill style={{
        background: `rgba(255,255,255,${flashOpacity})`,
        pointerEvents: "none",
      }} />

      {/* Rail vertical (left of thumb) */}
      <div style={{
        position: "absolute",
        left: 856,
        top: 430,
        width: 6,
        height: 180,
        borderRadius: 3,
        background: "#1E293B",
        opacity: railOpacity,
      }}>
        <div style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: railFill,
          borderRadius: 3,
          background: "linear-gradient(to top, #3060ff, #6080ff)",
        }} />
      </div>

      {/* Thumb SVG + fill gauge */}
      <div style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(-50%, calc(-50% + ${thumbY}px)) translateX(${vibrationX}px) scale(${impactScale})`,
        opacity: thumbOpacity,
      }}>
        {/* Halo */}
        <div style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 280,
          height: 280,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(48,96,255,0.25) 0%, transparent 70%)",
          opacity: haloOpacity,
          pointerEvents: "none",
        }} />

        {/* Expanding rings */}
        <svg width={500} height={500} style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          overflow: "visible",
          pointerEvents: "none",
        }}>
          <circle cx={250} cy={250} r={ring1R} fill="none"
            stroke="#3060ff" strokeWidth={2} opacity={ring1Opacity} />
          <circle cx={250} cy={250} r={ring2R} fill="none"
            stroke="#3060ff" strokeWidth={1.5} opacity={ring2Opacity} />
        </svg>

        {/* Thumb SVG with fill clipPath */}
        <svg width={220} height={220} viewBox="0 0 220 220" style={{ display: "block" }}>
          <defs>
            <clipPath id="fillClip">
              <rect x="0" y={220 - fillHeight} width="220" height={fillHeight} />
            </clipPath>
          </defs>

          {/* Outline (unfilled) thumb */}
          <g opacity={0.25}>
            <path
              d="M110 195 C80 195 55 178 42 155 C28 130 30 100 40 80
                 L60 40 C64 32 72 28 80 32 C88 36 90 46 87 56
                 L80 80 L155 80 C165 80 172 87 172 97 C172 104 168 110 162 113
                 C170 116 175 124 175 133 C175 142 169 150 161 153
                 C165 157 167 163 167 170 C167 181 159 190 148 190
                 L110 195 Z"
              fill="none"
              stroke="#3060ff"
              strokeWidth={4}
            />
            <rect x={38} y={80} width={22} height={115} rx={11}
              fill="none" stroke="#3060ff" strokeWidth={4} />
          </g>

          {/* Filled thumb */}
          <g clipPath="url(#fillClip)">
            <path
              d="M110 195 C80 195 55 178 42 155 C28 130 30 100 40 80
                 L60 40 C64 32 72 28 80 32 C88 36 90 46 87 56
                 L80 80 L155 80 C165 80 172 87 172 97 C172 104 168 110 162 113
                 C170 116 175 124 175 133 C175 142 169 150 161 153
                 C165 157 167 163 167 170 C167 181 159 190 148 190
                 L110 195 Z"
              fill="#3060ff"
            />
            <rect x={38} y={80} width={22} height={115} rx={11}
              fill="#3060ff" />
          </g>
        </svg>

        {/* Percent counter */}
        <div style={{
          textAlign: "center",
          marginTop: 16,
          fontSize: 48,
          fontWeight: 800,
          color: "#FFFFFF",
          letterSpacing: "-0.02em",
          fontFamily,
        }}>
          {percent}%
        </div>
      </div>

      {/* CTA text block */}
      <div style={{
        position: "absolute",
        left: "50%",
        top: "73%",
        transform: `translateX(calc(-50% + ${ctaX}px))`,
        opacity: ctaOpacity,
        textAlign: "center",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          justifyContent: "center",
        }}>
          {/* Chevron */}
          <span style={{
            fontSize: 72,
            color: "#3060ff",
            fontWeight: 800,
            display: "inline-block",
            transform: `scale(${chevronPulse})`,
            lineHeight: 1,
          }}>›</span>

          <div>
            <div style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "0.04em",
              fontFamily,
              lineHeight: 1,
            }}>
              ABONNE-TOI
            </div>

            <div style={{
              fontSize: 28,
              fontWeight: 400,
              color: "#94A3B8",
              marginTop: 8,
              fontFamily,
              opacity: subtitleOpacity,
            }}>
              si c'est pas déjà fait
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
