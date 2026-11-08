"""Étape 3 — montage audio Higgs Influ 3 (PLAYBOOK §8).
1. Seuls les vrais silences (sans mot, énergie basse, ≥ 0,2 s) sont coupés et ramenés à 0,12 s.
2. Démo sponsor (source 329,2 → 560,0) : coupes douces pour ne pas hacher l'écran. Pause < 0,6 s gardée telle quelle,
   pause plus longue ramenée à 0,35 s. Upload de la référence (432,3 → 438,0) gardé en entier (R11).
3. Coupes validées (02-restructuration.md) en temps exacts : R5 165,45 → 167,40 · R7 482,68 → 486,30 · R10 585,05 → fin.
4. Insertions : R1 cold open 3 s (voix 493,55 → 495,40) · R4 respirations 1 s avant chaque carton · R9 showcase 8,5 s.
5. Voix : DeepFilterNet doux (12 dB) + passe-haut 70 Hz + compression 2:1 + −16 LUFS 2 passes (chaîne validée AIsa).
Lancer avec analysis/.venv-df/bin/python.  Sorties : voice_proc.wav (source traitée), voice_full.wav (montée), edl.json.
"""
import json
import os
import subprocess

import numpy as np
import soundfile as sf

D = os.path.dirname(os.path.abspath(__file__))
SRC = "/Users/ibrahimkamara/Downloads/Higgsfield Influencler Footage.mp4"
DEMO = (329.2, 560.0)
PROTECT = [(432.3, 438.0)]
CUTS = [(245.00, 246.10, "répétition « et les gens vont suivre »"), (165.45, 167.40, "R5 « chaque jour il y a des nouvelles parties »"), (482.68, 486.30, "R7 « j'ai fait une erreur… deux fois »"), (585.05, 9999, "R10 « Allez, peace out »")]
BREATHS = [(70.0, "Carton · Format 1"), (125.45, "Carton · Format 2"), (196.45, "Carton · Format 3"), (258.5, "Carton · Format mort"), (317.2, "Carton · La pratique")]
COLD = {"dur": 3.0, "voice": (493.55, 495.40), "at": 1.05, "label": "R1 cold open : référence ↔ chat"}
SHOWCASE = (559.93, 8.5, "R9 showcase : original + 4 rendus")


def run(*a):
    subprocess.run(a, check=True, capture_output=True)


