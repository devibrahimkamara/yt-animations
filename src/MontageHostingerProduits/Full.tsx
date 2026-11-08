// Montage « Hostinger Produits Digitaux » (e-book créé avec Claude, page de vente Hostinger ; sponsor : Hostinger, code KAMARA7).
// Timeline = la vidéo d'Ibrahim telle que tournée (aucune coupe, aucun ajout). Temps = temps source (s).
// Plan validé : montages/hostinger-produits/04-plan.md. Illustrations = captures réelles du 11/10/2026 + le vrai PDF.
import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile } from "remotion";
import { f, FacePip, FocusVeil, Grain, KeyLine, ScreenStage, SFX_KIT, SfxTrack, type SfxCue } from "../montage/lib";
import { PromptCard, Spotlight, StepLT } from "../montage/Explainers";
import { FlowLine, ScreenTag, TopTag } from "../MontageHiggsInflu3/Illus";
import { mixGain, type MixEvent } from "../montage/mix";
import { AdPlatforms, CAP, UpdateFlowInsert, ChatBubble, EcommerceInsert, NextVideoCard, SlowGrowth, TrafficDuo, LpWindow, SelectEditInsert, CheckStack, CodeCard, CornerPill, CpmDuo, SideStat, SponsorTag, D, EbookReveal, FormatTrio, GlassList, HeroLine, IdeaCards, LogoDuo, MarketShot, NameTag, PdfPages, ProofOpen, StepCard3, TiltShot, TUTO, TutoMap3, TwoCards } from "./Illus";

// Montage de la timeline (retours de Hostinger, 11/10/2026) : segments source gardés + une séquence sans voix insérée avant chacun.
// Coupe 300,9 → 396,75 : la présentation de l'ancienne offre (Unlimited, 53 € / 47,83 €), qui contredit le nouveau parcours e-commerce.
const SRC_END = 935.728;
const D_MAJ = 12.0; // « Mise à jour Hostinger » : le nouveau parcours (Pack Growth + créateur IA, KAMARA7)
const D_SEL = 8.0; // « Sélectionner et modifier »
const D_ECO = 9.0; // Hostinger Ecommerce
export const KEEP: { a: number; b: number; insBefore: number }[] = [
  { a: 0, b: 300.9, insBefore: 0 },
  { a: 396.75, b: 729.95, insBefore: D_MAJ },
  { a: 729.95, b: 750.5, insBefore: D_SEL },
  { a: 750.5, b: 798.0, insBefore: D_ECO },
  // coupe 798,0 → 816,45 : « dans l'abonnement annuel, ils t'ont donné un nom de domaine gratuit… » (pas vrai avec le forfait Ecommerce)
  { a: 816.45, b: SRC_END, insBefore: 0 },
];
const START: number[] = [];
{
  let tl = 0;
  for (const k of KEEP) { tl += k.insBefore; START.push(tl); tl += k.b - k.a; }
}
/** Temps de la timeline pour un temps source s (NaN si s est dans une coupe). */
export const T = (s: number) => {
  const i = KEEP.findIndex((k, j) => s >= k.a && (s < k.b || (j === KEEP.length - 1 && s <= k.b)));
  return i < 0 ? NaN : START[i] + s - KEEP[i].a;
};
/** Pour une fin de séquence : on reste dans le segment qui se termine en s (la séquence s'arrête avant l'insertion suivante). */
const Tend = (s: number) => {
  const i = KEEP.findIndex((k) => s > k.a && s <= k.b);
  return i < 0 ? NaN : START[i] + s - KEEP[i].a;
};
const SEGS: [number, number][] = KEEP.map((k) => [k.a, k.b]);
const I0 = START[1] - D_MAJ;
const I1 = START[2] - D_SEL;
const I2 = START[3] - D_ECO;
export const FULL_DURATION = T(SRC_END);
const FACE = `${D}/face_dn.mp4`;
const FACE_POS = { x: 0.49, y: 0.3 };
const SCREEN = `${D}/screen.mp4`;
const WIN = { x: 108, y: 54, w: 1705, h: 972 };
const GRADE = "brightness(1.16) contrast(1.05) saturate(1.04)";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const At: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => (
  <Sequence from={f(from)} durationInFrames={Math.max(1, f(to) - f(from))} layout="none">
    <AbsoluteFill>{children}</AbsoluteFill>
  </Sequence>
);

/** Comme At, mais en temps source (converti par T) : pour tout ce qui suit la 1re insertion. */
const AtS: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => (Number.isFinite(T(from)) && Number.isFinite(Tend(to)) ? <At from={T(from)} to={Tend(to)}>{children}</At> : null);

