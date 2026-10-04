import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../atmos22/Stage";
import {
  ACCENT,
  ATMOS_ERROR,
  DIM_TEXT,
  DIM_TILE,
  GLASS_BG,
  GLASS_BORDER,
  GLASS_CARD,
  INK,
  MUTED,
} from "../atmos22/theme";
import { breathe, clamp, exitFx } from "../atmos22/utils";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "800"],
  subsets: ["latin"],
});

// Anim 4 — « L'élimination : 47 → 1 » (165 f / 5,5 s @ 30 fps)
// Timeline du brief conservée : entrée grille 2–32 · vagues 38/50/62/70/78
// (17/15/9/4/1 tuiles, ordre random(`order-n`)) · tension tuile 28 70–80 ·
// survivante au centre 86–106 (width/height animés) · contenu flouté 92 + « ? » 96 ·
// onde 98–118 · légende 100 · pulse halo 108–128 · respiration 124 · sortie 153–165.
// Écarts : palette charte (jaune → ACCENT, rouge → ATMOS_ERROR, tuiles glass), Plus Jakarta
// Sans, compteur 112 px + label 58 px, badge #28 48 px, légende 88 px, « ? » 190 px ;
// tuiles de la grille gardées à la taille du brief (effet de masse). La respiration
// finit à f141 (~12 f avant la sortie) pour qu'aucun texte ne bouge à la fin.

export const atmos22Anim04Schema = z.object({
  overlay: z.boolean().default(false),
  caption: z.string().default("J'en ai choisi une"),
  highlight: z.string().default("une"),
});

const SURVIVOR = 28;
const TILE_W = 160;
const TILE_H = 100;

const tilePos = (n: number) => {
  const idx = n - 1;
  const r = Math.floor(idx / 8);
  const c = idx % 8;
  const x = r < 5 ? 337 + 178 * c : 426 + 178 * c;
  const y = 180 + 118 * r;
  return { r, c, x, y };
};

// Ordre d'élimination : 46 tuiles non survivantes triées par random(`order-n`).
const WAVES = [
  { size: 17, start: 38, step: 0.6 },
  { size: 15, start: 50, step: 0.6 },
  { size: 9, start: 62, step: 0.8 },
  { size: 4, start: 70, step: 1.5 },
  { size: 1, start: 78, step: 0 },
];

const ORDER = Array.from({ length: 47 }, (_, i) => i + 1)
  .filter((n) => n !== SURVIVOR)
  .sort((a, b) => random(`order-${a}`) - random(`order-${b}`));

export const ELIM_TRIGGER: Record<number, number> = (() => {
  const out: Record<number, number> = {};
  let k = 0;
  for (const w of WAVES) {
    for (let i = 0; i < w.size; i++) {
      out[ORDER[k]] = w.start + i * w.step;
      k++;
    }
  }
  return out;
})();

const TRIGGERS = Object.values(ELIM_TRIGGER);

export const counterAt = (frame: number) =>
  47 - TRIGGERS.filter((t) => t <= frame).length;

const accentGlow = (a: number) => `rgba(48,96,255,${a})`;

