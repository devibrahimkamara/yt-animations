import React from "react";
import {
  Easing,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../aisa/Stage";
import { ACCENT, GLASS_BG, GLASS_CARD, GLASS_BORDER, INK, MONEY_GREEN, SOFT, MUTED } from "../aisa/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["500", "600", "700", "800"],
  subsets: ["latin"],
});

// Anim 8 — « La balance recherche classique vs IA » (180 frames / 6 s @ 30 fps)
// Balance 6–34 · plateaux 28–56 · pause 56–78 · bascule 78–138 · rebond 138–150 ·
// légende 142–160 · maintien 160–180

export const aisaAnim08Schema = z.object({
  placeholderLeft: z.string().default("Rechercher sur le web"),
  placeholderRight: z.string().default("Demande à l'IA..."),
  labelLeft: z.string().default("Avant"),
  labelRight: z.string().default("Maintenant"),
  legendPre: z.string().default("Les gens passent à "),
  legendAccent: z.string().default("l'IA"),
});
export type AisaAnim08Props = z.infer<typeof aisaAnim08Schema>;

const clamp01 = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const cubicOut = Easing.out(Easing.cubic);

// ── Géométrie ──
const TIP_X = 960;
const TIP_Y = 400;
const HALF = 560; // demi-longueur du fléau
const CHAIN = 200;
const PLATE_W = 540;
const PLATE_H = 26;
const BOX_W = 500;
const BOX_H = 108;
const MAX_ANGLE = 0.24;
const GRAY = "#5A6488";

const Magnifier: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth={2.6} strokeLinecap="round">
    <circle cx={10.5} cy={10.5} r={6.5} />
    <path d="M15.5 15.5L21 21" />
  </svg>
);

const Sparkle: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M12 2 C12.8 7.5 16.5 11.2 22 12 C16.5 12.8 12.8 16.5 12 22 C11.2 16.5 7.5 12.8 2 12 C7.5 11.2 11.2 7.5 12 2Z"
      fill={color}
    />
  </svg>
);

const UserDot: React.FC<{ size: number; bg: string }> = ({ size, bg }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
    }}
  >
    <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="#fff">
      <circle cx={12} cy={8} r={4.2} />
      <path d="M3.5 21c0-4.6 3.8-7.6 8.5-7.6s8.5 3 8.5 7.6z" />
    </svg>
  </div>
);

