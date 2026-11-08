// Montage « MiniMax » (jeu mobile Stack Up créé avec MiniMax Code ; sponsor : MiniMax / Tec-Do).
// Timeline = la vidéo telle que tournée + 2 voix seules exigées par la marque (étape 3, 03-audio/edl.json).
// Plan : montages/minimax/04-plan.md. Source unique fusionnée (capture + médaillon) → médaillon reconstruit.
import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile } from "remotion";
import { f, FaceCam, FocusVeil, Grain, KeyLine, ScreenStage, SfxTrack, type SfxCue } from "../montage/lib";
import { StepLT } from "../montage/Explainers";
import { mixGain, type MixEvent } from "../montage/mix";
import { D, GlassTag, GlideToPip, InfoCard, LogoCard, MedallionPip, NextVideo, PhoneClip, PlatformDuo, PromptHero, ScreenFrag, SRC, StepCard5, StillFrag, TeaserReel, TUTO, TutoMap5, WIN } from "./Illus";

// Timeline : segments source + voix seules insérées (V1 avant 187,47 s, V2 avant 568,50 s)
export const KEEP: { a: number; b: number; insBefore: number }[] = [
  { a: 0, b: 187.47, insBefore: 0 },
  { a: 187.47, b: 568.5, insBefore: 14.35 },
  { a: 568.5, b: 582.9935, insBefore: 13.5 },
];
const START: number[] = [];
{
  let tl = 0;
  for (const k of KEEP) { tl += k.insBefore; START.push(tl); tl += k.b - k.a; }
}
/** Temps de la timeline pour un temps source s. */
export const T = (s: number) => {
  const i = KEEP.findIndex((k, j) => s >= k.a && (s < k.b || (j === KEEP.length - 1 && s <= k.b)));
  return i < 0 ? NaN : START[i] + s - KEEP[i].a;
};
export const FULL_DURATION = 610.843;
const FACE_POS = { x: 0.5, y: 0.33 };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const At: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => (
  <Sequence from={f(from)} durationInFrames={Math.max(1, f(to) - f(from))} layout="none">
    <AbsoluteFill>{children}</AbsoluteFill>
  </Sequence>
);

// ─── Son ───
const SFX: SfxCue[] = [
  { k: "impactDeep", at: 2.74, gain: 0.5 }, // « 15 minutes »
  { k: "whoosh03", at: 4.6 }, // le prompt
  { k: "popSelectA", at: 4.75 },
  { k: "whoosh02", at: 6.0 }, // les visuels
  { k: "whoosh01", at: 7.7 }, // teaser
  { k: "popSelectB", at: 8.85 },
  { k: "popSelectA", at: 10.0 },
  { k: "popSelectB", at: 11.15 },
  { k: "whoosh03", at: 12.3 }, // retour face cam
  { k: "popSelectA", at: 15.45 }, // logo
  { k: "whoosh02", at: 17.3 }, // la Carte du tuto
  { k: "popSelectB", at: 18.7 },
  { k: "popSelectA", at: 19.96 },
  { k: "popSelectB", at: 22.34 },
  { k: "confirmAlert03", at: 26.1, gain: 0.45 },
  { k: "popSelectA", at: 32.55 }, // l'argent
  { k: "whoosh03", at: 35.2 }, // Poki
  { k: "popSelectB", at: 35.96 },
  { k: "popNotif02", at: 36.75, gain: 0.6 },
  { k: "whoosh02", at: 38.15 }, // le Glissé
  { k: "whoosh01", at: 40.75 }, // carton Étape 1
  { k: "popSelectA", at: 43.0 },
  { k: "clickA", at: 52.0, gain: 0.5 }, // menu de téléchargement
  { k: "popNotif02", at: 50.8, gain: 0.6 }, // commentaire épinglé
  { k: "popSelectB", at: 55.65 },
  // Reste de la vidéo (version essentielle)
  { k: "whoosh01", at: 133.0 }, // Étape 2
  { k: "popSelectA", at: 135.4 },
  { k: "whoosh03", at: 187.5 }, // voix seule 1 : M3.1
  { k: "popSelectB", at: 188.0 },
  { k: "popSelectA", at: 196.1 },
  { k: "popSelectB", at: 198.1 },
  { k: "whoosh02", at: 201.8 },
  { k: "whoosh01", at: 291.5 }, // Étape 3
  { k: "popSelectA", at: 293.9 },
  { k: "whoosh01", at: 453.5 }, // Étape 4
  { k: "popSelectA", at: 455.9 },
  { k: "whoosh02", at: 539.9 }, // récap (lecture couverte)
  { k: "popSelectA", at: 543.9 },
  { k: "popSelectB", at: 545.6 },
  { k: "popSelectA", at: 548.9 },
  { k: "whoosh01", at: 549.55 }, // Étape 5
  { k: "popSelectB", at: 553.5 },
  { k: "whoosh03", at: 582.9 }, // voix seule 2
  { k: "confirmAlert03", at: 590.0, gain: 0.45 },
  { k: "whoosh02", at: 596.4 }, // CTA
  { k: "popNotif02", at: 597.9, gain: 0.6 },
  { k: "popSelectA", at: 599.5 },
  { k: "whoosh03", at: 606.5 }, // vidéo suivante
];

