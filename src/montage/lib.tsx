// Bibliothèque de montage réutilisable (PLAYBOOK analysis/PLAYBOOK.md).
// Composants génériques pilotés par des données en secondes, pour tous les montages.
// Identité v2 « Noir & Lime » (analysis/identite-v2/charte.md, validée le 4 octobre 2026).
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";

export const { fontFamily: FONT } = loadGeist("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });
export const { fontFamily: SERIF } = loadSerif("italic", { weights: ["400"], subsets: ["latin"] });

// ─── Jetons de la charte v2 ──────────────────────────────────────────────────
export const BG = "#090b08";
export const SURFACE = "#12160f";
export const INK = "#f2f5ec";
export const INK_SOFT = "#dce3d3";
export const MUTED = "#9ba394";
export const LINE = "rgba(255,255,255,0.08)";
export const LIME = "#c6f36d";
export const LIME_DEEP = "#8dbb3a";
export const LIME_SOFT = "#1e2712";
export const GOOD = "#8ee3a1";
export const BAD = "#ff8a7a";
/** Alias historiques (l'accent unique de la charte est le lime). */
export const ACCENT = LIME;
export const ACCENT_LIGHT = LIME;
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);

export const W = 1920;
export const H = 1080;
export const FPS = 30;
export const f = (sec: number) => Math.round(sec * FPS);
export const GLASS_BG = "linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.02))";
export const GLASS_BORDER = LINE;
export const SHADOW = "0 40px 90px -30px rgba(0,0,0,0.8)";
export const TEXT_SHADOW = "0 4px 24px rgba(0,0,0,0.6)";
/** Style de carte en verre (à étaler dans `style`). */
export const glass: React.CSSProperties = {
  background: GLASS_BG,
  border: `1.5px solid ${LINE}`,
  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.07), ${SHADOW}`,
  backdropFilter: "blur(14px)",
};
export const LIME_CARD: React.CSSProperties = {
  background: "linear-gradient(140deg, #ddfb95 0%, #c6f36d 45%, #a6d64c 100%)",
  color: "#0d1208",
  boxShadow: "0 40px 80px -30px rgba(198,243,109,0.55)",
};

/** Durée de lecture minimale (règle 9 du playbook). */
export const readTime = (words: number) => Math.max(1.2, words / 2.5 + 0.5);

/** Temps courant en secondes, relatif à la Sequence englobante. */
export const useT = () => useCurrentFrame() / FPS;

/** Interpolation par paliers temporels avec easing inOut (caméras : jamais d'à-coup). */
export const keyed = (t: number, times: number[], values: number[], ease = Easing.inOut(Easing.cubic)) =>
  times.length < 2 ? values[0] : interpolate(t, times, values, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

/** Entrée/sortie douce standard : 0→1 sur `inDur`, 1→0 sur les `outDur` dernières secondes. */
export const inOut = (t: number, start: number, end: number, inDur = 0.35, outDur = 0.35) =>
  Math.min(
    interpolate(t, [start, start + inDur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE }),
    interpolate(t, [end - outDur, end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) }),
  );

// ─── Fond : noir profond, halos lime, grain ──────────────────────────────────
const GRAIN_URL =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";
/** Grain fixe à poser au-dessus de tout (rendu « cinéma »). */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.055 }) => (
  <AbsoluteFill style={{ backgroundImage: GRAIN_URL, opacity, pointerEvents: "none" }} />
);
export const Backdrop: React.FC = () => {
  const t = useT();
  const drift = Math.sin(t * 0.35) * 40; // halo qui respire lentement
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(1300px 760px at ${88 + drift / 40}% ${-12 + drift / 20}%, rgba(150,200,70,0.17), transparent 70%), radial-gradient(1000px 760px at -12% 70%, rgba(90,130,40,0.11), transparent 70%), ${BG}`,
      }}
    />
  );
};
/** Ancien nom conservé : le fond des inserts est désormais le Backdrop v2. */
export const Aurora = Backdrop;

