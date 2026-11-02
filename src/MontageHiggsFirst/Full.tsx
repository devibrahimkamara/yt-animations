// Montage « Higgsfield First Video » (Seedance 2.5 : le même personnage dans chaque vidéo IA). Plan : montages/higgs-first/04-plan.md.
// Aucune coupe dans les rushes (accord d'Ibrahim du 03/11/2026 : la durée lui convient). Trois ajouts seulement :
//  - 3 s d'ouverture sur la vidéo d'Abidjan avec son son (brief : ouvrir sur le résultat) ;
//  - la vidéo d'Abidjan en entier après « tu vas la regarder en entier » (11:16) ;
//  - la vidéo de Bali en entier après « encore une fois, 105 crédits » (12:52).
// Les rushes s'arrêtent à 13:21 (« Genjutsu dans le menu d'en haut ») : la démo Genjutsu et la conclusion viendront d'Ibrahim.
// Le corps (Body) est écrit en temps source ; les morceaux sont posés sur la timeline de sortie par une Sequence décalée.
import React from "react";
import { AbsoluteFill, Audio, interpolate, Loop, OffthreadVideo, Sequence, staticFile } from "remotion";
import { Backdrop, f, FacePip, FocusVeil, Grain, KeyLine, ScreenStage, SfxTrack, SFX_KIT, type BlurMask, type SfxCue, type ViewKey } from "../montage/lib";
import { mixGain, type MixEvent } from "../montage/mix";
import { PlanVsResult } from "../montage/Defi";
import { StepLT, TopPill } from "../montage/Explainers";
import { CornerPill, NameTag, SideStat } from "../MontageHostingerProduits/Illus";
import { ClipDuo, ComboCard, D, FamilyDuo, FullClip, ImageStage, PriceTag, Slide } from "./Illus";

// ─── Timeline : temps source → temps de sortie ───
const OPEN = 3.0; // ouverture sur Abidjan
const CUT_A = 676.7; // après « tu vas la regarder en entier. »
const CUT_B = 772.28; // après « encore une fois, 105 crédits. »
export const SRC_END = 801.9; // fin des rushes utiles (« Genjutsu dans le menu d'en haut. »)
const ABIDJAN = 15.07;
const BALI = 15.05;
// Tout en images entières (pas de dérive d'arrondi entre les morceaux)
const F_OPEN = f(OPEN), F_A = f(CUT_A), F_B = f(CUT_B), F_END = f(SRC_END), F_ABJ = f(ABIDJAN), F_BALI = f(BALI);
const PIECES = [
  { src: 0, len: F_A, out: F_OPEN },
  { src: F_A, len: F_B - F_A, out: F_OPEN + F_A + F_ABJ },
  { src: F_B, len: F_END - F_B, out: F_OPEN + F_B + F_ABJ + F_BALI },
];
const FI_ABIDJAN = F_OPEN + F_A;
const FI_BALI = F_OPEN + F_B + F_ABJ;
const INS_ABIDJAN = FI_ABIDJAN / 30;
const INS_BALI = FI_BALI / 30;
export const FULL_FRAMES = F_OPEN + F_END + F_ABJ + F_BALI;
export const FULL_END = FULL_FRAMES / 30;

const FACE = `${D}/face_dn.mp4`;
const SCREEN = `${D}/screen.mp4`;
const FACE_POS = { x: 0.5, y: 0.33 };
const GRADE = "brightness(1.12) contrast(1.05) saturate(1.04)";
const WIN = { x: 108, y: 54, w: 1704, h: 972 }; // mesuré sur l'enregistrement d'écran (même poste que Kling 4.0)
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const At: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => (
  <Sequence from={f(from)} durationInFrames={Math.max(1, f(to) - f(from))} layout="none">
    <AbsoluteFill>{children}</AbsoluteFill>
  </Sequence>
);

