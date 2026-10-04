import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadMono } from "@remotion/google-fonts/RobotoMono";
import { ATMOS_ERROR, FONT, mulberry32 } from "../pippit/theme";

// Anim 3 — « Le tampon "PAS BESOIN" » (135 frames / 4,5 s) — overlay face cam
// A Viseur 0–15 · B Vie interface 15–40 · C Anticipation 40–45 ·
// D Chute + impact 45–58 · E Stabilisation 58–70 · F Tenue 70–115 ·
// G Sortie 115–135

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: mono } = loadMono("normal", { weights: ["500"], subsets: ["latin"] });

export const pippitAnim03Schema = z.object({
  stampText: z.string().default("PAS BESOIN"),
});
export type PippitAnim03Props = z.infer<typeof pippitAnim03Schema>;

const rngX = mulberry32(3001);
const rngY = mulberry32(3002);
const seedsX = Array.from({ length: 8 }, () => rngX() * 2 - 1);
const seedsY = Array.from({ length: 8 }, () => rngY() * 2 - 1);

const Corner: React.FC<{ corner: "tl" | "tr" | "bl" | "br"; delay: number }> = ({ corner, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 200, mass: 0.5 } });

  const size = 64;
  const isTop = corner === "tl" || corner === "tr";
  const isLeft = corner === "tl" || corner === "bl";

  return (
    <div
      style={{
        position: "absolute",
        top: isTop ? 60 : undefined,
        bottom: isTop ? undefined : 60,
        left: isLeft ? 60 : undefined,
        right: isLeft ? undefined : 60,
        width: size,
        height: size,
        borderTop: isTop ? "3px solid #fff" : undefined,
        borderBottom: isTop ? undefined : "3px solid #fff",
        borderLeft: isLeft ? "3px solid #fff" : undefined,
        borderRight: isLeft ? undefined : "3px solid #fff",
        transform: `scale(${appear})`,
        transformOrigin: `${isLeft ? "left" : "right"} ${isTop ? "top" : "bottom"}`,
        opacity: appear,
      }}
    />
  );
};

export const PippitAnim03TamponPasBesoin: React.FC<PippitAnim03Props> = ({ stampText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const recOpacity = interpolate(frame, [10, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const recBlink = frame % 20 < 10 ? 1 : 0.3;

  const seconds = Math.floor(frame / fps);
  const timecode = `00:${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  // C — flash d'anticipation
  const preFlash = interpolate(frame, [40, 42, 45], [0, 0.25, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // D — chute + impact
  const dropY = interpolate(frame, [45, 52], [-500, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const impactScale = spring({
    frame: frame - 45,
    fps,
    config: { damping: 9, stiffness: 260, mass: 0.7 },
  });
  const stampScale = frame < 45 ? 0 : interpolate(impactScale, [0, 1], [1.6, 1]);
  const stampRotate = frame < 45 ? -8 : interpolate(impactScale, [0, 1], [-8, -2]);

  // Tremblement à l'impact (mulberry32, décroissant)
  const shakeEnvelope = interpolate(frame, [52, 60], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shakeIdx = Math.min(seedsX.length - 1, Math.max(0, frame - 52));
  const shakeX = frame >= 52 && frame < 60 ? seedsX[shakeIdx] * 4 * shakeEnvelope : 0;
  const shakeY = frame >= 52 && frame < 60 ? seedsY[shakeIdx] * 4 * shakeEnvelope : 0;

  const impactFlash = interpolate(frame, [51, 52, 54], [0, 0.3, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // G — sortie
  const exitOpacity = interpolate(frame, [115, 135], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: exitOpacity, transform: `translate(${shakeX}px, ${shakeY}px)` }}>
      <Corner corner="tl" delay={0} />
      <Corner corner="tr" delay={2} />
      <Corner corner="bl" delay={4} />
      <Corner corner="br" delay={6} />

      <div
        style={{
          position: "absolute",
          top: 76,
          left: 140,
          display: "flex",
          alignItems: "center",
          gap: 14,
          opacity: recOpacity,
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#FF3B30",
            opacity: recBlink,
          }}
        />
        <span style={{ fontFamily, fontWeight: 700, fontSize: FONT.micro * 0.6, color: "#fff", letterSpacing: 2 }}>
          REC
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 70,
          right: 140,
          fontFamily: mono,
          fontSize: FONT.micro * 0.55,
          color: "#fff",
          opacity: recOpacity,
        }}
      >
        {timecode}
      </div>

      <AbsoluteFill style={{ background: "#fff", opacity: preFlash }} />
      <AbsoluteFill style={{ background: "#fff", opacity: impactFlash, zIndex: 5 }} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            transform: `translateY(${dropY}px) scale(${stampScale}) rotate(${stampRotate}deg)`,
            opacity: frame >= 45 ? 1 : 0,
            border: `10px solid ${ATMOS_ERROR}`,
            borderRadius: 28,
            padding: "36px 72px",
            filter: "blur(0.3px)",
          }}
        >
          <span
            style={{
              fontFamily,
              fontWeight: 800,
              fontSize: FONT.hero * 0.8,
              color: ATMOS_ERROR,
              letterSpacing: 6,
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            {stampText}
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
