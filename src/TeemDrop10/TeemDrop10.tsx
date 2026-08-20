import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from "remotion";
import { z } from "zod";

export const teemDrop10Schema = z.object({});

const CARDS = [
  { name: "Nouvel An", accent: "#F59E0B", bg: "#1C1400", subtitle: "Motivation · Citations inspirantes", badge: null },
  { name: "Saint-Valentin", accent: "#EC4899", bg: "#1C0011", subtitle: "T-shirts duo · Messages d'amour", badge: "POPULAIRE" },
  { name: "Fête des Mères", accent: "#A78BFA", bg: "#13001C", subtitle: "Hommage · Citations mamans", badge: null },
  { name: "Fête des Pères", accent: "#3B82F6", bg: "#00101C", subtitle: "Humour papa · Métier du père", badge: "POPULAIRE" },
  { name: "Été", accent: "#FBBF24", bg: "#1C1600", subtitle: "Beach vibes · Destinations", badge: null },
  { name: "Rentrée", accent: "#10B981", bg: "#001C0F", subtitle: "École · Université · Profs", badge: null },
  { name: "Halloween", accent: "#F97316", bg: "#1C0800", subtitle: "Citrouilles · Fantômes · Dark", badge: null },
  { name: "Noël", accent: "#EF4444", bg: "#1C0000", subtitle: "Famille · Pulls de Noël · Rennes", badge: "POPULAIRE" },
];

const CARD_W = 280;
const CARD_H = 360;
const GAP = 40;
const STRIP_W = CARDS.length * (CARD_W + GAP) - GAP; // 2520
const BASE_OFFSET = (1920 - STRIP_W) / 2; // -300

function CardIcon({ name, accent }: { name: string; accent: string }) {
  if (name === "Nouvel An") return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="26" r="6" fill={accent} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
        <line key={i} x1="26" y1="26"
          x2={26 + Math.cos((deg * Math.PI) / 180) * 20}
          y2={26 + Math.sin((deg * Math.PI) / 180) * 20}
          stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
      ))}
    </svg>
  );
  if (name === "Saint-Valentin") return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <path d="M26 42 C26 42 8 30 8 18 C8 12 13 8 19 10 C22 11 24 13 26 16 C28 13 30 11 33 10 C39 8 44 12 44 18 C44 30 26 42 26 42Z" fill={accent} />
    </svg>
  );
  if (name === "Fête des Mères") return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="22" r="7" fill={accent} />
      {[0, 72, 144, 216, 288].map((deg, i) => (
        <ellipse key={i}
          cx={26 + Math.cos(((deg - 90) * Math.PI) / 180) * 13}
          cy={22 + Math.sin(((deg - 90) * Math.PI) / 180) * 13}
          rx="5" ry="8"
          transform={`rotate(${deg}, ${26 + Math.cos(((deg - 90) * Math.PI) / 180) * 13}, ${22 + Math.sin(((deg - 90) * Math.PI) / 180) * 13})`}
          fill={accent} opacity="0.7" />
      ))}
    </svg>
  );
  if (name === "Fête des Pères") return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <rect x="10" y="20" width="32" height="22" rx="3" stroke={accent} strokeWidth="2.5" fill="none" />
      <path d="M10 28 L26 20 L42 28" stroke={accent} strokeWidth="2.5" fill="none" />
      <rect x="21" y="28" width="10" height="14" rx="1" fill={accent} opacity="0.7" />
    </svg>
  );
  if (name === "Été") return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="26" r="9" fill={accent} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
        <line key={i} x1={26 + Math.cos((deg * Math.PI) / 180) * 13} y1={26 + Math.sin((deg * Math.PI) / 180) * 13}
          x2={26 + Math.cos((deg * Math.PI) / 180) * 21} y2={26 + Math.sin((deg * Math.PI) / 180) * 21}
          stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
      ))}
    </svg>
  );
  if (name === "Rentrée") return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <rect x="12" y="10" width="28" height="34" rx="2" stroke={accent} strokeWidth="2.5" fill="none" />
      <line x1="18" y1="20" x2="34" y2="20" stroke={accent} strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="27" x2="34" y2="27" stroke={accent} strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="34" x2="28" y2="34" stroke={accent} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
  if (name === "Halloween") return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <path d="M26 10 C16 10 10 18 10 26 C10 34 14 40 18 42 C20 43 22 42 22 40 L22 38 C22 37 23 36 24 37 C25 38 27 38 28 37 C29 36 30 37 30 38 L30 40 C30 42 32 43 34 42 C38 40 42 34 42 26 C42 18 36 10 26 10Z" fill={accent} />
      <circle cx="20" cy="25" r="3" fill="#000" />
      <circle cx="32" cy="25" r="3" fill="#000" />
      <path d="M20 33 Q26 37 32 33" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
  // Noël
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <rect x="14" y="32" width="24" height="12" rx="2" fill={accent} />
      <rect x="22" y="28" width="8" height="16" rx="1" fill={accent} opacity="0.8" />
      <path d="M26 8 L32 22 L20 22Z" fill={accent} opacity="0.9" />
      <path d="M26 16 L33 26 L19 26Z" fill={accent} />
      <circle cx="26" cy="8" r="3" fill="#FBBF24" />
    </svg>
  );
}

