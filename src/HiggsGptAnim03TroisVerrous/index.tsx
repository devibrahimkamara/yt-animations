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
import { Stage } from "../higgsGpt/Stage";
import { IconLock } from "../higgsGpt/icons";
import {
  ACCENT,
  STRIKE_RED,
  CENSOR_BLACK,
  ICON,
  mulberry32,
} from "../higgsGpt/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "800"],
  subsets: ["latin"],
});

// Anim 3 — « Les 3 verrous censurés » (270 frames / 9 s @ 30 fps)
// A distribution 0–36 · B numéros + cadenas + censure 36–66 · C hold 66–210
// D sortie 210–270
// Teaser des 3 limitations sans les révéler — renforce le curiosity gap.

export const higgsGptAnim03Schema = z.object({
  numbers: z.array(z.string()).default(["01", "02", "03"]),
});
export type HiggsGptAnim03Props = z.infer<typeof higgsGptAnim03Schema>;

const CARD_W = 400;
const CARD_H = 600;
const CX = 960;
const CY = 540;
const SPREAD = 460;

export const HiggsGptAnim03TroisVerrous: React.FC<HiggsGptAnim03Props> = ({
  numbers,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rng = mulberry32(0x33cc);

  const cards = numbers.slice(0, 3).map((n, i) => {
    const startRot = (rng() * 2 - 1) * 8; // -8°..+8°
    const restRot = (i - 1) * 3 + (rng() * 2 - 1) * 1; // ≈ éventail -3..+3
    const oscOffset = rng() * 6;
    return { n, startRot, restRot, oscOffset };
  });

  return (
    <Stage outFrames={2}>
      <AbsoluteFill>
        {cards.map((c, i) => {
          const inStart = i * 12;
          const outStart = 210 + i * 12;

          // A — arrivée (croupier)
          const deal = spring({
            frame: frame - inStart,
            fps,
            config: { damping: 9, stiffness: 130, mass: 0.9 },
          });
          const targetX = CX + (i - 1) * SPREAD;
          const x = interpolate(deal, [0, 1], [CX, targetX]);
          const yIn = interpolate(deal, [0, 1], [CY + 720, CY]);

          // B — numéro + cadenas + barre de censure
          const nf = frame - (36 + i * 12);
          const numPop = spring({
            frame: nf,
            fps,
            config: { damping: 10, stiffness: 200, mass: 0.7 },
          });
          const numScale = interpolate(numPop, [0, 0.6, 1], [0, 1.12, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const lockOp = interpolate(nf, [8, 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const censorWipe = interpolate(nf, [16, 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });

          // C — micro-oscillation + glow rouge occasionnel
          const osc =
            frame >= 66
              ? 1 + Math.sin(frame / 10 + c.oscOffset) * 0.02
              : 1;
          const redPulse =
            frame >= 66
              ? Math.max(
                  0,
                  Math.sin((frame - c.oscOffset * 7) / 20) ** 8,
                ) * 0.9
              : 0;

          // D — sortie décalée
          const outT = interpolate(frame, [outStart, outStart + 40], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.in(Easing.cubic),
          });
          const yOut = outT * 900;
          const rotOut = outT * (8 + i * 2);
          const cardOpacity =
            interpolate(frame - inStart, [0, 6], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }) *
            (1 - outT);

          const rot =
            interpolate(deal, [0, 1], [c.startRot, c.restRot], {
              extrapolateRight: "clamp",
            }) + rotOut;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x - CARD_W / 2,
                top: yIn - CARD_H / 2 + yOut,
                width: CARD_W,
                height: CARD_H,
                borderRadius: 22,
                background:
                  "linear-gradient(160deg, #2b2d34 0%, #17181d 100%)",
                border: `1px solid ${redPulse > 0.05 ? STRIKE_RED : "rgba(120,150,255,0.16)"}`,
                boxShadow: `0 24px 70px rgba(0,0,0,0.5)${
                  redPulse > 0.05 ? `, 0 0 26px ${STRIKE_RED}${Math.round(redPulse * 90).toString(16).padStart(2, "0")}` : ""
                }`,
                transform: `rotate(${rot}deg)`,
                opacity: cardOpacity,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "56px 40px",
                boxSizing: "border-box",
              }}
            >
              {/* Numéro */}
              <span
                style={{
                  fontFamily,
                  fontWeight: 800,
                  fontSize: 150,
                  lineHeight: 1,
                  color: ACCENT,
                  transform: `scale(${numScale})`,
                }}
              >
                {c.n}
              </span>

              {/* Cadenas */}
              <div style={{ marginTop: 40, opacity: lockOp }}>
                <IconLock size={ICON.md} color="#c9c9d0" strokeWidth={3.5} />
              </div>

              {/* Barre de censure */}
              <div
                style={{
                  marginTop: 44,
                  width: "100%",
                  height: 74,
                  borderRadius: 8,
                  background: CENSOR_BLACK,
                  border: `2px solid ${STRIKE_RED}`,
                  boxShadow: `0 0 ${10 + redPulse * 24}px ${STRIKE_RED}${Math.round(
                    (0.15 + redPulse * 0.55) * 255,
                  )
                    .toString(16)
                    .padStart(2, "0")}`,
                  transform: `scaleX(${censorWipe * osc})`,
                  transformOrigin: "left center",
                }}
              />
              <div
                style={{
                  marginTop: 20,
                  width: "70%",
                  height: 40,
                  borderRadius: 6,
                  background: CENSOR_BLACK,
                  transform: `scaleX(${censorWipe})`,
                  transformOrigin: "left center",
                  opacity: 0.85,
                }}
              />
            </div>
          );
        })}
      </AbsoluteFill>
    </Stage>
  );
};