// ─── Typographie v2 ──────────────────────────────────────────────────────────
/** Mot-signature en Instrument Serif italique. */
export const Em: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = LIME }) => (
  <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, color, letterSpacing: "-0.01em" }}>{children}</span>
);
/** « texte *mot* texte » → le mot entre astérisques passe en serif italique lime. */
export const rich = (text: string, color?: string) =>
  text.split(/(\*[^*]+\*)/).map((p, i) => (p.startsWith("*") && p.endsWith("*") ? <Em key={i} color={color}>{p.slice(1, -1)}</Em> : <React.Fragment key={i}>{p}</React.Fragment>));
export const Eyebrow: React.FC<{ children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({ children, size = 30, style }) => (
  <div style={{ fontFamily: FONT, fontSize: size, letterSpacing: "0.16em", textTransform: "uppercase", color: LIME, fontWeight: 500, ...style }}>{children}</div>
);
/** Étoile à 4 branches : le motif « IA ». */
export const Star: React.FC<{ size?: number; color?: string; spin?: number }> = ({ size = 40, color = LIME, spin = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ filter: `drop-shadow(0 0 ${size / 3}px ${color}88)`, transform: `rotate(${spin}deg)`, flexShrink: 0 }}>
    <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0Z" fill={color} />
  </svg>
);
/** Sortie de flou : 0→1 (flou 12 px → 0, y +18 → 0). Renvoie le style à appliquer. */
export const blurIn = (t: number, at: number, dur = 0.45, dy = 18): React.CSSProperties => {
  const p = keyed(t, [at, at + dur], [0, 1], EASE);
  return { opacity: p, filter: p < 1 ? `blur(${(1 - p) * 12}px)` : undefined, transform: `translateY(${(1 - p) * dy}px)` };
};

/** Apparition d'un insert : sort du flou en se posant (0,45 s), y retourne à la fin. */
export const Reveal: React.FC<{ end: number; children: React.ReactNode; inDur?: number; outDur?: number }> = ({ end, children, inDur = 0.45, outDur = 0.4 }) => {
  const t = useT();
  const a = keyed(t, [0, inDur], [0, 1], EASE);
  const b = keyed(t, [end - outDur, end], [0, 1], Easing.in(Easing.quad));
  const blur = (1 - a) * 14 + b * 10;
  return (
    <AbsoluteFill style={{ opacity: Math.min(a, 1 - b), filter: blur > 0.05 ? `blur(${blur}px)` : undefined, transform: `scale(${1.035 - 0.035 * a + 0.02 * b})` }}>
      {children}
    </AbsoluteFill>
  );
};

/** Mise au point : floute et assombrit ce qui est dessous (face cam) pour isoler une phrase. */
export const FocusVeil: React.FC<{ start: number; end: number; blur?: number; dark?: number }> = ({ start, end, blur = 16, dark = 0.6 }) => {
  const t = useT();
  const p = inOut(t, start, end, 0.5, 0.45);
  if (p <= 0) return null;
  return <AbsoluteFill style={{ backdropFilter: `blur(${blur * p}px)`, background: `rgba(9,11,8,${dark * p})` }} />;
};

// ─── Caméra sur capture d'écran ([SCREEN-STAGE]) ────────────────────────────
// Vue = (z, cx, cy) en pixels de la capture : le point (cx, cy) est au centre de l'écran,
// z = facteur d'échelle. La fenêtre de l'app (win) est découpée et posée sur le fond v2,
// coins arrondis constants. Les clés sont interpolées en ease-in-out (z en log).
// v2 : la fenêtre peut arriver inclinée en perspective (`tilt`) et se redresser.
export type ViewKey = { t: number; z: number; cx: number; cy: number };
export type TiltKey = { t: number; rx: number; ry: number };
/** Zone floutée : temps relatifs à la Sequence de l'écran, coordonnées en pixels de la capture. */
export type BlurMask = { from: number; to: number; x: number; y: number; w: number; h: number };
export const WIN_DEFAULT = { x: 104, y: 54, w: 1712, h: 971 }; // mesuré sur la capture AIsa