// ─── Son ───
const SFX_T: SfxCue[] = [
  // Bloc H
  { k: "whoosh03", at: 1.35 }, // la couverture se pose
  { k: "popSelectA", at: 3.5 },
  { k: "popSelectB", at: 8.25 },
  { k: "popSelectA", at: 9.3 },
  { k: "impactDeep", at: 13.2, gain: 0.5 }, // « plusieurs milliers d'euros »
  { k: "popSelectB", at: 14.7 },
  { k: "whoosh02", at: 17.3 },
  { k: "popNotif02", at: 25.4, gain: 0.6 },
  { k: "popSelectA", at: 34.9 },
  { k: "popSelectB", at: 37.9 },
  { k: "whoosh03", at: 42.5 },
  { k: "popSelectA", at: 44.5 },
  { k: "whoosh01", at: 50.5 },
  { k: "popSelectB", at: 52.3 },
  { k: "popSelectA", at: 58.4 },
  { k: "popSelectB", at: 64.3 },
  { k: "impactHitLow", at: 66.6, gain: 0.45 }, // « tu ne le fais jamais »
  { k: "whoosh02", at: 69.9 },
  { k: "popSelectA", at: 70.4 },
  { k: "popSelectB", at: 70.9 },
  { k: "popSelectA", at: 71.4 },
  { k: "confirmAlert03", at: 73.1, gain: 0.5 }, // bloc ① allumé
  { k: "popSelectB", at: 78.95 },
  { k: "whoosh01", at: 80.4 }, // carton Étape 1
  // Bloc 1
  { k: "whoosh02", at: 82.95 }, // le Glissé vers Claude
  { k: "popSelectA", at: 86.9 }, // mon choix : Claude
  { k: "whoosh03", at: 91.65 }, // prompt 1
  { k: "popSelectB", at: 95.0 },
  { k: "popSelectA", at: 97.4 },
  { k: "popSelectB", at: 100.5 },
  { k: "whoosh01", at: 101.85 }, // retour face cam
  { k: "popSelectA", at: 104.6 },
  { k: "popSelectB", at: 106.4 },
  { k: "confirmAlert03", at: 108.3, gain: 0.5 }, // les e-books
  { k: "whoosh02", at: 113.05 },
  { k: "popNotif02", at: 116.8, gain: 0.5 }, // ⚠️
  { k: "whoosh03", at: 127.45 }, // les idées de Claude
  { k: "popSelectA", at: 130.3 },
  { k: "confirmAlert03", at: 137.0, gain: 0.5 }, // l'idée choisie
  { k: "whoosh01", at: 140.95 }, // l'article de blog
  { k: "whoosh02", at: 148.05 }, // prompt 2
  { k: "popSelectB", at: 148.7 },
  { k: "popSelectA", at: 152.3 },
  { k: "whoosh01", at: 162.75 }, // face cam : halluciner
  { k: "popSelectB", at: 166.5 },
  { k: "whoosh02", at: 172.45 },
  { k: "clickA", at: 174.4, gain: 0.5 }, // envoi
  { k: "popNotif03", at: 181.1, gain: 0.5 },
  { k: "riserClean", at: 191.2, gain: 0.3 },
  { k: "confirmAchievement", at: 191.25, gain: 0.5 }, // l'e-book
  { k: "whoosh03", at: 196.45 },
  { k: "popSelectA", at: 202.9 },
  { k: "popSelectB", at: 203.8 },
  { k: "whoosh01", at: 205.55 }, // face cam : vérifier
  { k: "popSelectA", at: 207.8 },
  { k: "whoosh02", at: 213.25 },
  { k: "whoosh03", at: 218.45 }, // prompt 3
  { k: "popSelectA", at: 220.9 },
  { k: "popSelectB", at: 223.6 },
  { k: "popSelectA", at: 227.6 },
  { k: "popNotif02", at: 231.4, gain: 0.5 }, // prompt en description
  { k: "whoosh02", at: 241.05 },
  { k: "impactDeep", at: 244.6, gain: 0.4 }, // « des centimes »
  { k: "popSelectB", at: 254.4 },
  { k: "clickA", at: 263.3, gain: 0.5 }, // download
  { k: "confirmAlert07", at: 264.2, gain: 0.4 },
  // Bloc 2
  { k: "whoosh01", at: 268.05 }, // carton Étape 2
  { k: "whoosh02", at: 270.9 },
  { k: "popSelectA", at: 274.0 },
  { k: "popSelectB", at: 274.8 },
  { k: "confirmAlert03", at: 278.8, gain: 0.45 }, // automatique
  { k: "whoosh03", at: 283.0 }, // retour écran : Hostinger
  { k: "popNotif02", at: 285.7, gain: 0.6 }, // partenaire
  { k: "popSelectA", at: 299.0 },
  { k: "whoosh02", at: 306.6 },
  { k: "popSelectB", at: 307.2 },
  { k: "impactDeep", at: 314.4, gain: 0.45 }, // 3,99 €
  { k: "whoosh01", at: 326.6 },
  { k: "popSelectA", at: 328.8 },
  { k: "whoosh02", at: 338.4 },
  { k: "confirmAlert03", at: 339.8, gain: 0.4 },
  { k: "confirmAlert03", at: 342.6, gain: 0.4 },
  { k: "confirmAlert03", at: 346.9, gain: 0.4 },
  { k: "clickA", at: 351.6, gain: 0.5 },
  { k: "popSelectB", at: 359.4 },
  { k: "popSelectA", at: 363.8 },
  { k: "popSelectB", at: 376.8 },
  { k: "clickA", at: 384.4, gain: 0.5 },
  { k: "whoosh03", at: 386.4 },
  { k: "confirmAlert07", at: 387.0, gain: 0.45 }, // KAMARA7
  { k: "impactDeep", at: 390.8, gain: 0.45 }, // 47,83 €
  { k: "clickA", at: 399.1, gain: 0.5 },
  { k: "popNotif03", at: 405.9, gain: 0.4 },
  { k: "clickA", at: 424.8, gain: 0.5 },
  { k: "popSelectA", at: 431.4 },
  { k: "popSelectB", at: 432.6 },
  { k: "popSelectA", at: 437.6 },
  { k: "clickA", at: 448.6, gain: 0.5 },
  { k: "popSelectB", at: 449.4 },
  { k: "confirmAlert03", at: 459.6, gain: 0.4 }, // avec l'IA
  { k: "clickA", at: 464.2, gain: 0.5 },
  { k: "whoosh01", at: 473.7 },
  { k: "popSelectB", at: 479.5 },
  { k: "whoosh02", at: 484.6 },
  { k: "popSelectA", at: 491.2 },
  { k: "whoosh03", at: 492.35 }, // prompt 4
  { k: "popSelectB", at: 495.8 },
  { k: "popSelectA", at: 497.9 },
  { k: "popNotif02", at: 500.5, gain: 0.5 },
  { k: "popSelectB", at: 513.8 },
  { k: "popNotif03", at: 526.9, gain: 0.5 }, // la limite
  { k: "whoosh01", at: 531.6 },
  { k: "confirmAlert07", at: 540.8, gain: 0.4 }, // 1 796 / 2 000
  // Bloc 3 (temps source, convertis par T)
  { k: "popNotif03", at: 543.2, gain: 0.4 },
  { k: "riserClean", at: 562.6, gain: 0.3 },
  { k: "confirmAchievement", at: 562.65, gain: 0.5 }, // la page
  { k: "popSelectA", at: 579.2 },
  { k: "popSelectB", at: 584.3 },
  { k: "popSelectA", at: 592.4 },
  { k: "popSelectB", at: 598.5 },
  { k: "popSelectA", at: 601.1 },
  { k: "whoosh01", at: 612.9 },
  { k: "popSelectA", at: 613.4 },
  { k: "popSelectB", at: 621.9 },
  { k: "impactHitLow", at: 625.9, gain: 0.35 },
  { k: "popSelectA", at: 629.0 },
  { k: "popSelectB", at: 640.5 },
  { k: "popSelectA", at: 641.4 },
  { k: "popSelectB", at: 645.0 },
  { k: "whoosh02", at: 645.85 },
  { k: "popSelectA", at: 652.1 },
  { k: "whoosh03", at: 672.65 }, // prompt de modification
  { k: "popSelectB", at: 674.0 },
  { k: "popSelectA", at: 679.7 },
  { k: "popSelectB", at: 685.0 },
  { k: "popNotif03", at: 687.0, gain: 0.4 },
  { k: "confirmAchievement", at: 707.9, gain: 0.5 }, // par Ibrahim Kamara
  { k: "popSelectB", at: 711.2 },
  { k: "popSelectA", at: 717.5 },
  { k: "popSelectB", at: 735.1 },
  { k: "popSelectA", at: 743.9 },
  { k: "popSelectB", at: 750.8 },
  // Bloc 4 (temps source)
  { k: "popSelectA", at: 757.4 },
  { k: "clickA", at: 759.6, gain: 0.5 },
  { k: "riserClean", at: 762.7, gain: 0.3 },
  { k: "confirmAchievement", at: 762.75, gain: 0.5 }, // site publié
  { k: "popSelectB", at: 764.9 },
  { k: "popSelectA", at: 773.1 },
  { k: "popSelectB", at: 781.4 },
  { k: "popSelectA", at: 786.7 },
  { k: "popSelectB", at: 792.3 },
  { k: "popSelectA", at: 801.4 },
  { k: "popSelectB", at: 813.1 },
  { k: "confirmAlert03", at: 822.2, gain: 0.4 },
  { k: "whoosh01", at: 825.15 },
  { k: "popSelectA", at: 825.7 },
  { k: "impactDeep", at: 843.2, gain: 0.4 }, // « trouver des gens qui vont acheter »
  { k: "whoosh01", at: 844.85 }, // carton Étape 3
  { k: "popSelectA", at: 847.4 },
  { k: "popSelectB", at: 850.4 },
  { k: "whoosh03", at: 860.05 },
  { k: "popSelectA", at: 864.9 },
  { k: "whoosh02", at: 872.05 },
  { k: "popSelectB", at: 875.8 },
  { k: "popSelectA", at: 879.9 },
  { k: "whoosh03", at: 885.85 },
  { k: "confirmAlert03", at: 891.6, gain: 0.45 },
  { k: "popSelectB", at: 899.8 },
  { k: "whoosh02", at: 901.65 },
  { k: "popSelectA", at: 902.6 },
  { k: "popSelectB", at: 903.7 },
  { k: "confirmAlert03", at: 907.2, gain: 0.45 },
  { k: "popSelectA", at: 914.2 },
  { k: "whoosh03", at: 917.45 },
  { k: "popNotif02", at: 926.8, gain: 0.6 },
  { k: "popNotif02", at: 929.2, gain: 0.5 },
];
// Retour Higgs Influ 2 : effets −4,5 dB partout, −7,5 dB dans le hook
// Sons des séquences insérées (temps de la timeline)
const SFX_INS: SfxCue[] = [
  { k: "whoosh02", at: I0 + 0.15 }, // « Mise à jour Hostinger »
  { k: "popSelectA", at: I0 + 0.7 },
  { k: "popSelectB", at: I0 + 2.0 },
  { k: "popSelectA", at: I0 + 2.8 },
  { k: "popSelectB", at: I0 + 3.6 },
  { k: "popSelectA", at: I0 + 4.4 },
  { k: "confirmAlert03", at: I0 + 5.45, gain: 0.45 },
  { k: "whoosh03", at: I1 + 0.15 },
  { k: "clickA", at: I1 + 1.6, gain: 0.5 },
  { k: "confirmAlert03", at: I1 + 1.75, gain: 0.45 },
  { k: "clickA", at: I1 + 3.45, gain: 0.5 },
  { k: "clickKey", at: I1 + 3.9, gain: 0.4 },
  { k: "clickKey", at: I1 + 4.35, gain: 0.4 },
  { k: "clickKey", at: I1 + 4.8, gain: 0.4 },
  { k: "clickKey", at: I1 + 5.25, gain: 0.4 },
  { k: "confirmAchievement", at: I1 + 5.75, gain: 0.45 },
  { k: "whoosh02", at: I2 + 0.15 },
  { k: "popSelectA", at: I2 + 0.75 },
  { k: "confirmAlert03", at: I2 + 2.0, gain: 0.45 },
  { k: "popSelectB", at: I2 + 2.8 },
  { k: "popSelectA", at: I2 + 3.9 },
  { k: "popSelectB", at: I2 + 5.0 },
  { k: "popSelectA", at: I2 + 6.1 },
];
const SFX: SfxCue[] = [...SFX_T.map((c) => ({ ...c, at: T(c.at) })).filter((c) => Number.isFinite(c.at)), ...SFX_INS].map((c) => ({ ...c, gain: (c.gain ?? SFX_KIT[c.k].gain) * (c.at < 20 ? 0.42 : 0.6) }));

