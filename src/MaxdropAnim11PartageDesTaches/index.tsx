import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../maxdrop/Stage";
import { CARD_BG, RAIL, INK, TEXT_DIM, GROWTH, STAMP_BLUE, FONT } from "../maxdrop/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const maxdropAnim11Schema = z.object({
  leftLabel: z.string().default("TOI"),
  rightLabel: z.string().default("MAX DROPSHIPPING"),
  cards: z
    .array(z.object({ label: z.string(), side: z.enum(["left", "right"]) }))
    .default([
      { label: "Logo", side: "left" },
      { label: "Certifications", side: "right" },
      { label: "Branding", side: "left" },
      { label: "Fabrication", side: "right" },
      { label: "Site internet", side: "left" },
      { label: "Packaging", side: "right" },
      { label: "Marketing", side: "left" },
      { label: "Logistique", side: "right" },
    ]),
  leftFootnote: z.string().default("Ce que tu contrôles"),
  rightFootnote: z.string().default("Ce qu'ils gèrent pour toi"),
});
export type MaxdropAnim11Props = z.infer<typeof maxdropAnim11Schema>;

const DECK = { x: 960, y: 430 };
const PILE = { left: { x: 520, y: 540 }, right: { x: 1400, y: 540 } };
const CARD_W = 240;
const CARD_H = 150;
const STEP = 39;

const Card: React.FC<{
  index: number;
  label: string;
  side: "left" | "right";
  stackPos: number;
}> = ({ index, label, side, stackPos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = 36 + index * STEP;
  const f = frame - start;

  const deckIn = spring({ frame: frame - index * 2, fps, config: { damping: 18, stiffness: 140 } });

  if (f < 0) {
    // encore dans le deck
    const sc = interpolate(deckIn, [0, 1], [0.85, 1]);
    return (
      <div
        style={{
          position: "absolute",
          left: DECK.x - CARD_W / 2,
          top: DECK.y - CARD_H / 2 - index * 3,
          width: CARD_W,
          height: CARD_H,
          borderRadius: 14,
          background: CARD_BG,
          border: `2px solid ${RAIL}`,
          transform: `rotate(${(index - 4) * 1.5}deg) scale(${sc})`,
          opacity: deckIn,
        }}
      />
    );
  }

  const p = spring({ frame: f, fps, config: { damping: 16, stiffness: 90 } });
  const dest = PILE[side];
  const x = interpolate(p, [0, 1], [DECK.x, dest.x]);
  const y = interpolate(p, [0, 1], [DECK.y, dest.y + stackPos * -4]);
  const flip = interpolate(p, [0, 1], [0, 180]);
  const landRot = interpolate(p, [0.8, 1], [0, (index % 2 === 0 ? 1 : -1) * 5], { extrapolateLeft: "clamp" });
  const faceUp = p > 0.5;
  const accent = side === "left" ? GROWTH : STAMP_BLUE;

  return (
    <div
      style={{
        position: "absolute",
        left: x - CARD_W / 2,
        top: y - CARD_H / 2,
        width: CARD_W,
        height: CARD_H,
        transform: `rotate(${landRot}deg) perspective(900px) rotateY(${flip}deg)`,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 14,
          background: CARD_BG,
          border: `2px solid ${faceUp ? accent : RAIL}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: FONT.micro * 0.7,
          fontWeight: 800,
          color: INK,
          transform: faceUp ? "rotateY(180deg)" : "none",
        }}
      >
        {faceUp ? label : ""}
      </div>
    </div>
  );
};

export const MaxdropAnim11PartageDesTaches: React.FC<MaxdropAnim11Props> = ({
  leftLabel,
  rightLabel,
  cards,
  leftFootnote,
  rightFootnote,
}) => {
  const frame = useCurrentFrame();

  const zonesIn = interpolate(frame, [30, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const countIn = interpolate(frame, [348, 366], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const rebal = interpolate(frame, [372, 410], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const leftScale = interpolate(rebal, [0, 1], [1, 1.15]);
  const rightScale = interpolate(rebal, [0, 1], [1, 0.85]);
  const rightOpacity = interpolate(rebal, [0, 1], [1, 0.7]);
  const footIn = interpolate(frame, [376, 400], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  let leftCount = 0;
  let rightCount = 0;

  return (
    <Stage outFrames={12}>
      <AbsoluteFill style={{ fontFamily }}>
        {/* zones de destination */}
        {(["left", "right"] as const).map((side) => {
          const p = PILE[side];
          const accent = side === "left" ? GROWTH : STAMP_BLUE;
          const sc = side === "left" ? leftScale : rightScale;
          const op = side === "left" ? 1 : rightOpacity;
          return (
            <div
              key={side}
              style={{
                position: "absolute",
                left: p.x - 200,
                top: p.y - 200,
                width: 400,
                height: 400,
                borderRadius: 20,
                background: `${accent}0d`,
                border: `2px solid ${accent}55`,
                opacity: zonesIn * op,
                transform: `scale(${sc})`,
                transformOrigin: "center",
              }}
            />
          );
        })}

        {/* labels de zone */}
        <div style={{ position: "absolute", left: PILE.left.x - 300, top: PILE.left.y - 300, width: 600, textAlign: "center", fontSize: FONT.micro, fontWeight: 800, color: INK, opacity: zonesIn }}>
          {leftLabel}
        </div>
        <div style={{ position: "absolute", left: PILE.right.x - 300, top: PILE.right.y - 300, width: 600, textAlign: "center", fontSize: FONT.micro * 0.8, fontWeight: 800, color: INK, opacity: zonesIn * rightOpacity }}>
          {rightLabel}
        </div>

        {/* cartes */}
        {cards.map((c, i) => {
          const stackPos = c.side === "left" ? leftCount++ : rightCount++;
          const started = frame >= 36 + i * STEP;
          const sp = started ? stackPos : 0;
          return <Card key={i} index={i} label={c.label} side={c.side} stackPos={sp} />;
        })}

        {/* compteurs */}
        <div style={{ position: "absolute", left: PILE.left.x - 100, top: PILE.left.y + 220, width: 200, textAlign: "center", fontSize: FONT.value, fontWeight: 800, color: GROWTH, opacity: countIn }}>
          {cards.filter((c) => c.side === "left").length}
        </div>
        <div style={{ position: "absolute", left: PILE.right.x - 100, top: PILE.right.y + 220, width: 200, textAlign: "center", fontSize: FONT.value, fontWeight: 800, color: STAMP_BLUE, opacity: countIn * rightOpacity }}>
          {cards.filter((c) => c.side === "right").length}
        </div>

        {/* footnotes de clarification */}
        <div style={{ position: "absolute", left: PILE.left.x - 250, top: PILE.left.y + 300, width: 500, textAlign: "center", fontSize: FONT.micro * 0.7, fontWeight: 700, color: TEXT_DIM, opacity: footIn }}>
          {leftFootnote}
        </div>
        <div style={{ position: "absolute", left: PILE.right.x - 250, top: PILE.right.y + 300, width: 500, textAlign: "center", fontSize: FONT.micro * 0.7, fontWeight: 700, color: TEXT_DIM, opacity: footIn }}>
          {rightFootnote}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
