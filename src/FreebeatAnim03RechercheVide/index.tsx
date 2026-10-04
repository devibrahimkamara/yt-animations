import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../freebeat/Stage";
import { TypeOnText } from "../freebeat/TypeOnText";
import { EmptyResultCard } from "../freebeat/EmptyResultCard";
import { StampReveal } from "../freebeat/StampReveal";
import { ACCENT, INK, NEUTRAL_BORDER, NEUTRAL_PANEL } from "../freebeat/theme";

const { fontFamily } = loadFont("normal", { weights: ["600", "700"], subsets: ["latin"] });

export const freebeatAnim03Schema = z.object({
  query: z.string().default("clip vidéo IA pour artiste"),
  stampText: z.string().default("quasi personne n'en parle"),
});

export type FreebeatAnim03Props = z.infer<typeof freebeatAnim03Schema>;

const BAR_W = 1620;
const BAR_H = 184;
const QUERY_FS = 76;
const CARD_W = 740;
const CARD_H = 264;
const GRID_GAP = 52;

export const FreebeatAnim03RechercheVide: React.FC<FreebeatAnim03Props> = ({ query, stampText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Entrée de la barre (0-6)
  const enter = spring({ frame, fps, config: { damping: 18, stiffness: 200 } });
  const barScale = interpolate(enter, [0, 1], [0.95, 1], { extrapolateRight: "clamp" });

  const typingDone = frame >= 66;
  const spinnerVisible = frame >= 66 && frame < 96;
  const spinnerRot = (frame * 12) % 360;

  return (
    <Stage outFrames={12}>
      <AbsoluteFill style={{ alignItems: "center", flexDirection: "column", paddingTop: 150 }}>
        {/* Barre de recherche */}
        <div
          style={{
            opacity: enter,
            transform: `scale(${barScale})`,
            width: BAR_W,
            height: BAR_H,
            borderRadius: BAR_H / 2,
            border: `3px solid ${NEUTRAL_BORDER}`,
            background: NEUTRAL_PANEL,
            display: "flex",
            alignItems: "center",
            gap: 36,
            padding: "0 60px",
          }}
        >
          {/* loupe */}
          <svg width="74" height="74" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="7" fill="none" stroke="#8E8E93" strokeWidth="2.4" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#8E8E93" strokeWidth="2.4" />
          </svg>

          <div style={{ flex: 1, display: "flex", alignItems: "center", overflow: "hidden" }}>
            <TypeOnText
              text={query}
              startFrame={6}
              endFrame={66}
              fontFamily={fontFamily}
              fontSize={QUERY_FS}
              color={INK}
              showCursor={!typingDone}
              cursorColor={ACCENT}
            />
          </div>

          {/* spinner à droite dans la barre */}
          {spinnerVisible && (
            <svg width="68" height="68" viewBox="0 0 44 44" style={{ flexShrink: 0 }}>
              <g transform={`rotate(${spinnerRot} 22 22)`}>
                <circle
                  cx="22"
                  cy="22"
                  r="16"
                  fill="none"
                  stroke={ACCENT}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="70 30"
                />
              </g>
            </svg>
          )}
        </div>

        {/* Grille de cartes vides */}
        <div
          style={{
            marginTop: 80,
            display: "grid",
            gridTemplateColumns: `repeat(2, ${CARD_W}px)`,
            gap: GRID_GAP,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <EmptyResultCard key={i} delay={96 + i * 5} width={CARD_W} height={CARD_H} />
          ))}
        </div>
      </AbsoluteFill>

      {/* Tampon */}
      <StampReveal text={stampText} startFrame={120} restRotation={-4} />
    </Stage>
  );
};