export const ScreenStage: React.FC<{
  src: string;
  trimBefore: number; // secondes dans le fichier source au début de la Sequence
  keys: ViewKey[];
  win?: { x: number; y: number; w: number; h: number };
  dim?: (t: number) => number; // assombrissement 0..1 (pour spotlight / stat)
  blur?: (t: number) => number; // flou de mise au point en px (chiffre héros posé dessus)
  tilt?: TiltKey[]; // inclinaison 3D (degrés), redressée au fil des clés
  masks?: BlurMask[]; // zones floutées (données personnelles), en pixels de la capture
  free?: boolean; // pas de recentrage automatique : (cx, cy) placent librement la zone (ex. panneau à gauche, carte à droite)
}> = ({ src, trimBefore, keys, win = WIN_DEFAULT, dim, blur, tilt, masks = [], free }) => {
  const t = useT();
  const ts = keys.map((k) => k.t);
  const z = Math.exp(keyed(t, ts, keys.map((k) => Math.log(k.z))));
  // La caméra ne sort jamais de la fenêtre quand le zoom remplit l'écran (sinon : centrée)
  const clampAxis = (c: number, a0: number, len: number, screen: number) => {
    const half = screen / (2 * z);
    return len * z >= screen ? Math.min(Math.max(c, a0 + half), a0 + len - half) : a0 + len / 2;
  };
  const rawCx = keyed(t, ts, keys.map((k) => k.cx));
  const rawCy = keyed(t, ts, keys.map((k) => k.cy));
  const cx = z < 1 || free ? rawCx : clampAxis(rawCx, win.x, win.w, W);
  const cy = z < 1 || free ? rawCy : clampAxis(rawCy, win.y, win.h, H);
  const left = W / 2 + (win.x - cx) * z;
  const top = H / 2 + (win.y - cy) * z;
  const d = dim ? dim(t) : 0;
  const bl = blur ? blur(t) : 0;
  const rx = tilt ? keyed(t, tilt.map((k) => k.t), tilt.map((k) => k.rx), EASE) : 0;
  const ry = tilt ? keyed(t, tilt.map((k) => k.t), tilt.map((k) => k.ry), EASE) : 0;
  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{ perspective: 2400, filter: bl > 0.05 ? `blur(${bl}px)` : undefined }}>
        <div style={{ position: "absolute", inset: 0, transform: `rotateX(${rx}deg) rotateY(${ry}deg)`, transformOrigin: "50% 50%" }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: win.w,
              height: win.h,
              transformOrigin: "0 0",
              transform: `translate(${left}px, ${top}px) scale(${z})`,
              borderRadius: 28 / z,
              overflow: "hidden",
              border: z < 1.02 ? `${1.5 / z}px solid ${LINE}` : undefined,
              boxShadow: z < 1.02 ? "0 60px 120px -30px rgba(0,0,0,0.85)" : "none",
            }}
          >
            <OffthreadVideo
              src={staticFile(src)}
              trimBefore={f(trimBefore)}
              muted
              style={{ position: "absolute", left: -win.x, top: -win.y, width: W, height: H, maxWidth: "none", maxHeight: "none" }}
            />
            {masks
              .filter((m) => t >= m.from && t < m.to)
              .map((m, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: m.x - win.x,
                    top: m.y - win.y,
                    width: m.w,
                    height: m.h,
                    borderRadius: 10,
                    backdropFilter: "blur(14px) saturate(0.6)",
                    background: "rgba(140,140,140,0.18)",
                  }}
                />
              ))}
          </div>
        </div>
      </AbsoluteFill>
      {d > 0 && <AbsoluteFill style={{ background: `rgba(9,11,8,${0.7 * d})` }} />}
    </AbsoluteFill>
  );
};

