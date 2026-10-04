import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsGpt3/Stage";
import { IconImage, IconFilmReel, IconCoin } from "../higgsGpt3/icons";
import { ACCENT, ACCENT_LIGHT, INK, FONT, atmosGlow } from "../higgsGpt3/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});

// Anim 2 — « Rail de A à Z » (204 frames / 6,8 s @ 30 fps — allongée vs les
// 180 frames du brief pour laisser 1,5 s pleine à chaque arrêt, comme le
// brief le suggère lui-même en note de timing)
// A rail tracé + lettres 0–18 · B voyage du curseur avec 3 arrêts (18–195)
// C sprint final + arrivée Z 195–204

export const higgsGpt3Anim02Schema = z.object({
  station1: z.string().default("Générer les images"),
  station2: z.string().default("Animer les plans"),
  station3: z.string().default("Monétiser"),
});
export type HiggsGpt3Anim02Props = z.infer<typeof higgsGpt3Anim02Schema>;

const ICON_SM = 56;
const RAIL_Y = 760;
const RAIL_X0 = 200;
const RAIL_X1 = 1720;
const RAIL_LEN = RAIL_X1 - RAIL_X0;
const LETTERS = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i),
);

const STATIONS = [
  { pct: 15, start: 35, end: 80, key: "station1", Icon: IconImage },
  { pct: 45, start: 95, end: 140, key: "station2", Icon: IconFilmReel },
  { pct: 90, start: 155, end: 195, key: "station3", Icon: IconCoin },
] as const;

export const HiggsGpt3Anim02RailAZ: React.FC<HiggsGpt3Anim02Props> = ({
  station1,
  station2,
  station3,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const labels: Record<string, string> = { station1, station2, station3 };

  const railDraw = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const cursorPct = (f: number) =>
    interpolate(
      f,
      [0, 18, 35, 80, 95, 140, 155, 195, 204],
      [0, 0, 15, 15, 45, 45, 90, 90, 100],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );

  const pct = cursorPct(frame);
  const cursorX = RAIL_X0 + (pct / 100) * RAIL_LEN;

  const activeStation = STATIONS.find(
    (s) => frame >= s.start - 4 && frame < s.end,
  );

  const zFlash = interpolate(frame, [195, 197, 200], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shockwave = interpolate(frame, [195, 204], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <Stage outFrames={12}>
      <AbsoluteFill style={{ fontFamily }}>
        {/* Rail */}
        <svg
          width={1920}
          height={1080}
          style={{ position: "absolute", inset: 0 }}
        >
          <line
            x1={RAIL_X0}
            y1={RAIL_Y}
            x2={RAIL_X1}
            y2={RAIL_Y}
            stroke="rgba(255,255,255,0.35)"
            strokeWidth={2}
            style={{
              strokeDasharray: RAIL_LEN,
              strokeDashoffset: RAIL_LEN * (1 - railDraw),
            }}
          />
        </svg>

        {/* Lettres + stations */}
        {LETTERS.map((letter, i) => {
          const letterX = RAIL_X0 + (i / 25) * RAIL_LEN;
          const station = STATIONS.find(
            (s) => Math.round((s.pct / 100) * 25) === i,
          );
          const visited = station ? frame >= station.start - 4 : false;
          const isActiveNow =
            station && frame >= station.start - 4 && frame < station.end;
          const scale = isActiveNow
            ? interpolate(frame, [station!.start - 4, station!.start + 8], [1, 1.4], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : visited
              ? 1.1
              : 1;
          const letterOpacity = visited || isActiveNow ? 1 : 0.5;
          const letterColor = visited || isActiveNow ? ACCENT_LIGHT : "rgba(255,255,255,0.6)";

          return (
            <div key={letter} style={{ position: "absolute", left: letterX - 10, top: RAIL_Y - 46 }}>
              {isActiveNow && (
                <div
                  style={{
                    position: "absolute",
                    left: -25,
                    top: -12,
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: `${ACCENT}30`,
                    transform: `scale(${1 + Math.sin(frame / fps * Math.PI * 2) * 0.15})`,
                  }}
                />
              )}
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  opacity: letterOpacity,
                  color: letterColor,
                  transform: `scale(${scale})`,
                  transformOrigin: "center",
                }}
              >
                {letter}
              </div>
            </div>
          );
        })}

        {/* Station labels */}
        {STATIONS.map((s) => {
          const inWindow = frame >= s.start && frame < s.end;
          const entry = interpolate(frame, [s.start, s.start + 9], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.quad),
          });
          const exit = interpolate(frame, [s.end - 6, s.end], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const opacity = inWindow ? Math.min(entry, exit) : 0;
          const x = RAIL_X0 + (s.pct / 100) * RAIL_LEN;
          const y0 = interpolate(entry, [0, 1], [10, 0]);

          return (
            <div
              key={s.key}
              style={{
                position: "absolute",
                left: x,
                top: RAIL_Y - 150,
                transform: `translate(-50%, ${y0}px)`,
                opacity,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <s.Icon size={ICON_SM} color={ACCENT_LIGHT} strokeWidth={4} />
              <div
                style={{
                  fontSize: FONT.micro * 0.55,
                  fontWeight: 700,
                  color: INK,
                  whiteSpace: "nowrap",
                }}
              >
                {labels[s.key]}
              </div>
            </div>
          );
        })}

        {/* Curseur + traînée */}
        {[9, 6, 3].map((k) => {
          const p = cursorPct(frame - k);
          const x = RAIL_X0 + (p / 100) * RAIL_LEN;
          const moving = !activeStation && frame < 195;
          return moving ? (
            <div
              key={k}
              style={{
                position: "absolute",
                left: x - 5,
                top: RAIL_Y - 5,
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: ACCENT,
                opacity: (1 - k / 12) * 0.5,
              }}
            />
          ) : null;
        })}
        <div
          style={{
            position: "absolute",
            left: cursorX - 7,
            top: RAIL_Y - 7,
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: ACCENT_LIGHT,
            boxShadow: atmosGlow(ACCENT, 25, 50),
            transform: `scale(${frame >= 195 ? 1 + shockwave * 0.6 : 1})`,
          }}
        />

        {/* Arrivée en Z */}
        {frame >= 195 && (
          <>
            <div
              style={{
                position: "absolute",
                left: RAIL_X1 - 60,
                top: RAIL_Y - 60,
                width: 120,
                height: 120,
                borderRadius: "50%",
                border: `2px solid ${ACCENT_LIGHT}`,
                opacity: (1 - shockwave) * 0.6,
                transform: `scale(${shockwave * 3})`,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "#fff",
                opacity: zFlash * 0.5,
              }}
            />
          </>
        )}
      </AbsoluteFill>
    </Stage>
  );
};
