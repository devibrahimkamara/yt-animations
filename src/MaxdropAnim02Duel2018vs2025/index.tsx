import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../maxdrop/Stage";
import { GROWTH, OBSTACLE, RAIL, INK, TEXT_DIM, FONT } from "../maxdrop/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const maxdropAnim02Schema = z.object({
  leftYear: z.string().default("2018"),
  rightYear: z.string().default("2025"),
  leftPct: z.number().default(46),
  rightPct: z.number().default(61),
  deltaLabel: z.string().default("+15 points en 7 ans"),
});
export type MaxdropAnim02Props = z.infer<typeof maxdropAnim02Schema>;

const CELL = 30;
const GAP = 8;
const COLS = 10;
const GRID = COLS * CELL + (COLS - 1) * GAP; // 372
const LEFT_X = 960 - 60 - GRID;
const RIGHT_X = 960 + 60;
const GRID_Y = 300;

const Grid: React.FC<{
  x: number;
  count: number;
  color: string;
  startFrame: number;
  stagger: number;
  pulseFrom?: number;
  pulseCount?: number;
}> = ({ x, count, color, startFrame, stagger, pulseFrom = 0, pulseCount = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      {Array.from({ length: 100 }, (_, i) => {
        const row = Math.floor(i / COLS);
        const col = i % COLS;
        const lit = i < count;
        const delay = startFrame + i * stagger;
        const s = lit
          ? spring({ frame: frame - delay, fps, config: { damping: 180, stiffness: 260 } })
          : 0;
        const isDiff = pulseCount > 0 && i >= count - pulseCount && i < count;
        const pulse =
          isDiff && frame >= pulseFrom
            ? interpolate(Math.sin(((frame - pulseFrom) / 15) * Math.PI * 2), [-1, 1], [0.7, 1])
            : 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + col * (CELL + GAP),
              top: GRID_Y + row * (CELL + GAP),
              width: CELL,
              height: CELL,
              borderRadius: 5,
              border: `2px solid ${lit ? color : RAIL}`,
              background: lit ? color : "transparent",
              opacity: lit ? s * pulse : 1,
              transform: `scale(${lit ? s : 1})`,
            }}
          />
        );
      })}
    </>
  );
};

export const MaxdropAnim02Duel2018vs2025: React.FC<MaxdropAnim02Props> = ({
  leftYear,
  rightYear,
  leftPct,
  rightPct,
  deltaLabel,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelIn = (delay: number) =>
    interpolate(frame, [delay, delay + 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const labelY = (delay: number) => interpolate(labelIn(delay), [0, 1], [-20, 0]);

  const leftNumIn = interpolate(frame, [70, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rightNumIn = interpolate(frame, [135, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const braceDraw = interpolate(frame, [145, 165], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const deltaS = spring({ frame: frame - 165, fps, config: { damping: 200, stiffness: 100 } });
  const deltaY = interpolate(deltaS, [0, 1], [40, 0]);

  const dividerGlow = interpolate(
    Math.sin((frame / 30) * Math.PI * 2),
    [-1, 1],
    [0.15, 0.4],
  );

  const diffRows = {
    startRow: Math.floor((rightPct - (rightPct - leftPct)) / COLS),
    endRow: Math.floor((rightPct - 1) / COLS),
  };

  return (
    <Stage outFrames={15}>
      <AbsoluteFill style={{ fontFamily }}>
        {/* séparateur central */}
        <div
          style={{
            position: "absolute",
            left: 958,
            top: 180,
            width: 4,
            height: 720,
            background: `linear-gradient(180deg, transparent, ${INK}, transparent)`,
            opacity: dividerGlow,
          }}
        />

        {/* labels années */}
        <div
          style={{
            position: "absolute",
            left: LEFT_X,
            top: 190,
            width: GRID,
            textAlign: "center",
            fontSize: FONT.label,
            fontWeight: 800,
            color: TEXT_DIM,
            opacity: labelIn(0),
            transform: `translateY(${labelY(0)}px)`,
          }}
        >
          {leftYear}
        </div>
        <div
          style={{
            position: "absolute",
            left: RIGHT_X,
            top: 190,
            width: GRID,
            textAlign: "center",
            fontSize: FONT.label,
            fontWeight: 800,
            color: GROWTH,
            opacity: labelIn(6),
            transform: `translateY(${labelY(6)}px)`,
          }}
        >
          {rightYear}
        </div>

        {/* grilles */}
        <Grid x={LEFT_X} count={leftPct} color={OBSTACLE} startFrame={30} stagger={0.45} />
        <Grid
          x={RIGHT_X}
          count={rightPct}
          color={GROWTH}
          startFrame={75}
          stagger={0.6}
          pulseFrom={135}
          pulseCount={rightPct - leftPct}
        />

        {/* nombres sous les grilles */}
        <div
          style={{
            position: "absolute",
            left: LEFT_X,
            top: GRID_Y + 10 * (CELL + GAP) + 24,
            width: GRID,
            textAlign: "center",
            fontSize: FONT.counter,
            fontWeight: 800,
            color: TEXT_DIM,
            opacity: leftNumIn,
          }}
        >
          {leftPct}%
        </div>
        <div
          style={{
            position: "absolute",
            left: RIGHT_X,
            top: GRID_Y + 10 * (CELL + GAP) + 24,
            width: GRID,
            textAlign: "center",
            fontSize: FONT.counter,
            fontWeight: 800,
            color: GROWTH,
            opacity: rightNumIn,
          }}
        >
          {rightPct}%
        </div>

        {/* accolade autour des cases d'écart (grille droite) */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {(() => {
            const bx = RIGHT_X + GRID + 18;
            const y1 = GRID_Y + diffRows.startRow * (CELL + GAP);
            const y2 = GRID_Y + (diffRows.endRow + 1) * (CELL + GAP);
            const len = y2 - y1 + 40;
            return (
              <path
                d={`M ${bx} ${y1} q 14 0 14 14 v ${(y2 - y1) / 2 - 14} q 0 14 14 14 q -14 0 -14 14 v ${(y2 - y1) / 2 - 14} q 0 14 -14 14`}
                fill="none"
                stroke={GROWTH}
                strokeWidth={4}
                strokeDasharray={len}
                strokeDashoffset={len * (1 - braceDraw)}
              />
            );
          })()}
        </svg>

        {/* label de l'écart */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 900,
            textAlign: "center",
            fontSize: FONT.label,
            fontWeight: 800,
            color: INK,
            opacity: deltaS,
            transform: `translateY(${deltaY}px)`,
          }}
        >
          <span style={{ color: GROWTH }}>{deltaLabel.split(" ")[0]} </span>
          {deltaLabel.split(" ").slice(1).join(" ")}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