// ─── Face cam : faux multicam + push-in + étalonnage ([FAUX-MULTICAM]) ──────
export type FaceShot = { from: number; to: number; z: [number, number]; at: [number, number] };
export const FaceCam: React.FC<{
  src: string;
  trimBefore: number;
  shots?: FaceShot[];
  /** Zoom progressif continu (retour Ibrahim : aucun saut de cadrage) — prioritaire sur `shots`. */
  zoomKeys?: { t: number; z: number }[];
  face: { x: number; y: number };
  grade?: string;
}> = ({ src, trimBefore, shots = [], zoomKeys, face, grade = "brightness(1.10) contrast(1.05) saturate(1.06)" }) => {
  const t = useT();
  let z: number;
  let sh: FaceShot;
  if (zoomKeys) {
    z = Math.exp(keyed(t, zoomKeys.map((k) => k.t), zoomKeys.map((k) => Math.log(k.z)), Easing.inOut(Easing.sin)));
    sh = { from: 0, to: 1, z: [z, z], at: [face.x, face.y] };
  } else {
    sh = shots.find((s) => t >= s.from && t < s.to) ?? shots[shots.length - 1];
    const p = interpolate(t, [sh.from, sh.to], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
    z = sh.z[0] + (sh.z[1] - sh.z[0]) * p;
  }
  const half = 1 / (2 * z);
  const cx = Math.min(Math.max(face.x - (sh.at[0] - 0.5) / z, half), 1 - half);
  const cy = Math.min(Math.max(face.y - (sh.at[1] - 0.5) / z, half), 1 - half);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "black" }}>
      <OffthreadVideo
        src={staticFile(src)}
        trimBefore={f(trimBefore)}
        muted
        style={{ width: W, height: H, transform: `scale(${z}) translate(${(0.5 - cx) * W}px, ${(0.5 - cy) * H}px)`, filter: grade }}
      />
    </AbsoluteFill>
  );
};

// ─── Textes ─────────────────────────────────────────────────────────────────
export type Word = { w: string; t: number; hl?: boolean };

/** Phrase-clé mot à mot ([KCAP]/[KEYLINE]) — t relatifs à la Sequence.
 *  v2 : chaque mot sort du flou ; les mots `hl` passent en serif italique lime.
 *  `valign="center"` pour une phrase-thèse seule à l'écran (avec FocusVeil dessous). */
