import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { z } from "zod";
import { AppWindow } from "./AppWindow";
import { IPhoneReveal } from "./IPhoneReveal";
import type { ContentType, ExitDir } from "./AppWindow";

export const teemDropSchema = z.object({});
export type TeemDropProps = z.infer<typeof teemDropSchema>;

interface WindowConfig {
  contentType: ContentType;
  x: number;
  y: number;
  w: number;
  h: number;
  baseRotation: number;
  exitDir: ExitDir;
}

const WINDOWS: WindowConfig[] = [
  { contentType: "code",        x: 22, y: 30, w: 380, h: 260, baseRotation: -6, exitDir: "top-left"     },
  { contentType: "spreadsheet", x: 50, y: 22, w: 360, h: 240, baseRotation:  4, exitDir: "top"          },
  { contentType: "analytics",   x: 75, y: 32, w: 360, h: 250, baseRotation: -3, exitDir: "top-right"    },
  { contentType: "design",      x: 30, y: 65, w: 370, h: 250, baseRotation:  5, exitDir: "bottom-left"  },
  { contentType: "browser",     x: 58, y: 68, w: 380, h: 260, baseRotation: -4, exitDir: "bottom"       },
  { contentType: "video",       x: 80, y: 62, w: 350, h: 240, baseRotation:  6, exitDir: "bottom-right" },
];

// Subtle aurora blobs — low opacity so they don't compete with the windows
const BLOBS = [
  { color: "rgba(20,60,220,0.20)",  x: 18, y: 22, size: 580, blur: 120, phase: 0.0 },
  { color: "rgba(48,96,255,0.17)",  x: 78, y: 68, size: 520, blur: 140, phase: 2.2 },
  { color: "rgba(10,30,160,0.22)",  x: 50, y: 88, size: 680, blur: 130, phase: 4.4 },
];

export const TeemDrop: React.FC<TeemDropProps> = () => {
  const frame = useCurrentFrame();
  const t = frame * 0.005;

  return (
    <AbsoluteFill>
      {/* Dark background */}
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse at 50% 50%, #0F172A 0%, #020617 100%)",
      }} />

      {/* Subtle aurora blobs */}
      {BLOBS.map((blob, i) => {
        const p = t + blob.phase;
        return (
          <div key={i} style={{
            position: "absolute",
            borderRadius: "50%",
            background: blob.color,
            filter: `blur(${blob.blur}px)`,
            width: blob.size,
            height: blob.size * 0.7,
            left: `${blob.x + Math.sin(p * 0.4) * 5}%`,
            top: `${blob.y + Math.cos(p * 0.3) * 4}%`,
            transform: "translate(-50%, -50%)",
          }} />
        );
      })}

      {/* App windows (rendered below iPhone so iPhone dominates when it appears) */}
      {WINDOWS.map((config, i) => (
        <AppWindow key={i} {...config} index={i} />
      ))}

      {/* SFX — ElevenLabs (frame-precise sync) */}
      <Audio src={staticFile("audio/elevenlabs/sfx-1-chaos-arrive.mp3")} startFrom={0}   volume={0.7} />
      <Audio src={staticFile("audio/elevenlabs/sfx-2-sweep-exit.mp3")}   startFrom={55}  volume={0.85} />
      <Audio src={staticFile("audio/elevenlabs/sfx-3-iphone-chime.mp3")} startFrom={130} volume={0.9} />

      {/* iPhone — rendered last = highest z-index */}
      <IPhoneReveal />
    </AbsoluteFill>
  );
};
