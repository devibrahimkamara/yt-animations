import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../maxdrop/Stage";
import { SOBER_BG, SOBER_LINE, SOBER_NODE_BG, SOBER_TEXT, FONT } from "../maxdrop/theme";

// ⚠️ Anim volontairement HORS charte (sujet sensible) : gris / blanc cassé
// uniquement, aucun spring, aucune couleur d'accent, easing doux seulement.
const { fontFamily } = loadFont("normal", { weights: ["400", "700"], subsets: ["latin"] });

export const maxdropAnim08Schema = z.object({
  centerText: z.string().default("Pourquoi maintenant ?"),
  branches: z.array(z.string()).default(["Stress", "Fatigue", "Sommeil", "Santé mentale"]),
});
export type MaxdropAnim08Props = z.infer<typeof maxdropAnim08Schema>;

const CX = 960;
const CY = 470;
const DIST = 360;
const ANGLES = [138, 42, 222, 318];
const STARTS = [45, 111, 177, 243];

const breathe = (f: number, period: number, amp: number) =>
  1 + amp * Math.sin((f / period) * Math.PI * 2);

const Branch: React.FC<{ label: string; angle: number; start: number }> = ({ label, angle, start }) => {
  const frame = useCurrentFrame();
  const f = frame - start;
  if (f < 0) return null;

  const rad = (angle * Math.PI) / 180;
  const nx = CX + Math.cos(rad) * DIST;
  const ny = CY - Math.sin(rad) * DIST;

  const lineP = interpolate(f, [0, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const lx = CX + (nx - CX) * lineP;
  const ly = CY + (ny - CY) * lineP;

  const nodeOpacity = interpolate(f, [30, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const labelOpacity = interpolate(f, [45, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = f > 55 ? breathe(f - 55, 60, 0.03) : 1;

  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <line x1={CX} y1={CY} x2={lx} y2={ly} stroke={SOBER_LINE} strokeWidth={2} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: nx,
          top: ny,
          transform: `translate(-50%,-50%) scale(${scale})`,
        }}
      >
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: SOBER_NODE_BG,
            border: `2px solid ${SOBER_TEXT}`,
            opacity: nodeOpacity,
          }}
        />
      </div>
      {/* label placé radialement vers l'extérieur du centre */}
      <div
        style={{
          position: "absolute",
          left: CX + Math.cos(rad) * (DIST + 90),
          top: CY - Math.sin(rad) * (DIST + 90),
          transform: "translate(-50%,-50%)",
          whiteSpace: "nowrap",
          fontSize: FONT.micro * 0.9,
          fontWeight: 400,
          color: SOBER_TEXT,
          opacity: labelOpacity,
        }}
      >
        {label}
      </div>
    </>
  );
};

export const MaxdropAnim08CausesSobre: React.FC<MaxdropAnim08Props> = ({ centerText, branches }) => {
  const frame = useCurrentFrame();

  const circleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const textOpacity = interpolate(frame, [10, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const centerScale = frame > 45 ? breathe(frame - 45, 90, 0.02) : 1;

  return (
    <Stage bare background={SOBER_BG} outFrames={10}>
      <AbsoluteFill style={{ fontFamily }}>
        {ANGLES.map((a, i) => (
          <Branch key={i} label={branches[i]} angle={a} start={STARTS[i]} />
        ))}

        <div
          style={{
            position: "absolute",
            left: CX,
            top: CY,
            transform: `translate(-50%,-50%) scale(${centerScale})`,
          }}
        >
          <div
            style={{
              width: 300,
              height: 300,
              borderRadius: "50%",
              border: `2px solid ${SOBER_LINE}`,
              background: SOBER_NODE_BG,
              opacity: circleOpacity,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: 40,
            }}
          >
            <span style={{ fontSize: FONT.micro * 0.72, fontWeight: 400, color: SOBER_TEXT, opacity: textOpacity, lineHeight: 1.3 }}>
              {centerText}
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
