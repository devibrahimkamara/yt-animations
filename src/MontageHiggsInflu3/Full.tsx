// Montage « Ton influenceur IA ne devrait pas être humain » (Higgsfield AI Influencer 2.0, sponsorisé).
// Timeline = la vidéo d'Ibrahim telle que tournée (aucune coupe, aucun ajout : décision du 6/10/2026). Temps = temps source (s).
// Plan validé : montages/higgs-influ3/04-plan.md. Illustrations = captures réelles du 6/10/2026 (public/montage/higgs-influ3/captures).
import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile } from "remotion";
import { f, FacePip, FocusVeil, Grain, KeyLine, ScreenStage, SFX_KIT, SfxTrack, Stat, useT, type SfxCue } from "../montage/lib";
import { mixGain, type MixEvent } from "../montage/mix";
import { BrandCard, CAP, Caption as Caption_, CharacterCard, ResultDuo, D, DeadCard, Duel, MeToPerso, NextVideo, PromptBox, RuleCard, ScreenTag, Showcase, FanClips, FlowLine, FormatMap, FormatPill, FullClip, LoopCard, PanShot, StepCard, TitleList, TopTag, VeilleTable, type MapItem } from "./Illus";

export const FULL_DURATION = 585.866;
const FACE = `${D}/face_dn.mp4`;
const FACE_POS = { x: 0.5, y: 0.34 };
const GRADE = "brightness(1.14) contrast(1.05) saturate(1.04)";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const At: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => (
  <Sequence from={f(from)} durationInFrames={Math.max(1, f(to) - f(from))} layout="none">
    <AbsoluteFill>{children}</AbsoluteFill>
  </Sequence>
);

// La carte des formats (Carte du tuto), réutilisée par les cartons d'étape
export const MAP: Omit<MapItem, "at">[] = [
  { icon: "🍓", label: "Le drame de *fruits*" },
  { icon: "🐱", label: "La série de *chats*" },
  { icon: "🐯", label: "L'animal *héros*" },
  { icon: "☠️", label: "Le format *mort*", dead: true },
  { icon: "🛠️", label: "Ton *personnage*" },
];

// Ma veille (≈ 30 vidéos par recherche, 393 vidéos au total), vues cumulées
const VEILLE = [
  { label: "Vlogs d'animaux IA", value: 603, shown: "603 M" },
  { label: "Séries de chats", value: 332, shown: "332 M" },
  { label: "POV historiques", value: 283, shown: "283 M" },
  { label: "Drames de fruits", value: 256, shown: "256 M" },
  { label: "Bigfoot / yéti", value: 134, shown: "134 M" },
  { label: "Interviews de rue IA", value: 106, shown: "106 M" },
  { label: "Séries de personnages IA", value: 106, shown: "106 M" },
  { label: "Bébés podcasteurs IA", value: 53, shown: "53 M" },
  { label: "Mamies IA", value: 14, shown: "14 M" },
  { label: "Influenceuse fitness IA", value: 3.0, shown: "3,0 M", weak: true },
  { label: "Pubs UGC IA", value: 2.4, shown: "2,4 M", weak: true },
  { label: "Mannequin mode IA", value: 1.2, shown: "1,2 M", weak: true },
];

// Choix du Character Builder, au mot prononcé (valeurs de l'interface : Cat · Male · Suits · Jewelry)
const CHAR = [
  { k: "Espèce", v: "*Chat*", at: 354.93 },
  { k: "Genre", v: "Homme", at: 357.75 },
  { k: "Style", v: "Costume", at: 365.48 },
  { k: "Accessoires", v: "Bijoux", at: 369.51 },
];