// Musique par partie (04-identite-sonore.md) ; lufs = cible du lit (voix à −16), src = LUFS du fichier HQ
const PARTS = [
  { file: "m0_ghosting.mp3", from: 3.4, to: 40.6, lufs: -31, src: -12.1, fadeIn: 1.2, fadeOut: 1.5, skip: 0 },
  { file: "m1_neon_noir.mp3", from: 40.9, to: 133.4, lufs: -32, src: -10.1, fadeIn: 1.5, fadeOut: 1.5, skip: 0 },
  { file: "m2_miles.mp3", from: 134.2, to: 292.0, lufs: -32, src: -9.5, fadeIn: 1.5, fadeOut: 1.5, skip: 0 },
  { file: "m3_autophagy.mp3", from: 292.6, to: 466.0, lufs: -32, src: -9.5, fadeIn: 1.2, fadeOut: 2.0, skip: 0 },
  { file: "m4_cold_conclusion.mp3", from: 465.4, to: 610.84, lufs: -32, src: -17.1, fadeIn: 2.0, fadeOut: 1.5, skip: 0 },
];
const MIX: MixEvent[] = [
  { k: "dip", from: 36.8, to: 38.5, db: 4 }, // « on en parle plus tard »
  { k: "dip", from: 187.6, to: 201.6, db: 3 }, // voix seule 1 (M3.1)
  { k: "dip", from: 583.0, to: 596.2, db: 3 }, // voix seule 2 (avis)
  { k: "dip", from: 596.4, to: 606.3, db: 3 }, // CTA
];
const MusicTrack: React.FC = () => (
  <>
    {PARTS.map((p) => {
      const g = Math.pow(10, (p.lufs - p.src) / 20);
      return (
        <Sequence key={p.file + p.from} from={f(p.from)} durationInFrames={f(p.to - p.from)}>
          <Audio src={staticFile(`epidemic/minimax/hq/${p.file}`)} trimBefore={f(p.skip)} volume={(fr) => { const t = p.from + fr / 30; return g * interpolate(t, [p.from, p.from + p.fadeIn, p.to - p.fadeOut, p.to], [0, 1, 1, 0], clamp) * mixGain(t, MIX); }} />
        </Sequence>
      );
    })}
  </>
);

