import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsMarketing/Stage";
import { pathFromPoints, pointAtProgress, polylineLength, type Pt } from "../higgsMarketing/utils";
import { ACCENT, ATMOS_ERROR, FONT, INK, mulberry32 } from "../higgsMarketing/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});

// Anim 2 — « La courbe de saison » (180 frames / 6 s @ 30 fps)
// Phase 1 cadre 0–15 · Phase 2 tracé plat 15–90 · Phase 3 envolée 90–130 ·
// Phase 4 neige 100–180 · Phase 5 pic + label 130–155 · Phase 6 maintien 155–180
//
// Toutes les coordonnées de cette animation sont locales au cadre 1400×760
// (pas de canvas 1920×1080 virtuel avec offset) pour éviter tout clipping
// par l'overflow:hidden du cadre.

export const higgsMarketingAnim02Schema = z.object({
  title: z.string().default("Demande de vidéos personnalisées"),
  peakLabel: z.string().default("Noël"),
});
export type HiggsMarketingAnim02Props = z.infer<
  typeof higgsMarketingAnim02Schema
>;

const CARD_W = 1400;
const CARD_H = 760;
const CHART_LEFT = 100;
const CHART_RIGHT = 1300;
const AXIS_Y = 640;
const CHART_BASE = 600;
const CHART_PEAK = 320;
const SNOW_TOP = 300;

const rngCurve = mulberry32(2001);
const FLAT_POINTS: Pt[] = Array.from({ length: 24 }, (_, i) => {
  const x = CHART_LEFT + ((CHART_RIGHT - CHART_LEFT) * 0.85 * i) / 23;
  const y = CHART_BASE + (rngCurve() * 2 - 1) * 12;
  return { x, y };
});
const SURGE_POINTS: Pt[] = Array.from({ length: 10 }, (_, i) => {
  const t = i / 9;
  const x = FLAT_POINTS[23].x + (CHART_RIGHT - FLAT_POINTS[23].x) * t;
  const y = FLAT_POINTS[23].y + (CHART_PEAK - FLAT_POINTS[23].y) * Math.pow(t, 1.6);
  return { x, y };
});
const ALL_POINTS = [...FLAT_POINTS, ...SURGE_POINTS];
const FLAT_LEN = polylineLength(FLAT_POINTS);
const SURGE_LEN = polylineLength(SURGE_POINTS);
const TOTAL_LEN = FLAT_LEN + SURGE_LEN;
const PEAK_POINT = SURGE_POINTS[SURGE_POINTS.length - 1];

const rngSnow = mulberry32(2002);
const SNOWFLAKES = Array.from({ length: 18 }, () => ({
  x: CHART_LEFT + rngSnow() * (CHART_RIGHT - CHART_LEFT),
  speed: 1.1 + rngSnow() * 1.5,
  swayFreq: 0.03 + rngSnow() * 0.04,
  swayAmp: 10 + rngSnow() * 16,
  size: 6 + rngSnow() * 8,
  startDelay: Math.floor(rngSnow() * 30),
}));

export const HiggsMarketingAnim02CourbeSaison: React.FC<
  HiggsMarketingAnim02Props
> = ({ title, peakLabel }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1
  const frameScale = interpolate(frame, [0, 15], [0.95, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const frameOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [0, 15], [-10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 2 — tracé plat (15→90) puis Phase 3 — envolée (90→130)
  const flatProgress = interpolate(frame, [15, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const surgeProgress = interpolate(frame, [90, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const drawnLen = flatProgress * FLAT_LEN + surgeProgress * SURGE_LEN;
  const overallProgress = TOTAL_LEN > 0 ? drawnLen / TOTAL_LEN : 0;
  const cursor = pointAtProgress(ALL_POINTS, overallProgress);
  const pathD = pathFromPoints(ALL_POINTS);

  // Phase 5 — pic + label
  const pointSpring = spring({
    frame: frame - 130,
    fps,
    config: { damping: 9, stiffness: 160 },
  });
  const pointScale = interpolate(pointSpring, [0, 1], [1, 1.6]);
  const pulse =
    frame >= 140 ? 1.3 + Math.sin((frame - 140) * 0.5) * 0.075 : pointScale;
  const finalScale = frame < 130 ? 0 : frame < 140 ? pointScale : pulse;
  const labelOpacity = interpolate(frame, [138, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelY = interpolate(frame, [138, 150], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage outFrames={10}>
      <AbsoluteFill style={{ fontFamily, justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            position: "relative",
            width: CARD_W,
            height: CARD_H,
            borderRadius: 24,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.12)",
            opacity: frameOpacity,
            transform: `scale(${frameScale})`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 40,
              left: 0,
              right: 0,
              textAlign: "center",
              fontSize: FONT.label,
              fontWeight: 700,
              color: INK,
              opacity: frameOpacity,
              transform: `translateY(${titleY}px)`,
            }}
          >
            {title}
          </div>

          <svg
            width={CARD_W}
            height={CARD_H}
            viewBox={`0 0 ${CARD_W} ${CARD_H}`}
            style={{ position: "absolute", inset: 0, overflow: "visible" }}
          >
            <line
              x1={CHART_LEFT}
              y1={AXIS_Y}
              x2={CHART_RIGHT}
              y2={AXIS_Y}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth={2}
            />
            <path
              d={pathD}
              fill="none"
              stroke={ACCENT}
              strokeWidth={7}
              strokeLinecap="round"
              style={{
                strokeDasharray: TOTAL_LEN,
                strokeDashoffset: TOTAL_LEN * (1 - overallProgress),
              }}
            />
            {overallProgress > 0 && overallProgress < 1 && (
              <circle cx={cursor.x} cy={cursor.y} r={10} fill={ACCENT} />
            )}
            {frame >= 130 && (
              <circle
                cx={PEAK_POINT.x}
                cy={PEAK_POINT.y}
                r={14}
                fill={ACCENT}
                style={{ transformOrigin: `${PEAK_POINT.x}px ${PEAK_POINT.y}px`, transform: `scale(${finalScale})` }}
              />
            )}

            {frame >= 100 &&
              SNOWFLAKES.map((f, i) => {
                const local = frame - 100 - f.startDelay;
                if (local < 0) return null;
                const y = SNOW_TOP + local * f.speed;
                if (y > AXIS_Y + 40) return null;
                const x = f.x + Math.sin(local * f.swayFreq) * f.swayAmp;
                const opacity = interpolate(local, [0, 10], [0, 0.85], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={f.size / 2}
                    fill="#fff"
                    opacity={opacity}
                  />
                );
              })}
          </svg>

          {frame >= 130 && (
            <div
              style={{
                position: "absolute",
                left: PEAK_POINT.x - 70,
                top: PEAK_POINT.y - 90,
                opacity: labelOpacity,
                transform: `translateY(${labelY}px)`,
                background: ATMOS_ERROR,
                color: "#fff",
                borderRadius: 999,
                padding: "10px 24px",
                fontSize: FONT.micro * 0.6,
                fontWeight: 800,
                whiteSpace: "nowrap",
              }}
            >
              ❄️ {peakLabel}
            </div>
          )}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
