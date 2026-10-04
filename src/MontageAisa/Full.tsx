// Montage AIsa — vidéo complète (étape 6 : production par blocs, PLAYBOOK §8).
// Timeline v2 = montages/aisa/03-audio/edl_v2.json (21:41). Temps T en secondes de la timeline.
// Entre 6,79 s et 312,11 s : source (face cam et écran, même horloge) = T − 6,79.
// Plan : montages/aisa/04-plan.md (textes validés) · identité : analysis/identite-v2/charte.md.
import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile } from "remotion";
import {
  ChapterCard,
  EASE,
  f,
  FacePip,
  Grain,
  KeyLine,
  keyed,
  MUSIC,
  musicGain,
  Pill,
  rich,
  ScreenStage,
  SfxTrack,
  Stat,
  useT,
  blurIn,
  inOut,
  type SfxCue,
} from "../montage/lib";
import { GoogleToAI, IconRow, NoteCard, Teaser } from "../montage/Explainers";
import { HOOK_END, hookMusicLevel, MontageAisaHook, SHIFT } from "./Hook";

export const FULL_DURATION = 1301.0; // audio_v2.wav
const SRC = 6.79; // décalage source ↔ timeline (bloc H à étape 2)
const FACE = "montage/aisa/face_full_dn.mp4";
const SCREEN = "montage/aisa/screen_full.mp4";
const FACE_POS = { x: 0.52, y: 0.34 };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
/** Séquence placée en temps absolu de la timeline. */
const At: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => (
  <Sequence from={f(from)} durationInFrames={f(to - from)} layout="none">
    <AbsoluteFill>{children}</AbsoluteFill>
  </Sequence>
);

// ═══ Bloc 1 · fin de l'intro + étape 1 « Le business » (1:04,5 → 4:06) ═══════
const B1 = HOOK_END; // 64,53
const B1_END = 246.0;
const SCR1 = 106.6; // début de la couche écran (source = SCR1 − SRC)
const s1 = (T: number) => T - SCR1; // temps relatif à la couche écran
const STATS = [
  [141.9, 148.3],
  [161.9, 168.4],
];

