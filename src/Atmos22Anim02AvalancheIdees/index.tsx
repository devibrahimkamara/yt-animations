import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Easing,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fitText } from "@remotion/layout-utils";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../atmos22/Stage";
import {
  ACCENT,
  ACCENT_LIGHT,
  AD_YELLOW,
  ATMOS_ERROR,
  CLAUDE_TERRACOTTA,
  GLASS_BORDER,
  GLASS_CARD,
  INK,
  MONEY_GREEN,
} from "../atmos22/theme";
import { clamp, dampedShake, exitFx } from "../atmos22/utils";

// Anim 2 — « L'avalanche d'idées » (150 f / 5 s @ 30 fps).
// Timeline du brief conservée : 36 cartes, spawn(i) = 6 + round(99·(1-(1-i/35)^1.3)) (≥ 1 f d'écart),
// chute spring 13/140/0.9, shake à chaque rangée complète (±3 px, ±5 px pour r ≥ 5),
// caméra 1.25→0.8 + translateY 60→0 sur 0→110 (out cubic), respiration 110→138,
// halo carte « Idée n°47 » à f112 (0→1→0.6 sur 18 f), légende f104, sortie 138→150.
// Écarts : palette charte (6 couleurs → ACCENT, ACCENT_LIGHT, MONEY_GREEN, CLAUDE_TERRACOTTA,
// AD_YELLOW, ATMOS_ERROR ; halo/« montagne » → ACCENT ; cartes glass), Plus Jakarta Sans.
// Cartes gardées à la taille du brief (élément de masse) ; texte de carte auto-réduit (fitText
// après chargement de la police, plafond 30 px) pour tenir sur une ligne. Position de départ « hors écran en haut »
// calculée en coordonnées écran (y monde = -200 serait visible une fois dézoomé).

const { fontFamily, waitUntilDone } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

const IDEAS = [
  "Dropshipping", "SaaS", "Newsletter", "Agence IA", "Ebook", "Freelancing", "Print on demand",
  "Chaîne YouTube", "Formation en ligne", "Affiliation", "Template Notion", "Coaching", "Podcast",
  "Application mobile", "Marketplace", "Traduction", "Montage vidéo", "Création de logos", "Community",
  "Revente", "Voix off IA", "Consulting", "Générateur d'images", "Chatbot", "Newsletter payante",
  "Automatisation", "Site de niche", "Réseaux sociaux", "Prompts à vendre", "Webinaire", "Micro-SaaS",
  "Boutique Etsy", "Blog SEO", "Service client IA", "Cours Udemy", "Idée n°47",
];

export const atmos22Anim02Schema = z.object({
  overlay: z.boolean().default(false),
  ideas: z.array(z.string()).length(36).default(IDEAS),
  captionBefore: z.string().default("Une "),
  captionAccent: z.string().default("montagne"),
  captionAfter: z.string().default(" d'idées"),
});

const DURATION = 150;
const CARD_W = 240;
const CARD_H = 84;
const BORDER_L = 8;
const PAD_L = 24;
const PAD_R = 12;
const TEXT_AVAIL = CARD_W - BORDER_L - PAD_L - PAD_R;
const CHAR_EM = 0.62; // repli (avant chargement de la police) : estimation prudente par caractère
const PALETTE = [ACCENT, ACCENT_LIGHT, MONEY_GREEN, CLAUDE_TERRACOTTA, AD_YELLOW, ATMOS_ERROR];
const ORIGIN_X = 960;
const ORIGIN_Y = 880;

const estimateSize = (label: string) => Math.min(30, Math.floor(TEXT_AVAIL / (label.length * CHAR_EM)));

