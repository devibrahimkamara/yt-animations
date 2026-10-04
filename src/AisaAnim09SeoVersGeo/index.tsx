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
import {
  ACCENT,
  ACCENT_LIGHT,
  GLASS_BG,
  GLASS_BORDER,
  MONEY_GREEN,
  MUTED,
  SOFT,
  mulberry32,
} from "../aisa/theme";
import { Stage } from "../aisa/Stage";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});

// Anim 9 — « De SEO à GEO » (180 frames / 6 s @ 30 fps)
// Timeline brief conservée. Écarts : palette charte (ACCENT / MONEY_GREEN / aurora),
// tailles mobile-first (mot 300 px, sous-titre 60 px, années 40 px, légende 56 px),
// particules mulberry32 (pas de random()), aucune sortie animée.

export const aisaAnim09Schema = z.object({
  startWord: z.array(z.string()).default(["S", "E", "O"]),
  endWord: z.array(z.string()).default(["G", "E", "O"]),
  tagBefore: z.string().default("Référencement Google"),
  tagAfter: z.string().default("Référencement IA"),
  subtitle: z.string().default("Generative Engine Optimization"),
  years: z.array(z.string()).default(["2010", "2016", "2022", "2026"]),
});
export type AisaAnim09Props = z.infer<typeof aisaAnim09Schema>;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const TL_X0 = 260;
const TL_W = 1400;
const TL_Y = 760;
const LETTER_W = 250;
const LETTER_GAP = 10;
const WORD_FONT = 300;
const WORD_Y = 430;
const N_PART = 18;

const trackP = (frame: number) =>
  interpolate(frame, [62, 118], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });

