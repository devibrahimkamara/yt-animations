import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["400", "600"], subsets: ["latin"] });

export type ContentType = "code" | "spreadsheet" | "analytics" | "design" | "browser" | "video";
export type ExitDir = "top-left" | "top" | "top-right" | "bottom-left" | "bottom" | "bottom-right";

export interface AppWindowProps {
  contentType: ContentType;
  x: number;
  y: number;
  w: number;
  h: number;
  baseRotation: number;
  exitDir: ExitDir;
  index: number;
}

const EXIT_VECTORS: Record<ExitDir, { x: number; y: number }> = {
  "top-left":     { x: -900, y: -900 },
  "top":          { x: 0,    y: -900 },
  "top-right":    { x:  900, y: -900 },
  "bottom-left":  { x: -900, y:  900 },
  "bottom":       { x: 0,    y:  900 },
  "bottom-right": { x:  900, y:  900 },
};

const WINDOW_TITLES: Record<ContentType, string> = {
  code:        "brand.js — VS Code",
  spreadsheet: "Budget — Numbers",
  analytics:   "Analytics — Dashboard",
  design:      "Mockup — Figma",
  browser:     "Chrome — Recherche",
  video:       "Montage — Premiere",
};

// ── Content components ──────────────────────────────────────────────────────

const CodeContent: React.FC = () => (
  <div style={{
    background: "#1E1E2E",
    height: "100%",
    padding: "10px 14px",
    fontFamily: "monospace",
    fontSize: 12,
    lineHeight: 1.75,
    overflow: "hidden",
  }}>
    {([
      [["const", "#cba6f7"], [" loadBrand", "#cdd6f4"], [" = async () => {", "#89b4fa"]],
      [["  const", "#cba6f7"], [" niche", "#cdd6f4"], [" = await ", "#89dceb"], ["ai.suggest()", "#a6e3a1"]],
      [["  const", "#cba6f7"], [" design", "#cdd6f4"], [" = await ", "#89dceb"], ["createDesign(niche)", "#a6e3a1"]],
      [["  // Upload to Printify", "#6c7086"]],
      [["  await ", "#89dceb"], ["printify.", "#cdd6f4"], ["upload", "#a6e3a1"], ["(design)", "#cdd6f4"]],
      [["  return", "#cba6f7"], [" { status:", "#cdd6f4"], [" 'live'", "#a6e3a1"], [" }", "#cdd6f4"]],
      [["}", "#cdd6f4"]],
    ] as [string, string][][]).map((line, li) => (
      <div key={li}>
        {line.map(([text, color], si) => (
          <span key={si} style={{ color }}>{text}</span>
        ))}
      </div>
    ))}
  </div>
);

