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
  GLASS_CARD,
  MONEY_GREEN,
  MUTED,
} from "../aisa/theme";
import { Stage } from "../aisa/Stage";
import { pathFromPoints, polylineLength, pointAtProgress } from "../aisa/utils";
import type { Pt } from "../aisa/utils";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});

// Anim 11 — « Transition vers mes statistiques » (120 frames / 4 s @ 30 fps)
// Timeline du brief conservée. Écarts : palette charte (GLASS_*, ACCENT, MONEY_GREEN),
// fenêtre 1300x700 centrée à y=560 (le brief la plaçait à y=500/760 de haut, ce qui
// chevauchait le titre "Mes vrais chiffres" à y=140) ; titre 84 px ; dashboard sans
// aucun chiffre ; wrapper zoomé positionné en `top:` ; flash final hors du wrapper.
// Stage outFrames=0 : le flash plein écran assure déjà la sortie.

export const aisaAnim11Schema = z.object({
  flashColor: z.string().default("#F5F7FF"),
  windowTitle: z.string().default("Tableau de bord"),
});
export type AisaAnim11Props = z.infer<typeof aisaAnim11Schema>;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const WX = 310;
const WY = 210;
const WW = 1300;
const WH = 700;
const HEIGHTS = [80, 120, 110, 170, 210, 260, 300, 360];
const BAR_W = 52;
const BAR_GAP = 24;
const CH_X = 50; // zone barres (coord. fenêtre)
const CH_BASE = 650; // ligne de base
const CURVE_X = 740;
const CURVE_Y = 300;
const CW = 480;
const CH = 300;

const CURVE: Pt[] = [
  { x: 0, y: 260 },
  { x: 50, y: 230 },
  { x: 100, y: 245 },
  { x: 160, y: 190 },
  { x: 215, y: 205 },
  { x: 270, y: 140 },
  { x: 330, y: 160 },
  { x: 385, y: 80 },
  { x: 430, y: 95 },
  { x: 480, y: 20 },
].map((p) => ({ x: p.x, y: p.y }));

