import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700", "800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const gmailTypewriterSchema = z.object({
  to: z.string().default("partnerships@canva.com"),
  subject: z.string().default("Partenariat YouTube — Ibrahim Camara"),
  emailBody: z.string().default("Bonjour,\n\nJe suis YouTubeur avec 50K abonnés dans le domaine du business digital. Je serais ravi de collaborer avec Canva pour une vidéo sponsorisée.\n\nMon audience correspond parfaitement à votre cible.\n\nCordialement,\nIbrahim"),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(4),
});

export type GmailTypewriterProps = z.infer<typeof gmailTypewriterSchema>;

export const GmailTypewriter: React.FC<GmailTypewriterProps> = ({
  to, subject, emailBody, accentColor, durationSecs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = durationSecs * 30;

  const windowScale = spring({ frame, fps, config: { mass: 0.5, damping: 13, stiffness: 180 }, from: 0.92, to: 1 });
  const windowOpacity = interpolate(frame, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });

  // Typewriter for email body — starts at frame 20
  const typeStart = 20;
  const bodyChars = Math.floor(
    interpolate(frame, [typeStart, totalFrames - 15], [0, emailBody.length], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    })
  );
  const displayBody = emailBody.slice(0, bodyChars);

  // Send button pulse near end
  const sendReady = frame >= totalFrames - 25;
  const sendPulse = sendReady ? 1 + 0.05 * Math.sin(frame * 0.25) : 1;

  // Robot "typing" indicator
  const isTyping = bodyChars < emailBody.length;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />

      <AbsoluteFill style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 140px",
      }}>
        <div style={{
          opacity: windowOpacity,
          transform: `scale(${windowScale})`,
          background: "#ffffff",
          borderRadius: 16,
          overflow: "hidden",
          width: "100%",
          maxWidth: 1100,
          boxShadow: "0 20px 80px rgba(0,0,0,0.7)",
        }}>

          {/* Gmail header */}
          <div style={{
            background: "#ea4335",
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}>
            <div style={{ display: "flex", gap: 8 }}>
              {["rgba(255,255,255,0.4)", "rgba(255,255,255,0.4)", "rgba(255,255,255,0.4)"].map((c, i) => (
                <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
              ))}
            </div>
            <div style={{ fontFamily, fontWeight: 700, fontSize: 18, color: "#ffffff", letterSpacing: "0.02em" }}>
              ✉️ Nouveau message — Gmail
            </div>
            {/* Robot typing indicator */}
            <div style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.15)",
              borderRadius: 20,
              padding: "4px 14px",
              opacity: isTyping ? 1 : 0.4,
            }}>
              <span style={{ fontSize: 16 }}>🤖</span>
              <span style={{ fontFamily, fontWeight: 600, fontSize: 14, color: "#fff" }}>
                {isTyping ? "IA en train de rédiger..." : "Terminé ✓"}
              </span>
            </div>
          </div>

          {/* Email fields */}
          <div style={{ padding: "0 28px", borderBottom: "1px solid #eee" }}>
            {/* To */}
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              borderBottom: "1px solid #f0f0f0", padding: "12px 0",
            }}>
              <span style={{ fontFamily, fontWeight: 700, fontSize: 15, color: "#666", width: 50 }}>À :</span>
              <div style={{
                fontFamily, fontWeight: 600, fontSize: 16, color: "#1a1a1a",
                background: "#e8f0fe",
                borderRadius: 20, padding: "3px 12px",
              }}>{to}</div>
            </div>
            {/* Subject */}
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 0",
            }}>
              <span style={{ fontFamily, fontWeight: 700, fontSize: 15, color: "#666", width: 50 }}>Objet :</span>
              <span style={{ fontFamily, fontWeight: 700, fontSize: 17, color: "#1a1a1a" }}>{subject}</span>
            </div>
          </div>

          {/* Email body */}
          <div style={{
            padding: "24px 28px 20px",
            minHeight: 280,
            fontFamily,
            fontWeight: 400,
            fontSize: 18,
            color: "#1a1a1a",
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
          }}>
            {displayBody}
            {isTyping && (
              <span style={{
                display: "inline-block", width: 2, height: 20,
                background: "#1a1a1a", marginLeft: 1, verticalAlign: "middle",
                opacity: Math.abs(Math.sin(frame * 0.3)) > 0.5 ? 1 : 0,
              }} />
            )}
          </div>

          {/* Toolbar */}
          <div style={{
            padding: "12px 28px 20px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderTop: "1px solid #f0f0f0",
          }}>
            <div style={{
              background: sendReady ? "#1a73e8" : "#c0c0c0",
              transform: `scale(${sendPulse})`,
              borderRadius: 24,
              padding: "10px 28px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: sendReady ? "0 2px 12px rgba(26,115,232,0.4)" : "none",
            }}>
              <span style={{ fontFamily, fontWeight: 700, fontSize: 17, color: "#fff" }}>
                {sendReady ? "✓ Envoyer" : "Envoyer"}
              </span>
            </div>
            <div style={{ fontFamily, fontWeight: 600, fontSize: 14, color: "#999", marginLeft: 4 }}>
              {bodyChars} / {emailBody.length} caractères
            </div>
          </div>

        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
