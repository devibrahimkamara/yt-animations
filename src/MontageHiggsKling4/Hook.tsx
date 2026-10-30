// Étape 5 : prototype de la 1re minute (0:00 → 1:02,4), au style final. Plan validé : montages/higgs-kling4/04-plan.md.
// Timeline = temps source (aucune coupe, vitesse ×1,00). Ibrahim lit son script de 0:00 à 1:39 (01-analyse § 3) :
// tout est en illustration plein cadre opaque, la face cam n'apparaît pas (§ 4.4ter).
import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile } from "remotion";
import { Backdrop, f, Grain, KeyLine, SfxTrack, SFX_KIT, type SfxCue } from "../montage/lib";
import { mixGain, type MixEvent } from "../montage/mix";
import { CornerPill } from "../MontageHostingerProduits/Illus";
import { BizCards, CAP, CapFan, CapIntro, CapStat, D, FourFrames, PubSquare } from "./Illus";

export const HOOK_END = 62.4;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const At: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => (
  <Sequence from={f(from)} durationInFrames={Math.max(1, f(to) - f(from))} layout="none">
    <AbsoluteFill>{children}</AbsoluteFill>
  </Sequence>
);

// ─── Son ───
const SFX_SRC: SfxCue[] = [
  { k: "popSelectA", at: 4.55 },
  { k: "popSelectB", at: 4.85 },
  { k: "popSelectA", at: 5.15 },
  { k: "popSelectB", at: 5.45 },
  { k: "whoosh03", at: 7.55 },
  { k: "popSelectA", at: 7.7 },
  { k: "popSelectB", at: 8.0 },
  { k: "impactDeep", at: 15.94, gain: 0.5 }, // 19 694 722
  { k: "whoosh02", at: 18.0 },
  { k: "popSelectA", at: 18.1 },
  { k: "popSelectB", at: 18.5 },
  { k: "popSelectA", at: 18.9 },
  { k: "whoosh01", at: 22.2 },
  { k: "popNotif02", at: 25.46, gain: 0.6 },
  { k: "whoosh03", at: 28.4 },
  { k: "popSelectB", at: 32.0 },
  { k: "popSelectA", at: 34.4 },
  { k: "popSelectB", at: 35.98 },
  { k: "popSelectA", at: 37.34 },
  { k: "popSelectB", at: 38.6 },
  { k: "whoosh02", at: 41.95 },
  { k: "popSelectA", at: 49.56 },
  { k: "popSelectB", at: 50.22 },
  { k: "whoosh01", at: 51.7 },
  { k: "popNotif02", at: 55.32, gain: 0.6 },
  { k: "whoosh03", at: 56.75 },
  { k: "impactHitLow", at: 58.32, gain: 0.4 }, // Nova Media Lab
];
const SFX: SfxCue[] = SFX_SRC.map((c) => ({ ...c, gain: (c.gain ?? SFX_KIT[c.k].gain) * (c.at < 20 ? 0.42 : 0.6) }));

const PARTS = [
  { file: "m0_hook_unfinished_stories.mp3", from: 3.0, to: 28.4, lufs: -31, src: -12.0, fadeIn: 1.4, fadeOut: 1.4, skip: 0 },
  { file: "m1_contexte_groundhog_day.mp3", from: 28.2, to: HOOK_END, lufs: -32, src: -9.6, fadeIn: 1.4, fadeOut: 0.8, skip: 0 },
];
const MIX: MixEvent[] = [
  { k: "stop", at: 15.8, back: 17.0, fadeOut: 0.12, fadeIn: 0.8 }, // le chiffre Threads : silence + impact
  { k: "swell", from: 4.4, to: 7.2, db: 2 }, // les 4 images
  { k: "dip", from: 22.2, to: 28.3, db: 3 }, // la question : la voix devant
  { k: "dip", from: 56.7, to: 62.4, db: 3 }, // Nova Media Lab, jamais montré
];
const MusicTrack: React.FC = () => (
  <>
    {PARTS.map((p) => {
      const g = Math.pow(10, (p.lufs - p.src) / 20);
      return (
        <Sequence key={p.file} from={f(p.from)} durationInFrames={f(p.to - p.from)}>
          <Audio src={staticFile(`epidemic/higgs-kling4/hq/${p.file}`)} trimBefore={f(p.skip)} volume={(fr) => { const t = p.from + fr / 30; return g * interpolate(t, [p.from, p.from + p.fadeIn, p.to - p.fadeOut, p.to], [0, 1, 1, 0], clamp) * mixGain(t, MIX); }} />
        </Sequence>
      );
    })}
  </>
);

/** Le son propre de la pub (stéréo, Kling 4.0) pendant les 4 premières secondes, sous la voix. */
const PubSound: React.FC = () => (
  <Sequence from={0} durationInFrames={f(4.6)}>
    <Audio src={staticFile(`${D}/pub.mp4`)} volume={(fr) => 0.5 * interpolate(fr / 30, [0, 0.2, 3.9, 4.6], [0, 1, 1, 0], clamp)} />
  </Sequence>
);

