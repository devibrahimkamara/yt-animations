// Montage Hostinger — vidéo complète (timeline montée, temps absolus en secondes).
// Plan : montages/hostinger/04-plan.md · PLAYBOOK §8 et §13.
// Source = T jusqu'à 65,62 s (CUT_AT), puis source = T + 18,84 (CUT_LEN).
import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, OffthreadVideo, Sequence, staticFile } from "remotion";
import {
  Backdrop,
  blurIn,
  ChapterPill,
  EASE,
  Eyebrow,
  f,
  FacePip,
  FONT,
  glass,
  Grain,
  INK,
  inOut,
  keyed,
  KeyLine,
  MUTED,
  LIME,
  LINE,
  rich,
  ScreenStage,
  SfxTrack,
  Star,
  Stat,
  useT,
  W,
  H,
  type SfxCue,
} from "../montage/lib";
import { PromptCard, Spotlight, StepLT, TopPill } from "../montage/Explainers";
import { CUT_LEN, HOOK_END, hookMusicLevel, MontageHostingerHook, Scrim, TwoPills } from "./Hook";

export const FULL_DURATION = 519.7; // audio_v1.wav (8:39,7)
const FACE = "montage/hostinger/face_full.mp4";
const SCREEN = "montage/hostinger/screen_full.mp4";
const FACE_POS = { x: 0.487, y: 0.38 };
const GRADE = "brightness(1.16) contrast(1.06) saturate(1.05)";
const src = (T: number) => T + CUT_LEN; // après la coupe
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const WIN_APP = { x: 108, y: 54, w: 1704, h: 972 };

/** Séquence placée en temps absolu de la timeline. */
const At: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => (
  <Sequence from={f(from)} durationInFrames={f(to - from)} layout="none">
    <AbsoluteFill>{children}</AbsoluteFill>
  </Sequence>
);

// ─── Musique : un morceau par partie (choix d'Ibrahim), ≈ −29 LUFS, fondus enchaînés ───
const PARTS = [
  { file: "m0_hook_bakka.mp3", lufs: -9.4, from: 0, to: HOOK_END },
  { file: "m1_offre_where_it_all_happened.mp3", lufs: -13.1, from: HOOK_END, to: 171.82 },
  { file: "m2_prompt_axon_terminal.mp3", lufs: -12.8, from: 171.82, to: 267.2 },
  { file: "m3_site_baring.mp3", lufs: -13.9, from: 267.2, to: 365.0 },
  { file: "m4_modifier_eighties_lawyer.mp3", lufs: -11.3, from: 365.0, to: 440.0 },
  { file: "m5_fin_alta.mp3", lufs: -13.2, from: 440.0, to: FULL_DURATION },
];
const XF = 1.2; // fondu enchaîné
// Remontées (+3 dB) sur les moments forts
const BOOSTS: [number, number][] = [
  [146.5, 152.0], // 47,88 €
  [154.3, 158.2], // code KAMARA7
  [397.0, 403.8], // avant / après
  [509.6, 515.0], // écran de fin
];
const boost = (T: number) => 1 + 0.41 * Math.max(0, ...BOOSTS.map(([a, b]) => interpolate(T, [a - 0.3, a + 0.2, b - 0.3, b + 0.3], [0, 1, 1, 0], clamp)));
const MusicTrack: React.FC = () => (
  <>
    {PARTS.map((p, i) => {
      const from = Math.max(0, p.from - (i ? XF / 2 : 0));
      const to = Math.min(FULL_DURATION, p.to + XF / 2);
      const g = Math.pow(10, (-29 - p.lufs) / 20);
      return (
        <Sequence key={p.file} from={f(from)} durationInFrames={f(to - from)}>
          <Audio
            src={staticFile(`epidemic/hostinger/hq/${p.file}`)}
            volume={(fr) => {
              const T = from + fr / 30;
              const env = interpolate(T, [from, from + (i ? XF : 0.4), to - XF, to], [0, 1, 1, i === PARTS.length - 1 ? 0 : 0], clamp);
              const lvl = i === 0 ? hookMusicLevel(T, true) : 1;
              return g * env * lvl * boost(T);
            }}
          />
        </Sequence>
      );
    })}
  </>
);

