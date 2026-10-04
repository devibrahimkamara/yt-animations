import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { z } from "zod";
import { Stage } from "../higgsAdobe/Stage";
import { TILES, TILE_H, TILE_W } from "../higgsAdobe/grid";
import { abstractThumb } from "../higgsAdobe/vector";
import { SCAN_LINE, atmosPanelBorder } from "../higgsAdobe/theme";

export const higgsAdobeAnim04Schema = z.object({});
export type HiggsAdobeAnim04Props = z.infer<typeof higgsAdobeAnim04Schema>;

const THUMBS = TILES.map((t) => abstractThumb(t.i + 1));

const SCAN_START_Y = -20;
const SCAN_END_Y = 1100;
const RESOLVE_DUR = 16;

export const HiggsAdobeAnim04MosaiqueScan: React.FC<HiggsAdobeAnim04Props> = () => {
  const frame = useCurrentFrame();

  // Descente linéaire du scan (0 → 60)
  const scanY = interpolate(frame, [0, 60], [SCAN_START_Y, SCAN_END_Y], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.linear,
  });

  return (
    <Stage outFrames={12}>
      <AbsoluteFill>
        {TILES.map((t, idx) => {
          // frame où le scan atteint le centre de la vignette
          const triggerFrame = interpolate(t.cy, [0, 1080], [0, 60], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          // léger stagger horizontal en plus (2.5f par colonne)
          const localStart = triggerFrame + t.col * 2.5;
          const r = interpolate(frame, [localStart, localStart + RESOLVE_DUR], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });
          const blur = interpolate(r, [0, 1], [16, 0]);
          const scale = interpolate(r, [0, 1], [0.85, 1]);
          return (
            <div
              key={t.i}
              style={{
                position: "absolute",
                left: t.x,
                top: t.y,
                width: TILE_W,
                height: TILE_H,
                borderRadius: 10,
                border: `1px solid ${atmosPanelBorder(0.25)}`,
                background: "#12151f",
                overflow: "hidden",
                opacity: r,
                transform: `scale(${scale})`,
              }}
            >
              <Img
                src={THUMBS[idx]}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: blur > 0.1 ? `blur(${blur}px)` : undefined,
                }}
              />
            </div>
          );
        })}

        {/* Ligne de scan */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: scanY,
            height: 4,
            background: `linear-gradient(90deg, transparent, ${SCAN_LINE}, transparent)`,
            boxShadow: `0 0 24px 6px ${SCAN_LINE}, 0 0 60px 16px ${SCAN_LINE}88`,
            opacity: frame <= 62 ? 1 : interpolate(frame, [62, 70], [1, 0], { extrapolateRight: "clamp" }),
          }}
        />
      </AbsoluteFill>
    </Stage>
  );
};
