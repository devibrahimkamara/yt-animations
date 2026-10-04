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
import { Stage } from "../higgsOpus/Stage";
import { ATMOS_ERROR, FONT } from "../higgsOpus/theme";
import { ShakeWrapper } from "../higgsOpus/utils";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});

// Anim 4 — « Le calendrier du 22 septembre » (105 frames / 3,5 s @ 30 fps)
// Phase 1 apparition 0–10 · Phase 2 arrachage 10–55 · Phase 3 ralenti+arrêt 55–75 ·
// Phase 4 impact tampon 75–90 · Phase 5 stabilisation 90–105

export const higgsOpusAnim04Schema = z.object({
  days: z.array(z.string()).default(["18", "19", "20", "21", "22"]),
  month: z.string().default("SEPT"),
  stampText: z.string().default("NOUVEAU"),
});
export type HiggsOpusAnim04Props = z.infer<typeof higgsOpusAnim04Schema>;

// Écarts qui accélèrent : frame 10, 22, 32, 40 pour les 4 arrachages
const TEAR_FRAMES = [10, 22, 32, 40];
const TEAR_EASINGS = [
  Easing.linear,
  Easing.linear,
  Easing.linear,
  Easing.out(Easing.cubic), // dernier arrachage (21→22) : plus lent
];
const TEAR_DURATIONS = [10, 9, 7, 20];

export const HiggsOpusAnim04CalendrierSeptembre: React.FC<HiggsOpusAnim04Props> = ({
  days,
  month,
  stampText,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const introSpring = spring({ frame, fps, config: { damping: 14, stiffness: 180 } });
  const introScale = interpolate(introSpring, [0, 1], [0.85, 1]);
  const introOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Détermine l'index du jour affiché selon la frame courante
  let dayIndex = 0;
  for (let i = 0; i < TEAR_FRAMES.length; i++) {
    if (frame >= TEAR_FRAMES[i] + TEAR_DURATIONS[i]) dayIndex = i + 1;
  }
  const currentDay = days[Math.min(dayIndex, days.length - 1)];

  // Rotation de la page en cours d'arrachage
  let pageRotation = 0;
  let flashOpacity = 0;
  for (let i = 0; i < TEAR_FRAMES.length; i++) {
    const start = TEAR_FRAMES[i];
    const dur = TEAR_DURATIONS[i];
    if (frame >= start && frame < start + dur) {
      const p = interpolate(frame, [start, start + dur], [0, 1], {
        easing: TEAR_EASINGS[i],
      });
      pageRotation = p * -100;
      flashOpacity = frame < start + 3 ? 0.35 * (1 - (frame - start) / 3) : 0;
    }
  }

  const stampSpring = spring({
    frame: frame - 75,
    fps,
    config: { damping: 14, stiffness: 450 },
  });
  const stampScale = interpolate(stampSpring, [0, 1], [2.2, 1]);
  const stampOpacity = interpolate(frame, [75, 83], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage>
      <AbsoluteFill
        style={{ fontFamily, justifyContent: "center", alignItems: "center" }}
      >
        <ShakeWrapper startFrame={82} durationFrames={6} amplitude={6} seed={91}>
          <div
            style={{
              position: "relative",
              width: 420,
              height: 480,
              transform: `scale(${introScale})`,
              opacity: introOpacity,
              perspective: 1000,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 20,
                background: "#F7F3EA",
                boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transformStyle: "preserve-3d",
                transform: `rotateX(${pageRotation}deg)`,
                transformOrigin: "top",
                backfaceVisibility: "hidden",
              }}
            >
              <div style={{ color: ATMOS_ERROR, fontWeight: 800, fontSize: FONT.value }}>
                {month}
              </div>
              <div style={{ color: "#1a1a1a", fontWeight: 800, fontSize: FONT.hero }}>
                {currentDay}
              </div>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#FFFFFF",
                  opacity: flashOpacity,
                  borderRadius: 20,
                }}
              />
            </div>
          </div>
        </ShakeWrapper>

        {frame >= 75 && (
          <div
            style={{
              position: "absolute",
              padding: "26px 50px",
              border: `6px solid ${ATMOS_ERROR}`,
              borderRadius: 12,
              color: ATMOS_ERROR,
              fontWeight: 800,
              fontSize: FONT.label,
              transform: `rotate(-8deg) scale(${stampScale})`,
              opacity: stampOpacity,
            }}
          >
            {stampText}
          </div>
        )}
      </AbsoluteFill>
    </Stage>
  );
};