// ─── Page du créateur IA (retour marque M2) : capture pleine page posée dans la fenêtre ───
type LpKey = { t: number; z: number; cx: number; cy: number }; // cx, cy en pixels de la page (1920 de large)
const LP_H = 8126;
const LandingPage: React.FC<{ keys: LpKey[]; rings: { from: number; to: number; x: number; y: number; w: number; h: number }[]; tilt: { t: number; rx: number; ry: number }[] }> = ({
  keys,
  rings,
  tilt,
}) => {
  const t = useT();
  const ts = keys.map((k) => k.t);
  const z = Math.exp(keyed(t, ts, keys.map((k) => Math.log(k.z))));
  const cx = keyed(t, ts, keys.map((k) => k.cx));
  const cy = keyed(t, ts, keys.map((k) => k.cy));
  const s = (WIN_APP.w / 1920) * z;
  const left = Math.min(0, Math.max(WIN_APP.w - 1920 * s, WIN_APP.w / 2 - cx * s));
  const top = Math.min(0, Math.max(WIN_APP.h - LP_H * s, WIN_APP.h / 2 - cy * s));
  const rx = keyed(t, tilt.map((k) => k.t), tilt.map((k) => k.rx), EASE);
  const ry = keyed(t, tilt.map((k) => k.t), tilt.map((k) => k.ry), EASE);
  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{ perspective: 2400 }}>
        <div style={{ position: "absolute", inset: 0, transform: `rotateX(${rx}deg) rotateY(${ry}deg)` }}>
          <div
            style={{
              position: "absolute",
              left: WIN_APP.x,
              top: WIN_APP.y,
              width: WIN_APP.w,
              height: WIN_APP.h,
              borderRadius: 28,
              overflow: "hidden",
              border: `1.5px solid ${LINE}`,
              boxShadow: "0 60px 120px -30px rgba(0,0,0,0.85)",
              background: "black",
            }}
          >
            <Img src={staticFile("montage/hostinger/lp_ai_builder.png")} style={{ position: "absolute", left, top, width: 1920 * s, height: LP_H * s, maxWidth: "none" }} />
            {rings
              .filter((r) => t >= r.from && t < r.to)
              .map((r, i) => {
                const o = inOut(t, r.from, r.to, 0.3, 0.3);
                const sc = 1.06 - 0.06 * keyed(t, [r.from, r.from + 0.35], [0, 1], EASE);
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: left + r.x * s,
                      top: top + r.y * s,
                      width: r.w * s,
                      height: r.h * s,
                      borderRadius: 18,
                      border: `4px solid ${LIME}`,
                      boxShadow: `0 0 0 3000px rgba(9,11,8,${0.45 * o}), 0 0 40px rgba(198,243,109,0.5)`,
                      opacity: o,
                      transform: `scale(${sc})`,
                    }}
                  />
                );
              })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Carte du code promo (sponsor) ───
