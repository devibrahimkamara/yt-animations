import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/Anton";
import { z } from "zod";

export const teemDrop13Schema = z.object({});

const { fontFamily: antonFont } = loadFont();

const SHIRT_COLOR = "#1E3A5F"; // variante A marine

export const TeemDrop13: React.FC<z.infer<typeof teemDrop13Schema>> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

  // Phase 0: studio setup
  const haloOpacity = interpolate(frame, [0, 18], [0, 0.8], clamp);
  const labelOpacity = interpolate(frame, [5, 18], [0, 1], clamp);
  const groundLine = interpolate(frame, [8, 20], [0, 500], clamp);

  // Phase 1: shirt entry
  const shirtEntry = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 14, stiffness: 90, mass: 1.4 } });
  const wobble = spring({ frame: Math.max(0, frame - 38), fps, config: { damping: 5, stiffness: 60 } });
  const flipIn = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 16, stiffness: 80 } });

  const shirtTY = 120 * (1 - shirtEntry);
  const shirtScale = 0.88 + 0.12 * shirtEntry;
  const shirtRotZ = wobble * 3;
  const shirtRotY = -12 * (1 - flipIn);

  // Phase 2: placement frame
  const frameOpacity = interpolate(frame, [45, 55], [0, 1], clamp) * interpolate(frame, [60, 70], [1, 0], clamp);
  const penCursorX = interpolate(frame, [45, 62], [650, 770], { easing: Easing.bezier(0.4, 0, 0.2, 1), ...clamp });
  const penCursorY = interpolate(frame, [45, 62], [400, 350], { easing: Easing.bezier(0.4, 0, 0.2, 1), ...clamp });

  // Phase 3: text clip reveal
  const clip1Width = interpolate(frame, [65, 88], [0, 210], { easing: Easing.bezier(0.25, 0.1, 0.25, 1), ...clamp });
  const decoLineWidth = interpolate(frame, [92, 104], [0, 140], { easing: Easing.bezier(0.25, 0.1, 0.25, 1), ...clamp });
  const clip2Width = interpolate(frame, [88, 118], [0, 190], { easing: Easing.bezier(0.25, 0.1, 0.25, 1), ...clamp });
  const editionOpacity = interpolate(frame, [102, 115], [0, 0.6], clamp);

  // Printing head positions
  const head1X = clip1Width - 4;
  const head2X = clip2Width - 4;
  const showHead1 = frame >= 65 && frame <= 92;
  const showHead2 = frame >= 88 && frame <= 120;

  // Phase 4: product panel
  const p1 = spring({ frame: Math.max(0, frame - 110), fps, config: { damping: 16, stiffness: 120 } });
  const p2 = spring({ frame: Math.max(0, frame - 118), fps, config: { damping: 16, stiffness: 120 } });
  const p3 = spring({ frame: Math.max(0, frame - 122), fps, config: { damping: 8, stiffness: 200 } });
  const p4 = spring({ frame: Math.max(0, frame - 126), fps, config: { damping: 16, stiffness: 120 } });
  const p5 = spring({ frame: Math.max(0, frame - 128), fps, config: { damping: 16, stiffness: 120 } });
  const p6 = spring({ frame: Math.max(0, frame - 130), fps, config: { damping: 16, stiffness: 120 } });
  const p7 = spring({ frame: Math.max(0, frame - 132), fps, config: { damping: 16, stiffness: 120 } });

  // Phase 5: float
  const floatY = frame >= 138 ? Math.sin((frame - 138) / 18) * 3 : 0;
  const btnPulse = frame >= 132 ? 0.4 + 0.4 * (Math.sin((frame - 132) / 15) * 0.5 + 0.5) : 0.4;

  // T-shirt center on screen (shirt is 420×504 rendered)
  const SHIRT_X = 540; // left edge (center of left half of screen roughly)
  const SHIRT_Y = 160; // top edge

  return (
    <AbsoluteFill style={{ background: "#0A1628", fontFamily: "'Plus Jakarta Sans', sans-serif", overflow: "hidden" }}>
      {/* Studio halo */}
      <div style={{
        position: "absolute",
        top: SHIRT_Y + 252 - 300,
        left: SHIRT_X + 210 - 400,
        width: 800,
        height: 600,
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(255,255,255,0.08) 0%, transparent 60%)",
        opacity: haloOpacity,
        pointerEvents: "none",
      }} />

      {/* "APERÇU DU PRODUIT" label */}
      <div style={{
        position: "absolute",
        top: SHIRT_Y - 40,
        left: SHIRT_X,
        fontSize: 14,
        fontWeight: 600,
        color: "#475569",
        letterSpacing: "0.18em",
        opacity: labelOpacity,
      }}>
        APERÇU DU PRODUIT
      </div>

      {/* Ground line */}
      <div style={{
        position: "absolute",
        top: SHIRT_Y + 504 + 20,
        left: SHIRT_X + 210 - groundLine / 2,
        width: groundLine,
        height: 2,
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
      }} />

      {/* Floor shadow */}
      <div style={{
        position: "absolute",
        top: SHIRT_Y + 504 + 10,
        left: SHIRT_X + 210 - 100,
        width: 200,
        height: 20,
        borderRadius: "50%",
        background: "rgba(0,0,0,0.4)",
        transform: `scaleX(${shirtEntry})`,
        filter: "blur(6px)",
      }} />

      {/* T-shirt */}
      <div style={{
        position: "absolute",
        left: SHIRT_X,
        top: SHIRT_Y,
        width: 420,
        height: 504,
        transform: `translateY(${shirtTY}px) scale(${shirtScale}) rotateZ(${shirtRotZ}deg)`,
        perspective: 1200,
        transformStyle: "preserve-3d",
      }}>
        <div style={{ transform: `rotateY(${shirtRotY}deg) translateY(${floatY}px)`, transformStyle: "preserve-3d" }}>
          <svg
            width="420"
            height="504"
            viewBox="0 0 400 480"
            style={{ filter: "drop-shadow(4px 6px 20px rgba(0,0,0,0.35))", overflow: "visible" }}
          >
            <defs>
              <filter id="fabric">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
              </filter>
              {/* clip paths for text lines */}
              <clipPath id="clip-line1">
                <rect x="112" y="155" width={clip1Width} height="62" />
              </clipPath>
              <clipPath id="clip-line2">
                <rect x="120" y="228" width={clip2Width} height="82" />
              </clipPath>
            </defs>

            {/* T-shirt body */}
            <path
              d="M 100,60 C 100,60 130,50 160,48 C 160,48 170,80 200,85 C 230,80 240,48 240,48 C 270,50 300,60 300,60 L 370,120 L 320,160 L 310,130 L 310,420 L 90,420 L 90,130 L 80,160 L 30,120 Z"
              fill={SHIRT_COLOR}
              filter="url(#fabric)"
            />

            {/* Seam lines */}
            <path
              d="M 100,60 C 100,60 130,50 160,48 C 160,48 170,80 200,85 C 230,80 240,48 240,48 C 270,50 300,60 300,60 L 370,120 L 320,160 L 310,130 L 310,420 L 90,420 L 90,130 L 80,160 L 30,120 Z"
              fill="none"
              stroke="rgba(0,0,0,0.1)"
              strokeWidth="1.5"
              strokeDasharray="3 4"
            />

            {/* Light reflection */}
            <ellipse cx="150" cy="200" rx="80" ry="40" fill="rgba(255,255,255,0.06)" />

            {/* Collar label */}
            <rect x="180" y="72" width="40" height="16" rx="2" fill="rgba(255,255,255,0.1)" />

            {/* Text line 1: BONNE FÊTE */}
            <g clipPath="url(#clip-line1)">
              <text x="200" y="210" textAnchor="middle" fontFamily={antonFont} fontSize="54" fill="white" opacity="0.92">
                BONNE FÊTE
              </text>
            </g>

            {/* Printing head line 1 */}
            {showHead1 && (
              <rect x={112 + head1X} y="155" width="4" height="62" fill="rgba(59,130,246,0.7)" />
            )}

            {/* Decorative line */}
            <rect x="130" y="222" width={decoLineWidth} height="2" fill="rgba(255,255,255,0.3)" />

            {/* Text line 2: PAPA */}
            <g clipPath="url(#clip-line2)">
              <text x="200" y="300" textAnchor="middle" fontFamily={antonFont} fontSize="80" fill="white" opacity="0.92">
                PAPA
              </text>
            </g>

            {/* Printing head line 2 */}
            {showHead2 && (
              <rect x={120 + head2X} y="228" width="4" height="82" fill="rgba(59,130,246,0.7)" />
            )}

            {/* "— Édition 2026 —" */}
            <text x="200" y="335" textAnchor="middle" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="18" fill="white" opacity={editionOpacity}>
              — Édition 2026 —
            </text>
          </svg>
        </div>
      </div>

      {/* Placement frame (phase 2) */}
      {frameOpacity > 0 && (
        <div style={{
          position: "absolute",
          left: SHIRT_X + 90,
          top: SHIRT_Y + 145,
          width: 260,
          height: 130,
          border: "1.5px dashed rgba(59,130,246,0.5)",
          borderRadius: 4,
          opacity: frameOpacity,
          pointerEvents: "none",
        }}>
          {/* Crosshairs */}
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "rgba(59,130,246,0.3)", transform: "translateX(-50%)" }} />
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "rgba(59,130,246,0.3)", transform: "translateY(-50%)" }} />
        </div>
      )}

      {/* Pen cursor (phase 2) */}
      {frameOpacity > 0 && (
        <svg style={{ position: "absolute", left: penCursorX, top: penCursorY, opacity: frameOpacity, pointerEvents: "none" }} width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M2 14 L6 10 L14 2 L18 6 L10 14 L6 18Z" fill="white" stroke="#0F172A" strokeWidth="1" />
          <path d="M14 2 L18 6" stroke="#94A3B8" strokeWidth="1" />
        </svg>
      )}

      {/* Product panel */}
      <div style={{ position: "absolute", left: 1060, top: 160, width: 340 }}>
        {/* Title */}
        <div style={{ opacity: p1, transform: `translateY(${(1 - p1) * 12}px)`, fontSize: 28, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.3, marginBottom: 14 }}>
          T-Shirt Fête des Pères
        </div>

        {/* Stars + reviews */}
        <div style={{ opacity: p2, transform: `translateY(${(1 - p2) * 10}px)`, display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 3 }}>
            {[0, 1, 2, 3, 4].map(i => (
              <svg key={i} width="18" height="18" viewBox="0 0 18 18" fill="#F59E0B">
                <path d="M9 1L11.2 6.5H17L12.4 10L14.2 16L9 12.5L3.8 16L5.6 10L1 6.5H6.8Z" />
              </svg>
            ))}
          </div>
          <span style={{ fontSize: 15, color: "#94A3B8" }}>4.8 · 127 avis</span>
        </div>

        {/* Price */}
        <div style={{ opacity: p3, transform: `scale(${0.7 + 0.3 * p3}) translateY(${(1 - p3) * 8}px)`, marginBottom: 6 }}>
          <span style={{ fontSize: 48, fontWeight: 800, color: "#10B981", lineHeight: 1 }}>24,99€</span>
        </div>

        {/* Shipping */}
        <div style={{ opacity: p4, transform: `translateY(${(1 - p4) * 8}px)`, fontSize: 15, color: "#64748B", marginBottom: 20 }}>
          + livraison 4,99€
        </div>

        {/* Color circles */}
        <div style={{ opacity: p5, transform: `translateY(${(1 - p5) * 8}px)`, display: "flex", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#FFFFFF", border: "3px solid #3B82F6", boxShadow: "0 0 0 2px rgba(59,130,246,0.3)" }} />
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1A1A1A", border: "2px solid rgba(255,255,255,0.1)" }} />
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#9CA3AF", border: "2px solid rgba(255,255,255,0.1)" }} />
        </div>

        {/* Design variants A/B/C */}
        <div style={{ opacity: p6, transform: `translateY(${(1 - p6) * 8}px)`, display: "flex", gap: 10, marginBottom: 24 }}>
          {[{ label: "A", bg: "#1E3A5F" }, { label: "B", bg: "#1A1A1A" }, { label: "C", bg: "#7C3100" }].map(({ label, bg }, i) => (
            <div key={i} style={{
              width: 56,
              height: 68,
              borderRadius: 8,
              background: bg,
              border: i === 0 ? "2px solid #3B82F6" : "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              color: "rgba(255,255,255,0.7)",
            }}>
              {label}
            </div>
          ))}
        </div>

        {/* Commander button */}
        <div style={{
          opacity: p7,
          transform: `translateY(${(1 - p7) * 8}px)`,
          width: 260,
          height: 52,
          borderRadius: 12,
          background: "#3060ff",
          border: `2px solid rgba(48,96,255,${btnPulse})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          cursor: "pointer",
          boxShadow: `0 4px 20px rgba(48,96,255,0.3)`,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="white" strokeWidth="2" fill="none" strokeLinejoin="round" />
            <line x1="3" y1="6" x2="21" y2="6" stroke="white" strokeWidth="2" />
            <path d="M16 10a4 4 0 01-8 0" stroke="white" strokeWidth="2" fill="none" />
          </svg>
          <span style={{ fontSize: 18, fontWeight: 700, color: "white" }}>Commander</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
