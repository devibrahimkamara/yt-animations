import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsApi/Stage";
import { IconLoaderDots } from "../higgsApi/icons";
import { ACCENT, ACCENT_LIGHT, MONEY_GREEN, INK, FONT, atmosPanelBorder } from "../higgsApi/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});

// Anim 9 — « Le tuyau de l'API » (330 frames / 11 s @ 30 fps) — l'animation clé.
// Phase 1 (0-60)    : fenêtres en fade-in, puis tracé du tuyau en courbe de Bézier
// Phase 2 (60-135)  : voyage aller du bloc REQUEST le long du tuyau
// Phase 3 (135-165) : pause de traitement (loader 3 points)
// Phase 4 (165-230) : voyage retour du bloc RESPONSE
// Phase 5 (230-305) : résultat posé et stable dans "Ton application"
// Phase 6 (305-330) : fondu de sortie (Stage)

export const higgsApiAnim09Schema = z.object({});
export type HiggsApiAnim09Props = z.infer<typeof higgsApiAnim09Schema>;

const easeInOut = Easing.inOut(Easing.ease);

const WIN_W = 280;
const WIN_H = 200;
const LEFT_X = 1920 * 0.1;
const RIGHT_X = 1920 * 0.9 - WIN_W;
const WIN_Y = 1080 / 2 - WIN_H / 2;

const PATH_D = `M ${LEFT_X + WIN_W} ${1080 / 2} Q 960 ${1080 / 2 - 100} ${RIGHT_X} ${1080 / 2}`;
const PATH_LEN = 1280; // approximation de la longueur de la courbe pour le stroke-dash

function pointOnQuad(t: number) {
  const x1 = LEFT_X + WIN_W;
  const y1 = 1080 / 2;
  const cx = 960;
  const cy = 1080 / 2 - 100;
  const x2 = RIGHT_X;
  const y2 = 1080 / 2;
  const mt = 1 - t;
  const x = mt * mt * x1 + 2 * mt * t * cx + t * t * x2;
  const y = mt * mt * y1 + 2 * mt * t * cy + t * t * y2;
  return { x, y };
}

const Window: React.FC<{ x: number; title: string; accent: string; opacity: number }> = ({ x, title, accent, opacity }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: WIN_Y,
      width: WIN_W,
      height: WIN_H,
      borderRadius: 16,
      background: "rgba(12,17,42,0.9)",
      border: `1px solid ${atmosPanelBorder(0.4)}`,
      opacity,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    }}
  >
    <div style={{ width: 40, height: 4, borderRadius: 2, background: accent }} />
    <div style={{ fontSize: FONT.micro * 0.4, fontWeight: 800, color: INK, letterSpacing: 1 }}>{title}</div>
  </div>
);

export const HiggsApiAnim09TuyauAPI: React.FC<HiggsApiAnim09Props> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const winOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const pipeProgress = interpolate(frame, [15, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });

  // Phase 2 : REQUEST aller
  const reqEnterSpring = spring({ frame: frame - 60, fps, config: { damping: 14, stiffness: 180 } });
  const reqEnterScale = frame >= 60 ? interpolate(reqEnterSpring, [0, 1], [0, 1]) : 0;
  const reqTravel = interpolate(frame, [70, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });
  const reqVisible = frame >= 60 && frame < 135;
  const reqArriveFade = interpolate(frame, [128, 135], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const reqPos = pointOnQuad(Math.min(reqTravel, 1));

  // Phase 3 : loader
  const loaderVisible = frame >= 135 && frame < 165;

  // Phase 4 : RESPONSE retour
  const respEnterSpring = spring({ frame: frame - 165, fps, config: { damping: 14, stiffness: 180 } });
  const respEnterScale = frame >= 165 ? interpolate(respEnterSpring, [0, 1], [0, 1]) : 0;
  const respTravel = interpolate(frame, [175, 225], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });
  const respVisible = frame >= 165 && frame < 230;
  const respArriveFade = interpolate(frame, [223, 230], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const respPos = pointOnQuad(Math.max(respTravel, 0));

  // Phase 5 : résultat stable
  const resultSpring = spring({ frame: frame - 225, fps, config: { damping: 14, stiffness: 160 } });
  const resultScale = frame >= 225 ? interpolate(resultSpring, [0, 1], [1.1, 1]) : 1;
  const resultOpacity = interpolate(frame, [225, 233], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const resultGlow = frame >= 233 ? 0.5 + 0.4 * (0.5 + 0.5 * Math.sin(((frame - 233) / 50) * Math.PI * 2)) : 0.5;

  return (
    <Stage outFrames={25}>
      <AbsoluteFill style={{ fontFamily }}>
        <Window x={LEFT_X} title="TON APPLICATION" accent={MONEY_GREEN} opacity={winOpacity} />
        <Window x={RIGHT_X} title="HIGGSFIELD" accent={ACCENT_LIGHT} opacity={winOpacity} />

        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <path d={PATH_D} fill="none" stroke="#2A3441" strokeWidth={4} />
          <path
            d={PATH_D}
            fill="none"
            stroke={ACCENT_LIGHT}
            strokeWidth={4}
            style={{
              strokeDasharray: PATH_LEN,
              strokeDashoffset: PATH_LEN * (1 - pipeProgress),
            }}
          />
        </svg>

        {reqVisible && (
          <div
            style={{
              position: "absolute",
              left: reqPos.x - 60,
              top: reqPos.y - 24,
              width: 120,
              height: 48,
              borderRadius: 10,
              background: MONEY_GREEN,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${reqEnterScale})`,
              opacity: reqArriveFade,
              fontSize: 18,
              fontWeight: 800,
              color: INK,
            }}
          >
            REQUEST →
          </div>
        )}

        {loaderVisible && (
          <div
            style={{
              position: "absolute",
              left: RIGHT_X + WIN_W / 2 - 40,
              top: WIN_Y + WIN_H / 2 - 10,
            }}
          >
            <IconLoaderDots frame={frame} color={ACCENT_LIGHT} size={80} />
          </div>
        )}

        {respVisible && (
          <div
            style={{
              position: "absolute",
              left: respPos.x - 80,
              top: respPos.y - 30,
              width: 160,
              height: 60,
              borderRadius: 12,
              background: ACCENT,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "0 14px",
              transform: `scale(${respEnterScale})`,
              opacity: respArriveFade,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "linear-gradient(135deg,#FF9F5A,#C77DFF)",
                flexShrink: 0,
              }}
            />
            <div style={{ fontSize: 16, fontWeight: 800, color: INK }}>RESPONSE</div>
          </div>
        )}

        {frame >= 225 && (
          <div
            style={{
              position: "absolute",
              left: LEFT_X + WIN_W / 2 - 60,
              top: WIN_Y + WIN_H / 2 - 40,
              width: 120,
              height: 80,
              borderRadius: 10,
              background: "linear-gradient(135deg,#FF9F5A,#C77DFF)",
              transform: `scale(${resultScale})`,
              opacity: resultOpacity,
              boxShadow: `0 0 ${30 * resultGlow}px ${MONEY_GREEN}80`,
            }}
          />
        )}
      </AbsoluteFill>
    </Stage>
  );
};
