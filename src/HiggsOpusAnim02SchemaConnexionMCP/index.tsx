import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsOpus/Stage";
import {
  ACCENT,
  FONT,
  ICON,
  INK,
  NEUTRAL_BORDER,
  NEUTRAL_PANEL,
  OPUS_TERRACOTTA,
} from "../higgsOpus/theme";
import { pathFromPoints, pointAtProgress, polylineLength, Pt } from "../higgsOpus/utils";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});

// Anim 2 — « Le schéma de connexion Opus 5.5 → Higgsfield MCP » (210 frames / 7 s @ 30 fps)
// Phase 1 blocs 0–25 · Phase 2 lignes 25–55 · Phase 3 point voyageur 55–100 ·
// Phase 4 éventail d'icônes 95–140 · Phase 5 convergence timeline 140–195 · Phase 6 stabilisation 195–210

export const higgsOpusAnim02Schema = z.object({
  opusLabel: z.string().default("Opus 5.5"),
  mcpLabel: z.string().default("MCP"),
  higgsfieldLabel: z.string().default("Higgsfield"),
  footerText: z.string().default("Généré automatiquement"),
});
export type HiggsOpusAnim02Props = z.infer<typeof higgsOpusAnim02Schema>;

const P_OPUS: Pt = { x: 300, y: 220 };
const P_MCP: Pt = { x: 960, y: 220 };
const P_HIGGS: Pt = { x: 1620, y: 220 };
const PATH_POINTS = [P_OPUS, P_MCP, P_HIGGS];
const TOTAL_LEN = polylineLength(PATH_POINTS);
const SEG1_LEN = polylineLength([P_OPUS, P_MCP]);

const ICONS = [
  { label: "Image", dx: -220, dy: -140, start: 100 },
  { label: "Vidéo", dx: 0, dy: -170, start: 106 },
  { label: "Audio", dx: 220, dy: -140, start: 112 },
];

