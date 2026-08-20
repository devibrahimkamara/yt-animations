import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "800"], subsets: ["latin"] });

export const teemDrop07Schema = z.object({});
export type TeemDrop07Props = z.infer<typeof teemDrop07Schema>;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const AI_CARDS = [
  { name: "Claude",       color: "#F97316", x: 420, y: 280, delay: 45 },
  { name: "ChatGPT",      color: "#10B981", x: 680, y: 220, delay: 52 },
  { name: "Midjourney",   color: "#8B5CF6", x: 920, y: 300, delay: 59 },
  { name: "Runway",       color: "#EC4899", x: 560, y: 480, delay: 66 },
  { name: "ElevenLabs",   color: "#F59E0B", x: 800, y: 500, delay: 73 },
  { name: "Suno",         color: "#06B6D4", x: 1040, y: 420, delay: 80 },
  { name: "Make",         color: "#6366F1", x: 700,  y: 660, delay: 87 },
];

const CONNECTIONS = [
  [0, 1], [1, 2], [0, 3], [3, 4], [4, 5],
];

function CardIcon({ color }: { color: string }) {
  return (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <circle cx={12} cy={12} r={10} fill={`${color}22`} />
      <circle cx={12} cy={12} r={5} fill={color} />
    </svg>
  );
}

