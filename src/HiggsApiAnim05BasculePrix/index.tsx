import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsApi/Stage";
import { ATMOS_ERROR, MONEY_GREEN, INK, FONT } from "../higgsApi/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});

// Anim 5 — « La bascule de prix » (240 frames / 8 s @ 30 fps)
// Phase 1 (0-45)    : panneau rouge "49€/mois" seul, spring d'entrée
// Phase 2 (45-135)  : wipe clipPath vers le panneau vert + pliage de l'étiquette + chiffres roulants
// Phase 3 (135-215) : "3€/mois" stabilisé, pulse de glow
// Phase 4 (215-240) : fondu de sortie (Stage)

export const higgsApiAnim05Schema = z.object({});
export type HiggsApiAnim05Props = z.infer<typeof higgsApiAnim05Schema>;

const easeInOut = Easing.inOut(Easing.ease);

const Tag: React.FC<{
  color: string;
  glow: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ color, glow, children, style }) => (
  <div
    style={{
      position: "relative",
      width: 480,
      height: 300,
      borderRadius: 24,
      background: color,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: `0 0 60px ${glow}`,
      clipPath: "polygon(8% 0%, 100% 0%, 100% 100%, 8% 100%, 0% 50%)",
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 24,
        left: "50%",
        transform: "translateX(-50%)",
        width: 16,
        height: 16,
        borderRadius: "50%",
        background: "rgba(0,0,0,0.35)",
      }}
    />
    {children}
  </div>
);

const RollingDigit: React.FC<{
  targetDigit: number;
  startFrame: number;
  fps: number;
  frame: number;
}> = ({ targetDigit, startFrame, fps, frame }) => {
  const DIGIT_H = 130;
  const fakeSeq = [7, 2, 8, 5, targetDigit];
  const seqLen = fakeSeq.length;
  const t = interpolate(frame, [startFrame, startFrame + 24], [0, seqLen - 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });
  const s = spring({ frame: frame - (startFrame + 24), fps, config: { damping: 14, stiffness: 200 } });
  const settle = frame >= startFrame + 24 ? interpolate(s, [0, 1], [0.15, 0]) : 0;
  const translateY = -(t + settle) * DIGIT_H;

  return (
    <div style={{ width: 90, height: DIGIT_H, overflow: "hidden" }}>
      <div style={{ transform: `translateY(${translateY}px)` }}>
        {fakeSeq.map((d, i) => (
          <div
            key={i}
            style={{
              height: DIGIT_H,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: FONT.hero * 0.5,
              fontWeight: 800,
              color: INK,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  );
};

export const HiggsApiAnim05BasculePrix: React.FC<HiggsApiAnim05Props> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftEntrySpring = spring({ frame, fps, config: { damping: 12, stiffness: 150 } });
  const leftScale = interpolate(leftEntrySpring, [0, 1], [0.8, 1]);
  const leftRotate = interpolate(leftEntrySpring, [0, 1], [-5, 0]);

  const wipeT = interpolate(frame, [45, 85], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });

  const foldT = interpolate(frame, [45, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const foldRotateX = interpolate(foldT, [0, 1], [0, 80]);
  const foldY = interpolate(foldT, [0, 1], [0, 40]);
  const foldOpacity = interpolate(foldT, [0, 1], [1, 0.3]);

  const glowPulse = frame >= 135 ? 0.5 + 0.3 * (0.5 + 0.5 * Math.sin((frame - 135) * (Math.PI * 2) / 50)) : 0.5;

  return (
    <Stage outFrames={15}>
      <AbsoluteFill style={{ fontFamily, alignItems: "center", justifyContent: "center" }}>
        {/* Panneau gauche (rouge) plein écran en fond */}
        <AbsoluteFill style={{ background: "#3A1A1A", alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              transformStyle: "preserve-3d",
              perspective: 800,
            }}
          >
            <div
              style={{
                transform: `scale(${leftScale}) rotate(${leftRotate}deg) rotateX(${foldRotateX}deg) translateY(${foldY}px)`,
                transformOrigin: "bottom center",
                opacity: foldOpacity,
              }}
            >
              <Tag color={ATMOS_ERROR} glow="rgba(239,68,68,0.4)">
                <div style={{ fontSize: FONT.hero * 0.55, fontWeight: 800, color: INK }}>49€</div>
                <div style={{ fontSize: FONT.micro * 0.5, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>
                  /mois
                </div>
              </Tag>
            </div>
          </div>
        </AbsoluteFill>

        {/* Panneau droit (vert), révélé par le wipe */}
        <AbsoluteFill
          style={{
            background: "#0F2E1F",
            alignItems: "center",
            justifyContent: "center",
            clipPath: `inset(0 0 0 ${wipeT}%)`,
          }}
        >
          <Tag color={MONEY_GREEN} glow={`rgba(0,217,163,${glowPulse})`}>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <RollingDigit targetDigit={3} startFrame={70} fps={fps} frame={frame} />
              <div style={{ fontSize: FONT.hero * 0.55, fontWeight: 800, color: INK, marginLeft: 4 }}>€</div>
            </div>
            <div style={{ fontSize: FONT.micro * 0.5, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>
              /mois
            </div>
          </Tag>

          {frame >= 150 && (
            <div
              style={{
                position: "absolute",
                bottom: 60,
                fontSize: FONT.micro * 0.4,
                fontWeight: 700,
                color: "rgba(255,255,255,0.5)",
                opacity: interpolate(frame, [150, 160], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              <span style={{ textDecoration: "line-through" }}>49€</span> → 3€/mois
            </div>
          )}
        </AbsoluteFill>

        {/* Ligne de séparation lumineuse du wipe */}
        <div
          style={{
            position: "absolute",
            left: `${wipeT}%`,
            top: 0,
            bottom: 0,
            width: 4,
            background: INK,
            boxShadow: `0 0 24px ${INK}`,
            opacity: wipeT > 0.5 && wipeT < 99.5 ? 1 : 0,
          }}
        />
      </AbsoluteFill>
    </Stage>
  );
};