export const Kling4Hook: React.FC = () => (
  <AbsoluteFill style={{ background: "black" }}>
    <Backdrop />
    {/* 0 → 4,3 : la pub, nue (aucun acteur, aucune caméra) */}
    <At from={0} to={4.3}>
      <PubSquare end={4.3} muted caption="Personne ne l'a *filmée*." captionAt={1.7} />
    </At>
    {/* 4,3 → 7,5 : planifiée en 4 images */}
    <At from={4.3} to={7.5}>
      <FourFrames end={3.2} ats={[0.25, 0.55, 0.85, 1.15]} title="*4 images*. L'IA a tourné le reste." titleAt={0.9} />
    </At>
    {/* 7,5 → 15,0 : le marketing de 2 business confié à l'IA */}
    <At from={7.5} to={15.0}>
      <BizCards
        end={7.5}
        title="Le marketing de *2 business*, confié à l'IA"
        titleAt={1.4}
        left={{ title: "Ibrahim *Kamara*", meta: "Ma marque", at: 0.15 }}
        right={{ title: "Nova Media *Lab*", meta: "Mon agence", at: 0.45 }}
        linkAt={2.6}
      />
    </At>
    {/* 15,0 → 18,0 : le vrai chiffre de l'écran (la voix dit « plus de 20 millions ») */}
    <At from={15.0} to={17.96}>
      <CapStat src={`${CAP}/threads_overview.png`} end={2.96} value={19694722} valueAt={0.9} label="vues en *30 jours*" source="Threads · Insights" crop={{ x: 880, y: 372, w: 175, h: 118 }} />
    </At>
    {/* 18,0 → 22,1 : tous mes chiffres */}
    <At from={17.96} to={22.12}>
      <CapFan
        end={4.16}
        title="Tous mes *chiffres*"
        titleAt={2.4}
        items={[
          { src: `${CAP}/threads_overview.png`, label: "Threads", at: 0.1 },
          { src: `${CAP}/linkedin_impressions.png`, label: "LinkedIn", at: 0.5 },
          { src: `${CAP}/gsc_nova.png`, label: "Google", at: 0.9 },
        ]}
      />
    </At>
    {/* 22,1 → 28,3 : la question de la vidéo */}
    <At from={22.12} to={28.34}>
      <Backdrop />
      <KeyLine
        end={6.22}
        valign="center"
        size={124}
        words={[
          { w: "L'IA", t: 1.44 },
          { w: "peut-elle", t: 2.58 },
          { w: "gérer", t: 3.34, hl: true },
          { w: "un business", t: 3.88 },
          { w: "?", t: 4.3 },
        ]}
      />
    </At>
    {/* 28,3 → 41,9 : présentation (profil LinkedIn réel) + s'abonner */}
    <At from={28.34} to={41.9}>
      <CapIntro src={`${CAP}/linkedin_profil.png`} end={13.56} eyebrow="Pour ceux qui me découvrent" title="Ibrahim *Kamara*" titleAt={0.8} meta="Business en ligne depuis *2020*" metaAt={3.64} chips={[{ text: "Je documente tout", at: 6.06 }, { text: "IA", at: 7.64 }, { text: "Argent en ligne", at: 9.0 }]} />
      <Sequence from={f(10.26)} layout="none">
        <CornerPill text="S'abonner 🔔" end={3.3} />
      </Sequence>
    </At>
    {/* 41,9 → 51,6 : mon business n°1, ma marque (profil Threads réel) */}
    <At from={41.9} to={51.58}>
      <CapIntro
        src={`${CAP}/threads_profil.png`}
        end={9.68}
        eyebrow="Business n°1 · ma marque"
        title="Ibrahim *Kamara*"
        titleAt={3.86}
        meta="Du contenu, partout"
        metaAt={5.94}
        chips={[
          { text: "YouTube", at: 7.66 },
          { text: "Instagram", at: 8.32 },
          { text: "Threads", at: 8.9 },
          { text: "LinkedIn", at: 9.1 },
        ]}
      />
    </At>
    {/* 51,6 → 56,7 : un 2e business, jamais montré */}
    <At from={51.58} to={56.68}>
      <BizCards end={5.1} left={{ title: "Ibrahim *Kamara*", meta: "Ma marque", at: 0.05, dim: 2.4 }} right={{ title: "*?*", meta: "Jamais montré nulle part", at: 3.7 }} />
    </At>
    {/* 56,7 → 62,4 : Nova Media Lab, agence en Indonésie (Search Console réelle) */}
    <At from={56.68} to={HOOK_END}>
      <CapIntro src={`${CAP}/gsc_nova.png`} end={HOOK_END - 56.68} eyebrow="Business n°2" title="Nova Media *Lab*" titleAt={0.6} meta="Agence de marketing digital · *Indonésie*" metaAt={4.7} />
    </At>
    <SfxTrack cues={SFX} />
    <PubSound />
    <Sequence from={0} durationInFrames={f(HOOK_END)}>
      <Audio src={staticFile(`${D}/voice.wav`)} />
    </Sequence>
    <MusicTrack />
    <Grain />
  </AbsoluteFill>
);

