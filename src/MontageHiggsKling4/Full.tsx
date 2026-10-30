// Étape 6 : montage complet (19:33, temps source, aucune coupe, vitesse ×1,00). Plan : montages/higgs-kling4/04-plan.md.
// Lecture du script vérifiée à l'œil (01-analyse § 3) : seuls 0:00-0:08 et 8:46-9:03 sont couverts en plein cadre.
// Partout ailleurs : face cam (plein cadre) avec inserts courts, ou l'écran avec la face cam en médaillon.
import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, Loop, OffthreadVideo, Sequence, staticFile } from "remotion";
import { Backdrop, f, FacePip, FocusVeil, Grain, KeyLine, ScreenStage, SfxTrack, SFX_KIT, type BlurMask, type SfxCue, type ViewKey } from "../montage/lib";
import { mixGain, type MixEvent } from "../montage/mix";
import { PlanVsResult } from "../montage/Defi";
import { NoteCard, StepLT, TopPill } from "../montage/Explainers";
import { CornerPill, NameTag, SideStat } from "../MontageHostingerProduits/Illus";
import { BizCards, CAP, CapFan, CapIntro, CapStat, ClipCard, CreditBoard, D, DurationBars, EndCard, FailRow, FlowLine, FOUR, FourFrames, ImageCard, PhoneShot, PubSquare } from "./Illus";

export const FULL_END = 1172.8;
const FACE = `${D}/face_dn.mp4`;
const SCREEN = `${D}/screen.mp4`;
const FACE_POS = { x: 0.5, y: 0.36 };
const GRADE = "brightness(1.12) contrast(1.05) saturate(1.04)";
const WIN = { x: 108, y: 54, w: 1704, h: 972 }; // mesuré sur l'enregistrement d'écran
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const At: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => (
  <Sequence from={f(from)} durationInFrames={Math.max(1, f(to) - f(from))} layout="none">
    <AbsoluteFill>{children}</AbsoluteFill>
  </Sequence>
);

// ─── Face cam : plein cadre (p = 0) quand Ibrahim parle à la caméra, médaillon (p = 1) sur l'écran ───
const FACE_KEYS = [
  { t: 0, p: 0 },
  { t: 98.6, p: 0 },
  { t: 99.4, p: 1 },
  { t: 479.6, p: 1 },
  { t: 480.4, p: 0 },
  { t: 637.8, p: 0 },
  { t: 638.6, p: 1 },
  { t: 1109.6, p: 1 },
  { t: 1110.2, p: 0 },
];
// Rythme du plein cadre : poussées lentes et changements d'échelle aux phrases-clés
const FACE_ZOOM = [
  { t: 0, z: 1.0 }, { t: 8.3, z: 1.0 }, { t: 17.9, z: 1.0 }, { t: 18.6, z: 1.07 }, { t: 28.3, z: 1.07 }, { t: 29.0, z: 1.0 },
  { t: 41.9, z: 1.0 }, { t: 42.6, z: 1.08 }, { t: 51.5, z: 1.08 }, { t: 52.2, z: 1.0 }, { t: 62.4, z: 1.0 }, { t: 63.1, z: 1.06 },
  { t: 74.0, z: 1.06 }, { t: 84.2, z: 1.0 }, { t: 98.6, z: 1.0 },
  { t: 480.4, z: 1.0 }, { t: 499.2, z: 1.0 }, { t: 499.9, z: 1.07 }, { t: 512.8, z: 1.07 }, { t: 521.3, z: 1.0 },
  { t: 543.5, z: 1.0 }, { t: 554.6, z: 1.0 }, { t: 555.3, z: 1.08 }, { t: 570.6, z: 1.08 }, { t: 571.3, z: 1.0 },
  { t: 592.0, z: 1.0 }, { t: 593.5, z: 1.06 }, { t: 621.2, z: 1.06 }, { t: 637.8, z: 1.0 },
  { t: 1110.2, z: 1.0 }, { t: 1124.2, z: 1.0 }, { t: 1124.9, z: 1.07 }, { t: 1141.0, z: 1.07 }, { t: 1141.7, z: 1.0 }, { t: 1158.0, z: 1.0 }, { t: 1158.7, z: 1.08 },
];
const FaceTrack: React.FC = () => <FacePip src={FACE} trimBefore={0} face={FACE_POS} grade={GRADE} pipScale={0.6} keys={FACE_KEYS} zoomKeys={FACE_ZOOM} />;

