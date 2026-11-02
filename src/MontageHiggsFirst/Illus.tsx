// Illustrations du montage « Higgsfield First Video » (le même personnage dans chaque vidéo IA ; sponsor : Higgsfield).
// Illustrer par le réel : les vraies générations du compte d'Ibrahim (Awa, la fiche, Abidjan, Bali) et le kit média de la marque.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile } from "remotion";
import { Backdrop, blurIn, EASE, Eyebrow, FONT, glass, INK, INK_SOFT, inOut, keyed, LIME, rich, SHADOW, useT } from "../montage/lib";

export const D = "montage/higgs-first";
const card: React.CSSProperties = { ...glass, background: "rgba(16,20,14,0.92)", borderRadius: 30, boxShadow: SHADOW };
const pillCss: React.CSSProperties = { ...glass, background: "rgba(14,17,12,0.9)", borderRadius: 999, padding: "12px 30px", fontSize: 34, color: INK };

/** Une génération vidéo en plein cadre (16:9), avec son propre son. `from` = seconde du clip au début de la Sequence. */
export const FullClip: React.FC<{ src: string; end: number; from?: number; volume?: number; caption?: string; captionAt?: number; captionEnd?: number; fadeIn?: number }> = ({
  src,
  end,
  from = 0,
  volume = 1,
  caption,
  captionAt = 0.8,
  captionEnd = 5.5,
  fadeIn = 0.01,
}) => {
  const t = useT();
  const o = inOut(t, 0, end, fadeIn, 0.25);
  const s = keyed(t, [0, end], [1.0, 1.03]);
  return (
    <AbsoluteFill style={{ opacity: o, background: "black", fontFamily: FONT }}>
      <AbsoluteFill style={{ transform: `scale(${s})` }}>
        <OffthreadVideo src={staticFile(`${D}/${src}`)} trimBefore={Math.round(from * 30)} volume={volume} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {caption && t < captionEnd && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 48, display: "flex", justifyContent: "center", opacity: inOut(t, captionAt, captionEnd, 0.4, 0.4) }}>
          <div style={{ ...pillCss, ...blurIn(t, captionAt, 0.4, 14) }}>{rich(caption)}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Deux générations côte à côte (Abidjan | Bali), coches « même visage… » en dessous. */
export const ClipDuo: React.FC<{ end: number; left: { src: string; from: number; label: string }; right: { src: string; from: number; label: string }; checks: { text: string; at: number }[] }> = ({ end, left, right, checks }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const panel = (c: { src: string; from: number; label: string }, at: number) => (
    <div style={{ ...blurIn(t, at, 0.45, 26), textAlign: "center" }}>
      <div style={{ ...card, padding: 10 }}>
        <OffthreadVideo src={staticFile(`${D}/${c.src}`)} trimBefore={Math.round(c.from * 30)} muted style={{ width: 840, height: 472, borderRadius: 22, display: "block", objectFit: "cover" }} />
      </div>
      <div style={{ marginTop: 16, fontSize: 30, letterSpacing: "0.14em", textTransform: "uppercase", color: LIME, fontWeight: 500 }}>{c.label}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT, color: INK, justifyContent: "center", alignItems: "center" }}>
      <Backdrop />
      <div style={{ display: "flex", gap: 50, alignItems: "flex-start" }}>
        {panel(left, 0.05)}
        {panel(right, 0.2)}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 36 }}>
        {checks.map((c, i) => (
          <div key={i} style={{ ...blurIn(t, c.at, 0.35, 10), ...pillCss, fontSize: 32 }}>
            <span style={{ color: LIME, fontWeight: 600, marginRight: 10 }}>✓</span>
            {rich(c.text)}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** Une diapo du kit média (1920×1080) posée en carte, poussée lente ; `hl` = bandeau lime sur une ligne du tableau. */
export const Slide: React.FC<{ src: string; end: number; hl?: { from: number; to: number; y: number; h?: number; x?: number; w?: number }[] }> = ({ src, end, hl = [] }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.35, 0.35);
  const s = keyed(t, [0, end], [1.0, 1.04]);
  const k = 1640 / 1920;
  return (
    <AbsoluteFill style={{ opacity: o, justifyContent: "center", alignItems: "center" }}>
      <Backdrop />
      <div style={{ ...card, padding: 10, transform: `scale(${s})`, ...blurIn(t, 0, 0.5, 30) }}>
        <div style={{ position: "relative", width: 1640, height: 922, borderRadius: 22, overflow: "hidden" }}>
          <Img src={staticFile(`${D}/mediakit/${src}`)} style={{ width: "100%", height: "100%", display: "block" }} />
          {hl.map((h, i) => {
            const ho = inOut(t, h.from, h.to, 0.3, 0.3);
            return ho > 0 ? (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: (h.x ?? 150) * k,
                  top: (h.y - (h.h ?? 110) / 2) * k,
                  width: (h.w ?? 1620) * k,
                  height: (h.h ?? 110) * k,
                  borderRadius: 18,
                  border: `3px solid ${LIME}`,
                  background: "rgba(198,243,109,0.10)",
                  boxShadow: "0 0 40px rgba(198,243,109,0.35)",
                  opacity: ho,
                }}
              />
            ) : null;
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Les deux familles d'IA : images | vidéos. */
export const FamilyDuo: React.FC<{ end: number; leftAt: number; rightAt: number; title: string; titleAt?: number }> = ({ end, leftAt, rightAt, title, titleAt = 0 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const box = (icon: React.ReactNode, label: string, meta: string, at: number) => (
    <div style={{ ...card, width: 620, padding: "56px 54px", ...blurIn(t, at, 0.45, 30) }}>
      {icon}
      <div style={{ fontSize: 62, fontWeight: 500, color: INK, letterSpacing: "-0.04em", marginTop: 26, whiteSpace: "nowrap" }}>{rich(label)}</div>
      <div style={{ fontSize: 38, color: INK_SOFT, marginTop: 12 }}>{meta}</div>
    </div>
  );
  const ic = (d: string) => (
    <svg width={86} height={86} viewBox="0 0 24 24" fill="none" stroke={LIME} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT, justifyContent: "center", alignItems: "center" }}>
      <Backdrop />
      <div style={{ fontSize: 92, fontWeight: 500, color: INK, letterSpacing: "-0.04em", marginBottom: 60, ...blurIn(t, titleAt, 0.45, 20) }}>{rich(title)}</div>
      <div style={{ display: "flex", gap: 50 }}>
        {box(ic("M3 5h18v14H3zM3 15l5-5 4 4 3-3 6 6"), "Modèles *d'images*", "Ils créent des photos", leftAt)}
        {box(ic("M3 6h13v12H3zM16 10l5-3v10l-5-3"), "Modèles *de vidéos*", "Ils créent des vidéos", rightAt)}
      </div>
    </AbsoluteFill>
  );
};

/** Une image générée en grand, sur le fond de la charte ; `marks` = cadres lime posés sur des zones (fractions de l'image). */
export const ImageStage: React.FC<{
  src: string;
  iw: number;
  ih: number;
  end: number;
  h?: number;
  label?: string;
  labelAt?: number;
  marks?: { at: number; x0: number; x1: number; label: string }[];
}> = ({ src, iw, ih, end, h = 880, label, labelAt = 0.6, marks = [] }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const s = keyed(t, [0, end], [1.0, 1.03]);
  const w = Math.min(1760, (h * iw) / ih);
  const hh = (w * ih) / iw;
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT, justifyContent: "center", alignItems: "center" }}>
      <Backdrop />
      <div style={{ ...card, padding: 10, transform: `scale(${s})`, marginTop: label ? -50 : 0, ...blurIn(t, 0, 0.5, 30) }}>
        <div style={{ position: "relative", width: w, height: hh, borderRadius: 22, overflow: "hidden" }}>
          <Img src={staticFile(`${D}/${src}`)} style={{ width: "100%", height: "100%", display: "block" }} />
          {marks.map((m, i) => (
            <div key={i} style={{ position: "absolute", left: m.x0 * w + 8, top: 8, width: (m.x1 - m.x0) * w - 16, height: hh - 16, borderRadius: 16, border: `4px solid ${LIME}`, opacity: inOut(t, m.at, end, 0.3, 0.3) }}>
              <div style={{ position: "absolute", left: 16, bottom: 16, background: LIME, color: "#0d1208", borderRadius: 999, padding: "8px 22px", fontSize: 32, fontWeight: 600, ...blurIn(t, m.at, 0.35, 10) }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>
      {label && (
        <div style={{ position: "absolute", bottom: 40, ...blurIn(t, labelAt, 0.4, 14) }}>
          <div style={pillCss}>{rich(label)}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Le prix affiché sur le bouton Generate, en carte à droite (l'écran zoome sur le bouton). */
export const PriceTag: React.FC<{ end: number; what: string; value: string; unit?: string }> = ({ end, what, value, unit = "crédits" }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  return (
    <div style={{ position: "absolute", right: 70, top: 150, opacity: o, fontFamily: FONT, ...blurIn(t, 0, 0.45, 24) }}>
      <div style={{ ...card, padding: "30px 40px", minWidth: 420 }}>
        <Eyebrow size={26}>{what}</Eyebrow>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 10 }}>
          <span style={{ fontSize: 120, fontWeight: 500, color: LIME, letterSpacing: "-0.05em", lineHeight: 1, ...blurIn(t, 0.2, 0.4, 20) }}>{value}</span>
          <span style={{ fontSize: 42, color: INK_SOFT }}>{unit}</span>
        </div>
      </div>
    </div>
  );
};

/** Ma combinaison : modèle d'image + modèle de vidéo. */
export const ComboCard: React.FC<{ end: number; leftAt: number; rightAt: number }> = ({ end, leftAt, rightAt }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const plus = keyed(t, [rightAt - 0.4, rightAt], [0, 1], EASE);
  const box = (eyebrow: string, name: string, at: number) => (
    <div style={{ ...card, width: 600, padding: "50px 50px", ...blurIn(t, at, 0.45, 30) }}>
      <Eyebrow size={28}>{eyebrow}</Eyebrow>
      <div style={{ fontSize: 84, fontWeight: 500, color: INK, letterSpacing: "-0.04em", marginTop: 16 }}>{rich(name)}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT, justifyContent: "center", alignItems: "center" }}>
      <Backdrop />
      <div style={{ fontSize: 40, color: LIME, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 50, ...blurIn(t, 0, 0.4, 14) }}>Ma combinaison</div>
      <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
        {box("Image", "GPT Image *2.5*", leftAt)}
        <div style={{ fontSize: 110, color: LIME, opacity: plus }}>+</div>
        {box("Vidéo", "Seedance *2.5*", rightAt)}
      </div>
    </AbsoluteFill>
  );
};

/** Un abonnement par plateforme : les tuiles tombent, puis le total. */
export const SubsCard: React.FC<{ end: number; items: { name: string; at: number }[]; total: string; totalAt: number; title: string }> = ({ end, items, total, totalAt, title }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT, justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontSize: 84, fontWeight: 500, color: INK, letterSpacing: "-0.04em", marginBottom: 56, ...blurIn(t, 0.1, 0.45, 20) }}>{rich(title)}</div>
      <div style={{ display: "flex", gap: 28 }}>
        {items.map((it, i) => (
          <div key={i} style={{ ...card, width: 330, padding: "40px 34px", ...blurIn(t, it.at, 0.45, 30) }}>
            <div style={{ fontSize: 46, fontWeight: 500, color: INK, letterSpacing: "-0.03em" }}>{it.name}</div>
            <div style={{ marginTop: 22, display: "inline-block", borderRadius: 999, padding: "8px 20px", border: "1.5px solid rgba(255,138,122,0.5)", color: "#ff8a7a", fontSize: 30 }}>+ 1 abonnement</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 56, ...pillCss, fontSize: 44, padding: "16px 40px", ...blurIn(t, totalAt, 0.45, 16) }}>{rich(total)}</div>
    </AbsoluteFill>
  );
};

/** Carte de conseil plein écran : sur-titre, titre, lignes cochées (✓) ou barrées (✗). */
export const TipBoard: React.FC<{ end: number; eyebrow: string; title: string; titleAt?: number; rows: { text: string; at: number; ok?: boolean }[] }> = ({ end, eyebrow, title, titleAt = 0.1, rows }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT, justifyContent: "center", alignItems: "center" }}>
      <div style={{ ...card, width: 1300, padding: "60px 72px", ...blurIn(t, 0, 0.5, 30) }}>
        <Eyebrow size={30}>{eyebrow}</Eyebrow>
        <div style={{ fontSize: 76, fontWeight: 500, color: INK, letterSpacing: "-0.04em", lineHeight: 1.1, marginTop: 18, ...blurIn(t, titleAt, 0.45, 20) }}>{rich(title)}</div>
        <div style={{ marginTop: 40 }}>
          {rows.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, fontSize: 46, color: INK_SOFT, padding: "16px 0", ...blurIn(t, r.at, 0.4, 16) }}>
              <span style={{ width: 54, height: 54, borderRadius: 27, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 700, background: r.ok === false ? "rgba(255,138,122,0.16)" : "rgba(198,243,109,0.16)", color: r.ok === false ? "#ff8a7a" : LIME }}>{r.ok === false ? "✗" : "✓"}</span>
              <span>{rich(r.text)}</span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** La trend d'origine (à gauche, muette) et Awa qui la reprend (à droite, avec son son), en vertical. */
export const TrendDuo: React.FC<{ end: number; volume?: number }> = ({ end, volume = 1 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.3);
  const panel = (src: string, label: string, at: number, muted: boolean, accent: boolean) => (
    <div style={{ ...blurIn(t, at, 0.45, 26), textAlign: "center" }}>
      <div style={{ ...card, padding: 10, borderColor: accent ? "rgba(198,243,109,0.45)" : undefined }}>
        <OffthreadVideo src={staticFile(`${D}/${src}`)} muted={muted} volume={muted ? 0 : volume} style={{ width: 470, height: 836, borderRadius: 22, display: "block", objectFit: "cover" }} />
      </div>
      <div style={{ marginTop: 14, fontSize: 28, letterSpacing: "0.14em", textTransform: "uppercase", color: accent ? LIME : INK_SOFT, fontWeight: 500 }}>{label}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT, justifyContent: "center", alignItems: "center" }}>
      <Backdrop />
      <div style={{ display: "flex", gap: 70, alignItems: "flex-start" }}>
        {panel("genjutsu_source.mp4", "La trend", 0.05, true, false)}
        {panel("genjutsu.mp4", "Awa · Genjutsu", 0.2, false, true)}
      </div>
    </AbsoluteFill>
  );
};
