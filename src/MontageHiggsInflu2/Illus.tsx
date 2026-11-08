// Illustrations plein cadre par le réel (retours d'Ibrahim, 6 octobre 2026) :
// quand Ibrahim lit son script (il ne regarde pas l'objectif), la face cam disparaît au profit de vraies vidéos / captures.
import React from "react";
import { AbsoluteFill, Img, Loop, OffthreadVideo, staticFile } from "remotion";
import { Backdrop, blurIn, EASE, Eyebrow, FONT, glass, H, INK, inOut, keyed, LIME, MUTED, rich, Star, useT, W } from "../montage/lib";

const D = "montage/higgs-influ2/captures";
const card: React.CSSProperties = { ...glass, padding: 10, borderRadius: 34, background: "rgba(18,22,15,0.94)" };

/** Vidéo verticale réelle en plein cadre : fond = la même vidéo floutée, premier plan = la vidéo en carte. */
export const FullClip: React.FC<{ src: string; end: number; from?: number; label?: string; labelAt?: number; height?: number; x?: number; loop?: number }> = ({ src, end, from = 0, label, labelAt = 0.3, height = 900, x, loop }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.25, 0.3);
  const b = blurIn(t, 0, 0.5, 30);
  const w = Math.round((height * 9) / 16);
  const v = staticFile(`${D}/${src}`);
  const L: React.FC<{ children: React.ReactNode }> = ({ children }) => (loop ? <Loop durationInFrames={Math.round(loop * 30)} layout="none">{children}</Loop> : <>{children}</>);
  return (
    <AbsoluteFill style={{ opacity: o, background: "#000" }}>
      <L>
        <OffthreadVideo src={v} trimBefore={Math.round(from * 30)} muted style={{ position: "absolute", inset: 0, width: W, height: H, objectFit: "cover", filter: "blur(46px) brightness(0.42) saturate(1.1)", transform: "scale(1.15)" }} />
      </L>
      <div style={{ position: "absolute", left: x ?? (W - w) / 2 - 10, top: (H - height) / 2 - (label ? 40 : 10), ...b, opacity: Math.min(o, Number(b.opacity)) }}>
        <div style={card}>
          <L>
            <OffthreadVideo src={v} trimBefore={Math.round(from * 30)} muted style={{ width: w, height, borderRadius: 26, display: "block", objectFit: "cover" }} />
          </L>
        </div>
        {label && <div style={{ position: "absolute", top: height + 36, left: -400, right: -400, textAlign: "center", fontFamily: FONT, fontSize: 50, color: INK, letterSpacing: "-0.02em", textShadow: "0 4px 24px rgba(0,0,0,0.8)", ...blurIn(t, labelAt) }}>{rich(label)}</div>}
      </div>
    </AbsoluteFill>
  );
};

