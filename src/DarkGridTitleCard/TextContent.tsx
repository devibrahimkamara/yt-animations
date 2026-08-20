import { loadFont as loadCormorant } from "@remotion/google-fonts/CormorantGaramond";
import { loadFont as loadDMSans } from "@remotion/google-fonts/DMSans";
import { loadFont as loadNunito } from "@remotion/google-fonts/Nunito";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadRaleway } from "@remotion/google-fonts/Raleway";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const fonts: Record<string, string> = {
  poppins: loadPoppins("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily,
  playfair: loadPlayfair("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily,
  cormorant: loadCormorant("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily,
  dmsans: loadDMSans("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily,
  nunito: loadNunito("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily,
  jakarta: loadJakarta("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily,
  raleway: loadRaleway("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily,
};

const EASING = Easing.bezier(0.16, 1, 0.3, 1);

function useSlideUp(startFrame: number, durationFrames = 20) {
  const frame = useCurrentFrame();
  const progress = frame - startFrame;
  const opacity = interpolate(progress, [0, durationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASING,
  });
  const translateY = interpolate(progress, [0, durationFrames], [55, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASING,
  });
  return { opacity, transform: `translateY(${translateY}px)` };
}

export const TextContent: React.FC<{
  title: string;
  subtitle?: string;
  footer?: string;
  fontKey?: string;
}> = ({ title, subtitle, footer, fontKey = "jakarta" }) => {
  const { fps } = useVideoConfig();
  const titleStyle = useSlideUp(0, Math.round(fps * 1.5));
  const subtitleStyle = useSlideUp(20, Math.round(fps * 1.5));
  const footerStyle = useSlideUp(35, Math.round(fps * 1.0));

  const fontFamily = fonts[fontKey] ?? fonts.poppins;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 140px",
        gap: 24,
      }}
    >
      <div
        style={{
          ...titleStyle,
          fontSize: 128,
          fontWeight: 700,
          fontFamily,
          letterSpacing: "-0.01em",
          textAlign: "center",
          lineHeight: 1.1,
          background: "linear-gradient(180deg, #a8c4ff 0%, #ffffff 55%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {title}
      </div>

      {subtitle && (
        <Sequence from={20} layout="none">
          <div
            style={{
              ...subtitleStyle,
              color: "rgba(180, 205, 255, 0.75)",
              fontSize: 44,
              fontWeight: 400,
              fontFamily,
              letterSpacing: "0.06em",
              textAlign: "center",
            }}
          >
            {subtitle}
          </div>
        </Sequence>
      )}

      {footer && (
        <Sequence from={35} layout="none">
          <div
            style={{
              ...footerStyle,
              position: "absolute",
              bottom: 40,
              left: 0,
              right: 0,
              textAlign: "center",
              color: "rgba(255,255,255,0.3)",
              fontSize: 18,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontFamily,
              fontWeight: 400,
            }}
          >
            {footer}
          </div>
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
