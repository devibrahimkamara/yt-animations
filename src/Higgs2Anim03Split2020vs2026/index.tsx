import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgs2/Stage";
import { Emoji } from "../higgs2/Emoji";
import { ACCENT, INK, FONT, ICON } from "../higgs2/theme";

const { fontFamily } = loadFont("normal", { weights: ["600", "700"], subsets: ["latin"] });

export const higgs2Anim03Schema = z.object({
  leftLabel: z.string().default("2020"),
  rightLabel: z.string().default("2026"),
  tools: z
    .array(z.object({ name: z.string(), color: z.string(), icon: z.string() }))
    .default([
      { name: "Claude", color: "#D97757", icon: "🧠" },
      { name: "Génération vidéo", color: "#3060ff", icon: "🎬" },
      { name: "Publication auto", color: "#22c55e", icon: "🚀" },
    ]),
});

export type Higgs2Anim03Props = z.infer<typeof higgs2Anim03Schema>;

const CARD_XS = [25, 50, 75]; // % de largeur
const CARD_W = 400;
const CARD_H = 480;
const SWEEP_START = 51;
const SWEEP_END = 72;

export const Higgs2Anim03Split2020vs2026: React.FC<Higgs2Anim03Props> = ({
  leftLabel,
  rightLabel,
  tools,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelLeftOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelLeftX = interpolate(frame, [0, 15], [-10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Séquence C : balayage diagonal
  const sweep = interpolate(frame, [SWEEP_START, SWEEP_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const xTop = interpolate(sweep, [0, 1], [-10, 115]);
  const xBot = xTop - 15;
  const clip2020 = `polygon(${xTop}% 0%, 100% 0%, 100% 100%, ${xBot}% 100%)`;

  const bladeOpacity = interpolate(
    frame,
    [SWEEP_START, SWEEP_START + 3, SWEEP_END, SWEEP_END + 6],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const revealFrameFor = (xPct: number) => {
    const p = (xPct + 7.5 + 10) / 125;
    return SWEEP_START + p * (SWEEP_END - SWEEP_START);
  };

  const labelRightOpacity = interpolate(frame, [revealFrameFor(CARD_XS[0]), revealFrameFor(CARD_XS[0]) + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const renderCards = (variant: "locked" | "tool") =>
    CARD_XS.map((xPct, i) => {
      const lockFloat = variant === "locked" ? Math.sin(frame / 25 + i) * 3 : 0;

      const appear = spring({
        frame: frame - i * 3,
        fps,
        config: { damping: 16, stiffness: 130 },
      });
      const appearScale = interpolate(appear, [0, 1], [0.95, 1], { extrapolateRight: "clamp" });

      const rf = revealFrameFor(xPct);
      const reveal = interpolate(frame, [rf, rf + 18], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const lockOut = interpolate(frame, [rf, rf + 8], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const iconSpring = spring({
        frame: frame - rf,
        fps,
        config: { damping: 13, stiffness: 170 },
      });
      const iconScale = frame >= rf
        ? interpolate(iconSpring, [0, 1], [0.5, 1], { extrapolateRight: "clamp" })
        : 0.5;
      const nameOpacity = interpolate(frame, [rf + 6, rf + 18], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const nameY = interpolate(frame, [rf + 6, rf + 18], [6, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const breathe = variant === "tool" && frame > rf + 18 ? 1 + Math.sin(frame / 20 + i) * 0.02 : 1;

      return (
        <div
          key={xPct}
          style={{
            position: "absolute",
            left: `${xPct}%`,
            top: "50%",
            width: CARD_W,
            height: CARD_H,
            transform: `translate(-50%, -50%) translateY(${lockFloat}px) scale(${appearScale})`,
            opacity: appear,
            borderRadius: 28,
            border:
              variant === "locked" ? "3px dashed #3A3A3C" : `4px solid ${tools[i].color}`,
            background:
              variant === "locked"
                ? "#1C1C1E"
                : `linear-gradient(160deg, ${tools[i].color}, ${tools[i].color}cc)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 28,
            boxSizing: "border-box",
          }}
        >
          {variant === "locked" ? (
            <Emoji size={ICON.lg} style={{ opacity: 0.7 * lockOut, transform: `scale(${0.7 + 0.3 * lockOut})` }}>
              🔒
            </Emoji>
          ) : (
            <>
              <Emoji size={ICON.lg + 20} style={{ transform: `scale(${iconScale})`, opacity: reveal }}>
                {tools[i].icon}
              </Emoji>
              <div
                style={{
                  fontFamily,
                  fontWeight: 800,
                  fontSize: FONT.label,
                  color: INK,
                  opacity: nameOpacity,
                  transform: `translateY(${nameY}px) scale(${breathe})`,
                  textAlign: "center",
                  padding: "0 16px",
                  lineHeight: 1.1,
                }}
              >
                {tools[i].name}
              </div>
            </>
          )}
        </div>
      );
    });

  return (
    <Stage outFrames={25}>
      {/* Calque 2026 (dessous) */}
      <AbsoluteFill>{renderCards("tool")}</AbsoluteFill>

      {/* Calque 2020 (dessus) — désaturé + clip diagonal */}
      <AbsoluteFill style={{ filter: "grayscale(100%)", clipPath: clip2020 }}>
        {renderCards("locked")}
      </AbsoluteFill>

      {/* Lame lumineuse qui suit le clip */}
      {bladeOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: `${(xTop + xBot) / 2}%`,
            width: 8,
            height: "120%",
            background: ACCENT,
            filter: "blur(3px)",
            opacity: bladeOpacity,
            transform: "rotate(7deg)",
            transformOrigin: "center",
            boxShadow: `0 0 32px ${ACCENT}`,
          }}
        />
      )}

      {/* Labels */}
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 120,
          opacity: labelLeftOpacity,
          transform: `translateX(${labelLeftX}px)`,
          fontFamily,
          fontWeight: 700,
          fontSize: FONT.value,
          color: "#8E8E93",
        }}
      >
        {leftLabel}
      </div>
      <div
        style={{
          position: "absolute",
          top: 90,
          right: 120,
          opacity: labelRightOpacity,
          fontFamily,
          fontWeight: 700,
          fontSize: FONT.value,
          color: ACCENT,
        }}
      >
        {rightLabel}
      </div>
    </Stage>
  );
};
