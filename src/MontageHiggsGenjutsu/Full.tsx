// Montage « Higgsfield Genjutsu for Reels » (refaire des Reels viraux avec l'IA, dans Claude). Plan : montages/higgs-genjutsu/04-plan.md.
// Aucune coupe dans les rushes (14:06). Ajouts, posés entre deux phrases :
//  - l'ouverture : les 3 shorts générés, avec leur son (brief) ;
//  - le Reel de référence (8,7 M) après « la première vidéo que je vais essayer de répliquer » (9:26) ;
//  - le short 1 (11:05), le short 2 (11:52), les 3 accroches (12:33), la version corrigée (12:58).
// Les shorts n'étaient pas finis au tournage (crédits épuisés) : tant qu'un fichier manque (src null), un emplacement
// « en attente » le remplace, à la durée prévue. Il suffit ensuite de remplir SHORTS (fichier + durée réelle).
// Leçons de Seedance (retours d'Ibrahim du 03/11/2026) : illustrations en douceur (Cover), médaillon au-dessus, musique basse.
import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile } from "remotion";
import { Backdrop, EASE, f, FacePip, FocusVeil, Grain, KeyLine, ScreenStage, SfxTrack, SFX_KIT, useT, type BlurMask, type SfxCue, type ViewKey } from "../montage/lib";
import { mixGain, type MixEvent } from "../montage/mix";
import { StepLT, TopPill } from "../montage/Explainers";
import { CornerPill, NameTag, SideStat } from "../MontageHostingerProduits/Illus";
import { EndCard } from "../MontageHiggsKling4/Illus";
import { TipBoard } from "../MontageHiggsFirst/Illus";
import { D, HooksInsert, ReelCard, ReelWall, ShortInsert, ShortsGrid, ShortTrio, VideoCard, type ShortFile } from "./Illus";

// ─── Les shorts générés (à remplir quand Ibrahim les envoie : fichier dans public/montage/higgs-genjutsu/, durée réelle) ───
export const SHORTS: Record<"s1" | "s2" | "h1" | "h2" | "h3" | "fix", ShortFile> = {
  s1: { src: null, dur: 30, label: "Short 1 · mon double IA" },
  s2: { src: null, dur: 30, label: "Short 2 · l'influenceur IA" },
  h1: { src: null, dur: 30, label: "Accroche 1" },
  h2: { src: null, dur: 30, label: "Accroche 2" },
  h3: { src: null, dur: 30, label: "Accroche 3" },
  fix: { src: null, dur: 30, label: "Short 2 corrigé" },
};
const OPEN_EACH = 4; // ouverture : 4 s de chaque short, avec le son
const HOOK_EACH = 4; // les 3 accroches : les 4 premières secondes de chaque version
const REEL2_LEN = 8;

// ─── Timeline : temps source → temps de sortie (tout en images entières) ───
type Ins = { at: number; len: number };
const INS: Ins[] = [
  { at: 0, len: 3 * OPEN_EACH },
  { at: 565.86, len: REEL2_LEN }, // après « … que je vais essayer de répliquer. »
  { at: 665.05, len: SHORTS.s1.dur }, // après « je te mettrai le résultat de cette première vidéo à l'écran. »
  { at: 711.7, len: SHORTS.s2.dur }, // après « … le prompt directement dans Claude. »
  { at: 752.7, len: 3 * HOOK_EACH }, // après « … et on attend le résultat. »
  { at: 778.4, len: SHORTS.fix.dur }, // après « … avec les changements que tu as demandé. »
];
export const SRC_END = 846.0;
const FI = INS.map((x) => ({ at: f(x.at), len: f(x.len) }));
/** Image de sortie d'une image source ; `after` : une insertion posée exactement là passe avant. */
const outF = (srcF: number, after = true) => srcF + FI.filter((x) => x.at < srcF || (after && x.at === srcF)).reduce((a, x) => a + x.len, 0);
const insOut = (i: number) => outF(FI[i].at, false);
const PIECES = FI.map((x, i) => ({ src: x.at, len: (i + 1 < FI.length ? FI[i + 1].at : f(SRC_END)) - x.at })).map((p) => ({ ...p, out: outF(p.src) }));
export const FULL_FRAMES = outF(f(SRC_END));
export const FULL_END = FULL_FRAMES / 30;
const o = (src: number, after = true) => outF(f(src), after) / 30;

