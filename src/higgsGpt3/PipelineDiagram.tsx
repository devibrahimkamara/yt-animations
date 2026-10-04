import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  ACCENT,
  ACCENT_LIGHT,
  INK,
  FONT,
  atmosPanelBorder,
  atmosGlow,
} from "./theme";

// Composant autonome et paramétrable pour le diagramme "pipeline" (Anim 7 —
// "Assemblage du pipeline"), conçu pour être réutilisé plus tard dans la
// même vidéo (rappel d'une seule étape en mode statique déjà allumé), comme
// demandé explicitement par le brief.
//
//  showFullAnimation=true  → séquence complète : apparition en cascade des
//    blocs + traits en pointillés + impulsion lumineuse qui parcourt la
//    chaîne + respiration des bordures (utilisée dans Anim 7 elle-même).
//  showFullAnimation=false → diagramme déjà entièrement construit et
//    allumé, avec éventuellement un seul bloc mis en avant via
//    `highlightIndexOnly` (utilisation future en rappel ailleurs dans la
//    vidéo).

export type PipelineBlock = {
  icon: React.ReactNode;
  label: string;
};

const BLOCK_W = 340;
const BLOCK_H = 260;
const GAP = 80;
const START_X = (1920 - (BLOCK_W * 4 + GAP * 3)) / 2;
const CENTER_Y = 540;

const blockCenterX = (i: number) => START_X + i * (BLOCK_W + GAP) + BLOCK_W / 2;

export const PipelineDiagram: React.FC<{
  blocks: PipelineBlock[];
  highlightIndexOnly?: number;
  showFullAnimation?: boolean;
  accentColor?: string;
}> = ({
  blocks,
  highlightIndexOnly,
  showFullAnimation = true,
  accentColor = ACCENT,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Frame à laquelle chaque bloc commence son entrée (Phase 1).
  const blockStart = (i: number) => i * 27;
  // Frame à laquelle chaque bloc est "allumé" par l'impulsion (Phase 2).
  const litStart = (i: number) => [112, 112, 121, 130, 138][i] ?? 138;

  return (
    <>
      {/* Connexions en pointillés (tracées après l'arrivée du bloc suivant) */}
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0 }}
      >
        {blocks.slice(1).map((_, idx) => {
          const i = idx + 1;
          const x1 = blockCenterX(i - 1) + BLOCK_W / 2;
          const x2 = blockCenterX(i) - BLOCK_W / 2;
          const drawStart = showFullAnimation ? blockStart(i) + 19 : 0;
          const drawEnd = drawStart + 12;
          const progress = showFullAnimation
            ? interpolate(frame, [drawStart, drawEnd], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              })
            : 1;
          const length = x2 - x1;
          const lit = showFullAnimation
            ? interpolate(frame, [litStart(i) - 6, litStart(i)], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 1;
          const lineColor = `rgba(136,170,255,${0.35 + lit * 0.45})`;

          return (
            <line
              key={i}
              x1={x1}
              y1={CENTER_Y}
              x2={x1 + length * progress}
              y2={CENTER_Y}
              stroke={lineColor}
              strokeWidth={3}
              strokeDasharray="10 8"
            />
          );
        })}
      </svg>

      {/* Impulsion lumineuse qui parcourt la chaîne (Phase 2) */}
      {showFullAnimation &&
        (() => {
          const pulseStart = 112;
          const pulseEnd = 138;
          const segFrames = [pulseStart, 121, 130, pulseEnd];
          const t = interpolate(frame, [pulseStart, pulseEnd], [0, 3], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          if (frame < pulseStart || frame > pulseEnd || blocks.length < 2) {
            return null;
          }
          const seg = Math.min(Math.floor(t), blocks.length - 2);
          const segT = interpolate(
            frame,
            [segFrames[seg], segFrames[seg + 1]],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const x1 = blockCenterX(seg) + BLOCK_W / 2;
          const x2 = blockCenterX(seg + 1) - BLOCK_W / 2;
          const x = x1 + (x2 - x1) * segT;
          return (
            <div
              style={{
                position: "absolute",
                left: x - 8,
                top: CENTER_Y - 8,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: ACCENT_LIGHT,
                boxShadow: atmosGlow(accentColor, 40, 90),
              }}
            />
          );
        })()}

      {/* Blocs */}
      {blocks.map((b, i) => {
        const entrySpring = showFullAnimation
          ? spring({
              frame: frame - blockStart(i),
              fps,
              config: { damping: 12, stiffness: 190 },
            })
          : 1;
        const scale = interpolate(entrySpring, [0, 1], [0.85, 1]);
        const opacity = interpolate(entrySpring, [0, 1], [0, 1]);

        const isLit = showFullAnimation
          ? interpolate(frame, [litStart(i) - 6, litStart(i)], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          : highlightIndexOnly === undefined || highlightIndexOnly === i
            ? 1
            : 0.5;

        // Respiration douce des bordures une fois tout allumé (Phase 3).
        const breathe =
          0.8 +
          Math.sin((frame + i * 9) / fps / 0.5) * 0.1 * (isLit > 0.9 ? 1 : 0);

        const emphasis =
          highlightIndexOnly !== undefined && highlightIndexOnly === i ? 1.06 : 1;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: blockCenterX(i) - BLOCK_W / 2,
              top: CENTER_Y - BLOCK_H / 2,
              width: BLOCK_W,
              height: BLOCK_H,
              borderRadius: 24,
              background: "rgba(20,20,26,0.7)",
              border: `2px solid ${
                isLit > 0.5 ? atmosPanelBorder(breathe) : atmosPanelBorder(0.25)
              }`,
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              transform: `scale(${scale * emphasis})`,
              opacity,
              boxShadow:
                isLit > 0.5 ? atmosGlow(accentColor, 30, 70) : "none",
            }}
          >
            <div
              style={{
                color: isLit > 0.5 ? ACCENT_LIGHT : "rgba(255,255,255,0.55)",
              }}
            >
              {b.icon}
            </div>
            <div
              style={{
                fontSize: FONT.micro,
                fontWeight: 700,
                color: INK,
                textAlign: "center",
                padding: "0 20px",
              }}
            >
              {b.label}
            </div>
          </div>
        );
      })}
    </>
  );
};
