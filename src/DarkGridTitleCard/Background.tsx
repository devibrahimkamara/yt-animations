import { AbsoluteFill } from "remotion";

export const Background: React.FC<{ accentColor: string }> = ({
  accentColor,
}) => {
  return (
    <AbsoluteFill>
      {/* Base background */}
      <AbsoluteFill style={{ background: "#040813" }} />
      {/* Radial glow — left-center */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 60% at 20% 50%, ${accentColor}55 0%, transparent 70%)`,
        }}
      />
      {/* Subtle center glow */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 50%, #0d153522 0%, transparent 80%)",
        }}
      />
    </AbsoluteFill>
  );
};
