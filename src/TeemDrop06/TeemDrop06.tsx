import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "800"], subsets: ["latin"] });

export const teemDrop06Schema = z.object({});
export type TeemDrop06Props = z.infer<typeof teemDrop06Schema>;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const BLOBS = [
  { color: "rgba(16,185,129,0.10)", x: 30, y: 30, size: 520, blur: 140 },
  { color: "rgba(5,150,105,0.12)",  x: 70, y: 70, size: 480, blur: 120 },
  { color: "rgba(20,60,220,0.12)",  x: 80, y: 20, size: 440, blur: 130 },
];

const BILLS = [
  { x: 800,  delay: 15, rotStart: -15, rotEnd: -8,  dur: 35 },
  { x: 1050, delay: 22, rotStart:  12, rotEnd:  6,  dur: 32 },
  { x: 920,  delay: 30, rotStart:  -8, rotEnd: -3,  dur: 38 },
  { x: 700,  delay: 38, rotStart:  18, rotEnd: 10,  dur: 33 },
  { x: 1150, delay: 45, rotStart: -20, rotEnd: -12, dur: 36 },
  { x: 860,  delay: 55, rotStart:  10, rotEnd:  4,  dur: 30 },
  { x: 980,  delay: 65, rotStart: -12, rotEnd: -6,  dur: 34 },
  { x: 1080, delay: 75, rotStart:  16, rotEnd:  8,  dur: 32 },
];

const LABELS = [
  { text: "Les premières ventes arrivent...", start: 0,  end: 42 },
  { text: "Ça commence à marcher !",          start: 42, end: 61 },
  { text: "Business en feu 🔥",               start: 61, end: 85 },
  { text: "Objectif atteint ✓",               start: 85, end: 135 },
];

