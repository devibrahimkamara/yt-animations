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
import { OdometerDigit } from "../freebeat/OdometerDigit";
import { INK, FONT, PDFE_RED } from "../pdfelement/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

const DIGIT_FONT = 150;
const DIGIT_H = DIGIT_FONT * 1.12;

export const pdfelementAnim04Schema = z.object({
  fromVersion: z.number().default(12),
  toVersion: z.number().default(13),
  badgeTag: z.string().default("NOUVEAU"),
  badgeName: z.string().default("Agreement"),
});

export type PdfelementAnim04Props = z.infer<typeof pdfelementAnim04Schema>;

export const PdfelementAnim04UpgradeVersion13Badge: React.FC<PdfelementAnim04Props> = ({
  fromVersion,
  toVersion,
  badgeTag,
  badgeName,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── A : entrée logo + « v12 »
  const introT = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── B : roulement odomètre du dernier chiffre
  const lastFrom = fromVersion % 10;
  const lastTo = toVersion % 10;
  const prefix = String(Math.floor(fromVersion / 10));
  const rollT = interpolate(frame, [15, 51], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const digitOffset = interpolate(rollT, [0, 1], [lastFrom, lastTo]);
  const rollBlur = interpolate(frame, [15, 33, 51], [0, 2, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── C : léger flottement avant le badge
  const floatY = frame > 51 && frame < 62 ? Math.sin((frame - 51) / 3) * 3 : 0;

  // ── D : entrée du badge (spring avec overshoot)
  const badge = spring({ frame: frame - 60, fps, config: { damping: 9, stiffness: 140 } });
  const badgeScale = interpolate(badge, [0, 0.6, 1], [0.7, 1.05, 1]);
  const badgeY = interpolate(badge, [0, 1], [20, 0]);

  // ── E : pulse unique du halo
  const haloT = interpolate(frame, [84, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const haloScale = interpolate(haloT, [0, 0.5, 1], [1, 1.4, 1]);
  const haloOpacity = interpolate(haloT, [0, 0.5, 1], [0, 0.35, 0]);

  return (
    <Stage outFrames={12}>
      <AbsoluteFill
        style={{
          fontFamily,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 60,
        }}
      >
        {/* ── Logo PDFelement (wordmark stylisé, couleurs sponsor) ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 26,
            opacity: introT,
            transform: `scale(${interpolate(introT, [0, 1], [0.9, 1])})`,
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 20,
              background: PDFE_RED,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 40,
              color: INK,
            }}
          >
            PDF
          </div>
          <span style={{ fontWeight: 800, fontSize: 72, color: INK }}>PDFelement</span>
        </div>

        {/* ── Version « v12 » → « v13 » ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            opacity: introT,
            transform: `translateY(${floatY}px)`,
            filter: `blur(${rollBlur}px)`,
            fontWeight: 800,
            fontSize: DIGIT_FONT,
            color: INK,
            lineHeight: 1,
          }}
        >
          <span>v{prefix}</span>
          <OdometerDigit
            offset={digitOffset}
            height={DIGIT_H}
            width={DIGIT_FONT * 0.62}
            fontSize={DIGIT_FONT}
            fontFamily={fontFamily}
            color={INK}
          />
        </div>

        {/* ── Badge « NOUVEAU : Agreement » + halo ── */}
        {frame >= 60 && (
          <div style={{ position: "relative", transform: `translateY(${badgeY}px) scale(${badgeScale})` }}>
            <div
              style={{
                position: "absolute",
                inset: -40,
                borderRadius: 999,
                background: PDFE_RED,
                filter: "blur(40px)",
                opacity: haloOpacity,
                transform: `scale(${haloScale})`,
              }}
            />
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 24,
                padding: "28px 52px",
                borderRadius: 18,
                background: PDFE_RED,
                boxShadow: `0 24px 70px ${PDFE_RED}66`,
              }}
            >
              <span
                style={{
                  fontWeight: 800,
                  fontSize: FONT.micro * 0.7,
                  letterSpacing: "3px",
                  color: "rgba(255,255,255,0.85)",
                  border: "2px solid rgba(255,255,255,0.6)",
                  borderRadius: 8,
                  padding: "6px 14px",
                }}
              >
                {badgeTag}
              </span>
              <span style={{ fontWeight: 800, fontSize: FONT.label, color: INK }}>{badgeName}</span>
            </div>
          </div>
        )}
      </AbsoluteFill>
    </Stage>
  );
};
