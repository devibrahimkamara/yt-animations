import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../freebeat/Stage";
import { StampReveal } from "../freebeat/StampReveal";
import { ACCENT, INK, DESATURATED, FONT } from "../freebeat/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const freebeatAnim07Schema = z.object({
  leftLabel: z.string().default("Tournage classique"),
  rightLabel: z.string().default("Généré par IA"),
  stampText: z.string().default("100 % généré par IA"),
});

export type FreebeatAnim07Props = z.infer<typeof freebeatAnim07Schema>;

const ClassicIcon: React.FC<{ kind: number }> = ({ kind }) => (
  <svg width="212" height="212" viewBox="0 0 24 24" fill="none" stroke="#9A9AA0" strokeWidth="1.5">
    {kind === 0 && (
      <>
        <rect x="2" y="7" width="13" height="10" rx="2" />
        <path d="M15 10l6-3v10l-6-3" />
      </>
    )}
    {kind === 1 && (
      <>
        <circle cx="9" cy="8" r="3" />
        <circle cx="16" cy="9" r="2.4" />
        <path d="M3 19c0-3 3-5 6-5s6 2 6 5M15 19c0-2 2-3.5 4-3.5s3 1 3 2.5" />
      </>
    )}
    {kind === 2 && (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v8M9.5 10c0-1.2 1.1-2 2.5-2s2.5.8 2.5 2-1.1 2-2.5 2-2.5.8-2.5 2 1.1 2 2.5 2 2.5-.8 2.5-2" />
      </>
    )}
  </svg>
);

export const FreebeatAnim07WipeAvantApres: React.FC<FreebeatAnim07Props> = ({
  leftLabel,
  rightLabel,
  stampText,
}) => {
  const frame = useCurrentFrame();

  const leftIn = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Wipe : progression 0 → 100 (%) sur 18-72
  const progress = interpolate(frame, [18, 72], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lineOpacity = interpolate(frame, [0, 6, 72, 76], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const spin = (frame * 2) % 360;
  const breathe = 1 + Math.sin(frame / 18) * 0.06;

  return (
    <Stage outFrames={12}>
      {/* Côté « avant » — tournage classique (fond désaturé, visible dès le départ) */}
      <AbsoluteFill style={{ background: DESATURATED, opacity: leftIn }}>
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 50,
            paddingLeft: "48%",
          }}
        >
          <div style={{ display: "flex", gap: 64 }}>
            {[0, 1, 2].map((k) => (
              <ClassicIcon key={k} kind={k} />
            ))}
          </div>
          <div style={{ fontFamily, fontWeight: 700, fontSize: FONT.label, color: "#D0D0D6" }}>
            {leftLabel}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* Côté droit — généré par IA (révélé par clipPath) */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg, ${ACCENT} 0%, #1c3ad6 100%)`,
          clipPath: `inset(0 ${100 - progress}% 0 0)`,
        }}
      >
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 40,
            paddingRight: "52%",
          }}
        >
          {/* formes géométriques animées en boucle */}
          <div style={{ position: "relative", width: 340, height: 340 }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                border: `14px solid ${INK}`,
                opacity: 0.3,
                transform: `rotate(${spin}deg) scale(${breathe})`,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 40,
                borderRadius: "50%",
                border: `11px solid ${INK}`,
                opacity: 0.42,
                transform: `rotate(${-spin}deg) scale(${2 - breathe})`,
              }}
            />
          </div>
          <div style={{ fontFamily, fontWeight: 800, fontSize: FONT.label, color: INK, textAlign: "center" }}>
            {rightLabel}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* Ligne de balayage */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${progress}%`,
          width: 6,
          background: INK,
          opacity: lineOpacity,
          boxShadow: `0 0 30px 8px ${INK}, 0 0 80px 16px ${ACCENT}`,
        }}
      />

      {/* Tampon final + flash (géré par StampReveal) */}
      <StampReveal text={stampText} startFrame={87} color={INK} restRotation={-3} />
    </Stage>
  );
};
