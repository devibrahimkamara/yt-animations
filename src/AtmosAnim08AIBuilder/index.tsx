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

export const atmosAnim08Schema = z.object({
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(5),
});

export type AtmosAnim08Props = z.infer<typeof atmosAnim08Schema>;

const E = Easing.bezier(0.16, 1, 0.3, 1);

const CODE_LINES = [
  { tokens: [{ t: "const", c: "#88aaff" }, { t: " niche", c: "#ffffff" }, { t: " =", c: "#88aaff" }, { t: " 'salons de coiffure'", c: "#ffd700" }] },
  { tokens: [{ t: "const", c: "#88aaff" }, { t: " app", c: "#ffffff" }, { t: " = await", c: "#88aaff" }, { t: " ai.build(niche)", c: "#22c55e" }] },
  { tokens: [{ t: "// Génération du backend...", c: "rgba(136,170,255,0.4)" }] },
  { tokens: [{ t: "app.features.add(", c: "#ffffff" }, { t: "'réservations'", c: "#f59e0b" }, { t: ")", c: "#ffffff" }] },
  { tokens: [{ t: "app.features.add(", c: "#ffffff" }, { t: "'paiements'", c: "#f59e0b" }, { t: ")", c: "#ffffff" }] },
  { tokens: [{ t: "app.features.add(", c: "#ffffff" }, { t: "'gestion clients'", c: "#f59e0b" }, { t: ")", c: "#ffffff" }] },
  { tokens: [{ t: "// Création de l'interface...", c: "rgba(136,170,255,0.4)" }] },
  { tokens: [{ t: "app.ui.theme(", c: "#ffffff" }, { t: "'moderne'", c: "#ec4899" }, { t: ")", c: "#ffffff" }] },
  { tokens: [{ t: "app.ui.responsive(", c: "#ffffff" }, { t: "true", c: "#88aaff" }, { t: ")", c: "#ffffff" }] },
  { tokens: [{ t: "await app.deploy()", c: "#22c55e" }] },
];

const PROMPT_TEXT = "Crée-moi une app de gestion pour salons de coiffure";

