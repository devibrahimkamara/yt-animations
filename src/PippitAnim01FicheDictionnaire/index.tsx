import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont as loadSans } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import { AtmosBackground } from "../AtmosOverlay/AtmosBackground";
import { PAPER_BG, PAPER_INK, PAPER_SLATE, HIGHLIGHT_YELLOW } from "../pippit/theme";

// Anim 1 — « La fiche dictionnaire "Affiliation" » (195 frames / 6,5 s)
// A Entrée carte 0–15 · B Écriture mot 15–50 · C Pause 50–58 ·
// D Définition mot par mot 58–110 · E Surligneur 110–140 · F Tenue 140–175 ·
// G Sortie 175–195

const { fontFamily: sans } = loadSans("normal", { weights: ["600", "700"], subsets: ["latin"] });
const { fontFamily: serif } = loadSerif("normal", { weights: ["400", "700"], subsets: ["latin"] });
const { fontFamily: serifItalic } = loadSerif("italic", { weights: ["400"], subsets: ["latin"] });

export const pippitAnim01Schema = z.object({
  word: z.string().default("af·fi·li·a·tion"),
  pos: z.string().default("(n.f.)"),
  definitionWords: z
    .array(z.string())
    .default(["Promouvoir", "un", "produit", "ou", "un", "service"]),
  highlightedWord: z.string().default("Promouvoir"),
});
export type PippitAnim01Props = z.infer<typeof pippitAnim01Schema>;

export const PippitAnim01FicheDictionnaire: React.FC<PippitAnim01Props> = ({
  word,
  pos,
  definitionWords,
  highlightedWord,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Zoom de fond quasi imperceptible sur toute la durée
  const bgScale = interpolate(frame, [0, durationInFrames], [1, 1.06]);

  // A — entrée de la carte
  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 140, mass: 0.8 } });
  const cardScale = interpolate(enter, [0, 1], [0.92, 1]);
  const cardRotate = interpolate(enter, [0, 1], [-2, -1]);
  const cardOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  // B — écriture caractère par caractère
  const visibleChars = Math.floor(
    interpolate(frame, [15, 50], [0, word.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const writing = frame >= 15 && frame < 52;
  const cursorOn = writing && frame % 15 < 8;
  const posOpacity = interpolate(frame, [50, 56], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // D — mots de la définition, un par un
  const WORD_STEP = 6;
  const defStart = 58;

  // E — surligneur
  const highlightProgress = interpolate(frame, [110, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const highlightOvershoot = interpolate(frame, [130, 136, 140], [1, 1.03, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const highlightWidth = highlightProgress * highlightOvershoot * 100;

  // G — sortie
  const exitOpacity = interpolate(frame, [175, 195], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitScale = interpolate(frame, [175, 195], [1, 1.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AtmosBackground />

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: cardOpacity * exitOpacity,
          transform: `scale(${bgScale * cardScale * exitScale})`,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 1180,
            padding: "88px 96px",
            background: PAPER_BG,
            borderRadius: 12,
            boxShadow: "0 60px 140px rgba(0,0,0,0.55)",
            transform: `rotate(${cardRotate}deg)`,
          }}
        >
          {/* Texture papier très subtile */}
          <AbsoluteFill
            style={{
              borderRadius: 12,
              backgroundImage:
                "radial-gradient(circle, rgba(0,0,0,0.5) 1px, transparent 1px)",
              backgroundSize: "3px 3px",
              opacity: 0.05,
              mixBlendMode: "multiply",
            }}
          />

          <div style={{ position: "relative", display: "flex", alignItems: "baseline", gap: 24 }}>
            <span
              style={{
                fontFamily: serif,
                fontWeight: 700,
                fontSize: 108,
                color: PAPER_INK,
                whiteSpace: "nowrap",
              }}
            >
              {word.slice(0, visibleChars)}
              <span style={{ opacity: cursorOn ? 1 : 0, color: PAPER_INK }}>|</span>
            </span>
            <span
              style={{
                fontFamily: serifItalic,
                fontStyle: "italic",
                fontSize: 48,
                color: PAPER_SLATE,
                opacity: posOpacity,
              }}
            >
              {pos}
            </span>
          </div>

          <div style={{ position: "relative", marginTop: 40, fontSize: 56 }}>
            {definitionWords.map((w, i) => {
              const wStart = defStart + i * WORD_STEP;
              const wOpacity = interpolate(frame, [wStart, wStart + 10], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const wY = interpolate(frame, [wStart, wStart + 10], [8, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const isHighlighted = w === highlightedWord;

              return (
                <span
                  key={i}
                  style={{
                    position: "relative",
                    display: "inline-block",
                    marginRight: 16,
                    fontFamily: serif,
                    fontWeight: 400,
                    color: PAPER_SLATE,
                    opacity: wOpacity,
                    transform: `translateY(${wY}px)`,
                  }}
                >
                  {isHighlighted && (
                    <span
                      style={{
                        position: "absolute",
                        left: -4,
                        right: `${100 - highlightWidth}%`,
                        top: "38%",
                        bottom: "6%",
                        background: HIGHLIGHT_YELLOW,
                        opacity: 0.6,
                        transform: "skewX(-2deg)",
                        borderRadius: 2,
                      }}
                    />
                  )}
                  <span style={{ position: "relative" }}>{w}</span>
                </span>
              );
            })}
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 28,
              right: 40,
              fontFamily: sans,
              fontWeight: 600,
              fontSize: 28,
              color: PAPER_SLATE,
              opacity: 0.5,
            }}
          >
            pipit.ai
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
