import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["400", "500", "800"], subsets: ["latin"] });

export const teemDrop03Schema = z.object({});
export type TeemDrop03Props = z.infer<typeof teemDrop03Schema>;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const YEARS = [
  { year: 2020, start: 0,  end: 18 },
  { year: 2021, start: 18, end: 34 },
  { year: 2022, start: 34, end: 48 },
  { year: 2023, start: 48, end: 60 },
  { year: 2024, start: 60, end: 70 },
  { year: 2025, start: 70, end: 78 },
  { year: 2026, start: 78, end: 90 },
];

// Frame indices where a new year starts (stroboscope flash)
const FLASH_FRAMES = [18, 34, 48, 60, 70, 78];

const BLOBS = [
  { color: "rgba(20,60,220,0.20)",  x: 18, y: 22, size: 580, blur: 120, phase: 0.0 },
  { color: "rgba(48,96,255,0.17)",  x: 78, y: 68, size: 520, blur: 140, phase: 2.2 },
  { color: "rgba(10,30,160,0.22)",  x: 50, y: 88, size: 680, blur: 130, phase: 4.4 },
];

const PARTICLES = [
  { x: 12, y: 18 }, { x: 38, y: 62 }, { x: 58, y: 28 },
  { x: 75, y: 78 }, { x: 22, y: 85 }, { x: 88, y: 42 },
  { x: 48, y: 12 }, { x: 68, y: 88 }, { x: 84, y: 55 },
  { x: 8,  y: 48 },
];

