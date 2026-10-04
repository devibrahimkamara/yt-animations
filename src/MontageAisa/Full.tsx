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
  ChapterPill,
} from "../montage/lib";
import { BrandTiles, CheckCard, GoogleToAI, IconRow, NoteCard, PromptCard, Spotlight, StepLT, Teaser, TopPill } from "../montage/Explainers";
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


// ═══ Bloc 2 · étape 2 « Les outils » (4:06 → 9:04,6) ═════════════════════════
// Avant le carton (312,11 s) : source = T − 6,79 ; après : source = T − 8,79.
const B2 = B1_END; // 246,0
const CARD2 = 312.11;
const B2_END = 544.57;
const SRC2 = 8.79;
const s2 = (T: number) => T - (CARD2 + 2.0); // temps relatif à la couche écran après le carton
// Plans AIsa (valeurs de l'écran) : cartes en pixels de la capture. Caméra fixe z 1,3 ; centre réel (1078, 469)
// = (1104, 377) ramené dans la fenêtre par le blocage de bord de ScreenStage.
const PLAN_VIEW = { z: 1.3, cx: 1078, cy: 469 };
const toScreen = (x: number, y: number, w: number, h: number) => ({
  x: 960 + (x - PLAN_VIEW.cx) * PLAN_VIEW.z,
  y: 540 + (y - PLAN_VIEW.cy) * PLAN_VIEW.z,
  w: w * PLAN_VIEW.z,
  h: h * PLAN_VIEW.z,
});

const Block2: React.FC = () => (
  <AbsoluteFill>
    {/* Avant le carton : face cam (outils cités), puis le site AIsa */}
    <At from={285.5} to={CARD2}>
      <ScreenStage
        src={SCREEN}
        trimBefore={285.5 - SRC}
        keys={[
          { t: 0, z: 0.64, cx: 960, cy: 540 },
          { t: 1.8, z: 0.64, cx: 960, cy: 540 },
          { t: 4.5, z: 0.92, cx: 960, cy: 520 },
        ]}
        tilt={[
          { t: 0, rx: 5, ry: -9 },
          { t: 1.8, rx: 5, ry: -9 },
          { t: 4.0, rx: 0, ry: 0 },
        ]}
      />
    </At>
    <At from={B2} to={CARD2}>
      <FacePip
        src={FACE}
        trimBefore={B2 - SRC}
        face={FACE_POS}
        keys={[
          { t: 0, p: 0 },
          { t: 286.4 - B2, p: 0 },
          { t: 287.3 - B2, p: 1 },
        ]}
        zoomKeys={[
          { t: 0, z: 1.05 },
          { t: 262 - B2, z: 1.0 },
          { t: 286 - B2, z: 1.04 },
        ]}
      />
    </At>
    {/* « DataForSEO… SEMrush… Ahrefs, Similarweb » */}
    <At from={265.3} to={280.5}>
      <BrandTiles
        end={280.5 - 265.3}
        title="Les sources de données"
        brands={[
          { name: "DataForSEO", color: "#4F8BF7", at: 265.83 - 265.3 },
          { name: "Semrush", color: "#FF642D", at: 271.15 - 265.3 },
          { name: "Ahrefs", color: "#FF8A00", at: 273.31 - 265.3 },
          { name: "Similarweb", color: "#2E7CF6", at: 274.15 - 265.3 },
        ]}
      />
    </At>
    <At from={288.6} to={296.6}>
      <TopPill text="*AIsa* : tous ces outils, un seul accès" end={296.6 - 288.6} />
    </At>

    {/* Après le carton : la démo (écran + médaillon), données perso floutées */}
    <At from={CARD2 + 2.0} to={B2_END}>
      <ScreenStage
        src={SCREEN}
        trimBefore={CARD2 + 2.0 - SRC2}
        keys={[
          { t: 0, z: 0.92, cx: 960, cy: 540 },
          { t: s2(335.0), z: 0.92, cx: 960, cy: 540 },
          { t: s2(337.0), z: 1.0, cx: 960, cy: 470 },
          { t: s2(343.6), z: 1.0, cx: 960, cy: 470 },
          { t: s2(345.6), ...PLAN_VIEW },
          { t: s2(363.0), ...PLAN_VIEW },
          { t: s2(364.8), z: 0.92, cx: 960, cy: 540 },
          { t: s2(532.4), z: 0.92, cx: 960, cy: 540 },
          { t: s2(534.4), z: 1.45, cx: 1150, cy: 790 },
        ]}
        masks={[
          { from: s2(333.5), to: s2(376.5), x: 100, y: 940, w: 310, h: 85 }, // e-mail (bas de la barre AIsa)
          { from: s2(415.5), to: s2(B2_END + 1), x: 100, y: 270, w: 405, h: 755 }, // historique Claude Code
          { from: s2(415.5), to: s2(491.0), x: 690, y: 232, w: 935, h: 165 }, // sessions récentes
          { from: s2(431.4), to: s2(440.9), x: 425, y: 95, w: 1075, h: 680 }, // fenêtre Finder
        ]}
      />
    </At>
    <At from={CARD2 + 2.0} to={B2_END}>
      <FacePip src={FACE} trimBefore={CARD2 + 2.0 - SRC2} face={FACE_POS} keys={[{ t: 0, p: 1 }]} />
    </At>

    {/* Sous-étapes */}
    <At from={316.6} to={322.0}>
      <StepLT n={1} text="Créer ton compte *AIsa*" end={322.0 - 316.6} />
    </At>
    <At from={343.0} to={347.6}>
      <StepLT n={2} text="Choisir un plan" end={347.6 - 343.0} />
    </At>
    {/* Les 3 plans (valeurs de l'écran) */}
    <At from={346.2} to={358.0}>
      <Spotlight {...toScreen(422, 259, 438, 236)} caption="Sans abonnement" end={358.0 - 346.2} />
    </At>
    <At from={358.2} to={360.2}>
      <Spotlight {...toScreen(883, 259, 442, 236)} caption="39 $/mois" end={360.2 - 358.2} />
    </At>
    <At from={360.3} to={362.9}>
      <Spotlight {...toScreen(1344, 259, 442, 236)} caption="200 $/mois" end={362.9 - 360.3} />
    </At>
    <At from={370.4} to={375.6}>
      <StepLT n={3} text="Ajouter des crédits" end={375.6 - 370.4} />
    </At>
    <At from={381.4} to={387.6}>
      <StepLT n={4} text="Installer *Claude Code* (version desktop)" end={387.6 - 381.4} />
    </At>
    <At from={429.5} to={435.2}>
      <StepLT n={5} text="Créer le dossier du projet" end={435.2 - 429.5} />
    </At>
    <At from={455.0} to={460.0}>
      <TopPill icon="tip" text="1 dossier par *projet*" end={460.0 - 455.0} />
    </At>
    <At from={460.0} to={465.4}>
      <StepLT n={6} text="Connecter *AIsa* à Claude Code" end={465.4 - 460.0} />
    </At>
    <At from={462.2} to={471.2}>
      <PromptCard
        end={471.2 - 462.2}
        parts={[
          { text: "Lis https://aisa.one/docs/agent-quickstart.md", label: "Lis la documentation AIsa", at: 464.45 - 462.2 },
          { text: " et " },
          { text: "connecte AIsa à Claude Code.", label: "Connecte AIsa à Claude Code", at: 468.51 - 462.2 },
        ]}
      />
    </At>
    <At from={473.6} to={487.0}>
      <SettingsPills
        end={487.0 - 473.6}
        items={[
          { k: "Modèle", v: "Sonnet 5", at: 0.05 },
          { k: "Effort", v: "Medium", at: 481.73 - 473.6 },
          { k: "Mode", v: "Accept edits", at: 485.29 - 473.6 },
        ]}
      />
    </At>
    <At from={539.7} to={B2_END}>
      <CheckCard text="*AIsa* connecté" end={B2_END - 539.7} />
    </At>

    {/* Pastille de chapitre permanente (masquée par le carton) */}
    <At from={244.6} to={B2_END}>
      <ChapterPill n={2} total={5} title="Les outils" end={B2_END - 244.6} />
    </At>
    <At from={CARD2} to={CARD2 + 2.0}>
      <ChapterCard n={2} total={5} title="Préparer *les outils*" end={2.0} />
    </At>
  </AbsoluteFill>
);