// ─── Face cam : plein cadre (p = 0) quand Ibrahim parle à la caméra, médaillon (p = 1) sur l'écran ───
const FACE_KEYS = [
  { t: 0, p: 0 },
  { t: 194.2, p: 0 },
  { t: 195.0, p: 1 },
  { t: 672.0, p: 1 },
  { t: 672.8, p: 0 },
  { t: 749.2, p: 0 },
  { t: 750.0, p: 1 },
  { t: 772.2, p: 1 },
  { t: 772.4, p: 0 },
  { t: 796.6, p: 0 },
  { t: 797.4, p: 1 },
];
const FACE_ZOOM = [
  { t: 0, z: 1.0 }, { t: 15.1, z: 1.0 }, { t: 21.5, z: 1.0 }, { t: 22.2, z: 1.07 }, { t: 26.9, z: 1.07 }, { t: 27.6, z: 1.0 },
  { t: 33.8, z: 1.0 }, { t: 34.5, z: 1.06 }, { t: 47.8, z: 1.06 }, { t: 89.9, z: 1.0 }, { t: 145.0, z: 1.0 }, { t: 145.7, z: 1.07 },
  { t: 161.6, z: 1.07 }, { t: 162.3, z: 1.0 }, { t: 174.6, z: 1.0 }, { t: 175.3, z: 1.08 }, { t: 194.2, z: 1.08 },
  { t: 672.8, z: 1.0 }, { t: 706.3, z: 1.0 }, { t: 707.0, z: 1.07 }, { t: 723.5, z: 1.07 }, { t: 724.2, z: 1.0 }, { t: 730.4, z: 1.0 }, { t: 731.1, z: 1.08 },
  { t: 749.2, z: 1.08 }, { t: 772.4, z: 1.0 }, { t: 784.0, z: 1.0 }, { t: 784.7, z: 1.07 }, { t: 796.6, z: 1.07 },
];
const FaceTrack: React.FC = () => <FacePip src={FACE} trimBefore={0} face={FACE_POS} grade={GRADE} pipScale={0.6} keys={FACE_KEYS} zoomKeys={FACE_ZOOM} />;

// ─── L'écran ───
const z1 = (t: number): ViewKey => ({ t, z: 1, cx: 960, cy: 540 });
const zk = (t: number, z: number, cx: number, cy: number): ViewKey => ({ t, z, cx, cy });
const ScreenSeg: React.FC<{ from: number; to: number; keys: ViewKey[]; masks?: BlurMask[] }> = ({ from, to, keys, masks }) => (
  <At from={from} to={to}>
    <ScreenStage src={SCREEN} trimBefore={from} win={WIN} masks={masks?.map((m) => ({ ...m, from: m.from - from, to: m.to - from }))} keys={keys.map((k) => ({ ...k, t: k.t - from }))} />
  </At>
);
// Zones de l'écran (pixels de la capture)
const GEN_IMG = { cx: 1382, cy: 925 }; // bouton Generate de la page Image
const PROMPT = { cx: 960, cy: 850 }; // la zone de prompt (page Image)
const GEN_VID = { cx: 307, cy: 948 }; // bouton Generate de la page Vidéo
const VID_PANEL = { cx: 300, cy: 700 }; // réglages de la page Vidéo (modèle, durée, format, qualité)
const PRICING = { cx: 1250, cy: 640 }; // les offres Pro / Max
// Données personnelles floutées : les comptes Google (liste et page d'accord), la carte bancaire
const MASKS: BlurMask[] = [
  { from: 228.3, to: 236.3, x: 340, y: 200, w: 1300, h: 760 },
  { from: 360.1, to: 369.5, x: 490, y: 330, w: 470, h: 570 },
];

