import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../atmos22/Stage";
import { ACCENT, ATMOS_ERROR, INK, MUTED, NEUTRAL_PANEL } from "../atmos22/theme";
import { clamp, exitFx } from "../atmos22/utils";

const { fontFamily } = loadFont("normal", {
  weights: ["500", "800"],
  subsets: ["latin"],
});

// Anim 5 — « La timeline documentée » (120 f / 4 s @ 30 fps)
// Timeline du brief conservée : piste 0–20 · REC 4–10 puis clignote /15 f ·
// jalon 1 f14 (labels f18) · curseur 22–56 (inOut quad) puis 56–90 (out cubic) ·
// jalon 2 gris f30 / labels f34 / allumé + pop f56 · jalon 3 pointillé f46 (1 tour / 4 s),
// « ? » pulsé, labels f62 · curseur pulse 90–108 · sortie 108–120.
// Écarts : palette charte (jaune → ACCENT, REC → ATMOS_ERROR, piste NEUTRAL_PANEL),
// Plus Jakarta Sans, titres 72 px / sous-titres 48 px (≥ 44), jalons 72 px, curseur 48 px,
// REC 30 px + 48 px calé dans la zone 120 px. Pour tenir dans la zone de sécurité, les
// labels du jalon 1 sont alignés à gauche, ceux du jalon 3 à droite (jalon 2 centré).
// Le « ? » ne pulse que de 46 à 86 (cycles complets) : aucun texte ne bouge dans les
// 15 dernières frames avant la sortie.

export const atmos22Anim05Schema = z.object({
  title1: z.string().default("Jour 1"),
  sub1: z.string().default("Le choix de l'idée"),
  title2: z.string().default("Lancement"),
  sub2: z.string().default("La mise en ligne"),
  title3: z.string().default("Résultats"),
  sub3: z.string().default("Le verdict"),
});

const TRACK_Y = 540;
const X1 = 240;
const X2 = 960;
const X3 = 1680;
const DOT = 72;
const TITLE_TOP = 612;
const SUB_TOP = 700;

const labelIn = (frame: number, start: number) => ({
  opacity: interpolate(frame, [start, start + 10], [0, 1], clamp),
  y: interpolate(frame, [start, start + 10], [16, 0], { ...clamp, easing: Easing.out(Easing.cubic) }),
});

const Label: React.FC<{
  x: number;
  align: "left" | "center" | "right";
  title: string;
  sub: string;
  titleColor: string;
  subColor: string;
  opacity: number;
  y: number;
}> = ({ x, align, title, sub, titleColor, subColor, opacity, y }) => {
  const anchor =
    align === "left"
      ? { left: x - DOT / 2 }
      : align === "right"
        ? { right: 1920 - (x + DOT / 2) }
        : { left: x, transform: "translateX(-50%)" };
  const base: React.CSSProperties = {
    position: "absolute",
    whiteSpace: "nowrap",
    textAlign: align,
    ...anchor,
  };
  return (
    <div style={{ opacity, transform: `translateY(${y}px)`, position: "absolute", inset: 0 }}>
      <div style={{ ...base, top: TITLE_TOP, fontWeight: 800, fontSize: 72, lineHeight: 1.1, color: titleColor }}>
        {title}
      </div>
      <div style={{ ...base, top: SUB_TOP, fontWeight: 500, fontSize: 48, lineHeight: 1.2, color: subColor }}>
        {sub}
      </div>
    </div>
  );
};

