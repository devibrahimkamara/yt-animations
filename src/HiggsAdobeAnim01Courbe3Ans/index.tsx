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
import { Stage } from "../higgsAdobe/Stage";
import { AiGradientDefs } from "../higgsAdobe/AiGradient";
import { AI_GRAD_ID, AI_TO, INK, FONT, RAIL_GREY, atmosGlow } from "../higgsAdobe/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const higgsAdobeAnim01Schema = z.object({
  milestones: z.array(z.string()).default(["2023", "2024", "2025", "2026"]),
});
export type HiggsAdobeAnim01Props = z.infer<typeof higgsAdobeAnim01Schema>;

// ── Géométrie fixe (coordonnées SVG = viewBox 1920×1080) ──────────────
const AXIS_Y = 864; // 80 % de la hauteur
const AXIS_X0 = 260;
const AXIS_X1 = 1660;
const AXIS_LEN = AXIS_X1 - AXIS_X0;

// Courbe exponentielle : part à plat en bas à gauche, grimpe fort et sort du
// cadre par le haut (y négatif en fin de path).
const CURVE_D =
  "M 300 858 C 780 850, 1140 660, 1440 320 C 1590 150, 1690 -70, 1780 -320";

const MS_X = (i: number, n: number) => AXIS_X0 + (i * AXIS_LEN) / (n - 1);
const MS_APPEAR = [24, 39, 54, 100]; // frames d'apparition des 4 jalons

export const HiggsAdobeAnim01Courbe3Ans: React.FC<HiggsAdobeAnim01Props> = ({ milestones }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Mesure de la longueur du path de la courbe (pattern delayRender).
  const curveRef = useRef<SVGPathElement>(null);
  const [handle] = useState(() => delayRender("Measuring curve path"));
  const [curveLen, setCurveLen] = useState<number | null>(null);
  useLayoutEffect(() => {
    if (!curveRef.current || curveLen !== null) return;
    setCurveLen(curveRef.current.getTotalLength());
  }, [curveLen]);
  useLayoutEffect(() => {
    if (curveLen !== null) continueRender(handle);
  }, [curveLen, handle]);

  // Phase 1 — tracé de l'axe (0 → 24)
  const axisProgress = interpolate(frame, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Phase 3 — tracé de la courbe (69 → 105), démarre lentement puis accélère
  const curveProgress = interpolate(frame, [69, 105], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  // Phase 6 — sortie (155 → 180)
  const outT = interpolate(frame, [155, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const globalOpacity = 1 - outT;
  const globalScale = interpolate(outT, [0, 1], [1, 0.96]);

  return (
    <Stage>
      <AbsoluteFill
        style={{
          opacity: globalOpacity,
          transform: `scale(${globalScale})`,
          overflow: "hidden",
        }}
      >
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <AiGradientDefs vertical />

          {/* Axe X */}
          <line
            x1={AXIS_X0}
            y1={AXIS_Y}
            x2={AXIS_X1}
            y2={AXIS_Y}
            stroke={RAIL_GREY}
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={AXIS_LEN}
            strokeDashoffset={AXIS_LEN * (1 - axisProgress)}
          />

          {/* Courbe exponentielle */}
          <path
            ref={curveRef}
            d={CURVE_D}
            fill="none"
            stroke={`url(#${AI_GRAD_ID})`}
            strokeWidth={10}
            strokeLinecap="round"
            style={curveLen != null ? {
              strokeDasharray: curveLen,
              strokeDashoffset: curveLen * (1 - curveProgress),
            } : { opacity: 0 }}
          />

          {/* Jalons sur l'axe */}
          {milestones.map((label, i) => {
            const x = MS_X(i, milestones.length);
            const appear = MS_APPEAR[Math.min(i, MS_APPEAR.length - 1)];
            const s = spring({
              frame: frame - appear,
              fps,
              config: { damping: 12, stiffness: 200, mass: 0.5 },
            });
            const isLast = i === milestones.length - 1;
            const baseScale = isLast ? 1.3 : 1;
            // pulse en boucle une fois apparu
            const since = frame - appear;
            const pulse =
              since > 6
                ? 1 + 0.12 * Math.sin((since / 40) * Math.PI * 2) * (isLast ? 1.1 : 1)
                : 1;
            const r = (isLast ? 20 : i === 2 ? 17 : 15) * s * baseScale * pulse;
            const glowR = isLast ? 90 : 55;
            return (
              <g key={label} opacity={s}>
                <circle cx={x} cy={AXIS_Y} r={glowR * s} fill={AI_TO} opacity={0.16 * s} />
                <circle cx={x} cy={AXIS_Y} r={r} fill={AI_TO} />
              </g>
            );
          })}
        </svg>

        {/* Labels des jalons (HTML pour la police du projet) */}
        {milestones.map((label, i) => {
          const x = MS_X(i, milestones.length);
          const appear = MS_APPEAR[Math.min(i, MS_APPEAR.length - 1)];
          const t = interpolate(frame, [appear + 6, appear + 18], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const isLast = i === milestones.length - 1;
          return (
            <div
              key={label}
              style={{
                position: "absolute",
                left: x,
                top: AXIS_Y + 46,
                transform: `translate(-50%, ${interpolate(t, [0, 1], [10, 0])}px)`,
                opacity: t,
                fontFamily,
                fontWeight: isLast ? 800 : 700,
                fontSize: isLast ? FONT.label : FONT.micro,
                color: INK,
                textShadow: isLast ? atmosGlow(AI_TO, 30, 60) : "0 4px 24px rgba(0,0,0,0.6)",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </div>
          );
        })}
      </AbsoluteFill>
    </Stage>
  );
};
