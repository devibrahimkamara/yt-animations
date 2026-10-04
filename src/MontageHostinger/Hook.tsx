// Montage Hostinger — Étape 5 : prototype du bloc H (0:00 → 1:15).
// Plan : montages/hostinger/04-plan.md · Timeline : 03-audio (validée) · PLAYBOOK §8.
// Temps en secondes de la timeline montée. Source = T jusqu'à 65,62 ; ensuite source = T + 18,84.
// Retour marque M1 : on ne voit jamais l'accueil Hostinger avant la démo.
import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile } from "remotion";
import { blurIn, f, FaceCam, FocusVeil, FONT, glass, Grain, INK, inOut, KeyLine, MUTED, Pill, Reveal, rich, ScreenStage, SfxTrack, Star, Stat, useT, type SfxCue } from "../montage/lib";
import { Tag, TutoMap } from "../montage/Explainers";

export const CUT_AT = 65.62; // coupe validée (source 65,62 → 84,46)
export const CUT_LEN = 18.84;
export const HOOK_END = 74.86; // « Donc on va aller sur ce site-là » (source 93,70) : début du bloc 1
const FACE = { x: 0.487, y: 0.38 };
const GRADE = "brightness(1.16) contrast(1.06) saturate(1.05)"; // face cam très sombre (22/255)

// Capture : fenêtre de l'éditeur 108,54 → 1811,1025 ; zone du site seul (sans la barre de l'éditeur).
const WIN_APP = { x: 108, y: 54, w: 1704, h: 972 };
const WIN_SITE = { x: 118, y: 172, w: 1683, h: 843 };

