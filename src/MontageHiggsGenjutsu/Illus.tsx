// Illustrations du montage « Higgsfield Genjutsu for Reels » (refaire des Reels viraux avec l'IA ; sponsor : Higgsfield).
// Les shorts générés arrivent plus tard : tant qu'un fichier manque, son emplacement affiche une carte « en attente ».
import React from "react";
import { AbsoluteFill, Loop, OffthreadVideo, staticFile } from "remotion";
import { Backdrop, blurIn, Eyebrow, FONT, glass, INK, INK_SOFT, inOut, keyed, LIME, rich, SHADOW, useT } from "../montage/lib";

export const D = "montage/higgs-genjutsu";
const card: React.CSSProperties = { ...glass, background: "rgba(16,20,14,0.92)", borderRadius: 30, boxShadow: SHADOW };
const pillCss: React.CSSProperties = { ...glass, background: "rgba(14,17,12,0.9)", borderRadius: 999, padding: "12px 30px", fontSize: 34, color: INK };

/** Un short généré : fichier (dans public/montage/higgs-genjutsu/) et durée en secondes. src null = pas encore reçu. */
export type ShortFile = { src: string | null; dur: number; label: string };

/** Une vidéo verticale 9:16 dans une carte ; sans fichier, un emplacement « en attente » bien visible. */
export const VerticalClip: React.FC<{ s: ShortFile; h: number; from?: number; volume?: number; muted?: boolean; loop?: boolean }> = ({ s, h, from = 0, volume = 1, muted, loop }) => {
  const w = (h * 9) / 16;
  if (!s.src) {
    return (
      <div style={{ width: w, height: h, borderRadius: 22, background: "repeating-linear-gradient(135deg, #1a2014 0 22px, #141910 22px 44px)", border: `3px dashed ${LIME}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: FONT }}>
        <div style={{ fontSize: Math.max(26, h / 18), color: LIME, fontWeight: 600, textAlign: "center", padding: "0 20px" }}>{s.label}</div>
        <div style={{ fontSize: Math.max(18, h / 34), color: INK_SOFT }}>en attente du fichier</div>
      </div>
    );
  }
  const v = <OffthreadVideo src={staticFile(`${D}/${s.src}`)} trimBefore={Math.round(from * 30)} muted={muted} volume={muted ? 0 : volume} style={{ width: w, height: h, borderRadius: 22, display: "block", objectFit: "cover" }} />;
  return loop ? <Loop layout="none" durationInFrames={Math.max(1, Math.round((s.dur - from) * 30))}>{v}</Loop> : v;
};

/** Un short joué en entier, en grand au centre, avec son son ; légende en bas (« Ce n'est pas moi… »). */
export const ShortInsert: React.FC<{ s: ShortFile; end: number; volume?: number; eyebrow?: string; caption?: string; captionAt?: number }> = ({ s, end, volume = 1, eyebrow, caption, captionAt = 0.4 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.25, 0.3);
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT, justifyContent: "center", alignItems: "center" }}>
      <Backdrop />
      <div style={{ ...card, padding: 10, ...blurIn(t, 0, 0.45, 24) }}>
        <VerticalClip s={s} h={900} volume={volume} />
      </div>
      {eyebrow && (
        <div style={{ position: "absolute", left: 130, top: 330, width: 560, ...blurIn(t, 0.3, 0.45, 20) }}>
          <Eyebrow size={30}>{eyebrow}</Eyebrow>
        </div>
      )}
      {caption && (
        <div style={{ position: "absolute", right: 110, top: 430, width: 560, ...blurIn(t, captionAt, 0.45, 20) }}>
          <div style={{ ...pillCss, borderRadius: 28, padding: "26px 34px", fontSize: 44, lineHeight: 1.2 }}>{rich(caption)}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Les 3 shorts côte à côte (intro), muets sous la voix. */
export const ShortTrio: React.FC<{ end: number; shorts: ShortFile[]; title?: string; titleAt?: number }> = ({ end, shorts, title, titleAt = 0.6 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT, justifyContent: "center", alignItems: "center" }}>
      <Backdrop />
      <div style={{ display: "flex", gap: 40, marginTop: title ? 70 : 0 }}>
        {shorts.map((s, i) => (
          <div key={i} style={{ ...card, padding: 8, ...blurIn(t, 0.1 + i * 0.2, 0.45, 30) }}>
            <VerticalClip s={s} h={780} muted loop />
          </div>
        ))}
      </div>
      {title && <div style={{ position: "absolute", top: 46, fontSize: 64, fontWeight: 500, color: INK, letterSpacing: "-0.03em", ...blurIn(t, titleAt, 0.45, 16) }}>{rich(title)}</div>}
    </AbsoluteFill>
  );
};

/** Un Reel de référence : la vidéo verticale (son bas sous la voix), le compte et les vues en gros. */
export const ReelCard: React.FC<{ src: string; dur: number; end: number; views: string; handle: string; topic: string; volume?: number; viewsAt?: number }> = ({ src, dur, end, views, handle, topic, volume = 0.22, viewsAt = 0.6 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <Backdrop />
      <div style={{ position: "absolute", left: 300, top: 70, ...card, padding: 8, ...blurIn(t, 0, 0.45, 26) }}>
        <Loop layout="none" durationInFrames={Math.round(dur * 30)}>
          <OffthreadVideo src={staticFile(`${D}/reels/${src}`)} volume={volume} style={{ width: 528, height: 938, borderRadius: 22, display: "block", objectFit: "cover" }} />
        </Loop>
      </div>
      <div style={{ position: "absolute", left: 960, top: 300, width: 800 }}>
        <div style={{ fontSize: 34, color: INK_SOFT, ...blurIn(t, 0.2, 0.4, 14) }}>{handle} · Instagram</div>
        <div style={{ fontSize: 190, fontWeight: 500, color: LIME, letterSpacing: "-0.05em", lineHeight: 1, marginTop: 14, ...blurIn(t, viewsAt, 0.45, 24) }}>{views}</div>
        <div style={{ fontSize: 46, color: INK, marginTop: 10, ...blurIn(t, viewsAt + 0.15, 0.4, 16) }}>de vues</div>
        <div style={{ marginTop: 40, ...pillCss, display: "inline-block", ...blurIn(t, viewsAt + 0.5, 0.4, 14) }}>{rich(topic)}</div>
      </div>
    </AbsoluteFill>
  );
};

/** Les 4 Reels de référence en mosaïque (intro), muets. */
export const ReelWall: React.FC<{ end: number; reels: { src: string; dur: number; views: string }[]; title: string; titleAt?: number }> = ({ end, reels, title, titleAt = 0.3 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT, alignItems: "center" }}>
      <Backdrop />
      <div style={{ marginTop: 60, fontSize: 70, fontWeight: 500, color: INK, letterSpacing: "-0.03em", ...blurIn(t, titleAt, 0.45, 16) }}>{rich(title)}</div>
      <div style={{ display: "flex", gap: 30, marginTop: 40 }}>
        {reels.map((r, i) => (
          <div key={i} style={{ position: "relative", ...card, padding: 8, ...blurIn(t, 0.2 + i * 0.25, 0.45, 30) }}>
            <Loop layout="none" durationInFrames={Math.round(r.dur * 30)}>
              <OffthreadVideo src={staticFile(`${D}/reels/${r.src}`)} muted style={{ width: 380, height: 676, borderRadius: 22, display: "block", objectFit: "cover" }} />
            </Loop>
            <div style={{ position: "absolute", left: 22, bottom: 22, background: LIME, color: "#0d1208", borderRadius: 999, padding: "8px 22px", fontSize: 38, fontWeight: 600 }}>{r.views}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** Les 3 accroches : les débuts de chaque version, numérotés, l'un après l'autre (avec son). */
export const HooksInsert: React.FC<{ end: number; hooks: ShortFile[]; each: number }> = ({ end, hooks, each }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.25, 0.3);
  const k = Math.min(hooks.length - 1, Math.floor(t / each));
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT, justifyContent: "center", alignItems: "center" }}>
      <Backdrop />
      <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
        {hooks.map((h, i) => {
          const on = i === k;
          const s = keyed(t, [i * each - 0.3, i * each], [0.86, 1]);
          return (
            <div key={i} style={{ textAlign: "center", opacity: on ? 1 : 0.35, transform: `scale(${on ? s : 0.86})` }}>
              <div style={{ ...card, padding: 8, borderColor: on ? "rgba(198,243,109,0.6)" : undefined }}>
                <VerticalClip s={h} h={720} muted={!on} />
              </div>
              <div style={{ marginTop: 16, fontSize: 40, color: on ? LIME : INK_SOFT, fontWeight: 600 }}>Accroche {i + 1}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Mes Shorts faceless (Weird Map Facts) en grille, muets. */
export const ShortsGrid: React.FC<{ end: number; files: string[]; title: string; titleAt?: number }> = ({ end, files, title, titleAt = 0.2 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT, alignItems: "center" }}>
      <Backdrop />
      <div style={{ marginTop: 60, fontSize: 66, fontWeight: 500, color: INK, letterSpacing: "-0.03em", ...blurIn(t, titleAt, 0.45, 16) }}>{rich(title)}</div>
      <div style={{ display: "flex", gap: 30, marginTop: 40 }}>
        {files.map((f, i) => (
          <div key={f} style={{ ...card, padding: 8, ...blurIn(t, 0.2 + i * 0.2, 0.45, 30) }}>
            <Loop layout="none" durationInFrames={240}>
              <OffthreadVideo src={staticFile(`${D}/geo/${f}`)} muted style={{ width: 380, height: 676, borderRadius: 22, display: "block", objectFit: "cover" }} />
            </Loop>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
