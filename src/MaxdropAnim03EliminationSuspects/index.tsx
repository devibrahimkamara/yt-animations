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
import { Stage } from "../maxdrop/Stage";
import { CARD_BG, CARD_BORDER, RAIL, STRIKE, GROWTH, GROWTH_GLOW, INK, FONT } from "../maxdrop/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const maxdropAnim03Schema = z.object({
  suspects: z.array(z.string()).default(["IA", "CRYPTO", "DROPSHIPPING CLASSIQUE"]),
});
export type MaxdropAnim03Props = z.infer<typeof maxdropAnim03Schema>;

const CARD_W = 400;
const CARD_H = 540;
const CX = 960;
const CY = 520;

// [strikeStart, ejectStart] + trajectoire d'éjection (dx, dy, rotate) — variée.
const EJECT = [
  { strike: 36, eject: 46, dx: -440, dy: 320, rot: -45 },
  { strike: 90, eject: 100, dx: 440, dy: 300, rot: 45 },
  { strike: 144, eject: 154, dx: 60, dy: -380, rot: 18 },
];

export const MaxdropAnim03EliminationSuspects: React.FC<MaxdropAnim03Props> = ({ suspects }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <Stage outFrames={2}>
      <AbsoluteFill style={{ fontFamily }}>
        {suspects.map((word, i) => {
          const cfg = EJECT[i];
          const enter = spring({
            frame: frame - i * 6,
            fps,
            config: { damping: 18, stiffness: 140 },
          });
          const enterY = interpolate(enter, [0, 1], [40, 0]);

          const baseX = spreadX(i, frame);
          const baseRot = [-8, 0, 8][i];

          const ejP = interpolate(frame, [cfg.eject, cfg.eject + 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.in(Easing.cubic),
          });
          const ex = ejP * cfg.dx;
          const ey = ejP * cfg.dy;
          const erot = ejP * cfg.rot;
          const eop = 1 - ejP;

          // barre d'élimination (scaleX 0 → 1 depuis la gauche)
          const strikeW = interpolate(frame, [cfg.strike, cfg.strike + 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: CX - CARD_W / 2,
                top: CY - CARD_H / 2,
                width: CARD_W,
                height: CARD_H,
                transform: `translate(${baseX + ex}px, ${enterY + ey}px) rotate(${baseRot + erot}deg)`,
                opacity: enter * eop,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 18,
                  background: CARD_BG,
                  border: `2px solid ${CARD_BORDER}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 30,
                  textAlign: "center",
                  fontSize: word.length > 8 ? FONT.label : FONT.counter,
                  fontWeight: 800,
                  color: INK,
                  lineHeight: 1.1,
                }}
              >
                {word}
              </div>
              {/* barre rouge diagonale */}
              <div
                style={{
                  position: "absolute",
                  left: -20,
                  top: CARD_H / 2 - 9,
                  width: (CARD_W + 40) * strikeW,
                  height: 18,
                  background: STRIKE,
                  borderRadius: 9,
                  transform: "rotate(-20deg)",
                  transformOrigin: "left center",
                  boxShadow: `0 0 24px ${STRIKE}`,
                }}
              />
            </div>
          );
        })}

        {/* Phase 5 — le vide qui pulse */}
        <VideCliffhanger />
      </AbsoluteFill>
    </Stage>
  );
};

// La liste des cartes vivantes se réduit ; on répartit les survivantes
// symétriquement autour du centre. Renvoie l'offset X (depuis le centre).
function spreadX(i: number, frame: number): number {
  const aliveAt = (f: number) => [0, 1, 2].filter((k) => f < EJECT[k].eject);
  const layoutFor = (list: number[]) => {
    const step = 270;
    const start = -((list.length - 1) * step) / 2;
    const map: Record<number, number> = {};
    list.forEach((k, idx) => (map[k] = start + idx * step));
    return map;
  };
  // interpole entre l'agencement « avant » et « après » chaque éjection
  const boundaries = [0, ...EJECT.map((e) => e.eject), 100000];
  for (let b = 0; b < boundaries.length - 1; b++) {
    const f0 = boundaries[b];
    const f1 = boundaries[b + 1];
    if (frame >= f0 && frame < f1) {
      const prev = layoutFor(aliveAt(f0 + 0.5));
      const cur = layoutFor(aliveAt(f1 - 0.5));
      const t = interpolate(frame, [f0, Math.min(f0 + 18, f1)], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      });
      const a = prev[i];
      const c = cur[i];
      if (a === undefined && c === undefined) return 0;
      if (a === undefined) return c;
      if (c === undefined) return a;
      return a + (c - a) * t;
    }
  }
  return 0;
}

const VideCliffhanger: React.FC = () => {
  const frame = useCurrentFrame();
  const start = 198;
  const f = frame - start;
  if (f < 0) return null;
  const draw = interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const qIn = interpolate(f, [10, 22], [0, 1], { extrapolateRight: "clamp" });
  const pulse = interpolate(Math.sin((f / 30) * Math.PI * 2), [-1, 1], [1, 1.06]);
  const glow = interpolate(Math.sin((f / 30) * Math.PI * 2), [-1, 1], [0.3, 0.7]);
  const w = 300;
  const h = 380;
  const per = (w + h) * 2;
  return (
    <>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <rect
          x={CX - w / 2}
          y={CY - h / 2}
          width={w}
          height={h}
          rx={14}
          fill="none"
          stroke={RAIL}
          strokeWidth={3}
          strokeDasharray={`10 8`}
          pathLength={per}
          strokeDashoffset={per * (1 - draw)}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: CX,
          top: CY,
          transform: `translate(-50%,-50%) scale(${pulse})`,
          fontFamily,
          fontWeight: 800,
          fontSize: 260,
          color: GROWTH,
          opacity: qIn,
          textShadow: `0 0 ${40 * glow}px ${GROWTH_GLOW}, 0 0 ${90 * glow}px ${GROWTH_GLOW}`,
        }}
      >
        ?
      </div>
    </>
  );
};
