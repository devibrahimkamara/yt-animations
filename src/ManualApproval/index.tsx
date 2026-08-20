import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);

export const manualApprovalSchema = z.object({
  robotLabel: z.string().default("Agent IA"),
  buttonLabel: z.string().default("VALIDATION MANUELLE"),
  subtitle: z.string().default("Tu gardes le contrôle"),
  accentColor: z.string().default("#3060ff"),
  durationSecs: z.number().default(3),
});

export type ManualApprovalProps = z.infer<typeof manualApprovalSchema>;

const RobotIcon: React.FC<{ color: string; typing: boolean; stopped: boolean }> = ({ color, typing, stopped }) => {
  const frame = useCurrentFrame();
  const typingAnim = typing ? Math.abs(Math.sin(frame * 0.4)) : 0;
  return (
    <svg width="120" height="140" viewBox="0 0 120 140">
      {/* Head */}
      <rect x="20" y="10" width="80" height="70" rx="16"
        fill="rgba(20,40,100,0.95)" stroke={stopped ? "rgba(239,68,68,0.8)" : color} strokeWidth="2.5" />
      {/* Eyes */}
      <circle cx="42" cy="40" r="10" fill={stopped ? "rgba(239,68,68,0.6)" : color} opacity={stopped ? 0.6 : 0.9} />
      <circle cx="78" cy="40" r="10" fill={stopped ? "rgba(239,68,68,0.6)" : color} opacity={stopped ? 0.6 : 0.9} />
      {/* Inner eye dot */}
      <circle cx="42" cy="40" r="4" fill="#fff" opacity={stopped ? 0.3 : 0.9} />
      <circle cx="78" cy="40" r="4" fill="#fff" opacity={stopped ? 0.3 : 0.9} />
      {/* Mouth - changes when stopped */}
      {stopped
        ? <path d="M 40 62 Q 60 54 80 62" fill="none" stroke="rgba(239,68,68,0.8)" strokeWidth="3" strokeLinecap="round" />
        : <path d="M 40 60 Q 60 68 80 60" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
      }
      {/* Antenna */}
      <line x1="60" y1="10" x2="60" y2="0" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="0" r="5" fill={color} opacity={stopped ? 0.3 : 0.8} />
      {/* Body */}
      <rect x="25" y="88" width="70" height="44" rx="12"
        fill="rgba(15,30,80,0.95)" stroke={stopped ? "rgba(239,68,68,0.5)" : "rgba(60,100,220,0.5)"} strokeWidth="1.5" />
      {/* Typing hands animation */}
      {!stopped && (
        <>
          <rect x="12" y="100" width="18" height="8" rx="4"
            fill={color} opacity={0.7}
            transform={`translate(0, ${typingAnim * 4})`} />
          <rect x="90" y="100" width="18" height="8" rx="4"
            fill={color} opacity={0.7}
            transform={`translate(0, ${(1 - typingAnim) * 4})`} />
        </>
      )}
    </svg>
  );
};

export const ManualApproval: React.FC<ManualApprovalProps> = ({
  robotLabel, buttonLabel, subtitle, accentColor, durationSecs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 (0-30f): Robot appears and types
  // Phase 2 (30-55f): Hand appears and stops robot
  // Phase 3 (55-end): Button appears

  const robotScale = spring({ frame, fps, config: { mass: 0.5, damping: 12, stiffness: 200 }, from: 0, to: 1 });
  const robotOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const isTyping = frame < 30;
  const isStopped = frame >= 30;

  // Typing text animation
  const typingText = "Cher partenaire, je suis ravi de...";
  const charCount = Math.min(
    Math.floor(interpolate(frame, [5, 28], [0, typingText.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })),
    typingText.length
  );

  // Hand appears at frame 30
  const handOpacity = interpolate(frame, [30, 42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });
  const handScale = spring({ frame: Math.max(0, frame - 30), fps, config: { mass: 0.5, damping: 10, stiffness: 260 }, from: 0, to: 1 });

  // Button appears at frame 55
  const buttonScale = spring({ frame: Math.max(0, frame - 55), fps, config: { mass: 0.5, damping: 10, stiffness: 240 }, from: 0, to: 1 });
  const buttonOpacity = interpolate(frame, [55, 68], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING });

  // Button pulse
  const buttonPulse = 1 + 0.04 * Math.sin(frame * 0.2);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AuroraBackground />

      <AbsoluteFill style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 36,
      }}>

        {/* Robot + label */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          opacity: robotOpacity,
          transform: `scale(${robotScale})`,
        }}>
          <div style={{ position: "relative" }}>
            <RobotIcon color={accentColor} typing={isTyping} stopped={isStopped} />
            {/* Hand stop sign */}
            {frame >= 30 && (
              <div style={{
                position: "absolute",
                top: -10,
                right: -40,
                fontSize: 60,
                opacity: handOpacity,
                transform: `scale(${handScale})`,
              }}>
                ✋
              </div>
            )}
          </div>
          <div style={{
            fontFamily,
            fontWeight: 700,
            fontSize: 20,
            color: isStopped ? "rgba(239,68,68,0.8)" : "rgba(136,170,255,0.8)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}>
            {robotLabel}
          </div>
        </div>

        {/* Typing preview */}
        <div style={{
          background: "rgba(10,20,50,0.8)",
          border: `1px solid ${isStopped ? "rgba(239,68,68,0.4)" : "rgba(80,130,255,0.3)"}`,
          borderRadius: 14,
          padding: "16px 28px",
          maxWidth: 700,
          opacity: robotOpacity,
        }}>
          <div style={{
            fontFamily,
            fontWeight: 600,
            fontSize: 22,
            color: isStopped ? "rgba(255,150,150,0.7)" : "rgba(200,220,255,0.85)",
            letterSpacing: "0.01em",
            minHeight: 32,
          }}>
            {typingText.slice(0, charCount)}
            {isTyping && (
              <span style={{
                display: "inline-block",
                width: 2,
                height: 22,
                background: accentColor,
                marginLeft: 2,
                opacity: Math.abs(Math.sin(frame * 0.3)) > 0.5 ? 1 : 0,
                verticalAlign: "middle",
              }} />
            )}
            {isStopped && " ⛔"}
          </div>
        </div>

        {/* MANUAL APPROVAL button */}
        {frame >= 55 && (
          <div style={{
            opacity: buttonOpacity,
            transform: `scale(${buttonScale * buttonPulse})`,
            background: `linear-gradient(135deg, ${accentColor}, rgba(80,180,255,0.9))`,
            borderRadius: 16,
            padding: "20px 48px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            boxShadow: `0 0 40px ${accentColor}50`,
          }}>
            <div style={{
              fontFamily,
              fontWeight: 800,
              fontSize: 30,
              color: "#fff",
              letterSpacing: "0.08em",
            }}>
              {buttonLabel}
            </div>
            <div style={{
              fontFamily,
              fontWeight: 600,
              fontSize: 16,
              color: "rgba(255,255,255,0.75)",
              letterSpacing: "0.06em",
            }}>
              {subtitle}
            </div>
          </div>
        )}

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
