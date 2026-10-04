import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsGpt3/Stage";
import { IconCheck } from "../higgsGpt3/icons";
import { ACCENT, ACCENT_LIGHT, INK, FONT, atmosGlow } from "../higgsGpt3/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});

// Anim 6 — « Jauge d'abonnement » (135 frames / 4,5 s @ 30 fps)
// A anneau qui se remplit autour de l'avatar 0–39 · B flip du bouton + C
// particules en éventail 39–60 · D hold CTA + compteur flip (dès 65) 60–123
// E sortie 123–135 (fondu global géré par Stage, outFrames=12)

export const higgsGpt3Anim06Schema = z.object({
  channelInitials: z.string().default("IC"),
  subscribeLabel: z.string().default("S'ABONNER"),
  subscribedLabel: z.string().default("ABONNÉ"),
  subCount: z.number().default(48200),
});
export type HiggsGpt3Anim06Props = z.infer<typeof higgsGpt3Anim06Schema>;

const CENTER_X = 960;
const CENTER_Y = 420;
const AVATAR_R = 100;
const RING_R = AVATAR_R + 15;
const CIRC = 2 * Math.PI * RING_R;

const PARTICLES = Array.from({ length: 10 }, (_, i) => -60 + i * (120 / 9));

export const HiggsGpt3Anim06JaugeAbonnement: React.FC<
  HiggsGpt3Anim06Props
> = ({ channelInitials, subscribeLabel, subscribedLabel, subCount }) => {
  const frame = useCurrentFrame();

  const ringProgress = interpolate(frame, [0, 39], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const avatarScale = interpolate(frame, [0, 39], [1, 1.03], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tipAngle = ringProgress * 360 - 90;
  const tipX = CENTER_X + RING_R * Math.cos((tipAngle * Math.PI) / 180);
  const tipY = CENTER_Y + RING_R * Math.sin((tipAngle * Math.PI) / 180);

  const flipped = frame >= 39;
  const clickT = interpolate(frame, [39, 43, 47, 51], [1, 0.85, 1.1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bgT = interpolate(frame, [39, 47], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const outY = interpolate(frame, [39, 42.6], [0, -100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const inY = interpolate(frame, [39, 42.6], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const checkSpring = interpolate(frame, [48, 54], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(2)),
  });

  const counterFlip = interpolate(frame, [65, 69, 74], [1, 0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const counterValue = frame < 69 ? subCount : subCount + 1;

  return (
    <Stage outFrames={12}>
      <AbsoluteFill style={{ fontFamily }}>
        {/* Anneau + avatar */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r={RING_R}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={5}
          />
          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r={RING_R}
            fill="none"
            stroke={ACCENT_LIGHT}
            strokeWidth={5}
            strokeLinecap="round"
            transform={`rotate(-90 ${CENTER_X} ${CENTER_Y})`}
            style={{
              strokeDasharray: CIRC,
              strokeDashoffset: CIRC * (1 - ringProgress),
            }}
          />
        </svg>
        {ringProgress > 0 && ringProgress < 1 && (
          <div
            style={{
              position: "absolute",
              left: tipX - 8,
              top: tipY - 8,
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: ACCENT_LIGHT,
              boxShadow: atmosGlow(ACCENT, 30, 60),
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            left: CENTER_X - AVATAR_R,
            top: CENTER_Y - AVATAR_R,
            width: AVATAR_R * 2,
            height: AVATAR_R * 2,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 30%, ${ACCENT_LIGHT} 0%, ${ACCENT} 100%)`,
            transform: `scale(${avatarScale})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: FONT.label * 0.6, fontWeight: 800, color: INK }}>
            {channelInitials}
          </span>
        </div>

        {/* Bouton */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 620,
            transform: `translateX(-50%) scale(${clickT})`,
            borderRadius: 999,
            padding: "20px 48px",
            background: flipped
              ? `rgba(48,96,255,${0.1 * bgT})`
              : ACCENT,
            border: `2px solid ${ACCENT}`,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          {flipped && (
            <div style={{ transform: `scale(${checkSpring})` }}>
              <IconCheck size={36} color={ACCENT_LIGHT} strokeWidth={5} />
            </div>
          )}
          <div
            style={{
              position: "relative",
              height: FONT.micro * 0.6,
              lineHeight: `${FONT.micro * 0.6}px`,
              overflow: "hidden",
            }}
          >
            {/* Réservation de largeur (invisible) — les deux libellés sont
                positionnés en absolute pour le flip, donc sans texte non
                positionné le conteneur s'effondrerait à largeur 0. */}
            <span
              style={{
                visibility: "hidden",
                fontSize: FONT.micro * 0.6,
                fontWeight: 800,
                whiteSpace: "nowrap",
              }}
            >
              {flipped ? subscribedLabel : subscribeLabel}
            </span>
            <span
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                lineHeight: `${FONT.micro * 0.6}px`,
                transform: `translateY(${outY}%)`,
                fontSize: FONT.micro * 0.6,
                fontWeight: 800,
                color: "#fff",
                whiteSpace: "nowrap",
              }}
            >
              {subscribeLabel}
            </span>
            <span
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                lineHeight: `${FONT.micro * 0.6}px`,
                transform: `translateY(${inY}%)`,
                fontSize: FONT.micro * 0.6,
                fontWeight: 800,
                color: ACCENT_LIGHT,
                whiteSpace: "nowrap",
              }}
            >
              {subscribedLabel}
            </span>
          </div>
        </div>

        {/* Compteur */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 710,
            transform: `translateX(-50%) scaleY(${counterFlip})`,
            fontSize: FONT.micro * 0.5,
            fontWeight: 700,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          {counterValue.toLocaleString("fr-FR")} abonnés
        </div>

        {/* Particules en éventail */}
        {frame >= 39 &&
          frame < 60 &&
          PARTICLES.map((angle, i) => {
            const start = 39 + i * 0.8;
            const t = interpolate(frame, [start, start + 15], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });
            const dist = 40 + (i % 3) * 15;
            const rad = (angle * Math.PI) / 180;
            const px = 960 + Math.sin(rad) * dist * t;
            const py = 620 - Math.cos(rad) * dist * t;
            const pOpacity = interpolate(t, [0, 1], [1, 0]);
            const pScale = interpolate(t, [0, 1], [1, 0.3]);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: px - 4,
                  top: py - 4,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: ACCENT_LIGHT,
                  opacity: pOpacity,
                  transform: `scale(${pScale})`,
                }}
              />
            );
          })}
      </AbsoluteFill>
    </Stage>
  );
};
