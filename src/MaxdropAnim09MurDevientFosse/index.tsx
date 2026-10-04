import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../maxdrop/Stage";
import { ShockRing } from "../higgsAdobe/ShockRing";
import {
  WALL_RED,
  WALL_GREEN,
  WALL_GREEN_FILL,
  STRIKE,
  STRIKE_SOFT,
  GROWTH,
  OBSTACLE,
  INK,
  FONT,
} from "../maxdrop/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const maxdropAnim09Schema = z.object({
  wallLabel: z.string().default("Réglementation UE"),
  abandonLabel: z.string().default("99% abandonnent"),
  advantageLabel: z.string().default("Moins de concurrence pour ceux qui passent"),
});
export type MaxdropAnim09Props = z.infer<typeof maxdropAnim09Schema>;

const ROWS = 6;
const COLS = 17;
const BW = 40;
const BH = 22;
const GAP = 4;
const WALL_W = COLS * (BW + GAP) - GAP;
const WALL_H = ROWS * (BH + GAP) - GAP;
const CX = 960;
const WALL_BOTTOM = 660;

const IMPACTS = [122, 162, 202];

export const MaxdropAnim09MurDevientFosse: React.FC<MaxdropAnim09Props> = ({
  wallLabel,
  abandonLabel,
  advantageLabel,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // vibration du mur aux impacts
  let vib = 0;
  for (const im of IMPACTS) {
    if (frame >= im && frame < im + 8) vib += Math.sin((frame - im) * 3) * 3;
  }

  // ACTE B — dézoom
  const zoom = interpolate(frame, [255, 315], [1, 0.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const circleDraw = interpolate(frame, [255, 315], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const brickColor = interpolateColors(
    interpolate(frame, [315, 375], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    [0, 1],
    [WALL_RED, WALL_GREEN],
  );
  const redOverlay = interpolate(frame, [210, 255, 315, 340], [0, 0.08, 0.08, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const interiorFill = interpolate(frame, [330, 375], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const abandonIn = interpolate(frame, [210, 234], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const abandonOut = interpolate(frame, [375, 385], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const advIn = spring({ frame: frame - 385, fps, config: { damping: 200, stiffness: 100 } });
  const advY = interpolate(advIn, [0, 1], [15, 0]);

  const wallTopY = WALL_BOTTOM - WALL_H;

  return (
    <Stage outFrames={15}>
      <AbsoluteFill style={{ fontFamily }}>
        {/* groupe mis à l'échelle (dézoom caméra) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${zoom})`,
            transformOrigin: "center center",
          }}
        >
          {/* enceinte circulaire révélée (ACTE B) */}
          {frame >= 255 && (
            <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
              <circle
                cx={CX}
                cy={wallTopY + WALL_H / 2}
                r={430}
                fill={frame >= 330 ? WALL_GREEN_FILL : "transparent"}
                fillOpacity={interiorFill}
                stroke={brickColor}
                strokeWidth={26}
                strokeDasharray="30 14"
                pathLength={1}
                strokeDashoffset={1 - circleDraw}
                style={{ transition: "none" }}
              />
            </svg>
          )}

          {/* le mur (segment « avant ») */}
          <div style={{ position: "absolute", left: CX - WALL_W / 2 + vib, top: wallTopY }}>
            {Array.from({ length: ROWS * COLS }, (_, i) => {
              const row = Math.floor(i / COLS);
              const col = i % COLS;
              const rowFromBottom = ROWS - 1 - row;
              const startF = rowFromBottom * 12 + col * 2;
              const s = spring({ frame: frame - startF, fps, config: { damping: 16, stiffness: 200 } });
              const ty = interpolate(s, [0, 1], [10, 0], { extrapolateRight: "clamp" });
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: col * (BW + GAP),
                    top: row * (BH + GAP),
                    width: BW,
                    height: BH,
                    borderRadius: 4,
                    background: brickColor,
                    opacity: s,
                    transform: `translateY(${ty}px)`,
                  }}
                />
              );
            })}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: STRIKE,
                opacity: redOverlay,
                borderRadius: 6,
              }}
            />
          </div>

          {/* dropshippers qui rebondissent (ACTE A) */}
          {frame < 220 &&
            [90, 130, 170].map((s0, k) => {
              const f = frame - s0;
              if (f < 0 || f > 40) return null;
              const approach = interpolate(f, [0, 18], [-CX + 120, CX - WALL_W / 2 - 120], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const bounce = interpolate(f, [18, 40], [0, -420], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              });
              const op = interpolate(f, [0, 4, 30, 40], [0, 1, 1, 0], { extrapolateRight: "clamp" });
              const yOff = [-40, 20, 70][k];
              return (
                <div
                  key={k}
                  style={{
                    position: "absolute",
                    left: CX + approach + bounce,
                    top: wallTopY + WALL_H / 2 + yOff,
                    opacity: op,
                  }}
                >
                  <svg width={44} height={54} viewBox="0 0 44 54">
                    <circle cx={22} cy={13} r={9} fill={OBSTACLE} />
                    <path d="M6 50 Q6 26 22 26 Q38 26 38 50 Z" fill={OBSTACLE} />
                  </svg>
                </div>
              );
            })}

          {IMPACTS.map((im, i) => (
            <ShockRing
              key={i}
              startFrame={im}
              cx={CX - WALL_W / 2}
              cy={wallTopY + WALL_H / 2 + [-40, 20, 70][i]}
              color={STRIKE}
              size={200}
              durationInFrames={10}
              toScale={1.8}
            />
          ))}
        </div>

        {/* label mur (recentré au-dessus après ACTE B) */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: interpolate(frame, [255, 315], [wallTopY - 90, 210], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            textAlign: "center",
            fontSize: FONT.label,
            fontWeight: 800,
            color: INK,
            opacity: interpolate(frame, [78, 96], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          {wallLabel}
        </div>

        {/* étiquette « 99% abandonnent » */}
        {frame < 390 && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: WALL_BOTTOM + 40,
              textAlign: "center",
              fontSize: FONT.label,
              fontWeight: 800,
              color: STRIKE,
              opacity: abandonIn * abandonOut,
              textShadow: `0 0 40px ${STRIKE_SOFT}`,
            }}
          >
            {abandonLabel}
          </div>
        )}

        {/* nouvelle étiquette verte */}
        {frame >= 385 && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 150,
              textAlign: "center",
              fontSize: FONT.label,
              fontWeight: 800,
              color: GROWTH,
              opacity: advIn,
              transform: `translateY(${advY}px)`,
              padding: "0 200px",
            }}
          >
            {advantageLabel}
          </div>
        )}
      </AbsoluteFill>
    </Stage>
  );
};
