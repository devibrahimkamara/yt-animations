// Atmos22 — Animation 11 « LA RÈGLE DU JEU + COMPTE À REBOURS » (195 f, 30 fps, 1920×1080).
//
// Timeline du brief conservée à l'identique :
//  A) 0–20 dépliage de la carte (scaleY 0.05→1, spring d15/s120), en-tête à f14 ;
//     lignes à rowStart = [22, 52, 82] (translateX -40→0 + fondu, 12 f) ; coche 14 f après (36, 66, 96 :
//     tracé 10 f + remplissage + pop 1→1.2→1) ; maintien 106–114 ; rétraction 114–128 (Easing.in cubic).
//  B) « 3 » 130–148, « 2 » 148–166, « 1 » 166–184 (entrée scale 1.6→1 spring d11/s170 en 8 f + fondu 4 f,
//     sortie 4 dernières frames scale→0.85 + fondu) ; anneau r=300 qui se vide façon horloge ; flash 184–195.
// Écarts (identité projet) : fond aurora (Stage) ; Plus Jakarta Sans 700/800 ; carte #14141B → glass (GLASS_BG /
// GLASS_BORDER) ; jaune #FFD60A → ACCENT (bandeau, mots-clés, case remplie, anneau, « 1 ») ; coche BLANCHE sur fond
// ACCENT (au lieu de #0B0B0F) ; gris #9A9AA8 → MUTED ; en-tête 40 → 48 px ; case 64 → 72 px.
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { z } from "zod";
import { Stage } from "../atmos22/Stage";
import { ACCENT, GLASS_BG, GLASS_BORDER, MUTED } from "../atmos22/theme";
import { clamp } from "../atmos22/utils";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const atmos22Anim11Schema = z.object({
  rowStart: z.array(z.number()).default([22, 52, 82]),
});

const CARD_W = 1100;
const CARD_H = 620;
const ROW_TOP = 190;
const ROW_PITCH = 140;
const ROW_H = 120;
const BOX = 72;

const ROWS: { label: string; value: string }[] = [
  { label: "Budget : ", value: "0 €" },
  { label: "Équipe : ", value: "personne" },
  { label: "Outils : ", value: "IA uniquement" },
];

const DIGITS = [
  { n: "3", start: 130, color: "#FFFFFF" },
  { n: "2", start: 148, color: "#FFFFFF" },
  { n: "1", start: 166, color: ACCENT },
];
const DIGIT_LEN = 18;
const RING_R = 300;
const RING_C = 2 * Math.PI * RING_R;
const CHECK_LEN = 60; // longueur approx. du tracé de coche (viewBox 64)

