import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgs/Stage";
import { RevealText } from "../higgs/RevealText";
import { ACCENT, ACCENT_LIGHT, INK, SILHOUETTE_GREY, FONT } from "../higgs/theme";
import { bustSilhouette } from "../higgs/vector";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const higgsAnim08Schema = z.object({
  line1: z.string().default("Ils veulent se lancer."),
  line2: z.string().default("Ils ne veulent pas se montrer."),
});

export type HiggsAnim08Props = z.infer<typeof higgsAnim08Schema>;

const LINE_Y = 460;
const SIL_W = 280;
const SIL_H = 360;
const IMG = bustSilhouette({ w: SIL_W, h: SIL_H, tone: SILHOUETTE_GREY });

type Sil = { x: number; cross: number; blocked: boolean };
const SILS: Sil[] = [
  { x: 640, cross: 50, blocked: false },
  { x: 960, cross: 60, blocked: false },
  { x: 1280, cross: 70, blocked: true },
];

export const HiggsAnim08MurDeVerre: React.FC<HiggsAnim08Props> = ({ line1, line2 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineOpacity = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const shock = interpolate(frame, [70, 76, 84], [0, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage outFrames={12} bare background="radial-gradient(120% 90% at 50% 40%, #1c2230 0%, #0A0A0A 75%)">
      <AbsoluteFill>
        {/* onde de choc contre le verre */}
        <div
          style={{
            position: "absolute",
            left: SILS[2].x,
            top: LINE_Y,
            width: 900,
            height: 900,
            marginLeft: -450,
            marginTop: -450,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${ACCENT_LIGHT}cc 0%, ${ACCENT}00 60%)`,
            opacity: shock,
          }}
        />

        {/* ligne de séparation */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: LINE_Y,
            height: 4,
            background: ACCENT_LIGHT,
            opacity: lineOpacity,
            boxShadow: `0 0 20px ${ACCENT_LIGHT}, 0 0 50px ${ACCENT}`,
          }}
        />

        {SILS.map((sil, i) => {
          const baseY = interpolate(frame, [0, sil.cross], [300, LINE_Y], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });

          let y = baseY;
          if (sil.blocked && frame >= sil.cross) {
            const rec = spring({
              frame: frame - sil.cross,
              fps,
              config: { damping: 8, stiffness: 100, mass: 1.2 },
            });
            y = interpolate(rec, [0, 1], [LINE_Y, LINE_Y - 60]);
          } else if (!sil.blocked) {
            y = interpolate(frame, [0, sil.cross, sil.cross + 40], [300, LINE_Y, LINE_Y + 70], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });
          }

          const scale = interpolate(frame, [0, sil.cross + 30], [0.4, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });

          const passed = !sil.blocked && frame >= sil.cross;
          const grayT = passed
            ? interpolate(frame, [sil.cross, sil.cross + 14], [1, 0], { extrapolateRight: "clamp" })
            : 1;
          const blur = sil.blocked
            ? interpolate(frame, [0, 45], [5, 2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
            : interpolate(frame, [0, sil.cross], [5, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
          const edgeFlash = passed
            ? interpolate(frame, [sil.cross - 1, sil.cross, sil.cross + 4], [0, 1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 0;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: sil.x,
                top: y,
                width: SIL_W,
                height: SIL_H,
                transform: `translate(-50%, -50%) scale(${scale})`,
                filter: `blur(${blur}px) grayscale(${grayT}) saturate(${interpolate(grayT, [0, 1], [1.1, 0.4])})`,
              }}
            >
              <Img src={IMG} style={{ width: "100%", height: "100%" }} />
              <div
                style={{
                  position: "absolute",
                  inset: -6,
                  border: `4px solid ${INK}`,
                  borderRadius: 12,
                  opacity: edgeFlash,
                }}
              />
            </div>
          );
        })}

        {/* sous-titres */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 760, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          {frame >= 100 && (
            <RevealText
              text={line1}
              startFrame={100}
              fontFamily={fontFamily}
              fontSize={FONT.label}
              color={INK}
            />
          )}
          {frame >= 130 && (
            <RevealText
              text={line2}
              startFrame={130}
              fontFamily={fontFamily}
              fontSize={FONT.label}
              color={ACCENT}
            />
          )}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