const FACE = `${D}/face_dn.mp4`;
const SCREEN = `${D}/screen.mp4`;
const FACE_POS = { x: 0.5, y: 0.34 };
const GRADE = "brightness(1.22) contrast(1.06) saturate(1.05)"; // contre-jour de la fenêtre
const WIN = { x: 108, y: 54, w: 1704, h: 972 };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const At: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => (
  <Sequence from={f(from)} durationInFrames={Math.max(1, f(to) - f(from))} layout="none">
    <AbsoluteFill>{children}</AbsoluteFill>
  </Sequence>
);

// ─── Illustration plein écran, en douceur : le dessous se floute d'abord, puis l'illustration entre en fondu ───
const CoverFx: React.FC<{ end: number; children: React.ReactNode }> = ({ end, children }) => {
  const t = useT();
  const ease = Easing.inOut(Easing.cubic);
  const veil = Math.min(interpolate(t, [0, 0.55], [0, 1], { ...clamp, easing: ease }), interpolate(t, [end - 0.55, end], [1, 0], { ...clamp, easing: ease }));
  const q = Math.min(interpolate(t, [0.15, 0.8], [0, 1], { ...clamp, easing: EASE }), interpolate(t, [end - 0.6, end - 0.05], [1, 0], { ...clamp, easing: ease }));
  return (
    <AbsoluteFill>
      {veil > 0 && <AbsoluteFill style={{ backdropFilter: `blur(${20 * veil}px)`, background: `rgba(9,11,8,${0.5 * veil})` }} />}
      <AbsoluteFill style={{ opacity: q, transform: `scale(${1.05 - 0.05 * q})`, filter: q < 0.98 ? `blur(${(1 - q) * 12}px)` : undefined }}>
        <Backdrop />
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const Cover: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => (
  <At from={from} to={to}>
    <CoverFx end={to - from}>
      <Sequence from={-f(from)} layout="none">
        {children}
      </Sequence>
    </CoverFx>
  </At>
);

// ─── Face cam : plein cadre (p = 0) quand Ibrahim parle à la caméra, médaillon (p = 1) sur l'écran ───
const FACE_KEYS = [
  { t: 0, p: 0 },
  { t: 140.8, p: 0 },
  { t: 141.6, p: 1 },
  { t: 541.8, p: 1 },
  { t: 542.6, p: 0 },
  { t: 565.86, p: 0 },
  { t: 565.9, p: 1 },
  { t: 833.4, p: 1 },
  { t: 834.2, p: 0 },
];
const FACE_ZOOM = [
  { t: 0, z: 1.0 }, { t: 35.0, z: 1.0 }, { t: 35.7, z: 1.07 }, { t: 46.0, z: 1.07 }, { t: 46.7, z: 1.0 }, { t: 57.8, z: 1.0 }, { t: 58.5, z: 1.06 },
  { t: 69.9, z: 1.06 }, { t: 70.6, z: 1.0 }, { t: 92.8, z: 1.0 }, { t: 121.5, z: 1.0 }, { t: 122.2, z: 1.07 }, { t: 140.8, z: 1.07 },
  { t: 542.6, z: 1.0 }, { t: 559.8, z: 1.0 }, { t: 560.5, z: 1.07 }, { t: 565.86, z: 1.07 },
  { t: 834.2, z: 1.0 }, { t: 838.7, z: 1.0 }, { t: 839.4, z: 1.06 }, { t: 846, z: 1.06 },
];
const FaceTrack: React.FC = () => <FacePip src={FACE} trimBefore={0} face={FACE_POS} grade={GRADE} pipScale={0.6} keys={FACE_KEYS} zoomKeys={FACE_ZOOM} />;
// Le médaillon au-dessus d'une illustration plein écran
const PipOverFx: React.FC<{ from: number; end: number; fade: number }> = ({ from, end, fade }) => {
  const t = useT();
  const op = fade > 0 ? Math.min(interpolate(t, [0, fade], [0, 1], { ...clamp, easing: EASE }), interpolate(t, [end - fade, end], [1, 0], clamp)) : 1;
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <FacePip src={FACE} trimBefore={from} face={FACE_POS} grade={GRADE} pipScale={0.6} keys={[{ t: 0, p: 1 }]} />
    </AbsoluteFill>
  );
};
const PIP_OVER = [
  { from: 58.5, to: 69.3, fade: 0.6 }, // ma vidéo n°1 en abonnés
  { from: 285.4, to: 297.5, fade: 0 }, // mes Shorts faceless (déjà en médaillon sur l'écran)
  { from: 322.6, to: 355.7, fade: 0 }, // les 2 fonctions de Genjutsu
];
const PipOver: React.FC = () => (
  <>
    {PIP_OVER.map((w) => (
      <At key={w.from} from={w.from} to={w.to}>
        <PipOverFx from={w.from} end={w.to - w.from} fade={w.fade} />
      </At>
    ))}
  </>
);

// ─── L'écran ───
const z1 = (t: number): ViewKey => ({ t, z: 1, cx: 960, cy: 540 });
const zk = (t: number, z: number, cx: number, cy: number): ViewKey => ({ t, z, cx, cy });
const ScreenSeg: React.FC<{ from: number; to: number; keys: ViewKey[]; masks?: BlurMask[] }> = ({ from, to, keys, masks }) => (
  <At from={from} to={to}>
    <ScreenStage src={SCREEN} trimBefore={from} win={WIN} masks={masks?.map((m) => ({ ...m, from: m.from - from, to: m.to - from }))} keys={keys.map((k) => ({ ...k, t: k.t - from }))} />
  </At>
);
const YT_STATS = { cx: 940, cy: 500 }; // vues, heures, abonnés (YouTube Studio)
const PROMPT = { cx: 955, cy: 545 }; // la zone de message de Claude
const ULTRA = { cx: 940, cy: 520 }; // la carte ULTRA dans Claude
// Données personnelles floutées : comptes Google (liste, Touch ID, accueil) ; historique des conversations et page Compte de Claude
const MASKS: BlurMask[] = [
  { from: 409.0, to: 420.9, x: 150, y: 110, w: 1620, h: 890 },
  { from: 507.3, to: 561.0, x: 108, y: 370, w: 390, h: 640 },
  // Réglages de Claude, page Compte : appareils connectés, villes, identifiant d'organisation
  { from: 510.5, to: 514.0, x: 500, y: 60, w: 1310, h: 960 },
  { from: 516.5, to: 521.0, x: 500, y: 60, w: 1310, h: 960 },
];

const Screens: React.FC = () => (
  <>
    {/* 2:21 → 9:02 · Instagram, YouTube, Genjutsu, l'inscription, le connecteur */}
    <ScreenSeg from={141.0} to={542.6} masks={MASKS} keys={[z1(141.0), z1(238.6), zk(239.6, 1.5, YT_STATS.cx, YT_STATS.cy), zk(251.8, 1.5, YT_STATS.cx, YT_STATS.cy), z1(252.8)]} />
    {/* 9:26 → 13:54 · Claude : les 3 shorts, la correction, l'offre Ultra */}
    <ScreenSeg
      from={565.86}
      to={834.2}
      masks={MASKS}
      keys={[
        z1(565.86), z1(578.6), zk(579.6, 1.6, PROMPT.cx, PROMPT.cy), zk(617.6, 1.6, PROMPT.cx, PROMPT.cy), z1(618.6),
        z1(689.6), zk(690.6, 1.6, PROMPT.cx, PROMPT.cy), zk(711.6, 1.6, PROMPT.cx, PROMPT.cy), z1(712.2),
        z1(738.8), zk(739.8, 1.5, PROMPT.cx, 560), zk(752.6, 1.5, PROMPT.cx, 560), z1(753.2),
        z1(767.6), zk(768.4, 1.5, PROMPT.cx, 560), zk(778.3, 1.5, PROMPT.cx, 560), z1(779.0),
        z1(799.6), zk(800.6, 1.4, ULTRA.cx, ULTRA.cy), zk(826.0, 1.4, ULTRA.cx, ULTRA.cy), z1(827.0),
      ]}
    />
  </>
);

// ─── Habillage (temps source) ───
const REELS = [
  { src: "reel1.mp4", dur: 14.2, views: "25,3 M" },
  { src: "reel2.mp4", dur: 57.0, views: "8,7 M" },
  { src: "reel3.mp4", dur: 32.0, views: "5,3 M" },
  { src: "reel7.mp4", dur: 54.0, views: "2,2 M" },
];

const Overlays: React.FC = () => (
  <>
    {/* ══ Intro : les 3 shorts, puis les Reels de référence (Ibrahim lit son script) ══ */}
    <Cover from={0} to={35.0}>
      <At from={0} to={23.78}>
        <ShortTrio end={23.78} shorts={[SHORTS.s1, SHORTS.s2, SHORTS.h1]} title="Aucune n'a été *filmée*" titleAt={14.6} />
      </At>
      <At from={23.78} to={35.0}>
        <ReelWall end={11.22} reels={REELS} title="Des Reels à *des millions* de vues" />
      </At>
    </Cover>
    <At from={35.1} to={43.9}>
      <FocusVeil start={0} end={8.8} />
      <KeyLine end={8.8} valign="center" size={118} words={[{ w: "Une", t: 0.3 }, { w: "seule", t: 0.5 }, { w: "bonne", t: 0.8 }, { w: "vidéo", t: 1.1, hl: true }, { w: "suffit", t: 1.6 }]} />
    </At>
    <At from={44.0} to={50.0}>
      <NameTag name="Ibrahim Kamara" meta="Créateur de contenu depuis *2020*" end={6.0} />
    </At>
    <At from={53.4} to={57.8}>
      <TopPill text="1 ou 2 vidéos font *vivre* toute la chaîne" end={4.4} />
    </At>
    <Cover from={57.9} to={69.9}>
      <At from={57.9} to={69.9}>
        <VideoCard end={12.0} thumb="topvideo/thumb.jpg" eyebrow="Ma vidéo n°1 en abonnés" title="Comment créer une chaîne YouTube monétisable en 2026" meta="*793 883* vues · publiée en octobre 2023" viewsAt={4.0} />
      </At>
    </Cover>
    <At from={69.98} to={77.3}>
      <FocusVeil start={0} end={7.32} />
      <KeyLine end={7.32} valign="center" size={112} words={[{ w: "Trouver", t: 0.3 }, { w: "la", t: 0.6 }, { w: "meilleure", t: 0.8 }, { w: "idée", t: 1.1, hl: true }]} />
    </At>
    <At from={77.4} to={84.0}>
      <TopPill text="S'inspirer de ce qui a *déjà fait des millions*" end={6.6} />
    </At>
    <Cover from={92.9} to={121.6}>
      <At from={92.9} to={110.04}>
        <ReelCard src="reel1.mp4" dur={14.2} end={17.14} views="25,3 M" handle="@cuzimroy" topic="Motivation : *ne pas abandonner*" viewsAt={5.7} />
      </At>
      <At from={110.04} to={113.7}>
        <ReelCard src="reel2.mp4" dur={57} end={3.66} views="8,7 M" handle="@firsttimeonearth0" topic="Ton rythme, *pas celui des autres*" viewsAt={0.4} />
      </At>
      <At from={113.7} to={118.16}>
        <ReelCard src="reel3.mp4" dur={32} end={4.46} views="5,3 M" handle="@var.aunevik" topic="Un *jeu de mots*" viewsAt={2.4} />
      </At>
      <At from={118.16} to={121.6}>
        <ReelCard src="reel7.mp4" dur={54} end={3.44} views="2,2 M" handle="@justyn.ai" topic="Un tuto de montage *avec l'IA*" viewsAt={0.4} />
      </At>
    </Cover>
    <At from={121.6} to={128.8}>
      <TopPill text="Et si je les *refaisais* avec Higgsfield ?" end={7.2} />
    </At>
    <At from={129.0} to={136.0}>
      <TopPill icon="trend" text="D'abord : *mes vrais résultats*" end={7.0} />
    </At>

    {/* ══ Mes résultats : Instagram, puis la chaîne YouTube faceless ══ */}
    <At from={156.7} to={163.4}>
      <SideStat eyebrow="Short Instagram" value="~10 000" sub="vues · *1 à 2 semaines*" end={6.7} side="right" top={160} />
    </At>
    <At from={200.8} to={207.0}>
      <SideStat eyebrow="Short IA · actualité" value="14 000" sub="vues sur *mon Instagram*" end={6.2} side="right" top={160} />
    </At>
    <At from={225.3} to={233.0}>
      <TopPill text="Ma chaîne Shorts faceless · lancée le *10 octobre*" end={7.7} />
    </At>
    <At from={239.0} to={246.0}>
      <SideStat eyebrow="En moins d'un mois" value="~200 000" sub="vues" end={7.0} side="right" top={160} hero />
    </At>
    <At from={246.4} to={252.0}>
      <SideStat eyebrow="Abonnés" value="141" sub="ils montent *lentement*" end={5.6} side="right" top={160} />
    </At>
    <At from={254.6} to={260.0}>
      <TopPill icon="trend" text="30 000 · 33 000 · 17 000 vues par Short" end={5.4} />
    </At>
    <At from={276.0} to={283.0}>
      <TopPill text="Peu d'abonnés, *beaucoup de vues*" end={7.0} />
    </At>
    <Cover from={285.4} to={297.5}>
      <At from={285.4} to={297.5}>
        <ShortsGrid end={12.1} files={["001-moon.mp4", "003-greenland.mp4", "004-japan.mp4", "011-california.mp4"]} title="Des Shorts *simples*, faits avec l'IA" />
      </At>
    </Cover>

    {/* ══ Higgsfield Genjutsu ══ */}
    <At from={301.2} to={307.2}>
      <TopPill text="Vidéo sponsorisée par *Higgsfield*" end={6.0} />
    </At>
    <At from={310.5} to={320.0}>
      <StepLT n={1} text="Higgsfield Genjutsu" end={9.5} />
    </At>
    <Cover from={322.6} to={355.7}>
      <At from={322.6} to={355.7}>
        <TipBoard
          end={33.1}
          eyebrow="Genjutsu · 2 fonctions"
          title="*Motion Transfer* et *Object Swap*"
          titleAt={0.3}
          rows={[
            { text: "Motion Transfer : tu prends *ta place* dans la vidéo", at: 1.6 },
            { text: "Object Swap : tu changes *le décor ou les objets*", at: 19.0 },
          ]}
        />
      </At>
    </Cover>
    <At from={361.0} to={368.0}>
      <CornerPill text="Lien : 1re ligne de la description" end={7.0} accent />
    </At>
    <At from={365.0} to={374.0}>
      <TopPill text="Sur le site, ou *directement dans Claude*" end={9.0} />
    </At>
    <At from={380.2} to={390.0}>
      <StepLT n={2} text="Créer ton compte" end={9.8} />
    </At>
    <At from={394.0} to={401.0}>
      <CornerPill text="Lien : 1re ligne de la description" end={7.0} accent />
    </At>
    <At from={409.4} to={420.6}>
      <TopPill text="Mes comptes Google, *floutés*" end={11.2} />
    </At>
    <At from={453.0} to={468.0}>
      <TopPill text="Jusqu'à *50 %* de réduction, automatique avec mon lien" end={15.0} />
    </At>
    <At from={468.0} to={476.0}>
      <CornerPill text="Lien : 1re ligne de la description" end={8.0} accent />
    </At>
    <At from={488.0} to={495.0}>
      <TopPill icon="tip" text="Et si tu passes : une 2e offre, *-55 %*" end={7.0} />
    </At>
    <At from={499.5} to={510.0}>
      <StepLT n={3} text="Connecter Higgsfield à Claude" end={10.5} />
    </At>
    <At from={524.0} to={536.0}>
      <TopPill text="Adresse du connecteur : *mcp.higgsfield.ai/mcp*" end={12.0} />
    </At>
    <Cover from={542.2} to={560.2}>
      <At from={542.2} to={560.2}>
        <TipBoard
          end={18.0}
          eyebrow="Si tu es nouveau"
          title="L'essai *Higgsfield Plus*"
          titleAt={0.3}
          rows={[
            { text: "3 jours à *0 $*, 100 crédits à utiliser dans Claude", at: 1.0 },
            { text: "Une carte de paiement est demandée", at: 9.8 },
            { text: "Sans annulation : abonnement Plus *payant*", at: 12.5 },
            { text: "Pour annuler : écris « *cancel auto-renewal* » à Claude", at: 14.5 },
          ]}
        />
      </At>
    </Cover>

    {/* ══ Short 1 : moi, sans filmer ══ */}
    <At from={568.6} to={578.0}>
      <StepLT n={4} text="Short 1 : moi, sans filmer" end={9.4} />
    </At>
    <At from={582.2} to={590.0}>
      <TopPill text="La commande : */genjutsu-for-reels*" end={7.8} />
    </At>
    <At from={594.0} to={606.0}>
      <TopPill text="30 s · 9:16 · français · la référence · *ma photo*" end={12.0} />
    </At>
    <At from={612.8} to={618.6}>
      <TopPill text="La voix : *ce n'est pas la mienne*" end={5.8} />
    </At>
    <At from={657.8} to={662.0}>
      <TopPill text="Claude demande des *autorisations* : accepte" end={4.2} />
    </At>
    <At from={665.1} to={674.6}>
      <TopPill text="Ce n'est pas moi : c'est *mon double IA*" end={9.5} />
    </At>

    {/* ══ Short 2 : un influenceur IA ══ */}
    <At from={674.7} to={684.0}>
      <StepLT n={5} text="Short 2 : un influenceur IA" end={9.3} />
    </At>
    <At from={699.6} to={706.4}>
      <TopPill text="Pas de photo : Claude *crée le personnage*" end={6.8} />
    </At>

    {/* ══ Short 3 : 3 accroches ══ */}
    <At from={712.2} to={722.0}>
      <StepLT n={6} text="Short 3 : tester 3 accroches" end={9.8} />
    </At>
    <At from={717.1} to={724.0}>
      <TopPill icon="tip" text="Tout se joue dans les *3 premières secondes*" end={6.9} />
    </At>
    <At from={730.0} to={737.0}>
      <TopPill text="Publie les 3, garde *la gagnante*" end={7.0} />
    </At>

    {/* ══ Corriger en une phrase ══ */}
    <At from={753.2} to={762.0}>
      <StepLT n={7} text="Corriger en une phrase" end={8.8} />
    </At>
    <At from={767.6} to={775.0}>
      <TopPill text="« Refais le short 2 avec une *voix plus calme* »" end={7.4} />
    </At>

    {/* ══ L'offre ══ */}
    <At from={779.7} to={788.0}>
      <StepLT n={8} text="Quelle offre choisir ?" end={8.3} />
    </At>
    <At from={789.4} to={797.0}>
      <TopPill text="Dans Claude : *Show me the Higgsfield plans*" end={7.6} />
    </At>
    <At from={803.6} to={809.0}>
      <TopPill text="Ma recommandation : *Ultra*" end={5.4} />
    </At>
    <At from={806.6} to={812.0}>
      <CornerPill text="Jusqu'à 50 % avec mon lien" end={5.4} accent />
    </At>
    <At from={811.5} to={819.0}>
      <SideStat eyebrow="Offre Ultra" value="3 000" sub="crédits par mois · *8 en parallèle*" end={7.5} side="left" top={160} />
    </At>
    <At from={821.0} to={829.6}>
      <TopPill text="Tous les modèles : Seedance, Seedream, *Nano Banana Pro*" end={8.6} />
    </At>
    <At from={829.7} to={834.0}>
      <CornerPill text="Lien : 1re ligne de la description" end={4.3} accent />
    </At>
    <At from={834.2} to={SRC_END}>
      <EndCard end={SRC_END - 834.2} eyebrow="À regarder ensuite" title="Un influenceur IA pour *gagner de l'argent* en 2026" />
    </At>
  </>
);

// ─── Son (temps source) ───
const POPS = [53.5, 58.0, 77.5, 121.7, 129.1, 156.8, 200.9, 225.4, 246.5, 254.7, 276.1, 301.3, 361.1, 365.1, 394.1, 409.5, 453.1, 468.1, 488.1, 524.1, 582.3, 594.1, 612.9, 657.9, 665.2, 699.7, 717.2, 730.1, 767.7, 789.5, 803.7, 806.7, 821.1, 829.8];
const CLICKS = [310.6, 380.3, 499.6, 568.7, 674.8, 712.3, 753.3, 779.8];
const WHOOSH = [0.2, 23.85, 35.15, 57.95, 69.95, 92.95, 110.1, 113.75, 118.2, 285.45, 322.65, 542.25, 834.25];
const IMPACTS = [98.6, 239.1, 811.6];
const SFX_SRC: SfxCue[] = [
  ...POPS.map((at, i): SfxCue => ({ k: i % 2 ? "popSelectB" : "popSelectA", at })),
  ...CLICKS.map((at): SfxCue => ({ k: "clickA", at })),
  ...WHOOSH.map((at, i): SfxCue => ({ k: (["whoosh01", "whoosh02", "whoosh03"] as const)[i % 3], at })),
  ...IMPACTS.map((at): SfxCue => ({ k: "impactDeep", at, gain: 0.5 })),
];
const SFX: SfxCue[] = SFX_SRC.map((c) => ({ ...c, gain: (c.gain ?? SFX_KIT[c.k].gain) * 0.55 }));

const Body: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    <Screens />
    <FaceTrack />
    <Overlays />
    <PipOver />
    <SfxTrack cues={SFX} />
    <Audio src={staticFile(`${D}/voice.wav`)} />
  </AbsoluteFill>
);

