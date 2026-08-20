import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

export const anim05Schema = z.object({
  centerLabel: z.string().default("Mon business"),
  branches: z.array(z.object({ label: z.string(), emoji: z.string() })).default([
    { label: "Emails", emoji: "✉️" },
    { label: "Prospection", emoji: "🔍" },
    { label: "Contenu", emoji: "📱" },
    { label: "Facturation", emoji: "💳" },
    { label: "Réponses clients", emoji: "💬" },
    { label: "Social media", emoji: "📣" },
  ]),
  accentColor: z.string().default("#3b82f6"),
  durationSecs: z.number().default(7),
});

const CX = 960, CY = 520; // center of 1920×1080
const RADII = [320, 310, 315, 305, 320, 310]; // slightly varied for organic feel

export const Anim05MindMap: React.FC<z.infer<typeof anim05Schema>> = ({
  centerLabel, branches, accentColor, durationSecs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const STAGGER = 22;
  const CENTER_START = 0;
  const BRANCH_START = 18;

  const centerS = spring({ frame: frame - CENTER_START, fps, config: { mass: 0.5, damping: 10, stiffness: 180 } });

  // Colors per branch (alternating accent variants)
  const branchColors = [accentColor, "#60a5fa", "#818cf8", "#34d399", "#f59e0b", "#ec4899"];

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />

      <AbsoluteFill>
        {/* SVG layer for lines */}
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
          {branches.map((branch, i) => {
            const angle = (i / branches.length) * Math.PI * 2 - Math.PI / 2;
            const r = RADII[i];

            const lineStart = BRANCH_START + i * STAGGER;
            const lineProgress = interpolate(frame, [lineStart, lineStart + 18], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE,
            });

            // Intermediate control point
            const mx = CX + Math.cos(angle) * r * lineProgress;
            const my = CY + Math.sin(angle) * r * lineProgress;

            const color = branchColors[i] ?? accentColor;

            return (
              <g key={i}>
                <line
                  x1={CX} y1={CY}
                  x2={mx} y2={my}
                  stroke={color}
                  strokeWidth="2.5"
                  strokeOpacity={0.55}
                  strokeDasharray="none"
                />
                {/* Glow duplicate */}
                <line
                  x1={CX} y1={CY}
                  x2={mx} y2={my}
                  stroke={color}
                  strokeWidth="6"
                  strokeOpacity={0.12}
                />
              </g>
            );
          })}
        </svg>

        {/* Center node */}
        <div style={{
          position: "absolute",
          left: CX, top: CY,
          transform: `translate(-50%, -50%) scale(${centerS})`,
          opacity: centerS,
        }}>
          <div style={{
            background: `linear-gradient(135deg, rgba(30,65,180,0.92), rgba(15,38,120,0.88))`,
            border: `2.5px solid rgba(80,140,255,0.65)`,
            borderRadius: 24,
            padding: "22px 36px",
            boxShadow: `0 0 50px ${accentColor}45, 0 0 100px ${accentColor}18, inset 0 1px 0 rgba(255,255,255,0.1)`,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          }}>
            <div style={{ fontSize: 40 }}>🏢</div>
            <div style={{ fontFamily, fontWeight: 800, fontSize: 34, color: "#fff", letterSpacing: "0.01em", whiteSpace: "nowrap" }}>
              {centerLabel}
            </div>
          </div>
        </div>

        {/* Branch nodes */}
        {branches.map((branch, i) => {
          const angle = (i / branches.length) * Math.PI * 2 - Math.PI / 2;
          const r = RADII[i];
          const ex = CX + Math.cos(angle) * r;
          const ey = CY + Math.sin(angle) * r;

          const nodeStart = BRANCH_START + i * STAGGER + 12;
          const nodeS = spring({ frame: frame - nodeStart, fps, config: { mass: 0.4, damping: 8, stiffness: 260 } });
          const color = branchColors[i] ?? accentColor;
          const nodeGlow = 12 + 8 * Math.abs(Math.sin(frame * 0.1 + i * 0.7));

          return (
            <div key={i} style={{
              position: "absolute",
              left: ex, top: ey,
              transform: `translate(-50%, -50%) scale(${nodeS})`,
              opacity: nodeS,
            }}>
              <div style={{
                background: "linear-gradient(135deg, rgba(12,25,72,0.88), rgba(6,14,48,0.84))",
                border: `2px solid ${color}55`,
                borderRadius: 18,
                padding: "16px 24px",
                display: "flex", alignItems: "center", gap: 12,
                boxShadow: `0 0 ${nodeGlow}px ${color}45, 0 0 ${nodeGlow * 2}px ${color}18`,
                whiteSpace: "nowrap",
              }}>
                <span style={{ fontSize: 30 }}>{branch.emoji}</span>
                <div style={{ fontFamily, fontWeight: 800, fontSize: 26, color: "#fff" }}>{branch.label}</div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
