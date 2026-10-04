import { useLayoutEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgs/Stage";
import { ACCENT, INK, FONT } from "../higgs/theme";
import { ATMOS_PANEL_BG, atmosPanelBorder } from "../AtmosOverlay/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const higgsAnim03Schema = z.object({
  steps: z
    .array(z.string())
    .default(["Créer le visage", "Générer le contenu", "Faire parler", "Monétiser"]),
});

export type HiggsAnim03Props = z.infer<typeof higgsAnim03Schema>;

const PATH_D = "M 140 560 Q 520 450 900 545 Q 1260 632 1780 512";
const DRAW_START = 15;
const DRAW_END = 165;
const TRIGGERS = [45, 82, 120, 158];

const easedProgress = (f: number) =>
  interpolate(f, [DRAW_START, DRAW_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

export const HiggsAnim03RailAtoZ: React.FC<HiggsAnim03Props> = ({ steps }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pathRef = useRef<SVGPathElement>(null);
  const [handle] = useState(() => delayRender("Measuring rail path"));
  const [len, setLen] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (!pathRef.current || len !== null) return;
    setLen(pathRef.current.getTotalLength());
  }, [len]);
  useLayoutEffect(() => {
    if (len !== null) continueRender(handle);
  }, [len, handle]);

  const drawnFrac = easedProgress(frame);

  const startSpring = spring({ frame, fps, config: { damping: 12, stiffness: 200 } });

  const zoom = interpolate(frame, [158, 180], [1.05, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const pointAt = (f: number) =>
    pathRef.current && len !== null
      ? pathRef.current.getPointAtLength(len * easedProgress(f))
      : { x: 140, y: 560 };

  const headPos =
    pathRef.current && len !== null
      ? pathRef.current.getPointAtLength(len * drawnFrac)
      : { x: 140, y: 560 };

  return (
    <Stage outFrames={12}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <svg width="1920" height="1080" style={{ position: "absolute" }}>
          {/* piste fantôme */}
          <path ref={pathRef} d={PATH_D} fill="none" stroke="#2b3242" strokeWidth={4} />
          {/* rail dessiné */}
          {len !== null && (
            <path
              d={PATH_D}
              fill="none"
              stroke={ACCENT}
              strokeWidth={7}
              strokeLinecap="round"
              strokeDasharray={len}
              strokeDashoffset={len * (1 - drawnFrac)}
              style={{ filter: `drop-shadow(0 0 12px ${ACCENT})` }}
            />
          )}
          {/* point d'amorce + tête du tracé */}
          <circle
            cx={140}
            cy={560}
            r={16 * startSpring}
            fill={INK}
            style={{ filter: `drop-shadow(0 0 18px ${ACCENT})` }}
          />
          {frame >= DRAW_START && frame <= DRAW_END + 4 && (
            <circle
              cx={headPos.x}
              cy={headPos.y}
              r={12}
              fill={INK}
              style={{ filter: `drop-shadow(0 0 20px ${ACCENT})` }}
            />
          )}
          {/* cercles des jalons, posés quand le trait les atteint */}
          {steps.map((_, i) => {
            const p = pointAt(TRIGGERS[i]);
            const on = frame >= TRIGGERS[i];
            return (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={on ? 18 : 0}
                fill={ACCENT}
                style={{ filter: `drop-shadow(0 0 14px ${ACCENT})` }}
              />
            );
          })}
        </svg>

        {/* cartes des jalons */}
        {steps.map((label, i) => {
          const p = pointAt(TRIGGERS[i]);
          const align: "top" | "bottom" = i % 2 === 0 ? "top" : "bottom";
          const s = spring({
            frame: frame - TRIGGERS[i],
            fps,
            config: { damping: 12, stiffness: 170 },
          });
          if (frame < TRIGGERS[i]) return null;
          const dy = interpolate(s, [0, 1], [align === "top" ? 10 : -10, 0], {
            extrapolateRight: "clamp",
          });
          const offset = 130;
          // garde la carte entièrement à l'écran même si le jalon est près d'un bord
          const cardX = Math.min(1520, Math.max(400, p.x));
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: cardX,
                top: align === "top" ? p.y - offset : p.y + offset,
                transform: `translate(-50%, ${align === "top" ? "-100%" : "0"}) translateY(${dy}px)`,
                opacity: s,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span
                style={{
                  fontFamily,
                  fontWeight: 800,
                  fontSize: FONT.micro,
                  color: ACCENT,
                }}
              >
                {i + 1}
              </span>
              <div
                style={{
                  padding: "24px 40px",
                  borderRadius: 18,
                  background: ATMOS_PANEL_BG,
                  border: `2px solid ${atmosPanelBorder(0.5)}`,
                  fontFamily,
                  fontWeight: 800,
                  fontSize: FONT.label,
                  color: INK,
                  whiteSpace: "nowrap",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
                }}
              >
                {label}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </Stage>
  );
};