export const KeyLine: React.FC<{
  words: Word[];
  end: number;
  size?: number;
  align?: "center" | "left" | "right";
  bottom?: number;
  maxWidth?: number;
  underline?: boolean; // v1 (ignoré en v2 : le serif italique remplace le soulignement)
  valign?: "bottom" | "center";
}> = ({ words, end, size = 96, align = "center", bottom = 120, maxWidth = 1500, valign = "bottom" }) => {
  const t = useT();
  const out = keyed(t, [end - 0.4, end], [0, 1], Easing.in(Easing.quad));
  const justify = align === "center" ? "center" : align === "left" ? "flex-start" : "flex-end";
  return (
    <AbsoluteFill
      style={{
        justifyContent: valign === "center" ? "center" : "flex-end",
        alignItems: justify,
        padding: valign === "center" ? "0 140px" : `0 110px ${bottom}px`,
        opacity: 1 - out,
        filter: out > 0.02 ? `blur(${out * 10}px)` : undefined,
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", columnGap: size * 0.26, rowGap: size * 0.05, justifyContent: justify, maxWidth }}>
        {words.map((wd, i) => (
          <span
            key={i}
            style={{
              fontFamily: wd.hl ? SERIF : FONT,
              fontStyle: wd.hl ? "italic" : "normal",
              fontWeight: wd.hl ? 400 : 500,
              fontSize: wd.hl ? size * 1.08 : size,
              letterSpacing: wd.hl ? "-0.01em" : "-0.035em",
              lineHeight: 1.08,
              color: wd.hl ? LIME : INK,
              textShadow: TEXT_SHADOW,
              display: "inline-block",
              ...blurIn(t, wd.t),
            }}
          >
            {wd.w}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** Pastille de verre (étiquettes, contexte). `dot` = petite pastille de couleur (marque). */
export const Pill: React.FC<{ children: React.ReactNode; size?: number; style?: React.CSSProperties; accent?: boolean; dot?: string }> = ({ children, size = 44, style, accent, dot }) => (
  <div
    style={{
      ...(accent ? LIME_CARD : glass),
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.38,
      padding: `${size * 0.42}px ${size * 0.74}px`,
      borderRadius: 999,
      fontFamily: FONT,
      fontWeight: 500,
      fontSize: size,
      letterSpacing: "-0.015em",
      color: accent ? "#0d1208" : INK,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {dot && <span style={{ width: size * 0.4, height: size * 0.4, borderRadius: 999, background: dot, boxShadow: `0 0 ${size * 0.35}px ${dot}`, flexShrink: 0 }} />}
    {children}
  </div>
);

/** Chiffre héros en roulette ([STAT]) : la valeur défile puis se fige.
 *  v2 : sur-titre lime (context), chiffre Geist 500, légende avec *mot* en serif italique. */
export const Stat: React.FC<{
  value: number;
  start: number; // s (relatif)
  end: number;
  label: string;
  context?: string;
  format?: (n: number) => string;
  size?: number;
}> = ({ value, start, end, label, context, format = (n) => Math.round(n).toLocaleString("fr-FR"), size = 300 }) => {
  const t = useT();
  const o = inOut(t, start, end, 0.3);
  const roll = keyed(t, [start, start + 1.0], [0, 1], Easing.out(Easing.cubic));
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: o, fontFamily: FONT, color: INK, textAlign: "center" }}>
      <AbsoluteFill style={{ background: "radial-gradient(900px 600px at 50% 48%, rgba(198,243,109,0.12), transparent 70%)" }} />
      {context && <Eyebrow style={{ ...blurIn(t, start, 0.5), position: "relative" }}>{context}</Eyebrow>}
      <div style={{ position: "relative", fontSize: size, fontWeight: 500, letterSpacing: "-0.045em", lineHeight: 1, marginTop: 8, textShadow: "0 0 80px rgba(198,243,109,0.25)", fontVariantNumeric: "tabular-nums", ...blurIn(t, start, 0.4, 24) }}>
        {format(value * roll)}
      </div>
      <div style={{ position: "relative", fontSize: 66, fontWeight: 400, color: INK_SOFT, letterSpacing: "-0.02em", marginTop: 6, ...blurIn(t, start + 0.35) }}>{rich(label)}</div>
    </AbsoluteFill>
  );
};

/** Carton d'étape ([CHAPTER]) : ✦, sur-titre « Étape n sur N », titre avec *mot* en serif. */
export const ChapterCard: React.FC<{ n?: number; total?: number; title: string; end: number; size?: number; eyebrow?: string }> = ({ n, total, title, end, size = 210, eyebrow }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.01, 0.45);
  const line = keyed(t, [0.7, 1.2], [0, 1], EASE);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Backdrop />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 26, fontFamily: FONT, color: INK }}>
        <div style={blurIn(t, 0.05)}>
          <Star size={64} spin={(1 - keyed(t, [0, 0.8], [0, 1], EASE)) * -90} />
        </div>
        <Eyebrow size={36} style={blurIn(t, 0.2)}>
          {eyebrow ?? `Étape ${n} sur ${total}`}
        </Eyebrow>
        <div style={{ fontSize: size, fontWeight: 500, letterSpacing: "-0.05em", lineHeight: 1.02, maxWidth: 1700, textAlign: "center", ...blurIn(t, 0.35, 0.55, 26) }}>{rich(title, INK)}</div>
        <div style={{ width: 120 * line, height: 4, borderRadius: 2, background: LIME, marginTop: 20, boxShadow: `0 0 20px ${LIME}` }} />
      </AbsoluteFill>
      <Grain />
    </AbsoluteFill>
  );
};

// ─── Son ────────────────────────────────────────────────────────────────────
// Kit validé par Ibrahim (public/sfx) : pic de chaque son en secondes (public/sfx/_analyse.json).
// Kit SFX Epidemic Sound (public/epidemic/hq, PLAYBOOK §5bis). peak = instant du pic (s),
// gain calé pour que chaque famille sorte au même niveau effectif que l'ancien kit validé.
export const SFX_KIT = {
  whoosh01: { file: "whoosh_01.mp3", peak: 0.42, gain: 0.339 },
  whoosh02: { file: "whoosh_02.mp3", peak: 0.48, gain: 0.302 },
  whoosh03: { file: "whoosh_03.mp3", peak: 0.29, gain: 0.359 },
  whoosh05: { file: "whoosh_05.mp3", peak: 0.29, gain: 0.211 },
  impactBig: { file: "impact_big.mp3", peak: 0.06, gain: 0.245 },
  impactDeep: { file: "impact_deep.mp3", peak: 0.11, gain: 0.232 },
  impactHitLow: { file: "impact_hit_low.mp3", peak: 0.66, gain: 0.457 },
  impactLowHit: { file: "impact_low_hit.mp3", peak: 0.24, gain: 0.75 },
  riserClean: { file: "riser_clean.mp3", peak: 2.79, gain: 1.0 },
  riserReverse: { file: "riser_reverse.mp3", peak: 1.9, gain: 0.543 },
  riserSuspense: { file: "riser_suspense.mp3", peak: 2.57, gain: 0.55 },
  riserWhoosh: { file: "riser_whoosh.mp3", peak: 2.66, gain: 0.794 },
  popNotif02: { file: "pop_notif_02.mp3", peak: 0.09, gain: 0.923 },
  popNotif03: { file: "pop_notif_03.mp3", peak: 0.03, gain: 0.851 },
  popNotif12: { file: "pop_notif_12.mp3", peak: 0.08, gain: 0.596 },
  popSelectA: { file: "pop_select_a.mp3", peak: 0.03, gain: 0.741 },
  popSelectB: { file: "pop_select_b.mp3", peak: 0.03, gain: 0.741 },
  clickA: { file: "click_a.mp3", peak: 0.01, gain: 0.881 },
  clickB: { file: "click_b.mp3", peak: 0.01, gain: 0.804 },
  clickKey: { file: "click_key.mp3", peak: 0.03, gain: 0.822 },
  clickNotif05: { file: "click_notif_05.mp3", peak: 0.03, gain: 0.7 },
  confirmAchievement: { file: "confirm_achievement.mp3", peak: 0.06, gain: 0.785 },
  confirmAlert03: { file: "confirm_alert_03.mp3", peak: 0.05, gain: 0.767 },
  confirmAlert07: { file: "confirm_alert_07.mp3", peak: 0.08, gain: 1.0 },
  confirmNotif13: { file: "confirm_notif_13.mp3", peak: 0.05, gain: 0.861 },
  dronePadSub: { file: "drone_pad_sub.mp3", peak: 4.45, gain: 0.525 },
} as const;

// Musiques Epidemic par partie (LUFS intégrés mesurés). musicGain() → ≈ −29 LUFS, ~13 dB sous la voix (−16).
export const MUSIC = {
  hook: { file: "m0_hook_mistaken_identity.mp3", lufs: -11.3 },
  preuve: { file: "m1_preuve_radar_focus.mp3", lufs: -12.5 },
  outils: { file: "m2_outils_open_road.mp3", lufs: -11.4 },
  rapport: { file: "m3_rapport_domestic.mp3", lufs: -12.9 },
  seo: { file: "m4_seo_luxx.mp3", lufs: -11.9 },
  clients: { file: "m5_clients_exile.mp3", lufs: -11.9 },
} as const;
export const musicGain = (k: keyof typeof MUSIC, target = -29) => Math.pow(10, (target - MUSIC[k].lufs) / 20);
export type SfxCue = { k: keyof typeof SFX_KIT; at: number; gain?: number };

export const SfxTrack: React.FC<{ cues: SfxCue[] }> = ({ cues }) => (
  <>
    {cues.map((c, i) => {
      const s = SFX_KIT[c.k];
      return (
        <Sequence key={i} from={Math.max(0, f(c.at - s.peak))} layout="none">
          <Audio src={staticFile(`epidemic/hq/${s.file}`)} volume={c.gain ?? s.gain} />
        </Sequence>
      );
    })}
  </>
);

// ─── « Le Glissé » : face cam plein cadre ⇄ médaillon de verre en bas à droite ─
// keys : p = 0 plein cadre, 1 médaillon (interpolé en EASE, trajectoire légèrement courbe).
export type PipKey = { t: number; p: number };
export const PIP_RECT = { x: 1432, y: 702, w: 440, h: 330 };
export const FacePip: React.FC<{
  src: string;
  trimBefore: number;
  keys: PipKey[];
  face: { x: number; y: number };
  zoomKeys?: { t: number; z: number }[];
  pipScale?: number; // échelle de la vidéo dans le médaillon
  grade?: string;
}> = ({ src, trimBefore, keys, face, zoomKeys = [{ t: 0, z: 1 }], pipScale = 0.5, grade = "brightness(1.10) contrast(1.05) saturate(1.06)" }) => {
  const t = useT();
  const p = keyed(t, keys.map((k) => k.t), keys.map((k) => k.p), EASE);
  const pc = keyed(t, keys.map((k) => k.t), keys.map((k) => k.p), Easing.inOut(Easing.sin)); // 2e axe : trajectoire courbe
  const z = zoomKeys.length > 1 ? Math.exp(keyed(t, zoomKeys.map((k) => k.t), zoomKeys.map((k) => Math.log(k.z)), Easing.inOut(Easing.sin))) : zoomKeys[0].z;
  // Plein cadre (comme FaceCam) : le point (cx, cy) de la source est au centre de l'écran
  const half = 1 / (2 * z);
  const cx = Math.min(Math.max(face.x, half), 1 - half);
  const cy = Math.min(Math.max(face.y, half), 1 - half);
  const off0 = { x: W / 2 - cx * W * z, y: H / 2 - cy * H * z };
  // Médaillon : visage centré dans la carte, sans laisser de bord vide
  const R = PIP_RECT;
  const k1 = pipScale;
  const off1 = {
    x: Math.min(0, Math.max(R.w - W * k1, R.w / 2 - face.x * W * k1)),
    y: Math.min(0, Math.max(R.h - H * k1, R.h / 2 - face.y * H * k1)),
  };
  const lerp = (a: number, b: number, q: number) => a + (b - a) * q;
  const card = { x: lerp(0, R.x, p), y: lerp(0, R.y, pc), w: lerp(W, R.w, p), h: lerp(H, R.h, p) };
  const k = lerp(z, k1, p);
  const off = { x: lerp(off0.x, off1.x, p), y: lerp(off0.y, off1.y, p) };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: card.x,
          top: card.y,
          width: card.w,
          height: card.h,
          overflow: "hidden",
          borderRadius: 32 * p,
          border: p > 0.02 ? `1.5px solid rgba(255,255,255,${0.14 * p})` : undefined,
          boxShadow: p > 0.02 ? `0 30px 70px -20px rgba(0,0,0,${0.75 * p})` : undefined,
          background: "black",
        }}
      >
        <OffthreadVideo
          src={staticFile(src)}
          trimBefore={f(trimBefore)}
          muted
          style={{ position: "absolute", left: off.x, top: off.y, width: W * k, height: H * k, maxWidth: "none", maxHeight: "none", filter: grade }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ─── Pastille de chapitre permanente ([CHAPTER-PILL]) : en haut à gauche ────────
export const ChapterPill: React.FC<{ n: number; total: number; title: string; end: number }> = ({ n, total, title, end }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.5, 0.4);
  return (
    <div style={{ position: "absolute", left: 44, top: 36, opacity: o, transform: `translateY(${(1 - o) * -10}px)` }}>
      <div style={{ ...glass, background: "linear-gradient(180deg, rgba(18,22,15,0.9), rgba(18,22,15,0.8))", borderRadius: 999, padding: "14px 26px", display: "flex", alignItems: "center", gap: 16, fontFamily: FONT }}>
        <span style={{ fontSize: 26, letterSpacing: "0.14em", textTransform: "uppercase", color: LIME, fontWeight: 500 }}>Étape {n}/{total}</span>
        <span style={{ width: 1, height: 24, background: LINE }} />
        <span style={{ fontSize: 30, color: INK, fontWeight: 500, letterSpacing: "-0.01em" }}>{title}</span>
        <span style={{ display: "flex", gap: 5, marginLeft: 6 }}>
          {Array.from({ length: total }, (_, i) => (
            <span key={i} style={{ width: 18, height: 5, borderRadius: 3, background: i < n ? LIME : "rgba(255,255,255,0.18)" }} />
          ))}
        </span>
      </div>
    </div>
  );
};