// Musique par partie (04-identite-sonore.md) ; lufs = cible du lit de musique (voix à −16), src = LUFS mesuré du fichier HQ
const PARTS = [
  { file: "m0_ghosting.mp3", from: 3.2, to: 80.4, lufs: -31, src: -12.1, fadeIn: 1.2, fadeOut: 1.4, skip: 0 },
  { file: "m1_neon_noir.mp3", from: 81.2, to: 268.2, lufs: -32, src: -10.1, fadeIn: 1.5, fadeOut: 1.5, skip: 0 },
  // m2 (3:36) : fondu enchaîné sur lui-même (temps de la timeline, via T)
  { file: "m2_miles.mp3", from: 269.6, to: T(440.0), lufs: -32, src: -9.5, fadeIn: 1.5, fadeOut: 3.0, skip: 0 },
  { file: "m2_miles.mp3", from: T(437.0), to: T(563.0), lufs: -32, src: -9.5, fadeIn: 3.0, fadeOut: 1.5, skip: 24 },
  // m3 (3:25) plus court que sa partie : fondu enchaîné sur lui-même pendant la 1re insertion (temps de la timeline)
  { file: "m3_autophagy.mp3", from: T(563.8), to: I1 + 5.05, lufs: -32, src: -9.5, fadeIn: 1.2, fadeOut: 3.0, skip: 0 },
  { file: "m3_autophagy.mp3", from: I1 + 2.05, to: T(837.2), lufs: -32, src: -9.5, fadeIn: 3.0, fadeOut: 0.45, skip: 40 }, // coupée net sur « c'est là que ça devient difficile »
  { file: "m4_cold_conclusion.mp3", from: T(844.6), to: T(SRC_END), lufs: -32, src: -17.1, fadeIn: 1.2, fadeOut: 1.0, skip: 0 },
];
const MIX_SRC: MixEvent[] = [
  { k: "stop", at: 13.05, back: 14.4, fadeOut: 0.12, fadeIn: 0.8 }, // « plusieurs milliers d'euros » : silence + impact
  { k: "dip", from: 14.4, to: 16.9, db: 4 }, // « Par où est-ce que je vais commencer ? »
  { k: "dip", from: 25.2, to: 37.5, db: 2 }, // présentation : la voix devant
  { k: "stop", at: 66.3, back: 67.2, fadeOut: 0.12, fadeIn: 0.8 }, // « tu ne le fais jamais »
  // Bloc 1
  { k: "dip", from: 116.6, to: 123.0, db: 4 }, // « la première étape qu'il ne faut pas négliger »
  { k: "dip", from: 162.7, to: 172.4, db: 4 }, // « l'IA a tendance à halluciner »
  { k: "stop", at: 189.45, back: 191.2, fadeOut: 0.12, fadeIn: 0.6 }, // l'e-book : silence
  { k: "swell", from: 191.2, to: 195.5, db: 3 },
  { k: "dip", from: 205.5, to: 212.9, db: 3 }, // « tu veux vérifier les informations »
  { k: "dip", from: 241.0, to: 258.7, db: 2 }, // les chiffres
  // Bloc 2
  { k: "dip", from: 285.5, to: 291.5, db: 3 }, // le partenaire : bien audible
  { k: "stop", at: 314.1, back: 315.4, fadeOut: 0.12, fadeIn: 0.8 }, // « 3,99 € par mois »
  { k: "dip", from: 353.6, to: 356.0, db: 3 }, // « très important, il faut suivre les étapes »
  { k: "dip", from: 384.0, to: 390.5, db: 3 }, // le code promo
  { k: "stop", at: 390.65, back: 392.0, fadeOut: 0.12, fadeIn: 0.8 }, // 47,83 €
  { k: "dip", from: 412.0, to: 484.0, db: 3 }, // parcours de création (manipulation dense)
  { k: "dip", from: 524.9, to: 536.4, db: 3 }, // le problème des 2 000 caractères
  // Bloc 3 (temps source)
  { k: "swell", from: 549.0, to: 561.5, db: 3 }, // la génération
  { k: "stop", at: 562.5, back: 563.8, fadeOut: 0.12, fadeIn: 0.6 }, // la page : silence
  { k: "swell", from: 563.8, to: 567.5, db: 3 },
  { k: "dip", from: 578.6, to: 588.0, db: 2 }, // le prix
  { k: "dip", from: 612.9, to: 645.8, db: 3 }, // se mettre en avant (face cam)
  { k: "dip", from: 668.0, to: 686.6, db: 3 }, // le prompt de modification
  { k: "stop", at: 707.7, back: 709.0, fadeOut: 0.12, fadeIn: 0.6 }, // « par Ibrahim Kamara »
  // Bloc 4 (temps source)
  { k: "stop", at: 762.55, back: 764.0, fadeOut: 0.12, fadeIn: 0.6 }, // site publié
  { k: "swell", from: 764.0, to: 767.0, db: 3 },
  { k: "dip", from: 803.6, to: 812.6, db: 2 }, // le domaine offert
  { k: "swell", from: 885.8, to: 891.6, db: 3 }, // « la publicité payante »
];
const mapEv = (e: MixEvent): MixEvent => Object.fromEntries(Object.entries(e).map(([k, v]) => [k, ["from", "to", "at", "back"].includes(k) ? T(v as number) : v])) as MixEvent;
const MIX: MixEvent[] = [
  ...MIX_SRC.map(mapEv).filter((e) => Object.values(e).every((v) => typeof v !== "number" || Number.isFinite(v))),
  { k: "swell", from: I0 + 0.3, to: I0 + D_MAJ - 0.4, db: 4 }, // séquence « Mise à jour Hostinger » (sans voix)
  { k: "swell", from: I1 + 0.3, to: I1 + 7.6, db: 4 }, // séquence « Sélectionner et modifier » (sans voix)
  { k: "swell", from: I2 + 0.3, to: I2 + 8.6, db: 4 }, // séquence Hostinger Ecommerce (sans voix)
];
const MusicTrack: React.FC = () => (
  <>
    {PARTS.map((p) => {
      const g = Math.pow(10, (p.lufs - p.src) / 20);
      return (
        <Sequence key={p.file + p.from} from={f(p.from)} durationInFrames={f(p.to - p.from)}>
          <Audio src={staticFile(`epidemic/hostinger-produits/hq/${p.file}`)} trimBefore={f(p.skip)} volume={(fr) => { const t = p.from + fr / 30; return g * interpolate(t, [p.from, p.from + p.fadeIn, p.to - p.fadeOut, p.to], [0, 1, 1, 0], clamp) * mixGain(t, MIX); }} />
        </Sequence>
      );
    })}
  </>
);

