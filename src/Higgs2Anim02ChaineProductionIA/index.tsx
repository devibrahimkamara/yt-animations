import { useLayoutEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgs2/Stage";
import { Emoji } from "../higgs2/Emoji";
import { ACCENT, INK, NEUTRAL_BORDER, NEUTRAL_PANEL, FONT, ICON } from "../higgs2/theme";

const { fontFamily } = loadFont("normal", { weights: ["600", "800"], subsets: ["latin"] });

export const higgs2Anim02Schema = z.object({
  modules: z
    .array(z.object({ label: z.string(), icon: z.string() }))
    .default([
      { label: "Script", icon: "📝" },
      { label: "Voix off", icon: "🎙️" },
      { label: "Vidéo", icon: "🎬" },
      { label: "Miniature", icon: "🖼️" },
      { label: "Publication", icon: "🚀" },
    ]),
  badgeText: z.string().default("0 % humain"),
});

export type Higgs2Anim02Props = z.infer<typeof higgs2Anim02Schema>;

const NODES = [
  { x: 230, y: 430 },
  { x: 597, y: 465 },
  { x: 964, y: 500 },
  { x: 1331, y: 535 },
  { x: 1698, y: 570 },
];

const PATH_D =
  "M 230 430 Q 413 440 597 465 Q 780 490 964 500 Q 1147 510 1331 535 Q 1514 560 1698 570";

const CARD_W = 300;
const CARD_H = 220;
const TRAVEL_START = 24;
const TRAVEL_END = 249;

export const Higgs2Anim02ChaineProductionIA: React.FC<Higgs2Anim02Props> = ({
  modules,
  badgeText,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pathRef = useRef<SVGPathElement>(null);
  const [handle] = useState(() => delayRender("Measuring cable path"));
  const [totalLength, setTotalLength] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (!pathRef.current || totalLength !== null) return;
    setTotalLength(pathRef.current.getTotalLength());
  }, [totalLength]);

  useLayoutEffect(() => {
    if (totalLength !== null) continueRender(handle);
  }, [totalLength, handle]);

  // ── Point lumineux : fraction parcourue (léger lead-in avant le 1er module)
  const pointFrac = interpolate(frame, [TRAVEL_START, TRAVEL_END], [-0.12, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const drawnFrac = Math.max(0, Math.min(1, pointFrac));

  const pointPos =
    pathRef.current && totalLength !== null
      ? pathRef.current.getPointAtLength(totalLength * drawnFrac)
      : NODES[0];

  // frame auquel le point atteint le module k
  const crossFrame = (k: number) =>
    TRAVEL_START + ((k / (NODES.length - 1) + 0.12) / 1.12) * (TRAVEL_END - TRAVEL_START);

  // ── Séquence D : badge final
  const badgeSpring = spring({
    frame: frame - 267,
    fps,
    config: { damping: 11, stiffness: 190 },
  });
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.6, 1], { extrapolateRight: "clamp" });
  const badgeGlowPulse =
    frame >= 267 ? 1 + Math.max(0, Math.sin((frame - 267) / 4)) * (frame < 285 ? 0.4 : 0) : 0;

  return (
    <Stage outFrames={12}>
      <AbsoluteFill>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
          {/* câble neutre (toujours visible, pointillés) */}
          <path
            ref={pathRef}
            d={PATH_D}
            fill="none"
            stroke="#5a6070"
            strokeWidth={4}
            strokeDasharray="10 12"
            opacity={0.35}
          />
          {/* tronçon parcouru en couleur accent */}
          {totalLength !== null && (
            <path
              d={PATH_D}
              fill="none"
              stroke={ACCENT}
              strokeWidth={6}
              strokeDasharray={totalLength}
              strokeDashoffset={totalLength * (1 - drawnFrac)}
              style={{ filter: `drop-shadow(0 0 10px ${ACCENT})` }}
            />
          )}
          {/* point lumineux voyageur */}
          {frame >= TRAVEL_START && frame <= TRAVEL_END + 4 && (
            <circle
              cx={pointPos.x}
              cy={pointPos.y}
              r={14}
              fill={INK}
              style={{ filter: `drop-shadow(0 0 20px ${ACCENT})` }}
            />
          )}
        </svg>

        {/* modules */}
        {NODES.map((node, k) => {
          const appearSpring = spring({
            frame: frame - k * 4,
            fps,
            config: { damping: 14, stiffness: 140 },
          });
          const appearY = interpolate(appearSpring, [0, 1], [20, 0], { extrapolateRight: "clamp" });

          const tk = crossFrame(k);
          const lightProgress = interpolate(frame, [tk, tk + 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const flash = interpolate(frame, [tk, tk + 1, tk + 3], [0, 0.85, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const bg = interpolateColors(lightProgress, [0, 1], [NEUTRAL_PANEL, "#16305c"]);
          const border = interpolateColors(lightProgress, [0, 1], [NEUTRAL_BORDER, ACCENT]);
          const iconBounceRaw = spring({
            frame: frame - tk,
            fps,
            config: { damping: 8, stiffness: 300 },
          });
          const iconBounce =
            frame >= tk
              ? interpolate(iconBounceRaw, [0, 0.5, 1], [1, 1.15, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              : 1;
          // pulse synchronisé en séquence C + au badge
          const syncPulse =
            frame >= 249
              ? 0.15 * (0.5 + 0.5 * Math.sin(frame / 15)) + (frame >= 267 && frame < 285 ? 0.35 : 0)
              : 0;
          const glow = lightProgress * (0.6 + syncPulse);

          return (
            <div
              key={node.x}
              style={{
                position: "absolute",
                left: node.x - CARD_W / 2,
                top: node.y - CARD_H / 2 + appearY,
                width: CARD_W,
                height: CARD_H,
                opacity: appearSpring,
                borderRadius: 16,
                background: bg,
                border: `3px solid ${border}`,
                boxShadow: `0 0 ${56 * glow}px ${ACCENT}${glow > 0 ? "88" : "00"}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 18,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: INK,
                  opacity: flash,
                }}
              />
              <Emoji size={ICON.md} style={{ transform: `scale(${iconBounce})` }}>
                {modules[k].icon}
              </Emoji>
              <div
                style={{
                  fontFamily,
                  fontWeight: 700,
                  fontSize: FONT.micro,
                  color: interpolateColors(lightProgress, [0, 1], ["#8E8E93", INK]),
                }}
              >
                {modules[k].label}
              </div>
            </div>
          );
        })}

        {/* badge final */}
        {frame >= 267 && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "78%",
              transform: `translate(-50%, -50%) scale(${badgeScale})`,
              opacity: interpolate(badgeSpring, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
              padding: "30px 68px",
              borderRadius: 999,
              background: ACCENT,
              color: INK,
              fontFamily,
              fontWeight: 800,
              fontSize: FONT.label,
              whiteSpace: "nowrap",
              boxShadow: `0 0 ${60 + badgeGlowPulse * 40}px ${ACCENT}aa`,
            }}
          >
            {badgeText}
          </div>
        )}
      </AbsoluteFill>
    </Stage>
  );
};
