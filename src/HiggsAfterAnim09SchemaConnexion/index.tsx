import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsAfter/Stage";
import { ACCENT, INK, FONT } from "../higgsAfter/theme";
import { IconBrainAI, IconFolder, IconAfterEffects } from "../higgsAfter/icons";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "700"],
  subsets: ["latin"],
});

// Anim 9 — Plan 9 « Schéma de connexion, paquets qui circulent » (210f / 7s)
// A nœuds 0–18 · B lignes 18–90 · C 1er paquet 90–102 ·
// D circulation continue 102–198 · E hold 198–210

export const higgsAfterAnim09Schema = z.object({});
export type HiggsAfterAnim09Props = z.infer<typeof higgsAfterAnim09Schema>;

const NODE_CD = { x: 960, y: 220 }; // ChatGPT Desktop (haut)
const NODE_FILES = { x: 620, y: 720 }; // Tes fichiers (bas gauche)
const NODE_AE = { x: 1300, y: 720 }; // After Effects (bas droite)

const EDGES = [
  { a: NODE_CD, b: NODE_FILES, toAE: false, drawFrames: [18, 58] as const },
  { a: NODE_CD, b: NODE_AE, toAE: true, drawFrames: [34, 74] as const },
  { a: NODE_FILES, b: NODE_AE, toAE: true, drawFrames: [50, 90] as const },
];

const PACKETS = [
  { edge: 1, period: 70, phase: 0 },
  { edge: 2, period: 85, phase: 20 },
  { edge: 0, period: 65, phase: 45 },
];

const Node: React.FC<{
  x: number;
  y: number;
  label: string;
  icon: React.ReactNode;
  pop: number;
  glow?: number;
}> = ({ x, y, label, icon, pop, glow = 0 }) => (
  <div
    style={{
      position: "absolute",
      left: x - 80,
      top: y - 80,
      width: 160,
      height: 160,
      transform: `scale(${Math.max(0, pop)})`,
    }}
  >
    <div
      style={{
        width: 160,
        height: 160,
        borderRadius: 30,
        background: "#17171c",
        border: `2px solid ${ACCENT}66`,
        boxShadow: `0 0 ${20 + glow * 50}px ${ACCENT}${glow > 0.3 ? "aa" : "33"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${1 + glow * 0.12})`,
      }}
    >
      {icon}
    </div>
    <div
      style={{
        position: "absolute",
        top: 172,
        width: "100%",
        textAlign: "center",
        fontFamily,
        fontWeight: 600,
        fontSize: FONT.micro * 0.6,
        color: INK,
      }}
    >
      {label}
    </div>
  </div>
);

export const HiggsAfterAnim09SchemaConnexion: React.FC<
  HiggsAfterAnim09Props
> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const popCD = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200 },
  });
  const popFiles = spring({
    frame: frame - 4,
    fps,
    config: { damping: 12, stiffness: 200 },
  });
  const popAE = spring({
    frame: frame - 8,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  // Proximité des paquets à AE → glow continu du nœud AE
  let aeGlow = 0;
  const packetPositions = PACKETS.map((p) => {
    const { a, b, toAE } = EDGES[p.edge];
    const drawEnd = EDGES[p.edge].drawFrames[1];
    if (frame < drawEnd) return null;
    const local = ((frame - drawEnd + p.phase) % p.period) / p.period;
    // aller-retour triangulaire
    const tri = local < 0.5 ? local * 2 : 2 - local * 2;
    const x = interpolate(tri, [0, 1], [a.x, b.x]);
    const y = interpolate(tri, [0, 1], [a.y, b.y]);
    if (toAE) {
      const distToAE = tri > 0.5 ? tri : 1 - tri; // proximité de l'extrémité "b" (AE)
      aeGlow = Math.max(aeGlow, Math.max(0, distToAE - 0.75) * 4);
    }
    return { x, y };
  });

  return (
    <Stage outFrames={2}>
      <AbsoluteFill style={{ background: "#0a0a0c" }}>
        <svg
          width={1920}
          height={1080}
          style={{ position: "absolute", inset: 0 }}
        >
          {EDGES.map((e, i) => {
            const len = Math.hypot(e.b.x - e.a.x, e.b.y - e.a.y);
            const draw = interpolate(frame, e.drawFrames, [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.inOut(Easing.cubic),
            });
            return (
              <line
                key={i}
                x1={e.a.x}
                y1={e.a.y}
                x2={e.b.x}
                y2={e.b.y}
                stroke={ACCENT}
                strokeWidth={2}
                opacity={0.35}
                style={{
                  strokeDasharray: len,
                  strokeDashoffset: len * (1 - draw),
                }}
              />
            );
          })}
        </svg>

        {packetPositions.map(
          (pos, i) =>
            pos && (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: pos.x - 8,
                  top: pos.y - 8,
                  width: 16,
                  height: 16,
                  borderRadius: 16,
                  background: "#fff",
                  boxShadow: `0 0 18px ${ACCENT}`,
                }}
              />
            ),
        )}

        <Node
          x={NODE_CD.x}
          y={NODE_CD.y}
          label="ChatGPT Desktop"
          icon={<IconBrainAI size={80} color={ACCENT} />}
          pop={popCD}
        />
        <Node
          x={NODE_FILES.x}
          y={NODE_FILES.y}
          label="Tes fichiers"
          icon={<IconFolder size={80} color={ACCENT} />}
          pop={popFiles}
        />
        <Node
          x={NODE_AE.x}
          y={NODE_AE.y}
          label="After Effects"
          icon={<IconAfterEffects size={80} color={ACCENT} />}
          pop={popAE}
          glow={aeGlow}
        />
      </AbsoluteFill>
    </Stage>
  );
};
