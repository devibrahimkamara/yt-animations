import { useState } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { ShockRing } from "../higgsAdobe/ShockRing";
import { prMark } from "../higgsAdobe/vector";
import { AI_TO, INK, FONT, ATMOS_PANEL_BG, atmosPanelBorder } from "../higgsAdobe/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const higgsAdobeAnim09Schema = z.object({
  premiereLogo: z.string().default("higgs-adobe/premiere-pro.png"),
  pluginLabel: z.string().default("PLUGIN IA"),
});
export type HiggsAdobeAnim09Props = z.infer<typeof higgsAdobeAnim09Schema>;

const Y = 540;
const CARD = 300;

const cardBase: React.CSSProperties = {
  position: "absolute",
  top: Y,
  width: CARD,
  height: CARD,
  transform: "translate(-50%, -50%)",
  borderRadius: 24,
  background: ATMOS_PANEL_BG,
  border: `2px solid ${atmosPanelBorder(0.3)}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
};

export const HiggsAdobeAnim09StackAssemblage: React.FC<HiggsAdobeAnim09Props> = ({
  premiereLogo,
  pluginLabel,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const [prSrc, setPrSrc] = useState<string>(staticFile(premiereLogo));

  // Phase 1 — entrées
  const enterS = spring({ frame, fps, config: { damping: 12, stiffness: 140, mass: 0.7 } });
  const leftX = interpolate(enterS, [0, 1], [-200, 700], { extrapolateRight: "clamp" });
  const rightX = interpolate(enterS, [0, 1], [2120, 1220], { extrapolateRight: "clamp" });
  const enterOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 2 — "+"
  const plusS = spring({ frame: frame - 24, fps, config: { damping: 10, stiffness: 280 } });
  const plusScaleIn = interpolate(plusS, [0, 0.7, 1], [0, 1.15, 1], { extrapolateRight: "clamp" });
  const plusOpacityIn = interpolate(frame, [24, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 3 — flottement
  const floatL = Math.sin(frame * 0.08) * 3;
  const floatR = Math.sin(frame * 0.08 + 2) * 3;

  // Phase 4 — fusion (81 → 111)
  const fuseP = interpolate(frame, [81, 111], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const fLeftX = interpolate(fuseP, [0, 1], [700, 960]);
  const fRightX = interpolate(fuseP, [0, 1], [1220, 960]);
  const plusShrink = interpolate(frame, [81, 96], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const separatedOpacity = interpolate(frame, [105, 111], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fusedOpacity = interpolate(frame, [105, 111], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const badgeGlow = interpolate(Math.sin((frame / 45) * Math.PI * 2), [-1, 1], [0.2, 0.35]);

  const outT = interpolate(frame, [160, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  const prImg = (
    <Img
      src={prSrc}
      onError={() => setPrSrc(prMark())}
      style={{ width: CARD * 0.62, height: CARD * 0.62, objectFit: "contain" }}
    />
  );
  const pluginContent = (
    <div
      style={{
        fontFamily,
        fontWeight: 800,
        fontSize: FONT.micro * 0.9,
        color: AI_TO,
        textAlign: "center",
        letterSpacing: "1px",
        padding: 12,
      }}
    >
      {pluginLabel}
    </div>
  );

  return (
    <AbsoluteFill style={{ opacity: 1 - outT }}>
      {/* état séparé */}
      <AbsoluteFill style={{ opacity: separatedOpacity }}>
        <div
          style={{
            ...cardBase,
            left: frame < 81 ? leftX : fLeftX,
            opacity: enterOpacity,
            transform: `translate(-50%, calc(-50% + ${frame < 81 ? floatL : 0}px))`,
          }}
        >
          {prImg}
        </div>
        <div
          style={{
            ...cardBase,
            left: frame < 81 ? rightX : fRightX,
            opacity: enterOpacity,
            transform: `translate(-50%, calc(-50% + ${frame < 81 ? floatR : 0}px))`,
          }}
        >
          {pluginContent}
        </div>
        {/* "+" */}
        <div
          style={{
            position: "absolute",
            left: 960,
            top: Y,
            transform: `translate(-50%, -50%) scale(${plusScaleIn * plusShrink})`,
            opacity: plusOpacityIn * plusShrink,
            fontFamily,
            fontWeight: 800,
            fontSize: FONT.label,
            color: INK,
            textShadow: "0 4px 20px rgba(0,0,0,0.7)",
          }}
        >
          +
        </div>
      </AbsoluteFill>

      {/* badge fusionné */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: Y,
          transform: "translate(-50%, -50%)",
          width: CARD * 2 + 40,
          height: CARD + 20,
          borderRadius: 28,
          background: ATMOS_PANEL_BG,
          border: `3px solid ${AI_TO}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
          opacity: fusedOpacity,
          boxShadow: `0 0 80px ${AI_TO}${Math.round(badgeGlow * 255).toString(16).padStart(2, "0")}`,
        }}
      >
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>{prImg}</div>
        <div style={{ width: 2, height: CARD * 0.6, background: atmosPanelBorder(0.4) }} />
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>{pluginContent}</div>
      </div>

      {/* anneaux de choc à l'impact */}
      <ShockRing startFrame={105} durationInFrames={15} cx={960} cy={Y} fromScale={0.3} toScale={2.5} color={INK} />
      <ShockRing startFrame={110} durationInFrames={12} cx={960} cy={Y} fromScale={0.3} toScale={1.8} color={AI_TO} strokeWidth={3} />
    </AbsoluteFill>
  );
};
