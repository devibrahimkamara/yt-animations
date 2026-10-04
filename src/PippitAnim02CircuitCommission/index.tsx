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
import { Stage } from "../pippit/Stage";
import { IconPerson, IconProductBox } from "../pippit/icons";
import { ACCENT, ACCENT_LIGHT, COIN_GOLD, MONEY_GREEN, FONT } from "../pippit/theme";

// Anim 2 — « Le circuit de la commission » (210 frames / 7 s)
// A Nœuds 0–20 · B Pause 20–35 · C Lien Toi→Acheteur 35–75 ·
// D Point voyageur 75–110 · E Lien Acheteur→Produit 110–130 ·
// F Pièce + compteur 130–175 · G Tenue 175–195 · H Sortie 195–210

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });

export const pippitAnim02Schema = z.object({
  amount: z.number().default(30),
});
export type PippitAnim02Props = z.infer<typeof pippitAnim02Schema>;

const NODES = {
  toi: { x: 288, y: 540, label: "Toi" },
  acheteur: { x: 960, y: 540, label: "Acheteur" },
  produit: { x: 1632, y: 540, label: "Produit" },
};

const bezier = (
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  t: number,
) => {
  const it = 1 - t;
  return {
    x: it * it * p0.x + 2 * it * t * p1.x + t * t * p2.x,
    y: it * it * p0.y + 2 * it * t * p1.y + t * t * p2.y,
  };
};

const CTRL_LINK1 = { x: 624, y: 420 };
const CTRL_LINK2 = { x: 1296, y: 480 };
const CTRL_COIN = { x: 960, y: 150 };
const LEN_LINK1 = 693;
const LEN_LINK2 = 677;
const LEN_COIN = 1449;

const RADIUS = 45;

