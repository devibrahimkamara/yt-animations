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
import { TOOLBAR_BG, INK, ICON, PDFE_RED } from "../pdfelement/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

const BAR_W = 1360;
const BAR_H = 220;
const BAR_LEFT = (1920 - BAR_W) / 2;
const BAR_TOP = 430;
const SLOTS = 7;

// Icônes « décor » (grises, statiques) qui crédibilisent la barre.
const DECOR = ["🔍", "📄", "🖊️", "📎"];

export const pdfelementAnim07Schema = z.object({
  tools: z
    .array(
      z.object({
        start: z.number(),
        emoji: z.string(),
        label: z.string(),
        extraScale: z.number(),
        damping: z.number(),
        rotate: z.boolean(),
      }),
    )
    .default([
      { start: 12, emoji: "✏️", label: "Éditer le texte", extraScale: 1.25, damping: 8, rotate: false },
      { start: 51, emoji: "📐", label: "Modifier la mise en page", extraScale: 1.3, damping: 6, rotate: false },
      { start: 90, emoji: "🔄", label: "Convertir", extraScale: 1.25, damping: 8, rotate: true },
    ]),
});

export type PdfelementAnim07Props = z.infer<typeof pdfelementAnim07Schema>;

export const PdfelementAnim07BarreOutilsAllumage: React.FC<PdfelementAnim07Props> = ({
  tools,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const barIn = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const slotX = (i: number) => (BAR_W / SLOTS) * (i + 0.5);
  const litSlots = [1, 3, 5];

  return (
    <Stage outFrames={12}>
      <AbsoluteFill style={{ fontFamily }}>
        <div
          style={{
            position: "absolute",
            left: BAR_LEFT,
            top: BAR_TOP,
            width: BAR_W,
            height: BAR_H,
            borderRadius: 24,
            background: TOOLBAR_BG,
            border: "1px solid rgba(255,255,255,0.06)",
            opacity: barIn,
          }}
        >
          {/* icônes décor */}
          {[0, 2, 4, 6].map((slot, k) => (
            <div
              key={slot}
              style={{
                position: "absolute",
                left: slotX(slot),
                top: BAR_H / 2,
                transform: "translate(-50%, -50%)",
                filter: "grayscale(100%)",
                opacity: 0.4,
              }}
            >
              <Emoji size={ICON.sm}>{DECOR[k]}</Emoji>
            </div>
          ))}

          {/* icônes ciblées */}
          {tools.slice(0, 3).map((t, i) => {
            const slot = litSlots[i];
            const w = frame - t.start;
            const colorT = interpolate(w, [0, 15], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const bounce = spring({
              frame: frame - (t.start + 10),
              fps,
              config: { damping: t.damping, stiffness: 150 },
            });
            const scale = 1 + interpolate(bounce, [0, 0.5, 1], [0, t.extraScale - 1, 0]);
            const rot = t.rotate ? interpolate(bounce, [0, 1], [-15, 0], { extrapolateRight: "clamp" }) : 0;
            const labelT = interpolate(w, [18, 39], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div key={t.label}>
                <div
                  style={{
                    position: "absolute",
                    left: slotX(slot),
                    top: BAR_H / 2,
                    transform: `translate(-50%, -50%) scale(${scale}) rotate(${rot}deg)`,
                    filter: `grayscale(${(1 - colorT) * 100}%)`,
                    opacity: 0.5 + 0.5 * colorT,
                  }}
                >
                  <Emoji size={ICON.sm}>{t.emoji}</Emoji>
                  {colorT > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        left: "50%",
                        bottom: -14,
                        width: ICON.sm * 0.7,
                        height: 5,
                        transform: "translateX(-50%)",
                        borderRadius: 3,
                        background: PDFE_RED,
                        opacity: colorT,
                      }}
                    />
                  )}
                </div>
                {/* label sous l'icône (hors barre) */}
                <div
                  style={{
                    position: "absolute",
                    left: slotX(slot),
                    top: BAR_H + 40,
                    width: 360,
                    transform: `translateX(-50%) translateY(${interpolate(labelT, [0, 1], [10, 0])}px)`,
                    textAlign: "center",
                    opacity: labelT,
                    fontWeight: 800,
                    fontSize: 40,
                    lineHeight: 1.15,
                    color: INK,
                  }}
                >
                  {t.label}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
