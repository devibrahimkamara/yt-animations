// Miniature (étape 8bis), d'après la maquette du script : la preuve à gauche (vraie courbe Threads, 19,7 M),
// Ibrahim au centre (image réelle des rushes, 18:33), plan contre résultat à droite (keyframe K1 → la pub Kling).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FONT, LIME } from "../montage/lib";
import { D } from "./Illus";

const T = `${D}/thumb`;
const shot = (src: string, label: string, accent: boolean) => (
  <div style={{ position: "relative" }}>
    <div style={{ padding: 6, borderRadius: 22, background: accent ? LIME : "rgba(255,255,255,0.9)", boxShadow: "0 24px 50px -12px rgba(0,0,0,0.8)" }}>
      <Img src={staticFile(src)} style={{ width: 330, height: 220, objectFit: "cover", borderRadius: 16, display: "block" }} />
    </div>
    <div style={{ position: "absolute", left: 16, top: 16, padding: "6px 14px", borderRadius: 999, background: accent ? LIME : "#fff", color: "#0d1208", fontSize: 26, fontWeight: 600, letterSpacing: "0.04em" }}>{label}</div>
  </div>
);

export const Kling4Thumb: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT, background: "#1a120b", overflow: "hidden" }}>
    <Img src={staticFile(`${D}/K3_boutique_pleine.png`)} style={{ position: "absolute", inset: -40, width: 1360, height: 800, objectFit: "cover", filter: "blur(18px) brightness(0.45) saturate(1.1)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%)" }} />
    {/* Gauche : la preuve */}
    <div style={{ position: "absolute", left: 36, top: 70, width: 470 }}>
      <div style={{ fontSize: 168, fontWeight: 600, color: LIME, letterSpacing: "-0.06em", lineHeight: 0.9, textShadow: "0 8px 30px rgba(0,0,0,0.7)" }}>19,7 M</div>
      <div style={{ fontSize: 50, fontWeight: 600, color: "#fff", marginTop: 8, letterSpacing: "-0.02em", textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}>de vues en 30 jours</div>
      <div style={{ marginTop: 30, width: 412, padding: 6, borderRadius: 20, background: "#fff", boxShadow: "0 24px 50px -12px rgba(0,0,0,0.8)", transform: "rotate(-3deg)" }}>
        <Img src={staticFile(`${T}/threads_curve.png`)} style={{ width: 400, height: 136, display: "block", borderRadius: 14 }} />
      </div>
    </div>
    {/* Centre : Ibrahim */}
    <Img src={staticFile(`${T}/ibrahim_cut.png`)} style={{ position: "absolute", left: 640 - 426, top: 40, width: 851, height: 1035, filter: "brightness(1.12) contrast(1.06) saturate(1.05) drop-shadow(0 20px 40px rgba(0,0,0,0.6))" }} />
    {/* Droite : plan contre résultat */}
    <div style={{ position: "absolute", right: 40, top: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      {shot(`${D}/K1_boutique_vide.png`, "MON PLAN", false)}
      <div style={{ fontSize: 64, color: LIME, lineHeight: 1, fontWeight: 600, textShadow: "0 4px 16px rgba(0,0,0,0.8)" }}>↓</div>
      {shot(`${T}/pub_vide.png`, "L'IA", true)}
    </div>
  </AbsoluteFill>
);