// Musique : Bakka (Epidemic 276212), extrait d'écoute en attendant le HQ. −9,9 LUFS → ≈ −29 LUFS.
const MUSIC_FILE = "epidemic/hostinger/previews/P0_hook__bakka__es276212.mp3";
const MUSIC_GAIN = Math.pow(10, (-29 - -9.9) / 20);
export const hookMusicLevel = (t: number, tail = false) =>
  interpolate(t, [0, 0.4, 8.3, 8.7, 11.3, 11.7, 71.2, 71.5, HOOK_END - 0.5, HOOK_END], [0, 1, 1, 1.25, 1.25, 1, 1, 1.3, 1.3, tail ? 1 : 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Zoom progressif de la face cam (≤ ×1,08) ; les changements de niveau tombent sous les inserts.
const FACE_ZOOM_A = [
  { t: 18.3, z: 1.0 },
  { t: 21.9, z: 1.03 },
  { t: 38.7, z: 1.0 },
  { t: 46.3, z: 1.045 },
  { t: 55.2, z: 1.07 },
  { t: CUT_AT, z: 1.08 },
];
const FACE_ZOOM_B = [
  { t: 0, z: 1.03 }, // après la coupe : léger recadrage, ça masque le saut
  { t: 6, z: 1.06 },
];

const SFX: SfxCue[] = [
  { k: "impactDeep", at: 8.55 }, // 1 000 €
  { k: "whoosh02", at: 12.25 }, // 10 à 20
  { k: "popNotif03", at: 12.5, gain: 0.6 },
  { k: "whoosh01", at: 18.1 }, // retour face cam
  { k: "whoosh03", at: 21.7 }, // ibrahimkamara.com
  { k: "popSelectA", at: 27.9 },
  { k: "whoosh01", at: 38.5 },
  { k: "popSelectA", at: 46.9 }, // pastilles
  { k: "popSelectB", at: 52.2 },
  { k: "clickNotif05", at: 56.7, gain: 0.6 }, // bandeau nom
  { k: "whoosh03", at: 71.3 }, // carte du tuto
  { k: "popSelectA", at: 71.95 },
  { k: "popSelectB", at: 72.4 },
  { k: "popSelectA", at: 72.85 },
  { k: "popSelectB", at: 73.3 },
  { k: "popSelectA", at: 73.75 },
];

/** Dégradé sombre en bas de la face cam : lisibilité des phrases posées sur le t-shirt clair. */
const Scrim: React.FC<{ end: number }> = ({ end }) => {
  const t = useT();
  return <AbsoluteFill style={{ opacity: inOut(t, 0, end, 0.35, 0.4), background: "linear-gradient(180deg, transparent 45%, rgba(5,7,4,0.55) 72%, rgba(5,7,4,0.85) 100%)" }} />;
};

/** Deux pastilles au mot (« pour ton entreprise » · « pour des clients »), en bas. */
const TwoPills: React.FC<{ items: { text: string; at: number }[]; end: number }> = ({ items, end }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.01, 0.4);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 130, opacity: o }}>
      <div style={{ display: "flex", gap: 34 }}>
        {items.map((it, i) => (
          <div key={i} style={blurIn(t, it.at, 0.45, 24)}>
            <Pill size={58} accent={i === 1} dot={i === 0 ? INK : undefined}>
              {it.text}
            </Pill>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** Bandeau nom (« Ibrahim Kamara · YouTube depuis 6 ans »), en bas à gauche. */
const NameBand: React.FC<{ name: string; meta: string; metaAt: number; end: number }> = ({ name, meta, metaAt, end }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.01, 0.4);
  const b = blurIn(t, 0, 0.5, 26);
  return (
    <div style={{ position: "absolute", left: 110, bottom: 110, opacity: Math.min(o, Number(b.opacity)), transform: b.transform, filter: b.filter }}>
      <div style={{ ...glass, background: "linear-gradient(180deg, rgba(18,22,15,0.9), rgba(18,22,15,0.82))", borderRadius: 34, padding: "28px 44px 28px 34px", display: "flex", alignItems: "center", gap: 26, fontFamily: FONT }}>
        <Star size={52} />
        <div>
          <div style={{ fontSize: 64, fontWeight: 500, color: INK, letterSpacing: "-0.03em", lineHeight: 1.05 }}>{name}</div>
          <div style={{ fontSize: 40, color: MUTED, marginTop: 6, ...blurIn(t, metaAt) }}>{rich(meta)}</div>
        </div>
      </div>
    </div>
  );
};

const Body: React.FC = () => (
  <AbsoluteFill>
    {/* Face cam (avant la coupe) */}
    <Sequence from={0} durationInFrames={f(CUT_AT)}>
      <FaceCam src="montage/hostinger/face_0-96.mp4" trimBefore={0} zoomKeys={FACE_ZOOM_A} face={FACE} grade={GRADE} />
    </Sequence>
    {/* Face cam (après la coupe : source 84,46) */}
    <Sequence from={f(CUT_AT)}>
      <FaceCam src="montage/hostinger/face_0-96.mp4" trimBefore={CUT_AT + CUT_LEN} zoomKeys={FACE_ZOOM_B} face={FACE} grade={GRADE} />
    </Sequence>

    {/* 0:00 « le site que tu vois à mon écran » : le site du garage (et non l'accueil Hostinger) */}
    <Sequence from={0} durationInFrames={f(18.3)}>
      <Reveal end={18.3} inDur={0.01}>
        <ScreenStage
          src="montage/hostinger/screen_285-440.mp4"
          trimBefore={7.0} // source 292
          win={WIN_SITE}
          keys={[
            { t: 0, z: 0.86, cx: 959, cy: 593 },
            { t: 1.0, z: 0.86, cx: 959, cy: 593 },
            { t: 5.5, z: 1.02, cx: 900, cy: 560 },
            { t: 8.2, z: 1.08, cx: 900, cy: 560 },
            { t: 14.4, z: 1.08, cx: 960, cy: 593 },
            { t: 18.3, z: 1.0, cx: 960, cy: 593 },
          ]}
          tilt={[
            { t: 0, rx: 6, ry: -10 },
            { t: 0.4, rx: 6, ry: -10 },
            { t: 3.0, rx: 0, ry: 0 },
          ]}
          dim={(tt) => interpolate(tt, [8.2, 8.7, 14.3, 14.8], [0, 0.8, 0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
          blur={(tt) => interpolate(tt, [8.2, 8.8, 14.2, 14.8], [0, 10, 10, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
        <Stat value={1000} start={8.45} end={11.75} label="minimum pour un site *comme celui-ci*" context="Prix de vente" format={(n) => `${Math.round(n).toLocaleString("fr-FR")} €`} />
        <Stat value={20} start={12.3} end={14.6} label="sites *par jour*" format={(n) => `10 à ${Math.max(10, Math.round(n))}`} />
      </Reveal>
    </Sequence>

    {/* « c'est l'intelligence artificielle » */}
    <Sequence from={f(18.4)} durationInFrames={f(21.9 - 18.4)}>
      <FocusVeil start={0} end={21.9 - 18.4} />
      <KeyLine
        end={21.9 - 18.4}
        valign="center"
        size={130}
        maxWidth={1660}
        words={[
          { w: "c'est", t: 18.9 - 18.4 },
          { w: "l'intelligence", t: 19.1 - 18.4, hl: true },
          { w: "artificielle", t: 19.4 - 18.4, hl: true },
        ]}
      />
    </Sequence>

    {/* Preuve : ibrahimkamara.com (déjà dans la capture, source = T) */}
    <Sequence from={f(21.9)} durationInFrames={f(38.7 - 21.9)}>
      <Reveal end={38.7 - 21.9}>
        <ScreenStage
          src="montage/hostinger/screen_0-96.mp4"
          trimBefore={21.9}
          win={WIN_APP}
          keys={[
            { t: 0, z: 0.8, cx: 960, cy: 540 },
            { t: 0.4, z: 0.8, cx: 960, cy: 540 },
            { t: 3.5, z: 0.92, cx: 960, cy: 540 },
            { t: 16.8, z: 1.0, cx: 960, cy: 540 },
          ]}
          tilt={[
            { t: 0, rx: 5, ry: 9 },
            { t: 0.4, rx: 5, ry: 9 },
            { t: 2.6, rx: 0, ry: 0 },
          ]}
        />
        <Tag text="ibrahimkamara.com · fait avec cette méthode" start={27.9 - 21.9} end={33.5 - 21.9} left={140} top={36} />
      </Reveal>
    </Sequence>

    {/* « créer un tel site… et en faire de l'argent » */}
    <Sequence from={f(41.4)} durationInFrames={f(46.3 - 41.4)}>
      <Scrim end={46.3 - 41.4} />
      <KeyLine
        end={46.3 - 41.4}
        size={84}
        maxWidth={1800}
        words={[
          { w: "créer", t: 41.64 - 41.4 },
          { w: "un", t: 41.98 - 41.4 },
          { w: "tel", t: 42.28 - 41.4 },
          { w: "site…", t: 42.38 - 41.4 },
          { w: "et", t: 43.34 - 41.4 },
          { w: "en", t: 44.4 - 41.4 },
          { w: "faire", t: 44.4 - 41.4 },
          { w: "de", t: 44.56 - 41.4 },
          { w: "l'argent", t: 44.7 - 41.4, hl: true },
        ]}
      />
    </Sequence>

    {/* Pour ton entreprise · Pour des clients */}
    <Sequence from={f(46.6)} durationInFrames={f(55.2 - 46.6)}>
      <Scrim end={55.2 - 46.6} />
      <TwoPills
        end={55.2 - 46.6}
        items={[
          { text: "Pour ton entreprise", at: 46.9 - 46.6 },
          { text: "Pour des clients", at: 52.2 - 46.6 },
        ]}
      />
    </Sequence>

    {/* Bandeau nom */}
    <Sequence from={f(56.6)} durationInFrames={f(61.8 - 56.6)}>
      <NameBand name="Ibrahim Kamara" meta="YouTube depuis *6 ans*" metaAt={58.4 - 56.6} end={61.8 - 56.6} />
    </Sequence>

    {/* « avant, il fallait savoir coder » (après la coupe) */}
    <Sequence from={f(66.0)} durationInFrames={f(71.3 - 66.0)}>
      <Scrim end={71.3 - 66.0} />
      <KeyLine
        end={71.3 - 66.0}
        size={100}
        words={[
          { w: "avant,", t: 0.1 },
          { w: "il", t: 67.5 - 66.0 },
          { w: "fallait", t: 67.6 - 66.0 },
          { w: "savoir", t: 68.8 - 66.0 },
          { w: "coder", t: 69.56 - 66.0, hl: true },
        ]}
      />
    </Sequence>

    {/* « de nos jours… avec l'IA » : carte du tuto */}
    <Sequence from={f(71.3)} durationInFrames={f(HOOK_END - 71.3)}>
      <TutoMap
        eyebrow="Aujourd'hui, avec l'IA"
        title="5 étapes, *dans l'ordre*"
        end={HOOK_END - 71.3}
        titleAt={0.05}
        steps={[
          { n: 1, label: "Hostinger", at: 0.6 },
          { n: 2, label: "Le prompt", at: 1.05 },
          { n: 3, label: "Le site", at: 1.5 },
          { n: 4, label: "Modifier", at: 1.95 },
          { n: 5, label: "Publier", at: 2.4 },
        ]}
      />
    </Sequence>

    <SfxTrack cues={SFX} />
    <Grain />
  </AbsoluteFill>
);

/** `embedded` : dans le montage complet, la voix et la musique sont gérées par MontageHostinger. */
export const MontageHostingerHook: React.FC<{ embedded?: boolean }> = ({ embedded }) => (
  <AbsoluteFill style={{ background: "black" }}>
    <Body />
    {!embedded && (
      <>
        <Audio src={staticFile("montage/hostinger/audio_h.wav")} />
        <Audio src={staticFile(MUSIC_FILE)} volume={(fr) => MUSIC_GAIN * hookMusicLevel(fr / 30)} />
      </>
    )}
  </AbsoluteFill>
);
