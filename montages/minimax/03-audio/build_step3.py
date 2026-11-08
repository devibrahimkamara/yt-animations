"""Étape 3 — insertion des 2 voix seules (demande de Raya) + aperçu 960×540.
Prise unique ~/Desktop/minimax voice 1.mp3 (= voice 2.mp3, fichiers identiques) : V1 0,00–13,80 ; V2 23,20–37,25,
hésitation « le … plus » ramenée de 1,3 s à 0,2 s (coupe 25,35 → 26,45). Le faux départ (16,3–22,7) est écarté.
Même chaîne que la voix principale. Lancer avec analysis/.venv-df/bin/python.
"""
import json, os, subprocess
import numpy as np, soundfile as sf

D = os.path.dirname(os.path.abspath(__file__))
SRC = "/Volumes/SSD2/MINIMAX.mp4"
TAKE = "/Users/ibrahimkamara/Desktop/minimax voice 1.mp3"
SR = 48000
run = lambda *a: subprocess.run(a, check=True, capture_output=True)
CHAIN = "highpass=f=70,acompressor=threshold=-22dB:ratio=2:attack=15:release=200"

# 1. prise débruitée (DeepFilterNet doux), puis extraits
if not os.path.exists(f"{D}/vo_df.wav"):
    from df.enhance import enhance, init_df, load_audio, save_audio
    run("ffmpeg", "-y", "-i", TAKE, "-ac", "1", "-ar", "48000", f"{D}/vo_raw.wav")
    model, state, _ = init_df()
    a, _ = load_audio(f"{D}/vo_raw.wav", sr=state.sr())
    save_audio(f"{D}/vo_df.wav", enhance(model, state, a, atten_lim_db=12), state.sr())
take, _ = sf.read(f"{D}/vo_df.wav")
cut = lambda a, b: take[int(a * SR):int(b * SR)]
clips = {"V1": cut(0.0, 13.80), "V2": np.concatenate([cut(23.20, 25.35), cut(26.45, 37.25)])}


def fade(x, ms=10):
    f = int(ms / 1000 * SR); x = x.copy(); x[:f] *= np.linspace(0, 1, f); x[-f:] *= np.linspace(1, 0, f); return x


# 2. même traitement que la voix principale, −16 LUFS en 2 passes
for k, x in clips.items():
    sf.write(f"{D}/{k}_df.wav", fade(x), SR)
    p = subprocess.run(["ffmpeg", "-hide_banner", "-i", f"{D}/{k}_df.wav", "-af", f"{CHAIN},loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
    j = json.loads(p[p.rindex("{"):p.rindex("}") + 1])
    mi = f"measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}"
    run("ffmpeg", "-y", "-i", f"{D}/{k}_df.wav", "-af", f"{CHAIN},loudnorm=I=-16:TP=-1.5:LRA=11:{mi}:linear=true,aresample=48000", f"{D}/{k}_proc.wav")
    clips[k] = sf.read(f"{D}/{k}_proc.wav")[0]

# 3. ambiance de pièce (0,5 s la plus calme de la voix principale) pour les respirations autour des insertions
v, _ = sf.read(f"{D}/voice_proc.wav")
win, hop = SR // 2, SR // 10
rms = np.array([np.sqrt(np.mean(v[i:i + win] ** 2)) for i in range(0, len(v) - win, hop)]); rms[rms < 1e-6] = 1
tone = v[int(np.argmin(rms)) * hop:][:win]
room = lambda s: fade(np.tile(tone, int(np.ceil(s * SR / len(tone))) + 1)[:int(s * SR)], 30)

# 4. montage : source + insertions (respiration 0,25 s avant, 0,30 s après)
ins = json.load(open(f"{D}/inserts.json"))
pts = [(ins["V1_M3.1"]["cut_at"], "V1"), (ins["V2_avis"]["cut_at"], "V2")]
parts, edl, cur, out = [], [], 0.0, 0.0
for t, k in pts:
    seg = fade(v[int(cur * SR):int(t * SR)], 5); parts.append(seg); edl.append({"type": "src", "out": round(out, 3), "src_in": cur, "src_out": t}); out += len(seg) / SR
    x = np.concatenate([room(0.25), clips[k], room(0.30)]); parts.append(x)
    edl.append({"type": "vo", "out": round(out, 3), "dur": round(len(x) / SR, 3), "label": k}); out += len(x) / SR
    cur = t
seg = fade(v[int(cur * SR):], 5); parts.append(seg); edl.append({"type": "src", "out": round(out, 3), "src_in": cur, "src_out": len(v) / SR}); out += len(seg) / SR
sf.write(f"{D}/voice_full.wav", np.concatenate(parts), SR)
json.dump({"duration": round(out, 3), "items": edl}, open(f"{D}/edl.json", "w"), indent=1)

# 5. aperçu 960×540 : image source ; pendant V1 image figée sur le menu modèle, pendant V2 le gameplay téléphone (8:29)
T = f"{D}/_prev"; os.makedirs(T, exist_ok=True)
ENC = ["-c:v", "libx264", "-preset", "veryfast", "-crf", "27", "-pix_fmt", "yuv420p", "-r", "30", "-an"]
FONT = "/System/Library/Fonts/Helvetica.ttc"
lab = lambda s: f",drawtext=fontfile={FONT}:text='{s}':x=(w-tw)/2:y=h-60:fontsize=28:fontcolor=0xc6f36d:box=1:boxcolor=black@0.7:boxborderw=10"
pieces = []
for i, it in enumerate(edl):
    o = f"{T}/p{i}.mp4"
    if it["type"] == "src":
        run("ffmpeg", "-y", "-ss", str(it["src_in"]), "-to", str(it["src_out"]), "-i", SRC, "-vf", "scale=960:540", *ENC, o)
    elif it["label"] == "V1":
        run("ffmpeg", "-y", "-ss", "190", "-i", SRC, "-vf", "scale=960:540,loop=-1:1:0" + lab("VOIX SEULE 1 · présentation de M3.1"), "-t", str(it["dur"]), *ENC, o)
    else:
        run("ffmpeg", "-y", "-ss", "509", "-i", SRC, "-vf", "scale=960:540" + lab("VOIX SEULE 2 · ton avis sur M3.1"), "-t", str(it["dur"]), *ENC, o)
    pieces.append(o)
open(f"{T}/list.txt", "w").write("".join(f"file '{p}'\n" for p in pieces))
run("ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", f"{T}/list.txt", "-i", f"{D}/voice_full.wav", "-map", "0:v", "-map", "1:a",
    "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", f"{D}/minimax_etape3_audio.mp4")
print(json.dumps(edl, indent=1))
