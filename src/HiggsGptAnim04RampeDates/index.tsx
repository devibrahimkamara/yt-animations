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
import { Stage } from "../higgsGpt/Stage";
import { IconPin } from "../higgsGpt/icons";
import { shake } from "../higgsGpt/shake";
import {
  TODAY_CURSOR,
  STRIKE_RED,
  STRIKE_RED_GLOW,
  FONT,
} from "../higgsGpt/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "800"],
  subsets: ["latin"],
});

// Anim 4 — « La rampe de dates » (210 frames / 7 s @ 30 fps)
// A rail 0–30 · B plantage marqueur « 3 » 30–60 · C curseur « aujourd'hui »
// 3→7 + compteur J+X 60–150 · D hold 150–180 · E sortie 180–210
// Ancre temporelle : Astra sorti le 3, vidéo faite le 7 (« tu es à jour »).

export const higgsGptAnim04Schema = z.object({
  days: z.array(z.string()).default(["1", "2", "3", "4", "5", "6", "7"]),
  releaseLabel: z.string().default("SORTIE OFFICIELLE"),
  todayLabel: z.string().default("AUJOURD'HUI"),
});
export type HiggsGptAnim04Props = z.infer<typeof higgsGptAnim04Schema>;

const RAIL_W = 1440;
const RAIL_X = (1920 - RAIL_W) / 2;
const AXIS_Y = 520;
const REL_I = 2; // « 3 septembre »
const TODAY_I = 6; // « 7 septembre »
const STEP = RAIL_W / 6;
const px = (i: number) => RAIL_X + i * STEP;

