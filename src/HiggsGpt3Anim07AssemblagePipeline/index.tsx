import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsGpt3/Stage";
import { PipelineDiagram } from "../higgsGpt3/PipelineDiagram";
import { IconImage, IconWand, IconMic, IconScissors } from "../higgsGpt3/icons";
import { ACCENT_LIGHT, FONT } from "../higgsGpt3/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});

// Anim 7 — « Assemblage du pipeline » (210 frames / 7 s @ 30 fps)
// A 4 blocs + connexions en cascade 0–112 · B impulsion lumineuse 112–148
// C hold complet (respiration) 148–190 · D sortie 190–210
//
// Utilise <PipelineDiagram> (src/higgsGpt3/PipelineDiagram.tsx), construit
// comme composant autonome et paramétrable pour pouvoir être rappelé plus
// tard dans la vidéo (un seul bloc mis en avant, diagramme déjà allumé),
// comme demandé par le brief.

export const higgsGpt3Anim07Schema = z.object({
  block1: z.string().default("Génération d'images"),
  block2: z.string().default("Animation"),
  block3: z.string().default("Voix off"),
  block4: z.string().default("Montage final"),
});
export type HiggsGpt3Anim07Props = z.infer<typeof higgsGpt3Anim07Schema>;

export const HiggsGpt3Anim07AssemblagePipeline: React.FC<
  HiggsGpt3Anim07Props
> = ({ block1, block2, block3, block4 }) => {
  const frame = useCurrentFrame();

  const scale = interpolate(frame, [190, 210], [1, 0.97], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const iconProps = { size: 64, color: ACCENT_LIGHT, strokeWidth: 3.5 };

  const blocks = [
    { icon: <IconImage {...iconProps} />, label: block1 },
    { icon: <IconWand {...iconProps} />, label: block2 },
    { icon: <IconMic {...iconProps} />, label: block3 },
    { icon: <IconScissors {...iconProps} />, label: block4 },
  ];

  return (
    <Stage outFrames={20}>
      <AbsoluteFill style={{ fontFamily, transform: `scale(${scale})` }}>
        <div
          style={{
            position: "absolute",
            top: 220,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: FONT.micro * 0.55,
            fontWeight: 600,
            color: "rgba(255,255,255,0.6)",
            opacity: interpolate(frame, [0, 20], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Le setup complet
        </div>
        <PipelineDiagram blocks={blocks} showFullAnimation />
      </AbsoluteFill>
    </Stage>
  );
};
