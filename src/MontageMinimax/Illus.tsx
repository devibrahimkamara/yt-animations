// Illustrations du montage MiniMax (jeu mobile « Stack Up » créé avec MiniMax Code ; sponsor : MiniMax).
// Source unique : le fichier fusionné du monteur (capture + webcam en médaillon). Tout vient de cette capture,
// sauf les pages Poki / CrazyGames (captures du 19/10/2026) et le logo de l'app (redessiné d'après la capture).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { Backdrop, blurIn, EASE, Eyebrow, f, FONT, glass, H, INK, inOut, keyed, LIME, MUTED, rich, Star, useT, W } from "../montage/lib";

export const D = "montage/minimax";
export const CAP = `${D}/captures`;
export const SRC = `${D}/src.mp4`;
export const PHONE = `${D}/phone.mp4`; // téléphone recadré (498×1080), t = 0 ↔ source 495 s
export const PHONE_T0 = 495;
const card: React.CSSProperties = { ...glass, padding: 10, borderRadius: 34, background: "rgba(18,22,15,0.94)" };

/** Fenêtre de l'app dans la capture (mesurée) et médaillon d'origine du monteur. */
export const WIN = { x: 104, y: 52, w: 1712, h: 978 };
export const MED_SRC = { x: 1606, y: 712, w: 240, h: 328 }; // intérieur du médaillon d'origine (coins exclus)
export const PIP = { x: 1588, y: 688, w: 274, h: 374 }; // notre médaillon : couvre l'original quand l'écran est à z = 1

/** Médaillon reconstruit : la webcam découpée dans la capture, reposée en carte de verre. `rect` animable. */
export const MedallionPip: React.FC<{ trimBefore: number; rect?: (t: number) => { x: number; y: number; w: number; h: number; o: number } }> = ({ trimBefore, rect }) => {
  const t = useT();
  const r = rect ? rect(t) : { ...PIP, o: 1 };
  if (r.o <= 0.01) return null;
  const k = Math.max(r.w / MED_SRC.w, r.h / MED_SRC.h);
  return (
    <div style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, opacity: r.o, borderRadius: 34, overflow: "hidden", border: "1.5px solid rgba(255,255,255,0.16)", boxShadow: "0 30px 70px -20px rgba(0,0,0,0.8)", background: "#000" }}>
      <OffthreadVideo
        src={staticFile(SRC)}
        trimBefore={f(trimBefore)}
        muted
        style={{ position: "absolute", left: -MED_SRC.x * k + (r.w - MED_SRC.w * k) / 2, top: -MED_SRC.y * k + (r.h - MED_SRC.h * k) / 2, width: W * k, height: H * k, maxWidth: "none", maxHeight: "none", filter: "brightness(1.06) contrast(1.04)" }}
      />
    </div>
  );
};

/** « Le Glissé » : la face cam plein cadre rétrécit jusqu'au médaillon (au-dessus d'une image fixe de l'écran). */
export const GlideToPip: React.FC<{ trimBefore: number; dur: number; face: { x: number; y: number }; still: string }> = ({ trimBefore, dur, face, still }) => {
  const t = useT();
  const p = keyed(t, [0, dur], [0, 1], EASE);
  const pc = keyed(t, [0, dur], [0, 1], EASE);
  const lerp = (a: number, b: number, q: number) => a + (b - a) * q;
  const r = { x: lerp(0, PIP.x, p), y: lerp(0, PIP.y, pc), w: lerp(W, PIP.w, p), h: lerp(H, PIP.h, p) };
  const k = Math.max(r.w / W, r.h / H, lerp(1, 0.46, p));
  const left = Math.min(0, Math.max(r.w - W * k, r.w / 2 - face.x * W * k));
  const top = Math.min(0, Math.max(r.h - H * k, r.h / 2 - face.y * H * k));
  return (
    <AbsoluteFill>
      <StillStage src={still} />
      {/* cache le médaillon d'origine de l'image fixe pendant que le nôtre arrive */}
      <div style={{ position: "absolute", left: PIP.x, top: PIP.y, width: PIP.w, height: PIP.h, borderRadius: 34, background: "linear-gradient(180deg, rgba(18,22,15,0.96), rgba(9,11,8,0.96))", border: "1.5px solid rgba(255,255,255,0.10)" }} />
      <div style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: 34 * p, overflow: "hidden", border: p > 0.02 ? `1.5px solid rgba(255,255,255,${0.16 * p})` : undefined, boxShadow: p > 0.02 ? `0 30px 70px -20px rgba(0,0,0,${0.8 * p})` : undefined, background: "#000" }}>
        <OffthreadVideo src={staticFile(SRC)} trimBefore={f(trimBefore)} muted style={{ position: "absolute", left, top, width: W * k, height: H * k, maxWidth: "none", maxHeight: "none", filter: "brightness(1.10) contrast(1.05) saturate(1.06)" }} />
      </div>
    </AbsoluteFill>
  );
};

