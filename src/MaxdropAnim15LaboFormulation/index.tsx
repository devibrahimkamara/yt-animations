import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../maxdrop/Stage";
import { MiniStamp } from "../maxdrop/MiniStamp";
import { ShockRing } from "../higgsAdobe/ShockRing";
import { STRATA, MAXDROP_BLUE, INK, RAIL, FONT } from "../maxdrop/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const maxdropAnim15Schema = z.object({
  ingredients: z.array(z.string()).default(["Vitamine D", "Magnésium", "Zinc", "Ashwagandha"]),
  stampText: z.string().default("Approuvé UE"),
  finalText: z.string().default("Formule sur-mesure : 15 jours et +"),
});
export type MaxdropAnim15Props = z.infer<typeof maxdropAnim15Schema>;

const CX = 960;
const CAP_W = 190;
const CAP_H = 380;
const CAP_TOP = 300;
const DROP_STARTS = [36, 96, 156, 216];
const DROP_LEN = 60;

export const MaxdropAnim15LaboFormulation: React.FC<MaxdropAnim15Props> = ({
  ingredients,
  stampText,
  finalText,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const capsuleDraw = interpolate(frame, [0, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const capsuleScale = interpolate(frame, [0, 25], [0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // fermeture du couvercle
  const lidClose = spring({ frame: frame - 276, fps, config: { damping: 14, stiffness: 200 } });
  const lidY = interpolate(lidClose, [0, 1], [-220, 0], { extrapolateRight: "clamp" });
  const lidRot = interpolate(lidClose, [0, 0.6, 1], [15, -8, 0], { extrapolateRight: "clamp" });

  // secousse à l'impact du tampon
  const shake = frame >= 315 && frame < 327 ? Math.sin((frame - 315) * 4) * 3 : 0;

  const finalIn = interpolate(frame, [339, 360], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const finalY = interpolate(finalIn, [0, 1], [20, 0]);

  const strataH = (CAP_H - 40) / 4.5;

  return (
    <Stage outFrames={12}>
      <AbsoluteFill style={{ fontFamily, transform: `translate(${shake}px, ${shake}px)` }}>
        {/* capsule : contour + intérieur clippé */}
        <div
          style={{
            position: "absolute",
            left: CX - CAP_W / 2,
            top: CAP_TOP,
            width: CAP_W,
            height: CAP_H,
            transform: `scale(${capsuleScale})`,
            transformOrigin: "center",
          }}
        >
          {/* remplissage stratifié */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: CAP_W / 2,
              overflow: "hidden",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            {ingredients.map((_, i) => {
              const landed = frame >= DROP_STARTS[i] + DROP_LEN * 0.7;
              const grow = interpolate(
                frame,
                [DROP_STARTS[i] + DROP_LEN * 0.7, DROP_STARTS[i] + DROP_LEN * 0.7 + 14],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              );
              if (!landed) return null;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: i * strataH,
                    height: strataH * grow,
                    background: STRATA[i],
                    opacity: 0.85,
                  }}
                />
              );
            })}
          </div>

          {/* contour capsule */}
          <svg width={CAP_W} height={CAP_H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <rect
              x={3}
              y={3}
              width={CAP_W - 6}
              height={CAP_H - 6}
              rx={(CAP_W - 6) / 2}
              fill="none"
              stroke={INK}
              strokeWidth={4}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - capsuleDraw}
            />
            <line
              x1={10}
              y1={CAP_H / 2}
              x2={CAP_W - 10}
              y2={CAP_H / 2}
              stroke={RAIL}
              strokeWidth={2}
              opacity={frame >= 276 ? lidClose : 0}
            />
          </svg>

          {/* couvercle qui descend */}
          {frame >= 276 && (
            <div
              style={{
                position: "absolute",
                left: -4,
                top: -4 + lidY,
                width: CAP_W + 8,
                height: CAP_H / 2,
                borderRadius: `${CAP_W / 2}px ${CAP_W / 2}px 0 0`,
                border: `4px solid ${INK}`,
                borderBottom: "none",
                background: "rgba(255,255,255,0.06)",
                transform: `rotate(${lidRot}deg)`,
                transformOrigin: "center bottom",
              }}
            />
          )}
        </div>

        {/* pastilles qui tombent */}
        {ingredients.map((ing, i) => {
          const s0 = DROP_STARTS[i];
          const f = frame - s0;
          if (f < 0 || f > DROP_LEN) return null;
          const fallP = interpolate(f, [0, DROP_LEN * 0.7], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.in(Easing.quad),
          });
          const py = interpolate(fallP, [0, 1], [120, CAP_TOP + 30]);
          const squash = interpolate(f, [DROP_LEN * 0.7, DROP_LEN], [1, 0.3], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const op = interpolate(f, [DROP_LEN * 0.7, DROP_LEN], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div key={i}>
              <div
                style={{
                  position: "absolute",
                  left: CX - 22,
                  top: py,
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: STRATA[i],
                  transform: `scaleY(${squash})`,
                  opacity: op,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: CX + 60,
                  top: py + 6,
                  fontSize: FONT.micro * 0.8,
                  fontWeight: 800,
                  color: STRATA[i],
                  opacity: op,
                  whiteSpace: "nowrap",
                }}
              >
                {ing}
              </div>
            </div>
          );
        })}

        {/* tampon d'approbation */}
        <MiniStamp
          label={stampText}
          startFrame={315}
          cx={CX + CAP_W / 2 + 30}
          cy={CAP_TOP + 120}
          color={MAXDROP_BLUE}
          restAngle={-10}
          radius={70}
          fontSize={18}
        />
        <ShockRing startFrame={317} cx={CX + CAP_W / 2 + 30} cy={CAP_TOP + 120} color={MAXDROP_BLUE} size={220} durationInFrames={12} toScale={1.9} />

        {/* texte final */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: CAP_TOP + CAP_H + 60,
            textAlign: "center",
            fontSize: FONT.label,
            fontWeight: 800,
            color: INK,
            opacity: finalIn,
            transform: `translateY(${finalY}px)`,
            padding: "0 200px",
          }}
        >
          {finalText}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