// ─── Son ───
const SFX_T: SfxCue[] = [
  { k: "popSelectA", at: 1.7 },
  { k: "whoosh03", at: 5.4 },
  { k: "popSelectB", at: 7.3 },
  { k: "impactDeep", at: 12.36, gain: 0.5 },
  { k: "popSelectA", at: 14.95 },
  { k: "whoosh02", at: 23.4 },
  { k: "whoosh03", at: 32.5 },
  { k: "popSelectA", at: 40.0 },
  { k: "popSelectB", at: 46.7 },
  { k: "whoosh01", at: 48.6 },
  { k: "popNotif02", at: 57.2, gain: 0.6 },
  { k: "whoosh02", at: 64.6 },
  { k: "whoosh03", at: 69.1 },
  // Bloc 1
  { k: "whoosh01", at: 70.0 },
  { k: "popSelectA", at: 73.9 },
  { k: "whoosh02", at: 77.2 },
  { k: "popSelectB", at: 81.3 },
  { k: "popSelectA", at: 84.0 },
  { k: "whoosh03", at: 88.0 },
  { k: "impactDeep", at: 97.3, gain: 0.5 },
  { k: "whoosh02", at: 99.3 },
  { k: "popSelectA", at: 102.64 },
  { k: "popSelectB", at: 103.37 },
  { k: "popSelectA", at: 104.39 },
  { k: "popNotif02", at: 108.9 },
  { k: "popSelectB", at: 123.0 },
  { k: "whoosh01", at: 125.45 },
  { k: "impactDeep", at: 130.1, gain: 0.5 },
  { k: "popSelectA", at: 136.85 },
  { k: "whoosh02", at: 137.4 },
  { k: "whoosh03", at: 148.9 },
  { k: "impactHitLow", at: 150.34, gain: 0.5 },
  { k: "popSelectA", at: 160.11 },
  { k: "popSelectB", at: 163.41 },
  { k: "popSelectA", at: 164.22 },
  { k: "popSelectB", at: 164.87 },
  { k: "popSelectA", at: 174.78 },
  { k: "popSelectB", at: 176.83 },
  { k: "popSelectA", at: 182.07 },
  { k: "confirmAlert07", at: 183.6, gain: 0.5 },
  { k: "popNotif02", at: 187.3 },
  // Bloc 2
  { k: "whoosh01", at: 196.5 },
  { k: "popSelectA", at: 201.2 },
  { k: "whoosh02", at: 206.2 },
  { k: "popSelectB", at: 211.1 },
  { k: "popSelectA", at: 213.63 },
  { k: "whoosh03", at: 218.2 },
  { k: "popSelectB", at: 220.5 },
  { k: "popSelectA", at: 225.4 },
  { k: "impactHitLow", at: 228.52, gain: 0.5 },
  { k: "popSelectB", at: 235.6 },
  { k: "whoosh02", at: 236.9 },
  { k: "whoosh01", at: 258.55 },
  { k: "impactDeep", at: 259.2, gain: 0.4 },
  { k: "popSelectA", at: 264.31 },
  { k: "whoosh03", at: 268.2 },
  { k: "popSelectB", at: 276.56 },
  { k: "whoosh02", at: 277.95 },
  { k: "popNotif03", at: 280.4, gain: 0.5 },
  { k: "popNotif03", at: 283.8, gain: 0.5 },
  { k: "popSelectA", at: 286.38 },
  { k: "whoosh01", at: 292.4 },
  { k: "popSelectA", at: 301.6 },
  { k: "popSelectB", at: 304.7 },
  { k: "confirmAlert07", at: 310.2, gain: 0.5 },
  { k: "popNotif02", at: 316.9, gain: 0.5 },
  { k: "whoosh02", at: 317.25 },
  { k: "popSelectA", at: 322.87 },
  // Bloc 3 (démo)
  { k: "whoosh02", at: 330.0 },
  { k: "popNotif02", at: 333.6, gain: 0.5 },
  { k: "whoosh03", at: 338.1 },
  { k: "popSelectA", at: 347.4 },
  { k: "whoosh01", at: 353.95 },
  ...CHAR.map((r) => ({ k: "popSelectA" as const, at: r.at, gain: 0.3 })),
  { k: "whoosh02", at: 380.45 },
  { k: "clickA", at: 381.4, gain: 0.5 },
  { k: "riserClean", at: 395.2, gain: 0.3 },
  { k: "confirmAchievement", at: 395.25, gain: 0.5 },
  { k: "whoosh03", at: 408.45 },
  { k: "popSelectA", at: 412.4 },
  { k: "whoosh02", at: 423.25 },
  // Bloc 4 (démo Genjutsu + fin)
  { k: "whoosh03", at: 430.7 },
  { k: "clickA", at: 433.3, gain: 0.5 },
  { k: "clickA", at: 437.8, gain: 0.5 },
  { k: "popSelectA", at: 444.0 },
  { k: "clickA", at: 451.4, gain: 0.5 },
  { k: "popSelectB", at: 452.9 },
  { k: "clickA", at: 464.7, gain: 0.5 },
  { k: "popNotif03", at: 470.3, gain: 0.5 },
  { k: "riserClean", at: 478.2, gain: 0.3 },
  { k: "confirmAchievement", at: 478.25, gain: 0.5 },
  { k: "whoosh02", at: 481.45 },
  { k: "popSelectA", at: 517.9 },
  { k: "clickA", at: 528.6, gain: 0.5 },
  { k: "popSelectB", at: 535.2 },
  { k: "popSelectA", at: 542.1 },
  { k: "clickA", at: 547.6, gain: 0.5 },
  { k: "popNotif02", at: 549.3, gain: 0.5 },
  { k: "impactDeep", at: 552.7, gain: 0.45 },
  { k: "whoosh03", at: 564.5 },
  { k: "whoosh02", at: 570.3 },
  { k: "popNotif02", at: 582.9, gain: 0.6 },
];
// Retour Higgs Influ 2 : effets −4,5 dB partout, −7,5 dB dans le hook
const SFX: SfxCue[] = SFX_T.map((c) => ({ ...c, gain: (c.gain ?? SFX_KIT[c.k].gain) * (c.at < 20 ? 0.42 : 0.6) }));

