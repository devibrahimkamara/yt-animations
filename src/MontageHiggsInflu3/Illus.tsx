// Illustrations de Higgs Influ 3 (« Ton influenceur IA ne devrait pas être humain »).
// Règle : on montre le réel (profils et vidéos TikTok capturés le 6/10/2026), le motion design ne fait que le mettre en valeur.
import React from "react";
import { AbsoluteFill, Img, Loop, OffthreadVideo, staticFile } from "remotion";
import { Backdrop, BAD, blurIn, EASE, Eyebrow, FONT, glass, H, INK, INK_SOFT, inOut, keyed, LIME, LIME_CARD, MUTED, rich, SERIF, Star, useT, W } from "../montage/lib";

export const D = "montage/higgs-influ3";
export const CAP = `${D}/captures`;
const EMOJI_FONT = (f: string) => `${f}, "Noto Color Emoji", "Apple Color Emoji"`;
const card: React.CSSProperties = { ...glass, padding: 10, borderRadius: 34, background: "rgba(18,22,15,0.94)" };
const clampRoll = (t: number, at: number, dur = 1.0) => keyed(t, [at, at + dur], [0, 1], EASE);

/** Profil TikTok réel (capture du 6/10/2026, en-tête visible), recadré sur la colonne de contenu (x 520 → 2480 de la capture 2560×1800), léger zoom lent. */
const ProfileShot: React.FC<{ src: string; w: number; h: number; dim?: number }> = ({ src, w, h, dim = 0 }) => {
  const t = useT();
  const s = w / 1960;
  const z = 1 + 0.03 * Math.min(1, t / 14);
  return (
    <div style={{ width: w, height: h, overflow: "hidden", borderRadius: 26, position: "relative", background: "#000" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: -520 * s, top: 0, width: 2560 * s, height: 1800 * s, maxWidth: "none", transformOrigin: "50% 20%", transform: `scale(${z})`, filter: dim > 0 ? `grayscale(${dim}) brightness(${1 - 0.45 * dim})` : undefined }} />
    </div>
  );
};

// ─── HOOK : influenceuse IA contre chat IA, côte à côte, compteurs en roulette ───
type Side = { profile: string; eyebrow: string; at: number; videos: number; videosAt: number; subs: string; subsAt: number; median: string };
export const Duel: React.FC<{ left: Side; right: Side; medianAt: number; ratioAt: number; ratio: string; end: number }> = ({ left, right, medianAt, ratioAt, ratio, end }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.01, 0.35);
  const lose = keyed(t, [ratioAt + 0.3, ratioAt + 1.0], [0, 1], EASE);
  const col = (s: Side, x: number, loser: boolean) => {
    const b = blurIn(t, s.at, 0.55, 40);
    const v = Math.round(s.videos * clampRoll(t, s.videosAt, 0.9));
    const dim = loser ? lose : 0;
    return (
      <div style={{ position: "absolute", left: x, top: 96, width: 800, ...b, fontFamily: FONT }}>
        <div style={{ ...card, borderColor: loser && lose > 0 ? `rgba(255,138,122,${0.6 * lose})` : undefined }}>
          <ProfileShot src={s.profile} w={780} h={560} dim={dim} />
        </div>
        <div style={{ marginTop: 22, paddingLeft: 12 }}>
          <Eyebrow size={32} style={{ color: loser && lose > 0.5 ? BAD : LIME }}>{s.eyebrow}</Eyebrow>
          <div style={{ display: "flex", alignItems: "baseline", gap: 34, marginTop: 6, whiteSpace: "nowrap" }}>
            <div style={{ ...blurIn(t, s.videosAt, 0.4, 20) }}>
              <span style={{ fontSize: 96, fontWeight: 500, color: INK, letterSpacing: "-0.045em", fontVariantNumeric: "tabular-nums" }}>{v}</span>
              <span style={{ fontSize: 40, color: INK_SOFT, marginLeft: 12 }}>vidéos</span>
            </div>
            <div style={{ ...blurIn(t, s.subsAt, 0.4, 20) }}>
              <span style={{ fontSize: 96, fontWeight: 500, color: loser && lose > 0.5 ? BAD : INK, letterSpacing: "-0.045em" }}>{s.subs}</span>
              <span style={{ fontSize: 40, color: INK_SOFT, marginLeft: 12 }}>abonnés</span>
            </div>
          </div>
          <div style={{ marginTop: 10, fontSize: 40, color: MUTED, whiteSpace: "nowrap", ...blurIn(t, medianAt + (loser ? 0 : 0.35), 0.45, 16) }}>
            médiane : <span style={{ color: loser ? (lose > 0.5 ? BAD : INK) : INK, fontWeight: 500 }}>{s.median}</span> vues / vidéo
          </div>
        </div>
      </div>
    );
  };
  const r = blurIn(t, ratioAt, 0.5, 30);
  const rs = keyed(t, [ratioAt, ratioAt + 0.6], [0.7, 1], EASE);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Backdrop />
      {col(left, 120, true)}
      {col(right, 1000, false)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1000, textAlign: "center", fontFamily: FONT, fontSize: 28, letterSpacing: "0.16em", textTransform: "uppercase", color: MUTED, ...blurIn(t, medianAt, 0.45, 12) }}>Vues médianes · 10 dernières vidéos · TikTok, 6 oct. 2026</div>
      <div style={{ position: "absolute", left: 960, top: 390, transform: `translate(-50%, -50%) scale(${rs}) ${String(r.transform ?? "")}`, opacity: r.opacity, filter: r.filter }}>
        <div style={{ ...LIME_CARD, borderRadius: 999, padding: "26px 60px", fontFamily: FONT, fontSize: 150, fontWeight: 600, letterSpacing: "-0.05em", boxShadow: "0 0 120px rgba(198,243,109,0.45), 0 40px 90px -30px rgba(0,0,0,0.9)" }}>{ratio}</div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Vidéos réelles qui jouent côte à côte (éventail), avec vues ───
