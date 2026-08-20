import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700", "800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const saasMockupSchema = z.object({
  appName: z.string().default("ProspectAI"),
  searchTerms: z.array(z.string()).default([
    "Responsable Marketing",
    "Responsable Influenceurs",
    "Responsable Partenariats",
  ]),
  results: z.array(z.object({ name: z.string(), company: z.string(), role: z.string() })).default([
    { name: "Sarah M.", company: "Canva", role: "Responsable Influence" },
    { name: "James R.", company: "Grammarly", role: "Responsable Partenariats" },
    { name: "Léa D.", company: "Adobe", role: "Responsable Marketing" },
    { name: "Kevin T.", company: "Notion", role: "Directeur Relations Influenceurs" },
  ]),
  prices: z.array(z.string()).default(["100 $ / mois", "200 $ / mois"]),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(5),
});

export type SaaSMockupProps = z.infer<typeof saasMockupSchema>;

export const SaaSMockup: React.FC<SaaSMockupProps> = ({
  appName, searchTerms, results, prices, accentColor, durationSecs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = durationSecs * 30;

  // Window fade in
  const windowOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });
  const windowScale = spring({ frame, fps, config: { mass: 0.5, damping: 13, stiffness: 180 }, from: 0.93, to: 1 });

  // Search term cycles
  const termDuration = 36;
  const currentTermIdx = Math.min(Math.floor(frame / termDuration), searchTerms.length - 1);
  const termLocalFrame = frame % termDuration;
  const currentTerm = searchTerms[currentTermIdx];
  const charCount = Math.floor(interpolate(termLocalFrame, [0, termDuration - 10], [0, currentTerm.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  // Results appear after first term is typed
  const resultsStart = termDuration;
  const resultStagger = 12;

  // Price tag grows at the end
  const priceStart = totalFrames - 55;
  const priceIdx = Math.floor((frame - priceStart) / 22);
  const currentPriceIdx = Math.max(0, Math.min(priceIdx, prices.length - 1));
  const priceScale = frame >= priceStart
    ? spring({ frame: Math.max(0, frame - priceStart), fps, config: { mass: 0.5, damping: 8, stiffness: 200 }, from: 0, to: 1 })
    : 0;
  const priceGrow = 1 + currentPriceIdx * 0.35;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />

      <AbsoluteFill style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 120px",
      }}>

        {/* App window */}
        <div style={{
          opacity: windowOpacity,
          transform: `scale(${windowScale})`,
          background: "rgba(8,16,40,0.92)",
          border: "1px solid rgba(80,130,255,0.25)",
          borderRadius: 20,
          overflow: "hidden",
          width: "100%",
          maxWidth: 1200,
          boxShadow: `0 0 80px ${accentColor}20`,
        }}>

          {/* Title bar */}
          <div style={{
            background: "rgba(12,24,60,0.95)",
            borderBottom: "1px solid rgba(80,130,255,0.2)",
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}>
            {/* Traffic lights */}
            <div style={{ display: "flex", gap: 8 }}>
              {["#ef4444", "#f59e0b", "#22c55e"].map(c => (
                <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c, opacity: 0.8 }} />
              ))}
            </div>
            <div style={{ fontFamily, fontWeight: 700, fontSize: 16, color: "rgba(200,220,255,0.6)", letterSpacing: "0.04em" }}>
              {appName} — Prospection IA
            </div>
          </div>

          <div style={{ display: "flex", height: 500 }}>
            {/* Sidebar */}
            <div style={{
              width: 200,
              background: "rgba(5,12,35,0.8)",
              borderRight: "1px solid rgba(80,130,255,0.15)",
              padding: "20px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}>
              {["🔍 Recherche", "📋 Contacts", "✉️ Emails", "📊 Stats"].map((item, i) => (
                <div key={i} style={{
                  fontFamily, fontWeight: 600, fontSize: 15,
                  color: i === 0 ? "#ffffff" : "rgba(120,150,220,0.5)",
                  background: i === 0 ? `${accentColor}20` : "transparent",
                  borderRadius: 8,
                  padding: "8px 12px",
                  letterSpacing: "0.02em",
                }}>
                  {item}
                </div>
              ))}
            </div>

            {/* Main content */}
            <div style={{ flex: 1, padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Search bar */}
              <div style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
              }}>
                <div style={{
                  flex: 1,
                  background: "rgba(20,40,100,0.5)",
                  border: `1.5px solid ${accentColor}50`,
                  borderRadius: 10,
                  padding: "10px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}>
                  <span style={{ opacity: 0.5, fontSize: 16 }}>🔍</span>
                  <div style={{
                    fontFamily, fontWeight: 600, fontSize: 20,
                    color: "rgba(200,220,255,0.95)",
                    minWidth: 300,
                    minHeight: 26,
                  }}>
                    {currentTerm.slice(0, charCount)}
                    <span style={{
                      display: "inline-block", width: 2, height: 20,
                      background: accentColor, marginLeft: 2, verticalAlign: "middle",
                      opacity: Math.abs(Math.sin(frame * 0.3)) > 0.5 ? 1 : 0,
                    }} />
                  </div>
                </div>
                <div style={{
                  background: accentColor,
                  borderRadius: 10,
                  padding: "10px 22px",
                  fontFamily, fontWeight: 700, fontSize: 16,
                  color: "#fff",
                }}>
                  Rechercher
                </div>
              </div>

              {/* Results */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {frame >= resultsStart && results.map((result, i) => {
                  const start = resultsStart + i * resultStagger;
                  const opacity = interpolate(frame, [start, start + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });
                  const x = interpolate(frame, [start, start + 10], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });
                  return (
                    <div key={i} style={{
                      opacity,
                      transform: `translateX(${x}px)`,
                      background: "rgba(15,30,80,0.5)",
                      border: "1px solid rgba(80,130,255,0.15)",
                      borderRadius: 10,
                      padding: "12px 18px",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%",
                        background: `${accentColor}30`,
                        border: `1px solid ${accentColor}40`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily, fontWeight: 800, fontSize: 14, color: accentColor,
                      }}>
                        {result.name[0]}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily, fontWeight: 700, fontSize: 17, color: "rgba(220,235,255,0.9)" }}>{result.name}</div>
                        <div style={{ fontFamily, fontWeight: 600, fontSize: 14, color: "rgba(120,150,220,0.6)" }}>{result.role} — {result.company}</div>
                      </div>
                      <div style={{
                        fontFamily, fontWeight: 600, fontSize: 13,
                        color: "#22c55e",
                        background: "rgba(34,197,94,0.12)",
                        borderRadius: 6, padding: "3px 10px",
                      }}>
                        ✓ Email trouvé
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>

        {/* Price tag overlay */}
        {frame >= priceStart && priceScale > 0 && (
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${priceScale * priceGrow})`,
            background: "rgba(5,10,30,0.95)",
            border: `3px solid ${accentColor}`,
            borderRadius: 20,
            padding: "30px 60px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            boxShadow: `0 0 60px ${accentColor}50`,
            zIndex: 20,
          }}>
            <div style={{ fontFamily, fontWeight: 700, fontSize: 20, color: "rgba(150,180,255,0.7)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Apollo.io
            </div>
            <div style={{ fontFamily, fontWeight: 800, fontSize: 52, color: "#ef4444", letterSpacing: "0.02em" }}>
              {prices[currentPriceIdx]}
            </div>
          </div>
        )}

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
