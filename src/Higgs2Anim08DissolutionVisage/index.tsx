import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgs2/Stage";
import { ACCENT, INK, FONT } from "../higgs2/theme";

const { fontFamily } = loadFont("normal", { weights: ["600", "800"], subsets: ["latin"] });

export const higgs2Anim08Schema = z.object({
  finalText: z.string().default("Sans jamais te montrer"),
});

export type Higgs2Anim08Props = z.infer<typeof higgs2Anim08Schema>;

const COLS = 12;
const ROWS = 16;
const COUNT = COLS * ROWS;
const CELL = 50;
const BOX_W = COLS * CELL;
const BOX_H = ROWS * CELL;
const CENTER_X = 960;
const CENTER_Y = 440;

// Silhouette buste, vecteur simple -> data URI
const SILHOUETTE = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='${BOX_W}' height='${BOX_H}' viewBox='0 0 ${BOX_W} ${BOX_H}'>
    <rect width='100%' height='100%' fill='#141821'/>
    <circle cx='${BOX_W / 2}' cy='${BOX_H * 0.3}' r='${BOX_W * 0.22}' fill='#6b7ea6'/>
    <path d='M ${BOX_W * 0.1} ${BOX_H} C ${BOX_W * 0.1} ${BOX_H * 0.62}, ${BOX_W * 0.32} ${BOX_H * 0.52}, ${BOX_W / 2} ${BOX_H * 0.52} C ${BOX_W * 0.68} ${BOX_H * 0.52}, ${BOX_W * 0.9} ${BOX_H * 0.62}, ${BOX_W * 0.9} ${BOX_H} Z' fill='#6b7ea6'/>
  </svg>`,
)}`;

// Cibles du logo « bouton play » : anneau épais + triangle plein pointant à droite
const RING = 88; // carrés sur l'anneau
const R_OUT = 300;
const TRI_CELL = 34;
// cases "on" d'un triangle play dans une grille 11x11
const TRI_CELLS: { x: number; y: number }[] = [];
for (let row = 0; row < 11; row++) {
  for (let col = 0; col < 11; col++) {
    const vNorm = Math.abs(row - 5) / 5; // 0 au centre, 1 aux bords
    if (col / 10 <= 1 - vNorm) {
      TRI_CELLS.push({
        x: (col - 3.2) * TRI_CELL,
        y: (row - 5) * TRI_CELL,
      });
    }
  }
}

const LOGO_TARGETS: { x: number; y: number; used: boolean }[] = Array.from(
  { length: COUNT },
  (_, i) => {
    if (i < RING) {
      const a = (i / RING) * Math.PI * 2;
      const r = R_OUT + (i % 2 === 0 ? 0 : -26); // double épaisseur d'anneau
      return { x: Math.cos(a) * r, y: Math.sin(a) * r, used: true };
    }
    const t = i - RING;
    if (t < TRI_CELLS.length) return { ...TRI_CELLS[t], used: true };
    return { x: 0, y: 0, used: false };
  },
);

export const Higgs2Anim08DissolutionVisage: React.FC<Higgs2Anim08Props> = ({ finalText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const silhouetteSpring = spring({ frame, fps, config: { damping: 16, stiffness: 130 } });
  const breathe = frame >= 30 && frame < 54 ? 1 + Math.sin((frame - 30) / 6) * 0.01 : 1;

  const textSpring = spring({ frame: frame - 129, fps, config: { damping: 15, stiffness: 140 } });

  return (
    <Stage outFrames={12} bare background="linear-gradient(180deg, #1C1C1E 0%, #0A0A0A 100%)">
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            left: CENTER_X - BOX_W / 2,
            top: CENTER_Y - BOX_H / 2,
            width: BOX_W,
            height: BOX_H,
            transform: `scale(${interpolate(silhouetteSpring, [0, 1], [0.96, 1], {
              extrapolateRight: "clamp",
            }) * breathe})`,
          }}
        >
          {Array.from({ length: COUNT }, (_, i) => {
            const col = i % COLS;
            const row = Math.floor(i / COLS);

            const delay = random(`carre-${i}`) * 25;
            const dir = random(`dir-${i}`) * Math.PI * 2;
            const dist = 80 + random(`dist-${i}`) * 120;
            const rot = (random(`rot-${i}`) - 0.5) * 60;

            const disperse = interpolate(frame, [54 + delay, 99 + delay], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });
            const revDelay = (COUNT - i) / COUNT * 20;
            const recompose = interpolate(frame, [99 + revDelay, 138 + revDelay], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });

            const target = LOGO_TARGETS[i];

            // état dispersé (relatif au home)
            const dx1 = Math.cos(dir) * dist;
            const dy1 = Math.sin(dir) * dist;
            // état logo (relatif au home)
            const homeX = col * CELL + CELL / 2 - BOX_W / 2;
            const homeY = row * CELL + CELL / 2 - BOX_H / 2;
            const dx2 = target.x - homeX;
            const dy2 = target.y - homeY;

            let tx: number;
            let ty: number;
            let scale: number;
            let opacity: number;
            let rotation: number;

            if (frame < 99 + revDelay) {
              tx = dx1 * disperse;
              ty = dy1 * disperse;
              scale = interpolate(disperse, [0, 1], [1, 0.6]);
              opacity = interpolate(disperse, [0, 1], [1, 0.3]);
              rotation = rot * disperse;
            } else {
              tx = interpolate(recompose, [0, 1], [dx1, dx2]);
              ty = interpolate(recompose, [0, 1], [dy1, dy2]);
              scale = interpolate(recompose, [0, 1], [0.6, target.used ? 1 : 0.6]);
              opacity = interpolate(recompose, [0, 1], [0.3, target.used ? 1 : 0]);
              rotation = rot * (1 - recompose);
            }

            const asLogo = frame >= 118 && target.used;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: col * CELL,
                  top: row * CELL,
                  width: CELL,
                  height: CELL,
                  backgroundColor: asLogo ? ACCENT : "transparent",
                  backgroundImage: asLogo ? "none" : `url("${SILHOUETTE}")`,
                  backgroundSize: `${BOX_W}px ${BOX_H}px`,
                  backgroundPosition: `${-col * CELL}px ${-row * CELL}px`,
                  transform: `translate(${tx}px, ${ty}px) scale(${scale}) rotate(${rotation}deg)`,
                  opacity,
                  filter: frame > 54 && frame < 99 ? "brightness(0.85)" : "none",
                  borderRadius: 4,
                  boxShadow: asLogo ? `0 0 18px ${ACCENT}66` : undefined,
                }}
              />
            );
          })}
        </div>

        {/* texte final */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: CENTER_Y + 380,
            width: 1400,
            transform: `translate(-50%, ${interpolate(textSpring, [0, 1], [15, 0], {
              extrapolateRight: "clamp",
            })}px)`,
            opacity: textSpring,
            fontFamily,
            fontWeight: 800,
            fontSize: FONT.value,
            color: INK,
            textAlign: "center",
            textShadow: "0 4px 30px rgba(0,0,0,0.7)",
          }}
        >
          {finalText}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
