import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const inboxNotificationsSchema = z.object({
  emails: z.array(z.object({
    from: z.string(),
    subject: z.string(),
    preview: z.string(),
    tag: z.string(),
    tagColor: z.string(),
  })).default([
    { from: "Canva Partenariats", subject: "Intéressé — Parlons-en", preview: "Merci pour votre email ! Nous serions ravis de...", tag: "Intéressé", tagColor: "#22c55e" },
    { from: "Grammarly Marques", subject: "Partenariat — On se parle ?", preview: "Bonjour, votre profil correspond exactement à...", tag: "Réponse positive", tagColor: "#3060ff" },
    { from: "Adobe Creative", subject: "Partenariat — Confirmé ✓", preview: "Nous confirmons notre partenariat pour Q2...", tag: "Confirmé ✓", tagColor: "#f59e0b" },
  ]),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(4),
});

export type InboxNotificationsProps = z.infer<typeof inboxNotificationsSchema>;

const EMAIL_STAGGER = 28;
const EMAILS_START = 15;

export const InboxNotifications: React.FC<InboxNotificationsProps> = ({
  emails, accentColor, durationSecs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Progressive green overlay as more emails arrive
  const successProgress = interpolate(
    frame,
    [EMAILS_START, EMAILS_START + emails.length * EMAIL_STAGGER],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />
      {/* Subtle green tint as emails arrive */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at center, rgba(20,80,30,${successProgress * 0.25}) 0%, rgba(0,0,0,0) 70%)`,
        pointerEvents: "none",
      }} />

      <AbsoluteFill style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        padding: "0 160px",
      }}>

        {/* Header */}
        <div style={{
          opacity: headerOpacity,
          display: "flex",
          alignItems: "center",
          gap: 16,
          width: "100%",
          maxWidth: 920,
        }}>
          <div style={{ fontSize: 40 }}>📬</div>
          <div>
            <div style={{ fontFamily, fontWeight: 800, fontSize: 30, color: "#ffffff", letterSpacing: "0.02em" }}>
              Boîte de réception
            </div>
            <div style={{ fontFamily, fontWeight: 600, fontSize: 18, color: "rgba(100,180,100,0.7)", letterSpacing: "0.04em" }}>
              {Math.floor(successProgress * emails.length)} réponse{Math.floor(successProgress * emails.length) > 1 ? "s" : ""} reçue{Math.floor(successProgress * emails.length) > 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Email notifications */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%", maxWidth: 920 }}>
          {emails.map((email, i) => {
            const start = EMAILS_START + i * EMAIL_STAGGER;
            const opacity = interpolate(frame, [start, start + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });
            const x = interpolate(frame, [start, start + 14], [80, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });
            const itemScale = spring({ frame: Math.max(0, frame - start), fps, config: { mass: 0.4, damping: 9, stiffness: 260 }, from: 0.9, to: 1 });

            return (
              <div key={i} style={{
                opacity,
                transform: `translateX(${x}px) scale(${itemScale})`,
                background: `linear-gradient(135deg, rgba(10,30,60,0.85), rgba(5,20,40,0.75))`,
                border: `1.5px solid ${email.tagColor}40`,
                borderLeft: `4px solid ${email.tagColor}`,
                borderRadius: 14,
                padding: "18px 24px",
                display: "flex",
                alignItems: "center",
                gap: 18,
                boxShadow: `0 0 24px ${email.tagColor}15`,
              }}>

                {/* Avatar */}
                <div style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: `${email.tagColor}25`,
                  border: `1.5px solid ${email.tagColor}50`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily, fontWeight: 800, fontSize: 18, color: email.tagColor,
                  flexShrink: 0,
                }}>
                  {email.from[0]}
                </div>

                {/* Content */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ fontFamily, fontWeight: 800, fontSize: 20, color: "#ffffff" }}>
                      {email.from}
                    </div>
                    {/* Tag */}
                    <div style={{
                      fontFamily, fontWeight: 700, fontSize: 13,
                      color: email.tagColor,
                      background: `${email.tagColor}18`,
                      border: `1px solid ${email.tagColor}40`,
                      borderRadius: 20,
                      padding: "2px 12px",
                      letterSpacing: "0.04em",
                    }}>
                      {email.tag}
                    </div>
                  </div>
                  <div style={{ fontFamily, fontWeight: 700, fontSize: 18, color: "rgba(200,220,255,0.9)" }}>
                    {email.subject}
                  </div>
                  <div style={{ fontFamily, fontWeight: 400, fontSize: 15, color: "rgba(120,150,200,0.65)", lineHeight: 1.4 }}>
                    {email.preview}
                  </div>
                </div>

                {/* Check icon */}
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: `${email.tagColor}20`,
                  border: `1.5px solid ${email.tagColor}60`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: 18, color: email.tagColor }}>✓</span>
                </div>

              </div>
            );
          })}
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