export const FanClips: React.FC<{ items: { src: string; views?: string; label?: string; from?: number }[]; end: number; height?: number; top?: number; bg?: boolean; dim?: number }> = ({ items, end, height = 720, top = 90, bg = true, dim = 0 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const w = Math.round((height * 9) / 16);
  const gap = 46;
  const total = items.length * w + (items.length - 1) * gap;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      {bg && <Backdrop />}
      {dim > 0 && <AbsoluteFill style={{ background: `rgba(9,11,8,${dim})` }} />}
      {items.map((it, i) => {
        const b = blurIn(t, 0.1 + i * 0.22, 0.5, 40);
        const tilt = (i - (items.length - 1) / 2) * 2.5;
        return (
          <div key={it.src + i} style={{ position: "absolute", left: (W - total) / 2 + i * (w + gap), top: top + Math.abs(i - (items.length - 1) / 2) * 24, transform: `${b.transform} rotate(${tilt}deg)`, opacity: b.opacity, filter: b.filter }}>
            <div style={card}>
              <OffthreadVideo src={staticFile(it.src)} trimBefore={Math.round((it.from ?? 0.5) * 30)} muted style={{ width: w, height, borderRadius: 26, display: "block", objectFit: "cover" }} />
            </div>
            {it.views && (
              <div style={{ position: "absolute", left: 26, top: 26, ...glass, background: "rgba(10,12,9,0.85)", borderRadius: 999, padding: "8px 22px", fontFamily: FONT, fontSize: 42, color: INK, display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ color: LIME, fontSize: 30 }}>▶</span>
                {it.views}
              </div>
            )}
            {it.label && <div style={{ textAlign: "center", marginTop: 16, fontFamily: FONT, fontSize: 44, color: INK, letterSpacing: "-0.02em", textShadow: "0 4px 24px rgba(0,0,0,0.8)" }}>{rich(it.label)}</div>}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Capture réelle (image ou vidéo) plein cadre, caméra par paliers + surlignage. Coordonnées en pixels de la capture. */
export type PanKey = { t: number; z: number; cx: number; cy: number };
export type Mark = { from: number; to: number; x: number; y: number; w: number; h: number };
export const PanShot: React.FC<{ src: string; iw: number; ih: number; keys: PanKey[]; end: number; marks?: Mark[]; video?: boolean; from?: number }> = ({ src, iw, ih, keys, end, marks = [], video, from = 0 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const ts = keys.map((k) => k.t);
  const z = Math.exp(keyed(t, ts, keys.map((k) => Math.log(k.z))));
  const cx = keyed(t, ts, keys.map((k) => k.cx));
  const cy = keyed(t, ts, keys.map((k) => k.cy));
  const s = staticFile(src);
  const m = marks.find((k) => t >= k.from - 0.4 && t < k.to + 0.4);
  const mo = m ? inOut(t, m.from, m.to, 0.4, 0.4) : 0;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Backdrop />
      <div style={{ position: "absolute", left: W / 2 - cx * z, top: H / 2 - cy * z, width: iw, height: ih, transformOrigin: "0 0", transform: `scale(${z})`, borderRadius: 36 / z, overflow: "hidden", boxShadow: "0 60px 140px -30px rgba(0,0,0,0.9)" }}>
        {video ? <OffthreadVideo src={s} trimBefore={Math.round(from * 30)} muted style={{ width: iw, height: ih, display: "block" }} /> : <Img src={s} style={{ width: iw, height: ih, display: "block" }} />}
        {m && mo > 0 && (
          <>
            <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${0.55 * mo})`, clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${m.x}px ${m.y}px, ${m.x}px ${m.y + m.h}px, ${m.x + m.w}px ${m.y + m.h}px, ${m.x + m.w}px ${m.y}px, ${m.x}px ${m.y}px)` }} />
            <div style={{ position: "absolute", left: m.x - 10, top: m.y - 10, width: m.w + 20, height: m.h + 20, borderRadius: 24, border: `${5 / Math.max(z, 0.6)}px solid ${LIME}`, boxShadow: `0 0 ${40 / z}px rgba(198,243,109,0.5)`, opacity: mo }} />
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};

/** Légende en bas d'une illustration plein cadre. */
export const Caption: React.FC<{ text: string; end: number; at?: number; bottom?: number }> = ({ text, end, at = 0, bottom = 70 }) => {
  const t = useT();
  const b = blurIn(t, at, 0.45, 20);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: bottom }}>
      <div style={{ ...glass, background: "rgba(14,17,12,0.9)", borderRadius: 999, padding: "20px 44px", fontFamily: FONT, fontSize: 52, color: INK, letterSpacing: "-0.02em", display: "flex", gap: 16, alignItems: "center", ...b, opacity: Math.min(Number(b.opacity), inOut(t, at, end, 0.01, 0.35)) }}>
        <Star size={40} />
        {rich(text)}
      </div>
    </AbsoluteFill>
  );
};

// ─── Ma veille : 12 formats, vues cumulées des ~30 meilleures vidéos (barres en échelle linéaire, c'est le propos) ───
export type VeilleRow = { label: string; value: number; shown: string; weak?: boolean };
export const VeilleTable: React.FC<{ rows: VeilleRow[]; end: number; rowsAt: number; step: number; titleAt: number; weakAt: number }> = ({ rows, end, rowsAt, step, titleAt, weakAt }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const max = Math.max(...rows.map((r) => r.value));
  const wk = keyed(t, [weakAt, weakAt + 0.5], [0, 1], EASE);
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <Backdrop />
      <div style={{ position: "absolute", left: 150, top: 70, ...blurIn(t, 0.05, 0.5, 20) }}>
        <Eyebrow size={32}>Ma veille · 6 octobre 2026</Eyebrow>
        <div style={{ fontSize: 84, fontWeight: 500, color: INK, letterSpacing: "-0.04em", marginTop: 8, ...blurIn(t, titleAt, 0.45, 20) }}>{rich("*≈ 400* vidéos · 12 formats")}</div>
      </div>
      <div style={{ position: "absolute", left: 150, top: 270, right: 150 }}>
        {rows.map((r, i) => {
          const at = rowsAt + i * step;
          const p = keyed(t, [at, at + 0.55], [0, 1], EASE);
          const weak = r.weak ? wk : 0;
          return (
            <div key={r.label} style={{ display: "flex", alignItems: "center", height: 60, gap: 28, opacity: Math.min(1, p * 1.5) }}>
              <div style={{ width: 560, fontSize: 38, color: weak > 0.5 ? BAD : INK, textAlign: "right", letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>{r.label}</div>
              <div style={{ flex: 1, position: "relative", height: 34 }}>
                <div style={{ position: "absolute", left: 0, top: 0, height: 34, width: `${Math.max(0.6, (r.value / max) * 100 * p)}%`, borderRadius: 10, background: weak > 0.5 ? BAD : r.value === max ? LIME : "rgba(198,243,109,0.55)" }} />
              </div>
              <div style={{ width: 170, fontSize: 40, fontWeight: 500, color: weak > 0.5 ? BAD : INK, fontVariantNumeric: "tabular-nums" }}>{r.shown}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── La carte des formats (Carte du tuto) : 5 blocs reliés, le bloc actif allumé ───
export type MapItem = { icon: string; label: string; dead?: boolean; at: number };
export const FormatMap: React.FC<{ items: MapItem[]; end: number; active?: number; eyebrow?: string; eyebrowAt?: number; bg?: boolean; top?: number }> = ({ items, end, active, eyebrow = "Au programme", eyebrowAt = 0.05, bg = false, top = 330 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.4);
  const bw = 300, gap = 44;
  const total = items.length * bw + (items.length - 1) * gap;
  const x0 = (W - total) / 2;
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      {bg && <Backdrop />}
      <div style={{ position: "absolute", left: 0, right: 0, top: top - 120, textAlign: "center", ...blurIn(t, eyebrowAt, 0.45, 16) }}>
        <Eyebrow size={34}>{eyebrow}</Eyebrow>
      </div>
      {items.map((it, i) => {
        const b = blurIn(t, it.at, 0.5, 30);
        const on = active === undefined ? true : active === i;
        const col = it.dead ? BAD : LIME;
        const line = i > 0 ? keyed(t, [it.at - 0.1, it.at + 0.35], [0, 1], EASE) : 0;
        return (
          <React.Fragment key={i}>
            {i > 0 && <div style={{ position: "absolute", left: x0 + i * (bw + gap) - gap, top: top + 130, width: gap * line, height: 3, background: "rgba(198,243,109,0.45)" }} />}
            <div style={{ position: "absolute", left: x0 + i * (bw + gap), top, width: bw, height: 260, ...b, opacity: Number(b.opacity) * (on ? 1 : 0.38) }}>
              <div style={{ ...glass, width: "100%", height: "100%", borderRadius: 34, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, background: on && active !== undefined ? `linear-gradient(180deg, ${it.dead ? "rgba(255,138,122,0.18)" : "rgba(198,243,109,0.16)"}, rgba(18,22,15,0.9))` : "linear-gradient(180deg, rgba(255,255,255,0.075), rgba(18,22,15,0.85))", border: `2px solid ${on && active !== undefined ? col : "rgba(255,255,255,0.1)"}`, boxShadow: on && active !== undefined ? `0 0 60px ${it.dead ? "rgba(255,138,122,0.25)" : "rgba(198,243,109,0.25)"}` : undefined }}>
                <div style={{ fontSize: 96, lineHeight: 1, fontFamily: '"Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", sans-serif' }}>{it.icon}</div>
                <div style={{ fontSize: 38, color: it.dead ? BAD : INK, textAlign: "center", letterSpacing: "-0.02em", lineHeight: 1.1, padding: "0 16px" }}>{rich(it.label)}</div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

// ─── Le partenaire : logo officiel + nom de l'outil + mention de collaboration ───
export const BrandCard: React.FC<{ end: number; toolAt: number; collabAt: number }> = ({ end, toolAt, collabAt }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.01, 0.4);
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,7,4,0.75) 0%, rgba(5,7,4,0.35) 26%, transparent 42%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 46, display: "flex", justifyContent: "center" }}>
        <div style={{ ...glass, background: "rgba(14,17,12,0.92)", borderRadius: 40, padding: "22px 40px 22px 24px", display: "flex", alignItems: "center", gap: 28, ...blurIn(t, 0.05, 0.5, 24) }}>
          <Img src={staticFile(`${D}/logo_higgsfield_apple.png`)} style={{ width: 112, height: 112, borderRadius: 26 }} />
          <div>
            <div style={{ fontSize: 66, fontWeight: 500, color: INK, letterSpacing: "-0.04em", lineHeight: 1 }}>Higgsfield</div>
            <div style={{ fontSize: 42, color: LIME, marginTop: 8, ...blurIn(t, toolAt, 0.4, 14) }}>
              AI Influencer <span style={{ fontFamily: SERIF, fontStyle: "italic" }}>2.0</span>
            </div>
          </div>
          <div style={{ width: 1, alignSelf: "stretch", background: "rgba(255,255,255,0.1)", margin: "0 6px" }} />
          <div style={{ fontSize: 30, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase", ...blurIn(t, collabAt, 0.4, 12) }}>Collaboration
            <br />commerciale</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Pastille courte (« À venir ») en haut au centre. */
export const TopTag: React.FC<{ text: string; end: number; at?: number; top?: number }> = ({ text, end, at = 0, top = 40 }) => {
  const t = useT();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", opacity: inOut(t, at, end, 0.3, 0.35) }}>
      <div style={{ ...LIME_CARD, borderRadius: 999, padding: "12px 34px", fontFamily: FONT, fontSize: 40, fontWeight: 600, letterSpacing: "-0.01em", ...blurIn(t, at, 0.4, 14) }}>{text}</div>
    </div>
  );
};


// ─── Carton de format : sur-titre « Format n sur 4 », titre, et la carte des formats avec le bloc actif ───
export const StepCard: React.FC<{ eyebrow: string; title: string; items: MapItem[]; active: number; end: number }> = ({ eyebrow, title, items, active, end }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.25, 0.4);
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <Backdrop />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 170 }}>
        <div style={blurIn(t, 0.05)}><Star size={56} /></div>
        <Eyebrow size={36} style={{ marginTop: 18, ...blurIn(t, 0.15), color: items[active]?.dead ? BAD : LIME }}>{eyebrow}</Eyebrow>
        <div style={{ fontSize: 150, fontWeight: 500, color: INK, letterSpacing: "-0.05em", lineHeight: 1.02, marginTop: 14, ...blurIn(t, 0.3, 0.55, 26) }}>{rich(title, INK)}</div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 560, width: W, height: H - 560, transform: "scale(0.78)", transformOrigin: "50% 0" }}>
        <FormatMap items={items.map((m) => ({ ...m, at: 0.35 }))} active={active} end={end + 1} eyebrow="" top={60} />
      </div>
    </AbsoluteFill>
  );
};

/** Pastille de chapitre en haut à gauche (« Format 1/4 · Fruits »), sur la face cam. */
export const FormatPill: React.FC<{ label: string; title: string; end: number; dead?: boolean }> = ({ label, title, end, dead }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.5, 0.4);
  return (
    <div style={{ position: "absolute", left: 44, top: 36, opacity: o, transform: `translateY(${(1 - o) * -10}px)` }}>
      <div style={{ ...glass, background: "linear-gradient(180deg, rgba(18,22,15,0.9), rgba(18,22,15,0.8))", borderRadius: 999, padding: "16px 30px", display: "flex", alignItems: "center", gap: 16, fontFamily: FONT }}>
        <span style={{ fontSize: 32, letterSpacing: "0.14em", textTransform: "uppercase", color: dead ? BAD : LIME, fontWeight: 500 }}>{label}</span>
        <span style={{ width: 1, height: 30, background: "rgba(255,255,255,0.12)" }} />
        <span style={{ fontSize: 44, color: INK, fontWeight: 500, letterSpacing: "-0.01em" }}>{title}</span>
      </div>
    </div>
  );
};

/** Vidéo verticale réelle en plein cadre (fond = la même vidéo floutée), texte en grand à droite. */
export const FullClip: React.FC<{ src: string; end: number; from?: number; height?: number; x?: number; lines?: { text: string; at: number; size?: number }[]; textX?: number; loop?: number }> = ({ src, end, from = 0, height = 900, x = 300, lines = [], textX = 1000, loop }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.25, 0.3);
  const b = blurIn(t, 0, 0.5, 30);
  const w = Math.round((height * 9) / 16);
  const v = staticFile(src);
  const L: React.FC<{ children: React.ReactNode }> = ({ children }) => (loop ? <Loop durationInFrames={Math.round(loop * 30)} layout="none">{children}</Loop> : <>{children}</>);
  return (
    <AbsoluteFill style={{ opacity: o, background: "#000" }}>
      <L><OffthreadVideo src={v} trimBefore={Math.round(from * 30)} muted style={{ position: "absolute", inset: 0, width: W, height: H, objectFit: "cover", filter: "blur(46px) brightness(0.4) saturate(1.1)", transform: "scale(1.15)" }} /></L>
      <div style={{ position: "absolute", left: x, top: (H - height) / 2 - 10, ...b, opacity: Math.min(o, Number(b.opacity)) }}>
        <div style={card}>
          <L><OffthreadVideo src={v} trimBefore={Math.round(from * 30)} muted style={{ width: w, height, borderRadius: 26, display: "block", objectFit: "cover" }} /></L>
        </div>
      </div>
      <AbsoluteFill style={{ justifyContent: "center", paddingLeft: textX, paddingRight: 80, fontFamily: FONT }}>
        {lines.map((l, i) => (
          <div key={i} style={{ fontSize: l.size ?? 96, color: INK, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: 28, textShadow: "0 6px 40px rgba(0,0,0,0.8)", ...blurIn(t, l.at, 0.45, 26) }}>{rich(l.text)}</div>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Les vrais titres des vidéos, recréés en grand ; les motifs s'allument (étiquettes). */
export const TitleList: React.FC<{ eyebrow: string; titles: { text: string; at: number }[]; tags: { text: string; at: number }[]; end: number }> = ({ eyebrow, titles, tags, end }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: EMOJI_FONT(FONT) }}>
      <Backdrop />
      <div style={{ position: "absolute", left: 170, top: 120, right: 170 }}>
        <Eyebrow size={32} style={blurIn(t, 0.05)}>{eyebrow}</Eyebrow>
        <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 24 }}>
          {titles.map((ti, i) => (
            <div key={i} style={{ ...glass, borderRadius: 28, padding: "24px 36px", fontSize: 58, color: INK, letterSpacing: "-0.02em", ...blurIn(t, ti.at, 0.45, 24) }}>{rich(ti.text)}</div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 26, marginTop: 50 }}>
          {tags.map((tg, i) => (
            <div key={i} style={{ ...(i === tags.length - 1 ? LIME_CARD : glass), borderRadius: 999, padding: "16px 36px", fontSize: 50, fontWeight: 500, color: i === tags.length - 1 ? "#0d1208" : INK, ...blurIn(t, tg.at, 0.4, 20) }}>{tg.text}</div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Fil lumineux qui relie des pastilles au rythme de la voix (« Partie 10 → Partie 1 → … »). */
export const FlowLine: React.FC<{ items: { text: string; at: number; hl?: boolean }[]; end: number; caption?: string; captionAt?: number }> = ({ items, end, caption, captionAt = 0 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.4);
  const pw = 330, gap = 70;
  const total = items.length * pw + (items.length - 1) * gap;
  const x0 = (W - total) / 2;
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      {caption && <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontSize: 64, color: INK, letterSpacing: "-0.03em", ...blurIn(t, captionAt, 0.45, 20) }}>{rich(caption)}</div>}
      {items.map((it, i) => {
        const b = blurIn(t, it.at, 0.45, 24);
        const ln = i > 0 ? keyed(t, [it.at - 0.35, it.at], [0, 1], EASE) : 0;
        return (
          <React.Fragment key={i}>
            {i > 0 && <div style={{ position: "absolute", left: x0 + i * (pw + gap) - gap + 8, top: 538, width: (gap - 16) * ln, height: 4, borderRadius: 2, background: LIME, boxShadow: `0 0 16px ${LIME}` }} />}
            <div style={{ position: "absolute", left: x0 + i * (pw + gap), top: 480, width: pw, ...b }}>
              <div style={{ ...(it.hl ? LIME_CARD : glass), borderRadius: 999, padding: "26px 0", textAlign: "center", fontSize: 54, fontWeight: 500, color: it.hl ? "#0d1208" : INK, letterSpacing: "-0.02em" }}>{it.text}</div>
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

/** Boucle en 3 temps (regarder → l'algorithme pousse → s'abonner), qui se referme. */
export const LoopCard: React.FC<{ steps: { text: string; at: number }[]; closeAt: number; title: string; end: number }> = ({ steps, closeAt, title, end }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.4);
  const R = 300, cx = W / 2, cy = 560;
  const ang = [-90, 30, 150].map((a) => (a * Math.PI) / 180);
  const close = keyed(t, [closeAt, closeAt + 0.9], [0, 1], EASE);
  const spin = close * 360;
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(198,243,109,0.18)" strokeWidth={4} />
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={LIME} strokeWidth={5} strokeDasharray={`${2 * Math.PI * R * close} ${2 * Math.PI * R}`} transform={`rotate(-90 ${cx} ${cy})`} style={{ filter: `drop-shadow(0 0 10px ${LIME})` }} />
      </svg>
      <div style={{ position: "absolute", left: cx - 220, top: cy - 60, width: 440, textAlign: "center", fontSize: 54, color: INK, letterSpacing: "-0.03em", lineHeight: 1.1, transform: `rotate(${0 * spin}deg)`, ...blurIn(t, closeAt, 0.5, 20) }}>{rich(title)}</div>
      {steps.map((s, i) => (
        <div key={i} style={{ position: "absolute", left: cx + R * Math.cos(ang[i]) - 230, top: cy + R * Math.sin(ang[i]) - 46, width: 460, display: "flex", justifyContent: "center", ...blurIn(t, s.at, 0.45, 24) }}>
          <div style={{ ...glass, background: "rgba(18,22,15,0.95)", borderRadius: 999, padding: "20px 34px", fontSize: 46, color: INK, whiteSpace: "nowrap" }}>{rich(s.text)}</div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

/** Avant / aujourd'hui (format mort) : le hit de 2025 barré, la réalité d'aujourd'hui en rouge. */
export const DeadCard: React.FC<{ rows: { who: string; before: string; now: string; at: number; nowAt: number }[]; end: number; eyebrow: string }> = ({ rows, end, eyebrow }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  return (
    <AbsoluteFill style={{ opacity: o, justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <div style={{ ...glass, background: "linear-gradient(180deg, rgba(18,22,15,0.95), rgba(18,22,15,0.9))", borderRadius: 40, padding: "44px 56px", width: 1500, border: "2px solid rgba(255,138,122,0.45)", ...blurIn(t, 0.05, 0.5, 26) }}>
        <Eyebrow size={32} style={{ color: BAD }}>{eyebrow}</Eyebrow>
        {rows.map((r, i) => {
          const strike = keyed(t, [r.nowAt, r.nowAt + 0.45], [0, 1], EASE);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 36, marginTop: 30, ...blurIn(t, r.at, 0.45, 20) }}>
              <div style={{ width: 380, fontSize: 44, color: MUTED }}>{r.who}</div>
              <div style={{ position: "relative", fontSize: 60, color: INK, fontWeight: 500, letterSpacing: "-0.03em", whiteSpace: "nowrap" }}>
                {r.before}
                <div style={{ position: "absolute", left: -6, top: "52%", height: 6, width: `calc(${strike * 100}% + 12px)`, background: BAD, borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 56, color: BAD, ...blurIn(t, r.nowAt + 0.2, 0.45, 18), whiteSpace: "nowrap" }}>→ {r.now}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** La règle, qui se coche au rythme de la voix. */
export const RuleCard: React.FC<{ title: string; steps: { text: string; at: number }[]; verdicts: { text: string; at: number; good: boolean }[]; end: number }> = ({ title, steps, verdicts, end }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.35, 0.4);
  return (
    <AbsoluteFill style={{ opacity: o, justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <div style={{ ...glass, background: "linear-gradient(180deg, rgba(18,22,15,0.95), rgba(18,22,15,0.9))", borderRadius: 40, padding: "46px 60px", width: 1480, ...blurIn(t, 0.05, 0.5, 26) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}><Star size={36} /><Eyebrow size={34}>{title}</Eyebrow></div>
        {steps.map((s, i) => {
          const p = keyed(t, [s.at, s.at + 0.4], [0, 1], EASE);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 30, opacity: 0.25 + 0.75 * p }}>
              <div style={{ width: 66, height: 66, borderRadius: 999, background: p > 0.5 ? LIME : "rgba(255,255,255,0.08)", color: "#0d1208", fontSize: 38, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
              <div style={{ fontSize: 60, color: INK, letterSpacing: "-0.03em" }}>{rich(s.text)}</div>
            </div>
          );
        })}
        <div style={{ display: "flex", gap: 30, marginTop: 40 }}>
          {verdicts.map((v, i) => (
            <div key={i} style={{ flex: 1, borderRadius: 30, padding: "24px 30px", border: `2px solid ${v.good ? "rgba(142,227,161,0.6)" : "rgba(255,138,122,0.6)"}`, background: v.good ? "rgba(142,227,161,0.1)" : "rgba(255,138,122,0.1)", fontSize: 50, color: INK, ...blurIn(t, v.at, 0.45, 20) }}>
              <span style={{ color: v.good ? "#8ee3a1" : BAD, fontWeight: 600, marginRight: 14 }}>{v.good ? "✓" : "✗"}</span>{rich(v.text)}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Étiquette de verre en haut au centre, posée sur l'écran de la démo (ne masque pas l'interface). */
export const ScreenTag: React.FC<{ text: string; end: number; at?: number; top?: number }> = ({ text, end, at = 0, top = 36 }) => {
  const t = useT();
  const b = blurIn(t, at, 0.45, 18);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", opacity: inOut(t, at, end, 0.01, 0.35) }}>
      <div style={{ ...glass, background: "rgba(14,17,12,0.92)", borderRadius: 999, padding: "16px 38px", fontFamily: EMOJI_FONT(FONT), fontSize: 46, color: INK, letterSpacing: "-0.02em", display: "flex", gap: 14, alignItems: "center", boxShadow: "0 20px 60px -20px rgba(0,0,0,0.8)", ...b }}>
        <Star size={34} />
        {rich(text)}
      </div>
    </div>
  );
};

/** Carte « Mon personnage » qui se remplit au fil des choix du Character Builder (valeurs = celles de l'interface). */
export const CharacterCard: React.FC<{ rows: { k: string; v: string; at: number }[]; end: number; x: number; y: number }> = ({ rows, end, x, y }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.5, 0.4);
  const b = blurIn(t, 0, 0.6, 50);
  const shown = rows.filter((r) => t >= r.at);
  const last = shown[shown.length - 1];
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 760, opacity: Math.min(o, Number(b.opacity)), transform: b.transform, filter: b.filter, fontFamily: FONT }}>
      <div style={{ borderRadius: 44, padding: 3, background: `linear-gradient(150deg, ${LIME}, rgba(198,243,109,0.15) 40%, rgba(198,243,109,0.55))`, boxShadow: "0 50px 120px -30px rgba(0,0,0,0.9), 0 0 80px rgba(198,243,109,0.18)" }}>
        <div style={{ borderRadius: 41, background: "linear-gradient(170deg, #1a2113 0%, #0e120b 60%)", padding: "34px 40px" }}>
          <Eyebrow size={30}>Mon personnage</Eyebrow>
          <div style={{ fontSize: 40, color: MUTED, marginTop: 6 }}>{shown.length} / {rows.length} choix</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 24 }}>
            {rows.map((r) => {
              const p = keyed(t, [r.at, r.at + 0.45], [0, 1], EASE);
              const fresh = last === r && t - r.at < 1.8;
              return (
                <div key={r.k} style={{ borderRadius: 22, padding: "16px 24px", background: fresh ? "rgba(198,243,109,0.16)" : "rgba(255,255,255,0.04)", border: `1.5px solid ${fresh ? "rgba(198,243,109,0.7)" : "rgba(255,255,255,0.06)"}`, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: 38, color: MUTED }}>{r.k}</span>
                  <span style={{ fontSize: 52, color: p > 0 ? INK : "rgba(255,255,255,0.18)", fontWeight: 500, letterSpacing: "-0.02em", opacity: 0.25 + 0.75 * p }}>{p > 0 ? rich(r.v) : "—"}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

/** Toi (vidéo de référence) → ton personnage (image générée). */
export const MeToPerso: React.FC<{ end: number; caption: string; captionAt?: number }> = ({ end, caption, captionAt = 0.6 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const h = 760;
  const w = Math.round((h * 9) / 16);
  const arrow = keyed(t, [0.6, 1.2], [0, 1], EASE);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Backdrop />
      <div style={{ position: "absolute", left: 170, top: 90, ...blurIn(t, 0.05, 0.5, 30) }}>
        <div style={card}>
          <Loop durationInFrames={261} layout="none">
            <OffthreadVideo src={staticFile(`${D}/ref.mp4`)} muted style={{ width: w, height: h, borderRadius: 26, display: "block", objectFit: "cover" }} />
          </Loop>
        </div>
      </div>
      <svg width={220} height={80} viewBox="0 0 220 80" style={{ position: "absolute", left: 620, top: 430 }}>
        <path d={`M10 40 H${10 + 180 * arrow}`} stroke={LIME} strokeWidth={8} strokeLinecap="round" />
        {arrow > 0.95 && <path d="M160 14 L200 40 L160 66" stroke={LIME} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
      <div style={{ position: "absolute", left: 860, top: 160, ...blurIn(t, 1.0, 0.5, 30) }}>
        <div style={card}>
          <Img src={staticFile(`${D}/perso.png`)} style={{ width: 960, height: 545, borderRadius: 26, display: "block", objectFit: "cover" }} />
        </div>
      </div>
      <Caption text={caption} end={end} at={captionAt} bottom={60} />
    </AbsoluteFill>
  );
};

/** La vidéo de référence posée à côté du rendu (l'interface reste visible derrière). */
export const RefBeside: React.FC<{ end: number; x: number; y: number; h?: number; label?: string }> = ({ end, x, y, h = 700, label = "Original" }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const w = Math.round((h * 9) / 16);
  return (
    <div style={{ position: "absolute", left: x - 24, top: y - 24, opacity: o, ...blurIn(t, 0, 0.5, 30), fontFamily: FONT, background: "rgba(9,11,8,0.9)", borderRadius: 44, padding: "24px 24px 18px", boxShadow: "0 40px 100px -20px rgba(0,0,0,0.9)" }}>
      <div style={card}>
        <Loop durationInFrames={261} layout="none">
          <OffthreadVideo src={staticFile(`${D}/ref.mp4`)} muted style={{ width: w, height: h, borderRadius: 26, display: "block", objectFit: "cover" }} />
        </Loop>
      </div>
      <div style={{ textAlign: "center", marginTop: 12, fontSize: 46, color: INK }}>{rich(label)}</div>
    </div>
  );
};

/** Le prompt tapé, recréé en grand (orthographe corrigée, validé par Ibrahim). */
export const PromptBox: React.FC<{ n: number; text: string; end: number; x: number; y: number; typeDur?: number }> = ({ n, text, end, x, y, typeDur = 1.6 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.35, 0.35);
  const shown = Math.round(text.length * Math.min(1, Math.max(0, (t - 0.3) / typeDur)));
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 820, opacity: o, ...blurIn(t, 0, 0.5, 30), fontFamily: FONT }}>
      <div style={{ ...glass, background: "linear-gradient(170deg, rgba(26,33,19,0.97), rgba(14,18,11,0.97))", borderRadius: 36, padding: "32px 40px", border: "1.5px solid rgba(198,243,109,0.4)", boxShadow: "0 40px 100px -30px rgba(0,0,0,0.9)" }}>
        <Eyebrow size={30}>Prompt {n} · Genjutsu</Eyebrow>
        <div style={{ fontSize: 58, color: INK, letterSpacing: "-0.02em", lineHeight: 1.18, marginTop: 18, minHeight: 140 }}>
          « {text.slice(0, shown)}{shown < text.length ? <span style={{ color: LIME }}>▍</span> : " »"}
        </div>
      </div>
    </div>
  );
};

/** Le climax : l'original + les 4 rendus qui jouent ensemble. */
export const Showcase: React.FC<{ end: number; items: { src: string; label: string }[]; eyebrow: string }> = ({ end, items, eyebrow }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.35, 0.4);
  const h = 600, w = Math.round((h * 9) / 16), gap = 30;
  const total = items.length * w + (items.length - 1) * gap;
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <Backdrop />
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", ...blurIn(t, 0.1, 0.5, 20) }}><Eyebrow size={34}>{eyebrow}</Eyebrow></div>
      {items.map((it, i) => (
        <div key={i} style={{ position: "absolute", left: (W - total) / 2 + i * (w + gap), top: 170, ...blurIn(t, 0.15 + i * 0.25, 0.5, 30) }}>
          <div style={{ ...card, border: i === 0 ? "2px solid rgba(255,255,255,0.25)" : `2px solid rgba(198,243,109,0.45)` }}>
            <Loop durationInFrames={i === 0 ? 261 : 241} layout="none">
              <OffthreadVideo src={staticFile(it.src)} muted style={{ width: w, height: h, borderRadius: 26, display: "block", objectFit: "cover" }} />
            </Loop>
          </div>
          <div style={{ textAlign: "center", marginTop: 18, fontSize: 44, color: i === 0 ? MUTED : INK, letterSpacing: "-0.02em" }}>{rich(it.label)}</div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

/** Écran de fin : la vidéo suivante (miniature réelle). */
export const NextVideo: React.FC<{ end: number; title: string; meta: string; cta: string; ctaAt: number }> = ({ end, title, meta, cta, ctaAt }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.4, 0.01);
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 120, top: 200, width: 900, ...blurIn(t, 0.1, 0.6, 40) }}>
        <Eyebrow size={32}>La suite logique</Eyebrow>
        <div style={{ ...card, marginTop: 20 }}>
          <Img src={staticFile(`${D}/mini_jeanphil.jpg`)} style={{ width: 880, height: 495, borderRadius: 26, display: "block", objectFit: "cover" }} />
        </div>
        <div style={{ fontSize: 56, color: INK, letterSpacing: "-0.03em", marginTop: 24, lineHeight: 1.1 }}>{rich(title)}</div>
        <div style={{ fontSize: 38, color: MUTED, marginTop: 10 }}>{rich(meta)}</div>
      </div>
      <div style={{ position: "absolute", left: 120, top: 960, ...blurIn(t, ctaAt, 0.45, 20) }}>
        <div style={{ ...LIME_CARD, borderRadius: 999, padding: "14px 38px", fontSize: 44, fontWeight: 600 }}>{cta}</div>
      </div>
    </AbsoluteFill>
  );
};

/** Résultat Genjutsu en HD (le lecteur de l'interface saccadait) : l'original et le rendu côte à côte, synchronisés. */
export const ResultDuo: React.FC<{ end: number; gen: string; loop: number; caption?: string; captionAt?: number }> = ({ end, gen, loop, caption, captionAt = 0 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.35, 0.35);
  const h = 820, w = Math.round((h * 9) / 16);
  const clip = (src: string, label: string, x: number, delay: number) => (
    <div style={{ position: "absolute", left: x, top: 50, ...blurIn(t, delay, 0.5, 30), fontFamily: FONT }}>
      <div style={card}>
        <Loop durationInFrames={Math.round(loop * 30)} layout="none">
          <OffthreadVideo src={staticFile(src)} muted style={{ width: w, height: h, borderRadius: 26, display: "block", objectFit: "cover" }} />
        </Loop>
      </div>
      <div style={{ textAlign: "center", marginTop: 16, fontSize: 48, color: INK, letterSpacing: "-0.02em" }}>{rich(label)}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Backdrop />
      {clip(`${D}/ref.mp4`, "Original", W / 2 - w - 40, 0.05)}
      {clip(gen, "Mon *personnage* · Genjutsu", W / 2 + 40, 0.2)}
      {caption && <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center", pointerEvents: "none" }} />}
    </AbsoluteFill>
  );
};
