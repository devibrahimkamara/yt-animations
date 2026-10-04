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
import { Stage } from "../higgsGpt/Stage";
import {
  ACCENT,
  ASTRA_TEAL,
  ASTRA_TEAL_GLOW,
  INK,
  FONT,
  mulberry32,
} from "../higgsGpt/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "800"],
  subsets: ["latin"],
});

// Anim 1 — « Le rembobinage » (165 frames / 5,5 s @ 30 fps)
// A barre 0–15 · B rembobinage 15–60 · C arrêt + badge 60–135 · D sortie 135–165
// Identité : charte (#3060ff, aurora, Plus Jakarta Sans) ; badge en accent
// THÉMATIQUE Astra (#10A37F).

export const higgsGptAnim01Schema = z.object({
  badgeText: z.string().default("100 % GPT-6 Astra"),
});
export type HiggsGptAnim01Props = z.infer<typeof higgsGptAnim01Schema>;

const W = 1920;
const H = 1080;
const BAR_W = W * 0.8;
const BAR_X = (W - BAR_W) / 2;
const BAR_Y = H * 0.72;
const BAR_H = 14;
const N_THUMBS = 5;
const THUMB_W = 300;
const THUMB_H = (THUMB_W * 9) / 16;

export const HiggsGptAnim01Rembobinage: React.FC<HiggsGptAnim01Props> = ({
  badgeText,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rng = mulberry32(0x51);

  // A — entrée de la barre
  const barIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const barY = BAR_Y + interpolate(barIn, [0, 1], [100, 0]);
  const barOpacity = barIn;

  // B — rembobinage du playhead (droite → gauche)
  const scrub = interpolate(frame, [15, 60], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const playX = BAR_X + scrub * BAR_W;
  const rewinding = frame >= 15 && frame < 62;

  // C — badge (spring pop avec overshoot 0 → 1.15 → 1)
  const badgePop = spring({
    frame: frame - 62,
    fps,
    config: { damping: 10, stiffness: 120, mass: 0.8 },
  });
  const badgeScale = interpolate(badgePop, [0, 0.6, 1], [0, 1.15, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const badgeOpacity = interpolate(frame, [62, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dim = interpolate(frame, [62, 78], [0, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // D — sortie (fondu + léger scale)
  const outT = interpolate(frame, [135, 165], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const compOpacity = 1 - outT;
  const compScale = 1 + outT * 0.05;

  // Vignettes qui défilent (scrubbing de timeline)
  const thumbs = new Array(N_THUMBS + 3).fill(0).map((_, i) => {
    const hue = 200 + rng() * 60;
    const sat = 40 + rng() * 20;
    return {
      grad: `linear-gradient(135deg, hsl(${hue} ${sat}% 32%), hsl(${hue + 25} ${sat}% 18%))`,
      seed: rng(),
    };
  });
  const thumbTravel = interpolate(frame, [15, 60], [0, -(THUMB_W + 60) * 4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const thumbBlur = rewinding
    ? 2 + (Math.sin(frame / 3) * 0.5 + 0.5) * 3
    : interpolate(frame, [60, 72], [3, 0], { extrapolateRight: "clamp" });

  return (
    <Stage outFrames={2}>
      <AbsoluteFill
        style={{
          opacity: compOpacity,
          transform: `scale(${compScale})`,
        }}
      >
        {/* Bande de vignettes au-dessus de la barre */}
        <div
          style={{
            position: "absolute",
            top: BAR_Y - 40 - THUMB_H,
            left: 0,
            width: W,
            height: THUMB_H,
            display: "flex",
            gap: 60,
            paddingLeft: BAR_X,
            transform: `translateX(${thumbTravel}px)`,
            opacity: barOpacity,
            filter: `blur(${thumbBlur}px)`,
          }}
        >
          {thumbs.map((t, i) => (
            <div
              key={i}
              style={{
                flex: "0 0 auto",
                width: THUMB_W,
                height: THUMB_H,
                borderRadius: 12,
                background: t.grad,
                border: `1px solid rgba(120,150,255,0.25)`,
                boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
              }}
            />
          ))}
        </div>

        {/* Overlay sombre qui fait ressortir le badge */}
        <AbsoluteFill style={{ background: "#000", opacity: dim }} />

        {/* Barre de lecture */}
        <div
          style={{
            position: "absolute",
            left: BAR_X,
            top: barY,
            width: BAR_W,
            height: BAR_H,
            borderRadius: BAR_H,
            background: "rgba(255,255,255,0.16)",
            opacity: barOpacity,
          }}
        >
          {/* portion « lue » */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: playX - BAR_X,
              borderRadius: BAR_H,
              background: ACCENT,
              boxShadow: `0 0 24px ${ACCENT}88`,
            }}
          />
        </div>

        {/* Trail derrière le playhead */}
        {rewinding &&
          [0, 1, 2, 3].map((k) => (
            <div
              key={k}
              style={{
                position: "absolute",
                left: playX + (k + 1) * 26,
                top: barY + BAR_H / 2 - 4,
                width: 8,
                height: 8,
                borderRadius: 8,
                background: ACCENT,
                opacity: barOpacity * (0.35 - k * 0.08),
              }}
            />
          ))}

        {/* Playhead */}
        <div
          style={{
            position: "absolute",
            left: playX - 20,
            top: barY + BAR_H / 2 - 20,
            width: 40,
            height: 40,
            borderRadius: 40,
            background: "#fff",
            boxShadow: `0 0 22px ${ACCENT}, 0 0 4px #fff`,
            opacity: barOpacity,
          }}
        />

        {/* Badge central « 100 % GPT-6 ASTRA » */}
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              transform: `scale(${badgeScale})`,
              opacity: badgeOpacity,
              padding: "34px 68px",
              borderRadius: 999,
              border: `6px solid ${ASTRA_TEAL}`,
              background: "rgba(8,16,20,0.55)",
              boxShadow: `0 0 60px ${ASTRA_TEAL_GLOW}, inset 0 0 30px ${ASTRA_TEAL}22`,
              fontFamily,
              fontWeight: 800,
              fontSize: FONT.label,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: INK,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: ASTRA_TEAL }}>{badgeText}</span>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </Stage>
  );
};
