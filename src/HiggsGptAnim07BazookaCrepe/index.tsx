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
import { Stage } from "../higgsGpt/Stage";
import { IconPan } from "../higgsGpt/icons";
import { ACCENT, INK, FONT, mulberry32 } from "../higgsGpt/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "800"],
  subsets: ["latin"],
});

// Anim 7 — « Le bazooka pour une crêpe » (300 frames / 10 s @ 30 fps)
// A split 0–24 · B panneau gauche « crêpe » 3% 24–84 · C panneau droit
// « raisonnement » 97% 84–204 · D hold contraste 204–264 · E rideau 264–300
// Contraste tâche simple (3%) vs tâche complexe (97%).

export const higgsGptAnim07Schema = z.object({
  leftQuestion: z.string().default("Comment faire des crêpes ?"),
  rightLabel: z.string().default("Raisonnement complexe"),
});
export type HiggsGptAnim07Props = z.infer<typeof higgsGptAnim07Schema>;

const MID = 960;
const H = 1080;

// Nœuds du graphe (coordonnées absolues, moitié droite du canvas)
const NODES: [number, number][] = [
  [1120, 210],
  [1360, 165],
  [1660, 240],
  [1830, 430],
  [1600, 470],
  [1330, 380],
  [1150, 540],
  [1430, 610],
  [1720, 590],
];

// Paires de nœuds à relier — construites hors JSX (recommandation du brief).
function buildEdges(): [number, number][] {
  return [
    [0, 1],
    [1, 2],
    [2, 3],
    [1, 5],
    [5, 4],
    [4, 3],
    [5, 6],
    [6, 7],
    [7, 8],
    [8, 4],
    [0, 6],
  ];
}
const EDGES = buildEdges();
const NODE_DELAY = 9;
const edgeLen = (e: [number, number]) => {
  const a = NODES[e[0]];
  const b = NODES[e[1]];
  return Math.hypot(b[0] - a[0], b[1] - a[1]);
};

const GAUGE_R = 120;
const GAUGE_C = 2 * Math.PI * GAUGE_R;

const Gauge: React.FC<{
  pct: number;
  progress: number;
  color: string;
  big?: boolean;
  pulse?: number;
}> = ({ pct, progress, color, big, pulse = 1 }) => (
  <div style={{ position: "relative", width: 300, height: 300 }}>
    <svg width={300} height={300} viewBox="0 0 300 300">
      <circle
        cx={150}
        cy={150}
        r={GAUGE_R}
        fill="none"
        stroke="rgba(128,128,140,0.25)"
        strokeWidth={18}
      />
      <circle
        cx={150}
        cy={150}
        r={GAUGE_R}
        fill="none"
        stroke={color}
        strokeWidth={18}
        strokeLinecap="round"
        transform="rotate(-90 150 150)"
        style={{
          strokeDasharray: GAUGE_C,
          strokeDashoffset: GAUGE_C * (1 - progress),
          filter: `drop-shadow(0 0 16px ${color}88)`,
        }}
      />
    </svg>
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily,
        fontWeight: 800,
        fontSize: big ? FONT.counter : FONT.value,
        color,
        transform: `scale(${pulse})`,
      }}
    >
      {Math.round(pct)}%
    </div>
  </div>
);