const Block1: React.FC = () => (
  <AbsoluteFill>
    {/* Écran Bing (sous la face cam) : plongées sur les chiffres, l'article et la courbe */}
    <At from={SCR1} to={237.0}>
      <ScreenStage
        src={SCREEN}
        trimBefore={SCR1 - SRC}
        keys={[
          { t: s1(106.6), z: 0.64, cx: 960, cy: 540 },
          { t: s1(126.5), z: 0.64, cx: 960, cy: 540 },
          { t: s1(129.0), z: 0.9, cx: 960, cy: 430 },
          { t: s1(137.0), z: 0.9, cx: 960, cy: 430 },
          { t: s1(139.8), z: 1.45, cx: 640, cy: 370 },
          { t: s1(148.6), z: 1.45, cx: 640, cy: 370 },
          { t: s1(150.8), z: 1.0, cx: 960, cy: 470 },
          { t: s1(158.6), z: 1.0, cx: 960, cy: 470 },
          { t: s1(160.6), z: 1.4, cx: 770, cy: 365 },
          { t: s1(168.6), z: 1.4, cx: 770, cy: 365 },
          { t: s1(170.6), z: 0.92, cx: 960, cy: 540 },
          { t: s1(199.6), z: 0.92, cx: 960, cy: 540 },
          { t: s1(201.4), z: 1.3, cx: 960, cy: 420 },
          { t: s1(205.4), z: 1.3, cx: 960, cy: 420 },
          { t: s1(207.2), z: 0.92, cx: 960, cy: 540 },
          { t: s1(225.6), z: 0.92, cx: 960, cy: 540 },
          { t: s1(227.6), z: 1.45, cx: 1430, cy: 590 },
          { t: s1(233.0), z: 1.45, cx: 1430, cy: 590 },
          { t: s1(234.8), z: 0.8, cx: 960, cy: 540 },
        ]}
        tilt={[
          { t: 0, rx: 5, ry: -9 },
          { t: s1(107.6), rx: 5, ry: -9 },
          { t: s1(109.8), rx: 0, ry: 0 },
        ]}
        dim={(t) => {
          const T = t + SCR1;
          const st = Math.max(...STATS.map(([a, b]) => interpolate(T, [a - 0.1, a + 0.4, b - 0.5, b], [0, 0.75, 0.75, 0], clamp)));
          const note = interpolate(T, [188.9, 189.5, 196.2, 196.8], [0, 0.5, 0.5, 0], clamp);
          return Math.max(st, note);
        }}
        blur={(t) => {
          const T = t + SCR1;
          return Math.max(...STATS.map(([a, b]) => interpolate(T, [a - 0.1, a + 0.5, b - 0.5, b], [0, 9, 9, 0], clamp)));
        }}
      />
    </At>

    {/* Face cam : plein cadre, puis « Le Glissé » vers le médaillon (107,6 s), retour à 235,4 s */}
    <At from={B1} to={B1_END}>
      <FacePip
        src={FACE}
        trimBefore={B1 - SRC}
        face={FACE_POS}
        keys={[
          { t: 0, p: 0 },
          { t: 107.6 - B1, p: 0 },
          { t: 108.5 - B1, p: 1 },
          { t: 235.4 - B1, p: 1 },
          { t: 236.3 - B1, p: 0 },
        ]}
        zoomKeys={[
          { t: 0, z: 1.06 },
          { t: 76.0 - B1, z: 1.0 },
          { t: 86.0 - B1, z: 1.03 },
          { t: 104.0 - B1, z: 1.05 },
          { t: 236.3 - B1, z: 1.0 },
          { t: B1_END - B1, z: 1.05 },
        ]}
      />
    </At>

    {/* « que tu recherches un restaurant, où te coiffer, les meilleures universités » */}
    <At from={76.6} to={82.8}>
      <IconRow
        end={82.8 - 76.6}
        items={[
          { icon: "restaurant", label: "Restaurant", at: 77.65 - 76.6 },
          { icon: "coiffeur", label: "Coiffeur", at: 79.99 - 76.6 },
          { icon: "universite", label: "Université", at: 81.47 - 76.6 },
        ]}
      />
    </At>
    <At from={82.8} to={86.6}>
      <KeyLine
        end={86.6 - 82.8}
        size={96}
        maxWidth={1750}
        words={[
          { w: "tout", t: 0.13 },
          { w: "se", t: 0.25 },
          { w: "passe", t: 0.49 },
          { w: "dans", t: 0.99 },
          { w: "ChatGPT", t: 1.17, hl: true },
          { w: "et", t: 1.77 },
          { w: "Claude", t: 2.09, hl: true },
        ]}
      />
    </At>

    {/* Google → IA, puis teaser, puis carton d'étape 1 */}
    <At from={86.5} to={100.7}>
      <RevealBox end={100.7 - 86.5}>
        <GoogleToAI end={100.7 - 86.5} fadeAt={91.07 - 86.5} seoAt={92.65 - 86.5} strikeAt={97.2 - 86.5} aiAt={98.07 - 86.5} />
      </RevealBox>
    </At>
    <At from={100.7} to={104.0}>
      <Teaser
        end={104.0 - 100.7}
        items={[
          { text: "*97 %* de citation", at: 0.35, dur: 0.95 },
          { text: "*1 200 067* visites/mois", at: 1.3, dur: 0.95 },
          { text: "*10 prospects* · 0,24 $", at: 2.25, dur: 1.0 },
        ]}
      />
    </At>
    <At from={104.0} to={106.8}>
      <ChapterCard n={1} total={5} title="Le *business*" end={106.8 - 104.0} />
    </At>

    {/* Chiffres héros (valeurs de l'écran, règle SCREEN-TRUTH) */}
    <At from={STATS[0][0]} to={STATS[0][1]}>
      <Stat
        value={51.9}
        start={0.3}
        end={STATS[0][1] - STATS[0][0]}
        format={(n) => n.toFixed(1).replace(".", ",") + "K"}
        label="citations · *3 derniers mois*"
        context="Bing Webmaster Tools · ibrahimkamara.com"
      />
    </At>
    <At from={STATS[1][0]} to={STATS[1][1]}>
      <Stat
        value={74.4}
        start={0.3}
        end={STATS[1][1] - STATS[1][0]}
        format={(n) => n.toFixed(1).replace(".", ",") + "K"}
        label="citations · *71 pages* citées"
        context="Bing Webmaster Tools · 6 derniers mois"
      />
    </At>

    {/* « J'ai un article sur mon blog… » */}
    <At from={189.1} to={196.8}>
      <NoteCard
        eyebrow="Article cité par l'IA"
        title="Comment Télécharger de la Musique YouTube *Légalement* en 2026"
        meta="ibrahimkamara.com · blog"
        start={0}
        end={196.8 - 189.1}
      />
    </At>

    {/* « depuis le mois d'août… période vraiment haussière » */}
    <At from={228.0} to={233.6}>
      <TrendPill text="Tendance : en hausse depuis *août*" end={233.6 - 228.0} />
    </At>

    {/* « …et surtout comment ils vont te payer » */}
    <At from={242.35} to={246.0}>
      <KeyLine
        end={246.0 - 242.35}
        size={96}
        words={[
          { w: "comment", t: 0.14 },
          { w: "ils", t: 0.58 },
          { w: "vont", t: 0.62 },
          { w: "te", t: 0.7 },
          { w: "payer", t: 0.84, hl: true },
        ]}
      />
    </At>
  </AbsoluteFill>
);

