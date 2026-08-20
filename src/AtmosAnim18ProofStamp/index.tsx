import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { measureText } from "@remotion/layout-utils";
import { ATMOS_GOLD, ATMOS_PANEL_BG } from "../AtmosOverlay/theme";
import { AtmosBackground } from "../AtmosOverlay/AtmosBackground";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });
const STAMP_FONT_SIZE = 44;

function wrapToLines(text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    const { width } = measureText({
      text: candidate,
      fontFamily,
      fontSize: STAMP_FONT_SIZE,
      fontWeight: 800,
      letterSpacing: "3px",
    });
    if (width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export const atmosAnim18Schema = z.object({
  stampText: z.string().default("PREUVE EN DIRECT"),
  durationSecs: z.number().default(2),
});

export type AtmosAnim18Props = z.infer<typeof atmosAnim18Schema>;

const RX = 230;
const RY = 130;
const POINT_COUNT = 10;

function buildIrregularOvalPath(seedPrefix: string, rx: number, ry: number): string {
  const points = Array.from({ length: POINT_COUNT }).map((_, i) => {
    const angle = (i / POINT_COUNT) * Math.PI * 2;
    const jitter = interpolate(random(`${seedPrefix}-${i}`), [0, 1], [-5, 5]);
    return {
      x: Math.cos(angle) * (rx + jitter),
      y: Math.sin(angle) * (ry + jitter),
    };
  });

  let path = `M ${points[0].x} ${points[0].y} `;
  for (let i = 0; i < points.length; i++) {
    const curr = points[i];
    const next = points[(i + 1) % points.length];
    const midX = (curr.x + next.x) / 2;
    const midY = (curr.y + next.y) / 2;
    path += `Q ${curr.x} ${curr.y}, ${midX} ${midY} `;
  }
  path += "Z";
  return path;
}

const OUTER_PATH = buildIrregularOvalPath("stamp-outer", RX, RY);
const INNER_PATH = buildIrregularOvalPath("stamp-inner", RX - 16, RY - 16);

export const AtmosAnim18ProofStamp: React.FC<AtmosAnim18Props> = ({
  stampText,
}) => {
  const frame = useCurrentFrame();
  const lines = wrapToLines(stampText, RX * 2 - 60);
  const lineHeight = STAMP_FONT_SIZE * 1.15;
  const startY = -((lines.length - 1) * lineHeight) / 2;

  const scale = interpolate(frame, [0, 6], [2.2, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const translateY = interpolate(frame, [0, 6], [-40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const opacity = interpolate(frame, [0, 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const flashOpacity = interpolate(frame, [6, 8, 12], [0, 0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const shakeT = frame - 8;
  const shakeActive = shakeT >= 0 && shakeT <= 16;
  const shakeX = shakeActive ? 4 * Math.sin(shakeT * 2.5) * Math.exp(-shakeT * 0.3) : 0;
  const shakeRotate = shakeActive ? 1.5 * Math.sin(shakeT * 3) * Math.exp(-shakeT * 0.3) : 0;

  return (
    <AbsoluteFill>
      <AtmosBackground />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: ATMOS_PANEL_BG,
            opacity: opacity * 0.6,
            width: 700,
            height: 460,
            borderRadius: 36,
            position: "absolute",
          }}
        />

        <div
          style={{
            opacity,
            transform: `translateY(${translateY}px) translateX(${shakeX}px) scale(${scale}) rotate(${-6 + shakeRotate}deg)`,
          }}
        >
          <svg width={RX * 2 + 20} height={RY * 2 + 20} viewBox={`${-RX - 10} ${-RY - 10} ${RX * 2 + 20} ${RY * 2 + 20}`}>
            <path d={OUTER_PATH} fill="none" stroke={ATMOS_GOLD} strokeWidth={6} opacity={0.92} />
            <path d={INNER_PATH} fill="none" stroke={ATMOS_GOLD} strokeWidth={4} opacity={0.85} />
            <text
              x={0}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontFamily,
                fontWeight: 800,
                fontSize: STAMP_FONT_SIZE,
                letterSpacing: "3px",
                fill: ATMOS_GOLD,
                textTransform: "uppercase",
              }}
            >
              {lines.map((line, i) => (
                <tspan key={i} x={0} y={startY + i * lineHeight}>
                  {line}
                </tspan>
              ))}
            </text>
          </svg>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ background: "#FFFFFF", opacity: flashOpacity }} />
    </AbsoluteFill>
  );
};