const Screens: React.FC = () => (
  <>
    {/* 3:14 → 11:12 · inscription, offres, image, fiche, vidéo */}
    <ScreenSeg
      from={194.2}
      to={672.8}
      masks={MASKS}
      keys={[
        z1(194.2), z1(239.4), zk(240.4, 1.3, 960, 520), zk(295.0, 1.3, 960, 520), z1(296.0),
        z1(330.0), zk(331.0, 1.3, PRICING.cx, PRICING.cy), zk(358.0, 1.3, PRICING.cx, PRICING.cy), z1(359.0),
        z1(439.8), zk(440.8, 1.45, PROMPT.cx, PROMPT.cy), zk(454.8, 1.45, PROMPT.cx, PROMPT.cy), zk(455.6, 2.0, GEN_IMG.cx, GEN_IMG.cy), zk(461.8, 2.0, GEN_IMG.cx, GEN_IMG.cy), z1(462.8),
        z1(550.8), zk(551.6, 2.0, GEN_IMG.cx, GEN_IMG.cy), zk(556.8, 2.0, GEN_IMG.cx, GEN_IMG.cy), z1(557.6),
        z1(624.8), zk(625.8, 1.6, VID_PANEL.cx, VID_PANEL.cy), zk(649.2, 1.6, VID_PANEL.cx, VID_PANEL.cy), zk(650.0, 2.0, GEN_VID.cx, GEN_VID.cy), zk(656.0, 2.0, GEN_VID.cx, GEN_VID.cy), z1(657.0),
      ]}
    />
    {/* 12:29 → 12:52 · la vidéo de Bali */}
    <ScreenSeg from={749.2} to={772.4} keys={[z1(749.2), z1(762.0), zk(763.0, 1.6, VID_PANEL.cx, VID_PANEL.cy), zk(769.6, 1.6, VID_PANEL.cx, VID_PANEL.cy), zk(770.4, 2.0, GEN_VID.cx, GEN_VID.cy), zk(772.4, 2.0, GEN_VID.cx, GEN_VID.cy)]} />
    {/* 13:16 → 13:21 · Genjutsu */}
    <ScreenSeg from={796.6} to={SRC_END} keys={[z1(796.6)]} />
  </>
);

// ─── Inserts et habillage (temps source) ───
const ABIDJAN_LOOP = (
  <Loop durationInFrames={f(15)}>
    <OffthreadVideo src={staticFile(`${D}/abidjan.mp4`)} muted style={{ width: 820, height: 461, objectFit: "cover" }} />
  </Loop>
);
const FICHE = `${D}/fiche.png`;

