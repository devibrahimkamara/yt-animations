// Atmos22 — Animation 10 « DISPERSION → FOCUS » (150 f, 30 fps, 1920×1080).
//
// Timeline du brief conservée à l'identique :
//  0–22 dispersion des 12 flèches (décalage 1 f, Easing.out cubic) · 22–44 hésitation ±4°
//  6–18 / 44–52 légende du haut · 40–56 entrée de la cible (spring)
//  44–72 convergence (16 f, décalage 0,8 f, inOut cubic) · 64–72 11 flèches s'effacent, survivante 8→22 px, 420 px
//  72–86 tir (+390 px, Easing.in cubic, 3 traînées) · 86 impact (recul ±3° / -8 px amorti 10 f, onde 86–104, shake ±5 px 4 f)
//  90 « Un choix. » · 98 « À fond. » · 104–138 stable + respiration cible · 138–150 sortie (fondu + scale 0.97).
// Écarts (identité projet) : fond aurora (Stage) ; Plus Jakarta Sans 800 ; jaune #FFD60A → ACCENT (flèches converties,
// onde de choc, « À fond. ») avec glow ACCENT ; centre de cible #FF3B30 → ATMOS_ERROR ; légende 56 → 72 px (centre
// y = 165 pour respecter la zone de sécurité 120 px) ; flèches pointant vers le haut plafonnées en longueur pour ne
// jamais toucher la légende (pointe à y ≥ 230).
import React from "react";
import { AbsoluteFill, Easing, interpolate, interpolateColors, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { z } from "zod";
import { Stage } from "../atmos22/Stage";
import { ACCENT, ATMOS_ERROR } from "../atmos22/theme";
import { breathe, clamp, dampedShake, exitFx } from "../atmos22/utils";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });

export const atmos22Anim10Schema = z.object({
  caption: z.string().default("Tous les business sont profitables"),
  word1: z.string().default("Un choix."),
  word2: z.string().default("À fond."),
});

const DURATION = 150;
const CX = 960;
const CY = 500;
const TARGET_X = 1560;
const N = 12;
const SURVIVOR = 0;
const CAPTION_Y = 165;
const MIN_TIP_Y = 230; // les flèches vers le haut ne montent jamais jusqu'à la légende

const ARROWS = Array.from({ length: N }, (_, i) => {
  const jitter = (random(`jit-${i}`) * 2 - 1) * 6;
  let angle = 30 * i + jitter; // degrés, sens horaire (repère SVG)
  if (angle > 180) angle -= 360; // normalisé dans (-180, 180] → pivot le plus court vers 0
  const rad = (angle * Math.PI) / 180;
  let len = 300 * (0.8 + 0.4 * random(`len-${i}`));
  const s = Math.sin(rad);
  if (s < 0) len = Math.min(len, (CY - MIN_TIP_Y) / -s);
  return { angle, len, phase: random(`phase-${i}`) * Math.PI * 2 };
});

const Arrow: React.FC<{
  tail: number;
  tip: number;
  width: number;
  color: string;
  opacity: number;
  glow?: number;
}> = ({ tail, tip, width, color, opacity, glow = 0 }) => {
  const headLen = width * 3.4;
  const headHalf = width * 2.2;
  const lineEnd = Math.max(tail, tip - headLen * 0.85);
  const showHead = tip - tail > 2;
  return (
    <g
      opacity={opacity}
      style={glow > 0 ? { filter: `drop-shadow(0 0 ${18 * glow}px rgba(48,96,255,${0.75 * glow}))` } : undefined}
    >
      {lineEnd > tail && (
        <line x1={tail} y1={0} x2={lineEnd} y2={0} stroke={color} strokeWidth={width} strokeLinecap="round" />
      )}
      {showHead && (
        <polygon
          points={`${tip},0 ${tip - headLen},${-headHalf} ${tip - headLen},${headHalf}`}
          fill={color}
          strokeLinejoin="round"
        />
      )}
    </g>
  );
};

