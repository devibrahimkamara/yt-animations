// Atmos22 · Anim 8 — « Les trois fausses excuses » (180 f @ 30 fps).
// Timeline du brief conservée : cartes à cardStart = [8, 40, 72] (prop zod, recalable sur la voix),
// icône pop +6 f, flottaison ±4 px · tampon 104–112 (scale 2.4 → 1, Easing.in(quad)), impact 112 :
// shake ±8 px amorti 112–120, flash rouge 0.15 → 0 (6 f), cartes désaturées → 55 % (112–122) ·
// maintien 122–168 (seule la respiration 1 → 1.02 → 1 du tampon) · sortie 168–180 (fondu + scale 0.97).
// Écarts : fond aurora (Stage), cartes glass (GLASS_CARD / GLASS_BORDER), icônes trait 4 px ACCENT →
// DESATURATED, tampon ATMOS_ERROR, Plus Jakarta Sans 800 (pas de 900 disponible). Tailles mobile :
// titres 56 → 72 px, sous-titres 28 → 46 px (MUTED), icônes 120 → 130 px. La flottaison s'éteint
// pendant l'impact (112–122) pour que le maintien soit réellement stable.
import { AbsoluteFill, Easing, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../atmos22/Stage";
import { ACCENT, ATMOS_ERROR, DESATURATED, GLASS_BORDER, GLASS_CARD, INK, MUTED } from "../atmos22/theme";
import { breathe, clamp, dampedShake, exitFx } from "../atmos22/utils";

const { fontFamily } = loadFont("normal", { weights: ["500", "800"], subsets: ["latin"] });

export const atmos22Anim08Schema = z.object({
  cardStart: z.array(z.number()).default([8, 40, 72]),
  stampText: z.string().default("PLUS UN PROBLÈME"),
});

const CARD_W = 480;
const CARD_H = 420;
const CENTERS_X = [420, 960, 1500];
const CENTER_Y = 500;
const IMPACT = 112;

type IconProps = { color: string; size: number };
const SW = 4; // trait 4 px (viewBox 130 rendu à 130 px)

const BulbIcon: React.FC<IconProps> = ({ color, size }) => (
  <svg width={size} height={size} viewBox="0 0 130 130" fill="none" stroke={color} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
    <path d="M65 18c-21 0-37 16-37 36 0 13 6 22 14 29 4 4 6 8 6 13v6h34v-6c0-5 2-9 6-13 8-7 14-16 14-29 0-20-16-36-37-36Z" />
    <path d="M50 112h30M54 122h22" />
    <path d="M65 102V78M56 70l9 8 9-8" />
  </svg>
);

const WrenchIcon: React.FC<IconProps> = ({ color, size }) => (
  <svg width={size} height={size} viewBox="0 0 130 130" fill="none" stroke={color} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
    <path d="M84 20a26 26 0 0 0-26 34L20 92a12 12 0 0 0 17 17l38-38a26 26 0 0 0 34-26l-15 15-16-4-4-16 15-15c-3-1-6-1-9-1Z" />
    <circle cx={29} cy={100} r={3} />
  </svg>
);

const CoinIcon: React.FC<IconProps> = ({ color, size }) => (
  <svg width={size} height={size} viewBox="0 0 130 130" fill="none" stroke={color} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
    <circle cx={65} cy={65} r={46} />
    <circle cx={65} cy={65} r={34} />
    <path d="M77 52c-3-4-7-6-12-6-7 0-12 4-12 9 0 12 25 7 25 19 0 6-6 10-13 10-6 0-10-2-13-6M65 40v6M65 84v6" />
  </svg>
);

const CARDS = [
  { Icon: BulbIcon, title: "IDÉES", sub: "Pas d'idées ?" },
  { Icon: WrenchIcon, title: "OUTILS", sub: "Pas d'outils ?" },
  { Icon: CoinIcon, title: "BUDGET", sub: "Pas de budget ?" },
];

export const Atmos22Anim08TroisFaussesExcuses: React.FC<z.infer<typeof atmos22Anim08Schema>> = ({
  cardStart,
  stampText,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Impact
  const shakeX = dampedShake(frame, IMPACT, 8, 8);
  const shakeY = dampedShake(frame + 1, IMPACT, 8, 5);
  const flash = frame >= IMPACT ? interpolate(frame, [IMPACT, IMPACT + 6], [0.15, 0], clamp) : 0;
  const desat = interpolate(frame, [IMPACT, IMPACT + 10], [0, 1], clamp);
  const floatAmp = interpolate(frame, [IMPACT, IMPACT + 10], [1, 0], clamp);

  // Tampon
  const stampT = interpolate(frame, [104, IMPACT], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const stampScale = interpolate(stampT, [0, 1], [2.4, 1]) * breathe(frame, 122, 168, 0.02);
  const stampOpacity = interpolate(frame, [104, IMPACT], [0, 1], clamp);

  const exit = exitFx(frame, durationInFrames, 12);

  return (
    <Stage outFrames={0}>
      <AbsoluteFill
        style={{
          fontFamily,
          opacity: exit.opacity,
          transform: `translate(${shakeX}px, ${shakeY}px) scale(${exit.scale})`,
        }}
      >
        {CARDS.map(({ Icon, title, sub }, i) => {
          const start = cardStart[i] ?? 8 + i * 32;
          const s = spring({ frame: frame - start, fps, config: { damping: 13, stiffness: 130 } });
          const visible = frame >= start;
          const ty = interpolate(s, [0, 1], [80, 0]);
          const sc = interpolate(s, [0, 1], [0.9, 1]);
          const op = interpolate(frame, [start, start + 8], [0, 1], clamp) * interpolate(desat, [0, 1], [1, 0.55]);
          const float = 4 * Math.sin((frame - start) / 14 + i * 2.1) * s * floatAmp;
          const iconScale = interpolate(frame, [start + 6, start + 12, start + 18], [0, 1.15, 1], {
            ...clamp,
            easing: Easing.out(Easing.quad),
          });
          const iconColor = interpolateColors(desat, [0, 1], [ACCENT, DESATURATED]);
          if (!visible) return null;
          return (
            <div
              key={title}
              style={{
                position: "absolute",
                left: CENTERS_X[i] - CARD_W / 2,
                top: CENTER_Y - CARD_H / 2,
                width: CARD_W,
                height: CARD_H,
                borderRadius: 28,
                background: GLASS_CARD,
                border: `2px solid ${GLASS_BORDER}`,
                boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
                opacity: op,
                transform: `translateY(${ty + float}px) scale(${sc})`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 18,
              }}
            >
              <div style={{ transform: `scale(${iconScale})`, height: 130 }}>
                <Icon color={iconColor} size={130} />
              </div>
              <div style={{ color: INK, fontWeight: 800, fontSize: 72, lineHeight: 1, letterSpacing: 1 }}>{title}</div>
              <div style={{ color: MUTED, fontWeight: 500, fontSize: 46, lineHeight: 1.1 }}>{sub}</div>
            </div>
          );
        })}

        {/* Tampon */}
        {frame >= 104 && (
          <div
            style={{
              position: "absolute",
              left: 960,
              top: CENTER_Y,
              transform: `translate(-50%, -50%) rotate(-8deg) scale(${stampScale})`,
              opacity: stampOpacity,
              padding: "24px 48px",
              border: `8px solid ${ATMOS_ERROR}`,
              borderRadius: 12,
              background: "rgba(11,11,15,0.85)",
              color: ATMOS_ERROR,
              fontWeight: 800,
              fontSize: 110,
              letterSpacing: 4,
              lineHeight: 1,
              whiteSpace: "nowrap",
              boxShadow: "0 0 50px rgba(239,68,68,0.35)",
            }}
          >
            {stampText}
          </div>
        )}
      </AbsoluteFill>

      {/* Flash rouge plein écran */}
      {flash > 0 && <AbsoluteFill style={{ background: ATMOS_ERROR, opacity: flash }} />}
    </Stage>
  );
};