export const TeemDrop07: React.FC<TeemDrop07Props> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Sweep line ──────────────────────────────────────────────────────────────
  const sweepX = interpolate(frame, [15, 95], [-20, 1920], {
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    ...clamp,
  });
  const revealWidth = interpolate(frame, [15, 95], [0, 1920], clamp);

  // ── Past elements fade out ──────────────────────────────────────────────────
  const pencilOpacity = interpolate(frame, [40, 58], [1, 0], clamp);
  const pencilScale = interpolate(frame, [40, 58], [1, 0.8], clamp);
  const pencilY = interpolate(frame, [40, 58], [0, 30], clamp);

  const pastLabel1Opacity = interpolate(frame, [0, 5, 36, 44], [0, 1, 1, 0], clamp);
  const pastLabel2Opacity = interpolate(frame, [10, 15, 48, 58], [0, 1, 1, 0], clamp);
  const underlineW = interpolate(frame, [12, 20, 48, 58], [0, 180, 180, 0], clamp);

  // Residual line f95→f120
  const residualOpacity = interpolate(frame, [95, 98, 118, 120], [0, 0.6, 0.6, 0], clamp);

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily }}>

      {/* ── Layer 1: Past (grayscale, always visible) ───────────────────────── */}
      <AbsoluteFill style={{
        background: "#1A1A1A",
        filter: "grayscale(1) brightness(0.7)",
      }}>
        {/* Pencil */}
        <div style={{
          position: "absolute",
          left: "50%",
          top: "42%",
          transform: `translate(-50%, -50%) translateY(${pencilY}px) rotate(-15deg) scale(${pencilScale})`,
          opacity: pencilOpacity,
        }}>
          <svg width={24} height={200} viewBox="0 0 24 200">
            <rect x={0} y={0} width={24} height={160} rx={4} fill="#8B7355" />
            <rect x={4} y={160} width={16} height={30} rx={2} fill="#F4D03F" />
            <polygon points="0,190 24,190 12,200" fill="#F4D03F" />
            <rect x={4} y={152} width={16} height={8} rx={0} fill="#E8C547" />
          </svg>
        </div>

        {/* Past label 1 */}
        <div style={{
          position: "absolute",
          left: "50%",
          top: 180,
          transform: "translateX(-50%)",
          textAlign: "center",
          opacity: pastLabel1Opacity,
        }}>
          <div style={{
            fontSize: 36,
            fontStyle: "italic",
            color: "#E8E0D0",
            fontFamily,
          }}>
            À l'époque
          </div>
          <div style={{
            marginTop: 8,
            height: 2,
            background: "#C17B3F",
            width: underlineW,
            marginLeft: "auto",
            marginRight: "auto",
          }} />
        </div>

        {/* Past label 2 */}
        <div style={{
          position: "absolute",
          left: "50%",
          bottom: 280,
          transform: "translateX(-50%)",
          opacity: pastLabel2Opacity,
        }}>
          <div style={{
            fontSize: 28,
            color: "#9CA3AF",
            fontFamily,
            textAlign: "center",
          }}>
            Pas d'IA. Pas d'outils.
          </div>
        </div>
      </AbsoluteFill>

      {/* ── Layer 2: Present (clipped reveal) ──────────────────────────────── */}
      <AbsoluteFill style={{
        clipPath: `inset(0 ${1920 - revealWidth}px 0 0)`,
      }}>
        <AbsoluteFill style={{
          background: "radial-gradient(ellipse at 50% 40%, #0F172A 0%, #020617 100%)",
        }}>
          {/* Blobs */}
          <div style={{
            position: "absolute",
            left: "30%",
            top: "30%",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "rgba(20,60,220,0.15)",
            filter: "blur(120px)",
            transform: "translate(-50%, -50%)",
          }} />
          <div style={{
            position: "absolute",
            left: "70%",
            top: "60%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(48,96,255,0.12)",
            filter: "blur(140px)",
            transform: "translate(-50%, -50%)",
          }} />
        </AbsoluteFill>

        {/* AI Cards */}
        {AI_CARDS.map((card, i) => {
          const elapsed = Math.max(0, frame - card.delay);
          const cardSpring = spring({ frame: elapsed, fps, config: { damping: 12, stiffness: 180 } });
          const cardTX = interpolate(cardSpring, [0, 1], [-30, 0]);
          const cardScale = interpolate(cardSpring, [0, 1], [0.85, 1]);
          const cardOpacity = interpolate(frame, [card.delay, card.delay + 8], [0, 1], clamp);
          const floatY = Math.sin(frame / 18 + i * 0.9) * 4;

          return (
            <div key={i} style={{
              position: "absolute",
              left: card.x - 80,
              top: card.y - 34 + floatY,
              width: 160,
              height: 68,
              borderRadius: 14,
              background: "rgba(30,41,59,0.85)",
              backdropFilter: "blur(8px)",
              border: `1px solid ${card.color}44`,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "0 14px",
              transform: `translateX(${cardTX}px) scale(${cardScale})`,
              opacity: cardOpacity,
              boxShadow: `0 4px 20px ${card.color}22`,
            }}>
              <CardIcon color={card.color} />
              <span style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#E2E8F0",
                fontFamily,
              }}>
                {card.name}
              </span>
            </div>
          );
        })}

        {/* SVG connection lines */}
        <svg style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          opacity: interpolate(frame, [90, 100, 108, 112], [0, 1, 1, 0.4], clamp),
        }}>
          {CONNECTIONS.map(([a, b], i) => {
            const cardA = AI_CARDS[a];
            const cardB = AI_CARDS[b];
            if (!cardA || !cardB) return null;
            const prog = interpolate(frame, [90 + i * 4, 110 + i * 4], [0, 1], clamp);
            const ex = cardA.x + (cardB.x - cardA.x) * prog;
            const ey = cardA.y + (cardB.y - cardA.y) * prog;
            return (
              <line key={i}
                x1={cardA.x} y1={cardA.y}
                x2={ex} y2={ey}
                stroke="rgba(148,163,184,0.2)"
                strokeWidth={1.5}
              />
            );
          })}
        </svg>

        {/* Titles */}
        {frame >= 80 && (
          <>
            {/* "2026" */}
            {(() => {
              const el = Math.max(0, frame - 80);
              const s = spring({ frame: el, fps, config: { damping: 14, stiffness: 180 } });
              const sc = interpolate(s, [0, 1], [0.8, 1]);
              const op = interpolate(frame, [80, 88], [0, 1], clamp);
              return (
                <div style={{
                  position: "absolute",
                  right: 80,
                  top: 90,
                  fontSize: 120,
                  fontWeight: 800,
                  color: "#FFFFFF",
                  fontFamily,
                  transform: `scale(${sc})`,
                  transformOrigin: "right top",
                  opacity: op,
                  letterSpacing: "-0.04em",
                }}>
                  2026
                </div>
              );
            })()}

            {/* "L'IA change tout" */}
            <div style={{
              position: "absolute",
              right: 80,
              top: 230,
              fontSize: 32,
              fontWeight: 600,
              color: "#93C5FD",
              fontFamily,
              opacity: interpolate(frame, [90, 98], [0, 1], clamp),
              textAlign: "right",
            }}>
              L'IA change tout
            </div>

            {/* "+ de 50 outils disponibles" */}
            <div style={{
              position: "absolute",
              right: 80,
              bottom: 160,
              fontSize: 22,
              color: "#64748B",
              fontFamily,
              opacity: interpolate(frame, [100, 108], [0, 1], clamp),
            }}>
              + de 50 outils disponibles
            </div>
          </>
        )}

        {/* Residual line at right edge */}
        <div style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: 2,
          height: 1080,
          background: "rgba(255,255,255,0.6)",
          opacity: residualOpacity,
        }} />
      </AbsoluteFill>

      {/* ── Sweep line (on top of both layers) ──────────────────────────────── */}
      <div style={{
        position: "absolute",
        left: sweepX - 3,
        top: -100,
        width: 6,
        height: 1400,
        transform: "rotate(-12deg)",
        transformOrigin: "top center",
        background: "linear-gradient(to bottom, transparent 0%, #ffffff 20%, #ffffff 80%, transparent 100%)",
        opacity: interpolate(frame, [15, 20, 90, 95], [0, 1, 1, 0], clamp),
        pointerEvents: "none",
        zIndex: 10,
      }}>
        {/* Glow wide */}
        <div style={{
          position: "absolute",
          left: -17,
          top: 0,
          width: 40,
          height: "100%",
          background: "rgba(255,255,255,0.15)",
          filter: "blur(8px)",
        }} />
        {/* Glow tight */}
        <div style={{
          position: "absolute",
          left: -5,
          top: 0,
          width: 16,
          height: "100%",
          background: "rgba(255,255,255,0.3)",
          filter: "blur(3px)",
        }} />
      </div>
    </AbsoluteFill>
  );
};