const Overlays: React.FC = () => (
  <>
    {/* ══ L'accroche : Awa à Abidjan, puis à Bali, puis côte à côte ══ */}
    <At from={0} to={6.56}>
      <FullClip src="abidjan.mp4" from={OPEN} end={7.6} volume={0.3} caption="Elle n'existe *pas*." captionAt={1.3} captionEnd={4.2} />
    </At>
    <At from={6.56} to={8.62}>
      <FullClip src="bali.mp4" from={0.5} end={3.1} volume={0.3} caption="À *Bali*" captionAt={1.0} captionEnd={2.06} />
    </At>
    <At from={8.62} to={15.14}>
      <ClipDuo
        end={6.52}
        left={{ src: "abidjan.mp4", from: 9.6, label: "Abidjan" }}
        right={{ src: "bali.mp4", from: 2.6, label: "Bali" }}
        checks={[
          { text: "Même *visage*", at: 3.9 },
          { text: "Mêmes *lunettes*", at: 4.7 },
          { text: "Mêmes *accessoires*", at: 5.5 },
        ]}
      />
    </At>
    <At from={21.76} to={27.0}>
      <FocusVeil start={0} end={5.24} />
      <KeyLine end={5.24} valign="center" size={118} words={[{ w: "Le", t: 0.9 }, { w: "même", t: 1.0 }, { w: "personnage", t: 1.2, hl: true }, { w: "sur", t: 2.36 }, { w: "plusieurs", t: 2.52 }, { w: "vidéos", t: 2.84 }, { w: "?", t: 3.4 }]} />
    </At>
    <At from={27.0} to={31.6}>
      <TopPill text="Ma méthode, *étape par étape*" end={4.6} />
    </At>
    <At from={29.4} to={35.8}>
      <NameTag name="Ibrahim Kamara" meta="Business en ligne depuis *2020*" end={6.4} />
    </At>

    {/* ══ Les modèles d'images et de vidéos (kit média de la marque) ══ */}
    <At from={36.98} to={47.86}>
      <FamilyDuo end={10.88} title="*2 familles* d'IA" titleAt={0.5} leftAt={2.6} rightAt={6.9} />
    </At>
    <At from={47.86} to={51.32}>
      <Slide src="image_models.png" end={3.46} />
    </At>
    <At from={51.32} to={59.4}>
      <Slide src="m2_nanobanana21.png" end={8.08} />
    </At>
    <At from={59.4} to={71.96}>
      <Slide src="m3_gptimage25.png" end={12.56} />
    </At>
    <At from={71.96} to={78.96}>
      <Slide src="m5_soulcinema15.png" end={7.0} />
    </At>
    <At from={78.96} to={90.0}>
      <Slide src="m4_seedream5pro.png" end={11.04} />
    </At>
    <At from={90.0} to={130.5}>
      <Slide
        src="video_models.png"
        end={40.5}
        hl={[
          { from: 2.1, to: 15.0, y: 789, x: 160, w: 1600 },
          { from: 15.0, to: 26.6, y: 669, x: 160, w: 1600 },
          { from: 26.6, to: 40.5, y: 549, x: 160, w: 1600 },
        ]}
      />
    </At>
    <At from={132.58} to={145.0}>
      <ComboCard end={12.42} leftAt={2.8} rightAt={6.3} />
    </At>
    <At from={161.82} to={168.3}>
      <TopPill text="Un abonnement par plateforme : vite *cher*" end={6.5} />
    </At>
    <At from={177.0} to={183.4}>
      <TopPill text="Higgsfield : *tous les modèles* au même endroit" end={6.4} />
    </At>
    <At from={188.2} to={196.6}>
      <CornerPill text="Lien : 1re ligne de la description" end={8.4} accent />
    </At>

    {/* ══ L'inscription et l'offre ══ */}
    <At from={211.66} to={222.0}>
      <StepLT n={1} text="Créer ton compte" end={10.3} />
    </At>
    <At from={229.0} to={235.6}>
      <TopPill text="Mes comptes Google, *floutés*" end={6.6} />
    </At>
    <At from={240.0} to={245.4}>
      <TopPill text="Quelques questions, à la *1re inscription*" end={5.4} />
    </At>
    <At from={285.0} to={291.6}>
      <TopPill text="Le vrai problème : la *constance* du personnage" end={6.6} />
    </At>
    <At from={301.0} to={309.0}>
      <TopPill text="Jusqu'à *50 %* de réduction avec mon lien" end={8.0} />
    </At>
    <At from={309.0} to={318.0}>
      <CornerPill text="Lien : 1re ligne de la description" end={9.0} accent />
    </At>
    <At from={342.6} to={349.6}>
      <SideStat eyebrow="Offre Pro" value="29 $" sub="par mois · *pour débuter*" end={7.0} side="right" top={160} />
    </At>
    <At from={362.0} to={369.0}>
      <TopPill text="Infos bancaires *floutées*" end={7.0} />
    </At>

    {/* ══ Étape 2 · le personnage ══ */}
    <At from={374.0} to={384.0}>
      <StepLT n={2} text="Créer le personnage" end={10.0} />
    </At>
    <At from={430.4} to={436.0}>
      <TopPill text="GPT Image 2.5 · format *3:4*" end={5.6} />
    </At>
    <At from={440.9} to={449.8}>
      <TopPill icon="tip" text="Le prompt ? Écrit avec *Claude* (ou ChatGPT)" end={8.9} />
    </At>
    <At from={455.6} to={461.8}>
      <PriceTag what="Une image · GPT Image 2.5" value="2,75" end={6.2} />
    </At>
    <At from={458.3} to={464.0}>
      <TopPill icon="tip" text="Regarde le prix *avant* de générer" end={5.7} />
    </At>
    <At from={476.6} to={487.4}>
      <ImageStage src="awa.png" iw={1744} ih={2336} end={10.8} h={860} label="Awa · *personne ne l'a photographiée*" labelAt={1.0} />
    </At>
    <At from={490.4} to={497.6}>
      <TopPill icon="tip" text="Pas satisfait ? *Relance* le même prompt" end={7.2} />
    </At>

    {/* ══ Étape 3 · la fiche personnage ══ */}
    <At from={500.74} to={510.6}>
      <StepLT n={3} text="La fiche personnage" end={9.9} />
    </At>
    <At from={538.0} to={545.0}>
      <TopPill text="GPT Image 2.5 Sunburst · format *16:9*" end={7.0} />
    </At>
    <At from={551.6} to={556.8}>
      <PriceTag what="La fiche · GPT Image 2.5 Sunburst" value="2,75" end={5.2} />
    </At>
    <At from={559.0} to={581.4}>
      <ImageStage
        src="fiche.png"
        iw={2688}
        ih={1520}
        end={22.4}
        h={900}
        marks={[
          { at: 7.1, x0: 0, x1: 0.334, label: "De face" },
          { at: 7.9, x0: 0.334, x1: 0.634, label: "De profil" },
          { at: 8.84, x0: 0.634, x1: 1, label: "Gros plan" },
        ]}
      />
    </At>

    {/* ══ Étape 4 · la vidéo ══ */}
    <At from={581.66} to={592.0}>
      <StepLT n={4} text="Animer avec Seedance 2.5" end={10.3} />
    </At>
    <At from={600.9} to={607.4}>
      <TopPill text="*@Image1* = ta fiche personnage" end={6.5} />
    </At>
    <At from={627.6} to={636.4}>
      <TopPill text="Seedance 2.5 · *15 s* · 16:9 · 720p" end={8.8} />
    </At>
    <At from={636.6} to={645.4}>
      <TopPill icon="tip" text="*720p* suffit · 1080p coûte plus du double" end={8.8} />
    </At>
    <At from={650.0} to={656.0}>
      <PriceTag what="Vidéo de 15 s · 720p" value="105" end={6.0} />
    </At>
    <At from={663.7} to={671.6}>
      <TopPill text="Une vidéo prend *plus de temps* qu'une image" end={7.9} />
    </At>

    {/* ══ La comparaison avec la fiche ══ */}
    <At from={681.44} to={706.4}>
      <Backdrop />
      <PlanVsResult
        plan={FICHE}
        result={ABIDJAN_LOOP}
        end={24.96}
        planLabel="La fiche personnage"
        resultLabel="La vidéo Seedance 2.5"
        checks={[
          { at: 15.0, label: "Le visage", ok: true },
          { at: 17.6, label: "La tenue", ok: true },
          { at: 19.2, label: "Le sac à main", ok: true },
          { at: 20.4, label: "Les lunettes", ok: true },
        ]}
      />
    </At>
    <At from={712.9} to={720.0}>
      <TopPill text="Une erreur ? *Régénère*, en insistant dans le prompt" end={7.1} />
    </At>
    <At from={724.2} to={729.9}>
      <TopPill icon="tip" text="Les premiers essais : *toujours en 720p*" end={5.7} />
    </At>
    <At from={730.62} to={737.4}>
      <TopPill text="L'erreur des débutants : la qualité *max* dès le 1er essai" end={6.8} />
    </At>
    <At from={739.92} to={744.6}>
      <FocusVeil start={0} end={4.68} />
      <KeyLine end={4.68} valign="center" size={130} words={[{ w: "Le", t: 0.2 }, { w: "test", t: 0.4 }, { w: "ultime", t: 0.7, hl: true }]} />
    </At>
    <At from={757.0} to={766.6}>
      <StepLT n={5} text="2e vidéo : Awa à Bali" end={9.6} />
    </At>
    <At from={770.4} to={772.28}>
      <PriceTag what="Vidéo de 15 s · 720p" value="105" end={1.88} />
    </At>

    {/* ══ La dernière astuce : Genjutsu ══ */}
    <At from={772.4} to={780.0}>
      <TopPill text="Dernière astuce : ton personnage dans une *trend*" end={7.6} />
    </At>
    <At from={798.4} to={SRC_END}>
      <StepLT n={6} text="Genjutsu" end={SRC_END - 798.4} />
    </At>
  </>
);

