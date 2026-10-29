// Planches de démonstration des composants v2 (Defi.tsx). DONNÉES FICTIVES, uniquement pour valider le style :
// ne jamais réutiliser ces chiffres dans une vidéo (règle 15 : un montant = une capture réelle).
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Backdrop, FONT, Grain, INK, LIME, MUTED, f } from "./lib";
import {
  BigWordCaptions,
  DayPill,
  DefiBoard,
  hms,
  LowerThird,
  PlanVsResult,
  Registre,
  SafeText,
  Timer,
  VerdictTag,
  VerticalCounter,
  VerticalMaster,
} from "./Defi";

const DEMO: Registre = {
  titre: "Démo · 100 € et 7 jours à l'IA",
  budget: 100,
  objectif: 500,
  jours: 7,
  regles: ["L'IA *décide*, moi j'exécute", "Budget : 100 €", "3 h par jour", "Sans mes comptes"],
  entries: [
    { t: 3.0, label: "Nom de domaine", amount: -12, kind: "depense", jour: 1, capture: "demo.png" },
    { t: 5.0, label: "Première vente", amount: 29, kind: "gain", jour: 2, capture: "demo.png" },
    { t: 7.0, label: "Publicité test", amount: -20, kind: "depense", jour: 3, capture: "demo.png" },
    { t: 9.0, label: "Deux ventes", amount: 58, kind: "gain", jour: 5, capture: "demo.png" },
  ],
};

const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 44, bottom: 30, fontFamily: FONT, fontSize: 24, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" }}>{children}</div>
);
const Fake: React.FC<{ label: string; tone: string }> = ({ label, tone }) => (
  <AbsoluteFill style={{ background: tone, justifyContent: "center", alignItems: "center", fontFamily: FONT, fontSize: 40, color: INK }}>{label}</AbsoluteFill>
);

/** 16:9, 24 s : Tableau du défi → pastille + chrono → prévu / obtenu → verdict → bandeau d'interview. */
export const DefiDemoWide: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    <Sequence durationInFrames={f(11)}>
      <DefiBoard registre={DEMO} end={11} show="net" freezeAt={10} />
    </Sequence>
    <Sequence from={f(11)} durationInFrames={f(13)}>
      <DayPill registre={{ ...DEMO, entries: DEMO.entries.map((e) => ({ ...e, t: e.t - 3 })) }} end={13} />
      <Timer
        anchors={[
          { t: 0, clock: hms("14:00:00") },
          { t: 4, clock: hms("15:10:00"), rate: 120 },
        ]}
        startClock={hms("14:00:00")}
        limit={3 * 3600}
        mode="restant"
        end={13}
        label="Défi 3 h"
      />
    </Sequence>
    <Sequence from={f(12)} durationInFrames={f(6)}>
      <PlanVsResult
        plan={<Fake label="Image clé prévue" tone="#1c2416" />}
        result={<Fake label="Clip généré" tone="#24301b" />}
        end={6}
        checks={[
          { at: 1.6, label: "Le personnage", ok: true },
          { at: 2.2, label: "Le mouvement de caméra", ok: true },
          { at: 2.8, label: "Une seule prise", ok: false },
        ]}
      />
    </Sequence>
    <Sequence from={f(18)} durationInFrames={f(3)}>
      <VerdictTag label="Ça marche" ok at={0.2} end={3} />
    </Sequence>
    <Sequence from={f(21)} durationInFrames={f(3)}>
      <VerdictTag label="Arnaque" ok={false} at={0.2} end={3} />
    </Sequence>
    <Sequence from={f(18)} durationInFrames={f(6)}>
      <LowerThird prenom="Prénom" metier="Vendeur de rue" ville="Bali" end={6} montant={{ value: 312, at: 1.5, label: "par mois" }} />
    </Sequence>
    <Tag>Démo · données fictives</Tag>
    <Grain />
  </AbsoluteFill>
);

/** 9:16, 16 s : compteur sans voix (C9) puis mots géants (C6) et verdict, avec les repères de zone sûre. */
export const DefiDemoVertical: React.FC<{ guides?: boolean }> = ({ guides = true }) => (
  <VerticalMaster guides={guides} background={<Backdrop />}>
    <Sequence durationInFrames={f(11)}>
      <VerticalCounter registre={DEMO} end={11} show="reste" accroche="J'ai donné *100 €* à l'IA. Il en reste combien ?" freezeAt={10} />
    </Sequence>
    <Sequence from={f(11)} durationInFrames={f(5)}>
      <BigWordCaptions
        y={960}
        words={[
          { w: "Livreur", t: 0.2 },
          { w: "Paris", t: 0.7, hl: true },
          { w: "combien", t: 1.3 },
          { w: "par", t: 1.7 },
          { w: "mois ?", t: 2.0, hl: true },
        ]}
      />
      <Sequence from={f(3)}>
        <SafeText at={0.7} center>
          <span style={{ fontSize: 40, color: LIME }}>démo · données fictives</span>
        </SafeText>
      </Sequence>
    </Sequence>
    <Grain />
  </VerticalMaster>
);
