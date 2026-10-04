import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsApi/Stage";
import { ACCENT, ACCENT_LIGHT, MONEY_GREEN, INK, FONT, atmosPanelBorder } from "../higgsApi/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});

// Anim 8 — « L'outil qui devient une brique » (225 frames / 7,5 s @ 30 fps)
// Phase 1 (0-45)    : fenêtre Higgsfield complète (barre d'outils + grille)
// Phase 2 (45-105)  : rétraction pilotée par un seul retractProgress
// Phase 3 (105-150) : le cadre d'app se construit autour du module, atterrissage
// Phase 4 (150-210) : maintien, pulse du liseré
// Phase 5 (210-225) : fondu de sortie (Stage)

export const higgsApiAnim08Schema = z.object({});
export type HiggsApiAnim08Props = z.infer<typeof higgsApiAnim08Schema>;

const easeInOut = Easing.inOut(Easing.ease);

const FULL_W = 1820;
const FULL_H = 980;
const FULL_X = (1920 - FULL_W) / 2;
const FULL_Y = (1080 - FULL_H) / 2;

const MODULE_W = 240;
const MODULE_H = 90;
const MODULE_X = 1920 / 2 - MODULE_W / 2;
const MODULE_Y = 1080 / 2 - MODULE_H / 2;

// Emplacement dédié dans le cadre d'app final (sidebar), légèrement décalé
const SLOT_X = MODULE_X;
const SLOT_Y = MODULE_Y;

type Vignette = { col: number; row: number };
const GRID_COLS = 3;
const GRID_ROWS = 2;
const VIGNETTES: Vignette[] = [];
for (let r = 0; r < GRID_ROWS; r++) for (let c = 0; c < GRID_COLS; c++) VIGNETTES.push({ col: c, row: r });
const centerCol = (GRID_COLS - 1) / 2;
const centerRow = (GRID_ROWS - 1) / 2;

const VIG_W = 480;
const VIG_H = 320;
const VIG_GAP = 30;
const GRID_W = VIG_W * GRID_COLS + VIG_GAP * (GRID_COLS - 1);
const GRID_X = FULL_X + (FULL_W - GRID_W) / 2;
const GRID_Y = FULL_Y + 150;

export const HiggsApiAnim08OutilBrique: React.FC<HiggsApiAnim08Props> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const introSpring = spring({ frame, fps, config: { damping: 16, stiffness: 130 } });
  const introScale = interpolate(introSpring, [0, 1], [0.97, 1]);
  const introOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const retractProgress = interpolate(frame, [45, 105], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });

  const toolbarIconsOpacity = interpolate(frame, [45, 65], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const w = interpolate(retractProgress, [0, 1], [FULL_W, MODULE_W]);
  const h = interpolate(retractProgress, [0, 1], [FULL_H, MODULE_H]);
  const x = interpolate(retractProgress, [0, 1], [FULL_X, MODULE_X]);
  const y = interpolate(retractProgress, [0, 1], [FULL_Y, MODULE_Y]);
  const radius = interpolate(retractProgress, [0, 1], [16, 20]);

  // Phase 3 : construction du cadre d'app autour du module
  const frameProgress = interpolate(frame, [105, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });
  const sidebarX = interpolate(frameProgress, [0, 1], [-260, 0]);
  const headerY = interpolate(frameProgress, [0, 1], [-80, 0]);
  const slotOpacity = interpolate(frame, [110, 125], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const landingSpring = spring({ frame: frame - 145, fps, config: { damping: 8, stiffness: 180 } });
  const landingScale = frame >= 145 ? interpolate(landingSpring, [0, 0.6, 1], [1, 1.08, 1]) : 1;
  const flashOpacity = interpolate(frame, [145, 150, 158], [0.2, 1, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const holdPulse = frame >= 150 ? 0.7 + 0.3 * (0.5 + 0.5 * Math.sin(((frame - 150) / 50) * Math.PI * 2)) : 0.7;

  const showFrame = frame >= 105;

  return (
    <Stage outFrames={15}>
      <AbsoluteFill style={{ fontFamily }}>
        {showFrame && (
          <>
            {/* Sidebar du cadre d'app */}
            <div
              style={{
                position: "absolute",
                left: sidebarX,
                top: 0,
                width: 260,
                height: 1080,
                background: "rgba(15,22,55,0.85)",
                borderRight: `1px solid ${atmosPanelBorder(0.3)}`,
                opacity: frameProgress,
              }}
            />
            {/* Header du cadre d'app */}
            <div
              style={{
                position: "absolute",
                left: 260,
                top: headerY,
                width: 1660,
                height: 90,
                background: "rgba(10,16,40,0.85)",
                borderBottom: `1px solid ${atmosPanelBorder(0.3)}`,
                opacity: frameProgress,
              }}
            />
            {/* Emplacement pointillé dédié */}
            <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: slotOpacity }}>
              <rect
                x={SLOT_X - 10}
                y={SLOT_Y - 10}
                width={MODULE_W + 20}
                height={MODULE_H + 20}
                rx={20}
                fill="none"
                stroke="#3A4756"
                strokeWidth={2}
                strokeDasharray="10 8"
              />
            </svg>
          </>
        )}

        {/* Fenêtre / module Higgsfield */}
        <div
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: w,
            height: h,
            borderRadius: radius,
            background: "#12161F",
            border: `1px solid ${atmosPanelBorder(0.4)}`,
            opacity: introOpacity,
            transform: `scale(${frame < 45 ? introScale : landingScale})`,
            boxShadow: `0 0 ${30 * flashOpacity * holdPulse}px ${MONEY_GREEN}80`,
            overflow: "hidden",
          }}
        >
          {/* Barre d'outils */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: interpolate(retractProgress, [0, 1], [50, h]),
              display: "flex",
              alignItems: "center",
              justifyContent: retractProgress > 0.85 ? "center" : "space-between",
              padding: "0 20px",
            }}
          >
            <div
              style={{
                fontSize: interpolate(retractProgress, [0, 1], [FONT.micro * 0.4, FONT.micro * 0.32]),
                fontWeight: 800,
                color: retractProgress > 0.6 ? MONEY_GREEN : INK,
                whiteSpace: "nowrap",
              }}
            >
              higgsfield
            </div>
            <div style={{ display: "flex", gap: 12, opacity: toolbarIconsOpacity }}>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{ width: 18, height: 18, borderRadius: 4, background: ACCENT_LIGHT }}
                />
              ))}
            </div>
          </div>

          {/* Grille de vignettes (disparaît en stagger inversé) */}
          {retractProgress < 1 &&
            VIGNETTES.map((v, i) => {
              const dist = Math.hypot(v.col - centerCol, v.row - centerRow);
              const localStart = interpolate(dist, [0, 1.6], [0, 0.35]);
              const localProgress = interpolate(retractProgress, [localStart, localStart + 0.4], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const scale = interpolate(localProgress, [0, 1], [1, 0]);
              const opacity = interpolate(localProgress, [0, 1], [1, 0]);
              const vx = GRID_X + v.col * (VIG_W + VIG_GAP) - FULL_X;
              const vy = GRID_Y + v.row * (VIG_H + VIG_GAP) - FULL_Y;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: vx,
                    top: vy,
                    width: VIG_W,
                    height: VIG_H,
                    borderRadius: 12,
                    background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_LIGHT} 100%)`,
                    transform: `scale(${scale})`,
                    opacity,
                  }}
                />
              );
            })}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
