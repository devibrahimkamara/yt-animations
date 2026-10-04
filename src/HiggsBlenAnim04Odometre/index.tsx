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
import { Stage } from "../higgsBlen/Stage";
import { OdometerDigit } from "../freebeat/OdometerDigit";
import { shake } from "../higgsBlen/shake";
import {
  INK,
  FONT,
  BLENDER_ORANGE,
  BLENDER_ORANGE_LIGHT,
  BLENDER_ORANGE_GLOW,
} from "../higgsBlen/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

// Anim 4 — « Odomètre de revenus » (285 frames)
// A Défilement 0–90 · B Verrouillage 90–120 · C Odomètre 120–180 · D Hold 180–285

export const higgsBlenAnim04Schema = z.object({
  offers: z
    .array(z.object({ poste: z.string(), studio: z.string(), tarif: z.string() }))
    .default([
      { poste: "Artiste 3D", studio: "Studio Nordic 3D", tarif: "3 800 €/mois" },
      { poste: "Motion Designer", studio: "Atelier Motion", tarif: "650 €/jour" },
      { poste: "Character Artist", studio: "PixelForge Games", tarif: "4 200 €/mois" },
      { poste: "Générateur d'assets 3D", studio: "Freelance Hub", tarif: "1 200 €/projet" },
      { poste: "Environment Artist", studio: "Northlight Studio", tarif: "3 500 €/mois" },
      { poste: "Lookdev / Shading", studio: "Atelier Rendu", tarif: "700 €/jour" },
      { poste: "Rigger 3D", studio: "Marionette FX", tarif: "3 900 €/mois" },
      { poste: "Hard Surface Artist", studio: "ForgeWorks", tarif: "4 100 €/mois" },
      { poste: "Archviz 3D", studio: "Studio Perspective", tarif: "2 800 €/mois" },
      { poste: "Prop Artist", studio: "Handmade Assets", tarif: "600 €/jour" },
    ]),
  heroSalary: z.string().default("3800"),
  heroUnit: z.string().default("€/mois"),
  heroPoste: z.string().default("Artiste 3D"),
  heroStudio: z.string().default("Studio Nordic 3D"),
});

export type HiggsBlenAnim04Props = z.infer<typeof higgsBlenAnim04Schema>;

const CARD_H = 164;
const GAP = 20;
const UNIT = CARD_H + GAP;
const CARD_W = 980;
const POSTE_FS = 48;
const STUDIO_FS = 32;
const DIGIT_H = 132;
const DIGIT_W = 82;

export const HiggsBlenAnim04Odometre: React.FC<HiggsBlenAnim04Props> = ({
  offers,
  heroSalary,
  heroUnit,
  heroPoste,
  heroStudio,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Distance défilée : 45 px/frame puis décélération 90 → 120
  const scrolled =
    45 * Math.min(frame, 90) +
    (frame > 90
      ? interpolate(frame, [90, 120], [0, 620], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        })
      : 0);

  const loopH = offers.length * UNIT;
  const colBlur = interpolate(frame, [90, 120], [2, 5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const colOpacity = interpolate(frame, [90, 120], [1, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Carte héros nette au centre
  const heroIn = spring({ frame: frame - 92, fps, config: { damping: 13, stiffness: 150 } });
  const heroScale = interpolate(heroIn, [0, 1], [1, 1.08]);
  const heroTremble = frame >= 120 && frame < 180 ? shake(frame, 120, 1.6, 60, 2.4) : 0;
  const borderPulse = 0.5 + Math.sin(frame / 12) * 0.5;

  // Odomètre : offset (en "chiffres") par colonne
  const digits = heroSalary.padStart(4, "0").split("").map(Number);
  const windows: [number, number][] = [
    [120, 135],
    [130, 150],
    [140, 165],
    [150, 180],
  ];
  const digitOffset = (j: number) => {
    const [s, e] = windows[j];
    // STRIP fait 60 lignes (0..9 ×6) → turns ENTIER, turns*10 + digit < 60
    const turns = 5 - j;
    return interpolate(frame, [s, e], [0, turns * 10 + digits[j]], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    });
  };
  const unitOpacity = interpolate(frame, [180, 190], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage outFrames={12}>
      {/* ── Colonne défilante (contexte) ── */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: colOpacity,
          maskImage:
            "linear-gradient(180deg, transparent 0%, #000 18%, #000 82%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0%, #000 18%, #000 82%, transparent 100%)",
        }}
      >
        <div style={{ position: "relative", width: CARD_W, height: 1080 }}>
          {[-1, 0, 1, 2].map((rep) =>
            offers.map((o, i) => {
              const y = i * UNIT + rep * loopH - (scrolled % loopH) + 100;
              if (y < -CARD_H || y > 1080) return null;
              return (
                <div
                  key={`${rep}-${i}`}
                  style={{
                    position: "absolute",
                    top: y,
                    left: 0,
                    width: CARD_W,
                    height: CARD_H,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 40px",
                    boxSizing: "border-box",
                    borderRadius: 16,
                    background: "#141420",
                    border: "1px solid rgba(255,255,255,0.08)",
                    filter: `blur(${colBlur}px)`,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily, fontWeight: 800, fontSize: POSTE_FS, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{o.poste}</div>
                    <div style={{ fontFamily, fontWeight: 700, fontSize: STUDIO_FS, color: "#8a8a95", whiteSpace: "nowrap" }}>{o.studio}</div>
                  </div>
                  <div style={{ fontFamily, fontWeight: 800, fontSize: POSTE_FS, color: BLENDER_ORANGE_LIGHT, whiteSpace: "nowrap", marginLeft: 24 }}>{o.tarif}</div>
                </div>
              );
            }),
          )}
        </div>
      </AbsoluteFill>

      {/* ── Carte héros nette + odomètre ── */}
      {frame >= 92 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              width: CARD_W,
              minHeight: CARD_H + 40,
              padding: "36px 48px",
              boxSizing: "border-box",
              borderRadius: 18,
              background: "#161622",
              border: `2px solid ${BLENDER_ORANGE}`,
              boxShadow: `0 0 ${30 + borderPulse * 30}px ${BLENDER_ORANGE_GLOW}`,
              transform: `translateX(${heroTremble}px) scale(${heroScale})`,
              display: "flex",
              alignItems: "center",
              gap: 32,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily, fontWeight: 800, fontSize: POSTE_FS, color: INK, whiteSpace: "nowrap" }}>{heroPoste}</div>
              <div style={{ fontFamily, fontWeight: 700, fontSize: STUDIO_FS, color: "#8a8a95", whiteSpace: "nowrap" }}>{heroStudio}</div>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <div style={{ display: "flex", gap: 2 }}>
                {digits.map((_, j) => (
                  <OdometerDigit
                    key={j}
                    offset={digitOffset(j)}
                    height={DIGIT_H}
                    width={DIGIT_W}
                    fontSize={110}
                    fontFamily={fontFamily}
                    color={BLENDER_ORANGE}
                  />
                ))}
              </div>
              <span style={{ fontFamily, fontWeight: 800, fontSize: FONT.micro, color: BLENDER_ORANGE, opacity: unitOpacity }}>
                {heroUnit}
              </span>
            </div>
          </div>
        </AbsoluteFill>
      )}
    </Stage>
  );
};
