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
import { measureText } from "@remotion/layout-utils";
import { ATMOS_ERROR, strokeDashDraw } from "../AtmosOverlay/theme";
import { AtmosBackground } from "../AtmosOverlay/AtmosBackground";

const { fontFamily } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });

export const atmosAnim16Schema = z.object({
  lines: z.array(z.string()).default(["Pas d'idées", "Pas d'outils", "Pas de budget"]),
  durationSecs: z.number().default(4.5),
});

export type AtmosAnim16Props = z.infer<typeof atmosAnim16Schema>;

const FONT_SIZE = 50;
const X = 460;
const ICON_SIZE = 44;

const LigneConstat: React.FC<{ texte: string; startFrame: number; yPosition: number; fps: number }> = ({
  texte,
  startFrame,
  yPosition,
  fps,
}) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;

  if (local < -1) return null;

  const { width: textWidth, height: textHeight } = measureText({
    text: texte,
    fontFamily,
    fontSize: FONT_SIZE,
    fontWeight: 700,
  });

  const appearOpacity = interpolate(local, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const appearTranslateX = interpolate(local, [0, 10], [-25, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const strikeProgress = interpolate(local, [20, 32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const crossSpring = spring({
    frame: local - 24,
    fps,
    config: { damping: 7, mass: 0.5, stiffness: 180 },
  });
  const crossOpacity = interpolate(local, [24, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dimOpacity = interpolate(local, [30, 40], [1, 0.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <div
      style={{
        position: "absolute",
        left: X,
        top: yPosition,
        opacity: appearOpacity,
        transform: `translateX(${appearTranslateX}px)`,
        display: "flex",
        alignItems: "center",
        gap: 60,
      }}
    >
      {local >= 24 && (
        <svg
          width={ICON_SIZE}
          height={ICON_SIZE}
          viewBox="0 0 36 36"
          style={{
            position: "absolute",
            left: -60,
            opacity: crossOpacity,
            transform: `scale(${crossSpring})`,
          }}
        >
          <line x1={6} y1={6} x2={30} y2={30} stroke={ATMOS_ERROR} strokeWidth={7} strokeLinecap="round" />
          <line x1={30} y1={6} x2={6} y2={30} stroke={ATMOS_ERROR} strokeWidth={7} strokeLinecap="round" />
        </svg>
      )}

      <div style={{ position: "relative" }}>
        <div
          style={{
            opacity: dimOpacity,
            fontFamily,
            fontWeight: 700,
            fontSize: FONT_SIZE,
            color: "#FFFFFF",
            whiteSpace: "nowrap",
          }}
        >
          {texte}
        </div>
        {/* Le strikethrough et la croix restent à pleine opacité, seul le texte grise */}
        <svg
          width={textWidth + 20}
          height={textHeight + 8}
          style={{ position: "absolute", left: -10, top: 0, overflow: "visible" }}
        >
          <line
            x1={10}
            y1={textHeight / 2}
            x2={textWidth + 10}
            y2={textHeight / 2}
            stroke={ATMOS_ERROR}
            strokeWidth={6}
            strokeLinecap="round"
            style={strokeDashDraw(textWidth, strikeProgress)}
          />
        </svg>
      </div>
    </div>
  );
};

export const AtmosAnim16TripleStrike: React.FC<AtmosAnim16Props> = ({ lines }) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <AtmosBackground />
      <LigneConstat texte={lines[0]} startFrame={0} yPosition={380} fps={fps} />
      <LigneConstat texte={lines[1]} startFrame={40} yPosition={490} fps={fps} />
      <LigneConstat texte={lines[2]} startFrame={80} yPosition={600} fps={fps} />
    </AbsoluteFill>
  );
};
