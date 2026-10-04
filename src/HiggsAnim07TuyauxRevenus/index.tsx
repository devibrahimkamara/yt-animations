import { useLayoutEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgs/Stage";
import { Emoji } from "../higgs/Emoji";
import { ACCENT, WARM, INK, YT_RED, IG_PINK, FONT, ICON } from "../higgs/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const higgsAnim07Schema = z.object({
  finalValue: z.number().default(4200),
  suffix: z.string().default(" €"),
});

export type HiggsAnim07Props = z.infer<typeof higgsAnim07Schema>;

const YT_PATH = "M 600 220 Q 600 520 960 680";
const IG_PATH = "M 1320 220 Q 1320 520 960 680";
const CONV = { x: 960, y: 680 };

const LIFE = 34;
const YT_SPAWNS = [20, 32, 44, 56, 68, 80, 92];
const IG_SPAWNS = [26, 38, 50, 62, 74, 86, 98];

// tous les instants d'arrivée, triés
const ARRIVALS = [...YT_SPAWNS, ...IG_SPAWNS].map((f) => f + LIFE).sort((a, b) => a - b);
const WEIGHTS = ARRIVALS.map((_, k) => 1 + k * 0.18);
const WSUM = WEIGHTS.reduce((a, b) => a + b, 0);

export const HiggsAnim07TuyauxRevenus: React.FC<HiggsAnim07Props> = ({ finalValue, suffix }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ytRef = useRef<SVGPathElement>(null);
  const igRef = useRef<SVGPathElement>(null);
  const [handle] = useState(() => delayRender("Measuring revenue tubes"));
  const [lens, setLens] = useState<{ yt: number; ig: number } | null>(null);

  useLayoutEffect(() => {
    if (!ytRef.current || !igRef.current || lens) return;
    setLens({ yt: ytRef.current.getTotalLength(), ig: igRef.current.getTotalLength() });
  }, [lens]);
  useLayoutEffect(() => {
    if (lens) continueRender(handle);
  }, [lens, handle]);

  const iconSpring = spring({ frame, fps, config: { damping: 13, stiffness: 180 } });

  const drawT = interpolate(frame, [4, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // valeur du compteur = somme pondérée des arrivées déjà survenues
  const arrivedCount = ARRIVALS.filter((a) => a <= frame).length;
  const valueSoFar =
    arrivedCount === ARRIVALS.length
      ? finalValue
      : Math.round(
          (WEIGHTS.slice(0, arrivedCount).reduce((a, b) => a + b, 0) / WSUM) * finalValue,
        );

  const lastArrival = [...ARRIVALS].reverse().find((a) => a <= frame);
  const isFinal = lastArrival === ARRIVALS[ARRIVALS.length - 1];
  const tickSpring = lastArrival
    ? spring({ frame: frame - lastArrival, fps, config: { damping: isFinal ? 7 : 10, stiffness: 260 } })
    : 0;
  const tickScale = lastArrival
    ? interpolate(tickSpring, [0, 0.5, 1], [1, isFinal ? 1.22 : 1.1, 1], { extrapolateRight: "clamp" })
    : 1;

  const particle = (spawns: number[], ref: React.RefObject<SVGPathElement | null>, len?: number) =>
    spawns.map((f0, i) => {
      const p = (frame - f0) / LIFE;
      if (p < 0 || p > 1.05 || !ref.current || len == null) return null;
      const pos = ref.current.getPointAtLength(len * Math.min(1, p));
      const burst = interpolate(p, [0.92, 1, 1.05], [1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return (
        <circle
          key={`${f0}-${i}`}
          cx={pos.x}
          cy={pos.y}
          r={p > 0.92 ? 16 : 9}
          fill={INK}
          opacity={burst}
          style={{ filter: `drop-shadow(0 0 14px ${ACCENT})` }}
        />
      );
    });

  return (
    <Stage outFrames={12}>
      <AbsoluteFill>
        <svg width="1920" height="1080" style={{ position: "absolute" }}>
          <path ref={ytRef} d={YT_PATH} fill="none" stroke="#2b3242" strokeWidth={8} opacity={0.4} />
          <path ref={igRef} d={IG_PATH} fill="none" stroke="#2b3242" strokeWidth={8} opacity={0.4} />
          {lens && (
            <>
              <path
                d={YT_PATH}
                fill="none"
                stroke={YT_RED}
                strokeWidth={8}
                strokeLinecap="round"
                strokeDasharray={lens.yt}
                strokeDashoffset={lens.yt * (1 - drawT)}
                opacity={0.85}
              />
              <path
                d={IG_PATH}
                fill="none"
                stroke={IG_PINK}
                strokeWidth={8}
                strokeLinecap="round"
                strokeDasharray={lens.ig}
                strokeDashoffset={lens.ig * (1 - drawT)}
                opacity={0.85}
              />
            </>
          )}
          {particle(YT_SPAWNS, ytRef, lens?.yt)}
          {particle(IG_SPAWNS, igRef, lens?.ig)}
        </svg>

        {/* sources */}
        <div style={{ position: "absolute", left: 600, top: 190, transform: `translate(-50%,-50%) scale(${iconSpring})` }}>
          <Emoji size={ICON.lg}>▶️</Emoji>
        </div>
        <div style={{ position: "absolute", left: 1320, top: 190, transform: `translate(-50%,-50%) scale(${iconSpring})` }}>
          <Emoji size={ICON.lg}>📸</Emoji>
        </div>

        {/* compteur au point de convergence */}
        <div
          style={{
            position: "absolute",
            left: CONV.x,
            top: CONV.y + 110,
            transform: `translate(-50%, 0) scale(${tickScale})`,
            fontFamily,
            fontWeight: 800,
            fontSize: FONT.counter,
            color: WARM,
            whiteSpace: "nowrap",
            textShadow: `0 0 40px ${WARM}66`,
          }}
        >
          {valueSoFar.toLocaleString("fr-FR")}
          {suffix}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