export const AisaAnim08BalanceGoogleVsIA: React.FC<AisaAnim08Props> = ({
  placeholderLeft,
  placeholderRight,
  labelLeft,
  labelRight,
  legendPre,
  legendAccent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 10], [0, 1], clamp01);

  // Fléau + pivot
  const beamSp = spring({ frame: frame - 6, fps, config: { damping: 15, stiffness: 100 } });
  const beamScale = interpolate(beamSp, [0, 1], [0.9, 1]);
  const beamOpacity = interpolate(frame, [6, 20], [0, 1], clamp01);

  // Bascule
  const g = interpolate(frame, [78, 138], [0, 1], { easing: Easing.inOut(Easing.cubic), ...clamp01 });
  const sway = frame < 78 ? Math.sin(frame * 0.18) * 0.02 * interpolate(frame, [34, 56], [0, 1], clamp01) : 0;
  const rt = frame - 138;
  const rebound = rt >= 0 ? 0.02 * Math.exp(-rt / 6) * Math.sin((rt / 12) * Math.PI * 2) : 0;
  const residual = frame >= 150 ? 0.004 * Math.exp(-(frame - 150) / 25) * Math.sin((frame - 150) * 0.3) : 0;
  const angle = g * MAX_ANGLE + sway + rebound + residual;

  const sin = Math.sin(angle);
  const cos = Math.cos(angle);
  const endL = { x: TIP_X - HALF * cos, y: TIP_Y - HALF * sin };
  const endR = { x: TIP_X + HALF * cos, y: TIP_Y + HALF * sin };

  // Plateaux
  const plateEnter = (start: number) => {
    const sp = spring({ frame: frame - start, fps, config: { damping: 13, stiffness: 100 } });
    return {
      y: interpolate(sp, [0, 1], [-80, 0]),
      o: interpolate(frame, [start, start + 10], [0, 1], clamp01),
    };
  };
  const eL = plateEnter(28);
  const eR = plateEnter(36);

  const labelIn = interpolate(frame, [52, 64], [0, 1], { ...clamp01, easing: cubicOut });

  const legendIn = interpolate(frame, [142, 160], [0, 1], { ...clamp01, easing: cubicOut });

  // Effets gauche
  const leftScale = interpolate(g, [0, 1], [1, 0.82]);
    const leftGray = g;
  const grayIconsT = interpolate(frame, [100, 114], [0, 1], clamp01);

  // Effets droite
  const rightScale = interpolate(g, [0, 1], [1, 1.08]);
  const glow = interpolate(g, [0, 1], [0.2, 1]);

  const plateGroup = (
    side: "L" | "R",
    end: { x: number; y: number },
    enter: { y: number; o: number },
  ) => {
    const plateTop = end.y + CHAIN;
    const GROUP_H = 190;
    return (
      <div
        key={side}
        style={{
          position: "absolute",
          left: end.x - PLATE_W / 2,
          top: plateTop - GROUP_H,
          width: PLATE_W,
          height: GROUP_H + PLATE_H + 100,
          opacity: enter.o,
          transform: `translateY(${enter.y}px)`,
        }}
      >
        {/* Contenu posé sur le plateau */}
        {side === "L" ? (
          <>
            <div
              style={{
                position: "absolute",
                left: (PLATE_W - BOX_W) / 2,
                top: GROUP_H - BOX_H,
                width: BOX_W,
                height: BOX_H,
                boxSizing: "border-box",
                borderRadius: BOX_H / 2,
                background: interpolateColors(leftGray, [0, 1], ["#ffffff", "#7A84A8"]),
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "0 28px",
                transformOrigin: "50% 100%",
                transform: `scale(${leftScale})`,
                filter: `grayscale(${leftGray}) brightness(${1 - 0.3 * leftGray})`,
                boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
              }}
            >
              <Magnifier size={46} />
              <span style={{ fontSize: 34, fontWeight: 500, color: "#6B7280", whiteSpace: "nowrap" }}>
                {placeholderLeft}
              </span>
            </div>
            {/* 2 icônes grises qui disparaissent */}
            <div
              style={{
                position: "absolute",
                left: 0,
                width: PLATE_W,
                top: GROUP_H - BOX_H - 6 - 64,
                display: "flex",
                justifyContent: "center",
                gap: 16,
                opacity: (1 - grayIconsT) * enter.o,
                transform: `scale(${1 - 0.4 * grayIconsT})`,
              }}
            >
              <UserDot size={64} bg={GRAY} />
              <UserDot size={64} bg={GRAY} />
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                position: "absolute",
                left: (PLATE_W - BOX_W) / 2,
                top: GROUP_H - BOX_H,
                width: BOX_W,
                height: BOX_H,
                boxSizing: "border-box",
                borderRadius: BOX_H / 2,
                background: "#0E1430",
                border: `3px solid ${ACCENT}`,
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "0 12px 0 26px",
                transformOrigin: "50% 100%",
                transform: `scale(${rightScale})`,
                boxShadow: `0 0 ${(70 * glow).toFixed(1)}px rgba(48,96,255,${(0.65 * glow).toFixed(3)})`,
              }}
            >
              <Sparkle size={48} color={ACCENT} />
              <span style={{ fontSize: 34, fontWeight: 600, color: "rgba(255,255,255,0.8)", whiteSpace: "nowrap", flex: 1 }}>
                {placeholderRight}
              </span>
              <div
                style={{
                  width: 74,
                  height: 74,
                  borderRadius: 37,
                  background: ACCENT,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width={40} height={40} viewBox="0 0 24 24" fill="none">
                  <path d="M12 19V5M5.5 11.5L12 5l6.5 6.5" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            {/* 6 « poids » utilisateurs */}
            <div
              style={{
                position: "absolute",
                left: 0,
                width: PLATE_W,
                top: GROUP_H - BOX_H - 6 - 64 - 10,
                height: 74,
              }}
            >
              {Array.from({ length: 6 }, (_, i) => {
                const s = 82 + i * 8;
                const sp = spring({ frame: frame - s, fps, config: { damping: 12, stiffness: 110 } });
                const dy = interpolate(sp, [0, 1], [-300, 0]);
                const o = interpolate(frame, [s, s + 4], [0, 1], clamp01);
                const col = interpolateColors(frame, [s + 6, s + 20], [ACCENT, MONEY_GREEN]);
                const step = 72;
                const x = PLATE_W / 2 - (6 * step) / 2 + 4 + i * step;
                return (
                  <div key={i} style={{ position: "absolute", left: x, top: 10, opacity: o, transform: `translateY(${dy}px)` }}>
                    <UserDot size={64} bg={col} />
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Plateau */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: GROUP_H,
            width: PLATE_W,
            height: PLATE_H,
            borderRadius: PLATE_H / 2,
            background: "#2A3560",
            border: `2px solid ${GLASS_BORDER}`,
            boxSizing: "border-box",
            boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
          }}
        />

        {/* Étiquette */}
        <div
          style={{
            position: "absolute",
            left: 0,
            width: PLATE_W,
            top: GROUP_H + PLATE_H + 16,
            display: "flex",
            justifyContent: "center",
            opacity: labelIn,
            transform: `translateY(${(1 - labelIn) * 12}px)`,
          }}
        >
          <div
            style={{
              padding: "8px 36px",
              borderRadius: 40,
              fontSize: 44,
              fontWeight: 800,
              background: side === "L" ? GLASS_CARD : ACCENT,
              border: side === "L" ? `2px solid ${GLASS_BORDER}` : "2px solid transparent",
              color: side === "L" ? SOFT : "#fff",
            }}
          >
            {side === "L" ? labelLeft : labelRight}
          </div>
        </div>
      </div>
    );
  };

  const chainL = { x: endL.x, y: endL.y };
  const chainR = { x: endR.x, y: endR.y };
  const plateCornersL = [endL.x - PLATE_W / 2 + 10, endL.x + PLATE_W / 2 - 10];
  const plateCornersR = [endR.x - PLATE_W / 2 + 10, endR.x + PLATE_W / 2 - 10];

  return (
    <Stage outFrames={0}>
      <div style={{ position: "absolute", inset: 0, fontFamily, opacity: bgOpacity }}>
        {/* Pivot, fléau, chaînes */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: beamOpacity,
            transformOrigin: `${TIP_X}px ${TIP_Y}px`,
            transform: `scale(${beamScale})`,
          }}
        >
          <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
            {/* pied + pivot */}
            <rect x={TIP_X - 190} y={TIP_Y + 262} width={380} height={28} rx={14} fill="#2A3560" stroke={GLASS_BORDER} strokeWidth={2} />
            <polygon
              points={`${TIP_X},${TIP_Y} ${TIP_X + 70},${TIP_Y + 264} ${TIP_X - 70},${TIP_Y + 264}`}
              fill="rgba(38,48,79,0.96)"
              stroke="rgba(48,96,255,0.45)"
              strokeWidth={4}
              strokeLinejoin="round"
            />
            {/* chaînes */}
            {[
              { e: chainL, c: plateCornersL, en: eL },
              { e: chainR, c: plateCornersR, en: eR },
            ].map((ch, i) => {
              const py = ch.e.y + CHAIN + ch.en.y;
              return (
                <g key={i} opacity={ch.en.o}>
                  <line x1={ch.e.x} y1={ch.e.y} x2={ch.c[0]} y2={py} stroke={MUTED} strokeWidth={3} />
                  <line x1={ch.e.x} y1={ch.e.y} x2={ch.c[1]} y2={py} stroke={MUTED} strokeWidth={3} />
                  <circle cx={ch.e.x} cy={ch.e.y} r={9} fill={SOFT} />
                </g>
              );
            })}
          </svg>
          {/* Fléau */}
          <div
            style={{
              position: "absolute",
              left: TIP_X - HALF,
              top: TIP_Y - 8,
              width: HALF * 2,
              height: 16,
              borderRadius: 8,
              background: SOFT,
              boxShadow: "0 0 24px rgba(199,206,230,0.25)",
              transformOrigin: "50% 50%",
              transform: `rotate(${angle}rad)`,
            }}
          />
          <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
            <circle cx={TIP_X} cy={TIP_Y} r={18} fill="#2A3560" stroke={SOFT} strokeWidth={4} />
          </svg>
        </div>

        {plateGroup("L", endL, eL)}
        {plateGroup("R", endR, eR)}

        {/* Légende */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 925,
            textAlign: "center",
            fontSize: 68,
            fontWeight: 800,
            color: INK,
            letterSpacing: -1,
            opacity: legendIn,
            transform: `translateY(${(1 - legendIn) * 20}px)`,
          }}
        >
          {legendPre}
          <span style={{ color: ACCENT }}>{legendAccent}</span>
        </div>
      </div>
    </Stage>
  );
};
