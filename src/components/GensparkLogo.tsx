// Genspark brand components — SVG icon recreated from official logo assets

interface SparkleProps {
  cx: number;
  cy: number;
  r: number;
}

// 4-pointed concave star using quadratic beziers
const Sparkle: React.FC<SparkleProps> = ({ cx, cy, r }) => {
  const w = r * 0.11;
  const d = [
    `M ${cx} ${cy - r}`,
    `Q ${cx + w} ${cy - w} ${cx + r} ${cy}`,
    `Q ${cx + w} ${cy + w} ${cx} ${cy + r}`,
    `Q ${cx - w} ${cy + w} ${cx - r} ${cy}`,
    `Q ${cx - w} ${cy - w} ${cx} ${cy - r}`,
    "Z",
  ].join(" ");
  return <path d={d} fill="white" />;
};

// Icon only — black rounded square with 3 sparkles + bar (official Genspark.ai icon)
export const GensparkIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "block", flexShrink: 0 }}
  >
    <rect x="0" y="0" width="100" height="100" rx="18" fill="#000000" />
    {/* Large sparkle — center-left */}
    <Sparkle cx={30} cy={41} r={26} />
    {/* Medium sparkle — upper right */}
    <Sparkle cx={70} cy={26} r={14} />
    {/* Small sparkle — lower right */}
    <Sparkle cx={68} cy={62} r={8} />
    {/* Horizontal bar */}
    <rect x="17" y="79" width="50" height="9" rx="4.5" fill="white" />
  </svg>
);

// Full logo — icon + "Genspark" wordmark side by side
export const GensparkLogo: React.FC<{
  height: number;
  wordmarkColor?: string;
  fontFamily?: string;
}> = ({ height, wordmarkColor = "#ffffff", fontFamily = "Plus Jakarta Sans, sans-serif" }) => {
  const fontSize = Math.round(height * 0.82);
  const gap = Math.round(height * 0.28);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap,
        lineHeight: 0,
      }}
    >
      <GensparkIcon size={height} />
      <span
        style={{
          fontFamily,
          fontWeight: 800,
          fontSize,
          color: wordmarkColor,
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        Genspark.ai
      </span>
    </div>
  );
};
