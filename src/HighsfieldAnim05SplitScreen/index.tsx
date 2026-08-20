import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

export const highsfieldAnim05Schema = z.object({
  accentColor: z.string().default("#ef4444"),
  durationSecs: z.number().default(5),
});

type Props = z.infer<typeof highsfieldAnim05Schema>;

const MINI_AVATAR_COLORS = ["#14A800", "#2D8F5C", "#1B6B47", "#0D4D33", "#145C3D"];
const HEX_MINI = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");

export const HighsfieldAnim05SplitScreen: React.FC<Props> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Phase 1: dividing line (0–18)
  const lineProgress = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const lineH = 600;
  const lineDash = lineH;
  const lineOffset = lineDash * (1 - lineProgress);

  // Phase 2: LEFT side (15–55)
  const leftLabelOp = interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const leftAmountSpring = spring({ frame: frame - 22, fps, config: { mass: 0.5, damping: 10, stiffness: 180 } });

  // Phase 3: RIGHT side (55–95)
  const rightLabelOp = interpolate(frame, [55, 68], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rightAmountSpring = spring({ frame: frame - 62, fps, config: { mass: 0.4, damping: 7, stiffness: 280 } });

  // Phase 4: pulse + arrow (95–125)
  const pulseFactor = frame >= 95
    ? 1 + Math.sin((frame - 95) * 0.2) * 0.04
    : 1;
  const arrowOp = interpolate(frame, [95, 108], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arrowX = interpolate(frame, [95, 110], [-30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const CX = 960;
  const TOP = 240;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity: fadeOut }}>
      <AuroraBackground />

      {/* Background panels */}
      <div style={{
        position: "absolute",
        left: 0, top: 0,
        width: CX, height: 1080,
        background: "rgba(80,10,10,0.22)",
        opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }} />
      <div style={{
        position: "absolute",
        left: CX, top: 0,
        width: CX, height: 1080,
        background: "rgba(10,30,80,0.22)",
        opacity: interpolate(frame, [55, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }} />

      {/* SVG overlays */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="lineGlow5">
            <feGaussianBlur stdDeviation={4} result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Dividing line */}
        <line
          x1={CX} y1={(1080 - lineH) / 2}
          x2={CX} y2={(1080 + lineH) / 2}
          stroke="white" strokeWidth={3}
          strokeDasharray={lineDash} strokeDashoffset={lineOffset}
          filter="url(#lineGlow5)"
        />

        {/* Mini avatars LEFT */}
        {frame >= 25 && MINI_AVATAR_COLORS.map((color, i) => {
          const delay = 28 + i * 7;
          const s = spring({ frame: frame - delay, fps, config: { mass: 0.5, damping: 12, stiffness: 200 } });
          const op = interpolate(frame, [delay, delay + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <circle key={i}
              cx={CX / 2 - 80 + i * 34} cy={680}
              r={22 * s} fill={color} opacity={op}
            />
          );
        })}

        {/* Mini AI hexagon RIGHT */}
        {frame >= 68 && (() => {
          const s = spring({ frame: frame - 68, fps, config: { mass: 0.5, damping: 10, stiffness: 180 } });
          const op = interpolate(frame, [68, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <polygon
              points={HEX_MINI(CX + CX / 2, 680, 30 * s)}
              fill="none" stroke="#3060ff" strokeWidth={3}
              opacity={op}
            />
          );
        })()}

        {/* ">>" arrow */}
        {frame >= 95 && (
          <text
            x={CX + arrowX} y={540 + 14}
            textAnchor="middle"
            fontSize={40}
            fill="rgba(255,255,255,0.6)"
            opacity={arrowOp}
            fontFamily={fontFamily}
            fontWeight={800}
          >
            »
          </text>
        )}
      </svg>

      {/* LEFT text content */}
      <div style={{
        position: "absolute",
        left: 0, top: 0, width: CX, height: 1080,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 24,
      }}>
        <div style={{
          opacity: leftLabelOp,
          fontFamily, fontWeight: 700, fontSize: 34,
          color: "rgba(200,200,200,0.7)",
          letterSpacing: "0.18em", textTransform: "uppercase",
        }}>
          AVANT
        </div>
        <div style={{
          opacity: interpolate(frame, [22, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `scale(${0.7 + leftAmountSpring * 0.3}) scale(${pulseFactor})`,
          fontFamily, fontWeight: 800, fontSize: 48,
          color: "rgba(200,100,100,0.85)",
          letterSpacing: "-0.02em",
        }}>
          60 000 €
        </div>
      </div>

      {/* RIGHT text content */}
      <div style={{
        position: "absolute",
        left: CX, top: 0, width: CX, height: 1080,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 24, paddingTop: TOP - 240,
      }}>
        <div style={{
          opacity: rightLabelOp,
          fontFamily, fontWeight: 700, fontSize: 34,
          color: accentColor,
          letterSpacing: "0.18em", textTransform: "uppercase",
        }}>
          AUJOURD&apos;HUI
        </div>
        <div style={{
          opacity: interpolate(frame, [62, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `scale(${0.6 + rightAmountSpring * 0.55}) scale(${pulseFactor})`,
          fontFamily, fontWeight: 800, fontSize: 54,
          color: "#ffffff",
          letterSpacing: "-0.02em",
          textShadow: "0 0 30px rgba(255,255,255,0.3)",
        }}>
          &lt;100 $/mois
        </div>
      </div>
    </AbsoluteFill>
  );
};
