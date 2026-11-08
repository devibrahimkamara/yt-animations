// Montage « J'ai cloné l'influenceur IA qui a fait 100 millions de vues » (Higgsfield, sponsorisé).
// Base : le cut du monteur (Higgsfield INFLU.mp4), dont la liste de coupes a été reconstituée depuis les rushes
// (montages/higgs-influ2/00bis-monteur/edl_monteur.json) → face cam et capture séparées, + 4 micro-coupes de notre part.
// Timeline T (s) = cut du monteur moins les micro-coupes. Illustrations : captures réelles (choix d'Ibrahim).
import React from "react";
import { AbsoluteFill, Audio, interpolate, OffthreadVideo, Sequence, staticFile } from "remotion";
import { Backdrop, blurIn, ChapterPill, Eyebrow, f, FacePip, FocusVeil, FONT, glass, Grain, INK, inOut, KeyLine, MUTED, rich, ScreenStage, SFX_KIT, SfxTrack, Star, useT, type SfxCue } from "../montage/lib";
import { TopPill, TutoMap } from "../montage/Explainers";
import { Scrim, TwoPills } from "../MontageHostinger/Hook";
import { mixGain, type MixEvent } from "../montage/mix";
import { CUTS } from "./cuts";
import { Caption, FanClips, FullClip, PanShot, PlayerCard, SettingsCard, SideBySide, TransferCard, type Attr } from "./Illus";

// Coupes de rythme (cuts.ts) : tous les temps du fichier sont écrits en T d'origine et convertis par T().
const fr30 = (x: number) => Math.round(x * 30) / 30;
const CUT = CUTS.map(([a, b]) => [fr30(a), fr30(b)] as [number, number]);
export const T = (x: number) => {
  let s = 0;
  for (const [a, b] of CUT) {
    if (x >= b) s += b - a;
    else if (x > a) return a - s;
  }
  return x - s;
};
export const FULL_DURATION = T(594.37);
const D = "montage/higgs-influ2";
const FACE = `${D}/face_v2.mp4`;
const SCREEN = `${D}/screen_v2.mp4`;
const FACE_POS = { x: 0.5, y: 0.36 };
const GRADE = "brightness(1.12) contrast(1.05) saturate(1.04)";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
// from / to en T d'origine
const At: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => (
  <Sequence from={f(T(from))} durationInFrames={Math.max(1, f(T(to) - T(from)))} layout="none">
    <AbsoluteFill>{children}</AbsoluteFill>
  </Sequence>
);

// Bascules face cam ↔ écran (choix du monteur), en temps T
const SCREEN_1: [number, number] = [112.91, 304.11];
const SCREEN_2: [number, number] = [368.2, 472.91]; // 341,5 → 368,2 : liste du Finder, remplacée par la vraie vidéo d'Ibrahim
const pipKeys = () => {
  const k: { t: number; p: number }[] = [{ t: 0, p: 0 }];
  for (const [a, b] of [SCREEN_1, SCREEN_2]) k.push({ t: T(a) - 0.1, p: 0 }, { t: T(a) + 0.8, p: 1 }, { t: T(b) - 0.8, p: 1 }, { t: T(b) + 0.1, p: 0 });
  return k;
};

const Dim: React.FC<{ start: number; end: number; k?: number }> = ({ start, end, k = 0.7 }) => {
  const t = useT();
  return <AbsoluteFill style={{ background: `rgba(9,11,8,${k * inOut(t, start, end, 0.3, 0.35)})` }} />;
};
// ─── Vidéo générée (verticale) posée au centre : exigence du brief (au moins une variation à l'écran) ───
const GenClip: React.FC<{ src: string; end: number; label: string }> = ({ src, end, label }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const b = blurIn(t, 0, 0.5, 30);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: "rgba(9,11,8,0.72)" }} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 70, fontFamily: FONT }}>
        <div style={{ ...glass, padding: 10, borderRadius: 30, background: "rgba(18,22,15,0.92)", ...b }}>
          <OffthreadVideo src={staticFile(src)} muted style={{ width: 486, height: 864, borderRadius: 22, display: "block", objectFit: "cover" }} />
        </div>
        <div style={{ marginTop: 22, fontSize: 46, color: INK, ...blurIn(t, 0.4) }}>{rich(label)}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Carte d'information (règle, mise en garde) ───
const InfoCard: React.FC<{ eyebrow: string; title: string; meta?: string; start: number; end: number; warn?: boolean }> = ({ eyebrow, title, meta, start, end, warn }) => {
  const t = useT();
  const o = inOut(t, start, end, 0.01, 0.35);
  const b = blurIn(t, start, 0.5, 26);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: o }}>
      <div style={{ ...glass, background: "linear-gradient(180deg, rgba(18,22,15,0.95), rgba(18,22,15,0.9))", borderRadius: 40, padding: "44px 60px", maxWidth: 1300, fontFamily: FONT, border: `2px solid ${warn ? "#ff8a7a" : "rgba(255,255,255,0.1)"}`, ...b, opacity: Math.min(o, Number(b.opacity)) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {warn ? <span style={{ fontSize: 34 }}>⚠️</span> : <Star size={32} />}
          <Eyebrow size={30} style={warn ? { color: "#ff8a7a" } : undefined}>{eyebrow}</Eyebrow>
        </div>
        <div style={{ fontSize: 72, fontWeight: 500, color: INK, letterSpacing: "-0.03em", lineHeight: 1.1, marginTop: 18 }}>{rich(title)}</div>
        {meta && <div style={{ fontSize: 36, color: MUTED, marginTop: 18 }}>{rich(meta)}</div>}
      </div>
    </AbsoluteFill>
  );
};

