// Illustrations de « Hostinger Produits Digitaux » (e-book créé avec Claude, vendu sur une page Hostinger).
// Règle : on montre le réel (page publiée, vrai PDF, vraies offres ComeUp capturées le 11/10/2026) ; le motion design ne fait que le mettre en valeur.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Backdrop, BAD, blurIn, EASE, Eyebrow, FONT, glass, H, INK, INK_SOFT, inOut, keyed, LIME, LIME_CARD, MUTED, rich, SERIF, Star, useT, W } from "../montage/lib";

export const D = "montage/hostinger-produits";
export const CAP = `${D}/captures`;
export const EBOOK = `${D}/ebook`;
const card: React.CSSProperties = { ...glass, padding: 10, borderRadius: 34, background: "rgba(18,22,15,0.94)" };

/** Preuve d'ouverture : la vraie page de vente publiée (poussée lente), puis la couverture du vrai PDF qui se pose devant. */
export const ProofOpen: React.FC<{ end: number; coverAt: number }> = ({ end, coverAt }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.01, 0.3);
  const z = 0.5 + 0.03 * keyed(t, [0, end], [0, 1]);
  const c = blurIn(t, coverAt, 0.55, 60);
  const tilt = keyed(t, [coverAt, coverAt + 0.8], [-9, -4], EASE);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Backdrop />
      <div style={{ position: "absolute", left: 760 - 1280 * z, top: H / 2 - 900 * z, width: 2560, height: 1800, transformOrigin: "0 0", transform: `scale(${z})`, borderRadius: 40 / z, overflow: "hidden", boxShadow: "0 60px 140px -30px rgba(0,0,0,0.9)" }}>
        <Img src={staticFile(`${CAP}/page_top.png`)} style={{ width: 2560, height: 1800, display: "block" }} />
      </div>
      <div style={{ position: "absolute", left: 1270, top: 150, ...c, transform: `${c.transform ?? ""} rotate(${tilt}deg)` }}>
        <div style={{ ...card, padding: 8 }}>
          <Img src={staticFile(`${EBOOK}/cover.png`)} style={{ width: 560, height: 663, borderRadius: 24, display: "block" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Liste de verre qui se construit à droite du visage (items au mot prononcé). */
export const GlassList: React.FC<{ items: { text: string; at: number }[]; end: number; title?: string; titleAt?: number; x?: number; top?: number; size?: number }> = ({ items, end, title, titleAt = 0, x = 1180, top = 300, size = 58 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, transparent 45%, rgba(5,7,4,0.78) 70%)" }} />
      <div style={{ position: "absolute", left: x, top, width: W - x - 90 }}>
        {title && <Eyebrow size={32} style={blurIn(t, titleAt)}>{title}</Eyebrow>}
        <div style={{ display: "flex", flexDirection: "column", gap: 22, marginTop: title ? 28 : 0 }}>
          {items.map((it, i) => (
            <div key={i} style={{ ...glass, background: "rgba(14,17,12,0.88)", borderRadius: 28, padding: "24px 34px", fontSize: size, color: INK, letterSpacing: "-0.025em", lineHeight: 1.1, ...blurIn(t, it.at, 0.45, 24) }}>{rich(it.text)}</div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Phrase-preuve sur face cam floutée : sur-titre + gros texte (sans capture, tant qu'Ibrahim n'en fournit pas). */
export const HeroLine: React.FC<{ eyebrow: string; text: string; end: number; at?: number; textAt?: number; size?: number }> = ({ eyebrow, text, end, at = 0, textAt = 0.35, size = 150 }) => {
  const t = useT();
  const o = inOut(t, at, end, 0.3, 0.35);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: o, fontFamily: FONT, textAlign: "center" }}>
      <AbsoluteFill style={{ background: "radial-gradient(900px 600px at 50% 50%, rgba(198,243,109,0.12), transparent 70%)" }} />
      <Eyebrow size={36} style={{ position: "relative", ...blurIn(t, at) }}>{eyebrow}</Eyebrow>
      <div style={{ position: "relative", fontSize: size, fontWeight: 500, color: LIME, letterSpacing: "-0.045em", lineHeight: 1.02, marginTop: 18, textShadow: "0 0 80px rgba(198,243,109,0.25)", ...blurIn(t, textAt, 0.45, 26) }}>{text}</div>
    </AbsoluteFill>
  );
};

/** Bandeau nom (tiers inférieur gauche). */
export const NameTag: React.FC<{ name: string; meta: string; end: number }> = ({ name, meta, end }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.4, 0.4);
  return (
    <div style={{ position: "absolute", left: 90, bottom: 110, opacity: o, fontFamily: FONT, ...blurIn(t, 0, 0.5, 20) }}>
      <div style={{ ...glass, background: "rgba(14,17,12,0.9)", borderRadius: 30, padding: "24px 38px", display: "flex", alignItems: "center", gap: 24 }}>
        <Star size={44} />
        <div>
          <div style={{ fontSize: 56, fontWeight: 500, color: INK, letterSpacing: "-0.03em", lineHeight: 1 }}>{name}</div>
          <div style={{ fontSize: 34, color: MUTED, marginTop: 8 }}>{rich(meta)}</div>
        </div>
      </div>
    </div>
  );
};

/** Pastille discrète en bas à droite (« S'abonner »). */
export const CornerPill: React.FC<{ text: string; end: number; accent?: boolean }> = ({ text, end, accent }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.35, 0.35);
  return (
    <div style={{ position: "absolute", right: 90, bottom: 110, opacity: o, ...blurIn(t, 0, 0.4, 16) }}>
      <div style={{ ...(accent ? LIME_CARD : { ...glass, background: "rgba(14,17,12,0.9)", color: INK }), borderRadius: 999, padding: "18px 38px", fontFamily: FONT, fontSize: 44, fontWeight: 500, letterSpacing: "-0.01em" }}>{text}</div>
    </div>
  );
};

/** Capture réelle (ComeUp) inclinée à gauche, prix surlignés, libellé à droite. */
export const MarketShot: React.FC<{ src: string; end: number; label: string; labelAt?: number; markAt?: number }> = ({ src, end, label, labelAt = 0.3, markAt = 1.2 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const ry = keyed(t, [0, 0.9], [14, 6], EASE);
  const b = blurIn(t, 0, 0.55, 40);
  const mo = keyed(t, [markAt, markAt + 0.4], [0, 1], EASE);
  const s = 1180 / 2560;
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <Backdrop />
      <AbsoluteFill style={{ perspective: 2200 }}>
        <div style={{ position: "absolute", left: 80, top: 190, width: 2560 * s, height: 1500 * s, transform: `rotateY(${ry}deg)`, transformOrigin: "0 50%", ...b }}>
          <div style={{ ...card, padding: 8 }}>
            <div style={{ position: "relative", width: 2560 * s, height: 1500 * s, borderRadius: 24, overflow: "hidden" }}>
              <Img src={staticFile(src)} style={{ width: 2560 * s, height: 1500 * s, display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${0.5 * mo})`, clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${770 * s}px ${1060 * s}px, ${770 * s}px ${1140 * s}px, ${2420 * s}px ${1140 * s}px, ${2420 * s}px ${1060 * s}px, ${770 * s}px ${1060 * s}px)` }} />
              <div style={{ position: "absolute", left: 760 * s, top: 1052 * s, width: 1670 * s, height: 96 * s, borderRadius: 14, border: `4px solid ${LIME}`, boxShadow: "0 0 30px rgba(198,243,109,0.5)", opacity: mo }} />
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 1350, top: 400, width: 520 }}>
        <Eyebrow size={30} style={blurIn(t, labelAt)}>Sur ComeUp</Eyebrow>
        <div style={{ fontSize: 72, color: INK, letterSpacing: "-0.04em", lineHeight: 1.05, marginTop: 20, ...blurIn(t, labelAt + 0.15, 0.45, 24) }}>{rich(label)}</div>
      </div>
    </AbsoluteFill>
  );
};

