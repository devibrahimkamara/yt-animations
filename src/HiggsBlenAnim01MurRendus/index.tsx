import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { Stage } from "../higgsBlen/Stage";
import { StampBadge } from "../higgsBlen/StampBadge";
import { RenderTile } from "../higgsBlen/RenderTile";
import { BLENDER_ORANGE } from "../higgsBlen/theme";

// Anim 1 — « Mur de rendus qui se scelle » (270 frames)
// A Cascade 0–90 · B Hold 90–150 · C Contraction 150–186 · D Tampon 186–270

export const higgsBlenAnim01Schema = z.object({
  // 9 rendus Blender ; laisser vide → vignettes procédurales seedées.
  // Déposer des PNG dans public/higgs-blen/ puis lister les chemins ici.
  renderTiles: z.array(z.string()).default([]),
  stampText: z.string().default("100 % Blender"),
  stampSubText: z.string().default("0 heure d'expérience"),
});

export type HiggsBlenAnim01Props = z.infer<typeof higgsBlenAnim01Schema>;

const CELL = 320;
const STEP = CELL + 16;
const CENTER = { x: 960, y: 540 };
const BIG = 560;

// Ordre spiralé : centre → coins → arêtes (évite l'effet « tableur »)
const SPIRAL = [4, 0, 2, 8, 6, 1, 5, 7, 3];
const ANTICIP = Easing.bezier(0.36, 0, 0.66, -0.56);

const cellHome = (i: number) => ({
  x: CENTER.x + ((i % 3) - 1) * STEP,
  y: CENTER.y + (Math.floor(i / 3) - 1) * STEP,
});

export const HiggsBlenAnim01MurRendus: React.FC<HiggsBlenAnim01Props> = ({
  renderTiles,
  stampText,
  stampSubText,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // B — parallaxe de fond quasi imperceptible
  const parallax = interpolate(frame, [90, 150], [0, 2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // C — progression de la contraction (150 → 186)
  const contract = interpolate(frame, [150, 186], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ANTICIP,
  });

  // Flash d'impact à la frame 186
  const flash = interpolate(frame, [185, 186, 189], [0, 0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage outFrames={12}>
      <AbsoluteFill style={{ transform: `translateX(${parallax}px)` }}>
        {SPIRAL.map((cellIndex, order) => {
          const home = cellHome(cellIndex);
          const isCenter = cellIndex === 4;

          // A — apparition en cascade
          const appear = spring({
            frame: frame - order * 4,
            fps,
            config: { damping: 12, stiffness: 120, mass: 0.8 },
          });

          // C — convergence vers le centre
          const x = interpolate(contract, [0, 1], [home.x, CENTER.x]);
          const y = interpolate(contract, [0, 1], [home.y, CENTER.y]);
          const scale = isCenter
            ? appear * interpolate(contract, [0, 1], [1, BIG / CELL])
            : appear * interpolate(contract, [0, 1], [1, 0]);
          const opacity = isCenter ? appear : appear * interpolate(contract, [0, 1], [1, 0]);

          return (
            <div
              key={cellIndex}
              style={{
                position: "absolute",
                left: x,
                top: y,
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity,
                zIndex: isCenter ? 2 : 1,
              }}
            >
              <RenderTile seed={cellIndex + 1} src={renderTiles[cellIndex]} size={CELL} radius={18} />
            </div>
          );
        })}
      </AbsoluteFill>

      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />

      <StampBadge
        text={stampText}
        subText={stampSubText}
        startFrame={186}
        color={BLENDER_ORANGE}
        restRotation={-8}
      />
    </Stage>
  );
};