// ══ BLOC H (0:00 → 1:00) ══
// 0 → 12,3 : Ibrahim lit son script (regard bas) → entièrement illustré, on ne le voit pas.
const PROMPT = "Crée un jeu mobile jouable dans le navigateur, à une seule touche, appelé \"Stack Up\"…";
const BlocH: React.FC = () => (
  <>
    {/* 0 → 4,6 : la preuve d'abord — le jeu sur son vrai téléphone, sans musique */}
    <At from={0} to={4.6}>
      <PhoneClip from={515} end={4.6} lines={[{ text: "Il y a *15 minutes*,", at: 2.74 }, { text: "ce jeu n'existait pas", at: 2.95 }]} />
    </At>
    {/* 4,6 → 6,0 : « je n'ai pas écrit une seule ligne de code » */}
    <At from={4.6} to={6.0}>
      <PromptHero end={1.4} headline="0 ligne de *code*" text={PROMPT} typeDur={1.0} />
    </At>
    {/* 6,0 → 7,7 : « j'ai créé tous les visuels » — les vrais visuels générés (direction pastel) */}
    <At from={6.0} to={7.7}>
      <ScreenFrag trimBefore={229} z={1.6} cx={835} cy={390} end={1.7} tilt caption="Les visuels · *design* compris" captionAt={0.15} />
    </At>
    {/* 7,7 → 12,3 : « à la fin de cette vidéo, tu auras la méthode » — teaser des moments forts */}
    <At from={7.7} to={12.3}>
      <TeaserReel
        end={4.6}
        eyebrow="Dans cette vidéo"
        label="Ta méthode, *étape par étape*"
        labelAt={2.6}
        items={[
          { at: 0, dur: 1.15, node: <ScreenFrag trimBefore={204} z={1.5} cx={950} cy={540} end={1.15} /> },
          { at: 1.15, dur: 1.15, node: <ScreenFrag trimBefore={372.5} z={1.6} cx={720} cy={470} end={1.15} /> },
          { at: 2.3, dur: 1.15, node: <ScreenFrag trimBefore={430} z={1.3} cx={840} cy={520} end={1.15} /> },
          { at: 3.45, dur: 1.15, node: <PhoneClip from={519} end={1.15} x={730} lines={[]} /> },
        ]}
      />
    </At>
    {/* 12,3 → 38,9 : face cam (regard objectif) */}
    <At from={15.4} to={17.6}>
      <LogoCard end={2.2} name="MiniMax *Code*" />
    </At>
    {/* 17,3 → 30,4 : la Carte du tuto, construite sur « designé, codé, testé, publié » */}
    <At from={17.3} to={30.4}>
      <FocusVeil start={0} end={13.1} dark={0.72} />
      <TutoMap5 end={13.1} steps={TUTO.map((s, i) => ({ ...s, at: [0.15, 1.4, 2.66, 5.04, 8.78][i] }))} eyebrowAt={0.1} />
    </At>
    {/* 30,5 → 34,9 : « générer de l'argent » */}
    <At from={30.5} to={34.9}>
      <KeyLine end={4.4} size={104} words={[{ w: "Générer", t: 2.04 }, { w: "de", t: 2.4 }, { w: "l'argent", t: 2.5, hl: true }]} />
    </At>
    {/* 34,9 → 38,6 : Poki et CrazyGames (pages réelles) */}
    <At from={34.9} to={38.1}>
      <FocusVeil start={0} end={3.2} dark={0.66} />
      <PlatformDuo end={3.2} items={[{ src: "montage/minimax/captures/poki_home.png", name: "Poki", at: 0.34 }, { src: "montage/minimax/captures/crazygames_home.png", name: "CrazyGames", at: 1.06 }]} pill="On en parle *à la fin*" pillAt={1.88} />
    </At>
    {/* 40,75 → 43,0 : carton Étape 1 */}
    <At from={40.75} to={43.0}>
      <StepCard5 n={1} title="Installer *MiniMax Code*" end={2.25} />
    </At>
    <At from={43.0} to={133.0}>
      <StepLT n={1} text="Installer MiniMax Code" end={90.0} />
    </At>
    {/* 🏷️ le brief exige le commentaire épinglé */}
    <At from={50.8} to={53.6}>
      <GlassTag text="📌 Lien en *commentaire épinglé*" end={2.8} top={820} />
    </At>
    <At from={55.55} to={58.3}>
      <GlassTag text="Mac · Windows" end={2.75} top={820} />
    </At>
  </>
);

