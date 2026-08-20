import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

// Contour Afrique géographiquement précis, viewBox 380×460
// Coordonnées converties depuis lat/lon réelles :
//   x = 5 + (lon + 17) / 68 * 370   [lon de -17°W à +51°E]
//   y = 5 + (37 - lat) / 71 * 450   [lat de 37°N à -34°S]
// Sens horaire depuis NW (Maroc) → nord → Corne (NE) → est → Cap (S) → ouest → retour
const AFRICA_PATH = [
  "M 68,18",    // Maroc NW (35°N, 6°W)
  "L 148,5",    // Algérie/Tunisie nord (37°N, 10°E)
  "L 205,8",    // Libye nord (37°N, 17°E)
  "L 258,42",   // Égypte (31°N, 30°E)
  "L 275,44",   // Sinaï / angle NE (30°N, 33°E)
  "L 330,162",  // Entrée mer Rouge / Djibouti (11°N, 43°E)
  "L 372,174",  // CORNE DE L'AFRIQUE — point le plus à l'EST (10°N, 51°E)
  "L 335,225",  // Somalie sud (2°N, 44°E)
  "L 313,263",  // Kenya (4°S, 40°E)
  "L 312,302",  // Tanzanie (10°S, 40°E)
  "L 286,364",  // Mozambique (20°S, 35°E)
  "L 264,428",  // Afrique du Sud est (30°S, 31°E)
  "L 205,455",  // CAP DE BONNE-ESPÉRANCE — point le plus au SUD (34°S, 18°E)
  "L 168,438",  // Cap ouest (33°S, 14°E)
  "L 143,403",  // Namibie (25°S, 15°E)
  "L 122,362",  // Angola sud (17°S, 12°E)
  "L 112,308",  // Angola nord (6°S, 12°E)
  "L 103,268",  // Congo (1°S, 9°E)
  "L 98,235",   // Gabon (5°N, 9°E)
  "L 106,212",  // Nigeria côte (5°N, 3°E) — Golfe de Guinée s'enfonce vers l'est
  "L 92,207",   // Ghana (5°N, 0°)
  "L 65,208",   // Côte d'Ivoire (5°N, 5°W)
  "L 46,218",   // Libéria (4°N, 8°W)
  "L 20,180",   // Sierra Leone — RENFLEMENT AFRIQUE DE L'OUEST (9°N, 13°W)
  "L 10,155",   // Guinée (11°N, 15°W)
  "L 4,125",    // Sénégal (13°N, 17°W)
  "L 12,95",    // Mauritanie (20°N, 15°W)
  "L 33,58",    // Mauritanie nord (27°N, 13°W)
  "L 68,18",    // Retour Maroc NW
  "Z",
].join(" ");
const pathLength = 2600;

export const mapCardSchema = z.object({
  headline: z.string(),
  subtext: z.string().optional(),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(5),
});

export type MapCardProps = z.infer<typeof mapCardSchema>;

export const MapCard: React.FC<MapCardProps> = ({
  headline,
  subtext,
  accentColor,
  durationSecs,
}) => {
  const frame = useCurrentFrame();
  const totalFrames = durationSecs * 30;

  // Contour dessiné via strokeDashoffset
  const drawProgress = interpolate(frame, [5, 55], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });
  const strokeDashoffset = pathLength * (1 - drawProgress);

  // Remplissage fade-in après le dessin
  const fillOpacity = interpolate(frame, [55, 80], [0, 0.35], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });

  // Glow pulsant au centre
  const glowPulse = 0.6 + 0.4 * Math.abs(Math.sin(frame * 0.1));

  // Textes
  const headlineOpacity = interpolate(frame, [70, 90], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });
  const subtextOpacity = interpolate(frame, [85, 100], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
  });

  // Opacité globale
  const containerOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />
      <AbsoluteFill style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 80,
        opacity: containerOpacity,
      }}>

        {/* Carte SVG */}
        <div style={{ position: "relative" }}>
          <svg width={380} height={460} viewBox="0 0 380 460">
            <defs>
              <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={accentColor} stopOpacity={0.6 * glowPulse} />
                <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
              </radialGradient>
            </defs>

            {/* Glow de fond */}
            <ellipse cx={185} cy={240} rx={160} ry={180} fill="url(#mapGlow)" />

            {/* Remplissage */}
            <path
              d={AFRICA_PATH}
              fill={accentColor}
              opacity={fillOpacity}
            />

            {/* Contour animé */}
            <path
              d={AFRICA_PATH}
              fill="none"
              stroke="rgba(136,170,255,0.9)"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={pathLength}
              strokeDashoffset={strokeDashoffset}
              style={{ filter: "drop-shadow(0 0 6px rgba(136,170,255,0.6))" }}
            />

            {/* Point central lumineux */}
            {drawProgress > 0.8 && (
              <circle
                cx={185}
                cy={240}
                r={12 * glowPulse}
                fill={accentColor}
                opacity={0.9}
                style={{ filter: `drop-shadow(0 0 15px ${accentColor})` }}
              />
            )}
          </svg>
        </div>

        {/* Textes */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 560 }}>
          <div style={{ opacity: headlineOpacity }}>
            <span style={{
              fontFamily,
              fontWeight: 800,
              fontSize: 52,
              color: "#ffffff",
              lineHeight: 1.2,
              background: "linear-gradient(180deg, #ffffff 0%, #88aaff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              {headline}
            </span>
          </div>
          {subtext && (
            <div style={{ opacity: subtextOpacity }}>
              <span style={{
                fontFamily,
                fontWeight: 600,
                fontSize: 30,
                color: "rgba(136,170,255,0.85)",
                lineHeight: 1.4,
              }}>
                {subtext}
              </span>
            </div>
          )}
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
