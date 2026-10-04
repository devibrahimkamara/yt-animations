import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AtmosBackground } from "../AtmosOverlay/AtmosBackground";
import { IconPerson } from "../pippit/icons";
import {
  ACCENT,
  ACCENT_LIGHT,
  MONEY_GREEN,
  ATMOS_ERROR,
  ATMOS_PANEL_BG,
  atmosPanelBorder,
  FONT,
  mulberry32,
} from "../pippit/theme";

// Anim 5 — « Le déflou "100 % réaliste" + compteur d'abonnés à zéro » (225 frames / 7,5 s)
// Temps 1 : A Entrée 0–15 · B Pause 15–25 · C Anneau + déflou 25–85 ·
//           D Badge 85–95 · E Tenue 95–110
// Transition : F Glissement 110–125
// Temps 2 : G Carte profil 125–140 · H Tenue 140–150 · I Dégringolade 150–185 ·
//           J Zéro 185–195 · K Conclusion 195–210
// L Sortie 210–225

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });

export const pippitAnim05Schema = z.object({
  imageSrc: z.string().default(""),
  subscriberCount: z.number().default(1250000),
});
export type PippitAnim05Props = z.infer<typeof pippitAnim05Schema>;

const RING_R = 200;
const RING_CIRC = 2 * Math.PI * RING_R;

const rngShake = mulberry32(5001);
const shakeSeeds = Array.from({ length: 40 }, () => rngShake() * 2 - 1);

export const PippitAnim05DeflouCompteurZero: React.FC<PippitAnim05Props> = ({
  imageSrc,
  subscriberCount,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // A — entrée du mockup
  const enter = spring({ frame, fps, config: { damping: 13, stiffness: 150, mass: 0.7 } });

  // C — anneau + déflou synchronisés (une seule valeur de progression)
  const deflouProgress = interpolate(frame, [25, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const blurPx = 24 * (1 - deflouProgress);
  const ringOffset = RING_CIRC * (1 - deflouProgress);
  const pct = Math.round(deflouProgress * 100);

  // D — badge
  const badgeAppear = spring({ frame: frame - 85, fps, config: { damping: 11, stiffness: 170, mass: 0.6 } });

  // F — glissement du téléphone
  const slideProgress = interpolate(frame, [110, 125], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const phoneX = interpolate(slideProgress, [0, 1], [0, -420]);
  const phoneScale = interpolate(slideProgress, [0, 1], [1, 0.75]);

  // G — carte de profil
  const cardAppear = spring({ frame: frame - 125, fps, config: { damping: 13, stiffness: 160, mass: 0.7 } });

  // I — dégringolade du compteur
  const subscriberRaw = interpolate(frame, [150, 185], [subscriberCount, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.poly(4)),
  });
  const subscriberDisplay = Math.round(subscriberRaw)
    .toLocaleString("fr-FR")
    .replace(/[  ]/g, " ");

  const shakeEnvelope = interpolate(frame, [150, 167], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shakeIdx = Math.min(shakeSeeds.length - 1, Math.max(0, frame - 150));
  const counterShakeY = frame >= 150 && frame < 167 ? shakeSeeds[shakeIdx] * 3 * shakeEnvelope : 0;

  // J — pulsation du zéro
  const zeroPulse = interpolate(frame, [185, 189, 195], [1, 1.08, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // K — conclusion
  const conclusionOpacity = interpolate(frame, [195, 205], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const conclusionY = interpolate(frame, [195, 205], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // L — sortie
  const exitOpacity = interpolate(frame, [210, 225], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: exitOpacity }}>
      <AtmosBackground />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "relative",
            transform: `translateX(${phoneX}px) scale(${enter * phoneScale})`,
          }}
        >
          <svg width={480} height={480} style={{ position: "absolute", left: -40, top: -40, overflow: "visible" }}>
            <circle
              cx={240}
              cy={240}
              r={RING_R}
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth={9}
              strokeLinecap="round"
              strokeDasharray={RING_CIRC}
              strokeDashoffset={ringOffset}
              transform="rotate(-90 240 240)"
            />
            <defs>
              <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={ACCENT_LIGHT} />
                <stop offset="100%" stopColor={ACCENT} />
              </linearGradient>
            </defs>
          </svg>

          <div
            style={{
              width: 320,
              height: 400,
              borderRadius: 40,
              border: "4px solid #fff",
              overflow: "hidden",
              position: "relative",
              background: "#1a1a22",
            }}
          >
            {imageSrc ? (
              <Img
                src={staticFile(imageSrc)}
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(${blurPx}px)` }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background:
                    "radial-gradient(circle at 50% 35%, #5B8DEF 0%, #8B6EF5 55%, #2a2a3a 100%)",
                  filter: `blur(${blurPx}px)`,
                }}
              />
            )}
          </div>

          {deflouProgress > 0 && deflouProgress < 1 && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: -60,
                transform: "translateX(-50%)",
                fontFamily,
                fontWeight: 700,
                fontSize: FONT.micro,
                color: "#fff",
              }}
            >
              {pct}%
            </div>
          )}

          {frame >= 85 && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: -70,
                transform: `translateX(-50%) scale(${Math.max(0, badgeAppear)})`,
                background: MONEY_GREEN,
                color: "#fff",
                borderRadius: 999,
                padding: "14px 32px",
                fontFamily,
                fontWeight: 700,
                fontSize: FONT.micro,
                whiteSpace: "nowrap",
              }}
            >
              100 % réaliste
            </div>
          )}
        </div>

        {frame >= 125 && (
          <div
            style={{
              position: "absolute",
              left: "62%",
              top: "50%",
              transform: `translate(0, -50%) translateY(${counterShakeY}px) scale(${Math.max(0, cardAppear)})`,
              background: ATMOS_PANEL_BG,
              border: `1px solid ${atmosPanelBorder(0.3)}`,
              borderRadius: 20,
              padding: "48px 32px",
              width: 560,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "#2C2C2E",
                border: "2px solid #48484A",
                margin: "0 auto 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconPerson size={52} color="#EDEDED" strokeWidth={3} />
            </div>
            <div style={{ fontFamily, fontWeight: 600, fontSize: FONT.micro * 0.6, color: "#EDEDED", opacity: 0.7, marginBottom: 8 }}>
              Abonnés
            </div>
            <div
              style={{
                fontFamily,
                fontWeight: 800,
                fontSize: frame >= 185 ? FONT.counter : 64,
                color: "#fff",
                whiteSpace: "nowrap",
                transform: frame >= 185 ? `scale(${zeroPulse})` : undefined,
              }}
            >
              {subscriberDisplay}
            </div>
          </div>
        )}
      </AbsoluteFill>

      {frame >= 195 && (
        <div
          style={{
            position: "absolute",
            left: "62%",
            top: "50%",
            transform: `translate(0, 260px) translateY(${conclusionY}px)`,
            width: 460,
            textAlign: "center",
            opacity: conclusionOpacity,
            fontFamily,
            fontWeight: 700,
            fontSize: FONT.micro,
            color: "#fff",
          }}
        >
          Influenceur requis :{" "}
          <span style={{ color: ATMOS_ERROR }}>non</span>
        </div>
      )}
    </AbsoluteFill>
  );
};