// Musique par partie (04-identite-sonore.md) ; lufs = cible du lit de musique (voix à −16), src = LUFS mesuré du fichier
const PARTS = [
  { file: "m0_out_there.mp3", from: 3.0, to: 70.04, lufs: -32, src: -14.6, fadeIn: 1.2, fadeOut: 1.5, skip: 0 },
  // m1 (1:48) plus court que sa partie : fondu enchaîné sur lui-même à 175 s
  { file: "m1_darker_waters.mp3", from: 71.0, to: 178.5, lufs: -32, src: -14.4, fadeIn: 1.5, fadeOut: 3.0, skip: 0 },
  { file: "m1_darker_waters.mp3", from: 175.5, to: 258.5, lufs: -32, src: -14.4, fadeIn: 3.0, fadeOut: 1.5, skip: 12 },
  { file: "m2_silent_phrase.mp3", from: 259.4, to: 317.2, lufs: -32, src: -13.6, fadeIn: 1.2, fadeOut: 1.5, skip: 0 },
  // m3 (2:22) plus court que la démo : fondu enchaîné sur lui-même à 452 s
  { file: "m3_in_the_gloom.mp3", from: 318.4, to: 455.0, lufs: -33, src: -13.2, fadeIn: 1.5, fadeOut: 3.0, skip: 0 },
  { file: "m3_in_the_gloom.mp3", from: 452.0, to: 552.4, lufs: -33, src: -13.2, fadeIn: 3.0, fadeOut: 1.5, skip: 15 },
  { file: "m4_sonar.mp3", from: 552.0, to: 585.866, lufs: -32, src: -18.2, fadeIn: 1.2, fadeOut: 1.0, skip: 20 },
];
const MIX: MixEvent[] = [
  { k: "swell", from: 3.0, to: 5.3, db: 1.5 }, // le profil seul, entre deux chiffres
  { k: "dip", from: 14.5, to: 19.7, db: 2 }, // « Et pourtant, 99 %… »
  { k: "stop", at: 19.95, back: 22.6, fadeOut: 0.12, fadeIn: 1.0 }, // « Pourquoi ça ne fonctionne plus ? » : silence
  { k: "dip", from: 57.2, to: 64.4, db: 3 }, // le partenaire : bien audible
  { k: "dip", from: 107.3, to: 111.0, db: 3 }, // « le personnage n'a pas d'importance »
  { k: "stop", at: 148.95, back: 151.6, fadeOut: 0.12, fadeIn: 1.0 }, // « la partie 10… 82 millions » : silence + impact
  { k: "dip", from: 184.5, to: 191.3, db: 3 }, // la leçon : des épisodes
  { k: "stop", at: 228.4, back: 230.2, fadeOut: 0.12, fadeIn: 1.0 }, // « 80 millions de vues » : silence + impact
  { k: "dip", from: 292.3, to: 296.8, db: 4 }, // « une règle qui va te faire gagner beaucoup de temps »
  { k: "dip", from: 346.7, to: 380.4, db: 3 }, // manipulation dense (Character Builder)
  { k: "dip", from: 382.7, to: 392.5, db: 2 }, // « un seul crédit… plateforme payante » : bien audible
  { k: "stop", at: 393.6, back: 395.4, fadeOut: 0.12, fadeIn: 0.6 }, // le chat généré
  { k: "swell", from: 395.4, to: 398.0, db: 3 },
  { k: "dip", from: 452.9, to: 466.6, db: 3 }, // réglages Genjutsu
  { k: "stop", at: 478.1, back: 479.0, fadeOut: 0.12, fadeIn: 0.6 }, // le résultat
  { k: "swell", from: 479.0, to: 482.0, db: 3 },
  { k: "dip", from: 513.6, to: 549.0, db: 3 }, // les 3 prompts
  // les 5 vidéos côte à côte : pas de swell ; le pic mesuré venait d'un whoosh + impact dans la même seconde (whoosh retiré)
  { k: "dip", from: 564.6, to: 570.2, db: 3 }, // le lien
  // teaser 64,6 → 69 : pas de swell (mesuré à 11,4 dB sous la voix avec +2 dB, cible ≥ 14)
];
const MusicTrack: React.FC = () => (
  <>
    {PARTS.map((p) => {
      const g = Math.pow(10, (p.lufs - p.src) / 20);
      return (
        <Sequence key={p.file + p.from} from={f(p.from)} durationInFrames={f(p.to - p.from)}>
          <Audio src={staticFile(`epidemic/higgs-influ3/hq/${p.file}`)} trimBefore={f(p.skip)} volume={(fr) => { const t = p.from + fr / 30; return g * interpolate(t, [p.from, p.from + p.fadeIn, p.to - p.fadeOut, p.to], [0, 1, 1, 0], clamp) * mixGain(t, MIX); }} />
        </Sequence>
      );
    })}
  </>
);

// ══ BLOC H (0:00 → 1:09,9) ══
const BlocH: React.FC = () => (
  <>
    {/* 0 → 14,6 : Ibrahim lit son script → plein cadre : les deux profils réels côte à côte */}
    <At from={0} to={14.62}>
      <Duel
        end={14.62}
        left={{ profile: `${CAP}/profil_biaaia_.png`, eyebrow: "Influenceuse IA", at: 0.05, videos: 319, videosAt: 1.66, subs: "37,1 k", subsAt: 4.08, median: "19 k" }}
        right={{ profile: `${CAP}/profil_cat_flix_.png`, eyebrow: "Chat IA", at: 5.35, videos: 41, videosAt: 7.26, subs: "573 k", subsAt: 8.9, median: "2,4 M" }}
        medianAt={10.4}
        ratioAt={12.34}
        ratio="× 126"
      />
    </At>
    {/* 14,6 → 19,8 : phrase-thèse sur face cam floutée */}
    <At from={14.6} to={19.85}>
      <FocusVeil start={0} end={5.25} />
      <KeyLine end={5.25} valign="center" size={130} words={[{ w: "99 %", t: 0.34 }, { w: "créent…", t: 3.3 }, { w: "l'influenceuse", t: 4.08, hl: true }]} />
    </At>
    {/* 23,4 → 32,4 : la vraie recherche TikTok « ai influencer » */}
    <At from={23.39} to={32.45}>
      <PanShot video from={5.0} src={`${CAP}/recherche_ai_influencer.mp4`} iw={2560} ih={1800} end={9.06} keys={[{ t: 0, z: 0.96, cx: 1460, cy: 900 }, { t: 3.6, z: 0.96, cx: 1460, cy: 900 }, { t: 4.6, z: 1.05, cx: 1400, cy: 980 }]} />
      <Sequence from={f(4.7)} layout="none">
        <Caption_ text="Elles se ressemblent *toutes*" end={4.36} />
      </Sequence>
    </At>
    {/* 32,5 → 39,8 : chats, animaux, fruits : des dizaines de millions de vues */}
    <At from={32.5} to={39.85}>
      <FanClips end={7.35} height={760} top={110} items={[{ src: `${CAP}/vid_strawberrina.mp4`, views: "35,4 M", from: 1 }, { src: `${CAP}/vid_paws10.mp4`, views: "81,9 M", from: 1 }, { src: `${CAP}/vid_moto.mp4`, views: "80,4 M", from: 1 }]} />
    </At>
    {/* 39,9 → 48,4 : ma veille */}
    <At from={39.9} to={48.45}>
      <VeilleTable rows={VEILLE} end={8.55} rowsAt={0.4} step={0.28} titleAt={3.96} weakAt={6.6} />
    </At>
    {/* 48,5 → 57,1 : la carte des formats */}
    <At from={48.5} to={57.15}>
      <FocusVeil start={0} end={8.65} dark={0.72} />
      <FormatMap end={8.65} items={MAP.map((m, i) => ({ ...m, at: [1.15, 1.6, 2.05, 3.61, 6.87][i] }))} />
    </At>
    {/* 57,0 → 64,4 : le partenaire */}
    <At from={57.0} to={64.45}>
      <BrandCard end={7.45} toolAt={6.05} collabAt={1.2} />
    </At>
    {/* 64,6 → 69,1 : à venir : ton chat dans 3 variations */}
    <At from={64.6} to={69.15}>
      <FanClips end={4.55} height={760} top={150} items={[{ src: `${D}/gen_pyjama.mp4`, label: "Pyjama", from: 2 }, { src: `${D}/gen_casino.mp4`, label: "Casino", from: 2 }, { src: `${D}/gen_sac.mp4`, label: "Sac de voyage", from: 2 }]} />
      <TopTag text="À venir" end={4.55} at={0.2} />
    </At>
  </>
);