// ─── Carte joueur : choix du Character Builder (temps T d'origine = mot prononcé). Valeurs = celles de l'interface. ───
const ATTRS: Attr[] = [
  { k: "Caractère", v: "Bold", at: 147.75 },
  { k: "Genre", v: "Homme", at: 148.79 },
  { k: "Corps", v: "Athlétique", at: 166.99 },
  { k: "Coiffure", v: "Side coil", at: 187.61 },
  { k: "Cheveux", v: "Brun foncé", at: 197.45 },
  { k: "Style", v: "Rétro", at: 204.37 },
  { k: "Origine", v: "Africaine", at: 209.05 },
  { k: "Âge", v: "Adulte", at: 211.27 },
  { k: "Peau", v: "Foncée", at: 218.75 },
  { k: "Taille", v: "Grand", at: 221.45 },
  { k: "Épaules", v: "Larges", at: 226.39 },
  { k: "Tête", v: "Carrée", at: 233.55 },
  { k: "Yeux", v: "Verts", at: 245.07 },
  { k: "Dents", v: "Écartées", at: 252.09 },
  { k: "Nez", v: "Pansement", at: 262.33 },
  { k: "Bijoux", v: "Oui", at: 269.21 },
];
const PANEL: [number, number] = [126.9, 276.27];
// Démo 2 (Genjutsu) : deux passages « panneau + fiche de réglages »
const P2A: [number, number] = [389.2, 412.9];
const P2B: [number, number] = [446.8, 468.3];
const SET_A = [
  { k: "Référence", v: "ma *vraie* vidéo", at: 384.95 },
  { k: "Personnage", v: "mon influenceur", at: 395.61 },
  { k: "Style", v: "inchangé", at: 404.55 },
  { k: "Prompt", v: "aucun", at: 405.67 },
  { k: "Modèle", v: "Genjutsu", at: 407.21 },
  { k: "Qualité", v: "720p", at: 409.41 },
];
const SET_B = [
  { k: "Mouvement", v: "la *même* vidéo", at: 450.35 },
  { k: "Personnage", v: "le *même*", at: 452.93 },
  { k: "Style", v: "au choix", at: 455.53 },
  { k: "Prompt", v: "« Change l'arrière-plan »", at: 463.83 },
];
const PANEL2_WIN = { x: 136, y: 110, w: 354, h: 840 };
const PANEL2_VIEW = { z: PZ2(), cx: 136 + (960 - 80) / PZ2(), cy: 110 + (540 - 57) / PZ2() };
function PZ2() { return 1.15; } // démo : panneau du Character Builder en grand + carte joueur
const GEN_AT = 271.85;
const REVEAL_AT = 276.41;

// Texte en grand à côté d'une vidéo plein cadre
const SideText: React.FC<{ lines: { text: string; at: number; size?: number }[]; end: number; x: number }> = ({ lines, end, x }) => {
  const t = useT();
  return (
    <AbsoluteFill style={{ justifyContent: "center", paddingLeft: x, fontFamily: FONT, opacity: inOut(t, 0, end, 0.01, 0.3) }}>
      {lines.map((l, i) => (
        <div key={i} style={{ fontSize: l.size ?? 110, color: INK, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: 26, textShadow: "0 6px 40px rgba(0,0,0,0.8)", ...blurIn(t, l.at, 0.45, 26) }}>
          {rich(l.text)}
        </div>
      ))}
    </AbsoluteFill>
  );
};

const SFX_T: SfxCue[] = [
  { k: "whoosh01", at: 0.05 },
  { k: "impactDeep", at: 1.62, gain: 0.5 },
  { k: "whoosh02", at: 4.3 },
  { k: "popSelectA", at: 5.9 },
  { k: "whoosh03", at: 7.5 },
  { k: "whoosh02", at: 10.56 },
  { k: "popSelectB", at: 14.6, gain: 0.5 },
  { k: "popSelectA", at: 17.04, gain: 0.5 },
  { k: "whoosh03", at: 24.2 },
  { k: "popSelectA", at: 31.8 },
  { k: "popSelectB", at: 34.2 },
  { k: "impactHitLow", at: 38.22, gain: 0.55 },
  { k: "whoosh03", at: 42.2 },
  { k: "popSelectA", at: 52.7 },
  { k: "clickNotif05", at: 62.9, gain: 0.6 },
  { k: "whoosh02", at: 74.9 },
  { k: "whoosh01", at: 87.9 },
  { k: "impactDeep", at: 102.33, gain: 0.45 },
  { k: "whoosh01", at: 112.8 },
  { k: "whoosh03", at: 126.9 },
  ...ATTRS.map((a) => ({ k: "popSelectA" as const, at: a.at, gain: 0.28 })),
  { k: "riserClean", at: REVEAL_AT, gain: 0.35 },
  { k: "confirmAchievement", at: REVEAL_AT + 0.1, gain: 0.5 },
  { k: "whoosh02", at: 278.75 },
  { k: "whoosh03", at: 304.0 },
  { k: "whoosh02", at: 313.2 },
  ...SET_A.map((r) => ({ k: "popSelectA" as const, at: Math.max(r.at, P2A[0] + 0.6), gain: 0.28 })),
  { k: "clickA", at: 411.93, gain: 0.5 },
  { k: "confirmAchievement", at: 415.45, gain: 0.45 },
  { k: "whoosh01", at: 433.9 },
  ...SET_B.map((r) => ({ k: "popSelectA" as const, at: r.at, gain: 0.28 })),
  { k: "clickA", at: 466.45, gain: 0.5 },
  { k: "whoosh02", at: 337.3 },
  { k: "whoosh03", at: 350.9 },
  { k: "whoosh01", at: 368.1 },
  { k: "whoosh03", at: 426.7 },
  { k: "whoosh01", at: 472.8 },
  { k: "whoosh03", at: 484.7 },
  { k: "whoosh02", at: 489.5 },
  { k: "popNotif02", at: 491.9, gain: 0.6 },
  { k: "whoosh02", at: 504.6 },
  { k: "confirmAlert07", at: 510.7, gain: 0.5 },
  { k: "whoosh03", at: 535.5 },
  { k: "whoosh02", at: 539.6 },
  { k: "popSelectA", at: 546.33, gain: 0.5 },
  { k: "popSelectA", at: 549.0, gain: 0.5 },
  { k: "whoosh02", at: 555.3 },
  { k: "popSelectA", at: 560.1, gain: 0.5 },
  { k: "whoosh03", at: 563.8 },
  { k: "impactHitLow", at: 571.39, gain: 0.5 },
  { k: "popNotif02", at: 581.5, gain: 0.6 },
];
// Retour d'Ibrahim (6 oct.) : effets trop forts → −4,5 dB partout, −7,5 dB dans le hook (déjà chargé en images)
const SFX: SfxCue[] = SFX_T.map((c) => ({ ...c, at: T(c.at), gain: (c.gain ?? SFX_KIT[c.k].gain) * (c.at < 19.8 ? 0.42 : 0.6) }));

