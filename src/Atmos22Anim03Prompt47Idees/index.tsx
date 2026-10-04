import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../atmos22/Stage";
import {
  ACCENT,
  ACCENT_LIGHT,
  AD_YELLOW,
  ATMOS_ERROR,
  GLASS_BG,
  GLASS_BORDER,
  GLASS_CARD,
  INK,
  MONEY_GREEN,
  MUTED,
} from "../atmos22/theme";
import { breathe, clamp, exitFx } from "../atmos22/utils";

// Anim 3 — « Le prompt et les 47 idées » (210 f / 7 s @ 30 fps).
// Timeline du brief conservée : fenêtre 0→12 (spring 15/120), frappe 12→66 (≈ 1 lettre/f),
// curseur clignotant (8 f) jusqu'à f70, bouton envoi f66 + clic f70, bulle −12 px f72,
// points « … » 74→80, défilement 78→150 avec p = bezier(0.5,0,0.2,1), compteur = round(47·p)
// (= 47 exactement à f150), moment « 47 » f150 (pulse spring 10/160, halo 150→165, ligne 47
// surlignée), sortie 198→210.
// Écarts : palette charte (jaune → ACCENT + glow, fenêtre/bulle glass, gris → MUTED), Plus Jakarta
// Sans. Tailles mobile-first : lignes 72 px (texte 44 px, numéros 44 px), prompt 44 px, titre de
// fenêtre 44 px, compteur 300 px / « idées » 88 px. Géométrie recalculée : viewport = place restante
// sous la bulle (≈ 500 px), translate = −p·(47·72 − viewport) → bas de la ligne 47 = bas du viewport
// à f150 ; le fondu de masque du bas se referme sur la fin du scroll pour que la ligne 47 soit nette.
// Largeur fixe du compteur = 2 chiffres (max 47) au lieu de 3, pour rester dans la zone 120 px.
// Halo = radial-gradient (pas de filtre blur). Respiration 165→186 (au lieu de 198).

const { fontFamily } = loadFont("normal", { weights: ["500", "600", "800"], subsets: ["latin"] });

const NAMES_35 = [
  "Dropshipping", "SaaS", "Newsletter", "Agence IA", "Ebook", "Freelancing", "Print on demand",
  "Chaîne YouTube", "Formation en ligne", "Affiliation", "Template Notion", "Coaching", "Podcast",
  "Application mobile", "Marketplace", "Traduction", "Montage vidéo", "Création de logos", "Community",
  "Revente", "Voix off IA", "Consulting", "Générateur d'images", "Chatbot", "Newsletter payante",
  "Automatisation", "Site de niche", "Réseaux sociaux", "Prompts à vendre", "Webinaire", "Micro-SaaS",
  "Boutique Etsy", "Blog SEO", "Service client IA", "Cours Udemy",
];
const NAMES_11 = [
  "Sous-titrage", "Banque d'images IA", "Gestion Instagram", "Rédaction de CV", "Sites vitrines",
  "Agence de contenu", "Newsletter locale", "Calendrier éditorial", "Audit SEO", "Miniatures YouTube",
  "Scripts vidéo",
];
const LINES = [...NAMES_35, ...NAMES_11, "Idée n°47"];

export const atmos22Anim03Schema = z.object({
  overlay: z.boolean().default(false),
  prompt: z.string().default("Donne-moi des idées de business réalistes à lancer sans budget"),
  windowTitle: z.string().default("Assistant IA"),
  lines: z.array(z.string()).length(47).default(LINES),
  counterLabel: z.string().default("idées"),
});

const DURATION = 210;
// Fenêtre (brief)
const WIN_X = 120;
const WIN_Y = 120;
const WIN_W = 1120;
const WIN_H = 840;
// Géométrie interne recalculée (mobile-first)
const TITLE_H = 84;
const PAD = 40;
const BUBBLE_TOP = TITLE_H + 30;
const BUBBLE_FONT = 44;
const BUBBLE_LH = 1.25;
const BUBBLE_PAD_Y = 22;
const BUBBLE_PAD_X = 34;
const BUBBLE_H = 2 * BUBBLE_FONT * BUBBLE_LH + 2 * BUBBLE_PAD_Y; // 2 lignes = 154
const VIEW_TOP = BUBBLE_TOP + BUBBLE_H + 30;
const VIEW_H = WIN_H - VIEW_TOP - 26;
const ROW_H = 72;
const LIST_H = 47 * ROW_H; // 3384
const SCROLL = LIST_H - VIEW_H;
// Compteur
const COUNTER_X = 1580;
const COUNTER_Y = 540;

