import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsAdobe/Stage";
import { ShockRing } from "../higgsAdobe/ShockRing";
import { GLITCH_RED, INK, FONT } from "../higgsAdobe/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const higgsAdobeAnim10Schema = z.object({
  topText: z.string().default("STANDARD DE"),
  bottomText: z.string().default("L'INDUSTRIE"),
});
export type HiggsAdobeAnim10Props = z.infer<typeof higgsAdobeAnim10Schema>;

const CX = 960;
const CY = 540;
const R = 250; // rayon du tampon (diamètre ~500, agrandi pour mobile)
const TEXT_R = R - 40;

// Micro-shake du cadre à l'impact : pattern sec sur 4 frames.
const SHAKE = [2, -2, 1, 0];

export const HiggsAdobeAnim10TamponReference: React.FC<HiggsAdobeAnim10Props> = ({
  topText,
  bottomText,
}) => {
  const frame = useCurrentFrame();

  // Phase 1 — approche scale 3 → 1
  const scale = interpolate(frame, [0, 15], [3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });

  // Flou de mouvement : 2 copies en retard qui disparaissent à l'impact
  const trailOpacity = interpolate(frame, [0, 14, 18], [1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scaleLag2 = interpolate(frame - 2, [0, 15], [3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const scaleLag3 = interpolate(frame - 3, [0, 15], [3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });

  // Micro-shake du cadre (15 → 19)
  const shakeIdx = frame - 15;
  const shake = shakeIdx >= 0 && shakeIdx < SHAKE.length ? SHAKE[shakeIdx] : 0;

  // Phase 3 — texte en arc (18 → 26)
  const textT = interpolate(frame, [18, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 4 — glow pulsant sur le contour
  const glow = interpolate(Math.sin((frame / 50) * Math.PI * 2), [-1, 1], [0.15, 0.3]);

  // Phase 5 — sortie
  const outT = interpolate(frame, [120, 135], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  const Stamp: React.FC<{ s: number; opacity: number; uid: string }> = ({ s, opacity, uid }) => (
    <svg
      width={R * 2 + 40}
      height={R * 2 + 40}
      viewBox={`0 0 ${R * 2 + 40} ${R * 2 + 40}`}
      style={{
        position: "absolute",
        left: CX - (R + 20),
        top: CY - (R + 20),
        transform: `scale(${s})`,
        transformOrigin: "center",
        opacity,
        overflow: "visible",
      }}
    >
      <defs>
        <path
          id={`arcTop-${uid}`}
          d={`M ${20 + R - TEXT_R} ${20 + R} A ${TEXT_R} ${TEXT_R} 0 0 1 ${20 + R + TEXT_R} ${20 + R}`}
          fill="none"
        />
        <path
          id={`arcBottom-${uid}`}
          d={`M ${20 + R - TEXT_R} ${20 + R} A ${TEXT_R} ${TEXT_R} 0 0 0 ${20 + R + TEXT_R} ${20 + R}`}
          fill="none"
        />
      </defs>
      {/* double contour */}
      <circle cx={20 + R} cy={20 + R} r={R} fill="none" stroke={INK} strokeWidth={6} />
      <circle cx={20 + R} cy={20 + R} r={R - 14} fill="none" stroke={INK} strokeWidth={2} />
      <text
        fill={INK}
        fontFamily={fontFamily}
        fontWeight={800}
        fontSize={FONT.micro * 0.62}
        letterSpacing="3"
        opacity={opacity === 1 ? textT : 0}
        style={{ transform: `scale(${interpolate(textT, [0, 1], [0.9, 1])})`, transformOrigin: "center" }}
      >
        <textPath href={`#arcTop-${uid}`} startOffset="50%" textAnchor="middle">
          {topText}
        </textPath>
      </text>
      <text
        fill={INK}
        fontFamily={fontFamily}
        fontWeight={800}
        fontSize={FONT.micro * 0.62}
        letterSpacing="3"
        opacity={opacity === 1 ? textT : 0}
      >
        <textPath href={`#arcBottom-${uid}`} startOffset="50%" textAnchor="middle">
          {bottomText}
        </textPath>
      </text>
    </svg>
  );

  return (
    <Stage>
      <AbsoluteFill
        style={{
          opacity: 1 - outT,
          transform: `translate(${shake}px, ${-shake}px)`,
        }}
      >
        {/* halo rouge subtil */}
        <div
          style={{
            position: "absolute",
            left: CX - R,
            top: CY - R,
            width: R * 2,
            height: R * 2,
            borderRadius: "50%",
            boxShadow: `0 0 ${80 + glow * 120}px ${GLITCH_RED}`,
            opacity: frame > 15 ? glow : 0,
          }}
        />
        {/* copies de flou de mouvement */}
        {frame < 18 && (
          <>
            <Stamp s={scaleLag3 * 1.1} opacity={0.15 * trailOpacity} uid="lag3" />
            <Stamp s={scaleLag2 * 1.05} opacity={0.3 * trailOpacity} uid="lag2" />
          </>
        )}
        {/* tampon principal */}
        <Stamp s={scale} opacity={1} uid="main" />

        {/* anneau de choc */}
        <ShockRing
          startFrame={15}
          durationInFrames={14}
          cx={CX}
          cy={CY}
          fromScale={0.5}
          toScale={2}
          color={INK}
          fromOpacity={0.9}
        />
      </AbsoluteFill>
    </Stage>
  );
};