// ─── L'écran : un segment = un ScreenStage (temps des clés relatifs au début du segment) ───
const z1 = (t: number): ViewKey => ({ t, z: 1, cx: 960, cy: 540 });
const zk = (t: number, z: number, cx: number, cy: number): ViewKey => ({ t, z, cx, cy });
// Threads : les 4 cases (vues, personnes, abonnés, interactions) et la courbe, en pixels de l'écran
const CASES = { cx: 1333, cy: 487 };
const CURVE = { cx: 1338, cy: 669 };
const ScreenSeg: React.FC<{ from: number; to: number; keys: ViewKey[]; masks?: BlurMask[] }> = ({ from, to, keys, masks }) => (
  <At from={from} to={to}>
    <ScreenStage src={SCREEN} trimBefore={from} win={WIN} masks={masks} keys={keys.map((k) => ({ ...k, t: k.t - from }))} />
  </At>
);
// LinkedIn : les deux bulles de messagerie en bas de l'écran ; Higgsfield : le logo du maillot (historique)
const LI_MASK = { x: 905, y: 962, w: 540, h: 66 };
const KIT = { x: 975, y: 530, w: 90, h: 70 };

const Screens: React.FC = () => (
  <>
    {/* 1:38 → 4:00 · Threads */}
    <ScreenSeg
      from={98.8}
      to={240.0}
      keys={[z1(98.8), z1(152.8), zk(153.8, 1.7, CASES.cx, CASES.cy), zk(176.8, 1.7, CASES.cx, CASES.cy), zk(177.8, 1.5, CURVE.cx, CURVE.cy), zk(205.0, 1.5, CURVE.cx, CURVE.cy), zk(205.9, 1.7, CASES.cx, CASES.cy), zk(225.0, 1.7, CASES.cx, CASES.cy), z1(226.0)]}
    />
    {/* 4:00 → 5:50 · LinkedIn (bulles floutées) */}
    <ScreenSeg from={240.0} to={350.0} keys={[z1(240), z1(284.2), zk(285.0, 1.25, 960, 480), zk(305.0, 1.25, 960, 480), z1(305.8)]} masks={[{ from: 0, to: 110, ...LI_MASK }]} />
    {/* 5:50 → 8:00 · les blogs */}
    <ScreenSeg from={350.0} to={480.4} keys={[z1(350), z1(380.0), zk(381.0, 1.2, 1000, 520), zk(420.0, 1.2, 1000, 520), z1(421.0), z1(467.4), zk(468.2, 1.25, 1000, 520)]} />
    {/* 10:38 → 15:57 · Higgsfield, les 3 modes, les 4 images, Frames (logo du maillot flouté) */}
    <ScreenSeg
      from={637.8}
      to={957.5}
      keys={[z1(637.8), z1(696.0), zk(697.0, 1.35, 520, 520), zk(736.5, 1.35, 520, 520), z1(737.5), z1(842.8), zk(843.6, 1.35, 520, 820), zk(849.0, 1.35, 520, 820), z1(849.8), z1(946.4), zk(947.2, 1.4, 520, 820), zk(953.0, 1.4, 520, 820), z1(953.8)]}
      masks={[
        { from: 657 - 637.8, to: 676.5 - 637.8, ...KIT },
        { from: 688.5 - 637.8, to: 792 - 637.8, ...KIT },
      ]}
    />
    {/* 16:45 → 18:30 · la réaction, le bug, la retouche References */}
    <ScreenSeg from={1005.5} to={1110.2} keys={[z1(1005.5), z1(1100.6), zk(1101.4, 1.35, 520, 820), zk(1109.0, 1.35, 520, 820)]} />
  </>
);