// Face cam : « Le Glissé » (p = 0 plein cadre, 1 médaillon) et zooms, en temps source
const FACE_KEYS = [{ t: 0, p: 0 }, { t: 82.8, p: 0 }, { t: 83.8, p: 1 }, { t: 101.8, p: 1 }, { t: 102.5, p: 0 }, { t: 113.0, p: 0 }, { t: 113.8, p: 1 }, { t: 162.5, p: 1 }, { t: 163.1, p: 0 }, { t: 172.3, p: 0 }, { t: 173.0, p: 1 }, { t: 205.3, p: 1 }, { t: 205.9, p: 0 }, { t: 213.0, p: 0 }, { t: 213.7, p: 1 }, { t: 270.3, p: 1 }, { t: 270.9, p: 0 }, { t: 282.5, p: 0 }, { t: 283.4, p: 1 }, { t: 326.0, p: 1 }, { t: 326.6, p: 0 }, { t: 338.3, p: 0 }, { t: 339.0, p: 1 }, { t: 484.0, p: 1 }, { t: 484.6, p: 0 }, { t: 492.0, p: 0 }, { t: 492.6, p: 1 }, { t: 612.3, p: 1 }, { t: 612.9, p: 0 }, { t: 645.8, p: 0 }, { t: 646.5, p: 1 }, { t: 824.6, p: 1 }, { t: 825.3, p: 0 }];
const FACE_ZOOM = [{ t: 0, z: 1.0 }, { t: 3.3, z: 1.0 }, { t: 6.8, z: 1.04 }, { t: 14.3, z: 1.04 }, { t: 14.5, z: 1.09 }, { t: 17.0, z: 1.09 }, { t: 25.2, z: 1.0 }, { t: 37.5, z: 1.04 }, { t: 42.4, z: 1.06 }, { t: 56.4, z: 1.0 }, { t: 58.2, z: 1.05 }, { t: 67.1, z: 1.0 }, { t: 77.0, z: 1.0 }, { t: 80.3, z: 1.07 }, { t: 82.8, z: 1.0 }, { t: 102.4, z: 1.0 }, { t: 113.0, z: 1.05 }, { t: 162.7, z: 1.05 }, { t: 172.4, z: 1.0 }, { t: 205.5, z: 1.0 }, { t: 213.2, z: 1.06 }, { t: 270.9, z: 1.0 }, { t: 282.4, z: 1.05 }, { t: 326.6, z: 1.0 }, { t: 338.3, z: 1.05 }, { t: 484.5, z: 1.0 }, { t: 492.0, z: 1.05 }, { t: 612.9, z: 1.0 }, { t: 645.8, z: 1.04 }, { t: 825.1, z: 1.0 }, { t: 836.8, z: 1.06 }, { t: 847.3, z: 1.0 }, { t: 872.0, z: 1.05 }, { t: 885.8, z: 1.0 }, { t: 897.3, z: 1.06 }, { t: 914.1, z: 1.0 }, { t: 929.1, z: 1.05 }];

// ══ BLOC H (0:00 → 1:20) : hook, les 2 blocages, la Carte du tuto ══
const BlocH: React.FC = () => (
  <>
    {/* 0 → 3,2 : la preuve d'abord — la page de vente publiée, puis le vrai e-book */}
    <At from={0} to={3.25}>
      <ProofOpen end={3.25} coverAt={1.1} />
    </At>
    {/* 3,3 → 6,7 : « en 2021… pas d'IA, pas de ChatGPT » */}
    <At from={3.3} to={6.7}>
      <KeyLine end={3.4} size={110} words={[{ w: "2021", t: 0.0 }, { w: "·", t: 0.1 }, { w: "zéro", t: 2.1, hl: true }, { w: "IA", t: 2.16 }]} />
    </At>
    {/* 6,8 → 10,6 : ce qu'il fallait faire à la main */}
    <At from={6.8} to={10.65}>
      <GlassList end={3.85} title="En 2021, il fallait…" titleAt={0.1} items={[{ text: "Écrire les scripts", at: 1.45 }, { text: "Filmer", at: 2.4 }, { text: "Monter", at: 3.1 }]} />
    </At>
    {/* 10,7 → 14,3 : le résultat du premier produit (capture à fournir ; texte en attendant) */}
    <At from={10.7} to={14.35}>
      <FocusVeil start={0} end={3.65} dark={0.7} />
      <HeroLine end={3.65} eyebrow="Mon 1er produit digital" text="plusieurs milliers d'€" textAt={2.4} size={140} />
    </At>
    {/* 14,4 → 17,0 : la question */}
    <At from={14.4} to={17.05}>
      <KeyLine end={2.65} size={104} words={[{ w: "Par", t: 0.0 }, { w: "où", t: 0.12 }, { w: "commencer", t: 0.64, hl: true }, { w: "?", t: 0.7 }]} />
    </At>
    {/* 17,1 → 25,1 : la promesse, phrase-thèse sur face cam floutée */}
    <At from={17.1} to={25.15}>
      <FocusVeil start={0} end={8.05} />
      <KeyLine end={8.05} valign="center" size={120} words={[{ w: "Ton", t: 4.9 }, { w: "premier", t: 5.2 }, { w: "produit", t: 5.6 }, { w: "digital,", t: 6.05 }, { w: "avec l'IA", t: 7.25, hl: true }]} />
    </At>
    {/* 25,2 → 30,0 : présentation */}
    <At from={25.4} to={30.4}>
      <NameTag name="Ibrahim Kamara" meta="Sur YouTube depuis *2020*" end={5.0} />
    </At>
    <At from={34.7} to={37.5}>
      <CornerPill text="S'abonner 🔔" end={2.8} />
    </At>
    {/* 37,6 → 42,4 : ce qui bloque tout le monde */}
    <At from={37.7} to={42.45}>
      <KeyLine end={4.75} size={100} words={[{ w: "Ce", t: 0.0 }, { w: "qui", t: 0.08 }, { w: "bloque", t: 0.8 }, { w: "tout le monde", t: 1.2, hl: true }]} />
    </At>
    {/* 42,5 → 50,3 : blocage 1, avec les vrais prix d'un prestataire */}
    <At from={42.5} to={50.35}>
      <MarketShot src={`${CAP}/comeup_ebook.png`} end={7.85} label="① Créer le *produit*" labelAt={0.1} markAt={3.6} />
    </At>
    {/* 50,4 → 56,3 : blocage 2 */}
    <At from={50.4} to={56.35}>
      <MarketShot src={`${CAP}/comeup_page.png`} end={5.95} label="② Créer la page de *vente*" labelAt={0.1} markAt={2.6} />
    </At>
    {/* 58,3 → 67,0 : payer quelqu'un, ou le faire seul… jamais */}
    <At from={58.3} to={67.05}>
      <TwoCards end={8.75} left={{ title: "Payer un prestataire", meta: "€€€", at: 0.6 }} right={{ title: "Tout faire seul", meta: "→ *jamais*", at: 5.95 }} strikeAt={8.3} />
    </At>
    {/* 67,1 → 76,9 : la Carte du tuto (« l'IA et deux outils ») */}
    <At from={67.1} to={76.95}>
      <FocusVeil start={0} end={9.85} dark={0.74} />
      <TutoMap3 end={9.85} steps={TUTO.map((s, i) => ({ ...s, at: [3.05, 3.25, 4.95][i] }))} active={undefined} eyebrowAt={2.9} />
    </At>
    <At from={72.8} to={76.95}>
      <FocusVeil start={0} end={4.15} dark={0.74} />
      <TutoMap3 end={4.15} steps={TUTO.map((s) => ({ ...s, at: 0 }))} active={0} eyebrow="Étape 1 · le produit" eyebrowAt={0.1} />
    </At>
    {/* 77,0 → 79,9 : des heures → des minutes */}
    <At from={77.0} to={80.4}>
      <KeyLine end={3.4} size={104} words={[{ w: "Des", t: 1.25 }, { w: "heures", t: 1.45 }, { w: "→", t: 1.75 }, { w: "des", t: 1.95 }, { w: "minutes", t: 2.15, hl: true }]} />
    </At>
    {/* 80,3 → 82,8 : carton Étape 1 (« On va aller sur Claude ») */}
    <At from={80.3} to={82.8}>
      <StepCard3 n={1} title="Créer le *produit*" end={2.5} done={0} />
    </At>
  </>
);


