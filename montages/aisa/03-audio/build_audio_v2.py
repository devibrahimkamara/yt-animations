"""Piste voix montée v2 (retouches points 1 et 2, validés par Ibrahim) :
- voix = DeepFilterNet doux (atten 12 dB) + passe-haut 70 Hz + compression 2:1 + −16 LUFS (voice_proc_v2.wav)
- cold open = phrase entière 133.68 → 138.47, puis 2,0 s de silence de suspense (noir + « … » à l'image)
- insertions de l'étape 3 inchangées (cartons, respiration, showcase) ; fin coupée avant « à la prochaine »
"""
import json
import numpy as np, soundfile as sf

D = "/Users/ibrahimkamara/yt-animations/montages/aisa/03-audio"
v, SR = sf.read(f"{D}/voice_proc_v2.wav")
old = json.load(open(f"{D}/edl_step3.json"))

# Ambiance de pièce (même méthode qu'à l'étape 3) pour les insertions
win = SR // 2
rms = np.array([np.sqrt(np.mean(v[i:i + win] ** 2)) for i in range(0, len(v) - win, SR // 10)])
rms[rms < 1e-6] = 1
i0 = int(np.argmin(rms)) * (SR // 10); tone = v[i0:i0 + win]
def roomtone(sec):
    n = int(sec * SR); t = np.tile(tone, n // len(tone) + 2)[:n]
    k = min(len(t) // 4, int(0.05 * SR)); t[:k] *= np.linspace(0, 1, k); t[-k:] *= np.linspace(1, 0, k)
    return t

def seg(a, b, fin=0.008, fout=0.008):
    s = v[int(a * SR):int(b * SR)].copy()
    i, o = int(fin * SR), int(fout * SR)
    s[:i] *= np.linspace(0, 1, i); s[-o:] *= np.linspace(1, 0, o) ** 2
    return s

parts, log, t = [], [], 0.0
def add(x, src_in, src_out, label):
    global t
    parts.append(x); log.append({"out": round(t, 3), "src_in": src_in, "src_out_or_dur": src_out, "label": label}); t += len(x) / SR

add(seg(133.68, 138.47, 0.012, 0.14), 133.68, 138.47, "COLD OPEN · 51 000 citations (phrase entière)")
add(np.zeros(int(2.0 * SR)), None, 2.0, "SUSPENSE · fondu au noir + « … »")
for e in old[2:]:  # on saute l'ancien cold open et l'ancienne respiration
    if e["src_in"] is None:
        add(roomtone(e["src_out_or_dur"]), None, e["src_out_or_dur"], e["label"])
    else:
        add(seg(e["src_in"], e["src_out_or_dur"]), e["src_in"], e["src_out_or_dur"], e["label"])

audio = np.concatenate(parts)
sf.write(f"{D}/audio_v2.wav", audio, SR)
json.dump(log, open(f"{D}/edl_v2.json", "w"), indent=1, ensure_ascii=False)
sf.write("/Users/ibrahimkamara/yt-animations/public/montage/aisa/audio_h2.wav", audio[: int(66 * SR)], SR)
print(f"durée {int(t // 60)}:{t % 60:04.1f} · décalage vs étape 3 : +{log[2]['out'] - 4.76:.2f} s")
