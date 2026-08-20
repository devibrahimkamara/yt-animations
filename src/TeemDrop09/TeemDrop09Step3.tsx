import { useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { ChapterCard } from "./ChapterCard";

export const teemDrop09Step3Schema = z.object({});
export type TeemDrop09Step3Props = z.infer<typeof teemDrop09Step3Schema>;

export const TeemDrop09Step3: React.FC<TeemDrop09Step3Props> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <ChapterCard
      stepNumber={3}
      totalSteps={5}
      title="Trouver le fournisseur"
      subtitle="La qualité fait le bouche-à-oreille"
      color="#10B981"
      tag1="Étape clé"
      tag2="Logistique"
      completedSteps={[1, 2]}
      frame={frame}
      fps={fps}
    />
  );
};
