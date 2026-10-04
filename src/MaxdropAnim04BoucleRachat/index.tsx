import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../maxdrop/Stage";
import { Bottle } from "../maxdrop/Bottle";
import { GROWTH, GROWTH_GLOW, INK, TEXT_DIM, RAIL, DARK_SCENE, FONT } from "../maxdrop/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const maxdropAnim04Schema = z.object({
  mainLabel: z.string().default("Taux de rachat le plus élevé"),
  subLabel: z.string().default("du e-commerce"),
  buyWord: z.string().default("Achat n°"),
});
export type MaxdropAnim04Props = z.infer<typeof maxdropAnim04Schema>;

const CX = 960;
const CY = 480;
const BASE_R = 190;

// angle cumulé (deg) du produit sur l'orbite — 4 tours nets, le 3e ~10 % + rapide
function orbitAngle(frame: number): number {
  const segs = [
    { f0: 30, f1: 72, a0: 0, a1: 360 },
    { f0: 72, f1: 114, a0: 360, a1: 720 },
    { f0: 114, f1: 156, a0: 720, a1: 1080 },
    { f0: 156, f1: 198, a0: 1080, a1: 1440 },
  ];
  if (frame < 30) return 0;
  for (const s of segs) {
    if (frame >= s.f0 && frame < s.f1) {
      return interpolate(frame, [s.f0, s.f1], [s.a0, s.a1]);
    }
  }
  // après le 4e tour : continue à la vitesse du dernier segment
  return 1440 + (frame - 198) * (360 / 42);
}

const LOOP_DONE = [72, 114, 156, 198];

export const MaxdropAnim04BoucleRachat: React.FC<MaxdropAnim04Props> = ({
  mainLabel,
  subLabel,
  buyWord,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const clientIn = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const clientScale = interpolate(clientIn, [0, 1], [0.8, 1]);

  const orbitDraw = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const angle = orbitAngle(frame);
  const rad = (angle - 90) * (Math.PI / 180); // départ à « 12h »
  const px = CX + BASE_R * Math.cos(rad);
  const py = CY + BASE_R * Math.sin(rad);

  // pulse « achat » sur le client à chaque tour complété
  let clientPulse = 1;
  let buyCount = 0;
  for (let i = 0; i < LOOP_DONE.length; i++) {
    const d = LOOP_DONE[i];
    if (frame >= d) buyCount = i + 1;
    if (frame >= d && frame < d + 6) {
      clientPulse = interpolate(frame, [d, d + 3, d + 6], [1, 1.1, 1]);
    }
  }

  // anneaux d'accumulation (tours 2, 3, 4)
  const rings = [
    { r: 220, from: 72 },
    { r: 250, from: 114 },
    { r: 280, from: 156 },
  ];

  // Phase 6 — flou de l'orbite + apparition du label net
  const blur = interpolate(frame, [198, 213], [0, 6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelIn = interpolate(frame, [190, 220], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subIn = interpolate(frame, [222, 244], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const counterCross = frame >= LOOP_DONE[0] ? 1 : 0;

  return (
    <Stage bare background={DARK_SCENE} outFrames={12}>
      <AbsoluteFill style={{ fontFamily }}>
        {/* système orbital (flouté en phase 6) */}
        <div style={{ position: "absolute", inset: 0, filter: `blur(${blur}px)` }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            {/* orbite principale pointillée */}
            <circle
              cx={CX}
              cy={CY}
              r={BASE_R}
              fill="none"
              stroke={RAIL}
              strokeWidth={2}
              strokeDasharray="6 10"
              opacity={0.5 * orbitDraw}
            />
            {rings.map((rg, i) => {
              const op = interpolate(frame, [rg.from, rg.from + 18], [0, 0.3], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <circle
                  key={i}
                  cx={CX}
                  cy={CY}
                  r={rg.r}
                  fill="none"
                  stroke={GROWTH}
                  strokeWidth={2}
                  opacity={op}
                />
              );
            })}
          </svg>

          {/* client */}
          <div
            style={{
              position: "absolute",
              left: CX,
              top: CY,
              transform: `translate(-50%,-50%) scale(${clientScale * clientPulse})`,
              opacity: clientIn,
            }}
          >
            <svg width={110} height={110} viewBox="0 0 110 110">
              <circle cx={55} cy={38} r={20} fill="none" stroke={INK} strokeWidth={5} />
              <path
                d="M20 96 Q20 60 55 60 Q90 60 90 96"
                fill="none"
                stroke={INK}
                strokeWidth={5}
              />
            </svg>
          </div>

          {/* produit en orbite */}
          {frame >= 30 && (
            <div
              style={{
                position: "absolute",
                left: px,
                top: py,
                transform: "translate(-50%,-50%)",
                filter: `drop-shadow(0 0 16px ${GROWTH_GLOW})`,
              }}
            >
              <Bottle size={64} bodyColor={GROWTH} capColor={GROWTH} />
            </div>
          )}
        </div>

        {/* compteur « Achat n°X » (couche nette) */}
        {buyCount > 0 && frame < 210 && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: CY + 200,
              textAlign: "center",
              fontSize: FONT.micro,
              fontWeight: 700,
              color: TEXT_DIM,
              opacity: counterCross,
            }}
          >
            {buyWord}
            {buyCount}
          </div>
        )}

        {/* label principal (net, 1er plan) */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 180,
            textAlign: "center",
            fontSize: FONT.label,
            fontWeight: 800,
            color: INK,
            opacity: labelIn,
          }}
        >
          {mainLabel}
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 120,
            textAlign: "center",
            fontSize: FONT.micro,
            fontWeight: 700,
            color: TEXT_DIM,
            opacity: subIn,
          }}
        >
          {subLabel}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