const Row: React.FC<{ index: number; start: number; frame: number }> = ({ index, start, frame }) => {
  const enter = interpolate(frame, [start, start + 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const c = start + 14; // coche
  const draw = interpolate(frame, [c, c + 10], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const fill = interpolate(frame, [c, c + 4], [0, 1], clamp);
  const pop = interpolate(frame, [c, c + 5, c + 10], [1, 1.2, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const row = ROWS[index];
  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        right: 90,
        top: ROW_TOP + index * ROW_PITCH,
        height: ROW_H,
        display: "flex",
        alignItems: "center",
        gap: 40,
        opacity: enter,
        transform: `translateX(${(1 - enter) * -40}px)`,
      }}
    >
      <div
        style={{
          width: BOX,
          height: BOX,
          flexShrink: 0,
          borderRadius: 16,
          boxSizing: "border-box",
          border: `4px solid ${fill > 0 ? ACCENT : MUTED}`,
          background: `rgba(48,96,255,${fill})`,
          boxShadow: fill > 0 ? `0 0 ${28 * fill}px rgba(48,96,255,${0.55 * fill})` : "none",
          transform: `scale(${pop})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width={BOX - 8} height={BOX - 8} viewBox="0 0 64 64">
          <path
            d="M16 33 L28 45 L49 21"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={8}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={CHECK_LEN}
            strokeDashoffset={CHECK_LEN * (1 - draw)}
            opacity={draw > 0 ? 1 : 0}
          />
        </svg>
      </div>
      <div style={{ fontSize: 58, fontWeight: 700, color: "#FFFFFF", whiteSpace: "nowrap", letterSpacing: -0.5 }}>
        {row.label}
        <span style={{ color: ACCENT, fontWeight: 800, textShadow: "0 0 30px rgba(48,96,255,0.45)" }}>{row.value}</span>
      </div>
    </div>
  );
};

export const Atmos22Anim11RegleCompteRebours: React.FC<z.infer<typeof atmos22Anim11Schema>> = ({ rowStart }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Partie A : carte ──
  const unfold = spring({ frame, fps, config: { damping: 15, stiffness: 120 }, durationInFrames: 20 });
  const retract = interpolate(frame, [114, 128], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const cardScaleY = interpolate(unfold, [0, 1], [0.05, 1]) * (1 - retract);
  const cardOpacity = interpolate(frame, [0, 8], [0, 1], clamp) * (1 - retract);
  const headerOpacity = interpolate(frame, [14, 22], [0, 1], clamp);

  // ── Flash final (184–195) ──
  const flash = interpolate(frame, [184, 189, 194], [0, 0.9, 0], clamp);

  return (
    <Stage outFrames={0}>
      <AbsoluteFill style={{ fontFamily }}>
        {frame < 130 && cardOpacity > 0.001 && (
          <div
            style={{
              position: "absolute",
              left: 960 - CARD_W / 2,
              top: 540 - CARD_H / 2,
              width: CARD_W,
              height: CARD_H,
              borderRadius: 28,
              background: GLASS_BG,
              border: `2px solid ${GLASS_BORDER}`,
              boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
              overflow: "hidden",
              opacity: cardOpacity,
              transform: `scaleY(${cardScaleY})`,
              transformOrigin: "50% 50%",
            }}
          >
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 10, background: ACCENT }} />
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 70,
                textAlign: "center",
                fontSize: 48,
                fontWeight: 800,
                letterSpacing: 6,
                color: MUTED,
                opacity: headerOpacity,
              }}
            >
              RÈGLES DU DÉFI
            </div>
            {ROWS.map((_, i) => (
              <Row key={i} index={i} start={rowStart[i] ?? 22 + 30 * i} frame={frame} />
            ))}
          </div>
        )}

        {/* ── Partie B : compte à rebours ── */}
        {DIGITS.map((d) => {
          const t = frame - d.start;
          if (t < 0 || t >= DIGIT_LEN) return null;
          const s = spring({ frame: t, fps, config: { damping: 11, stiffness: 170 }, durationInFrames: 8 });
          const inOpacity = interpolate(t, [0, 4], [0, 1], clamp);
          const out = interpolate(t, [DIGIT_LEN - 4, DIGIT_LEN], [0, 1], clamp);
          const scale = interpolate(s, [0, 1], [1.6, 1]) * interpolate(out, [0, 1], [1, 0.85]);
          const opacity = inOpacity * (1 - out);
          const empty = interpolate(t, [0, DIGIT_LEN], [0, 1], clamp);
          return (
            <AbsoluteFill key={d.n}>
              <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
                <circle cx={960} cy={540} r={RING_R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={10} opacity={opacity} />
                <circle
                  cx={960}
                  cy={540}
                  r={RING_R}
                  fill="none"
                  stroke={ACCENT}
                  strokeWidth={10}
                  strokeLinecap="round"
                  strokeDasharray={RING_C}
                  strokeDashoffset={-RING_C * empty}
                  transform="rotate(-90 960 540)"
                  opacity={inOpacity}
                  style={{ filter: "drop-shadow(0 0 16px rgba(48,96,255,0.6))" }}
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  left: 960 - 400,
                  top: 540 - 300 - 20, // recentrage optique du chiffre (hauteur de capitale)
                  width: 800,
                  height: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 520,
                  fontWeight: 800,
                  lineHeight: 1,
                  color: d.color,
                  opacity,
                  transform: `scale(${scale})`,
                  textShadow: d.color === ACCENT ? "0 0 60px rgba(48,96,255,0.55)" : "none",
                }}
              >
                {d.n}
              </div>
            </AbsoluteFill>
          );
        })}

        {flash > 0 && <AbsoluteFill style={{ background: "#FFFFFF", opacity: flash }} />}
      </AbsoluteFill>
    </Stage>
  );
};