/** Deux cartes face à face ; la seconde se barre (« Tout faire seul → jamais »). */
export const TwoCards: React.FC<{ left: { title: string; meta: string; at: number }; right: { title: string; meta: string; at: number }; strikeAt: number; end: number }> = ({ left, right, strikeAt, end }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const st = keyed(t, [strikeAt, strikeAt + 0.45], [0, 1], EASE);
  const C: React.FC<{ c: typeof left; x: number; bad?: boolean }> = ({ c, x, bad }) => (
    <div style={{ position: "absolute", left: x, top: 330, width: 620, height: 420, ...blurIn(t, c.at, 0.5, 30) }}>
      <div style={{ ...glass, background: "rgba(14,17,12,0.92)", width: "100%", height: "100%", borderRadius: 40, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 56px", border: `2px solid ${bad && st > 0.5 ? "rgba(255,138,122,0.5)" : "rgba(255,255,255,0.1)"}` }}>
        <div style={{ fontSize: 66, color: INK, letterSpacing: "-0.035em", lineHeight: 1.05 }}>{rich(c.title, INK)}</div>
        <div style={{ fontSize: 54, marginTop: 26, color: bad ? (st > 0.5 ? BAD : INK_SOFT) : LIME, fontWeight: 500 }}>{rich(c.meta, bad ? BAD : LIME)}</div>
      </div>
      {bad && <div style={{ position: "absolute", left: 40, top: 205, width: 540 * st, height: 6, borderRadius: 3, background: BAD, boxShadow: `0 0 18px ${BAD}`, transform: "rotate(-8deg)", transformOrigin: "0 50%" }} />}
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <AbsoluteFill style={{ background: "rgba(5,7,4,0.72)", backdropFilter: "blur(14px)" }} />
      <C c={left} x={200} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 510, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 72, color: MUTED, ...blurIn(t, right.at - 0.2) }}>ou</div>
      <C c={right} x={1100} bad />
    </AbsoluteFill>
  );
};

/** La Carte du tuto : 3 blocs (le produit · la page de vente · les clients), logo de l'outil, bloc actif allumé, blocs faits cochés. */
export type MapStep = { n: string; label: string; tool: string; logo?: string; at: number };
export const TUTO: Omit<MapStep, "at">[] = [
  { n: "1", label: "Le *produit*", tool: "Claude", logo: `${D}/logo_claude.svg` },
  { n: "2", label: "La page de *vente*", tool: "Hostinger", logo: `${D}/logo_hostinger.svg` },
  { n: "3", label: "Les *clients*", tool: "Trafic" },
];
export const TutoMap3: React.FC<{ steps: MapStep[]; end: number; active?: number; done?: number; eyebrow?: string; eyebrowAt?: number; top?: number }> = ({ steps, end, active, done = 0, eyebrow = "Au programme", eyebrowAt = 0.05, top = 360 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.4);
  const bw = 440, gap = 70;
  const x0 = (W - (3 * bw + 2 * gap)) / 2;
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      {eyebrow && <div style={{ position: "absolute", left: 0, right: 0, top: top - 120, textAlign: "center", ...blurIn(t, eyebrowAt, 0.45, 16) }}><Eyebrow size={34}>{eyebrow}</Eyebrow></div>}
      {steps.map((s, i) => {
        const b = blurIn(t, s.at, 0.5, 30);
        const on = active === undefined || active === i;
        const isDone = i < done;
        const line = i > 0 ? keyed(t, [s.at - 0.1, s.at + 0.35], [0, 1], EASE) : 0;
        return (
          <React.Fragment key={i}>
            {i > 0 && <div style={{ position: "absolute", left: x0 + i * (bw + gap) - gap + 10, top: top + 160, width: (gap - 20) * line, height: 3, background: "rgba(198,243,109,0.5)" }} />}
            <div style={{ position: "absolute", left: x0 + i * (bw + gap), top, width: bw, height: 320, ...b, opacity: Number(b.opacity) * (on || isDone ? 1 : 0.4) }}>
              <div style={{ ...glass, width: "100%", height: "100%", borderRadius: 38, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, background: active === i ? "linear-gradient(180deg, rgba(198,243,109,0.16), rgba(18,22,15,0.92))" : "linear-gradient(180deg, rgba(255,255,255,0.075), rgba(18,22,15,0.88))", border: `2px solid ${active === i ? LIME : "rgba(255,255,255,0.1)"}`, boxShadow: active === i ? "0 0 60px rgba(198,243,109,0.25)" : undefined }}>
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  <span style={{ fontSize: 34, color: isDone ? "#0d1208" : LIME, background: isDone ? LIME : "transparent", border: `2px solid ${LIME}`, width: 58, height: 58, borderRadius: 999, display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 600 }}>{isDone ? "✓" : s.n}</span>
                </div>
                <div style={{ fontSize: 50, color: INK, textAlign: "center", letterSpacing: "-0.03em", lineHeight: 1.08, padding: "0 20px" }}>{rich(s.label)}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 36, color: MUTED }}>
                  {s.logo ? <Img src={staticFile(s.logo)} style={{ width: 40, height: 40 }} /> : <Star size={34} color={MUTED} />}
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

/** Carton d'étape : ✦, « Étape n/3 », titre, et la Carte du tuto (bloc actif). */
export const StepCard3: React.FC<{ n: number; title: string; end: number; done?: number }> = ({ n, title, end, done }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.25, 0.4);
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <Backdrop />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 150 }}>
        <div style={blurIn(t, 0.05)}><Star size={56} /></div>
        <Eyebrow size={36} style={{ marginTop: 18, ...blurIn(t, 0.15) }}>{`Étape ${n}/3`}</Eyebrow>
        <div style={{ fontSize: 150, fontWeight: 500, color: INK, letterSpacing: "-0.05em", lineHeight: 1.02, marginTop: 14, ...blurIn(t, 0.3, 0.55, 26) }}>{rich(title, INK)}</div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 560, width: W, height: H - 560, transform: "scale(0.74)", transformOrigin: "50% 0" }}>
        <TutoMap3 steps={TUTO.map((s) => ({ ...s, at: 0.35 }))} active={n - 1} done={done ?? n - 1} end={end + 1} eyebrow="" top={40} />
      </div>
    </AbsoluteFill>
  );
};

// ════════ BLOC 1 : l'e-book avec Claude ════════