// ─── Musique + mixage (PLAYBOOK §5ter). Voix normalisée à −16 LUFS (voice_v3), lit de musique ≈ 17 dB dessous. Temps T d'origine. ───
const PARTS = [
  { file: "m0_signal_containment.mp3", from: 0, to: 75.0, lufs: -32, fadeIn: 0.4, fadeOut: 1.6 },
  { file: "m1_unfinished_stories.mp3", from: 76.4, to: 304.11, lufs: -33, fadeIn: 2.0, fadeOut: 1.8 },
  { file: "m2_mindscape.mp3", from: 305.4, to: 484.8, lufs: -33, fadeIn: 1.5, fadeOut: 1.6 },
  { file: "m3_estimations.mp3", from: 486.2, to: 594.37, lufs: -33, fadeIn: 1.5, fadeOut: 1.2 },
];
export const MUSIC_LUFS: Record<string, number> = { "m0_signal_containment.mp3": -9.7, "m1_unfinished_stories.mp3": -12.0, "m2_mindscape.mp3": -13.8, "m3_estimations.mp3": -15.2 };
const MIX_T: MixEvent[] = [
  { k: "stop", at: 37.45, back: 38.2, fadeOut: 0.12, fadeIn: 1.0 }, // « spoiler… » silence, puis « c'est de l'IA » + impact
  { k: "swell", from: 0.3, to: 4.2, db: 2 }, // ouverture : la vidéo de Jean Phil, sans mot dense
  { k: "dip", from: 10.56, to: 19.7, db: 2 }, // le compte copieur : on écoute les chiffres
  { k: "stop", at: 19.78, back: 20.5, fadeOut: 0.1, fadeIn: 0.8 }, // « Et dans cette vidéo je vais te montrer… » : promesse
  { k: "dip", from: 41.5, to: 44.2, db: 4 }, // « quand tu analyses de près… 5 éléments »
  { k: "swell", from: 44.3, to: 47.5, db: 2 }, // la recette s'affiche
  { k: "dip", from: 52.6, to: 62.8, db: 3 }, // le partenaire : message sponsor bien audible
  { k: "dip", from: 84.0, to: 87.6, db: 6 }, // « le point que 90 % des gens manquent »
  { k: "stop", at: 102.3, back: 103.5, fadeOut: 0.1, fadeIn: 0.9 }, // « Alors que Jean Phil… » : il sort du lot
  { k: "dip", from: PANEL[0], to: GEN_AT, db: 3 }, // manipulation dense : la musique s'efface un peu plus
  { k: "stop", at: REVEAL_AT - 0.05, back: REVEAL_AT + 0.5, fadeOut: 0.1, fadeIn: 0.5 }, // révélation du personnage
  { k: "swell", from: REVEAL_AT + 0.5, to: 279.5, db: 3 },
  { k: "swell", from: 313.4, to: 315.5, db: 2 }, // le shadowboxing apparaît
  { k: "stop", at: 341.55, back: 342.6, fadeOut: 0.12, fadeIn: 1.0 }, // « …je me suis moi-même filmé »
  { k: "dip", from: P2A[0], to: 412.0, db: 3 }, // réglages
  { k: "stop", at: 415.35, back: 416.0, fadeOut: 0.1, fadeIn: 0.6 }, // le résultat
  { k: "swell", from: 416.0, to: 420.5, db: 3 },
  { k: "stop", at: 426.7, back: 428.3, fadeOut: 0.5, fadeIn: 1.2 }, // passage à l'ingrédient 3
  { k: "swell", from: 434.2, to: 446.5, db: 2 }, // Jean Phil, décors différents
  { k: "dip", from: P2B[0], to: 466.4, db: 3 },
  { k: "stop", at: 469.25, back: 469.8, fadeOut: 0.1, fadeIn: 0.5 }, // la variation dans l'espace
  { k: "swell", from: 469.8, to: 472.6, db: 3 },
  { k: "dip", from: 505.05, to: 517.0, db: 4 }, // « malheureusement, ce mystère va disparaître » : la règle Instagram
  { k: "stop", at: 536.25, back: 537.9, fadeOut: 0.4, fadeIn: 1.0 }, // passage à l'ingrédient 5
  { k: "swell", from: 539.7, to: 541.8, db: 2 },
  { k: "stop", at: 570.1, back: 572.4, fadeOut: 0.15, fadeIn: 1.2 }, // « malheureusement, la crypto s'est effondrée »
  { k: "dip", from: 581.4, to: 588.3, db: 3 }, // le lien : bien audible
];
const MIX: MixEvent[] = MIX_T.map((e) => (e.k === "stop" ? { ...e, at: T(e.at), back: T(e.back) } : { ...e, from: T(e.from), to: T(e.to) }));
const MusicTrack: React.FC = () => (
  <>
    {PARTS.map((p) => {
      const from = T(p.from);
      const to = Math.min(FULL_DURATION, T(p.to));
      const g = Math.pow(10, (p.lufs - (MUSIC_LUFS[p.file] ?? -12)) / 20);
      return (
        <Sequence key={p.file} from={f(from)} durationInFrames={f(to - from)}>
          <Audio src={staticFile(`epidemic/higgs-influ2/hq/${p.file}`)} volume={(fr) => { const t = from + fr / 30; return g * interpolate(t, [from, from + p.fadeIn, to - p.fadeOut, to], [0, 1, 1, 0], clamp) * mixGain(t, MIX); }} />
        </Sequence>
      );
    })}
  </>
);

