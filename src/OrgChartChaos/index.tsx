import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const orgChartChaosSchema = z.object({
  centerLabel: z.string().default("IBRAHIM"),
  nodes: z.array(z.object({ label: z.string(), emoji: z.string() })).default([
    { label: "Monteur", emoji: "🎬" },
    { label: "Assistant", emoji: "👤" },
    { label: "Client", emoji: "💼" },
    { label: "Marques", emoji: "🏷️" },
    { label: "Comptabilité", emoji: "📊" },
  ]),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(7),
});

export type OrgChartChaosProps = z.infer<typeof orgChartChaosSchema>;

// Node positions (relative to center 0,0), radius ~260
const NODE_ANGLES = [270, 342, 54, 126, 198]; // degrees
const RADIUS = 270;

function polarToCart(angle: number, r: number): [number, number] {
  const rad = (angle * Math.PI) / 180;
  return [Math.cos(rad) * r, Math.sin(rad) * r];
}

export const OrgChartChaos: React.FC<OrgChartChaosProps> = ({
  centerLabel, nodes, accentColor, durationSecs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: chaos (0-60f)
  // Phase 2: button (60-90f)
  // Phase 3: order (90-end)
  const phase1End = 60;
  const phase2End = 90;

  const isChaos = frame < phase1End;
  const isOrdered = frame >= phase2End;

  // Center node
  const centerScale = spring({ frame, fps, config: { mass: 0.5, damping: 12, stiffness: 180 }, from: 0, to: 1 });
  const centerOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Button
  const btnScale = spring({ frame: Math.max(0, frame - phase1End), fps, config: { mass: 0.4, damping: 9, stiffness: 260 }, from: 0, to: 1 });
  const btnOpacity = interpolate(frame, [phase1End, phase1End + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });
  const btnClicked = frame >= phase1End + 15;
  const btnClickScale = btnClicked ? spring({ frame: Math.max(0, frame - (phase1End + 15)), fps, config: { mass: 0.3, damping: 8, stiffness: 400 }, from: 1.2, to: 1 }) : 1;

  // Order phase — nodes snap to clean positions
  const orderProgress = interpolate(frame, [phase2End, phase2End + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />

      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 800, height: 700 }}>

          {/* Lines from center to nodes */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
            {nodes.map((node, i) => {
              const [nx, ny] = polarToCart(NODE_ANGLES[i], RADIUS);
              const cx = 400, cy = 350;

              // Chaos: lines wiggle
              const chaosPhase = frame * 0.08 + i * 1.1;
              const wiggleX = isChaos ? Math.sin(chaosPhase) * 20 : 0;
              const wiggleY = isChaos ? Math.cos(chaosPhase * 0.7) * 15 : 0;

              const endX = cx + nx + wiggleX;
              const endY = cy + ny + wiggleY;

              const lineOpacity = interpolate(frame, [6 + i * 5, 18 + i * 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const lineColor = isOrdered
                ? accentColor
                : isChaos
                ? `rgba(239,68,68,${0.5 + 0.3 * Math.abs(Math.sin(frame * 0.1 + i))})`
                : "rgba(239,68,68,0.5)";

              return (
                <g key={i}>
                  <line
                    x1={cx} y1={cy} x2={endX} y2={endY}
                    stroke={lineColor} strokeWidth={isOrdered ? 2 : 1.5}
                    opacity={lineOpacity}
                    strokeDasharray={isOrdered ? "none" : isChaos ? "none" : "4,4"}
                  />
                  {/* Arrowhead for ordered */}
                  {isOrdered && (
                    <polygon
                      points={`${endX},${endY} ${endX - 8},${endY - 4} ${endX - 8},${endY + 4}`}
                      fill={accentColor}
                      opacity={orderProgress}
                      transform={`rotate(${NODE_ANGLES[i]}, ${endX}, ${endY})`}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Center node */}
          <div style={{
            position: "absolute",
            left: "50%", top: "50%",
            transform: `translate(-50%, -50%) scale(${centerScale})`,
            opacity: centerOpacity,
            background: `linear-gradient(135deg, ${accentColor}60, rgba(80,130,255,0.4))`,
            border: `2px solid ${accentColor}80`,
            borderRadius: 20,
            padding: "16px 32px",
            boxShadow: `0 0 40px ${accentColor}40`,
            zIndex: 10,
          }}>
            <div style={{ fontFamily, fontWeight: 800, fontSize: 26, color: "#fff", letterSpacing: "0.06em" }}>
              {centerLabel}
            </div>
          </div>

          {/* Peripheral nodes */}
          {nodes.map((node, i) => {
            const [nx, ny] = polarToCart(NODE_ANGLES[i], RADIUS);

            // Chaos wiggle
            const chaosPhase = frame * 0.08 + i * 1.1;
            const wiggleX = isChaos ? Math.sin(chaosPhase) * 20 : 0;
            const wiggleY = isChaos ? Math.cos(chaosPhase * 0.7) * 15 : 0;

            const nodeOpacity = interpolate(frame, [8 + i * 6, 20 + i * 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const nodeScale = spring({ frame: Math.max(0, frame - (8 + i * 6)), fps, config: { mass: 0.4, damping: 10, stiffness: 240 }, from: 0, to: 1 });

            return (
              <div key={i} style={{
                position: "absolute",
                left: "50%", top: "50%",
                transform: `translate(calc(-50% + ${nx + wiggleX}px), calc(-50% + ${ny + wiggleY}px)) scale(${nodeScale})`,
                opacity: nodeOpacity,
                background: isOrdered
                  ? "linear-gradient(135deg, rgba(10,30,80,0.85), rgba(5,20,50,0.75))"
                  : "rgba(25,15,15,0.8)",
                border: `1.5px solid ${isOrdered ? `${accentColor}50` : "rgba(239,68,68,0.4)"}`,
                borderRadius: 14,
                padding: "12px 20px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: isOrdered ? `0 0 20px ${accentColor}20` : "none",
                transition: "none",
                zIndex: 5,
                whiteSpace: "nowrap",
              }}>
                <span style={{ fontSize: 20 }}>{node.emoji}</span>
                <span style={{ fontFamily, fontWeight: 700, fontSize: 18, color: isOrdered ? "rgba(180,200,255,0.9)" : "rgba(220,180,180,0.8)" }}>
                  {node.label}
                </span>
              </div>
            );
          })}

          {/* AUTOMATISER button */}
          {frame >= phase1End && (
            <div style={{
              position: "absolute",
              bottom: 20, left: "50%",
              transform: `translateX(-50%) scale(${btnScale * btnClickScale})`,
              opacity: btnOpacity,
              background: btnClicked
                ? `linear-gradient(135deg, ${accentColor}, rgba(80,180,255,0.9))`
                : "rgba(10,25,60,0.85)",
              border: `2px solid ${accentColor}`,
              borderRadius: 14,
              padding: "14px 44px",
              cursor: "pointer",
              boxShadow: btnClicked ? `0 0 40px ${accentColor}50` : `0 0 20px ${accentColor}30`,
              zIndex: 20,
            }}>
              <div style={{ fontFamily, fontWeight: 800, fontSize: 24, color: "#fff", letterSpacing: "0.08em" }}>
                {btnClicked ? "✓ AUTOMATISÉ" : "AUTOMATISER"}
              </div>
            </div>
          )}

        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
