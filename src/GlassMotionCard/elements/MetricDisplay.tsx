import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Easing, interpolate, useCurrentFrame } from "remotion";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700", "800"],
  subsets: ["latin"],
});

const EASING = Easing.bezier(0.16, 1, 0.3, 1);

function useFadeSlide(startFrame: number, duration = 18) {
  const frame = useCurrentFrame();
  const p = frame - startFrame;
  return {
    opacity: interpolate(p, [0, duration], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
    }),
    transform: `translateY(${interpolate(p, [0, duration], [20, 0], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
    })}px)`,
  };
}

function parseNumeric(value: string): number | null {
  const clean = value.replace(/[^0-9.,]/g, "").replace(",", ".");
  const n = parseFloat(clean);
  return isNaN(n) ? null : n;
}

function formatBack(original: string, numeric: number): string {
  const prefix = original.match(/^[^0-9]*/)?.[0] ?? "";
  const suffix = original.match(/[^0-9.,]*$/)?.[0] ?? "";
  const hasDecimals = original.includes(".");
  const decimalPlaces = hasDecimals ? (original.split(".")[1]?.replace(/[^0-9]/g, "").length ?? 0) : 0;
  const formatted = hasDecimals
    ? numeric.toFixed(decimalPlaces)
    : Math.round(numeric).toLocaleString();
  return `${prefix}${formatted}${suffix}`;
}

export const MetricDisplay: React.FC<{
  label: string;
  value: string;
  subtitle?: string;
  countUp?: boolean;
}> = ({ label, value, subtitle, countUp = true }) => {
  const frame = useCurrentFrame();
  const labelStyle = useFadeSlide(8);
  const valueStyle = useFadeSlide(14);
  const subtitleStyle = useFadeSlide(22);

  const numericTarget = parseNumeric(value);
  let displayValue = value;

  if (countUp && numericTarget !== null) {
    const animated = interpolate(frame, [14, 55], [0, numericTarget], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASING,
    });
    displayValue = formatBack(value, animated);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
      {/* Label */}
      <div style={{
        ...labelStyle,
        fontFamily,
        fontWeight: 700,
        fontSize: 26,
        color: "rgba(255,255,255,0.9)",
        letterSpacing: "0.01em",
      }}>
        {label}
      </div>

      {/* Value */}
      <div style={{
        ...valueStyle,
        fontFamily,
        fontWeight: 800,
        fontSize: 96,
        lineHeight: 1.0,
        background: "linear-gradient(180deg, #88aaff 0%, #ffffff 60%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        letterSpacing: "-0.02em",
      }}>
        {displayValue}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div style={{
          ...subtitleStyle,
          fontFamily,
          fontWeight: 400,
          fontSize: 32,
          color: "rgba(255,255,255,0.7)",
          letterSpacing: "0.01em",
        }}>
          {subtitle}
        </div>
      )}
    </div>
  );
};
