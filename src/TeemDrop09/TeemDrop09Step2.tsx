import { useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { ChapterCard } from "./ChapterCard";

export const teemDrop09Step2Schema = z.object({});
export type TeemDrop09Step2Props = z.infer<typeof teemDrop09Step2Schema>;

export const TeemDrop09Step2: React.FC<TeemDrop09Step2Props> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <ChapterCard
      stepNumber={2}
      totalSteps={5}
      title="Créer le design"
      subtitle="Ce qui va accrocher le client"
      color="#8B5CF6"
      tag1="Étape clé"
      tag2="Créatif"
      completedSteps={[1]}
      frame={frame}
      fps={fps}
    />
  );
};