export const TeemDrop06: React.FC<TeemDrop06Props> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // ── Counter value with milestone pauses ─────────────────────────────────
  const valeur = interpolate(
    frame,
    [20, 42, 44, 61, 63, 85, 87, 100],
    [0,  50, 50, 150, 150, 250, 250, 300],
    { easing: Easing.bezier(0.12, 0, 0.39, 0), extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const displayVal = Math.floor(valeur);

  // Flash vert aux paliers
  const flash42 = interpolate(frame, [42, 44], [0.06, 0.06], clamp);
  const flash61 = interpolate(frame, [61, 63], [0.09, 0.09], clamp);
  const flash85 = interpolate(frame, [85, 87], [0.12, 0.12], clamp);
  const palierFlash =
    frame >= 42 && frame <= 44 ? flash42 :
    frame >= 61 && frame <= 63 ? flash61 :
    frame >= 85 && frame <= 87 ? flash85 : 0;

  // Color transition: blanc→vert f85→f100
  const rVal = Math.round(interpolate(frame, [85, 100], [255, 16], clamp));
  const gVal = Math.round(interpolate(frame, [85, 100], [255, 185], clamp));
  const bVal = Math.round(interpolate(frame, [85, 100], [255, 129], clamp));
  const counterColor = `rgb(${rVal},${gVal},${bVal})`;

  // Decade pulse
  const isDecade = displayVal > 0 && displayVal % 10 === 0 && displayVal <= 290;
  const decadeElapsed = isDecade ? (frame % 3) : 999;
  const decadeScale = isDecade
    ? spring({ frame: decadeElapsed, fps, config: { damping: 20, stiffness: 400 } })
    : 1;
  const counterScale = interpolate(spring({ frame: Math.max(0, frame - 100), fps, config: { damping: 6, stiffness: 180 } }), [0, 1], [1, frame >= 100 ? 1.15 : 1]);
  const finalScale = frame >= 100 ? counterScale : decadeScale;

  // Flash final f100
  const finalFlash = interpolate(frame, [100, 102, 104, 106], [0, 0.15, 0.15, 0], clamp);

  // Label
  const activeLabel = LABELS.find(l => frame >= l.start && frame < l.end)?.text ?? "";
  const labelOpacity = interpolate(frame, [0, 8], [0, 1], clamp);

  // Header
  const headerSpring = spring({ frame: Math.max(0, frame), fps, config: { damping: 14, stiffness: 120 } });
  const headerY = interpolate(headerSpring, [0, 1], [20, 0]);

  // Barre verte
  const barWidth = interpolate(frame, [20, 100], [0, 600], clamp);
  const barPulse = frame >= 100 ? 1 + Math.sin((frame - 100) / 8) * 0.04 : 1;

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily }}>
      {/* Background */}
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse at center, #0F172A 0%, #020617 100%)",
      }} />

      {/* Blobs */}
      {BLOBS.map((b, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${b.x}%`,
          top: `${b.y}%`,
          width: b.size,
          height: b.size,
          borderRadius: "50%",
          background: b.color,
          filter: `blur(${b.blur}px)`,
          transform: "translate(-50%, -50%)",
        }} />
      ))}

      {/* Flash overlay */}
      <AbsoluteFill style={{
        background: `rgba(16,185,129,${Math.max(palierFlash, finalFlash)})`,
        pointerEvents: "none",
      }} />

      {/* Bills falling */}
      {BILLS.map((bill, i) => {
        const elapsed = frame - bill.delay;
        if (elapsed < 0) return null;
        const progress = interpolate(elapsed, [0, bill.dur], [0, 1], {
          easing: Easing.bezier(0.23, 1, 0.32, 1),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const landY = 820 - i * 8;
        const startY = -80;
        const y = interpolate(progress, [0, 1], [startY, landY]);
        const rot = interpolate(progress, [0, 1], [bill.rotStart, bill.rotEnd]);

        // Bounce on landing
        const bounceElapsed = Math.max(0, elapsed - bill.dur);
        const bounceSpring = spring({ frame: bounceElapsed, fps, config: { damping: 12, stiffness: 300 } });
        const bounceScale = elapsed >= bill.dur ? interpolate(bounceSpring, [0, 0.5, 1], [1.06, 1.06, 1]) : 1;
        const bounceY = elapsed >= bill.dur ? interpolate(bounceSpring, [0, 0.5, 1], [5, 5, 0]) : 0;

        return (
          <div key={i} style={{
            position: "absolute",
            left: bill.x - 60,
            top: 0,
            width: 120,
            height: 60,
            transform: `translateY(${y + bounceY}px) rotate(${rot}deg) scale(${bounceScale})`,
            background: "linear-gradient(135deg, #064E3B, #065F46, #047857)",
            border: "1.5px solid #10B981",
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 16px rgba(16,185,129,0.2)",
          }}>
            <span style={{ fontSize: 22, color: "#10B981", fontWeight: 800, fontFamily }}>€</span>
          </div>
        );
      })}

      {/* Header labels */}
      <div style={{
        position: "absolute",
        top: 160,
        left: "50%",
        transform: `translate(-50%, ${headerY}px)`,
        textAlign: "center",
      }}>
        <div style={{
          fontSize: 28,
          fontWeight: 600,
          color: "#64748B",
          fontFamily,
          opacity: interpolate(frame, [0, 6], [0, 1], clamp),
        }}>
          Ventes au lycée
        </div>
        <div style={{
          fontSize: 22,
          color: "#475569",
          fontFamily,
          marginTop: 4,
          opacity: interpolate(frame, [5, 12], [0, 1], clamp),
        }}>
          Abidjan · 2016
        </div>
      </div>

      {/* Counter */}
      <div style={{
        position: "absolute",
        top: 260,
        left: "50%",
        transform: `translate(-50%, 0) scale(${finalScale})`,
        fontSize: 180,
        fontWeight: 800,
        color: counterColor,
        letterSpacing: "-0.04em",
        fontFamily,
        textAlign: "center",
        textShadow: frame >= 85 ? `0 0 60px rgba(16,185,129,0.4)` : "none",
        opacity: interpolate(frame, [10, 18], [0, 1], clamp),
      }}>
        {displayVal}€
      </div>

      {/* Dynamic label */}
      <div style={{
        position: "absolute",
        top: 480,
        left: "50%",
        transform: "translate(-50%, 0)",
        fontSize: 26,
        fontWeight: 400,
        color: "#94A3B8",
        fontFamily,
        textAlign: "center",
        opacity: labelOpacity,
        minWidth: 400,
      }}>
        {activeLabel}
      </div>

      {/* Progress bar rail */}
      <div style={{
        position: "absolute",
        left: "50%",
        top: 660,
        width: 600,
        height: 6,
        transform: "translateX(-50%)",
        background: "#1E293B",
        borderRadius: 3,
        opacity: interpolate(frame, [10, 18], [0, 1], clamp),
      }}>
        <div style={{
          width: barWidth * barPulse,
          height: "100%",
          background: "linear-gradient(to right, #059669, #10B981, #34D399)",
          borderRadius: 3,
          boxShadow: "0 0 10px rgba(16,185,129,0.4)",
        }} />
        {/* Milestone markers */}
        {[50, 150, 250].map((m, i) => (
          <div key={i} style={{
            position: "absolute",
            left: (m / 300) * 600 - 1,
            top: -4,
            width: 2,
            height: 14,
            background: "#475569",
            borderRadius: 1,
          }} />
        ))}
      </div>

      {/* Bar labels */}
      <div style={{
        position: "absolute",
        left: "50%",
        top: 676,
        transform: "translateX(-50%)",
        width: 600,
        display: "flex",
        justifyContent: "space-between",
        opacity: interpolate(frame, [10, 18], [0, 1], clamp),
      }}>
        <span style={{ fontSize: 14, color: "#475569", fontFamily }}>0€</span>
        <span style={{ fontSize: 14, color: "#475569", fontFamily }}>300€</span>
      </div>
    </AbsoluteFill>
  );
};
