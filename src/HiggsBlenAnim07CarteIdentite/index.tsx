import React from "react";
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
import { Stage } from "../higgsBlen/Stage";
import { IconThumbUp } from "../higgsBlen/icons";
import { INK, FONT, BLENDER_ORANGE, YT_RED, mulberry32 } from "../higgsBlen/theme";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

// Anim 7 — « Carte d'identité + double impact » (240 frames)
// FOND TRANSPARENT — overlay WebM posé sur la face-cam (voir render-higgs-blen.sh).
// A Lower third 0–30 · B Hold 30–135 · C Sortie + bouton 135–165 · D Boum boum 165–240

export const higgsBlenAnim07Schema = z.object({
  name: z.string().default("Ibrahim Camara"),
  tagline: z.string().default("Compétences pour gagner de l'argent en ligne"),
  subscribeLabel: z.string().default("S'abonner"),
});

export type HiggsBlenAnim07Props = z.infer<typeof higgsBlenAnim07Schema>;

const ImpactMoment: React.FC<{
  startFrame: number;
  fromLeft: boolean;
  seed: number;
}> = ({ startFrame, fromLeft, seed }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;
  if (f < 0) return null;

  // pouce qui frappe depuis le bord le plus proche
  const strike = spring({ frame: f, fps, config: { damping: 9, stiffness: 240 } });
  const offX = interpolate(strike, [0, 1], [fromLeft ? -520 : 520, 0]);
  const sc = interpolate(strike, [0, 0.7, 1], [1.3, 0.95, 1], { extrapolateRight: "clamp" });

  const rand = mulberry32(seed);
  const particles = Array.from({ length: 9 }, (_, i) => {
    const ang = (i / 9) * Math.PI * 2 + rand() * 0.6;
    const dist = 120 + rand() * 160;
    return { ang, dist, size: 10 + rand() * 14, orange: rand() > 0.5 };
  });
  const pT = interpolate(f, [3, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        left: fromLeft ? 480 : 1440,
        top: 760,
        transform: `translate(-50%,-50%) translateX(${offX}px) scale(${sc})`,
      }}
    >
      <div style={{ transform: fromLeft ? "none" : "scaleX(-1)", filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.5))" }}>
        <IconThumbUp size={240} color={INK} strokeWidth={6} />
      </div>
      {particles.map((p, i) => {
        const x = Math.cos(p.ang) * p.dist * pT;
        const y = Math.sin(p.ang) * p.dist * pT + pT * pT * 90; // gravité
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 100,
              top: 100,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: p.orange ? BLENDER_ORANGE : INK,
              transform: `translate(${x}px, ${y}px) scale(${1 - pT})`,
              opacity: 1 - pT,
            }}
          />
        );
      })}
    </div>
  );
};

export const HiggsBlenAnim07CarteIdentite: React.FC<HiggsBlenAnim07Props> = ({
  name,
  tagline,
  subscribeLabel,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // A — déploiement
  const barIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const blockIn = interpolate(frame, [6, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const nameIn = interpolate(frame, [15, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagIn = interpolate(frame, [20, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // C — sortie
  const textOut = interpolate(frame, [135, 142], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const blockOut = interpolate(frame, [138, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const barOut = interpolate(frame, [145, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const barScaleY = frame < 135 ? barIn : barOut;
  const blockScaleX = frame < 135 ? blockIn : blockOut;
  const ltVisible = frame < 152;
  const barPulse = frame >= 30 && frame < 135 ? 0.9 + Math.sin(frame / 10) * 0.1 : 1;

  // C/D — bouton s'abonner
  const btnIn = spring({ frame: frame - 145, fps, config: { damping: 14, stiffness: 150 } });
  const btnScale0 = interpolate(btnIn, [0, 1], [0.8, 1]);

  // impacts
  const punch = (start: number) => {
    const f = frame - start;
    if (f < 0 || f > 30) return { scale: 1, red: frame >= start };
    const up = interpolate(f, [0, 2], [1, 1.15], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) });
    const back = spring({ frame: f - 2, fps, config: { damping: 6, stiffness: 200 } });
    const scale = f < 2 ? up : interpolate(back, [0, 1], [1.15, 1], { extrapolateRight: "clamp" });
    return { scale, red: true };
  };
  const p1 = punch(165);
  const p2 = punch(195);
  const isRed = frame >= 165;
  const btnScale = frame >= 195 ? p2.scale : frame >= 165 ? p1.scale : 1;
  const glow = frame >= 225 ? 0.5 + Math.sin(frame / 8) * 0.5 : 0;

  return (
    <Stage outFrames={12} bare>
      <AbsoluteFill>
        {/* ── Lower third ── */}
        {ltVisible && (
          <div style={{ position: "absolute", left: "8%", top: "72%" }}>
            <div style={{ display: "flex", alignItems: "stretch", gap: 22 }}>
              <div
                style={{
                  width: 10,
                  height: 150,
                  background: BLENDER_ORANGE,
                  transform: `scaleY(${barScaleY})`,
                  transformOrigin: "bottom center",
                  opacity: barPulse,
                }}
              />
              <div
                style={{
                  transform: `scaleX(${blockScaleX})`,
                  transformOrigin: "left center",
                  background: "rgba(10,10,15,0.85)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  borderRadius: 10,
                  padding: "26px 40px",
                  minWidth: 720,
                }}
              >
                <div
                  style={{
                    fontFamily,
                    fontWeight: 800,
                    fontSize: FONT.label,
                    color: INK,
                    opacity: nameIn * textOut,
                    transform: `translateX(${interpolate(nameIn, [0, 1], [15, 0])}px)`,
                  }}
                >
                  {name}
                </div>
                <div
                  style={{
                    fontFamily,
                    fontWeight: 700,
                    fontSize: FONT.micro,
                    color: "#B0B0B8",
                    marginTop: 8,
                    opacity: tagIn * textOut,
                    transform: `translateX(${interpolate(tagIn, [0, 1], [15, 0])}px)`,
                  }}
                >
                  {tagline}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Bouton s'abonner ── */}
        {frame >= 145 && (
          <div
            style={{
              position: "absolute",
              left: 960,
              top: 880,
              transform: `translate(-50%,-50%) scale(${btnScale0 * btnScale})`,
              padding: "28px 64px",
              borderRadius: 16,
              background: isRed ? YT_RED : "transparent",
              border: isRed ? "none" : `3px solid ${INK}`,
              boxShadow: glow > 0 ? `0 0 ${20 + glow * 40}px ${YT_RED}` : "none",
              opacity: btnIn,
            }}
          >
            <span style={{ fontFamily, fontWeight: 800, fontSize: FONT.label, color: INK, letterSpacing: "2px", textTransform: "uppercase" }}>
              {subscribeLabel}
            </span>
          </div>
        )}

        <ImpactMoment startFrame={165} fromLeft seed={7001} />
        <ImpactMoment startFrame={195} fromLeft={false} seed={7042} />
      </AbsoluteFill>
    </Stage>
  );
};
