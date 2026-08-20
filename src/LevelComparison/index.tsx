import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700", "800"],
  subsets: ["latin"],
});

const EASE = Easing.bezier(0.16, 1, 0.3, 1);

export const levelComparisonSchema = z.object({
  chatQuery: z.string().default("comment faire une recette ?"),
  chatResponse: z.string().default("Voici les étapes pour préparer…"),
  systemCards: z
    .array(z.object({ emoji: z.string(), label: z.string(), value: z.string() }))
    .default([
      { emoji: "✉️", label: "Emails", value: "47 envoyés" },
      { emoji: "💰", label: "Revenus", value: "+340€" },
      { emoji: "✅", label: "Tâches", value: "8 / 8" },
      { emoji: "🤖", label: "Agents IA", value: "actifs" },
    ]),
  accentColor: z.string().default("#3b82f6"),
  durationSecs: z.number().default(8),
});

export type LevelComparisonProps = z.infer<typeof levelComparisonSchema>;

// ─── Tired user SVG ──────────────────────────────────────────────────────────

const TiredUser: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const s = spring({ frame, fps, config: { mass: 0.5, damping: 10, stiffness: 180 } });
  const headBob = Math.sin(frame * 0.06) * 3;
  return (
    <div style={{ opacity: s, transform: `scale(${s})`, transformOrigin: "bottom center" }}>
      <svg width="190" height="240" viewBox="0 0 140 175" fill="none">
        <defs>
          <radialGradient id="th" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="rgba(175,175,185,0.9)" />
            <stop offset="100%" stopColor="rgba(110,110,120,0.85)" />
          </radialGradient>
          <radialGradient id="tb" cx="50%" cy="30%" r="65%">
            <stop offset="0%" stopColor="rgba(130,130,140,0.85)" />
            <stop offset="100%" stopColor="rgba(85,85,95,0.8)" />
          </radialGradient>
        </defs>
        <ellipse cx="70" cy="172" rx="38" ry="5" fill="rgba(0,0,0,0.18)" />
        <rect x="32" y="92" width="76" height="62" rx="16" fill="url(#tb)" transform="rotate(-3,70,123)" />
        <path d="M32,100 Q12,115 20,138" stroke="rgba(110,110,120,0.85)" strokeWidth="14" strokeLinecap="round" fill="none" />
        <path d="M108,100 Q128,115 120,138" stroke="rgba(110,110,120,0.85)" strokeWidth="14" strokeLinecap="round" fill="none" />
        <ellipse cx="20" cy="140" rx="9" ry="7" fill="rgba(155,155,165,0.88)" />
        <ellipse cx="120" cy="140" rx="9" ry="7" fill="rgba(155,155,165,0.88)" />
        <rect x="54" y="77" width="22" height="18" rx="6" fill="rgba(145,145,155,0.85)" />
        <g transform={`translate(0, ${headBob})`}>
          <circle cx="70" cy="55" r="30" fill="url(#th)" />
          <path d="M57,51 Q63,46 69,51" stroke="rgba(50,50,60,0.7)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M71,51 Q77,46 83,51" stroke="rgba(50,50,60,0.7)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M60,67 Q70,65 80,67" stroke="rgba(50,50,60,0.5)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>
        <rect x="40" y="147" width="20" height="24" rx="8" fill="rgba(95,95,105,0.8)" />
        <rect x="80" y="147" width="20" height="24" rx="8" fill="rgba(95,95,105,0.8)" />
      </svg>
    </div>
  );
};

// ─── Businessman SVG ─────────────────────────────────────────────────────────