// Taille par carte = fitText (@remotion/layout-utils) mesuré APRÈS chargement de Plus Jakarta Sans,
// plafonnée à 30 px (taille du brief) et arrondie vers le bas avec 4 % de marge.
const useCardFontSizes = (labels: string[]) => {
  const [sizes, setSizes] = useState<number[] | null>(null);
  const key = labels.join("|");
  useEffect(() => {
    const handle = delayRender("atmos22-anim02-fit-text");
    waitUntilDone()
      .then(() => {
        setSizes(
          labels.map((l) => {
            const { fontSize } = fitText({ text: l, withinWidth: TEXT_AVAIL, fontFamily, fontWeight: "700" });
            return Math.min(30, Math.floor(fontSize * 0.96));
          }),
        );
        continueRender(handle);
      })
      .catch(() => continueRender(handle));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return sizes;
};

type Card = { i: number; r: number; x: number; y: number; spawn: number };

const CARDS: Card[] = (() => {
  const out: Card[] = [];
  let i = 0;
  let prev = -Infinity;
  for (let r = 0; r < 8; r++) {
    const n = 8 - r;
    for (let j = 0; j < n; j++) {
      let spawn = 6 + Math.round(99 * (1 - Math.pow(1 - i / 35, 1.3)));
      spawn = Math.max(spawn, prev + 1);
      prev = spawn;
      out.push({ i, r, x: 960 + (j - (n - 1) / 2) * 252, y: 880 - r * 96, spawn });
      i++;
    }
  }
  return out;
})();

const LAND = 10; // frames ≈ premier contact du spring (damping 13 / stiffness 140)
const ROW_LAND = Array.from({ length: 8 }, (_, r) => {
  const last = CARDS.filter((c) => c.r === r).pop()!;
  return last.spawn + LAND;
});

export const Atmos22Anim02AvalancheIdees: React.FC<z.infer<typeof atmos22Anim02Schema>> = ({
  overlay,
  ideas,
  captionBefore,
  captionAccent,
  captionAfter,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fitted = useCardFontSizes(ideas);

  // ── Caméra ──
  const cam = interpolate(frame, [0, 110], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const camBreath =
    frame > 110 && frame < 138 ? 0.01 * Math.sin(((frame - 110) / 28) * Math.PI) : 0;
  const camScale = interpolate(cam, [0, 1], [1.25, 0.8]) + camBreath;
  const camY = interpolate(cam, [0, 1], [60, 0]);

  // ── Shake à chaque rangée complète ──
  const shakeY = ROW_LAND.reduce((acc, f, r) => acc + dampedShake(frame, f, 4, r >= 5 ? 5 : 3), 0);

  // ── Légende ──
  const cap = spring({ frame: frame - 104, fps, config: { damping: 14, stiffness: 110 }, durationInFrames: 14 });

  // ── Halo carte 47 ──
  const halo = interpolate(frame, [112, 121, 130], [0, 1, 0.6], clamp);

  const exit = exitFx(frame, DURATION);

  return (
    <Stage outFrames={0} bare={overlay}>
      {overlay && <AbsoluteFill style={{ background: "rgba(0,0,0,0.6)" }} />}
      <AbsoluteFill style={{ fontFamily, opacity: exit.opacity, transform: `scale(${exit.scale})` }}>
        {/* Monde (caméra) */}
        <AbsoluteFill
          style={{
            transformOrigin: `${ORIGIN_X}px ${ORIGIN_Y}px`,
            transform: `translateY(${camY + shakeY}px) scale(${camScale})`,
          }}
        >
          {/* Sol */}
          <div
            style={{
              position: "absolute",
              left: -1200,
              width: 4320,
              top: 926,
              height: 1,
              background: "rgba(255,255,255,0.12)",
            }}
          />
          {CARDS.map((c) => {
            const t = frame - c.spawn;
            if (t < 0) return null;
            const label = ideas[c.i] ?? "";
            const color = PALETTE[Math.floor(random(`color-${c.i}`) * PALETTE.length)];
            // Départ hors écran (bord haut − 200 px en coordonnées écran, au moment du spawn)
            const camAtSpawn = interpolate(c.spawn, [0, 110], [0, 1], {
              ...clamp,
              easing: Easing.out(Easing.cubic),
            });
            const sAtSpawn = interpolate(camAtSpawn, [0, 1], [1.25, 0.8]);
            const yAtSpawn = interpolate(camAtSpawn, [0, 1], [60, 0]);
            const startY = ORIGIN_Y + (-200 - yAtSpawn - ORIGIN_Y) / sAtSpawn;
            const startX = c.x + (random(`dx-${c.i}`) - 0.5) * 80;
            const rot0 = (random(`r0-${c.i}`) - 0.5) * 24;
            const rotF = (random(`rot-${c.i}`) - 0.5) * 3;
            const s = spring({ frame: t, fps, config: { damping: 13, stiffness: 140, mass: 0.9 } });
            const sc = Math.min(1, s);
            const y = interpolate(s, [0, 1], [startY, c.y]);
            const x = interpolate(sc, [0, 1], [startX, c.x]);
            const rot = interpolate(sc, [0, 1], [rot0, rotF]);
            const isLast = c.i === 35;
            return (
              <div
                key={c.i}
                style={{
                  position: "absolute",
                  left: x - CARD_W / 2,
                  top: y - CARD_H / 2,
                  width: CARD_W,
                  height: CARD_H,
                  boxSizing: "border-box",
                  borderRadius: 16,
                  background: GLASS_CARD,
                  border: `1px solid ${isLast ? `rgba(136,170,255,${0.22 + 0.6 * halo})` : GLASS_BORDER}`,
                  borderLeft: `${BORDER_L}px solid ${isLast ? ACCENT : color}`,
                  paddingLeft: PAD_L,
                  paddingRight: PAD_R,
                  display: "flex",
                  alignItems: "center",
                  transform: `rotate(${rot}deg)`,
                  boxShadow: isLast
                    ? `0 0 40px rgba(48,96,255,${0.45 * halo * 2}), 0 0 14px rgba(136,170,255,${0.5 * halo})`
                    : "0 6px 18px rgba(0,0,0,0.35)",
                  zIndex: c.i,
                }}
              >
                <span
                  style={{
                    color: INK,
                    fontWeight: 700,
                    fontSize: fitted?.[c.i] ?? estimateSize(label),
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    lineHeight: 1,
                  }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </AbsoluteFill>

        {/* Légende */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 140,
            textAlign: "center",
            fontSize: 88,
            fontWeight: 800,
            color: INK,
            lineHeight: 1.1,
            opacity: cap,
            transform: `translateY(${interpolate(cap, [0, 1], [30, 0])}px)`,
          }}
        >
          {captionBefore}
          <span style={{ color: ACCENT, textShadow: "0 0 40px rgba(48,96,255,0.55)", WebkitTextStroke: `1.5px ${ACCENT_LIGHT}` }}>
            {captionAccent}
          </span>
          {captionAfter}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
