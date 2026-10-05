// Montage « J'ai cloné l'influenceur IA qui a fait 100 millions de vues » (Higgsfield, sponsorisé).
// Base : le cut du monteur (Higgsfield INFLU.mp4), dont la liste de coupes a été reconstituée depuis les rushes
// (montages/higgs-influ2/00bis-monteur/edl_monteur.json) → face cam et capture séparées, + 4 micro-coupes de notre part.
// Timeline T (s) = cut du monteur moins les micro-coupes. Illustrations : captures réelles (choix d'Ibrahim).
import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, OffthreadVideo, Sequence, staticFile } from "remotion";
import { blurIn, ChapterPill, Eyebrow, f, FacePip, FocusVeil, FONT, glass, Grain, INK, inOut, KeyLine, MUTED, rich, ScreenStage, SfxTrack, Star, Stat, useT, type SfxCue } from "../montage/lib";
import { TopPill, TutoMap } from "../montage/Explainers";
import { Scrim, TwoPills } from "../MontageHostinger/Hook";

export const FULL_DURATION = 594.37;
const D = "montage/higgs-influ2";
const FACE = `${D}/face.mp4`;
const SCREEN = `${D}/screen.mp4`;
const CAP = (n: string) => staticFile(`${D}/captures/${n}`);
const FACE_POS = { x: 0.5, y: 0.36 };
const GRADE = "brightness(1.12) contrast(1.05) saturate(1.04)";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const At: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => (
  <Sequence from={f(from)} durationInFrames={Math.max(1, f(to - from))} layout="none">
    <AbsoluteFill>{children}</AbsoluteFill>
  </Sequence>
);

// Bascules face cam ↔ écran (choix du monteur), en temps T
const SCREEN_1: [number, number] = [112.91, 304.11];
const SCREEN_2: [number, number] = [341.51, 472.91];
const pipKeys = () => {
  const k: { t: number; p: number }[] = [{ t: 0, p: 0 }];
  for (const [a, b] of [SCREEN_1, SCREEN_2]) k.push({ t: a - 0.1, p: 0 }, { t: a + 0.8, p: 1 }, { t: b - 0.8, p: 1 }, { t: b + 0.1, p: 0 });
  return k;
};

