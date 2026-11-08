"""Étape 3 — montage audio Hostinger (PLAYBOOK §8).
Voix : DeepFilterNet doux (atten 12 dB) + passe-haut 70 Hz + compression 2:1 + −16 LUFS (chaîne validée sur AIsa).
Coupes validées (02-restructuration.md, actions 4 et 5) : 65,62 → 84,46 (« abonne-toi… » + mise en contexte générale).
Lancer avec analysis/.venv-df/bin/python.
"""
import json
import subprocess

import numpy as np
import soundfile as sf

D = "/Users/ibrahimkamara/yt-animations/montages/hostinger/03-audio"
SRC = "/Users/ibrahimkamara/Desktop/Hostinger Site Internet footage visage.mp4"
KEEP = [(0.0, 65.62), (84.46, 538.5)]  # segments gardés (source)


def run(*a):
    subprocess.run(a, check=True, capture_output=True)


# 1. Voix brute 48 kHz mono
run("ffmpeg", "-y", "-i", SRC, "-vn", "-ac", "1", "-ar", "48000", f"{D}/voice_raw.wav")

# 2. DeepFilterNet doux
from df.enhance import enhance, init_df, load_audio, save_audio  # noqa: E402

model, state, _ = init_df()
audio, _ = load_audio(f"{D}/voice_raw.wav", sr=state.sr())
save_audio(f"{D}/voice_df.wav", enhance(model, state, audio, atten_lim_db=12), state.sr())

# 3. Passe-haut + compression + −16 LUFS (2 passes)
chain = "highpass=f=70,acompressor=threshold=-22dB:ratio=2:attack=15:release=200"
p = subprocess.run(
    ["ffmpeg", "-hide_banner", "-i", f"{D}/voice_df.wav", "-af", f"{chain},loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"],
    capture_output=True, text=True,
).stderr
j = json.loads(p[p.rindex("{"):p.rindex("}") + 1])
mi = f"measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}"
run("ffmpeg", "-y", "-i", f"{D}/voice_df.wav", "-af", f"{chain},loudnorm=I=-16:TP=-1.5:LRA=11:{mi}:linear=true,aresample=48000", f"{D}/voice_proc.wav")

# 4. Montage selon l'EDL (fondus de 8 ms aux coupes)
v, SR = sf.read(f"{D}/voice_proc.wav")
parts, edl, t = [], [], 0.0
for a, b in KEEP:
    s = v[int(a * SR):int(b * SR)].copy()
    k = int(0.008 * SR)
    s[:k] *= np.linspace(0, 1, k)
    s[-k:] *= np.linspace(1, 0, k)
    parts.append(s)
    edl.append({"out": round(t, 3), "src_in": a, "src_out_or_dur": b, "label": ""})
    t += len(s) / SR
sf.write(f"{D}/audio_v1.wav", np.concatenate(parts), SR)
json.dump(edl, open(f"{D}/edl_v1.json", "w"), indent=1)
print(f"durée montée {int(t // 60)}:{t % 60:04.1f} · EDL {edl}")