// Écrans (sous les textes) et face cam
const Picture: React.FC = () => (
  <>
    {/* 12,3 → 38,1 : face cam plein cadre, push-in doux */}
    <At from={12.3} to={38.1}>
      <FaceCam src={SRC} trimBefore={12.3} face={FACE_POS} zoomKeys={[{ t: 0, z: 1.0 }, { t: 3.6, z: 1.06 }, { t: 5.0, z: 1.06 }, { t: 18.2, z: 1.02 }, { t: 25.8, z: 1.08 }]} />
    </At>
    {/* 38,1 → 38,87 : « Le Glissé » vers le médaillon, l'écran apparaît dessous */}
    <At from={38.1} to={38.87}>
      <GlideToPip trimBefore={38.1} dur={0.77} face={FACE_POS} still={`${D}/still_39.png`} />
    </At>
    {/* 38,87 → 3:07,47 : le site, l'installation, la connexion, le dossier, les visuels (z = 1 après la 1re minute) */}
    <At from={38.87} to={187.47}>
      <ScreenStage
        src={SRC}
        trimBefore={38.87}
        win={WIN}
        masks={[
          { from: 21.0, to: 24.2, x: 1235, y: 158, w: 362, h: 450 }, // historique de téléchargements (le .dmg reste net)
          { from: 36.1, to: 45.8, x: 675, y: 498, w: 290, h: 52 }, // adresse Gmail
        ]}
        keys={[
          { t: 0, z: 1.0, cx: 960, cy: 540 },
          { t: 3.6, z: 1.0, cx: 960, cy: 540 },
          { t: 4.4, z: 1.7, cx: 960, cy: 480 },
          { t: 11.8, z: 1.7, cx: 960, cy: 480 },
          { t: 12.7, z: 1.85, cx: 960, cy: 545 },
          { t: 17.8, z: 1.85, cx: 960, cy: 545 },
          { t: 18.7, z: 1.0, cx: 960, cy: 540 },
        ]}
      />
      <MedallionPip trimBefore={38.87} />
    </At>
    {/* 3:07,47 → 3:21,82 : voix seule 1 — image fixe des menus (modèle, contexte, effort) */}
    <At from={187.47} to={201.82}>
      <StillFrag src={`${D}/still_191.png`} z={1.6} cx={1560} cy={700} end={14.35} />
    </At>
    {/* 3:21,82 → 8:18,35 : la démo (écran à z = 1, médaillon reconstruit) */}
    <At from={201.82} to={T(484)}>
      <ScreenStage src={SRC} trimBefore={187.47} win={WIN} keys={[{ t: 0, z: 1.0, cx: 960, cy: 540 }]} />
      <MedallionPip trimBefore={187.47} />
    </At>
    {/* 8:18,35 → 8:59,85 : le téléphone (plein cadre, recherches personnelles floutées) */}
    <At from={T(484)} to={T(525.5)}>
      <ScreenStage
        src={SRC}
        trimBefore={484}
        win={{ x: 0, y: 0, w: 1920, h: 1080 }}
        masks={[
          { from: 0, to: 19.8, x: 715, y: 360, w: 490, h: 300 }, // raccourcis Chrome
          { from: 19.8, to: 23.45, x: 715, y: 125, w: 490, h: 955 }, // historique de recherche
        ]}
        keys={[{ t: 0, z: 1.0, cx: 960, cy: 540 }]}
      />
    </At>
    {/* 9:13,35 → 9:41,15 : Poki et CrazyGames (écran + médaillon) */}
    <At from={T(539)} to={T(566.77)}>
      <ScreenStage src={SRC} trimBefore={539} win={WIN} keys={[{ t: 0, z: 1.0, cx: 960, cy: 540 }]} />
      <MedallionPip trimBefore={539} />
    </At>
    {/* 9:41,15 → 9:42,85 puis 9:56,35 → fin : face cam */}
    <At from={T(566.77)} to={T(568.4999)}>
      <FaceCam src={SRC} trimBefore={566.77} face={FACE_POS} zoomKeys={[{ t: 0, z: 1.0 }]} />
    </At>
    <At from={596.35} to={610.843}>
      <FaceCam src={SRC} trimBefore={568.5} face={FACE_POS} zoomKeys={[{ t: 0, z: 1.0 }, { t: 14.4, z: 1.06 }]} />
    </At>
  </>
);

