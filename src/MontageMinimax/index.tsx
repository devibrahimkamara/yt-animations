// Montage auto — vidéo MINIMAX (test 0:00–0:12).
// Habillage inspiré de l'analyse Dan Martell (analysis/martell-ai/RAPPORT.md) :
//  • faux multicam : 3 cadrages tirés d'un plan unique (large / serré / décalé)
//  • zooms progressifs (rapide dans le hook, lent ensuite)
//  • sous-titres cinétiques seulement sur les phrases-clés
//  • insert « preuve » (gameplay Stack Up filmé plus loin dans la vidéo)
// Le plan de montage est entièrement piloté par les tableaux SHOTS / CAPTIONS.
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { ACCENT, ACCENT_LIGHT, EASE, INK } from "../higgs2/theme";

const { fontFamily } = loadFont("normal", { weights: ["600", "800"], subsets: ["latin"] });

const W = 1920;
const H = 1080;
const FPS = 30;
const s = (sec: number) => Math.round(sec * FPS);

// Visage dans la source (fraction de l'image), mesuré sur la frame 3 s.
const FACE = { x: 0.49, y: 0.37 };

type Shot = {
  from: number; // secondes
  to: number;
  zoom: [number, number]; // échelle début → fin
  faceAt: [number, number]; // position voulue du visage à l'écran (fraction)
};

// Plan de montage caméra (faux multicam).
// Règles (retour v1) : coupes UNIQUEMENT dans les pauses de la voix (Whisper),
// zoom max ~1.16 (source 1080p à 5,7 Mbit/s → au-delà la compression se voit),
// vitesse de zoom ≤ ~0.1 %/frame, départ et arrivée en douceur (pas d'à-coup).
export const SHOTS: Shot[] = [
  { from: 0, to: 4.15, zoom: [1.0, 1.05], faceAt: [0.5, 0.37] }, // large (puis sous l'insert)
  { from: 4.15, to: 7.4, zoom: [1.13, 1.16], faceAt: [0.5, 0.4] }, // serré — coupe en sortie d'insert
  { from: 7.4, to: 12.9, zoom: [1.0, 1.06], faceAt: [0.5, 0.37] }, // large — coupe dans la pause 7.28→7.54
];

type Word = { w: string; t: number; hl?: boolean };
type Caption = { from: number; to: number; words: Word[]; underline?: boolean };

// Mots + timings Whisper (analysis/minimax/a20.json). hl = mot en accent.
export const CAPTIONS: Caption[] = [
  {
    from: 0.0,
    to: 1.75, // reste ~0.9 s après le dernier mot (l'insert le recouvre en douceur)
    words: [
      { w: "Ce", t: 0.0 },
      { w: "jeu", t: 0.28, hl: true },
      { w: "que", t: 0.52 },
      { w: "tu", t: 0.66 },
      { w: "vois", t: 0.82 },
    ],
  },
  {
    from: 4.15, // apparaît à la sortie de l'insert (les 1ers mots arrivent en cascade rapide)
    to: 6.4, // ~1.4 s de lecture après « code »
    words: [
      { w: "pas", t: 3.86 },
      { w: "écrit", t: 4.02 },
      { w: "une", t: 4.24, hl: true },
      { w: "seule", t: 4.5, hl: true },
      { w: "ligne", t: 4.84, hl: true },
      { w: "de", t: 4.92, hl: true },
      { w: "code", t: 4.96, hl: true },
    ],
  },
  {
    from: 9.75,
    to: 12.9, // ~1 s de lecture après « jeu »
    underline: true,
    words: [
      { w: "la", t: 9.92 },
      { w: "méthode", t: 10.36 },
      { w: "pour", t: 10.8 },
      { w: "créer", t: 11.04 },
      { w: "ton", t: 11.4, hl: true },
      { w: "propre", t: 11.6, hl: true },
      { w: "jeu", t: 11.88, hl: true },
    ],
  },
];

// Fenêtre de recadrage : scale autour du centre + translation pour placer le visage.
const cropTransform = (scale: number, faceAt: [number, number]) => {
  const half = 1 / (2 * scale);
  let cx = FACE.x - (faceAt[0] - 0.5) / scale;
  let cy = FACE.y - (faceAt[1] - 0.5) / scale;
  cx = Math.min(Math.max(cx, half), 1 - half);
  cy = Math.min(Math.max(cy, half), 1 - half);
  return `scale(${scale}) translate(${(0.5 - cx) * W}px, ${(0.5 - cy) * H}px)`;
};

const Camera: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const shot = SHOTS.find((sh) => t >= sh.from && t < sh.to) ?? SHOTS[SHOTS.length - 1];
  const p = interpolate(t, [shot.from, shot.to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const scale = shot.zoom[0] + (shot.zoom[1] - shot.zoom[0]) * p;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "black" }}>
      <OffthreadVideo
        src={staticFile("montage/minimax_0-14.mp4")}
        muted
        style={{
          width: W,
          height: H,
          transform: cropTransform(scale, shot.faceAt),
          filter: "contrast(1.06) saturate(1.1) brightness(1.04)",
        }}
      />
    </AbsoluteFill>
  );
};

