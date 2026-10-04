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
import { Stage } from "../freebeat/Stage";
import { WaveBars } from "../freebeat/WaveBars";
import { COVER_PALETTE, INK, ACCENT, FONT } from "../freebeat/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const freebeatAnim04Schema = z.object({
  target: z.number().default(120000),
  label: z.string().default("titres publiés chaque jour"),
});

export type FreebeatAnim04Props = z.infer<typeof freebeatAnim04Schema>;

// Moins de pochettes mais plus grandes — lisible sur téléphone (cf. feedback).
const COLS = 6;
const ROWS = 4;
const N = COLS * ROWS;
const CELL = 250;
const GRID_W = COLS * CELL;
const GRID_H = ROWS * CELL;

// PRNG déterministe (seed fixe) — rendu reproductible entre les renders.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(0x1a2b3c);
const COVERS = Array.from({ length: N }).map((_, i) => ({
  color: COVER_PALETTE[Math.floor(rand() * COVER_PALETTE.length)],
  lum: 0.75 + rand() * 0.5, // variation de luminosité
  shape: Math.floor(rand() * 4),
  rot: (rand() - 0.5) * 6, // ±3°
  gridIndex: i, // position fixe dans la grille
  sortKey: rand(), // ordre d'apparition mélangé (seedé)
}));

// rang d'apparition = position dans l'ordre trié par sortKey
const APPEAR_RANK: number[] = new Array(N);
[...COVERS]
  .sort((a, b) => a.sortKey - b.sortKey)
  .forEach((c, rank) => {
    APPEAR_RANK[c.gridIndex] = rank;
  });

// délais cumulés, écart qui décroît (cascade accélérante) — indexés par rang
const DELAYS: number[] = [];
{
  let t = 15;
  for (let i = 0; i < N; i++) {
    DELAYS.push(t);
    t += Math.max(1, 5 * Math.pow(0.94, i));
  }
}

function groupThousands(n: number): string {
  const s = String(Math.round(n / 100) * 100);
  let out = "";
  for (let i = 0; i < s.length; i++) {
    if (i > 0 && (s.length - i) % 3 === 0) out += " ";
    out += s[i];
  }
  return out;
}

const CoverShape: React.FC<{ shape: number; color: string; lum: number }> = ({ shape, color, lum }) => (
  <svg width={CELL - 16} height={CELL - 16} viewBox="0 0 100 100" style={{ borderRadius: 14 }}>
    <rect width="100" height="100" fill={color} opacity={0.22 * lum} />
    {shape === 0 && <circle cx="50" cy="50" r="30" fill={color} opacity={lum} />}
    {shape === 1 && <polygon points="50,15 85,80 15,80" fill={color} opacity={lum} />}
    {shape === 2 && <rect x="22" y="22" width="56" height="56" fill={color} opacity={lum} />}
    {shape === 3 && <polygon points="0,0 100,0 0,100" fill={color} opacity={lum} />}
  </svg>
);

export const FreebeatAnim04DelugeSorties: React.FC<FreebeatAnim04Props> = ({ target, label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const waveAmp = interpolate(frame, [0, 25, 120], [0.15, 0.7, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Assombrissement + flash de bascule (120-135)
  const darken = interpolate(frame, [120, 135], [0, 0.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flash = interpolate(frame, [120, 122, 126], [0, 0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Compteur (135-210)
  const rawCount = interpolate(frame, [135, 190, 210], [0, target * 0.833, target], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const counterVisible = frame >= 135;
  const counterOpacity = interpolate(frame, [135, 145], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelOpacity = interpolate(frame, [153, 170], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage outFrames={12}>
      {/* Grille de pochettes */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 180 }}>
        <div style={{ position: "relative", width: GRID_W, height: GRID_H }}>
          {COVERS.map((c) => {
            const delay = DELAYS[APPEAR_RANK[c.gridIndex]];
            const s = spring({
              frame: frame - delay,
              fps,
              config: { damping: 14, stiffness: 180 },
            });
            const y = interpolate(s, [0, 1], [-GRID_H - 300, 0], { extrapolateRight: "clamp" });
            const col = c.gridIndex % COLS;
            const row = Math.floor(c.gridIndex / COLS);
            return (
              <div
                key={c.gridIndex}
                style={{
                  position: "absolute",
                  left: col * CELL + 8,
                  top: row * CELL + 8,
                  transform: `translateY(${y}px) rotate(${c.rot}deg)`,
                  opacity: s > 0.01 ? 1 : 0,
                }}
              >
                <CoverShape shape={c.shape} color={c.color} lum={c.lum} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* Assombrissement + flash */}
      <AbsoluteFill style={{ background: "#0A0A0A", opacity: darken }} />
      <AbsoluteFill style={{ background: INK, opacity: flash }} />

      {/* Compteur */}
      {counterVisible && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 32 }}>
          <div
            style={{
              opacity: counterOpacity,
              fontFamily,
              fontWeight: 800,
              fontSize: FONT.hero,
              color: INK,
              letterSpacing: "-4px",
              textShadow: `0 0 80px ${ACCENT}`,
            }}
          >
            +{groupThousands(rawCount)}
          </div>
          <div
            style={{
              opacity: labelOpacity,
              fontFamily,
              fontWeight: 700,
              fontSize: FONT.label,
              color: "#D7D7DC",
            }}
          >
            {label}
          </div>
        </AbsoluteFill>
      )}

      {/* Égaliseur en bas */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 64 }}>
        <WaveBars width={1760} maxHeight={180} amplitude={waveAmp} />
      </AbsoluteFill>
    </Stage>
  );
};
