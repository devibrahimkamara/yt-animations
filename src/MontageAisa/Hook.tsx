// Montage AIsa — Étape 5 : prototype des 60 premières secondes (bloc H).
// Plan : montages/aisa/04-plan.md · Timeline : 03-audio (validée) · PLAYBOOK §8.
// Temps en secondes de la nouvelle timeline. Face cam : comp t ↔ source t − 4.76.
import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile } from "remotion";
import { f, FaceCam, FocusVeil, Grain, inOut, KeyLine, LIME, MUSIC, musicGain, Reveal, ScreenStage, SFX_KIT, SfxTrack, Stat, useT, type SfxCue } from "../montage/lib";
import { BrandTiles, ChatMock, Tag, TutoMap } from "../montage/Explainers";

const FACE_OFFSET = 4.76;
const BODY_END = 62.5;
// Cold open (retour Ibrahim) : phrase entière « …51 000 fois dans l'intelligence artificielle »,
// puis fondu au noir, impact de suspense, « … » dans le silence, et on enchaîne.
const COLD_END = 4.79; // fin de la voix (source 133.68 → 138.47)
const BLACK = 2.0; // temps de suspense
const SHIFT = COLD_END + BLACK - FACE_OFFSET; // décalage du reste de la minute
export const HOOK_END = BODY_END + SHIFT;
export { FACE_OFFSET, SHIFT };
const C = { x: 0.52, y: 0.34 }; // visage dans la source

// Zoom progressif continu (retouche point 3) : ×1,00–×1,08 max, lent, sans saut.
// Les changements de niveau tombent pendant les inserts plein écran (invisibles).
const FACE_ZOOM = [
  { t: 4.76, z: 1.0 },
  { t: 10.4, z: 1.045 },
  { t: 13.3, z: 1.06 },
  { t: 21.36, z: 1.02 },
  { t: 25.3, z: 1.0 },
  { t: 28.9, z: 1.04 },
  { t: 46.6, z: 1.0 },
  { t: 53.6, z: 1.08 },
  { t: BODY_END, z: 1.06 },
].map((k) => ({ t: k.t - FACE_OFFSET, z: k.z }));

const SFX: SfxCue[] = [
  { k: "whoosh01", at: 13.3 }, // entrée du rapport
  { k: "popSelectA", at: 22.08 }, // tuiles IA
  { k: "popNotif02", at: 23.02 },
  { k: "popSelectB", at: 23.92 },
  { k: "popNotif12", at: 24.66, gain: 0.45 },
  { k: "clickKey", at: 30.55 }, // question tapée
  { k: "popNotif03", at: 31.95, gain: 0.6 }, // réponse
  { k: "clickKey", at: 36.05 },
  { k: "popSelectA", at: 36.6 },
  { k: "popSelectB", at: 41.95, gain: 0.45 }, // sources
  { k: "whoosh02", at: 48.25 }, // phrase-thèse
  { k: "confirmNotif13", at: 52.9 },
  { k: "whoosh03", at: 56.0 }, // carte du tuto
  { k: "popSelectA", at: 56.55 },
  { k: "popSelectB", at: 57.65 },
  { k: "popSelectA", at: 58.75 },
];

