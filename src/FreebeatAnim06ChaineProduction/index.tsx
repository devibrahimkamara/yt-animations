import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../freebeat/Stage";
import { PipelineNode } from "../freebeat/PipelineNode";
import { ConnectorLine } from "../freebeat/ConnectorLine";
import { FONT } from "../freebeat/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const freebeatAnim06Schema = z.object({
  steps: z
    .array(z.object({ label: z.string(), icon: z.string() }))
    .default([
      { label: "Le son de l'artiste", icon: "🎵" },
      { label: "Le prompt", icon: "✍️" },
      { label: "Images IA", icon: "🖼️" },
      { label: "Montage", icon: "🎬" },
      { label: "Clip livré", icon: "📦" },
    ]),
});

export type FreebeatAnim06Props = z.infer<typeof freebeatAnim06Schema>;

const NODE_W = 304;
const NODE_H = 264;
const CY = 396;
const MARGIN = 214;
const STEP_START = [12, 54, 96, 138, 180]; // ≥ 42 frames (1,4 s) par étape
const DRAW = 15;

export const FreebeatAnim06ChaineProduction: React.FC<FreebeatAnim06Props> = ({ steps }) => {
  const frame = useCurrentFrame();

  const n = steps.length;
  const spacing = (1920 - MARGIN * 2) / (n - 1);
  const xs = steps.map((_, i) => MARGIN + i * spacing);

  const groupIn = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage outFrames={12}>
      <AbsoluteFill style={{ opacity: groupIn }}>
        {/* connecteurs (le trait gris est visible dès le départ) */}
        {xs.slice(1).map((x, i) => (
          <ConnectorLine
            key={i}
            x1={xs[i]}
            y1={CY}
            x2={x}
            y2={CY}
            startFrame={STEP_START[i + 1] - DRAW}
            drawDuration={DRAW}
          />
        ))}

        {/* nœuds */}
        {steps.map((s, i) => (
          <PipelineNode
            key={i}
            activateFrame={i === 0 ? STEP_START[0] : STEP_START[i]}
            cx={xs[i]}
            cy={CY}
            w={NODE_W}
            h={NODE_H}
            label={s.label}
            icon={s.icon}
            fontFamily={fontFamily}
            labelFontSize={FONT.micro}
            labelWidth={spacing - 20}
            isFinal={i === n - 1}
          />
        ))}
      </AbsoluteFill>
    </Stage>
  );
};
