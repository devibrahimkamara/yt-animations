import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/RobotoMono";
import { Stage } from "../higgsMarketing/Stage";
import { ACCENT, TERMINAL_BG, TERMINAL_GREEN } from "../higgsMarketing/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["500", "700"],
  subsets: ["latin"],
});

// Anim 7 — « Le terminal whoami » (180 frames / 6 s @ 30 fps)
// Phase 1 fenêtre 0–15 · Phase 2 "whoami" tapé 15–55 ·
// Phase 3 réponse nom 55–85 · Phase 4 "depuis" tapé 85–120 ·
// Phase 5 réponse 2020 mise en valeur 120–150 · Phase 6 maintien 150–180

export const higgsMarketingAnim07Schema = z.object({
  name: z.string().default("Ibrahim Camara"),
  year: z.string().default("2020"),
});
export type HiggsMarketingAnim07Props = z.infer<
  typeof higgsMarketingAnim07Schema
>;

function typed(text: string, frame: number, start: number, stepFrames = 2): string {
  const n = Math.max(0, Math.floor((frame - start) / stepFrames));
  return text.slice(0, Math.min(text.length, n));
}

const Cursor: React.FC<{ visible: boolean }> = ({ visible }) => {
  const frame = useCurrentFrame();
  const on = Math.floor(frame / 15) % 2 === 0;
  return (
    <span
      style={{
        display: "inline-block",
        width: 12,
        height: 30,
        marginLeft: 4,
        background: TERMINAL_GREEN,
        opacity: visible && on ? 1 : 0,
        verticalAlign: "middle",
      }}
    />
  );
};

export const HiggsMarketingAnim07TerminalWhoami: React.FC<
  HiggsMarketingAnim07Props
> = ({ name, year }) => {
  const frame = useCurrentFrame();

  const winOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const winY = interpolate(frame, [0, 15], [15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cmd1 = typed("whoami", frame, 15);
  const nameOpacity = interpolate(frame, [55, 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cmd2 = typed("depuis", frame, 85);

  const yearOpacity = interpolate(frame, [120, 128], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const yearScale = interpolate(frame, [120, 130], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const colorT = interpolate(frame, [120, 132], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const yearColor = `rgb(${255 + (parseInt(ACCENT.slice(1, 3), 16) - 255) * colorT}, ${255 + (parseInt(ACCENT.slice(3, 5), 16) - 255) * colorT}, ${255 + (parseInt(ACCENT.slice(5, 7), 16) - 255) * colorT})`;
  const yearGlow = interpolate(frame, [130, 136, 145], [0, 0.7, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage outFrames={10} bare>
      <AbsoluteFill style={{ background: "#050505" }}>
        <div
          style={{
            position: "absolute",
            left: 90,
            bottom: 90,
            width: 760,
            borderRadius: 14,
            background: TERMINAL_BG,
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
            opacity: winOpacity,
            transform: `translateY(${winY}px)`,
            fontFamily,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 10,
              padding: "14px 18px",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            {["#ff5f56", "#ffbd2e", "#27c93f"].map((c) => (
              <div key={c} style={{ width: 14, height: 14, borderRadius: "50%", background: c }} />
            ))}
          </div>
          <div style={{ padding: "24px 28px 32px", fontSize: 26, lineHeight: 1.9, color: "#e5e5e5" }}>
            <div>
              <span style={{ color: TERMINAL_GREEN }}>{"> "}</span>
              <span style={{ color: TERMINAL_GREEN }}>{cmd1}</span>
              <Cursor visible={frame >= 15 && frame < 60} />
            </div>
            {frame >= 55 && (
              <div style={{ opacity: nameOpacity }}>{name}</div>
            )}
            {frame >= 85 && (
              <div>
                <span style={{ color: TERMINAL_GREEN }}>{"> "}</span>
                <span style={{ color: TERMINAL_GREEN }}>{cmd2}</span>
                <Cursor visible={frame >= 85 && frame < 130} />
              </div>
            )}
            {frame >= 120 && (
              <div
                style={{
                  opacity: yearOpacity,
                  transform: `scale(${yearScale})`,
                  transformOrigin: "left",
                  display: "inline-block",
                  color: yearColor,
                  fontWeight: 700,
                  textShadow: `0 0 30px rgba(48,96,255,${yearGlow})`,
                }}
              >
                {year}
              </div>
            )}
            {frame >= 150 && (
              <div>
                <span style={{ color: TERMINAL_GREEN }}>{"> "}</span>
                <Cursor visible />
              </div>
            )}
          </div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