// ══ BLOC 1 (1:09,9 → 3:16,4) : Format 1 (fruits) + Format 2 (série de chats) ══
const BlocB1: React.FC = () => (
  <>
    <At from={69.95} to={72.6}>
      <StepCard eyebrow="Format 1 sur 4" title="Le drame de *fruits*" items={MAP.map((m) => ({ ...m, at: 0 }))} active={0} end={2.65} />
    </At>
    <At from={72.6} to={77.2}>
      <FormatPill label="Format 1/4" title="Fruits" end={4.6} />
    </At>
    <At from={73.6} to={76.95}>
      <KeyLine end={3.35} size={96} words={[{ w: "Ça", t: 0.25 }, { w: "va", t: 0.3 }, { w: "te", t: 0.35 }, { w: "paraître", t: 0.4 }, { w: "débile", t: 0.65, hl: true }]} />
    </At>
    {/* 77,2 → 88,0 : Ibrahim lit son script → les vraies vidéos de fruits */}
    <At from={77.2} to={83.65}>
      <FullClip src={`${CAP}/vid_strawberrina.mp4`} from={0.5} end={6.45} lines={[{ text: "Une fraise *trahie*", at: 4.1 }, { text: "par une banane", at: 5.7, size: 72 }]} />
    </At>
    <At from={83.6} to={88.05}>
      <FullClip src={`${CAP}/vid_applina.mp4`} from={0.5} end={4.45} lines={[{ text: "Une pomme", at: 0.3, size: 72 }, { text: "qui se fait passer pour *pauvre*", at: 1.3 }]} />
    </At>
    {/* 88,0 → 99,3 : le profil réel, compteurs du jour */}
    <At from={88.0} to={99.35}>
      <PanShot src={`${CAP}/profil_fruitystories36.png`} iw={2560} ih={1800} end={11.35} keys={[{ t: 0, z: 0.6, cx: 1500, cy: 880 }, { t: 4.6, z: 0.62, cx: 1500, cy: 880 }, { t: 5.4, z: 1.15, cx: 1300, cy: 330 }]} marks={[{ from: 5.6, to: 11.2, x: 1146, y: 160, w: 290, h: 56 }]} />
      <Sequence from={f(9.2)} layout="none">
        <Caption_ text="*35,4 M* de vues · vidéo du 12 septembre" end={2.15} bottom={60} />
      </Sequence>
      <Sequence from={f(5.6)} layout="none">
        <Caption_ text="@fruitystories36 · *642,4 k* abonnés" end={3.55} bottom={60} />
      </Sequence>
    </At>
    {/* 99,3 → 107,1 : les titres, toujours construits pareil */}
    <At from={99.3} to={107.15}>
      <TitleList eyebrow="Les vrais titres · @fruitystories36" end={7.85} titles={[{ text: "« Strawberrina took his esssence 😔 »", at: 0.4 }, { text: "« Bananito betrayal Pt 1 »", at: 0.9 }, { text: "« Applina pretends to be a poor man 😔 »", at: 1.4 }]} tags={[{ text: "Trahison", at: 3.34 }, { text: "Retournement", at: 4.07 }, { text: "😔", at: 5.09 }]} />
    </At>
    <At from={107.2} to={125.4}>
      <FormatPill label="Format 1/4" title="Fruits" end={18.2} />
    </At>
    <At from={107.3} to={114.95}>
      <FocusVeil start={0} end={7.65} />
      <KeyLine end={7.65} valign="center" size={124} words={[{ w: "Le", t: 1.5 }, { w: "personnage", t: 1.65 }, { w: "n'a", t: 2.23 }, { w: "pas", t: 2.4 }, { w: "d'importance", t: 2.92, hl: true }]} />
    </At>
    <At from={121.0} to={125.4}>
      <KeyLine end={4.4} size={96} words={[{ w: "Ce", t: 1.95 }, { w: "qui", t: 2.0 }, { w: "compte :", t: 2.05 }, { w: "l'émotion", t: 2.43, hl: true }]} />
    </At>
    {/* ── Format 2 ── */}
    <At from={125.45} to={128.1}>
      <StepCard eyebrow="Format 2 sur 4" title="La série de *chats*" items={MAP.map((m) => ({ ...m, at: 0 }))} active={1} end={2.65} />
    </At>
    <At from={128.1} to={137.45}>
      <FormatPill label="Format 2/4" title="Série" end={9.35} />
    </At>
    <At from={128.9} to={133.3}>
      <FocusVeil start={0} end={4.4} />
      <Stat value={82} start={1.2} end={4.4} format={(n) => `${Math.round(n)} M`} label="de vues · *1 seule* vidéo" size={260} />
    </At>
    <At from={133.4} to={137.45}>
      <KeyLine end={4.05} size={96} words={[{ w: "Le", t: 0.14 }, { w: "mot", t: 0.5 }, { w: "clé :", t: 0.75 }, { w: "épisode", t: 3.45, hl: true }]} />
    </At>
    {/* 137,4 → 156,8 : Ibrahim lit son script → le profil et la série réels */}
    <At from={137.4} to={148.95}>
      <PanShot src={`${CAP}/profil_cat_flix_.png`} iw={2560} ih={1800} end={11.55} keys={[{ t: 0, z: 0.6, cx: 1500, cy: 880 }, { t: 3.2, z: 0.62, cx: 1500, cy: 880 }, { t: 4.0, z: 1.15, cx: 1300, cy: 560 }]} marks={[{ from: 4.2, to: 11.4, x: 540, y: 664, w: 640, h: 196 }]} />
      <Sequence from={f(0.2)} layout="none">
        <Caption_ text="*Épisode* après épisode" end={3.6} bottom={60} />
      </Sequence>
      <Sequence from={f(4.2)} layout="none">
        <Caption_ text="La série « *Paws Of Vengeance* »" end={7.3} bottom={60} />
      </Sequence>
    </At>
    <At from={148.9} to={156.85}>
      <FullClip src={`${CAP}/vid_paws10.mp4`} from={0.5} end={7.95} lines={[{ text: "Partie 10", at: 0.3, size: 72 }, { text: "*81,9 M* de vues", at: 1.44 }, { text: "41 vidéos · 573 k abonnés", at: 3.66, size: 58 }]} />
    </At>
    <At from={156.85} to={196.45}>
      <FormatPill label="Format 2/4" title="Série" end={39.6} />
    </At>
    <At from={159.2} to={167.45}>
      <FocusVeil start={0} end={8.25} />
      <FlowLine end={8.25} caption="Tu vois la partie 10… tu vas voir *la partie 1*" captionAt={0.3} items={[{ text: "Partie 10", at: 0.91, hl: true }, { text: "Partie 1", at: 4.21 }, { text: "Partie 2", at: 5.02 }, { text: "Partie 3…", at: 5.67 }]} />
    </At>
    <At from={172.5} to={184.4}>
      <FocusVeil start={0} end={11.9} />
      <LoopCard end={11.9} closeAt={11.03} title="Une boucle *sans fin*" steps={[{ text: "On *regarde*", at: 2.28 }, { text: "L'algorithme *pousse*", at: 4.33 }, { text: "On *s'abonne*", at: 9.57 }]} />
    </At>
    <At from={184.5} to={196.3}>
      <FocusVeil start={0} end={11.8} />
      <KeyLine end={11.8} valign="center" size={124} words={[{ w: "Pas", t: 2.17 }, { w: "des", t: 2.67 }, { w: "vidéos :", t: 2.81 }, { w: "des", t: 5.95 }, { w: "épisodes", t: 6.25, hl: true }]} />
    </At>
  </>
);