const SpreadsheetContent: React.FC = () => {
  const cols = ["", "A", "B", "C", "D"];
  const rows: [string, string, string, string, string][] = [
    ["", "Produit", "Coût", "Prix", "Marge"],
    ["2", "T-Shirt",  "8 €",  "25 €", "17 €"],
    ["3", "Hoodie",  "15 €", "45 €", "30 €"],
    ["4", "Cap",      "5 €",  "18 €", "13 €"],
    ["5", "Total",    "",     "",     "60 €"],
  ];
  return (
    <div style={{ height: "100%", overflow: "hidden", background: "#fff", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", background: "#f1f3f5", borderBottom: "1px solid #dee2e6" }}>
        {cols.map((c, i) => (
          <div key={i} style={{
            flex: i === 0 ? "0 0 28px" : 1,
            textAlign: "center",
            fontSize: 10,
            fontWeight: 700,
            color: "#495057",
            padding: "4px 0",
            borderRight: "1px solid #dee2e6",
          }}>{c}</div>
        ))}
      </div>
      {rows.map((row, ri) => (
        <div key={ri} style={{
          display: "flex",
          background: ri === 0 ? "#e8f4f8" : ri % 2 === 0 ? "#f8f9fa" : "#fff",
          borderBottom: "1px solid #dee2e6",
        }}>
          {row.map((cell, ci) => (
            <div key={ci} style={{
              flex: ci === 0 ? "0 0 28px" : 1,
              fontSize: 11,
              color: ci === 0 ? "#adb5bd" : ri === 0 ? "#343a40" : "#212529",
              fontWeight: ri === 0 || ri === 4 ? 700 : 400,
              padding: "5px 6px",
              borderRight: "1px solid #dee2e6",
              textAlign: ci > 1 ? "right" : "left",
            }}>{cell}</div>
          ))}
        </div>
      ))}
    </div>
  );
};

const AnalyticsContent: React.FC = () => {
  const bars = [35, 52, 44, 68, 80, 63, 91];
  return (
    <div style={{
      background: "#fff",
      height: "100%",
      padding: "14px 14px 10px",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      fontFamily: "system-ui, sans-serif",
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#212529" }}>Ventes hebdomadaires</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, flex: 1 }}>
        {bars.map((h, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <div style={{
              width: "100%",
              height: `${h}%`,
              maxHeight: 110,
              background: i === 6
                ? "linear-gradient(180deg, #3060ff, #88aaff)"
                : "linear-gradient(180deg, #93c5fd, #bfdbfe)",
              borderRadius: "4px 4px 0 0",
            }} />
            <div style={{ fontSize: 9, color: "#868e96" }}>J{i + 1}</div>
          </div>
        ))}
      </div>
      <div style={{ height: 1, background: "#dee2e6" }} />
      <div style={{ display: "flex", gap: 16, fontSize: 10 }}>
        <div>
          <span style={{ color: "#22c55e", fontWeight: 700 }}>↑ 32%</span>
          <span style={{ color: "#868e96" }}> vs sem. préc.</span>
        </div>
        <div style={{ color: "#868e96" }}>
          Objectif: <span style={{ color: "#3060ff", fontWeight: 600 }}>120 ventes</span>
        </div>
      </div>
    </div>
  );
};

const DesignContent: React.FC = () => (
  <div style={{ background: "#f0f0f0", height: "100%", display: "flex" }}>
    <div style={{
      width: 36,
      background: "#2c2c2c",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4,
      padding: "8px 0",
    }}>
      {(["▶", "□", "○", "✎", "⌕", "✂"] as string[]).map((icon, i) => (
        <div key={i} style={{
          width: 28,
          height: 28,
          background: i === 0 ? "#3060ff" : "transparent",
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          color: "#ccc",
        }}>{icon}</div>
      ))}
    </div>
    <div style={{ flex: 1, position: "relative" }}>
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 110,
        height: 110,
        background: "#fff",
        borderRadius: 8,
        border: "2px solid #3060ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 48,
        boxShadow: "0 4px 20px rgba(48,96,255,0.2)",
      }}>👕</div>
      {([[-1, -1], [1, -1], [-1, 1], [1, 1]] as [number, number][]).map(([dx, dy], i) => (
        <div key={i} style={{
          position: "absolute",
          top: `calc(50% + ${dy * 57}px)`,
          left: `calc(50% + ${dx * 57}px)`,
          width: 8,
          height: 8,
          background: "#fff",
          border: "2px solid #3060ff",
          borderRadius: 2,
          transform: "translate(-50%, -50%)",
        }} />
      ))}
    </div>
  </div>
);

const BrowserContent: React.FC = () => (
  <div style={{ background: "#fff", height: "100%", display: "flex", flexDirection: "column", fontFamily: "system-ui, sans-serif" }}>
    <div style={{ background: "#f1f3f4", borderBottom: "1px solid #dadce0", display: "flex", padding: "6px 8px 0", gap: 3 }}>
      {(["Fournisseur T-Shirt", "Printify - Login", "ChatGPT"] as string[]).map((tab, i) => (
        <div key={i} style={{
          background: i === 0 ? "#fff" : "transparent",
          borderRadius: "6px 6px 0 0",
          padding: "4px 10px",
          fontSize: 10,
          color: i === 0 ? "#202124" : "#5f6368",
          borderTop: i === 0 ? "2px solid #3060ff" : "none",
          whiteSpace: "nowrap",
          overflow: "hidden",
          maxWidth: 90,
          textOverflow: "ellipsis",
        }}>{tab}</div>
      ))}
    </div>
    <div style={{ padding: "5px 8px", background: "#f1f3f4" }}>
      <div style={{
        background: "#fff",
        border: "1px solid #dadce0",
        borderRadius: 20,
        padding: "3px 12px",
        fontSize: 11,
        color: "#202124",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}>
        <span style={{ color: "#188038", fontSize: 10 }}>🔒</span>
        <span>printify.com/app/shop/products</span>
      </div>
    </div>
    <div style={{ flex: 1, padding: "8px 12px", overflow: "hidden" }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#202124", marginBottom: 6 }}>Top T-Shirt Suppliers</div>
      {(["Gildan 64000 — Bestseller", "Bella+Canvas 3001 — Premium", "Next Level 3600 — Soft"] as string[]).map((item, i) => (
        <div key={i} style={{
          padding: "5px 0",
          borderBottom: "1px solid #f1f3f4",
          fontSize: 11,
          color: i === 0 ? "#1a73e8" : "#202124",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3060ff", flexShrink: 0 }} />
          {item}
        </div>
      ))}
    </div>
  </div>
);

const VideoContent: React.FC = () => {
  const tracks: Array<{ label: string; clips: Array<{ start: number; w: number; color: string }> }> = [
    { label: "V1", clips: [{ start: 0, w: 40, color: "#3060ff" }, { start: 45, w: 35, color: "#1a3a8f" }, { start: 85, w: 15, color: "#3060ff" }] },
    { label: "V2", clips: [{ start: 10, w: 25, color: "#88aaff" }, { start: 55, w: 30, color: "#4080ff" }] },
    { label: "A1", clips: [{ start: 0, w: 100, color: "#22c55e" }] },
    { label: "A2", clips: [{ start: 20, w: 60, color: "#86efac" }] },
  ];
  return (
    <div style={{ background: "#1a1a2e", height: "100%", display: "flex", flexDirection: "column", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", padding: "8px", gap: 8, flex: "0 0 76px" }}>
        <div style={{
          flex: 1,
          background: "#0d0d1a",
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
        }}>🎬</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, justifyContent: "center" }}>
          {(["00:00:00", "30 fps", "1920×1080"] as string[]).map((t, i) => (
            <div key={i} style={{ fontSize: 9, color: "#8888aa", fontFamily: "monospace" }}>{t}</div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, padding: "0 8px 8px", display: "flex", flexDirection: "column", gap: 3 }}>
        <div style={{ height: 14, background: "#0d0d1a", borderRadius: 2, display: "flex", alignItems: "center", padding: "0 4px" }}>
          {([0, 10, 20, 30] as number[]).map((t) => (
            <div key={t} style={{ flex: t === 0 ? 0 : 1, fontSize: 8, color: "#8888aa", textAlign: "right" }}>{t}s</div>
          ))}
        </div>
        {tracks.map((track, ti) => (
          <div key={ti} style={{ display: "flex", gap: 4, alignItems: "center", height: 22 }}>
            <div style={{ width: 20, fontSize: 9, color: "#8888aa", textAlign: "right", flexShrink: 0 }}>{track.label}</div>
            <div style={{ flex: 1, background: "#0d0d1a", borderRadius: 3, height: "100%", position: "relative", overflow: "hidden" }}>
              {track.clips.map((clip, ci) => (
                <div key={ci} style={{
                  position: "absolute",
                  left: `${clip.start}%`,
                  width: `${clip.w}%`,
                  top: 2,
                  bottom: 2,
                  background: clip.color,
                  borderRadius: 2,
                  opacity: 0.85,
                }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CONTENT_COMPONENTS: Record<ContentType, React.FC> = {
  code:        CodeContent,
  spreadsheet: SpreadsheetContent,
  analytics:   AnalyticsContent,
  design:      DesignContent,
  browser:     BrowserContent,
  video:       VideoContent,
};

// ── AppWindow ───────────────────────────────────────────────────────────────

export const AppWindow: React.FC<AppWindowProps> = ({
  contentType, x, y, w, h, baseRotation, exitDir, index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ENTER_DELAY = index * 4;
  const EXIT_START = 55 + index * 8;
  const exitVec = EXIT_VECTORS[exitDir];

  // Entry (spring: slight bounce)
  const entryProgress = spring({
    frame: Math.max(0, frame - ENTER_DELAY),
    fps,
    config: { damping: 12, stiffness: 120 },
  });
  const entryOpacity = Math.min(1, entryProgress);
  const entryScale = interpolate(entryProgress, [0, 1], [0.8, 1]);
  const entryY = interpolate(entryProgress, [0, 1], [20, 0]);

  // Float (sinusoidal, always active, subtle)
  const floatY = Math.sin(frame / 15 + index) * 4;

  // Exit (spring: energetic departure)
  const exitProgress = frame >= EXIT_START
    ? spring({ frame: frame - EXIT_START, fps, config: { damping: 14, mass: 0.8 } })
    : 0;
  const exitX = exitVec.x * exitProgress;
  const exitYDelta = exitVec.y * exitProgress;
  const exitScale = Math.max(0.4, 1 - exitProgress * 0.4);
  const exitOpacity = Math.max(0, 1 - exitProgress);
  const exitRotation = baseRotation + exitProgress * (baseRotation * 2);

  const opacity = entryOpacity * exitOpacity;
  const scale = entryScale * exitScale;
  const rotation = frame >= EXIT_START ? exitRotation : baseRotation;
  const totalY = entryY + floatY + exitYDelta;

  const ContentComp = CONTENT_COMPONENTS[contentType];

  return (
    <div style={{
      position: "absolute",
      left: `${x}%`,
      top: `${y}%`,
      width: w,
      height: h,
      opacity,
      transform: `translate(-50%, -50%) translateX(${exitX}px) translateY(${totalY}px) scale(${scale}) rotate(${rotation}deg)`,
      borderRadius: 12,
      overflow: "hidden",
      boxShadow: "0 8px 40px rgba(0,0,0,0.55), 0 0 24px rgba(48,96,255,0.14)",
      border: "1px solid rgba(80,130,255,0.18)",
    }}>
      {/* Title bar */}
      <div style={{
        height: 32,
        background: "#E4E6EA",
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        gap: 8,
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", gap: 6 }}>
          {(["#FF5F56", "#FFBD2E", "#27C93F"] as string[]).map((color, i) => (
            <div key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: color }} />
          ))}
        </div>
        <div style={{
          flex: 1,
          textAlign: "center",
          fontSize: 11,
          color: "#5F6368",
          fontFamily,
          fontWeight: 600,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          letterSpacing: "0.01em",
        }}>
          {WINDOW_TITLES[contentType]}
        </div>
      </div>
      {/* Content */}
      <div style={{ height: h - 32, overflow: "hidden" }}>
        <ContentComp />
      </div>
    </div>
  );
};