const Businessman: React.FC<{ frame: number; fps: number; accentColor: string }> = ({ frame, fps, accentColor }) => {
  const s = spring({ frame, fps, config: { mass: 0.5, damping: 9, stiffness: 200 } });
  const armFloat = Math.sin(frame * 0.09) * 5;
  const glowPulse = 40 + 25 * Math.abs(Math.sin(frame * 0.07));
  return (
    <div style={{ opacity: s, transform: `scale(${s})`, transformOrigin: "bottom center", position: "relative" }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: 240, height: 240, borderRadius: "50%",
        background: `radial-gradient(circle, ${accentColor}22 0%, transparent 70%)`,
        filter: `blur(${glowPulse}px)`, pointerEvents: "none",
      }} />
      <svg width="190" height="255" viewBox="0 0 140 185" fill="none">
        <defs>
          <radialGradient id="bh" cx="50%" cy="38%" r="55%">
            <stop offset="0%" stopColor="rgba(215,232,255,0.96)" />
            <stop offset="100%" stopColor="rgba(155,195,248,0.9)" />
          </radialGradient>
          <radialGradient id="bb" cx="50%" cy="28%" r="65%">
            <stop offset="0%" stopColor="rgba(55,105,225,0.92)" />
            <stop offset="100%" stopColor="rgba(30,72,185,0.88)" />
          </radialGradient>
          <filter id="bg2">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <ellipse cx="70" cy="182" rx="40" ry="5.5" fill="rgba(0,20,80,0.28)" />
        <rect x="26" y="90" width="88" height="70" rx="18" fill="url(#bb)" filter="url(#bg2)" />
        <path d="M70,90 L55,115 L70,126" fill="rgba(20,52,155,0.65)" />
        <path d="M70,90 L85,115 L70,126" fill="rgba(20,52,155,0.65)" />
        <path d="M70,112 L65,132 L70,140 L75,132 Z" fill={`${accentColor}dd`} />
        <path d={`M26,100 Q${6 - armFloat * 0.4},${112 + armFloat} ${10 - armFloat * 0.3},${136 + armFloat * 0.8}`} stroke="rgba(40,82,195,0.9)" strokeWidth="15" strokeLinecap="round" fill="none" />
        <path d={`M114,100 Q${134 + armFloat * 0.4},${112 + armFloat} ${130 + armFloat * 0.3},${136 + armFloat * 0.8}`} stroke="rgba(40,82,195,0.9)" strokeWidth="15" strokeLinecap="round" fill="none" />
        <ellipse cx={`${10 - armFloat * 0.3}`} cy={`${138 + armFloat * 0.8}`} rx="9" ry="7.5" fill="rgba(205,225,255,0.9)" />
        <ellipse cx={`${130 + armFloat * 0.3}`} cy={`${138 + armFloat * 0.8}`} rx="9" ry="7.5" fill="rgba(205,225,255,0.9)" />
        <rect x="54" y="74" width="22" height="20" rx="6" fill="rgba(188,212,252,0.88)" />
        <circle cx="70" cy="50" r="32" fill="url(#bh)" filter="url(#bg2)" />
        <ellipse cx="58" cy="46" rx="5.5" ry="6.5" fill="rgba(15,38,92,0.9)" />
        <ellipse cx="82" cy="46" rx="5.5" ry="6.5" fill="rgba(15,38,92,0.9)" />
        <circle cx="60" cy="44" r="2" fill="rgba(255,255,255,0.75)" />
        <circle cx="84" cy="44" r="2" fill="rgba(255,255,255,0.75)" />
        <path d="M51,35 Q58,30 65,34" stroke="rgba(40,82,182,0.7)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M75,34 Q82,30 89,35" stroke="rgba(40,82,182,0.7)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M57,62 Q70,74 83,62" stroke="rgba(30,72,172,0.7)" strokeWidth="3" strokeLinecap="round" fill="none" />
        <rect x="38" y="154" width="22" height="26" rx="9" fill="rgba(25,62,175,0.84)" />
        <rect x="80" y="154" width="22" height="26" rx="9" fill="rgba(25,62,175,0.84)" />
        <ellipse cx="49" cy="180" rx="14" ry="6" fill="rgba(15,38,102,0.9)" />
        <ellipse cx="91" cy="180" rx="14" ry="6" fill="rgba(15,38,102,0.9)" />
      </svg>
    </div>
  );
};

