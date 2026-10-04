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
import { Stage } from "../higgsApi/Stage";
import { ACCENT_LIGHT, INK, MONEY_GREEN, FONT, atmosPanelBorder } from "../higgsApi/theme";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});

// Anim 1 — « Le plan d'architecte qui devient produit » (195 frames / 6,5 s @ 30 fps)
// Phase 1 (0-90)   : tracé SVG stroke-only du cadre d'app, en vague continue
// Phase 2 (90-135) : remplissage des formes + pop de groupe + textes
// Phase 3 (135-180): maintien, respiration de l'avatar
// Phase 4 (180-195): fondu de sortie (géré par Stage)

export const higgsApiAnim01Schema = z.object({});
export type HiggsApiAnim01Props = z.infer<typeof higgsApiAnim01Schema>;

// Fenêtre d'app centrée, 900x560, dans une comp 1920x1080
const WIN_W = 900;
const WIN_H = 560;
const WIN_X = (1920 - WIN_W) / 2;
const WIN_Y = (1080 - WIN_H) / 2;
const SIDEBAR_W = 180;
const HEADER_H = 60;
const PAD = 16;

type ShapeDef = { x: number; y: number; w: number; h: number; drawStart: number; drawEnd: number; fillDelay: number };

const SIDEBAR: ShapeDef = { x: WIN_X, y: WIN_Y, w: SIDEBAR_W, h: WIN_H, drawStart: 18, drawEnd: 40, fillDelay: 5 };
const HEADER: ShapeDef = {
  x: WIN_X + SIDEBAR_W,
  y: WIN_Y,
  w: WIN_W - SIDEBAR_W,
  h: HEADER_H,
  drawStart: 32,
  drawEnd: 50,
  fillDelay: 10,
};
const contentY = WIN_Y + HEADER_H + PAD;
const contentW = WIN_W - SIDEBAR_W - PAD * 2;
const contentH = WIN_H - HEADER_H - PAD * 2;
const blockH = (contentH - PAD * 2) / 3;
const BLOCKS: ShapeDef[] = [0, 1, 2].map((i) => ({
  x: WIN_X + SIDEBAR_W + PAD,
  y: contentY + i * (blockH + PAD),
  w: contentW,
  h: blockH,
  drawStart: 45 + i * 10,
  drawEnd: 45 + i * 10 + 20,
  fillDelay: 15 + i * 5,
}));
const AVATAR = { cx: WIN_X + WIN_W - 30, cy: WIN_Y + HEADER_H / 2, r: 16 };

const perimeter = (w: number, h: number) => 2 * (w + h);
const easeInOut = Easing.inOut(Easing.ease);

const TracedRect: React.FC<{
  def: ShapeDef;
  frame: number;
  fillColor: string;
}> = ({ def, frame, fillColor }) => {
  const per = perimeter(def.w, def.h);
  const drawProgress = interpolate(frame, [def.drawStart, def.drawEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });
  const fillStart = 90 + def.fillDelay;
  const fillEnd = fillStart + 12;
  const fillProgress = interpolate(frame, [fillStart, fillEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const strokeProgress = interpolate(frame, [fillStart, fillEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <rect
      x={def.x}
      y={def.y}
      width={def.w}
      height={def.h}
      rx={10}
      fill={fillColor}
      fillOpacity={fillProgress}
      stroke={ACCENT_LIGHT}
      strokeOpacity={strokeProgress}
      strokeWidth={2}
      style={{
        strokeDasharray: per,
        strokeDashoffset: per * (1 - drawProgress),
      }}
    />
  );
};

export const HiggsApiAnim01PlanArchitecte: React.FC<HiggsApiAnim01Props> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const outerPer = perimeter(WIN_W, WIN_H);
  const outerDraw = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });
  const outerFillT = interpolate(frame, [90, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const avatarPer = 2 * Math.PI * AVATAR.r;
  const avatarDraw = interpolate(frame, [75, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });
  const avatarFillT = interpolate(frame, [90 + 15, 90 + 27], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const groupSpring = spring({ frame: frame - 90, fps, config: { damping: 15, stiffness: 120 } });
  const groupScale = interpolate(groupSpring, [0, 1], [0.98, 1]);

  const breathe = frame >= 135 ? 1 + Math.sin((frame - 135) * 0.15) * 0.015 : 1;

  const headerTextOpacity = interpolate(frame, [125, 135], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const contentTextOpacity = (i: number) =>
    interpolate(frame, [130 + i * 4, 138 + i * 4], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  return (
    <Stage outFrames={15}>
      <AbsoluteFill style={{ fontFamily }}>
        <svg
          width={1920}
          height={1080}
          style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${groupScale * breathe})`,
            transformOrigin: `${WIN_X + WIN_W / 2}px ${WIN_Y + WIN_H / 2}px`,
          }}
        >
          <rect
            x={WIN_X}
            y={WIN_Y}
            width={WIN_W}
            height={WIN_H}
            rx={14}
            fill="rgba(10,16,40,0.9)"
            fillOpacity={outerFillT}
            stroke={ACCENT_LIGHT}
            strokeOpacity={1 - outerFillT}
            strokeWidth={2}
            style={{
              strokeDasharray: outerPer,
              strokeDashoffset: outerPer * (1 - outerDraw),
            }}
          />
          <TracedRect def={SIDEBAR} frame={frame} fillColor="rgba(20,30,70,0.85)" />
          <TracedRect def={HEADER} frame={frame} fillColor="rgba(15,22,55,0.85)" />
          {BLOCKS.map((b, i) => (
            <TracedRect key={i} def={b} frame={frame} fillColor={atmosPanelBorder(0.12)} />
          ))}
          <circle
            cx={AVATAR.cx}
            cy={AVATAR.cy}
            r={AVATAR.r}
            fill={MONEY_GREEN}
            fillOpacity={avatarFillT}
            stroke={ACCENT_LIGHT}
            strokeOpacity={1 - avatarFillT}
            strokeWidth={2}
            style={{
              strokeDasharray: avatarPer,
              strokeDashoffset: avatarPer * (1 - avatarDraw),
            }}
          />
        </svg>

        <div
          style={{
            position: "absolute",
            left: WIN_X + SIDEBAR_W + PAD,
            top: WIN_Y + 14,
            fontSize: FONT.micro * 0.55,
            fontWeight: 800,
            color: INK,
            opacity: headerTextOpacity,
            transform: `scale(${groupScale * breathe})`,
            transformOrigin: `${WIN_X + WIN_W / 2}px ${WIN_Y + WIN_H / 2}px`,
          }}
        >
          Ton application
        </div>

        {BLOCKS.map((b, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: b.x + 18,
              top: b.y + b.h / 2 - 10,
              width: b.w - 36,
              fontSize: FONT.micro * 0.34,
              fontWeight: 700,
              color: "rgba(255,255,255,0.75)",
              opacity: contentTextOpacity(i),
              transform: `scale(${groupScale * breathe})`,
              transformOrigin: `${WIN_X + WIN_W / 2}px ${WIN_Y + WIN_H / 2}px`,
            }}
          >
            {["Module vidéo", "Module image", "Module export"][i]}
          </div>
        ))}
      </AbsoluteFill>
    </Stage>
  );
};