// ─── Son (temps source) ───
const SFX_SRC: SfxCue[] = [
  { k: "popSelectA", at: 1.35 }, { k: "whoosh02", at: 6.6 }, { k: "whoosh03", at: 8.66 },
  { k: "popSelectA", at: 12.5 }, { k: "popSelectB", at: 13.3 }, { k: "popSelectA", at: 14.1 },
  { k: "whoosh01", at: 21.8 }, { k: "popNotif02", at: 22.96, gain: 0.6 }, { k: "popSelectB", at: 27.1 }, { k: "popSelectA", at: 29.5 },
  { k: "whoosh02", at: 37.0 }, { k: "popSelectA", at: 39.6 }, { k: "popSelectB", at: 43.9 },
  { k: "whoosh03", at: 47.9 }, { k: "whoosh01", at: 51.35 }, { k: "whoosh02", at: 59.45 }, { k: "whoosh03", at: 72.0 }, { k: "whoosh01", at: 79.0 },
  { k: "whoosh02", at: 90.05 }, { k: "clickA", at: 92.1 }, { k: "clickA", at: 105.0 }, { k: "clickA", at: 116.6 },
  { k: "whoosh03", at: 132.6 }, { k: "popSelectA", at: 135.4 }, { k: "impactHitLow", at: 138.9, gain: 0.4 },
  { k: "popSelectB", at: 161.9 }, { k: "popSelectA", at: 177.1 }, { k: "popSelectB", at: 188.3 },
  { k: "whoosh01", at: 194.4 }, { k: "clickA", at: 211.7 }, { k: "popSelectA", at: 229.1 }, { k: "popSelectB", at: 240.1 }, { k: "popSelectA", at: 285.1 },
  { k: "impactDeep", at: 304.7, gain: 0.5 }, { k: "popSelectB", at: 309.1 }, { k: "popSelectA", at: 343.6 }, { k: "popSelectB", at: 362.1 },
  { k: "clickA", at: 374.1 }, { k: "popSelectA", at: 430.5 }, { k: "popSelectB", at: 441.0 }, { k: "impactHitLow", at: 456.8, gain: 0.4 }, { k: "popSelectA", at: 458.4 },
  { k: "whoosh02", at: 476.65 }, { k: "popSelectB", at: 490.5 }, { k: "clickA", at: 500.8 }, { k: "popSelectA", at: 538.1 }, { k: "impactHitLow", at: 551.8, gain: 0.4 },
  { k: "whoosh03", at: 559.05 }, { k: "popSelectA", at: 566.1 }, { k: "popSelectB", at: 566.9 }, { k: "popSelectA", at: 567.84 },
  { k: "clickA", at: 581.7 }, { k: "popSelectB", at: 601.0 }, { k: "popSelectA", at: 627.7 }, { k: "popSelectB", at: 636.7 }, { k: "impactDeep", at: 650.2, gain: 0.5 }, { k: "popSelectA", at: 663.8 },
  { k: "whoosh01", at: 681.5 }, { k: "popSelectA", at: 696.4 }, { k: "popSelectB", at: 699.0 }, { k: "popSelectA", at: 700.6 }, { k: "popSelectB", at: 701.8 },
  { k: "popSelectA", at: 713.0 }, { k: "popSelectB", at: 724.3 }, { k: "popSelectA", at: 730.7 }, { k: "whoosh02", at: 739.95 }, { k: "popNotif02", at: 740.6, gain: 0.6 },
  { k: "clickA", at: 757.1 }, { k: "impactDeep", at: 771.6, gain: 0.5 }, { k: "popSelectA", at: 772.5 }, { k: "clickA", at: 798.5 },
];
const SFX: SfxCue[] = SFX_SRC.map((c) => ({ ...c, gain: (c.gain ?? SFX_KIT[c.k].gain) * (c.at < 16 ? 0.42 : 0.6) }));

