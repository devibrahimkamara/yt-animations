import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgs2/Stage";
import { Emoji } from "../higgs2/Emoji";
import { ACCENT, INK, FB_BLUE, IG_PINK, YT_RED, FONT, ICON } from "../higgs2/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const higgs2Anim05Schema = z.object({
  badgeText: z.string().default("€ / 1 000 vues"),
});

export type Higgs2Anim05Props = z.infer<typeof higgs2Anim05Schema>;

const BASELINE_Y = 930;
const BAR_W = 150;
const MAX_H = 620;
const CENTER_X = 960;

type Bar = {
  key: string;
  logo: string;
  color: string;
  frac: number;
  fromFrame: number;
  toFrame: number;
  offsetX: number;
  heavy?: boolean;
};

const BARS: Bar[] = [
  { key: "fb", logo: "📘", color: FB_BLUE, frac: 0.32, fromFrame: 12, toFrame: 57, offsetX: -390 },
  { key: "ig", logo: "📸", color: IG_PINK, frac: 0.47, fromFrame: 24, toFrame: 78, offsetX: -130 },
  { key: "tt", logo: "🎵", color: "#111318", frac: 0.62, fromFrame: 36, toFrame: 96, offsetX: 130 },
  { key: "yt", logo: "▶️", color: YT_RED, frac: 0.96, fromFrame: 48, toFrame: 108, offsetX: 390, heavy: true },
];

export const Higgs2Anim05PodiumPlateformes: React.FC<Higgs2Anim05Props> = ({ badgeText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const baseScaleX = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const badgeSpring = spring({ frame: frame - 108, fps, config: { damping: 12, stiffness: 180 } });
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.6, 1], { extrapolateRight: "clamp" });
  const badgeY = interpolate(badgeSpring, [0, 1], [10, 0], { extrapolateRight: "clamp" });

  const ytFlash = interpolate(frame, [108, 110, 112], [0, 0.3, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ytGlowBreath = 1 + Math.sin(frame / 20) * 0.15;

  const heights: Record<string, number> = {};
  BARS.forEach((bar) => {
    const s = spring({
      frame: frame - bar.fromFrame,
      fps,
      config: bar.heavy
        ? { damping: 18, stiffness: 90, mass: 1.4 }
        : { damping: 14, stiffness: 130 },
    });
    heights[bar.key] = s * bar.frac * MAX_H;
  });

  return (
    <Stage outFrames={25}>
      <AbsoluteFill>
        {/* socle */}
        <div
          style={{
            position: "absolute",
            top: BASELINE_Y,
            left: CENTER_X - 560,
            width: 1120,
            height: 6,
            background: "#5a6070",
            transform: `scaleX(${baseScaleX})`,
          }}
        />

        {BARS.map((bar, i) => {
          const h = heights[bar.key];
          const isYT = bar.key === "yt";
          const grayStart = 132 + i * 4;
          const gray = isYT
            ? 0
            : interpolate(frame, [grayStart, grayStart + 16], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
          const logoReveal = interpolate(h, [bar.frac * MAX_H * 0.9, bar.frac * MAX_H], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const logoSpring = spring({
            frame: frame - (bar.toFrame - 8),
            fps,
            config: { damping: 10, stiffness: 220 },
          });
          const x = CENTER_X + bar.offsetX - BAR_W / 2;

          return (
            <div key={bar.key}>
              {/* emplacement vide */}
              <div
                style={{
                  position: "absolute",
                  left: x,
                  top: BASELINE_Y - MAX_H * bar.frac,
                  width: BAR_W,
                  height: MAX_H * bar.frac,
                  border: "2px solid rgba(255,255,255,0.12)",
                  borderRadius: 8,
                  opacity: interpolate(frame, [0, 12], [0, 0.3], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              />
              {/* barre */}
              <div
                style={{
                  position: "absolute",
                  left: x,
                  top: BASELINE_Y - h,
                  width: BAR_W,
                  height: h,
                  borderRadius: "8px 8px 0 0",
                  background:
                    bar.key === "tt"
                      ? "linear-gradient(180deg, #25F4EE 0%, #111318 45%, #FE2C55 100%)"
                      : bar.color,
                  filter: `grayscale(${gray})`,
                  boxShadow: isYT
                    ? `0 0 ${40 * ytGlowBreath * interpolate(frame, [132, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px ${YT_RED}aa`
                    : "none",
                }}
              >
                <div style={{ position: "absolute", inset: 0, background: INK, opacity: isYT ? ytFlash : 0 }} />
              </div>
              {/* logo en tête */}
              <div
                style={{
                  position: "absolute",
                  left: CENTER_X + bar.offsetX,
                  top: BASELINE_Y - h - ICON.md - 24,
                  transform: `translateX(-50%) scale(${(isYT ? logoSpring : logoReveal * logoSpring) || 0.01})`,
                  filter: `grayscale(${gray})`,
                  opacity: isYT ? 1 : 1 - gray * 0.4,
                }}
              >
                <Emoji size={ICON.md}>{bar.logo}</Emoji>
              </div>
            </div>
          );
        })}

        {/* badge sur YouTube */}
        {frame >= 108 && (
          <div
            style={{
              position: "absolute",
              left: CENTER_X + 390,
              top: BASELINE_Y - heights.yt - ICON.md - 145,
              transform: `translate(-50%, ${badgeY}px) scale(${badgeScale})`,
              padding: "24px 56px",
              borderRadius: 999,
              background: ACCENT,
              color: INK,
              fontFamily,
              fontWeight: 800,
              fontSize: FONT.label,
              whiteSpace: "nowrap",
              boxShadow: `0 0 ${50 + badgeSpring * 50}px ${ACCENT}aa`,
            }}
          >
            {badgeText}
          </div>
        )}
      </AbsoluteFill>
    </Stage>
  );
};
