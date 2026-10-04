import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../pdfelement/Stage";
import { Emoji } from "../higgs2/Emoji";
import { ACCENT, INK, NEUTRAL_BORDER, ICON } from "../pdfelement/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

const CARD_W = 520;
const CARD_H = 330;
const GUTTER = 60;
const LABEL_FONT = 52;
const GRID_W = CARD_W * 2 + GUTTER;
const GRID_H = CARD_H * 2 + GUTTER;
const GRID_LEFT = (1920 - GRID_W) / 2;
const GRID_TOP = (1080 - GRID_H) / 2;
const PERIM = 2 * (CARD_W + CARD_H);

export const pdfelementAnim05Schema = z.object({
  profiles: z
    .array(z.object({ name: z.string(), emoji: z.string() }))
    .default([
      { name: "Freelance", emoji: "💼" },
      { name: "Entrepreneur", emoji: "🚀" },
      { name: "Étudiant", emoji: "🎓" },
      { name: "Salarié", emoji: "🏢" },
    ]),
});

export type PdfelementAnim05Props = z.infer<typeof pdfelementAnim05Schema>;

// col, row, delta de départ (hors champ, depuis le coin), rotation d'entrée
const SLOTS = [
  { col: 0, row: 0, dx: -640, dy: -520, rot: -8 },
  { col: 1, row: 0, dx: 640, dy: -520, rot: 8 },
  { col: 0, row: 1, dx: -640, dy: 520, rot: -8 },
  { col: 1, row: 1, dx: 640, dy: 520, rot: 8 },
];

export const PdfelementAnim05QuatreProfilsGrid: React.FC<PdfelementAnim05Props> = ({
  profiles,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── E : settle collectif de la grille
  const settleScale = interpolate(frame, [54, 60, 66], [1, 1.02, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage outFrames={14}>
      <AbsoluteFill style={{ fontFamily }}>
        <div
          style={{
            position: "absolute",
            left: GRID_LEFT,
            top: GRID_TOP,
            width: GRID_W,
            height: GRID_H,
            transform: `scale(${settleScale})`,
            transformOrigin: "center center",
          }}
        >
          {profiles.slice(0, 4).map((p, i) => {
            const slot = SLOTS[i];
            const s = spring({
              frame: frame - i * 12,
              fps,
              config: { damping: 12, stiffness: 100 },
            });
            const x = slot.col * (CARD_W + GUTTER) + interpolate(s, [0, 1], [slot.dx, 0]);
            const y = slot.row * (CARD_H + GUTTER) + interpolate(s, [0, 1], [slot.dy, 0]);
            const rot = interpolate(s, [0, 1], [slot.rot, 0]);

            // ── G : balayage lumineux du contour
            const sweepStart = 156 + i * 11;
            const sweepT = interpolate(frame, [sweepStart, sweepStart + 16], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={p.name}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  width: CARD_W,
                  height: CARD_H,
                  transform: `rotate(${rot}deg)`,
                  borderRadius: 20,
                  background: "#1E2129",
                  border: `1px solid ${NEUTRAL_BORDER}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 28,
                  opacity: s,
                }}
              >
                <Emoji size={ICON.md}>{p.emoji}</Emoji>
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: LABEL_FONT,
                    color: INK,
                    textAlign: "center",
                    padding: "0 20px",
                  }}
                >
                  {p.name}
                </span>

                {/* contour lumineux (SVG) */}
                {sweepT > 0 && (
                  <svg
                    width={CARD_W}
                    height={CARD_H}
                    style={{ position: "absolute", inset: 0, filter: `drop-shadow(0 0 12px ${ACCENT})` }}
                  >
                    <rect
                      x={2}
                      y={2}
                      width={CARD_W - 4}
                      height={CARD_H - 4}
                      rx={18}
                      fill="none"
                      stroke={ACCENT}
                      strokeWidth={4}
                      strokeDasharray={PERIM}
                      strokeDashoffset={PERIM * (1 - sweepT)}
                    />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