// Démo 1 : 3 cadrages de la même capture (page entière → panneau en grand → résultat)
const S1A = SCREEN_1[0] - 0.2; // page Higgsfield (barre de menus et onglets masqués)
const S1D = 276.27; // la capture change de fenêtre (résultat)
const PANEL_WIN = { x: 142, y: 185, w: 361, h: 885 };
const PZ = 1.15; // panneau placé à gauche (x ≈ 80, y ≈ 32)
const PANEL_VIEW = { z: PZ, cx: PANEL_WIN.x + (960 - 80) / PZ, cy: PANEL_WIN.y + (540 - 32) / PZ };

// Entrée du panneau : la page disparaît autour, le panneau grandit et glisse à gauche
const PanelIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const t = useT();
  return <AbsoluteFill style={{ opacity: interpolate(t, [0, 0.4], [0, 1], clamp) }}>{children}</AbsoluteFill>;
};
const AttrCard: React.FC = () => {
  const t0 = T(PANEL[0] + 0.4);
  const rel = (x: number) => T(x) - t0;
  return <PlayerCard x={600} y={110} end={rel(278.75)} genAt={rel(GEN_AT)} revealAt={rel(REVEAL_AT)} attrs={ATTRS.map((a) => ({ ...a, at: rel(a.at) }))} />;
};
// Pendant la révélation, l'écran de chargement de la capture est masqué
const RevealBg: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill style={{ opacity: interpolate(t, [T(278.5) - T(S1D), T(278.75) - T(S1D)], [1, 0], clamp) }}>
      <Backdrop />
    </AbsoluteFill>
  );
};