const Node: React.FC<{
  x: number;
  y: number;
  label: string;
  delay: number;
  pulseAt?: number;
  icon: "person" | "box";
}> = ({ x, y, label, delay, pulseAt, icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appear = spring({
    frame: frame - delay,
    fps,
    config: { damping: 9, stiffness: 180, mass: 0.6 },
  });

  const pulse =
    pulseAt !== undefined
      ? interpolate(frame, [pulseAt, pulseAt + 5, pulseAt + 10], [1, 1.15, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  const labelOpacity = interpolate(frame, [delay + 6, delay + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${appear * pulse})`,
      }}
    >
      <div
        style={{
          width: RADIUS * 2,
          height: RADIUS * 2,
          borderRadius: "50%",
          background: "#24242E",
          border: "2px solid #3A3A46",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon === "person" ? <IconPerson size={48} color="#EDEDED" strokeWidth={3} /> : <IconProductBox size={48} color="#EDEDED" strokeWidth={3} />}
      </div>
      <div
        style={{
          position: "absolute",
          top: RADIUS * 2 + 16,
          left: "50%",
          transform: "translateX(-50%)",
          whiteSpace: "nowrap",
          fontFamily,
          fontWeight: 700,
          fontSize: FONT.micro,
          color: "#EDEDED",
          opacity: labelOpacity,
        }}
      >
        {label}
      </div>
    </div>
  );
};

const CurvedLink: React.FC<{
  p0: { x: number; y: number };
  p1: { x: number; y: number };
  p2: { x: number; y: number };
  len: number;
  start: number;
  end: number;
}> = ({ p0, p1, p2, len, start, end }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <path
      d={`M ${p0.x},${p0.y} Q ${p1.x},${p1.y} ${p2.x},${p2.y}`}
      fill="none"
      stroke="url(#linkGrad)"
      strokeWidth={3}
      strokeLinecap="round"
      strokeDasharray={len}
      strokeDashoffset={len * (1 - progress)}
    />
  );
};

export const PippitAnim02CircuitCommission: React.FC<PippitAnim02Props> = ({ amount }) => {
  const frame = useCurrentFrame();

  // C — label "Ton lien" à 50% du tracé
  const link1Progress = interpolate(frame, [35, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const linkLabelOpacity = interpolate(frame, [55, 63], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // D — point voyageur le long du lien 1
  const dotT = interpolate(frame, [75, 108], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const dotVisible = frame >= 75 && frame <= 110;
  const dotPos = bezier(NODES.toi, CTRL_LINK1, NODES.acheteur, dotT);

  // E — badge "Acheté ✓"
  const { fps } = useVideoConfig();
  const badgeAppear = spring({
    frame: frame - 122,
    fps,
    config: { damping: 11, stiffness: 170, mass: 0.6 },
  });

  // F — pièce en arc
  const coinT = interpolate(frame, [130, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const coinVisible = frame >= 130 && frame <= 151;
  const coinPos = bezier(NODES.produit, CTRL_COIN, NODES.toi, coinT);
  const coinRotation = (frame - 130) * 8;

  // F — compteur
  const counterVisible = frame >= 150;
  const counterValue = Math.round(
    interpolate(frame, [150, 170], [0, amount], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }),
  );
  const counterOpacity = interpolate(frame, [150, 156], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage outFrames={15}>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
      >
        <defs>
          <linearGradient id="linkGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={ACCENT_LIGHT} />
            <stop offset="100%" stopColor={ACCENT} />
          </linearGradient>
        </defs>

        <CurvedLink p0={NODES.toi} p1={CTRL_LINK1} p2={NODES.acheteur} len={LEN_LINK1} start={35} end={75} />
        <CurvedLink p0={NODES.acheteur} p1={CTRL_LINK2} p2={NODES.produit} len={LEN_LINK2} start={110} end={124} />

        {/* traînée du point voyageur */}
        {dotVisible &&
          [1, 2, 3, 4].map((i) => {
            const t = Math.max(0, dotT - i * 0.02);
            const p = bezier(NODES.toi, CTRL_LINK1, NODES.acheteur, t);
            return <circle key={i} cx={p.x} cy={p.y} r={7 - i} fill="#fff" opacity={1 - i * 0.22} />;
          })}
        {dotVisible && (
          <circle
            cx={dotPos.x}
            cy={dotPos.y}
            r={9}
            fill="#fff"
            style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.8))" }}
          />
        )}

        {/* pièce dorée en arc */}
        {coinVisible && (
          <g transform={`translate(${coinPos.x}, ${coinPos.y}) rotate(${coinRotation})`}>
            <circle r={22} fill="url(#coinGrad)" />
            <text
              x={0}
              y={9}
              textAnchor="middle"
              fontFamily={fontFamily}
              fontWeight={800}
              fontSize={22}
              fill="#7a5200"
            >
              €
            </text>
          </g>
        )}
        <defs>
          <radialGradient id="coinGrad">
            <stop offset="0%" stopColor="#FFC93D" />
            <stop offset="100%" stopColor="#FFA94D" />
          </radialGradient>
        </defs>
      </svg>

      {link1Progress > 0 && link1Progress < 1 && (
        <div
          style={{
            position: "absolute",
            left: (NODES.toi.x + NODES.acheteur.x) / 2,
            top: CTRL_LINK1.y - 40,
            transform: "translateX(-50%)",
            fontFamily,
            fontWeight: 600,
            fontSize: FONT.micro,
            color: ACCENT_LIGHT,
            opacity: linkLabelOpacity,
          }}
        >
          Ton lien
        </div>
      )}

      <Node x={NODES.toi.x} y={NODES.toi.y} label={NODES.toi.label} delay={0} icon="person" pulseAt={150} />
      <Node x={NODES.acheteur.x} y={NODES.acheteur.y} label={NODES.acheteur.label} delay={6} icon="person" pulseAt={108} />
      <Node x={NODES.produit.x} y={NODES.produit.y} label={NODES.produit.label} delay={12} icon="box" pulseAt={124} />

      <div
        style={{
          position: "absolute",
          left: NODES.produit.x,
          top: NODES.produit.y - RADIUS - 90,
          transform: `translateX(-50%) scale(${Math.max(0, badgeAppear)})`,
          background: MONEY_GREEN,
          color: "#fff",
          borderRadius: 999,
          padding: "12px 28px",
          fontFamily,
          fontWeight: 700,
          fontSize: FONT.micro,
          whiteSpace: "nowrap",
        }}
      >
        Acheté ✓
      </div>

      {counterVisible && (
        <div
          style={{
            position: "absolute",
            left: NODES.toi.x,
            top: NODES.toi.y - RADIUS - 160,
            transform: "translateX(-50%)",
            textAlign: "center",
            opacity: counterOpacity,
          }}
        >
          <div style={{ fontFamily, fontWeight: 800, fontSize: FONT.label, color: COIN_GOLD }}>
            +{counterValue} €
          </div>
          <div style={{ fontFamily, fontWeight: 600, fontSize: FONT.micro * 0.55, color: "#EDEDED", opacity: 0.7 }}>
            exemple
          </div>
        </div>
      )}
    </Stage>
  );
};
