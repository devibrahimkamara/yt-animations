import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsApi/Stage";
import { IconCheck } from "../higgsApi/icons";
import { CLAUDE_TERRACOTTA, MONEY_GREEN, INK, FONT, atmosPanelBorder } from "../higgsApi/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});

// Anim 6 — « Les deux emplacements à remplir » (255 frames / 8,5 s @ 30 fps)
// Phase 1 (0-45)    : carte + deux slots vides, stagger
// Phase 2 (45-120)  : slot 01 alterne ChatGPT/Claude, rythme qui ralentit
// Phase 3 (120-165) : verrouillage sur Claude (contour tracé, cadre plein, coche)
// Phase 4 (165-240) : maintien, slot 02 pulse en attente
// Phase 5 (240-255) : fondu de sortie (Stage)

export const higgsApiAnim06Schema = z.object({});
export type HiggsApiAnim06Props = z.infer<typeof higgsApiAnim06Schema>;

const CARD_W = 900;
const CARD_H = 380;
const CARD_X = (1920 - CARD_W) / 2;
const CARD_Y = (1080 - CARD_H) / 2;
const SLOT_W = 320;
const SLOT_H = 200;
const SLOT_GAP = 70;
const SLOTS_TOTAL_W = SLOT_W * 2 + SLOT_GAP;
const SLOT1_X = CARD_X + (CARD_W - SLOTS_TOTAL_W) / 2;
const SLOT2_X = SLOT1_X + SLOT_W + SLOT_GAP;

const SEQUENCE: { label: "ChatGPT" | "Claude"; start: number; end: number }[] = [
  { label: "ChatGPT", start: 45, end: 63 },
  { label: "Claude", start: 63, end: 81 },
  { label: "ChatGPT", start: 81, end: 96 },
  { label: "Claude", start: 96, end: 108 },
  { label: "ChatGPT", start: 108, end: 116 },
  { label: "Claude", start: 116, end: 120 },
];

function activeBadge(frame: number): "ChatGPT" | "Claude" {
  for (const seg of SEQUENCE) {
    if (frame >= seg.start && frame < seg.end) return seg.label;
  }
  return frame >= 120 ? "Claude" : "ChatGPT";
}

const DashedFrame: React.FC<{ w: number; h: number; color: string; opacity?: number }> = ({ w, h, color, opacity = 1 }) => (
  <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
    <rect
      x={2}
      y={2}
      width={w - 4}
      height={h - 4}
      rx={16}
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeDasharray="10 8"
      opacity={opacity}
    />
  </svg>
);

export const HiggsApiAnim06DeuxEmplacements: React.FC<HiggsApiAnim06Props> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({ frame, fps, config: { damping: 16, stiffness: 130 } });
  const cardY = interpolate(cardSpring, [0, 1], [20, 0]);
  const cardOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const slot1Opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const slot2Opacity = interpolate(frame, [8, 23], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const badge = activeBadge(frame);
  const isClaude = badge === "Claude";
  const badgeColor = isClaude ? CLAUDE_TERRACOTTA : "#FFFFFF";

  // crossfade / pulse à chaque frontière de segment
  const nearestBoundary = SEQUENCE.map((s) => s.start).find((b) => Math.abs(frame - b) <= 3);
  const tickPulse =
    nearestBoundary !== undefined
      ? interpolate(Math.abs(frame - nearestBoundary), [0, 3], [0.96, 1])
      : 1;
  const crossfade =
    nearestBoundary !== undefined
      ? interpolate(frame, [nearestBoundary - 3, nearestBoundary], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  const lockDrawProgress = interpolate(frame, [120, 135], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const solidCrossfade = interpolate(frame, [135, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const checkSpring = spring({ frame: frame - 150, fps, config: { damping: 10, stiffness: 200 } });
  const checkScale = frame >= 150 ? interpolate(checkSpring, [0, 1], [0, 1]) : 0;

  const slot1Per = 2 * (SLOT_W + SLOT_H);

  const slot2Cycle = ((frame % 45) / 45) * Math.PI * 2;
  const slot2PulseOpacity = frame >= 165 ? interpolate(Math.sin(slot2Cycle), [-1, 1], [0.4, 0.8]) : 0.5;
  const slot2PulseScale = frame >= 165 ? interpolate(Math.sin(slot2Cycle), [-1, 1], [1, 1.02]) : 1;

  return (
    <Stage outFrames={15}>
      <AbsoluteFill style={{ fontFamily }}>
        <div
          style={{
            position: "absolute",
            left: CARD_X,
            top: CARD_Y + cardY,
            width: CARD_W,
            height: CARD_H,
            borderRadius: 20,
            background: "rgba(10,14,30,0.85)",
            border: `1px solid ${atmosPanelBorder(0.3)}`,
            opacity: cardOpacity,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 40,
              top: 28,
              fontSize: FONT.micro * 0.35,
              fontWeight: 700,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: 2,
            }}
          >
            OUTILS NÉCESSAIRES
          </div>

          {/* Slot 01 */}
          <div style={{ position: "absolute", left: SLOT1_X - CARD_X, top: 120, width: SLOT_W, height: SLOT_H, opacity: slot1Opacity }}>
            <div style={{ position: "absolute", inset: 0, opacity: 1 - solidCrossfade }}>
              <DashedFrame w={SLOT_W} h={SLOT_H} color="#3A4756" />
            </div>
            <svg width={SLOT_W} height={SLOT_H} style={{ position: "absolute", inset: 0, opacity: solidCrossfade }}>
              <rect x={2} y={2} width={SLOT_W - 4} height={SLOT_H - 4} rx={16} fill="none" stroke={MONEY_GREEN} strokeWidth={3} />
            </svg>
            {/* Contour vert qui se trace (verrouillage) */}
            {frame >= 120 && frame < 150 && (
              <svg width={SLOT_W} height={SLOT_H} style={{ position: "absolute", inset: 0 }}>
                <rect
                  x={2}
                  y={2}
                  width={SLOT_W - 4}
                  height={SLOT_H - 4}
                  rx={16}
                  fill="none"
                  stroke={MONEY_GREEN}
                  strokeWidth={3}
                  style={{
                    strokeDasharray: slot1Per,
                    strokeDashoffset: slot1Per * (1 - lockDrawProgress),
                  }}
                />
              </svg>
            )}
            <div style={{ position: "absolute", left: 12, top: 8, fontSize: 20, fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>
              01
            </div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  position: "relative",
                  padding: "18px 36px",
                  borderRadius: 14,
                  background: "rgba(30,42,58,0.9)",
                  transform: `scale(${tickPulse})`,
                }}
              >
                <div style={{ fontSize: FONT.label * 0.4, fontWeight: 800, color: badgeColor, opacity: crossfade }}>
                  {badge}
                </div>
                {frame >= 150 && (
                  <div
                    style={{
                      position: "absolute",
                      top: -18,
                      right: -18,
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: MONEY_GREEN,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: `scale(${checkScale})`,
                    }}
                  >
                    <IconCheck size={22} color={INK} strokeWidth={4} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Slot 02 */}
          <div
            style={{
              position: "absolute",
              left: SLOT2_X - CARD_X,
              top: 120,
              width: SLOT_W,
              height: SLOT_H,
              opacity: slot2Opacity,
              transform: `scale(${slot2PulseScale})`,
            }}
          >
            <DashedFrame w={SLOT_W} h={SLOT_H} color="#3A4756" opacity={slot2PulseOpacity} />
            <div style={{ position: "absolute", left: 12, top: 8, fontSize: 20, fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>
              02
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