// ══ BLOC 2 (3:16,4 → 5:29,4) : Format 3 (chat orange) + format mort + la règle ══
const BlocB2: React.FC = () => (
  <>
    <At from={196.45} to={199.1}>
      <StepCard eyebrow="Format 3 sur 4" title="L'animal *héros*" items={MAP.map((m) => ({ ...m, at: 0 }))} active={2} end={2.65} />
    </At>
    <At from={199.1} to={206.2}>
      <FormatPill label="Format 3/4" title="Héros" end={7.1} />
    </At>
    <At from={200.6} to={206.2}>
      <KeyLine end={5.6} size={96} words={[{ w: "Une", t: 0.43 }, { w: "machine", t: 0.59, hl: true }, { w: "à", t: 0.99 }, { w: "régularité", t: 1.07 }]} />
    </At>
    {/* 206,2 → 230,4 : Ibrahim lit son script → les vraies vidéos, puis le profil */}
    <At from={206.2} to={212.35}>
      <FullClip src={`${CAP}/vid_moto.mp4`} from={0.5} end={6.15} lines={[{ text: "Il construit une *moto*", at: 4.89 }, { text: "pour un tigre", at: 5.5, size: 72 }]} />
    </At>
    <At from={212.3} to={218.25}>
      <FullClip src={`${CAP}/vid_croco.mp4`} from={0.5} end={5.95} lines={[{ text: "Il se bat contre", at: 0.5, size: 72 }, { text: "un *crocodile*", at: 1.33 }]} />
    </At>
    <At from={218.2} to={230.45}>
      <PanShot src={`${CAP}/profil_orange.cat.philos.png`} iw={2560} ih={1800} end={12.25} keys={[{ t: 0, z: 0.6, cx: 1500, cy: 880 }, { t: 1.6, z: 0.62, cx: 1500, cy: 880 }, { t: 2.3, z: 1.15, cx: 1300, cy: 330 }]} marks={[{ from: 2.4, to: 12.1, x: 1166, y: 140, w: 230, h: 56 }]} />
      <Sequence from={f(2.3)} layout="none">
        <Caption_ text="@orange.cat.philos · *2 M* d'abonnés" end={4.8} bottom={60} />
      </Sequence>
      <Sequence from={f(7.15)} layout="none">
        <Caption_ text="≈ 285 k vues de moyenne · record : *80,4 M*" end={5.1} bottom={60} />
      </Sequence>
    </At>
    <At from={230.45} to={258.5}>
      <FormatPill label="Format 3/4" title="Héros" end={28.05} />
    </At>
    <At from={233.4} to={236.9}>
      <KeyLine end={3.5} size={104} words={[{ w: "Un", t: 0.31 }, { w: "héros,", t: 0.49 }, { w: "mille", t: 2.21, hl: true }, { w: "situations", t: 2.92 }]} />
    </At>
    <At from={236.9} to={243.75}>
      <PanShot video from={1.5} src={`${CAP}/profil_orange.cat.philos.mp4`} iw={2560} ih={1800} end={6.85} keys={[{ t: 0, z: 0.98, cx: 1480, cy: 1000 }]} />
      <Caption_ text="Le même chat · *toutes* les situations" end={6.85} at={0.4} bottom={60} />
    </At>
    {/* ── Le format mort ── */}
    <At from={258.5} to={261.5}>
      <StepCard eyebrow="Le format à éviter" title="Le format *mort*" items={MAP.map((m) => ({ ...m, at: 0 }))} active={3} end={3.0} />
    </At>
    <At from={261.5} to={292.3}>
      <FormatPill label="☠ À éviter" title="Format mort" end={30.8} dead />
    </At>
    <At from={263.3} to={267.1}>
      <KeyLine end={3.8} size={110} words={[{ w: "Les", t: 0.85 }, { w: "POV", t: 1.01, hl: true }]} />
    </At>
    <At from={268.2} to={273.35}>
      <FanClips end={5.15} height={700} top={120} items={[{ src: `${CAP}/vid_pyramid.mp4`, views: "44,5 M · 2025", label: "POV *pyramides*", from: 1 }, { src: `${CAP}/vid_bigfoot.mp4`, views: "24,6 M · 2025", label: "Vlog *Bigfoot*", from: 1 }]} />
    </At>
    <At from={273.5} to={277.9}>
      <FocusVeil start={0} end={4.4} />
      <KeyLine end={4.4} valign="center" size={120} words={[{ w: "En 2025 :", t: 2.1, hl: true }, { w: "20", t: 3.06 }, { w: "à", t: 3.2 }, { w: "40", t: 3.32 }, { w: "M", t: 3.5 }, { w: "de", t: 3.6 }, { w: "vues", t: 3.7 }]} />
    </At>
    <At from={277.95} to={284.75}>
      <FocusVeil start={0} end={6.8} dark={0.75} />
      <DeadCard end={6.8} eyebrow="Et aujourd'hui ?" rows={[{ who: "@timeportals", before: "44,5 M en 2025", now: "ne poste plus (15 janv.)", at: 0.3, nowAt: 2.4 }, { who: "@bigfootboyz", before: "18,9 M en 2025", now: "≈ 24 k vues", at: 0.6, nowAt: 5.8 }]} />
    </At>
    <At from={284.8} to={292.2}>
      <KeyLine end={7.4} size={104} words={[{ w: "Un", t: 0.33 }, { w: "format", t: 0.45 }, { w: "mort", t: 1.58, hl: true }]} />
    </At>
    {/* ── La règle ── */}
    <At from={292.3} to={317.15}>
      <FocusVeil start={0} end={24.85} dark={0.72} />
      <RuleCard end={24.85} title="La règle avant de copier un format" steps={[{ text: "Analyse 5-6 comptes du format", at: 9.3 }, { text: "Regarde leurs vidéos *les plus récentes*", at: 12.4 }]} verdicts={[{ text: "Encore des vues : *vivant*", at: 17.2, good: true }, { text: "Plus de vues : *mort*", at: 20.1, good: false }]} />
    </At>
    {/* ── Vers la pratique ── */}
    <At from={317.2} to={320.0}>
      <StepCard eyebrow="Format 4 · La pratique" title="Ton *personnage*" items={MAP.map((m) => ({ ...m, at: 0 }))} active={4} end={2.8} />
    </At>
    <At from={321.6} to={329.3}>
      <KeyLine end={7.7} size={104} words={[{ w: "On", t: 0.6 }, { w: "passe", t: 0.75 }, { w: "à", t: 1.0 }, { w: "la", t: 1.1 }, { w: "pratique", t: 1.27, hl: true }]} />
    </At>
  </>
);

