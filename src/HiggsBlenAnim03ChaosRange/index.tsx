import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsBlen/Stage";
import { INK, ACCENT, FONT, mulberry32 } from "../higgsBlen/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

// Anim 3 — « Le chaos qui se range » (240 frames)
// A Chaos 0–60 · B Frappe 60–135 · C Réorganisation 135–159 · D Hold 159–240

export const higgsBlenAnim03Schema = z.object({
  prompt: z.string().default("crée-moi un donut réaliste en 3D"),
  leftTitle: z.string().default("Interface professionnelle"),
  rightTitle: z.string().default("Toi"),
  buttonLabel: z.string().default("Générer"),
});

export type HiggsBlenAnim03Props = z.infer<typeof higgsBlenAnim03Schema>;

const SPLIT_X = 1056; // 55 % de 1920
const CENTER = { x: SPLIT_X / 2, y: 540 };

// ── Chaos : 70 panneaux seedés (position / taille / phase / vitesse / icône) ──
const rand = mulberry32(20260904);
const PANELS = Array.from({ length: 70 }, () => ({
  x: 60 + rand() * (SPLIT_X - 200),
  y: 90 + rand() * 900,
  w: 20 + rand() * 100,
  h: 20 + rand() * 60,
  phase: rand() * Math.PI * 2,
  speed: 0.06 + rand() * 0.14,
  icon: Math.floor(rand() * 4), // 0 = aucune
}));
const DOTS = Array.from({ length: 6 }, () => ({
  bx: 120 + rand() * (SPLIT_X - 240),
  by: 140 + rand() * 800,
  ax: 40 + rand() * 120,
  ay: 40 + rand() * 120,
  fx: 0.03 + rand() * 0.05,
  fy: 0.03 + rand() * 0.05,
}));

// Frappe irrégulière : frame de révélation cumulée par caractère
const buildKeyframes = (text: string) => {
  const out: number[] = [];
  let t = 0;
  for (const ch of text) {
    t += ch === " " ? 6 : 2;
    out.push(t);
  }
  return out;
};

