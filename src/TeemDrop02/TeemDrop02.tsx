import { AbsoluteFill, useCurrentFrame } from "remotion";
import { z } from "zod";
import { PathSVG } from "./PathSVG";
import { FinalBadge } from "./FinalBadge";

export const teemDrop02Schema = z.object({});
export type TeemDrop02Props = z.infer<typeof teemDrop02Schema>;

const BLOBS = [
  { color: "rgba(20,60,220,0.20)",  x: 18, y: 22, size: 580, blur: 120, phase: 0.0 },
  { color: "rgba(48,96,255,0.17)",  x: 78, y: 68, size: 520, blur: 140, phase: 2.2 },
  { color: "rgba(10,30,160,0.22)",  x: 50, y: 88, size: 680, blur: 130, phase: 4.4 },
];

export const TeemDrop02: React.FC<TeemDrop02Props> = () => {
  const frame = useCurrentFrame();
  const t = frame * 0.005;

  return (
    <AbsoluteFill>
      {/* Dark background */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, #0F172A 0%, #020617 100%)",
        }}
      />

      {/* Aurora blobs */}
      {BLOBS.map((blob, i) => {
        const p = t + blob.phase;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              borderRadius: "50%",
              background: blob.color,
              filter: `blur(${blob.blur}px)`,
              width: blob.size,
              height: blob.size * 0.7,
              left: `${blob.x + Math.sin(p * 0.4) * 5}%`,
              top: `${blob.y + Math.cos(p * 0.3) * 4}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}

      {/* SVG layer: path + checkpoints + letters */}
      <PathSVG />

      {/* HTML layer: success badge */}
      <FinalBadge />
    </AbsoluteFill>
  );
};
