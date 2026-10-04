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
import { Stage } from "../pdfelement/Stage";
import { ACCENT, INK, DARK_SCENE, FONT, atmosGlow } from "../pdfelement/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

const TRACK_X = 440;
const TRACK_W = 980;
const TRACK_H = 60;
const COUNTER_FONT = 64;
const MANUAL_GREY = "#6B7280";
const TRACK_BG = "#2A2D35";

// Format commun aux deux compteurs — MM:SS, deux chiffres partout.
const two = (n: number) => String(Math.floor(n)).padStart(2, "0");
const secondsToClock = (s: number) => `${two(s / 60)}:${two(s % 60)}`;

export const pdfelementAnim03Schema = z.object({
  manualLabel: z.string().default("À LA MAIN"),
  aiLabel: z.string().default("AVEC L'IA"),
  manualSeconds: z.number().default(2700), // 45 min
  aiSeconds: z.number().default(90), // 1 min 30
});

export type PdfelementAnim03Props = z.infer<typeof pdfelementAnim03Schema>;

export const PdfelementAnim03CourseIAVsManuel: React.FC<PdfelementAnim03Props> = ({
  manualLabel,
  aiLabel,
  manualSeconds,
  aiSeconds,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── A : installation
  const setup = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── Barre « à la main » : progression linéaire laborieuse, gèle à la frame 120
  // sans jamais approcher le bout (l'écart est le message).
  const manualEnd = 0.18;
  const manualShown = interpolate(frame, [18, 120], [0, manualEnd], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.linear,
  });
  const manualCounter = interpolate(manualShown, [0, manualEnd], [0, manualSeconds * manualEnd], {
    extrapolateRight: "clamp",
  });

  // ── Barre « avec l'IA » : explose puis s'arrête net à la frame ~95
  const aiProg = interpolate(frame, [18, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });
  const aiCounter = interpolate(frame, [18, 95], [0, aiSeconds], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Flash à l'arrivée de la barre IA
  const flash = interpolate(frame, [93, 97, 104], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const counterPop = spring({
    frame: frame - 94,
    fps,
    config: { damping: 6, stiffness: 200 },
  });
  const aiCounterScale = 1 + interpolate(counterPop, [0, 0.5, 1], [0, 0.15, 0]);

  const rail = (
    label: string,
    y: number,
    prog: number,
    counter: string,
    accent: boolean,
  ) => (
    <div style={{ position: "absolute", left: 0, top: y, width: 1920, opacity: setup }}>
      {/* label */}
      <div
        style={{
          position: "absolute",
          left: 90,
          top: TRACK_H / 2,
          transform: "translateY(-50%)",
          width: TRACK_X - 120,
          textAlign: "right",
          fontFamily,
          fontWeight: 800,
          fontSize: FONT.micro,
          letterSpacing: "2px",
          color: accent ? ACCENT : "#9AA0AA",
        }}
      >
        {label}
      </div>
      {/* piste */}
      <div
        style={{
          position: "absolute",
          left: TRACK_X,
          top: 0,
          width: TRACK_W,
          height: TRACK_H,
          borderRadius: TRACK_H / 2,
          background: TRACK_BG,
          overflow: "hidden",
        }}
      >
        {/* traînée (IA seulement) */}
        {accent && prog > 0 && prog < 1 && (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: TRACK_H,
              width: Math.min(TRACK_W, TRACK_W * prog + 90),
              borderRadius: TRACK_H / 2,
              background: `${ACCENT}55`,
            }}
          />
        )}
        {/* remplissage */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: TRACK_H,
            width: TRACK_W * prog,
            borderRadius: TRACK_H / 2,
            background: accent ? ACCENT : MANUAL_GREY,
            boxShadow: accent ? atmosGlow(ACCENT, 30, 70) : "none",
          }}
        />
      </div>
      {/* compteur */}
      <div
        style={{
          position: "absolute",
          left: TRACK_X + TRACK_W + 40,
          top: TRACK_H / 2,
          transform: `translateY(-50%) scale(${accent ? aiCounterScale : 1})`,
          transformOrigin: "left center",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontWeight: 700,
          fontSize: COUNTER_FONT,
          color: accent ? INK : "#9AA0AA",
        }}
      >
        {counter}
      </div>
    </div>
  );

  return (
    <Stage outFrames={12} bare background={DARK_SCENE}>
      <AbsoluteFill style={{ fontFamily }}>
        {rail(manualLabel, 430, manualShown, secondsToClock(manualCounter), false)}
        {rail(aiLabel, 610, aiProg, secondsToClock(aiCounter), true)}

        {/* halo de flash à l'extrémité de la barre IA */}
        {flash > 0 && (
          <div
            style={{
              position: "absolute",
              left: TRACK_X + TRACK_W,
              top: 610 + TRACK_H / 2,
              width: 260,
              height: 260,
              transform: `translate(-50%, -50%) scale(${0.6 + flash})`,
              borderRadius: "50%",
              background: INK,
              opacity: flash * 0.7,
              filter: "blur(24px)",
            }}
          />
        )}
      </AbsoluteFill>
    </Stage>
  );
};
