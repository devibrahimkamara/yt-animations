import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsGpt2/Stage";
import { IconPlay, IconEye, IconClock } from "../higgsGpt2/icons";
import {
  ACCENT,
  ACCENT_LIGHT,
  YT_RED,
  INK,
  FONT,
  ICON,
  atmosPanelBorder,
  atmosGlow,
} from "../higgsGpt2/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});

// Anim 1 — « La chaîne qui se construit toute seule » (270 frames / 9 s @ 30 fps)
// A bannière tracée+remplie 0–60 · B avatar 60–90 · C nom qui type 90–130
// D bouton + compteur 115–150 · E miniatures qui tombent 150–200
// F icônes miniatures 200–230 · G hold 230–260 · H sortie 260–270

export const higgsGpt2Anim01Schema = z.object({
  channelName: z.string().default("Ma Chaîne YouTube"),
  subscribeLabel: z.string().default("S'abonner"),
  subCountLabel: z.string().default("0 abonnés"),
});
export type HiggsGpt2Anim01Props = z.infer<typeof higgsGpt2Anim01Schema>;

const PAGE_W = 1536;
const BANNER_H = 300;
const PAGE_X = (1920 - PAGE_W) / 2;
const PAGE_TOP = 120;
const AVATAR_D = 130;

const THUMBS = [
  { grad: `linear-gradient(135deg, #16213e 0%, ${ACCENT} 100%)` },
  { grad: `linear-gradient(135deg, #0d2137 0%, ${ACCENT_LIGHT} 100%)` },
  { grad: `linear-gradient(135deg, #1a0a2e 0%, #4a1a6e 100%)` },
];
const THUMB_W = 400;
const THUMB_H = 225;
const THUMB_GAP = 40;

export const HiggsGpt2Anim01ChaineQuiSeConstruit: React.FC<
  HiggsGpt2Anim01Props