// ══ BLOC 1 (1:22,8 → 4:28) : Étape 1, l'e-book avec Claude ══
const DemoScreens1: React.FC = () => (
  <>
    {/* 82,8 → 86 : l'accueil de Claude (immobile) ; on part de 84,4 pour ne jamais montrer l'accueil du navigateur (favoris) */}
    <At from={82.8} to={86.0}>
      <ScreenStage src={SCREEN} trimBefore={84.4} win={WIN} tilt={[{ t: 0, rx: 4, ry: 7 }, { t: 0.4, rx: 4, ry: 7 }, { t: 2.0, rx: 0, ry: 0 }]} keys={[{ t: 0, z: 1.0, cx: 960, cy: 540 }]} />
    </At>
    <At from={86.0} to={101.9}>
      <ScreenStage src={SCREEN} trimBefore={86.0} win={WIN} keys={[{ t: 0, z: 1.0, cx: 960, cy: 540 }, { t: 1.6, z: 1.0, cx: 960, cy: 540 }, { t: 2.4, z: 1.5, cx: 960, cy: 500 }, { t: 5.4, z: 1.5, cx: 960, cy: 500 }, { t: 6.2, z: 1.35, cx: 960, cy: 330 }]} />
    </At>
    <At from={101.9} to={148.0}>
      <ScreenStage src={SCREEN} trimBefore={101.9} win={WIN} keys={[{ t: 0, z: 1.35, cx: 960, cy: 400 }, { t: 11.0, z: 1.35, cx: 960, cy: 400 }, { t: 11.8, z: 1.3, cx: 940, cy: 470 }, { t: 43.0, z: 1.3, cx: 940, cy: 470 }, { t: 43.8, z: 1.0, cx: 960, cy: 540 }]} />
    </At>
    <At from={148.0} to={189.5}>
      <ScreenStage src={SCREEN} trimBefore={148.0} win={WIN} keys={[{ t: 0, z: 1.0, cx: 960, cy: 540 }, { t: 0.6, z: 1.6, cx: 960, cy: 820 }, { t: 26.6, z: 1.6, cx: 960, cy: 820 }, { t: 27.6, z: 1.0, cx: 960, cy: 540 }, { t: 29.0, z: 1.0, cx: 960, cy: 540 }, { t: 29.8, z: 1.4, cx: 960, cy: 430 }]} />
    </At>
    <At from={189.5} to={268.3}>
      <ScreenStage src={SCREEN} trimBefore={189.5} win={WIN} keys={[{ t: 0, z: 1.0, cx: 960, cy: 540 }, { t: 23.7, z: 1.0, cx: 960, cy: 540 }, { t: 24.5, z: 1.3, cx: 1380, cy: 560 }, { t: 51.5, z: 1.3, cx: 1380, cy: 560 }, { t: 67.8, z: 1.0, cx: 960, cy: 540 }, { t: 72.8, z: 1.0, cx: 960, cy: 540 }, { t: 73.5, z: 1.8, cx: 560, cy: 690 }, { t: 74.8, z: 1.8, cx: 560, cy: 690 }, { t: 75.5, z: 1.0, cx: 960, cy: 540 }]} />
    </At>
  </>
);
const BlocB1: React.FC = () => (
  <>
    {[[83.8, 91.6], [113.0, 162.7], [172.4, 189.5], [213.2, 218.4], [232.7, 241.0], [257.4, 268.0]].map(([a, b]) => (
      <At key={a} from={a} to={b}>
        <StepLT n={1} text="Le produit · Claude" end={b - a} />
      </At>
    ))}
    {/* 82,9 → 91,5 : Claude ou ChatGPT ; mon choix */}
    <At from={82.9} to={91.5}>
      <LogoDuo end={8.6} pickAt={4.0} pickText="Mon choix : Claude · plus rapide, plus habile" />
    </At>
    {/* 91,6 → 101,8 : prompt 1 (texte de l'écran, fautes corrigées) */}
    <At from={91.6} to={101.8}>
      <PromptCard tool="Claude" end={10.2} parts={[{ text: "« J'aimerais que tu fasses " }, { text: "des recherches sur Internet", label: "Recherche web", at: 3.4 }, { text: " et que tu me donnes " }, { text: "des idées de mini produits digitaux à vendre", label: "Tâche", at: 5.8 }, { text: ", " }, { text: "idéalement des PDF e-books", label: "Format", at: 8.9 }, { text: ". Des idées pertinentes. »" }]} />
    </At>
    {/* 101,8 → 113 : face cam ; les formats, l'e-book s'allume */}
    <At from={102.4} to={113.0}>
      <FormatTrio end={10.6} items={[{ icon: "🧩", text: "Templates", at: 2.2 }, { icon: "🎬", text: "Formations vidéo", at: 4.0 }, { icon: "📘", text: "E-books", at: 5.7 }]} hlAt={5.9} line="100 % faisable *avec l'IA*" lineAt={9.1} />
    </At>
    {/* 116,7 → 123,5 : l'étape à ne pas négliger */}
    <At from={116.7} to={123.5}>
      <ScreenTag text="⚠️ Pars de ce qui se *recherche*" end={6.8} />
    </At>
    <At from={123.7} to={127.3}>
      <ScreenTag text="Claude fait les recherches *à ta place*" end={3.6} />
    </At>
    {/* 127,4 → 140,9 : les idées de Claude recréées en grand */}
    <At from={127.4} to={140.95}>
      <IdeaCards end={13.55} eyebrow="Les idées de Claude" pick={2} pickAt={9.6} ideas={[{ text: "Guide « Créer sa chaîne YouTube en français avec l'IA »", at: 2.9 }, { text: "Swipe file de scripts YouTube", at: 3.3 }, { text: "Guide « *Monétiser sa chaîne YouTube* depuis l'Afrique »", at: 3.7 }, { text: "Pack de prompts IA pour créateurs de contenu", at: 4.1 }]} />
    </At>
    {/* 140,9 → 145,4 : mon article de blog sur le sujet */}
    <At from={140.95} to={145.4}>
      <TiltShot src={`${CAP}/blog_article.png`} iw={2560} ih={1800} end={4.45} width={1000} x={780} y={110} eyebrow="ibrahimkamara.com" caption="Mon article sur le sujet · *il cartonne*" captionAt={1.3} />
    </At>
    {/* 148 → 158 : prompt 2 */}
    <At from={148.0} to={158.0}>
      <PromptCard tool="Claude" end={10.0} parts={[{ text: "« Je choisis cette idée : " }, { text: "Guide « Monétiser sa chaîne YouTube depuis l'Afrique / en francophonie »", label: "Idée", at: 0.3 }, { text: " — spécificités AdSense, sponsoring, contraintes de paiement local. " }, { text: "Crée-moi maintenant un e-book PDF pro complet", label: "Tâche", at: 0.7 }, { text: ", avec " }, { text: "des infos réelles que tu vas rechercher sur Internet", label: "Exigence", at: 4.3 }, { text: ". »" }]} />
    </At>
    {/* 162,7 → 172,4 : face cam, phrase-thèse */}
    <At from={162.7} to={172.4}>
      <FocusVeil start={0} end={9.7} />
      <KeyLine end={9.7} valign="center" size={120} words={[{ w: "Sans", t: 0.3 }, { w: "cette", t: 1.0 }, { w: "précision,", t: 1.6 }, { w: "l'IA", t: 2.1 }, { w: "invente", t: 3.8, hl: true }]} />
    </At>
    {/* 181 → 189,4 : les recherches */}
    <At from={181.0} to={189.4}>
      <ScreenTag text="⏳ Claude fait ses recherches · *Payoneer*, Wise…" end={8.4} />
    </At>
    {/* 189,5 → 196,4 : le résultat */}
    <At from={189.5} to={196.4}>
      <EbookReveal end={6.9} eyebrow="Généré par Claude" title="Ton *e-book*" titleAt={1.7} meta="24 pages · prêt à vendre" metaAt={3.0} />
    </At>
    {/* 196,4 → 205,5 : les vraies pages */}
    <At from={196.4} to={205.5}>
      <PdfPages end={9.1} eyebrow="Monétiser sa chaîne YouTube depuis l'Afrique francophone" pages={[{ page: 1, label: "Côte d'Ivoire · Sénégal · Cameroun…", at: 0.0 }, { page: 2, label: "Table des matières", at: 6.5 }, { page: 21, label: "Plan d'action 90 jours", at: 7.4 }]} />
    </At>
    {/* 205,5 → 213,2 : face cam */}
    <At from={205.5} to={213.2}>
      <KeyLine end={7.7} size={104} words={[{ w: "Toujours", t: 2.1 }, { w: "vérifier", t: 2.3, hl: true }, { w: "les", t: 2.7 }, { w: "infos", t: 2.8 }]} />
    </At>
    {/* 218,4 → 232,9 : le prompt de vérification (dit à l'oral) */}
    <At from={218.4} to={232.9}>
      <PromptCard tool="Claude · à copier" end={14.5} parts={[{ text: "« " }, { text: "Relis ce document", label: "Relecture", at: 2.5 }, { text: " et " }, { text: "compare-le aux informations disponibles sur Internet", label: "Vérification", at: 5.2 }, { text: ". " }, { text: "Rassure-moi : toutes les informations de cet e-book sont-elles réelles ?", label: "Garantie", at: 9.2 }, { text: " »" }]} />
    </At>
    <At from={231.3} to={235.6}>
      <TopTag text="📋 Prompt en description" end={4.3} />
    </At>
    {/* 241 → 257,4 : la page 4 du guide */}
    <At from={241.0} to={257.4}>
      <CpmDuo end={16.4} leftAt={0.7} rightAt={13.4} />
    </At>
    <At from={264.0} to={267.8}>
      <ScreenTag text="PDF téléchargé ✓" end={3.8} />
    </At>
  </>
);