// ══ Reste de la vidéo : version essentielle (titres des parties, exigences de la marque, lecture couverte) ══
const BlocRest: React.FC = () => (
  <>
    {/* Étape 2 */}
    <At from={133.0} to={135.3}>
      <StepCard5 n={2} title="Les *visuels* d'abord" end={2.3} />
    </At>
    <At from={135.3} to={291.4}>
      <StepLT n={2} text="Les visuels (Canvas)" end={156.1} />
    </At>
    {/* 🏷️ Voix seule 1 : présentation de M3.1 (faits du brief) */}
    <At from={187.47} to={201.82}>
      <InfoCard end={14.35} eyebrow="M3.1" lines={[{ text: "Le dernier modèle de MiniMax", at: 2.7 }, { text: "Spécialisé dans le code", at: 5.0 }, { text: "1M tokens de contexte", at: 8.6 }, { text: "Réflexion réglable", at: 10.6 }]} />
    </At>
    {/* Étape 3 */}
    <At from={291.5} to={293.8}>
      <StepCard5 n={3} title="*Coder* le jeu" end={2.3} />
    </At>
    <At from={293.8} to={453.5}>
      <StepLT n={3} text="Coder (Game Studio)" end={159.7} />
    </At>
    {/* Étape 4 */}
    <At from={453.5} to={455.8}>
      <StepCard5 n={4} title="Tester sur *mobile*" end={2.3} />
    </At>
    <At from={455.8} to={539.85}>
      <StepLT n={4} text="Tester (PC + mobile)" end={84.05} />
    </At>
    {/* 9:00 → 9:09,6 : Ibrahim lit son script → plein cadre */}
    <At from={539.85} to={549.55}>
      <PhoneClip from={511.8} end={9.7} inDur={0.3} lines={[{ text: "Teste ton jeu :", at: 0.3, size: 80 }, { text: "① Sur ton *ordinateur*", at: 4.0, size: 80 }, { text: "② En vue mobile", at: 6.0, size: 80 }, { text: "③ Sur ton téléphone", at: 9.0, size: 80 }]} />
    </At>
    {/* Étape 5 (plein cadre, fin de la lecture) */}
    <At from={549.55} to={553.4}>
      <StepCard5 n={5} title="Gagner de l'*argent*" end={3.85} />
    </At>
    <At from={553.4} to={582.85}>
      <StepLT n={5} text="L'argent (Poki, CrazyGames)" end={29.45} />
    </At>
    {/* 🏷️ Voix seule 2 : l'avis d'Ibrahim, sur le jeu qui tourne */}
    <At from={582.85} to={596.35}>
      <ScreenFrag trimBefore={424} z={1.3} cx={840} cy={520} end={13.5} />
      <InfoCard end={13.5} x={1180} y={300} width={640} eyebrow="Mon avis · M3.1" lines={[{ text: "Ce qui m'a le plus *bluffé* :", at: 1.6 }, { text: "testé et corrigé tout seul", at: 7.1 }, { text: "0 ligne de code", at: 12.4 }]} />
    </At>
    {/* 🏷️ CTA du brief : essai gratuit + points + M3.1 (plus « Flash Preview » : retour Tec-Do du 02/11) */}
    <At from={596.4} to={606.3}>
      <InfoCard end={9.9} x={1160} y={170} width={680} size={50} eyebrow="MiniMax Code · gratuit" lines={[{ text: "Des points offerts *chaque jour*", at: 0.9 }, { text: "400 / jour · 1 000 les jours 4 et 7", at: 1.7 }, { text: "4 000 points sur la semaine", at: 2.5 }, { text: "Avec M3.1", at: 3.3 }]} />
    </At>
    <At from={597.9} to={606.3}>
      <GlassTag text="📌 Liens en *commentaire épinglé*" end={8.4} top={900} />
    </At>
    {/* Vidéo suivante */}
    <At from={606.5} to={610.843}>
      <NextVideo end={4.343} eyebrow="À voir ensuite" title="Une idée de *business* avec l'IA" thumb={`${D}/next_thumb.jpg`} />
    </At>
  </>
);

const VoiceTrack: React.FC = () => <Audio src={staticFile(`${D}/voice.wav`)} />;

export const MontageMinimaxFull: React.FC = () => (
  <AbsoluteFill style={{ background: "black" }}>
    <Picture />
    <BlocH />
    <BlocRest />
    <SfxTrack cues={SFX} />
    <VoiceTrack />
    <MusicTrack />
    <Grain />
  </AbsoluteFill>
);
