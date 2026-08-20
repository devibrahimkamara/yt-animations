import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

export const highsfieldAnim01Schema = z.object({
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(4),
});

type Props = z.infer<typeof highsfieldAnim01Schema>;

const BILLS = ["💸", "💶", "💸", "💶", "💸", "💶", "💸", "💶"];

export const HighsfieldAnim01MoneyCounter: React.FC<Props> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Phase 1: container enters (0–15)
  const containerSpring = spring({ frame, fps, config: { mass: 0.5, damping: 10, stiffness: 180 } });
  const containerScale = interpolate(containerSpring, [0, 1], [0.8, 1]);

  // Phase 2: count 0→60000 (15–90)
  const rawCount = interpolate(frame, [15, 90], [0, 60000], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE,
  });
  const count = Math.round(rawCount);
  const formatted = count.toLocaleString("fr-FR").replace(/,/g, " ");

  // Phase 3: pulse at end (90–120)
  const pulseFactor = frame >= 90
    ? 1 + Math.sin(interpolate(frame, [90, 120], [0, Math.PI], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })) * 0.08
    : 1;
  const glowIntensity = frame >= 90 ? interpolate(frame, [90, 105], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity: fadeOut }}>
      <AuroraBackground />

      <AbsoluteFill style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          opacity: containerSpring,
          transform: `scale(${containerScale * pulseFactor})`,
          background: "linear-gradient(135deg, rgba(10,10,30,0.88), rgba(5,5,20,0.82))",
          border: `2px solid rgba(48,96,255,0.5)`,
          borderRadius: 28,
          padding: "52px 80px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          position: "relative",
          overflow: "hidden",
          boxShadow: `0 0 ${40 + glowIntensity * 60}px rgba(48,96,255,${0.15 + glowIntensity * 0.35}), inset 0 1px 0 rgba(255,255,255,0.06)`,
          minWidth: 640,
        }}>

          {/* Flying bills — active during counting phase */}
          {frame >= 15 && frame < 90 && BILLS.map((bill, i) => {
            const billDelay = i * 9;
            const billFrame = frame - 15 - billDelay;
            if (billFrame < 0 || billFrame > 50) return null;
            const billProgress = billFrame / 50;
            const arcX = (i % 2 === 0 ? 1 : -1) * Math.sin(billProgress * Math.PI) * 80;
            const arcY = -billProgress * 120 - Math.sin(billProgress * Math.PI) * 40;
            const billOp = interpolate(billProgress, [0.6, 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={i} style={{
                position: "absolute",
                fontSize: 40,
                left: `${20 + (i * 10) % 60}%`,
                top: "40%",
                transform: `translate(${arcX}px, ${arcY}px) rotate(${i * 15 - 30}deg)`,
                opacity: billOp,
                pointerEvents: "none",
              }}>
                {bill}
              </div>
            );
          })}

          {/* "+60 000 €" */}
          <div style={{
            display: "flex",
            alignItems: "baseline",
            gap: 4,
          }}>
            <span style={{
              fontFamily, fontWeight: 800, fontSize: 72,
              color: "#ef4444",
              letterSpacing: "-0.01em",
              lineHeight: 1,
            }}>+</span>
            <span style={{
              fontFamily, fontWeight: 800, fontSize: 96,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              textShadow: `0 0 ${20 + glowIntensity * 40}px rgba(255,255,255,${0.2 + glowIntensity * 0.4})`,
            }}>
              {formatted}
            </span>
            <span style={{
              fontFamily, fontWeight: 800, fontSize: 72,
              color: "#ffffff",
              opacity: 0.85,
              letterSpacing: "-0.01em",
              lineHeight: 1,
            }}> €</span>
          </div>

          <div style={{
            fontFamily, fontWeight: 600, fontSize: 22,
            color: "rgba(160,175,220,0.7)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}>
            dépensé sur Upwork
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
