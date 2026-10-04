import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../higgsMarketing/Stage";
import { IconCoin, IconVideoClap, IconStar } from "../higgsMarketing/icons";
import { pathFromPoints, pointAtProgress, polylineLength, type Pt } from "../higgsMarketing/utils";
import { ACCENT, ACCENT_LIGHT, COIN_GOLD, FONT, ICON, INK } from "../higgsMarketing/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});

// Anim 3 — « Le circuit de l'argent » (210 frames / 7 s @ 30 fps)
// Phase 1 apparitions 0–30 · Phase 2 pièce Parent→Toi 30–90 ·
// Phase 3 pause 90–105 · Phase 4 vidéo Toi→Enfant 105–165 ·
// Phase 5 visage émerveillé 150–195 · Phase 6 maintien 195–210

export const higgsMarketingAnim03Schema = z.object({
  parentLabel: z.string().default("Parent"),
  selfLabel: z.string().default("Toi"),
  childLabel: z.string().default("Enfant"),
});
export type HiggsMarketingAnim03Props = z.infer<
  typeof higgsMarketingAnim03Schema
>;

const CY = 540;
const PARENT_X = 420;
const SELF_X = 960;
const CHILD_X = 1500;
const NODE_R = 90;

const pathParentSelf: Pt[] = Array.from({ length: 20 }, (_, i) => {
  const t = i / 19;
  return {
    x: PARENT_X + (SELF_X - PARENT_X) * t,
    y: CY - Math.sin(t * Math.PI) * 70,
  };
});
const pathSelfChild: Pt[] = Array.from({ length: 20 }, (_, i) => {
  const t = i / 19;
  return {
    x: SELF_X + (CHILD_X - SELF_X) * t,
    y: CY - Math.sin(t * Math.PI) * 70,
  };
});
const LEN1 = polylineLength(pathParentSelf);
const LEN2 = polylineLength(pathSelfChild);

const Node: React.FC<{
  x: number;
  cx?: string;
  label: string;
  delay: number;
  fps: number;
  accent?: boolean;
  children: React.ReactNode;
}> = ({ x, label, delay, fps, accent, children }) => {
  const frame = useCurrentFrame();
  const s = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 150 } });
  const scale = interpolate(s, [0, 1], [0, 1]);
  const opacity = interpolate(frame, [delay, delay + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: x - NODE_R,
        top: CY - NODE_R,
        width: NODE_R * 2,
        height: NODE_R * 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          width: NODE_R * 1.6,
          height: NODE_R * 1.6,
          borderRadius: "50%",
          background: accent
            ? `radial-gradient(circle at 35% 30%, ${ACCENT_LIGHT}, ${ACCENT})`
            : "rgba(255,255,255,0.08)",
          border: accent ? "none" : "2px solid rgba(255,255,255,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 64,
          boxShadow: accent ? `0 0 60px ${ACCENT}55` : "none",
        }}
      >
        {children}
      </div>
      <div style={{ fontSize: FONT.micro * 0.6, fontWeight: 700, color: INK }}>{label}</div>
    </div>
  );
};

export const HiggsMarketingAnim03CircuitArgent: React.FC<
  HiggsMarketingAnim03Props
> = ({ parentLabel, selfLabel, childLabel }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Trajet pièce
  const coinProgress = interpolate(frame, [30, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const coinPos = pointAtProgress(pathParentSelf, coinProgress);
  const coinActive = frame >= 30 && frame < 92;
  const coinImpactSpring = spring({ frame: frame - 85, fps, config: { damping: 10, stiffness: 200 } });
  const coinImpactScale = frame >= 85 ? interpolate(coinImpactSpring, [0, 1], [1, 1.4]) : 1;
  const coinFadeOut = interpolate(frame, [86, 92], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const selfPulse1 = spring({ frame: frame - 85, fps, config: { damping: 8, stiffness: 200 } });
  const selfScale1 = frame >= 85 && frame < 95 ? interpolate(selfPulse1, [0, 1], [1, 1.1]) : 1;

  // Trajet vidéo
  const videoProgress = interpolate(frame, [105, 160], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const videoPos = pointAtProgress(pathSelfChild, videoProgress);
  const videoActive = frame >= 105 && frame < 166;

  // Visage émerveillé
  const wonderCrossfade = interpolate(frame, [155, 175], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage outFrames={10}>
      <AbsoluteFill style={{ fontFamily }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <path
            d={pathFromPoints(pathParentSelf)}
            fill="none"
            stroke={COIN_GOLD}
            strokeWidth={4}
            strokeDasharray="10 10"
            style={{
              strokeDashoffset: LEN1 * (1 - interpolate(frame, [30, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })),
            }}
          />
          <path
            d={pathFromPoints(pathSelfChild)}
            fill="none"
            stroke={ACCENT_LIGHT}
            strokeWidth={4}
            strokeDasharray="10 10"
            style={{
              strokeDashoffset: LEN2 * (1 - interpolate(frame, [105, 145], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })),
            }}
          />
        </svg>

        <Node x={PARENT_X} label={parentLabel} delay={0} fps={fps}>
          🧑‍🦱
        </Node>
        <Node x={SELF_X} label={selfLabel} delay={9} fps={fps} accent>
          <div style={{ transform: `scale(${selfScale1})` }}>😎</div>
        </Node>
        <Node x={CHILD_X} label={childLabel} delay={18} fps={fps}>
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 1 - wonderCrossfade }}>
              🙂
            </div>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: wonderCrossfade }}>
              🤩
            </div>
          </div>
        </Node>

        {coinActive && (
          <div
            style={{
              position: "absolute",
              left: coinPos.x - 30,
              top: coinPos.y - 30 + Math.sin(frame * 0.3) * 6,
              opacity: coinFadeOut,
              transform: `scale(${coinImpactScale}) rotate(${frame * 12}deg)`,
            }}
          >
            <IconCoin size={ICON.sm * 0.6} color={COIN_GOLD} strokeWidth={4} />
          </div>
        )}

        {videoActive && (
          <div
            style={{
              position: "absolute",
              left: videoPos.x - 30,
              top: videoPos.y - 30 + Math.sin(frame * 0.3) * 6,
              transform: "scale(1)",
            }}
          >
            <IconVideoClap size={ICON.sm * 0.6} color={ACCENT_LIGHT} strokeWidth={4} />
          </div>
        )}

        {frame >= 165 &&
          [0, 1, 2, 3].map((i) => {
            const delay = 165 + i * 4;
            const s = spring({ frame: frame - delay, fps, config: { damping: 9, stiffness: 180 } });
            const angle = (i / 4) * Math.PI * 2;
            const r = 130;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: CHILD_X + Math.cos(angle) * r - 20,
                  top: CY - NODE_R - 40 + Math.sin(angle) * r * 0.5 - 20,
                  transform: `scale(${s}) rotate(${frame * 3}deg)`,
                  opacity: interpolate(frame, [delay, delay + 6, delay + 20, delay + 30], [0, 1, 1, 0.6], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                <IconStar size={40} color={COIN_GOLD} strokeWidth={3} />
              </div>
            );
          })}
      </AbsoluteFill>
    </Stage>
  );
};