// ─── System card ─────────────────────────────────────────────────────────────

const SystemCard: React.FC<{
  emoji: string; label: string; value: string;
  frame: number; fps: number; startFrame: number; accentColor: string; index: number;
}> = ({ emoji, label, value, frame, fps, startFrame, accentColor, index }) => {
  const s = spring({ frame: frame - startFrame, fps, config: { mass: 0.4, damping: 8, stiffness: 260 } });
  const glow = 8 + 6 * Math.abs(Math.sin(frame * 0.1 + index * 0.8));
  return (
    <div style={{
      opacity: s, transform: `scale(${s})`,
      background: "linear-gradient(135deg, rgba(15,42,115,0.85), rgba(8,25,75,0.8))",
      border: `1px solid rgba(80,130,255,0.38)`,
      borderRadius: 16, padding: "16px 20px",
      display: "flex", alignItems: "center", gap: 14,
      boxShadow: `0 0 ${glow}px ${accentColor}45, inset 0 1px 0 rgba(255,255,255,0.05)`,
    }}>
      <span style={{ fontSize: 30, flexShrink: 0 }}>{emoji}</span>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ fontFamily, fontWeight: 600, fontSize: 16, color: "rgba(140,170,230,0.7)", letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</div>
        <div style={{ fontFamily, fontWeight: 800, fontSize: 28, color: accentColor, textShadow: `0 0 14px ${accentColor}65` }}>{value}</div>
      </div>
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

const CARD_STARTS = [55, 70, 85, 100];

export const LevelComparison: React.FC<LevelComparisonProps> = ({
  chatQuery, chatResponse, systemCards, accentColor, durationSecs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const globalOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dividerScale = interpolate(frame, [5, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

  // Badges
  const b1Y = interpolate(frame, [12, 30], [-32, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const b1Op = interpolate(frame, [12, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const b2Y = interpolate(frame, [18, 36], [-32, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const b2Op = interpolate(frame, [18, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const badge2Glow = 16 + 10 * Math.abs(Math.sin(frame * 0.08));
  const finalHL = interpolate(frame, [185, 210], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ChatGPT
  const chatOp = interpolate(frame, [35, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const chatY = interpolate(frame, [35, 50], [18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const charCount = Math.floor(interpolate(frame, [45, 45 + chatQuery.length * 3], [0, chatQuery.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const cursorOn = Math.round(frame / 7) % 2 === 0;
  const responseOp = interpolate(frame, [115, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Tagline
  const tagOp = interpolate(frame, [190, 210], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagY = interpolate(frame, [190, 210], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />

      {/* Gray overlay — left half only */}
      <div style={{
        position: "absolute", top: 0, left: 0, width: "50%", height: "100%",
        background: "rgba(6,6,8,0.5)",
        filter: "saturate(0.15) brightness(0.78)",
        zIndex: 1, pointerEvents: "none",
      }} />

      {/* ── TWO-PANEL ROW LAYOUT ── */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex",
        flexDirection: "row",   // ← EXPLICITE
        opacity: globalOpacity,
        zIndex: 2,
      }}>

        {/* ══════════ LEFT — NIVEAU 1 ══════════ */}
        <div style={{
          width: "50%", height: "100%",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "40px 48px",
          gap: 24,
          filter: "saturate(0.18) brightness(0.78)",
          boxSizing: "border-box",
        }}>

          {/* Badge */}
          <div style={{
            opacity: b1Op, transform: `translateY(${b1Y}px)`,
            background: "rgba(55,55,62,0.85)",
            border: "2px solid rgba(110,110,120,0.4)",
            borderRadius: 16, padding: "12px 32px",
          }}>
            <div style={{ fontFamily, fontWeight: 800, fontSize: 42, color: "rgba(140,140,150,0.9)", letterSpacing: "0.12em" }}>
              NIVEAU 1
            </div>
          </div>

          {/* Character */}
          {frame >= 22 && <TiredUser frame={frame - 22} fps={fps} />}

          {/* ChatGPT window */}
          <div style={{
            opacity: chatOp, transform: `translateY(${chatY}px)`,
            width: "100%",
            background: "rgba(20,20,24,0.9)",
            border: "1px solid rgba(85,85,92,0.35)",
            borderRadius: 20, padding: "22px 26px",
            boxShadow: "0 0 40px rgba(0,0,0,0.5)",
            boxSizing: "border-box",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#555,#333)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✦</div>
              <span style={{ fontFamily, fontWeight: 800, fontSize: 26, color: "rgba(155,155,165,0.88)" }}>ChatGPT</span>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(75,75,82,0.55)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>👤</div>
              <div style={{ fontFamily, fontWeight: 600, fontSize: 22, color: "rgba(165,165,175,0.92)", minHeight: 28 }}>
                {chatQuery.slice(0, charCount)}
                <span style={{ display: "inline-block", width: 2, height: 20, background: "rgba(140,140,150,0.7)", marginLeft: 2, verticalAlign: "middle", opacity: cursorOn ? 1 : 0 }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", opacity: responseOp }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(48,48,52,0.65)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>🤖</div>
              <div style={{ fontFamily, fontWeight: 400, fontSize: 18, color: "rgba(115,115,125,0.75)", lineHeight: 1.5, fontStyle: "italic" }}>{chatResponse}</div>
            </div>
          </div>
        </div>

        {/* ══════════ DIVIDER ══════════ */}
        <div style={{
          width: 2, flexShrink: 0, alignSelf: "stretch",
          background: "linear-gradient(180deg, transparent, rgba(100,125,200,0.45) 15%, rgba(100,125,200,0.45) 85%, transparent)",
          transform: `scaleY(${dividerScale})`,
          transformOrigin: "center",
        }} />

        {/* ══════════ RIGHT — NIVEAU 2 ══════════ */}
        <div style={{
          width: "50%", height: "100%",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "40px 48px",
          gap: 22,
          boxSizing: "border-box",
        }}>

          {/* Badge */}
          <div style={{
            opacity: b2Op, transform: `translateY(${b2Y}px)`,
            background: "linear-gradient(135deg, rgba(88,62,0,0.85), rgba(55,38,0,0.78))",
            border: `2px solid rgba(255,215,0,${0.45 + finalHL * 0.35})`,
            borderRadius: 16, padding: "12px 32px",
            boxShadow: `0 0 ${badge2Glow + finalHL * 28}px rgba(255,215,0,${0.22 + finalHL * 0.35})`,
          }}>
            <div style={{ fontFamily, fontWeight: 800, fontSize: 42, color: "rgba(255,215,0,0.92)", letterSpacing: "0.12em" }}>
              NIVEAU 2
            </div>
          </div>

          {/* Businessman */}
          {frame >= 28 && <Businessman frame={frame - 28} fps={fps} accentColor={accentColor} />}

          {/* System cards 2×2 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, width: "100%" }}>
            {systemCards.map((card, i) => (
              <SystemCard
                key={i} emoji={card.emoji} label={card.label} value={card.value}
                frame={frame} fps={fps} startFrame={CARD_STARTS[i] ?? 55 + i * 15}
                accentColor={accentColor} index={i}
              />
            ))}
          </div>

          {/* Tagline */}
          <div style={{
            opacity: tagOp, transform: `translateY(${tagY}px)`,
            fontFamily, fontWeight: 800, fontSize: 26,
            background: `linear-gradient(90deg,#ffffff,${accentColor})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            letterSpacing: "0.02em", textAlign: "center",
          }}>
            Fait beaucoup plus d'argent 💰
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