export const HiggsGptAnim07BazookaCrepe: React.FC<HiggsGptAnim07Props> = ({
  leftQuestion,
  rightLabel,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rng = mulberry32(0x7b0b);
  const pulseSeeds = EDGES.map(() => rng());

  // A — wipe d'ouverture
  const openT = interpolate(frame, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  // E — rideau de fermeture (inverse)
  const closeT = interpolate(frame, [264, 294], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const leftReveal = openT * (1 - closeT); // 0..1 largeur révélée depuis la gauche
  const rightReveal = openT * (1 - closeT);
  const dividerOpacity =
    interpolate(frame, [0, 10], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * (1 - interpolate(frame, [292, 300], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const dividerPulse = 0.7 + Math.sin(frame / 10) * 0.3;

  // B — panneau gauche
  const leftCardT = interpolate(frame, [24, 44], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const leftGaugeProg = interpolate(frame, [44, 68], [0, 0.03], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const leftPct = interpolate(frame, [44, 68], [0, 3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // C — panneau droit : nœuds, arêtes, jauge 97 %
  const rightGaugeProg = interpolate(frame, [150, 185], [0, 0.97], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const rightPct = interpolate(frame, [150, 185], [0, 97], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const rightPctPulse =
    frame >= 185 && frame < 200 ? 1 + (200 - frame) / 15 * 0.16 : 1;
  const rightLabelT = interpolate(frame, [188, 204], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <Stage bare outFrames={2}>
      {/* base sombre (évite tout flash transparent pendant les wipes) */}
      <AbsoluteFill style={{ background: "#0c1024" }} />

      {/* Panneau GAUCHE — clair / neutre */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: MID,
          height: H,
          background: "#FAFAFA",
          clipPath: `inset(0 ${100 - leftReveal * 100}% 0 0)`,
          boxShadow: "inset -30px 0 60px rgba(0,0,0,0.12)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: MID,
            height: H,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 34,
          }}
        >
          <div
            style={{
              width: 460,
              borderRadius: 24,
              background: "#fff",
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.10)",
              padding: "48px 40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 22,
              opacity: leftCardT,
              transform: `translateY(${interpolate(leftCardT, [0, 1], [24, 0])}px)`,
            }}
          >
            <IconPan size={140} color="#5a5a66" strokeWidth={4} />
            <span
              style={{
                fontFamily,
                fontWeight: 600,
                fontSize: FONT.micro,
                color: "#3a3a44",
                textAlign: "center",
              }}
            >
              {leftQuestion}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Gauge pct={leftPct} progress={leftGaugeProg} color="#9aa0aa" />
          </div>
        </div>
      </div>

      {/* Panneau DROIT — sombre / tech */}
      <div
        style={{
          position: "absolute",
          left: MID,
          top: 0,
          width: MID,
          height: H,
          background:
            "linear-gradient(160deg, #141a3a 0%, #0a0d20 100%)",
          clipPath: `inset(0 0 0 ${100 - rightReveal * 100}%)`,
        }}
      >
        {/* graphe (coordonnées absolues → SVG plein canvas, décalé de -MID) */}
        <svg
          width={MID}
          height={H}
          viewBox={`${MID} 0 ${MID} ${H}`}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          {EDGES.map((e, i) => {
            const a = NODES[e[0]];
            const b = NODES[e[1]];
            const startF = 84 + Math.max(e[0], e[1]) * NODE_DELAY + 4;
            const draw = interpolate(frame, [startF, startF + 14], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.inOut(Easing.cubic),
            });
            const L = edgeLen(e);
            // pulse aléatoire en boucle (hold)
            const seed = pulseSeeds[i];
            const cyclePos = (frame / 17 + seed * 20) % (EDGES.length * 0.9);
            const active =
              frame >= 150 && Math.floor(cyclePos) === i % Math.ceil(EDGES.length * 0.9);
            return (
              <g key={i}>
                <line
                  x1={a[0]}
                  y1={a[1]}
                  x2={b[0]}
                  y2={b[1]}
                  stroke={ACCENT}
                  strokeWidth={3}
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: L,
                    strokeDashoffset: L * (1 - draw),
                    opacity: 0.5,
                  }}
                />
                {active && (
                  <line
                    x1={a[0]}
                    y1={a[1]}
                    x2={b[0]}
                    y2={b[1]}
                    stroke="#a9c2ff"
                    strokeWidth={4}
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: `14 ${L}`,
                      strokeDashoffset: -((frame * 8) % (L + 14)),
                    }}
                  />
                )}
              </g>
            );
          })}
          {NODES.map((n, i) => {
            const nf = frame - (84 + i * NODE_DELAY);
            const pop = spring({
              frame: nf,
              fps,
              config: { damping: 11, stiffness: 200, mass: 0.7 },
            });
            const s = interpolate(pop, [0, 0.6, 1], [0, 1.25, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <circle
                key={i}
                cx={n[0]}
                cy={n[1]}
                r={16 * s}
                fill="#0a0d20"
                stroke={ACCENT}
                strokeWidth={4}
                style={{ filter: `drop-shadow(0 0 12px ${ACCENT}aa)` }}
              />
            );
          })}
        </svg>

        {/* jauge 97 % + label, en bas du panneau droit */}
        <div
          style={{
            position: "absolute",
            left: MID / 2 - 150,
            top: H - 400,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Gauge
            pct={rightPct}
            progress={rightGaugeProg}
            color={ACCENT}
            big
            pulse={rightPctPulse}
          />
          <span
            style={{
              fontFamily,
              fontWeight: 800,
              fontSize: FONT.micro,
              color: INK,
              opacity: rightLabelT,
              transform: `translateY(${interpolate(rightLabelT, [0, 1], [16, 0])}px)`,
            }}
          >
            {rightLabel}
          </span>
        </div>
      </div>

      {/* Liseré central lumineux */}
      <div
        style={{
          position: "absolute",
          left: MID - 2,
          top: 0,
          width: 4,
          height: H,
          background: ACCENT,
          opacity: dividerOpacity,
          boxShadow: `0 0 ${18 + dividerPulse * 22}px ${ACCENT}, 0 0 8px #fff`,
        }}
      />
    </Stage>
  );
};
