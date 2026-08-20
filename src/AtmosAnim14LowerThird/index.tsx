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
import { ATMOS_BLUE, ATMOS_BLUE_LIGHT, ATMOS_GOLD } from "../AtmosOverlay/theme";
import { AtmosBackground } from "../AtmosOverlay/AtmosBackground";

const { fontFamily } = loadFont("normal", { weights: ["400", "800"], subsets: ["latin"] });

export const atmosAnim14Schema = z.object({
  name: z.string().default("IBRAHIM KAMARA"),
  tagline: z.string().default("Business en ligne depuis 2020"),
  durationSecs: z.number().default(3),
});

export type AtmosAnim14Props = z.infer<typeof atmosAnim14Schema>;

export const AtmosAnim14LowerThird: React.FC<AtmosAnim14Props> = ({
  name,
  tagline,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrySpring = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.9, stiffness: 130 },
  });
  const entryX = interpolate(entrySpring, [0, 1], [-650, 0]);
  const exitX = interpolate(frame, [72, 90], [0, -650], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const translateX = frame < 72 ? entryX : exitX;

  const nameOpacity = interpolate(frame, [12, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const nameTranslateX = interpolate(frame, [12, 22], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const taglineOpacity = interpolate(frame, [24, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineTranslateY = interpolate(frame, [24, 34], [8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AtmosBackground />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 840,
          transform: `translateX(${translateX}px)`,
          display: "flex",
        }}
      >
        {/* Ligne d'accent gold */}
        <div style={{ width: 8, height: 150, background: ATMOS_GOLD }} />

        {/* Barre gradient */}
        <div
          style={{
            width: 680,
            height: 150,
            background: `linear-gradient(90deg, ${ATMOS_BLUE}, ${ATMOS_BLUE_LIGHT})`,
            borderRadius: "0 20px 20px 0",
            boxShadow: "0px 10px 30px rgba(0,0,0,0.4)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: 36,
          }}
        >
          <div
            style={{
              opacity: nameOpacity,
              transform: `translateX(${nameTranslateX}px)`,
              fontFamily,
              fontWeight: 800,
              fontSize: 54,
              letterSpacing: "0.5px",
              color: "#FFFFFF",
            }}
          >
            {name}
          </div>
          <div
            style={{
              marginTop: 8,
              opacity: taglineOpacity,
              transform: `translateY(${taglineTranslateY}px)`,
              fontFamily,
              fontWeight: 600,
              fontSize: 32,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            {tagline}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