# --- 1/2. segments gardés : on ne coupe que les VRAIS silences.
# derush2.py coupait des mots (voix enregistrée bas : consonnes faibles sous son seuil d'énergie → « posté 319 »,
# « partout », « tester »… perdus). Ici, une zone est coupée seulement si (1) son énergie est < plancher + 10 dB,
# (2) elle ne touche aucun mot aligné (marge 40 / 60 ms) ni le centre d'un mot de la transcription littérale (± 80 ms),
# (3) elle dure ≥ 0,2 s. Elle est ramenée à 0,12 s. Mesure : la prise est très serrée, gain ≈ 1,7 s seulement.
A = os.path.join(D, "../01-analyse")
W = json.load(open(f"{A}/micro_aligned.json"))["words"]
L = json.load(open(f"{A}/micro_literal.json"))["words"]
_pcm = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", f"{A}/micro.wav", "-f", "f32le", "-"], capture_output=True, check=True).stdout, np.float32)
H, _n = 0.005, 80
env = 20 * np.log10(np.sqrt((_pcm[: len(_pcm) // _n * _n].reshape(-1, _n) ** 2).mean(1)) + 1e-9)
prot = np.zeros(len(env), bool)
for w in W:
    if w["aligned"]:
        prot[int((w["start"] - 0.04) / H):int((w["end"] + 0.06) / H)] = True
for w in L:
    c = (w["start"] + w["end"]) / 2
    prot[int((c - 0.08) / H):int((c + 0.08) / H)] = True
quiet = (env < np.percentile(env, 10) + 10) & ~prot
SRC_DUR = len(_pcm) / 16000
keep, cur, i = [], 0.0, 0
while i < len(quiet):
    if quiet[i]:
        j = i
        while j < len(quiet) and quiet[j]:
            j += 1
        if (j - i) * H >= 0.2:
            keep.append((cur, i * H + 0.06))
            cur = j * H - 0.06
        i = j
    else:
        i += 1
keep.append((cur, SRC_DUR))
out_demo = [s for s in keep if s[1] <= DEMO[0] or s[0] >= DEMO[1]]
in_demo = sorted([s for s in keep if not (s[1] <= DEMO[0] or s[0] >= DEMO[1])] + PROTECT)
merged = []
for a, b in in_demo:
    if merged and a - merged[-1][1] < 0.6:
        merged[-1][1] = max(merged[-1][1], b)
    elif merged:
        g = a - merged[-1][1]  # pause longue : on garde 0,35 s (0,15 après, 0,20 avant)
        merged[-1][1] += 0.15
        merged.append([a - 0.20, b])
    else:
        merged.append([a, b])
segs = sorted(out_demo + [tuple(m) for m in merged])

# --- 3. coupes de contenu
for c0, c1, _ in CUTS:
    nxt = []
    for a, b in segs:
        if b <= c0 or a >= c1:
            nxt.append((a, b))
        else:
            if a < c0:
                nxt.append((a, c0))
            if b > c1:
                nxt.append((c1, b))
    segs = nxt

# --- 4. points d'insertion : on coupe les segments aux temps des respirations / du showcase
def split_at(segs, t):
    r = []
    for a, b in segs:
        r += [(a, t), (t, b)] if a < t < b else [(a, b)]
    return r


for t, _ in BREATHS:
    segs = split_at(segs, t)
segs = split_at(segs, SHOWCASE[0])

# --- 5. voix traitée (une fois, sur toute la source)
if not os.path.exists(f"{D}/voice_proc.wav"):
    run("ffmpeg", "-y", "-i", SRC, "-vn", "-ac", "1", "-ar", "48000", f"{D}/voice_raw.wav")
    from df.enhance import enhance, init_df, load_audio, save_audio

    model, state, _ = init_df()
    audio, _ = load_audio(f"{D}/voice_raw.wav", sr=state.sr())
    save_audio(f"{D}/voice_df.wav", enhance(model, state, audio, atten_lim_db=12), state.sr())
    chain = "highpass=f=70,acompressor=threshold=-22dB:ratio=2:attack=15:release=200"
    p = subprocess.run(["ffmpeg", "-hide_banner", "-i", f"{D}/voice_df.wav", "-af", f"{chain},loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
    j = json.loads(p[p.rindex("{"):p.rindex("}") + 1])
    mi = f"measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}"
    run("ffmpeg", "-y", "-i", f"{D}/voice_df.wav", "-af", f"{chain},loudnorm=I=-16:TP=-1.5:LRA=11:{mi}:linear=true,aresample=48000", f"{D}/voice_proc.wav")

v, SR = sf.read(f"{D}/voice_proc.wav")
K = int(0.008 * SR)


def clip(a, b):
    s = v[int(a * SR):int(b * SR)].copy()
    s[:K] *= np.linspace(0, 1, K)
    s[-K:] *= np.linspace(1, 0, K)
    return s


parts, edl, t = [], [], 0.0


def add_gap(dur, label, voice=None, at=0.0):
    global t
    g = np.zeros(int(dur * SR))
    if voice:
        s = clip(*voice)
        i = int(at * SR)
        g[i:i + len(s)] += s[: len(g) - i]
    parts.append(g)
    edl.append({"type": "insert", "out": round(t, 3), "dur": dur, "label": label, **({"voice_src": list(voice), "voice_at": at} if voice else {})})
    t += len(g) / SR


add_gap(COLD["dur"], COLD["label"], COLD["voice"], COLD["at"])
todo = sorted([(x, 1.0, l) for x, l in BREATHS] + [SHOWCASE])  # insérées avant le 1er segment qui commence après
for a, b in segs:
    while todo and a >= todo[0][0] - 1e-6:
        x, d, l = todo.pop(0)
        add_gap(d, l)
    s = clip(a, b)
    parts.append(s)
    edl.append({"type": "src", "out": round(t, 3), "src_in": round(a, 4), "src_out": round(b, 4)})
    t += len(s) / SR

sf.write(f"{D}/voice_full.wav", np.concatenate(parts), SR, subtype="PCM_24")
json.dump({"duration": round(t, 3), "speed_final": 1.10, "items": edl, "cuts": CUTS}, open(f"{D}/edl.json", "w"), indent=1, ensure_ascii=False)
print(f"durée montée {int(t // 60)}:{t % 60:04.1f} (×1,10 → {int(t / 1.1 // 60)}:{t / 1.1 % 60:04.1f}) · {sum(1 for e in edl if e['type'] == 'src')} segments · {sum(1 for e in edl if e['type'] == 'insert')} insertions")
