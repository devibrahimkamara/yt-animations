import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "800"], subsets: ["latin"] });

export const teemDrop08Schema = z.object({});
export type TeemDrop08Props = z.infer<typeof teemDrop08Schema>;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const typed = (text: string, frame: number, start: number, end: number) =>
  text.substring(0, Math.floor(interpolate(frame, [start, end], [0, text.length], clamp)));

const RULES = [
  { icon: "monitor", color: "#EF4444", text: "Pas d'ordinateur", tag: "INTERDIT", delay: 75 },
  { icon: "appwindow", color: "#EF4444", text: "Pas de logiciels complexes", tag: "INTERDIT", delay: 95 },
  { icon: "smartphone", color: "#10B981", text: "iPhone uniquement", tag: "AUTORISÉ", delay: 115 },
  { icon: "bot", color: "#10B981", text: "Outils IA sur mobile", tag: "AUTORISÉ", delay: 130 },
  { icon: "target", color: "#3B82F6", text: "Obtenir le premier client", tag: "OBJECTIF", delay: 145 },
];

const MonitorIcon = ({ color }: { color: string }) => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <rect x={2} y={3} width={20} height={14} rx={2} />
    <line x1={8} y1={21} x2={16} y2={21} />
    <line x1={12} y1={17} x2={12} y2={21} />
  </svg>
);

const AppWindowIcon = ({ color }: { color: string }) => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <rect x={2} y={4} width={20} height={16} rx={2} />
    <line x1={2} y1={9} x2={22} y2={9} />
    <circle cx={6} cy={6.5} r={1} fill={color} />
    <circle cx={9.5} cy={6.5} r={1} fill={color} />
  </svg>
);

const SmartphoneIcon = ({ color }: { color: string }) => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <rect x={5} y={2} width={14} height={20} rx={2} />
    <line x1={12} y1={18} x2={12.01} y2={18} strokeWidth={3} strokeLinecap="round" />
  </svg>
);

const BotIcon = ({ color }: { color: string }) => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <rect x={3} y={11} width={18} height={10} rx={2} />
    <circle cx={12} cy={5} r={2} />
    <line x1={12} y1={7} x2={12} y2={11} />
    <line x1={8} y1={16} x2={8.01} y2={16} strokeWidth={3} strokeLinecap="round" />
    <line x1={16} y1={16} x2={16.01} y2={16} strokeWidth={3} strokeLinecap="round" />
  </svg>
);

const TargetIcon = ({ color }: { color: string }) => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <circle cx={12} cy={12} r={10} />
    <circle cx={12} cy={12} r={6} />
    <circle cx={12} cy={12} r={2} fill={color} />
  </svg>
);

const ClockIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth={2}>
    <circle cx={12} cy={12} r={10} />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const TrophyIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth={2}>
    <path d="M6 9H4a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h2" />
    <path d="M18 9h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2" />
    <path d="M6 2h12v10a6 6 0 0 1-12 0V2Z" />
    <line x1={12} y1={16} x2={12} y2={22} />
    <line x1={8} y1={22} x2={16} y2={22} />
  </svg>
);

function RuleIcon({ icon, color }: { icon: string; color: string }) {
  if (icon === "monitor") return <MonitorIcon color={color} />;
  if (icon === "appwindow") return <AppWindowIcon color={color} />;
  if (icon === "smartphone") return <SmartphoneIcon color={color} />;
  if (icon === "bot") return <BotIcon color={color} />;
  if (icon === "target") return <TargetIcon color={color} />;
  return null;
}

