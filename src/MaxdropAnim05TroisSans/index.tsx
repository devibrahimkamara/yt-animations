import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../maxdrop/Stage";
import { Fragmentize, DriftBias } from "../maxdrop/Fragmentize";
import { OBSTACLE, STRIKE, GROWTH, GROWTH_GLOW, FONT } from "../maxdrop/theme";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });

export const maxdropAnim05Schema = z.object({
  items: z
    .array(z.object({ icon: z.enum(["factory", "warehouse", "cash"]), text: z.string() }))
    .default([
      { icon: "factory", text: "Sans usine" },
      { icon: "warehouse", text: "Sans stock" },
      { icon: "cash", text: "Sans gros budget" },
    ]),
});
export type MaxdropAnim05Props = z.infer<typeof maxdropAnim05Schema>;

const XS = [560, 960, 1360];
const ICON_Y = 360;
const ICON_S = 210;
const BASE = [30, 120, 210];
const DRIFT: DriftBias[] = ["center", "right", "left"];

const IconShape: React.FC<{ kind: string; color: string }> = ({ kind, color }) => {
  if (kind === "factory")
    return (
      <svg width={ICON_S} height={ICON_S} viewBox="0 0 100 100">
        <path d="M10 90 V45 L35 60 V45 L60 60 V38 L90 38 V90 Z" fill={color} />
        <rect x={20} y={20} width={10} height={26} fill={color} />
        <rect x={38} y={26} width={10} height={20} fill={color} />
      </svg>
    );
  if (kind === "warehouse")
    return (
      <svg width={ICON_S} height={ICON_S} viewBox="0 0 100 100">
        <path d="M10 90 V40 L50 15 L90 40 V90 Z" fill={color} />
        <rect x={38} y={58} width={24} height={32} fill="#0D1330" opacity={0.5} />
      </svg>
    );
  return (
    <svg width={ICON_S} height={ICON_S} viewBox="0 0 100 100">
      <rect x={14} y={54} width={72} height={22} rx={4} fill={color} />
      <rect x={20} y={40} width={72} height={22} rx={4} fill={color} opacity={0.85} />
      <rect x={26} y={26} width={72} height={22} rx={4} fill={color} opacity={0.7} />
    </svg>
  );
};

const Block: React.FC<{
  x: number;
  base: number;
  kind: string;
  text: string;
  drift: DriftBias;
  seed: number;
}> = ({ x, base, kind, text, drift, seed }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appear = spring({ frame: frame - (seed - 1) * 8, fps, config: { damping: 16, stiffness: 150 } });
  const appearScale = interpolate(appear, [0, 1], [0.85, 1]);

  const crackStart = base;
  const fallStart = base + 24;
  const textStart = base + 60;

  // fissure zigzag qui se dessine
  const crackP = interpolate(frame, [crackStart, crackStart + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tremble =
    frame >= crackStart && frame < fallStart
      ? Math.sin(frame * 3) * 2
      : 0;

  const broken = frame >= fallStart;

  const textP = spring({ frame: frame - textStart, fps, config: { damping: 200, stiffness: 100 } });
  const textY = interpolate(textP, [0, 1], [15, 0]);

  const zigLen = 200;

  return (
    <>
      {!broken && (
        <div
          style={{
            position: "absolute",
            left: x - ICON_S / 2 + tremble,
            top: ICON_Y,
            opacity: appear,
            transform: `scale(${appearScale})`,
            transformOrigin: "center bottom",
          }}
        >
          <IconShape kind={kind} color={OBSTACLE} />
          <svg
            width={ICON_S}
            height={ICON_S}
            style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
          >
            <path
              d={`M 40 40 l 26 34 l -20 26 l 30 40 l -16 30`}
              fill="none"
              stroke={STRIKE}
              strokeWidth={3}
              strokeDasharray={zigLen}
              strokeDashoffset={zigLen * (1 - crackP)}
            />
          </svg>
        </div>
      )}
      {broken && (
        <Fragmentize
          x={x - ICON_S / 2}
          y={ICON_Y}
          width={ICON_S}
          height={ICON_S}
          color={OBSTACLE}
          startFrame={fallStart}
          seed={seed}
          driftBias={drift}
          cols={6}
          rows={6}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: x - 200,
          top: ICON_Y + ICON_S / 2 - 30,
          width: 400,
          textAlign: "center",
          fontFamily,
          fontWeight: 800,
          fontSize: FONT.label,
          color: GROWTH,
          opacity: textP,
          transform: `translateY(${textY}px)`,
        }}
      >
        {text}
      </div>
    </>
  );
};

export const MaxdropAnim05TroisSans: React.FC<MaxdropAnim05Props> = ({ items }) => {
  const frame = useCurrentFrame();
  const finalGlow = interpolate(frame, [300, 310, 320], [0, 0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage outFrames={2}>
      <AbsoluteFill style={{ fontFamily }}>
        {items.map((it, i) => (
          <Block
            key={i}
            x={XS[i]}
            base={BASE[i]}
            kind={it.icon}
            text={it.text}
            drift={DRIFT[i]}
            seed={i + 1}
          />
        ))}
        {finalGlow > 0 && (
          <AbsoluteFill
            style={{
              pointerEvents: "none",
              boxShadow: `inset 0 0 200px ${GROWTH_GLOW}`,
              opacity: finalGlow,
            }}
          />
        )}
      </AbsoluteFill>
    </Stage>
  );
};
