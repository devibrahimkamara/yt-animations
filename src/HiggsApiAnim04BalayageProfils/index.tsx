import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsApi/Stage";
import { IconPerson, IconGraduate, IconBriefcase } from "../higgsApi/icons";
import { ACCENT, ATMOS_GOLD, MONEY_GREEN, FONT, atmosPanelBorder } from "../higgsApi/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});

// Anim 4 — « Le balayage des trois profils » (210 frames / 7 s @ 30 fps)
// Phase 1 (0-15)    : trois cartes grisées, fade+scale
// Phase 2 (15-120)  : faisceau lumineux diagonal qui traverse, illumine chaque carte
// Phase 3 (120-195) : trois colonnes allumées, glow pulsant décalé
// Phase 4 (195-210) : fondu de sortie (Stage)

export const higgsApiAnim04Schema = z.object({});
export type HiggsApiAnim04Props = z.infer<typeof higgsApiAnim04Schema>;

const CARD_W = 320;
const CARD_H = 460;
const GAP = 60;
const TOTAL_W = CARD_W * 3 + GAP * 2;
const START_X = (1920 - TOTAL_W) / 2;
const CARD_Y = (1080 - CARD_H) / 2;

const GRAY = "#4A5568";
const GRAY_BG = "#1e232d";

const PROFILES = [
  { Icon: IconPerson, label: "PARTICULIER", sub: "usage perso", color: ACCENT, triggerFrame: 45 },
  { Icon: IconGraduate, label: "ÉTUDIANT", sub: "budget serré", color: ATMOS_GOLD, triggerFrame: 75 },
  { Icon: IconBriefcase, label: "PROFESSIONNEL", sub: "gain de temps", color: MONEY_GREEN, triggerFrame: 105 },
];

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}
function mixColor(a: string, b: string, t: number): string {
  const pa = hexToRgb(a);
  const pb = hexToRgb(b);
  return `rgb(${Math.round(pa.r + (pb.r - pa.r) * t)},${Math.round(pa.g + (pb.g - pa.g) * t)},${Math.round(pa.b + (pb.b - pa.b) * t)})`;
}

const ProfileCard: React.FC<{
  index: number;
  x: number;
  frame: number;
  fps: number;
}> = ({ index, x, frame, fps }) => {
  const { Icon, label, sub, color, triggerFrame } = PROFILES[index];

  const entrySpring = spring({ frame, fps, config: { damping: 16, stiffness: 130 } });
  const entryScale = interpolate(entrySpring, [0, 1], [0.95, 1]);
  const entryOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const colorProgress = interpolate(frame - triggerFrame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bg = colorProgress > 0 ? mixColor(GRAY_BG, "#1a2540", colorProgress) : GRAY_BG;
  const iconColor = colorProgress > 0 ? mixColor(GRAY, color, colorProgress) : GRAY;
  const textColor = iconColor;

  const bounceSpring = spring({ frame: frame - triggerFrame, fps, config: { damping: 10, stiffness: 200 } });
  const bounceScale = frame >= triggerFrame ? interpolate(bounceSpring, [0, 0.5, 1], [1, 1.15, 1]) : 1;

  const glowPhase = (index * 20) % 60;
  const glow = frame >= 120 ? 0.4 + 0.3 * (0.5 + 0.5 * Math.sin((frame - 120 + glowPhase) * 0.1)) : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: CARD_Y,
        width: CARD_W,
        height: CARD_H,
        borderRadius: 16,
        background: bg,
        border: `2px solid ${atmosPanelBorder(0.3)}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        opacity: entryOpacity,
        transform: `scale(${entryScale})`,
        boxShadow: `0 0 ${60 * glow}px ${color}60`,
      }}
    >
      <div style={{ transform: `scale(${bounceScale})` }}>
        <Icon size={FONT.hero * 0.42} color={iconColor} />
      </div>
      <div style={{ fontSize: FONT.label * 0.55, fontWeight: 800, color: textColor, letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: FONT.micro * 0.4, fontWeight: 600, color: "rgba(255,255,255,0.55)" }}>{sub}</div>
    </div>
  );
};

export const HiggsApiAnim04BalayageProfils: React.FC<HiggsApiAnim04Props> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const beamX = interpolate(frame, [15, 120], [-400, 2300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const beamOpacity = frame >= 15 && frame <= 130 ? 1 : 0;

  return (
    <Stage outFrames={15}>
      <AbsoluteFill style={{ fontFamily }}>
        {PROFILES.map((_, i) => (
          <ProfileCard key={i} index={i} x={START_X + i * (CARD_W + GAP)} frame={frame} fps={fps} />
        ))}

        <div
          style={{
            position: "absolute",
            top: -300,
            left: beamX,
            width: 180,
            height: 1680,
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)",
            transform: "rotate(22deg)",
            mixBlendMode: "screen",
            opacity: beamOpacity,
          }}
        />
      </AbsoluteFill>
    </Stage>
  );
};