export const Atmos22Anim03Prompt47Idees: React.FC<z.infer<typeof atmos22Anim03Schema>> = ({
  overlay,
  prompt,
  windowTitle,
  lines,
  counterLabel,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Phase 1 : fenêtre ──
  const win = spring({ frame, fps, config: { damping: 15, stiffness: 120 } });

  // ── Phase 2 : frappe ──
  const typed = Math.floor(interpolate(frame, [12, 66], [0, prompt.length], clamp));
  const cursorOn = frame >= 12 && frame < 70 && Math.floor((frame - 12) / 8) % 2 === 0;

  // ── Phase 3 : envoi ──
  const btnIn = interpolate(frame, [66, 70], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const btnClick = interpolate(frame, [70, 73, 76], [1, 0.88, 1], clamp);
  const bubbleUp = interpolate(frame, [72, 78], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const dotsOut = interpolate(frame, [79, 80], [1, 0], clamp);

  // ── Phase 4 : défilement + compteur ──
  const p = interpolate(frame, [78, 150], [0, 1], { easing: Easing.bezier(0.5, 0, 0.2, 1), ...clamp });
  const listY = -p * SCROLL;
  const listIn = interpolate(frame, [78, 84], [0, 1], clamp);
  const bottomFade = 40 * (1 - interpolate(p, [0.85, 1], [0, 1], clamp));
  const value = Math.round(47 * p);
  const counterIn = interpolate(frame, [76, 86], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  // ── Phase 5 : moment 47 ──
  const pulseCfg = { damping: 10, stiffness: 160 };
  const pulse =
    spring({ frame: frame - 150, fps, config: pulseCfg, durationInFrames: 6 }) -
    spring({ frame: frame - 156, fps, config: pulseCfg, durationInFrames: 6 });
  const counterScale = interpolate(counterIn, [0, 1], [0.9, 1]) * (1 + 0.12 * pulse);
  const counterColor = interpolateColors(frame, [150, 153], [INK, ACCENT]);
  const halo = interpolate(frame, [150, 165], [0, 1], clamp);
  const highlight = interpolate(frame, [150, 156], [0, 1], clamp);
  const breath = breathe(frame, 165, 186, 0.015);

  const exit = exitFx(frame, DURATION);

  const winOpacity = interpolate(win, [0, 1], [0, 1], clamp);
  const mask = `linear-gradient(to bottom, transparent 0px, black 40px, black calc(100% - ${bottomFade}px), transparent 100%)`;

  return (
    <Stage outFrames={0} bare={overlay}>
      {overlay && <AbsoluteFill style={{ background: "rgba(0,0,0,0.6)" }} />}
      <AbsoluteFill
        style={{
          fontFamily,
          color: INK,
          opacity: exit.opacity,
          transform: `scale(${exit.scale * breath})`,
        }}
      >
        {/* ── Fenêtre de chat ── */}
        <div
          style={{
            position: "absolute",
            left: WIN_X,
            top: WIN_Y,
            width: WIN_W,
            height: WIN_H,
            boxSizing: "border-box",
            borderRadius: 28,
            background: overlay ? "#11172B" : GLASS_BG,
            border: `1px solid ${GLASS_BORDER}`,
            boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
            overflow: "hidden",
            opacity: winOpacity,
            transform: `translateY(${interpolate(win, [0, 1], [30, 0])}px) scale(${interpolate(win, [0, 1], [0.94, 1])})`,
          }}
        >
          {/* Barre de titre */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: TITLE_H,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ position: "absolute", left: 32, display: "flex", gap: 14 }}>
              {[ATMOS_ERROR, AD_YELLOW, MONEY_GREEN].map((c) => (
                <div key={c} style={{ width: 20, height: 20, borderRadius: 10, background: c, opacity: 0.4 }} />
              ))}
            </div>
            <div style={{ fontSize: 44, fontWeight: 600, color: MUTED }}>{windowTitle}</div>
          </div>

          {/* Bulle du prompt */}
          <div
            style={{
              position: "absolute",
              right: PAD,
              top: BUBBLE_TOP,
              maxWidth: WIN_W - 2 * PAD,
              boxSizing: "border-box",
              padding: `${BUBBLE_PAD_Y}px ${BUBBLE_PAD_X}px`,
              borderRadius: 24,
              background: GLASS_CARD,
              border: `1px solid ${GLASS_BORDER}`,
              fontSize: BUBBLE_FONT,
              lineHeight: BUBBLE_LH,
              fontWeight: 500,
              opacity: interpolate(bubbleUp, [0, 1], [1, 0.85]),
              transform: `translateY(${-12 * bubbleUp}px)`,
            }}
          >
            <span>{prompt.slice(0, typed)}</span>
            <span style={{ display: "inline-block", width: 0, position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: 2,
                  bottom: -0.18 * BUBBLE_FONT,
                  color: ACCENT_LIGHT,
                  fontWeight: 600,
                  opacity: cursorOn ? 1 : 0,
                }}
              >
                |
              </span>
            </span>
            {/* Reste invisible : la mise en page de la bulle ne bouge pas pendant la frappe */}
            <span style={{ color: "transparent" }}>{prompt.slice(typed)}</span>

            {/* Bouton envoi */}
            <div
              style={{
                position: "absolute",
                right: -14,
                bottom: -26,
                width: 60,
                height: 60,
                borderRadius: 30,
                background: ACCENT,
                boxShadow: "0 0 24px rgba(48,96,255,0.55)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: btnIn,
                transform: `scale(${(0.6 + 0.4 * btnIn) * btnClick})`,
              }}
            >
              <svg width={30} height={30} viewBox="0 0 24 24" fill="none">
                <path d="M12 19V5M5 12l7-7 7 7" stroke={INK} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Points « … » */}
          <div
            style={{
              position: "absolute",
              left: PAD + 20,
              top: VIEW_TOP + 30,
              display: "flex",
              gap: 14,
              opacity: dotsOut,
            }}
          >
            {[0, 1, 2].map((k) => (
              <div
                key={k}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  background: MUTED,
                  opacity: interpolate(frame, [74 + 3 * k, 77 + 3 * k], [0, 1], clamp),
                }}
              />
            ))}
          </div>

          {/* Viewport de réponse */}
          <div
            style={{
              position: "absolute",
              left: PAD,
              right: PAD,
              top: VIEW_TOP,
              height: VIEW_H,
              overflow: "hidden",
              maskImage: mask,
              WebkitMaskImage: mask,
              opacity: listIn,
            }}
          >
            <div style={{ transform: `translateY(${listY}px)` }}>
              {lines.map((l, i) => {
                const last = i === 46;
                return (
                  <div
                    key={i}
                    style={{
                      height: ROW_H,
                      boxSizing: "border-box",
                      display: "flex",
                      alignItems: "center",
                      gap: 28,
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                      borderLeft: `4px solid ${last ? `rgba(48,96,255,${highlight})` : "transparent"}`,
                      background: last ? `rgba(48,96,255,${0.16 * highlight})` : "transparent",
                    }}
                  >
                    <div
                      style={{
                        width: 90,
                        textAlign: "right",
                        fontSize: 44,
                        fontWeight: 800,
                        color: ACCENT_LIGHT,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {i + 1}
                    </div>
                    <div style={{ fontSize: 44, fontWeight: 500, whiteSpace: "nowrap" }}>{l}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Compteur ── */}
        <div
          style={{
            position: "absolute",
            left: COUNTER_X - 270,
            top: COUNTER_Y - 270,
            width: 540,
            height: 540,
            borderRadius: 270,
            background: `radial-gradient(circle, rgba(48,96,255,${0.45 * halo}) 0%, rgba(48,96,255,${0.18 * halo}) 45%, rgba(48,96,255,0) 70%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: COUNTER_X - 280,
            width: 560,
            top: COUNTER_Y,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: counterIn,
            transform: `translateY(-50%) scale(${counterScale})`,
          }}
        >
          <div
            style={{
              fontSize: 300,
              fontWeight: 800,
              lineHeight: 1,
              width: "2ch",
              textAlign: "center",
              fontVariantNumeric: "tabular-nums",
              color: counterColor,
              textShadow:
                halo > 0
                  ? `0 0 3px rgba(136,170,255,${0.9 * halo}), 0 0 18px rgba(136,170,255,${0.6 * halo}), 0 0 60px rgba(48,96,255,${0.7 * halo})`
                  : "none",
            }}
          >
            {value}
          </div>
          <div style={{ fontSize: 88, fontWeight: 600, color: MUTED, marginTop: 8 }}>{counterLabel}</div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
