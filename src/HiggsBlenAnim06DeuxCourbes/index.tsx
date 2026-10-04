import React from "react";
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
import { Stage } from "../higgsBlen/Stage";
import { INK, FONT, FAIL_RED, AI_GREEN } from "../higgsBlen/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

// Anim 6 — « Les deux courbes » (270 frames)
// A Repère 0–20 · B Courbe rouge 20–95 · C Label rouge 95–140
// D Courbe verte 140–185 · E Label vert 185–215 · F Hold comparatif 215–270

export const higgsBlenAnim06Schema = z.object({
  xLabel: z.string().default("Temps"),
  yLabel: z.string().default("Niveau"),
  redTitle: z.string().default("Apprendre seul"),
  redValue: z.string().default("2 ans"),
  greenTitle: z.string().default("Avec l'IA"),
  greenValue: z.string().default("1 après-midi"),
});

export type HiggsBlenAnim06Props = z.infer<typeof higgsBlenAnim06Schema>;

const GX = 210;
const GY = 180;
const GW = 1500;
const GH = 720;
const AXIS = "#5a5a68";

const px = (p: [number, number][]): [number, number][] =>
  p.map(([xp, yp]) => [GX + (xp / 100) * GW, GY + (yp / 100) * GH]);

const RED_PTS = px([
  [0, 95],
  [15, 85],
  [30, 70],
  [35, 75],
  [55, 45],
  [65, 40],
  [90, 10],
]);
const GREEN_PTS = px([
  [0, 95],
  [10, 90],
  [25, 82],
  [30, 82],
  [90, 10],
]);

const toPath = (pts: [number, number][]) =>
  pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");

const segLengths = (pts: [number, number][]) => {
  const segs: number[] = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    segs.push(d);
    total += d;
  }
  return { segs, total };
};

const pointAtProgress = (pts: [number, number][], t: number): [number, number] => {
  const { segs, total } = segLengths(pts);
  let target = total * Math.max(0, Math.min(1, t));
  for (let i = 0; i < segs.length; i++) {
    if (target <= segs[i]) {
      const r = segs[i] === 0 ? 0 : target / segs[i];
      return [
        pts[i][0] + (pts[i + 1][0] - pts[i][0]) * r,
        pts[i][1] + (pts[i + 1][1] - pts[i][1]) * r,
      ];
    }
    target -= segs[i];
  }
  return pts[pts.length - 1];
};

const HeadDot: React.FC<{ x: number; y: number; color: string; pulse?: number }> = ({
  x,
  y,
  color,
  pulse = 1,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 18,
      height: 18,
      marginLeft: -9,
      marginTop: -9,
      borderRadius: "50%",
      background: color,
      boxShadow: `0 0 20px ${color}, 0 0 40px ${color}88`,
      transform: `scale(${pulse})`,
    }}
  />
);

const Label: React.FC<{
  targetX: number;
  targetY: number;
  boxX: number;
  boxY: number;
  title: string;
  value: string;
  color: string;
  t: number;
}> = ({ targetX, targetY, boxX, boxY, title, value, color, t }) => {
  const leadLen = Math.hypot(targetX - boxX, targetY - boxY);
  return (
    <>
      <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
        <line
          x1={boxX}
          y1={boxY}
          x2={targetX}
          y2={targetY}
          stroke={color}
          strokeWidth={3}
          strokeDasharray={leadLen}
          strokeDashoffset={leadLen * (1 - Math.min(1, t * 1.5))}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: boxX,
          top: boxY,
          transform: `translate(-50%, -50%) scale(${interpolate(t, [0, 1], [0.6, 1])})`,
          opacity: t,
          background: "#141420",
          border: `1px solid ${color}66`,
          borderRadius: 14,
          padding: "18px 32px",
          textAlign: "center",
        }}
      >
        <div style={{ fontFamily, fontWeight: 700, fontSize: 44, color: INK, whiteSpace: "nowrap" }}>{title}</div>
        <div style={{ fontFamily, fontWeight: 800, fontSize: 92, color, whiteSpace: "nowrap" }}>{value}</div>
      </div>
    </>
  );
};

