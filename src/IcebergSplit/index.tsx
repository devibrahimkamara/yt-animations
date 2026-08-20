import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });

export const icebergSplitSchema = z.object({
  chatgptQuestions: z.array(z.string()).default([
    "Comment gagner de l'argent ?",
    "Écris-moi un email",
    "Donne-moi des idées",
  ]),
  icebergVisible: z.string().default("Poser des questions"),
  icebergHidden: z.array(z.string()).default(["Automatisation", "Agents IA", "Systèmes", "Business"]),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(8),
});

export type IcebergSplitProps = z.infer<typeof icebergSplitSchema>;

const QUESTION_FRAMES = 50;

export const IcebergSplit: React.FC<IcebergSplitProps> = ({
  chatgptQuestions, icebergVisible, icebergHidden, accentColor, durationSecs,
}) => {
  const frame = useCurrentFrame();
  const totalFrames = durationSecs * 30;

  const containerOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Character enter
  const charOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const charY = interpolate(frame, [0, 18], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Typewriter — cycle through questions
  const currentQuestionIdx = Math.min(Math.floor(frame / QUESTION_FRAMES), chatgptQuestions.length - 1);
  const questionFrame = frame % QUESTION_FRAMES;
  const currentQuestion = chatgptQuestions[currentQuestionIdx];
  const charCount = Math.floor(
    interpolate(questionFrame, [0, QUESTION_FRAMES - 10], [0, currentQuestion.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );

  // Badge "10% du potentiel" — appears at frame 200
  const badgeOpacity = interpolate(frame, [200, 220], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const badgeScale = interpolate(frame, [200, 215], [0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Iceberg water reveal
  const waterRevealProgress = interpolate(frame, [40, totalFrames - 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Wave animation on water surface
  const waveOffset = Math.sin(frame * 0.08) * 4;

  const dividerOpacity = interpolate(frame, [8, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />

      <AbsoluteFill style={{ opacity: containerOpacity, display: "flex" }}>

        {/* ── LEFT: Character + ChatGPT mock ── */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "50px 50px",
          gap: 24,
        }}>

          {/* Personnage simplifié */}
          <div style={{
            opacity: charOpacity,
            transform: `translateY(${charY}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}>
            <svg width="90" height="120" viewBox="0 0 90 120" fill="none">
              {/* Head */}
              <circle cx="45" cy="24" r="20" fill="rgba(200,220,255,0.88)" />
              {/* Eyes */}
              <circle cx="38" cy="22" r="3" fill="rgba(20,30,80,0.8)" />
              <circle cx="52" cy="22" r="3" fill="rgba(20,30,80,0.8)" />
              {/* Mouth */}
              <path d="M38 32 Q45 38 52 32" stroke="rgba(20,30,80,0.6)" strokeWidth="2" strokeLinecap="round" fill="none" />
              {/* Body */}
              <path d="M20 60 Q45 50 70 60 L68 105 Q45 114 22 105 Z" fill="rgba(180,205,255,0.72)" />
              {/* Neck */}
              <rect x="37" y="44" width="16" height="14" rx="4" fill="rgba(200,220,255,0.75)" />
            </svg>
            <div style={{
              fontFamily, fontWeight: 700, fontSize: 16,
              color: "rgba(150,170,220,0.7)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}>
              Utilisateur moyen
            </div>
          </div>

          {/* ChatGPT header */}
          <div style={{
            display: "flex", alignItems: "center", gap: 14,
            opacity: interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "linear-gradient(135deg, #10a37f, #0d8c6d)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20,
            }}>🤖</div>
            <div style={{ fontFamily, fontWeight: 800, fontSize: 26, color: "rgba(255,255,255,0.9)", letterSpacing: "0.02em" }}>
              ChatGPT
            </div>
          </div>

          {/* Mock chat window */}
          <div style={{
            background: "rgba(18,18,18,0.85)",
            border: "1px solid rgba(100,100,100,0.3)",
            borderRadius: 18,
            padding: "24px 28px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}>
            {chatgptQuestions.slice(0, currentQuestionIdx).map((q, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", opacity: 0.42 }}>
                <div style={{ fontSize: 16 }}>👤</div>
                <div style={{ fontFamily, fontWeight: 600, fontSize: 19, color: "rgba(200,220,255,0.7)" }}>{q}</div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{ fontSize: 16 }}>👤</div>
              <div style={{
                fontFamily, fontWeight: 600, fontSize: 21,
                color: "rgba(200,220,255,0.95)",
                minHeight: 28,
              }}>
                {currentQuestion.slice(0, charCount)}
                <span style={{
                  display: "inline-block", width: 2, height: 20,
                  background: accentColor, marginLeft: 2, verticalAlign: "middle",
                  opacity: Math.abs(Math.sin(frame * 0.3)) > 0.5 ? 1 : 0,
                }} />
              </div>
            </div>
          </div>

          {/* Badge 10% du potentiel */}
          <div style={{
            opacity: badgeOpacity,
            transform: `scale(${badgeScale})`,
            background: "rgba(255,60,60,0.12)",
            border: "1.5px solid rgba(255,80,80,0.45)",
            borderRadius: 14,
            padding: "10px 22px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <div style={{
              fontFamily, fontWeight: 800, fontSize: 20,
              color: "#ff7070",
              letterSpacing: "0.02em",
            }}>
              10 % du potentiel utilisé
            </div>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div style={{
          width: 1,
          background: "rgba(80,130,255,0.25)",
          opacity: dividerOpacity,
          flexShrink: 0,
          margin: "60px 0",
        }} />

        {/* ── RIGHT: Iceberg ── */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 50px",
          gap: 0,
          position: "relative",
        }}>

          {/* "Ce que tu vois" label */}
          <div style={{
            fontFamily, fontWeight: 700, fontSize: 18,
            color: "rgba(140,140,140,0.6)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: 14,
            opacity: interpolate(frame, [15, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}>
            Ce que tu vois
          </div>

          {/* ── Iceberg tip (SVG triangle) ── */}
          <div style={{
            position: "relative",
            opacity: interpolate(frame, [8, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}>
            <svg width="300" height="130" viewBox="0 0 300 130" style={{ display: "block" }}>
              <defs>
                <linearGradient id="iceberg-tip-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(160,200,255,0.92)" />
                  <stop offset="100%" stopColor="rgba(80,130,220,0.75)" />
                </linearGradient>
                <filter id="tip-glow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              {/* Triangle tip */}
              <polygon
                points="150,8 270,128 30,128"
                fill="url(#iceberg-tip-grad)"
                stroke="rgba(180,220,255,0.5)"
                strokeWidth="1.5"
                filter="url(#tip-glow)"
              />
            </svg>
            {/* Visible label centered on tip */}
            <div style={{
              position: "absolute",
              bottom: 28,
              fontFamily, fontWeight: 800, fontSize: 22,
              color: "rgba(10,20,60,0.95)",
              textAlign: "center",
              letterSpacing: "0.02em",
            }}>
              {icebergVisible}
            </div>
          </div>

          {/* ── Water surface ── */}
          <div style={{ position: "relative", width: "88%", flexShrink: 0 }}>
            <svg width="100%" height="24" viewBox="0 0 400 24" preserveAspectRatio="none">
              <defs>
                <linearGradient id="water-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="30%" stopColor="rgba(100,180,255,0.55)" />
                  <stop offset="70%" stopColor="rgba(100,180,255,0.55)" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <path
                d={`M0,12 Q50,${12 + waveOffset} 100,12 Q150,${12 - waveOffset} 200,12 Q250,${12 + waveOffset} 300,12 Q350,${12 - waveOffset} 400,12`}
                stroke="url(#water-grad)"
                strokeWidth="2.5"
                fill="none"
              />
              <path
                d={`M0,18 Q60,${18 - waveOffset * 0.6} 120,18 Q180,${18 + waveOffset * 0.6} 240,18 Q300,${18 - waveOffset * 0.6} 360,18 Q390,${18 + waveOffset * 0.4} 400,18`}
                stroke="rgba(100,180,255,0.25)"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
            <div style={{
              fontFamily, fontWeight: 600, fontSize: 12,
              color: "rgba(100,180,255,0.45)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textAlign: "right",
              marginTop: 2,
            }}>
              ~~~~ surface ~~~~
            </div>
          </div>

          {/* ── Iceberg body underwater ── */}
          <div style={{
            position: "relative",
            width: "88%",
            overflow: "hidden",
          }}>
            {/* SVG body shape */}
            <svg width="100%" height="280" viewBox="0 0 400 280" preserveAspectRatio="none" style={{ display: "block" }}>
              <defs>
                <linearGradient id="iceberg-body-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(10,30,80,0.92)" />
                  <stop offset="100%" stopColor="rgba(5,15,50,0.98)" />
                </linearGradient>
                <linearGradient id="iceberg-border-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(80,130,255,0.5)" />
                  <stop offset="100%" stopColor="rgba(40,80,200,0.25)" />
                </linearGradient>
              </defs>
              {/* Wider trapezoid body */}
              <path
                d="M30,0 L370,0 L340,280 L60,280 Z"
                fill="url(#iceberg-body-grad)"
                stroke="url(#iceberg-border-grad)"
                strokeWidth="1.5"
              />
              {/* Inner highlight shimmer */}
              <path
                d="M80,20 L320,20 L300,260 L100,260 Z"
                fill="rgba(80,130,255,0.05)"
              />
            </svg>

            {/* Water reveal mask — slides up as animation progresses */}
            <div style={{
              position: "absolute",
              bottom: 0, left: 0, right: 0,
              height: `${(1 - waterRevealProgress) * 100}%`,
              background: "rgba(5,10,30,0.97)",
              zIndex: 2,
            }} />

            {/* Hidden items */}
            <div style={{
              position: "absolute",
              top: 0, left: 0, right: 0, bottom: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-evenly",
              padding: "24px 20px",
              zIndex: 3,
            }}>
              {icebergHidden.map((item, i) => {
                const itemReveal = interpolate(
                  waterRevealProgress,
                  [i / icebergHidden.length, (i + 0.7) / icebergHidden.length],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );
                const itemTranslate = interpolate(itemReveal, [0, 1], [12, 0]);
                return (
                  <div key={i} style={{
                    fontFamily, fontWeight: 800,
                    fontSize: 26 - i * 1.5,
                    color: accentColor,
                    opacity: itemReveal,
                    transform: `translateY(${itemTranslate}px)`,
                    letterSpacing: "0.05em",
                    textShadow: `0 0 24px ${accentColor}55`,
                  }}>
                    {item}
                  </div>
                );
              })}
            </div>
          </div>

          {/* "Le vrai potentiel" label */}
          <div style={{
            marginTop: 16,
            fontFamily, fontWeight: 700, fontSize: 18,
            color: `rgba(136,170,255,0.7)`,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            opacity: interpolate(frame, [25, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}>
            Le vrai potentiel
          </div>

        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