export const HiggsGptAnim04RampeDates: React.FC<HiggsGptAnim04Props> = ({
  days,
  releaseLabel,
  todayLabel,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // A — rail
  const railScale = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // B — marqueur rouge qui se plante sur le « 3 »
  const plant = spring({
    frame: frame - 30,
    fps,
    config: { damping: 8, stiffness: 150, mass: 0.9 },
  });
  const pinY = interpolate(plant, [0, 1], [-320, 0], {
    extrapolateRight: "clamp",
  });
  const impactF = 30 + Math.round(0.5 * fps); // ≈ frame 45
  const shockT = interpolate(frame, [impactF, impactF + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const camX = shake(frame, impactF, 9, 8, 2.0);
  const camY = shake(frame, impactF, 6, 8, 2.6);
  const relTextT = interpolate(frame, [impactF + 3, impactF + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // C — curseur « aujourd'hui » 3 → 7
  const cursorProg = interpolate(frame, [60, 150], [REL_I, TODAY_I], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const cursorX = px(cursorProg);
  const cursorVisible = frame >= 60;
  const daysCount = Math.max(0, Math.round(cursorProg) - REL_I);
  const lastTickIndex = Math.round(cursorProg);
  // pulse d'échelle à chaque incrément du compteur
  const sinceIncr = cursorProg - (REL_I + daysCount);
  const counterPulse =
    daysCount > 0 && sinceIncr < 0.18
      ? 1 + (0.18 - sinceIncr) * 1.6
      : 1;
  const todayT = interpolate(frame, [150, 164], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // D — hold pulse
  const holdPulse = frame >= 150 ? 0.8 + Math.sin(frame / 12) * 0.2 : 1;

  // E — sortie
  const outT = interpolate(frame, [180, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const compOpacity = 1 - outT;
  const compScale = 1 - outT * 0.05;

  return (
    <Stage outFrames={2}>
      <AbsoluteFill
        style={{
          opacity: compOpacity,
          transform: `translate(${camX}px, ${camY}px) scale(${compScale})`,
        }}
      >
        {/* Rail + graduations */}
        <div
          style={{
            position: "absolute",
            left: RAIL_X,
            top: AXIS_Y,
            width: RAIL_W,
            height: 4,
            background: "rgba(255,255,255,0.55)",
            transform: `scaleX(${railScale})`,
            transformOrigin: "left center",
            borderRadius: 4,
          }}
        />
        {days.map((d, i) => {
          const gradIn = interpolate(
            frame,
            [6 + i * 3, 14 + i * 3],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const tick =
            cursorVisible && lastTickIndex === i && i > REL_I
              ? Math.max(0, 1 - (cursorProg - i) * 6)
              : 0;
          return (
            <div key={i}>
              <div
                style={{
                  position: "absolute",
                  left: px(i) - 3,
                  top: AXIS_Y - 12,
                  width: 6,
                  height: 28,
                  borderRadius: 4,
                  background: "#fff",
                  opacity: gradIn * (0.5 + tick * 0.5),
                  boxShadow: tick > 0 ? `0 0 20px #fff` : "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: px(i) - 40,
                  top: AXIS_Y + 30,
                  width: 80,
                  textAlign: "center",
                  fontFamily,
                  fontWeight: 600,
                  fontSize: FONT.micro,
                  color: "rgba(255,255,255,0.8)",
                  opacity: gradIn,
                }}
              >
                {d}
              </div>
            </div>
          );
        })}

        {/* Onde de choc à l'impact */}
        {frame >= impactF && shockT < 1 && (
          <div
            style={{
              position: "absolute",
              left: px(REL_I) - 90,
              top: AXIS_Y - 90,
              width: 180,
              height: 180,
              borderRadius: "50%",
              border: `4px solid ${STRIKE_RED}`,
              transform: `scale(${interpolate(shockT, [0, 1], [0, 2])})`,
              opacity: 1 - shockT,
            }}
          />
        )}

        {/* Marqueur rouge « SORTIE OFFICIELLE » */}
        {frame >= 30 && (
          <div
            style={{
              position: "absolute",
              left: px(REL_I) - 46,
              top: AXIS_Y - 8 - 92 + pinY,
              width: 92,
              filter: `drop-shadow(0 6px 18px ${STRIKE_RED_GLOW})`,
            }}
          >
            <IconPin size={92} color={STRIKE_RED} fill={STRIKE_RED} />
          </div>
        )}
        <div
          style={{
            position: "absolute",
            left: px(REL_I) - 450,
            top: AXIS_Y - 250,
            width: 900,
            textAlign: "center",
            whiteSpace: "nowrap",
            fontFamily,
            fontWeight: 800,
            fontSize: FONT.micro,
            letterSpacing: "2px",
            color: STRIKE_RED,
            opacity: relTextT * (frame >= 150 ? holdPulse : 1),
            transform: `translateY(${interpolate(relTextT, [0, 1], [16, 0])}px)`,
          }}
        >
          {releaseLabel}
        </div>

        {/* Curseur « aujourd'hui » + compteur J+X */}
        {cursorVisible && (
          <>
            <div
              style={{
                position: "absolute",
                left: cursorX - 24,
                top: AXIS_Y - 24,
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: TODAY_CURSOR,
                border: "5px solid #fff",
                boxShadow: `0 0 24px ${TODAY_CURSOR}`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 10,
                  height: 10,
                  marginLeft: -5,
                  marginTop: -5,
                  borderRadius: "50%",
                  background: "#fff",
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                left: cursorX - 140,
                top: AXIS_Y + 96,
                width: 280,
                textAlign: "center",
                fontFamily,
                fontWeight: 800,
                fontSize: FONT.label,
                color: TODAY_CURSOR,
                transform: `scale(${counterPulse})`,
              }}
            >
              {daysCount > 0 ? `J+${daysCount}` : "J+0"}
            </div>
            <div
              style={{
                position: "absolute",
                left: px(TODAY_I) - 700,
                top: AXIS_Y - 250,
                width: 780,
                textAlign: "right",
                whiteSpace: "nowrap",
                fontFamily,
                fontWeight: 800,
                fontSize: FONT.micro,
                letterSpacing: "2px",
                color: TODAY_CURSOR,
                opacity: todayT * (frame >= 150 ? holdPulse : 1),
                transform: `translateY(${interpolate(todayT, [0, 1], [16, 0])}px)`,
              }}
            >
              {todayLabel}
            </div>
          </>
        )}
      </AbsoluteFill>
    </Stage>
  );
};
