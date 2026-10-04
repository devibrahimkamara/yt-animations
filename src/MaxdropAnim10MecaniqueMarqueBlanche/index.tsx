import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../maxdrop/Stage";
import { Bottle } from "../maxdrop/Bottle";
import { MiniStamp } from "../maxdrop/MiniStamp";
import { RAIL, OBSTACLE, INK, TEXT_DIM, STAMP_BLUE, GROWTH, GROWTH_GLOW, FONT } from "../maxdrop/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const maxdropAnim10Schema = z.object({
  topLabel: z.string().default("LE PARTENAIRE"),
  bottomLabel: z.string().default("TOI"),
  stamps: z.array(z.string()).default(["Certifié UE", "Formule validée", "Fabrication"]),
  bottomSteps: z.array(z.string()).default(["Ton logo", "Ton étiquette", "Ton carton"]),
  finalText: z.string().default("Ta marque."),
});
export type MaxdropAnim10Props = z.infer<typeof maxdropAnim10Schema>;

const TOP_Y = 320;
const BOT_Y = 760;
const DIV_Y = 540;
const LEFT_X = 250;
const RIGHT_X = 1600;
const STAMP_FRAMES = [60, 100, 140];
const STAMP_ANGLES = [-8, 0, 8];
const STEP_FRAMES = [220, 260, 295];