// ══ BLOC 2 (4:28 → 9:03) : Étape 2, Hostinger (offre, panier, création, prompt) ══
// Flou : la liste d'adresses e-mail du gestionnaire de mots de passe (400,9 → 402,4 mesurés), sur la liste seulement.
const DemoScreens2: React.FC = () => (
  <>
    <At from={268.0} to={300.9}>
      <ScreenStage src={SCREEN} trimBefore={268.0} win={WIN} keys={[{ t: 0, z: 1.0, cx: 960, cy: 540 }, { t: 17.5, z: 1.0, cx: 960, cy: 540 }, { t: 18.5, z: 1.3, cx: 560, cy: 420 }, { t: 33.0, z: 1.3, cx: 560, cy: 420 }, { t: 33.8, z: 1.0, cx: 960, cy: 540 }, { t: 37.8, z: 1.0, cx: 960, cy: 540 }, { t: 38.6, z: 1.6, cx: 520, cy: 470 }, { t: 41.6, z: 1.6, cx: 520, cy: 470 }, { t: 42.3, z: 1.6, cx: 1100, cy: 470 }]} />
    </At>
    {/* Demande de Hostinger : leur page « ai-builder-lp » à la place de l'accueil (282,4 → 301,5) */}
    <At from={282.4} to={300.9}>
      <LpWindow end={18.5} win={WIN} keys={[{ t: 0, z: 1.0, cx: 852, cy: 486 }, { t: 3.0, z: 1.0, cx: 852, cy: 486 }, { t: 3.9, z: 1.35, cx: 520, cy: 300 }, { t: 14.6, z: 1.35, cx: 520, cy: 300 }, { t: 15.4, z: 1.35, cx: 520, cy: 470 }]} />
    </At>
    {/* coupe 300,9 → 396,75 (ancienne offre) : séquence « Mise à jour Hostinger » */}
    <At from={I0} to={T(400.0)}>
      <UpdateFlowInsert end={T(400.0) - I0} />
    </At>
    {/* 396,75 → 400 (« une fois que tu choisis ça… continuer ») : la séquence continue, on ne montre plus l'ancien panier */}
    <AtS from={400.0} to={484.5}>
      <ScreenStage src={SCREEN} trimBefore={400.0} win={WIN} masks={[{ from: 0.7, to: 2.5, x: 1180, y: 170, w: 480, h: 850 }]} keys={[{ t: 0, z: 1.0, cx: 960, cy: 540 }, { t: 18.4, z: 1.0, cx: 960, cy: 540 }, { t: 19.1, z: 1.6, cx: 960, cy: 560 }, { t: 24.7, z: 1.6, cx: 960, cy: 560 }, { t: 25.5, z: 1.0, cx: 960, cy: 540 }, { t: 28.9, z: 1.0, cx: 960, cy: 540 }, { t: 29.6, z: 1.45, cx: 960, cy: 450 }, { t: 31.6, z: 1.45, cx: 960, cy: 450 }, { t: 32.2, z: 1.45, cx: 1385, cy: 450 }, { t: 36.8, z: 1.45, cx: 1385, cy: 450 }, { t: 37.4, z: 1.45, cx: 560, cy: 450 }, { t: 46.6, z: 1.45, cx: 560, cy: 450 }, { t: 47.4, z: 1.0, cx: 960, cy: 540 }, { t: 78.4, z: 1.0, cx: 960, cy: 540 }, { t: 79.1, z: 1.6, cx: 1214, cy: 900 }, { t: 83.4, z: 1.6, cx: 1214, cy: 900 }, { t: 84.2, z: 1.0, cx: 960, cy: 540 }]} />
    </AtS>
    <AtS from={484.5} to={543.0}>
      <ScreenStage src={SCREEN} trimBefore={484.5} win={WIN} keys={[{ t: 0, z: 1.5, cx: 956, cy: 325 }, { t: 7.4, z: 1.5, cx: 956, cy: 325 }, { t: 7.9, z: 1.0, cx: 960, cy: 540 }, { t: 15.6, z: 1.0, cx: 960, cy: 540 }, { t: 16.3, z: 1.35, cx: 560, cy: 760 }, { t: 39.2, z: 1.35, cx: 560, cy: 760 }, { t: 39.9, z: 1.0, cx: 960, cy: 540 }, { t: 41.9, z: 1.0, cx: 960, cy: 540 }, { t: 42.6, z: 1.9, cx: 900, cy: 420 }, { t: 46.7, z: 1.9, cx: 900, cy: 420 }, { t: 47.3, z: 1.0, cx: 960, cy: 540 }, { t: 55.8, z: 1.0, cx: 960, cy: 540 }, { t: 56.5, z: 2.0, cx: 860, cy: 440 }]} />
    </AtS>
  </>
);
const BlocB2: React.FC = () => (
  <>
    <At from={268.0} to={270.5}>
      <StepCard3 n={2} title="La page de *vente*" end={2.5} done={1} />
    </At>
    {[[283.4, 300.9], [400.0, 484.5], [492.6, 543.0]].map(([a, b]) => (
      <AtS key={a} from={a} to={b}>
        <StepLT n={2} text="La page de vente · Hostinger" end={Tend(b) - T(a)} />
      </AtS>
    ))}
    {/* 270,9 → 282,5 : face cam ; la livraison automatique */}
    <At from={272.6} to={282.5}>
      <FocusVeil start={0} end={9.9} dark={0.62} />
      <FlowLine end={9.9} items={[{ text: "Achat", at: 1.4 }, { text: "Paiement", at: 2.2 }, { text: "PDF livré", at: 3.1, hl: true }]} caption="*Automatique* : plus de PDF sur WhatsApp" captionAt={6.2} />
    </At>
    <At from={285.6} to={293.0}>
      <SponsorTag end={7.4} />
    </At>
    <At from={298.8} to={300.9}>
      <TopTag text="🔗 Lien en description" end={2.1} />
    </At>
    <AtS from={405.8} to={411.0}>
      <ScreenTag text="🔒 Paiement : non montré" end={5.2} />
    </AtS>
    <AtS from={419.2} to={425.4}>
      <ScreenTag text="Créer un *nouveau site*" end={6.2} />
    </AtS>
    <AtS from={429.8} to={432.2}>
      <ScreenTag text="WordPress" end={2.4} />
    </AtS>
    <AtS from={432.3} to={437.4}>
      <ScreenTag text="Ton propre code" end={5.1} />
    </AtS>
    <AtS from={437.5} to={446.8}>
      <ScreenTag text="« Décrivez-le, *nous le construisons* »" end={9.3} />
    </AtS>
    <AtS from={449.2} to={459.3}>
      <ScreenTag text="Manuel ou *avec l'IA* ?" end={10.1} />
    </AtS>
    <AtS from={459.4} to={464.4}>
      <Spotlight x={974} y={456} w={412} h={358} caption="Avec l'IA" end={5.0} />
    </AtS>
    <AtS from={473.6} to={478.6}>
      <TiltShot src={`${CAP}/site_ibrahim.png`} iw={2560} ih={1800} end={5.0} width={900} x={860} y={150} caption="Mon site · *ibrahimkamara.com*" captionAt={0.4} />
    </AtS>
    <AtS from={479.4} to={483.5}>
      <ScreenTag text="Domaine *temporaire* · tu le changes plus tard" end={4.1} />
    </AtS>
    {/* 484,5 → 492,3 : face cam */}
    <AtS from={484.5} to={492.3}>
      <KeyLine end={7.8} size={100} words={[{ w: "Le", t: 0.6 }, { w: "prompt,", t: 1.3 }, { w: "c'est", t: 5.4 }, { w: "Claude", t: 6.7, hl: true }, { w: "qui l'écrit", t: 7.0 }]} />
    </AtS>
    <AtS from={492.3} to={500.3}>
      <PromptCard tool="Claude" end={8.0} parts={[{ text: "« Écris-moi un prompt que je vais donner à " }, { text: "Hostinger Website Builder", label: "Outil", at: 3.5 }, { text: " pour " }, { text: "créer une page de vente pour vendre cet e-book", label: "Tâche", at: 5.6 }, { text: ". »" }]} />
    </AtS>
    <AtS from={500.4} to={504.3}>
      <ScreenTag text="Claude connaît déjà *ton e-book*" end={3.9} />
    </AtS>
    <AtS from={513.7} to={522.6}>
      <ScreenTag text="Prompt détaillé · mêmes *couleurs* que l'e-book" end={8.9} />
    </AtS>
    <AtS from={526.9} to={531.4}>
      <ScreenTag text="⚠️ Limite Hostinger : *2 000* caractères" end={4.5} />
    </AtS>
    <AtS from={531.6} to={536.4}>
      <ChatBubble end={4.8} eyebrow="Mon message à Claude" text="« Il est trop long, j'ai une limite de *2 000* caractères. »" />
    </AtS>
    <AtS from={540.7} to={543.0}>
      <ScreenTag text="Prompt raccourci · *1 796* / 2 000 ✓" end={2.3} />
    </AtS>
  </>
);