export const TeemDrop03: React.FC<TeemDrop03Props> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame * 0.005;

  // ── Flash overlays ──────────────────────────────────────────────────────────
  const isSmallFlash = FLASH_FRAMES.some((f) => frame >= f && frame < f + 2);
  const isBigFlash   = frame >= 78 && frame < 82;
  const flashOpacity = isBigFlash ? 0.15 : isSmallFlash ? 0.06 : 0;

  // ── Phase 2: halo ───────────────────────────────────────────────────────────
  const haloScale = frame >= 82
    ? spring({ frame: frame - 82, fps, config: { damping: 20, stiffness: 80 } })
    : 0;

  // ── Phase 2: "6" crashes down ───────────────────────────────────────────────
  const sixElapsed = frame - 85;
  const sixSpring = sixElapsed >= 0
    ? spring({ frame: sixElapsed, fps, config: { damping: 6, stiffness: 150 } })
    : 0;
  const sixY         = interpolate(sixSpring, [0, 1], [-300, 0]);
  const sixOpacity   = interpolate(frame, [85, 91], [0, 1], clamp);
  // Impact shockwave: scale pulses 1→1.08→1 at ~f96
  const sixShockwave = interpolate(frame, [96, 98, 100], [1, 1.08, 1], clamp);

  // ── Phase 2: "ANS" slides from right ────────────────────────────────────────
  const ansElapsed = frame - 92;
  const ansSpring = ansElapsed >= 0
    ? spring({ frame: ansElapsed, fps, config: { damping: 14, stiffness: 180 } })
    : 0;
  const ansX       = interpolate(ansSpring, [0, 1], [200, 0]);
  const ansOpacity = interpolate(frame, [92, 98], [0, 1], clamp);

  // ── Phase 2: subtitle ───────────────────────────────────────────────────────
  const subtitleOpacity = interpolate(frame, [100, 112], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>

      {/* ── Dark background ── */}
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse at center, #0F172A 0%, #020617 100%)",
      }} />

      {/* ── Aurora blobs ── */}
      {BLOBS.map((blob, i) => {
        const p = t + blob.phase;
        return (
          <div key={i} style={{
            position: "absolute",
            borderRadius: "50%",
            background: blob.color,
            filter: `blur(${blob.blur}px)`,
            width: blob.size,
            height: blob.size * 0.7,
            left: `${blob.x + Math.sin(p * 0.4) * 5}%`,
            top:  `${blob.y + Math.cos(p * 0.3) * 4}%`,
            transform: "translate(-50%, -50%)",
          }} />
        );
      })}

      {/* ── Floating particles ── */}
      {PARTICLES.map((p, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${p.x}%`,
          top:  `${p.y + Math.sin(frame / 20 + i * 1.2) * 2}%`,
          width: 3,
          height: 3,
          borderRadius: "50%",
          background: "#3060ff",
          opacity: 0.3,
        }} />
      ))}

      {/* ══════════════════════════════
          PHASE 1 — Décompte des années
          ══════════════════════════════ */}
      {YEARS.map((y, i) => {
        const elapsed = frame - y.start;
        if (elapsed < 0 || frame >= y.end) return null;

        // 2026 — explosion immédiate, pas d'entrée/sortie normale
        if (y.year === 2026) {
          const explodeScale   = interpolate(frame, [78, 88], [1, 3], clamp);
          const explodeOpacity = interpolate(frame, [78, 88], [1, 0], clamp);
          return (
            <AbsoluteFill key={y.year} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transform: `scale(${explodeScale})`,
                opacity: explodeOpacity,
              }}>
                <span style={{ fontFamily, fontSize: 200, fontWeight: 800, color: "#FFFFFF", lineHeight: 1, letterSpacing: -4 }}>
                  2026
                </span>
                <span style={{
                  position: "absolute",
                  left: "calc(50% + 220px)",
                  top: -72,
                  fontFamily,
                  fontSize: 28,
                  fontWeight: 500,
                  color: "#475569",
                  whiteSpace: "nowrap",
                }}>
                  AN 7
                </span>
              </div>
            </AbsoluteFill>
          );
        }

        // Années 2020–2025 — entrée spring + sortie interpolate
        const entrySpring = spring({ frame: elapsed, fps, config: { damping: 18, stiffness: 300 } });
        const entryY       = interpolate(entrySpring, [0, 1], [-40, 0]);
        const entryScale   = interpolate(entrySpring, [0, 1], [1.3, 1]);
        const entryOpacity = interpolate(entrySpring, [0, 1], [0, 1]);

        const exitOpacity = interpolate(frame, [y.end - 5, y.end], [1, 0], clamp);
        const exitScale   = interpolate(frame, [y.end - 5, y.end], [1, 0.85], clamp);
        const exitY       = interpolate(frame, [y.end - 5, y.end], [0, 30], clamp);

        const combinedOpacity = entryOpacity * exitOpacity;
        const combinedScale   = entryScale * exitScale;
        const combinedY       = entryY + exitY;

        const underlineWidth = interpolate(elapsed, [0, 8], [0, 180], clamp);
        // Motion blur during the exit window (last 3 frames before switch)
        const isTransition = frame >= y.end - 3 && frame <= y.end;

        return (
          <AbsoluteFill key={y.year} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transform: `translateY(${combinedY}px) scale(${combinedScale})`,
              opacity: combinedOpacity,
              filter: isTransition ? "blur(2px)" : "none",
            }}>
              <span style={{
                fontFamily,
                fontSize: 200,
                fontWeight: 800,
                color: "#FFFFFF",
                lineHeight: 1,
                letterSpacing: -4,
              }}>
                {y.year}
              </span>

              {/* Ligne de soulignement */}
              <div style={{
                width: underlineWidth,
                height: 4,
                background: "#FFFFFF",
                opacity: exitOpacity,
                marginTop: 12,
                borderRadius: 2,
              }} />

              {/* Compteur secondaire : AN {n} */}
              <span style={{
                position: "absolute",
                left: "calc(50% + 220px)",
                top: -72,
                fontFamily,
                fontSize: 28,
                fontWeight: 500,
                color: "#475569",
                whiteSpace: "nowrap",
              }}>
                AN {i + 1}
              </span>
            </div>
          </AbsoluteFill>
        );
      })}

      {/* ══════════════════════════════
          PHASE 2 — "6 ANS"
          ══════════════════════════════ */}

      {/* Halo */}
      {frame >= 82 && (
        <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "#1E3A5F",
            transform: `scale(${haloScale})`,
            flexShrink: 0,
          }} />
        </AbsoluteFill>
      )}

      {/* "6" — tombe du haut avec rebond */}
      {frame >= 85 && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          // -70% left aligns right edge of "6" near center; -50% centers vertically
          transform: `translate(-70%, -50%) translateY(${sixY}px) scale(${sixShockwave})`,
          fontFamily,
          fontSize: 320,
          fontWeight: 800,
          color: "#3060ff",
          lineHeight: 0.85,
          letterSpacing: -10,
          opacity: sixOpacity,
          userSelect: "none",
        }}>
          6
        </div>
      )}

      {/* "ANS" — glisse depuis la droite, bas-droite du "6" */}
      {frame >= 92 && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(2%, 38%) translateX(${ansX}px)`,
          fontFamily,
          fontSize: 160,
          fontWeight: 800,
          color: "#FFFFFF",
          lineHeight: 1,
          letterSpacing: 6,
          opacity: ansOpacity,
          userSelect: "none",
        }}>
          ANS
        </div>
      )}

      {/* Sous-titre contextuel */}
      {frame >= 100 && (
        <div style={{
          position: "absolute",
          bottom: 260,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          fontFamily,
          fontSize: 32,
          fontWeight: 400,
          color: "#94A3B8",
          opacity: subtitleOpacity,
          letterSpacing: 1,
          userSelect: "none",
        }}>
          de business sur Internet
        </div>
      )}

      {/* Flash stroboscopique */}
      {flashOpacity > 0 && (
        <AbsoluteFill style={{ background: `rgba(255,255,255,${flashOpacity})`, pointerEvents: "none" }} />
      )}

      {/* Vignette cinématographique */}
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)",
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};
