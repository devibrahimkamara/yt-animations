import {
  useCurrentFrame,
  spring,
  interpolate,
  Easing,
  delayRender,
  continueRender,
} from "remotion";
import { useState, useRef, useLayoutEffect } from "react";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Checkpoint } from "./Checkpoint";

const { fontFamily } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });

const PATH_D =
  "M 80,540 C 300,200 600,200 760,540 C 900,800 1100,800 1280,540 C 1450,200 1650,200 1840,540";

// Checkpoint percentages along the path
const CHECKPOINT_PCTS = [0.15, 0.35, 0.55, 0.75, 0.90];

// Checkpoint config
const CHECKPOINTS = [
  { label: "Choisir la niche",    labelSide: "above" as const, appearFrame: 55 },
  { label: "Créer le design",     labelSide: "below" as const, appearFrame: 75 },
  { label: "Imprimer le T-shirt", labelSide: "above" as const, appearFrame: 95 },
  { label: "Promouvoir",          labelSide: "below" as const, appearFrame: 115 },
  { label: "Premier client",      labelSide: "above" as const, appearFrame: 130 },
];

// Icons as SVG path groups (24×24 coordinate space, centered at 12,12)
const IconLightbulb = (
  <>
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
  </>
);

const IconPalette = (
  <>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    <circle cx="6.5" cy="11.5" r="1" fill="white" stroke="none" />
    <circle cx="9.5" cy="7.5" r="1" fill="white" stroke="none" />
    <circle cx="14.5" cy="7.5" r="1" fill="white" stroke="none" />
    <circle cx="17.5" cy="11.5" r="1" fill="white" stroke="none" />
  </>
);

const IconShirt = (
  <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />
);

const IconShare = (
  <>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </>
);

const IconBadgeCheck = (
  <>
    <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
    <path d="m9 12 2 2 4-4" />
  </>
);

const ICONS = [IconLightbulb, IconPalette, IconShirt, IconShare, IconBadgeCheck];

export const PathSVG: React.FC = () => {
  const frame = useCurrentFrame();
  const pathRef = useRef<SVGPathElement>(null);

  const [handle] = useState<number>(() => delayRender("Measuring SVG path"));
  const [totalLength, setTotalLength] = useState<number | null>(null);
  const [points, setPoints] = useState<Array<{ x: number; y: number }> | null>(null);

  // Measure path after first mount
  useLayoutEffect(() => {
    if (!pathRef.current || totalLength !== null) return;
    const len = pathRef.current.getTotalLength();
    setTotalLength(len);
    setPoints(CHECKPOINT_PCTS.map((p) => pathRef.current!.getPointAtLength(len * p)));
  }, [totalLength]);

  // Release render lock once state is populated
  useLayoutEffect(() => {
    if (totalLength !== null) {
      continueRender(handle);
    }
  }, [totalLength, handle]);

  // Path draw progress f0 → f105
  const drawProgress = interpolate(frame, [0, 105], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // Letter Z spring (f140)
  const zElapsed = frame - 140;
  const zScale = spring({ frame: Math.max(0, zElapsed), fps: 30, config: { damping: 200, stiffness: 80 } });
  const zOpacity = interpolate(zElapsed, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Tip glow point (computed from path after measurement)
  const getTipPoint = () => {
    if (!pathRef.current || totalLength === null) return null;
    const drawnLen = totalLength * drawProgress;
    if (drawnLen < 1) return null;
    return pathRef.current.getPointAtLength(Math.max(0, drawnLen - 4));
  };

  const tipPoint = totalLength !== null ? getTipPoint() : null;
  const drawnLength = totalLength !== null ? totalLength * drawProgress : 0;

  return (
    <svg
      viewBox="0 0 1920 1080"
      width={1920}
      height={1080}
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      {/* Hidden measurement path — always rendered so pathRef is available */}
      <path
        ref={pathRef}
        d={PATH_D}
        fill="none"
        stroke="transparent"
        strokeWidth={1}
        opacity={0}
      />

      {/* Only render animation after path is measured */}
      {totalLength !== null && (
        <>
          {/* Glow base — full drawn length, brand blue, low opacity */}
          <path
            d={PATH_D}
            fill="none"
            stroke="#3060ff"
            strokeWidth={12}
            opacity={0.12}
            strokeDasharray={`${drawnLength} ${totalLength}`}
            strokeDashoffset={0}
            strokeLinecap="round"
          />

          {/* Main line — white, animated dashoffset */}
          <path
            d={PATH_D}
            fill="none"
            stroke="#F8FAFC"
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={`${totalLength} ${totalLength}`}
            strokeDashoffset={totalLength - drawnLength}
          />

          {/* Laser head — glowing tip */}
          {tipPoint && drawProgress > 0.01 && drawProgress < 0.99 && (
            <>
              <circle cx={tipPoint.x} cy={tipPoint.y} r={10} fill="#88aaff" opacity={0.3} />
              <circle cx={tipPoint.x} cy={tipPoint.y} r={5} fill="#88aaff" opacity={0.9} />
            </>
          )}

          {/* Checkpoints */}
          {points &&
            CHECKPOINTS.map((cp, i) => (
              <Checkpoint
                key={i}
                x={points[i].x}
                y={points[i].y}
                icon={ICONS[i]}
                label={cp.label}
                labelSide={cp.labelSide}
                appearFrame={cp.appearFrame}
                fontFamily={fontFamily}
              />
            ))}
        </>
      )}

      {/* Letter A — always visible from f0 */}
      <text
        x={30}
        y={590}
        fill="#FFFFFF"
        fontSize={72}
        fontFamily={fontFamily}
        fontWeight={700}
        opacity={0.9}
      >
        A
      </text>

      {/* Letter Z — appears at f140 */}
      {zElapsed >= 0 && (
        <text
          x={1870}
          y={590}
          textAnchor="end"
          fill="#FFFFFF"
          fontSize={72}
          fontFamily={fontFamily}
          fontWeight={700}
          opacity={zOpacity}
          style={{
            transform: `scale(${zScale})`,
            transformOrigin: "1870px 555px",
          }}
        >
          Z
        </text>
      )}
    </svg>
  );
};
