import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../maxdrop/Stage";
import { Bottle } from "../maxdrop/Bottle";
import { mulberry32, OBSTACLE, STRIKE, MAXDROP_BLUE, GROWTH, GROWTH_GLOW, FONT } from "../maxdrop/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const maxdropAnim14Schema = z.object({
  classicLabel: z.string().default("Fournisseur classique"),
  moqLabel: z.string().default("MOQ 1 000 unités"),
  maxLabel: z.string().default("Max Dropshipping"),
  noMinLabel: z.string().default("Pas de minimum."),
});
export type MaxdropAnim14Props = z.infer<typeof maxdropAnim14Schema>;

const COLS = 18;
const ROWS = 14;
const CELL = 24;
const PILE_LEFT = 190;
const PILE_BOTTOM = 830;
const PILE_TOP = PILE_BOTTOM - ROWS * CELL;
const RNG = mulberry32(1414);
const JIT = Array.from({ length: COLS * ROWS }, () => ({
  vx: -(3 + RNG() * 5),
  g: 0.8 + RNG() * 0.5,
  rot: (RNG() * 2 - 1) * 6,
}));

export const MaxdropAnim14ChuteDuMOQ: React.FC<MaxdropAnim14Props> = ({
  classicLabel,
  moqLabel,
  maxLabel,
  noMinLabel,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelsOut = interpolate(frame, [96, 108], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // bouteille unique (droite)
  const singleDrop = interpolate(frame, [165, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const singleY = interpolate(singleDrop, [0, 1], [-260, 0]);
  const haloPulse = interpolate(Math.sin((frame - 210) / 12), [-1, 1], [0.3, 0.7]);

  const maxIn = interpolate(frame, [210, 234], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const noMinIn = spring({ frame: frame - 224, fps, config: { damping: 200, stiffness: 100 } });

  return (
    <Stage outFrames={12}>
      <AbsoluteFill style={{ fontFamily }}>
        {/* ombre portée de la pile (poids) */}
        {frame < 150 && (
          <div
            style={{
              position: "absolute",
              left: PILE_LEFT - 20,
              top: PILE_BOTTOM - 6,
              width: COLS * CELL + 40,
              height: 40,
              background: "rgba(0,0,0,0.5)",
              filter: "blur(14px)",
              borderRadius: "50%",
              opacity: labelsOut > 0 ? 1 : 0.6,
            }}
          />
        )}

        {/* pile de bouteilles */}
        {Array.from({ length: COLS * ROWS }, (_, i) => {
          const row = Math.floor(i / COLS); // 0 = haut
          const col = i % COLS;
          const rowFromBottom = ROWS - 1 - row;

          // construction (phase 1)
          const buildF = rowFromBottom * 3 + col * 1;
          const bIn = interpolate(frame, [buildF, buildF + 6], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          // effondrement domino (phase 3)
          const tipStart = 96 + row * 5;
          const t = Math.max(0, frame - tipStart);
          const rot = interpolate(t, [0, 12], [0, 100], { extrapolateRight: "clamp" });
          const slide = t > 12 ? t - 12 : 0;
          const jx = JIT[i].vx * slide;
          const jy = 0.5 * JIT[i].g * slide * slide;
          const jrot = rot + JIT[i].rot * slide;
          const collapsedOpacity = interpolate(jy, [0, 400], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

          if (frame >= 96 && collapsedOpacity <= 0.02) return null;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: PILE_LEFT + col * CELL + jx,
                top: PILE_TOP + row * CELL + jy,
                width: CELL - 3,
                height: CELL - 3,
                borderRadius: 3,
                background: OBSTACLE,
                opacity: (frame >= 96 ? collapsedOpacity : bIn),
                transform: `translateY(${(1 - bIn) * 8}px) rotate(${frame >= tipStart ? jrot : 0}deg)`,
                transformOrigin: "left bottom",
              }}
            />
          );
        })}

        {/* labels rouges */}
        {frame < 120 && (
          <>
            <div
              style={{
                position: "absolute",
                left: PILE_LEFT - 40,
                top: PILE_TOP - 70,
                width: COLS * CELL + 80,
                textAlign: "center",
                fontSize: FONT.micro,
                fontWeight: 800,
                color: STRIKE,
                opacity: interpolate(frame, [20, 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * labelsOut,
              }}
            >
              {classicLabel}
            </div>
            <div
              style={{
                position: "absolute",
                left: PILE_LEFT - 40,
                top: PILE_BOTTOM + 20,
                width: COLS * CELL + 80,
                textAlign: "center",
                fontSize: FONT.micro * 0.85,
                fontWeight: 800,
                color: STRIKE,
                opacity: labelsOut,
              }}
            >
              {moqLabel}
            </div>
          </>
        )}

        {/* bouteille unique (droite) */}
        {frame >= 165 && (
          <div style={{ position: "absolute", left: 1360, top: 400 + singleY }}>
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "55%",
                width: 320,
                height: 320,
                transform: "translate(-50%,-50%)",
                borderRadius: "50%",
                background: `radial-gradient(circle, ${GROWTH_GLOW} 0%, transparent 70%)`,
                opacity: frame >= 210 ? haloPulse : 0.35,
              }}
            />
            <Bottle size={280} bodyColor={GROWTH} capColor={GROWTH} />
          </div>
        )}

        {/* labels verts */}
        {frame >= 210 && (
          <>
            <div
              style={{
                position: "absolute",
                left: 1160,
                top: 320,
                width: 500,
                textAlign: "center",
                fontSize: FONT.micro,
                fontWeight: 800,
                color: MAXDROP_BLUE,
                opacity: maxIn,
              }}
            >
              {maxLabel}
            </div>
            <div
              style={{
                position: "absolute",
                left: 1110,
                top: 780,
                width: 600,
                textAlign: "center",
                fontSize: FONT.label,
                fontWeight: 800,
                color: GROWTH,
                opacity: noMinIn,
                textShadow: `0 0 40px ${GROWTH_GLOW}`,
              }}
            >
              {noMinLabel}
            </div>
          </>
        )}
      </AbsoluteFill>
    </Stage>
  );
};
