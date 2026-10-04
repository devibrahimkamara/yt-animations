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
import { Stage } from "../higgs2/Stage";
import { Emoji } from "../higgs2/Emoji";
import { ACCENT, INK, YT_RED, FONT, ICON } from "../higgs2/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const higgs2Anim04Schema = z.object({
  baseCount: z.number().default(128409),
  buttonIdle: z.string().default("S'abonner"),
  buttonDone: z.string().default("Abonné ✓"),
});

export type Higgs2Anim04Props = z.infer<typeof higgs2Anim04Schema>;

const DIGIT_H = 128;
const DIGIT_W = 78;
const DIGIT_FS = 104;
const N_DIGITS = 6;
const STRIP = Array.from({ length: 64 }, (_, i) => i % 10);
const CLICK_FRAME = 83;
const BTN_W = 460;
const BTN_H = 120;

const quad = (p0: number, pc: number, p1: number, t: number) =>
  (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * pc + t * t * p1;

export const Higgs2Anim04CTAAbonnementCompteur: React.FC<Higgs2Anim04Props> = ({
  baseCount,
  buttonIdle,
  buttonDone,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const intro = spring({ frame, fps, config: { damping: 15, stiffness: 150 } });
  const introY = interpolate(intro, [0, 1], [20, 0], { extrapolateRight: "clamp" });

  const digits = String(baseCount).padStart(N_DIGITS, "0").split("").map(Number);

  // ── Odomètre : offset (en "chiffres") par colonne
  const columnOffset = (j: number) => {
    const startF = 18 + (N_DIGITS - 1 - j) * 3;
    const turns = 5 - (N_DIGITS - 1 - j) * 0.6;
    const settle = interpolate(frame, [startF, 66], [0, turns * 10 + digits[j]], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    const plusOne =
      j === N_DIGITS - 1
        ? spring({ frame: frame - CLICK_FRAME, fps, config: { damping: 10, stiffness: 250 } })
        : 0;
    return settle + plusOne;
  };

  // ── Curseur (66 → 81)
  const cursorT = interpolate(frame, [66, 81], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const cursorX = quad(1440, 1120, 960, cursorT);
  const cursorY = quad(960, 780, 660, cursorT);
  const cursorVisible = frame >= 60 && frame <= 132;

  // ── Clic : squash + ripple (81 → 96)
  const squashBack = spring({
    frame: frame - 85,
    fps,
    config: { damping: 8, stiffness: 300 },
  });
  const btnScaleY =
    frame < 81
      ? 1
      : frame < 85
        ? interpolate(frame, [81, 85], [1, 0.92], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
        : interpolate(squashBack, [0, 1], [0.92, 1], { extrapolateRight: "clamp" });

  const rippleT = interpolate(frame, [81, 96], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rippleScale = interpolate(rippleT, [0, 1], [0, 3.5]);
  const rippleOpacity = interpolate(rippleT, [0, 1], [0.6, 0]);

  const unitFlash = interpolate(frame, [CLICK_FRAME, CLICK_FRAME + 1, CLICK_FRAME + 3], [0, 0.8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelCross = interpolate(frame, [CLICK_FRAME, CLICK_FRAME + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Cloche (96 → 126)
  const bellAmp = interpolate(frame, [96, 126], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bellAngle = frame >= 96 ? Math.sin((frame - 96) / 2.2) * bellAmp : 0;
  const waveOpacity = interpolate(frame, [98, 104, 116], [0, 0.7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage outFrames={10}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            opacity: intro,
            transform: `translateY(${introY}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 72,
          }}
        >
          {/* Odomètre */}
          <div style={{ display: "flex", gap: 4, background: "#0F172A", padding: "22px 28px", borderRadius: 22, border: "2px solid rgba(80,130,255,0.25)" }}>
            {digits.map((_, j) => {
              const offset = columnOffset(j);
              const isUnits = j === N_DIGITS - 1;
              return (
                <div
                  key={j}
                  style={{
                    position: "relative",
                    width: DIGIT_W,
                    height: DIGIT_H,
                    overflow: "hidden",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  <div style={{ transform: `translateY(${-offset * DIGIT_H}px)` }}>
                    {STRIP.map((d, k) => (
                      <div
                        key={k}
                        style={{
                          height: DIGIT_H,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily,
                          fontWeight: 800,
                          fontSize: DIGIT_FS,
                          color: INK,
                        }}
                      >
                        {d}
                      </div>
                    ))}
                  </div>
                  {isUnits && (
                    <div style={{ position: "absolute", inset: 0, background: ACCENT, opacity: unitFlash }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Bouton + cloche */}
          <div style={{ display: "flex", alignItems: "center", gap: 56 }}>
            <div
              style={{
                position: "relative",
                width: BTN_W,
                height: BTN_H,
                borderRadius: 10,
                background: YT_RED,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scaleY(${btnScaleY})`,
                transformOrigin: "center",
                boxShadow: `0 10px 30px ${YT_RED}55`,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  fontFamily,
                  fontWeight: 800,
                  fontSize: FONT.label,
                  color: INK,
                  opacity: 1 - labelCross,
                }}
              >
                {buttonIdle}
              </span>
              <span
                style={{
                  position: "absolute",
                  fontFamily,
                  fontWeight: 800,
                  fontSize: FONT.label,
                  color: INK,
                  opacity: labelCross,
                }}
              >
                {buttonDone}
              </span>

              {/* ripple */}
              {frame >= 81 && frame <= 98 && (
                <div
                  style={{
                    position: "absolute",
                    width: 180,
                    height: 180,
                    borderRadius: "50%",
                    border: `5px solid ${INK}`,
                    transform: `scale(${rippleScale})`,
                    opacity: rippleOpacity,
                  }}
                />
              )}
            </div>

            {/* cloche */}
            <div style={{ position: "relative", transform: `rotate(${bellAngle}deg)`, transformOrigin: "top center" }}>
              <Emoji size={ICON.md}>🔔</Emoji>
              {[-1, 1].map((s) => (
                <div
                  key={s}
                  style={{
                    position: "absolute",
                    top: "38%",
                    left: s < 0 ? -46 : ICON.md + 10,
                    width: 30,
                    height: 30,
                    borderRight: s > 0 ? `5px solid ${ACCENT}` : "none",
                    borderLeft: s < 0 ? `5px solid ${ACCENT}` : "none",
                    borderRadius: "50%",
                    opacity: waveOpacity,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* curseur */}
        {cursorVisible && (
          <svg
            width="70"
            height="70"
            viewBox="0 0 24 24"
            style={{
              position: "absolute",
              left: cursorX - 8,
              top: cursorY - 6,
              filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.55))",
            }}
          >
            <path d="M4 2 L4 18 L8.5 13.5 L11.5 20 L14 19 L11 12.5 L17 12.5 Z" fill={INK} stroke="#0F172A" strokeWidth={1} />
          </svg>
        )}
      </AbsoluteFill>
    </Stage>
  );
};
