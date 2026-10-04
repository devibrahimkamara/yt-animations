import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../pdfelement/Stage";
import { RADAR, CONNECTOR, INK, DARK_SCENE, FONT, RISK } from "../pdfelement/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

const CX = 960;
const CY = 540;
const MAX_R = 920;
const WAVE_DUR = 72;

export const pdfelementAnim08Schema = z.object({
  markers: z
    .array(z.object({ label: z.string(), x: z.number(), y: z.number(), lx: z.number(), ly: z.number() }))
    .default([
      { label: "Risque élevé", x: 700, y: 340, lx: 300, ly: 170 },
      { label: "Date limite", x: 1270, y: 380, lx: 1620, ly: 170 },
      { label: "Montant", x: 630, y: 730, lx: 300, ly: 930 },
      { label: "Résiliation", x: 1250, y: 770, lx: 1620, ly: 930 },
    ]),
});

export type PdfelementAnim08Props = z.infer<typeof pdfelementAnim08Schema>;

// Constellation déterministe (nuage de points au centre du cadre).
const POINTS = Array.from({ length: 44 }, (_, i) => {
  const a = random(`ang-${i}`) * Math.PI * 2;
  const r = 60 + random(`rad-${i}`) * 430;
  return {
    x: CX + Math.cos(a) * r * 1.3,
    y: CY + Math.sin(a) * r,
    delay: Math.floor(random(`dly-${i}`) * 10),
    rr: 2 + random(`sz-${i}`) * 1.5,
  };
});

export const PdfelementAnim08RadarDetectionIA: React.FC<PdfelementAnim08Props> = ({
  markers,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const waveRadius = (start: number) =>
    interpolate(frame, [start, start + WAVE_DUR], [0, MAX_R], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const waves = [18, 45];

  return (
    <Stage outFrames={12} bare background={DARK_SCENE}>
      <AbsoluteFill style={{ fontFamily }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {/* ── Constellation ── */}
          {POINTS.map((p, i) => {
            const op = interpolate(frame, [p.delay, p.delay + 12], [0, 0.7], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return <circle key={i} cx={p.x} cy={p.y} r={p.rr} fill="#2A3A4A" opacity={op} />;
          })}

          {/* ── Ondes radar ── */}
          {waves.map((start, i) => {
            const r = waveRadius(start);
            const op = interpolate(r, [0, MAX_R], [0.8, 0], { extrapolateRight: "clamp" });
            if (frame < start || frame > 118 || r <= 0) return null;
            return (
              <circle
                key={i}
                cx={CX}
                cy={CY}
                r={r}
                fill="none"
                stroke={RADAR}
                strokeWidth={3}
                opacity={op}
              />
            );
          })}

          {/* ── Connecteurs marqueur → étiquette ── */}
          {markers.slice(0, 4).map((m, i) => {
            const dist = Math.hypot(m.x - CX, m.y - CY);
            const triggerFrame = 18 + (dist / MAX_R) * WAVE_DUR;
            const lineT = interpolate(frame, [triggerFrame + 4, triggerFrame + 18], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            if (lineT <= 0) return null;
            const len = Math.hypot(m.lx - m.x, m.ly - m.y);
            return (
              <line
                key={m.label}
                x1={m.x}
                y1={m.y}
                x2={m.lx}
                y2={m.ly}
                stroke={CONNECTOR}
                strokeWidth={1.5}
                strokeDasharray={len}
                strokeDashoffset={len * (1 - lineT)}
              />
            );
          })}

          {/* ── Marqueurs ── */}
          {markers.slice(0, 4).map((m, i) => {
            const dist = Math.hypot(m.x - CX, m.y - CY);
            const triggerFrame = 18 + (dist / MAX_R) * WAVE_DUR;
            const pop = spring({
              frame: frame - triggerFrame,
              fps,
              config: { damping: 9, stiffness: 200 },
            });
            if (frame < triggerFrame) return null;
            const sc = interpolate(pop, [0, 0.5, 1], [0, 1.3, 1]);
            return (
              <g key={m.label}>
                <circle cx={m.x} cy={m.y} r={16} fill={RISK[i]} opacity={0.18 * pop} />
                <circle cx={m.x} cy={m.y} r={9 * sc} fill={RISK[i]} />
              </g>
            );
          })}
        </svg>

        {/* ── Étiquettes ── */}
        {markers.slice(0, 4).map((m, i) => {
          const dist = Math.hypot(m.x - CX, m.y - CY);
          const triggerFrame = 18 + (dist / MAX_R) * WAVE_DUR;
          const labelT = interpolate(frame, [triggerFrame + 18, triggerFrame + 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          if (labelT <= 0) return null;
          const fromLeft = m.lx < CX;
          return (
            <div
              key={m.label}
              style={{
                position: "absolute",
                left: m.lx,
                top: m.ly,
                transform: `translate(${fromLeft ? "0" : "-100%"}, -50%) translateX(${interpolate(
                  labelT,
                  [0, 1],
                  [fromLeft ? -30 : 30, 0],
                )}px)`,
                opacity: labelT,
                padding: "18px 28px",
                borderRadius: 12,
                background: "#1E2129",
                border: `2px solid ${RISK[i]}`,
                fontWeight: 800,
                fontSize: FONT.micro,
                color: INK,
                whiteSpace: "nowrap",
              }}
            >
              {m.label}
            </div>
          );
        })}
      </AbsoluteFill>
    </Stage>
  );
};
