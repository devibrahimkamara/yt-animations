import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../maxdrop/Stage";
import { GROWTH, GROWTH_GLOW, STRIKE, RAIL, INK, TEXT_DIM, FONT } from "../maxdrop/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const maxdropAnim17Schema = z.object({
  linkText: z.string().default("🔗 Max Dropshipping — lien en description"),
});
export type MaxdropAnim17Props = z.infer<typeof maxdropAnim17Schema>;

const WIN_W = 980;
const WIN_H = 640;
const WIN_X = 960 - WIN_W / 2;
const WIN_Y = 540 - WIN_H / 2;
const LINK_Y_IN_DESC = 250;

export const MaxdropAnim17CTAFinal: React.FC<MaxdropAnim17Props> = ({ linkText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const winIn = spring({ frame, fps, config: { damping: 200, stiffness: 100 } });
  const winScale = interpolate(winIn, [0, 1], [0.92, 1]);

  // curseur : apparition puis trajet diagonal
  const cursorOpacity = interpolate(frame, [36, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const moveP = interpolate(frame, [44, 81], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const scroll = interpolate(frame, [81, 111], [0, -30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const settleP = interpolate(frame, [111, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const linkAbsX = WIN_X + 60;
  const linkAbsY = WIN_Y + 120 + LINK_Y_IN_DESC + scroll;

  const cursorStartX = WIN_X + WIN_W - 60;
  const cursorStartY = WIN_Y + 60;
  const cursorTargetX = linkAbsX + 260;
  const cursorTargetY = linkAbsY + 34;
  const cursorX = interpolate(moveP, [0, 1], [cursorStartX, cursorTargetX]) + settleP * 0;
  const cursorY = interpolate(moveP, [0, 1], [cursorStartY, cursorTargetY]) + scroll * settleP;

  // survol / surbrillance
  const hover = interpolate(frame, [111, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // clic
  const clickS = spring({ frame: frame - 155, fps, config: { damping: 12, stiffness: 340 } });
  const clickScale = frame >= 155 ? interpolate(clickS, [0, 0.5, 1], [1, 0.96, 1], { extrapolateRight: "clamp" }) : 1;
  const haloP = interpolate(frame, [155, 175], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const haloScale = interpolate(haloP, [0, 1], [0, 2.5]);
  const haloOpacity = interpolate(haloP, [0, 1], [0.4, 0]);

  // flèche qui pulse
  const arrowIn = interpolate(frame, [125, 145], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arrowBob = Math.sin((frame / 25) * Math.PI * 2) * 5;

  return (
    <Stage outFrames={2}>
      <AbsoluteFill style={{ fontFamily }}>
        {/* fenêtre */}
        <div
          style={{
            position: "absolute",
            left: WIN_X,
            top: WIN_Y,
            width: WIN_W,
            height: WIN_H,
            borderRadius: 20,
            background: "#14181F",
            border: `2px solid ${RAIL}`,
            opacity: winIn,
            transform: `scale(${winScale})`,
            overflow: "hidden",
            boxShadow: "0 40px 120px rgba(0,0,0,0.55)",
          }}
        >
          {/* barre de titre */}
          <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: 60, display: "flex", alignItems: "center", gap: 16, padding: "0 28px", borderBottom: `1px solid ${RAIL}` }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: STRIKE }} />
            <div style={{ width: 340, height: 12, borderRadius: 6, background: RAIL }} />
          </div>

          {/* zone description (scrollable) */}
          <div style={{ position: "absolute", left: 0, top: 60, width: "100%", transform: `translateY(${scroll}px)` }}>
            <div style={{ padding: "48px 60px" }}>
              {[0.9, 0.75, 0.6, 0.82, 0.5].map((w, i) => (
                <div key={i} style={{ width: `${w * 100}%`, height: 14, borderRadius: 7, background: RAIL, marginBottom: 22 }} />
              ))}

              {/* lien épinglé */}
              <div
                style={{
                  marginTop: 20,
                  padding: "22px 26px",
                  borderRadius: 12,
                  border: `2px solid ${interpolate(hover, [0, 1], [0, 1]) > 0.5 ? GROWTH : "#3A4048"}`,
                  background: `rgba(34,197,94,${0.15 * hover})`,
                  color: hover > 0.5 ? INK : TEXT_DIM,
                  fontSize: FONT.micro * 0.8,
                  fontWeight: 800,
                  transform: `scale(${clickScale})`,
                  transformOrigin: "left center",
                  position: "relative",
                }}
              >
                {linkText}
                {/* halo de clic */}
                {frame >= 155 && frame < 178 && (
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      width: 120,
                      height: 120,
                      marginLeft: -60,
                      marginTop: -60,
                      borderRadius: "50%",
                      border: `4px solid ${GROWTH}`,
                      transform: `scale(${haloScale})`,
                      opacity: haloOpacity,
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* flèche descendante */}
        {frame >= 125 && (
          <div
            style={{
              position: "absolute",
              left: linkAbsX + 120,
              top: linkAbsY - 70 + arrowBob,
              opacity: arrowIn,
              fontSize: 54,
              color: GROWTH,
            }}
          >
            ▾
          </div>
        )}

        {/* curseur souris */}
        {frame >= 36 && (
          <svg
            width={40}
            height={44}
            viewBox="0 0 40 44"
            style={{ position: "absolute", left: cursorX, top: cursorY, opacity: cursorOpacity, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.6))" }}
          >
            <path d="M2 2 L2 34 L11 26 L17 40 L23 37 L17 23 L30 23 Z" fill={INK} stroke="#0B0F14" strokeWidth={2} />
          </svg>
        )}

        {/* glow du lien actif */}
        {hover > 0.5 && (
          <div
            style={{
              position: "absolute",
              left: linkAbsX - 10,
              top: linkAbsY - 10,
              width: 560,
              height: 90,
              borderRadius: 16,
              boxShadow: `0 0 60px ${GROWTH_GLOW}`,
              opacity: 0.5 * hover,
              pointerEvents: "none",
            }}
          />
        )}
      </AbsoluteFill>
    </Stage>
  );
};
