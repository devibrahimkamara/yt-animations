import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../atmos22/Stage";
import { ACCENT, ACCENT_LIGHT, ATMOS_ERROR, INK } from "../atmos22/theme";
import { breathe, clamp, dampedShake, exitFx } from "../atmos22/utils";

// Anim 1 — « La question qui se réécrit » (150 f / 5 s @ 30 fps).
// Timeline du brief conservée : mots 0→30 (pas de 6 f), barrage 45→69 (dashoffset,
// texte 1→0.4), shake f69, remontée 69→90 (45 %→22 %, scale 0.7, opacité 0.2),
// « Lequel » f72 / « choisir ? » f80 (spring 12/120/0.8), halo 84→100, sortie 138→150.
// Écarts : palette charte (jaune → ACCENT + glow, rouge → ATMOS_ERROR, fond aurora),
// Plus Jakarta Sans 800 au lieu de Montserrat ; respiration 100→126 (au lieu de 138)
// pour qu'aucun texte ne bouge dans les dernières frames avant la sortie.

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });

export const atmos22Anim01Schema = z.object({
  overlay: z.boolean().default(false),
  oldWords: z.array(z.string()).default(["Est-ce", "que", "je", "suis", "capable", "?"]),
  line1: z.string().default("Lequel"),
  line2: z.string().default("choisir ?"),
});

const DURATION = 150;

export const Atmos22Anim01QuestionReecrite: React.FC<z.infer<typeof atmos22Anim01Schema>> = ({
  overlay,
  oldWords,
  line1,
  line2,
}) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

  // ── Phase 2 : barrage ──
  const strike = interpolate(frame, [45, 69], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const shakeX = dampedShake(frame, 69, 4, 6);

  // ── Phase 3 : remontée ──
  const up = interpolate(frame, [69, 90], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const oldY = interpolate(up, [0, 1], [0.45, 0.22]) * height;
  const oldScale = interpolate(up, [0, 1], [1, 0.7]);
  const textOpacity = frame < 69 ? interpolate(strike, [0, 1], [1, 0.4]) : interpolate(up, [0, 1], [0.4, 0.2]);
  const lineOpacity = interpolate(up, [0, 1], [1, 0.5]);

  // ── Phase 4 : vraie question ──
  const lineSpring = (start: number) =>
    spring({ frame: frame - start, fps, config: { damping: 12, stiffness: 120, mass: 0.8 } });
  const s1 = lineSpring(72);
  const s2 = lineSpring(80);
  const glow = interpolate(frame, [84, 100], [0, 1], clamp);
  const breath = breathe(frame, 100, 126, 0.03);

  const exit = exitFx(frame, DURATION);

  const lineStyle = (s: number): React.CSSProperties => ({
    opacity: interpolate(s, [0, 1], [0, 1], clamp),
    transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px) scale(${interpolate(s, [0, 1], [0.6, 1])})`,
    fontSize: 150,
    lineHeight: 1.08,
    display: "block",
  });

  return (
    <Stage outFrames={0} bare={overlay}>
      {overlay && <AbsoluteFill style={{ background: "rgba(0,0,0,0.55)" }} />}
      <AbsoluteFill
        style={{
          fontFamily,
          fontWeight: 800,
          color: INK,
          opacity: exit.opacity,
          transform: `scale(${exit.scale})`,
        }}
      >
        {/* Ancienne question */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: oldY,
            display: "flex",
            justifyContent: "center",
            transform: `translateY(-50%) translateX(${shakeX}px) scale(${oldScale})`,
          }}
        >
          <div style={{ position: "relative", fontSize: 96, lineHeight: 1.15, whiteSpace: "nowrap" }}>
            <span style={{ opacity: textOpacity }}>
              {oldWords.map((w, i) => {
                const s = spring({
                  frame: frame - i * 6,
                  fps,
                  config: { damping: 14, stiffness: 110 },
                  durationInFrames: 12,
                });
                return (
                  <span
                    key={i}
                    style={{
                      display: "inline-block",
                      opacity: s,
                      transform: `translateY(${interpolate(s, [0, 1], [24, 0])}px)`,
                      marginRight: i < oldWords.length - 1 ? "0.26em" : 0,
                    }}
                  >
                    {w}
                  </span>
                );
              })}
            </span>
            <svg
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                overflow: "visible",
                transform: "rotate(-2deg)",
                opacity: lineOpacity,
              }}
            >
              <line
                x1="-3%"
                x2="103%"
                y1="55%"
                y2="55%"
                pathLength={1}
                stroke={ATMOS_ERROR}
                strokeWidth={10}
                strokeLinecap="round"
                strokeDasharray="1 1"
                strokeDashoffset={1 - strike}
                style={{ visibility: strike > 0 ? "visible" : "hidden" }}
              />
            </svg>
          </div>
        </div>

        {/* Vraie question */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: height * 0.6,
            textAlign: "center",
            transform: `translateY(-50%) scale(${breath})`,
          }}
        >
          <span
            style={{
              ...lineStyle(s1),
              color: ACCENT,
              textShadow: `0 0 40px rgba(48,96,255,${0.5 + 0.35 * glow}), 0 0 ${18 * glow}px rgba(136,170,255,${0.55 * glow})`,
              WebkitTextStroke: `2px ${ACCENT_LIGHT}`,
            }}
          >
            {line1}
          </span>
          <span style={lineStyle(s2)}>{line2}</span>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