// ══ BLOC 3 (5:29,4 → 7:10,6) : démo sponsor, Character Builder + vidéo de référence ══
// Écran Higgsfield : à partir de 330,0 s (avant : le script). Fenêtre du navigateur et panneau mesurés sur la capture (1920×1080).
const SCREEN = `${D}/screen.mp4`;
const WIN = { x: 112, y: 57, w: 1696, h: 966 };
const PANEL = { x: 122, y: 105, w: 372, h: 915 };
const PZ = 1.2;
const PANEL_VIEW = { z: PZ, cx: PANEL.x + (960 - 80) / PZ, cy: PANEL.y + (540 - 20) / PZ };
const PanelIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const t = useT();
  return <AbsoluteFill style={{ opacity: interpolate(t, [0, 0.4], [0, 1], clamp) }}>{children}</AbsoluteFill>;
};
// Les écrans (sous le médaillon)
const DemoScreens: React.FC = () => (
  <>
    <At from={330.0} to={354.3}>
      <ScreenStage src={SCREEN} trimBefore={330.0} win={WIN} tilt={[{ t: 0, rx: 4, ry: -7 }, { t: 0.3, rx: 4, ry: -7 }, { t: 2.0, rx: 0, ry: 0 }]} keys={[{ t: 0, z: 1.0, cx: 960, cy: 540 }, { t: 8.0, z: 1.0, cx: 960, cy: 540 }, { t: 8.9, z: 1.55, cx: 520, cy: 470 }, { t: 16.6, z: 1.55, cx: 520, cy: 470 }, { t: 17.4, z: 2.0, cx: 310, cy: 590 }]} />
    </At>
    <At from={353.9} to={380.9}>
      <PanelIn>
        <ScreenStage free src={SCREEN} trimBefore={353.9} win={PANEL} keys={[{ t: 0, z: 2.0, cx: 310, cy: 590 }, { t: 0.9, ...PANEL_VIEW }]} />
      </PanelIn>
    </At>
    <At from={380.4} to={408.5}>
      <PanelIn>
        <ScreenStage src={SCREEN} trimBefore={380.4} win={WIN} keys={[{ t: 0, z: 1.0, cx: 960, cy: 540 }, { t: 0.4, z: 1.0, cx: 960, cy: 540 }, { t: 1.2, z: 2.1, cx: 360, cy: 930 }, { t: 6.4, z: 2.1, cx: 360, cy: 930 }, { t: 7.3, z: 1.0, cx: 960, cy: 540 }, { t: 12.6, z: 1.0, cx: 960, cy: 540 }, { t: 13.3, z: 1.9, cx: 670, cy: 280 }, { t: 15.0, z: 1.9, cx: 670, cy: 280 }, { t: 15.5, z: 1.0, cx: 960, cy: 540 }, { t: 16.2, z: 1.3, cx: 760, cy: 540 }]} />
      </PanelIn>
    </At>
  </>
);
// Les habillages (au-dessus)
const BlocB3: React.FC = () => (
  <>
    <At from={333.4} to={337.5}>
      <ScreenTag text="🔗 Premier lien en description + commentaire épinglé" end={4.1} />
    </At>
    <At from={346.7} to={353.85}>
      <ScreenTag text="Humain *ou pas* : chat, crapaud, insecte…" end={7.15} at={0.4} />
    </At>
    <At from={354.3} to={380.4}>
      <CharacterCard x={1000} y={150} end={26.1} rows={CHAR.map((r) => ({ ...r, at: r.at - 354.3 }))} />
    </At>
    <At from={381.3} to={386.6}>
      <ScreenTag text="Generate ✦ *1,125* crédit" end={5.3} />
    </At>
    <At from={395.3} to={408.4}>
      <ScreenTag text="Mon personnage *IA*" end={13.1} at={0.1} />
    </At>
    {/* 408,4 → 423,2 : l'écran montre le script → ta vidéo de référence en grand */}
    <At from={408.4} to={423.25}>
      <FullClip src={`${D}/ref.mp4`} loop={8.7} end={14.85} lines={[{ text: "Ma vidéo de *référence*", at: 3.9 }, { text: "9 s, filmée au téléphone", at: 4.7, size: 64 }, { text: "« un peu *déçu* »", at: 9.9, size: 72 }]} />
    </At>
    <At from={423.2} to={430.65}>
      <MeToPerso end={7.45} caption="Moi → *mon* personnage" captionAt={4.0} />
    </At>
  </>
);

