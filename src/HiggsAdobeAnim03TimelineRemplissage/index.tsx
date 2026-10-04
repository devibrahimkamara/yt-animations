import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsAdobe/Stage";
import { Counter } from "../higgsAdobe/Counter";
import {
  AI_GRAD_CSS,
  CLIP_EMPTY,
  INK,
  FONT,
  RAIL_GREY,
  ATMOS_PANEL_BG,
  atmosPanelBorder,
} from "../higgsAdobe/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const higgsAdobeAnim03Schema = z.object({
  target: z.number().default(78),
  unit: z.string().default("%"),
});
export type HiggsAdobeAnim03Props = z.infer<typeof higgsAdobeAnim03Schema>;

// 3 pistes, clips de largeurs irrégulières. `fill` = taux de remplissage final
// (1 = complet, 0.2-0.3 = clip resté « pas encore IA »).
const TRACKS: { clips: { w: number; fill: number }[] }[] = [
  { clips: [{ w: 360, fill: 1 }, { w: 520, fill: 1 }, { w: 300, fill: 0.25 }, { w: 260, fill: 1 }] },
  { clips: [{ w: 300, fill: 1 }, { w: 240, fill: 0.3 }, { w: 600, fill: 1 }, { w: 320, fill: 1 }] },
  { clips: [{ w: 480, fill: 1 }, { w: 340, fill: 1 }, { w: 280, fill: 0.22 }, { w: 380, fill: 1 }] },
];

const TRACK_H = 120;
const TRACK_GAP = 44;
const CLIP_GAP = 10;
const FILL_DUR = 18; // frames par clip
const FILL_STAGGER = 6; // frames entre le début de chaque clip (12 clips → fin ~frame 114)

// délai de départ du remplissage, clip par clip, piste par piste
const START = 30;
const clipStart = (t: number, c: number) => {
  let order = 0;
  for (let ti = 0; ti < t; ti++) order += TRACKS[ti].clips.length;
  order += c;
  return START + order * FILL_STAGGER;
};

export const HiggsAdobeAnim03TimelineRemplissage: React.FC<HiggsAdobeAnim03Props> = ({
  target,
  unit,
}) => {
  const frame = useCurrentFrame();

  const totalH = TRACKS.length * TRACK_H + (TRACKS.length - 1) * TRACK_GAP;

  // glow pulsant autour du compteur (phase 4)
  const counterGlow = interpolate(
    Math.sin((frame / 50) * Math.PI * 2),
    [-1, 1],
    [0.2, 0.35],
  );

  const outT = interpolate(frame, [175, 195], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  return (
    <Stage>
      <AbsoluteFill style={{ opacity: 1 - outT }}>
        {/* Pistes */}
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "relative", width: 1560, height: totalH }}>
            {TRACKS.map((track, ti) => {
              const trackAppear = interpolate(frame, [ti * 8, ti * 8 + 14], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              });
              return (
                <div
                  key={ti}
                  style={{
                    position: "absolute",
                    top: ti * (TRACK_H + TRACK_GAP),
                    left: 0,
                    right: 0,
                    height: TRACK_H,
                    opacity: trackAppear,
                    transform: `translateX(${interpolate(trackAppear, [0, 1], [-30, 0])}px)`,
                    background: ATMOS_PANEL_BG,
                    border: `1px solid ${atmosPanelBorder(0.18)}`,
                    borderRadius: 14,
                    padding: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: CLIP_GAP,
                  }}
                >
                  {track.clips.map((clip, ci) => {
                    const cAppear = interpolate(
                      frame,
                      [ti * 8 + ci * 3, ti * 8 + ci * 3 + 10],
                      [0, 1],
                      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                    );
                    const s0 = clipStart(ti, ci);
                    const fillP = interpolate(frame, [s0, s0 + FILL_DUR], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: Easing.inOut(Easing.cubic),
                    });
                    const fillPct = fillP * clip.fill * 100;
                    return (
                      <div
                        key={ci}
                        style={{
                          position: "relative",
                          width: clip.w,
                          height: TRACK_H - 16,
                          borderRadius: 8,
                          background: CLIP_EMPTY,
                          overflow: "hidden",
                          opacity: cAppear,
                          transform: `scale(${interpolate(cAppear, [0, 1], [0.9, 1])})`,
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: `${fillPct}%`,
                            background: AI_GRAD_CSS,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </AbsoluteFill>

        {/* Compteur en haut à droite */}
        <div
          style={{
            position: "absolute",
            top: 90,
            right: 130,
            display: "flex",
            alignItems: "baseline",
            gap: 12,
            fontFamily,
          }}
        >
          <div
            style={{
              position: "relative",
              fontWeight: 800,
              fontSize: FONT.counter,
              color: INK,
              letterSpacing: "-4px",
              textShadow: `0 0 60px rgba(136,170,255,${counterGlow}), 0 4px 24px rgba(0,0,0,0.6)`,
            }}
          >
            <Counter
              target={target}
              startFrame={30}
              endFrame={120}
              easing={Easing.out(Easing.cubic)}
            />
          </div>
          <div style={{ fontWeight: 700, fontSize: FONT.label, color: RAIL_GREY }}>{unit}</div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