export const Atmos22Anim05TimelineDocumentee: React.FC<z.infer<typeof atmos22Anim05Schema>> = ({
  title1,
  sub1,
  title2,
  sub2,
  title3,
  sub3,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const exit = exitFx(frame, durationInFrames, 12);

  // Piste
  const track = interpolate(frame, [0, 20], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  // REC
  const recIn = interpolate(frame, [4, 10], [0, 1], clamp);
  const blink = frame >= 10 && Math.floor((frame - 10) / 15) % 2 === 1 ? 0.2 : 1;

  // Curseur
  const cursorX =
    frame < 56
      ? interpolate(frame, [22, 56], [X1, X2], { ...clamp, easing: Easing.inOut(Easing.quad) })
      : interpolate(frame, [56, 90], [X2, 1440], { ...clamp, easing: Easing.out(Easing.cubic) });
  const cursorOp = interpolate(frame, [22, 26], [0, 1], clamp);
  const cursorPulse =
    frame > 90 && frame < 108 ? 1 + 0.15 * Math.sin(((frame - 90) / 18) * Math.PI) : 1;

  // Jalon 1
  const j1 = spring({ frame: frame - 14, fps, config: { damping: 12, stiffness: 150 } });
  const l1 = labelIn(frame, 18);

  // Jalon 2
  const j2In = interpolate(frame, [30, 36], [0, 1], clamp);
  const lit2 = frame >= 56;
  const pop2 = interpolate(frame, [56, 61, 68], [1, 1.25, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const l2 = labelIn(frame, 34);
  const label2Color = interpolateColors(frame, [56, 60], [MUTED, INK]);

  // Jalon 3
  const j3In = spring({ frame: frame - 46, fps, config: { damping: 14, stiffness: 140 } });
  const rot3 = frame < 46 ? 0 : ((frame - 46) / 120) * 360;
  const qPulse =
    frame > 46 && frame < 86 ? 1 + 0.15 * Math.sin((((frame - 46) % 20) / 20) * Math.PI) : 1;
  const l3 = labelIn(frame, 62);

  const glow = "0 0 32px rgba(48,96,255,0.6)";

  return (
    <Stage outFrames={0}>
      <AbsoluteFill style={{ fontFamily, opacity: exit.opacity, transform: `scale(${exit.scale})` }}>
        {/* REC */}
        <div
          style={{
            position: "absolute",
            left: 120,
            top: 150,
            transform: "translateY(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 18,
            opacity: recIn * blink,
          }}
        >
          <div style={{ width: 30, height: 30, borderRadius: 15, background: ATMOS_ERROR, boxShadow: "0 0 18px rgba(239,68,68,0.6)" }} />
          <div style={{ fontWeight: 800, fontSize: 48, color: INK, letterSpacing: 2 }}>REC</div>
        </div>

        {/* Piste */}
        <div
          style={{
            position: "absolute",
            left: X1,
            top: TRACK_Y - 4,
            width: X3 - X1,
            height: 8,
            borderRadius: 4,
            background: NEUTRAL_PANEL,
            transform: `scaleX(${track})`,
            transformOrigin: "left",
          }}
        />
        {/* Remplissage */}
        <div
          style={{
            position: "absolute",
            left: X1,
            top: TRACK_Y - 4,
            width: Math.max(0, cursorX - X1),
            height: 8,
            borderRadius: 4,
            background: ACCENT,
            boxShadow: glow,
            opacity: cursorOp,
          }}
        />

        {/* Jalon 1 */}
        <div
          style={{
            position: "absolute",
            left: X1 - DOT / 2,
            top: TRACK_Y - DOT / 2,
            width: DOT,
            height: DOT,
            borderRadius: DOT / 2,
            background: ACCENT,
            boxShadow: glow,
            transform: `scale(${Math.max(0, j1)})`,
          }}
        />
        {/* Jalon 2 */}
        <div
          style={{
            position: "absolute",
            left: X2 - DOT / 2,
            top: TRACK_Y - DOT / 2,
            width: DOT,
            height: DOT,
            borderRadius: DOT / 2,
            background: lit2 ? ACCENT : NEUTRAL_PANEL,
            border: lit2 ? "none" : "2px solid rgba(255,255,255,0.12)",
            boxSizing: "border-box",
            boxShadow: lit2 ? glow : "none",
            opacity: j2In,
            transform: `scale(${(0.6 + 0.4 * j2In) * pop2})`,
          }}
        />
        {/* Jalon 3 — mystère */}
        <div
          style={{
            position: "absolute",
            left: X3 - DOT / 2,
            top: TRACK_Y - DOT / 2,
            width: DOT,
            height: DOT,
            transform: `scale(${Math.max(0, j3In)})`,
            opacity: frame >= 46 ? 1 : 0,
          }}
        >
          <svg width={DOT} height={DOT} style={{ position: "absolute", inset: 0, transform: `rotate(${rot3}deg)` }}>
            <circle
              cx={DOT / 2}
              cy={DOT / 2}
              r={DOT / 2 - 2}
              fill="rgba(11,14,28,0.85)"
              stroke={MUTED}
              strokeWidth={4}
              strokeDasharray="8 8"
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 48,
              lineHeight: 1,
              color: ACCENT,
              transform: `scale(${qPulse})`,
            }}
          >
            ?
          </div>
        </div>

        {/* Curseur */}
        <svg
          width={48}
          height={42}
          viewBox="0 0 48 42"
          style={{
            position: "absolute",
            left: cursorX - 24,
            top: 480 - 21,
            opacity: cursorOp,
            transform: `scale(${cursorPulse})`,
          }}
        >
          <path d="M4 4 L44 4 L24 38 Z" fill={ACCENT} stroke={ACCENT} strokeWidth={4} strokeLinejoin="round" />
        </svg>

        {/* Labels */}
        <Label x={X1} align="left" title={title1} sub={sub1} titleColor={INK} subColor={MUTED} opacity={l1.opacity} y={l1.y} />
        <Label x={X2} align="center" title={title2} sub={sub2} titleColor={label2Color} subColor={MUTED} opacity={l2.opacity} y={l2.y} />
        <Label
          x={X3}
          align="right"
          title={title3}
          sub={sub3}
          titleColor="rgba(255,255,255,0.7)"
          subColor={MUTED}
          opacity={l3.opacity}
          y={l3.y}
        />
      </AbsoluteFill>
    </Stage>
  );
};
