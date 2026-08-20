import { useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { ChapterCard } from "./ChapterCard";

export const teemDrop09Step5Schema = z.object({});
export type TeemDrop09Step5Props = z.infer<typeof teemDrop09Step5Schema>;

export const TeemDrop09Step5: React.FC<TeemDrop09Step5Props> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <ChapterCard
      stepNumber={5}
      totalSteps={5}
      title="Premier client"
      subtitle="L'objectif final"
      color="#EC4899"
      tag1="Étape clé"
      tag2="Victoire"
      completedSteps={[1, 2, 3, 4]}
      frame={frame}
      fps={fps}
    />
  );
};
