import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsApi/Stage";
import { ATMOS_ERROR, MONEY_GREEN, FONT, RECEIPT_PAPER, RECEIPT_INK, RECEIPT_DASH, RECEIPT_MONO, atmosPanelBorder } from "../higgsApi/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});

// Anim 3 — « Le relevé bancaire qui défile » (270 frames / 9 s @ 30 fps)
// Phase 1 (0-15)    : ticket qui glisse depuis le bas
// Phase 2 (15-195)  : scroll continu + apparition des 8 lignes en fade+slide + compteur cumulé
// Phase 3 (195-245) : total qui passe au rouge + trait de surlignage tracé à la main
// Phase 4 (245-270) : fondu de sortie (Stage)

export const higgsApiAnim03Schema = z.object({});
export type HiggsApiAnim03Props = z.infer<typeof higgsApiAnim03Schema>;

const LINES: { label: string; price: number }[] = [
  { label: "Suite Montage Vidéo", price: 29 },
  { label: "IA Génération Image", price: 39 },
  { label: "Outil de Voix Off", price: 22 },
  { label: "Stockage Cloud", price: 15 },
  { label: "Suite Design", price: 25 },
  { label: "Automatisation", price: 49 },
  { label: "Analytics", price: 19 },
  { label: "CRM", price: 35 },
];
const TOTAL = LINES.reduce((a, l) => a + l.price, 0); // 233
const cumulative = LINES.reduce<number[]>((acc, l) => {
  acc.push((acc[acc.length - 1] ?? 0) + l.price);
  return acc;
}, []);

const TICKET_W = 380;
const ROW_H = 66;
const TITLE_H = 90;
const SEP_H = 30;
const TOTAL_H = 90;
const lineY = (i: number) => TITLE_H + SEP_H + i * ROW_H;
const totalY = TITLE_H + SEP_H + LINES.length * ROW_H + SEP_H;
const TICKET_H = totalY + TOTAL_H + 40;

// Frame où chaque ligne apparaît (répartie régulièrement sur 15-195)
const revealFrames = LINES.map((_, i) => 15 + i * 22);

// Fenêtre de visualisation (viewport) plus courte que le ticket, pour que
// celui-ci dépasse réellement et défile — pas juste un fade-in sur place.
const VIEWPORT_H = 560;
const VIEWPORT_TOP = (1080 - VIEWPORT_H) / 2;
const INITIAL_OFFSET = 60; // le haut du ticket (titre) visible juste sous le bord du cadre
const READING_Y = VIEWPORT_H / 2 - 30; // position de lecture du TOTAL dans le cadre
const FINAL_OFFSET = READING_Y - totalY;
const SCROLL_DISTANCE = INITIAL_OFFSET - FINAL_OFFSET;

const easeInOut = Easing.inOut(Easing.ease);

export const HiggsApiAnim03ReleveBancaire: React.FC<HiggsApiAnim03Props> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrySpring = spring({ frame, fps, config: { damping: 16, stiffness: 130 } });
  const entrySlide = interpolate(entrySpring, [0, 1], [140, 0]);
  const entryOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const scrollProgress = interpolate(frame, [15, 195], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });
  const ticketOffset = INITIAL_OFFSET + entrySlide - scrollProgress * SCROLL_DISTANCE;

  const colorT = interpolate(frame, [195, 205], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const totalColor = colorT > 0 ? mixColor(RECEIPT_INK, ATMOS_ERROR, colorT) : RECEIPT_INK;

  const strikeProgress = interpolate(frame, [205, 225], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });
  const strikeLen = 260;

  const currentCumIndex = revealFrames.filter((f) => frame >= f).length - 1;
  const cumValue = currentCumIndex >= 0 ? cumulative[currentCumIndex] : 0;
  const overlayColorT = interpolate(frame, [195, 205], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const overlayColor = overlayColorT > 0 ? mixColor(MONEY_GREEN, ATMOS_ERROR, overlayColorT) : MONEY_GREEN;

  return (
    <Stage outFrames={25}>
      <AbsoluteFill style={{ fontFamily }}>
        {/* Viewport qui cadre le ticket */}
        <div
          style={{
            position: "absolute",
            left: 1920 / 2 - TICKET_W / 2 - 40,
            top: VIEWPORT_TOP,
            width: TICKET_W + 80,
            height: VIEWPORT_H,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 40,
              top: ticketOffset,
              width: TICKET_W,
              height: TICKET_H,
              background: RECEIPT_PAPER,
              borderRadius: 4,
              boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
              transform: "rotate(-2deg)",
              opacity: entryOpacity,
              fontFamily: RECEIPT_MONO,
              color: RECEIPT_INK,
              padding: "0 28px",
            }}
          >
            <div style={{ paddingTop: 30, fontSize: 26, fontWeight: 700, letterSpacing: 1 }}>
              ABONNEMENTS LOGICIELS
            </div>
            <div style={{ position: "absolute", left: 28, right: 28, top: TITLE_H, borderTop: `2px dashed ${RECEIPT_DASH}` }} />

            {LINES.map((line, i) => {
              const rf = revealFrames[i];
              const local = interpolate(frame, [rf, rf + 14], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const slideX = interpolate(local, [0, 1], [-15, 0]);
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: 28,
                    top: lineY(i) + 14,
                    width: TICKET_W - 56,
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 22,
                    opacity: local,
                    transform: `translateX(${slideX}px)`,
                  }}
                >
                  <span>{line.label}</span>
                  <span>{line.price}€</span>
                </div>
              );
            })}

            <div style={{ position: "absolute", left: 28, right: 28, top: totalY - SEP_H + 10, borderTop: `2px dashed ${RECEIPT_DASH}` }} />

            <div
              style={{
                position: "absolute",
                left: 28,
                top: totalY,
                width: TICKET_W - 56,
                display: "flex",
                justifyContent: "space-between",
                fontSize: 28,
                fontWeight: 800,
                color: totalColor,
              }}
            >
              <span>TOTAL</span>
              <span style={{ position: "relative" }}>
                {TOTAL}€
                {frame >= 205 && (
                  <svg
                    width={strikeLen}
                    height={40}
                    style={{ position: "absolute", left: -10, top: -8, overflow: "visible" }}
                  >
                    <path
                      d={`M 5 30 Q ${strikeLen / 2} 5 ${strikeLen - 10} 22`}
                      fill="none"
                      stroke={ATMOS_ERROR}
                      strokeWidth={4}
                      strokeLinecap="round"
                      style={{
                        strokeDasharray: strikeLen,
                        strokeDashoffset: strikeLen * (1 - strikeProgress),
                      }}
                    />
                  </svg>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Overlay compteur cumulé, fixe */}
        <div
          style={{
            position: "absolute",
            bottom: 70,
            left: 1920 / 2 - 220,
            width: 440,
            padding: "24px 32px",
            borderRadius: 16,
            background: "rgba(15,22,55,0.85)",
            border: `1px solid ${atmosPanelBorder(0.4)}`,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: FONT.micro * 0.4, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>
            TOTAL CUMULÉ
          </div>
          <div style={{ fontSize: FONT.value * 0.55, fontWeight: 800, color: overlayColor, fontVariantNumeric: "tabular-nums" }}>
            {cumValue}€
          </div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

function mixColor(a: string, b: string, t: number): string {
  const pa = hexToRgb(a);
  const pb = hexToRgb(b);
  const r = Math.round(pa.r + (pb.r - pa.r) * t);
  const g = Math.round(pa.g + (pb.g - pa.g) * t);
  const bl = Math.round(pa.b + (pb.b - pa.b) * t);
  return `rgb(${r},${g},${bl})`;
}

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}
