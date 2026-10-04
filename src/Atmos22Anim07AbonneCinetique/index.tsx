// Atmos22 · Anim 7 — « Abonne-toi, version cinétique » (105 f @ 30 fps, FOND TRANSPARENT).
// Timeline du brief conservée : entrée bouton+cloche 0–14 · curseur Bézier quadratique 10–40 ·
// clic 40 (onde 40–52, bascule « Abonné » 44–50, check 8 f) · sortie curseur 56–70 ·
// cloche jaune + oscillation amortie dès 50 · pouce pop 60 + 8 particules (16 f) · sortie 95–105.
// Écarts : bouton ACCENT → NEUTRAL_PANEL (au lieu de #FF3B30 → #2A2A33), pouce sur cercle ACCENT
// (au lieu de #0A84FF), cloche AD_YELLOW, particules ACCENT / AD_YELLOW, Plus Jakarta Sans.
// Mobile : tout le groupe est agrandi ×1,3 autour de (1757, 820) — bord droit inchangé à x = 1757,
// texte du bouton 40 → 52 px, bas du groupe (particules comprises) ≤ y 945 → zone 120 px respectée.
import { AbsoluteFill, Easing, interpolate, interpolateColors, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../atmos22/Stage";
import { ACCENT, AD_YELLOW, INK, NEUTRAL_PANEL } from "../atmos22/theme";
import { clamp, exitFx } from "../atmos22/utils";

const { fontFamily } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });

export const atmos22Anim07Schema = z.object({
  subscribeLabel: z.string().default("S'abonner"),
  subscribedLabel: z.string().default("Abonné"),
});

const Y = 820;
const THUMB_X = 1103;
const BTN_X = 1413;
const BELL_X = 1702;
const BTN_W = 420;
const BTN_H = 110;
const ZOOM = 1.3; // agrandissement mobile, origine (1757, 820)

const CLICK = { x: 1430, y: 840 };
const P0 = { x: 1800, y: 1100 };
const PC = { x: 1650, y: 960 };

const quadBezier = (t: number) => ({
  x: (1 - t) ** 2 * P0.x + 2 * (1 - t) * t * PC.x + t ** 2 * CLICK.x,
  y: (1 - t) ** 2 * P0.y + 2 * (1 - t) * t * PC.y + t ** 2 * CLICK.y,
});

const BellIcon: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M6 16V11a6 6 0 0 1 12 0v5l1.6 2H4.4L6 16Z"
      fill={color}
      stroke={color}
      strokeWidth={1.4}
      strokeLinejoin="round"
    />
    <path d="M10 20.2a2.1 2.1 0 0 0 4 0" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <circle cx={12} cy={3.6} r={1.3} fill={color} />
  </svg>
);

const ThumbIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M7.5 10.5 11 3.6c1.4 0 2.4 1.1 2.2 2.5l-.6 3.4h5.1c1.3 0 2.2 1.2 1.9 2.4l-1.6 6.6c-.2.9-1 1.5-1.9 1.5H7.5V10.5Z"
      fill={INK}
    />
    <rect x={3} y={10.5} width={3.2} height={9.5} rx={1} fill={INK} />
  </svg>
);

const Cursor: React.FC = () => (
  // Pointe de la flèche en (0,0) du SVG → alignée sur la position du curseur.
  <svg width={64} height={64} viewBox="0 0 64 64" style={{ overflow: "visible" }}>
    <path
      d="M3 3 L3 52 L16 40 L25 60 L34 56 L25 37 L43 37 Z"
      fill="#FFFFFF"
      stroke="#000000"
      strokeWidth={3}
      strokeLinejoin="round"
    />
  </svg>
);