const Belt: React.FC<{ y: number; drawFrom: number }> = ({ y, drawFrom }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [drawFrom, drawFrom + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shift = (frame * 4) % 40;
  return (
    <svg width={1920} height={80} style={{ position: "absolute", left: 0, top: y - 40 }}>
      <line x1={0} y1={4} x2={1920 * draw} y2={4} stroke={RAIL} strokeWidth={3} />
      <line x1={0} y1={72} x2={1920 * draw} y2={72} stroke={RAIL} strokeWidth={3} />
      {Array.from({ length: 60 }, (_, i) => {
        const x = i * 40 - shift;
        if (x > 1920 * draw) return null;
        return <line key={i} x1={x} y1={8} x2={x} y2={68} stroke="#3A4048" strokeWidth={2} />;
      })}
    </svg>
  );
};

export const MaxdropAnim10MecaniqueMarqueBlanche: React.FC<MaxdropAnim10Props> = ({
  topLabel,
  bottomLabel,
  stamps,
  bottomSteps,
  finalText,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const topX = interpolate(frame, [30, 165], [LEFT_X, RIGHT_X], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const descend = interpolate(frame, [165, 195], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const botX = interpolate(frame, [195, 330], [LEFT_X, RIGHT_X - 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const onTop = frame < 165;
  const bottleX = onTop ? topX : frame < 195 ? interpolate(descend, [0, 1], [RIGHT_X, LEFT_X]) : botX;
  const bottleY = interpolate(descend, [0, 1], [TOP_Y, BOT_Y]);
  const descendRot = frame >= 165 && frame < 195 ? Math.sin((frame - 165) * 0.6) * 10 : 0;

  const stampFade = interpolate(frame, [165, 185], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const finalIn = spring({ frame: frame - 320, fps, config: { damping: 14, stiffness: 200 } });
  const finalScale = interpolate(finalIn, [0, 1], [0.9, 1]);

  const cartonClose = interpolate(frame, [STEP_FRAMES[2], STEP_FRAMES[2] + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage outFrames={10}>
      <AbsoluteFill style={{ fontFamily }}>
        {/* séparateur central */}
        <div style={{ position: "absolute", left: 0, top: DIV_Y, width: 1920, height: 2, background: RAIL }} />
        <div style={{ position: "absolute", left: 60, top: 120, fontSize: FONT.micro, fontWeight: 800, color: TEXT_DIM }}>
          {topLabel}
        </div>
        <div style={{ position: "absolute", left: 60, top: DIV_Y + 40, fontSize: FONT.micro, fontWeight: 800, color: GROWTH }}>
          {bottomLabel}
        </div>

        <Belt y={TOP_Y + 90} drawFrom={0} />
        {frame >= 190 && <Belt y={BOT_Y + 90} drawFrom={195} />}

        {/* bouteille qui voyage */}
        <div
          style={{
            position: "absolute",
            left: bottleX,
            top: bottleY,
            transform: `translate(-50%,-100%) rotate(${descendRot}deg)`,
          }}
        >
          <Bottle
            size={150}
            bodyColor={frame < 195 ? OBSTACLE : OBSTACLE}
            label={frame >= STEP_FRAMES[1]}
            labelText={frame >= STEP_FRAMES[1] ? "MA MARQUE" : undefined}
            logoColor={frame >= STEP_FRAMES[0] ? GROWTH : undefined}
          />
          {/* marques de tampon accumulées (étage du haut) */}
          {stamps.map((s, i) =>
            frame >= STAMP_FRAMES[i] ? (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 30,
                  top: 30 + i * 30,
                  transform: `rotate(${STAMP_ANGLES[i]}deg)`,
                  padding: "3px 8px",
                  border: `2px solid ${STAMP_BLUE}`,
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 800,
                  color: STAMP_BLUE,
                  background: "rgba(48,96,255,0.12)",
                  whiteSpace: "nowrap",
                  opacity: onTop ? 1 : stampFade,
                }}
              >
                {s}
              </div>
            ) : null,
          )}
          {/* rabats de carton (étage du bas, étape 3) */}
          {frame >= STEP_FRAMES[2] && (
            <>
              <div
                style={{
                  position: "absolute",
                  left: -10,
                  top: 20,
                  width: 90,
                  height: 120,
                  background: INK,
                  transformOrigin: "left center",
                  transform: `rotateY(${90 - cartonClose * 90}deg)`,
                  opacity: 0.9,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: -10,
                  top: 20,
                  width: 90,
                  height: 120,
                  background: "#E4E4E4",
                  transformOrigin: "right center",
                  transform: `rotateY(${-(90 - cartonClose * 90)}deg)`,
                  opacity: 0.9,
                }}
              />
            </>
          )}
        </div>

        {/* tampons qui s'écrasent (étage du haut) */}
        {stamps.map((s, i) => (
          <MiniStamp
            key={i}
            label={s}
            startFrame={STAMP_FRAMES[i]}
            cx={interpolate(STAMP_FRAMES[i], [30, 165], [LEFT_X, RIGHT_X])}
            cy={TOP_Y - 40}
            color={STAMP_BLUE}
            restAngle={STAMP_ANGLES[i]}
            radius={54}
            fontSize={15}
          />
        ))}

        {/* labels d'étape (étage du bas) */}
        {bottomSteps.map((st, i) => {
          const f0 = STEP_FRAMES[i];
          const op = interpolate(frame, [f0 - 6, f0 + 6, f0 + 30, f0 + 40], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: BOT_Y + 140,
                textAlign: "center",
                fontSize: FONT.micro,
                fontWeight: 700,
                color: TEXT_DIM,
                opacity: op,
              }}
            >
              {st}
            </div>
          );
        })}

        {/* logo qui tombe (étape 1) */}
        {frame >= STEP_FRAMES[0] && frame < STEP_FRAMES[0] + 40 && (
          <div
            style={{
              position: "absolute",
              left: interpolate(frame, [195, 330], [LEFT_X, RIGHT_X - 120]),
              top: interpolate(frame, [STEP_FRAMES[0], STEP_FRAMES[0] + 14], [BOT_Y - 260, BOT_Y - 150], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.in(Easing.quad),
              }),
              transform: "translate(-50%,-50%)",
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: GROWTH,
              opacity: interpolate(frame, [STEP_FRAMES[0] + 14, STEP_FRAMES[0] + 24], [1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          />
        )}

        {/* texte final */}
        {frame >= 320 && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: BOT_Y + 200,
              textAlign: "center",
              fontSize: FONT.counter,
              fontWeight: 800,
              color: GROWTH,
              opacity: finalIn,
              transform: `scale(${finalScale})`,
              textShadow: `0 0 50px ${GROWTH_GLOW}`,
            }}
          >
            {finalText}
          </div>
        )}
      </AbsoluteFill>
    </Stage>
  );
};