// ─── Musique (temps de sortie), coupée pendant les insertions qui ont leur son ; 3 dB sous Seedance ───
const M = "epidemic/higgs-kling4/hq";
const PARTS = [
  { file: "m1_contexte_groundhog_day.mp3", from: o(0), to: o(141.4), lufs: -35, src: -9.6, fadeIn: 1.4, fadeOut: 1.4, skip: 0 },
  { file: "m2_threads_lush_hour.mp3", from: o(141.0), to: o(301.4), lufs: -36, src: -10.2, fadeIn: 1.4, fadeOut: 1.4, skip: 0 },
  { file: "m3_linkedin_mango_fizz.mp3", from: o(301.0), to: o(447.0), lufs: -36, src: -9.5, fadeIn: 1.4, fadeOut: 2.0, skip: 0 },
  { file: "m6_demo_good_intentions.mp3", from: o(445.0), to: o(565.86, false), lufs: -38, src: -8.5, fadeIn: 2.0, fadeOut: 0.6, skip: 0 },
  { file: "m8_references_sunday_brunch.mp3", from: o(565.86), to: o(665.05, false), lufs: -38, src: -9.9, fadeIn: 1.0, fadeOut: 0.6, skip: 0 },
  { file: "m8_references_sunday_brunch.mp3", from: o(665.05), to: o(711.7, false), lufs: -38, src: -9.9, fadeIn: 1.0, fadeOut: 0.6, skip: 99 },
  { file: "m9_verdict_vapor.mp3", from: o(711.7), to: o(752.7, false), lufs: -36, src: -8.6, fadeIn: 1.0, fadeOut: 0.6, skip: 0 },
  { file: "m9_verdict_vapor.mp3", from: o(752.7), to: o(778.4, false), lufs: -36, src: -8.6, fadeIn: 1.0, fadeOut: 0.6, skip: 41 },
  { file: "m5_kling_secure.mp3", from: o(778.4), to: FULL_END, lufs: -35, src: -14.5, fadeIn: 1.0, fadeOut: 2.0, skip: 0 },
];
const MIX: MixEvent[] = [
  { k: "dip", from: o(35.1), to: o(43.9), db: 3 },
  { k: "dip", from: o(69.98), to: o(77.3), db: 3 },
  { k: "dip", from: o(542.2), to: o(560.2), db: 3 }, // les conditions de l'essai
];
const MusicTrack: React.FC = () => (
  <>
    {PARTS.map((p) => {
      const g = Math.pow(10, (p.lufs - p.src) / 20);
      return (
        <Sequence key={`${p.file}-${p.from}`} from={f(p.from)} durationInFrames={Math.max(1, f(p.to - p.from))}>
          <Audio src={staticFile(`${M}/${p.file}`)} trimBefore={f(p.skip)} volume={(fr) => { const t = p.from + fr / 30; return g * interpolate(t, [p.from, p.from + p.fadeIn, p.to - p.fadeOut, p.to], [0, 1, 1, 0], clamp) * mixGain(t, MIX); }} />
        </Sequence>
      );
    })}
  </>
);

