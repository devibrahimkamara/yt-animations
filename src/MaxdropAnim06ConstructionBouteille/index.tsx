import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../maxdrop/Stage";
import { AnimatedWord } from "../higgs/AnimatedLetter";
import { OBSTACLE, RAIL, INK } from "../maxdrop/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const maxdropAnim06Schema = z.object({
  labelText: z.string().default("COMPLÉMENTS ALIMENTAIRES"),
});
export type MaxdropAnim06Props = z.infer<typeof maxdropAnim06Schema>;

const CX = 960;
const BASE_Y = 800;
const BODY_W = 210;
const BODY_H = 470;
const CAP_W = 128;
const CAP_H = 62;

export const MaxdropAnim06ConstructionBouteille: React.FC<MaxdropAnim06Props> = ({ labelText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 — cercle initial
  const circleS = spring({ frame, fps, config: { damping: 180, stiffness: 280 } });

  // Phase 2 — étirement en cylindre
  const stretch = interpolate(frame, [24, 54], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const bodyH = interpolate(stretch, [0, 1], [BODY_W, BODY_H]);
  const bodyRadiusTop = interpolate(stretch, [0, 1], [BODY_W / 2, 30]);

  // Phase 3 — bouchon
  const capDrop = spring({ frame: frame - 54, fps, config: { damping: 12, stiffness: 320 } });
  const capY = interpolate(capDrop, [0, 1], [-80, 0], { extrapolateRight: "clamp" });
  const capOpacity = interpolate(frame, [54, 58], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 4 — étiquette qui s'enroule
  const labelWrap = interpolate(frame, [75, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const labelSkew = interpolate(labelWrap, [0, 1], [8, 0]);

  // Phase 5 — soulignement
  const underline = interpolate(frame, [172, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 6 — reflet lumineux
  const shine = interpolate(frame, [190, 215], [-0.4, 1.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bodyTop = BASE_Y - bodyH;
  const labelBandH = 150;
  const labelBandTop = bodyTop + bodyH / 2 - labelBandH / 2;

  return (
    <Stage outFrames={15}>
      <AbsoluteFill style={{ fontFamily }}>
        {/* corps (cercle → cylindre) */}
        <div
          style={{
            position: "absolute",
            left: CX - BODY_W / 2,
            top: bodyTop,
            width: BODY_W,
            height: bodyH,
            borderRadius: `${bodyRadiusTop}px ${bodyRadiusTop}px 26px 26px`,
            background: OBSTACLE,
            border: `2px solid ${RAIL}`,
            opacity: circleS,
          }}
        />

        {/* bouchon */}
        {frame >= 54 && (
          <div
            style={{
              position: "absolute",
              left: CX - CAP_W / 2,
              top: bodyTop - CAP_H + 6 + capY,
              width: CAP_W,
              height: CAP_H,
              borderRadius: 12,
              background: "#5A5A5C",
              opacity: capOpacity,
            }}
          />
        )}

        {/* étiquette */}
        {frame >= 75 && (
          <div
            style={{
              position: "absolute",
              left: CX - BODY_W / 2 - 8,
              top: labelBandTop,
              width: (BODY_W + 16) * labelWrap,
              height: labelBandH,
              background: INK,
              transform: `skewX(${labelSkew}deg)`,
              transformOrigin: "left center",
              overflow: "hidden",
              boxShadow: "inset 22px 0 26px rgba(0,0,0,0.22), inset -22px 0 26px rgba(0,0,0,0.22)",
            }}
          >
            {frame >= 120 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 6px",
                }}
              >
                {labelText.split(" ").map((wline, li) => (
                  <div key={li} style={{ whiteSpace: "nowrap", lineHeight: 1.15 }}>
                    <AnimatedWord
                      text={wline}
                      startDelay={120 + li * 8}
                      letterDelay={3}
                      fontFamily={fontFamily}
                      fontSize={26}
                      color="#1A1F28"
                      offsetY={5}
                    />
                  </div>
                ))}
                <div
                  style={{
                    marginTop: 4,
                    width: `${70 * underline}%`,
                    height: 3,
                    background: "#1A1F28",
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* reflet lumineux (Phase 6) */}
        {frame >= 190 && (
          <div
            style={{
              position: "absolute",
              left: CX - BODY_W / 2,
              top: bodyTop,
              width: BODY_W,
              height: bodyH,
              borderRadius: `${bodyRadiusTop}px ${bodyRadiusTop}px 26px 26px`,
              overflow: "hidden",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -40,
                left: `${shine * 100}%`,
                width: 90,
                height: bodyH + 80,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
                transform: "rotate(18deg)",
              }}
            />
          </div>
        )}
      </AbsoluteFill>
    </Stage>
  );
};
