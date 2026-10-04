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
import { Stage } from "../higgsGpt3/Stage";
import { ACCENT, ACCENT_LIGHT, INK, FONT, MONO_FONT_STACK, atmosGlow } from "../higgsGpt3/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});

// Anim 1 — « Scan de métadonnées » (150 frames / 5 s @ 30 fps)
// A image + balayage 0–27 · B étiquettes en cascade 27–68 (27/38/49, persistent)
// C tampon "100% généré par IA" 90–150 (entrée 90–105, hold 105–135, sortie 135–150)

export const higgsGpt3Anim01Schema = z.object({
  model: z.string().default("nano banana pro"),
  prompt: z.string().default("villa moderne, golden hour"),
  cost: z.string().default("0,03 €"),
  stamp: z.string().default("100 % GÉNÉRÉ PAR IA"),
});
export type HiggsGpt3Anim01Props = z.infer<typeof higgsGpt3Anim01Schema>;

const DataLabel: React.FC<{
  label: string;
  value: string;
  delay: number;
  pos: { top?: number | string; bottom?: number | string; left?: number | string; right?: number | string };
}> = ({ label, value, delay, pos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 200 },
  });
  const x = interpolate(s, [0, 1], [-30, 0]);
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const blink = Math.floor(frame / 15) % 2 === 0;

  return (
    <div
      style={{
        position: "absolute",
        ...pos,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 22px",
        borderRadius: 10,
        background: "rgba(10,10,10,0.65)",
        backdropFilter: "blur(4px)",
        border: `1px solid ${ACCENT}55`,
        transform: `translateX(${x}px)`,
        opacity,
        fontFamily: MONO_FONT_STACK,
        fontSize: FONT.micro * 0.5,
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: ACCENT_LIGHT,
          opacity: blink ? 1 : 0.3,
          boxShadow: atmosGlow(ACCENT, 20, 40),
        }}
      />
      <span style={{ color: ACCENT_LIGHT }}>{label}</span>
      <span style={{ color: INK }}>{value}</span>
    </div>
  );
};

export const HiggsGpt3Anim01ScanMetadonnees: React.FC<HiggsGpt3Anim01Props> = ({
  model,
  prompt,
  cost,
  stamp,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scanProgress = interpolate(frame, [0, 27], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const stampSpring = spring({
    frame: frame - 90,
    fps,
    config: { damping: 8, stiffness: 180 },
  });
  const stampScale = interpolate(stampSpring, [0, 1], [1.3, 1]);
  const stampOpacity = interpolate(frame, [90, 98], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stampBlur = interpolate(stampSpring, [0, 1], [4, 0]);
  const stampRotate = interpolate(stampSpring, [0, 1], [-8, 0]);

  const exitScale = interpolate(frame, [135, 150], [1, 0.98], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const corners = [
    { top: 30, left: 30 },
    { top: 30, right: 30 },
    { bottom: 30, left: 30 },
    { bottom: 30, right: 30 },
  ];

  return (
    <Stage outFrames={15} bare>
      <AbsoluteFill
        style={{
          fontFamily,
          transform: `scale(${exitScale})`,
          overflow: "hidden",
        }}
      >
        {/* Fond stylisé "villa golden hour" (illustration CSS, pas de photo) */}
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, #ffb066 0%, #ff8a5c 35%, #3b2440 75%, #1a1030 100%)",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "45%",
              background: "linear-gradient(180deg, #241a33 0%, #120a1e 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "22%",
              left: "28%",
              width: 640,
              height: 260,
              background: "#1b1226",
              clipPath:
                "polygon(0% 100%, 0% 35%, 50% 0%, 100% 35%, 100% 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "22%",
              left: "35%",
              width: 90,
              height: 70,
              background: "#ffd98a",
              opacity: 0.8,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "22%",
              left: "52%",
              width: 90,
              height: 70,
              background: "#ffd98a",
              opacity: 0.5,
            }}
          />
        </AbsoluteFill>

        {/* Couche "technique" (au-dessus, révélée par le scan) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: `inset(0 0 ${100 - scanProgress}% 0)`,
            filter: "saturate(0.4)",
          }}
        >
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(180deg, #ffb066 0%, #ff8a5c 35%, #3b2440 75%, #1a1030 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `linear-gradient(${ACCENT}26 1px, transparent 1px), linear-gradient(90deg, ${ACCENT}26 1px, transparent 1px)`,
              backgroundSize: "45px 45px",
              opacity: 0.15,
            }}
          />
        </div>

        {/* Ligne de scan */}
        <div
          style={{
            position: "absolute",
            top: `${scanProgress}%`,
            left: 0,
            right: 0,
            height: 3,
            background: ACCENT_LIGHT,
            boxShadow: `0 0 8px ${ACCENT}, 0 0 16px ${ACCENT}`,
            opacity: scanProgress > 0 && scanProgress < 100 ? 1 : 0,
          }}
        />

        {/* Crochets de tracking (un L par coin, orienté vers le centre) */}
        {corners.map((c, i) => {
          const cornerThreshold = 25 + i * 20;
          const op = interpolate(
            scanProgress,
            [cornerThreshold - 5, cornerThreshold],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const isLeft = "left" in c;
          const isTop = "top" in c;
          const hx = isLeft ? 2 : 38;
          const hxEnd = isLeft ? 20 : 20;
          const vy = isTop ? 2 : 38;
          return (
            <svg
              key={i}
              width={40}
              height={40}
              style={{ position: "absolute", ...c, opacity: op }}
            >
              <path
                d={`M${hx} ${vy === 2 ? 20 : 20} L${hx} ${vy} L${hxEnd} ${vy}`}
                fill="none"
                stroke={ACCENT_LIGHT}
                strokeWidth={3}
              />
            </svg>
          );
        })}

        {/* Étiquettes techniques */}
        <DataLabel
          label="Modèle :"
          value={model}
          delay={27}
          pos={{ top: "10%", left: "10%" }}
        />
        <DataLabel
          label="Prompt :"
          value={prompt}
          delay={38}
          pos={{ top: "45%", left: "60%" }}
        />
        <DataLabel
          label="Coût réel :"
          value={cost}
          delay={49}
          pos={{ top: "75%", left: "10%" }}
        />

        {/* Tampon final */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 60,
            padding: "22px 36px",
            background: ACCENT,
            border: "2px solid rgba(255,255,255,0.5)",
            outline: `2px solid ${ACCENT}`,
            outlineOffset: 4,
            borderRadius: 8,
            transform: `scale(${stampScale}) rotate(${stampRotate}deg)`,
            filter: `blur(${stampBlur}px)`,
            opacity: stampOpacity,
          }}
        >
          <span
            style={{
              color: "#fff",
              fontSize: FONT.micro * 0.65,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {stamp}
          </span>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