const KineticCaption: React.FC<{ cap: Caption }> = ({ cap }) => {
  const frame = useCurrentFrame(); // relatif à cap.from
  const { fps } = useVideoConfig();
  const t = frame / fps + cap.from;
  const out = interpolate(t, [cap.to - 0.35, cap.to], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const hlWords = cap.words.filter((w) => w.hl);
  const ulStart = hlWords.length ? hlWords[hlWords.length - 1].t + 0.1 : 0;
  const ul = interpolate(t, [ulStart, ulStart + 0.35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 110,
        opacity: out,
        transform: `translateY(${(1 - out) * 24}px)`,
      }}
    >
      <div style={{ display: "flex", gap: 22, flexWrap: "wrap", justifyContent: "center", maxWidth: 1600 }}>
        {cap.words.map((wd, i) => {
          const local = Math.round(Math.max(wd.t - cap.from, i * 0.07) * fps);
          const pop = spring({ frame: frame - local, fps, config: { mass: 0.5, damping: 11, stiffness: 220 } });
          const on = frame >= local;
          return (
            <span
              key={i}
              style={{
                position: "relative",
                fontFamily,
                fontWeight: 800,
                fontSize: 84,
                letterSpacing: -1,
                color: wd.hl ? ACCENT_LIGHT : INK,
                opacity: on ? 1 : 0,
                transform: `translateY(${(1 - pop) * 28}px) scale(${0.7 + 0.3 * pop})`,
                textShadow: "0 4px 18px rgba(0,0,0,0.85), 0 0 2px rgba(0,0,0,0.9)",
                display: "inline-block",
              }}
            >
              {wd.w}
              {cap.underline && wd.hl && (
                <span
                  style={{
                    position: "absolute",
                    left: -4,
                    right: -14,
                    bottom: -6,
                    height: 10,
                    borderRadius: 6,
                    background: ACCENT,
                    boxShadow: `0 0 18px ${ACCENT}`,
                    transformOrigin: "left center",
                    transform: `scaleX(${ul})`,
                  }}
                />
              )}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Insert « preuve » : téléphone flottant avec le gameplay accéléré + « il y a 15 min ».
// v2 : 2,7 s d'écran (au lieu de 1,9), fond qui apparaît/disparaît en fondu,
// éléments qui sortent en douceur, et ~1,1 s de lecture sur « 15 min ».
const INSERT_FROM = 1.45; // juste après « à mon écran »
const INSERT_TO = 4.15;

const ProofInsert: React.FC = () => {
  const frame = useCurrentFrame(); // 0 = INSERT_FROM
  const { fps, durationInFrames } = useVideoConfig();
  const at = (sec: number) => Math.round((sec - INSERT_FROM) * fps);
  const soft = { mass: 0.8, damping: 18, stiffness: 120 };
  const bgIn = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp", easing: EASE });
  const bgOut = interpolate(frame, [durationInFrames - 9, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const leave = interpolate(frame, [durationInFrames - 12, durationInFrames - 2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const enter = spring({ frame, fps, config: soft });
  const drift = interpolate(frame, [0, durationInFrames], [0, 1]);
  const line1 = spring({ frame: frame - at(1.6), fps, config: soft });
  const line2 = spring({ frame: frame - at(2.38), fps, config: soft });
  const big = spring({ frame: frame - at(2.72), fps, config: { mass: 0.7, damping: 13, stiffness: 170 } });
  const content = {
    opacity: 1 - leave,
    transform: `translateY(${leave * 40}px) scale(${1 - 0.06 * leave})`,
  };
  return (
    <AbsoluteFill style={{ opacity: bgIn * bgOut }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 35% 50%, #1b2c7a 0%, #0a0f2a 45%, #04060f 100%)`,
        }}
      />
      <AbsoluteFill style={content}>
        {/* Téléphone */}
        <div
          style={{
            position: "absolute",
            left: 420,
            top: 90,
            width: 430,
            height: 900,
            borderRadius: 54,
            overflow: "hidden",
            border: "10px solid #11131c",
            boxShadow: `0 40px 120px rgba(0,0,0,0.7), 0 0 80px ${ACCENT}55`,
            opacity: enter,
            transform: `perspective(1600px) rotateY(${18 - 10 * drift}deg) rotateZ(${-3 + 2 * drift}deg) translateY(${(1 - enter) * 260}px) scale(${0.9 + 0.1 * enter})`,
          }}
        >
          <OffthreadVideo
            src={staticFile("montage/stackup_phone.mp4")}
            trimBefore={s(13.5)}
            playbackRate={3.5}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 60%" }}
          />
        </div>
        {/* Texte */}
        <div style={{ position: "absolute", left: 1010, top: 300, fontFamily, color: INK }}>
          <div
            style={{
              fontSize: 70,
              fontWeight: 600,
              opacity: line1,
              transform: `translateY(${(1 - line1) * 24}px)`,
              textShadow: "0 4px 18px rgba(0,0,0,0.8)",
            }}
          >
            n'existait pas
          </div>
          <div
            style={{
              fontSize: 70,
              fontWeight: 600,
              opacity: line2,
              transform: `translateY(${(1 - line2) * 24}px)`,
              marginTop: 6,
              textShadow: "0 4px 18px rgba(0,0,0,0.8)",
            }}
          >
            il y a…
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 190,
              fontWeight: 800,
              letterSpacing: -6,
              lineHeight: 1,
              color: ACCENT_LIGHT,
              opacity: Math.min(1, big * 1.5),
              transform: `scale(${0.6 + 0.4 * big})`,
              transformOrigin: "left center",
              textShadow: `0 0 50px ${ACCENT}, 0 6px 24px rgba(0,0,0,0.8)`,
            }}
          >
            15 min
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Son ───────────────────────────────────────────────────────────────────
// Voix : source à −26,6 LUFS → traitée (passe-haut 80 Hz, compression 3:1,
// loudnorm −16 LUFS) dans montage/minimax_0-14_voice.wav. Master final : −14 LUFS.
// SFX : kit validé à l'oreille par Ibrahim (public/sfx). `peak` = instant du pic
// dans le fichier (public/sfx/_analyse.json) → le pic tombe pile sur `at`.
// Gains calculés pour se placer sous la voix : pop −9 dB, clic −12, impact −4.
type Cue = { file: string; at: number; peak: number; gain: number };
export const SFX: Cue[] = [
  { file: "swoosh_vacuum__mk1465.mp3", at: 1.56, peak: 1.56, gain: 0.3 }, // montée → entrée du téléphone
  { file: "pop_dry_notif__mk2356.mp3", at: 1.62, peak: 0.05, gain: 0.47 }, // « n'existait pas »
  { file: "pop_light_explainer__mk3005.mp3", at: 2.4, peak: 0.04, gain: 0.22 }, // « il y a… »
  { file: "impact_heartbeat_deep__mk498.mp3", at: 2.74, peak: 0.08, gain: 0.31 }, // « 15 min »
  { file: "impact_whoosh_deep__mk1143.mp3", at: 4.12, peak: 0.55, gain: 0.15 }, // sortie de l'insert (adouci)
  { file: "pop_long__mk2358.mp3", at: 4.18, peak: 0.04, gain: 0.33 }, // sous-titre « pas écrit… »
  { file: "click_tech_select__mk3124.mp3", at: 4.98, peak: 0.01, gain: 0.38 }, // « code »
  { file: "pop_bubble__mk2357.mp3", at: 9.94, peak: 0.24, gain: 0.41 }, // sous-titre « la méthode… »
  { file: "click_box_check__mk1120.mp3", at: 11.98, peak: 0.12, gain: 0.61 }, // trait sous « ton propre jeu »
];

const MUSIC_GAIN = 0.1; // Serene View (−15,3 LUFS) → ≈ −35 LUFS, ~19 dB sous la voix

const SoundTrack: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  const end = durationInFrames / FPS;
  const music = (f: number) => {
    const t = f / FPS;
    const fade = interpolate(t, [0, 0.6, end - 0.8, end], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    // léger relief (+2 dB) pendant l'insert « preuve »
    const lift = interpolate(t, [INSERT_FROM - 0.3, INSERT_FROM, INSERT_TO - 0.2, INSERT_TO + 0.3], [1, 1.26, 1.26, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return MUSIC_GAIN * fade * lift;
  };
  return (
    <>
      <Audio src={staticFile("montage/minimax_0-14_voice.wav")} />
      <Audio src={staticFile("music/serene_view__mk443.mp3")} volume={music} />
      {SFX.map((c, i) => (
        <Sequence key={i} from={Math.max(0, s(c.at - c.peak))} layout="none">
          <Audio src={staticFile(`sfx/${c.file}`)} volume={c.gain} />
        </Sequence>
      ))}
    </>
  );
};

export const MontageMinimax: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Camera />
      <SoundTrack />
      {CAPTIONS.map((c, i) => (
        <Sequence key={i} from={s(c.from)} durationInFrames={s(c.to) - s(c.from)}>
          <KineticCaption cap={c} />
        </Sequence>
      ))}
      {/* L'insert passe au-dessus du 1er sous-titre, qui s'efface dessous en douceur */}
      <Sequence from={s(INSERT_FROM)} durationInFrames={s(INSERT_TO) - s(INSERT_FROM)}>
        <ProofInsert />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MONTAGE_MINIMAX_FRAMES = s(12.9);
