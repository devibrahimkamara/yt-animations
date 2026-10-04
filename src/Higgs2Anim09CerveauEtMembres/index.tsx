import { useLayoutEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Easing,
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
import { ACCENT, ACCENT_LIGHT, INK, NEUTRAL_BORDER, NEUTRAL_PANEL, FONT, ICON } from "../higgs2/theme";

const { fontFamily } = loadFont("normal", { weights: ["600", "800"], subsets: ["latin"] });

export const higgs2Anim09Schema = z.object({
  centerLabel: z.string().default("Claude"),
  modules: z
    .array(z.object({ label: z.string(), icon: z.string() }))
    .default([
      { label: "Générateur de script", icon: "📝" },
      { label: "Générateur de vidéo", icon: "🎬" },
      { label: "Voix", icon: "🎙️" },
      { label: "Miniature", icon: "🖼️" },
      { label: "Publication auto", icon: "🚀" },
    ]),
});

export type Higgs2Anim09Props = z.infer<typeof higgs2Anim09Schema>;

const CX = 960;
const CY = 530;
const RADIUS = 430;
const N = 5;
const NODE = 210;
const CARD_W = 340;
const CARD_H = 190;

const MODULES_XY = Array.from({ length: N }, (_, i) => {
  const a = ((-90 + i * (360 / N)) * Math.PI) / 180;
  return { x: CX + Math.cos(a) * RADIUS, y: CY + Math.sin(a) * RADIUS };
});

const PATHS = MODULES_XY.map(({ x, y }) => {
  const mx = (CX + x) / 2;
  const my = (CY + y) / 2;
  const dx = x - CX;
  const dy = y - CY;
  const len = Math.hypot(dx, dy);
  const px = -dy / len;
  const py = dx / len;
  const ctrlX = mx + px * 90;
  const ctrlY = my + py * 90;
  return `M ${CX} ${CY} Q ${ctrlX} ${ctrlY} ${x} ${y}`;
});

const CABLE_START = 36;
const CABLE_DUR = 33;
const RETURN_START = 216;

export const Higgs2Anim09CerveauEtMembres: React.FC<Higgs2Anim09Props> = ({
  centerLabel,
  modules,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const [handle] = useState(() => delayRender("Measuring neural cables"));
  const [lengths, setLengths] = useState<number[] | null>(null);

  useLayoutEffect(() => {
    if (lengths !== null) return;
    const ls = pathRefs.current.map((p) => (p ? p.getTotalLength() : 0));
    if (ls.every((l) => l > 0)) setLengths(ls);
  }, [lengths]);

  useLayoutEffect(() => {
    if (lengths !== null) continueRender(handle);
  }, [lengths, handle]);

  // ── nœud central : apparition + respiration continue
  const nodeIn = spring({ frame, fps, config: { damping: 13, stiffness: 160 } });
  const nodeInScale = interpolate(nodeIn, [0, 1], [0.6, 1], { extrapolateRight: "clamp" });
  const breathe = frame >= 20 ? 1 + Math.sin(frame / 20) * 0.04 : 1;

  // bumps de réception des impulsions retour
  let receiveBump = 0;
  MODULES_XY.forEach((_, i) => {
    const arrival = RETURN_START + i * 7 + 16;
    const s = spring({ frame: frame - arrival, fps, config: { damping: 9, stiffness: 240 } });
    if (frame >= arrival && frame < arrival + 16) {
      receiveBump += interpolate(s, [0, 0.5, 1], [0, 0.08, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }
  });
  const nodeScale = nodeInScale * (breathe + receiveBump);
  const glow = 40 + Math.sin(frame / 20) * 15;

  return (
    <Stage outFrames={16}>
      <AbsoluteFill>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
          {PATHS.map((d, i) => {
            const startF = CABLE_START + i * CABLE_DUR;
            const draw = interpolate(frame, [startF, startF + CABLE_DUR], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });
            const len = lengths ? lengths[i] : 1000;
            const drawn = draw > 0.001;
            return (
              <g key={i}>
                <path
                  ref={(el) => {
                    pathRefs.current[i] = el;
                  }}
                  d={d}
                  fill="none"
                  stroke="#3a4055"
                  strokeWidth={4}
                  opacity={0.4}
                />
                {drawn && (
                  <path
                    d={d}
                    fill="none"
                    stroke={ACCENT}
                    strokeWidth={5}
                    strokeDasharray={len}
                    strokeDashoffset={len * (1 - draw)}
                    style={{ filter: `drop-shadow(0 0 8px ${ACCENT})` }}
                  />
                )}
              </g>
            );
          })}

          {/* impulsions retour */}
          {lengths &&
            MODULES_XY.map((_, i) => {
              const localF = frame - (RETURN_START + i * 7);
              if (localF < 0 || localF > 18) return null;
              const p = interpolate(localF, [0, 16], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const path = pathRefs.current[i];
              if (!path) return null;
              const pt = path.getPointAtLength(lengths[i] * (1 - p));
              return (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r={16}
                  fill={ACCENT_LIGHT}
                  style={{ filter: `drop-shadow(0 0 18px ${ACCENT_LIGHT})` }}
                />
              );
            })}
        </svg>

        {/* nœud central */}
        <div
          style={{
            position: "absolute",
            left: CX,
            top: CY,
            width: NODE,
            height: NODE,
            transform: `translate(-50%, -50%) scale(${nodeScale})`,
            borderRadius: "50%",
            background: `radial-gradient(circle at 40% 35%, ${ACCENT_LIGHT}, ${ACCENT})`,
            boxShadow: `0 0 ${glow * 1.6}px ${ACCENT}, 0 0 ${glow * 3}px ${ACCENT}66`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily,
            fontWeight: 800,
            fontSize: FONT.micro,
            color: INK,
          }}
        >
          {centerLabel}
        </div>

        {/* modules */}
        {MODULES_XY.map((pos, i) => {
          const arrivalF = CABLE_START + (i + 1) * CABLE_DUR;
          const inSpring = spring({
            frame: frame - arrivalF,
            fps,
            config: { damping: 12, stiffness: 190 },
          });
          const appear = frame >= arrivalF - 3 ? inSpring : 0;
          const lightP = interpolate(frame, [arrivalF, arrivalF + 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const flash = interpolate(frame, [arrivalF, arrivalF + 1, arrivalF + 3], [0, 0.85, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const bounceRaw = spring({
            frame: frame - arrivalF,
            fps,
            config: { damping: 8, stiffness: 300 },
          });
          const iconScale =
            frame >= arrivalF
              ? interpolate(bounceRaw, [0, 0.5, 1], [1, 1.15, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              : 1;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
                width: CARD_W,
                height: CARD_H,
                transform: `translate(-50%, -50%) scale(${interpolate(appear, [0, 1], [0.7, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })})`,
                opacity: appear,
                borderRadius: 20,
                background: interpolateColors(lightP, [0, 1], [NEUTRAL_PANEL, "#16305c"]),
                border: `3px solid ${interpolateColors(lightP, [0, 1], [NEUTRAL_BORDER, ACCENT])}`,
                boxShadow: `0 0 ${48 * lightP}px ${ACCENT}${lightP > 0 ? "88" : "00"}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                overflow: "hidden",
                textAlign: "center",
              }}
            >
              <div style={{ position: "absolute", inset: 0, background: INK, opacity: flash }} />
              <Emoji size={ICON.md} style={{ transform: `scale(${iconScale})` }}>
                {modules[i].icon}
              </Emoji>
              <div
                style={{
                  fontFamily,
                  fontWeight: 700,
                  fontSize: 34,
                  lineHeight: 1.1,
                  color: interpolateColors(lightP, [0, 1], ["#8E8E93", INK]),
                  padding: "0 14px",
                }}
              >
                {modules[i].label}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </Stage>
  );
};