/** Deux outils côte à côte (logos officiels) ; le choix s'allume. */
export const LogoDuo: React.FC<{ end: number; pickAt: number; pickText: string }> = ({ end, pickAt, pickText }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const pick = keyed(t, [pickAt, pickAt + 0.4], [0, 1], EASE);
  const Tile: React.FC<{ logo: string; name: string; at: number; on: number; dim: number }> = ({ logo, name, at, on, dim }) => (
    <div style={{ ...glass, background: "rgba(14,17,12,0.94)", borderRadius: 34, padding: "26px 40px", display: "flex", alignItems: "center", gap: 22, border: `2px solid ${on > 0.5 ? LIME : "rgba(255,255,255,0.1)"}`, boxShadow: on > 0.5 ? "0 0 50px rgba(198,243,109,0.3)" : "0 30px 70px -20px rgba(0,0,0,0.8)", opacity: 1 - 0.55 * dim, ...blurIn(t, at, 0.45, 20) }}>
      <Img src={staticFile(logo)} style={{ width: 64, height: 64 }} />
      <span style={{ fontSize: 58, fontWeight: 500, color: INK, letterSpacing: "-0.03em" }}>{name}</span>
    </div>
  );
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, opacity: o, fontFamily: FONT }}>
      <div style={{ display: "flex", alignItems: "center", gap: 34 }}>
        <Tile logo={`${D}/logo_claude.svg`} name="Claude" at={0} on={pick} dim={0} />
        <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 60, color: MUTED, ...blurIn(t, 0.25) }}>ou</span>
        <Tile logo={`${D}/logo_chatgpt.svg`} name="ChatGPT" at={0.4} on={0} dim={pick} />
      </div>
      <div style={{ ...LIME_CARD, borderRadius: 999, padding: "14px 36px", fontSize: 42, fontWeight: 600, ...blurIn(t, pickAt + 0.2, 0.4, 14) }}>{pickText}</div>
    </div>
  );
};

/** Trois formats de produit digital ; le dernier (e-book) s'allume. */
export const FormatTrio: React.FC<{ items: { icon: string; text: string; at: number }[]; hlAt: number; line?: string; lineAt?: number; end: number }> = ({ items, hlAt, line, lineAt = 0, end }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const hl = t >= hlAt;
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 45%, rgba(5,7,4,0.85) 78%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: line ? 190 : 110, display: "flex", justifyContent: "center", gap: 30 }}>
        {items.map((it, i) => {
          const on = hl && i === items.length - 1;
          return (
            <div key={i} style={{ ...(on ? LIME_CARD : { ...glass, background: "rgba(14,17,12,0.92)", color: INK }), borderRadius: 32, padding: "24px 40px", display: "flex", alignItems: "center", gap: 18, fontSize: 54, fontWeight: 500, letterSpacing: "-0.025em", opacity: hl && !on ? 0.5 : 1, ...blurIn(t, it.at, 0.45, 22) }}>
              <span style={{ fontFamily: '"Apple Color Emoji","Noto Color Emoji",sans-serif' }}>{it.icon}</span>
              {it.text}
            </div>
          );
        })}
      </div>
      {line && <div style={{ position: "absolute", left: 0, right: 0, bottom: 100, textAlign: "center", fontSize: 50, color: INK, letterSpacing: "-0.02em", textShadow: "0 4px 24px rgba(0,0,0,0.7)", ...blurIn(t, lineAt, 0.45, 18) }}>{rich(line)}</div>}
    </AbsoluteFill>
  );
};

