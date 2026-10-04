import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../pdfelement/Stage";
import { Emoji } from "../higgs2/Emoji";
import {
  PAPER,
  PAPER_LINE,
  PAPER_HEADER,
  PAPER_SHADOW,
  ACCENT,
  FONT,
  ICON,
} from "../pdfelement/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

const DOC_W = 360;
const DOC_H = 500;

export const pdfelementAnim06Schema = z.object({
  contracts: z
    .array(z.object({ title: z.string(), emoji: z.string() }))
    .default([
      { title: "Contrat de service", emoji: "🤝" },
      { title: "Contrat de travail", emoji: "💼" },
      { title: "Contrat fournisseur", emoji: "🚚" },
    ]),
});

export type PdfelementAnim06Props = z.infer<typeof pdfelementAnim06Schema>;

type Slot = "left" | "center" | "right";

const slotOf = (doc: number, phase: number): Slot => {
  if (doc === phase % 3) return "center";
  if (doc === (phase + 1) % 3) return "right";
  return "left";
};

const slotTransform = (slot: Slot) => {
  if (slot === "center") return { ry: 0, sc: 1, tz: 0, op: 1, blur: 0, x: 0 };
  const dir = slot === "right" ? 1 : -1;
  return { ry: -35 * dir, sc: 0.75, tz: -200, op: 0.4, blur: 3, x: 360 * dir };
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const docLines = Array.from({ length: 12 }, (_, i) => 0.62 + ((i * 41) % 30) / 100);

export const PdfelementAnim06CarrouselContratsPerspective: React.FC<PdfelementAnim06Props> = ({
  contracts,
}) => {
  const frame = useCurrentFrame();

  // ── A : entrée de la scène
  const introT = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── Phase continue 0 → 2 (deux rotations)
  const t1 = interpolate(frame, [48, 63], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const t2 = interpolate(frame, [96, 111], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const phase = t1 + t2;
  const p0 = Math.floor(phase);
  const p1 = Math.min(2, p0 + 1);
  const frac = phase - p0;

  // ── Titre du document central
  const idx = Math.round(phase);
  const dist = Math.abs(phase - idx);
  const titleOpacity = interpolate(dist, [0, 0.5], [1, 0], { extrapolateRight: "clamp" });
  const titleY = interpolate(dist, [0, 0.5], [0, 24], { extrapolateRight: "clamp" });
  const current = contracts[idx] ?? contracts[0];

  return (
    <Stage outFrames={18}>
      <AbsoluteFill style={{ fontFamily, alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            perspective: 1200,
            width: 1400,
            height: 560,
            position: "relative",
            opacity: introT,
            transform: `scale(${interpolate(introT, [0, 1], [0.94, 1])})`,
          }}
        >
          {contracts.map((c, d) => {
            const a = slotTransform(slotOf(d, p0));
            const b = slotTransform(slotOf(d, p1));
            const ry = lerp(a.ry, b.ry, frac);
            const sc = lerp(a.sc, b.sc, frac);
            const tz = lerp(a.tz, b.tz, frac);
            const op = lerp(a.op, b.op, frac);
            const blur = lerp(a.blur, b.blur, frac);
            const x = lerp(a.x, b.x, frac);
            return (
              <div
                key={c.title}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: DOC_W,
                  height: DOC_H,
                  marginLeft: -DOC_W / 2,
                  marginTop: -DOC_H / 2,
                  transformStyle: "preserve-3d",
                  transform: `translateX(${x}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${sc})`,
                  opacity: op,
                  filter: `blur(${blur}px)`,
                  borderRadius: 8,
                  background: PAPER,
                  boxShadow: PAPER_SHADOW,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "22px 24px",
                    background: PAPER_HEADER,
                  }}
                >
                  <span style={{ fontSize: 34, lineHeight: 1 }}>{c.emoji}</span>
                  <span style={{ fontWeight: 800, fontSize: 26, color: "#3A3A3C" }}>{c.title}</span>
                </div>
                <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
                  {docLines.map((w, i) => (
                    <div
                      key={i}
                      style={{ height: 9, width: `${w * 100}%`, borderRadius: 2, background: PAPER_LINE }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Titre courant sous le document central ── */}
        <div
          style={{
            position: "absolute",
            top: "76%",
            display: "flex",
            alignItems: "center",
            gap: 20,
            opacity: titleOpacity * introT,
            transform: `translateY(${titleY}px)`,
          }}
        >
          <Emoji size={ICON.sm}>{current.emoji}</Emoji>
          <span style={{ fontWeight: 800, fontSize: FONT.label, color: ACCENT }}>{current.title}</span>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