// ─── Carte « capture réelle » (profil, vidéo) ───
const Shot: React.FC<{ src: string; start: number; end: number; x: number; y: number; w: number; label?: string; tilt?: number; delay?: number }> = ({ src, start, end, x, y, w, label, tilt = 0, delay = 0 }) => {
  const t = useT();
  const o = inOut(t, start + delay, end, 0.01, 0.35);
  const b = blurIn(t, start + delay, 0.55, 30);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, opacity: Math.min(o, Number(b.opacity)), transform: `${b.transform} rotate(${tilt}deg)`, filter: b.filter }}>
      <div style={{ ...glass, padding: 10, borderRadius: 26, background: "rgba(18,22,15,0.92)" }}>
        <Img src={src} style={{ width: w - 20, borderRadius: 18, display: "block" }} />
      </div>
      {label && <div style={{ marginTop: 14, fontFamily: FONT, fontSize: 34, color: INK, textAlign: "center", letterSpacing: "-0.01em", textShadow: "0 4px 20px rgba(0,0,0,0.7)" }}>{rich(label)}</div>}
    </div>
  );
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
// ─── Bulles de commentaires (débat « réel ou IA ? », illustration) ───
const Bubbles: React.FC<{ items: { text: string; at: number; x: number; y: number }[]; end: number }> = ({ items, end }) => {
  const t = useT();
  return (
    <AbsoluteFill>
      {items.map((it, i) => {
        const b = blurIn(t, it.at, 0.4, 20);
        return (
          <div key={i} style={{ position: "absolute", left: it.x, top: it.y, ...glass, background: "rgba(18,22,15,0.92)", borderRadius: 28, padding: "18px 28px", fontFamily: FONT, fontSize: 40, color: INK, ...b, opacity: Math.min(Number(b.opacity), inOut(t, it.at, end, 0.01, 0.3)) }}>
            {it.text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const JP_VIDS = ["jp_video_7686645658903645473.jpg", "jp_video_7688017368492133665.jpg", "jp_video_7690240648670088481.jpg"];

const SFX: SfxCue[] = [
  { k: "whoosh01", at: 0.05 },
  { k: "impactDeep", at: 3.6 },
  { k: "impactDeep", at: 7.0 },
  { k: "whoosh02", at: 10.6 },
  { k: "whoosh03", at: 24.2 },
  { k: "popSelectA", at: 31.8 },
  { k: "popSelectB", at: 34.2 },
  { k: "impactHitLow", at: 36.9 - 0.66, gain: 0.5 },
  { k: "whoosh03", at: 42.2 },
  { k: "popSelectA", at: 52.7 },
  { k: "clickNotif05", at: 62.9, gain: 0.6 },
  { k: "whoosh02", at: 74.9 },
  { k: "whoosh01", at: 112.8 },
  { k: "whoosh03", at: 304.0 },
  { k: "popSelectA", at: 313.2 },
  { k: "whoosh01", at: 341.4 },
  { k: "whoosh03", at: 426.7 },
  { k: "whoosh01", at: 472.8 },
  { k: "whoosh03", at: 484.7 },
  { k: "popNotif03", at: 489.9, gain: 0.6 },
  { k: "popNotif02", at: 491.3, gain: 0.6 },
  { k: "popNotif03", at: 492.6, gain: 0.6 },
  { k: "confirmAlert07", at: 504.6, gain: 0.5 },
  { k: "whoosh03", at: 535.5 },
  { k: "whoosh02", at: 539.6 },
  { k: "whoosh02", at: 555.6 },
  { k: "impactHitLow", at: 566.3 - 0.66, gain: 0.5 },
  { k: "popNotif02", at: 581.5, gain: 0.6 },
];

// ─── Musique (4 parties, ≈ −29 LUFS) ───
const PARTS = [
  { file: "m0_signal_containment.mp3", from: 0, to: 75.0 },
  { file: "m1_unfinished_stories.mp3", from: 75.0, to: 304.11 },
  { file: "m2_mindscape.mp3", from: 304.11, to: 484.8 },
  { file: "m3_estimations.mp3", from: 484.8, to: FULL_DURATION },
];
export const MUSIC_LUFS: Record<string, number> = { "m0_signal_containment.mp3": -9.7, "m1_unfinished_stories.mp3": -12.0, "m2_mindscape.mp3": -13.8, "m3_estimations.mp3": -15.2 };
const MusicTrack: React.FC = () => (
  <>
    {PARTS.map((p, i) => {
      const from = Math.max(0, p.from - (i ? 0.6 : 0));
      const to = Math.min(FULL_DURATION, p.to + 0.6);
      const g = Math.pow(10, (-29 - (MUSIC_LUFS[p.file] ?? -12)) / 20);
      return (
        <Sequence key={p.file} from={f(from)} durationInFrames={f(to - from)}>
          <Audio src={staticFile(`epidemic/higgs-influ2/hq/${p.file}`)} volume={(fr) => g * interpolate(from + fr / 30, [from, from + (i ? 1.2 : 0.4), to - 1.2, to], [0, 1, 1, 0], clamp)} />
        </Sequence>
      );
    })}
  </>
);

export const MontageHiggsInflu2: React.FC = () => (
  <AbsoluteFill style={{ background: "black" }}>
    {/* Écran (capture recoupée sur le cut du monteur) */}
    {/* Démo 1 (capture Retina) : on ne garde que la page Higgsfield (barre de menus et onglets masqués) */}
    <At from={SCREEN_1[0] - 0.2} to={SCREEN_1[1] + 0.2}>
      <ScreenStage src={SCREEN} trimBefore={SCREEN_1[0] - 0.2} win={{ x: 132, y: 142, w: 1656, h: 938 }} keys={[{ t: 0, z: 1.0, cx: 960, cy: 611 }]} tilt={[{ t: 0, rx: 4, ry: -7 }, { t: 0.3, rx: 4, ry: -7 }, { t: 2.0, rx: 0, ry: 0 }]} />
    </At>
    {/* Démo 2 : fenêtre de l'app */}
    <At from={SCREEN_2[0] - 0.2} to={SCREEN_2[1] + 0.2}>
      <ScreenStage src={SCREEN} trimBefore={SCREEN_2[0] - 0.2} win={{ x: 108, y: 54, w: 1704, h: 972 }} keys={[{ t: 0, z: 1.0, cx: 960, cy: 540 }]} masks={[{ from: 0, to: 368.6 - (SCREEN_2[0] - 0.2), x: 200, y: 54, w: 1612, h: 972 }]} tilt={[{ t: 0, rx: 4, ry: 7 }, { t: 0.3, rx: 4, ry: 7 }, { t: 2.0, rx: 0, ry: 0 }]} />
    </At>
    {/* Face cam : plein cadre sur les passages face caméra, médaillon pendant les démos */}
    <At from={0} to={FULL_DURATION}>
      <FacePip src={FACE} trimBefore={0} face={FACE_POS} grade={GRADE} keys={pipKeys()} zoomKeys={[{ t: 0, z: 1.0 }, { t: 40, z: 1.05 }, { t: 75, z: 1.0 }, { t: 110, z: 1.05 }, { t: 304, z: 1.0 }, { t: 340, z: 1.05 }, { t: 473, z: 1.0 }, { t: 535, z: 1.05 }, { t: 594, z: 1.02 }]} />
    </At>

    {/* ══ HOOK ══ */}
    <At from={0} to={10.6}>
      <Dim start={0} end={10.6} k={0.55} />
      <Shot src={CAP("jp_tiktok_header.png")} start={0} end={10.6} x={560} y={40} w={800} />
      {JP_VIDS.map((v, i) => (
        <Shot key={v} src={CAP(v)} start={0.25} delay={i * 0.25} end={2.7} x={520 + i * 300} y={380} w={260} tilt={(i - 1) * 3} />
      ))}
      <Sequence from={f(1.0)} layout="none">
        <TopPill text="Il *n'existe pas*" end={1.7} top={900} />
      </Sequence>
      <Stat value={250000} start={3.6} end={6.8} context="9 vidéos sur TikTok" label="*abonnés*" size={220} />
      <Stat value={100} start={7.0} end={10.6} context="TikTok + Instagram" label="de *vues*" format={(n) => `${Math.round(n)} M+`} size={240} />
    </At>
    <At from={10.6} to={19.75}>
      <Dim start={0} end={9.15} k={0.6} />
      <Shot src={CAP("daisy_header.png")} start={0} end={9.15} x={460} y={120} w={1000} label="Un compte copieur · *3 vidéos*, près de *5 M de vues*" />
      <Sequence from={f(6.3)} layout="none">
        <TopPill text="…et il vend déjà *un produit*" end={2.85} top={760} />
      </Sequence>
    </At>
    <At from={19.82} to={24.3}>
      <Scrim end={4.48} />
      <KeyLine end={4.48} size={100} words={[{ w: "faire", t: 0.9 }, { w: "pareil,", t: 1.1, hl: true }, { w: "de", t: 1.8 }, { w: "A", t: 1.95 }, { w: "à", t: 2.05 }, { w: "Z", t: 2.15, hl: true }]} />
    </At>
    <At from={24.3} to={31.7}>
      <Dim start={0} end={7.4} k={0.6} />
      {JP_VIDS.map((v, i) => (
        <Shot key={v} src={CAP(v)} start={0} delay={i * 0.3} end={7.4} x={300 + i * 470} y={110} w={380} tilt={(i - 1) * 2} />
      ))}
      <Sequence from={f(1.4)} layout="none">
        <TopPill text="Jean Phil · costume marron · moustache · cheveux bouclés" end={6.0} top={900} />
      </Sequence>
    </At>
    <At from={31.8} to={40.2}>
      <Scrim end={8.4} />
      <TwoPills end={4.9} items={[{ text: "Il est réel ?", at: 0.1 }, { text: "C'est de l'IA ?", at: 2.4 }]} />
      <Sequence from={f(5.0)} layout="none">
        <FocusVeil start={0} end={3.4} />
        <KeyLine end={3.4} valign="center" size={140} words={[{ w: "spoiler :", t: 0.05 }, { w: "c'est", t: 0.5 }, { w: "de", t: 0.7 }, { w: "l'IA", t: 0.85, hl: true }]} />
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
    <At from={86.9} to={100.0}>
      <TopPill text="Tape « *AI influencer* » sur TikTok : des centaines de clones" end={13.1} />
    </At>
    <At from={100.0} to={112.0}>
      <Dim start={0} end={12} k={0.6} />
      <Shot src={CAP("jp_tiktok_header.png")} start={0} end={12} x={460} y={60} w={1000} />
      <Shot src={CAP(JP_VIDS[1])} start={0.6} end={12} x={790} y={420} w={340} label="Lui, il *sort du lot*" />
    </At>
    <At from={113.5} to={304.1}>
      <ChapterPill n={1} total={5} title="Le personnage" end={190.6} />
    </At>
    <At from={115.3} to={120.5}>
      <TopPill text="Lien Higgsfield *en description*" end={5.2} />
    </At>

    {/* ══ INGRÉDIENT 2 ══ */}
    <At from={304.2} to={308.4}>
      <FocusVeil start={0} end={4.2} />
      <KeyLine end={4.2} valign="center" size={120} words={[{ w: "Ingrédient", t: 0.05 }, { w: "2 :", t: 0.3 }, { w: "un", t: 1.6 }, { w: "geste", t: 1.8 }, { w: "signature", t: 2.1, hl: true }]} />
    </At>
    <At from={313.2} to={322.5}>
      <Dim start={0} end={9.3} k={0.55} />
      <Shot src={CAP(JP_VIDS[0])} start={0} end={9.3} x={760} y={90} w={400} label="Le *shadowboxing* · 15,1 M de vues" />
    </At>
    <At from={322.6} to={333.0}>
      <Scrim end={10.4} />
      <TwoPills end={10.4} items={[{ text: "Simple", at: 1.0 }, { text: "Réplicable · drôle", at: 3.0 }]} />
    </At>
    <At from={341.6} to={472.9}>
      <ChapterPill n={2} total={5} title="Le geste signature" end={426.8 - 341.6} />
    </At>
    <At from={426.8} to={472.9}>
      <ChapterPill n={3} total={5} title="Répétition et variations" end={46.1} />
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
    <At from={489.8} to={499.6}>
      <Dim start={0} end={9.8} k={0.5} />
      <Bubbles end={9.8} items={[{ text: "Il est réel ??", at: 0.1, x: 260, y: 220 }, { text: "C'est qui celui-là 😂", at: 1.5, x: 1060, y: 330 }, { text: "C'est de l'IA ou pas ?", at: 2.8, x: 420, y: 560 }]} />
    </At>
    <At from={504.6} to={510.6}>
      <Dim start={0} end={6} k={0.6} />
      <Shot src={CAP("art_instagram_crop.png")} start={0} end={6} x={510} y={50} w={900} label="Instagram · 31 août 2026" />
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
    <At from={539.6} to={555.0}>
      <Dim start={0} end={15.4} k={0.6} />
      <Shot src={CAP("daisy_header.png")} start={0} end={15.4} x={460} y={150} w={1000} label="3 vidéos · près de *5 M de vues* · un *lien en bio*" />
    </At>
    <At from={555.0} to={562.0}>
      <Dim start={0} end={7} k={0.6} />
      <Shot src={CAP("granny_header.png")} start={0} end={7} x={460} y={170} w={1000} label="Granny Spills · *936,8 K* abonnés · partenariats de marques" />
    </At>
    <At from={562.1} to={567.6}>
      <Dim start={0} end={5.5} k={0.6} />
      <Shot src={CAP("art_crypto_crop.png")} start={0} end={5.5} x={510} y={60} w={900} label="Un « memecoin » à son nom" />
    </At>
    <At from={567.6} to={573.5}>
      <InfoCard warn eyebrow="Mise en garde" title="La crypto s'est *effondrée*" meta="N'achète pas, et ne fais pas ça." start={0} end={5.9} />
    </At>
    <At from={573.6} to={581.3}>
      <TopPill text="Gagne de l'argent *honnêtement* avec ce trafic" end={7.7} />
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
    <Audio src={staticFile(`${D}/voice.wav`)} />
    <MusicTrack />
    <Grain />
  </AbsoluteFill>
);