const MUSIC_GAIN = musicGain("hook"); // Mistaken Identity −11,3 LUFS → ≈ −29 LUFS (≈ 13 dB sous la voix)
/** Niveau relatif de la musique du hook (t = temps de l'ancienne timeline du Body). `tail` = laisser filer à la fin (montage complet). */
export const hookMusicLevel = (t: number, tail = false) =>
  interpolate(t, [FACE_OFFSET, FACE_OFFSET + 0.8, 28.9, 29.6, 45.9, 46.6, 55.6, 56.2, BODY_END - 0.6, BODY_END], [0, 1, 1, 0.85, 0.85, 1, 1, 1.3, 1.3, tail ? 1 : 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
const musicVol = (fr: number) => MUSIC_GAIN * hookMusicLevel(fr / 30 + FACE_OFFSET); // démarre sur la face cam, après le noir

const Body: React.FC<{ embedded?: boolean }> = ({ embedded }) => (
  <AbsoluteFill>
    {/* Face cam (faux multicam) sur toute la suite */}
    <Sequence from={f(FACE_OFFSET)}>
      <FaceCam src="montage/aisa/face_0-70_dn.mp4" trimBefore={0} zoomKeys={FACE_ZOOM} face={C} />
    </Sequence>

    {/* « un document comme celui que je t'affiche » : le rapport, enfin montré */}
    <Sequence from={f(13.3)} durationInFrames={f(21.36 - 13.3)}>
      <Reveal end={21.36 - 13.3}>
      <ScreenStage
        src="montage/aisa/screen_655-700.mp4"
        trimBefore={6.0}
        keys={[
          { t: 0, z: 0.64, cx: 963, cy: 545 },
          { t: 0.5, z: 0.64, cx: 963, cy: 545 },
          { t: 2.3, z: 1.2, cx: 985, cy: 500 },
          { t: 4.4, z: 1.25, cx: 985, cy: 520 },
          { t: 6.3, z: 1.45, cx: 1000, cy: 610 },
          { t: 8.06, z: 1.5, cx: 1000, cy: 600 },
        ]}
        tilt={[
          { t: 0, rx: 5, ry: -9 },
          { t: 0.5, rx: 5, ry: -9 },
          { t: 2.3, rx: 0, ry: 0 },
        ]}
      />
      <Tag text="Un rapport de visibilité IA" start={0.3} end={2.0} left={360} top={120} />
      </Reveal>
    </Sequence>

    {/* ChatGPT · Claude · Perplexity · Gemini */}
    <Sequence from={f(21.36)} durationInFrames={f(25.3 - 21.36)}>
      <BrandTiles
        end={25.3 - 21.36}
        title="4 moteurs de réponse IA"
        brands={[
          { name: "ChatGPT", color: "#10A37F", at: 22.08 - 21.36 },
          { name: "Claude", color: "#D97757", at: 23.02 - 21.36 },
          { name: "Perplexity", color: "#20B8CD", at: 23.92 - 21.36 },
          { name: "Gemini", color: "#4E86F7", at: 24.66 - 21.36 },
        ]}
      />
    </Sequence>

    {/* L'IA recommande… et trouve ses réponses sur internet */}
    <Sequence from={f(28.9)} durationInFrames={f(46.6 - 28.9)}>
      <Reveal end={46.6 - 28.9}>
      <ChatMock
        end={46.6 - 28.9}
        turns={[
          { q: "Quel est le meilleur restaurant italien près de chez moi ?", qAt: 0.1, typeDur: 1.6, answerAt: 2.95, items: ["Trattoria Luce", "Casa Nonna", "Il Forno"], itemsAt: 5.2 },
          { q: "Quel logiciel de facturation choisir ?", qAt: 5.9, typeDur: 1.2, answerAt: 7.6, items: ["FactuPro", "Billio", "Comptea"], itemsAt: 7.8 },
        ]}
        sources={[
          { label: "Sites web", at: 13.0 },
          { label: "Avis", at: 13.6 },
          { label: "Annuaires", at: 14.2 },
          { label: "Google", at: 16.5 },
        ]}
        sourcesMergeAt={16.95}
      />
      </Reveal>
    </Sequence>

    {/* Phrase-thèse */}
    <Sequence from={f(48.0)} durationInFrames={f(54.9 - 48.0)}>
      <FocusVeil start={0} end={54.9 - 48.0} />
      <KeyLine
        end={54.9 - 48.0}
        valign="center"
        size={128}
        maxWidth={1660}
        words={[
          { w: "comment", t: 0.24 },
          { w: "être", t: 2.64 },
          { w: "recommandé", t: 3.12, hl: true },
          { w: "par", t: 3.9 },
          { w: "les", t: 4.2 },
          { w: "IA", t: 4.38 },
        ]}
      />
    </Sequence>

    {/* Carte du tuto */}
    <Sequence from={f(56.0)} durationInFrames={f(BODY_END - 56.0)}>
      <TutoMap
        title="5 étapes, *dans l'ordre*"
        end={BODY_END - 56.0}
        titleAt={0.05}
        steps={[
          { n: 1, label: "Le business", at: 0.5 },
          { n: 2, label: "Les outils", at: 1.05 },
          { n: 3, label: "Le rapport de visibilité IA", at: 1.6 },
          { n: 4, label: "Le plan SEO", at: 2.15 },
          { n: 5, label: "Trouver des clients", at: 2.7 },
        ]}
      />
    </Sequence>

    {/* Son : voix traitée + musique de partie (Epidemic) + kit SFX Epidemic */}
    {!embedded && (
      <Sequence from={f(FACE_OFFSET)}>
        <Audio src={staticFile(`epidemic/hq/${MUSIC.hook.file}`)} volume={musicVol} />
      </Sequence>
    )}
    <SfxTrack cues={SFX} />
    <Grain />
  </AbsoluteFill>
);

const Dots: React.FC<{ start: number; end: number }> = ({ start, end }) => {
  const t = useT();
  const o = inOut(t, start, end, 0.25, 0.3);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: o }}>
      <div style={{ display: "flex", gap: 34 }}>
        {[0, 1, 2].map((i) => {
          const a = interpolate(t, [start + i * 0.32, start + i * 0.32 + 0.25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return <div key={i} style={{ width: 36, height: 36, borderRadius: 18, background: "white", opacity: a, boxShadow: `0 0 24px ${LIME}99` }} />;
        })}
      </div>
    </AbsoluteFill>
  );
};

const ColdOpen: React.FC = () => {
  const t = useT();
  const black = interpolate(t, [COLD_END - 0.1, COLD_END + 0.75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill>
      <ScreenStage
        src="montage/aisa/screen_125-150.mp4"
        trimBefore={8.65}
        keys={[
          { t: 0, z: 0.72, cx: 963, cy: 540 },
          { t: 0.3, z: 0.72, cx: 963, cy: 540 },
          { t: 1.85, z: 1.45, cx: 640, cy: 380 },
          { t: COLD_END + 0.8, z: 1.55, cx: 630, cy: 375 },
        ]}
        dim={(tt) => interpolate(tt, [1.7, 2.2], [0, 0.75], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        blur={(tt) => interpolate(tt, [1.7, 2.3], [0, 9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      <Stat value={51900} start={1.9} end={COLD_END + 0.9} label="citations dans *l'intelligence artificielle*" context="Bing Webmaster Tools · 3 derniers mois" />
      <AbsoluteFill style={{ background: "black", opacity: black }} />
      <Dots start={COLD_END + 0.95} end={COLD_END + BLACK - 0.1} />
    </AbsoluteFill>
  );
};

/** `embedded` : dans le montage complet, la voix et la musique sont gérées par MontageAisa. */
export const MontageAisaHook: React.FC<{ embedded?: boolean }> = ({ embedded }) => (
  <AbsoluteFill style={{ background: "black" }}>
    <Sequence from={0} durationInFrames={f(COLD_END + BLACK)}>
      <ColdOpen />
    </Sequence>
    <Sequence from={f(SHIFT)}>
      <Body embedded={embedded} />
    </Sequence>
    {/* Voix : phrase entière + silence de suspense + suite (montages/aisa/03-audio) */}
    {!embedded && <Audio src={staticFile("montage/aisa/audio_h2.wav")} />}
    {/* Cold open : riser inversé → impact sur 51 900 ; impact grave + nappe sourde dans le noir */}
    <SfxTrack cues={[{ k: "riserReverse", at: 1.95, gain: 0.35 }, { k: "impactDeep", at: 1.95 }, { k: "impactBig", at: COLD_END + 0.55, gain: 0.2 }]} />
    <Sequence from={f(COLD_END + 0.25)} durationInFrames={f(BLACK + 1.2)}>
      <Audio
        src={staticFile(`epidemic/hq/${SFX_KIT.dronePadSub.file}`)}
        trimBefore={f(3.2)}
        volume={(fr) => SFX_KIT.dronePadSub.gain * interpolate(fr / 30, [0, 0.5, BLACK + 0.3, BLACK + 1.2], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
    </Sequence>
  </AbsoluteFill>
);