/** Les idées de Claude recréées en grand (texte de l'écran) ; l'idée choisie s'allume. */
export const IdeaCards: React.FC<{ ideas: { text: string; at: number }[]; pick: number; pickAt: number; end: number; eyebrow: string }> = ({ ideas, pick, pickAt, end, eyebrow }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const on = t >= pickAt;
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <AbsoluteFill style={{ background: "rgba(9,11,8,0.62)", backdropFilter: "blur(10px)" }} />
      <div style={{ position: "absolute", left: 150, right: 150, top: 120 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, ...blurIn(t, 0.05) }}>
          <Img src={staticFile(`${D}/logo_claude.svg`)} style={{ width: 40, height: 40 }} />
          <Eyebrow size={32}>{eyebrow}</Eyebrow>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22, marginTop: 34 }}>
          {ideas.map((it, i) => {
            const me = on && i === pick;
            return (
              <div key={i} style={{ ...glass, background: me ? "linear-gradient(180deg, rgba(198,243,109,0.18), rgba(18,22,15,0.95))" : "rgba(14,17,12,0.92)", border: `2px solid ${me ? LIME : "rgba(255,255,255,0.08)"}`, boxShadow: me ? "0 0 60px rgba(198,243,109,0.28)" : undefined, borderRadius: 30, padding: "26px 40px", fontSize: 54, color: INK, letterSpacing: "-0.025em", opacity: on && !me ? 0.45 : 1, transform: me ? "scale(1.02)" : undefined, transformOrigin: "50% 50%", ...blurIn(t, it.at, 0.45, 22) }}>{rich(it.text)}</div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Capture réelle inclinée (article, page) + légende ; posée à droite, l'interface reste visible à gauche. */
export const TiltShot: React.FC<{ src: string; iw: number; ih: number; end: number; width?: number; x?: number; y?: number; caption?: string; captionAt?: number; eyebrow?: string }> = ({ src, iw, ih, end, width = 980, x = 860, y = 150, caption, captionAt = 0.4, eyebrow }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const ry = keyed(t, [0, 0.9], [-16, -6], EASE);
  const h = (width * ih) / iw;
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <AbsoluteFill style={{ background: "rgba(9,11,8,0.5)" }} />
      <AbsoluteFill style={{ perspective: 2200 }}>
        <div style={{ position: "absolute", left: x, top: y, transform: `rotateY(${ry}deg)`, transformOrigin: "100% 50%", ...blurIn(t, 0, 0.55, 40) }}>
          <div style={{ ...card, padding: 8 }}>
            <Img src={staticFile(src)} style={{ width, height: h, borderRadius: 24, display: "block" }} />
          </div>
        </div>
      </AbsoluteFill>
      {caption && (
        <div style={{ position: "absolute", left: x, width, top: y + h + 50, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, ...blurIn(t, captionAt, 0.45, 20) }}>
          {eyebrow && <Eyebrow size={28}>{eyebrow}</Eyebrow>}
          <div style={{ ...glass, background: "rgba(14,17,12,0.92)", borderRadius: 999, padding: "16px 40px", fontSize: 50, color: INK, letterSpacing: "-0.02em" }}>{rich(caption)}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Le résultat : la couverture du vrai PDF sort de l'interface, en grand, avec sa légende. */
export const EbookReveal: React.FC<{ end: number; eyebrow: string; title: string; titleAt?: number; meta?: string; metaAt?: number }> = ({ end, eyebrow, title, titleAt = 0.5, meta, metaAt = 1.2 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const c = blurIn(t, 0.05, 0.6, 60);
  const rot = keyed(t, [0, 1.0], [-7, -3], EASE);
  const glow = 0.25 + 0.1 * Math.sin(t * 2);
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <Backdrop />
      <AbsoluteFill style={{ background: `radial-gradient(700px 600px at 36% 50%, rgba(198,243,109,${glow * 0.5}), transparent 70%)` }} />
      <div style={{ position: "absolute", left: 300, top: 130, ...c, transform: `${c.transform ?? ""} rotate(${rot}deg)` }}>
        <div style={{ ...card, padding: 8 }}>
          <Img src={staticFile(`${EBOOK}/cover.png`)} style={{ width: 660, height: 781, borderRadius: 24, display: "block" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 1120, top: 380, width: 700 }}>
        <Eyebrow size={34} style={blurIn(t, 0.3)}>{eyebrow}</Eyebrow>
        <div style={{ fontSize: 130, fontWeight: 500, color: INK, letterSpacing: "-0.05em", lineHeight: 1, marginTop: 18, ...blurIn(t, titleAt, 0.5, 26) }}>{rich(title)}</div>
        {meta && <div style={{ fontSize: 48, color: INK_SOFT, marginTop: 26, letterSpacing: "-0.02em", ...blurIn(t, metaAt, 0.45, 18) }}>{rich(meta)}</div>}
      </div>
    </AbsoluteFill>
  );
};

/** Les vraies pages du PDF qui défilent, une étiquette par page nommée. */
export const PdfPages: React.FC<{ pages: { page: number; label: string; at: number }[]; end: number; eyebrow?: string }> = ({ pages, end, eyebrow }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const pw = 520, ph = (pw * 1287) / 910;
  const idx = Math.max(0, pages.findIndex((p, i) => t >= p.at && (i === pages.length - 1 || t < pages[i + 1].at)));
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <Backdrop />
      {eyebrow && <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", ...blurIn(t, 0.05) }}><Eyebrow size={32}>{eyebrow}</Eyebrow></div>}
      {pages.map((p, i) => {
        const pos = keyed(t, [p.at - 0.5, p.at], [1, 0], EASE) + (i < idx ? keyed(t, [pages[i + 1].at - 0.5, pages[i + 1].at], [0, -1], EASE) : 0);
        const vis = t >= p.at - 0.5;
        if (!vis) return null;
        const x = W / 2 - pw / 2 + pos * 640;
        const sc = 1 - 0.18 * Math.abs(pos);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 150, transform: `scale(${sc})`, transformOrigin: "50% 50%", opacity: 1 - 0.5 * Math.min(1, Math.abs(pos)), zIndex: 10 - Math.round(Math.abs(pos) * 5) }}>
            <div style={{ ...card, padding: 6 }}>
              <Img src={staticFile(p.page === 1 ? `${EBOOK}/cover.png` : `${EBOOK}/p-${String(p.page).padStart(2, "0")}.png`)} style={{ width: pw, height: ph, borderRadius: 20, display: "block", objectFit: p.page === 1 ? "contain" : undefined, background: p.page === 1 ? "#0f1e3a" : undefined }} />
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 50, display: "flex", justifyContent: "center" }}>
        <div key={idx} style={{ ...LIME_CARD, borderRadius: 999, padding: "14px 40px", fontSize: 46, fontWeight: 600, ...blurIn(t, pages[idx].at, 0.35, 14) }}>{pages[idx].label}</div>
      </div>
    </AbsoluteFill>
  );
};

/** Les deux chiffres de la page 4 repris en grand (l'écran fait foi : « CPM moyen »). */
export const CpmDuo: React.FC<{ end: number; leftAt: number; rightAt: number }> = ({ end, leftAt, rightAt }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const Box: React.FC<{ v: string; label: string; at: number; hero?: boolean }> = ({ v, label, at, hero }) => (
    <div style={{ ...(hero ? LIME_CARD : { ...glass, background: "rgba(14,17,12,0.94)" }), width: 780, borderRadius: 40, padding: "48px 40px", textAlign: "center", ...blurIn(t, at, 0.5, 30) }}>
      <div style={{ whiteSpace: "nowrap", fontSize: 112, fontWeight: 500, letterSpacing: "-0.05em", lineHeight: 1, color: hero ? "#0d1208" : INK }}>{v}</div>
      <div style={{ fontSize: 40, marginTop: 22, color: hero ? "#1e2712" : INK_SOFT, letterSpacing: "-0.015em" }}>{label}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT, alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill style={{ background: "rgba(9,11,8,0.7)", backdropFilter: "blur(12px)" }} />
      <Eyebrow size={34} style={{ position: "relative", ...blurIn(t, 0.05) }}>Pour 1 000 vues · CPM moyen · page 4 du guide</Eyebrow>
      <div style={{ position: "relative", display: "flex", gap: 50, marginTop: 40 }}>
        <Box v="0,10 – 0,50 $" label="Audience 100 % Afrique francophone" at={leftAt} hero />
        <Box v="3 – 10 $" label="Audience Europe / Amérique du Nord" at={rightAt} />
      </div>
    </AbsoluteFill>
  );
};

// ════════ BLOC 2 : Hostinger ════════

/** Pastille partenaire (logo officiel Hostinger + mention de collaboration), en haut au centre. */
export const SponsorTag: React.FC<{ end: number; collabAt?: number }> = ({ end, collabAt = 0.6 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 40, display: "flex", justifyContent: "center", opacity: o, fontFamily: FONT }}>
      <div style={{ ...glass, background: "rgba(14,17,12,0.94)", borderRadius: 36, padding: "18px 36px 18px 22px", display: "flex", alignItems: "center", gap: 24, boxShadow: "0 30px 70px -20px rgba(0,0,0,0.85)", ...blurIn(t, 0, 0.5, 20) }}>
        <div style={{ width: 84, height: 84, borderRadius: 22, background: "#1d1340", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Img src={staticFile(`${D}/logo_hostinger.svg`)} style={{ width: 52, height: 52 }} />
        </div>
        <div style={{ fontSize: 58, fontWeight: 500, color: INK, letterSpacing: "-0.035em" }}>Hostinger</div>
        <div style={{ width: 1, alignSelf: "stretch", background: "rgba(255,255,255,0.1)" }} />
        <div style={{ fontSize: 28, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase", lineHeight: 1.25, ...blurIn(t, collabAt, 0.4, 12) }}>Partenaire
          <br />de cette vidéo</div>
      </div>
    </div>
  );
};

/** Carte de chiffre posée sur le côté de l'écran (l'interface reste visible) : sur-titre, valeur, ligne, ancienne valeur barrée en option. */
export const SideStat: React.FC<{ end: number; eyebrow: string; value: string; sub?: string; subAt?: number; old?: string; oldAt?: number; valueAt?: number; side?: "left" | "right"; top?: number; hero?: boolean }> = ({ end, eyebrow, value, sub, subAt = 0.5, old, oldAt = 0, valueAt = 0.2, side = "left", top = 300, hero }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const st = old ? keyed(t, [oldAt + 0.3, oldAt + 0.7], [0, 1], EASE) : 0;
  return (
    <div style={{ position: "absolute", [side]: 70, top, width: 600, opacity: o, fontFamily: FONT, ...blurIn(t, 0, 0.5, 26) }}>
      <div style={{ ...(hero ? LIME_CARD : { ...glass, background: "rgba(14,17,12,0.95)" }), borderRadius: 40, padding: "38px 44px", boxShadow: "0 40px 90px -30px rgba(0,0,0,0.9)" }}>
        <Eyebrow size={28} style={{ color: hero ? "#1e2712" : LIME }}>{eyebrow}</Eyebrow>
        {old && (
          <div style={{ position: "relative", display: "inline-block", fontSize: 64, color: hero ? "#33441c" : MUTED, marginTop: 14, letterSpacing: "-0.03em", ...blurIn(t, oldAt, 0.35, 14) }}>
            {old}
            <div style={{ position: "absolute", left: -6, top: "52%", height: 5, width: `${(st * 100).toFixed(1)}%`, background: hero ? "#0d1208" : BAD, borderRadius: 3 }} />
          </div>
        )}
        <div style={{ fontSize: 120, fontWeight: 500, letterSpacing: "-0.05em", lineHeight: 1, marginTop: 14, color: hero ? "#0d1208" : INK, whiteSpace: "nowrap", ...blurIn(t, valueAt, 0.45, 24) }}>{rich(value, hero ? "#0d1208" : LIME)}</div>
        {sub && <div style={{ fontSize: 42, marginTop: 18, color: hero ? "#1e2712" : INK_SOFT, letterSpacing: "-0.02em", ...blurIn(t, subAt, 0.4, 16) }}>{rich(sub, hero ? "#0d1208" : LIME)}</div>}
      </div>
    </div>
  );
};

/** Coches qui tombent une à une (avantages inclus), sur le côté. */
export const CheckStack: React.FC<{ items: { text: string; at: number }[]; end: number; side?: "left" | "right"; top?: number; eyebrow?: string }> = ({ items, end, side = "right", top = 330, eyebrow }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  return (
    <div style={{ position: "absolute", [side]: 70, top, width: 640, opacity: o, fontFamily: FONT }}>
      {eyebrow && <Eyebrow size={28} style={{ marginBottom: 18, ...blurIn(t, 0.05) }}>{eyebrow}</Eyebrow>}
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {items.map((it, i) => {
          const tick = keyed(t, [it.at + 0.1, it.at + 0.45], [0, 1], EASE);
          return (
            <div key={i} style={{ ...glass, background: "rgba(14,17,12,0.95)", borderRadius: 28, padding: "22px 30px", display: "flex", alignItems: "center", gap: 22, boxShadow: "0 30px 70px -25px rgba(0,0,0,0.9)", ...blurIn(t, it.at, 0.4, 20) }}>
              <svg width={52} height={52} viewBox="0 0 52 52"><circle cx={26} cy={26} r={23} fill={LIME} opacity={0.18} /><path d="M15 27 L23 35 L38 18" fill="none" stroke={LIME} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={40} strokeDashoffset={40 * (1 - tick)} /></svg>
              <span style={{ fontSize: 48, color: INK, letterSpacing: "-0.02em" }}>{rich(it.text)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Le code promo en grand (carte lime). */
export const CodeCard: React.FC<{ end: number; code: string; label: string }> = ({ end, code, label }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const sc = 0.92 + 0.08 * keyed(t, [0, 0.5], [0, 1], EASE);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: o, fontFamily: FONT }}>
      <AbsoluteFill style={{ background: "rgba(9,11,8,0.55)" }} />
      <div style={{ ...LIME_CARD, borderRadius: 48, padding: "44px 90px", textAlign: "center", transform: `scale(${sc})`, boxShadow: "0 0 120px rgba(198,243,109,0.35)" }}>
        <div style={{ fontSize: 34, letterSpacing: "0.16em", textTransform: "uppercase", color: "#1e2712", fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 190, fontWeight: 600, letterSpacing: "0.02em", color: "#0d1208", lineHeight: 1, marginTop: 10 }}>{code}</div>
      </div>
    </AbsoluteFill>
  );
};

/** Message court tapé dans Claude, recréé en grand (bulle). */
export const ChatBubble: React.FC<{ text: string; end: number; eyebrow: string; x?: number; y?: number }> = ({ text, end, eyebrow, x = 260, y = 320 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <AbsoluteFill style={{ background: "rgba(9,11,8,0.45)" }} />
      <div style={{ position: "absolute", left: x, top: y, width: 1400, ...blurIn(t, 0, 0.5, 30) }}>
        <Eyebrow size={30}>{eyebrow}</Eyebrow>
        <div style={{ ...glass, background: "linear-gradient(170deg, rgba(26,33,19,0.97), rgba(14,18,11,0.97))", border: "1.5px solid rgba(198,243,109,0.4)", borderRadius: 40, padding: "36px 48px", marginTop: 18, fontSize: 70, color: INK, letterSpacing: "-0.03em", lineHeight: 1.15, boxShadow: "0 40px 100px -30px rgba(0,0,0,0.9)" }}>{rich(text)}</div>
      </div>
    </AbsoluteFill>
  );
};

/** Demande de Hostinger (11/10/2026) : leur page « ai-builder-lp » (capturée en France, en HD) à la place de l'accueil, dans la fenêtre de la capture. */
export const LpWindow: React.FC<{ end: number; win: { x: number; y: number; w: number; h: number }; keys: { t: number; z: number; cx: number; cy: number }[] }> = ({ end, win, keys }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.25, 0.25);
  const ts = keys.map((k) => k.t);
  const z = Math.exp(keyed(t, ts, keys.map((k) => Math.log(k.z))));
  const cx = keyed(t, ts, keys.map((k) => k.cx));
  const cy = keyed(t, ts, keys.map((k) => k.cy));
  const iw = win.w, ih = (win.w * 1250) / 2560;
  // (cx, cy) en pixels de la fenêtre ; dès que le zoom remplit l'écran, la caméra reste dans la fenêtre
  const clampC = (c: number, len: number, screen: number, off: number) => (len * z >= screen ? Math.min(Math.max(c, screen / (2 * z) - off), len + off - screen / (2 * z)) : len / 2);
  const ccx = clampC(cx, win.w, W, win.x);
  const ccy = clampC(cy, win.h, H, win.y);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Backdrop />
      <div style={{ position: "absolute", left: W / 2 - ccx * z, top: H / 2 - ccy * z, width: win.w, height: win.h, transformOrigin: "0 0", transform: `scale(${z})`, borderRadius: 28 / z, overflow: "hidden", background: "#000", boxShadow: z < 1.02 ? "0 60px 120px -30px rgba(0,0,0,0.85)" : "none" }}>
        <Img src={staticFile(`${CAP}/hostinger_lp.png`)} style={{ width: iw, height: ih, display: "block" }} />
      </div>
    </AbsoluteFill>
  );
};

// ════════ BLOC 3 : la page de vente (et les 2 séquences demandées par Hostinger) ════════

/** Une image de la capture (plein écran 1920×1080) montrée dans la fenêtre, avec caméra ; les enfants sont en pixels de la capture et suivent la caméra. */
export const ImageWindow: React.FC<{ src: string; win: { x: number; y: number; w: number; h: number }; keys: { t: number; z: number; cx: number; cy: number }[]; children?: React.ReactNode }> = ({ src, win, keys, children }) => {
  const t = useT();
  const ts = keys.map((k) => k.t);
  const z = Math.exp(keyed(t, ts, keys.map((k) => Math.log(k.z))));
  const rcx = keyed(t, ts, keys.map((k) => k.cx));
  const rcy = keyed(t, ts, keys.map((k) => k.cy));
  const clampC = (c: number, a0: number, len: number, screen: number) => (len * z >= screen ? Math.min(Math.max(c, a0 + screen / (2 * z)), a0 + len - screen / (2 * z)) : a0 + len / 2);
  const cx = clampC(rcx, win.x, win.w, W);
  const cy = clampC(rcy, win.y, win.h, H);
  return (
    <AbsoluteFill>
      <Backdrop />
      <div style={{ position: "absolute", left: W / 2 + (win.x - cx) * z, top: H / 2 + (win.y - cy) * z, width: win.w, height: win.h, transformOrigin: "0 0", transform: `scale(${z})`, borderRadius: 28 / z, overflow: "hidden", boxShadow: z < 1.02 ? "0 60px 120px -30px rgba(0,0,0,0.85)" : "none" }}>
        <div style={{ position: "absolute", left: -win.x, top: -win.y, width: W, height: H }}>
          <Img src={staticFile(src)} style={{ width: W, height: H, display: "block" }} />
          {children}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Cursor: React.FC<{ x: number; y: number; clickAt?: number[] }> = ({ x, y, clickAt = [] }) => {
  const t = useT();
  const ring = clickAt.map((c) => (t >= c && t < c + 0.45 ? (t - c) / 0.45 : -1)).find((r) => r >= 0) ?? -1;
  return (
    <>
      {ring >= 0 && <div style={{ position: "absolute", left: x - 26 * (0.4 + ring), top: y - 26 * (0.4 + ring), width: 52 * (0.4 + ring), height: 52 * (0.4 + ring), borderRadius: 999, border: `4px solid ${LIME}`, opacity: 1 - ring }} />}
      <svg width={34} height={44} viewBox="0 0 34 44" style={{ position: "absolute", left: x - 4, top: y - 2, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.45))" }}>
        <path d="M4 2 L4 34 L12 26 L18 40 L24 37 L18 24 L30 24 Z" fill="#111" stroke="#fff" strokeWidth={2.5} strokeLinejoin="round" />
      </svg>
    </>
  );
};

/** Demande de Hostinger : « Sélectionner et modifier » (modifier sans crédit), animé sur la vraie interface (image de l'éditeur à 12:15). Sans voix. */
export const SelectEditInsert: React.FC<{ end: number; win: { x: number; y: number; w: number; h: number } }> = ({ end, win }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.01, 0.01); // coupes franches : pas de flash noir
  const on = keyed(t, [1.6, 1.85], [0, 1], EASE);
  const path = [
    { t: 0.6, x: 980, y: 300 },
    { t: 1.45, x: 156, y: 141 },
    { t: 2.6, x: 156, y: 141 },
    { t: 3.3, x: 905, y: 470 },
  ];
  const px = keyed(t, path.map((p) => p.t), path.map((p) => p.x), EASE);
  const py = keyed(t, path.map((p) => p.t), path.map((p) => p.y), EASE);
  const hover = keyed(t, [3.0, 3.3], [0, 1], EASE);
  const sel = t >= 3.45;
  const NEW = "Ta chaîne a des milliers de vues. Pourquoi 0 $ sur ton compte ?";
  const shown = Math.round(NEW.length * Math.min(1, Math.max(0, (t - 3.8) / 1.7)));
  const lines = (s: string) => {
    const words = s.split(" ");
    const out: string[] = [];
    let cur = "";
    for (const w of words) {
      if ((cur + " " + w).trim().length > 22) { out.push(cur.trim()); cur = w; } else cur += " " + w;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  };
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <ImageWindow src={`${CAP}/editeur_735.png`} win={win} keys={[{ t: 0, z: 1.0, cx: 960, cy: 540 }, { t: 0.7, z: 1.0, cx: 960, cy: 540 }, { t: 1.3, z: 2.0, cx: 330, cy: 220 }, { t: 2.4, z: 2.0, cx: 330, cy: 220 }, { t: 3.0, z: 1.25, cx: 960, cy: 520 }, { t: 5.9, z: 1.25, cx: 960, cy: 520 }, { t: 6.5, z: 1.0, cx: 960, cy: 540 }]}>
        {/* l'interrupteur passe sur « activé » */}
        <div style={{ position: "absolute", left: 130, top: 129, width: 43, height: 22, borderRadius: 999, background: `rgba(198,243,109,${on})` }}>
          <div style={{ position: "absolute", top: 2, left: 2 + 21 * on, width: 18, height: 18, borderRadius: 999, background: "#fff" }} />
        </div>
        {/* le titre survolé puis sélectionné */}
        {hover > 0 && <div style={{ position: "absolute", left: 535, top: 382, width: 852, height: 296, borderRadius: 10, border: `3px ${sel ? "solid" : "dashed"} #8C6CFF`, opacity: hover }} />}
        {sel && <div style={{ position: "absolute", left: 535, top: 352, background: "#8C6CFF", color: "#fff", fontSize: 18, fontWeight: 600, padding: "4px 12px", borderRadius: 6 }}>Titre · modifier le texte</div>}
        {t >= 3.8 && (
          <div style={{ position: "absolute", left: 540, top: 386, width: 842, height: 288, background: "#f6f7f9", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            {lines(NEW.slice(0, shown)).map((l, i, arr) => (
              <div key={i} style={{ fontSize: 66, fontWeight: 600, color: "#0b1b3a", letterSpacing: "-0.03em", lineHeight: 1.06 }}>{l}{i === arr.length - 1 && shown < NEW.length ? <span style={{ color: "#8C6CFF" }}>▍</span> : null}</div>
            ))}
          </div>
        )}
        <Cursor x={px} y={py} clickAt={[1.6, 3.45]} />
      </ImageWindow>
      <div style={{ position: "absolute", left: 0, right: 0, top: 34, display: "flex", justifyContent: "center", ...blurIn(t, 0.3, 0.45, 18) }}>
        <div style={{ ...glass, background: "rgba(14,17,12,0.94)", borderRadius: 999, padding: "16px 38px", fontSize: 46, color: INK, letterSpacing: "-0.02em", display: "flex", gap: 14, alignItems: "center" }}>
          <Star size={34} />Astuce : {rich("*Sélectionner et modifier*")}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, display: "flex", justifyContent: "center", ...blurIn(t, 5.7, 0.45, 18) }}>
        <div style={{ ...LIME_CARD, borderRadius: 999, padding: "18px 44px", fontSize: 50, fontWeight: 600, letterSpacing: "-0.02em" }}>Clique, modifie : 0 crédit utilisé</div>
      </div>
      <div style={{ position: "absolute", left: 70, bottom: 76, fontSize: 26, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase", opacity: Math.min(1, t / 0.6) }}>Exemple</div>
    </AbsoluteFill>
  );
};

/** Demande de Hostinger (l'e-commerce est devenu un forfait séparé) : la vraie page de tarifs (capturée en France le 11/10/2026) et l'essentiel. Sans voix. */
export const EcommerceInsert: React.FC<{ end: number }> = ({ end }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.01, 0.01); // coupes franches : pas de flash noir
  const s = 1060 / 2300;
  const ry = keyed(t, [0, 0.9], [12, 5], EASE);
  const mo = keyed(t, [1.9, 2.3], [0, 1], EASE);
  const items = [
    { text: "Pack Growth : *5,39 €*/mois avec KAMARA7", at: 2.8 },
    { text: "Créateur de site IA : 1 € les 3 premiers mois", at: 3.9 },
    { text: "E-books et produits numériques", at: 5.0 },
    { text: "0 % de frais de transaction", at: 6.1 },
  ];
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <Backdrop />
      <div style={{ position: "absolute", left: 80, top: 70, ...blurIn(t, 0.4, 0.45, 18) }}>
        <Eyebrow size={30}>Mise à jour Hostinger · octobre 2026</Eyebrow>
        <div style={{ fontSize: 72, color: INK, letterSpacing: "-0.04em", lineHeight: 1.05, marginTop: 14, ...blurIn(t, 0.7, 0.45, 22) }}>Pour encaisser de vraies ventes : {rich("*Hostinger Ecommerce*", INK)}</div>
      </div>
      <AbsoluteFill style={{ perspective: 2200 }}>
        <div style={{ position: "absolute", left: 80, top: 300, transform: `rotateY(${ry}deg)`, transformOrigin: "0 50%", ...blurIn(t, 0.1, 0.55, 40) }}>
          <div style={{ ...card, padding: 8 }}>
            <div style={{ position: "relative", width: 2300 * s, height: 1300 * s, borderRadius: 22, overflow: "hidden" }}>
              <Img src={staticFile(`${CAP}/hostinger_ecommerce_tarifs.png`)} style={{ width: 2300 * s, height: 1300 * s, display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${0.45 * mo})`, clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${1515 * s}px ${405 * s}px, ${1515 * s}px ${1300 * s}px, ${2295 * s}px ${1300 * s}px, ${2295 * s}px ${405 * s}px, ${1515 * s}px ${405 * s}px)` }} />
              <div style={{ position: "absolute", left: 1508 * s, top: 398 * s, width: 794 * s, height: 900 * s, borderRadius: 16, border: `4px solid ${LIME}`, boxShadow: "0 0 30px rgba(198,243,109,0.5)", opacity: mo }} />
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 1230, top: 330, width: 630, display: "flex", flexDirection: "column", gap: 18 }}>
        {items.map((it, i) => (
          <div key={i} style={{ ...glass, background: "rgba(14,17,12,0.95)", borderRadius: 28, padding: "22px 30px", display: "flex", alignItems: "center", gap: 20, ...blurIn(t, it.at, 0.4, 20) }}>
            <svg width={44} height={44} viewBox="0 0 52 52"><circle cx={26} cy={26} r={23} fill={LIME} opacity={0.18} /><path d="M15 27 L23 35 L38 18" fill="none" stroke={LIME} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span style={{ fontSize: 44, color: INK, letterSpacing: "-0.02em" }}>{rich(it.text)}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ════════ BLOC 4 : publication, clients, fin ════════

/** Les 2 façons d'avoir du trafic : ① le contenu (logos réels), ② la publicité payante ; la colonne active s'allume. */
export const TrafficDuo: React.FC<{ end: number; titleAt?: number; leftAt: number; rightAt?: number; active: 0 | 1; leftSub?: string; rightSub?: string; rightSubAt?: number }> = ({ end, titleAt = 0.05, leftAt, rightAt, active, leftSub = "gratuit", rightSub = "la plus efficace", rightSubAt }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const Col: React.FC<{ n: string; title: string; sub: string; subAt: number; logos: string[]; at: number; on: boolean; x: number }> = ({ n, title, sub, subAt, logos, at, on, x }) => (
    <div style={{ position: "absolute", left: x, top: 330, width: 760, ...blurIn(t, at, 0.5, 30), opacity: Number(blurIn(t, at, 0.5, 30).opacity) * (on ? 1 : 0.42) }}>
      <div style={{ ...glass, background: on ? "linear-gradient(180deg, rgba(198,243,109,0.14), rgba(18,22,15,0.94))" : "rgba(14,17,12,0.92)", border: `2px solid ${on ? LIME : "rgba(255,255,255,0.1)"}`, boxShadow: on ? "0 0 70px rgba(198,243,109,0.22)" : undefined, borderRadius: 44, padding: "44px 48px", height: 440, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 40, color: LIME, fontWeight: 600 }}>{n}</div>
          <div style={{ fontSize: 76, color: INK, letterSpacing: "-0.04em", lineHeight: 1.05, marginTop: 8 }}>{title}</div>
          <div style={{ fontSize: 48, color: on ? LIME : INK_SOFT, marginTop: 14, fontFamily: SERIF, fontStyle: "italic", ...blurIn(t, subAt, 0.4, 14) }}>{sub}</div>
        </div>
        <div style={{ display: "flex", gap: 26 }}>
          {logos.map((l) => (
            <div key={l} style={{ width: 92, height: 92, borderRadius: 24, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Img src={staticFile(`${D}/${l}`)} style={{ width: 56, height: 56 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <AbsoluteFill style={{ background: "rgba(5,7,4,0.74)", backdropFilter: "blur(16px)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontSize: 84, color: INK, letterSpacing: "-0.04em", ...blurIn(t, titleAt, 0.45, 22) }}>2 façons d'avoir {rich("*du trafic*")}</div>
      <Col n="①" title="Le contenu" sub={leftSub} subAt={leftAt + 0.5} logos={["logo_youtube.svg", "logo_instagram.svg", "logo_tiktok.svg"]} at={leftAt} on={active === 0} x={160} />
      {rightAt !== undefined && <Col n="②" title="La pub payante" sub={rightSub} subAt={rightSubAt ?? rightAt + 0.5} logos={["logo_facebook.svg", "logo_tiktok.svg", "logo_youtube.svg"]} at={rightAt} on={active === 1} x={1000} />}
    </AbsoluteFill>
  );
};

/** Une chaîne qui démarre : les mois passent, les compteurs restent bas (illustration du « long terme »). */
export const SlowGrowth: React.FC<{ end: number; monthsAt: number; caption: string; captionAt: number }> = ({ end, monthsAt, caption, captionAt }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const m = Math.max(1, Math.min(6, Math.floor(1 + (t - monthsAt) / 0.9)));
  const views = [0, 3, 11, 24, 40, 58][m - 1];
  const subs = [0, 0, 1, 2, 4, 6][m - 1];
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT, alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill style={{ background: "rgba(5,7,4,0.72)", backdropFilter: "blur(16px)" }} />
      <div style={{ position: "relative", ...glass, background: "rgba(14,17,12,0.94)", borderRadius: 44, padding: "46px 70px", display: "flex", gap: 80, alignItems: "center", ...blurIn(t, 0, 0.5, 30) }}>
        <div style={{ textAlign: "center" }}>
          <Eyebrow size={30}>Ta nouvelle chaîne</Eyebrow>
          <div style={{ fontSize: 150, fontWeight: 500, color: INK, letterSpacing: "-0.05em", lineHeight: 1, marginTop: 14, fontVariantNumeric: "tabular-nums" }}>Mois {m}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 60, color: INK_SOFT, fontVariantNumeric: "tabular-nums" }}>{views} vues</div>
          <div style={{ fontSize: 60, color: INK_SOFT, fontVariantNumeric: "tabular-nums" }}>{subs} abonnés</div>
          <div style={{ fontSize: 60, color: BAD, fontVariantNumeric: "tabular-nums" }}>0 vente</div>
        </div>
      </div>
      <div style={{ position: "relative", marginTop: 50, fontSize: 64, color: INK, letterSpacing: "-0.03em", ...blurIn(t, captionAt, 0.45, 20) }}>{rich(caption)}</div>
      <div style={{ position: "absolute", left: 70, bottom: 60, fontSize: 26, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" }}>Illustration</div>
    </AbsoluteFill>
  );
};

/** Les plateformes publicitaires (logos officiels) qui tombent ; Facebook s'allume. */
export const AdPlatforms: React.FC<{ end: number; items: { logo: string; name: string; at: number }[]; pickAt: number; pickText: string }> = ({ end, items, pickAt, pickText }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const pick = t >= pickAt;
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT, alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill style={{ background: "rgba(5,7,4,0.72)", backdropFilter: "blur(16px)" }} />
      <div style={{ position: "relative", display: "flex", gap: 40 }}>
        {items.map((it, i) => {
          const me = pick && i === 0;
          return (
            <div key={i} style={{ ...glass, background: me ? "linear-gradient(180deg, rgba(198,243,109,0.16), rgba(18,22,15,0.95))" : "rgba(14,17,12,0.94)", border: `2px solid ${me ? LIME : "rgba(255,255,255,0.1)"}`, borderRadius: 40, width: 420, padding: "48px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 26, opacity: pick && !me ? 0.45 : 1, transform: me ? "scale(1.05)" : undefined, ...blurIn(t, it.at, 0.45, 26) }}>
              <Img src={staticFile(`${D}/${it.logo}`)} style={{ width: 130, height: 130 }} />
              <div style={{ fontSize: 58, color: INK, letterSpacing: "-0.03em" }}>{it.name}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "relative", marginTop: 50, ...LIME_CARD, borderRadius: 999, padding: "16px 44px", fontSize: 52, fontWeight: 600, ...blurIn(t, pickAt + 0.2, 0.4, 16) }}>{pickText}</div>
    </AbsoluteFill>
  );
};

/** Écran de fin : la vidéo Google Ads (miniature réelle) + zone libre pour l'écran de fin YouTube. */
export const NextVideoCard: React.FC<{ end: number; title: string; cta: string; ctaAt: number }> = ({ end, title, cta, ctaAt }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.4, 0.01);
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <AbsoluteFill style={{ background: "rgba(5,7,4,0.72)", backdropFilter: "blur(16px)" }} />
      <div style={{ position: "absolute", left: 120, top: 180, width: 900, ...blurIn(t, 0.1, 0.6, 40) }}>
        <Eyebrow size={32}>Pour trouver tes premiers clients</Eyebrow>
        <div style={{ ...card, marginTop: 20 }}>
          <Img src={staticFile(`${D}/mini_googleads.jpg`)} style={{ width: 880, height: 495, borderRadius: 26, display: "block", objectFit: "cover" }} />
        </div>
        <div style={{ fontSize: 56, color: INK, letterSpacing: "-0.03em", marginTop: 24, lineHeight: 1.1 }}>{rich(title)}</div>
      </div>
      <div style={{ position: "absolute", left: 120, top: 1000 - 40, ...blurIn(t, ctaAt, 0.45, 20) }}>
        <div style={{ ...LIME_CARD, borderRadius: 999, padding: "14px 38px", fontSize: 44, fontWeight: 600 }}>{cta}</div>
      </div>
    </AbsoluteFill>
  );
};

// ════════ Mise à jour Hostinger (e-commerce devenu un forfait séparé), sans voix ════════

/** Séquence « Mise à jour octobre 2026 » : le vrai panier (capture du 11/10/2026, VPN France) + le récapitulatif recréé en grand. */
export const UpdateFlowInsert: React.FC<{ end: number }> = ({ end }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.01, 0.01);
  const ry = keyed(t, [0, 0.9], [12, 5], EASE);
  const lines = [
    { k: "Pack Growth (Ecommerce) · 12 mois", v: "64,69 €", at: 2.0 },
    { k: "Créateur de site IA · 3 premiers mois", v: "1 €", at: 2.8 },
    { k: "Taxes", v: "13,14 €", at: 3.6 },
    { k: "Code KAMARA7 · −10 %", v: "−7,19 €", at: 4.4 },
  ];
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <Backdrop />
      <div style={{ position: "absolute", left: 80, top: 66, ...blurIn(t, 0.3, 0.45, 18) }}>
        <Eyebrow size={30}>Mise à jour Hostinger · octobre 2026</Eyebrow>
        <div style={{ fontSize: 70, color: INK, letterSpacing: "-0.04em", lineHeight: 1.05, marginTop: 14, ...blurIn(t, 0.6, 0.45, 22) }}>Pour vendre un produit digital : {rich("*Hostinger Ecommerce*", INK)}</div>
      </div>
      <AbsoluteFill style={{ perspective: 2200 }}>
        <div style={{ position: "absolute", left: 80, top: 290, transform: `rotateY(${ry}deg)`, transformOrigin: "0 50%", ...blurIn(t, 0.1, 0.55, 40) }}>
          <div style={{ ...card, padding: 8 }}>
            <Img src={staticFile(`${CAP}/panier_growth.png`)} style={{ width: 885, height: 588, borderRadius: 22, display: "block" }} />
          </div>
          <div style={{ fontSize: 26, color: MUTED, marginTop: 16, letterSpacing: "0.08em", textTransform: "uppercase" }}>Le panier officiel · relevé le 11/10/2026</div>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 1060, top: 210, width: 800 }}>
        <div style={{ ...glass, background: "rgba(14,17,12,0.95)", borderRadius: 36, padding: "30px 38px", boxShadow: "0 40px 90px -30px rgba(0,0,0,0.9)", ...blurIn(t, 1.4, 0.45, 24) }}>
          {lines.map((l, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 20, fontSize: 38, color: INK_SOFT, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.07)", ...blurIn(t, l.at, 0.4, 14) }}>
              <span>{l.k}</span>
              <span style={{ color: INK, fontWeight: 500, whiteSpace: "nowrap" }}>{l.v}</span>
            </div>
          ))}
          <div style={{ ...LIME_CARD, borderRadius: 24, marginTop: 20, padding: "18px 26px", display: "flex", justifyContent: "space-between", alignItems: "baseline", ...blurIn(t, 5.4, 0.45, 20) }}>
            <span style={{ fontSize: 40, fontWeight: 500 }}>Total la 1re année</span>
            <span style={{ fontSize: 72, fontWeight: 600, letterSpacing: "-0.04em" }}>78,83 €</span>
          </div>
        </div>
        <div style={{ fontSize: 30, color: MUTED, marginTop: 18, lineHeight: 1.3, ...blurIn(t, 6.2, 0.45, 14) }}>Ensuite : 7,99 €/mois (Ecommerce) et 9,99 €/mois (créateur IA).</div>
      </div>
    </AbsoluteFill>
  );
};

/** Bandeau discret pendant l'offre filmée avant la mise à jour (bas, au centre, entre la pastille d'étape et le médaillon). */
export const UpdateBanner: React.FC<{ end: number; text: string }> = ({ end, text }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.4, 0.4);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 52, display: "flex", justifyContent: "center", opacity: o, fontFamily: FONT }}>
      <div style={{ ...glass, background: "rgba(14,17,12,0.92)", border: "1.5px solid rgba(198,243,109,0.45)", borderRadius: 999, padding: "12px 30px", fontSize: 32, color: INK, letterSpacing: "-0.01em" }}>{rich(text)}</div>
    </div>
  );
};