export const TeemDrop10: React.FC<z.infer<typeof teemDrop10Schema>> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerEntry = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });

  const speedFactor = interpolate(frame, [0, 30, 135, 165], [0, 1, 1, 0], {
    easing: Easing.bezier(0.4, 0, 0.6, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scrollX = -(frame * 3.2 * speedFactor);
  const totalOffset = BASE_OFFSET + scrollX;

  const lineOpacity = interpolate(frame, [12, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const spotlightOpacity = interpolate(frame, [70, 90], [0, 0.18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  let closestCardIndex = 0;
  let minDist = Infinity;
  CARDS.forEach((_, i) => {
    const cx = totalOffset + i * (CARD_W + GAP) + CARD_W / 2;
    const d = Math.abs(cx - 960);
    if (d < minDist) { minDist = d; closestCardIndex = i; }
  });
  const spotlightX = totalOffset + closestCardIndex * (CARD_W + GAP) + CARD_W / 2;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg, #0F172A 0%, #020617 100%)", fontFamily: "'Plus Jakarta Sans', sans-serif", overflow: "hidden" }}>
      {/* Aurora blobs */}
      <div style={{ position: "absolute", top: -200, left: -100, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(48,96,255,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -150, right: -50, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Header */}
      <div style={{ position: "absolute", top: 80, left: 0, right: 0, textAlign: "center", opacity: headerEntry, transform: `translateY(${(1 - headerEntry) * 20}px)` }}>
        <div style={{ fontSize: 52, fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1, letterSpacing: "-0.02em" }}>Les niches de l'année</div>
        <div style={{ fontSize: 24, color: "#94A3B8", marginTop: 10, fontWeight: 400 }}>Chaque période = une opportunité</div>
        <div style={{ width: 800, height: 2, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)", margin: "18px auto 0", opacity: lineOpacity }} />
      </div>

      {/* Spotlight */}
      <div style={{
        position: "absolute",
        top: 0, bottom: 0,
        width: 400,
        left: spotlightX - 200,
        background: "radial-gradient(ellipse 200px 540px at center, rgba(255,255,255,0.04) 0%, transparent 70%)",
        pointerEvents: "none",
        opacity: spotlightOpacity,
        transition: "left 0.1s",
      }} />

      {/* Cards strip */}
      <div style={{ position: "absolute", top: 250, left: 0, display: "flex", gap: GAP, transform: `translateX(${totalOffset}px)` }}>
        {CARDS.map((card, i) => {
          const cx = totalOffset + i * (CARD_W + GAP) + CARD_W / 2;
          const dist = Math.abs(cx - 960);
          const scale = 1 + 0.06 * Math.max(0, 1 - dist / 200);
          const opacity = 0.5 + 0.5 * Math.max(0, 1 - dist / 600);
          const iconRot = Math.sin(frame / 20 + i * 0.8) * 6;
          const cardEntry = spring({ frame: Math.max(0, frame - i * 2), fps, config: { damping: 16, stiffness: 110 } });

          return (
            <div key={i} style={{
              width: CARD_W,
              height: CARD_H,
              borderRadius: 20,
              background: `linear-gradient(160deg, ${card.bg} 0%, ${card.bg}dd 100%)`,
              border: `1px solid ${card.accent}22`,
              flexShrink: 0,
              transform: `scale(${scale}) translateY(${(1 - cardEntry) * 40}px)`,
              opacity: opacity * cardEntry,
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "28px 20px 22px",
              boxShadow: `0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px ${card.accent}15`,
            }}>
              {/* Light reflection overlay */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)", borderRadius: 20, pointerEvents: "none" }} />

              {/* Badge POPULAIRE */}
              {card.badge && (
                <div style={{
                  position: "absolute", top: 14, right: 14,
                  background: `${card.accent}33`,
                  border: `1px solid ${card.accent}`,
                  color: card.accent,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  padding: "3px 8px",
                  borderRadius: 6,
                }}>
                  {card.badge}
                </div>
              )}

              {/* Icon */}
              <div style={{ transform: `rotate(${iconRot}deg)`, marginTop: 20, marginBottom: 16 }}>
                <CardIcon name={card.name} accent={card.accent} />
              </div>

              {/* Name */}
              <div style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF", textAlign: "center", lineHeight: 1.2, marginBottom: 8 }}>
                {card.name}
              </div>

              {/* Divider */}
              <div style={{ width: 40, height: 2, background: card.accent, borderRadius: 1, marginBottom: 10, opacity: 0.7 }} />

              {/* Subtitle */}
              <div style={{ fontSize: 13, color: "#94A3B8", textAlign: "center", lineHeight: 1.5, padding: "0 4px" }}>
                {card.subtitle}
              </div>

              {/* Bottom accent line */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${card.accent}, transparent)`, borderRadius: "0 0 20px 20px" }} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