export const HiggsBlenAnim03ChaosRange: React.FC<HiggsBlenAnim03Props> = ({
  prompt,
  leftTitle,
  rightTitle,
  buttonLabel,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chaosIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const chaosScale = interpolate(chaosIn, [0, 1], [0.98, 1]);

  // B — frappe
  const keyframes = buildKeyframes(prompt);
  const typed = keyframes.filter((k) => k <= frame - 60).length;
  const visibleText = prompt.slice(0, typed);
  const clickT = spring({ frame: frame - 126, fps, config: { damping: 8, stiffness: 300 } });
  const btnPress = frame >= 126 && frame <= 135 ? interpolate(clickT, [0, 0.5, 1], [1, 0.9, 1]) : 1;

  // C — réorganisation
  const flash = interpolate(frame, [135, 136, 138], [0, 0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const reorg = frame >= 135;
  const sepOpacity = interpolate(frame, [135, 159], [1, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cleanBtn = spring({ frame: frame - 135, fps, config: { damping: 10, stiffness: 150 } });

  // D — pouls du bouton final
  const pulse = 1 + Math.sin((frame - 159) / 10) * 0.03 * (frame > 159 ? 1 : 0);
  const cursorOn = Math.floor(frame / 15) % 2 === 0;

  return (
    <Stage outFrames={12}>
      {/* ── Zone gauche : chaos ── */}
      <AbsoluteFill style={{ opacity: chaosIn, transform: `scale(${chaosScale})` }}>
        {!reorg &&
          PANELS.map((p, i) => {
            const flicker = Math.sin(frame * p.speed + p.phase) * 0.15 + 0.85;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: p.x,
                  top: p.y,
                  width: p.w,
                  height: p.h,
                  background: "rgba(42,42,58,0.55)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 4,
                  opacity: flicker,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {p.icon === 1 && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,0.4)" }} />}
                {p.icon === 2 && <div style={{ width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderBottom: "10px solid rgba(255,255,255,0.4)" }} />}
                {p.icon === 3 && <div style={{ width: "70%", height: 2, background: "rgba(255,255,255,0.35)", transform: "rotate(-35deg)" }} />}
              </div>
            );
          })}

        {/* curseurs erratiques */}
        {!reorg &&
          DOTS.map((d, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: d.bx + Math.sin(frame * d.fx + i) * d.ax,
                top: d.by + Math.cos(frame * d.fy + i * 1.7) * d.ay,
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: ACCENT,
                boxShadow: `0 0 16px ${ACCENT}`,
              }}
            />
          ))}

        {/* bouton propre unique (phase C/D) */}
        {reorg && (
          <div
            style={{
              position: "absolute",
              left: CENTER.x,
              top: CENTER.y,
              transform: `translate(-50%,-50%) scale(${cleanBtn * pulse})`,
              padding: "36px 72px",
              borderRadius: 20,
              background: ACCENT,
              boxShadow: `0 20px 50px ${ACCENT}55`,
              fontFamily,
              fontWeight: 800,
              fontSize: FONT.label,
              color: INK,
            }}
          >
            {buttonLabel}
          </div>
        )}
      </AbsoluteFill>

      {/* rects aspirés vers le centre en phase C */}
      {reorg &&
        PANELS.map((p, i) => {
          const suck = interpolate(frame - 135, [i * 0.3, i * 0.3 + 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          if (suck >= 1) return null;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: interpolate(suck, [0, 1], [p.x, CENTER.x]),
                top: interpolate(suck, [0, 1], [p.y, CENTER.y]),
                width: p.w,
                height: p.h,
                background: "rgba(42,42,58,0.55)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 4,
                opacity: 1 - suck,
                transform: `scale(${1 - suck})`,
              }}
            />
          );
        })}

      {/* séparateur central */}
      <div
        style={{
          position: "absolute",
          left: SPLIT_X,
          top: 0,
          bottom: 0,
          width: 2,
          background: "rgba(255,255,255,0.18)",
          opacity: sepOpacity,
        }}
      />

      {/* ── Zone droite : chat ── */}
      <div
        style={{
          position: "absolute",
          left: SPLIT_X + 40,
          right: 60,
          top: 120,
          bottom: 120,
          background: "rgba(22,22,32,0.7)",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 20,
          padding: 40,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        {visibleText.length > 0 && (
          <div
            style={{
              alignSelf: "flex-end",
              maxWidth: "90%",
              padding: "22px 30px",
              borderRadius: 18,
              background: reorg ? "rgba(255,255,255,0.08)" : ACCENT,
              color: INK,
              fontFamily,
              fontWeight: 700,
              fontSize: FONT.micro,
              marginBottom: 28,
              opacity: reorg ? 0.6 : 1,
            }}
          >
            {visibleText}
            {!reorg && cursorOn && <span style={{ opacity: 0.7 }}>|</span>}
          </div>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            height: 84,
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.14)",
            padding: "0 24px",
          }}
        >
          <span style={{ flex: 1, fontFamily, fontSize: FONT.micro, color: "rgba(255,255,255,0.4)" }}>
            {visibleText.length === 0 && !reorg && cursorOn ? "|" : ""}
          </span>
          <div
            style={{
              padding: "16px 28px",
              borderRadius: 10,
              background: ACCENT,
              color: INK,
              fontFamily,
              fontWeight: 800,
              fontSize: FONT.micro,
              transform: `scale(${btnPress})`,
            }}
          >
            Entrée
          </div>
        </div>
      </div>

      {/* titres de zones */}
      <span style={{ position: "absolute", left: 60, top: 60, fontFamily, fontWeight: 800, fontSize: FONT.micro, letterSpacing: "3px", color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>
        {leftTitle}
      </span>
      <span style={{ position: "absolute", left: SPLIT_X + 44, top: 60, fontFamily, fontWeight: 800, fontSize: FONT.micro, letterSpacing: "3px", color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>
        {rightTitle}
      </span>

      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </Stage>
  );
};