export const AtmosAnim08AIBuilder: React.FC<AtmosAnim08Props> = ({
  accentColor = "#3060ff",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card appear
  const cardOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const cardScale = spring({ frame, fps, config: { mass: 0.6, damping: 12, stiffness: 160 }, from: 0.92, to: 1 });

  // Prompt typewriter (frames 10-40)
  const promptChars = Math.round(
    interpolate(frame, [10, 40], [0, PROMPT_TEXT.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: E,
    }),
  );
  const promptDisplay = PROMPT_TEXT.slice(0, promptChars);
  const cursorBlink = Math.floor(frame / 8) % 2 === 0;

  // Code generation (frames 45-110)
  const codeProgress = interpolate(frame, [45, 110], [0, CODE_LINES.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: E,
  });
  const visibleLines = Math.floor(codeProgress);

  // Progress bar (frames 45-110)
  const progressPct = interpolate(frame, [45, 110], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: E,
  });

  // Badge ready (frame 115+)
  const badgeScale = spring({
    frame: Math.max(0, frame - 115),
    fps,
    config: { mass: 0.5, damping: 9, stiffness: 220 },
    from: 0,
    to: 1,
  });
  const badgeOpacity = interpolate(frame, [115, 128], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Code cursor blink
  const codeCursorBlink = Math.floor(frame / 6) % 2 === 0 && frame >= 45 && frame < 115;

  const CARD_W = 1300;
  const CARD_H = 620;

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
        {/* Title */}
        <div
          style={{
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontSize: 36,
            fontWeight: 700,
            color: "rgba(136,170,255,0.85)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            opacity: interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          L'IA code l'application pour toi
        </div>

        {/* IDE window */}
        <div
          style={{
            opacity: cardOpacity,
            transform: `scale(${cardScale})`,
            width: CARD_W,
            height: CARD_H,
            borderRadius: 20,
            overflow: "hidden",
            border: "1px solid rgba(80,130,255,0.22)",
            boxShadow: `0 0 60px ${accentColor}25, 0 0 120px ${accentColor}10`,
          }}
        >
          {/* Window chrome */}
          <div style={{
            height: 40,
            background: "rgba(15,20,60,0.95)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            paddingLeft: 16,
            gap: 8,
          }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#f59e0b" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#22c55e" }} />
            <div style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: "rgba(136,170,255,0.5)",
              letterSpacing: "0.04em",
            }}>
              AI Builder — Claude Sonnet
            </div>
          </div>

          {/* Content: prompt + code panes */}
          <div style={{
            display: "flex",
            height: CARD_H - 40,
            background: "rgba(8,12,40,0.98)",
          }}>
            {/* Left: prompt input pane */}
            <div style={{
              width: 420,
              borderRight: "1px solid rgba(80,130,255,0.15)",
              padding: "24px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}>
              <div style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: "rgba(136,170,255,0.5)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                🤖 Ton prompt
              </div>

              {/* Prompt box */}
              <div style={{
                background: "rgba(48,96,255,0.08)",
                border: `1px solid ${accentColor}40`,
                borderRadius: 12,
                padding: "14px 16px",
                minHeight: 90,
                fontFamily: "monospace",
                fontSize: 15,
                color: "#ffffff",
                lineHeight: 1.6,
              }}>
                {promptDisplay}
                {frame < 42 && cursorBlink && (
                  <span style={{ borderRight: "2px solid #88aaff", marginLeft: 1 }}>&nbsp;</span>
                )}
              </div>

              {/* Send button state */}
              <div style={{
                background: frame >= 42
                  ? "linear-gradient(135deg, rgba(34,197,94,0.3) 0%, rgba(34,197,94,0.15) 100%)"
                  : `linear-gradient(135deg, ${accentColor}30, ${accentColor}15)`,
                border: `1px solid ${frame >= 42 ? "rgba(34,197,94,0.5)" : accentColor + "50"}`,
                borderRadius: 10,
                padding: "10px 20px",
                textAlign: "center",
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: frame >= 42 ? "#22c55e" : "#88aaff",
                letterSpacing: "0.04em",
                opacity: interpolate(frame, [38, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              }}>
                {frame >= 42 ? "✅ En cours de génération..." : "▶ Envoyer"}
              </div>

              {/* Progress bar */}
              <div style={{
                opacity: interpolate(frame, [44, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              }}>
                <div style={{
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "rgba(136,170,255,0.5)",
                  marginBottom: 6,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}>
                  Progression — {Math.round(progressPct)}%
                </div>
                <div style={{
                  height: 6,
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 3,
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%",
                    width: `${progressPct}%`,
                    background: `linear-gradient(90deg, ${accentColor}, #22c55e)`,
                    borderRadius: 3,
                    boxShadow: `0 0 8px ${accentColor}60`,
                    transition: "none",
                  }} />
                </div>
              </div>
            </div>

            {/* Right: code output pane */}
            <div style={{
              flex: 1,
              padding: "24px 28px",
              fontFamily: "monospace",
              fontSize: 14,
              lineHeight: 1.8,
              overflowY: "hidden",
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}>
              <div style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: "rgba(136,170,255,0.5)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}>
                ⚙️ Code généré
              </div>

              {CODE_LINES.slice(0, visibleLines).map((line, i) => (
                <div key={i} style={{ display: "flex", gap: 0 }}>
                  <span style={{
                    color: "rgba(136,170,255,0.25)",
                    width: 32,
                    flexShrink: 0,
                    userSelect: "none",
                    fontSize: 12,
                  }}>
                    {i + 1}
                  </span>
                  {line.tokens.map((tk, j) => (
                    <span key={j} style={{ color: tk.c }}>{tk.t}</span>
                  ))}
                </div>
              ))}

              {/* Code cursor */}
              {codeCursorBlink && visibleLines < CODE_LINES.length && (
                <div style={{ display: "flex" }}>
                  <span style={{ color: "rgba(136,170,255,0.25)", width: 32, fontSize: 12 }}>
                    {visibleLines + 1}
                  </span>
                  <span style={{ borderLeft: "2px solid #88aaff", height: 20 }} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* APP READY badge */}
        <div
          style={{
            transform: `scale(${badgeScale})`,
            opacity: badgeOpacity,
            background: "linear-gradient(135deg, rgba(34,197,94,0.25) 0%, rgba(34,197,94,0.1) 100%)",
            border: "2px solid rgba(34,197,94,0.6)",
            borderRadius: 50,
            padding: "14px 40px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            boxShadow: "0 0 40px rgba(34,197,94,0.3), 0 0 80px rgba(34,197,94,0.12)",
          }}
        >
          <span style={{ fontSize: 28 }}>✅</span>
          <span style={{
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontSize: 28,
            fontWeight: 800,
            color: "#22c55e",
            letterSpacing: "0.04em",
            textShadow: "0 0 20px rgba(34,197,94,0.5)",
          }}>
            APP PRÊTE — en quelques minutes
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
