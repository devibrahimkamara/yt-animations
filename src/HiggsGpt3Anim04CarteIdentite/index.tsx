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
import { Stage } from "../higgsGpt3/Stage";
import { IconBuilding } from "../higgsGpt3/icons";
import { ACCENT_LIGHT, INK, FONT, atmosPanelBorder } from "../higgsGpt3/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["500", "600", "700"],
  subsets: ["latin"],
});

// Anim 4 — « Carte d'identité en couches » (180 frames / 6 s @ 30 fps)
// A cascade décalée (piles inclinées) 0–42 · B alignement en colonne propre 42–60
// C hold avec parallax organique 60–144 · D sortie groupée 144–180

export const higgsGpt3Anim04Schema = z.object({
  name: z.string().default("Ibrahim Camara"),
  activity: z.string().default("Business en ligne depuis 2020"),
  company: z.string().default("Nova Media Lab"),
});
export type HiggsGpt3Anim04Props = z.infer<typeof higgsGpt3Anim04Schema>;

const CARD_W = 640;
const CARD_H = 84;
const ORIGIN_X = 1920 - 120 - CARD_W;
const ORIGIN_Y = 660;
const ALIGN_GAP = 92;

const CARDS = [
  { key: "name", delay: 0, rotInit: -2, offInit: { x: 0, y: 0 }, weight: 800, size: 0.62 },
  { key: "activity", delay: 14, rotInit: 1.5, offInit: { x: 8, y: 38 }, weight: 500, size: 0.5 },
  { key: "company", delay: 28, rotInit: -1, offInit: { x: 16, y: 74 }, weight: 500, size: 0.5 },
] as const;

export const HiggsGpt3Anim04CarteIdentite: React.FC<HiggsGpt3Anim04Props> = ({
  name,
  activity,
  company,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const text: Record<string, string> = { name, activity, company };

  const alignSpring = spring({
    frame: frame - 42,
    fps,
    config: { damping: 16, stiffness: 180 },
  });
  const alignT = interpolate(alignSpring, [0, 1], [0, 1]);

  const flashOpacity = interpolate(
    frame,
    [46, 52, 58],
    [0, 0.4, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const exitSpring = interpolate(frame, [144, 174], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  return (
    <Stage outFrames={12}>
      <AbsoluteFill style={{ fontFamily }}>
        {CARDS.map((c, i) => {
          const entrySpring = spring({
            frame: frame - c.delay,
            fps,
            config: { damping: 14, stiffness: 160 },
          });
          const entryX = interpolate(entrySpring, [0, 1], [120, 0]);
          const entryOpacity = interpolate(entrySpring, [0, 0.4], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const offX = interpolate(alignT, [0, 1], [c.offInit.x, 0]);
          const offY = interpolate(alignT, [0, 1], [c.offInit.y, i * ALIGN_GAP]);
          const rot = interpolate(alignT, [0, 1], [c.rotInit, 0]);

          const parallax =
            Math.sin((frame - i * 8) / fps * 0.5 * Math.PI * 2) * 3;

          const exitX = exitSpring * 150;
          const exitOpacity = 1 - exitSpring;

          return (
            <div
              key={c.key}
              style={{
                position: "absolute",
                left: ORIGIN_X,
                top: ORIGIN_Y,
                width: CARD_W,
                minHeight: CARD_H,
                borderRadius: 14,
                background: "rgba(15,15,15,0.55)",
                backdropFilter: "blur(8px)",
                border: `1px solid ${atmosPanelBorder(0.25)}`,
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                boxSizing: "border-box",
                padding: "18px 26px",
                display: "flex",
                alignItems: "center",
                gap: 18,
                opacity: entryOpacity * exitOpacity,
                transform: `translate(${entryX + offX + exitX}px, ${offY + parallax}px) rotate(${rot}deg)`,
              }}
            >
              {c.key === "name" && (
                <div style={{ width: 6, height: FONT.micro * 0.7, background: ACCENT_LIGHT, borderRadius: 3 }} />
              )}
              {c.key === "company" && (
                <IconBuilding size={48} color={ACCENT_LIGHT} strokeWidth={4} />
              )}
              <span
                style={{
                  fontSize: FONT.micro * c.size,
                  fontWeight: c.weight,
                  color: INK,
                }}
              >
                {text[c.key]}
              </span>

              {i === 0 && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 14,
                    background:
                      "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)",
                    opacity: flashOpacity,
                    pointerEvents: "none",
                  }}
                />
              )}
            </div>
          );
        })}
      </AbsoluteFill>
    </Stage>
  );
};