export const Atmos22Anim10DispersionFocus: React.FC<z.infer<typeof atmos22Anim10Schema>> = ({
  caption,
  word1,
  word2,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exit = exitFx(frame, DURATION);

  // ── Légende du haut (6–18 entrée, 44–52 sortie) ──
  const capIn = interpolate(frame, [6, 18], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const capOut = interpolate(frame, [44, 52], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const capOpacity = capIn * (1 - capOut);
  const capY = (1 - capIn) * 24 - capOut * 18;

  // ── Cible (40–56 spring, respiration 104–138) ──
  const targetSpring = spring({ frame: frame - 40, fps, config: { damping: 14, stiffness: 120 }, durationInFrames: 16 });
  const targetScale = interpolate(targetSpring, [0, 1], [0.5, 1]) * breathe(frame, 104, 138, 0.02);
  const targetOpacity = interpolate(frame, [40, 48], [0, 1], clamp);

  // ── Tir (72–86) + recul à l'impact (86, amorti 10 f) ──
  const shot = interpolate(frame, [72, 86], [0, 390], { ...clamp, easing: Easing.in(Easing.cubic) });
  const recoilT = interpolate(frame, [86, 96], [1, 0], clamp);
  const recoilX = frame >= 86 ? -8 * recoilT * Math.cos((frame - 86) * 1.2) : 0;
  const recoilRot = dampedShake(frame, 86, 10, 3);

  // ── Onde de choc (86–104) ──
  const waveT = interpolate(frame, [86, 104], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const waveR = 40 + 220 * waveT;
  const waveOpacity = frame >= 86 && frame <= 104 ? 0.7 * (1 - waveT) : 0;

  // ── Micro-shake écran ±5 px sur 4 frames ──
  const shakeX = dampedShake(frame, 86, 4, 5);
  const shakeY = dampedShake(frame + 1, 87, 4, 4);

  // ── Traînées (pendant le tir) ──
  const trailOpacity =
    interpolate(frame, [73, 76], [0, 1], clamp) * interpolate(frame, [86, 92], [1, 0], clamp);
  const speed = interpolate(frame, [72, 86], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });

  // ── Texte final ──
  const w1 = spring({ frame: frame - 90, fps, config: { damping: 12, stiffness: 130 } });
  const w2 = spring({ frame: frame - 98, fps, config: { damping: 12, stiffness: 130 } });
  const o1 = interpolate(frame, [90, 96], [0, 1], clamp);
  const o2 = interpolate(frame, [98, 104], [0, 1], clamp);

  const arrows = ARROWS.map((a, i) => {
    // Phase 1 : dispersion
    const grow = interpolate(frame, [i, i + 11], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
    const appear = interpolate(frame, [i, i + 3], [0, 1], clamp);
    const tipDisp = 40 + (a.len - 40) * grow;
    // Hésitation ±4° (sinusoïdale, phases différentes)
    const wobbleIn = interpolate(frame, [22, 28], [0, 1], clamp);
    const wobble = 4 * Math.sin((frame - 22) * 0.22 + a.phase) * wobbleIn;
    // Phase 3 : convergence (16 f, décalage 0,8 f)
    const cs = 44 + 0.8 * i;
    const conv = interpolate(frame, [cs, cs + 16], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
    const angle = (a.angle + wobble) * (1 - conv);
    const tail = interpolate(conv, [0, 1], [40, -150]);
    const tip = interpolate(conv, [0, 1], [tipDisp, 150]);
    const color = interpolateColors(conv, [0, 1], ["#FFFFFF", ACCENT]);
    const baseOpacity = interpolate(conv, [0, 1], [0.5, 1]) * appear;
    return { i, angle, tail, tip, color, baseOpacity };
  });

  // Frames 64–72 : 11 flèches s'effacent, la survivante s'épaissit et s'allonge à 420 px
  const solo = interpolate(frame, [64, 72], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const others = 1 - interpolate(frame, [64, 72], [0, 1], clamp);

  return (
    <Stage outFrames={0}>
      <AbsoluteFill
        style={{
          opacity: exit.opacity,
          transform: `translate(${shakeX}px, ${shakeY}px) scale(${exit.scale})`,
          fontFamily,
        }}
      >
        {/* Légende du haut */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: CAPTION_Y - 48,
            height: 96,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 72,
            fontWeight: 800,
            color: "#FFFFFF",
            letterSpacing: -1,
            opacity: capOpacity,
            transform: `translateY(${capY}px)`,
          }}
        >
          {caption}
        </div>

        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {/* Cible */}
          <g
            opacity={targetOpacity}
            transform={`translate(${TARGET_X} ${CY}) scale(${targetScale})`}
          >
            <circle r={140} fill="none" stroke="#FFFFFF" strokeWidth={8} />
            <circle r={90} fill="none" stroke="#FFFFFF" strokeWidth={8} />
            <circle r={40} fill={ATMOS_ERROR} stroke="#FFFFFF" strokeWidth={8} />
          </g>

          {/* Onde de choc */}
          {waveOpacity > 0 && (
            <circle
              cx={TARGET_X}
              cy={CY}
              r={waveR}
              fill="none"
              stroke={ACCENT}
              strokeWidth={6}
              opacity={waveOpacity}
              style={{ filter: "drop-shadow(0 0 14px rgba(48,96,255,0.7))" }}
            />
          )}

          {/* 11 flèches non retenues */}
          {arrows
            .filter((a) => a.i !== SURVIVOR)
            .map((a) =>
              a.baseOpacity * others > 0.001 ? (
                <g key={a.i} transform={`translate(${CX} ${CY}) rotate(${a.angle})`}>
                  <Arrow tail={a.tail} tip={a.tip} width={8} color={a.color} opacity={a.baseOpacity * others} />
                </g>
              ) : null,
            )}

          {/* Traînées derrière la flèche pendant le tir */}
          {trailOpacity > 0 &&
            [-26, 0, 26].map((dy, k) => {
              const end = CX - 210 + shot - 10;
              const len = 60 + 260 * speed * (k === 1 ? 1 : 0.7);
              return (
                <line
                  key={k}
                  x1={end - len}
                  y1={CY + dy}
                  x2={end}
                  y2={CY + dy}
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth={3}
                  strokeLinecap="round"
                  opacity={trailOpacity}
                />
              );
            })}

          {/* Flèche survivante */}
          {(() => {
            const a = arrows[SURVIVOR];
            const tail = interpolate(solo, [0, 1], [a.tail, -210]);
            const tip = interpolate(solo, [0, 1], [a.tip, 210]);
            const width = interpolate(solo, [0, 1], [8, 22]);
            const tipX = CX + shot + recoilX + tip;
            return (
              <g
                transform={`rotate(${recoilRot} ${tipX - recoilX} ${CY}) translate(${CX + shot + recoilX} ${CY}) rotate(${a.angle})`}
              >
                <Arrow tail={tail} tip={tip} width={width} color={a.color} opacity={a.baseOpacity} glow={solo} />
              </g>
            );
          })()}
        </svg>

        {/* Texte final */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 830 - 75,
            height: 150,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 36,
            fontSize: 120,
            fontWeight: 800,
            letterSpacing: -2,
            lineHeight: 1,
          }}
        >
          <span
            style={{
              display: "inline-block",
              color: "#FFFFFF",
              opacity: o1,
              transform: `scale(${interpolate(w1, [0, 1], [0.7, 1])})`,
            }}
          >
            {word1}
          </span>
          <span
            style={{
              display: "inline-block",
              color: ACCENT,
              opacity: o2,
              transform: `scale(${interpolate(w2, [0, 1], [0.7, 1])})`,
              textShadow: "0 0 40px rgba(48,96,255,0.55)",
            }}
          >
            {word2}
          </span>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