> = ({ channelName, subscribeLabel, subCountLabel }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // A — bannière : tracé puis remplissage
  const bannerDraw = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const bannerFill = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // B — avatar en spring avec overshoot
  const avatarSpring = spring({
    frame: frame - 60,
    fps,
    config: { damping: 8, stiffness: 120, mass: 1 },
  });
  const avatarScale = interpolate(avatarSpring, [0, 1], [0, 1]);
  const avatarRing = interpolate(frame, [80, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // C — nom du canal, typé caractère par caractère
  const nameChars = channelName.split("");
  const typeStart = 90;
  const typeStep = 3;
  const cursorOn = frame >= typeStart && frame < 135;
  const cursorBlink = Math.floor(frame / 8) % 2 === 0;

  // D — bouton s'abonner + compteur
  const btnSpring = spring({
    frame: frame - 115,
    fps,
    config: { damping: 14, stiffness: 200 },
  });
  const btnScale = interpolate(btnSpring, [0, 1], [0.7, 1]);
  const countOpacity = interpolate(frame, [150, 160], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // E — miniatures qui tombent
  const thumbsTop = PAGE_TOP + BANNER_H + AVATAR_D + 170;
  const thumbsLeft =
    PAGE_X + (PAGE_W - (THUMB_W * 3 + THUMB_GAP * 2)) / 2;

  // H — sortie (fondu global déjà géré par Stage)

  return (
    <Stage outFrames={10}>
      <AbsoluteFill style={{ fontFamily }}>
        {/* Bannière */}
        <div
          style={{
            position: "absolute",
            left: PAGE_X,
            top: PAGE_TOP,
            width: PAGE_W,
            height: BANNER_H,
            borderRadius: 20,
            overflow: "hidden",
            border: `2px solid ${atmosPanelBorder(0.5)}`,
            boxSizing: "border-box",
          }}
        >
          <svg
            width={PAGE_W}
            height={BANNER_H}
            viewBox={`0 0 ${PAGE_W} ${BANNER_H}`}
            style={{ position: "absolute", inset: 0 }}
          >
            <rect
              x={2}
              y={2}
              width={PAGE_W - 4}
              height={BANNER_H - 4}
              rx={18}
              fill="none"
              stroke={ACCENT_LIGHT}
              strokeWidth={3}
              style={{
                strokeDasharray: (PAGE_W + BANNER_H) * 2,
                strokeDashoffset:
                  (PAGE_W + BANNER_H) * 2 * (1 - bannerDraw),
              }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: bannerFill,
              background: `linear-gradient(120deg, rgba(20,40,120,0.7) 0%, rgba(10,20,60,0.6) 100%)`,
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 140 + i * 380,
                  top: 70 + (i % 2) * 60,
                  width: i === 1 ? 90 : 70,
                  height: i === 1 ? 90 : 70,
                  borderRadius: i === 1 ? "50%" : 12,
                  border: `2px solid ${ACCENT_LIGHT}`,
                  opacity: interpolate(
                    frame,
                    [35 + i * 5, 45 + i * 5],
                    [0, 0.3],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                  ),
                }}
              />
            ))}
          </div>
        </div>

        {/* Avatar */}
        <div
          style={{
            position: "absolute",
            left: PAGE_X + 60,
            top: PAGE_TOP + BANNER_H - AVATAR_D / 2,
            width: AVATAR_D,
            height: AVATAR_D,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 30%, ${ACCENT_LIGHT} 0%, ${ACCENT} 100%)`,
            transform: `scale(${avatarScale})`,
            boxShadow: atmosGlow(ACCENT, 30, 60),
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: -6,
              borderRadius: "50%",
              border: "3px solid rgba(255,255,255,0.6)",
              opacity: avatarRing,
            }}
          />
        </div>

        {/* Nom + bouton + compteur */}
        <div
          style={{
            position: "absolute",
            left: PAGE_X + 60 + AVATAR_D + 40,
            top: PAGE_TOP + BANNER_H + 10,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: FONT.label,
              fontWeight: 800,
              color: INK,
              minHeight: FONT.label * 1.2,
            }}
          >
            {nameChars.map((ch, i) => {
              const charFrame = typeStart + i * typeStep;
              const t = interpolate(frame, [charFrame, charFrame + 6], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <span
                  key={i}
                  style={{
                    opacity: t,
                    transform: `translateY(${interpolate(t, [0, 1], [8, 0])}px)`,
                    whiteSpace: "pre",
                  }}
                >
                  {ch}
                </span>
              );
            })}
            {cursorOn && (
              <span
                style={{
                  display: "inline-block",
                  width: 6,
                  height: FONT.label * 0.85,
                  marginLeft: 6,
                  background: INK,
                  opacity: cursorBlink ? 1 : 0,
                }}
              />
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div
              style={{
                transform: `scale(${btnScale})`,
                opacity: interpolate(btnSpring, [0, 0.3], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                background: YT_RED,
                borderRadius: 999,
                padding: "16px 40px",
                fontSize: FONT.micro,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {subscribeLabel}
            </div>
            <div
              style={{
                opacity: countOpacity,
                color: "#AAAAAA",
                fontSize: FONT.micro * 0.7,
                fontWeight: 600,
              }}
            >
              {subCountLabel}
            </div>
          </div>
        </div>

        {/* Miniatures */}
        {THUMBS.map((t, i) => {
          const dropStart = 150 + i * 15;
          const dropSpring = spring({
            frame: frame - dropStart,
            fps,
            config: { damping: 12, stiffness: 180 },
          });
          const y = interpolate(dropSpring, [0, 1], [-30, 0]);
          const opacity = interpolate(
            frame,
            [dropStart, dropStart + 4],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const titleOpacity = interpolate(
            frame,
            [dropStart + 5, dropStart + 15],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const iconsStart = 200 + i * 4;
          const iconsOpacity = interpolate(
            frame,
            [iconsStart, iconsStart + 8],
            [0, 0.6],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: thumbsLeft + i * (THUMB_W + THUMB_GAP),
                top: thumbsTop,
                width: THUMB_W,
                height: THUMB_H,
                borderRadius: 16,
                background: t.grad,
                border: `1px solid ${atmosPanelBorder(0.3)}`,
                boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
                opacity,
                transform: `translateY(${y}px)`,
                boxSizing: "border-box",
                padding: 20,
              }}
            >
              <div
                style={{
                  width: "70%",
                  height: 20,
                  borderRadius: 6,
                  border: "2px solid rgba(255,255,255,0.4)",
                  opacity: titleOpacity,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 16,
                  left: 20,
                  right: 20,
                  display: "flex",
                  justifyContent: "space-between",
                  opacity: iconsOpacity,
                }}
              >
                <IconPlay size={ICON.sm * 0.4} color="#fff" strokeWidth={3} />
                <div style={{ display: "flex", gap: 12 }}>
                  <IconEye size={ICON.sm * 0.4} color="#fff" strokeWidth={3} />
                  <IconClock size={ICON.sm * 0.4} color="#fff" strokeWidth={3} />
                </div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </Stage>
  );
};