const SettingsPills: React.FC<{ items: { k: string; v: string; at: number }[]; end: number }> = ({ items, end }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.01, 0.4);
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 90, opacity: o }}>
      <div style={{ display: "flex", gap: 20 }}>
        {items.map((it) => (
          <div key={it.k} style={blurIn(t, it.at, 0.4, -16)}>
            <Pill size={44} style={{ background: "linear-gradient(180deg, rgba(18,22,15,0.94), rgba(18,22,15,0.88))" }}>
              <span style={{ color: "#9ba394" }}>{it.k} :</span> {rich(`*${it.v}*`)}
            </Pill>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

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


const SFX_B2: SfxCue[] = [
  { k: "popNotif03", at: 244.7, gain: 0.4 },
  { k: "popSelectA", at: 265.83 },
  { k: "popSelectB", at: 271.15 },
  { k: "popSelectA", at: 273.31, gain: 0.6 },
  { k: "popSelectB", at: 274.15, gain: 0.6 },
  { k: "whoosh02", at: 286.5, gain: 0.7 },
  { k: "popNotif12", at: 288.7 },
  { k: "whoosh05", at: 312.15 },
  { k: "impactHitLow", at: 312.55, gain: 0.35 },
  { k: "confirmNotif13", at: 313.3, gain: 0.6 },
  { k: "popNotif02", at: 316.7, gain: 0.6 },
  { k: "popNotif02", at: 343.1, gain: 0.6 },
  { k: "clickA", at: 346.25 },
  { k: "clickA", at: 358.25 },
  { k: "clickA", at: 360.35 },
  { k: "popNotif02", at: 370.5, gain: 0.6 },
  { k: "popNotif02", at: 381.5, gain: 0.6 },
  { k: "popNotif02", at: 429.6, gain: 0.6 },
  { k: "popNotif12", at: 455.1, gain: 0.7 },
  { k: "popNotif02", at: 460.1, gain: 0.6 },
  { k: "whoosh03", at: 462.3, gain: 0.6 },
  { k: "popSelectA", at: 464.5 },
  { k: "popSelectB", at: 468.55 },
  { k: "clickKey", at: 473.7 },
  { k: "clickKey", at: 481.75 },
  { k: "clickKey", at: 485.3 },
  { k: "confirmAchievement", at: 540.2, gain: 0.8 },
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
    <Block2 />
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
    <MusicTrack k="preuve" from={104.0} to={314.0} level={(T) => interpolate(T, [104.0, 105.3, 106.8, 107.6, 312.0, 313.8], [0, 1.3, 1.3, 1, 1, 0], clamp)} />
    <MusicTrack k="outils" from={312.1} to={B2_END} level={(T) => interpolate(T, [312.1, 312.9, 314.1, 315.0], [0, 1.3, 1.3, 1], clamp)} />
    <SfxTrack cues={SFX_B1} />
    <SfxTrack cues={SFX_B2} />
  </AbsoluteFill>
);