export const HiggsBlenAnim06DeuxCourbes: React.FC<HiggsBlenAnim06Props> = ({
  xLabel,
  yLabel,
  redTitle,
  redValue,
  greenTitle,
  greenValue,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const zoneOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const axisT = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // B — tracé rouge « laborieux » (paliers)
  const redProg = interpolate(
    frame,
    [20, 32, 42, 48, 62, 70, 82, 95],
    [0, 0.2, 0.38, 0.38, 0.64, 0.64, 0.82, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const redLen = segLengths(RED_PTS).total;
  const [rdx, rdy] = pointAtProgress(RED_PTS, redProg);

  // D — tracé vert rapide
  const greenProg = interpolate(frame, [140, 185], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const greenLen = segLengths(GREEN_PTS).total;
  const [gdx, gdy] = pointAtProgress(GREEN_PTS, greenProg);

  const redLabelT = spring({ frame: frame - 100, fps, config: { damping: 14, stiffness: 140 } });
  const greenLabelT = spring({ frame: frame - 190, fps, config: { damping: 14, stiffness: 140 } });

  const redDotPulse = frame > 95 ? 1 + Math.sin(frame / 6) * 0.3 : 1;
  const greenDotPulse = frame > 185 ? 1 + Math.sin(frame / 5 + 1) * 0.3 : 1;

  const levelLineT = interpolate(frame, [215, 230], [0, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const end = RED_PTS[RED_PTS.length - 1];

  return (
    <Stage outFrames={12}>
      <AbsoluteFill style={{ opacity: zoneOpacity }}>
        <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
          {/* axes */}
          <line x1={GX} y1={GY} x2={GX} y2={GY + GH} stroke={AXIS} strokeWidth={2} strokeDasharray={GH} strokeDashoffset={GH * (1 - axisT)} />
          <line x1={GX} y1={GY + GH} x2={GX + GW} y2={GY + GH} stroke={AXIS} strokeWidth={2} strokeDasharray={GW} strokeDashoffset={GW * (1 - axisT)} />

          {/* courbe rouge */}
          <path
            d={toPath(RED_PTS)}
            fill="none"
            stroke={FAIL_RED}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={redLen}
            strokeDashoffset={redLen * (1 - redProg)}
          />
          {/* courbe verte */}
          {frame >= 140 && (
            <path
              d={toPath(GREEN_PTS)}
              fill="none"
              stroke={AI_GREEN}
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={greenLen}
              strokeDashoffset={greenLen * (1 - greenProg)}
            />
          )}

          {/* trait de niveau pointillé (phase F) */}
          {levelLineT > 0 && (
            <line
              x1={GX}
              y1={end[1]}
              x2={end[0]}
              y2={end[1]}
              stroke={INK}
              strokeWidth={2}
              strokeDasharray="4 10"
              opacity={levelLineT}
            />
          )}
        </svg>

        {/* dots de tête */}
        {frame >= 20 && redProg < 1 && <HeadDot x={rdx} y={rdy} color={FAIL_RED} />}
        {frame >= 95 && <HeadDot x={end[0]} y={end[1]} color={FAIL_RED} pulse={redDotPulse} />}
        {frame >= 140 && greenProg < 1 && <HeadDot x={gdx} y={gdy} color={AI_GREEN} />}
        {frame >= 185 && <HeadDot x={end[0]} y={end[1]} color={AI_GREEN} pulse={greenDotPulse} />}

        {/* labels d'axes */}
        <span style={{ position: "absolute", left: GX + GW - 40, top: GY + GH + 24, fontFamily, fontWeight: 700, fontSize: FONT.micro, color: "#8a8a95", textTransform: "uppercase", letterSpacing: "2px" }}>
          {xLabel}
        </span>
        <span style={{ position: "absolute", left: GX - 150, top: GY + GH / 2, transform: "rotate(-90deg)", fontFamily, fontWeight: 700, fontSize: FONT.micro, color: "#8a8a95", textTransform: "uppercase", letterSpacing: "2px" }}>
          {yLabel}
        </span>

        {/* labels de courbes — boîtes fixes dans l'aire du graphe, ligne de rappel vers le point final */}
        {frame >= 95 && (
          <Label
            targetX={end[0]}
            targetY={end[1]}
            boxX={GX + GW * 0.62}
            boxY={GY + GH * 0.24}
            title={redTitle}
            value={redValue}
            color={FAIL_RED}
            t={redLabelT}
          />
        )}
        {frame >= 185 && (
          <Label
            targetX={end[0]}
            targetY={end[1]}
            boxX={GX + GW * 0.62}
            boxY={GY + GH * 0.6}
            title={greenTitle}
            value={greenValue}
            color={AI_GREEN}
            t={greenLabelT}
          />
        )}
      </AbsoluteFill>
    </Stage>
  );
};