export const Atmos22Anim07AbonneCinetique: React.FC<z.infer<typeof atmos22Anim07Schema>> = ({
  subscribeLabel,
  subscribedLabel,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // ── Phase 1 : bouton + cloche (0–14) ──
  const enter = spring({ frame, fps, config: { damping: 13, stiffness: 140 } });
  const enterScale = interpolate(enter, [0, 1], [0.7, 1]);
  const enterOpacity = interpolate(frame, [0, 14], [0, 1], clamp);

  // ── Phase 2 : curseur (10–40) ──
  const tCursor = interpolate(frame, [10, 40], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const cursorPos = quadBezier(tCursor);
  const cursorOut = interpolate(frame, [56, 70], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const cursorX = cursorPos.x + 220 * cursorOut;
  const cursorY = cursorPos.y + 200 * cursorOut;
  const cursorOpacity =
    interpolate(frame, [10, 14], [0, 1], clamp) * interpolate(frame, [56, 70], [1, 0], clamp);

  // ── Phase 3 : clic (40–56) ──
  const press = frame >= 40 ? interpolate(frame, [40, 48], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) }) : 1;
  const cursorScale = frame >= 40 ? interpolate(press, [0, 1], [0.9, 1]) : 1;
  const btnPress = frame >= 40 ? interpolate(press, [0, 1], [0.92, 1]) : 1;
  const ripple = interpolate(frame, [40, 52], [0, 1], clamp);
  const rippleR = 60 * ripple;
  const rippleOpacity = frame >= 40 ? 0.5 * (1 - ripple) : 0;

  const swap = interpolate(frame, [44, 50], [0, 1], clamp);
  const btnColor = interpolateColors(swap, [0, 1], [ACCENT, NEUTRAL_PANEL]);
  const checkDraw = interpolate(frame, [46, 54], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  // ── Phase 4 : cloche (50–80) ──
  const bellYellow = interpolate(frame, [50, 53], [0, 1], clamp);
  const bellColor = interpolateColors(bellYellow, [0, 1], [INK, AD_YELLOW]);
  const tb = frame - 50;
  const bellAngle = tb >= 0 ? 22 * Math.sin(tb * 0.7) * Math.exp(-tb / 10) : 0;

  // ── Phase 5 : pouce (60–95) ──
  const thumbScale = spring({ frame: frame - 60, fps, config: { damping: 9, stiffness: 180 } });
  const partT = interpolate(frame, [60, 76], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  // ── Sortie (95–105) ──
  const exit = exitFx(frame, durationInFrames, 10);

  const CHECK_LEN = 30;

  return (
    <Stage bare outFrames={0}>
      <AbsoluteFill
        style={{
          opacity: exit.opacity,
          transform: `scale(${exit.scale * ZOOM})`,
          transformOrigin: `1757px ${Y}px`,
          fontFamily,
        }}
      >
        {/* Particules (derrière le pouce) */}
        {frame >= 60 &&
          frame <= 76 &&
          new Array(8).fill(0).map((_, i) => {
            const a = random(`angle-${i}`) * Math.PI * 2;
            const d = 90 * partT;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: THUMB_X + Math.cos(a) * d - 5,
                  top: Y + Math.sin(a) * d - 5,
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  background: i % 2 === 0 ? AD_YELLOW : ACCENT,
                  opacity: 1 - partT,
                }}
              />
            );
          })}

        {/* Pouce */}
        {frame >= 60 && (
          <div
            style={{
              position: "absolute",
              left: THUMB_X - 60,
              top: Y - 60,
              width: 120,
              height: 120,
              borderRadius: 60,
              background: ACCENT,
              boxShadow: "0 0 34px rgba(48,96,255,0.55)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${thumbScale})`,
            }}
          >
            <ThumbIcon size={70} />
          </div>
        )}

        {/* Bouton */}
        <div
          style={{
            position: "absolute",
            left: BTN_X - BTN_W / 2,
            top: Y - BTN_H / 2,
            width: BTN_W,
            height: BTN_H,
            borderRadius: 55,
            background: btnColor,
            boxShadow: `0 0 ${36 * (1 - swap)}px rgba(48,96,255,${0.5 * (1 - swap)})`,
            opacity: enterOpacity,
            transform: `scale(${enterScale * btnPress})`,
            color: INK,
            fontWeight: 700,
            fontSize: 40,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 1 - swap,
            }}
          >
            {subscribeLabel}
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              opacity: swap,
            }}
          >
            {subscribedLabel}
            <svg width={38} height={38} viewBox="0 0 24 24" fill="none">
              <path
                d="M4.5 12.5 9.5 17.5 19.5 6.5"
                stroke={INK}
                strokeWidth={3.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={CHECK_LEN}
                strokeDashoffset={CHECK_LEN * (1 - checkDraw)}
              />
            </svg>
          </div>
        </div>

        {/* Cloche */}
        <div
          style={{
            position: "absolute",
            left: BELL_X - 55,
            top: Y - 55,
            width: 110,
            height: 110,
            borderRadius: 55,
            background: NEUTRAL_PANEL,
            opacity: enterOpacity,
            transform: `scale(${enterScale})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: 56, height: 56, transform: `rotate(${bellAngle}deg)`, transformOrigin: "50% 6%" }}>
            <BellIcon color={bellColor} size={56} />
          </div>
        </div>

        {/* Onde de clic */}
        {rippleOpacity > 0 && (
          <div
            style={{
              position: "absolute",
              left: CLICK.x - rippleR,
              top: CLICK.y - rippleR,
              width: rippleR * 2,
              height: rippleR * 2,
              borderRadius: "50%",
              border: `3px solid ${INK}`,
              background: "rgba(255,255,255,0.3)",
              opacity: rippleOpacity,
            }}
          />
        )}

        {/* Curseur */}
        {cursorOpacity > 0 && (
          <div
            style={{
              position: "absolute",
              left: cursorX,
              top: cursorY,
              opacity: cursorOpacity,
              transform: `scale(${cursorScale})`,
              transformOrigin: "0 0",
            }}
          >
            <Cursor />
          </div>
        )}
      </AbsoluteFill>
    </Stage>
  );
};
