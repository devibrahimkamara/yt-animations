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
import { Stage } from "../maxdrop/Stage";
import { OdometerDigit } from "../freebeat/OdometerDigit";
import { GROWTH, GROWTH_GLOW, INK, TEXT_DIM, DARK_SCENE, FONT } from "../maxdrop/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const maxdropAnim01Schema = z.object({
  target: z.number().default(3_000_000_000),
  currency: z.string().default("€"),
  subtitle: z.string().default("Marché européen des compléments alimentaires — 2025"),
});
export type MaxdropAnim01Props = z.infer<typeof maxdropAnim01Schema>;

const DIGITS = 10;
const DIGIT_W = 96;
const DIGIT_H = 156;
const DIGIT_FONT = 138;
const GROUP_GAP = 30; // espace tous les 3 chiffres
const WAVE = 1.5; // décalage (frames) entre colonnes — effet de vague

// Valeur affichée du compteur : montée rapide (Easing.in quad) jusqu'à 2,7 Md,
// puis ralentissement dramatique (Easing.out expo) sur les 300 derniers millions.
function counterValue(frame: number, target: number): number {
  const plateau = target * 0.9; // 2,7 Md pour une cible de 3 Md
  if (frame < 30) return 0;
  if (frame < 96) {
    const t = interpolate(frame, [30, 96], [0, 1], { extrapolateRight: "clamp" });
    return Easing.in(Easing.quad)(t) * plateau;
  }
  if (frame < 162) {
    const t = interpolate(frame, [96, 162], [0, 1], { extrapolateRight: "clamp" });
    return plateau + Easing.out(Easing.exp)(t) * (target - plateau);
  }
  return target;
}

export const MaxdropAnim01CompteurEchelle: React.FC<MaxdropAnim01Props> = ({
  target,
  currency,
  subtitle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 — socle
  const socle = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Phase 4 — flash + rebond « clac »
  const flash = interpolate(frame, [162, 164, 168], [0, 0.8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const clac = spring({
    frame: frame - 162,
    fps,
    config: { damping: 15, stiffness: 300 },
  });
  const clacScale = interpolate(clac, [0, 0.5, 1], [1, 1.08, 1], { extrapolateRight: "clamp" });

  // Phase 5 — réduction du chiffre + montée pour laisser place au sous-titre
  const shrink = interpolate(frame, [168, 198], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const numScale = interpolate(shrink, [0, 1], [1, 0.75]) * clacScale;
  const numShiftY = interpolate(shrink, [0, 1], [0, -40]);

  const subIn = spring({ frame: frame - 168, fps, config: { damping: 200, stiffness: 100 } });
  const subY = interpolate(subIn, [0, 1], [30, 0]);

  const value = counterValue(frame, target);
  const showCurrency = value >= 1_000_000_000;

  // Colonnes : j de gauche → droite, décalage de 3 frames (effet de vague).
  const columns = Array.from({ length: DIGITS }, (_, j) => {
    const place = Math.pow(10, DIGITS - 1 - j);
    const settled = frame >= 158;
    const vLagged = counterValue(frame - j * WAVE, target);
    const targetDigit = Math.floor(target / place) % 10;
    const offset = settled ? targetDigit : (vLagged / place) % 10;
    return { offset, place };
  });

  return (
    <Stage bare background={DARK_SCENE} outFrames={6}>
      <AbsoluteFill style={{ fontFamily, alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: `translateY(${numShiftY}px) scale(${numScale})`,
          }}
        >
          {/* chiffre roulant */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 0 }}>
            {columns.map((c, j) => {
              const fromRight = DIGITS - 1 - j;
              const groupSep = fromRight > 0 && fromRight % 3 === 0;
              return (
                <div key={j} style={{ display: "flex", alignItems: "flex-end" }}>
                  <OdometerDigit
                    offset={c.offset}
                    height={DIGIT_H}
                    width={DIGIT_W}
                    fontSize={DIGIT_FONT}
                    fontFamily={fontFamily}
                    color={INK}
                  />
                  {groupSep && <div style={{ width: GROUP_GAP }} />}
                </div>
              );
            })}
            {showCurrency && (
              <span
                style={{
                  fontSize: DIGIT_FONT,
                  fontWeight: 800,
                  color: GROWTH,
                  marginLeft: 24,
                  opacity: interpolate(value, [1_000_000_000, 1_200_000_000], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                {currency}
              </span>
            )}
          </div>

          {/* socle */}
          <div
            style={{
              marginTop: 26,
              width: 1160,
              height: 6,
              borderRadius: 3,
              background: GROWTH,
              transform: `scaleX(${socle})`,
              boxShadow: `0 0 40px 6px ${GROWTH_GLOW}`,
            }}
          />

          {/* sous-titre */}
          <div
            style={{
              marginTop: 44,
              fontSize: FONT.micro,
              fontWeight: 700,
              color: TEXT_DIM,
              opacity: subIn,
              transform: `translateY(${subY}px)`,
              textAlign: "center",
            }}
          >
            {subtitle}
          </div>
        </div>

        <AbsoluteFill style={{ background: INK, opacity: flash, pointerEvents: "none" }} />
      </AbsoluteFill>
    </Stage>
  );
};
