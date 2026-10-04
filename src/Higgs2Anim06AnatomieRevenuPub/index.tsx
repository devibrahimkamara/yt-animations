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
import { Stage } from "../higgs2/Stage";
import { ACCENT, INK, AD_YELLOW, COIN_GOLD, FONT } from "../higgs2/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const higgs2Anim06Schema = z.object({
  finalEuros: z.number().default(8),
  finalCaption: z.string().default("1 000 vues"),
});

export type Higgs2Anim06Props = z.infer<typeof higgs2Anim06Schema>;

const PLAYER = { x: 480, y: 110, w: 960, h: 540 };
const COUNTER = { x: 960, y: 880 };

type CycleCfg = {
  start: number;
  bannerDur: number;
  progDur: number;
  fallDur: number;
  fromX: number;
  fromY: number;
  curveX: number;
  extraCoin?: boolean;
};

const CYCLES: CycleCfg[] = [
  { start: 21, bannerDur: 12, progDur: 15, fallDur: 18, fromX: PLAYER.x + PLAYER.w - 40, fromY: PLAYER.y + PLAYER.h, curveX: -120 },
  { start: 69, bannerDur: 8, progDur: 10, fallDur: 14, fromX: PLAYER.x + 40, fromY: PLAYER.y + PLAYER.h, curveX: 140 },
  { start: 108, bannerDur: 6, progDur: 8, fallDur: 12, fromX: PLAYER.x + PLAYER.w / 2, fromY: PLAYER.y + PLAYER.h, curveX: 40, extraCoin: true },
];

const quad = (a: number, c: number, b: number, t: number) =>
  (1 - t) * (1 - t) * a + 2 * (1 - t) * t * c + t * t * b;

export const Higgs2Anim06AnatomieRevenuPub: React.FC<Higgs2Anim06Props> = ({
  finalEuros,
  finalCaption,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const playerSpring = spring({ frame, fps, config: { damping: 15, stiffness: 140 } });
  const counterSpring = spring({ frame: frame - 5, fps, config: { damping: 15, stiffness: 140 } });

  const impacts = CYCLES.map((c) => c.start + c.bannerDur + c.progDur + c.fallDur);

  // valeur du compteur : +1 par impact, puis montée finale
  let counterValue = impacts.filter((f) => frame >= f).length;
  if (frame >= 141) {
    counterValue = Math.round(
      interpolate(frame, [141, 181], [3, finalEuros], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    );
  }

  // flash + scale du compteur à chaque impact
  let counterScale = 1;
  impacts.forEach((f) => {
    const s = spring({ frame: frame - f, fps, config: { damping: 8, stiffness: 280 } });
    if (frame >= f && frame < f + 14) {
      counterScale *= interpolate(s, [0, 0.5, 1], [1, 1.08, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }
  });
  const finalScale = interpolate(frame, [141, 160], [1, 1.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glowBreath = frame >= 189 ? 1 + Math.sin(frame / 20) * 0.2 : 1;

  return (
    <Stage outFrames={25}>
      <AbsoluteFill>
        {/* Player YouTube */}
        <div
          style={{
            position: "absolute",
            left: PLAYER.x,
            top: PLAYER.y,
            width: PLAYER.w,
            height: PLAYER.h,
            opacity: playerSpring,
            transform: `scale(${interpolate(playerSpring, [0, 1], [0.95, 1], { extrapolateRight: "clamp" })})`,
            background: "#0F0F0F",
            border: "2px solid #3A3A3C",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(120deg, #1a1a1a, #0b0b0b)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 180,
              opacity: 0.5,
            }}
          >
            ▶
          </div>
          {/* barre de contrôle */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 48, background: "rgba(0,0,0,0.6)" }} />

          {CYCLES.map((c, i) => {
            const bannerY = interpolate(frame, [c.start, c.start + c.bannerDur], [-30, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });
            const impact = impacts[i];
            const bannerOpacity = interpolate(frame, [impact, impact + 4], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const progStart = c.start + c.bannerDur;
            const progW = interpolate(frame, [progStart, progStart + c.progDur], [0, 100], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const active = frame >= c.start && frame < impact + 4;
            if (!active) return null;
            return (
              <div key={i}>
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    padding: "14px 24px",
                    transform: `translateY(${bannerY}px)`,
                    opacity: bannerOpacity,
                    background: "rgba(0,0,0,0.72)",
                    color: INK,
                    fontFamily,
                    fontWeight: 800,
                    fontSize: FONT.micro,
                  }}
                >
                  Publicité
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: 48,
                    left: 0,
                    height: 12,
                    width: `${progW}%`,
                    background: AD_YELLOW,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Pièces */}
        {CYCLES.flatMap((c, i) => {
          const impact = impacts[i];
          const fallStart = c.start + c.bannerDur + c.progDur;
          const coinIndexes = c.extraCoin ? [0, 1] : [0];
          return coinIndexes.map((ci) => {
            const off = ci * 4;
            const t = interpolate(frame, [fallStart + off, impact + off], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            if (frame < fallStart + off || frame > impact + off + 2) return null;
            const yEase = Easing.in(Easing.quad)(t);
            const x = quad(c.fromX + ci * 30, c.fromX + c.curveX, COUNTER.x, t);
            const y = c.fromY + (COUNTER.y - c.fromY) * yEase;
            const rot = t * (360 + i * 90);
            return (
              <div
                key={`${i}-${ci}`}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  width: 76,
                  height: 76,
                  marginLeft: -38,
                  marginTop: -38,
                  borderRadius: "50%",
                  background: `radial-gradient(circle at 35% 30%, #fff3b0, ${COIN_GOLD} 60%, #b8860b)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily,
                  fontWeight: 800,
                  fontSize: 40,
                  color: "#7a5c00",
                  transform: `rotate(${rot}deg)`,
                  boxShadow: `0 0 18px ${COIN_GOLD}88`,
                }}
              >
                €
              </div>
            );
          });
        })}

        {/* Compteur / porte-monnaie */}
        <div
          style={{
            position: "absolute",
            left: COUNTER.x,
            top: COUNTER.y,
            transform: `translate(-50%, -50%) scale(${counterSpring * counterScale * finalScale})`,
            padding: "30px 72px",
            borderRadius: 28,
            background: "#0F172A",
            border: `3px solid ${ACCENT}`,
            boxShadow: `0 0 ${56 * glowBreath}px ${ACCENT}66`,
            fontFamily,
            fontWeight: 800,
            fontSize: FONT.counter,
            color: INK,
            fontVariantNumeric: "tabular-nums",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span>{counterValue} €</span>
          {frame >= 141 && (
            <span style={{ fontSize: FONT.micro, fontWeight: 700, color: ACCENT }}>{finalCaption}</span>
          )}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