/** Image fixe de l'écran présentée comme ScreenStage à z = 1 (même géométrie). */
export const StillStage: React.FC<{ src: string }> = ({ src }) => (
  <AbsoluteFill>
    <Backdrop />
    <div style={{ position: "absolute", left: WIN.x, top: WIN.y, width: WIN.w, height: WIN.h, borderRadius: 28, overflow: "hidden", border: "1.5px solid rgba(255,255,255,0.08)", boxShadow: "0 60px 120px -30px rgba(0,0,0,0.85)" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: -WIN.x, top: -WIN.y, width: W, height: H, maxWidth: "none", maxHeight: "none" }} />
    </div>
  </AbsoluteFill>
);

/** Le téléphone réel en plein cadre (fond = la même vidéo floutée), texte en grand à droite. */
export const PhoneClip: React.FC<{ from: number; end: number; height?: number; x?: number; lines?: { text: string; at: number; size?: number }[]; textX?: number; inDur?: number }> = ({ from, end, height = 1000, x = 300, lines = [], textX = 980, inDur = 0.01 }) => {
  const t = useT();
  const o = inOut(t, 0, end, inDur, 0.3);
  const w = Math.round((height * 498) / 1080);
  const v = staticFile(PHONE);
  const tb = f(from - PHONE_T0);
  return (
    <AbsoluteFill style={{ opacity: o, background: "#000" }}>
      <OffthreadVideo src={v} trimBefore={tb} muted style={{ position: "absolute", inset: 0, width: W, height: H, objectFit: "cover", filter: "blur(46px) brightness(0.42) saturate(1.1)", transform: "scale(1.15)" }} />
      <div style={{ position: "absolute", left: x, top: (H - height) / 2 }}>
        <div style={{ ...card, padding: 8, borderRadius: 40 }}>
          <OffthreadVideo src={v} trimBefore={tb} muted style={{ width: w, height, borderRadius: 32, display: "block", objectFit: "cover" }} />
        </div>
      </div>
      <AbsoluteFill style={{ justifyContent: "center", paddingLeft: textX, paddingRight: 90, fontFamily: FONT }}>
        {lines.map((l, i) => (
          <div key={i} style={{ fontSize: l.size ?? 100, fontWeight: 500, color: INK, letterSpacing: "-0.04em", lineHeight: 1.04, marginBottom: 24, textShadow: "0 6px 40px rgba(0,0,0,0.8)", ...blurIn(t, l.at, 0.45, 26) }}>{rich(l.text)}</div>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** « 0 ligne de code » : le prompt (le seul « code » écrit) qui s'écrit, recréé en grand depuis l'écran. */
export const PromptHero: React.FC<{ end: number; text: string; headline: string; typeDur?: number }> = ({ end, text, headline, typeDur = 1.3 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.25, 0.3);
  const shown = Math.round(text.length * Math.min(1, Math.max(0, (t - 0.25) / typeDur)));
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <Backdrop />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 150 }}>
        <div style={{ fontSize: 150, fontWeight: 500, color: INK, letterSpacing: "-0.05em", lineHeight: 1, ...blurIn(t, 0.05, 0.45, 26) }}>{rich(headline)}</div>
        <div style={{ marginTop: 70, width: 1380, ...blurIn(t, 0.2, 0.5, 30) }}>
          <div style={{ ...glass, background: "linear-gradient(170deg, rgba(26,33,19,0.97), rgba(14,18,11,0.97))", borderRadius: 36, padding: "34px 44px", boxShadow: "0 40px 100px -30px rgba(0,0,0,0.9)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Img src={staticFile(`${D}/logo_minimax_code.svg`)} style={{ width: 44, height: 44 }} />
              <span style={{ fontSize: 30, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase" }}>Ton prompt · MiniMax Code</span>
            </div>
            <div style={{ fontSize: 50, color: INK, letterSpacing: "-0.02em", lineHeight: 1.25, marginTop: 20, minHeight: 190 }}>
              « {text.slice(0, shown)}
              {shown < text.length ? <span style={{ color: MUTED }}>▍</span> : " »"}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Un plan de la capture, cadré fixe (z, cx, cy) en plein écran, avec une légende éventuelle. */
export const ScreenFrag: React.FC<{ trimBefore: number; z: number; cx: number; cy: number; end: number; drift?: number; caption?: string; captionAt?: number; tilt?: boolean }> = ({ trimBefore, z, cx, cy, end, drift = 0.04, caption, captionAt = 0.3, tilt }) => {
  const t = useT();
  const zz = z * (1 + drift * keyed(t, [0, end], [0, 1]));
  const left = W / 2 - cx * zz;
  const top = H / 2 - cy * zz;
  const ry = tilt ? keyed(t, [0, 0.8], [-10, 0], EASE) : 0;
  return (
    <AbsoluteFill style={{ opacity: inOut(t, 0, end, 0.01, 0.01) }}>
      <Backdrop />
      <AbsoluteFill style={{ perspective: 2400 }}>
        <div style={{ position: "absolute", inset: 0, transform: `rotateY(${ry}deg)` }}>
          <OffthreadVideo src={staticFile(SRC)} trimBefore={f(trimBefore)} muted style={{ position: "absolute", left, top, width: W * zz, height: H * zz, maxWidth: "none", maxHeight: "none" }} />
        </div>
      </AbsoluteFill>
      {caption && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, display: "flex", justifyContent: "center", ...blurIn(t, captionAt, 0.45, 20) }}>
          <div style={{ ...glass, background: "rgba(14,17,12,0.92)", borderRadius: 999, padding: "18px 44px", fontFamily: FONT, fontSize: 54, color: INK, letterSpacing: "-0.02em" }}>{rich(caption)}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Teaser « À venir » : fragments d'une seconde (plans réels), coupés sur le rythme, légende continue. */
export type TeaserItem = { at: number; dur: number; node: React.ReactNode };
export const TeaserReel: React.FC<{ items: TeaserItem[]; end: number; label: string; labelAt: number; eyebrow: string }> = ({ items, end, label, labelAt, eyebrow }) => {
  const t = useT();
  return (
    <AbsoluteFill style={{ background: "#000", opacity: inOut(t, 0, end, 0.01, 0.3) }}>
      {items.map((it, i) => (
        <Sequence key={i} from={f(it.at)} durationInFrames={f(it.dur)} layout="none">
          <AbsoluteFill>{it.node}</AbsoluteFill>
        </Sequence>
      ))}
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(5,7,4,0.85) 0%, transparent 40%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 100, textAlign: "center", fontFamily: FONT }}>
        <Eyebrow size={32} style={blurIn(t, 0.1)}>{eyebrow}</Eyebrow>
        <div style={{ fontSize: 110, fontWeight: 500, color: INK, letterSpacing: "-0.045em", marginTop: 12, textShadow: "0 6px 40px rgba(0,0,0,0.8)", ...blurIn(t, labelAt, 0.45, 24) }}>{rich(label)}</div>
      </div>
      <div style={{ position: "absolute", top: 60, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 12 }}>
        {items.map((it, i) => (
          <span key={i} style={{ width: 70, height: 6, borderRadius: 3, background: t >= it.at ? LIME : "rgba(255,255,255,0.2)" }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** Le logo de l'app posé à côté du visage. */
export const LogoCard: React.FC<{ end: number; name: string; x?: number; y?: number }> = ({ end, name, x = 1260, y = 380 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.35, 0.35);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, ...blurIn(t, 0, 0.5, 30), fontFamily: FONT }}>
      <div style={{ ...glass, background: "rgba(14,17,12,0.9)", borderRadius: 40, padding: "30px 46px 30px 30px", display: "flex", alignItems: "center", gap: 30 }}>
        <Img src={staticFile(`${D}/logo_minimax_code.svg`)} style={{ width: 150, height: 150 }} />
        <div style={{ fontSize: 92, fontWeight: 500, color: INK, letterSpacing: "-0.04em" }}>{rich(name)}</div>
      </div>
    </div>
  );
};

// ─── La Carte du tuto (5 étapes) ───
export type MapStep = { n: string; label: string; tool: string; at: number };
export const TUTO: Omit<MapStep, "at">[] = [
  { n: "1", label: "Installer", tool: "MiniMax Code" },
  { n: "2", label: "Les visuels", tool: "Canvas" },
  { n: "3", label: "Coder", tool: "Game Studio" },
  { n: "4", label: "Tester", tool: "PC + mobile" },
  { n: "5", label: "Gagner de l'argent", tool: "Poki, CrazyGames" },
];
export const TutoMap5: React.FC<{ steps: MapStep[]; end: number; active?: number; done?: number; eyebrow?: string; eyebrowAt?: number; top?: number }> = ({ steps, end, active, done = 0, eyebrow = "Au programme", eyebrowAt = 0.05, top = 400 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.4);
  const bw = 316, gap = 34;
  const x0 = (W - (5 * bw + 4 * gap)) / 2;
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      {eyebrow && <div style={{ position: "absolute", left: 0, right: 0, top: top - 110, textAlign: "center", ...blurIn(t, eyebrowAt, 0.45, 16) }}><Eyebrow size={34}>{eyebrow}</Eyebrow></div>}
      {steps.map((s, i) => {
        const b = blurIn(t, s.at, 0.5, 30);
        const on = active === undefined || active === i;
        const isDone = i < done;
        const line = i > 0 ? keyed(t, [s.at - 0.1, s.at + 0.35], [0, 1], EASE) : 0;
        const lit = active === i;
        return (
          <React.Fragment key={i}>
            {i > 0 && <div style={{ position: "absolute", left: x0 + i * (bw + gap) - gap + 6, top: top + 150, width: (gap - 12) * line, height: 3, background: "rgba(198,243,109,0.5)" }} />}
            <div style={{ position: "absolute", left: x0 + i * (bw + gap), top, width: bw, height: 300, ...b, opacity: Number(b.opacity) * (on || isDone ? 1 : 0.4) }}>
              <div style={{ ...glass, width: "100%", height: "100%", borderRadius: 34, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, background: lit ? "linear-gradient(180deg, rgba(198,243,109,0.16), rgba(18,22,15,0.92))" : "linear-gradient(180deg, rgba(255,255,255,0.075), rgba(18,22,15,0.9))", border: `2px solid ${lit ? LIME : "rgba(255,255,255,0.1)"}`, boxShadow: lit ? "0 0 60px rgba(198,243,109,0.25)" : undefined }}>
                <span style={{ fontSize: 32, color: isDone ? "#0d1208" : LIME, background: isDone ? LIME : "transparent", border: `2px solid ${LIME}`, width: 54, height: 54, borderRadius: 999, display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 600 }}>{isDone ? "✓" : s.n}</span>
                <div style={{ fontSize: 46, color: INK, textAlign: "center", letterSpacing: "-0.03em", lineHeight: 1.08, padding: "0 16px" }}>{rich(s.label)}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 30, color: MUTED, textAlign: "center", padding: "0 12px" }}>
                  {i === 0 && <Img src={staticFile(`${D}/logo_minimax_code.svg`)} style={{ width: 34, height: 34 }} />}
                  {s.tool}
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

/** Carton d'étape : ✦, « Étape n/5 », titre, et la Carte du tuto (bloc actif). */
export const StepCard5: React.FC<{ n: number; title: string; end: number }> = ({ n, title, end }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.25, 0.4);
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <Backdrop />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 140 }}>
        <div style={blurIn(t, 0.05)}><Star size={56} /></div>
        <Eyebrow size={36} style={{ marginTop: 18, ...blurIn(t, 0.15) }}>{`Étape ${n}/5`}</Eyebrow>
        <div style={{ fontSize: 140, fontWeight: 500, color: INK, letterSpacing: "-0.05em", lineHeight: 1.02, marginTop: 14, ...blurIn(t, 0.3, 0.55, 26) }}>{rich(title, INK)}</div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 560, width: W, height: H - 560, transform: "scale(0.8)", transformOrigin: "50% 0" }}>
        <TutoMap5 steps={TUTO.map((s) => ({ ...s, at: 0.35 }))} active={n - 1} done={n - 1} end={end + 1} eyebrow="" top={40} />
      </div>
    </AbsoluteFill>
  );
};

/** Les deux plateformes (pages d'accueil réelles), en cartes inclinées, avec une pastille. */
export const PlatformDuo: React.FC<{ end: number; items: { src: string; name: string; at: number }[]; pill?: string; pillAt?: number }> = ({ end, items, pill, pillAt = 0 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <AbsoluteFill style={{ perspective: 2200 }}>
        {items.map((it, i) => {
          const ry = keyed(t, [it.at, it.at + 0.9], [i === 0 ? 18 : -18, i === 0 ? 7 : -7], EASE);
          return (
            <div key={i} style={{ position: "absolute", left: i === 0 ? 120 : 1000, top: 190, transform: `rotateY(${ry}deg)`, transformOrigin: i === 0 ? "0% 50%" : "100% 50%", ...blurIn(t, it.at, 0.55, 40) }}>
              <div style={{ ...card, padding: 8 }}>
                <Img src={staticFile(it.src)} style={{ width: 800, height: 500, objectFit: "cover", objectPosition: "50% 0%", borderRadius: 24, display: "block" }} />
              </div>
              <div style={{ textAlign: "center", marginTop: 26, fontSize: 56, fontWeight: 500, color: INK, letterSpacing: "-0.03em" }}>{it.name}</div>
            </div>
          );
        })}
      </AbsoluteFill>
      {pill && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 80, display: "flex", justifyContent: "center", ...blurIn(t, pillAt, 0.4, 16) }}>
          <div style={{ ...glass, background: "rgba(14,17,12,0.94)", borderRadius: 999, padding: "16px 40px", fontSize: 48, color: INK, letterSpacing: "-0.02em" }}>{rich(pill)}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Pastille de verre centrée en haut (sans lime de fond : le lime reste au mot en serif). */
export const GlassTag: React.FC<{ text: string; end: number; at?: number; top?: number }> = ({ text, end, at = 0, top = 50 }) => {
  const t = useT();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", opacity: inOut(t, at, end, 0.3, 0.35) }}>
      <div style={{ ...glass, background: "rgba(14,17,12,0.94)", borderRadius: 999, padding: "16px 40px", fontFamily: FONT, fontSize: 48, color: INK, letterSpacing: "-0.02em", ...blurIn(t, at, 0.4, 14) }}>{rich(text)}</div>
    </div>
  );
};


// ════════ Version « essentielle » (choix d'Ibrahim, 20/10/2026) : titres de parties + exigences de la marque ════════

/** Image fixe de l'écran, recadrée sur la fenêtre et zoomée (z, cx, cy) — pour les voix seules. */
export const StillFrag: React.FC<{ src: string; z: number; cx: number; cy: number; end: number; drift?: number }> = ({ src, z, cx, cy, end, drift = 0.03 }) => {
  const t = useT();
  const zz = z * (1 + drift * keyed(t, [0, end], [0, 1]));
  return (
    <AbsoluteFill>
      <Backdrop />
      <div style={{ position: "absolute", left: W / 2 + (WIN.x - cx) * zz, top: H / 2 + (WIN.y - cy) * zz, width: WIN.w, height: WIN.h, transformOrigin: "0 0", transform: `scale(${zz})`, borderRadius: 28 / zz, overflow: "hidden" }}>
        <Img src={staticFile(src)} style={{ position: "absolute", left: -WIN.x, top: -WIN.y, width: W, height: H, maxWidth: "none", maxHeight: "none" }} />
      </div>
    </AbsoluteFill>
  );
};

/** Carte de verre à droite : sur-titre + lignes qui sortent du flou au mot prononcé. */
export const InfoCard: React.FC<{ eyebrow: string; lines: { text: string; at: number }[]; end: number; x?: number; y?: number; width?: number; size?: number; logo?: boolean }> = ({ eyebrow, lines, end, x = 1120, y = 230, width = 700, size = 56, logo = true }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.35, 0.4);
  return (
    <div style={{ position: "absolute", left: x, top: y, width, opacity: o, ...blurIn(t, 0, 0.5, 30), fontFamily: FONT }}>
      <div style={{ ...glass, background: "linear-gradient(170deg, rgba(26,33,19,0.97), rgba(14,18,11,0.96))", borderRadius: 40, padding: "38px 44px", boxShadow: "0 40px 100px -30px rgba(0,0,0,0.9)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {logo && <Img src={staticFile(`${D}/logo_minimax_code.svg`)} style={{ width: 52, height: 52 }} />}
          <Eyebrow size={32}>{rich(eyebrow)}</Eyebrow>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 28 }}>
          {lines.map((l, i) => (
            <div key={i} style={{ fontSize: size, color: INK, letterSpacing: "-0.03em", lineHeight: 1.12, ...blurIn(t, l.at, 0.45, 22) }}>{rich(l.text)}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

/** Renvoi vers la vidéo suivante : la vraie miniature YouTube + titre. */
export const NextVideo: React.FC<{ end: number; title: string; eyebrow: string; thumb: string }> = ({ end, title, eyebrow, thumb }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.4, 0.3);
  return (
    <div style={{ position: "absolute", right: 60, top: 200, width: 680, opacity: o, ...blurIn(t, 0, 0.5, 30), fontFamily: FONT }}>
      <div style={{ ...card, padding: 8 }}>
        <Img src={staticFile(thumb)} style={{ width: 664, height: 374, borderRadius: 26, display: "block" }} />
      </div>
      <div style={{ marginTop: 26 }}>
        <Eyebrow size={30}>{eyebrow}</Eyebrow>
        <div style={{ fontSize: 54, color: INK, letterSpacing: "-0.03em", lineHeight: 1.1, marginTop: 10, textShadow: "0 4px 24px rgba(0,0,0,0.6)" }}>{rich(title)}</div>
      </div>
    </div>
  );
};