// ─── Les insertions (temps de sortie) ───
const CLIP_VOL = 1.0;
const OpenShorts: React.FC = () => (
  <>
    {[SHORTS.s1, SHORTS.s2, SHORTS.h1].map((s, i) => (
      <Sequence key={i} from={f(i * OPEN_EACH)} durationInFrames={f(OPEN_EACH)}>
        <ShortInsert s={s} end={OPEN_EACH} volume={CLIP_VOL} caption={i === 0 ? "Ce n'est pas moi : c'est *mon double IA*" : undefined} captionAt={0.2} />
      </Sequence>
    ))}
  </>
);
const REEL2: ShortFile = { src: "reels/reel2.mp4", dur: REEL2_LEN, label: "Reel de référence" };

export const GenjutsuFull: React.FC = () => (
  <AbsoluteFill style={{ background: "black" }}>
    <Sequence from={0} durationInFrames={FI[0].len}>
      <OpenShorts />
    </Sequence>
    {PIECES.map((p) => (
      <Sequence key={p.src} from={p.out} durationInFrames={p.len}>
        <Sequence from={-p.src} layout="none">
          <Body />
        </Sequence>
      </Sequence>
    ))}
    <Sequence from={insOut(1)} durationInFrames={FI[1].len}>
      <ShortInsert s={REEL2} end={REEL2_LEN} volume={0.9} eyebrow="La référence · @firsttimeonearth0" caption="*8,7 M* de vues" captionAt={0.3} />
    </Sequence>
    <Sequence from={insOut(2)} durationInFrames={FI[2].len}>
      <ShortInsert s={SHORTS.s1} end={SHORTS.s1.dur} volume={CLIP_VOL} eyebrow="Short 1 · référence 8,7 M · ma photo · mon script" caption="Ce n'est pas moi : c'est *mon double IA*" />
    </Sequence>
    <Sequence from={insOut(3)} durationInFrames={FI[3].len}>
      <ShortInsert s={SHORTS.s2} end={SHORTS.s2.dur} volume={CLIP_VOL} eyebrow="Short 2 · même référence · personnage, voix et script par Claude" caption="Un influenceur IA qui *n'existe pas*" />
    </Sequence>
    <Sequence from={insOut(4)} durationInFrames={FI[4].len}>
      <HooksInsert end={3 * HOOK_EACH} hooks={[SHORTS.h1, SHORTS.h2, SHORTS.h3]} each={HOOK_EACH} />
    </Sequence>
    <Sequence from={insOut(5)} durationInFrames={FI[5].len}>
      <ShortInsert s={SHORTS.fix} end={SHORTS.fix.dur} volume={CLIP_VOL} eyebrow="Short 2 corrigé" caption="Une voix *plus calme*, sans la dernière phrase" />
    </Sequence>
    <MusicTrack />
    <Grain />
  </AbsoluteFill>
);
