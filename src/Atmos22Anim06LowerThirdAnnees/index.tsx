import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../atmos22/Stage";
import { ACCENT, GLASS_BG, GLASS_BORDER, INK } from "../atmos22/theme";
import { clamp } from "../atmos22/utils";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "800"],
  subsets: ["latin"],
});

// Anim 6 — « Lower third avec compteur d'années » (150 f / 5 s @ 30 fps) — FOND TRANSPARENT
// Timeline du brief conservée : barre scaleY 0–12 · panneau scaleX f4 · nom révélé
// (clipPath) 14–28 · odomètre fondu 30–36, défilement 36–84 (out cubic), pop f84 ·
// label 88–100 · shine 100–118 · sortie panneau 132–150, barre +4 f.
// Écarts : panneau glass sombre (GLASS_BG/GLASS_BORDER) ; panneau agrandi pour une typo
// mobile (nom 88 px, odomètre 100 px dans des cellules 64×112, label 52 px) : barre x=120,
// panneau x 130→930 (800 px), y 580→960 (380 px), toujours en bas à gauche dans la zone
// 120 px ; lignes à 32 / 140 / 276 px du haut (proportions du brief). Jaune → ACCENT.

export const atmos22Anim06Schema = z.object({
  name: z.string().default("Ibrahim Kamara"),
  labelHighlight: z.string().default("6 ans"),
  labelRest: z.string().default(" de business en ligne"),
});

const BAR_X = 120;
const BAR_W = 10;
const TOP = 580;
const BOTTOM = 960;
const H = BOTTOM - TOP;
const PANEL_X = BAR_X + BAR_W;
const PANEL_W = 800;
const PAD = 44;
const CELL_W = 64;
const CELL_H = 112;

const Digit: React.FC<{ d: string }> = ({ d }) => (
  <div
    style={{
      width: CELL_W,
      height: CELL_H,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {d}
  </div>
);

export const Atmos22Anim06LowerThirdAnnees: React.FC<z.infer<typeof atmos22Anim06Schema>> = ({
  name,
  labelHighlight,
  labelRest,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrée
  const bar = spring({ frame, fps, config: { damping: 14, stiffness: 140 } });
  const panel = spring({ frame: frame - 4, fps, config: { damping: 16, stiffness: 120 } });
  const reveal = interpolate(frame, [14, 28], [100, 0], { ...clamp, easing: Easing.out(Easing.cubic) });

  // Odomètre
  const odoOp = interpolate(frame, [30, 36], [0, 1], clamp);
  const last = interpolate(frame, [36, 84], [0, 6], { ...clamp, easing: Easing.out(Easing.cubic) });
  const pop = interpolate(frame, [84, 88, 92], [1, 1.15, 1], clamp);

  // Label
  const lblOp = interpolate(frame, [88, 100], [0, 1], clamp);
  const lblY = interpolate(frame, [88, 100], [12, 0], { ...clamp, easing: Easing.out(Easing.cubic) });

  // Shine
  const shine = interpolate(frame, [100, 118], [-0.35, 1.1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const shineOn = frame >= 100 && frame <= 118;

  // Sortie
  const outPanel = interpolate(frame, [132, 149], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const outBar = interpolate(frame, [136, 149], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });

  return (
    <Stage bare outFrames={0}>
      <AbsoluteFill style={{ fontFamily }}>
        {/* Panneau */}
        <div
          style={{
            position: "absolute",
            left: PANEL_X,
            top: TOP,
            width: PANEL_W,
            height: H,
            borderRadius: "0 24px 24px 0",
            background: GLASS_BG,
            border: `1px solid ${GLASS_BORDER}`,
            borderLeft: "none",
            boxSizing: "border-box",
            overflow: "hidden",
            transformOrigin: "left",
            transform: `translateX(${-100 * outPanel}px) scaleX(${Math.max(0, panel)})`,
            opacity: 1 - outPanel,
          }}
        >
          {/* Nom */}
          <div
            style={{
              position: "absolute",
              left: PAD,
              top: 32,
              fontWeight: 800,
              fontSize: 88,
              lineHeight: 1.1,
              color: INK,
              whiteSpace: "nowrap",
              clipPath: `inset(0 ${reveal}% 0 0)`,
            }}
          >
            {name}
          </div>

          {/* Odomètre 2020 → 2026 */}
          <div
            style={{
              position: "absolute",
              left: PAD - 6,
              top: 140,
              height: CELL_H,
              display: "flex",
              fontWeight: 800,
              fontSize: 100,
              lineHeight: 1,
              color: ACCENT,
              textShadow: "0 0 36px rgba(48,96,255,0.55)",
              fontVariantNumeric: "tabular-nums",
              opacity: odoOp,
            }}
          >
            <Digit d="2" />
            <Digit d="0" />
            <Digit d="2" />
            <div
              style={{
                width: CELL_W,
                height: CELL_H,
                overflow: "hidden",
                transform: `scale(${pop})`,
              }}
            >
              <div style={{ transform: `translateY(${-last * CELL_H}px)` }}>
                {["0", "1", "2", "3", "4", "5", "6"].map((d) => (
                  <Digit key={d} d={d} />
                ))}
              </div>
            </div>
          </div>

          {/* Label */}
          <div
            style={{
              position: "absolute",
              left: PAD,
              top: 276,
              fontWeight: 600,
              fontSize: 52,
              lineHeight: 1.2,
              color: INK,
              whiteSpace: "nowrap",
              opacity: lblOp,
              transform: `translateY(${lblY}px)`,
            }}
          >
            <span style={{ color: ACCENT }}>{labelHighlight}</span>
            {labelRest}
          </div>

          {/* Shine */}
          {shineOn && (
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: shine * PANEL_W,
                width: 220,
                background:
                  "linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 100%)",
              }}
            />
          )}
        </div>

        {/* Barre d'accent */}
        <div
          style={{
            position: "absolute",
            left: BAR_X,
            top: TOP,
            width: BAR_W,
            height: H,
            background: ACCENT,
            boxShadow: "0 0 24px rgba(48,96,255,0.55)",
            transformOrigin: "bottom",
            transform: `translateX(${-100 * outBar}px) scaleY(${Math.max(0, bar)})`,
            opacity: 1 - outBar,
          }}
        />
      </AbsoluteFill>
    </Stage>
  );
};
