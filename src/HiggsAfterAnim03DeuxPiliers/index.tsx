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
import { Stage } from "../higgsAfter/Stage";
import { ACCENT, INK, FONT } from "../higgsAfter/theme";
import { IconPremiere, IconAfterEffects } from "../higgsAfter/icons";

const { fontFamily } = loadFont("normal", {
  weights: ["500", "700"],
  subsets: ["latin"],
});

// Anim 3 — Plan 3 « Deux piliers qui montent du bas » (180 frames / 6s)
// A vide + sol 0–9 · B colonnes montent 9–~48 · C logos ~1.5s · D libellés
// 60–84 · E hold 84–135 · F sol se termine + glow 135–180

export const higgsAfterAnim03Schema = z.object({});
export type HiggsAfterAnim03Props = z.infer<typeof higgsAfterAnim03Schema>;

const GROUND_Y = 1080 * 0.72;
const COL_W = 260;

export const HiggsAfterAnim03DeuxPiliers: React.FC<
  HiggsAfterAnim03Props
> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Colonnes : gauche plus rapide (1,1s), droite légèrement décalée (1,3s)
  const leftEnd = 9 + 33; // 42
  const rightStart = 13;
  const rightEnd = rightStart + 39; // 52

  const leftH = interpolate(frame, [9, leftEnd], [0, GROUND_Y * 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const rightH = interpolate(
    frame,
    [rightStart, rightEnd],
    [0, GROUND_Y * 0.65],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    },
  );

  const leftLogoPop = spring({
    frame: frame - leftEnd,
    fps,
    config: { damping: 10, stiffness: 180 },
  });
  const rightLogoPop = spring({
    frame: frame - rightEnd,
    fps,
    config: { damping: 10, stiffness: 180 },
  });

  const leftLabelIn = interpolate(frame, [60, 69], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rightLabelIn = interpolate(frame, [69, 78], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const groundDraw = interpolate(frame, [135, 168], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const glowPulse = interpolate(
    frame,
    [168, 178, 180],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const CX = 1920 / 2;

  return (
    <Stage outFrames={2}>
      <AbsoluteFill style={{ background: "#0a0a0c" }}>
        {/* Ligne de sol discrète, toujours visible */}
        <div
          style={{
            position: "absolute",
            top: GROUND_Y,
            left: 0,
            width: "100%",
            height: 1,
            background: "rgba(255,255,255,0.14)",
          }}
        />
        {/* Segment accent qui se termine depuis le centre */}
        <div
          style={{
            position: "absolute",
            top: GROUND_Y - 1,
            left: CX - 400 * groundDraw,
            width: 800 * groundDraw,
            height: 3,
            background: ACCENT,
            filter: `drop-shadow(0 0 ${10 + glowPulse * 20}px ${ACCENT})`,
          }}
        />

        {/* Colonne gauche — Premiere Pro */}
        <div
          style={{
            position: "absolute",
            left: CX - 340 - COL_W,
            bottom: 1080 - GROUND_Y,
            width: COL_W,
            height: Math.max(0, leftH),
            borderRadius: "10px 10px 0 0",
            background: "linear-gradient(180deg, #2a1a3d 0%, #140c1e 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -70,
              left: "50%",
              transform: `translateX(-50%) scale(${Math.max(0, leftLogoPop)})`,
            }}
          >
            <IconPremiere size={90} color="#c084fc" />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: CX - 340 - COL_W,
            width: COL_W,
            top: GROUND_Y + 24,
            textAlign: "center",
            fontFamily,
            fontWeight: 500,
            fontSize: FONT.micro,
            color: INK,
            opacity: leftLabelIn,
            transform: `translateY(${(1 - leftLabelIn) * 16}px)`,
          }}
        >
          Montage et assemblage
        </div>

        {/* Colonne droite — After Effects */}
        <div
          style={{
            position: "absolute",
            left: CX + 340,
            bottom: 1080 - GROUND_Y,
            width: COL_W,
            height: Math.max(0, rightH),
            borderRadius: "10px 10px 0 0",
            background: "linear-gradient(180deg, #14213d 0%, #0a1120 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -70,
              left: "50%",
              transform: `translateX(-50%) scale(${Math.max(0, rightLogoPop)})`,
            }}
          >
            <IconAfterEffects size={90} color={ACCENT} />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: CX + 340,
            width: COL_W,
            top: GROUND_Y + 24,
            textAlign: "center",
            fontFamily,
            fontWeight: 500,
            fontSize: FONT.micro,
            color: INK,
            opacity: rightLabelIn,
            transform: `translateY(${(1 - rightLabelIn) * 16}px)`,
          }}
        >
          Effets, motion, habillage
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
