import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

type Blob = {
  color: string;
  initialX: number; // % of width
  initialY: number; // % of height
  size: number;     // px
  phaseOffset: number;
  speed: number;
  blur: number;
};

const BLOBS: Blob[] = [
  { color: "rgba(20, 60, 220, 0.75)", initialX: 15, initialY: 30, size: 700, phaseOffset: 0,    speed: 0.4, blur: 120 },
  { color: "rgba(40, 90, 255, 0.6)",  initialX: 70, initialY: 20, size: 600, phaseOffset: 1.2,  speed: 0.3, blur: 140 },
  { color: "rgba(10, 30, 160, 0.7)",  initialX: 50, initialY: 70, size: 800, phaseOffset: 2.5,  speed: 0.25,blur: 130 },
  { color: "rgba(60, 110, 255, 0.5)", initialX: 85, initialY: 60, size: 500, phaseOffset: 0.8,  speed: 0.35,blur: 110 },
  { color: "rgba(15, 45, 200, 0.65)", initialX: 30, initialY: 80, size: 650, phaseOffset: 3.0,  speed: 0.2, blur: 150 },
];

export const AuroraBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame * 0.005; // very slow movement

  return (
    <AbsoluteFill style={{ background: "#000000", overflow: "hidden" }}>
      {BLOBS.map((blob, i) => {
        const phase = t * blob.speed + blob.phaseOffset;
        const dx = Math.sin(phase) * 8;
        const dy = Math.cos(phase * 0.7) * 6;
        const scale = interpolate(
          Math.sin(phase * 0.5),
          [-1, 1],
          [0.88, 1.12],
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              borderRadius: "50%",
              background: blob.color,
              filter: `blur(${blob.blur}px)`,
              width: blob.size * scale,
              height: blob.size * scale * 0.8,
              left: `${blob.initialX + dx}%`,
              top: `${blob.initialY + dy}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
