import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsAdobe/Stage";
import {
  AI_TO,
  ACCENT,
  INK,
  FONT,
  RAIL_GREY,
  ATMOS_PANEL_BG,
  atmosPanelBorder,
} from "../higgsAdobe/theme";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });

export const higgsAdobeAnim06Schema = z.object({
  leftHeader: z.string().default("MONTEUR VIDÉO"),
  rightHeader: z.string().default("IA"),
  tasks: z
    .array(z.string())
    .default(["Sous-titres", "Découpe des silences", "Étalonnage", "Transitions", "Sound design"]),
});
export type HiggsAdobeAnim06Props = z.infer<typeof higgsAdobeAnim06Schema>;

const LEFT_X = 470;
const RIGHT_X = 1380;
const FIRST_Y = 300;
const ROW_GAP = 140;
const CARD_W = 600;
const CARD_H = 118;
const TASK_FONT = 46;

const APPEAR_STAGGER = 18;
const MIG_START0 = 96;
const MIG_STAGGER = 24;
const MIG_DUR = 30;

export const HiggsAdobeAnim06AvantMaintenant: React.FC<HiggsAdobeAnim06Props> = ({
  leftHeader,
  rightHeader,
  tasks,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 — séparateur
  const sepScale = interpolate(frame, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const headerT = (delay: number) =>
    interpolate(frame, [20 + delay, 34 + delay], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const outT = interpolate(frame, [255, 285], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  return (
    <Stage>
      <AbsoluteFill style={{ opacity: 1 - outT }}>
        {/* Séparateur central */}
        <div
          style={{
            position: "absolute",
            left: 958,
            top: 90,
            width: 3,
            height: 900,
            background: RAIL_GREY,
            boxShadow: `0 0 16px ${AI_TO}66`,
            transform: `scaleY(${sepScale})`,
            transformOrigin: "center",
          }}
        />

        {/* Headers */}
        <div
          style={{
            position: "absolute",
            left: LEFT_X,
            top: 130,
            transform: `translate(-50%, ${interpolate(headerT(0), [0, 1], [10, 0])}px)`,
            opacity: headerT(0),
            fontFamily,
            fontWeight: 800,
            fontSize: FONT.label,
            color: INK,
            letterSpacing: "1px",
          }}
        >
          {leftHeader}
        </div>
        <div
          style={{
            position: "absolute",
            left: RIGHT_X,
            top: 130,
            transform: `translate(-50%, ${interpolate(headerT(6), [0, 1], [10, 0])}px)`,
            opacity: headerT(6),
            fontFamily,
            fontWeight: 800,
            fontSize: FONT.label,
            background: `linear-gradient(90deg, ${ACCENT}, ${AI_TO})`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            letterSpacing: "1px",
          }}
        >
          {rightHeader}
        </div>

        {/* Tâches */}
        {tasks.map((task, i) => {
          const y = FIRST_Y + i * ROW_GAP;
          const appearT = interpolate(
            frame,
            [24 + i * APPEAR_STAGGER, 24 + i * APPEAR_STAGGER + 16],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) },
          );

          const migStart = MIG_START0 + i * MIG_STAGGER;
          const s = spring({
            frame: frame - migStart,
            fps,
            config: { damping: 14, stiffness: 120, mass: 0.8 },
          });
          const p = Math.min(1, Math.max(0, s));
          const started = frame >= migStart;

          const x = interpolate(s, [0, 1], [LEFT_X, RIGHT_X], { extrapolateRight: "clamp" });
          const arcY = -20 * Math.sin(p * Math.PI);
          const textColor = interpolateColors(p, [0, 1], ["#9CA3AF", INK]);
          const borderColor = interpolateColors(p, [0, 1], [atmosPanelBorder(0.25), AI_TO]);

          // coche à l'arrivée
          const checkStart = migStart + MIG_DUR;
          const checkS = spring({
            frame: frame - checkStart,
            fps,
            config: { damping: 10, stiffness: 300 },
          });
          const checkScale = interpolate(checkS, [0, 0.6, 1], [0, 1.2, 1], {
            extrapolateRight: "clamp",
          });
          const checkGlow = interpolate(frame, [checkStart, checkStart + 5, checkStart + 12], [0, 0.6, 0.2], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div key={task}>
              {/* carte (migrante) */}
              <div
                style={{
                  position: "absolute",
                  left: x,
                  top: y + arcY,
                  transform: "translate(-50%, -50%)",
                  width: CARD_W,
                  height: CARD_H,
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 32,
                  borderRadius: 14,
                  background: started ? ATMOS_PANEL_BG : "transparent",
                  border: `2px solid ${started ? borderColor : atmosPanelBorder(0.25)}`,
                  boxShadow: started ? "0 20px 50px rgba(0,0,0,0.45)" : "none",
                  opacity: appearT,
                  fontFamily,
                  fontWeight: 700,
                  fontSize: TASK_FONT,
                  color: textColor,
                  whiteSpace: "nowrap",
                }}
              >
                {task}
              </div>

              {/* coche de validation */}
              {frame >= checkStart && (
                <div
                  style={{
                    position: "absolute",
                    left: RIGHT_X + CARD_W / 2 + 6,
                    top: y,
                    transform: `translate(-50%, -50%) scale(${checkScale})`,
                    width: 68,
                    height: 68,
                    borderRadius: "50%",
                    background: AI_TO,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 0 40px ${AI_TO}${Math.round(checkGlow * 255).toString(16).padStart(2, "0")}`,
                  }}
                >
                  <svg width={36} height={36} viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 12.5 L10 18 L20 6"
                      stroke="#0b1230"
                      strokeWidth={3.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </AbsoluteFill>
    </Stage>
  );
};
