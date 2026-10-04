import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../freebeat/Stage";
import { ACCENT, INK, TRACK_GREY, FONT } from "../freebeat/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const freebeatAnim05Schema = z.object({
  label1: z.string().default("Clip vidéo classique"),
  value1: z.string().default("5 000 € – 30 000 €"),
  label2: z.string().default("Budget d'un artiste indé"),
  value2: z.string().default("200 €"),
  bracketText: z.string().default("l'écart où tu te places"),
});

export type FreebeatAnim05Props = z.infer<typeof freebeatAnim05Schema>;

const TRACK_X = 200;
const TRACK_W = 1520;
const BAR_H = 104;
const BIG_Y = 300;
const SMALL_Y = 792;
const BIG_FRAC = 0.94;
const SMALL_FRAC = 0.1;

const BIG_END = TRACK_X + TRACK_W * BIG_FRAC;
const SMALL_END = TRACK_X + TRACK_W * SMALL_FRAC;
const CONNECT_Y = BIG_Y + 172;

// connecteur horizontal pointillé entre la fin de la petite barre et celle de
// la grande, avec deux caps verticaux — matérialise « l'écart »
const GAP_D = `M ${SMALL_END} ${CONNECT_Y - 26} L ${SMALL_END} ${CONNECT_Y + 26} M ${SMALL_END} ${CONNECT_Y} L ${BIG_END} ${CONNECT_Y} M ${BIG_END} ${CONNECT_Y - 26} L ${BIG_END} ${CONNECT_Y + 26}`;
const GAP_LEN = BIG_END - SMALL_END + 110;

export const FreebeatAnim05MurBudget: React.FC<FreebeatAnim05Props> = ({
  label1,
  value1,
  label2,
  value2,
  bracketText,
}) => {
  const frame = useCurrentFrame();

  const label1In = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const label2In = interpolate(frame, [6, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Grande barre : 15-75, easeOutQuart (part vite, ralentit nettement)
  const bigW = interpolate(frame, [15, 75], [0, TRACK_W * BIG_FRAC], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.poly(4)),
  });
  const value1In = interpolate(frame, [68, 82], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Petite barre : 75-93, très rapide (0,6 s)
  const smallW = interpolate(frame, [75, 93], [0, TRACK_W * SMALL_FRAC], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.poly(4)),
  });
  const value2In = interpolate(frame, [92, 104], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Connecteur d'écart : tracé 93-129
  const gapProgress = interpolate(frame, [93, 129], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bracketTextIn = interpolate(frame, [122, 138], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const renderLabel = (text: string, y: number, opacity: number) => (
    <div
      style={{
        position: "absolute",
        left: TRACK_X,
        top: y - BAR_H / 2 - FONT.label - 20,
        opacity,
        transform: `translateX(${interpolate(opacity, [0, 1], [-24, 0])}px)`,
        fontFamily,
        fontWeight: 700,
        fontSize: FONT.label,
        color: "#D0D0D6",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );

  return (
    <Stage outFrames={12}>
      <AbsoluteFill>
        {/* pistes de fond */}
        {[BIG_Y, SMALL_Y].map((y) => (
          <div
            key={y}
            style={{
              position: "absolute",
              left: TRACK_X,
              top: y - 6,
              width: TRACK_W,
              height: 12,
              background: TRACK_GREY,
              borderRadius: 6,
            }}
          />
        ))}

        {renderLabel(label1, BIG_Y, label1In)}
        {renderLabel(label2, SMALL_Y, label2In)}

        {/* grande barre (la norme) — valeur dans la barre, texte sombre */}
        <div
          style={{
            position: "absolute",
            left: TRACK_X,
            top: BIG_Y - BAR_H / 2,
            width: bigW,
            height: BAR_H,
            background: "#E9E9EE",
            borderRadius: BAR_H / 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: 44,
            overflow: "hidden",
          }}
        >
          <span
            style={{
              opacity: value1In,
              fontFamily,
              fontWeight: 800,
              fontSize: FONT.value,
              color: "#0F1220",
              whiteSpace: "nowrap",
            }}
          >
            {value1}
          </span>
        </div>

        {/* petite barre (l'opportunité) — valeur juste après la barre */}
        <div
          style={{
            position: "absolute",
            left: TRACK_X,
            top: SMALL_Y - BAR_H / 2,
            width: smallW,
            height: BAR_H,
            background: ACCENT,
            borderRadius: BAR_H / 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: SMALL_END + 40,
            top: SMALL_Y - FONT.value / 2 - 6,
            opacity: value2In,
            fontFamily,
            fontWeight: 800,
            fontSize: FONT.value,
            color: ACCENT,
            whiteSpace: "nowrap",
          }}
        >
          {value2}
        </div>

        {/* connecteur d'écart + étiquette */}
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0 }}>
          <path
            d={GAP_D}
            fill="none"
            stroke={ACCENT}
            strokeWidth={7}
            strokeLinecap="round"
            strokeDasharray={GAP_LEN}
            strokeDashoffset={GAP_LEN * (1 - gapProgress)}
            style={{ filter: `drop-shadow(0 0 12px ${ACCENT}88)` }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            left: (SMALL_END + BIG_END) / 2,
            top: CONNECT_Y,
            transform: `translate(-50%, -50%) translateY(${interpolate(bracketTextIn, [0, 1], [16, 0])}px)`,
            opacity: bracketTextIn,
            padding: "18px 40px",
            borderRadius: 999,
            background: ACCENT,
            fontFamily,
            fontWeight: 800,
            fontSize: FONT.label,
            color: INK,
            whiteSpace: "nowrap",
            boxShadow: `0 0 50px ${ACCENT}77`,
          }}
        >
          {bracketText}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
