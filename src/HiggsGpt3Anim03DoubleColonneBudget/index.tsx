import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsGpt3/Stage";
import {
  IconCamera,
  IconDrone,
  IconSofa,
  IconComputer,
  IconWand,
  IconCloud,
} from "../higgsGpt3/icons";
import {
  ACCENT,
  ATMOS_ERROR,
  MONEY_GREEN,
  INK,
  FONT,
  mulberry32,
} from "../higgsGpt3/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});

// Anim 3 — « Double colonne budget » (210 frames / 7 s @ 30 fps)
// A colonne gauche "Méthode classique" 0–66 · B colonne droite "Setup IA" 66–120
// C hold comparatif + badge -98% 120–192 · D effondrement + sortie 192–210

export const higgsGpt3Anim03Schema = z.object({
  leftTotal: z.number().default(1200),
  rightTotal: z.number().default(15),
  delta: z.string().default("-98%"),
});
export type HiggsGpt3Anim03Props = z.infer<typeof higgsGpt3Anim03Schema>;

const LEFT_ITEMS = [
  { Icon: IconCamera, label: "Photographe professionnel" },
  { Icon: IconDrone, label: "Location drone" },
  { Icon: IconSofa, label: "Home staging" },
];
const RIGHT_ITEMS = [
  { Icon: IconComputer, label: "Génération d'images IA" },
  { Icon: IconWand, label: "Animation automatique" },
  { Icon: IconCloud, label: "Export en 1 clic" },
];

const COL_W = 720;
const LEFT_X = 140;
const RIGHT_X = 1920 - 140 - COL_W;
const AXIS_X = 960;

const rand = mulberry32(4242);
const fragments = Array.from({ length: 5 }, () => ({
  rot: -15 + rand() * 40,
  fallDelay: Math.floor(rand() * 6),
}));

const fmt = (n: number) => Math.floor(n).toLocaleString("fr-FR");

export const HiggsGpt3Anim03DoubleColonneBudget: React.FC<
  HiggsGpt3Anim03Props
> = ({ leftTotal, rightTotal, delta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftTitleOp = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rightTitleOp = interpolate(frame, [66, 78], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const leftCounter = interpolate(frame, [40, 66], [0, leftTotal], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rightCounter = interpolate(frame, [100, 120], [0, rightTotal], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const badgeSpring = spring({
    frame: frame - 130,
    fps,
    config: { damping: 12, stiffness: 200 },
  });
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.7, 1]);
  const badgeOpacity = interpolate(frame, [130, 138], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const axisPulse = 0.3 + (Math.sin(frame / fps / 1.3 * Math.PI * 2) + 1) * 0.1;

  const collapseT = interpolate(frame, [192, 204], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rightTakeover = interpolate(frame, [204, 210], [1, 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage outFrames={6}>
      <AbsoluteFill style={{ fontFamily }}>
        {/* Axe central */}
        <div
          style={{
            position: "absolute",
            left: AXIS_X,
            top: 140,
            bottom: 140,
            width: 2,
            background: "rgba(255,255,255,1)",
            opacity: axisPulse,
          }}
        />

        {/* Colonne gauche — Méthode classique */}
        <div
          style={{
            position: "absolute",
            left: LEFT_X,
            top: 150,
            width: COL_W,
            opacity: 1 - collapseT,
          }}
        >
          <div
            style={{
              fontSize: FONT.value * 0.55,
              fontWeight: 800,
              color: ATMOS_ERROR,
              opacity: leftTitleOp,
              transform: `translateY(${interpolate(leftTitleOp, [0, 1], [-10, 0])}px)`,
              letterSpacing: 1,
              marginBottom: 40,
            }}
          >
            MÉTHODE CLASSIQUE
          </div>
          {LEFT_ITEMS.map((item, i) => {
            const start = 12 + i * 9;
            const s = spring({
              frame: frame - start,
              fps,
              config: { damping: 12, stiffness: 200 },
            });
            const x = interpolate(s, [0, 1], [-15, 0]);
            const op = interpolate(s, [0, 1], [0, 1]);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  marginBottom: 28,
                  opacity: op,
                  transform: `translateX(${x}px)`,
                }}
              >
                <item.Icon size={56} color={ATMOS_ERROR} strokeWidth={4} />
                <span style={{ fontSize: FONT.micro * 0.55, color: INK }}>
                  {item.label}
                </span>
              </div>
            );
          })}
          <div
            style={{
              marginTop: 30,
              fontSize: FONT.hero * 0.4,
              fontWeight: 800,
              color: ATMOS_ERROR,
            }}
          >
            {fmt(leftCounter)} €
          </div>
        </div>

        {/* Colonne droite — Setup IA 2026 */}
        <div
          style={{
            position: "absolute",
            left: RIGHT_X,
            top: 150,
            width: COL_W,
            transform: `scale(${rightTakeover})`,
            transformOrigin: "top center",
          }}
        >
          <div
            style={{
              fontSize: FONT.value * 0.55,
              fontWeight: 800,
              color: MONEY_GREEN,
              opacity: rightTitleOp,
              transform: `translateY(${interpolate(rightTitleOp, [0, 1], [-10, 0])}px)`,
              letterSpacing: 1,
              marginBottom: 40,
            }}
          >
            SETUP IA 2026
          </div>
          {RIGHT_ITEMS.map((item, i) => {
            const start = 78 + i * 6;
            const s = spring({
              frame: frame - start,
              fps,
              config: { damping: 12, stiffness: 200 },
            });
            const x = interpolate(s, [0, 1], [-15, 0]);
            const op = interpolate(s, [0, 1], [0, 1]);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  marginBottom: 28,
                  opacity: op,
                  transform: `translateX(${x}px)`,
                }}
              >
                <item.Icon size={56} color={ACCENT} strokeWidth={4} />
                <span style={{ fontSize: FONT.micro * 0.55, color: INK }}>
                  {item.label}
                </span>
              </div>
            );
          })}
          <div
            style={{
              marginTop: 30,
              fontSize: FONT.hero * 0.48,
              fontWeight: 800,
              color: MONEY_GREEN,
            }}
          >
            {fmt(rightCounter)} €
          </div>
        </div>

        {/* Badge delta */}
        <div
          style={{
            position: "absolute",
            left: AXIS_X,
            top: 90,
            transform: `translateX(-50%) scale(${badgeScale})`,
            opacity: badgeOpacity,
            background: MONEY_GREEN,
            borderRadius: 999,
            padding: "14px 32px",
            fontSize: FONT.micro * 0.55,
            fontWeight: 800,
            color: "#06210f",
          }}
        >
          {delta}
        </div>

        {/* Fragments d'effondrement de la colonne gauche */}
        {collapseT > 0 &&
          fragments.map((f, i) => {
            const bandH = 420 / fragments.length;
            const t = interpolate(
              frame,
              [192 + f.fallDelay, 204 + f.fallDelay],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: LEFT_X,
                  top: 240 + i * bandH,
                  width: COL_W,
                  height: bandH,
                  background: "rgba(239,68,68,0.15)",
                  border: `1px solid ${ATMOS_ERROR}55`,
                  opacity: interpolate(t, [0, 1], [1, 0]),
                  transform: `translateY(${t * (200 + i * 60)}px) rotate(${f.rot * t}deg)`,
                }}
              />
            );
          })}
      </AbsoluteFill>
    </Stage>
  );
};
