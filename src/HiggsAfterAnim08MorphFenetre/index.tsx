import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsAfter/Stage";
import { INK, FONT } from "../higgsAfter/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["500", "600"],
  subsets: ["latin"],
});

// Anim 8 — Plan 8 « Morph fenêtre navigateur → app desktop » (210 frames / 7s)
// A fenêtre navigateur 0–15 · B hold 15–39 · C label web 39–48 ·
// D morph 48–132 · E croisement labels 132–144 · F hold desktop 144–210

export const higgsAfterAnim08Schema = z.object({});
export type HiggsAfterAnim08Props = z.infer<typeof higgsAfterAnim08Schema>;

export const HiggsAfterAnim08MorphFenetre: React.FC<
  HiggsAfterAnim08Props
> = () => {
  const frame = useCurrentFrame();

  const winIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const t = interpolate(frame, [48, 132], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const width = interpolate(t, [0, 1], [1400, 900]);
  const height = interpolate(t, [0, 1], [720, 600]);
  const radius = interpolate(t, [0, 1], [8, 20]);
  const barH = interpolate(t, [0, 1], [58, 40]);

  const urlOpacity = interpolate(t, [0, 0.6], [1, 0], {
    extrapolateRight: "clamp",
  });
  const urlScaleX = interpolate(t, [0, 0.7], [1, 0], {
    extrapolateRight: "clamp",
  });
  const dotsOpacity = interpolate(t, [0.6, 1], [0, 1], {
    extrapolateLeft: "clamp",
  });

  const webLabelIn = interpolate(frame, [39, 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const webLabelX = interpolate(frame, [126, 144], [0, -260], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const webLabelOpacity = interpolate(frame, [126, 144], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const deskLabelX = interpolate(frame, [126, 144], [260, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const deskLabelOpacity = interpolate(frame, [126, 144], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage outFrames={2}>
      <AbsoluteFill
        style={{
          background: "#0a0a0c",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ opacity: winIn }}>
          <div
            style={{
              width,
              height,
              borderRadius: radius,
              background: "#f4f4f6",
              overflow: "hidden",
              boxShadow: "0 40px 90px rgba(0,0,0,0.5)",
              position: "relative",
            }}
          >
            {/* Barre du haut (URL ↔ titre desktop) */}
            <div
              style={{
                height: barH,
                background: "#e4e4e8",
                display: "flex",
                alignItems: "center",
                padding: "0 20px",
                position: "relative",
              }}
            >
              {/* pastilles macOS */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  opacity: dotsOpacity,
                  position: "absolute",
                  left: 18,
                }}
              >
                {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                  <div
                    key={c}
                    style={{
                      width: 13,
                      height: 13,
                      borderRadius: 13,
                      background: c,
                    }}
                  />
                ))}
              </div>
              {/* barre d'URL */}
              <div
                style={{
                  marginLeft: dotsOpacity > 0.3 ? 70 : 0,
                  flex: 1,
                  height: 32,
                  borderRadius: 8,
                  background: "#fff",
                  border: "1px solid #ccc",
                  opacity: urlOpacity,
                  transform: `scaleX(${Math.max(0, urlScaleX)})`,
                  transformOrigin: "left center",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 14,
                  fontFamily,
                  fontSize: 16,
                  color: "#444",
                }}
              >
                🔒 chatgpt.com
              </div>
            </div>

            {/* Corps générique de l'interface */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                top: barH,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: 24,
                gap: 10,
              }}
            >
              <div
                style={{
                  height: "60%",
                  background: "#fafafa",
                  borderRadius: 10,
                }}
              />
              <div
                style={{
                  height: 44,
                  background: "#eee",
                  borderRadius: 10,
                  border: "1px solid #ddd",
                }}
              />
            </div>
          </div>

          {/* Labels */}
          <div
            style={{
              marginTop: 40,
              textAlign: "center",
              position: "relative",
              height: FONT.label,
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "100%",
                fontFamily,
                fontWeight: 500,
                fontSize: FONT.label,
                color: INK,
                opacity: webLabelIn * webLabelOpacity,
                transform: `translateX(${webLabelX}px)`,
              }}
            >
              Version web
            </div>
            <div
              style={{
                position: "absolute",
                width: "100%",
                fontFamily,
                fontWeight: 500,
                fontSize: FONT.label,
                color: INK,
                opacity: deskLabelOpacity,
                transform: `translateX(${deskLabelX}px)`,
              }}
            >
              Version desktop
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