// ══ BLOC 3 (source 9:03 → 12:35 ; timeline 9:03 → 12:52) : la page de vente + les 2 séquences demandées par Hostinger ══
const DemoScreens3: React.FC = () => (
  <>
    <AtS from={543.0} to={563.0}>
      <ScreenStage src={SCREEN} trimBefore={543.0} win={WIN} keys={[{ t: 0, z: 1.0, cx: 960, cy: 540 }, { t: 18.5, z: 1.3, cx: 960, cy: 520 }, { t: 20.0, z: 1.3, cx: 960, cy: 520 }]} />
    </AtS>
    <AtS from={563.0} to={655.0}>
      <ScreenStage src={SCREEN} trimBefore={563.0} win={WIN} keys={[{ t: 0, z: 1.0, cx: 960, cy: 540 }, { t: 6.2, z: 1.0, cx: 960, cy: 540 }, { t: 7.0, z: 1.2, cx: 960, cy: 470 }, { t: 12.2, z: 1.2, cx: 960, cy: 470 }, { t: 12.9, z: 1.0, cx: 960, cy: 540 }, { t: 79.4, z: 1.0, cx: 960, cy: 540 }, { t: 80.2, z: 1.3, cx: 1250, cy: 560 }, { t: 88.0, z: 1.3, cx: 1250, cy: 560 }, { t: 88.7, z: 1.0, cx: 960, cy: 540 }]} />
    </AtS>
    <AtS from={655.0} to={699.0}>
      <ScreenStage src={SCREEN} trimBefore={655.0} win={WIN} keys={[{ t: 0, z: 1.0, cx: 960, cy: 540 }, { t: 13.0, z: 1.0, cx: 960, cy: 540 }, { t: 13.8, z: 1.5, cx: 380, cy: 640 }, { t: 31.4, z: 1.5, cx: 380, cy: 640 }, { t: 32.2, z: 1.0, cx: 960, cy: 540 }, { t: 42.0, z: 1.2, cx: 960, cy: 540 }]} />
    </AtS>
    <AtS from={699.0} to={729.95}>
      <ScreenStage src={SCREEN} trimBefore={699.0} win={WIN} keys={[{ t: 0, z: 1.0, cx: 960, cy: 540 }, { t: 8.4, z: 1.0, cx: 960, cy: 540 }, { t: 9.1, z: 1.3, cx: 900, cy: 460 }, { t: 17.0, z: 1.3, cx: 900, cy: 460 }, { t: 17.7, z: 1.0, cx: 960, cy: 540 }]} />
    </AtS>
    {/* insertion 1 : « Sélectionner et modifier » */}
    <At from={I1} to={I1 + D_SEL}>
      <SelectEditInsert end={D_SEL} win={WIN} />
    </At>
    <AtS from={729.95} to={750.5}>
      <ScreenStage src={SCREEN} trimBefore={729.95} win={WIN} keys={[{ t: 0, z: 1.0, cx: 960, cy: 540 }, { t: 7.0, z: 1.0, cx: 960, cy: 540 }, { t: 7.8, z: 1.45, cx: 960, cy: 560 }, { t: 20.5, z: 1.45, cx: 960, cy: 560 }]} />
    </AtS>
    {/* insertion 2 : Hostinger Ecommerce */}
    <At from={I2} to={I2 + D_ECO}>
      <EcommerceInsert end={D_ECO} />
    </At>
    <AtS from={750.5} to={756.0}>
      <ScreenStage src={SCREEN} trimBefore={750.5} win={WIN} keys={[{ t: 0, z: 1.0, cx: 960, cy: 540 }]} />
    </AtS>
  </>
);
const BlocB3: React.FC = () => (
  <>
    {[[543.0, 612.9], [646.5, 729.95], [729.95, 750.5], [750.5, 755.0]].map(([a, b]) => (
      <AtS key={a} from={a} to={b}>
        <StepLT n={2} text="La page de vente · Hostinger" end={Tend(b) - T(a)} />
      </AtS>
    ))}
    <AtS from={543.1} to={561.5}>
      <ScreenTag text="⏳ Hostinger construit ta page" end={18.4} />
    </AtS>
    <AtS from={562.7} to={568.6}>
      <ScreenTag text="Ta page de vente · *1er essai*" end={5.9} />
    </AtS>
    <AtS from={578.6} to={587.4}>
      <SideStat end={8.8} hero eyebrow="Prix choisi par l'IA" value="19 $" valueAt={0.6} sub="adapté à une audience africaine" subAt={5.7} />
    </AtS>
    <AtS from={592.3} to={598.3}>
      <ScreenTag text="Une vraie page de vente *marketing*" end={6.0} />
    </AtS>
    <AtS from={598.4} to={601.0}>
      <ScreenTag text="Les *chapitres* du guide" end={2.6} />
    </AtS>
    <AtS from={601.1} to={606.0}>
      <ScreenTag text="« Basé sur des données *2026* »" end={4.9} />
    </AtS>
    {/* 612,9 → 645,8 : face cam ; se montrer pour vendre */}
    <AtS from={612.9} to={628.5}>
      <TwoCards end={15.6} left={{ title: "Te montrer : nom, photos", meta: "→ *confiance*", at: 0.5 }} right={{ title: "Rester caché", meta: "→ moins de ventes", at: 9.0 }} strikeAt={13.0} />
    </AtS>
    <AtS from={628.6} to={638.9}>
      <KeyLine end={10.3} size={100} words={[{ w: "Pas", t: 0.3 }, { w: "de", t: 0.4 }, { w: "visage", t: 0.5 }, { w: "=", t: 0.6 }, { w: "pas", t: 0.7 }, { w: "de", t: 0.8 }, { w: "confiance", t: 0.9, hl: true }]} />
    </AtS>
    <AtS from={639.3} to={645.8}>
      <GlassList end={6.5} title="Sur ta page de vente" titleAt={0.1} items={[{ text: "Ton nom", at: 1.2 }, { text: "Tes photos", at: 2.1 }, { text: "Tes *résultats*", at: 5.7 }]} />
    </AtS>
    <AtS from={652.0} to={660.4}>
      <ScreenTag text="Modifier la page… *par prompt*" end={8.4} />
    </AtS>
    <AtS from={672.6} to={686.6}>
      <PromptCard tool="Hostinger" end={14.0} parts={[{ text: "« J'aimerais " }, { text: "mettre à jour la copy de la page", label: "Tâche", at: 1.4 }, { text: " et " }, { text: "me mettre en avant, ainsi que mon expérience personnelle sur le sujet", label: "Me mettre en avant", at: 7.1 }, { text: ". " }, { text: "Je m'appelle Ibrahim Kamara", label: "Mon nom", at: 12.4 }, { text: ". Je te laisse décider des infos à rajouter pour convaincre. »" }]} />
    </AtS>
    <AtS from={687.0} to={696.4}>
      <ScreenTag text="⏳ Mise à jour de la page" end={9.4} />
    </AtS>
    <AtS from={707.9} to={711.1}>
      <ScreenTag text="« Par *Ibrahim Kamara* »" end={3.2} />
    </AtS>
    <AtS from={711.2} to={716.4}>
      <ScreenTag text="Une section dédiée · *mon histoire*" end={5.2} />
    </AtS>
    <AtS from={717.5} to={723.0}>
      <ScreenTag text="Pas satisfait ? Un *nouveau prompt* suffit" end={5.5} />
    </AtS>
    <AtS from={735.1} to={738.4}>
      <ScreenTag text="Version *mobile*" end={3.3} />
    </AtS>
    <AtS from={743.8} to={750.4}>
      <ScreenTag text="Bouton d'achat → panier · *paiement test*" end={6.6} />
    </AtS>
    <AtS from={750.8} to={754.6}>
      <ScreenTag text="Mobile · ordinateur ✓" end={3.8} />
    </AtS>
  </>
);

