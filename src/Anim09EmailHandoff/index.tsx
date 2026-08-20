import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700", "800"], subsets: ["latin"] });
const EASE = Easing.bezier(0.16, 1, 0.3, 1);

export const anim09Schema = z.object({
  from: z.string().default("Nike France — partnerships@nike.fr"),
  subject: z.string().default("Partenariat YouTube — On est intéressés ! 🎯"),
  preview: z.string().default("Bonjour Ibrahim, nous avons découvert votre chaîne et nous aimerions discuter…"),
  accentColor: z.string().default("#3b82f6"),
  durationSecs: z.number().default(6),
});

export const Anim09EmailHandoff: React.FC<z.infer<typeof anim09Schema>> = ({
  from, subject, preview, accentColor, durationSecs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  void durationSecs;

  // Inbox appears
  const inboxS = spring({ frame, fps, config: { mass: 0.5, damping: 10, stiffness: 180 } });

  // Notification badge
  const notifStart = 20;
  const notifS = spring({ frame: frame - notifStart, fps, config: { mass: 0.4, damping: 8, stiffness: 280 } });

  // Email row slides in
  const emailStart = 35;
  const emailX = interpolate(frame, [emailStart, emailStart + 22], [60, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const emailOp = interpolate(frame, [emailStart, emailStart + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Handoff panel
  const handoffStart = 95;
  const handoffOp = interpolate(frame, [handoffStart, handoffStart + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const handoffY = interpolate(frame, [handoffStart, handoffStart + 22], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

  // Arrow pulse in handoff
  const arrowPulse = 0.7 + 0.3 * Math.abs(Math.sin(frame * 0.1));

  // Green dot pulse
  const dotPulse = 0.6 + 0.4 * Math.abs(Math.sin(frame * 0.12));

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 120px", gap: 36 }}>

        {/* Inbox card */}
        <div style={{
          width: "100%",
          opacity: inboxS, transform: `scale(${0.9 + inboxS * 0.1})`,
          background: "linear-gradient(135deg, rgba(14,30,92,0.82), rgba(8,18,58,0.78))",
          border: "1.5px solid rgba(80,130,255,0.32)",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 0 50px rgba(59,130,246,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}>
          {/* Header bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "20px 32px",
            borderBottom: "1px solid rgba(80,130,255,0.18)",
            background: "rgba(10,22,70,0.6)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: 30 }}>📬</div>
              <div style={{ fontFamily, fontWeight: 800, fontSize: 30, color: "rgba(220,235,255,0.92)" }}>Boîte de réception</div>
            </div>
            {/* Notification badge */}
            <div style={{
              opacity: notifS, transform: `scale(${notifS})`,
              background: "#ef4444",
              borderRadius: 20, padding: "6px 18px",
              fontFamily, fontWeight: 800, fontSize: 22,
              color: "#fff",
              boxShadow: "0 0 20px rgba(239,68,68,0.5)",
            }}>
              1 nouveau
            </div>
          </div>

          {/* Email row */}
          <div style={{
            opacity: emailOp, transform: `translateX(${emailX}px)`,
            display: "flex", alignItems: "center", gap: 22,
            padding: "28px 32px",
            background: "rgba(59,130,246,0.08)",
            borderBottom: "1px solid rgba(80,130,255,0.12)",
            position: "relative",
          }}>
            {/* Unread dot */}
            <div style={{
              width: 14, height: 14, borderRadius: "50%",
              background: accentColor,
              boxShadow: `0 0 10px ${accentColor}`,
              flexShrink: 0,
              opacity: dotPulse,
            }} />

            {/* Sender avatar */}
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(59,130,246,0.6), rgba(30,70,180,0.7))",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              fontSize: 26,
              border: "1.5px solid rgba(80,130,255,0.35)",
            }}>
              🏢
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontFamily, fontWeight: 800, fontSize: 26, color: "rgba(220,235,255,0.95)" }}>{from}</div>
              <div style={{ fontFamily, fontWeight: 700, fontSize: 22, color: "rgba(180,205,255,0.85)" }}>{subject}</div>
              <div style={{ fontFamily, fontWeight: 400, fontSize: 19, color: "rgba(130,155,210,0.65)", fontStyle: "italic" }}>{preview}</div>
            </div>

            {/* New tag */}
            <div style={{
              background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.45)",
              borderRadius: 12, padding: "6px 16px",
              fontFamily, fontWeight: 700, fontSize: 18, color: "#4ade80",
              flexShrink: 0,
            }}>
              ✨ Nouveau
            </div>
          </div>

          {/* Empty rows suggestion */}
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{
              padding: "20px 32px",
              borderBottom: "1px solid rgba(80,130,255,0.07)",
              display: "flex", alignItems: "center", gap: 22, opacity: 0.22,
            }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(80,80,100,0.3)", flexShrink: 0 }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ height: 18, background: "rgba(255,255,255,0.12)", borderRadius: 8, width: "45%" }} />
                <div style={{ height: 15, background: "rgba(255,255,255,0.08)", borderRadius: 8, width: "70%" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Handoff panel */}
        <div style={{
          opacity: handoffOp, transform: `translateY(${handoffY}px)`,
          width: "100%",
          background: "linear-gradient(135deg, rgba(50,35,0,0.82), rgba(35,22,0,0.78))",
          border: "2px solid rgba(255,215,0,0.45)",
          borderRadius: 22,
          padding: "28px 40px",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 36,
          boxShadow: "0 0 40px rgba(255,215,0,0.15)",
        }}>
          {/* Robot */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 52 }}>🤖</div>
            <div style={{ fontFamily, fontWeight: 700, fontSize: 20, color: "rgba(200,215,255,0.7)" }}>Agent IA</div>
            <div style={{ fontFamily, fontWeight: 600, fontSize: 16, color: "rgba(140,165,220,0.5)", letterSpacing: "0.06em", textTransform: "uppercase" }}>a trouvé</div>
          </div>

          {/* Arrow */}
          <svg width="80" height="32" viewBox="0 0 80 32" fill="none" style={{ opacity: arrowPulse }}>
            <path d="M0,16 L60,16" stroke="rgba(255,215,0,0.6)" strokeWidth="2.5" strokeDasharray="6,4" />
            <path d="M55,8 L80,16 L55,24" stroke="rgba(255,215,0,0.6)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>

          {/* Human */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 52 }}>👤</div>
            <div style={{ fontFamily, fontWeight: 800, fontSize: 20, color: "#ffd700" }}>Ibrahim</div>
            <div style={{ fontFamily, fontWeight: 600, fontSize: 16, color: "rgba(255,215,0,0.55)", letterSpacing: "0.06em", textTransform: "uppercase" }}>prend le relais</div>
          </div>

          {/* Separator */}
          <div style={{ width: 1, height: 60, background: "rgba(255,215,0,0.2)" }} />

          {/* Message */}
          <div style={{ fontFamily, fontWeight: 700, fontSize: 26, color: "rgba(255,235,150,0.88)", lineHeight: 1.4, maxWidth: 400 }}>
            Quand une marque répond,<br />c'est toi qui gères 💪
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