/** Apparition / disparition floue d'un insert plein cadre. */
const RevealBox: React.FC<{ end: number; children: React.ReactNode }> = ({ end, children }) => {
  const t = useT();
  const a = keyed(t, [0, 0.45], [0, 1], EASE);
  const b = keyed(t, [end - 0.4, end], [0, 1]);
  const bl = (1 - a) * 14 + b * 10;
  return <AbsoluteFill style={{ opacity: Math.min(a, 1 - b), filter: bl > 0.05 ? `blur(${bl}px)` : undefined }}>{children}</AbsoluteFill>;
};

const TrendPill: React.FC<{ text: string; end: number }> = ({ text, end }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.01, 0.4);
  const b = blurIn(t, 0, 0.45, -20);
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 80 }}>
      <div style={{ ...b, opacity: Math.min(o, Number(b.opacity)) }}>
        <Pill size={48} style={{ background: "linear-gradient(180deg, rgba(18,22,15,0.94), rgba(18,22,15,0.88))" }}>
          <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke="#c6f36d" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />
          </svg>
          {rich(text)}
        </Pill>
      </div>
    </AbsoluteFill>
  );
};

// ═══ Son ═════════════════════════════════════════════════════════════════════
const SFX_B1: SfxCue[] = [
  { k: "popSelectA", at: 77.65 },
  { k: "popSelectB", at: 79.99 },
  { k: "popSelectA", at: 81.47 },
  { k: "popNotif03", at: 83.0, gain: 0.5 },
  { k: "whoosh01", at: 86.6 },
  { k: "popNotif02", at: 97.3, gain: 0.5 },
  { k: "impactLowHit", at: 98.1, gain: 0.55 },
  { k: "whoosh05", at: 100.75 },
  { k: "whoosh03", at: 101.05, gain: 0.7 },
  { k: "whoosh02", at: 102.0, gain: 0.7 },
  { k: "whoosh03", at: 102.95, gain: 0.7 },
  { k: "whoosh05", at: 104.05 },
  { k: "impactHitLow", at: 104.45, gain: 0.35 },
  { k: "confirmNotif13", at: 105.25, gain: 0.6 },
  { k: "whoosh02", at: 107.75, gain: 0.7 },
  { k: "riserClean", at: 142.2, gain: 0.5 },
  { k: "impactDeep", at: 142.25, gain: 0.8 },
  { k: "riserWhoosh", at: 162.2, gain: 0.45 },
  { k: "impactDeep", at: 162.25, gain: 0.7 },
  { k: "popNotif12", at: 189.2 },
  { k: "popSelectB", at: 228.05 },
  { k: "whoosh01", at: 235.45, gain: 0.6 },
  { k: "popNotif03", at: 242.45, gain: 0.5 },
];

const MusicTrack: React.FC<{ k: keyof typeof MUSIC; from: number; to: number; level: (T: number) => number }> = ({ k, from, to, level }) => (
  <Sequence from={f(from)} durationInFrames={f(to - from)} layout="none">
    <Audio src={staticFile(`epidemic/hq/${MUSIC[k].file}`)} volume={(fr) => musicGain(k) * level(fr / 30 + from)} />
  </Sequence>
);

export const MontageAisa: React.FC = () => (
  <AbsoluteFill style={{ background: "black" }}>
    {/* Bloc H : le prototype validé, sans sa propre bande son */}
    <Sequence from={0} durationInFrames={f(HOOK_END)}>
      <MontageAisaHook embedded />
    </Sequence>
    {/* Les blocs sont écrits en temps absolus de la timeline */}
    <Block1 />
    <Sequence from={f(B1)}>
      <Grain />
    </Sequence>

    {/* Voix montée (étape 3, validée) */}
    <Audio src={staticFile("montage/aisa/voice_full.wav")} />

    {/* Musiques par partie (04-identite-sonore.md), ~13 dB sous la voix, remontées sur cartons et teaser */}
    <MusicTrack
      k="hook"
      from={SRC}
      to={105.6}
      level={(T) => (T < B1 ? hookMusicLevel(T - SHIFT, true) : interpolate(T, [B1, 100.4, 100.8, 103.9, 104.0, 105.5], [1, 1, 1.35, 1.35, 1.2, 0], clamp))}
    />
    <MusicTrack k="preuve" from={104.0} to={B1_END} level={(T) => interpolate(T, [104.0, 105.3, 106.8, 107.6], [0, 1.3, 1.3, 1], clamp)} />
    <SfxTrack cues={SFX_B1} />
  </AbsoluteFill>
);
