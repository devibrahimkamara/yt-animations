import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { AuroraBackground } from "../GlassMotionCard/AuroraBackground";
import { GensparkLogo } from "../components/GensparkLogo";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700", "800"],
  subsets: ["latin"],
});

const CARDS = [
  { label: "Idées",          icon: "💡", x: 280,  y: 240,  delay: 0,  floatAmp: 12, floatPeriod: 65, floatPhase: 0,  rotAmp: 2.0, rotPeriod: 80,  rotPhase: 10, spinDir:  1, suckDelay: 0 },
  { label: "App Builder",    icon: "🛠️", x: 720,  y: 180,  delay: 8,  floatAmp: 16, floatPeriod: 72, floatPhase: 12, rotAmp: 3.0, rotPeriod: 90,  rotPhase: 25, spinDir: -1, suckDelay: 1 },
  { label: "Images",         icon: "🖼️", x: 1200, y: 220,  delay: 15, floatAmp: 10, floatPeriod: 58, floatPhase: 25, rotAmp: 1.5, rotPeriod: 75,  rotPhase: 5,  spinDir:  1, suckDelay: 2 },
  { label: "Vidéos",         icon: "🎬", x: 1600, y: 300,  delay: 22, floatAmp: 18, floatPeriod: 80, floatPhase: 40, rotAmp: 2.5, rotPeriod: 95,  rotPhase: 35, spinDir: -1, suckDelay: 3 },
  { label: "SEO",            icon: "📈", x: 1650, y: 680,  delay: 30, floatAmp: 14, floatPeriod: 62, floatPhase: 8,  rotAmp: 3.5, rotPeriod: 70,  rotPhase: 50, spinDir:  1, suckDelay: 4 },
  { label: "Rédaction",      icon: "✍️", x: 1180, y: 820,  delay: 38, floatAmp: 11, floatPeriod: 75, floatPhase: 30, rotAmp: 2.0, rotPeriod: 85,  rotPhase: 15, spinDir: -1, suckDelay: 2 },
  { label: "Automatisation", icon: "⚙️", x: 600,  y: 860,  delay: 46, floatAmp: 17, floatPeriod: 68, floatPhase: 18, rotAmp: 3.0, rotPeriod: 78,  rotPhase: 42, spinDir:  1, suckDelay: 3 },
  { label: "Données",        icon: "📊", x: 240,  y: 720,  delay: 54, floatAmp: 13, floatPeriod: 55, floatPhase: 45, rotAmp: 2.5, rotPeriod: 100, rotPhase: 28, spinDir: -1, suckDelay: 1 },
];

export const GenSparkAnim05ChaosToClarity: React.FC = () => {
  const frame = useCurrentFrame();

  // Flash — shifted to frame 200
  const flashOpacity = interpolate(frame, [200, 206, 215], [0, 0.7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Reveal
  const revealScale = interpolate(frame, [210, 235], [0.75, 1.0], {
    easing: Easing.out(Easing.back(1.4)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const revealOpacity = interpolate(frame, [210, 224], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glowOpacity = interpolate(frame, [210, 260], [0, 0.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glowSize = interpolate(frame, [210, 260], [60, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const taglineOpacity = interpolate(frame, [230, 248], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000000" }}>
      <AuroraBackground />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 1600px 900px at center, transparent 60%, rgba(0,0,0,0.5) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Cards */}
      {CARDS.map((card, i) => {
        const { delay, floatAmp, floatPeriod, floatPhase, rotAmp, rotPeriod, rotPhase, spinDir, suckDelay, x, y } = card;

        // Entrance (delay → delay+20)
        const entranceOpacity = interpolate(frame, [delay, delay + 20], [0, 1], {
          easing: Easing.out(Easing.cubic),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const entranceScale = interpolate(frame, [delay, delay + 20], [0.6, 1.0], {
          easing: Easing.out(Easing.cubic),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        // Float (frames 0 → 140)
        const floatActive = frame < 140;
        const offsetY = floatActive
          ? floatAmp * Math.sin(((frame + floatPhase) / floatPeriod) * 2 * Math.PI)
          : 0;
        const rot = floatActive
          ? rotAmp * Math.sin(((frame + rotPhase) / rotPeriod) * 2 * Math.PI)
          : 0;

        // Aspiration (140+suckDelay → 140+suckDelay+60)
        const suckStart = 140 + suckDelay;
        const suckEnd = suckStart + 60;
        const suckX = interpolate(frame, [suckStart, suckEnd], [x, 960], {
          easing: Easing.in(Easing.cubic),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const suckY = interpolate(frame, [suckStart, suckEnd], [y, 540], {
          easing: Easing.in(Easing.cubic),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const suckScale = interpolate(frame, [suckStart, suckEnd], [1.0, 0.0], {
          easing: Easing.in(Easing.quad),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const suckOpacity = interpolate(frame, [suckStart + 40, suckEnd], [1.0, 0.0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const spinDeg = interpolate(frame, [suckStart, suckEnd], [0, 360 * spinDir], {
          easing: Easing.in(Easing.cubic),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const posX = frame < suckStart ? x : suckX;
        const posY = frame < suckStart ? y + offsetY : suckY;
        const rotation = frame < suckStart ? rot : spinDeg;
        const opacity = frame < suckStart ? entranceOpacity : entranceOpacity * suckOpacity;
        const scale = frame < suckStart ? entranceScale : entranceScale * suckScale;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: posX,
              top: posY,
              width: 200,
              height: 110,
              borderRadius: 20,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              opacity,
              transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
              pointerEvents: "none",
            }}
          >
            <span style={{ fontSize: 52 }}>{card.icon}</span>
            <span
              style={{
                fontFamily,
                fontWeight: 400,
                fontSize: 36,
                color: "rgba(255,255,255,0.80)",
              }}
            >
              {card.label}
            </span>
          </div>
        );
      })}

      {/* Flash */}
      <AbsoluteFill
        style={{ background: "#FFFFFF", opacity: flashOpacity, pointerEvents: "none" }}
      />

      {/* GenSpark reveal */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${revealScale})`,
          opacity: revealOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Glow halo */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: glowSize * 4,
            height: glowSize * 2,
            background: `radial-gradient(ellipse ${glowSize * 4}px ${glowSize * 2}px at center, rgba(48,96,255,${glowOpacity * 0.55}) 0%, transparent 70%)`,
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />
        <GensparkLogo height={150} fontFamily={fontFamily} />
        <div
          style={{
            fontFamily,
            fontWeight: 400,
            fontSize: 48,
            color: "rgba(255,255,255,0.60)",
            marginTop: 16,
            opacity: taglineOpacity,
          }}
        >
          Tout-en-un. Pour de vrai.
        </div>
      </div>
    </AbsoluteFill>
  );
};