export const AisaAnim09SeoVersGeo: React.FC<AisaAnim09Props> = ({
  startWord,
  endWord,
  tagBefore,
  tagAfter,
  subtitle,
  years,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const p = trackP(frame);
  const lineW = interpolate(frame, [6, 28], [0, TL_W], { ...clamp, easing: Easing.out(Easing.cubic) });
  const fillW = TL_W * p;
  const cursorX = TL_X0 + fillW;

  // Repères : apparition décalée de 5 frames, pop quand le curseur passe
  const marks = years.map((y, i) => {
    const frac = i / (years.length - 1);
    const x = TL_X0 + TL_W * frac;
    const appear = interpolate(frame, [14 + i * 5, 24 + i * 5], [0, 1], clamp);
    // frame de passage : première frame où p >= frac
    let hit = 62;
    if (i === 0) hit = 62;
    else for (let f = 62; f <= 118; f++) if (trackP(f) >= frac - 0.0001) { hit = f; break; }
    const since = frame - hit;
    const pop =
      i === 0 || since < 0 || since > 8
        ? 1
        : 1 + 0.4 * Math.sin((since / 8) * Math.PI);
    const reached = i === years.length - 1 ? frame >= hit : false;
    return { y, x, appear, pop, reached, hit };
  });
  const last = marks[marks.length - 1];
  const glowFlash = interpolate(frame, [118, 122, 130], [0, 1, 0], clamp);

  // Mot
  const wordIn = (i: number) => {
    const s = spring({ frame: frame - (20 + i * 4), fps, config: { damping: 14, stiffness: 100 } });
    return { o: interpolate(s, [0, 1], [0, 1]), y: interpolate(s, [0, 1], [24, 0]) };
  };
  const tagIn = wordIn(0);
  const float = (i: number) =>
    frame >= 44 ? Math.sin((frame + i * 9) / 10) * (frame < 158 ? 5 : 3) : 0;

  const sRot = interpolate(frame, [86, 96], [0, 90], { ...clamp, easing: Easing.in(Easing.cubic) });
  const gRot = interpolate(frame, [96, 106], [-90, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const grad = interpolate(frame, [90, 108], [0, 1], clamp);
  const tagMix = interpolate(frame, [90, 108], [0, 1], clamp);
  const breathe = 0.5 + 0.5 * Math.sin(frame / 8);
  const wordGlow = frame >= 108 ? 0.35 + 0.25 * breathe : 0;

  // Particules
  const rng = mulberry32(909);
  const parts = Array.from({ length: N_PART }, (_, i) => {
    const a = rng() * Math.PI * 2;
    const sp = 90 + rng() * 200;
    const size = 12 + rng() * 8;
    return { a, sp, size, c: i % 2 === 0 ? ACCENT : MONEY_GREEN };
  });
  const pt = interpolate(frame, [94, 110], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const pOp = interpolate(frame, [94, 110], [1, 0], clamp);

  // Sous-titre
  const typed = Math.round(interpolate(frame, [112, 146], [0, subtitle.length], clamp));
  const initials = new Set<number>();
  subtitle.split("").forEach((c, i) => {
    if (c !== " " && (i === 0 || subtitle[i - 1] === " ")) initials.add(i);
  });
  const subIn = interpolate(frame, [112, 118], [0, 1], clamp);

  const capP = interpolate(frame, [142, 158], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const bgIn = interpolate(frame, [0, 10], [0, 1], clamp);

  const wordLeft = 960 - (3 * LETTER_W + 2 * LETTER_GAP) / 2;
  const gradStyle = (i: number): React.CSSProperties => ({
    backgroundImage: `linear-gradient(90deg, ${ACCENT}, ${MONEY_GREEN})`,
    backgroundSize: `${3 * LETTER_W + 2 * LETTER_GAP}px 100%`,
    backgroundPosition: `${-i * (LETTER_W + LETTER_GAP)}px 0`,
    backgroundRepeat: "no-repeat",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: "transparent",
  });
  const letterBase: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: LETTER_W,
    textAlign: "center",
    fontSize: WORD_FONT,
    fontWeight: 800,
    lineHeight: 1,
    backfaceVisibility: "hidden",
  };

  return (
    <Stage outFrames={0}>
      <AbsoluteFill style={{ fontFamily, opacity: bgIn }}>
        {/* Étiquette d'époque */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 150,
            width: 1920,
            display: "flex",
            justifyContent: "center",
            opacity: tagIn.o,
            transform: `translateY(${tagIn.y}px)`,
          }}
        >
          <div style={{ position: "relative", height: 84, width: 640 }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 42,
                background: GLASS_BG,
                border: `2px solid ${GLASS_BORDER}`,
                color: SOFT,
                fontSize: 40,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 1 - tagMix,
              }}
            >
              {tagBefore}
            </div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 42,
                background: "rgba(48,96,255,0.22)",
                border: `3px solid ${ACCENT}`,
                color: "#fff",
                fontSize: 40,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: tagMix,
              }}
            >
              {tagAfter}
            </div>
          </div>
        </div>

        {/* Gros mot */}
        <div
          style={{
            position: "absolute",
            left: wordLeft,
            top: WORD_Y - WORD_FONT / 2 + 20,
            width: 3 * LETTER_W + 2 * LETTER_GAP,
            height: WORD_FONT,
            perspective: 1200,
            filter: `drop-shadow(0 0 40px rgba(48,96,255,${wordGlow}))`,
          }}
        >
          {[0, 1, 2].map((i) => {
            const w = wordIn(i);
            const isFirst = i === 0;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: i * (LETTER_W + LETTER_GAP),
                  top: 0,
                  width: LETTER_W,
                  height: WORD_FONT,
                  opacity: w.o,
                  transform: `translateY(${w.y + float(i)}px)`,
                }}
              >
                {isFirst ? (
                  <>
                    <div
                      style={{
                        ...letterBase,
                        color: SOFT,
                        opacity: frame < 96 ? 1 : 0,
                        transform: `rotateX(${sRot}deg)`,
                      }}
                    >
                      {startWord[0]}
                    </div>
                    <div
                      style={{
                        ...letterBase,
                        ...gradStyle(0),
                        opacity: frame >= 96 ? 1 : 0,
                        transform: `rotateX(${gRot}deg)`,
                      }}
                    >
                      {endWord[0]}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ ...letterBase, color: SOFT, opacity: 1 - grad }}>
                      {startWord[i]}
                    </div>
                    <div style={{ ...letterBase, ...gradStyle(i), opacity: grad }}>
                      {endWord[i]}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Particules */}
        {frame >= 94 &&
          parts.map((q, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: wordLeft + LETTER_W / 2 + Math.cos(q.a) * q.sp * pt - q.size / 2,
                top: WORD_Y + 20 + Math.sin(q.a) * q.sp * pt - q.size / 2,
                width: q.size,
                height: q.size,
                borderRadius: "50%",
                background: q.c,
                boxShadow: `0 0 16px ${q.c}`,
                opacity: pOp,
              }}
            />
          ))}

        {/* Sous-titre */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 585,
            width: 1920,
            textAlign: "center",
            fontSize: 60,
            fontWeight: 600,
            color: "#fff",
            height: 76,
            opacity: subIn,
            whiteSpace: "pre",
          }}
        >
          {subtitle.slice(0, typed).split("").map((c, i) =>
            initials.has(i) ? (
              <span key={i} style={{ color: MONEY_GREEN, fontWeight: 800 }}>
                {c}
              </span>
            ) : (
              <span key={i}>{c}</span>
            ),
          )}
        </div>

        {/* Timeline */}
        <div
          style={{
            position: "absolute",
            left: TL_X0,
            top: TL_Y - 4,
            width: lineW,
            height: 8,
            borderRadius: 4,
            background: "rgba(120,150,255,0.18)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: TL_X0,
            top: TL_Y - 4,
            width: fillW,
            height: 8,
            borderRadius: 4,
            background: `linear-gradient(90deg, ${MUTED}, ${ACCENT}, ${MONEY_GREEN})`,
            backgroundSize: `${TL_W}px 100%`,
            opacity: lineW > 0 ? 1 : 0,
          }}
        />
        {marks.map((m, i) => {
          const isLast = i === marks.length - 1;
          const w = isLast ? 8 : 5;
          const h = isLast ? 48 : 32;
          const green = isLast && m.reached;
          return (
            <div key={i} style={{ opacity: m.appear }}>
              <div
                style={{
                  position: "absolute",
                  left: m.x - w / 2,
                  top: TL_Y - h / 2,
                  width: w,
                  height: h,
                  borderRadius: 3,
                  background: isLast ? MONEY_GREEN : "rgba(199,206,230,0.45)",
                  transform: `scale(${m.pop})`,
                  boxShadow: green
                    ? `0 0 ${20 + 30 * glowFlash}px rgba(34,197,94,${0.5 + 0.5 * glowFlash})`
                    : "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: m.x - 100,
                  top: TL_Y + 44,
                  width: 200,
                  textAlign: "center",
                  fontSize: 40,
                  fontWeight: 700,
                  color: isLast && m.reached ? MONEY_GREEN : MUTED,
                  transform: `scale(${m.pop})`,
                }}
              >
                {m.y}
              </div>
            </div>
          );
        })}

        {/* Curseur */}
        <div
          style={{
            position: "absolute",
            left: cursorX - 18,
            top: TL_Y - 18,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#fff",
            opacity: lineW > 0 ? 1 : 0,
            boxShadow: `0 0 28px rgba(48,96,255,0.8), 0 0 ${40 * glowFlash}px ${MONEY_GREEN}`,
          }}
        />

        {/* Légende */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 935,
            width: 1920,
            textAlign: "center",
            fontSize: 56,
            fontWeight: 800,
            color: "#fff",
            opacity: capP,
            transform: `translateY(${(1 - capP) * 20}px)`,
          }}
        >
          Le nouveau référencement, c'est <span style={{ color: ACCENT_LIGHT }}>l'IA</span>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