// ══ BLOC 4 (7:10,6 → 9:45,9) : démo Genjutsu, résultat, 3 variations, climax, fin ══
// Flous (règle §10) : historique d'autres projets (colonne de droite, anciennes générations dans la colonne centrale), Finder.
const RIGHT_COL = { x: 1500, y: 270, w: 300, h: 750 };
const DemoScreens4: React.FC = () => (
  <>
    <At from={430.65} to={468.6}>
      <ScreenStage src={SCREEN} trimBefore={430.65} win={WIN} tilt={[{ t: 0, rx: 4, ry: 7 }, { t: 0.3, rx: 4, ry: 7 }, { t: 2.0, rx: 0, ry: 0 }]}
        masks={[{ from: 4.2, to: 5.5, x: 180, y: 50, w: 1560, h: 950 }, { from: 27.3, to: 38, x: 620, y: 260, w: 875, h: 760 }, { from: 0, to: 38, ...RIGHT_COL }]}
        keys={[{ t: 0, z: 1.0, cx: 960, cy: 540 }, { t: 2.4, z: 1.0, cx: 960, cy: 540 }, { t: 3.0, z: 1.9, cx: 330, cy: 480 }, { t: 4.4, z: 1.9, cx: 330, cy: 480 }, { t: 5.0, z: 1.0, cx: 960, cy: 540 }, { t: 6.6, z: 1.0, cx: 960, cy: 540 }, { t: 7.2, z: 1.45, cx: 960, cy: 470 }, { t: 9.6, z: 1.45, cx: 960, cy: 470 }, { t: 10.3, z: 1.0, cx: 960, cy: 540 }, { t: 10.6, z: 1.0, cx: 960, cy: 540 }, { t: 11.3, z: 1.7, cx: 800, cy: 470 }, { t: 14.6, z: 1.7, cx: 800, cy: 470 }, { t: 15.4, z: 1.9, cx: 320, cy: 720 }, { t: 32.2, z: 1.9, cx: 320, cy: 720 }, { t: 32.8, z: 1.9, cx: 320, cy: 860 }]} />
    </At>
    <At from={468.6} to={481.4}>
      <ScreenStage src={SCREEN} trimBefore={468.6} win={WIN} masks={[{ from: 0, to: 11.7, x: 620, y: 640, w: 875, h: 380 }, { from: 0, to: 13, ...RIGHT_COL }]}
        keys={[{ t: 0, z: 1.9, cx: 320, cy: 860 }, { t: 0.8, z: 1.0, cx: 960, cy: 540 }, { t: 1.4, z: 1.45, cx: 1060, cy: 430 }]} />
    </At>
    {/* 470,3 → 473,6 : le Dock et Audacity passent devant l'écran → image figée de 470,2 s */}
    <At from={470.3} to={473.6}>
      <ScreenStage src={`${D}/screen_freeze.mp4`} trimBefore={0} win={WIN} masks={[{ from: 0, to: 4, x: 620, y: 640, w: 875, h: 380 }, { from: 0, to: 4, ...RIGHT_COL }]} keys={[{ t: 0, z: 1.45, cx: 1060, cy: 430 }]} />
    </At>
    <At from={481.4} to={504.2}>
      <ScreenStage src={SCREEN} trimBefore={481.4} win={WIN} masks={[{ from: 0, to: 23, x: 620, y: 940, w: 875, h: 80 }, { from: 0, to: 23, ...RIGHT_COL }]}
        keys={[{ t: 0, z: 1.45, cx: 1060, cy: 430 }, { t: 0.8, z: 1.25, cx: 1006, cy: 600 }, { t: 7.0, z: 1.25, cx: 1006, cy: 600 }, { t: 7.7, z: 1.2, cx: 1240, cy: 600 }, { t: 15.6, z: 1.2, cx: 1240, cy: 600 }, { t: 16.3, z: 1.25, cx: 1006, cy: 600 }]} />
    </At>
    <At from={504.2} to={565.0}>
      <ScreenStage src={SCREEN} trimBefore={504.2} win={WIN} masks={[{ from: 0, to: 61, x: 620, y: 940, w: 875, h: 80 }, { from: 0, to: 61, ...RIGHT_COL }]}
        keys={[{ t: 0, z: 1.25, cx: 1006, cy: 600 }, { t: 8.6, z: 1.25, cx: 1006, cy: 600 }, { t: 9.4, z: 1.9, cx: 320, cy: 640 }]} />
    </At>
  </>
);
const BlocB4: React.FC = () => (
  <>
    <At from={430.8} to={436.4}>
      <ScreenTag text="Higgsfield *Genjutsu* · Motion Transfer" end={5.6} at={0.4} />
    </At>
    <At from={437.9} to={443.9}>
      <ScreenTag text="① Ma vidéo de *référence*" end={6.0} />
    </At>
    <At from={444.0} to={452.8}>
      <ScreenTag text="② Mon *personnage* : le chat" end={8.8} />
    </At>
    <At from={452.9} to={462.9}>
      <ScreenTag text="③ Sans prompt · *Genjutsu* · 720p" end={10.0} />
    </At>
    <At from={463.0} to={468.4}>
      <ScreenTag text="Generate ✦ *56* crédits" end={5.4} />
    </At>
    <At from={470.2} to={478.1}>
      <ScreenTag text="⏩ ≈ 1 min de génération" end={7.9} />
    </At>
    <At from={478.25} to={481.5}>
      <ScreenTag text="Le *résultat*" end={3.25} />
    </At>
    {/* 481,4 → 504,2 : le lecteur de l'interface saccade (retour d'Ibrahim) → le rendu HD, à côté de l'original */}
    <At from={481.4} to={504.25}>
      <ResultDuo end={22.85} gen={`${D}/gen_costume.mp4`} loop={8.04} />
    </At>
    <At from={517.9} to={529.2}>
      <PromptBox n={1} x={1000} y={300} end={11.3} text="change la tenue de mon personnage, mets-lui un pyjama" />
    </At>
    <At from={535.2} to={542.0}>
      <PromptBox n={2} x={1000} y={300} end={6.8} text="change le décor et mets-le dans un casino" />
    </At>
    <At from={542.1} to={549.1}>
      <PromptBox n={3} x={1000} y={300} end={7.0} text="mets-lui un objet dans la main, genre un sac à main, duffel bag" />
    </At>
    <At from={549.2} to={552.4}>
      <ScreenTag text="⏩ 3 générations en parallèle" end={3.2} />
    </At>
    {/* 9:12,4 → 9:24,4 : « je te mettrai à l'écran les trois vidéos… l'original… compare » */}
    <At from={552.4} to={564.45}>
      <Showcase end={12.05} eyebrow="Une seule vidéo de 9 s → 4 épisodes" items={[{ src: `${D}/ref.mp4`, label: "Original" }, { src: `${D}/gen_costume.mp4`, label: "Costume" }, { src: `${D}/gen_pyjama.mp4`, label: "*Pyjama*" }, { src: `${D}/gen_casino.mp4`, label: "*Casino*" }, { src: `${D}/gen_sac.mp4`, label: "*Sac de voyage*" }]} />
    </At>
    <At from={564.6} to={570.25}>
      <TopTag text="🔗 Premier lien en description + commentaire épinglé" end={5.65} at={0.2} />
    </At>
    <At from={570.3} to={585.866}>
      <FocusVeil start={0} end={16} dark={0.7} />
      <NextVideo end={15.6} title="J'ai cloné l'influenceur IA qui a *explosé* en 2 semaines" meta="Jean Phil · plus de 100 M de vues" cta="Clique ici ↗" ctaAt={12.6} />
    </At>
  </>
);

