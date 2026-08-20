import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const timelineCardSchema = z.object({
  events: z.array(z.object({
    year: z.string(),
    label: z.string(),
    emoji: z.string().optional(),
    isPositive: z.boolean().default(false),
  })),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(5),
});

export type TimelineCardProps = z.infer<typeof timelineCardSchema>;

export const TimelineCard: React.FC<TimelineCardProps> = ({ events, accentColor, durationSecs }) => {
  const frame = useCurrentFrame();
  const totalFrames = durationSecs * 30;

  const containerOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });

  // Ligne principale dessinée gauche→droite
  const lineWidth = 900;
  const lineProgress = interpolate(frame, [10, 45], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });

  // Flash de transition violente à frame 50
  const flashOpacity = interpolate(frame, [48, 50, 55], [0, 0.5, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  // Shake à frame 50
  const shakeX = frame >= 48 && frame <= 56 ? Math.sin(frame * 18) * 8 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />

      {/* Flash de transition */}
      {flashOpacity > 0 && (
        <AbsoluteFill style={{ background: "rgba(255,255,255,1)", opacity: flashOpacity }} />
      )}

      <AbsoluteFill style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: containerOpacity,
        transform: `translateX(${shakeX}px)`,
      }}>
        <div style={{ position: "relative", width: lineWidth, display: "flex", flexDirection: "column", alignItems: "center" }}>

          {/* Ligne horizontale */}
          <svg width={lineWidth} height={8} style={{ position: "absolute", top: "50%", marginTop: -4 }}>
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(136,170,255,0.1)" />
                <stop offset="30%" stopColor="rgba(136,170,255,0.8)" />
                <stop offset="70%" stopColor="rgba(136,170,255,0.8)" />
                <stop offset="100%" stopColor="rgba(136,170,255,0.1)" />
              </linearGradient>
            </defs>
            <rect x={0} y={0} width={lineWidth * lineProgress} height={8} rx={4} fill="url(#lineGrad)" />
          </svg>

          {/* Événements */}
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", paddingTop: 0 }}>
            {events.map((event, i) => {
              const dotStart = 20 + i * 25;
              const dotScale = interpolate(frame, [dotStart, dotStart + 12], [0, 1], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
              });
              const textOpacity = interpolate(frame, [dotStart + 8, dotStart + 20], [0, 1], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
              });

              const isTop = i % 2 === 0;
              const dotColor = event.isPositive ? "#40ff80" : accentColor === "#3060ff" ? "#88aaff" : accentColor;

              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, width: 200 }}>
                  {/* Texte au-dessus si isTop */}
                  {isTop && (
                    <div style={{ opacity: textOpacity, textAlign: "center", marginBottom: 16, paddingBottom: 8 }}>
                      {event.emoji && <div style={{ fontSize: 40, marginBottom: 8 }}>{event.emoji}</div>}
                      <div style={{ fontFamily, fontWeight: 800, fontSize: 36, color: event.isPositive ? "#40ff80" : "#ffffff" }}>{event.year}</div>
                      <div style={{ fontFamily, fontWeight: 600, fontSize: 20, color: "rgba(136,170,255,0.85)", marginTop: 4, lineHeight: 1.3 }}>{event.label}</div>
                    </div>
                  )}

                  {/* Point sur la ligne */}
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: dotColor,
                    boxShadow: `0 0 20px ${dotColor}, 0 0 40px ${dotColor}60`,
                    transform: `scale(${dotScale})`,
                    flexShrink: 0,
                    zIndex: 1,
                  }} />

                  {/* Texte en-dessous si !isTop */}
                  {!isTop && (
                    <div style={{ opacity: textOpacity, textAlign: "center", marginTop: 16, paddingTop: 8 }}>
                      {event.emoji && <div style={{ fontSize: 40, marginBottom: 8 }}>{event.emoji}</div>}
                      <div style={{ fontFamily, fontWeight: 800, fontSize: 36, color: event.isPositive ? "#40ff80" : "#ffffff" }}>{event.year}</div>
                      <div style={{ fontFamily, fontWeight: 600, fontSize: 20, color: "rgba(136,170,255,0.85)", marginTop: 4, lineHeight: 1.3 }}>{event.label}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
