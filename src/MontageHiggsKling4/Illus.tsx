// Illustrations du montage « Higgs Kling 4.0 » (J'ai confié le marketing de mes business à l'IA ; sponsor : Higgsfield).
// Playbook v2 : illustrer par le réel (vraies captures, vraie pub HD), chiffres = ceux de l'écran ([SCREEN-TRUTH]).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile } from "remotion";
import { Backdrop, blurIn, EASE, Eyebrow, FONT, glass, INK, INK_SOFT, inOut, keyed, LIME, LINE, MUTED, rich, SHADOW, Star, useT } from "../montage/lib";

export const D = "montage/higgs-kling4";
export const CAP = `${D}/cap`;
/** « 19 694 722 » avec des espaces normales (Geist n'a pas l'espace fine insécable de toLocaleString). */
export const fmtFr = (n: number) => Math.round(n).toLocaleString("fr-FR").replace(/[\u202f\u00a0]/g, " ");
const card: React.CSSProperties = { ...glass, background: "rgba(16,20,14,0.92)", borderRadius: 30, boxShadow: SHADOW };

/** La pub HD (carrée, 940×940) au centre, sur le fond de la charte. */
export const PubSquare: React.FC<{ end: number; size?: number; startFrom?: number; muted?: boolean; caption?: string; captionAt?: number }> = ({ end, size = 860, startFrom = 0, muted, caption, captionAt = 0.6 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.01, 0.35);
  const s = keyed(t, [0, end], [1.0, 1.035]);
  return (
    <AbsoluteFill style={{ opacity: o, justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <Backdrop />
      <div style={{ ...card, padding: 10, transform: `scale(${s})` }}>
        <OffthreadVideo src={staticFile(`${D}/pub.mp4`)} trimBefore={Math.round(startFrom * 30)} muted={muted} style={{ width: size, height: size, borderRadius: 22, display: "block" }} />
      </div>
      {caption && (
        <div style={{ position: "absolute", bottom: 46, ...blurIn(t, captionAt, 0.4, 14) }}>
          <div style={{ ...glass, background: "rgba(14,17,12,0.9)", borderRadius: 999, padding: "12px 30px", fontSize: 34, color: INK }}>{rich(caption)}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Les 4 images du plan, posées en ligne et numérotées. */
export const FOUR = [
  { src: `${D}/K1_boutique_vide.png`, label: "Boutique vide" },
  { src: `${D}/K2_telephone.png`, label: "Le téléphone" },
  { src: `${D}/K3_boutique_pleine.png`, label: "Boutique pleine" },
  { src: `${D}/K4_devanture_soir.png`, label: "Le soir" },
];
export const FourFrames: React.FC<{ end: number; ats: number[]; title?: string; titleAt?: number }> = ({ end, ats, title, titleAt = 0 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const w = 400;
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <Backdrop />
      {title && <div style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center", fontSize: 92, fontWeight: 500, color: INK, letterSpacing: "-0.04em", ...blurIn(t, titleAt, 0.45, 20) }}>{rich(title)}</div>}
      <div style={{ position: "absolute", top: 380, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 30 }}>
        {FOUR.map((k, i) => (
          <div key={i} style={{ ...blurIn(t, ats[i], 0.45, 40), textAlign: "center" }}>
            <div style={{ ...card, padding: 8, position: "relative" }}>
              <Img src={staticFile(k.src)} style={{ width: w, height: w, borderRadius: 22, display: "block", objectFit: "cover" }} />
              <div style={{ position: "absolute", left: 22, top: 22, width: 54, height: 54, borderRadius: 999, background: LIME, color: "#0d1208", fontSize: 32, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
            </div>
            <div style={{ marginTop: 16, fontSize: 34, color: INK_SOFT }}>{k.label}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** Deux cartes « business » (Ibrahim Kamara, Nova Media Lab), avec une mise en avant et un titre. */
export const BizCards: React.FC<{
  end: number;
  left: { title: string; meta: string; at: number; dim?: number; eyebrow?: string };
  right: { title: string; meta: string; at: number; mystery?: boolean; eyebrow?: string };
  title?: string;
  titleAt?: number;
  linkAt?: number;
}> = ({ end, left, right, title, titleAt = 0, linkAt }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const dimL = left.dim !== undefined ? keyed(t, [left.dim, left.dim + 0.4], [1, 0.35], EASE) : 1;
  const link = linkAt !== undefined ? keyed(t, [linkAt, linkAt + 0.6], [0, 1], EASE) : 0;
  const box = (c: { title: string; meta: string; at: number; eyebrow?: string }, opacity: number, fallback: string) => (
    <div style={{ ...card, width: 620, padding: "48px 52px", opacity, ...blurIn(t, c.at, 0.5, 30) }}>
      <Eyebrow size={28}>{c.eyebrow ?? fallback}</Eyebrow>
      <div style={{ fontSize: 76, fontWeight: 500, color: INK, letterSpacing: "-0.04em", marginTop: 14, lineHeight: 1.02 }}>{rich(c.title)}</div>
      <div style={{ fontSize: 36, color: MUTED, marginTop: 14 }}>{rich(c.meta)}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <Backdrop />
      {title && <div style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center", fontSize: 84, fontWeight: 500, color: INK, letterSpacing: "-0.04em", ...blurIn(t, titleAt, 0.45, 20) }}>{rich(title)}</div>}
      <div style={{ position: "absolute", top: 420, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 140 }}>
        {box(left, dimL, "Business n°1")}
        {box(right, 1, "Business n°2")}
      </div>
      {linkAt !== undefined && (
        <div style={{ position: "absolute", top: 560, left: "50%", transform: `translateX(-50%) scale(${0.6 + 0.4 * link})`, opacity: link, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <Star size={70} />
          <div style={{ fontSize: 34, color: LIME, letterSpacing: "0.12em" }}>IA</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Vraie capture inclinée à gauche + chiffre héros qui roule à droite (l'écran fait foi). */
export const CapStat: React.FC<{
  src: string;
  end: number;
  value: number;
  valueAt: number;
  label: string;
  source: string;
  crop?: { x: number; y: number; w: number; h: number }; // zone de la capture à montrer (px de la capture 1705×972)
  format?: (n: number) => string;
}> = ({ src, end, value, valueAt, label, source, crop = { x: 0, y: 0, w: 1705, h: 972 }, format = fmtFr }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const ry = keyed(t, [0, 0.9], [14, 6], EASE);
  const roll = keyed(t, [valueAt, valueAt + 1.0], [0, 1], (x) => 1 - Math.pow(1 - x, 3));
  const W = 900;
  const sc = W / 1705;
  const H = 972 * sc;
  const hl = keyed(t, [valueAt - 0.3, valueAt + 0.2], [0, 1], EASE);
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <Backdrop />
      <AbsoluteFill style={{ perspective: 2200 }}>
        <div style={{ position: "absolute", left: 90, top: (1080 - H) / 2, transform: `rotateY(${ry}deg)`, transformOrigin: "0% 50%", ...blurIn(t, 0, 0.55, 40) }}>
          <div style={{ ...card, padding: 8 }}>
            <div style={{ position: "relative", width: W, height: H }}>
              <Img src={staticFile(src)} style={{ width: W, height: H, borderRadius: 22, display: "block" }} />
              {/* Mise en évidence sobre de la zone du chiffre (pas de flèche ni de cercle rouge) */}
              <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: `rgba(9,11,8,${0.45 * hl})`, clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 ${crop.y * sc}px, ${crop.x * sc}px ${crop.y * sc}px, ${crop.x * sc}px ${(crop.y + crop.h) * sc}px, ${(crop.x + crop.w) * sc}px ${(crop.y + crop.h) * sc}px, ${(crop.x + crop.w) * sc}px ${crop.y * sc}px, 0 ${crop.y * sc}px)` }} />
              <div style={{ position: "absolute", left: crop.x * sc, top: crop.y * sc, width: crop.w * sc, height: crop.h * sc, borderRadius: 12, border: `3px solid ${LIME}`, opacity: hl, boxShadow: `0 0 24px rgba(198,243,109,0.5)` }} />
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 1060, right: 60, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Eyebrow size={30} style={blurIn(t, valueAt - 0.2, 0.4)}>{source}</Eyebrow>
        <div style={{ fontSize: 132, fontWeight: 500, color: INK, letterSpacing: "-0.045em", fontVariantNumeric: "tabular-nums", lineHeight: 1.05, marginTop: 10, textShadow: "0 0 60px rgba(198,243,109,0.25)", ...blurIn(t, valueAt, 0.4, 20) }}>{format(value * roll)}</div>
        <div style={{ fontSize: 50, color: INK_SOFT, marginTop: 8, ...blurIn(t, valueAt + 0.3, 0.4) }}>{rich(label)}</div>
      </div>
    </AbsoluteFill>
  );
};

/** Éventail de vraies captures (« tous mes chiffres »). */
export const CapFan: React.FC<{ end: number; items: { src: string; label: string; at: number }[]; title?: string; titleAt?: number }> = ({ end, items, title, titleAt = 0 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const W = 640, H = (W * 972) / 1705;
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <Backdrop />
      {title && <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontSize: 84, fontWeight: 500, color: INK, letterSpacing: "-0.04em", ...blurIn(t, titleAt, 0.45, 20) }}>{rich(title)}</div>}
      {items.map((it, i) => {
        const n = items.length;
        const rot = (i - (n - 1) / 2) * 7;
        const x = 960 - W / 2 + (i - (n - 1) / 2) * 560;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 420 + Math.abs(i - (n - 1) / 2) * 40, transform: `rotate(${rot}deg)`, ...blurIn(t, it.at, 0.5, 40) }}>
            <div style={{ ...card, padding: 8 }}>
              <Img src={staticFile(it.src)} style={{ width: W, height: H, borderRadius: 20, display: "block" }} />
            </div>
            <div style={{ textAlign: "center", marginTop: 14, fontSize: 34, color: INK_SOFT }}>{it.label}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Capture inclinée à droite + titre et pastilles à gauche (présentation d'un business, d'un profil). */
export const CapIntro: React.FC<{
  src: string;
  end: number;
  eyebrow: string;
  title: string;
  titleAt?: number;
  meta?: string;
  metaAt?: number;
  chips?: { text: string; at: number }[];
}> = ({ src, end, eyebrow, title, titleAt = 0.3, meta, metaAt = 1, chips = [] }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const ry = keyed(t, [0, 0.9], [-14, -6], EASE);
  const W = 980;
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <Backdrop />
      <AbsoluteFill style={{ perspective: 2200 }}>
        <div style={{ position: "absolute", left: 860, top: (1080 - (W * 972) / 1705) / 2, transform: `rotateY(${ry}deg)`, transformOrigin: "100% 50%", ...blurIn(t, 0, 0.55, 40) }}>
          <div style={{ ...card, padding: 8 }}>
            <Img src={staticFile(src)} style={{ width: W, height: (W * 972) / 1705, borderRadius: 22, display: "block" }} />
          </div>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 110, width: 700, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Eyebrow size={30} style={blurIn(t, titleAt - 0.15, 0.4)}>{eyebrow}</Eyebrow>
        <div style={{ fontSize: 96, fontWeight: 500, color: INK, letterSpacing: "-0.045em", lineHeight: 1.02, marginTop: 14, ...blurIn(t, titleAt, 0.45, 22) }}>{rich(title)}</div>
        {meta && <div style={{ fontSize: 44, color: INK_SOFT, marginTop: 18, ...blurIn(t, metaAt, 0.4) }}>{rich(meta)}</div>}
        {chips.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 30 }}>
            {chips.map((c, i) => (
              <div key={i} style={{ ...blurIn(t, c.at, 0.35, 10), padding: "10px 24px", borderRadius: 999, border: `1.5px solid ${LINE}`, fontSize: 34, color: INK }}>{c.text}</div>
            ))}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ════════ Montage complet (étape 6) ════════

/** Plateformes testées sans résultat : cartes sobres, chacune barrée d'un ✗ (même traitement qu'un succès, règle 12). */
export const FailRow: React.FC<{ end: number; items: { name: string; at: number }[]; title: string; titleAt: number }> = ({ end, items, title, titleAt }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <Backdrop />
      <div style={{ position: "absolute", top: 300, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 60 }}>
        {items.map((it, i) => (
          <div key={i} style={{ ...card, width: 440, padding: "54px 40px", textAlign: "center", ...blurIn(t, it.at, 0.45, 30) }}>
            <div style={{ fontSize: 64, fontWeight: 500, color: INK, letterSpacing: "-0.03em" }}>{it.name}</div>
            <div style={{ fontSize: 110, color: "#ff8a7a", marginTop: 18, fontWeight: 600, opacity: keyed(t, [it.at + 0.35, it.at + 0.6], [0, 1], EASE) }}>✗</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 820, left: 0, right: 0, textAlign: "center", fontSize: 84, fontWeight: 500, color: INK, letterSpacing: "-0.04em", ...blurIn(t, titleAt, 0.45, 20) }}>{rich(title)}</div>
    </AbsoluteFill>
  );
};

/** Chaîne de travail de l'IA, étape par étape ([FLOW-LINE]). */
export const FlowLine: React.FC<{ end: number; steps: { text: string; at: number }[]; title?: string; titleAt?: number }> = ({ end, steps, title, titleAt = 0 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <Backdrop />
      {title && <div style={{ position: "absolute", top: 220, left: 0, right: 0, textAlign: "center", fontSize: 84, fontWeight: 500, color: INK, letterSpacing: "-0.04em", ...blurIn(t, titleAt, 0.45, 20) }}>{rich(title)}</div>}
      <div style={{ position: "absolute", top: 470, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 18 }}>
        {steps.map((s, i) => {
          const last = i === steps.length - 1;
          return (
            <React.Fragment key={i}>
              {i > 0 && <div style={{ fontSize: 50, color: MUTED, opacity: keyed(t, [s.at - 0.1, s.at + 0.2], [0, 1]) }}>→</div>}
              <div style={{ ...card, ...(last ? { background: LIME, color: "#0d1208", border: "none" } : { color: INK }), borderRadius: 26, padding: "30px 34px", fontSize: 44, fontWeight: 500, letterSpacing: "-0.02em", ...blurIn(t, s.at, 0.4, 24) }}>
                <div style={{ fontSize: 24, letterSpacing: "0.14em", color: last ? "#33441c" : LIME, marginBottom: 8 }}>{i + 1}</div>
                {s.text}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Capture de téléphone (Telegram) qui défile lentement, légende à gauche. */
export const PhoneShot: React.FC<{ src: string; iw: number; ih: number; end: number; caption: string; captionAt?: number; eyebrow?: string }> = ({ src, iw, ih, end, caption, captionAt = 0.8, eyebrow }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const w = 470;
  const h = 940;
  const sh = (ih * w) / iw;
  const y = keyed(t, [0.6, end - 0.4], [0, -(sh - h)], (x) => x);
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <Backdrop />
      <div style={{ position: "absolute", left: 1180, top: 70, ...blurIn(t, 0, 0.5, 40) }}>
        <div style={{ ...card, padding: 12, borderRadius: 54 }}>
          <div style={{ width: w, height: h, borderRadius: 44, overflow: "hidden", position: "relative" }}>
            <Img src={staticFile(src)} style={{ position: "absolute", left: 0, top: y, width: w, height: sh }} />
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 150, top: 380, width: 900 }}>
        {eyebrow && <div style={blurIn(t, 0.3, 0.4, 14)}><Eyebrow size={30}>{eyebrow}</Eyebrow></div>}
        <div style={{ fontSize: 88, fontWeight: 500, color: INK, letterSpacing: "-0.04em", lineHeight: 1.05, marginTop: 18, ...blurIn(t, captionAt, 0.45, 20) }}>{rich(caption)}</div>
      </div>
    </AbsoluteFill>
  );
};

/** Kling 3.0 contre Kling 4.0 : durée maximale d'un clip (15 s contre 30 s). */
export const DurationBars: React.FC<{ end: number; oldAt: number; newAt?: number; title?: string; titleAt?: number }> = ({ end, oldAt, newAt, title, titleAt = 0 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  const full = 1100;
  const g1 = keyed(t, [oldAt, oldAt + 0.9], [0, 0.5], EASE);
  const g2 = newAt !== undefined ? keyed(t, [newAt, newAt + 1.1], [0, 1], EASE) : 0;
  const row = (label: string, g: number, at: number, secs: string, hi: boolean) => (
    <div style={{ display: "flex", alignItems: "center", gap: 40, ...blurIn(t, at, 0.4, 20) }}>
      <div style={{ width: 300, fontSize: 52, color: hi ? INK : MUTED, fontWeight: 500, letterSpacing: "-0.02em" }}>{label}</div>
      <div style={{ width: full, height: 84, borderRadius: 42, background: "rgba(255,255,255,0.06)", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: full * g, borderRadius: 42, background: hi ? LIME : "rgba(255,255,255,0.28)" }} />
      </div>
      <div style={{ width: 160, fontSize: 64, fontWeight: 500, color: hi ? LIME : INK_SOFT }}>{secs}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <Backdrop />
      {title && <div style={{ position: "absolute", top: 200, left: 0, right: 0, textAlign: "center", fontSize: 84, fontWeight: 500, color: INK, letterSpacing: "-0.04em", ...blurIn(t, titleAt, 0.45, 20) }}>{rich(title)}</div>}
      <div style={{ position: "absolute", top: 470, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 70 }}>
        {row("Kling 3.0", g1, oldAt, "15 s", false)}
        {newAt !== undefined && row("Kling 4.0", g2, newAt, "30 s", true)}
      </div>
    </AbsoluteFill>
  );
};

/** Image posée en carte sur le côté (l'écran reste visible). */
export const ImageCard: React.FC<{ src: string; end: number; label: string; w?: number; h?: number; side?: "left" | "right" }> = ({ src, end, label, w = 480, h = 600, side = "left" }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  return (
    <div style={{ position: "absolute", [side]: 80, top: 160, opacity: o, fontFamily: FONT, ...blurIn(t, 0, 0.5, 30) }}>
      <div style={{ ...card, padding: 10 }}>
        <Img src={staticFile(src)} style={{ width: w, height: h, borderRadius: 22, display: "block", objectFit: "cover" }} />
      </div>
      <div style={{ marginTop: 16, ...glass, background: "rgba(14,17,12,0.92)", borderRadius: 999, padding: "12px 28px", display: "inline-block", fontSize: 34, color: INK }}>{rich(label)}</div>
    </div>
  );
};

/** Le clip de la retouche (5 s, 16:9) joué en entier, avec son son. */
export const ClipCard: React.FC<{ src: string; end: number; caption?: string; volume?: number }> = ({ src, end, caption, volume = 0.5 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.01, 0.35);
  return (
    <AbsoluteFill style={{ opacity: o, justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <Backdrop />
      <div style={{ ...card, padding: 10 }}>
        <OffthreadVideo src={staticFile(src)} volume={volume} style={{ width: 1500, height: 844, borderRadius: 22, display: "block" }} />
      </div>
      {caption && (
        <div style={{ position: "absolute", bottom: 40, ...blurIn(t, 0.6, 0.4, 14) }}>
          <div style={{ ...glass, background: "rgba(14,17,12,0.9)", borderRadius: 999, padding: "12px 30px", fontSize: 34, color: INK }}>{rich(caption)}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Le Tableau du défi en crédits Higgsfield (registre de 04-plan § 3). */
export const CreditBoard: React.FC<{ end: number; rows: { label: string; value: string; at: number }[]; total: string; totalAt: number; title?: string }> = ({ end, rows, total, totalAt, title }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.35);
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT, justifyContent: "center", alignItems: "center" }}>
      <Backdrop />
      <div style={{ ...card, width: 1240, padding: "56px 70px", ...blurIn(t, 0, 0.5, 30) }}>
        {title && <Eyebrow size={30}>{title}</Eyebrow>}
        {rows.map((r, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 48, color: INK_SOFT, padding: "22px 0", borderBottom: `1px solid ${LINE}`, ...blurIn(t, r.at, 0.4, 16) }}>
            <span>{rich(r.label)}</span>
            <span style={{ color: INK }}>{r.value}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 30, ...blurIn(t, totalAt, 0.45, 20) }}>
          <span style={{ fontSize: 52, color: INK, fontWeight: 500 }}>Total</span>
          <span style={{ fontSize: 110, color: LIME, fontWeight: 500, letterSpacing: "-0.04em" }}>{total}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Carte de fin : la prochaine vidéo, sans miniature (titre seul). */
export const EndCard: React.FC<{ end: number; eyebrow: string; title: string }> = ({ end, eyebrow, title }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.4, 0.01);
  return (
    <AbsoluteFill style={{ opacity: o, fontFamily: FONT }}>
      <AbsoluteFill style={{ background: "rgba(5,7,4,0.72)", backdropFilter: "blur(16px)" }} />
      <div style={{ position: "absolute", left: 140, top: 330, width: 1100, ...blurIn(t, 0.1, 0.6, 40) }}>
        <Eyebrow size={32}>{eyebrow}</Eyebrow>
        <div style={{ ...card, marginTop: 24, padding: "54px 60px", fontSize: 80, fontWeight: 500, color: INK, letterSpacing: "-0.04em", lineHeight: 1.08 }}>{rich(title)}</div>
      </div>
    </AbsoluteFill>
  );
};