export const MontageHiggsInflu3: React.FC = () => (
  <AbsoluteFill style={{ background: "black" }}>
    <DemoScreens />
    <DemoScreens4 />
    <AbsoluteFill>
      <FacePip src={FACE} trimBefore={0} face={FACE_POS} grade={GRADE} keys={[{ t: 0, p: 0 }, { t: 329.9, p: 0 }, { t: 330.9, p: 1 }, { t: 564.5, p: 1 }, { t: 565.4, p: 0 }]} zoomKeys={[{ t: 0, z: 1.0 }, { t: 14.6, z: 1.0 }, { t: 19.8, z: 1.06 }, { t: 22.6, z: 1.09 }, { t: 57, z: 1.0 }, { t: 64.4, z: 1.05 }, { t: 70, z: 1.06 }, { t: 72.5, z: 1.0 }, { t: 77, z: 1.04 }, { t: 107.2, z: 1.0 }, { t: 125.4, z: 1.06 }, { t: 128, z: 1.0 }, { t: 137.4, z: 1.04 }, { t: 156.8, z: 1.0 }, { t: 172, z: 1.06 }, { t: 196.4, z: 1.06 }, { t: 199.0, z: 1.0 }, { t: 206.1, z: 1.04 }, { t: 230.5, z: 1.0 }, { t: 258.4, z: 1.07 }, { t: 261.4, z: 1.0 }, { t: 292.2, z: 1.06 }, { t: 320.0, z: 1.0 }, { t: 329.3, z: 1.04 }]} />
    </AbsoluteFill>
    <BlocH />
    <BlocB1 />
    <BlocB2 />
    <BlocB3 />
    <BlocB4 />
    <SfxTrack cues={SFX} />
    <Audio src={staticFile(`${D}/voice.wav`)} />
    <MusicTrack />
    <Grain />
  </AbsoluteFill>
);
