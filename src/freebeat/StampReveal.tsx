import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { measureText } from "@remotion/layout-utils";
import { ACCENT, INK } from "./theme";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });

// Tampon encreur qui tombe du haut avec rebond, se pose avec une légère
// rotation, flash blanc + onde de choc à l'impact.
// Partagé par Anim 3 (« quasi personne n'en parle ») et Anim 7 (« 100 % généré par IA »).

const FONT_SIZE = 82;
const RX = 620;
const RY = 250;
const POINT_COUNT = 12;

function buildIrregularOvalPath(seed: string, rx: number, ry: number): string {
  const pts = Array.from({ length: POINT_COUNT }).map((_, i) => {
    const a = (i / POINT_COUNT) * Math.PI * 2;
    const j = interpolate(random(`${seed}-${i}`), [0, 1], [-7, 7]);
    return { x: Math.cos(a) * (rx + j), y: Math.sin(a) * (ry + j) };
  });
  let d = `M ${pts[0].x} ${pts[0].y} `;
  for (let i = 0; i < pts.length; i++) {
    const c = pts[i];
    const n = pts[(i + 1) % pts.length];
    d += `Q ${c.x} ${c.y}, ${(c.x + n.x) / 2} ${(c.y + n.y) / 2} `;
  }
  return d + "Z";
}

const OUTER = buildIrregularOvalPath("freebeat-stamp-outer", RX, RY);
const INNER = buildIrregularOvalPath("freebeat-stamp-inner", RX - 20, RY - 20);

function wrapToLines(text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const cand = cur ? `${cur} ${w}` : w;
    const { width } = measureText({
      text: cand,
      fontFamily,
      fontSize: FONT_SIZE,
      fontWeight: 800,
      letterSpacing: "2px",
    });
    if (width > maxWidth && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = cand;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

export const StampReveal: React.FC<{
  text: string;
  startFrame: number;
  color?: string;
  restRotation?: number;
  fullScreenFlash?: boolean;
}> = ({ text, startFrame, color = ACCENT, restRotation = -4, fullScreenFlash = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;

  const lines = wrapToLines(text.toUpperCase(), RX * 2 - 80);
  const lineHeight = FONT_SIZE * 1.15;
  const startY = -((lines.length - 1) * lineHeight) / 2;

  const drop = spring({ frame: f, fps, config: { damping: 10, stiffness: 220 } });
  const y = interpolate(drop, [0, 1], [-200, 0], { extrapolateRight: "clamp" });
  const opacity = interpolate(f, [0, 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const flash = interpolate(f, [10, 12, 15], [0, 0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ringT = interpolate(f, [10, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ringScale = interpolate(ringT, [0, 1], [0.2, 2.4]);
  const ringOpacity = interpolate(ringT, [0, 1], [0.5, 0]);

  if (f < 0) return null;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ transform: `translateY(${y}px) rotate(${restRotation}deg)`, opacity }}>
        <svg
          width={RX * 2 + 40}
          height={RY * 2 + 40}
          viewBox={`${-RX - 20} ${-RY - 20} ${RX * 2 + 40} ${RY * 2 + 40}`}
          style={{ filter: `drop-shadow(0 0 30px ${color}66)` }}
        >
          <path d={OUTER} fill="none" stroke={color} strokeWidth={11} opacity={0.95} />
          <path d={INNER} fill="none" stroke={color} strokeWidth={7} opacity={0.85} />
          <text
            x={0}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontFamily, fontWeight: 800, fontSize: FONT_SIZE, letterSpacing: "2px", fill: color }}
          >
            {lines.map((line, i) => (
              <tspan key={i} x={0} y={startY + i * lineHeight}>
                {line}
              </tspan>
            ))}
          </text>
        </svg>
        {ringT > 0 && ringT < 1 && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: RX * 2,
              height: RX * 2,
              marginLeft: -RX,
              marginTop: -RX,
              borderRadius: "50%",
              border: `6px solid ${color}`,
              transform: `scale(${ringScale})`,
              opacity: ringOpacity,
            }}
          />
        )}
      </div>
      {fullScreenFlash && <AbsoluteFill style={{ background: INK, opacity: flash }} />}
    </AbsoluteFill>
  );
};
