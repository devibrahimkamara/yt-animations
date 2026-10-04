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
import { StampBadge } from "../higgsBlen/StampBadge";
import { IconFolder } from "../higgsBlen/icons";
import { shake } from "../higgsBlen/shake";
import {
  INK,
  FONT,
  FAIL_RED,
  FAIL_RED_TINT,
  NEUTRAL_PANEL,
  atmosPanelBorder,
} from "../higgsBlen/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

// Anim 2 — « La fiche de profil vide » (255 frames)
// A Dépliage 0–30 · B Compteur 30–90 · C 3 lignes 90–180 · D Tampon 180–255

export const higgsBlenAnim02Schema = z.object({
  header: z.string().default("Fiche compétence"),
  counterLabel: z.string().default("Heures sur Blender"),
  criteria: z
    .array(z.string())
    .default([
      "Jamais installé le logiciel",
      "Jamais ouvert un tutoriel",
      "Aucune formation suivie",
    ]),
  stampText: z.string().default("Débutant total"),
});

export type HiggsBlenAnim02Props = z.infer<typeof higgsBlenAnim02Schema>;

const SHEET_W = 1220;
const SHEET_H = 900;
const COUNTER_FS = 150;
const GREY = "#C4C4C8";

const fmt = (s: number) => {
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = Math.floor(s % 60);
  return [hh, mm, ss].map((v) => String(v).padStart(2, "0")).join(":");
};

export const HiggsBlenAnim02FicheVide: React.FC<HiggsBlenAnim02Props> = ({
  header,
  counterLabel,
  criteria,
  stampText,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // A — dépliage vertical
  const unfold = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });
  const sheetScaleY = interpolate(unfold, [0, 1], [0.01, 1], { extrapolateRight: "clamp" });
  const headerOpacity = interpolate(frame, [10, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sepDraw = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // B — compteur d'heures (paliers + freeze + chute sèche)
  const seconds = (() => {
    if (frame < 42) return interpolate(frame, [30, 42], [0, 47], { extrapolateLeft: "clamp" });
    if (frame < 48) return 47;
    if (frame < 54) return interpolate(frame, [48, 54], [47, 88]);
    if (frame < 60) return 88;
    if (frame < 72) return interpolate(frame, [60, 66], [88, 135], { extrapolateRight: "clamp" });
    return 0; // chute sèche à la frame 72
  })();
  const dropped = frame >= 72;
  const counterFlicker =
    frame >= 66 && frame < 72
      ? interpolate(Math.sin((frame - 66) * 3.1), [-1, 1], [0.3, 1])
      : 1;
  const sheetShakeX = shake(frame, 72, 7, 12);
  const counterColor = dropped ? FAIL_RED : INK;

  // D — recul + assombrissement de la fiche
  const recede = interpolate(frame, [180, 195], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const sheetScale = interpolate(recede, [0, 1], [1, 0.92]);
  const sheetBright = interpolate(recede, [0, 1], [1, 0.6]);

  return (
    <Stage outFrames={12}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: SHEET_W,
            height: SHEET_H,
            transform: `translateX(${sheetShakeX}px) scaleY(${sheetScaleY}) scale(${sheetScale})`,
            transformOrigin: "top center",
            filter: `brightness(${sheetBright})`,
            background: NEUTRAL_PANEL,
            border: `1px solid ${atmosPanelBorder(0.3)}`,
            borderRadius: 8,
            padding: "56px 72px",
            boxSizing: "border-box",
            position: "relative",
          }}
        >
          {/* onglet coin haut-gauche */}
          <div
            style={{
              position: "absolute",
              top: -2,
              left: 40,
              width: 120,
              height: 14,
              background: atmosPanelBorder(0.5),
              borderRadius: "0 0 6px 6px",
            }}
          />

          {/* header */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, opacity: headerOpacity }}>
            <IconFolder size={64} color={GREY} strokeWidth={3} />
            <span
              style={{
                fontFamily,
                fontWeight: 800,
                fontSize: FONT.micro,
                letterSpacing: "4px",
                color: GREY,
                textTransform: "uppercase",
              }}
            >
              {header}
            </span>
          </div>
          <div
            style={{
              marginTop: 24,
              height: 2,
              background: GREY,
              transformOrigin: "left center",
              transform: `scaleX(${sepDraw})`,
              opacity: 0.5,
            }}
          />

          {/* compteur */}
          <div style={{ marginTop: 44, opacity: frame >= 30 ? 1 : 0 }}>
            <div style={{ fontFamily, fontWeight: 700, fontSize: FONT.micro, color: GREY }}>
              {counterLabel}
            </div>
            <div
              style={{
                marginTop: 12,
                fontFamily,
                fontWeight: 800,
                fontSize: COUNTER_FS,
                color: counterColor,
                opacity: counterFlicker,
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "2px",
              }}
            >
              {fmt(seconds)}
            </div>
          </div>

          {/* 3 lignes de critères */}
          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 18 }}>
            {criteria.map((text, i) => {
              const base = 90 + i * 30;
              const f = frame - base;
              const textIn = interpolate(f, [0, 10], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              });
              const boxDraw = interpolate(f, [10, 18], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const crossDraw = interpolate(f, [18, 26], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const crossPop = spring({ frame: f - 18, fps, config: { damping: 9, stiffness: 220 } });
              const tint = interpolate(f, [26, 30], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const L = 40;
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 24,
                    padding: "10px 16px",
                    borderRadius: 8,
                    background: `rgba(239,68,68,${0.08 * tint})`,
                    opacity: f >= 0 ? 1 : 0,
                  }}
                >
                  <svg width="52" height="52" viewBox="0 0 40 40" style={{ flexShrink: 0 }}>
                    <rect
                      x="4"
                      y="4"
                      width="32"
                      height="32"
                      rx="4"
                      fill="none"
                      stroke={FAIL_RED}
                      strokeWidth="3"
                      strokeDasharray={128}
                      strokeDashoffset={128 * (1 - boxDraw)}
                    />
                    <g
                      stroke={FAIL_RED}
                      strokeWidth="4"
                      strokeLinecap="round"
                      style={{ transform: `scale(${interpolate(crossPop, [0, 1], [0.4, 1])})`, transformOrigin: "20px 20px" }}
                    >
                      <line x1="11" y1="11" x2="29" y2="29" strokeDasharray={L} strokeDashoffset={L * (1 - crossDraw)} />
                      <line x1="29" y1="11" x2="11" y2="29" strokeDasharray={L} strokeDashoffset={L * (1 - crossDraw)} />
                    </g>
                  </svg>
                  <span
                    style={{
                      fontFamily,
                      fontWeight: 700,
                      fontSize: FONT.micro,
                      color: INK,
                      opacity: textIn,
                      transform: `translateX(${interpolate(textIn, [0, 1], [-30, 0])}px)`,
                      display: "inline-block",
                    }}
                  >
                    {text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>

      <StampBadge text={stampText} startFrame={180} color={FAIL_RED} restRotation={-6} />
      {/* teinte de fond « échec » derrière le tampon */}
      {frame >= 180 && (
        <AbsoluteFill
          style={{
            background: FAIL_RED_TINT,
            opacity: interpolate(frame, [180, 200], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            zIndex: -1,
          }}
        />
      )}
    </Stage>
  );
};