const CodeCard: React.FC<{ end: number }> = ({ end }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.01, 0.4);
  const b = blurIn(t, 0, 0.5, 30);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: o, fontFamily: FONT }}>
      <div style={{ ...glass, background: "linear-gradient(180deg, rgba(18,22,15,0.96), rgba(18,22,15,0.9))", borderRadius: 44, padding: "48px 80px 52px", textAlign: "center", ...b, opacity: Math.min(o, Number(b.opacity)) }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <Star size={34} spin={(1 - keyed(t, [0, 0.8], [0, 1], EASE)) * -90} />
          <Eyebrow size={32}>Code promo</Eyebrow>
        </div>
        <div style={{ fontSize: 190, fontWeight: 600, letterSpacing: "0.02em", color: LIME, lineHeight: 1.05, marginTop: 14, textShadow: "0 0 60px rgba(198,243,109,0.35)", ...blurIn(t, 0.2, 0.5, 24) }}>KAMARA7</div>
        <div style={{ fontSize: 50, color: INK, marginTop: 10, letterSpacing: "-0.02em", ...blurIn(t, 0.55) }}>{rich("réduction *supplémentaire* sur ton premier achat")}</div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Pastilles en haut, au mot ───
const Chips: React.FC<{ items: { text: string; at: number }[]; end: number }> = ({ items, end }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.01, 0.4);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-start", padding: "0 0 70px 60px", opacity: o }}>
      <div style={{ display: "flex", gap: 22 }}>
        {items.map((it, i) => (
          <div key={i} style={blurIn(t, it.at, 0.45, 18)}>
            <div style={{ ...glass, background: "linear-gradient(180deg, rgba(18,22,15,0.94), rgba(18,22,15,0.88))", borderRadius: 999, padding: "18px 32px", display: "flex", alignItems: "center", gap: 14, fontFamily: FONT, fontSize: 44, fontWeight: 500, color: INK, letterSpacing: "-0.015em", whiteSpace: "nowrap" }}>
              <span style={{ color: LIME }}>✓</span>
              {rich(it.text)}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── Teaser en coin : le site en noir et blanc, sans masquer la démo ───
const CornerTeaser: React.FC<{ end: number }> = ({ end }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.01, 0.4);
  const b = blurIn(t, 0, 0.5, -24);
  const S = 0.3; // échelle de la vignette (zone du site 1683 × 843)
  return (
    <div style={{ position: "absolute", right: 60, top: 60, width: 1683 * S + 40, ...glass, background: "linear-gradient(180deg, rgba(18,22,15,0.95), rgba(18,22,15,0.9))", borderRadius: 30, padding: 20, fontFamily: FONT, ...b, opacity: Math.min(o, Number(b.opacity)) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <Star size={26} spin={t * 30} />
        <Eyebrow size={24}>À venir</Eyebrow>
      </div>
      <div style={{ position: "relative", width: 1683 * S, height: 843 * S, borderRadius: 16, overflow: "hidden", background: "black" }}>
        <OffthreadVideo
          src={staticFile(SCREEN)}
          trimBefore={f(417.0)}
          muted
          style={{ position: "absolute", left: -118 * S, top: -172 * S, width: W * S, height: H * S, maxWidth: "none" }}
        />
      </div>
      <div style={{ fontSize: 34, color: INK, marginTop: 14, letterSpacing: "-0.015em", lineHeight: 1.2 }}>{rich("Le même site *en noir et blanc*, en 1 prompt")}</div>
    </div>
  );
};

// ═══ Bloc 1 · Étapes 1 et 2 : Hostinger (offre, code) et le prompt (1:14,9 → 4:27,2) ═══
const B1 = HOOK_END; // 74,86
export const B1_END = 267.2;
const SCR1 = 92.4; // couche écran (capture) : les offres arrivent à 92,53
const s1 = (T: number) => T - SCR1;
const LP_END = 93.2;
/** Coordonnées écran d'une zone de la capture pour une vue (z, centre réel après blocage). */
const view = (z: number, cx: number, cy: number) => (x: number, y: number, w: number, h: number, pad = 14) => ({
  x: 960 + (x - cx) * z - pad,
  y: 540 + (y - cy) * z - pad,
  w: w * z + 2 * pad,
  h: h * z + 2 * pad,
});
const V1 = view(1, 960, 540);
const V_UNL = view(1.35, 960, 560);
const V_DUR = view(1.45, 770, 426); // centre (715, 400) ramené par le blocage de bord
const V_CODE = view(1.5, 1172, 666); // centre (1380, 720) ramené par le blocage de bord
const STAT_4788: [number, number] = [146.6, 152.0];
const CODE: [number, number] = [154.4, 158.0];

const SFX_B1: SfxCue[] = [
  { k: "whoosh01", at: 74.7 }, // page du créateur IA
  { k: "popNotif03", at: 77.1, gain: 0.6 }, // lien + code
  { k: "popSelectA", at: 87.8 }, // champ de prompt
  { k: "clickA", at: 92.2 }, // Voir les packs
  { k: "popSelectA", at: 96.35 }, // 2,99
  { k: "popSelectB", at: 98.0 }, // 3,99
  { k: "popSelectA", at: 99.4 }, // 7,99
  { k: "whoosh05", at: 100.5 }, // zoom Unlimited
  { k: "popNotif02", at: 109.6 }, // illimités
  { k: "popSelectA", at: 117.3 }, // boîtes mail
  { k: "popSelectB", at: 121.6 }, // domaine
  { k: "popSelectA", at: 123.7 }, // support
  { k: "whoosh05", at: 133.5 }, // durée
  { k: "popNotif02", at: 139.9 },
  { k: "impactDeep", at: 146.65 }, // 47,88 €
  { k: "whoosh02", at: 153.2 }, // code
  { k: "confirmAchievement", at: 154.55, gain: 0.7 },
  { k: "popSelectB", at: 158.2, gain: 0.6 },
  { k: "whoosh03", at: 171.7 }, // étape 2
  { k: "confirmNotif13", at: 172.1, gain: 0.7 },
  { k: "popNotif02", at: 176.4 }, // mode IA
  { k: "whoosh01", at: 180.8 }, // face cam
  { k: "popSelectA", at: 183.1 },
  { k: "popSelectB", at: 187.6 },
  { k: "whoosh01", at: 196.3 }, // retour écran
  { k: "whoosh05", at: 205.4 }, // prompt Claude
  { k: "clickKey", at: 227.6, gain: 0.7 }, // lancer
  { k: "popNotif03", at: 229.7, gain: 0.6 }, // téléphone
  { k: "whoosh02", at: 233.9 }, // prompt décortiqué
  { k: "popSelectA", at: 241.3 },
  { k: "whoosh03", at: 244.6 }, // teaser
  { k: "popNotif02", at: 252.1 }, // question
];

const Block1: React.FC = () => (
  <AbsoluteFill>
    {/* Capture (offres → panier → mode IA → Claude → prompt → génération), sous la page du créateur IA */}
    <At from={SCR1} to={B1_END}>
      <ScreenStage
        src={SCREEN}
        trimBefore={src(SCR1)}
        win={WIN_APP}
        keys={[
          { t: 0, z: 1.0, cx: 960, cy: 540 },
          { t: s1(100.3), z: 1.0, cx: 960, cy: 540 },
          { t: s1(101.5), z: 1.35, cx: 960, cy: 560 },
          { t: s1(111.9), z: 1.35, cx: 960, cy: 560 },
          { t: s1(113.0), z: 1.0, cx: 960, cy: 540 },
          { t: s1(133.4), z: 1.0, cx: 960, cy: 540 },
          { t: s1(134.6), z: 1.45, cx: 715, cy: 400 },
          { t: s1(144.4), z: 1.45, cx: 715, cy: 400 },
          { t: s1(145.6), z: 1.0, cx: 960, cy: 540 },
          { t: s1(152.9), z: 1.0, cx: 960, cy: 540 },
          { t: s1(154.1), z: 1.5, cx: 1380, cy: 720 },
          { t: s1(161.2), z: 1.5, cx: 1380, cy: 720 },
          { t: s1(162.6), z: 1.0, cx: 960, cy: 540 },
          { t: s1(205.4), z: 1.0, cx: 960, cy: 540 },
          { t: s1(206.6), z: 1.25, cx: 940, cy: 480 },
          { t: s1(214.4), z: 1.25, cx: 940, cy: 480 },
          { t: s1(215.2), z: 1.0, cx: 960, cy: 540 },
          { t: s1(218.6), z: 1.0, cx: 960, cy: 540 },
          { t: s1(219.8), z: 1.3, cx: 955, cy: 330 },
          { t: s1(227.4), z: 1.3, cx: 955, cy: 330 },
          { t: s1(228.4), z: 1.0, cx: 960, cy: 540 },
        ]}
        masks={[
          { from: s1(131.2), to: s1(172.4), x: 1214, y: 80, w: 414, h: 40 }, // e-mail du compte (panier, facturation)
          { from: s1(195.1), to: s1(196.8), ...WIN_APP }, // historique du navigateur (1 s)
          { from: s1(204.0), to: s1(214.8), x: 150, y: 64, w: 340, h: 44 }, // titre de la conversation Claude
        ]}
        dim={(t) => {
          const T = t + SCR1;
          return Math.max(interpolate(T, [STAT_4788[0] - 0.1, STAT_4788[0] + 0.4, STAT_4788[1] - 0.5, STAT_4788[1]], [0, 0.8, 0.8, 0], clamp), interpolate(T, [CODE[0] - 0.1, CODE[0] + 0.4, CODE[1] - 0.4, CODE[1]], [0, 0.7, 0.7, 0], clamp));
        }}
        blur={(t) => {
          const T = t + SCR1;
          return interpolate(T, [STAT_4788[0] - 0.1, STAT_4788[0] + 0.5, STAT_4788[1] - 0.5, STAT_4788[1]], [0, 9, 9, 0], clamp);
        }}
      />
    </At>

    {/* Retour marque M2 : la page hostinger.com/fr/recommended/ai-builder-lp */}
    <At from={B1} to={LP_END}>
      <FadeOut at={92.55 - B1} end={LP_END - B1}>
        <LandingPage
          keys={[
            { t: 0, z: 1.0, cx: 960, cy: 548 },
            { t: 80.6 - B1, z: 1.0, cx: 960, cy: 548 },
            { t: 84.0 - B1, z: 1.0, cx: 960, cy: 1180 },
            { t: 85.4 - B1, z: 1.0, cx: 960, cy: 1180 },
            { t: 87.2 - B1, z: 1.9, cx: 1220, cy: 524 },
            { t: 90.7 - B1, z: 1.9, cx: 1220, cy: 524 },
            { t: 91.7 - B1, z: 2.2, cx: 1700, cy: 140 },
          ]}
          rings={[
            { from: 87.7 - B1, to: 90.8 - B1, x: 1055, y: 455, w: 332, h: 138 }, // le champ de prompt de l'IA
            { from: 91.7 - B1, to: 93.2 - B1, x: 1702, y: 6, w: 186, h: 62 }, // « Voir les packs »
          ]}
          tilt={[
            { t: 0, rx: 6, ry: -10 },
            { t: 0.3, rx: 6, ry: -10 },
            { t: 2.4, rx: 0, ry: 0 },
          ]}
        />
      </FadeOut>
    </At>
    <At from={B1} to={80.8}>
      <TopPill text="Lien + code *KAMARA7* en description" end={80.8 - B1} />
    </At>

    {/* Les 3 offres (valeurs de l'écran) */}
    <At from={96.3} to={97.95}>
      <Spotlight {...V1(316, 250, 418, 330)} caption="2,99 €/mois" end={97.95 - 96.3} />
    </At>
    <At from={97.95} to={99.3}>
      <Spotlight {...V1(752, 250, 418, 345)} caption="3,99 €/mois" end={99.3 - 97.95} />
    </At>
    <At from={99.3} to={100.5}>
      <Spotlight {...V1(1188, 250, 418, 330)} caption="7,99 €/mois" end={100.5 - 99.3} />
    </At>
    <At from={109.5} to={111.9}>
      <Spotlight {...V_UNL(780, 696, 200, 36)} caption="Sites web illimités" end={111.9 - 109.5} />
    </At>
    <At from={117.2} to={125.8}>
      <Chips
        end={125.8 - 117.2}
        items={[
          { text: "Boîtes mail *pro*", at: 0.1 },
          { text: "Nom de domaine", at: 121.6 - 117.2 },
          { text: "Support *24/7*", at: 123.66 - 117.2 },
        ]}
      />
    </At>

    {/* Panier : 12 mois, 47,88 €, code KAMARA7 */}
    <At from={139.8} to={144.3}>
      <Spotlight {...V_DUR(336, 370, 758, 56)} caption="12 mois → 3,99 €/mois" end={144.3 - 139.8} />
    </At>
    <At from={STAT_4788[0]} to={STAT_4788[1]}>
      <Stat value={47.88} start={0} end={STAT_4788[1] - STAT_4788[0]} context="Le total" label="pour *12 mois* · sites illimités" format={(n) => `${n.toFixed(2).replace(".", ",")} €`} />
    </At>
    <At from={CODE[0]} to={CODE[1]}>
      <CodeCard end={CODE[1] - CODE[0]} />
    </At>
    <At from={158.1} to={161.1}>
      <Spotlight {...V_CODE(1176, 690, 258, 58)} caption="Valable sur le 1er achat" end={161.1 - 158.1} />
    </At>

    {/* Étape 2 : mode IA, description, prompt */}
    <At from={176.3} to={179.5}>
      <Spotlight {...V1(974, 458, 411, 357)} caption="Mode IA" end={179.5 - 176.3} />
    </At>
    <At from={229.6} to={233.8}>
      <TopPill icon="tip" text="Ça marche aussi sur *téléphone*" end={233.8 - 229.6} />
    </At>
    <At from={241.2} to={244.6}>
      <TopPill text="Prompt complet *en description*" end={244.6 - 241.2} />
    </At>
    <At from={244.7} to={250.0}>
      <CornerTeaser end={250.0 - 244.7} />
    </At>
    <At from={252.0} to={257.1}>
      <Spotlight {...V1(614, 708, 692, 308)} end={257.1 - 252.0} />
    </At>
    <At from={252.0} to={261.0}>
      <TopPill text="Option proposée : *réservation en ligne*" end={261.0 - 252.0} />
    </At>

    {/* Face cam : glisse vers le médaillon, revient plein cadre pendant l'explication (écran figé) */}
    <At from={B1} to={B1_END}>
      <FacePip
        src={FACE}
        trimBefore={src(B1)}
        face={FACE_POS}
        grade={GRADE}
        keys={[
          { t: 0, p: 0 },
          { t: 0.9, p: 1 },
          { t: 180.9 - B1, p: 1 },
          { t: 181.8 - B1, p: 0 },
          { t: 196.4 - B1, p: 0 },
          { t: 197.3 - B1, p: 1 },
        ]}
        zoomKeys={[
          { t: 0, z: 1.03 },
          { t: 181.8 - B1, z: 1.0 },
          { t: 196.4 - B1, z: 1.06 },
        ]}
      />
    </At>
    {/* Pastilles sur la face cam plein cadre (au-dessus du médaillon) */}
    <At from={182.6} to={195.6}>
      <Scrim end={195.6 - 182.6} />
      <TwoPills
        end={195.6 - 182.6}
        items={[
          { text: "Ta société : tes infos", at: 183.0 - 182.6 },
          { text: "Un client : ses infos", at: 187.5 - 182.6 },
        ]}
      />
    </At>

    {/* Prompt décortiqué : au-dessus du médaillon (écran figé pendant la génération) */}
    <At from={233.9} to={241.1}>
      <PromptCard
        tool="Claude"
        end={241.1 - 233.9}
        parts={[
          { text: "Crée un site web professionnel en français pour une entreprise de " },
          { text: "customisation automobile basée à Marseille.", label: "Activité", at: 0.5 },
          { text: " Ton : " },
          { text: "professionnel, dynamique.", label: "Ton", at: 1.6 },
          { text: " Structure : " },
          { text: "accueil, services, galerie, à propos, contact, avis, devis.", label: "Structure · 7 sections", at: 2.7 },
          { text: " Design : " },
          { text: "sombre et racé, accents rouges.", label: "Design", at: 3.9 },
          { text: " Fonctionnalités : " },
          { text: "formulaire de devis, SEO local.", label: "Fonctionnalités", at: 5.0 },
        ]}
      />
    </At>
    {/* Pastilles de chapitre */}
    <At from={75.4} to={171.7}>
      <ChapterPill n={1} total={5} title="Hostinger" end={171.7 - 75.4} />
    </At>
    <At from={171.9} to={B1_END + 0.2}>
      <ChapterPill n={2} total={5} title="Le prompt" end={B1_END + 0.2 - 171.9} />
    </At>
    <SfxTrack cues={SFX_B1} />
  </AbsoluteFill>
);

/** Fondu de sortie simple (temps relatifs à la séquence). */
const FadeOut: React.FC<{ at: number; end: number; children: React.ReactNode }> = ({ at, end, children }) => {
  const t = useT();
  return <AbsoluteFill style={{ opacity: interpolate(t, [at, end], [1, 0], clamp) }}>{children}</AbsoluteFill>;
};

// ─── Avant / après : le même site, rouge puis noir et blanc (rideau) ───
const WIN_SITE = { x: 118, y: 172, w: 1683, h: 843 };
const BeforeAfter: React.FC<{ end: number }> = ({ end }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.35, 0.4);
  // Images fixes de la capture (zone du site) : source 294,5 (rouge) et 416,0 (noir et blanc), côte à côte
  const w = 860;
  const h = (WIN_SITE.h / WIN_SITE.w) * w;
  const top = 310;
  const card = (file: string, x: number, at: number, label: string, hl: boolean) => (
    <div style={{ position: "absolute", left: x, top, width: w, ...blurIn(t, at, 0.55, 30) }}>
      <div style={{ width: w, height: h, borderRadius: 24, overflow: "hidden", border: `${hl ? 3 : 1.5}px solid ${hl ? LIME : LINE}`, boxShadow: hl ? `0 0 60px rgba(198,243,109,0.25)` : "0 40px 90px -30px rgba(0,0,0,0.8)" }}>
        <Img src={staticFile(`montage/hostinger/${file}`)} style={{ width: w, height: h }} />
      </div>
      <div style={{ marginTop: 26, textAlign: "center", fontSize: 44, fontWeight: 500, color: hl ? INK : MUTED, letterSpacing: "-0.02em" }}>{rich(label)}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <Backdrop />
      <div style={{ position: "absolute", top: 190, width: W, textAlign: "center", ...blurIn(t, 0.1) }}>
        <Eyebrow size={34}>Un seul prompt</Eyebrow>
      </div>
      {card("site_rouge.png", 80, 0.2, "Avant · noir et rouge", false)}
      {card("site_nb.png", W - 80 - w, 1.3, "Après · *noir et blanc*", true)}
      <Grain />
    </AbsoluteFill>
  );
};

// ─── Écran de fin : emplacement de la vidéo YouTube (élément d'écran de fin) + code ───
// Vidéo liée (choix d'Ibrahim) : « J'ai créé cette pub en quelques minutes avec l'IA », youtu.be/tnSOLVdEio0
const EndCard: React.FC<{ end: number }> = ({ end }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.6, 0.6);
  const b = blurIn(t, 0.3, 0.55, 26);
  const VW = 720;
  const VH = 405;
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, transparent 38%, rgba(9,11,8,0.82) 60%, rgba(9,11,8,0.92) 100%)" }} />
      <div style={{ position: "absolute", right: 100, top: 200, width: VW, ...b }}>
        <Eyebrow size={30}>Ma vidéo sur la publicité</Eyebrow>
        <div style={{ fontSize: 54, fontWeight: 500, color: INK, letterSpacing: "-0.03em", lineHeight: 1.1, margin: "12px 0 26px" }}>{rich("J'ai créé cette *pub* en quelques minutes avec l'IA")}</div>
        {/* Zone réservée à l'élément « vidéo » de l'écran de fin YouTube (16:9) */}
        <div style={{ width: VW, height: VH, borderRadius: 24, border: `3px dashed ${LIME}`, background: "rgba(198,243,109,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={90} height={90} viewBox="0 0 24 24" fill={LIME} opacity={0.8}>
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      <div style={{ position: "absolute", right: 100, top: 200 + 150 + VH + 40, width: VW, display: "flex", justifyContent: "center", ...blurIn(t, 1.2) }}>
        <div style={{ ...glass, background: "linear-gradient(180deg, rgba(18,22,15,0.94), rgba(18,22,15,0.88))", borderRadius: 999, padding: "16px 30px", fontSize: 40, fontWeight: 500, color: INK, letterSpacing: "-0.015em", whiteSpace: "nowrap" }}>
          {rich("Code *KAMARA7* · lien en description")}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══ Bloc 2 · Étapes 3 à 5 (le site, modifier, publier) + clients et fin (4:27,2 → 8:39,7) ═══
const B2 = B1_END; // 267,2
const B2_END = FULL_DURATION;
const s2 = (T: number) => T - B2;
const V_PROMPT2 = view(1.6, 708, 689); // champ de saisie du chat (centre (370, 920) ramené par le blocage)
const V_DOM = view(1.4, 915, 529);
const BA: [number, number] = [397.0, 403.8];

const SFX_B2: SfxCue[] = [
  { k: "whoosh03", at: 267.1 }, // étape 3
  { k: "confirmNotif13", at: 267.5, gain: 0.7 },
  { k: "popSelectA", at: 274.4 },
  { k: "whoosh05", at: 279.3 }, // chiffres
  { k: "popSelectB", at: 281.9 },
  { k: "popNotif03", at: 285.3, gain: 0.6 },
  { k: "popSelectA", at: 300.3 },
  { k: "popSelectA", at: 324.1 },
  { k: "popSelectB", at: 336.0 },
  { k: "popSelectA", at: 340.1 },
  { k: "popSelectB", at: 345.0 },
  { k: "popSelectA", at: 348.6 },
  { k: "whoosh01", at: 350.2 }, // face cam
  { k: "whoosh02", at: 350.5 },
  { k: "popNotif02", at: 359.5 },
  { k: "whoosh03", at: 364.8 }, // étape 4
  { k: "confirmNotif13", at: 365.3, gain: 0.7 },
  { k: "whoosh05", at: 379.6 }, // prompt
  { k: "whoosh02", at: 386.1 },
  { k: "riserWhoosh", at: 397.0 - 2.66 + 1.6, gain: 0.5 }, // avant/après : le rideau
  { k: "impactBig", at: 398.5, gain: 0.25 },
  { k: "whoosh03", at: 413.6 }, // étape 5
  { k: "confirmNotif13", at: 414.0, gain: 0.7 },
  { k: "clickA", at: 415.7 }, // Publier
  { k: "confirmAchievement", at: 418.0, gain: 0.7 }, // publié
  { k: "popSelectA", at: 419.7 },
  { k: "popSelectB", at: 440.1 },
  { k: "whoosh05", at: 447.9 },
  { k: "popNotif02", at: 449.5 },
  { k: "whoosh01", at: 455.5 }, // face cam jusqu'à la fin
  { k: "popNotif03", at: 475.0, gain: 0.6 },
  { k: "popSelectA", at: 480.4 },
  { k: "popSelectB", at: 488.0 },
  { k: "whoosh02", at: 499.4 }, // la publicité
  { k: "whoosh03", at: 509.5 }, // écran de fin
];

const SECTIONS: [number, number, number, string][] = [
  [274.3, 279.2, 1, "Accueil"],
  [281.8, 286.4, 2, "Services"],
  [300.2, 305.0, 3, "Galerie"],
  [324.0, 329.0, 2, "Services"],
  [335.9, 339.8, 3, "Galerie"],
  [340.0, 344.7, 4, "À propos"],
  [344.9, 348.3, 5, "Contact"],
  [348.5, 350.2, 6, "Carte"],
];

const Block2: React.FC = () => (
  <AbsoluteFill>
    <At from={B2} to={B2_END}>
      <ScreenStage
        src={SCREEN}
        trimBefore={src(B2)}
        win={WIN_APP}
        keys={[
          { t: 0, z: 1.0, cx: 960, cy: 540 },
          { t: s2(279.0), z: 1.0, cx: 960, cy: 540 },
          { t: s2(280.0), z: 1.25, cx: 960, cy: 480 },
          { t: s2(281.6), z: 1.25, cx: 960, cy: 480 },
          { t: s2(282.6), z: 1.0, cx: 960, cy: 540 },
          { t: s2(300.0), z: 1.04, cx: 960, cy: 560 },
          { t: s2(321.0), z: 1.0, cx: 960, cy: 540 },
          { t: s2(379.4), z: 1.0, cx: 960, cy: 540 },
          { t: s2(380.6), z: 1.6, cx: 370, cy: 920 },
          { t: s2(385.0), z: 1.6, cx: 370, cy: 920 },
          { t: s2(386.2), z: 1.0, cx: 960, cy: 540 },
          { t: s2(447.6), z: 1.0, cx: 960, cy: 540 },
          { t: s2(448.6), z: 1.4, cx: 915, cy: 529 },
          { t: s2(455.0), z: 1.4, cx: 915, cy: 529 },
          { t: s2(456.0), z: 1.0, cx: 960, cy: 540 },
        ]}
      />
    </At>

    {SECTIONS.map(([a, b, n, label]) => (
      <At key={`${a}`} from={a} to={b}>
        <StepLT n={n} text={label} end={b - a} />
      </At>
    ))}
    <At from={285.2} to={289.6}>
      <TopPill text="Images *générées par l'IA*" end={289.6 - 285.2} />
    </At>

    {/* Étape 4 : le prompt de modification, puis l'avant / après */}
    <At from={380.8} to={385.0}>
      <Spotlight {...V_PROMPT2(118, 870, 505, 82)} end={385.0 - 380.8} />
    </At>
    <At from={386.2} to={392.8}>
      <PromptCard tool="Hostinger" end={392.8 - 386.2} parts={[{ text: "J'aimerais que tu changes les couleurs principales. " }, { text: "Là, on est sur du noir/rouge.", label: "Avant : noir et rouge", at: 0.8 }, { text: " J'aimerais du " }, { text: "noir/blanc.", label: "Après : noir et blanc", at: 2.2 }]} />
    </At>
    {/* Étape 5 : publier, URL temporaire, domaine */}
    <At from={415.6} to={417.9}>
      <Spotlight {...V1(1722, 66, 80, 38)} caption="Publier" end={417.9 - 415.6} />
    </At>
    <At from={419.6} to={423.2}>
      <Spotlight {...V1(660, 432, 600, 88)} caption="URL temporaire" end={423.2 - 419.6} />
    </At>
    <At from={440.0} to={443.4}>
      <Spotlight {...V1(660, 532, 600, 112)} caption="Domaine personnalisé" end={443.4 - 440.0} />
    </At>
    <At from={449.4} to={455.4}>
      <Spotlight {...V_DOM(380, 508, 1070, 42)} end={455.4 - 449.4} />
      <TopPill text="Ton domaine : *marseilleauto.com*" end={455.4 - 449.4} />
    </At>

    {/* Face cam : médaillon, plein cadre pendant le bilan (écran figé), puis plein cadre jusqu'à la fin (page domaine figée 70 s) */}
    <At from={B2} to={B2_END}>
      <FacePip
        src={FACE}
        trimBefore={src(B2)}
        face={FACE_POS}
        grade={GRADE}
        keys={[
          { t: 0, p: 1 },
          { t: s2(350.3), p: 1 },
          { t: s2(351.2), p: 0 },
          { t: s2(364.4), p: 0 },
          { t: s2(365.3), p: 1 },
          { t: s2(455.6), p: 1 },
          { t: s2(456.5), p: 0 },
        ]}
        zoomKeys={[
          { t: 0, z: 1.0 },
          { t: s2(351.2), z: 1.0 },
          { t: s2(364.4), z: 1.06 },
          { t: s2(456.5), z: 1.0 },
          { t: s2(480.0), z: 1.05 },
          { t: s2(509.0), z: 1.08 },
          { t: s2(B2_END), z: 1.04 },
        ]}
      />
    </At>

    {/* Avant / après : au-dessus du médaillon */}
    <At from={BA[0]} to={BA[1]}>
      <BeforeAfter end={BA[1] - BA[0]} />
    </At>

    {/* Sur la face cam */}
    <At from={350.6} to={354.6}>
      <Scrim end={354.6 - 350.6} />
      <KeyLineWords end={354.6 - 350.6} words={[{ w: "en", t: 0.15 }, { w: "un", t: 0.3 }, { w: "seul", t: 0.45, hl: true }, { w: "prompt", t: 0.75 }]} />
    </At>
    <At from={359.4} to={363.0}>
      <TopPill text="*20 sites* par jour" end={363.0 - 359.4} />
    </At>
    <At from={474.9} to={479.4}>
      <TopPill text="*Abonne-toi* pour la suite" end={479.4 - 474.9} />
    </At>
    <At from={480.0} to={494.8}>
      <Scrim end={494.8 - 480.0} />
      <TwoPills
        end={494.8 - 480.0}
        items={[
          { text: "Ton propre site", at: 0.3 },
          { text: "Une agence de sites", at: 487.9 - 480.0 },
        ]}
      />
    </At>
    <At from={499.3} to={503.8}>
      <Scrim end={503.8 - 499.3} />
      <KeyLineWords end={503.8 - 499.3} words={[{ w: "la", t: 0.2 }, { w: "publicité", t: 0.4, hl: true }]} />
    </At>
    <At from={509.6} to={B2_END}>
      <EndCard end={B2_END - 509.6} />
    </At>

    {/* Pastilles de chapitre */}
    <At from={267.4} to={365.0}>
      <ChapterPill n={3} total={5} title="Le site" end={365.0 - 267.4} />
    </At>
    <At from={365.2} to={413.6}>
      <ChapterPill n={4} total={5} title="Modifier" end={413.6 - 365.2} />
    </At>
    <At from={413.9} to={456.0}>
      <ChapterPill n={5} total={5} title="Publier" end={456.0 - 413.9} />
    </At>
    <SfxTrack cues={SFX_B2} />
  </AbsoluteFill>
);

const KeyLineWords: React.FC<{ end: number; words: { w: string; t: number; hl?: boolean }[] }> = ({ end, words }) => <KeyLine end={end} size={110} words={words} />;

export const MontageHostinger: React.FC = () => (
  <AbsoluteFill style={{ background: "black" }}>
    <Sequence from={0} durationInFrames={f(HOOK_END + 0.5)}>
      <MontageHostingerHook embedded />
    </Sequence>
    <Block1 />
    <Block2 />
    <Audio src={staticFile("montage/hostinger/voice_full.wav")} />
    <MusicTrack />
    <Grain />
  </AbsoluteFill>
);