export const MontageHiggsInflu2: React.FC = () => (
  <AbsoluteFill style={{ background: "black" }}>
    {/* Démo 1a : la page (lien, bouton Generate) */}
    <At from={S1A} to={PANEL[0] + 0.5}>
      <ScreenStage src={SCREEN} trimBefore={T(S1A)} win={{ x: 132, y: 142, w: 1656, h: 938 }} keys={[{ t: 0, z: 1.0, cx: 960, cy: 611 }, { t: 123.0 - S1A, z: 1.0, cx: 960, cy: 611 }, { t: 123.8 - S1A, z: 1.9, cx: 380, cy: 960 }, { t: 126.3 - S1A, z: 1.9, cx: 380, cy: 960 }, { t: 126.9 - S1A, z: 1.0, cx: 960, cy: 611 }]} tilt={[{ t: 0, rx: 4, ry: -7 }, { t: 0.3, rx: 4, ry: -7 }, { t: 2.0, rx: 0, ry: 0 }]} />
    </At>
    {/* Démo 1b : le panneau du Character Builder en grand à gauche, la carte joueur à droite */}
    <At from={PANEL[0]} to={S1D}>
      <PanelIn>
        <ScreenStage free src={SCREEN} trimBefore={T(PANEL[0])} win={PANEL_WIN} keys={[{ t: 0, z: 1.0, cx: 960, cy: 611 }, { t: 0.9, ...PANEL_VIEW }]} />
      </PanelIn>
    </At>
    {/* Démo 1c : le personnage généré, puis l'historique du compte */}
    <At from={S1D} to={SCREEN_1[1] + 0.2}>
      <ScreenStage src={SCREEN} trimBefore={T(S1D)} win={{ x: 0, y: 0, w: 1920, h: 1080 }} keys={[{ t: 0, z: 2.0, cx: 672, cy: 275 }, { t: 278.6 - S1D, z: 2.0, cx: 672, cy: 275 }, { t: 278.75 - S1D, z: 1.0, cx: 960, cy: 540 }, { t: 279.5 - S1D, z: 1.45, cx: 752, cy: 543 }, { t: 293.3 - S1D, z: 1.45, cx: 752, cy: 543 }, { t: 293.7 - S1D, z: 1.0, cx: 960, cy: 540 }, { t: 294.6 - S1D, z: 2.0, cx: 672, cy: 275 }]} />
    </At>
    {/* Démo 2 (Genjutsu) : fenêtre entière → panneau + fiche → fenêtre → panneau + fiche → fenêtre */}
    <At from={SCREEN_2[0] - 0.2} to={P2A[0] + 0.5}>
      <ScreenStage src={SCREEN} trimBefore={T(SCREEN_2[0] - 0.2)} win={{ x: 108, y: 54, w: 1704, h: 972 }} keys={[{ t: 0, z: 1.0, cx: 960, cy: 540 }, { t: 380.3 - (SCREEN_2[0] - 0.2), z: 1.0, cx: 960, cy: 540 }, { t: 381.1 - (SCREEN_2[0] - 0.2), z: 1.35, cx: 660, cy: 560 }]} tilt={[{ t: 0, rx: 4, ry: 7 }, { t: 0.3, rx: 4, ry: 7 }, { t: 2.0, rx: 0, ry: 0 }]} />
    </At>
    <At from={P2A[0]} to={P2A[1] + 0.5}>
      <PanelIn>
        <ScreenStage free src={SCREEN} trimBefore={T(P2A[0])} win={PANEL2_WIN} keys={[{ t: 0, z: 1.35, cx: 660, cy: 560 }, { t: 0.9, ...PANEL2_VIEW }]} />
      </PanelIn>
    </At>
    <At from={P2A[1]} to={P2B[0] + 0.5}>
      <PanelIn>
        <ScreenStage src={SCREEN} trimBefore={T(P2A[1])} win={{ x: 108, y: 54, w: 1704, h: 972 }} keys={[{ t: 0, z: 1.0, cx: 960, cy: 540 }]} />
      </PanelIn>
    </At>
    <At from={P2B[0]} to={P2B[1] + 0.5}>
      <PanelIn>
        <ScreenStage free src={SCREEN} trimBefore={T(P2B[0])} win={PANEL2_WIN} keys={[{ t: 0, z: 1.0, cx: 960, cy: 540 }, { t: 0.9, ...PANEL2_VIEW }]} />
      </PanelIn>
    </At>
    <At from={P2B[1]} to={SCREEN_2[1] + 0.2}>
      <PanelIn>
        <ScreenStage src={SCREEN} trimBefore={T(P2B[1])} win={{ x: 108, y: 54, w: 1704, h: 972 }} keys={[{ t: 0, z: 1.0, cx: 960, cy: 540 }]} />
      </PanelIn>
    </At>
    {/* Pendant la révélation, l'écran de chargement est masqué (sous la carte et le médaillon) */}
    <At from={S1D} to={278.75}>
      <RevealBg />
    </At>
    {/* Face cam : plein cadre sur les passages face caméra, médaillon pendant les démos */}
    <AbsoluteFill>
      <FacePip src={FACE} trimBefore={0} face={FACE_POS} grade={GRADE} keys={pipKeys()} zoomKeys={[{ t: 0, z: 1.0 }, { t: 40, z: 1.05 }, { t: 75, z: 1.0 }, { t: 110, z: 1.05 }, { t: 304, z: 1.0 }, { t: 340, z: 1.05 }, { t: 473, z: 1.0 }, { t: 535, z: 1.05 }, { t: 594, z: 1.02 }].map((k) => ({ ...k, t: T(k.t) }))} />
    </AbsoluteFill>

    {/* ══ HOOK : Ibrahim lit son script (0 → 19,8 s) → illustration plein cadre, pas de face cam ══ */}
    <At from={0} to={4.35}>
      <FullClip src="rec_shadow_vid.mp4" from={0.4} end={4.35} height={880} x={300} />
      <SideText x={1000} end={4.35} lines={[{ text: "Il *n'existe pas.*", at: 1.42 }, { text: "Apparu il y a *2 semaines*", at: 2.7, size: 64 }]} />
    </At>
    <At from={4.3} to={7.5}>
      <PanShot src="jp_profile.png" iw={2560} ih={1800} end={3.2} keys={[{ t: 0, z: 0.58, cx: 1350, cy: 860 }, { t: 1.2, z: 0.6, cx: 1350, cy: 860 }, { t: 1.7, z: 1.25, cx: 1150, cy: 260 }]} marks={[{ from: 0.4, to: 1.3, x: 530, y: 590, w: 1960, h: 850 }, { from: 1.75, to: 3.2, x: 1140, y: 148, w: 270, h: 76 }]} />
      <Sequence from={f(1.6)} layout="none">
        <Caption text="*256 K* abonnés · *9 vidéos*" end={1.6} />
      </Sequence>
    </At>
    <At from={7.45} to={10.6}>
      <FanClips end={3.15} height={760} top={70} items={[{ src: "rec_11m_vid.mp4", views: "11 M" }, { src: "rec_shadow_vid.mp4", views: "15,2 M", from: 3 }, { src: "rec_85m_vid.mp4", views: "8,5 M" }]} />
      <Caption text="Plus de *100 M de vues* · TikTok + Instagram" end={3.15} at={0.3} bottom={50} />
    </At>
    <At from={10.56} to={19.85}>
      <PanShot src="daisy_profile.png" iw={2560} ih={1800} end={9.29} keys={[{ t: 0, z: 0.58, cx: 1350, cy: 820 }, { t: 3.0, z: 0.62, cx: 1350, cy: 820 }, { t: 3.7, z: 0.95, cx: 1560, cy: 960 }, { t: 6.0, z: 0.95, cx: 1560, cy: 960 }, { t: 6.6, z: 1.45, cx: 1240, cy: 450 }]} marks={[{ from: 0.6, to: 2.9, x: 520, y: 60, w: 1180, h: 360 }, { from: 3.9, to: 6.0, x: 2182, y: 774, w: 297, h: 393 }, { from: 6.7, to: 9.2, x: 930, y: 325, w: 700, h: 285 }]} />
      <Caption text="Un compte *copieur*" end={6.0} at={0.4} bottom={50} />
      <Sequence from={f(6.45)} layout="none">
        <Caption text="…et il vend déjà des *collabs payantes*" end={2.84} bottom={50} />
      </Sequence>
    </At>
    <At from={19.82} to={24.3}>
      <Scrim end={4.48} />
      <KeyLine end={4.48} size={100} words={[{ w: "faire", t: 0.9 }, { w: "pareil,", t: 1.1, hl: true }, { w: "de", t: 1.8 }, { w: "A", t: 1.95 }, { w: "à", t: 2.05 }, { w: "Z", t: 2.15, hl: true }]} />
    </At>
    <At from={24.3} to={31.7}>
      <Dim start={0} end={7.4} k={0.72} />
      <FanClips bg={false} end={7.4} height={640} top={90} items={[{ src: "rec_43m_vid.mp4", views: "4,3 M" }, { src: "rec_77m_vid.mp4", views: "7,7 M" }, { src: "rec_53m_vid.mp4", views: "5,3 M", from: 0 }]} />
      <Sequence from={f(1.4)} layout="none">
        <TopPill text="Jean Phil · costume marron · coupe au bol · moustache" end={6.0} top={900} />
      </Sequence>
    </At>
    <At from={31.8} to={41.5}>
      <Scrim end={9.7} />
      <TwoPills end={5.5} items={[{ text: "Il est réel ?", at: 0.1 }, { text: "C'est de l'IA ?", at: 3.9 }]} />
      <Sequence from={f(5.6)} layout="none">
        <FocusVeil start={0} end={4.1} />
        <KeyLine end={4.1} valign="center" size={140} words={[{ w: "spoiler :", t: 0.05 }, { w: "c'est", t: 0.82 }, { w: "de", t: 0.96 }, { w: "l'IA", t: 1.1, hl: true }]} />
      </Sequence>
    </At>
    <At from={42.2} to={52.5}>
      <TutoMap
        eyebrow="La recette"
        title="5 *ingrédients*"
        end={10.3}
        titleAt={0.05}
        steps={[
          { n: 1, label: "Un personnage reconnaissable", at: 0.6 },
          { n: 2, label: "Un geste signature", at: 1.1 },
          { n: 3, label: "Répétition et variations", at: 1.6 },
          { n: 4, label: "Le mystère", at: 2.1 },
          { n: 5, label: "La monétisation", at: 2.6 },
        ]}
      />
    </At>
    <At from={52.6} to={62.8}>
      <TopPill text="*Higgsfield* · AI Influencer 2.0 · partenaire de cette vidéo" end={10.2} />
    </At>
    <At from={62.9} to={69.6}>
      <Scrim end={6.7} />
      <TwoPills end={6.7} items={[{ text: "Ibrahim Kamara", at: 0.1 }, { text: "Je teste des outils d'IA", at: 1.4 }]} />
    </At>
    <At from={69.7} to={75.0}>
      <TopPill text="À la fin : *ton influenceur* + *10 vidéos* prêtes" end={5.3} />
    </At>

    {/* ══ INGRÉDIENT 1 ══ */}
    <At from={75.0} to={79.6}>
      <FocusVeil start={0} end={4.6} />
      <KeyLine end={4.6} valign="center" size={120} words={[{ w: "Ingrédient", t: 0.05 }, { w: "1 :", t: 0.3 }, { w: "un", t: 2.0 }, { w: "personnage", t: 2.2 }, { w: "reconnaissable", t: 3.0, hl: true }]} />
    </At>
    {/* Ibrahim lit son script (88 → 105,6 s) : la vraie recherche TikTok, puis Jean Phil qui sort du lot */}
    <At from={87.9} to={102.35}>
      <PanShot video src="rec_search.mp4" iw={2140} ih={1800} end={14.45} keys={[{ t: 0, z: 0.52, cx: 1070, cy: 900 }, { t: 3.6, z: 0.52, cx: 1070, cy: 900 }, { t: 4.4, z: 0.62, cx: 1180, cy: 1000 }, { t: 14.45, z: 0.66, cx: 1180, cy: 1000 }]} marks={[{ from: 0.6, to: 3.4, x: 20, y: 100, w: 400, h: 90 }]} />
      <Sequence from={f(10.6)} layout="none">
        <Caption text="Ils se *ressemblent tous*" end={3.85} bottom={50} />
      </Sequence>
    </At>
    <At from={102.3} to={107.1}>
      <FullClip src="rec_43m_vid.mp4" from={1.0} end={4.8} height={880} x={300} />
      <SideText x={1000} end={4.8} lines={[{ text: "Lui, il *sort du lot*", at: 0.15, size: 96 }, { text: "costume · coupe · visage", at: 2.2, size: 54 }]} />
    </At>
    <At from={113.5} to={PANEL[0]}>
      <ChapterPill n={1} total={5} title="Le personnage" end={PANEL[0] - 113.5} />
    </At>
    <At from={115.3} to={120.5}>
      <TopPill text="Lien Higgsfield *en description*" end={5.2} />
    </At>
    {/* Carte joueur « FIFA » : se remplit au fil des choix */}
    <At from={PANEL[0] + 0.4} to={278.75}>
      <AttrCard />
    </At>
    <At from={279.0} to={304.1}>
      <ChapterPill n={1} total={5} title="Le personnage" end={T(304.1) - T(279.0)} />
    </At>
    <At from={295.4} to={303.0}>
      <TopPill text="Enregistré dans *ton compte* : toujours le même personnage" end={T(303.0) - T(295.4)} top={900} />
    </At>

    {/* ══ INGRÉDIENT 2 ══ */}
    <At from={304.2} to={308.4}>
      <FocusVeil start={0} end={4.2} />
      <KeyLine end={4.2} valign="center" size={120} words={[{ w: "Ingrédient", t: 0.05 }, { w: "2 :", t: 0.3 }, { w: "un", t: 1.6 }, { w: "geste", t: 1.8 }, { w: "signature", t: 2.1, hl: true }]} />
    </At>
    {/* Ibrahim lit son script (315 → 326 s) : la vraie vidéo du shadowboxing en plein cadre */}
    <At from={313.2} to={326.0}>
      <FullClip src="rec_shadow_vid.mp4" from={0} end={12.8} height={880} x={300} />
      <SideText x={1000} end={12.8} lines={[{ text: "Son geste signature :", at: 2.4, size: 64 }, { text: "le *shadowboxing*", at: 4.0 }, { text: "*15,2 M* de vues · remixé partout", at: 7.4, size: 54 }]} />
    </At>
    <At from={326.0} to={333.0}>
      <Scrim end={7.0} />
      <TwoPills end={7.0} items={[{ text: "Simple", at: 0.1 }, { text: "Réplicable · drôle", at: 1.4 }]} />
    </At>
    {/* Ibrahim lit son script (337 → 349 s) puis montre la vidéo qu'il s'est filmée : on montre l'original, net */}
    <At from={337.3} to={350.9}>
      <FullClip src="moi_reference.mp4" loop={4.87} end={13.6} height={880} x={300} />
      <SideText x={1000} end={13.6} lines={[{ text: "Je me suis *filmé*", at: 4.3, size: 96 }, { text: "dans *la vraie vie*", at: 5.9, size: 72 }, { text: "un mouvement *basique*", at: 8.6, size: 72 }]} />
    </At>
    <At from={350.9} to={360.2}>
      <TransferCard end={9.3} caption="Higgsfield *Genjutsu* : il refait *ton* mouvement" captionAt={3.0} />
    </At>
    <At from={360.3} to={P2A[0]}>
      <ChapterPill n={2} total={5} title="Le geste signature" end={T(P2A[0]) - T(360.3)} />
    </At>
    <At from={P2A[1]} to={426.8}>
      <ChapterPill n={2} total={5} title="Le geste signature" end={T(426.8) - T(P2A[1])} />
    </At>
    <At from={P2A[0] + 0.4} to={P2A[1]}>
      <SettingsCard title="Genjutsu · Motion Transfer" x={600} y={150} end={T(P2A[1]) - T(P2A[0] + 0.4)} goAt={T(411.93) - T(P2A[0] + 0.4)} rows={SET_A.map((r) => ({ ...r, at: Math.max(0.3, T(r.at) - T(P2A[0] + 0.4)) }))} />
    </At>
    {/* Le résultat : moi en vrai / mon personnage, côte à côte */}
    <At from={415.4} to={426.75}>
      <SideBySide end={11.35} right="perso_genjutsu.mp4" rightLoop={4.03} caption="Exactement *le même mouvement*" captionAt={4.6} />
    </At>
    {/* ══ INGRÉDIENT 3 ══ */}
    <At from={426.8} to={431.0}>
      <FocusVeil start={0} end={4.2} />
      <KeyLine end={4.2} valign="center" size={120} words={[{ w: "Ingrédient", t: 0.9 }, { w: "3 :", t: 1.6 }, { w: "répétition", t: 2.1 }, { w: "et", t: 2.5 }, { w: "variations", t: 2.7, hl: true }]} />
    </At>
    {/* Jean Phil : toujours le même mouvement, le décor change (vraies vidéos) */}
    <At from={433.9} to={446.8}>
      <FanClips end={12.9} height={600} top={110} items={[{ src: "rec_11m_vid.mp4", views: "Parc", from: 0 }, { src: "rec_85m_vid.mp4", views: "Huîtres", from: 0 }, { src: "rec_77m_vid.mp4", views: "Café", from: 0 }, { src: "rec_43m_vid.mp4", views: "Rue", from: 0 }]} />
      <Sequence from={f(4.0)} layout="none">
        <Caption text="Toujours *le même mouvement* · le décor change" end={8.9} bottom={60} />
      </Sequence>
    </At>
    <At from={P2B[0] + 0.4} to={P2B[1]}>
      <SettingsCard title="Variation · même mouvement" x={600} y={200} end={T(P2B[1]) - T(P2B[0] + 0.4)} goAt={T(466.45) - T(P2B[0] + 0.4)} rows={SET_B.map((r) => ({ ...r, at: T(r.at) - T(P2B[0] + 0.4) }))} />
    </At>
    <At from={431.0} to={P2B[0]}>
      <ChapterPill n={3} total={5} title="Répétition et variations" end={T(P2B[0]) - T(431.0)} />
    </At>
    <At from={P2B[1]} to={472.9}>
      <ChapterPill n={3} total={5} title="Répétition et variations" end={T(472.9) - T(P2B[1])} />
    </At>

    {/* Le résultat de la variation (brief Higgsfield) */}
    <At from={469.3} to={473.4}>
      <GenClip src={`${D}/variation_espace.mp4`} end={4.1} label="Même mouvement · *dans l'espace*" />
    </At>

    {/* ══ INGRÉDIENT 4 ══ */}
    <At from={484.8} to={489.6}>
      <FocusVeil start={0} end={4.8} />
      <KeyLine end={4.8} valign="center" size={120} words={[{ w: "Ingrédient", t: 0.05 }, { w: "4 :", t: 0.3 }, { w: "le", t: 2.2 }, { w: "mystère", t: 2.4, hl: true }]} />
    </At>
    {/* Le débat dans les commentaires : la vraie vidéo et son vrai compteur (TikTok bloque l'accès aux commentaires) */}
    <At from={489.5} to={500.4}>
      <PanShot video src="rec_shadow_full.mp4" iw={1118} ih={1718} end={10.9} keys={[{ t: 0, z: 0.6, cx: 559, cy: 859 }, { t: 1.4, z: 0.6, cx: 559, cy: 859 }, { t: 2.2, z: 1.05, cx: 760, cy: 1050 }]} marks={[{ from: 2.4, to: 10.8, x: 985, y: 1140, w: 130, h: 180 }]} />
      <Sequence from={f(2.6)} layout="none">
        <Caption text="*9 679* commentaires · le débat : *réel ou IA ?*" end={8.3} bottom={50} />
      </Sequence>
    </At>
    {/* L'article (vraie capture) en plein cadre, puis la règle */}
    <At from={504.6} to={510.6}>
      <PanShot src="art_instagram_crop.png" iw={960} ih={840} end={6.0} keys={[{ t: 0, z: 1.05, cx: 480, cy: 420 }, { t: 2.0, z: 1.05, cx: 480, cy: 420 }, { t: 2.8, z: 1.6, cx: 480, cy: 190 }]} marks={[{ from: 0.6, to: 5.9, x: 30, y: 60, w: 890, h: 140 }]} />
      <Caption text="Instagram · *31 août 2026*" end={6.0} at={0.5} bottom={40} />
    </At>
    <At from={510.6} to={517.0}>
      <InfoCard eyebrow="Instagram · depuis fin août 2026" title="Label « *généré par IA* » obligatoire" meta="Sinon : moins de visibilité dans les Reels et Explorer" start={0} end={6.4} />
    </At>
    <At from={524.2} to={535.0}>
      <Scrim end={10.8} />
      <KeyLine end={10.8} size={96} words={[{ w: "«", t: 0.2 }, { w: "Il", t: 0.3 }, { w: "sort", t: 0.5 }, { w: "d'où", t: 0.8, hl: true }, { w: "?", t: 0.9 }, { w: "»", t: 0.95 }]} />
    </At>

    {/* ══ INGRÉDIENT 5 ══ */}
    <At from={535.6} to={539.6}>
      <FocusVeil start={0} end={4.0} />
      <KeyLine end={4.0} valign="center" size={120} words={[{ w: "Ingrédient", t: 0.05 }, { w: "5 :", t: 0.3 }, { w: "la", t: 1.9 }, { w: "monétisation", t: 2.1, hl: true }]} />
    </At>
    {/* Ibrahim lit son script (540 → 551, 555 → 560) : profils réels en plein cadre */}
    <At from={539.6} to={555.3}>
      <PanShot src="daisy_profile.png" iw={2560} ih={1800} end={15.7} keys={[{ t: 0, z: 0.58, cx: 1350, cy: 820 }, { t: 4.0, z: 0.6, cx: 1350, cy: 820 }, { t: 4.7, z: 0.95, cx: 1560, cy: 960 }, { t: 8.2, z: 0.95, cx: 1560, cy: 960 }, { t: 9.0, z: 1.45, cx: 1240, cy: 450 }]} marks={[{ from: 1.6, to: 3.9, x: 520, y: 60, w: 1180, h: 360 }, { from: 6.5, to: 8.3, x: 2182, y: 774, w: 297, h: 393 }, { from: 9.6, to: 15.5, x: 930, y: 325, w: 700, h: 285 }]} />
      <Caption text="Le compte *copieur*" end={8.3} at={0.6} bottom={50} />
      <Sequence from={f(10.3)} layout="none">
        <Caption text="Lien en bio · *collabs payantes* · son trafic *rapporte*" end={5.4} bottom={50} />
      </Sequence>
    </At>
    <At from={555.3} to={563.8}>
      <PanShot src="granny_profile.png" iw={2560} ih={1800} end={8.5} hide={[{ x: 930, y: 368, w: 400, h: 50 }]} keys={[{ t: 0, z: 0.58, cx: 1350, cy: 820 }, { t: 1.6, z: 0.6, cx: 1350, cy: 820 }, { t: 2.3, z: 1.3, cx: 1250, cy: 300 }]} marks={[{ from: 2.4, to: 4.4, x: 1140, y: 140, w: 300, h: 56 }, { from: 4.6, to: 8.4, x: 930, y: 425, w: 560, h: 60 }]} />
      <Caption text="Granny Spills · *936,9 K* abonnés · *partenariats* de marques" end={8.5} at={0.5} bottom={50} />
    </At>
    <At from={563.8} to={569.4}>
      <PanShot src="art_crypto_crop.png" iw={1030} ih={780} end={5.6} keys={[{ t: 0, z: 1.15, cx: 515, cy: 390 }, { t: 2.6, z: 1.15, cx: 515, cy: 390 }, { t: 3.4, z: 1.5, cx: 440, cy: 600 }]} marks={[{ from: 3.4, to: 5.5, x: 55, y: 585, w: 745, h: 145 }]} />
      <Caption text="Un « *memecoin* » à son nom" end={5.6} at={0.8} bottom={40} />
    </At>
    <At from={569.4} to={576.0}>
      <InfoCard warn eyebrow="Mise en garde" title="La crypto s'est *effondrée*" meta="N'achète pas, et ne fais pas ça." start={0} end={6.6} />
    </At>
    <At from={576.3} to={581.3}>
      <TopPill text="Gagne de l'argent *honnêtement* avec ce trafic" end={5.0} />
    </At>
    <At from={581.4} to={589.0}>
      <TopPill text="Lien Higgsfield : *1er lien* en description + commentaire épinglé" end={7.6} />
    </At>
    <At from={484.8} to={594.37}>
      <ChapterPill n={4} total={5} title="Le mystère" end={535.5 - 484.8} />
    </At>
    <At from={535.6} to={594.37}>
      <ChapterPill n={5} total={5} title="La monétisation" end={58.7} />
    </At>

    <SfxTrack cues={SFX} />
    <Audio src={staticFile(`${D}/voice_v3.wav`)} />
    <MusicTrack />
    <Grain />
  </AbsoluteFill>
);

