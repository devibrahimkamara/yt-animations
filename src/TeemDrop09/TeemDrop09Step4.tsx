import { useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { ChapterCard } from "./ChapterCard";

export const teemDrop09Step4Schema = z.object({});
export type TeemDrop09Step4Props = z.infer<typeof teemDrop09Step4Schema>;

export const TeemDrop09Step4: React.FC<TeemDrop09Step4Props> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <ChapterCard
      stepNumber={4}
      totalSteps={5}
      title="Vendre & promouvoir"
      subtitle="Là où l'argent rentre"
      color="#F59E0B"
      tag1="Étape clé"
      tag2="Commercial"
      completedSteps={[1, 2, 3]}
      frame={frame}
      fps={fps}
    />
  );
};