// ─── Inserts et habillage ───
const PLAN_GRID = (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", width: 820, height: 461, gap: 6, background: "#000" }}>
    {FOUR.map((k) => (
      <Img key={k.src} src={staticFile(k.src)} style={{ width: "100%", height: 227, objectFit: "cover" }} />
    ))}
  </div>
);
const PUB_LOOP = (
  <Loop durationInFrames={f(30)}>
    <OffthreadVideo src={staticFile(`${D}/pub.mp4`)} muted style={{ width: 820, height: 461, objectFit: "cover" }} />
  </Loop>
);
const WAX_LOOP = (
  <Loop durationInFrames={f(5)}>
    <OffthreadVideo src={staticFile(`${D}/wax.mp4`)} muted style={{ width: 820, height: 461, objectFit: "cover" }} />
  </Loop>
);

const Overlays: React.FC = () => (
  <>
    {/* ══ Bloc 1 · l'accroche ══ */}
    <At from={0} to={4.3}>
      <PubSquare end={4.3} muted caption="Personne ne l'a *filmée*." captionAt={1.7} />
    </At>
    <At from={4.3} to={8.3}>
      <FourFrames end={4.0} ats={[0.25, 0.55, 0.85, 1.15]} title="*4 images*. L'IA a tourné le reste." titleAt={0.9} />
    </At>
    <At from={10.6} to={15.0}>
      <BizCards end={4.4} title="Le marketing de *2 business*, confié à l'IA" titleAt={0.9} left={{ title: "Ibrahim *Kamara*", meta: "Ma marque", at: 0.15 }} right={{ title: "Nova Media *Lab*", meta: "Mon agence", at: 0.45 }} linkAt={2.2} />
    </At>
    <At from={15.0} to={17.96}>
      <CapStat src={`${CAP}/threads_overview.png`} end={2.96} value={19694722} valueAt={0.9} label="vues en *30 jours*" source="Threads · Insights" crop={{ x: 880, y: 372, w: 175, h: 118 }} />
    </At>
    <At from={18.4} to={22.0}>
      <TopPill text="Tous mes *chiffres*, en transparence" end={3.6} />
    </At>
    <At from={22.12} to={28.34}>
      <FocusVeil start={0} end={6.22} />
      <KeyLine end={6.22} valign="center" size={124} words={[{ w: "L'IA", t: 1.44 }, { w: "peut-elle", t: 2.58 }, { w: "gérer", t: 3.34, hl: true }, { w: "un business", t: 3.88 }, { w: "?", t: 4.3 }]} />
    </At>
    {/* ══ Bloc 2 · présentation et précision ══ */}
    <At from={29.6} to={36.6}>
      <NameTag name="Ibrahim Kamara" meta="Business en ligne depuis *2020*" end={7.0} />
    </At>
    <At from={38.6} to={41.9}>
      <CornerPill text="S'abonner 🔔" end={3.3} />
    </At>
    <At from={46.3} to={51.58}>
      <CapIntro src={`${CAP}/threads_profil.png`} end={5.28} eyebrow="Business n°1 · ma marque" title="Ibrahim *Kamara*" titleAt={0.3} meta="Du contenu, partout" metaAt={1.4} chips={[{ text: "YouTube", at: 3.26 }, { text: "Instagram", at: 3.92 }, { text: "Threads", at: 4.5 }, { text: "LinkedIn", at: 4.7 }]} />
    </At>
    <At from={56.68} to={62.4}>
      <CapIntro src={`${CAP}/gsc_nova.png`} end={5.72} eyebrow="Business n°2" title="Nova Media *Lab*" titleAt={0.6} meta="Agence de marketing digital · *Indonésie*" metaAt={4.7} />
    </At>
    <At from={62.6} to={66.0}>
      <TopPill text="100 % *physique* · avec une équipe" end={3.4} />
    </At>
    <At from={76.0} to={81.0}>
      <BizCards end={5.0} left={{ title: "Ibrahim *Kamara*", meta: "Ma marque", at: 0.1 }} right={{ title: "Nova Media *Lab*", meta: "Mon agence", at: 0.3 }} linkAt={1.0} />
    </At>
    <At from={85.4} to={98.4}>
      <NoteCard eyebrow="Petite précision" title="La pub de cette vidéo : *une démonstration*." meta="Ce n'est pas une pub que j'ai lancée." start={0} end={13.0} />
    </At>

    {/* ══ Bloc 3 · Threads ══ */}
    <At from={112.4} to={117.4}>
      <TopPill text="Threads · le « Twitter » d'Instagram" end={5.0} />
    </At>
    <At from={154.0} to={160.5}>
      <SideStat eyebrow="Vues · 30 jours" value="19 694 722" sub="sur *Threads*" end={6.5} hero />
    </At>
    <At from={187.6} to={193.6}>
      <TopPill icon="trend" text="~*1 million* de vues par jour depuis le 11 octobre" end={6.0} />
    </At>
    <At from={199.6} to={205.0}>
      <TopPill icon="trend" text="Record : *2 millions* en un jour, le 23 octobre" end={5.4} />
    </At>
    <At from={205.9} to={212.6}>
      <SideStat eyebrow="Personnes touchées" value="5 374 529" end={6.7} />
    </At>
    <At from={213.8} to={220.0}>
      <SideStat eyebrow="Abonnés en 30 jours" value="+7 348" end={6.2} />
    </At>
    <At from={220.4} to={226.0}>
      <SideStat eyebrow="Interactions" value="44 002" sub="likes, commentaires…" subAt={1.0} end={5.6} />
    </At>
    {/* ══ Bloc 4 · LinkedIn ══ */}
    <At from={256.7} to={262.4}>
      <TopPill text="Avant : 1 post tous les 3 mois · Aujourd'hui : *10 par jour*" end={5.7} />
    </At>
    <At from={285.0} to={291.5}>
      <SideStat eyebrow="Impressions · 28 jours" value="1 135 374" sub="sur *LinkedIn*" end={6.5} hero />
    </At>
    <At from={310.7} to={316.5}>
      <SideStat eyebrow="Nouvelles personnes" value="85 %" sub="des impressions" end={5.8} />
    </At>
    <At from={318.9} to={323.5}>
      <SideStat eyebrow="Interactions" value="6 305" end={4.6} />
    </At>
    <At from={326.3} to={332.0}>
      <SideStat eyebrow="Abonnés LinkedIn" value="20 280" end={5.7} />
    </At>
    <At from={344.4} to={349.8}>
      <SideStat eyebrow="15 octobre" value="+786" sub="abonnés en *un jour*" end={5.4} />
    </At>
    {/* ══ Bloc 5 · les blogs ══ */}
    <At from={357.9} to={362.4}>
      <TopPill text="ibrahimkamara.com · le *blog*" end={4.5} />
    </At>
    <At from={392.3} to={398.0}>
      <SideStat eyebrow="Avant, par jour" value="~700" sub="impressions · *~10* clics" end={5.7} />
    </At>
    <At from={412.5} to={419.0}>
      <SideStat eyebrow="ibrahimkamara.com · 3 mois" value="110 k" sub="impressions · *1,51 k* clics" end={6.5} />
    </At>
    <At from={442.6} to={447.6}>
      <TopPill text="Nova Media Lab · mon agence en *Indonésie*" end={5.0} />
    </At>
    <At from={468.0} to={475.0}>
      <SideStat eyebrow="Nova Media Lab · 20 octobre" value="5 908" sub="impressions · *43* clics" end={7.0} hero />
    </At>

    {/* ══ Bloc 6 · ce qui a raté, l'IA au quotidien ══ */}
    <At from={489.4} to={499.2}>
      <FailRow end={9.8} items={[{ name: "Instagram", at: 0.2 }, { name: "TikTok", at: 1.2 }, { name: "Facebook", at: 2.2 }]} title="Tout ne marche *pas*." titleAt={7.6} />
    </At>
    <At from={512.9} to={521.3}>
      <FlowLine end={8.4} title="L'IA gère *tout*" titleAt={0.1} steps={[{ text: "Stratégie", at: 0.3 }, { text: "Création", at: 1.6 }, { text: "Publication", at: 3.0 }, { text: "Rapport", at: 4.5 }, { text: "Amélioration", at: 6.0 }]} />
    </At>
    {/* 8:46 → 9:03 : Ibrahim lit son écran → plein cadre */}
    <At from={526.0} to={543.5}>
      <PhoneShot src={`${CAP}/telegram_rapports.png`} iw={1320} ih={2868} end={17.5} eyebrow="Mes agents IA, sur Telegram" caption="Un rapport *chaque jour*, par plateforme" captionAt={0.8} />
    </At>
    <At from={554.8} to={560.0}>
      <TopPill text="Partie 2 · *Créer* le contenu avec l'IA" end={5.2} />
    </At>
    {/* ══ Bloc 7 · Higgsfield et Kling 4.0 ══ */}
    <At from={583.0} to={592.0}>
      <CapIntro src={`${CAP}/higgsfield_history.png`} end={9.0} eyebrow="Ce que j'utilise *tous les jours*" title="Higgsfield" titleAt={0.3} meta="Mes comptes faceless YouTube et TikTok" metaAt={1.4} />
    </At>
    <At from={596.7} to={601.0}>
      <TopPill text="Nouveau : *Kling 4.0*" end={4.3} />
    </At>
    <At from={613.6} to={621.2}>
      <DurationBars end={7.6} oldAt={1.8} title="Un clip, *au maximum*" titleAt={0.1} />
    </At>
    <At from={628.4} to={634.4}>
      <DurationBars end={6.0} oldAt={0} newAt={0.4} title="Jusqu'à *30 secondes* en un seul clip" titleAt={0.6} />
    </At>
    <At from={634.4} to={640.0}>
      <CornerPill text="Lien : 1re ligne de la description" end={5.6} accent />
    </At>

    {/* ══ Bloc 8 · les 3 modes ══ */}
    <At from={690.6} to={695.6}>
      <TopPill text="Collaboration commerciale · *Higgsfield*" end={5.0} />
    </At>
    <At from={696.6} to={717.4}>
      <StepLT n={1} text="References" end={20.8} />
    </At>
    <At from={726.0} to={731.6}>
      <TopPill icon="tip" text="Regarde le coût *avant* de générer" end={5.6} />
    </At>
    <At from={737.8} to={749.0}>
      <StepLT n={2} text="Frames" end={11.2} />
    </At>
    <At from={769.5} to={781.0}>
      <StepLT n={3} text="Edit video" end={11.5} />
    </At>
    {/* ══ Bloc 9 · le plan en 4 images ══ */}
    <At from={843.6} to={849.0}>
      <SideStat eyebrow="GPT Image 2 · 1K" value="3,5" sub="crédits par image" end={5.4} side="right" top={160} />
    </At>
    <At from={865.9} to={874.5}>
      <FourFrames end={8.6} ats={[0.2, 0.5, 0.8, 1.1]} title="Mon plan · *4 moments*" titleAt={1.4} />
    </At>
    {/* ══ Bloc 10 · Frames et la pub ══ */}
    <At from={925.3} to={931.0}>
      <TopPill icon="tip" text="Teste d'abord en *720p*" end={5.7} />
    </At>
    <At from={947.2} to={952.6}>
      <SideStat eyebrow="Pub de 30 s · 720p" old="82,5" oldAt={0.2} value="67,5" valueAt={0.6} sub="crédits" end={5.4} side="right" top={160} />
    </At>
    {/* la pub, en entier, avec son propre son */}
    <At from={957.5} to={987.8}>
      <PubSquare end={30.3} size={960} />
    </At>
    <At from={987.8} to={1005.5}>
      <Backdrop />
      <PlanVsResult
        plan={PLAN_GRID}
        result={PUB_LOOP}
        end={17.7}
        planLabel="Mon plan"
        resultLabel="La pub de Kling 4.0"
        checks={[
          { at: 1.0, label: "Boutique vide", ok: true },
          { at: 2.0, label: "Le téléphone", ok: true },
          { at: 3.0, label: "Boutique pleine", ok: true },
          { at: 4.0, label: "Devanture le soir", ok: true },
          { at: 5.4, label: "Un seul plan, sans coupe", ok: true },
        ]}
      />
    </At>
    <At from={1009.0} to={1017.0}>
      <TopPill text="Pas parfait : un petit *bug* à l'entrée" end={8.0} />
    </At>
    <At from={1021.2} to={1026.0}>
      <SideStat eyebrow="Mon verdict" value="4/4" sub="moments · *1* défaut" end={4.8} side="right" top={160} />
    </At>
    {/* ══ Bloc 11 · References, la retouche ══ */}
    <At from={1026.2} to={1030.6}>
      <TopPill text="La retouche du *client*" end={4.4} />
    </At>
    <At from={1067.0} to={1074.0}>
      <ImageCard src={`${D}/tenue_wax.png`} end={7.0} label="La tenue en *pagne africain*" side="left" w={420} h={560} />
    </At>
    <At from={1105.4} to={1109.8}>
      <SideStat eyebrow="Retouche · 5 s · 720p" old="13,75" oldAt={0.2} value="11,25" valueAt={0.6} sub="crédits" end={4.4} side="right" top={160} />
    </At>

    {/* ══ Bloc 12 · le résultat et le verdict ══ */}
    <At from={1110.2} to={1115.3}>
      <ClipCard src={`${D}/wax.mp4`} end={5.1} caption="Le résultat de la *retouche*" />
    </At>
    <At from={1115.3} to={1124.2}>
      <Backdrop />
      <PlanVsResult
        plan={FOUR[0].src}
        result={WAX_LOOP}
        end={8.9}
        planLabel="Avant"
        resultLabel="Après"
        checks={[
          { at: 1.4, label: "La tenue", ok: true },
          { at: 2.2, label: "Le visage", ok: true },
          { at: 3.0, label: "La boutique", ok: true },
        ]}
      />
    </At>
    <At from={1128.0} to={1135.5}>
      <CreditBoard
        end={7.5}
        title="Ce que ce test m'a coûté"
        rows={[
          { label: "4 images (GPT Image 2)", value: "14", at: 0.3 },
          { label: "La tenue", value: "3,5", at: 0.6 },
          { label: "Pub de 30 s (Frames, 720p)", value: "67,5", at: 0.9 },
          { label: "Retouche de 5 s (References)", value: "11,25", at: 1.2 },
        ]}
        total="96,25 crédits"
        totalAt={1.9}
      />
    </At>
    <At from={1131.2} to={1136.0}>
      <CornerPill text="Lien : 1re ligne de la description" end={4.8} accent />
    </At>
    <At from={1145.2} to={1152.4}>
      <CapFan
        end={7.2}
        title="Prochaine vidéo : mes *agents IA* ?"
        titleAt={2.4}
        items={[
          { src: `${CAP}/threads_overview.png`, label: "Threads", at: 0.1 },
          { src: `${CAP}/linkedin_impressions.png`, label: "LinkedIn", at: 0.5 },
          { src: `${CAP}/gsc_nova.png`, label: "Google", at: 0.9 },
        ]}
      />
    </At>
    <At from={1153.4} to={1159.0}>
      <TopPill text="Ça t'intéresse ? Dis-le en *commentaire*" end={5.6} />
    </At>
    <At from={1167.9} to={FULL_END}>
      <EndCard end={FULL_END - 1167.9} eyebrow="À regarder ensuite" title="J'ai donné la même pub en français à *9 IA vidéo*" />
    </At>
  </>
);

