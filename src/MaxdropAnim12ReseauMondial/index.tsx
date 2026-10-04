import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../maxdrop/Stage";
import { OdometerDigit } from "../freebeat/OdometerDigit";
import { buildDots, arcPath, ORIGIN_CHINA, DESTINATIONS, MAP_W, MAP_H } from "../maxdrop/dotmap";
import { MAXDROP_BLUE, MAXDROP_GLOW, RAIL, INK, TEXT_DIM, DARK_SCENE, FONT } from "../maxdrop/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const maxdropAnim12Schema = z.object({
  counterTarget: z.number().default(10000),
  counterLabel: z.string().default("marques e-commerce"),
});
export type MaxdropAnim12Props = z.infer<typeof maxdropAnim12Schema>;

const MAP_LEFT = 960 - MAP_W / 2;
const MAP_TOP = 540 - MAP_H / 2 - 20;
const DOTS = buildDots(7);
const ARC_STEP = 33;
const ARC_DRAW = 25;

export const MaxdropAnim12ReseauMondial: React.FC<MaxdropAnim12Props> = ({ counterTarget, counterLabel }) => {
  const frame = useCurrentFrame();

  const mapIn = interpolate(frame, [0, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const originPulse = interpolate(Math.sin((frame / 20) * Math.PI * 2), [-1, 1], [0.85, 1.25]);

  const blur = interpolate(frame, [231, 261], [0, 4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // compteur 0 → target
  const cVal = interpolate(frame, [45, 231], [0, counterTarget], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const digits = String(counterTarget).length;
  const cols = Array.from({ length: digits }, (_, j) => {
    const place = Math.pow(10, digits - 1 - j);
    return (cVal / place) % 10;
  });

  return (
    <Stage bare background={DARK_SCENE} outFrames={12}>
      <AbsoluteFill style={{ fontFamily }}>
        {/* couche carte + arcs (floutée en phase 4-5) */}
        <div style={{ position: "absolute", inset: 0, filter: `blur(${blur}px)` }}>
          <svg
            width={MAP_W}
            height={MAP_H}
            style={{ position: "absolute", left: MAP_LEFT, top: MAP_TOP, overflow: "visible" }}
          >
            {DOTS.map((d, i) => (
              <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={RAIL} opacity={mapIn} />
            ))}

            {/* point d'origine (Chine) */}
            <circle
              cx={ORIGIN_CHINA.x}
              cy={ORIGIN_CHINA.y}
              r={7 * originPulse}
              fill={MAXDROP_BLUE}
              opacity={mapIn}
              style={{ filter: `drop-shadow(0 0 12px ${MAXDROP_GLOW})` }}
            />

            {/* arcs principaux */}
            {DESTINATIONS.map((dest, i) => {
              const s0 = 45 + i * ARC_STEP;
              const p = interpolate(frame, [s0, s0 + ARC_DRAW], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              if (p <= 0) return null;
              const { d } = arcPath(ORIGIN_CHINA, dest);
              const landed = frame >= s0 + ARC_DRAW;
              const destPulse = landed
                ? interpolate(Math.sin((frame - s0 - ARC_DRAW) / 8), [-1, 1], [0.8, 1.3])
                : 0;
              return (
                <g key={i}>
                  <path
                    d={d}
                    fill="none"
                    stroke={MAXDROP_BLUE}
                    strokeWidth={2.5}
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={1 - p}
                    style={{ filter: `drop-shadow(0 0 6px ${MAXDROP_GLOW})` }}
                  />
                  {landed && (
                    <circle cx={dest.x} cy={dest.y} r={5 * Math.max(1, destPulse)} fill={MAXDROP_BLUE} />
                  )}
                </g>
              );
            })}

            {/* arcs supplémentaires (réseau dense, phase 4) */}
            {frame >= 231 &&
              [0, 1, 2, 3, 4].map((k) => {
                const a = DESTINATIONS[k % DESTINATIONS.length];
                const b = DESTINATIONS[(k + 2) % DESTINATIONS.length];
                const s0 = 231 + k * 8;
                const p = interpolate(frame, [s0, s0 + 12], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                if (p <= 0) return null;
                const { d } = arcPath(a, b);
                return (
                  <path
                    key={k}
                    d={d}
                    fill="none"
                    stroke={MAXDROP_BLUE}
                    strokeWidth={1.5}
                    opacity={0.6}
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={1 - p}
                  />
                );
              })}
          </svg>
        </div>

        {/* compteur (couche nette) */}
        {frame >= 45 && (
          <div style={{ position: "absolute", left: 120, bottom: 140 }}>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              {cols.map((offset, j) => (
                <OdometerDigit
                  key={j}
                  offset={offset}
                  height={72}
                  width={42}
                  fontSize={58}
                  fontFamily={fontFamily}
                  color={INK}
                />
              ))}
              <span style={{ fontSize: 58, fontWeight: 800, color: MAXDROP_BLUE, marginLeft: 10 }}>+</span>
            </div>
            <div style={{ marginTop: 8, fontSize: FONT.micro * 0.7, fontWeight: 700, color: TEXT_DIM }}>
              {counterLabel}
            </div>
          </div>
        )}
      </AbsoluteFill>
    </Stage>
  );
};
