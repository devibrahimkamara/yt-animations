// Composants du playbook v2 (positionnement « le cobaye », 29 octobre 2026) : tests et défis chiffrés.
// Tous les chiffres viennent du registre du test (registre.json) : aucun montant n'est tapé à la main
// dans une composition (PLAYBOOK règles 15 à 17, § 3, § 4.4, § 4.7 à 4.9, § 14).
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, staticFile } from "remotion";
import {
  BAD,
  BG,
  blurIn,
  EASE,
  Eyebrow,
  FONT,
  GOOD,
  glass,
  INK,
  INK_SOFT,
  inOut,
  keyed,
  LIME,
  LIME_CARD,
  LINE,
  MUTED,
  rich,
  SfxCue,
  useT,
} from "./lib";

// ─── Le registre du test ─────────────────────────────────────────────────────
/** Une ligne du registre : une dépense, un gain ou un palier, avec la capture qui le prouve. */
export type RegistreEntry = {
  /** Instant (s, timeline) où la ligne apparaît à l'écran. */
  t: number;
  /** Date réelle de l'événement (AAAA-MM-JJ), pour le dossier du test. */
  date?: string;
  /** Libellé court (« Achat du nom de domaine »). */
  label: string;
  /** Montant en euros : positif = gain, négatif = dépense. Absent pour un palier sans argent. */
  amount?: number;
  kind: "gain" | "depense" | "palier";
  /** Numéro du jour (« Jour 3 ») ou de la tentative atteint à cet instant. */
  jour?: number;
  /** Fichier de preuve (capture ou rush), obligatoire pour un montant (PLAYBOOK [PROOF-OWNER]). */
  capture?: string;
};
export type Registre = {
  titre: string;
  /** Budget de départ en euros (« 100 € à l'IA »). */
  budget?: number;
  /** Objectif en euros (« 500 € »). */
  objectif?: number;
  /** Nombre total de jours (« 7 ») ou de tentatives. */
  jours?: number;
  /** « Jour » ou « Tentative ». */
  unite?: "Jour" | "Tentative";
  regles?: string[];
  entries: RegistreEntry[];
};

/** Vérifie la règle « aucun montant sans capture ». À appeler au chargement du registre. */
export const checkRegistre = (r: Registre): string[] =>
  r.entries.flatMap((e, i) => (e.amount !== undefined && !e.capture ? [`ligne ${i} (« ${e.label} ») : montant sans capture`] : []));

/** État du test à l'instant t (s) : ce qui est affiché ne dépend que des lignes déjà apparues. */
export const etatAt = (r: Registre, t: number) => {
  const seen = r.entries.filter((e) => e.t <= t);
  const gains = seen.reduce((s, e) => s + (e.amount && e.amount > 0 ? e.amount : 0), 0);
  const depenses = seen.reduce((s, e) => s + (e.amount && e.amount < 0 ? -e.amount : 0), 0);
  const jour = seen.reduce((j, e) => (e.jour !== undefined ? e.jour : j), 0);
  const last = seen[seen.length - 1];
  return { gains, depenses, net: gains - depenses, reste: (r.budget ?? 0) - depenses + gains, jour, last, lastT: last?.t ?? -1 };
};

/** « 1 234,56 € » (règle 17 : euros uniquement). Les centimes ne s'affichent que s'il y en a. */
export const eur = (n: number, sign = false) => {
  const abs = Math.abs(n);
  const cents = Math.round(abs * 100) % 100 !== 0;
  const s = abs.toLocaleString("fr-FR", { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: 2 });
  return `${sign ? (n < 0 ? "−" : "+") : n < 0 ? "−" : ""}${s} €`;
};

/** Repères sonores du registre : un son par ligne, calé sur son apparition. */
export const registreCues = (r: Registre): SfxCue[] =>
  r.entries.map((e) => ({ k: e.kind === "gain" ? "confirmNotif13" : e.kind === "depense" ? "popNotif12" : "popSelectA", at: e.t }));

/** Valeur qui roule vers sa nouvelle valeur en 0,6 s après chaque mise à jour du registre. */
const useRolling = (target: number, previous: number, since: number) => {
  const t = useT();
  const p = keyed(t, [since, since + 0.6], [0, 1], Easing.out(Easing.cubic));
  const v = previous + (target - previous) * p;
  // Pendant le roulement, pas de centimes parasites si les deux valeurs sont rondes.
  return Number.isInteger(previous) && Number.isInteger(target) ? Math.round(v) : v;
};
const prevValue = (r: Registre, t: number, pick: (e: ReturnType<typeof etatAt>) => number) => {
  const now = etatAt(r, t);
  return { now: pick(now), before: pick(etatAt(r, now.lastT - 0.001)), since: now.lastT };
};