// ─── Son ───
const SFX_SRC: SfxCue[] = [
  { k: "popSelectA", at: 4.55 }, { k: "popSelectB", at: 4.85 }, { k: "popSelectA", at: 5.15 }, { k: "popSelectB", at: 5.45 },
  { k: "whoosh03", at: 10.65 }, { k: "popSelectA", at: 10.75 }, { k: "popSelectB", at: 11.05 },
  { k: "impactDeep", at: 15.94, gain: 0.5 },
  { k: "whoosh01", at: 22.2 }, { k: "popNotif02", at: 25.46, gain: 0.6 },
  { k: "popSelectB", at: 29.7 }, { k: "popSelectA", at: 38.7 },
  { k: "whoosh02", at: 46.35 }, { k: "popSelectA", at: 49.56 }, { k: "popSelectB", at: 50.22 },
  { k: "whoosh03", at: 56.75 }, { k: "impactHitLow", at: 58.32, gain: 0.4 },
  { k: "popSelectB", at: 62.7 }, { k: "whoosh01", at: 76.05 }, { k: "popSelectA", at: 85.5 },
  { k: "whoosh02", at: 98.9 }, { k: "popSelectB", at: 112.5 },
  { k: "impactDeep", at: 154.1, gain: 0.5 }, { k: "popSelectA", at: 187.7 }, { k: "popSelectB", at: 199.7 },
  { k: "popSelectA", at: 206.0 }, { k: "popSelectB", at: 213.9 }, { k: "popSelectA", at: 220.5 },
  { k: "whoosh03", at: 240.1 }, { k: "popSelectB", at: 256.8 }, { k: "impactDeep", at: 285.2, gain: 0.5 },
  { k: "popSelectA", at: 310.8 }, { k: "popSelectB", at: 319.0 }, { k: "popSelectA", at: 326.4 }, { k: "popSelectB", at: 344.5 },
  { k: "whoosh01", at: 350.1 }, { k: "popSelectA", at: 358.0 }, { k: "popSelectB", at: 392.4 }, { k: "popSelectA", at: 412.6 },
  { k: "popSelectB", at: 442.7 }, { k: "impactDeep", at: 468.2, gain: 0.5 },
  { k: "whoosh02", at: 489.45 }, { k: "popSelectA", at: 491.8 }, { k: "popSelectB", at: 492.8 }, { k: "popSelectA", at: 493.8 },
  { k: "whoosh03", at: 512.95 }, { k: "popSelectA", at: 513.2 }, { k: "popSelectB", at: 514.5 }, { k: "popSelectA", at: 515.9 }, { k: "popSelectB", at: 517.4 }, { k: "popSelectA", at: 518.9 },
  { k: "whoosh01", at: 526.05 }, { k: "popNotif02", at: 526.8, gain: 0.6 },
  { k: "whoosh02", at: 554.85 }, { k: "whoosh03", at: 583.05 }, { k: "popSelectB", at: 596.8 },
  { k: "whoosh01", at: 613.65 }, { k: "popSelectA", at: 615.4 }, { k: "impactDeep", at: 628.9, gain: 0.5 }, { k: "popSelectB", at: 634.5 },
  { k: "whoosh02", at: 638.0 }, { k: "popSelectA", at: 690.7 }, { k: "clickA", at: 696.7 }, { k: "popSelectB", at: 726.1 }, { k: "clickA", at: 737.9 }, { k: "clickA", at: 769.6 },
  { k: "popSelectA", at: 843.7 }, { k: "whoosh03", at: 865.95 }, { k: "popSelectA", at: 866.1 }, { k: "popSelectB", at: 866.4 }, { k: "popSelectA", at: 866.7 }, { k: "popSelectB", at: 867.0 },
  { k: "popSelectA", at: 925.4 }, { k: "clickA", at: 947.3 },
  { k: "riserClean", at: 957.4, gain: 0.5 },
  { k: "whoosh01", at: 987.9 }, { k: "popSelectA", at: 988.8 }, { k: "popSelectB", at: 989.8 }, { k: "popSelectA", at: 990.8 }, { k: "popSelectB", at: 991.8 }, { k: "popNotif02", at: 993.2, gain: 0.6 },
  { k: "popSelectA", at: 1009.1 }, { k: "impactHitLow", at: 1021.3, gain: 0.4 }, { k: "popSelectB", at: 1026.3 }, { k: "popSelectA", at: 1067.1 }, { k: "clickA", at: 1105.5 },
  { k: "whoosh02", at: 1115.35 }, { k: "popSelectA", at: 1116.7 }, { k: "popSelectB", at: 1117.5 }, { k: "popSelectA", at: 1118.3 },
  { k: "whoosh03", at: 1128.05 }, { k: "impactDeep", at: 1129.9, gain: 0.5 }, { k: "popSelectB", at: 1131.3 },
  { k: "whoosh01", at: 1145.25 }, { k: "popSelectA", at: 1153.5 }, { k: "whoosh02", at: 1167.95 },
];
const SFX: SfxCue[] = SFX_SRC.map((c) => ({ ...c, gain: (c.gain ?? SFX_KIT[c.k].gain) * (c.at < 20 ? 0.42 : 0.6) }));

