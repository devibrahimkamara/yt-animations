import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgs2/Stage";
import { ACCENT, INK, NEUTRAL_LINE, FONT } from "../higgs2/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const higgs2Anim01Schema = z.object({
  startDate: z.string().default("28 juillet 2020"),
  endYear: z.number().default(2026),
  yearsCount: z.number().default(6),
  badgeText: z.string().default("100 % de mes revenus"),
});

export type Higgs2Anim01Props = z.infer<typeof higgs2Anim01Schema>;

const SPACING = 460;
const YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
const TRAVEL_X = -(YEARS.length - 1) * SPACING;

export const Higgs2Anim01FriseVieChaine: React.FC<Higgs2Anim01Props> = ({
  startDate,
  yearsCount,
  badgeText,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Séquence A : tracé de la ligne + graduations en cascade
  const lineProgress = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  // ── Séquence B : chute du jalon 2020
  const pinSpring = spring({
    frame: frame - 18,
    fps,
    config: { damping: 10, stiffness: 200, mass: 0.8 },
  });
  const pinY = interpolate(pinSpring, [0, 1], [-150, 0], { extrapolateRight: "clamp" });
  const impactFrame = 40;
  const flash2020 = interpolate(
    frame,
    [impactFrame, impactFrame + 1, impactFrame + 3],
    [0, 0.9, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const grad2020Color = interpolateColors(
    interpolate(frame, [impactFrame + 3, impactFrame + 8], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    [0, 1],
    [NEUTRAL_LINE, ACCENT],
  );
  const dateOpacity = interpolate(frame, [impactFrame, impactFrame + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dateY = interpolate(frame, [impactFrame, impactFrame + 10], [8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // ── Séquence C : micro-respiration du jalon (48 → 72)
  const breathe = frame >= 48 && frame < 72 ? 1 + Math.sin((frame - 48) / 6) * 0.03 : 1;

  // ── Séquence D : travelling + blur en cloche
  const travelX = interpolate(frame, [72, 195], [0, TRAVEL_X], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const travelBlur = interpolate(frame, [72, 130, 195], [0, 2, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flash2026 = interpolate(frame, [188, 189, 192], [0, 0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const grad2026Color = interpolateColors(
    interpolate(frame, [190, 196], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    [0, 1],
    [NEUTRAL_LINE, ACCENT],
  );

  // ── Séquence E : compteur d'années
  const rawCount = interpolate(frame, [195, 235], [0, yearsCount], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const displayCount = Math.round(rawCount);
  const frac = rawCount - Math.floor(rawCount);
  const counterPulse = frame >= 195 && frame < 235 ? 1 + Math.sin(frac * Math.PI) * 0.06 : 1;
  const counterOpacity = interpolate(frame, [195, 205], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Séquence F : badge final
  const badgeSpring = spring({
    frame: frame - 225,
    fps,
    config: { damping: 12, stiffness: 180 },
  });
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.7, 1], { extrapolateRight: "clamp" });
  const badgeY = interpolate(badgeSpring, [0, 1], [12, 0], { extrapolateRight: "clamp" });
  const badgeShadow = 20 + badgeSpring * 40;

  return (
    <Stage outFrames={12}>
      {/* Frise (ligne + graduations + jalon) — un seul translateX pour tout le groupe */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "42%",
            transform: `translateX(${travelX}px)`,
            filter: `blur(${travelBlur}px)`,
          }}
        >
          {/* ligne */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: 5,
              width: (YEARS.length - 1) * SPACING * lineProgress,
              background: NEUTRAL_LINE,
              transformOrigin: "left center",
            }}
          />
          {/* graduations */}
          {YEARS.map((year, i) => {
            const gradDelay = i * 2;
            const gs = spring({
              frame: frame - gradDelay,
              fps,
              config: { damping: 15, stiffness: 120 },
            });
            const isActive2020 = year === 2020;
            const isActive2026 = year === YEARS[YEARS.length - 1];
            const color = isActive2020
              ? grad2020Color
              : isActive2026
                ? grad2026Color
                : NEUTRAL_LINE;
            return (
              <div
                key={year}
                style={{
                  position: "absolute",
                  left: i * SPACING,
                  top: -32,
                  width: 6,
                  height: 64,
                  background: color,
                  opacity: gs,
                  transform: `translateX(-50%) scaleY(${gs}) scale(${
                    isActive2020 ? breathe : 1
                  })`,
                  transformOrigin: "center bottom",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: -10,
                    background: INK,
                    opacity: isActive2020 ? flash2020 : isActive2026 ? flash2026 : 0,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 82,
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontFamily,
                    fontWeight: 800,
                    fontSize: FONT.label,
                    color: color === NEUTRAL_LINE ? "#8E8E93" : INK,
                    whiteSpace: "nowrap",
                  }}
                >
                  {year}
                </div>
              </div>
            );
          })}

          {/* jalon 2020 */}
          {frame >= 18 && (
            <div
              style={{
                position: "absolute",
                left: 0,
                top: -56 + pinY,
                transform: `translateX(-50%) scale(${breathe})`,
                transformOrigin: "center bottom",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50% 50% 50% 0",
                  background: ACCENT,
                  transform: "rotate(-45deg)",
                  boxShadow: `0 0 32px ${ACCENT}aa`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 76,
                  left: "50%",
                  transform: `translateX(-50%) translateY(${dateY}px)`,
                  opacity: dateOpacity,
                  fontFamily,
                  fontWeight: 800,
                  fontSize: FONT.value,
                  color: INK,
                  whiteSpace: "nowrap",
                  textShadow: "0 4px 24px rgba(0,0,0,0.6)",
                }}
              >
                {startDate}
              </div>
            </div>
          )}
        </div>

        {/* Compteur d'années (fixe, centre-bas) */}
        {frame >= 195 && (
          <div
            style={{
              position: "absolute",
              top: "60%",
              left: "50%",
              transform: `translateX(-50%) scale(${counterPulse})`,
              opacity: counterOpacity,
              display: "flex",
              alignItems: "baseline",
              gap: 28,
              fontFamily,
            }}
          >
            <span
              style={{
                fontWeight: 800,
                fontSize: FONT.counter,
                color: ACCENT,
                letterSpacing: "-2px",
              }}
            >
              {displayCount}
            </span>
            <span style={{ fontWeight: 700, fontSize: FONT.value, color: INK }}>ans</span>
          </div>
        )}

        {/* Badge final */}
        {frame >= 225 && (
          <div
            style={{
              position: "absolute",
              top: "80%",
              left: "50%",
              transform: `translateX(-50%) translateY(${badgeY}px) scale(${badgeScale})`,
              padding: "28px 64px",
              borderRadius: 999,
              background: ACCENT,
              color: INK,
              fontFamily,
              fontWeight: 800,
              fontSize: FONT.label,
              whiteSpace: "nowrap",
              boxShadow: `0 ${badgeShadow / 2}px ${badgeShadow}px ${ACCENT}55`,
            }}
          >
            {badgeText}
          </div>
        )}
      </AbsoluteFill>
    </Stage>
  );
};