// ─── [DEFI-BOARD] Le Tableau du défi ─────────────────────────────────────────
/** Plein écran : règles, compteur montant / objectif, jour. `freezeAt` = verdict : le chiffre se fige en lime. */
export const DefiBoard: React.FC<{
  registre: Registre;
  end: number;
  /** Ce que montre le grand compteur : gains nets (défaut), ce qui reste du budget, ou les dépenses. */
  show?: "net" | "reste" | "depenses";
  freezeAt?: number;
  rulesAt?: number;
}> = ({ registre: r, end, show = "net", freezeAt, rulesAt = 0.3 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.4, 0.4);
  const pick = (e: ReturnType<typeof etatAt>) => (show === "net" ? e.net : show === "reste" ? e.reste : e.depenses);
  const v = prevValue(r, t, pick);
  const value = useRolling(v.now, v.before, v.since);
  const e = etatAt(r, t);
  const goal = show === "net" ? r.objectif : show === "reste" ? r.budget : undefined;
  const ratio = goal ? Math.max(0, Math.min(1, value / goal)) : 0;
  const frozen = freezeAt !== undefined && t >= freezeAt;
  const pulse = frozen ? keyed(t, [freezeAt!, freezeAt! + 0.25, freezeAt! + 0.7], [1, 1.06, 1], EASE) : 1;
  const label = show === "net" ? "Gagné (net)" : show === "reste" ? "Il reste" : "Dépensé";
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT, color: INK, justifyContent: "center", alignItems: "center" }}>
      <div style={{ ...glass, borderRadius: 40, padding: "56px 72px", width: 1400, ...blurIn(t, 0, 0.5, 24) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <Eyebrow size={32}>{r.titre}</Eyebrow>
          {r.jours !== undefined && (
            <div style={{ fontSize: 40, fontWeight: 500, color: INK_SOFT, fontVariantNumeric: "tabular-nums" }}>
              {r.unite ?? "Jour"} <span style={{ color: LIME }}>{Math.max(e.jour, 1)}</span>/{r.jours}
            </div>
          )}
        </div>
        {r.regles && r.regles.length > 0 && (
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 26 }}>
            {r.regles.map((g, i) => (
              <div key={i} style={{ ...blurIn(t, rulesAt + i * 0.25), padding: "10px 22px", borderRadius: 999, border: `1.5px solid ${LINE}`, fontSize: 30, color: INK_SOFT }}>
                {rich(g)}
              </div>
            ))}
          </div>
        )}
        <div style={{ marginTop: 40, fontSize: 30, letterSpacing: "0.14em", textTransform: "uppercase", color: MUTED }}>{label}</div>
        <div
          style={{
            fontSize: 220,
            fontWeight: 500,
            letterSpacing: "-0.045em",
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
            color: frozen ? LIME : INK,
            transform: `scale(${pulse})`,
            transformOrigin: "left center",
            textShadow: frozen ? "0 0 80px rgba(198,243,109,0.35)" : undefined,
          }}
        >
          {eur(value)}
          {goal !== undefined && <span style={{ fontSize: 90, color: MUTED, letterSpacing: "-0.02em" }}> / {eur(goal)}</span>}
        </div>
        {goal !== undefined && (
          <div style={{ marginTop: 30, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
            <div style={{ width: `${ratio * 100}%`, height: "100%", borderRadius: 7, background: LIME, boxShadow: `0 0 24px ${LIME}` }} />
          </div>
        )}
        {e.last && (
          <div key={e.lastT} style={{ marginTop: 26, fontSize: 34, color: INK_SOFT, ...blurIn(t, e.lastT, 0.4, 10) }}>
            {e.last.amount !== undefined && (
              <span style={{ color: e.last.amount >= 0 ? GOOD : BAD, fontWeight: 500, marginRight: 14, fontVariantNumeric: "tabular-nums" }}>{eur(e.last.amount, true)}</span>
            )}
            {e.last.label}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ─── [CHAPTER-PILL] v2 : « Jour 3/7 · 48 € / 100 € » ─────────────────────────
/** Pastille permanente en haut à gauche, toujours au même endroit (checklist : position des compteurs figée). */
export const DayPill: React.FC<{ registre: Registre; end: number; show?: "net" | "reste"; top?: number; left?: number; scale?: number }> = ({
  registre: r,
  end,
  show = "net",
  top = 36,
  left = 44,
  scale = 1,
}) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.5, 0.4);
  const e = etatAt(r, t);
  const v = prevValue(r, t, (x) => (show === "net" ? x.net : x.reste));
  const value = useRolling(v.now, v.before, v.since);
  const goal = show === "net" ? r.objectif : r.budget;
  const total = r.jours ?? 0;
  const flash = keyed(t, [e.lastT, e.lastT + 0.15, e.lastT + 0.8], [0, 1, 0], EASE);
  return (
    <div style={{ position: "absolute", left, top, opacity: o, transform: `translateY(${(1 - o) * -10}px) scale(${scale})`, transformOrigin: "left top" }}>
      <div
        style={{
          ...glass,
          background: "linear-gradient(180deg, rgba(18,22,15,0.9), rgba(18,22,15,0.8))",
          boxShadow: `0 0 ${30 * flash}px rgba(198,243,109,${0.5 * flash})`,
          borderRadius: 999,
          padding: "14px 26px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontFamily: FONT,
        }}
      >
        {total > 0 && (
          <span style={{ fontSize: 26, letterSpacing: "0.14em", textTransform: "uppercase", color: LIME, fontWeight: 500 }}>
            {r.unite ?? "Jour"} {Math.max(e.jour, 1)}/{total}
          </span>
        )}
        {total > 0 && <span style={{ width: 1, height: 24, background: LINE }} />}
        <span style={{ fontSize: 32, color: INK, fontWeight: 500, letterSpacing: "-0.01em", fontVariantNumeric: "tabular-nums" }}>
          {eur(value)}
          {goal !== undefined && <span style={{ color: MUTED }}> / {eur(goal)}</span>}
        </span>
        {total > 0 && (
          <span style={{ display: "flex", gap: 5, marginLeft: 6 }}>
            {Array.from({ length: total }, (_, i) => (
              <span key={i} style={{ width: 18, height: 5, borderRadius: 3, background: i < Math.max(e.jour, 1) ? LIME : "rgba(255,255,255,0.18)" }} />
            ))}
          </span>
        )}
      </div>
    </div>
  );
};

// ─── [TIMER] Chrono réel ─────────────────────────────────────────────────────
/** Ancre horaire : à l'instant `t` de la timeline, l'horloge réelle du tournage valait `clock` (s depuis minuit).
 *  `rate` = vitesse de lecture du rush à partir de là (1 = temps réel, 60 = accéléré ×60). Chaque coupe = une ancre. */
export type ClockAnchor = { t: number; clock: number; rate?: number };
/** « 09:14:05 » → secondes depuis minuit (lu dans l'horodatage des rushes). */
export const hms = (s: string) => s.split(":").map(Number).reduce((a, n) => a * 60 + n, 0);
const realClock = (anchors: ClockAnchor[], t: number) => {
  const a = [...anchors].reverse().find((x) => x.t <= t) ?? anchors[0];
  return a.clock + Math.max(0, t - a.t) * (a.rate ?? 1);
};
const fmtDur = (s: number) => {
  const v = Math.max(0, Math.floor(s));
  const h = Math.floor(v / 3600), m = Math.floor((v % 3600) / 60), sec = v % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}` : `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};
/** Chrono calé sur l'heure réelle du tournage (PLAYBOOK § 4.8) : jamais recalculé ni arrangé au montage.
 *  mode "restant" = compte à rebours depuis `startClock` sur `limit` secondes ; "ecoule" = temps passé. */
export const Timer: React.FC<{
  anchors: ClockAnchor[];
  startClock: number;
  limit?: number;
  mode?: "restant" | "ecoule";
  end: number;
  label?: string;
  style?: React.CSSProperties;
}> = ({ anchors, startClock, limit = 0, mode = "restant", end, label, style }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.4, 0.4);
  const clock = realClock(anchors, t);
  const elapsed = clock - startClock;
  const shown = mode === "restant" ? limit - elapsed : elapsed;
  const urgent = mode === "restant" && shown <= Math.min(600, limit * 0.1);
  const speed = ([...anchors].reverse().find((x) => x.t <= t)?.rate ?? 1) > 1;
  return (
    <div style={{ position: "absolute", right: 44, top: 36, opacity: o, fontFamily: FONT, ...style }}>
      <div style={{ ...glass, background: "linear-gradient(180deg, rgba(18,22,15,0.9), rgba(18,22,15,0.8))", borderRadius: 24, padding: "14px 28px", textAlign: "right" }}>
        {label && <div style={{ fontSize: 22, letterSpacing: "0.14em", textTransform: "uppercase", color: MUTED }}>{label}</div>}
        <div style={{ fontSize: 64, fontWeight: 500, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums", color: urgent ? BAD : INK }}>
          {fmtDur(shown)}
        </div>
        {speed && <div style={{ fontSize: 22, color: LIME, letterSpacing: "0.08em" }}>⏩ accéléré</div>}
      </div>
    </div>
  );
};

// ─── [PLAN-VS-RESULT] Prévu / obtenu ─────────────────────────────────────────
/** Un média (image ou vidéo selon l'extension) ou un nœud React. */
export type Media = string | React.ReactNode;
const MediaView: React.FC<{ m: Media; w: number; h: number }> = ({ m, w, h }) => {
  if (typeof m !== "string") return <div style={{ width: w, height: h, borderRadius: 26, overflow: "hidden" }}>{m}</div>;
  const st: React.CSSProperties = { width: w, height: h, borderRadius: 26, objectFit: "cover", display: "block" };
  return /\.(mp4|mov|webm)$/i.test(m) ? <OffthreadVideo src={staticFile(m)} muted style={st} /> : <Img src={staticFile(m)} style={st} />;
};
/** Prévu à gauche, obtenu à droite, au même instant (généralise ResultDuo, PLAYBOOK § 4.4).
 *  `checks` = repères du plan, cochés ✓ ou ✗ au fil de la vidéo. */
export const PlanVsResult: React.FC<{
  plan: Media;
  result: Media;
  end: number;
  planLabel?: string;
  resultLabel?: string;
  vertical?: boolean;
  checks?: { at: number; label: string; ok: boolean }[];
}> = ({ plan, result, end, planLabel = "Prévu", resultLabel = "Obtenu", vertical, checks = [] }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.35, 0.35);
  const [w, h] = vertical ? [460, 818] : [820, 461];
  const panel = (m: Media, label: string, delay: number, accent: boolean) => (
    <div style={{ ...blurIn(t, delay, 0.5, 26), textAlign: "center" }}>
      <div style={{ ...glass, borderRadius: 30, padding: 10, borderColor: accent ? "rgba(198,243,109,0.45)" : LINE }}>
        <MediaView m={m} w={w} h={h} />
      </div>
      <div style={{ marginTop: 16, fontSize: 30, letterSpacing: "0.14em", textTransform: "uppercase", color: accent ? LIME : MUTED, fontWeight: 500 }}>{label}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT, color: INK, justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 60, alignItems: "flex-start" }}>
        {panel(plan, planLabel, 0.05, false)}
        {panel(result, resultLabel, 0.25, true)}
      </div>
      {checks.length > 0 && (
        <div style={{ display: "flex", gap: 16, marginTop: 34, flexWrap: "wrap", justifyContent: "center", maxWidth: 1700 }}>
          {checks.map((c, i) => (
            <div key={i} style={{ ...blurIn(t, c.at, 0.35, 10), padding: "10px 22px", borderRadius: 999, border: `1.5px solid ${c.ok ? GOOD : BAD}66`, fontSize: 30 }}>
              <span style={{ color: c.ok ? GOOD : BAD, fontWeight: 600, marginRight: 10 }}>{c.ok ? "✓" : "✗"}</span>
              {c.label}
            </div>
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─── [VERDICT-TAG] Étiquette de verdict ──────────────────────────────────────
/** Étiquette sobre, posée comme un tampon (léger dépassement d'échelle). Même traitement succès / échec (règle 12). */
export const VerdictTag: React.FC<{ label: string; ok: boolean; at: number; end: number; size?: number; x?: number; y?: number; rotate?: number }> = ({
  label,
  ok,
  at,
  end,
  size = 96,
  x,
  y,
  rotate = -4,
}) => {
  const t = useT();
  const o = inOut(t, at, end, 0.2, 0.35);
  const s = keyed(t, [at, at + 0.18, at + 0.4], [1.35, 0.96, 1], EASE);
  const c = ok ? GOOD : BAD;
  const pos: React.CSSProperties = x !== undefined && y !== undefined ? { position: "absolute", left: x, top: y } : {};
  const tag = (
    <div
      style={{
        ...pos,
        opacity: o,
        transform: `rotate(${rotate}deg) scale(${s})`,
        fontFamily: FONT,
        fontSize: size,
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color: c,
        border: `${Math.max(4, size / 18)}px solid ${c}`,
        borderRadius: size * 0.22,
        padding: `${size * 0.12}px ${size * 0.38}px`,
        background: `rgba(9,11,8,0.72)`,
        boxShadow: `0 0 ${size * 0.6}px ${c}33`,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
  );
  return x !== undefined ? <AbsoluteFill style={{ pointerEvents: "none" }}>{tag}</AbsoluteFill> : <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>{tag}</AbsoluteFill>;
};

// ─── [LOWER-THIRD] Bandeau d'interview ───────────────────────────────────────
/** Prénom · métier · ville (PLAYBOOK § 4.7). Le montant arrive au moment où il est dit, en euros. */
export const LowerThird: React.FC<{
  prenom: string;
  metier: string;
  ville?: string;
  end: number;
  montant?: { value: number; at: number; label?: string };
  vertical?: boolean;
}> = ({ prenom, metier, ville, end, montant, vertical }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.4, 0.35);
  const roll = montant ? keyed(t, [montant.at, montant.at + 0.9], [0, 1], Easing.out(Easing.cubic)) : 0;
  const pos: React.CSSProperties = vertical ? { left: 60, top: 1920 * 0.62 } : { left: 80, bottom: 110 };
  return (
    <div style={{ position: "absolute", ...pos, opacity: o, fontFamily: FONT, color: INK }}>
      <div style={{ display: "flex", alignItems: "stretch", gap: 0, ...blurIn(t, 0, 0.45, 16) }}>
        <div style={{ width: 8, borderRadius: 4, background: LIME, boxShadow: `0 0 18px ${LIME}` }} />
        <div style={{ ...glass, background: "linear-gradient(180deg, rgba(18,22,15,0.92), rgba(18,22,15,0.85))", borderRadius: "0 24px 24px 0", padding: "16px 30px" }}>
          <div style={{ fontSize: vertical ? 54 : 48, fontWeight: 500, letterSpacing: "-0.02em" }}>{prenom}</div>
          <div style={{ fontSize: vertical ? 34 : 30, color: INK_SOFT }}>
            {metier}
            {ville && <span style={{ color: MUTED }}> · {ville}</span>}
          </div>
          {montant && t >= montant.at && (
            <div style={{ marginTop: 10, ...blurIn(t, montant.at, 0.35, 10) }}>
              <span style={{ ...LIME_CARD, borderRadius: 14, padding: "4px 16px", fontSize: vertical ? 46 : 40, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                {eur(montant.value * roll)}
              </span>
              {montant.label && <span style={{ marginLeft: 12, fontSize: 28, color: INK_SOFT }}>{montant.label}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── [BIG-WORDS] Sous-titres « un mot géant à la fois » ──────────────────────
export type CapWord = { w: string; t: number; hl?: boolean };
/** Un mot à la fois, très gros, au centre (micro-trottoir C6, interviews). Chaque mot reste jusqu'au suivant
 *  (au plus `maxHold` s). `y` = centre vertical (en 9:16, rester entre 15 % et 75 % de la hauteur). */
export const BigWordCaptions: React.FC<{ words: CapWord[]; size?: number; y?: number; maxHold?: number }> = ({ words, size = 150, y, maxHold = 1.2 }) => {
  const t = useT();
  const i = words.reduce((k, w, j) => (w.t <= t ? j : k), -1);
  if (i < 0) return null;
  const w = words[i];
  const next = words[i + 1]?.t ?? w.t + maxHold;
  if (t > Math.min(next, w.t + maxHold)) return null;
  const pop = keyed(t, [w.t, w.t + 0.08, w.t + 0.18], [0.82, 1.06, 1], EASE);
  return (
    <AbsoluteFill style={{ justifyContent: y === undefined ? "center" : "flex-start", alignItems: "center", pointerEvents: "none" }}>
      <div
        style={{
          marginTop: y !== undefined ? y - size * 0.6 : 0,
          fontFamily: FONT,
          fontSize: size,
          fontWeight: 600,
          letterSpacing: "-0.03em",
          color: w.hl ? LIME : INK,
          transform: `scale(${pop})`,
          textTransform: "uppercase",
          WebkitTextStroke: `${size / 30}px ${BG}`,
          paintOrder: "stroke fill",
          textShadow: "0 6px 30px rgba(0,0,0,0.7)",
          whiteSpace: "nowrap",
        }}
      >
        {w.w}
      </div>
    </AbsoluteFill>
  );
};

// ─── [VERTICAL] Gabarit 9:16 ─────────────────────────────────────────────────
/** Format vertical (PLAYBOOK § 14) : 1080×1920, texte entre 15 % et 75 % de la hauteur, marges droite (boutons) et bas (légende). */
export const VW = 1080;
export const VH = 1920;
export const V_SAFE = { top: Math.round(VH * 0.15), bottom: Math.round(VH * 0.75), left: 60, right: VW - 150 } as const;
/** Cadre vertical : fond, contenu, et repères de zone sûre (`guides`) à afficher seulement pendant les contrôles. */
export const VerticalMaster: React.FC<{ children: React.ReactNode; guides?: boolean; background?: React.ReactNode }> = ({ children, guides, background }) => (
  <AbsoluteFill style={{ background: BG }}>
    {background}
    {children}
    {guides && (
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: V_SAFE.left, top: V_SAFE.top, width: V_SAFE.right - V_SAFE.left, height: V_SAFE.bottom - V_SAFE.top, border: "3px dashed rgba(255,80,80,0.8)" }} />
        <div style={{ position: "absolute", left: V_SAFE.left, top: V_SAFE.top - 40, fontFamily: FONT, fontSize: 26, color: "rgba(255,80,80,0.9)" }}>zone sûre du texte</div>
      </AbsoluteFill>
    )}
  </AbsoluteFill>
);
/** Bloc de texte placé dans la zone sûre : `at` = position verticale (0 = haut de la zone, 1 = bas).
 *  `center` = texte centré sur l'écran : marges symétriques (celle de droite, la plus large, des deux côtés). */
export const SafeText: React.FC<{ children: React.ReactNode; at?: number; center?: boolean; style?: React.CSSProperties }> = ({ children, at = 0, center, style }) => (
  <div
    style={{
      position: "absolute",
      left: center ? VW - V_SAFE.right : V_SAFE.left,
      width: center ? V_SAFE.right - (VW - V_SAFE.right) : V_SAFE.right - V_SAFE.left,
      textAlign: center ? "center" : undefined,
      top: V_SAFE.top + (V_SAFE.bottom - V_SAFE.top) * at,
      fontFamily: FONT,
      color: INK,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Compteur vertical plein écran (C9 « compteur sans voix », C3 « Jour N ») : chiffre héros + dernière ligne du registre. */
export const VerticalCounter: React.FC<{ registre: Registre; end: number; show?: "net" | "reste" | "depenses"; accroche?: string; freezeAt?: number }> = ({
  registre: r,
  end,
  show = "reste",
  accroche,
  freezeAt,
}) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.3);
  const pick = (e: ReturnType<typeof etatAt>) => (show === "net" ? e.net : show === "reste" ? e.reste : e.depenses);
  const v = prevValue(r, t, pick);
  const value = useRolling(v.now, v.before, v.since);
  const e = etatAt(r, t);
  const frozen = freezeAt !== undefined && t >= freezeAt;
  const goal = show === "net" ? r.objectif : undefined;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      {accroche && (
        <SafeText at={0} center style={{ fontSize: 64, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.12, ...blurIn(t, 0, 0.4, 14) }}>
          {rich(accroche)}
        </SafeText>
      )}
      {r.jours !== undefined && (
        <SafeText at={0.24} center>
          <Eyebrow size={36}>
            {r.unite ?? "Jour"} {Math.max(e.jour, 1)}/{r.jours}
          </Eyebrow>
        </SafeText>
      )}
      <SafeText at={0.32} center>
        <div style={{ fontSize: 200, fontWeight: 500, letterSpacing: "-0.05em", lineHeight: 1, fontVariantNumeric: "tabular-nums", color: frozen ? LIME : INK, textShadow: frozen ? "0 0 70px rgba(198,243,109,0.4)" : undefined }}>
          {eur(value)}
        </div>
        {goal !== undefined && <div style={{ fontSize: 56, color: MUTED, marginTop: 8 }}>objectif {eur(goal)}</div>}
      </SafeText>
      {e.last && (
        <SafeText at={0.62} center style={{ fontSize: 46, color: INK_SOFT, ...blurIn(t, e.lastT, 0.35, 10) }}>
          {e.last.amount !== undefined && (
            <span style={{ color: e.last.amount >= 0 ? GOOD : BAD, fontWeight: 600, marginRight: 12, fontVariantNumeric: "tabular-nums" }}>{eur(e.last.amount, true)}</span>
          )}
          {e.last.label}
        </SafeText>
      )}
    </AbsoluteFill>
  );
};