const M = "epidemic/higgs-kling4/hq";
const PARTS = [
  { file: "m0_hook_unfinished_stories.mp3", from: 3.0, to: 28.4, lufs: -31, src: -12.0, fadeIn: 1.4, fadeOut: 1.4, skip: 0 },
  { file: "m1_contexte_groundhog_day.mp3", from: 28.2, to: 99.4, lufs: -32, src: -9.6, fadeIn: 1.4, fadeOut: 1.2, skip: 0 },
  { file: "m2_threads_lush_hour.mp3", from: 98.8, to: 240.6, lufs: -33, src: -10.2, fadeIn: 1.4, fadeOut: 1.2, skip: 0 },
  { file: "m3_linkedin_mango_fizz.mp3", from: 240.0, to: 362.0, lufs: -33, src: -9.5, fadeIn: 1.4, fadeOut: 3.0, skip: 0 },
  { file: "m3_linkedin_mango_fizz.mp3", from: 359.0, to: 481.0, lufs: -33, src: -9.5, fadeIn: 3.0, fadeOut: 1.2, skip: 20 },
  { file: "m4_rate_low_orbit.mp3", from: 480.4, to: 570.6, lufs: -33, src: -9.5, fadeIn: 1.4, fadeOut: 1.2, skip: 0 },
  { file: "m5_kling_secure.mp3", from: 570.0, to: 660.0, lufs: -32, src: -14.5, fadeIn: 1.4, fadeOut: 1.4, skip: 0 },
  { file: "m6_demo_good_intentions.mp3", from: 659.0, to: 806.0, lufs: -35, src: -8.5, fadeIn: 1.4, fadeOut: 3.0, skip: 0 },
  { file: "m6_demo_good_intentions.mp3", from: 803.0, to: 957.4, lufs: -35, src: -8.5, fadeIn: 3.0, fadeOut: 0.15, skip: 15 },
  { file: "m7_reaction_liminal.mp3", from: 987.8, to: 1026.6, lufs: -31, src: -19.3, fadeIn: 0.8, fadeOut: 1.2, skip: 0 },
  { file: "m8_references_sunday_brunch.mp3", from: 1026.0, to: 1109.6, lufs: -35, src: -9.9, fadeIn: 1.4, fadeOut: 0.15, skip: 0 },
  { file: "m9_verdict_vapor.mp3", from: 1115.3, to: FULL_END, lufs: -32, src: -8.6, fadeIn: 1.0, fadeOut: 2.5, skip: 0 },
];
const MIX: MixEvent[] = [
  { k: "stop", at: 15.8, back: 17.0, fadeOut: 0.12, fadeIn: 0.8 }, // le chiffre Threads de l'accroche
  { k: "swell", from: 4.4, to: 7.2, db: 2 }, // les 4 images
  { k: "dip", from: 22.2, to: 28.3, db: 3 }, // la question
  { k: "dip", from: 84.2, to: 98.4, db: 3 }, // la précision honnête
  { k: "stop", at: 153.0, back: 156.0, fadeOut: 0.12, fadeIn: 1.0 }, // 19 694 722
  { k: "swell", from: 177.8, to: 193.6, db: 2 }, // la courbe Threads
  { k: "dip", from: 482.4, to: 499.2, db: 3 }, // ce qui a raté
];
const MusicTrack: React.FC = () => (
  <>
    {PARTS.map((p) => {
      const g = Math.pow(10, (p.lufs - p.src) / 20);
      return (
        <Sequence key={`${p.file}-${p.from}`} from={f(p.from)} durationInFrames={f(p.to - p.from)}>
          <Audio src={staticFile(`${M}/${p.file}`)} trimBefore={f(p.skip)} volume={(fr) => { const t = p.from + fr / 30; return g * interpolate(t, [p.from, p.from + p.fadeIn, p.to - p.fadeOut, p.to], [0, 1, 1, 0], clamp) * mixGain(t, MIX); }} />
        </Sequence>
      );
    })}
  </>
);

/** Le son propre de la pub sous la voix pendant les 4 premières secondes (la pub entière à 15:57 a son son par PubSquare). */
const PubSound: React.FC = () => (
  <Sequence from={0} durationInFrames={f(4.6)}>
    <Audio src={staticFile(`${D}/pub.mp4`)} volume={(fr) => 0.5 * interpolate(fr / 30, [0, 0.2, 3.9, 4.6], [0, 1, 1, 0], clamp)} />
  </Sequence>
);

export const Kling4Full: React.FC = () => (
  <AbsoluteFill style={{ background: "black" }}>
    <Backdrop />
    <Screens />
    <FaceTrack />
    <Overlays />
    <SfxTrack cues={SFX} />
    <PubSound />
    <Audio src={staticFile(`${D}/voice.wav`)} />
    <MusicTrack />
    <Grain />
  </AbsoluteFill>
);
