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
import { AtmosBackground } from "../AtmosOverlay/AtmosBackground";
import { IconCheck } from "../pippit/icons";
import { MONEY_GREEN, FONT } from "../pippit/theme";

// Anim 4 — « Le morphing ordinateur → téléphone » (150 frames / 5 s) — demi-écran
// A Entrée 0–10 · B Dessin ordi 10–45 · C "OU" 45–55 · D Tenue 55–65 ·
// E Morphing 65–105 · F Tenue téléphone 105–115 · G Réunion + check 115–140 ·
// H Sortie 140–150

const { fontFamily } = loadFont("normal", { weights: ["600", "700"], subsets: ["latin"] });

export const pippitAnim04Schema = z.object({
  finalText: z.string().default("C'est tout."),
});
export type PippitAnim04Props = z.infer<typeof pippitAnim04Schema>;

type Pt = { x: number; y: number };

// Silhouette ordinateur portable (8 points, coordonnées locales centrées)
const LAPTOP: Pt[] = [
  { x: -130, y: -190 },
  { x: 130, y: -190 },
  { x: 130, y: -20 },
  { x: 160, y: -20 },
  { x: 160, y: 0 },
  { x: -160, y: 0 },
  { x: -160, y: -20 },
  { x: -130, y: -20 },
];

// Silhouette smartphone (8 points, coins coupés — même compte que LAPTOP)
const W = 90;
const H = 170;
const C = 24;
const PHONE: Pt[] = [
  { x: -W + C, y: -H },
  { x: W - C, y: -H },
  { x: W, y: -H + C },
  { x: W, y: H - C },
  { x: W - C, y: H },
  { x: -W + C, y: H },
  { x: -W, y: H - C },
  { x: -W, y: -H + C },
];

const toPath = (pts: Pt[]) =>
  `M ${pts[0].x},${pts[0].y} ` + pts.slice(1).map((p) => `L ${p.x},${p.y}`).join(" ") + " Z";

const polylineLength = (pts: Pt[]) => {
  let len = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    len += Math.hypot(b.x - a.x, b.y - a.y);
  }
  return len;
};

const LAPTOP_LEN = polylineLength(LAPTOP);

const lerpPoints = (a: Pt[], b: Pt[], t: number): Pt[] =>
  a.map((p, i) => ({
    x: interpolate(t, [0, 1], [p.x, b[i].x]),
    y: interpolate(t, [0, 1], [p.y, b[i].y]),
  }));

export const PippitAnim04MorphingOrdiTelephone: React.FC<PippitAnim04Props> = ({ finalText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // B — dessin de l'ordinateur
  const drawProgress = interpolate(frame, [10, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  // C — mot "OU"
  const ouAppear = spring({ frame: frame - 45, fps, config: { damping: 12, stiffness: 180, mass: 0.6 } });
  const ouFadeOut = interpolate(frame, [65, 80], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ouOpacity = frame < 65 ? ouAppear : ouFadeOut;

  // E — morphing ordi → téléphone
  const morphT = interpolate(frame, [65, 105], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const morphedPts = lerpPoints(LAPTOP, PHONE, morphT);

  // G — réunion : le smartphone rétrécit et part à gauche
  const reunionT = interpolate(frame, [115, 127], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const mainScale = interpolate(reunionT, [0, 1], [1, 0.5]);
  const mainTranslateX = interpolate(reunionT, [0, 1], [0, -230]);

  // Ordinateur miniature à droite
  const miniAppear = spring({ frame: frame - 118, fps, config: { damping: 13, stiffness: 170, mass: 0.6 } });

  // Check vert
  const checkAppear = spring({ frame: frame - 127, fps, config: { damping: 10, stiffness: 200, mass: 0.5 } });

  // Texte final
  const finalTextOpacity = interpolate(frame, [130, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exitOpacity = interpolate(frame, [140, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        left: "50%",
        width: "50%",
        opacity: entryOpacity * exitOpacity,
      }}
    >
      <AtmosBackground />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "relative",
            transform: `translateX(${mainTranslateX}px) scale(${mainScale})`,
          }}
        >
          <svg width={400} height={420} viewBox="-200 -210 400 420" style={{ overflow: "visible" }}>
            <path
              d={toPath(morphedPts)}
              fill="none"
              stroke="#fff"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={frame < 65 ? LAPTOP_LEN : undefined}
              strokeDashoffset={frame < 65 ? LAPTOP_LEN * (1 - drawProgress) : undefined}
            />
          </svg>

          {frame >= 45 && frame < 105 && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: 40,
                transform: `translateX(-50%) scale(${interpolate(frame < 65 ? ouAppear : 1, [0, 1], [0.85, 1])})`,
                opacity: ouOpacity,
                fontFamily,
                fontWeight: 700,
                fontSize: FONT.label,
                color: "#fff",
                whiteSpace: "nowrap",
              }}
            >
              OU
            </div>
          )}
        </div>

        {frame >= 118 && (
          <svg
            width={160}
            height={168}
            viewBox="-200 -210 400 420"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(80px, -30px) scale(${0.35 * Math.max(0, miniAppear)})`,
              overflow: "visible",
              opacity: Math.max(0, miniAppear),
            }}
          >
            <path
              d={toPath(LAPTOP)}
              fill="none"
              stroke="#fff"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}

        {frame >= 127 && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -170px) scale(${Math.max(0, checkAppear)})`,
            }}
          >
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: "50%",
                background: MONEY_GREEN,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconCheck size={36} color="#fff" strokeWidth={5} />
            </div>
          </div>
        )}

        {frame >= 130 && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, 90px)",
              opacity: finalTextOpacity,
              fontFamily,
              fontWeight: 700,
              fontSize: FONT.label,
              color: "#fff",
              whiteSpace: "nowrap",
            }}
          >
            {finalText}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
