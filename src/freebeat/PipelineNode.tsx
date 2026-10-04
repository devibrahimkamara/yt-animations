import {
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ACCENT, INK, NEUTRAL_BORDER, NEUTRAL_PANEL, FONT, ICON } from "./theme";
import { Emoji } from "../higgs2/Emoji";

// Nœud d'un pipeline (Anim 6). S'allume à `activateFrame` : gris → accent,
// scale overshoot puis retour à 1 (spring léger rebond), label en fondu juste après.
export const PipelineNode: React.FC<{
  activateFrame: number;
  cx: number;
  cy: number;
  w: number;
  h: number;
  label: string;
  icon: string;
  fontFamily: string;
  labelFontSize?: number;
  labelWidth?: number;
  isFinal?: boolean;
}> = ({
  activateFrame,
  cx,
  cy,
  w,
  h,
  label,
  icon,
  fontFamily,
  labelFontSize,
  labelWidth,
  isFinal = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - activateFrame;

  const lit = interpolate(f, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const popRaw = spring({ frame: f, fps, config: { damping: 12, stiffness: 200 } });
  const peak = isFinal ? 1.2 : 1.15;
  const scale =
    f >= 0
      ? interpolate(popRaw, [0, 0.5, 1], [1, peak, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  const bg = interpolateColors(lit, [0, 1], [NEUTRAL_PANEL, "#16305c"]);
  const border = interpolateColors(lit, [0, 1], [NEUTRAL_BORDER, ACCENT]);
  const labelColor = interpolateColors(lit, [0, 1], ["#8E8E93", INK]);

  const labelIn = interpolate(f, [10, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelY = interpolate(labelIn, [0, 1], [8, 0]);

  // Halo pulsé une fois autour du nœud final
  const halo =
    isFinal && f >= 8 && f < 32 ? Math.max(0, Math.sin((f - 8) / 24 * Math.PI)) : 0;
  const glow = lit * 0.6 + halo * 0.8;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: cx - w / 2,
          top: cy - h / 2,
          width: w,
          height: h,
          transform: `scale(${scale})`,
          borderRadius: 28,
          background: bg,
          border: `5px solid ${border}`,
          boxShadow: glow > 0 ? `0 0 ${90 * glow}px ${ACCENT}aa` : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Emoji size={ICON.md}>{icon}</Emoji>
      </div>
      <div
        style={{
          position: "absolute",
          left: cx - (labelWidth ?? w * 1.6) / 2,
          top: cy + h / 2 + 24,
          width: labelWidth ?? w * 1.6,
          textAlign: "center",
          lineHeight: 1.15,
          opacity: labelIn,
          transform: `translateY(${labelY}px)`,
          fontFamily,
          fontWeight: 700,
          fontSize: labelFontSize ?? FONT.micro,
          color: labelColor,
        }}
      >
        {label}
      </div>
    </>
  );
};