const Tile: React.FC<{ n: number; frame: number; fps: number }> = ({ n, frame, fps }) => {
  const { r, c, x, y } = tilePos(n);
  const delay = 2 + (r + c) * 1.2;
  const enter = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 130 } });
  const trig = ELIM_TRIGGER[n];
  const t = frame - trig;

  let border = GLASS_BORDER;
  let borderW = 1;
  let bg = GLASS_CARD;
  let color: string = INK;
  let shakeX = 0;
  let fallY = 0;
  let rot = 0;
  let drift = 0;
  let opacity = interpolate(enter, [0, 1], [0, 1], clamp);
  let inner = "none";

  if (t >= 0) {
    if (t < 4) {
      border = ATMOS_ERROR;
      borderW = interpolate(t, [0, 2], [1, 3], clamp);
      inner = `inset 0 0 24px rgba(239,68,68,0.55)`;
      shakeX = 4 * Math.sin(t * Math.PI * 1.5);
    } else {
      const g = interpolate(t, [4, 8], [0, 1], clamp);
      border = interpolateColors(g, [0, 1], [ATMOS_ERROR, "rgba(120,130,160,0.35)"]);
      borderW = interpolate(g, [0, 1], [3, 1]);
      bg = interpolateColors(g, [0, 1], [GLASS_CARD, DIM_TILE]);
      color = interpolateColors(g, [0, 1], [INK, DIM_TEXT]);
      const fall = interpolate(t, [8, 24], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
      fallY = 1300 * fall;
      rot = (random(`rot-${n}`) * 2 - 1) * 25 * interpolate(t, [8, 24], [0, 1], clamp);
      drift = (random(`drift-${n}`) * 2 - 1) * 40 * interpolate(t, [8, 24], [0, 1], clamp);
      opacity = interpolate(t, [18, 24], [1, 0], clamp);
    }
  }
  if (t >= 24) return null;

  const scale = interpolate(enter, [0, 1], [0.6, 1]);
  const ty = interpolate(enter, [0, 1], [20, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: x - TILE_W / 2,
        top: y - TILE_H / 2,
        width: TILE_W,
        height: TILE_H,
        borderRadius: 16,
        background: bg,
        border: `${borderW}px solid ${border}`,
        boxShadow: inner,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
        fontSize: 44,
        color,
        opacity,
        transform: `translate(${shakeX + drift}px, ${ty + fallY}px) rotate(${rot}deg) scale(${scale})`,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {n}
    </div>
  );
};

export const Atmos22Anim04Elimination47a1: React.FC<z.infer<typeof atmos22Anim04Schema>> = ({
  overlay,
  caption,
  highlight,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const exit = exitFx(frame, durationInFrames, 12);

  // Grille : scale 0.98 → 1 pendant l'entrée
  const gridScale = interpolate(frame, [2, 32], [0.98, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  // ── Survivante (tuile 28) ──
  const s = tilePos(SURVIVOR);
  const sEnter = spring({
    frame: frame - (2 + (s.r + s.c) * 1.2),
    fps,
    config: { damping: 14, stiffness: 130 },
  });
  const p = spring({ frame: frame - 86, fps, config: { damping: 14, stiffness: 100, mass: 1 } });
  const q = Math.min(1, Math.max(0, p));
  const tension = interpolate(frame, [70, 80], [0, 1], clamp);
  const w = interpolate(p, [0, 1], [TILE_W, 560]);
  const h = interpolate(p, [0, 1], [TILE_H, 380]);
  const cx = interpolate(p, [0, 1], [s.x, 960]);
  const cy = interpolate(p, [0, 1], [s.y, 500]);
  const radius = interpolate(q, [0, 1], [16, 28]);
  const sBorderW = interpolate(tension, [0, 1], [1, 3]);
  const sBorder = interpolateColors(tension, [0, 1], [GLASS_BORDER, ACCENT]);
  const glowA =
    frame < 108
      ? 0.45
      : interpolate(frame, [108, 118, 128], [0.45, 0.8, 0.55], clamp);
  const glow = `0 0 60px ${accentGlow(glowA * q)}`;
  const tileBreath = breathe(frame, 124, 141, 0.015);
  const sOpacity = interpolate(sEnter, [0, 1], [0, 1], clamp);
  const sScale = interpolate(sEnter, [0, 1], [0.6, 1]);
  const sTy = interpolate(sEnter, [0, 1], [20, 0]);

  // Numéro → badge
  const numColor = interpolateColors(Math.max(tension, q), [0, 1], [INK, ACCENT]);
  const numLeft = interpolate(q, [0, 1], [w / 2, 58]);
  const numTop = interpolate(q, [0, 1], [h / 2, 28]);
  const numSize = interpolate(q, [0, 1], [44, 48]);

  // Contenu final
  const blurOp = interpolate(frame, [92, 102], [0, 1], clamp);
  const qMark = spring({ frame: frame - 96, fps, config: { damping: 10, stiffness: 170 } });

  // Onde de choc
  const ringR = interpolate(frame, [98, 118], [200, 720], { ...clamp, easing: Easing.out(Easing.cubic) });
  const ringOp = frame < 98 ? 0 : interpolate(frame, [98, 118], [0.6, 0], clamp);

  // Compteur
  const value = counterAt(frame);
  const counterOp =
    interpolate(frame, [14, 26], [0, 1], clamp) * interpolate(frame, [96, 106], [1, 0], clamp);
  const isOne = value === 1;

  // Légende
  const cap = spring({ frame: frame - 100, fps, config: { damping: 14, stiffness: 110 } });
  const capOp = interpolate(cap, [0, 1], [0, 1], clamp);
  const capY = interpolate(cap, [0, 1], [30, 0]);
  const hiIdx = caption.lastIndexOf(highlight);
  const capBefore = hiIdx >= 0 ? caption.slice(0, hiIdx) : caption;
  const capHi = hiIdx >= 0 ? highlight : "";
  const capAfter = hiIdx >= 0 ? caption.slice(hiIdx + highlight.length) : "";

  return (
    <Stage bare={overlay} outFrames={0}>
      {overlay && <AbsoluteFill style={{ background: "rgba(0,0,0,0.6)" }} />}
      <AbsoluteFill
        style={{
          fontFamily,
          opacity: exit.opacity,
          transform: `scale(${exit.scale})`,
        }}
      >
        {/* Grille + survivante */}
        <AbsoluteFill style={{ transform: `scale(${gridScale})`, zIndex: 1 }}>
          {Array.from({ length: 47 }, (_, i) => i + 1)
            .filter((n) => n !== SURVIVOR)
            .map((n) => (
              <Tile key={n} n={n} frame={frame} fps={fps} />
            ))}

          <div
            style={{
              position: "absolute",
              left: cx - w / 2,
              top: cy - h / 2,
              width: w,
              height: h,
              borderRadius: radius,
              background: interpolateColors(q, [0, 1], [GLASS_CARD, GLASS_BG]),
              border: `${q > 0 ? 3 : sBorderW}px solid ${q > 0 ? ACCENT : sBorder}`,
              boxShadow: glow,
              boxSizing: "border-box",
              overflow: "hidden",
              opacity: sOpacity,
              transform: `translateY(${sTy}px) scale(${sScale * tileBreath})`,
              zIndex: 2,
            }}
          >
            {/* Titre flouté (seule exception au « pas de blur ») */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
                fontSize: 58,
                lineHeight: 1.2,
                color: "rgba(255,255,255,0.7)",
                filter: "blur(14px)",
                opacity: blurOp,
                whiteSpace: "nowrap",
              }}
            >
              <div>Business secret</div>
              <div>à révéler</div>
            </div>
            {/* « ? » */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 190,
                lineHeight: 1,
                color: ACCENT,
                textShadow: `0 0 40px ${accentGlow(0.55)}`,
                transform: `scale(${Math.max(0, qMark)})`,
                opacity: frame >= 96 ? 1 : 0,
              }}
            >
              ?
            </div>
            {/* Numéro / badge */}
            <div
              style={{
                position: "absolute",
                left: numLeft,
                top: numTop,
                transform: `translate(${-50 * (1 - q)}%, ${-50 * (1 - q)}%)`,
                fontWeight: 800,
                fontSize: numSize,
                lineHeight: 1,
                color: numColor,
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ position: "absolute", right: "100%", opacity: q }}>#</span>
              {SURVIVOR}
            </div>
          </div>
        </AbsoluteFill>

        {/* Onde de choc */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          <circle cx={960} cy={500} r={ringR} fill="none" stroke={ACCENT} strokeWidth={4} opacity={ringOp} />
        </svg>

        {/* Compteur (au-dessus des tuiles qui tombent) */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 900,
            transform: "translateY(-50%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "baseline",
            gap: 28,
            opacity: counterOp,
            zIndex: 5,
          }}
        >
          <div
            style={{
              width: "1.25em",
              textAlign: "right",
              fontWeight: 800,
              fontSize: 112,
              lineHeight: 1,
              color: isOne ? ACCENT : INK,
              textShadow: isOne ? `0 0 40px ${accentGlow(0.55)}` : "none",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {value}
          </div>
          <div style={{ width: 470, fontWeight: 600, fontSize: 58, color: MUTED, whiteSpace: "nowrap" }}>
            {isOne ? "idée restante" : "idées restantes"}
          </div>
        </div>

        {/* Légende */}
        <div
          style={{
            position: "absolute",
            left: 120,
            right: 120,
            top: 800,
            transform: `translateY(calc(-50% + ${capY}px))`,
            textAlign: "center",
            fontWeight: 800,
            fontSize: 88,
            lineHeight: 1.1,
            color: INK,
            opacity: frame >= 100 ? capOp : 0,
            zIndex: 6,
            whiteSpace: "nowrap",
          }}
        >
          {capBefore}
          <span style={{ color: ACCENT, textShadow: `0 0 40px ${accentGlow(0.55)}` }}>{capHi}</span>
          {capAfter}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
