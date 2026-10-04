// Identité visuelle v2 — planche de test (images fixes, une par frame). Charte : analysis/identite-v2/charte.md
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";

const { fontFamily: SANS } = loadGeist("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });
const { fontFamily: SERIF } = loadSerif("italic", { weights: ["400"], subsets: ["latin"] });

export const V2 = {
  bg: "#090b08",
  surface: "#12160f",
  ink: "#f2f5ec",
  inkSoft: "#dce3d3",
  muted: "#9ba394",
  line: "rgba(255,255,255,0.08)",
  lime: "#c6f36d",
  limeDeep: "#8dbb3a",
  limeSoft: "#1e2712",
};

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const Backdrop: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(1300px 760px at 88% -12%, rgba(150,200,70,0.17), transparent 70%), radial-gradient(1000px 760px at -12% 70%, rgba(90,130,40,0.11), transparent 70%), ${V2.bg}`,
      fontFamily: SANS,
      color: V2.ink,
    }}
  >
    {children}
    <AbsoluteFill style={{ backgroundImage: GRAIN, opacity: 0.06, pointerEvents: "none" }} />
  </AbsoluteFill>
);

const glass: React.CSSProperties = {
  background: "linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.02))",
  border: `1.5px solid ${V2.line}`,
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 40px 80px -30px rgba(0,0,0,0.7)",
  backdropFilter: "blur(14px)",
};

const Eyebrow: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontSize: 30, letterSpacing: "0.16em", textTransform: "uppercase", color: V2.lime, fontWeight: 500, ...style }}>{children}</div>
);
const Em: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = V2.lime }) => (
  <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, color, letterSpacing: "-0.01em" }}>{children}</span>
);
const Star: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = V2.lime }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ filter: `drop-shadow(0 0 ${size / 3}px ${color}88)` }}>
    <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0Z" fill={color} />
  </svg>
);
const Pill: React.FC<{ children: React.ReactNode; dot?: string; style?: React.CSSProperties }> = ({ children, dot, style }) => (
  <div style={{ ...glass, display: "inline-flex", alignItems: "center", gap: 18, borderRadius: 999, padding: "20px 34px", fontSize: 46, fontWeight: 500, ...style }}>
    {dot && <span style={{ width: 18, height: 18, borderRadius: 9, background: dot, boxShadow: `0 0 16px ${dot}` }} />}
    {children}
  </div>
);

// 1 · Cold open : le chiffre héros sur l'écran Bing mis au second plan
const S1 = () => (
  <Backdrop>
    <Img src={staticFile("identite-v2/bing.png")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: "blur(9px) brightness(0.32) saturate(0.6)", transform: "scale(1.06)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(900px 600px at 50% 48%, rgba(198,243,109,0.13), transparent 70%)" }} />
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 10 }}>
      <Eyebrow>Bing Webmaster Tools · 3 derniers mois</Eyebrow>
      <div style={{ fontSize: 300, fontWeight: 500, letterSpacing: "-0.045em", lineHeight: 1, color: V2.ink, textShadow: "0 0 80px rgba(198,243,109,0.25)" }}>51 900</div>
      <div style={{ fontSize: 64, fontWeight: 400, color: V2.inkSoft, letterSpacing: "-0.02em" }}>
        citations dans <Em>l'intelligence artificielle</Em>
      </div>
    </AbsoluteFill>
  </Backdrop>
);

// 2 · Le rapport : capture inclinée, mise au point, carte flottante
const S2 = () => (
  <Backdrop>
    <div style={{ position: "absolute", left: 120, top: 70, display: "flex", alignItems: "center", gap: 18 }}>
      <Star size={38} />
      <Eyebrow style={{ fontSize: 32 }}>Un rapport de visibilité IA</Eyebrow>
    </div>
    <div style={{ position: "absolute", left: 150, top: 170, perspective: 2200 }}>
      <Img
        src={staticFile("identite-v2/report.png")}
        style={{ width: 1500, display: "block", borderRadius: 28, border: `1.5px solid ${V2.line}`, transform: "rotateY(-9deg) rotateX(5deg)", transformOrigin: "left center", boxShadow: "0 60px 120px -30px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.04)" }}
      />
    </div>
    <div
      style={{
        position: "absolute", right: 110, bottom: 120, width: 420, borderRadius: 36, padding: "34px 40px",
        background: "linear-gradient(140deg, #ddfb95 0%, #c6f36d 45%, #a6d64c 100%)", color: "#0d1208", boxShadow: "0 40px 80px -30px rgba(198,243,109,0.55)",
      }}
    >
      <div style={{ fontSize: 150, fontWeight: 500, letterSpacing: "-0.05em", lineHeight: 1 }}>97 %</div>
      <div style={{ fontSize: 36, fontWeight: 500, marginTop: 8 }}>de citation pour Shine</div>
    </div>
  </Backdrop>
);

// 3 · Les 4 moteurs : face cam nette, pastilles de verre en orbite
const S3 = () => (
  <AbsoluteFill style={{ fontFamily: SANS, color: V2.ink }}>
    <Img src={staticFile("identite-v2/face.png")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.1) translateX(-7%)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(90deg, transparent 38%, rgba(9,11,8,0.86) 66%)" }} />
    <div style={{ position: "absolute", right: 120, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 26, alignItems: "flex-start" }}>
      <Eyebrow>4 moteurs de réponse IA</Eyebrow>
      <Pill dot="#10A37F">ChatGPT</Pill>
      <Pill dot="#D97757" style={{ marginLeft: 60 }}>Claude</Pill>
      <Pill dot="#20B8CD" style={{ marginLeft: 20 }}>Perplexity</Pill>
      <Pill dot="#4E86F7" style={{ marginLeft: 80 }}>Gemini</Pill>
    </div>
    <AbsoluteFill style={{ backgroundImage: GRAIN, opacity: 0.05 }} />
  </AbsoluteFill>
);

// 4 · Le chat : panneau de verre centré, réponse en cartes, sources en pastilles
const S4 = () => (
  <Backdrop>
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 90, gap: 34 }}>
      <Eyebrow>Ce que l'IA répond</Eyebrow>
      <div style={{ ...glass, width: 1260, borderRadius: 40, padding: "44px 52px", display: "flex", flexDirection: "column", gap: 30 }}>
        <div style={{ alignSelf: "flex-end", background: V2.lime, color: "#0d1208", borderRadius: 30, padding: "22px 34px", fontSize: 46, fontWeight: 500 }}>
          Quel logiciel de facturation choisir ?
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, color: V2.muted, fontSize: 34 }}>
          <Star size={30} /> Assistant IA
        </div>
        {["FactuPro", "Billio", "Comptea"].map((n, i) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 26, fontSize: 50, fontWeight: 500 }}>
            <span style={{ width: 64, height: 64, borderRadius: 20, background: V2.limeSoft, color: V2.lime, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>{i + 1}</span>
            {n}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
        <span style={{ fontSize: 36, color: V2.muted, marginRight: 8 }}>Ses sources :</span>
        <Pill style={{ fontSize: 40, padding: "16px 30px" }}>Sites web</Pill>
        <Pill style={{ fontSize: 40, padding: "16px 30px" }}>Avis</Pill>
        <Pill style={{ fontSize: 40, padding: "16px 30px" }}>Annuaires</Pill>
      </div>
    </AbsoluteFill>
  </Backdrop>
);

// 5 · Phrase-thèse : face cam floutée en fond, une idée, un mot en serif italique
const S5 = () => (
  <AbsoluteFill style={{ fontFamily: SANS, color: V2.ink, background: V2.bg }}>
    <Img src={staticFile("identite-v2/face.png")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "blur(16px) brightness(0.38) saturate(0.7)", transform: "scale(1.08)" }} />
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 160px" }}>
      <div style={{ fontSize: 132, fontWeight: 500, letterSpacing: "-0.035em", lineHeight: 1.05 }}>
        comment être <Em>recommandé</Em>
        <br />
        par les IA
      </div>
    </AbsoluteFill>
    <AbsoluteFill style={{ backgroundImage: GRAIN, opacity: 0.06 }} />
  </AbsoluteFill>
);

// 6 · La carte du tuto : 5 cartes de verre, numéros en lime
const S6 = () => (
  <Backdrop>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 70 }}>
      <div style={{ textAlign: "center" }}>
        <Eyebrow>Le plan</Eyebrow>
        <div style={{ fontSize: 110, fontWeight: 500, letterSpacing: "-0.04em", marginTop: 14 }}>
          5 étapes, <Em>dans l'ordre</Em>
        </div>
      </div>
      <div style={{ display: "flex", gap: 26 }}>
        {["Le business", "Les outils", "Le rapport de visibilité IA", "Le plan SEO", "Trouver des clients"].map((l, i) => (
          <div key={l} style={{ ...glass, width: 318, height: 300, borderRadius: 34, padding: "34px 30px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ fontSize: 40, color: V2.lime, fontWeight: 500 }}>0{i + 1}</div>
            <div style={{ fontSize: 44, fontWeight: 500, lineHeight: 1.1, letterSpacing: "-0.02em" }}>{l}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  </Backdrop>
);

// 7 · Carton d'étape (nouveau)
const S7 = () => (
  <Backdrop>
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 26 }}>
      <Star size={64} />
      <Eyebrow style={{ fontSize: 36 }}>Étape 1 sur 5</Eyebrow>
      <div style={{ fontSize: 210, fontWeight: 500, letterSpacing: "-0.05em", lineHeight: 1 }}>
        Ta <Em color={V2.ink}>preuve</Em>
      </div>
      <div style={{ width: 120, height: 4, borderRadius: 2, background: V2.lime, marginTop: 20, boxShadow: `0 0 20px ${V2.lime}` }} />
    </AbsoluteFill>
  </Backdrop>
);

const SCENES = [S1, S2, S3, S4, S5, S6, S7];
export const IdentiteV2Board: React.FC = () => {
  const S = SCENES[Math.min(useCurrentFrame(), SCENES.length - 1)];
  return <S />;
};
