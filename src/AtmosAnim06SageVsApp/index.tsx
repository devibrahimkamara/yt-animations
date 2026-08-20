import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

export const atmosAnim06Schema = z.object({
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(4),
});

export type AtmosAnim06Props = z.infer<typeof atmosAnim06Schema>;

const E = Easing.bezier(0.16, 1, 0.3, 1);

const LEFT_ITEMS = [
  { emoji: "📊", label: "Rapport mensuel", sub: "47 onglets" },
  { emoji: "⚙️", label: "Configuration", sub: "300 options" },
  { emoji: "💳", label: "Facturation", sub: "Modules supplémentaires" },
  { emoji: "🗂️", label: "Dossiers", sub: "Architecture complexe" },
  { emoji: "📉", label: "Analyses", sub: "Graphiques illisibles" },
  { emoji: "🔧", label: "Paramètres", sub: "Technicien requis" },
];

const RIGHT_ITEMS = [
  { emoji: "✅", label: "Tableau de bord simple" },
  { emoji: "✅", label: "3 clics pour tout faire" },
  { emoji: "✅", label: "Pour ta niche uniquement" },
];

export const AtmosAnim06SageVsApp: React.FC<AtmosAnim06Props> = ({
  accentColor = "#3060ff",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card appear
  const cardOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const cardScale = spring({ frame, fps, config: { mass: 0.6, damping: 12, stiffness: 160 }, from: 0.93, to: 1 });

  // Dimming left side progressively
  const leftDim = interpolate(frame, [40, 90], [0, 0.72], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: E,
  });
  const rightBrighten = interpolate(frame, [40, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: E,
  });

  // Divider pulse
  const dividerGlow = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.3, 1]);

  // Chaos offset for left items
  const chaosX = (i: number) =>
    frame > 20 && frame < 50
      ? Math.sin(frame * 0.4 + i * 1.3) * 3
      : 0;
  const chaosY = (i: number) =>
    frame > 20 && frame < 50
      ? Math.cos(frame * 0.3 + i * 1.8) * 2
      : 0;

  // Badge appear
  const badgeScale = (side: "left" | "right") =>
    spring({
      frame: Math.max(0, frame - (side === "left" ? 75 : 90)),
      fps,
      config: { mass: 0.4, damping: 9, stiffness: 240 },
      from: 0,
      to: 1,
    });

  const CARD_W = 1600;
  const CARD_H = 640;
  const HALF = CARD_W / 2;

  return (
    <AbsoluteFill>
      <AuroraBackground />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
        }}
      >
        {/* Main split card */}
        <div
          style={{
            opacity: cardOpacity,
            transform: `scale(${cardScale})`,
            width: CARD_W,
            height: CARD_H,
            borderRadius: 28,
            border: "1px solid rgba(80,130,255,0.2)",
            overflow: "hidden",
            display: "flex",
            position: "relative",
            boxShadow: "0 0 80px rgba(48,96,255,0.15), 0 0 160px rgba(48,96,255,0.08)",
          }}
        >
          {/* Left side — SAGE (complex) */}
          <div
            style={{
              width: HALF,
              height: CARD_H,
              background: "linear-gradient(135deg, rgba(30,10,10,0.7) 0%, rgba(20,5,5,0.8) 100%)",
              padding: "40px 48px",
              display: "flex",
              flexDirection: "column",
              gap: 0,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Dim overlay */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: `rgba(0,0,0,${leftDim})`,
              zIndex: 5,
              pointerEvents: "none",
            }} />

            {/* Header */}
            <div style={{
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontSize: 28,
              fontWeight: 800,
              color: "#ef4444",
              letterSpacing: "-0.01em",
              marginBottom: 24,
            }}>
              ❌ SAGE / Logiciel généraliste
            </div>

            {/* Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {LEFT_ITEMS.map((item, i) => {
                const appear = interpolate(frame, [5 + i * 3, 5 + i * 3 + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      opacity: appear,
                      transform: `translate(${chaosX(i)}px, ${chaosY(i)}px)`,
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.2)",
                      borderRadius: 10,
                      padding: "8px 14px",
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{item.emoji}</span>
                    <div>
                      <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>
                        {item.label}
                      </div>
                      <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 11, fontWeight: 600, color: "rgba(239,68,68,0.6)", letterSpacing: "0.04em" }}>
                        {item.sub}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Badge bottom */}
            <div style={{
              position: "absolute",
              bottom: 28,
              left: 48,
              transform: `scale(${badgeScale("left")})`,
              background: "rgba(239,68,68,0.2)",
              border: "1px solid rgba(239,68,68,0.5)",
              borderRadius: 50,
              padding: "8px 22px",
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontSize: 16,
              fontWeight: 700,
              color: "#ef4444",
              boxShadow: "0 0 16px rgba(239,68,68,0.25)",
            }}>
              TROP COMPLEXE ❌
            </div>
          </div>

          {/* Divider */}
          <div style={{
            width: 2,
            alignSelf: "stretch",
            background: `rgba(255,255,255,${0.15 * dividerGlow})`,
            boxShadow: `0 0 ${8 * dividerGlow}px rgba(255,255,255,${0.3 * dividerGlow})`,
            flexShrink: 0,
          }} />

          {/* Right side — Ton App */}
          <div
            style={{
              flex: 1,
              background: `linear-gradient(135deg, rgba(${Math.round(10 + rightBrighten * 10)},${Math.round(30 + rightBrighten * 30)},${Math.round(10 + rightBrighten * 20)},${0.5 + rightBrighten * 0.2}) 0%, rgba(5,20,10,${0.6 + rightBrighten * 0.2}) 100%)`,
              padding: "40px 48px",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Brighten glow */}
            {rightBrighten > 0.1 && (
              <div style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(ellipse at center, rgba(34,197,94,${0.08 * rightBrighten}) 0%, transparent 70%)`,
                pointerEvents: "none",
              }} />
            )}

            {/* Header */}
            <div style={{
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontSize: 28,
              fontWeight: 800,
              color: "#22c55e",
              letterSpacing: "-0.01em",
              marginBottom: 36,
              opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
            }}>
              ✅ Ton App — ciblée niche
            </div>

            {/* Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {RIGHT_ITEMS.map((item, i) => {
                const appear = spring({
                  frame: Math.max(0, frame - (20 + i * 15)),
                  fps,
                  config: { mass: 0.5, damping: 11, stiffness: 200 },
                  from: 0,
                  to: 1,
                });
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      transform: `scale(${appear})`,
                      background: `rgba(34,197,94,${0.08 + rightBrighten * 0.08})`,
                      border: `1px solid rgba(34,197,94,${0.2 + rightBrighten * 0.2})`,
                      borderRadius: 14,
                      padding: "16px 22px",
                      boxShadow: rightBrighten > 0.3 ? `0 0 16px rgba(34,197,94,${0.1 * rightBrighten})` : "none",
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{item.emoji}</span>
                    <span style={{
                      fontFamily: "Plus Jakarta Sans, sans-serif",
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#ffffff",
                      letterSpacing: "-0.01em",
                    }}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Badge bottom */}
            <div style={{
              position: "absolute",
              bottom: 28,
              left: 48,
              transform: `scale(${badgeScale("right")})`,
              background: "rgba(34,197,94,0.2)",
              border: "1px solid rgba(34,197,94,0.5)",
              borderRadius: 50,
              padding: "8px 22px",
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontSize: 16,
              fontWeight: 700,
              color: "#22c55e",
              boxShadow: "0 0 16px rgba(34,197,94,0.25)",
            }}>
              PARFAIT ✅
            </div>
          </div>
        </div>

        {/* Sub label */}
        <div
          style={{
            opacity: interpolate(frame, [60, 85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontSize: 26,
            fontWeight: 700,
            color: "rgba(136,170,255,0.7)",
            letterSpacing: "0.02em",
          }}
        >
          La niche bat le généraliste à chaque fois
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
