import {
  AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig,
  continueRender, delayRender,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { useEffect, useRef, useState } from "react";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "800"], subsets: ["latin"] });

export const teemDrop05Schema = z.object({});
export type TeemDrop05Props = z.infer<typeof teemDrop05Schema>;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// Simplified Côte d'Ivoire outline path (SVG path in 280×300 viewBox)
const CI_PATH =
  "M 140 10 C 155 12 168 18 175 28 C 182 38 180 52 185 62 " +
  "C 192 75 200 80 205 95 C 210 108 208 120 212 132 " +
  "C 215 145 218 158 215 170 C 212 182 205 190 198 200 " +
  "C 190 210 178 215 168 222 C 157 228 145 232 133 235 " +
  "C 120 238 108 235 96 230 C 84 225 73 218 65 208 " +
  "C 57 198 53 185 50 172 C 47 158 48 144 52 132 " +
  "C 55 118 62 108 66 94 C 70 80 70 65 76 52 " +
  "C 82 38 92 28 104 20 C 116 12 128 8 140 10 Z";

export const TeemDrop05: React.FC<TeemDrop05Props> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const [handle] = useState(() => delayRender("loading CI path length"));
  const [pathLength, setPathLength] = useState<number | null>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
      continueRender(handle);
    }
  }, [handle]);

  const typed = (text: string, start: number, end: number) =>
    text.substring(0, Math.floor(interpolate(frame, [start, end], [0, text.length], clamp)));
  const cursor = frame % 20 < 10 ? "|" : "";

  // ── Iris opening f0→f25 ───────────────────────────────────────────────────
  const irisRadius = interpolate(frame, [0, 25], [0, 960], {
    easing: Easing.bezier(0.4, 0, 0.6, 1),
    ...clamp,
  });

  // ── Polaroid f15→f50 ──────────────────────────────────────────────────────
  const polaroidElapsed = Math.max(0, frame - 15);
  const polaroidSpring = spring({ frame: polaroidElapsed, fps, config: { damping: 10, stiffness: 80 } });
  const polaroidScale = interpolate(polaroidSpring, [0, 1], [0.7, 1]);
  const polaroidRotate = interpolate(polaroidSpring, [0, 1], [-10, -4]);
  const polaroidOpacity = interpolate(frame, [15, 22], [0, 1], clamp);

  // ── CI map drawing f40→f130 ───────────────────────────────────────────────
  const totalLen = pathLength ?? 800;
  const drawnLength = interpolate(frame, [40, 120], [0, totalLen], {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    ...clamp,
  });
  const strokeOffset = totalLen - drawnLength;
  const strokeWidth = Math.sin(frame * 0.3) * 0.3 + 2.5;
  const fillOpacity = interpolate(frame, [90, 130], [0, 0.35], clamp);

  // Abidjan star f125
  const starElapsed = Math.max(0, frame - 125);
  const starSpring = spring({ frame: starElapsed, fps, config: { damping: 12, stiffness: 300 } });
  const starScale = starSpring;

  // ── Typewriter texts ───────────────────────────────────────────────────────
  const ciLabel = typed("Côte d'Ivoire, 2016", 120, 148);
  const nameLabel = typed("Ibrahim, 16 ans", 140, 158);
  const businessLabel = typed("Premier business 🎽", 158, 174);

  // ── Lines to the right of polaroid ────────────────────────────────────────
  const rightLines = [
    "Avant l'IA.",
    "Avant Internet.",
    "Juste de l'ambition",
    "et des T-shirts.",
  ];

  // ── Timeline at bottom ─────────────────────────────────────────────────────
  const timelineCursor = interpolate(frame, [50, 200], [0, 600], clamp);
  const timelineOpacity = interpolate(frame, [40, 55], [0, 1], clamp);

  // ── T-shirt + badge f170 ──────────────────────────────────────────────────
  const shirtOpacity = interpolate(frame, [170, 178], [0, 1], clamp);
  const badgeOpacity = interpolate(frame, [175, 183], [0, 1], clamp);

  // ── Hold micro-rotation f200→f225 ─────────────────────────────────────────
  const holdElapsed = Math.max(0, frame - 200);
  const holdSpring = spring({ frame: holdElapsed, fps, config: { damping: 200, stiffness: 20 } });
  const finalRotate = interpolate(holdSpring, [0, 1], [-4, -2]);

  const polaroidLeft = 380;
  const polaroidTop = 200;

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily }}>
      {/* Dark background behind iris */}
      <AbsoluteFill style={{ background: "#020617" }} />

      {/* Vintage cream world (clipped by iris) */}
      <AbsoluteFill>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <clipPath id="irisClip">
              <circle cx={960} cy={540} r={irisRadius} />
            </clipPath>
          </defs>
          <rect x={0} y={0} width={1920} height={1080} fill="#F5F0E8" clipPath="url(#irisClip)" />
        </svg>

        {/* Sepia wrapper (only inside iris reveal) */}
        <div style={{
          position: "absolute",
          inset: 0,
          clipPath: `circle(${irisRadius}px at 960px 540px)`,
          filter: "sepia(0.6) brightness(0.95)",
        }}>
          {/* Film grain overlay */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.06, pointerEvents: "none" }}>
            <defs>
              <filter id="grain">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" seed={frame} />
                <feColorMatrix type="saturate" values="0" />
              </filter>
            </defs>
            <rect width="100%" height="100%" filter="url(#grain)" />
          </svg>

          {/* ── Polaroid frame ── */}
          <div style={{
            position: "absolute",
            left: polaroidLeft,
            top: polaroidTop,
            width: 480,
            height: 560,
            background: "#FAF7F0",
            borderRadius: 4,
            boxShadow: "6px 8px 32px rgba(44,24,16,0.35), 0 2px 8px rgba(44,24,16,0.2)",
            transform: `scale(${polaroidScale}) rotate(${frame >= 200 ? finalRotate : polaroidRotate}deg)`,
            transformOrigin: "center center",
            opacity: polaroidOpacity,
          }}>
            {/* Image zone */}
            <div style={{
              position: "absolute",
              top: 24,
              left: 30,
              width: 420,
              height: 390,
              background: "#EDE8DC",
              overflow: "hidden",
            }}>
              {/* CI Map SVG */}
              <svg
                width={280}
                height={300}
                viewBox="0 0 280 300"
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  overflow: "visible",
                }}
              >
                {/* CI fill */}
                <path
                  d={CI_PATH}
                  fill="#A8B89A"
                  opacity={fillOpacity}
                />
                {/* CI stroke draw */}
                <path
                  ref={pathRef}
                  d={CI_PATH}
                  fill="none"
                  stroke="#2C1810"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={`${totalLen}`}
                  strokeDashoffset={`${strokeOffset}`}
                />

                {/* Abidjan star */}
                {frame >= 120 && (
                  <g transform={`translate(155, 180) scale(${starScale})`}>
                    <polygon
                      points="0,-8 2,-3 8,-3 3,1 5,7 0,3 -5,7 -3,1 -8,-3 -2,-3"
                      fill="#C17B3F"
                    />
                    <text x={0} y={20} textAnchor="middle"
                      fontSize={11} fill="#2C1810" fontFamily={fontFamily}
                      style={{ fontWeight: 600 }}>
                      Abidjan
                    </text>
                  </g>
                )}
              </svg>

              {/* Location label */}
              <div style={{
                position: "absolute",
                bottom: 8,
                left: 8,
                fontFamily: "monospace",
                fontSize: 14,
                color: "#2C1810",
                opacity: interpolate(frame, [120, 135], [0, 1], clamp),
              }}>
                {ciLabel}{frame >= 120 && frame < 148 ? cursor : ""}
              </div>
            </div>

            {/* White bottom zone */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: 480,
              height: 146,
              background: "#FAF7F0",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "12px 24px",
            }}>
              <div style={{
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                fontSize: 20,
                color: "#2C1810",
                opacity: interpolate(frame, [140, 155], [0, 1], clamp),
              }}>
                {nameLabel}{frame >= 140 && frame < 158 ? cursor : ""}
              </div>
              <div style={{
                fontFamily: "monospace",
                fontSize: 16,
                color: "#6B7C4A",
                marginTop: 6,
                opacity: interpolate(frame, [158, 172], [0, 1], clamp),
              }}>
                {businessLabel}
              </div>
            </div>

            {/* T-shirt badge */}
            <div style={{
              position: "absolute",
              bottom: -20,
              right: -20,
              width: 56,
              height: 56,
              background: "#C17B3F",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              opacity: badgeOpacity,
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}>
              ×3
            </div>
          </div>

          {/* T-shirt icon */}
          <div style={{
            position: "absolute",
            left: polaroidLeft + 380,
            top: polaroidTop + 510,
            fontSize: 40,
            opacity: shirtOpacity,
          }}>
            🎽
          </div>

          {/* Right side text lines */}
          {rightLines.map((line, i) => {
            const lineStart = 155 + i * 8;
            const lineOpacity = interpolate(frame, [lineStart, lineStart + 8], [0, 1], clamp);
            const lineX = interpolate(
              spring({ frame: Math.max(0, frame - lineStart), fps, config: { damping: 14, stiffness: 160 } }),
              [0, 1], [30, 0]
            );
            return (
              <div key={i} style={{
                position: "absolute",
                left: 920,
                top: 360 + i * 68,
                fontSize: 38,
                fontWeight: 800,
                color: "#2C1810",
                fontFamily,
                opacity: lineOpacity,
                transform: `translateX(${lineX}px)`,
              }}>
                {line}
              </div>
            );
          })}

          {/* Timeline at bottom */}
          <div style={{
            position: "absolute",
            left: "50%",
            bottom: 60,
            transform: "translateX(-50%)",
            width: 600,
            opacity: timelineOpacity,
          }}>
            <div style={{
              position: "relative",
              height: 3,
              background: "rgba(193,123,63,0.3)",
              borderRadius: 2,
            }}>
              <div style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: timelineCursor,
                height: "100%",
                background: "#C17B3F",
                borderRadius: 2,
              }} />
              <div style={{
                position: "absolute",
                left: timelineCursor - 4,
                top: -4,
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#C17B3F",
                boxShadow: "0 0 8px rgba(193,123,63,0.6)",
              }} />
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 8,
              fontSize: 14,
              color: "#6B7C4A",
              fontFamily,
            }}>
              <span>2016</span>
              <span>Aujourd'hui</span>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
