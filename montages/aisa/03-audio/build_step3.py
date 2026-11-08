"""Étape 3 — montage audio + aperçu basse définition (PLAYBOOK §8).
Applique les actions validées de 02-restructuration.md qui touchent la timeline :
cold open (2:13.7→2:18.2), cartons d'étape (2 s), respirations avant révélation (2 s),
coupe de la formule de fin. Voix traitée (passe-haut, débruitage léger, compression, −16 LUFS),
ambiance de pièce sous les insertions. Image = aperçu 640x360 (écran + médaillon, face cam
plein cadre là où la capture montre le script).
"""
import json, subprocess, os
import numpy as np, soundfile as sf

D = os.path.dirname(os.path.abspath(__file__))
FACE = "/Users/ibrahimkamara/Desktop/aisa footage visage.mp4"
SCREEN = "/Users/ibrahimkamara/Desktop/aisa capture ecran.mp4"
SR = 48000
run = lambda c: subprocess.run(c, check=True)

# 1) Voix traitée sur toute la prise (passe 1 loudnorm pour mesurer, passe 2 linéaire)
raw = f"{D}/voice_raw.wav"
run(["ffmpeg", "-v", "error", "-y", "-i", FACE, "-vn", "-ac", "1", "-ar", str(SR), raw])
chain = "highpass=f=80,afftdn=nr=8:nf=-50,acompressor=threshold=-24dB:ratio=3:attack=10:release=150:makeup=2"
m = subprocess.run(["ffmpeg", "-hide_banner", "-i", raw, "-af", chain + ",loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json",
                    "-f", "null", "-"], capture_output=True, text=True).stderr
j = json.loads(m[m.rindex("{"):m.rindex("}") + 1])
ln = (f"loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:"
      f"measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true")
proc = f"{D}/voice_proc.wav"
run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af", f"{chain},{ln}", "-ar", str(SR), proc])
v, _ = sf.read(proc)

# 2) Ambiance de pièce : 0,5 s la plus calme (hors silence numérique)
win = SR // 2
rms = np.array([np.sqrt(np.mean(v[i:i + win] ** 2)) for i in range(0, len(v) - win, SR // 10)])
rms[rms < 1e-6] = 1
i0 = int(np.argmin(rms)) * (SR // 10)
tone = v[i0:i0 + win]

def roomtone(sec):
    n = int(sec * SR); reps = int(np.ceil(n / len(tone))) + 1
    t = np.tile(tone, reps)[:n]
    f = min(len(t) // 4, int(0.05 * SR)); env = np.ones(len(t))
    env[:f] = np.linspace(0, 1, f); env[-f:] = np.linspace(1, 0, f)
    return t * env

def snap(t, span=0.15):
    """Recale un point de coupe sur le creux d'énergie le plus proche (±span s)."""
    a, b = int((t - span) * SR), int((t + span) * SR); hop = int(0.01 * SR)
    e = [np.sqrt(np.mean(v[k:k + hop] ** 2)) for k in range(a, b, hop)]
    return round((a + int(np.argmin(e)) * hop) / SR, 3)

# 3) Liste de montage (temps source en s). ("gap", durée, libellé) = insertion.
END = snap(1282.12)
INS = [  # (temps source avant lequel on insère, durée, libellé)
    (snap(305.34), 2.0, "CARTON · Étape 2/5 · Préparer les outils"),
    (snap(535.74), 2.0, "CARTON · Étape 3/5 · Le rapport de visibilité IA"),
    (snap(660.12), 2.0, "RESPIRATION · le rapport arrive"),
    (snap(800.98), 2.0, "CARTON · Étape 4/5 · Le plan d'action SEO"),
    (snap(1060.52), 2.0, "CARTON · Étape 5/5 · Trouver des clients"),
    (snap(1155.94), 2.0, "SHOWCASE · 10 prospects trouvés"),
]
edl = [("src", snap(133.72), snap(138.2), "COLD OPEN · 51 000 citations"), ("gap", 0.35, "respiration")]
cur = 0.0
for t, dur, lab in INS:
    edl.append(("src", cur, t, None)); edl.append(("gap", dur, lab)); cur = t
edl.append(("src", cur, END, None))

# 4) Audio final de l'étape 3
parts, out_t, log = [], 0.0, []
for e in edl:
    if e[0] == "src":
        seg = v[int(e[1] * SR):int(e[2] * SR)].copy()
        f = int(0.008 * SR); seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
        parts.append(seg); log.append((out_t, e[1], e[2], e[3])); out_t += len(seg) / SR
    else:
        parts.append(roomtone(e[1])); log.append((out_t, None, e[1], e[2])); out_t += e[1]
audio = np.concatenate(parts)
sf.write(f"{D}/audio_step3.wav", audio, SR)
json.dump([{"out": round(a, 3), "src_in": b, "src_out_or_dur": c, "label": d} for a, b, c, d in log],
          open(f"{D}/edl_step3.json", "w"), indent=1, ensure_ascii=False)

# 5) Aperçu image 640x360 : écran + médaillon ; face plein cadre là où l'écran montre le script
FACE_FULL = [(0, 97.0), (584.0, 591.0), (1271.5, 1290)]
en = "+".join(f"between(t,{a},{b})" for a, b in FACE_FULL)
comp = f"{D}/composite_lowres.mp4"
if not os.path.exists(comp):
    run(["ffmpeg", "-v", "error", "-y", "-i", SCREEN, "-i", FACE, "-filter_complex",
         f"[0:v]scale=640:360[s];[1:v]scale=640:360[ff];[1:v]scale=150:-2[p];"
         f"[s][p]overlay=W-w-10:H-h-10[sp];[sp][ff]overlay=0:0:enable='{en}'[v]",
         "-map", "[v]", "-an", "-r", "30", "-c:v", "libx264", "-preset", "veryfast", "-crf", "26", comp])
segs, k = [], 0
for e in edl:
    o = f"{D}/_seg{k:02d}.mp4"; k += 1
    if e[0] == "src":
        run(["ffmpeg", "-v", "error", "-y", "-ss", str(e[1]), "-to", str(e[2]), "-i", comp, "-an",
             "-c:v", "libx264", "-preset", "veryfast", "-crf", "26", "-r", "30", o])
    else:
        txt = e[2].replace(":", "\\:").replace("'", "’")
        run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"color=c=0x0a0f2a:s=640x360:r=30:d={e[1]}",
             "-vf", f"drawtext=fontfile='/System/Library/Fonts/Supplemental/Arial Bold.ttf':text='{txt}':"
                    f"fontcolor=white:fontsize=22:x=(w-tw)/2:y=(h-th)/2",
             "-c:v", "libx264", "-preset", "veryfast", "-crf", "26", o])
    segs.append(o)
open(f"{D}/_list.txt", "w").write("".join(f"file '{s}'\n" for s in segs))
run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", f"{D}/_list.txt", "-i", f"{D}/audio_step3.wav",
     "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", f"{D}/aisa_etape3_audio.mp4"])
for s in segs: os.remove(s)
print(f"durée {out_t/60:.0f}:{out_t%60:04.1f} · voix mesurée avant {j['input_i']} LUFS · ambiance prise à {i0/SR:.1f}s")