const Body: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    <Screens />
    <FaceTrack />
    <Overlays />
    <SfxTrack cues={SFX} />
    <Audio src={staticFile(`${D}/voice.wav`)} />
  </AbsoluteFill>
);

// ─── Musique (temps de sortie) : coupée pendant les vidéos jouées en entier ───
const M = "epidemic/higgs-kling4/hq";
const PARTS = [
  { file: "m1_contexte_groundhog_day.mp3", from: 3.4, to: 39.6, lufs: -31, src: -9.6, fadeIn: 1.4, fadeOut: 1.4, skip: 0 },
  { file: "m2_threads_lush_hour.mp3", from: 39.4, to: 197.6, lufs: -33, src: -10.2, fadeIn: 1.4, fadeOut: 1.4, skip: 0 },
  { file: "m3_linkedin_mango_fizz.mp3", from: 197.2, to: 343.0, lufs: -33, src: -9.5, fadeIn: 1.4, fadeOut: 3.0, skip: 0 },
  { file: "m3_linkedin_mango_fizz.mp3", from: 340.0, to: 377.6, lufs: -33, src: -9.5, fadeIn: 3.0, fadeOut: 1.2, skip: 20 },
  { file: "m6_demo_good_intentions.mp3", from: 377.0, to: 527.0, lufs: -35, src: -8.5, fadeIn: 1.4, fadeOut: 3.0, skip: 0 },
  { file: "m8_references_sunday_brunch.mp3", from: 524.0, to: INS_ABIDJAN, lufs: -35, src: -9.9, fadeIn: 3.0, fadeOut: 0.6, skip: 0 },
  { file: "m9_verdict_vapor.mp3", from: INS_ABIDJAN + ABIDJAN, to: INS_BALI, lufs: -33, src: -8.6, fadeIn: 1.0, fadeOut: 0.6, skip: 0 },
  { file: "m5_kling_secure.mp3", from: INS_BALI + BALI, to: FULL_END, lufs: -32, src: -14.5, fadeIn: 1.0, fadeOut: 1.5, skip: 0 },
];
const MIX: MixEvent[] = [
  { k: "dip", from: OPEN + 21.76, to: OPEN + 27.0, db: 3 }, // la question
  { k: "dip", from: OPEN + 300.9, to: OPEN + 309.0, db: 3 }, // les 50 %
  { k: "dip", from: OPEN + 730.6, to: OPEN + 744.6, db: 3 }, // l'erreur des débutants, le test ultime
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

// Volume des générations jouées en entier : −28,5 LUFS contre −22 pour la voix
const CLIP_VOL = 1.8;

export const HiggsFirstFull: React.FC = () => (
  <AbsoluteFill style={{ background: "black" }}>
    {/* ouverture : Abidjan, son seul */}
    <Sequence from={0} durationInFrames={F_OPEN}>
      <FullClip src="abidjan.mp4" end={OPEN + 1} volume={CLIP_VOL} />
    </Sequence>
    {/* le son d'Abidjan continue sous la voix jusqu'à 6,56 s (FullClip du corps, volume 0,3) */}
    {PIECES.map((p) => (
      <Sequence key={p.src} from={p.out} durationInFrames={p.len}>
        <Sequence from={-p.src} layout="none">
          <Body />
        </Sequence>
      </Sequence>
    ))}
    <Sequence from={FI_ABIDJAN} durationInFrames={F_ABJ}>
      <FullClip src="abidjan.mp4" end={ABIDJAN} volume={CLIP_VOL} fadeIn={0.25} caption="Seedance 2.5 · 15 s · 720p · *105 crédits*" captionAt={0.8} captionEnd={5.0} />
    </Sequence>
    <Sequence from={FI_BALI} durationInFrames={F_BALI}>
      <FullClip src="bali.mp4" end={BALI} volume={CLIP_VOL} fadeIn={0.25} caption="Même fiche, nouveau prompt · *Bali*" captionAt={0.8} captionEnd={5.0} />
    </Sequence>
    <MusicTrack />
    <Grain />
  </AbsoluteFill>
);
