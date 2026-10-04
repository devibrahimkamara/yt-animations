// Composants d'illustration réutilisables : marques, chat IA animé, Carte du tuto, étiquette.
// Identité v2 « Noir & Lime » (analysis/identite-v2/charte.md).
import React from "react";
import { AbsoluteFill, Easing } from "remotion";
import { Backdrop, blurIn, EASE, Eyebrow, FONT, glass, Grain, INK, inOut, keyed, LIME, LIME_SOFT, LINE, MUTED, Pill, rich, Star, useT } from "./lib";

// ─── Marques : pastilles de verre en colonne décalée, à côté de la face cam ──
export type Brand = { name: string; color: string; at: number };
export const BrandTiles: React.FC<{ brands: Brand[]; end: number; side?: "right" | "left"; title?: string }> = ({ brands, end, side = "right", title }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.01, 0.4);
  const shade = keyed(t, [0, 0.5], [0, 1], EASE);
  const offsets = [0, 60, 20, 80, 40];
  return (
    <AbsoluteFill style={{ opacity: o }}>
      {/* Le côté des pastilles s'assombrit pour la lisibilité ; le visage reste net */}
      <AbsoluteFill
        style={{
          opacity: shade,
          background: `linear-gradient(${side === "right" ? 90 : 270}deg, transparent 38%, rgba(9,11,8,0.86) 68%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          [side]: 120,
          top: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 26,
          alignItems: side === "right" ? "flex-start" : "flex-end",
        }}
      >
        {title && <Eyebrow style={blurIn(t, Math.max(0, brands[0].at - 0.4))}>{title}</Eyebrow>}
        {brands.map((b, i) => (
          <div key={b.name} style={{ marginLeft: side === "right" ? offsets[i % offsets.length] : 0, marginRight: side === "left" ? offsets[i % offsets.length] : 0, ...blurIn(t, b.at, 0.45, 26) }}>
            <Pill dot={b.color} size={48}>
              {b.name}
            </Pill>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── Chat IA animé : question → recommandations, puis sources qui remontent ─
export type ChatTurn = { q: string; qAt: number; typeDur: number; answerAt: number; items: string[]; itemsAt: number };
export const ChatMock: React.FC<{ turns: ChatTurn[]; sources: { label: string; at: number }[]; sourcesMergeAt: number; end: number; title?: string; eyebrow?: string }> = ({
  turns,
  sources,
  sourcesMergeAt,
  end,
  title = "Assistant IA",
  eyebrow = "Ce que l'IA répond",
}) => {
  const t = useT();
  const enter = keyed(t, [0, 0.6], [0, 1], EASE);
  // Le 2e échange fait remonter le 1er (défilement de conversation)
  const scroll = turns.length > 1 ? keyed(t, [turns[1].qAt - 0.3, turns[1].qAt + 0.3], [0, 1]) : 0;
  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 70, gap: 30, fontFamily: FONT }}>
        <Eyebrow style={blurIn(t, 0.1)}>{eyebrow}</Eyebrow>
        <div
          style={{
            ...glass,
            width: 1260,
            height: 720,
            borderRadius: 40,
            overflow: "hidden",
            position: "relative",
            opacity: enter,
            transform: `translateY(${(1 - enter) * 50}px) scale(${0.95 + 0.05 * enter})`,
          }}
        >
          <div style={{ height: 96, display: "flex", alignItems: "center", gap: 18, padding: "0 46px", borderBottom: `1px solid ${LINE}`, color: MUTED, fontSize: 34 }}>
            <Star size={32} spin={t * 20} />
            {title}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 96, bottom: 0, overflow: "hidden" }}>
            <div style={{ padding: "36px 50px", transform: `translateY(${-scroll * 500}px)` }}>
              {turns.map((tu, i) => (
                <Turn key={i} tu={tu} />
              ))}
            </div>
          </div>
        </div>
        <Sources sources={sources} mergeAt={sourcesMergeAt} />
      </AbsoluteFill>
      <Grain />
    </AbsoluteFill>
  );
};
const Turn: React.FC<{ tu: ChatTurn }> = ({ tu }) => {
  const t = useT();
  if (t < tu.qAt) return <div style={{ height: 500 }} />;
  const n = Math.round(keyed(t, [tu.qAt, tu.qAt + tu.typeDur], [0, tu.q.length], Easing.linear));
  const caret = n < tu.q.length || Math.floor(t * 2) % 2 === 0;
  return (
    <div style={{ height: 500 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{ maxWidth: 900, background: LIME, color: "#0d1208", fontSize: 44, fontWeight: 500, letterSpacing: "-0.015em", padding: "22px 34px", borderRadius: "32px 32px 10px 32px", lineHeight: 1.2 }}>
          {tu.q.slice(0, n)}
          {t < tu.answerAt && <span style={{ opacity: caret ? 0.6 : 0 }}>|</span>}
        </div>
      </div>
      <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 18, ...blurIn(t, tu.answerAt, 0.4) }}>
        {t < tu.itemsAt && <TypingDots />}
        {t >= tu.itemsAt &&
          tu.items.map((it, k) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 24, color: INK, fontSize: 50, fontWeight: 500, letterSpacing: "-0.02em", ...blurIn(t, tu.itemsAt + k * 0.3, 0.4) }}>
              <span style={{ width: 64, height: 64, borderRadius: 20, background: LIME_SOFT, color: LIME, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 34 }}>{k + 1}</span>
              {it}
            </div>
          ))}
      </div>
    </div>
  );
};
const TypingDots: React.FC = () => {
  const t = useT();
  return (
    <div style={{ display: "flex", gap: 12, padding: "14px 4px" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: 16, height: 16, borderRadius: 8, background: LIME, opacity: 0.3 + 0.7 * Math.max(0, Math.sin((t * 6 - i * 0.9) % (Math.PI * 2))) }} />
      ))}
    </div>
  );
};
/** Les sources apparaissent sous le chat puis remontent s'y fondre (« l'IA lit internet »). */
const Sources: React.FC<{ sources: { label: string; at: number }[]; mergeAt: number }> = ({ sources, mergeAt }) => {
  const t = useT();
  if (!sources.length) return <div style={{ height: 90 }} />;
  const merge = keyed(t, [mergeAt, mergeAt + 0.7], [0, 1], Easing.in(Easing.cubic));
  const lab = keyed(t, [sources[0].at - 0.3, sources[0].at + 0.1], [0, 1], EASE) * (1 - merge);
  return (
    <div style={{ display: "flex", gap: 22, alignItems: "center", height: 90 }}>
      <span style={{ fontFamily: FONT, fontSize: 36, color: MUTED, marginRight: 8, opacity: lab }}>Ses sources :</span>
      {sources.map((s) => {
        const a = keyed(t, [s.at, s.at + 0.4], [0, 1], EASE);
        return (
          <div
            key={s.label}
            style={{
              opacity: a * (1 - merge),
              filter: a < 1 || merge > 0 ? `blur(${(1 - a) * 10 + merge * 6}px)` : undefined,
              transform: `translateY(${(1 - a) * 24 - merge * 320}px) scale(${1 - merge * 0.4})`,
            }}
          >
            <Pill size={40}>{s.label}</Pill>
          </div>
        );
      })}
    </div>
  );
};

// ─── Carte du tuto ([TUTO-MAP]) : cartes de verre numérotées 01…0n ───────────
export type MapStep = { n: number; label: string; at: number };
export const TutoMap: React.FC<{ title: string; steps: MapStep[]; active?: number; done?: number; end: number; titleAt?: number; eyebrow?: string }> = ({
  title,
  steps,
  active = -1,
  done = 0,
  end,
  titleAt = 0,
  eyebrow = "Le plan",
}) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.01, 0.4);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Backdrop />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 70, fontFamily: FONT, color: INK }}>
        <div style={{ textAlign: "center" }}>
          <Eyebrow style={blurIn(t, titleAt)}>{eyebrow}</Eyebrow>
          <div style={{ fontSize: 110, fontWeight: 500, letterSpacing: "-0.04em", marginTop: 14, ...blurIn(t, titleAt + 0.1, 0.5, 22) }}>{rich(title)}</div>
        </div>
        <div style={{ display: "flex", gap: 26 }}>
          {steps.map((s, i) => (
            <MapCard key={s.n} s={s} isActive={i === active} isDone={i < done} />
          ))}
        </div>
      </AbsoluteFill>
      <Grain />
    </AbsoluteFill>
  );
};
const MapCard: React.FC<{ s: MapStep; isActive: boolean; isDone: boolean }> = ({ s, isActive, isDone }) => {
  const t = useT();
  const b = blurIn(t, s.at, 0.45, 30);
  return (
    <div
      style={{
        ...glass,
        width: 318,
        height: 300,
        borderRadius: 34,
        padding: "34px 30px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: `1.5px solid ${isActive ? LIME : LINE}`,
        boxShadow: isActive ? `0 0 50px rgba(198,243,109,0.25), inset 0 1px 0 rgba(255,255,255,0.07)` : glass.boxShadow,
        ...b,
        opacity: Number(b.opacity) * (isDone ? 0.55 : 1),
      }}
    >
      <div style={{ fontSize: 40, color: LIME, fontWeight: 500 }}>{isDone ? "✓" : `0${s.n}`}</div>
      <div style={{ fontSize: 44, fontWeight: 500, lineHeight: 1.1, letterSpacing: "-0.02em" }}>{s.label}</div>
    </div>
  );
};

/** Étiquette posée sur une scène (ex. « Un rapport de visibilité IA ») : ✦ + sur-titre, en haut à gauche. */
export const Tag: React.FC<{ text: string; start: number; end: number; top?: number; left?: number }> = ({ text, start, end, top = 70, left = 120 }) => {
  const t = useT();
  const o = inOut(t, start, end, 0.01, 0.35);
  const b = blurIn(t, start);
  return (
    <div style={{ position: "absolute", left, top, display: "flex", alignItems: "center", gap: 18, ...b, opacity: Math.min(o, Number(b.opacity)) }}>
      <Star size={38} spin={(1 - keyed(t, [start, start + 0.7], [0, 1], EASE)) * -90} />
      <Eyebrow size={32}>{text}</Eyebrow>
    </div>
  );
};

// ─── Rangée d'icônes au mot (ex. Restaurant · Coiffeur · Université), sur la face cam ─
const ICONS: Record<string, React.ReactNode> = {
  restaurant: <path d="M7 2v9a2 2 0 0 0 2 2v9M5 2v6M9 2v6M17 2c-2 1-3 4-3 7h3v13" />,
  coiffeur: (
    <>
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M8.1 8.1 20 20M8.1 15.9 20 4" />
    </>
  ),
  universite: <path d="M2 9l10-5 10 5-10 5-10-5zM6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5M22 9v6" />,
};
export const IconRow: React.FC<{ items: { icon: keyof typeof ICONS | string; label: string; at: number }[]; end: number }> = ({ items, end }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.01, 0.4);
  const shade = keyed(t, [0, 0.5], [0, 1], EASE);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ opacity: shade, background: "linear-gradient(180deg, transparent 45%, rgba(9,11,8,0.85) 82%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, display: "flex", justifyContent: "center", gap: 34 }}>
        {items.map((it) => (
          <div key={it.label} style={{ ...glass, borderRadius: 34, padding: "28px 44px", display: "flex", alignItems: "center", gap: 24, fontFamily: FONT, ...blurIn(t, it.at, 0.45, 26) }}>
            <svg width={60} height={60} viewBox="0 0 24 24" fill="none" stroke={LIME} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              {ICONS[it.icon]}
            </svg>
            <span style={{ fontSize: 50, fontWeight: 500, color: INK, letterSpacing: "-0.02em" }}>{it.label}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── Google → IA : la recherche Google s'efface, le référencement migre vers l'IA ─
export const GoogleToAI: React.FC<{ end: number; fadeAt: number; seoAt: number; strikeAt: number; aiAt: number }> = ({ end, fadeAt, seoAt, strikeAt, aiAt }) => {
  const t = useT();
  const fade = keyed(t, [fadeAt, fadeAt + 1.2], [0, 1], EASE);
  const strike = keyed(t, [strikeAt, strikeAt + 0.5], [0, 1], EASE);
  const arrow = keyed(t, [aiAt - 0.4, aiAt + 0.3], [0, 1], EASE);
  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{ fontFamily: FONT, color: INK }}>
        {/* Gauche : la recherche Google d'avant */}
        <div style={{ position: "absolute", left: 130, top: 0, bottom: 0, width: 760, display: "flex", flexDirection: "column", justifyContent: "center", gap: 34, alignItems: "center" }}>
          <div style={{ position: "relative", height: 50, ...blurIn(t, seoAt) }}>
            <Eyebrow size={32} style={{ color: MUTED, whiteSpace: "nowrap" }}>Le référencement Google (SEO)</Eyebrow>
            <div style={{ position: "absolute", left: -8, right: -8, top: "50%", height: 3, borderRadius: 2, background: "#ff8a7a", transformOrigin: "left", transform: `scaleX(${strike})` }} />
          </div>
          <div style={{ ...blurIn(t, 0.15, 0.5, 24), width: "100%" }}>
            <div
              style={{
                ...glass,
                borderRadius: 999,
                padding: "38px 48px",
                display: "flex",
                alignItems: "center",
                gap: 26,
                fontSize: 50,
                opacity: 1 - 0.45 * fade,
                filter: fade > 0.02 ? `blur(${fade * 2.5}px) grayscale(${fade})` : undefined,
                transform: `scale(${1 - 0.08 * fade})`,
              }}
            >
              <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth={2} strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-4-4" />
              </svg>
              <span style={{ color: MUTED }}>Rechercher sur Google…</span>
            </div>
          </div>
        </div>
        {/* Flèche */}
        <svg style={{ position: "absolute", left: 905, top: 520, overflow: "visible" }} width={160} height={40}>
          <path d="M0 20 H140 M120 6 L142 20 L120 34" fill="none" stroke={LIME} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={200} strokeDashoffset={200 * (1 - arrow)} />
        </svg>
        {/* Droite : la visibilité dans l'IA */}
        <div style={{ position: "absolute", left: 1100, top: 0, bottom: 0, width: 680, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 26, ...blurIn(t, aiAt, 0.55, 30) }}>
          <Star size={64} spin={(1 - keyed(t, [aiAt, aiAt + 0.8], [0, 1], EASE)) * -90} />
          <div style={{ ...glass, borderRadius: 40, padding: "40px 56px", textAlign: "center", border: `1.5px solid rgba(198,243,109,0.35)`, boxShadow: "0 0 60px rgba(198,243,109,0.18)" }}>
            <Eyebrow size={30}>Aujourd'hui</Eyebrow>
            <div style={{ fontSize: 96, fontWeight: 500, letterSpacing: "-0.04em", marginTop: 10 }}>{rich("Visibilité *IA*")}</div>
          </div>
        </div>
      </AbsoluteFill>
      <Grain />
    </AbsoluteFill>
  );
};

// ─── Teaser « À venir » : flashs successifs ─────────────────────────────────
export const Teaser: React.FC<{ items: { text: string; at: number; dur: number }[]; end: number; label?: string }> = ({ items, end, label = "À venir" }) => {
  const t = useT();
  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{ fontFamily: FONT, color: INK, alignItems: "center" }}>
        <div style={{ position: "absolute", top: 230, display: "flex", alignItems: "center", gap: 16, ...blurIn(t, 0.05) }}>
          <Star size={40} spin={t * 30} />
          <Eyebrow size={34}>{label}</Eyebrow>
        </div>
        {items.map((it, i) => {
          const a = keyed(t, [it.at, it.at + 0.28], [0, 1], EASE);
          const b = keyed(t, [it.at + it.dur - 0.22, it.at + it.dur], [0, 1], Easing.in(Easing.quad));
          if (t < it.at || t > it.at + it.dur) return null;
          return (
            <AbsoluteFill key={i} style={{ justifyContent: "center", alignItems: "center" }}>
              <div style={{ fontSize: 132, fontWeight: 500, letterSpacing: "-0.04em", opacity: Math.min(a, 1 - b), filter: `blur(${(1 - a) * 12 + b * 10}px)`, transform: `scale(${0.96 + 0.04 * a + 0.03 * b})` }}>
                {rich(it.text)}
              </div>
            </AbsoluteFill>
          );
        })}
      </AbsoluteFill>
      <Grain />
    </AbsoluteFill>
  );
};

// ─── Carte de note (vignette d'article, référence) posée sur la droite ─────
export const NoteCard: React.FC<{ eyebrow: string; title: string; meta?: string; start: number; end: number }> = ({ eyebrow, title, meta, start, end }) => {
  const t = useT();
  const o = inOut(t, start, end, 0.01, 0.4);
  const b = blurIn(t, start, 0.5, 30);
  return (
    <div style={{ position: "absolute", right: 120, top: 250, width: 720, ...glass, background: "linear-gradient(180deg, rgba(18,22,15,0.92), rgba(18,22,15,0.86))", borderRadius: 40, padding: "44px 50px", fontFamily: FONT, color: INK, ...b, opacity: Math.min(o, Number(b.opacity)) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Star size={30} />
        <Eyebrow size={28}>{eyebrow}</Eyebrow>
      </div>
      <div style={{ fontSize: 60, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1.12, marginTop: 22 }}>{rich(title)}</div>
      {meta && <div style={{ fontSize: 32, color: MUTED, marginTop: 22 }}>{meta}</div>}
    </div>
  );
};

// ─── Sous-étape numérotée ([STEP-LT]) : en bas à gauche (le médaillon est à droite) ─
export const StepLT: React.FC<{ n: number | string; text: string; end: number }> = ({ n, text, end }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.01, 0.4);
  const b = blurIn(t, 0, 0.45, 26);
  return (
    <div style={{ position: "absolute", left: 60, bottom: 64, ...b, opacity: Math.min(o, Number(b.opacity)) }}>
      <div style={{ ...glass, background: "linear-gradient(180deg, rgba(18,22,15,0.94), rgba(18,22,15,0.88))", borderRadius: 30, padding: "22px 34px 22px 22px", display: "flex", alignItems: "center", gap: 22, fontFamily: FONT }}>
        <span style={{ width: 66, height: 66, borderRadius: 33, background: LIME, color: "#0d1208", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 600 }}>{n}</span>
        <span style={{ fontSize: 50, fontWeight: 500, color: INK, letterSpacing: "-0.02em" }}>{rich(text)}</span>
      </div>
    </div>
  );
};

// ─── Pastille en haut au centre (étiquette, astuce, tendance) ──────────────
export const TopPill: React.FC<{ text: string; end: number; icon?: "star" | "trend" | "tip"; top?: number }> = ({ text, end, icon = "star", top = 80 }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.01, 0.4);
  const b = blurIn(t, 0, 0.45, -20);
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: top }}>
      <div style={{ ...b, opacity: Math.min(o, Number(b.opacity)) }}>
        <Pill size={48} style={{ background: "linear-gradient(180deg, rgba(18,22,15,0.94), rgba(18,22,15,0.88))" }}>
          {icon === "star" && <Star size={40} />}
          {icon === "trend" && (
            <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke={LIME} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />
            </svg>
          )}
          {icon === "tip" && <span style={{ fontSize: 30, letterSpacing: "0.14em", color: LIME, textTransform: "uppercase" }}>Astuce</span>}
          {rich(text)}
        </Pill>
      </div>
    </AbsoluteFill>
  );
};

// ─── Mise en avant d'une zone de l'écran ([SPOTLIGHT]) : cadre lime + légende ─
export const Spotlight: React.FC<{ x: number; y: number; w: number; h: number; caption?: string; end: number }> = ({ x, y, w, h, caption, end }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.3, 0.3);
  const sc = 1.04 - 0.04 * keyed(t, [0, 0.35], [0, 1], EASE);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 26, border: `4px solid ${LIME}`, boxShadow: `0 0 0 2000px rgba(9,11,8,0.45), 0 0 40px rgba(198,243,109,0.45)`, transform: `scale(${sc})` }} />
      {caption && (
        <div style={{ position: "absolute", left: x, width: w, top: y + h + 22, display: "flex", justifyContent: "center", ...blurIn(t, 0.15, 0.4, 16) }}>
          <Pill size={44} accent>
            {caption}
          </Pill>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─── « Le Prompt décortiqué » ([PROMPT-CARD]) ──────────────────────────────
export const PromptCard: React.FC<{ parts: { text: string; label?: string; at?: number }[]; end: number; tool?: string }> = ({ parts, end, tool = "Claude Code" }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.01, 0.4);
  const b = blurIn(t, 0, 0.5, 30);
  const labels = parts.filter((p) => p.label);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: o, fontFamily: FONT }}>
      <AbsoluteFill style={{ background: "rgba(9,11,8,0.55)" }} />
      <div style={{ display: "flex", gap: 18, marginBottom: 30, position: "relative" }}>
        {labels.map((p) => (
          <div key={p.label} style={blurIn(t, p.at ?? 0, 0.4, 16)}>
            <Pill size={38} accent={t >= (p.at ?? 0)}>
              {p.label}
            </Pill>
          </div>
        ))}
      </div>
      <div style={{ ...glass, background: "linear-gradient(180deg, rgba(18,22,15,0.96), rgba(18,22,15,0.9))", position: "relative", width: 1500, borderRadius: 40, padding: "40px 54px", ...b, opacity: Math.min(o, Number(b.opacity)) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
          <Star size={30} />
          <Eyebrow size={28}>Le prompt · {tool}</Eyebrow>
        </div>
        <div style={{ fontSize: 52, lineHeight: 1.3, fontWeight: 400, color: MUTED, letterSpacing: "-0.015em" }}>
          {parts.map((p, i) => {
            const on = p.at !== undefined && t >= p.at;
            return (
              <span key={i} style={{ color: on ? INK : p.at === undefined ? INK : MUTED, borderBottom: on ? `4px solid ${LIME}` : "4px solid transparent", transition: "none" }}>
                {p.text}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Validation ([CHECK]) : « ✓ AIsa connecté » ─────────────────────────────
export const CheckCard: React.FC<{ text: string; end: number }> = ({ text, end }) => {
  const t = useT();
  const o = inOut(t, 0, end, 0.01, 0.4);
  const ring = keyed(t, [0.1, 0.7], [0, 1], EASE);
  const tick = keyed(t, [0.45, 0.9], [0, 1], EASE);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: o, fontFamily: FONT }}>
      <AbsoluteFill style={{ background: "rgba(9,11,8,0.5)" }} />
      <div style={{ ...glass, background: "linear-gradient(180deg, rgba(18,22,15,0.96), rgba(18,22,15,0.9))", position: "relative", borderRadius: 44, padding: "48px 72px", display: "flex", alignItems: "center", gap: 40, ...blurIn(t, 0, 0.45, 26) }}>
        <svg width={130} height={130} viewBox="0 0 130 130">
          <circle cx={65} cy={65} r={58} fill="none" stroke={LIME} strokeWidth={6} strokeDasharray={365} strokeDashoffset={365 * (1 - ring)} transform="rotate(-90 65 65)" />
          <path d="M40 67 L58 84 L92 48" fill="none" stroke={LIME} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={80} strokeDashoffset={80 * (1 - tick)} />
        </svg>
        <span style={{ fontSize: 96, fontWeight: 500, color: INK, letterSpacing: "-0.04em" }}>{rich(text)}</span>
      </div>
    </AbsoluteFill>
  );
};
