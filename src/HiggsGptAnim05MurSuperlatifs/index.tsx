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
import { Stage } from "../higgsGpt/Stage";
import { StampBadge } from "../higgsGpt/StampBadge";
import { shake } from "../higgsGpt/shake";
import { STRIKE_RED, INK, FONT, HYPE_GRADS, mulberry32 } from "../higgsGpt/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["800"],
  subsets: ["latin"],
});

// Anim 5 — « Le mur des superlatifs » (225 frames / 7,5 s @ 30 fps)
// A empilement accéléré 0–90 · B impact du tampon 90–105 · C hold 105–195
// D sortie 195–225
// Satire du marketing IA. Les bandeaux sont VOLONTAIREMENT hors charte
// (dégradés « putaclic »). Le tampon « BARATIN » ramène le ton.

export const higgsGptAnim05Schema = z.object({
  banners: z
    .array(z.string())
    .default([
      "LE MODÈLE LE PLUS PUISSANT JAMAIS CRÉÉ",
      "UNE RÉVOLUTION SANS PRÉCÉDENT",
      "DES CAPACITÉS INÉGALÉES",
      "LE PLUS AVANCÉ DE L'HISTOIRE",
      "UNE PERFORMANCE HISTORIQUE",
      "JAMAIS VU AUPARAVANT",
      "UN BOND TECHNOLOGIQUE MAJEUR",
    ]),
  stampText: z.string().default("Baratin"),
});
export type HiggsGptAnim05Props = z.infer<typeof higgsGptAnim05Schema>;

const STARTS = [0, 15, 27, 36, 44, 50, 55];
const BANNER_W = 1180;
const BANNER_H = 128;
const STAMP_START = 90;
const IMPACT_F = STAMP_START + 6;

export const HiggsGptAnim05MurSuperlatifs: React.FC<HiggsGptAnim05Props> = ({
  banners,
  stampText,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rng = mulberry32(0x5a17);

  const rows = banners.slice(0, 7).map((text, i) => ({
    text,
    start: STARTS[i] ?? 55 + i * 3,
    rot: (rng() * 2 - 1) * 4,
    grad: HYPE_GRADS[i % HYPE_GRADS.length],
    xJit: (rng() * 2 - 1) * 26,
  }));

  const particles = new Array(10).fill(0).map(() => ({
    ang: rng() * Math.PI * 2,
    dist: 120 + rng() * 220,
    r: 6 + rng() * 12,
  }));

  // C — assombrissement de l'arrière-plan derrière le tampon
  const dim = interpolate(frame, [IMPACT_F, IMPACT_F + 16], [0, 0.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // impact caméra
  const camX = shake(frame, IMPACT_F, 10, 8, 2.1);
  const camY = shake(frame, IMPACT_F, 7, 8, 2.7);

  // D — sortie
  const outT = interpolate(frame, [195, 225], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const compOpacity = 1 - outT;
  const compScale = 1 + outT * 0.05;

  const stackTop = 540 - (rows.length * (BANNER_H - 22)) / 2;

  return (
    <Stage outFrames={2}>
      <AbsoluteFill
        style={{
          opacity: compOpacity,
          transform: `translate(${camX}px, ${camY}px) scale(${compScale})`,
        }}
      >
        {/* Pile de bandeaux */}
        {rows.map((r, i) => {
          const drop = spring({
            frame: frame - r.start,
            fps,
            config: { damping: 10, stiffness: 170, mass: 0.8 },
          });
          const y = interpolate(drop, [0, 1], [-260, 0], {
            extrapolateRight: "clamp",
          });
          const op = interpolate(frame - r.start, [0, 4], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 960 - BANNER_W / 2 + r.xJit,
                top: stackTop + i * (BANNER_H - 22) + y,
                width: BANNER_W,
                height: BANNER_H,
                borderRadius: 14,
                background: r.grad,
                boxShadow: "0 16px 46px rgba(0,0,0,0.4)",
                transform: `rotate(${r.rot}deg)`,
                opacity: op,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: i,
                filter: `brightness(${1 - dim * 1.4})`,
              }}
            >
              <span
                style={{
                  fontFamily,
                  fontWeight: 800,
                  fontSize: FONT.micro,
                  letterSpacing: "1px",
                  color: INK,
                  textShadow: "0 2px 8px rgba(0,0,0,0.35)",
                  padding: "0 32px",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                {r.text}
              </span>
            </div>
          );
        })}

        {/* Particules d'impact */}
        {frame >= IMPACT_F &&
          frame < IMPACT_F + 16 &&
          particles.map((p, i) => {
            const t = (frame - IMPACT_F) / 15;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 960 + Math.cos(p.ang) * p.dist * t - p.r / 2,
                  top: 540 + Math.sin(p.ang) * p.dist * t - p.r / 2,
                  width: p.r,
                  height: p.r,
                  borderRadius: "50%",
                  background: STRIKE_RED,
                  opacity: 1 - t,
                }}
              />
            );
          })}
      </AbsoluteFill>

      {/* Assombrissement plein cadre qui fait ressortir le tampon */}
      <AbsoluteFill style={{ background: "#05060a", opacity: dim }} />

      {/* Tampon « BARATIN » (par-dessus l'assombrissement) */}
      <StampBadge
        text={stampText}
        startFrame={STAMP_START}
        color={STRIKE_RED}
        restRotation={-12}
        fontSize={210}
        dry
      />
    </Stage>
  );
};