export const HiggsOpusAnim02SchemaConnexionMCP: React.FC<HiggsOpusAnim02Props> = ({
  opusLabel,
  mcpLabel,
  higgsfieldLabel,
  footerText,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const blockSpring = (start: number) =>
    interpolate(
      spring({ frame: frame - start, fps, config: { damping: 14, stiffness: 180, mass: 0.6 } }),
      [0, 1],
      [0.7, 1],
    );
  const blockOpacity = (start: number) =>
    interpolate(frame, [start, start + 10], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const opusScale = blockSpring(0);
  const opusOpacity = blockOpacity(0);
  const mcpScale = blockSpring(8);
  const mcpOpacity = blockOpacity(8);
  const higgsScale = blockSpring(16);
  const higgsOpacity = blockOpacity(16);

  // Phase 2 — tracé des lignes
  const seg1Progress = interpolate(frame, [25, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const seg2Progress = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 3 — point lumineux voyageur
  const travelT = interpolate(frame, [60, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const travelPoint = pointAtProgress(PATH_POINTS, travelT);
  const dotColor = interpolateColors(travelT, [0, 1], [OPUS_TERRACOTTA, ACCENT]);
  const dotOpacity = interpolate(frame, [55, 60, 95, 103], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const mcpClickBounce = spring({
    frame: frame - 78,
    fps,
    config: { damping: 10, stiffness: 380 },
  });
  const mcpClickScale = interpolate(mcpClickBounce, [0, 1], [1, 1.15]);

  return (
    <Stage>
      <AbsoluteFill style={{ fontFamily, justifyContent: "center", alignItems: "center" }}>
        <svg
          width={1920}
          height={1080}
          viewBox="0 0 1920 1080"
          style={{ position: "absolute" }}
        >
          <path
            d={pathFromPoints([P_OPUS, P_MCP])}
            stroke={ACCENT}
            strokeWidth={2}
            fill="none"
            strokeDasharray={SEG1_LEN}
            strokeDashoffset={SEG1_LEN * (1 - seg1Progress)}
            opacity={0.9}
          />
          <path
            d={pathFromPoints([P_MCP, P_HIGGS])}
            stroke={ACCENT}
            strokeWidth={2}
            fill="none"
            strokeDasharray={TOTAL_LEN - SEG1_LEN}
            strokeDashoffset={(TOTAL_LEN - SEG1_LEN) * (1 - seg2Progress)}
            opacity={0.9}
          />
          {frame >= 55 && frame < 103 && (
            <circle
              cx={travelPoint.x}
              cy={travelPoint.y}
              r={8}
              fill={dotColor}
              opacity={dotOpacity}
              style={{ filter: `drop-shadow(0 0 12px ${dotColor})` }}
            />
          )}
        </svg>

        {/* Bloc Opus 5.5 */}
        <div
          style={{
            position: "absolute",
            left: P_OPUS.x - 90,
            top: P_OPUS.y - 90,
            width: 180,
            height: 180,
            borderRadius: 28,
            background: `${OPUS_TERRACOTTA}22`,
            border: `2px solid ${OPUS_TERRACOTTA}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: INK,
            fontWeight: 800,
            fontSize: FONT.micro,
            textAlign: "center",
            transform: `scale(${opusScale})`,
            opacity: opusOpacity,
          }}
        >
          {opusLabel}
        </div>

        {/* Connecteur MCP */}
        <div
          style={{
            position: "absolute",
            left: P_MCP.x - 55,
            top: P_MCP.y - 55,
            width: 110,
            height: 110,
            borderRadius: "50%",
            background: NEUTRAL_PANEL,
            border: `2px solid ${NEUTRAL_BORDER}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: INK,
            fontWeight: 800,
            fontSize: FONT.micro,
            transform: `scale(${mcpScale * mcpClickScale})`,
            opacity: mcpOpacity,
          }}
        >
          {mcpLabel}
        </div>

        {/* Bloc Higgsfield */}
        <div
          style={{
            position: "absolute",
            left: P_HIGGS.x - 90,
            top: P_HIGGS.y - 90,
            width: 180,
            height: 180,
            borderRadius: 28,
            background: `${ACCENT}22`,
            border: `2px solid ${ACCENT}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: INK,
            fontWeight: 800,
            fontSize: FONT.micro,
            textAlign: "center",
            transform: `scale(${higgsScale})`,
            opacity: higgsOpacity,
          }}
        >
          {higgsfieldLabel}
        </div>

        {/* Éventail d'icônes */}
        {ICONS.map(({ label, dx, dy, start }, i) => {
          const iconSpring = interpolate(
            spring({ frame: frame - start, fps, config: { damping: 14, stiffness: 130 } }),
            [0, 1],
            [0, 1],
          );
          const breathe = frame > 130 ? 1 + Math.sin((frame - 130) / 10 + i) * 0.04 : 1;
          // Convergence vers la timeline (phase 5)
          const convergeT = interpolate(frame, [150, 180], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const baseX = P_HIGGS.x + dx * iconSpring;
          const baseY = P_HIGGS.y + dy * iconSpring;
          const targetX = 760 + i * 200;
          const targetY = 900;
          const x = interpolate(convergeT, [0, 1], [baseX, targetX]);
          const y = interpolate(convergeT, [0, 1], [baseY, targetY]);
          const labelOpacity = interpolate(frame, [start + 6, start + 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={label}
              style={{
                position: "absolute",
                left: x - ICON.sm / 2,
                top: y - ICON.sm / 2,
                width: ICON.sm,
                height: ICON.sm,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                opacity: iconSpring,
                transform: `scale(${convergeT > 0 ? 1 : breathe})`,
              }}
            >
              <div
                style={{
                  width: ICON.sm,
                  height: ICON.sm,
                  borderRadius: "50%",
                  border: `2px solid ${ACCENT}`,
                  background: `${ACCENT}18`,
                }}
              />
              <div
                style={{
                  marginTop: 10,
                  color: INK,
                  fontSize: FONT.micro * 0.6,
                  fontWeight: 700,
                  opacity: labelOpacity,
                }}
              >
                {label}
              </div>
            </div>
          );
        })}

        {/* Timeline de montage */}
        {frame >= 140 && (
          <div
            style={{
              position: "absolute",
              bottom: 140,
              left: 660,
              width: 600,
              height: 60,
              borderRadius: 12,
              background: NEUTRAL_PANEL,
              border: `2px solid ${NEUTRAL_BORDER}`,
              opacity: interpolate(frame, [140, 150], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              transform: `translateY(${interpolate(frame, [140, 150], [40, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}px)`,
              display: "flex",
              alignItems: "center",
              padding: "0 20px",
              gap: 16,
            }}
          >
            {ICONS.map((_, i) => {
              const arriveFrame = 150 + i * 10 + 30;
              const seg = interpolate(frame, [arriveFrame, arriveFrame + 6], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 30,
                    borderRadius: 6,
                    background: ACCENT,
                    transform: `scaleX(${seg})`,
                    transformOrigin: "left",
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Blocs assombris + footer */}
        <div
          style={{
            position: "absolute",
            bottom: 90,
            color: INK,
            fontSize: FONT.micro * 0.65,
            fontWeight: 600,
            opacity:
              frame >= 195
                ? interpolate(frame, [195, 203], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }) * 0.7
                : 0,
          }}
        >
          {footerText}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