export const TeemDrop08: React.FC<TeemDrop08Props> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // ── Phase 0: Ambient scan line f0→f18 ─────────────────────────────────────
  const scanY = interpolate(frame, [0, 60], [0, 1080], { easing: Easing.linear, ...clamp });
  const gridOpacity = interpolate(frame, [0, 18], [0, 0.3], clamp);

  const terminalText1 = "MISSION_001 · INITIALISATION...";
  const terminalStr = typed(terminalText1, frame, 5, 15);
  const cursor = frame % 20 < 10 ? "|" : "";

  // ── Phase 1: Card entry f18→f55 ───────────────────────────────────────────
  const cardElapsed = Math.max(0, frame - 18);
  const cardSpring = spring({ frame: cardElapsed, fps, config: { damping: 20, stiffness: 120 } });
  const cardScale = interpolate(cardSpring, [0, 1], [0.92, 1]);

  const sweepX = interpolate(frame, [20, 35], [-200, 860], {
    easing: Easing.bezier(0.4, 0, 0.6, 1),
    ...clamp,
  });
  const sweepOp = interpolate(frame, [20, 25, 32, 35], [0, 0.7, 0.7, 0], clamp);

  const cardBgOpacity = interpolate(frame, [28, 40], [0, 1], clamp);

  // ── Phase 2: Header f40→f75 ───────────────────────────────────────────────
  const badgeElapsed = Math.max(0, frame - 40);
  const badgeSpring = spring({ frame: badgeElapsed, fps, config: { damping: 14, stiffness: 280 } });
  const badgeScale = badgeSpring;

  const titleY = interpolate(frame, [48, 58], [-12, 0], clamp);
  const titleOpacity = interpolate(frame, [48, 56], [0, 1], clamp);
  const subtitleOpacity = interpolate(frame, [56, 64], [0, 1], clamp);

  // Difficulty bars
  const diffBarScales = [0, 1, 2].map(i => {
    const el = Math.max(0, frame - (62 + i * 4));
    return spring({ frame: el, fps, config: { damping: 16, stiffness: 280 } });
  });

  // ── Phase 3: Rules f75→f155 ───────────────────────────────────────────────
  const progressBarY = interpolate(frame, [75, 145], [0, 320], clamp);

  // ── Phase 4: Stamp "ACCEPTÉ" f170 ─────────────────────────────────────────
  const stampOpacity = interpolate(frame, [170, 178], [0, 0.85], clamp);
  const stampFlashOpacity = interpolate(frame, [170, 172, 173, 174, 177], [0, 0.06, 0, 0.06, 0], clamp);

  // ── Phase 5: Hold f185→f210 ───────────────────────────────────────────────
  const cornerPulse = frame >= 185 ? Math.sin(frame / 20) * 0.3 + 0.7 : 1;
  const terminalText2 = "MISSION_001 · EN COURS";
  const terminalStr2 = frame >= 185 ? typed(terminalText2, frame, 185, 200) : "";
  const terminalCursor2 = frame >= 185 && frame % 20 < 10 ? "|" : "";

  const CARD_LEFT = 530;
  const CARD_TOP = 250;
  const CARD_W = 860;
  const CARD_H = 580;

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily }}>
      {/* Background */}
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse at center, #0F172A 0%, #020617 100%)",
      }} />

      {/* Dot grid */}
      <AbsoluteFill style={{ opacity: gridOpacity, pointerEvents: "none" }}>
        {Array.from({ length: 18 }, (_, row) =>
          Array.from({ length: 32 }, (_, col) => (
            <div key={`${row}-${col}`} style={{
              position: "absolute",
              left: col * 60 + 30,
              top: row * 60 + 30,
              width: 2,
              height: 2,
              borderRadius: "50%",
              background: "#1E3A5F",
            }} />
          ))
        )}
      </AbsoluteFill>

      {/* Scan line */}
      <div style={{
        position: "absolute",
        left: 0,
        top: scanY,
        width: 1920,
        height: 2,
        background: "#3B82F6",
        opacity: 0.4,
        pointerEvents: "none",
      }} />

      {/* Terminal text */}
      <div style={{
        position: "absolute",
        left: 48,
        top: 48,
        fontFamily: "monospace",
        fontSize: 16,
        color: "#4ADE80",
        opacity: interpolate(frame, [0, 5], [0, 1], clamp),
      }}>
        &gt; {frame >= 185 ? terminalStr2 + terminalCursor2 : terminalStr + cursor}
      </div>

      {/* Flash overlay for stamp */}
      <AbsoluteFill style={{
        background: `rgba(16,185,129,${stampFlashOpacity})`,
        pointerEvents: "none",
      }} />

      {/* ── CARD ── */}
      <div style={{
        position: "absolute",
        left: CARD_LEFT,
        top: CARD_TOP,
        width: CARD_W,
        height: CARD_H,
        transform: `scale(${cardScale})`,
        transformOrigin: "center center",
      }}>
        {/* Card background */}
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: 20,
          background: "linear-gradient(145deg, #0D1B2A, #0F2238, #0A1628)",
          border: "1px solid rgba(59,130,246,0.3)",
          opacity: cardBgOpacity,
          overflow: "hidden",
        }}>
          {/* Sweep */}
          <div style={{
            position: "absolute",
            left: sweepX,
            top: 0,
            width: 60,
            height: "100%",
            background: `linear-gradient(to right, transparent, rgba(59,130,246,${sweepOp}), transparent)`,
            pointerEvents: "none",
          }} />
        </div>

        {/* Corner decorations */}
        {[
          { top: 12, left: 12 },
          { top: 12, right: 12 },
          { bottom: 12, left: 12 },
          { bottom: 12, right: 12 },
        ].map((pos, i) => {
          const elapsed = Math.max(0, frame - (35 + i * 4));
          const prog = spring({ frame: elapsed, fps, config: { damping: 20, stiffness: 200 } });
          const len = 12 * prog;
          const isRight = "right" in pos;
          const isBottom = "bottom" in pos;
          return (
            <svg key={i} style={{
              position: "absolute",
              ...pos,
              opacity: prog * cornerPulse,
            }} width={24} height={24}>
              <line x1={isRight ? 24 : 0} y1={0} x2={isRight ? 24 - len : len} y2={0}
                stroke="#3B82F6" strokeWidth={2} />
              <line x1={isRight ? 24 : 0} y1={isBottom ? 24 : 0} x2={isRight ? 24 : 0}
                y2={isBottom ? 24 - len : len} stroke="#3B82F6" strokeWidth={2} />
            </svg>
          );
        })}

        {/* Badge DÉFI */}
        <div style={{
          position: "absolute",
          top: 28,
          left: 32,
          transform: `scale(${badgeScale})`,
          transformOrigin: "left center",
          background: "rgba(59,130,246,0.2)",
          border: "1px solid rgba(59,130,246,0.5)",
          borderRadius: 6,
          padding: "4px 12px",
          fontSize: 13,
          fontWeight: 700,
          color: "#93C5FD",
          letterSpacing: "0.12em",
          fontFamily,
        }}>
          DÉFI
        </div>

        {/* Title */}
        <div style={{
          position: "absolute",
          top: 68,
          left: 32,
          right: 32,
          fontSize: 38,
          fontWeight: 800,
          color: "#FFFFFF",
          fontFamily,
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
        }}>
          Les Règles du Jeu
        </div>

        {/* Subtitle */}
        <div style={{
          position: "absolute",
          top: 120,
          left: 32,
          fontSize: 18,
          color: "#64748B",
          fontFamily,
          opacity: subtitleOpacity,
        }}>
          Business T-shirt · iPhone uniquement
        </div>

        {/* Difficulty bars */}
        <div style={{
          position: "absolute",
          top: 154,
          left: 32,
          display: "flex",
          gap: 4,
          alignItems: "center",
        }}>
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} style={{
              width: 28,
              height: 8,
              borderRadius: 4,
              background: i < 3 ? "#F97316" : "#1E293B",
              opacity: i < 3 ? (diffBarScales[i] ?? 0) : 0.3,
              transform: `scaleX(${i < 3 ? (diffBarScales[i] ?? 0) : 1})`,
              transformOrigin: "left",
            }} />
          ))}
          <span style={{
            fontSize: 13,
            color: "#F97316",
            marginLeft: 6,
            opacity: subtitleOpacity,
            fontFamily,
          }}>3/5</span>
        </div>

        {/* Rules list */}
        <div style={{
          position: "absolute",
          top: 184,
          left: 0,
          right: 0,
        }}>
          {RULES.map((rule, i) => {
            const d = rule.delay;
            const bgOpacity = interpolate(frame, [d, d + 6], [0, 1], clamp);
            const iconElapsed = Math.max(0, frame - (d + 3));
            const iconSpring = spring({ frame: iconElapsed, fps, config: { damping: 14, stiffness: 280 } });
            const textX = interpolate(frame, [d + 5, d + 14], [-10, 0], clamp);
            const textOpacity = interpolate(frame, [d + 5, d + 12], [0, 1], clamp);
            const tagElapsed = Math.max(0, frame - (d + 8));
            const tagSpring = spring({ frame: tagElapsed, fps, config: { damping: 14, stiffness: 280 } });
            const isInterdit = rule.tag === "INTERDIT";
            const tagBg = isInterdit ? "rgba(239,68,68,0.15)" : rule.tag === "AUTORISÉ" ? "rgba(16,185,129,0.15)" : "rgba(59,130,246,0.15)";
            const tagColor = isInterdit ? "#EF4444" : rule.tag === "AUTORISÉ" ? "#10B981" : "#3B82F6";

            // Highlight pulse on entry
            const hlOpacity = interpolate(frame, [d, d + 3, d + 8, d + 12], [0, 0.06, 0.06, 0], clamp);

            return (
              <div key={i} style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 32px",
                background: `rgba(${isInterdit ? "239,68,68" : rule.tag === "AUTORISÉ" ? "16,185,129" : "59,130,246"},${hlOpacity * 0.3})`,
                opacity: bgOpacity,
              }}>
                {/* Icon */}
                <div style={{
                  transform: `scale(${iconSpring})`,
                  flexShrink: 0,
                  width: 22,
                }}>
                  <RuleIcon icon={rule.icon} color={rule.color} />
                </div>

                {/* Text */}
                <div style={{
                  flex: 1,
                  fontSize: 17,
                  fontWeight: 600,
                  color: "#E2E8F0",
                  fontFamily,
                  transform: `translateX(${textX}px)`,
                  opacity: textOpacity,
                }}>
                  {rule.text}
                </div>

                {/* Tag */}
                <div style={{
                  transform: `scale(${tagSpring})`,
                  background: tagBg,
                  border: `1px solid ${tagColor}44`,
                  borderRadius: 6,
                  padding: "3px 10px",
                  fontSize: 12,
                  fontWeight: 700,
                  color: tagColor,
                  letterSpacing: "0.08em",
                  fontFamily,
                }}>
                  {rule.tag}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress rail */}
        <div style={{
          position: "absolute",
          right: 16,
          top: 184,
          width: 3,
          height: 320,
          background: "rgba(255,255,255,0.06)",
          borderRadius: 2,
        }}>
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: progressBarY,
            background: "#3B82F6",
            borderRadius: 2,
          }} />
          <div style={{
            position: "absolute",
            left: "50%",
            top: progressBarY - 6,
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#3B82F6",
            transform: "translateX(-50%)",
            boxShadow: "0 0 8px #3B82F6",
          }} />
        </div>

        {/* Footer separator */}
        <div style={{
          position: "absolute",
          bottom: 66,
          left: 32,
          right: 32,
          height: 1,
          background: "rgba(255,255,255,0.06)",
          opacity: interpolate(frame, [155, 162], [0, 1], clamp),
        }} />

        {/* Footer */}
        <div style={{
          position: "absolute",
          bottom: 24,
          left: 32,
          right: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: interpolate(frame, [155, 164], [0, 1], clamp),
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            opacity: interpolate(frame, [162, 170], [0, 1], clamp),
          }}>
            <ClockIcon />
            <span style={{ fontSize: 14, color: "#64748B", fontFamily }}>Durée : 7 jours</span>
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            opacity: interpolate(frame, [162, 170], [0, 1], clamp),
          }}>
            <TrophyIcon />
            <span style={{ fontSize: 14, color: "#64748B", fontFamily }}>Récompense : 1er client</span>
          </div>
        </div>

        {/* Stamp ACCEPTÉ */}
        <div style={{
          position: "absolute",
          right: 60,
          top: 140,
          opacity: stampOpacity,
          transform: "rotate(-12deg)",
          border: "4px solid #10B981",
          borderRadius: 8,
          padding: "8px 20px",
          fontSize: 72,
          fontWeight: 800,
          color: "#10B981",
          fontFamily,
          letterSpacing: "0.04em",
          textShadow: "0 0 20px rgba(16,185,129,0.4)",
        }}>
          ACCEPTÉ
        </div>

        {/* Radiating lines from stamp */}
        {frame >= 170 && [0, 90, 180, 270].map((deg, i) => {
          const lineOpacity = interpolate(frame, [170, 172, 180, 185], [0, 0.8, 0.8, 0], clamp);
          const lineLen = interpolate(frame, [170, 180], [0, 24], clamp);
          const rad = (deg * Math.PI) / 180;
          return (
            <svg key={i} style={{
              position: "absolute",
              right: 120,
              top: 220,
              overflow: "visible",
              pointerEvents: "none",
            }} width={1} height={1}>
              <line
                x1={0} y1={0}
                x2={Math.cos(rad) * lineLen}
                y2={Math.sin(rad) * lineLen}
                stroke="#10B981"
                strokeWidth={2}
                opacity={lineOpacity}
              />
            </svg>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