export const AisaAnim11TransitionStatistiques: React.FC<AisaAnim11Props> = ({
  flashColor,
  windowTitle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgIn = interpolate(frame, [0, 8], [0, 1], clamp);
  const winSpring = spring({ frame: frame - 6, fps, config: { damping: 15, stiffness: 100 } });
  const winScale = interpolate(winSpring, [0, 1], [0.9, 1]);
  const winOp = interpolate(frame, [6, 20], [0, 1], clamp);

  const cardOp = interpolate(frame, [24, 36], [0, 1], clamp);
  const cardDy = interpolate(frame, [24, 36], [14, 0], clamp);
  const cardFill = interpolate(frame, [24, 36], [0, 1], clamp);

  const titleP = interpolate(frame, [24, 36], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const outerFade = 1 - interpolate(frame, [90, 100], [0, 1], clamp);

  const zoomP = interpolate(frame, [90, 114], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const zoom = 1 + 2 * zoomP;

  const flashOp = interpolate(frame, [106, 119], [0, 1], clamp);

  // Courbe
  const curveLen = polylineLength(CURVE);
  const curveP = interpolate(frame, [50, 80], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const tip = pointAtProgress(CURVE, curveP);
  const tipPulse = interpolate(frame, [80, 86, 92], [1, 1.7, 1], clamp);
  const areaOp = curveP * 0.15;
  const areaPath = `${pathFromPoints(CURVE)} L${CW},${CH} L0,${CH} Z`;

  const barFloat = (i: number) =>
    frame >= 80 ? Math.sin((frame - 80) / 6 + i * 0.8) * 3 : 0;

  const cards = [
    { x: 40, icon: "up" as const },
    { x: 344, icon: "spark" as const },
  ];

  return (
    <Stage outFrames={0}>
      <AbsoluteFill style={{ fontFamily, opacity: bgIn }}>
        {/* Conteneur zoomé */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1920,
            height: 1080,
            transformOrigin: `${WX + WW / 2}px ${WY + WH / 2}px`,
            transform: `scale(${zoom})`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: WX,
              top: WY,
              width: WW,
              height: WH,
              borderRadius: 28,
              background: GLASS_BG,
              border: `2px solid ${GLASS_BORDER}`,
              boxShadow: "0 40px 100px rgba(0,0,0,0.55)",
              opacity: winOp,
              transform: `scale(${winScale})`,
              overflow: "hidden",
            }}
          >
            {/* Barre du haut */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: WW,
                height: 64,
                borderBottom: `2px solid ${GLASS_BORDER}`,
                background: "rgba(35,44,77,0.45)",
              }}
            >
              {["#FF5F57", "#FEBC2E", "#28C840"].map((c, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: 28 + i * 30,
                    top: 25,
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    background: c,
                  }}
                />
              ))}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 16,
                  width: WW,
                  textAlign: "center",
                  fontSize: 28,
                  fontWeight: 600,
                  color: MUTED,
                }}
              >
                {windowTitle}
              </div>
            </div>

            {/* Cartes indicateurs */}
            {cards.map((c, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: c.x,
                  top: 90,
                  width: 280,
                  height: 110,
                  borderRadius: 18,
                  background: GLASS_CARD,
                  opacity: cardOp,
                  transform: `translateY(${cardDy}px)`,
                }}
              >
                <svg width={90} height={110} style={{ position: "absolute", left: 14, top: 0 }}>
                  {c.icon === "up" ? (
                    <path
                      d="M20 70 L45 42 L60 58 L80 32 M64 32 L80 32 L80 48"
                      fill="none"
                      stroke={MONEY_GREEN}
                      strokeWidth={7}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : (
                    <path
                      d="M45 25 L52 48 L75 55 L52 62 L45 85 L38 62 L15 55 L38 48 Z"
                      fill={ACCENT_LIGHT}
                    />
                  )}
                </svg>
                <div
                  style={{
                    position: "absolute",
                    left: 116,
                    top: 34,
                    width: 140 * (0.5 + 0.5 * cardFill) * (i === 0 ? 1 : 0.8),
                    height: 16,
                    borderRadius: 8,
                    background: "rgba(138,148,184,0.55)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: 116,
                    top: 62,
                    width: 140 * cardFill * (i === 0 ? 0.6 : 0.75),
                    height: 12,
                    borderRadius: 6,
                    background: "rgba(138,148,184,0.3)",
                  }}
                />
              </div>
            ))}

            {/* Barres */}
            <div style={{ position: "absolute", left: 0, top: 0, width: WW, height: WH }}>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: CH_X,
                    top: CH_BASE - 100 * i - 60,
                    width: 640,
                    height: 2,
                    background: "rgba(120,150,255,0.12)",
                  }}
                />
              ))}
              {HEIGHTS.map((h, i) => {
                const s = spring({ frame: frame - (32 + i * 3), fps, config: { damping: 13, stiffness: 110 } });
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: CH_X + 24 + i * (BAR_W + BAR_GAP),
                      top: CH_BASE - h - 60 + barFloat(i),
                      width: BAR_W,
                      height: h,
                      borderRadius: "10px 10px 0 0",
                      background: `linear-gradient(0deg, ${ACCENT}, ${MONEY_GREEN})`,
                      transformOrigin: "50% 100%",
                      transform: `scaleY(${Math.max(0, s)})`,
                    }}
                  />
                );
              })}
            </div>

            {/* Courbe */}
            <svg
              width={CW + 20}
              height={CH + 20}
              style={{ position: "absolute", left: CURVE_X, top: CURVE_Y, overflow: "visible" }}
            >
              <defs>
                <filter id="g11" x="-200%" y="-200%" width="500%" height="500%">
                  <feGaussianBlur stdDeviation="8" />
                </filter>
              </defs>
              <path d={areaPath} fill={MONEY_GREEN} opacity={areaOp} />
              <path
                d={pathFromPoints(CURVE)}
                fill="none"
                stroke={MONEY_GREEN}
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={curveLen}
                strokeDashoffset={curveLen * (1 - curveP)}
              />
              {frame >= 50 && (
                <g transform={`translate(${tip.x} ${tip.y}) scale(${tipPulse})`}>
                  <circle r={10} fill={MONEY_GREEN} filter="url(#g11)" />
                  <circle r={9} fill="#fff" />
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Titre (hors du conteneur zoomé) */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 78,
            width: 1920,
            textAlign: "center",
            fontSize: 84,
            fontWeight: 800,
            color: "#fff",
            opacity: titleP * outerFade,
            transform: `translateY(${(1 - titleP) * -16}px)`,
          }}
        >
          Mes <span style={{ color: MONEY_GREEN }}>vrais</span> chiffres
        </div>

        {/* Flash de raccord */}
        <AbsoluteFill style={{ background: flashColor, opacity: flashOp }} />
      </AbsoluteFill>
    </Stage>
  );
};
