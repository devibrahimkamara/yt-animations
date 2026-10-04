import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsAfter/Stage";
import { ACCENT, INK, FONT } from "../higgsAfter/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});

// Anim 4 — Plan 4 « Mosaïque de cas d'usage + zoom focus » (270 frames / 9s)
// 6 cases en cascade (36f/1,2s chacune, 0–216) puis zoom caméra sur case 1
// (Titres animés) de 216 à 270 (1,8s).

export const higgsAfterAnim04Schema = z.object({});
export type HiggsAfterAnim04Props = z.infer<typeof higgsAfterAnim04Schema>;

const GRID_W = 1560;
const GRID_H = 760;
const GAP = 36;
const COLS = 3;
const CELL_W = (GRID_W - GAP * (COLS - 1)) / COLS;
const CELL_H = (GRID_H - GAP) / 2;

type TileType =
  | "titres"
  | "lower"
  | "transitions"
  | "compteurs"
  | "logos"
  | "habillage";

const TILE_DEFS: { type: TileType; label: string }[] = [
  { type: "titres", label: "Titres" },
  { type: "lower", label: "Lower-thirds" },
  { type: "transitions", label: "Transitions" },
  { type: "compteurs", label: "Compteurs" },
  { type: "logos", label: "Logos" },
  { type: "habillage", label: "Habillage" },
];

const TileContent: React.FC<{ type: TileType; local: number }> = ({
  type,
  local,
}) => {
  if (type === "titres") {
    const cyc = local % 45;
    const t = interpolate(cyc, [0, 12, 33, 45], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return (
      <div
        style={{
          fontFamily,
          fontWeight: 800,
          fontSize: 40,
          color: INK,
          opacity: t,
          transform: `translateY(${(1 - t) * 24}px) scale(${0.8 + t * 0.2})`,
        }}
      >
        MON TITRE
      </div>
    );
  }
  if (type === "lower") {
    const cyc = local % 50;
    const x = interpolate(cyc, [0, 14, 36, 50], [-260, 0, 0, -260], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    return (
      <div
        style={{
          position: "absolute",
          bottom: 30,
          left: 0,
          transform: `translateX(${x}px)`,
          background: ACCENT,
          padding: "10px 22px",
          borderRadius: 6,
          fontFamily,
          fontWeight: 700,
          fontSize: 22,
          color: INK,
        }}
      >
        Nom / Fonction
      </div>
    );
  }
  if (type === "transitions") {
    const cyc = local % 40;
    const p = cyc < 20 ? cyc / 20 : (40 - cyc) / 20;
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(90deg, #2a3a7a ${p * 100}%, #7a2a4a ${p * 100}%)`,
        }}
      />
    );
  }
  if (type === "compteurs") {
    const val = Math.floor((local * 4) % 100);
    return (
      <div
        style={{
          fontFamily,
          fontWeight: 800,
          fontSize: 56,
          color: ACCENT,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {String(val).padStart(2, "0")}
      </div>
    );
  }
  if (type === "logos") {
    const rot = (local * 3) % 360;
    const pulse = 1 + Math.sin(local / 8) * 0.08;
    return (
      <div
        style={{
          width: 70,
          height: 70,
          borderRadius: 16,
          background: ACCENT,
          transform: `rotate(${rot}deg) scale(${pulse})`,
        }}
      />
    );
  }
  // habillage
  const glow = 0.5 + Math.sin(local / 10) * 0.5;
  return (
    <div
      style={{
        position: "absolute",
        inset: 14,
        border: `3px solid ${ACCENT}`,
        borderRadius: 10,
        opacity: 0.4 + glow * 0.6,
      }}
    />
  );
};

export const HiggsAfterAnim04MosaiqueZoom: React.FC<
  HiggsAfterAnim04Props
> = () => {
  const frame = useCurrentFrame();

  const zoomT = interpolate(frame, [216, 270], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const cell0CenterX = CELL_W / 2;
  const cell0CenterY = CELL_H / 2;
  const zoomScale = interpolate(zoomT, [0, 1], [1, 4.2]);

  return (
    <Stage outFrames={2}>
      <AbsoluteFill
        style={{
          background: "#0a0a0c",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: GRID_W,
            height: GRID_H,
            position: "relative",
            transform: `scale(${zoomScale})`,
            transformOrigin: `${cell0CenterX}px ${cell0CenterY}px`,
          }}
        >
          {TILE_DEFS.map((tile, i) => {
            const appear = i * 36;
            const local = frame - appear;
            const enter = interpolate(frame, [appear, appear + 18], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const rotStart = -3 + i * 0.4;
            const rot = interpolate(enter, [0, 1], [rotStart, 0]);
            const isFocus = i === 0;
            const fade = isFocus
              ? 1
              : interpolate(zoomT, [0, 0.5, 1], [1, 0.4, 0]);
            const blur = isFocus ? 0 : zoomT * 18;

            const col = i % COLS;
            const row = Math.floor(i / COLS);
            const left = col * (CELL_W + GAP);
            const top = row * (CELL_H + GAP);

            return (
              <div
                key={tile.type}
                style={{
                  position: "absolute",
                  left,
                  top,
                  width: CELL_W,
                  height: CELL_H,
                  borderRadius: 18,
                  background: "#17171c",
                  border: `1px solid ${ACCENT}33`,
                  boxShadow: "0 18px 40px rgba(0,0,0,0.4)",
                  overflow: "hidden",
                  opacity: enter * fade,
                  transform: `scale(${enter}) rotate(${rot}deg)`,
                  filter: `blur(${blur}px)`,
                }}
              >
                <AbsoluteFill
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  {local >= 0 && (
                    <TileContent type={tile.type} local={local} />
                  )}
                </AbsoluteFill>
                <div
                  style={{
                    position: "absolute",
                    bottom: 8,
                    left: 0,
                    width: "100%",
                    textAlign: "center",
                    fontFamily,
                    fontWeight: 600,
                    fontSize: FONT.micro * 0.4,
                    color: INK,
                    opacity: 0.6,
                  }}
                >
                  {tile.label}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
