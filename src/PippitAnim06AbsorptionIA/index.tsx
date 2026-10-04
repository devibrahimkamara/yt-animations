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
import { AtmosBackground } from "../AtmosOverlay/AtmosBackground";
import { ACCENT, ACCENT_LIGHT, FONT, mulberry32 } from "../pippit/theme";

// Anim 6 — « L'IA qui absorbe tout + révélation de pipit.ai » (195 frames / 6,5 s)
// A Noyau 0–15 · B Étiquettes en orbite 15–35 · C Orbite stable 35–80 ·
// D Spirale accélérée 80–115 · E Absorption + explosion 115–125 ·
// F Dispersion + logo 125–140 · G Tenue logo 140–160 ·
// H Réduction + flèche 160–180 · I Tenue finale 180–195

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });

export const pippitAnim06Schema = z.object({
  labels: z.array(z.string()).default(["Script", "Visuels", "Voix", "Montage"]),
  brandName: z.string().default("pipit.ai"),
});
export type PippitAnim06Props = z.infer<typeof pippitAnim06Schema>;

const CENTER = { x: 960, y: 540 };
const W1 = 0.045; // vitesse angulaire orbite stable (rad/frame)
const W2 = 0.26; // vitesse angulaire en fin de spirale (rad/frame)
const EXPLODE_FRAME = 119;

// Déplacement angulaire cumulé depuis frame 15 (constant puis en rampe)
const angularDisplacement = (f: number) => {
  const clamped = Math.max(15, Math.min(f, 115));
  if (clamped <= 80) return W1 * (clamped - 15);
  const t = clamped - 80;
  return W1 * 65 + W1 * t + ((W2 - W1) * t * t) / (2 * 35);
};

const N_PARTICLES = 30;
const rngAngle = mulberry32(6001);
const rngSpeed = mulberry32(6002);
const rngSize = mulberry32(6003);
const particles = Array.from({ length: N_PARTICLES }, (_, i) => ({
  angle: (i / N_PARTICLES) * Math.PI * 2 + (rngAngle() - 0.5) * 0.3,
  speed: 3 + rngSpeed() * 5,
  size: 4 + rngSize() * 6,
}));

export const PippitAnim06AbsorptionIA: React.FC<PippitAnim06Props> = ({ labels, brandName }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // A — apparition + pulsation continue du noyau
  const coreEnter = spring({ frame, fps, config: { damping: 12, stiffness: 160, mass: 0.6 } });
  const corePulse = frame < 115 ? 1 + Math.sin(frame * 0.15) * 0.03 : 1;
  const coreGrow = interpolate(frame, [80, 118], [1, 1.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const coreOpacity = interpolate(frame, [0, 8, 118, 122], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const coreScale = coreEnter * corePulse * coreGrow;

  const glowIntensity = interpolate(frame, [0, 80, 118], [0.4, 0.6, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // D — rayon orbital décroissant
  const radius = interpolate(frame, [80, 115], [180, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  // Flash d'explosion
  const explodeFlash = interpolate(
    frame,
    [EXPLODE_FRAME - 1, EXPLODE_FRAME, EXPLODE_FRAME + 3],
    [0, 0.9, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // F — apparition du logo
  const logoAppear = spring({
    frame: frame - 128,
    fps,
    config: { damping: 11, stiffness: 170, mass: 0.6 },
  });

  // H — réduction + repositionnement
  const reduceT = interpolate(frame, [160, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const logoScale = interpolate(reduceT, [0, 1], [1, 0.4]);
  const logoY = interpolate(reduceT, [0, 1], [0, 300]);

  const arrowBounce = frame >= 170 ? Math.sin(frame * 0.3) * 6 : 0;
  const arrowOpacity = interpolate(frame, [170, 178], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AtmosBackground />
      {/* Étiquettes orbitantes */}
      {frame < 118 &&
        labels.map((label, i) => {
          const appearFrame = 15 + i * 5;
          if (frame < appearFrame) return null;

          const appear = spring({
            frame: frame - appearFrame,
            fps,
            config: { damping: 12, stiffness: 180, mass: 0.5 },
          });

          const baseAngle = (i / labels.length) * Math.PI * 2;
          const angle = baseAngle + angularDisplacement(frame);
          const x = CENTER.x + radius * Math.cos(angle);
          const y = CENTER.y + radius * Math.sin(angle);

          const shrinkScale = interpolate(radius, [0, 180], [0.25, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const contactFade = interpolate(frame, [108 + i * 2, 116 + i * 2], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={label}
              style={{
                position: "absolute",
                left: x,
                top: y,
                transform: `translate(-50%, -50%) scale(${appear * shrinkScale})`,
                opacity: appear * contactFade,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 999,
                padding: "14px 30px",
                whiteSpace: "nowrap",
                fontFamily,
                fontWeight: 700,
                fontSize: FONT.micro,
                color: "#fff",
              }}
            >
              {label}
            </div>
          );
        })}

      {/* Noyau lumineux */}
      {frame < 123 && (
        <div
          style={{
            position: "absolute",
            left: CENTER.x,
            top: CENTER.y,
            width: 140,
            height: 140,
            borderRadius: "50%",
            transform: `translate(-50%, -50%) scale(${coreScale})`,
            opacity: coreOpacity,
            background: `radial-gradient(circle, #FFFFFF 0%, ${ACCENT_LIGHT} 45%, ${ACCENT} 100%)`,
            filter: `drop-shadow(0 0 ${40 * glowIntensity}px rgba(139,110,245,0.6))`,
          }}
        />
      )}

      {/* Particules d'explosion */}
      {frame >= EXPLODE_FRAME &&
        particles.map((p, i) => {
          const t = frame - EXPLODE_FRAME;
          const dist = t * p.speed;
          const x = CENTER.x + Math.cos(p.angle) * dist;
          const y = CENTER.y + Math.sin(p.angle) * dist;
          const opacity = interpolate(dist, [0, 420], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          if (opacity <= 0) return null;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                background: "#fff",
                opacity,
                filter: "drop-shadow(0 0 4px rgba(139,110,245,0.8))",
              }}
            />
          );
        })}

      <AbsoluteFill style={{ background: "#fff", opacity: explodeFlash }} />

      {/* Logo / nom de marque */}
      {frame >= 128 && (
        <div
          style={{
            position: "absolute",
            left: CENTER.x,
            top: CENTER.y,
            transform: `translate(-50%, -50%) translateY(${logoY}px) scale(${Math.max(0, logoAppear) * logoScale})`,
            fontFamily,
            fontWeight: 800,
            fontSize: FONT.hero * 0.85,
            color: "#fff",
            whiteSpace: "nowrap",
          }}
        >
          {brandName}
        </div>
      )}

      {frame >= 170 && (
        <div
          style={{
            position: "absolute",
            left: CENTER.x,
            top: CENTER.y + logoY + 120,
            transform: `translate(-50%, ${arrowBounce}px)`,
            textAlign: "center",
            opacity: arrowOpacity,
          }}
        >
          <svg width={40} height={40} viewBox="0 0 40 40" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round">
            <line x1="20" y1="4" x2="20" y2="30" />
            <path d="M8 20 L20 32 L32 20" />
          </svg>
          <div
            style={{
              marginTop: 12,
              fontFamily,
              fontWeight: 600,
              fontSize: FONT.micro * 0.7,
              color: "#fff",
              whiteSpace: "nowrap",
            }}
          >
            Lien en description
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