/** Plusieurs vraies vidéos qui jouent côte à côte (éventail), avec leur nombre de vues. */
export const FanClips: React.FC<{ items: { src: string; views?: string; from?: number }[]; end: number; height?: number; top?: number; bg?: boolean }> = ({ items, end, height = 720, top = 90, bg = true }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const w = Math.round((height * 9) / 16);
  const gap = 40;
  const total = items.length * w + (items.length - 1) * gap;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      {bg && <Backdrop />}
      {items.map((it, i) => {
        const b = blurIn(t, 0.1 + i * 0.22, 0.5, 40);
        const tilt = (i - (items.length - 1) / 2) * 2.5;
        return (
          <div key={it.src} style={{ position: "absolute", left: (W - total) / 2 + i * (w + gap), top: top + Math.abs(i - (items.length - 1) / 2) * 24, transform: `${b.transform} rotate(${tilt}deg)`, opacity: b.opacity, filter: b.filter }}>
            <div style={card}>
              <OffthreadVideo src={staticFile(`${D}/${it.src}`)} trimBefore={Math.round((it.from ?? 0.5) * 30)} muted style={{ width: w, height, borderRadius: 26, display: "block", objectFit: "cover" }} />
            </div>
            {it.views && (
              <div style={{ position: "absolute", left: 26, top: 26, ...glass, background: "rgba(10,12,9,0.82)", borderRadius: 999, padding: "8px 20px", fontFamily: FONT, fontSize: 40, color: INK, display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ color: LIME, fontSize: 30 }}>▶</span>
                {it.views}
              </div>
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Vraie capture (image) en plein cadre avec caméra par paliers (zoom / panoramique) et surlignage. Coordonnées en pixels de l'image. */
export type PanKey = { t: number; z: number; cx: number; cy: number };
export type Mark = { from: number; to: number; x: number; y: number; w: number; h: number };
export const PanShot: React.FC<{ src: string; iw: number; ih: number; keys: PanKey[]; end: number; marks?: Mark[]; video?: boolean; hide?: { x: number; y: number; w: number; h: number }[] }> = ({ src, iw, ih, keys, end, marks = [], video, hide = [] }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const ts = keys.map((k) => k.t);
  const z = Math.exp(keyed(t, ts, keys.map((k) => Math.log(k.z))));
  const cx = keyed(t, ts, keys.map((k) => k.cx));
  const cy = keyed(t, ts, keys.map((k) => k.cy));
  const left = W / 2 - cx * z;
  const top = H / 2 - cy * z;
  const s = staticFile(`${D}/${src}`);
  const m = marks.find((k) => t >= k.from - 0.4 && t < k.to + 0.4);
  const mo = m ? inOut(t, m.from, m.to, 0.4, 0.4) : 0;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Backdrop />
      <div style={{ position: "absolute", left, top, width: iw, height: ih, transformOrigin: "0 0", transform: `scale(${z})`, borderRadius: 36 / z, overflow: "hidden", boxShadow: "0 60px 140px -30px rgba(0,0,0,0.9)" }}>
        {video ? <OffthreadVideo src={s} muted style={{ width: iw, height: ih, display: "block" }} /> : <Img src={s} style={{ width: iw, height: ih, display: "block" }} />}
        {hide.map((r, i) => (
          <div key={i} style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: 12, backdropFilter: "blur(18px)", background: "rgba(120,120,120,0.25)" }} />
        ))}
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

// ─── Carte joueur « façon FIFA » : se remplit à chaque choix du Character Builder ───
export type Attr = { k: string; v: string; at: number };
export const PlayerCard: React.FC<{ attrs: Attr[]; end: number; revealAt: number; genAt: number; x: number; y: number }> = ({ attrs, end, revealAt, genAt, x, y }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.5, 0.45);
  const b = blurIn(t, 0, 0.6, 50);
  const shown = attrs.filter((a) => t >= a.at);
  const last = shown[shown.length - 1];
  const rev = keyed(t, [revealAt, revealAt + 0.7], [0, 1], EASE);
  const gen = t >= genAt && t < revealAt;
  const rating = Math.round(keyed(t, [revealAt + 0.3, revealAt + 1.3], [0, 91], EASE));
  const rows = attrs.length;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 780, opacity: Math.min(o, Number(b.opacity)), transform: b.transform, filter: b.filter, fontFamily: FONT }}>
      <div style={{ borderRadius: 44, padding: 3, background: `linear-gradient(150deg, ${LIME}, rgba(198,243,109,0.15) 40%, rgba(198,243,109,0.55))`, boxShadow: "0 50px 120px -30px rgba(0,0,0,0.9), 0 0 80px rgba(198,243,109,0.18)" }}>
        <div style={{ borderRadius: 41, background: "linear-gradient(170deg, #1a2113 0%, #0e120b 60%)", padding: "30px 36px 34px" }}>
          <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
            <div style={{ width: 210, height: 236, borderRadius: 28, overflow: "hidden", position: "relative", background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(198,243,109,0.35)", flexShrink: 0 }}>
              <svg viewBox="0 0 100 112" style={{ position: "absolute", inset: 0, opacity: 0.35 * (1 - rev) }}>
                <circle cx="50" cy="40" r="20" fill={LIME} />
                <path d="M12 112c4-30 20-42 38-42s34 12 38 42z" fill={LIME} />
              </svg>
              {gen && <div style={{ position: "absolute", inset: 0, background: `linear-gradient(100deg, transparent 30%, rgba(198,243,109,0.35) 50%, transparent 70%)`, transform: `translateX(${(((t - genAt) * 1.4) % 1.6) * 200 - 160}px)` }} />}
              <Img src={staticFile(`${D}/perso_face.png`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: rev, transform: `scale(${1.15 - 0.15 * rev})` }} />
            </div>
            <div style={{ flex: 1 }}>
              <Eyebrow size={26}>Mon influenceur IA</Eyebrow>
              <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 8 }}>
                <div style={{ fontSize: 120, fontWeight: 600, color: rev > 0.01 ? LIME : "rgba(255,255,255,0.25)", letterSpacing: "-0.05em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{rev > 0.01 ? rating : "??"}</div>
                <div style={{ fontSize: 40, color: MUTED }}>{gen ? "génération…" : rev > 0.01 ? "prêt" : `${shown.length} / ${rows} choix`}</div>
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 26, rowGap: 10, marginTop: 26 }}>
            {attrs.map((a) => {
              const p = keyed(t, [a.at, a.at + 0.45], [0, 1], EASE);
              const fresh = last === a && t - a.at < 1.6 && rev < 0.01;
              return (
                <div key={a.k} style={{ borderRadius: 18, padding: "8px 16px", background: fresh ? "rgba(198,243,109,0.16)" : "rgba(255,255,255,0.04)", border: `1.5px solid ${fresh ? "rgba(198,243,109,0.7)" : "rgba(255,255,255,0.06)"}`, display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, minHeight: 50 }}>
                  <span style={{ fontSize: 26, color: MUTED, whiteSpace: "nowrap" }}>{a.k}</span>
                  <span style={{ fontSize: 34, color: p > 0 ? INK : "rgba(255,255,255,0.18)", fontWeight: 500, letterSpacing: "-0.02em", whiteSpace: "nowrap", opacity: 0.25 + 0.75 * p, transform: `translateY(${(1 - p) * 8}px)` }}>{p > 0 ? a.v : "—"}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

/** Transfert de mouvement : ta vraie vidéo → ton personnage (Genjutsu). */
export const TransferCard: React.FC<{ end: number; caption: string; captionAt?: number }> = ({ end, caption, captionAt = 0.6 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const h = 720;
  const w = Math.round((h * 9) / 16);
  const arrow = keyed(t, [0.7, 1.3], [0, 1], EASE);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Backdrop />
      <div style={{ position: "absolute", left: 360, top: 120, ...blurIn(t, 0.05, 0.5, 30) }}>
        <div style={card}>
          <Loop durationInFrames={146} layout="none">
            <OffthreadVideo src={staticFile(`${D}/moi_reference.mp4`)} muted style={{ width: w, height: h, borderRadius: 26, display: "block", objectFit: "cover" }} />
          </Loop>
        </div>
        <div style={{ textAlign: "center", marginTop: 18, fontFamily: FONT, fontSize: 44, color: INK }}>{rich("Ma *vraie* vidéo")}</div>
      </div>
      <svg width={260} height={80} viewBox="0 0 260 80" style={{ position: "absolute", left: 830, top: 440 }}>
        <path d={`M10 40 H${10 + 220 * arrow}`} stroke={LIME} strokeWidth={8} strokeLinecap="round" />
        {arrow > 0.95 && <path d="M200 14 L240 40 L200 66" stroke={LIME} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
      <div style={{ position: "absolute", left: 1150, top: 120, ...blurIn(t, 1.1, 0.5, 30) }}>
        <div style={card}>
          <Img src={staticFile(`${D}/perso_body.png`)} style={{ width: w, height: h, borderRadius: 26, display: "block", objectFit: "cover", background: "#fff" }} />
        </div>
        <div style={{ textAlign: "center", marginTop: 18, fontFamily: FONT, fontSize: 44, color: INK }}>{rich("Mon *personnage*")}</div>
      </div>
      <Caption text={caption} end={end} at={captionAt} bottom={40} />
    </AbsoluteFill>
  );
};

/** Fiche de réglages qui se coche au fil des choix (démo Genjutsu). */
export const SettingsCard: React.FC<{ title: string; rows: { k: string; v: string; at: number }[]; end: number; x: number; y: number; goAt?: number }> = ({ title, rows, end, x, y, goAt }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.5, 0.4);
  const b = blurIn(t, 0, 0.6, 50);
  const go = goAt !== undefined ? keyed(t, [goAt, goAt + 0.4], [0, 1], EASE) : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 800, opacity: Math.min(o, Number(b.opacity)), transform: b.transform, filter: b.filter, fontFamily: FONT }}>
      <div style={{ ...glass, borderRadius: 40, padding: "34px 40px", background: "linear-gradient(170deg, rgba(26,33,19,0.96), rgba(14,18,11,0.96))", border: "1.5px solid rgba(198,243,109,0.35)" }}>
        <Eyebrow size={28}>{title}</Eyebrow>
        <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 14 }}>
          {rows.map((r) => {
            const p = keyed(t, [r.at, r.at + 0.4], [0, 1], EASE);
            const fresh = t >= r.at && t - r.at < 1.5;
            return (
              <div key={r.k} style={{ display: "flex", alignItems: "center", gap: 20, borderRadius: 20, padding: "12px 20px", background: fresh ? "rgba(198,243,109,0.14)" : "rgba(255,255,255,0.04)", border: `1.5px solid ${fresh ? "rgba(198,243,109,0.65)" : "rgba(255,255,255,0.06)"}` }}>
                <div style={{ width: 40, height: 40, borderRadius: 999, border: `2.5px solid ${p > 0 ? LIME : "rgba(255,255,255,0.2)"}`, background: p > 0 ? `rgba(198,243,109,${0.9 * p})` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "#0d1208", fontSize: 26, fontWeight: 700, flexShrink: 0 }}>{p > 0.5 ? "✓" : ""}</div>
                <span style={{ fontSize: 34, color: MUTED, width: 230, flexShrink: 0 }}>{r.k}</span>
                <span style={{ fontSize: 42, color: p > 0 ? INK : "rgba(255,255,255,0.18)", fontWeight: 500, letterSpacing: "-0.02em", opacity: 0.3 + 0.7 * p }}>{p > 0 ? rich(r.v) : "—"}</span>
              </div>
            );
          })}
        </div>
        {goAt !== undefined && (
          <div style={{ marginTop: 22, borderRadius: 22, padding: "16px 0", textAlign: "center", fontSize: 44, fontWeight: 600, color: go > 0.5 ? "#0d1208" : "rgba(255,255,255,0.3)", background: go > 0.5 ? LIME : "rgba(255,255,255,0.05)", transform: `scale(${1 + 0.04 * Math.sin(go * Math.PI)})` }}>Générer</div>
        )}
      </div>
    </div>
  );
};

/** Avant / après : ma vraie vidéo à gauche, la vidéo générée (fichier d'origine) à droite. */
export const SideBySide: React.FC<{ end: number; right: string; rightLoop: number; caption: string; captionAt?: number }> = ({ end, right, rightLoop, caption, captionAt = 0.8 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const h = 740;
  const w = Math.round((h * 9) / 16);
  const clip = (src: string, loop: number) => (
    <Loop durationInFrames={Math.round(loop * 30)} layout="none">
      <OffthreadVideo src={staticFile(`${D}/${src}`)} muted style={{ width: w, height: h, borderRadius: 26, display: "block", objectFit: "cover" }} />
    </Loop>
  );
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Backdrop />
      <div style={{ position: "absolute", left: 440, top: 40, ...blurIn(t, 0.05, 0.5, 30) }}>
        <div style={card}>{clip("moi_reference.mp4", 4.87)}</div>
        <div style={{ textAlign: "center", marginTop: 14, fontFamily: FONT, fontSize: 44, color: INK }}>{rich("Moi, *en vrai*")}</div>
      </div>
      <div style={{ position: "absolute", left: 1060, top: 40, ...blurIn(t, 0.35, 0.5, 30) }}>
        <div style={card}>{clip(right, rightLoop)}</div>
        <div style={{ textAlign: "center", marginTop: 14, fontFamily: FONT, fontSize: 44, color: INK }}>{rich("Mon *personnage*")}</div>
      </div>
      <Caption text={caption} end={end} at={captionAt} bottom={40} />
    </AbsoluteFill>
  );
};
