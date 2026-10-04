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
import { Stage } from "../freebeat/Stage";
import { OdometerDigit } from "../freebeat/OdometerDigit";
import {
  ACCENT,
  INK,
  FONT,
  ATMOS_PANEL_BG,
  atmosPanelBorder,
  atmosGlow,
} from "../freebeat/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const freebeatAnim02Schema = z.object({
  suffix: z.string().default("€"),
  label: z.string().default("par vidéo livrée"),
});

export type FreebeatAnim02Props = z.infer<typeof freebeatAnim02Schema>;

const DIGIT_H = 248;
const DIGIT_W = 162;
const DIGIT_FS = 208;
const EASE_OUT = Easing.out(Easing.cubic);
const sep = () => (
  <div style={{ width: 3, height: DIGIT_H * 0.62, background: "rgba(255,255,255,0.14)" }} />
);

export const FreebeatAnim02OdometreTarif: React.FC<FreebeatAnim02Props> = ({ suffix, label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Entrée de la carte (0-12)
  const enter = spring({ frame, fps, config: { damping: 20, stiffness: 200 } });
  const enterY = interpolate(enter, [0, 1], [40, 0], { extrapolateRight: "clamp" });

  // ── Colonnes : offset en "nombre de chiffres" (phase A 12-66, phase B 96-138)
  const tensOffset =
    interpolate(frame, [12, 66], [0, 25], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT }) +
    interpolate(frame, [96, 138], [0, 5], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT });
  const unitsOffset =
    interpolate(frame, [12, 66], [0, 30], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT }) +
    interpolate(frame, [96, 138], [0, 10], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT });

  // ── 3ᵉ digit (centaine) : glisse depuis le haut à partir de la frame 96
  const showHundreds = frame >= 96;
  const hundredsSlideY = interpolate(frame, [96, 114], [-DIGIT_H, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  const hundredsOffset = interpolate(frame, [98, 124], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  const hundredsOpacity = interpolate(frame, [96, 104], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── « Clac » mécanique à l'arrêt sur 50 (66-69)
  const shakeX = interpolate(frame, [66, 67, 68, 69], [0, -5, 5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shakeY = interpolate(frame, [66, 67, 68, 69], [0, 5, -5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Pic quand « 100 » se stabilise (~138)
  const peakFlash = interpolate(frame, [136, 139, 146], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage outFrames={12}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            opacity: enter,
            transform: `translate(${shakeX}px, ${enterY + shakeY}px)`,
            background: ATMOS_PANEL_BG,
            border: `4px solid ${peakFlash > 0 ? ACCENT : atmosPanelBorder(0.3)}`,
            borderRadius: 44,
            padding: "96px 128px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 60,
            boxShadow: `${atmosGlow(ACCENT, 80, 160)}, 0 0 ${80 * peakFlash}px ${ACCENT}`,
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Rouleaux + € — dans un boîtier « mécanique » sombre */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#0d1530",
              padding: "26px 36px",
              borderRadius: 28,
              border: `2px solid ${atmosPanelBorder(0.35)}`,
            }}
          >
            {/* fenêtre centaine — glisse depuis le haut à partir de la frame 96 */}
            {showHundreds && (
              <>
                <div
                  style={{
                    overflow: "hidden",
                    opacity: hundredsOpacity,
                    transform: `translateY(${hundredsSlideY}px)`,
                  }}
                >
                  <OdometerDigit
                    offset={hundredsOffset}
                    height={DIGIT_H}
                    width={DIGIT_W}
                    fontSize={DIGIT_FS}
                    fontFamily={fontFamily}
                    color={INK}
                  />
                </div>
                {sep()}
              </>
            )}

            <OdometerDigit
              offset={tensOffset}
              height={DIGIT_H}
              width={DIGIT_W}
              fontSize={DIGIT_FS}
              fontFamily={fontFamily}
              color={INK}
            />
            {sep()}
            <OdometerDigit
              offset={unitsOffset}
              height={DIGIT_H}
              width={DIGIT_W}
              fontSize={DIGIT_FS}
              fontFamily={fontFamily}
              color={INK}
              flash={peakFlash * 0.6}
              flashColor={ACCENT}
            />

            <div
              style={{
                height: DIGIT_H,
                display: "flex",
                alignItems: "center",
                marginLeft: 24,
                fontFamily,
                fontWeight: 800,
                fontSize: DIGIT_FS,
                lineHeight: 1,
                color: ACCENT,
              }}
            >
              {suffix}
            </div>
          </div>

          {/* Étiquette fixe */}
          <div
            style={{
              fontFamily,
              fontWeight: 700,
              fontSize: FONT.label,
              color: "#B0B0B8",
              letterSpacing: 1,
            }}
          >
            {label}
          </div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