// ══ BLOC 4 (source 12:35 → fin ; timeline 12:52 → 15:52,7) : publication, domaine, Étape 3 (les clients), fin ══
// Flou : la fenêtre d'adresse pré-remplie (793,0 → 798,1 mesurés), sur le code postal seulement.
const DemoScreens4: React.FC = () => (
  <>
    <AtS from={755.0} to={798.0}>
      <ScreenStage src={SCREEN} trimBefore={755.0} win={WIN} masks={[{ from: 37.8, to: 43.3, x: 640, y: 655, w: 620, h: 75 }]} keys={[{ t: 0, z: 1.0, cx: 960, cy: 540 }, { t: 1.4, z: 1.0, cx: 960, cy: 540 }, { t: 2.1, z: 1.8, cx: 1700, cy: 120 }, { t: 4.8, z: 1.8, cx: 1700, cy: 120 }, { t: 5.5, z: 1.0, cx: 960, cy: 540 }, { t: 7.2, z: 1.0, cx: 960, cy: 540 }, { t: 7.9, z: 1.5, cx: 960, cy: 480 }, { t: 11.2, z: 1.5, cx: 960, cy: 480 }, { t: 11.9, z: 1.0, cx: 960, cy: 540 }, { t: 23.6, z: 1.0, cx: 960, cy: 540 }, { t: 24.3, z: 1.6, cx: 960, cy: 560 }, { t: 35.5, z: 1.6, cx: 960, cy: 560 }, { t: 36.2, z: 1.0, cx: 960, cy: 540 }, { t: 48.0, z: 1.0, cx: 960, cy: 540 }, { t: 48.7, z: 1.5, cx: 910, cy: 680 }, { t: 66.5, z: 1.5, cx: 910, cy: 680 }, { t: 67.3, z: 1.0, cx: 960, cy: 540 }]} />
    </AtS>
    <AtS from={816.45} to={825.6}>
      <ScreenStage src={SCREEN} trimBefore={816.45} win={WIN} keys={[{ t: 0, z: 1.5, cx: 910, cy: 680 }, { t: 5.05, z: 1.5, cx: 910, cy: 680 }, { t: 5.85, z: 1.0, cx: 960, cy: 540 }]} />
    </AtS>
  </>
);
const BlocB4: React.FC = () => (
  <>
    <At from={T(755.0)} to={Tend(825.1)}>
      <StepLT n={2} text="La page de vente · Hostinger" end={Tend(825.1) - T(755.0)} />
    </At>
    <AtS from={757.0} to={760.6}>
      <ScreenTag text="Bouton *Publier*" end={3.6} />
    </AtS>
    <AtS from={762.7} to={764.7}>
      <ScreenTag text="Ton site est *en ligne* ✓" end={2.0} />
    </AtS>
    <AtS from={764.8} to={770.6}>
      <ScreenTag text="monetiser-youtube-afrique-*254202*.hostingersite.com" end={5.8} />
    </AtS>
    <AtS from={773.0} to={777.4}>
      <ScreenTag text="Public : *n'importe qui* peut y accéder" end={4.4} />
    </AtS>
    <AtS from={781.3} to={785.6}>
      <ScreenTag text="Une adresse temporaire, *pas pro*" end={4.3} />
    </AtS>
    <AtS from={786.6} to={791.2}>
      <ScreenTag text="Connecte *ton* nom de domaine" end={4.6} />
    </AtS>
    <AtS from={792.2} to={797.8}>
      <ScreenTag text="Par exemple : *ibrahimkamara.com*" end={5.6} />
    </AtS>
    <AtS from={801.3} to={812.6}>
      <ScreenTag text="Domaine à *0,01 €* la 1re année" end={11.3} />
    </AtS>
    <AtS from={816.5} to={820.6}>
      <ScreenTag text="Un nom de domaine : ≈ *10,99 €*/an" end={4.1} />
    </AtS>
    <AtS from={822.1} to={825.0}>
      <ScreenTag text="Tu suis les instructions ✓" end={2.9} />
    </AtS>
    {/* 825,1 → fin : face cam, tout est illustré */}
    <AtS from={825.1} to={836.6}>
      <FocusVeil start={0} end={11.5} dark={0.74} />
      <TutoMap3 end={11.5} steps={TUTO.map((st) => ({ ...st, at: 0.5 }))} active={2} done={2} eyebrow="Où tu en es" eyebrowAt={0.3} />
    </AtS>
    <AtS from={836.8} to={844.6}>
      <FocusVeil start={0} end={7.8} />
      <KeyLine end={7.8} valign="center" size={120} words={[{ w: "Le", t: 0.5 }, { w: "plus", t: 0.65 }, { w: "dur :", t: 0.8 }, { w: "trouver", t: 6.3 }, { w: "des", t: 6.5 }, { w: "acheteurs", t: 6.7, hl: true }]} />
    </AtS>
    <AtS from={844.6} to={847.2}>
      <StepCard3 n={3} title="Les *clients*" end={2.6} done={2} />
    </AtS>
    <AtS from={847.3} to={860.0}>
      <TrafficDuo end={12.7} titleAt={0.1} leftAt={3.0} active={0} />
    </AtS>
    <AtS from={860.0} to={872.0}>
      <SlowGrowth end={12.0} monthsAt={2.0} caption="Peu de vues, peu d'abonnés… *au début*" captionAt={4.9} />
    </AtS>
    <AtS from={872.0} to={877.8}>
      <KeyLine end={5.8} size={104} words={[{ w: "Tu", t: 1.5 }, { w: "veux", t: 1.8 }, { w: "gagner", t: 3.3 }, { w: "vite", t: 3.8, hl: true }, { w: "?", t: 3.9 }]} />
    </AtS>
    <AtS from={878.0} to={885.6}>
      <KeyLine end={7.6} size={104} words={[{ w: "Le", t: 0.5 }, { w: "contenu", t: 0.8 }, { w: "=", t: 1.2 }, { w: "long terme", t: 1.9, hl: true }]} />
    </AtS>
    <AtS from={885.8} to={897.2}>
      <TrafficDuo end={11.4} titleAt={0} leftAt={0} rightAt={0.3} rightSubAt={5.8} active={1} />
    </AtS>
    <AtS from={897.3} to={901.5}>
      <KeyLine end={4.2} size={104} words={[{ w: "Ce", t: 0.3 }, { w: "n'est", t: 0.5 }, { w: "pas gratuit", t: 2.4, hl: true }]} />
    </AtS>
    <AtS from={901.6} to={914.0}>
      <AdPlatforms end={12.4} pickAt={5.6} pickText="Commence par Facebook · le plus simple" items={[{ logo: "logo_facebook.svg", name: "Facebook Ads", at: 0.0 }, { logo: "logo_tiktok.svg", name: "TikTok Ads", at: 1.0 }, { logo: "logo_youtube.svg", name: "YouTube Ads", at: 2.1 }]} />
    </AtS>
    <AtS from={914.1} to={917.3}>
      <KeyLine end={3.2} size={104} words={[{ w: "Ta", t: 0.2 }, { w: "page", t: 0.3 }, { w: "→", t: 0.6 }, { w: "des ventes", t: 1.4, hl: true }]} />
    </AtS>
    <AtS from={917.4} to={929.0}>
      <NextVideoCard end={11.6} title="J'ai créé cette pub en quelques minutes *avec l'IA*" cta="Clique ici ↗" ctaAt={9.4} />
    </AtS>
    <AtS from={929.1} to={SRC_END}>
      <TopTag text="🔗 Hostinger · code KAMARA7 · lien en description et en commentaire épinglé" end={SRC_END - 929.1} top={60} />
    </AtS>
  </>
);

// Voix et face cam découpées aux insertions (chaque segment garde son temps source)
const VoiceTrack: React.FC = () => (
  <>
    {SEGS.map(([a, b]) => (
      <Sequence key={a} from={f(T(a))} durationInFrames={f(b) - f(a)} layout="none">
        <Audio src={staticFile(`${D}/voice.wav`)} trimBefore={f(a)} />
      </Sequence>
    ))}
  </>
);

export const MontageHostingerProduits: React.FC = () => (
  <AbsoluteFill style={{ background: "black" }}>
    <DemoScreens1 />
    <DemoScreens2 />
    <DemoScreens3 />
    <DemoScreens4 />
    <AbsoluteFill>
      {SEGS.map(([a, b]) => (
        <Sequence key={a} from={f(T(a))} durationInFrames={f(b) - f(a)} layout="none">
          <AbsoluteFill>
            <FacePip src={FACE} trimBefore={a} face={FACE_POS} grade={GRADE} keys={FACE_KEYS.map((k) => ({ ...k, t: k.t - a }))} zoomKeys={FACE_ZOOM.map((k) => ({ ...k, t: k.t - a }))} />
          </AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
    <BlocH />
    <BlocB1 />
    <BlocB2 />
    <BlocB3 />
    <BlocB4 />
    <SfxTrack cues={SFX} />
    <VoiceTrack />
    <MusicTrack />
    <Grain />
  </AbsoluteFill>
);
