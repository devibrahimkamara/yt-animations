import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../aisa/Stage";
import { ACCENT, EASE, INK, MONEY_GREEN, mulberry32 } from "../aisa/theme";
import { nbsp } from "../aisa/utils";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});

// Anim 1 — « Rapport de visibilité IA » : la feuille se remplit, se retourne et
// révèle un compteur de revenus (150 frames / 5 s @ 30 fps).

export const aisaAnim01Schema = z.object({
  montant: z.number().default(12500),
  titre: z.string().default("Rapport de visibilité IA"),
  badge: z.string().default("ChatGPT · Claude · Perplexity · Gemini"),
  label: z.string().default("REVENUS GÉNÉRÉS"),
});
export type AisaAnim01Props = z.infer<typeof aisaAnim01Schema>;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const SHEET_W = 660;
const SHEET_H = 880;
const LINE_W = [0.92, 0.78, 0.85, 0.6, 0.88, 0.45];
const BAR_H = [0.3, 0.5, 0.72, 1];
const PARTICLE_COUNT = 10;

export const AisaAnim01RapportFlip3D: React.FC<AisaAnim01Props> = ({
  montant,
  titre,
  badge,
  label,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 12], [0, 1], clamp);

  // Entrée de la feuille (8–35) : spring à rebond léger
  const enter = spring({
    frame: frame - 8,
    fps,
    config: { damping: 14, stiffness: 90, mass: 0.9 },
  });
  const enterY = interpolate(enter, [0, 1], [300, 0]);
  const enterRot = interpolate(enter, [0, 1], [-4, 0]);
  const enterOpacity = interpolate(frame, [8, 16], [0, 1], clamp);

  // Respiration (80–82 → petit pic) puis retour pendant le flip
  const breathe = interpolate(frame, [78, 82, 86], [1, 1.03, 1], clamp);

  // Flip (82–112)
  const flipP = interpolate(frame, [82, 112], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const rotateY = flipP * 180;
  const flipLift = interpolate(flipP, [0, 0.5, 1], [0, -30, 0]);
  const shadowStretch = Math.sin(flipP * Math.PI); // 0 → 1 → 0
  const shadowY = 40 + shadowStretch * 30;
  const shadowBlur = 80 + shadowStretch * 60;

  const shadowScaleX = Math.max(0.12, Math.abs(Math.cos(flipP * Math.PI)));

  // Lignes de texte (30–70) : 6 lignes décalées de 6 frames
  const lineProgress = (i: number) =>
    interpolate(frame, [30 + i * 6, 30 + i * 6 + 14], [0, 1], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    });

  // Titre (40–62)
  const titleP = interpolate(frame, [40, 62], [0, 1], { ...clamp, easing: EASE });
  const badgeSpring = spring({ frame: frame - 58, fps, config: { damping: 14, stiffness: 120 } });

  // Barres (62–80) décalées de 4 frames
  const barP = (i: number) =>
    interpolate(frame, [62 + i * 4, 62 + i * 4 + 12], [0, 1], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    });

  // Compteur (108–138)
  const count =
    frame >= 138
      ? montant
      : Math.round(
          interpolate(frame, [108, 138], [0, montant], { ...clamp, easing: Easing.out(Easing.exp) }),
        );
  const labelOpacity = interpolate(frame, [108, 120], [0, 0.85], clamp);

  // Glow vert qui pulse une fois (138–150)
  const glow = interpolate(frame, [138, 144, 150], [0, 1, 0.45], clamp);
  const glowSoft = interpolate(frame, [100, 125], [0, 0.35], clamp);

  // Symboles « + » / « € » (déterministes)
  const rnd = mulberry32(2026);
  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const left = i % 2 === 0;
    const x = left ? 140 + rnd() * 420 : 1360 + rnd() * 400;
    const y = 520 + rnd() * 380;
    return {
      x,
      y,
      size: 64 + rnd() * 40,
      start: 108 + Math.floor(rnd() * 16),
      rise: 220 + rnd() * 140,
      char: i % 3 === 0 ? "€" : "+",
    };
  });

  const face: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: 24,
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    overflow: "hidden",
  };

  return (
    <Stage outFrames={0}>
      <div style={{ position: "absolute", inset: 0, opacity: bgOpacity, fontFamily }}>
        {/* Glow vert derrière la feuille */}
        <div
          style={{
            position: "absolute",
            left: 960 - 700,
            top: 540 - 700,
            width: 1400,
            height: 1400,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${MONEY_GREEN} 0%, transparent 62%)`,
            opacity: Math.max(glowSoft, 0) * 0.7 + glow * 0.6,
          }}
        />

        {/* Symboles qui montent */}
        {particles.map((p, i) => {
          const t = interpolate(frame, [p.start, p.start + 30], [0, 1], {
            ...clamp,
            easing: Easing.out(Easing.quad),
          });
          const op =
            interpolate(frame, [p.start, p.start + 6], [0, 1], clamp) *
            interpolate(frame, [p.start + 14, p.start + 32], [1, 0], clamp);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: p.x,
                top: p.y - p.rise * t,
                fontSize: p.size,
                fontWeight: 800,
                color: i % 3 === 0 ? INK : MONEY_GREEN,
                opacity: op,
                textShadow: `0 0 24px ${MONEY_GREEN}`,
              }}
            >
              {p.char}
            </div>
          );
        })}

        {/* Feuille */}
        <div
          style={{
            position: "absolute",
            left: (1920 - SHEET_W) / 2,
            top: (1080 - SHEET_H) / 2,
            width: SHEET_W,
            height: SHEET_H,
            perspective: 1800,
            opacity: enterOpacity,
            transform: `translateY(${enterY}px) rotate(${enterRot}deg)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 24,
              transform: `scale(${breathe}) scaleX(${shadowScaleX})`,
              boxShadow: `0 ${shadowY}px ${shadowBlur}px rgba(0,0,0,0.45)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              transformStyle: "preserve-3d",
              transform: `translateY(${flipLift}px) scale(${breathe}) rotateY(${rotateY}deg)`,
            }}
          >
            {/* Face avant */}
            <div style={{ ...face, background: "#FFFFFF" }}>
              <div style={{ height: 16, background: ACCENT }} />
              <div style={{ padding: "44px 48px 0" }}>
                <div
                  style={{
                    fontSize: 62,
                    fontWeight: 800,
                    color: "#0B1020",
                    lineHeight: 1.08,
                    opacity: titleP,
                    transform: `translateY(${(1 - titleP) * 14}px)`,
                  }}
                >
                  {titre}
                </div>
                <div
                  style={{
                    marginTop: 22,
                    display: "inline-block",
                    background: ACCENT,
                    color: INK,
                    fontSize: 30,
                    fontWeight: 700,
                    lineHeight: 1.25,
                    padding: "12px 26px",
                    borderRadius: 30,
                    transform: `scale(${interpolate(badgeSpring, [0, 1], [0.8, 1])})`,
                    transformOrigin: "left center",
                    opacity: Math.min(1, badgeSpring * 2),
                    textWrap: "balance",
                    maxWidth: "100%",
                  }}
                >
                  {badge}
                </div>
                <div style={{ marginTop: 44, display: "flex", flexDirection: "column", gap: 28 }}>
                  {LINE_W.map((w, i) => (
                    <div
                      key={i}
                      style={{
                        height: 20,
                        borderRadius: 10,
                        background: "#D5DAE5",
                        width: `${w * lineProgress(i) * 100}%`,
                      }}
                    />
                  ))}
                </div>
              </div>
              {/* Mini graphique */}
              <div
                style={{
                  position: "absolute",
                  right: 48,
                  top: SHEET_H - 48 - 190,
                  height: 190,
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 16,
                }}
              >
                {BAR_H.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: 38,
                      height: 190 * h,
                      borderRadius: 8,
                      background: MONEY_GREEN,
                      transformOrigin: "bottom",
                      transform: `scaleY(${barP(i)})`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Face arrière */}
            <div
              style={{
                ...face,
                background: `linear-gradient(160deg, #16A34A, ${MONEY_GREEN})`,
                transform: "rotateY(180deg)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 26,
              }}
            >
              <div
                style={{
                  fontSize: 44,
                  fontWeight: 700,
                  letterSpacing: 8,
                  color: INK,
                  opacity: labelOpacity,
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontSize: 124,
                  fontWeight: 800,
                  color: INK,
                  whiteSpace: "nowrap",
                  fontVariantNumeric: "tabular-nums",
                  textShadow: "0 6px 30px rgba(0,0,0,0.18)",
                }}
              >
                {nbsp(count)} €
              </div>
            </div>
          </div>
        </div>
      </div>
    </Stage>
  );
};
