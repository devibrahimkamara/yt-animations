import { useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { ChapterCard } from "./ChapterCard";

export const teemDrop09Step1Schema = z.object({});
export type TeemDrop09Step1Props = z.infer<typeof teemDrop09Step1Schema>;

export const TeemDrop09Step1: React.FC<TeemDrop09Step1Props> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <ChapterCard
      stepNumber={1}
      totalSteps={5}
      title="Choisir la niche"
      subtitle="La base de tout business"
      color="#3B82F6"
      tag1="Étape clé"
      tag2="Fondamental"
      completedSteps={[]}
      frame={frame}
      fps={fps}
    />
  );
};
