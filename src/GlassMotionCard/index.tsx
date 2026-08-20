import { AbsoluteFill } from "remotion";
import { z } from "zod";
import { AuroraBackground } from "./AuroraBackground";
import { GlassCard } from "./GlassCard";
import { GridItems } from "./elements/GridItems";
import { MetricDisplay } from "./elements/MetricDisplay";
import { ProgressBar } from "./elements/ProgressBar";
import { TrendLine } from "./elements/TrendLine";

export const glassMotionCardSchema = z.object({
  label: z.string(),
  value: z.string(),
  subtitle: z.string().optional(),
  layout: z.enum(["default", "wide", "horizontal"]).default("default"),
  element: z.enum(["none", "linechart", "progress", "grid"]).default("none"),
  countUp: z.boolean().default(true),
  progressValue: z.number().optional(),
  gridItems: z
    .array(z.object({ label: z.string(), active: z.boolean().default(false) }))
    .optional(),
  linePoints: z.array(z.number()).optional(),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(4),
});

export type GlassMotionCardProps = z.infer<typeof glassMotionCardSchema>;

export const GlassMotionCard: React.FC<GlassMotionCardProps> = ({
  label,
  value,
  subtitle,
  layout,
  element,
  countUp,
  progressValue,
  gridItems,
  linePoints,
  accentColor,
}) => {
  const isHorizontal = layout === "horizontal";

  return (
    <AbsoluteFill>
      <AuroraBackground />
      <GlassCard layout={layout} accentColor={accentColor}>
        {/* Left / main column */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
          <MetricDisplay
            label={label}
            value={value}
            subtitle={subtitle}
            countUp={countUp}
          />
          {element === "progress" && progressValue !== undefined && !isHorizontal && (
            <div style={{ marginTop: 24 }}>
              <ProgressBar value={progressValue} color={accentColor} />
            </div>
          )}
          {element === "grid" && gridItems && !isHorizontal && (
            <GridItems items={gridItems} />
          )}
        </div>

        {/* Right column — only for horizontal + linechart */}
        {isHorizontal && element === "linechart" && linePoints && linePoints.length > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TrendLine points={linePoints} color="rgba(180,210,255,0.9)" />
          </div>
        )}
        {isHorizontal && element === "progress" && progressValue !== undefined && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <ProgressBar value={progressValue} color={accentColor} barWidth={380} />
          </div>
        )}

        {/* Default layout linechart below */}
        {!isHorizontal && element === "linechart" && linePoints && linePoints.length > 1 && (
          <TrendLine points={linePoints} width={580} height={160} color="rgba(180,210,255,0.9)" />
        )}
      </GlassCard>
    </AbsoluteFill>
  );
};
