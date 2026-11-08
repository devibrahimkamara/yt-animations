"""Étape 3 — voix principale traitée (chaîne validée AIsa, PLAYBOOK §5) + points d'insertion des 2 voix seules.
DeepFilterNet doux (12 dB) → passe-haut 70 Hz → compression 2:1 → −16 LUFS en 2 passes. Jamais afftdn.
Lancer avec analysis/.venv-df/bin/python. Sortie : voice_proc.wav (même horloge que la source), inserts.json.
"""
import json, os, subprocess

D = os.path.dirname(os.path.abspath(__file__))
SRC = "/Volumes/SSD2/MINIMAX.mp4"


def run(*a):
    subprocess.run(a, check=True, capture_output=True)


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

# points d'insertion : entre la fin du mot qui précède et le début du suivant (horodatage Whisper)
words = [w for s in json.load(open(f"{D}/../01-analyse/audio.json"))["segments"] for w in s["words"]]


def gap_after(t_end_approx, last_word):
    i = min((k for k, w in enumerate(words) if last_word in w["word"]), key=lambda k: abs(words[k]["end"] - t_end_approx))
    return {"after": words[i]["word"].strip(), "end": words[i]["end"], "next_start": words[i + 1]["start"], "next": words[i + 1]["word"].strip()}


ins = {"V1_M3.1": gap_after(187.3, "-là."), "V2_avis": gap_after(568.4, "bien.")}
json.dump(ins, open(f"{D}/inserts.json", "w"), indent=1, ensure_ascii=False)
print(json.dumps(ins, indent=1, ensure_ascii=False))
