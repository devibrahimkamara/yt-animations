"""Correction des seuls mots fautifs dans une voix convertie (speech-to-speech) : le reste ne bouge pas.

Pour chaque mot fautif : une voix française neutre lit la phrase juste (ElevenLabs, horodatée), on découpe le mot corrigé,
on le convertit dans la même voix que le reste (speech-to-speech), on l'ajuste à la place exacte du mot fautif,
et on le colle avec un fondu court de chaque côté.

Usage : python3 patch_words.py s2 esaie
"""
import hashlib, json, math, struct, subprocess, sys, tempfile, urllib.request, uuid, wave
from pathlib import Path

sys.path.insert(0, str(Path.home() / "faceless-studio/pipeline"))
from build import env, tts_with_timestamps, words_from_alignment  # noqa: E402

HERE = Path(__file__).resolve().parent
STS = HERE / "sts"
SHORTS = Path.home() / "yt-animations/public/montage/higgs-genjutsu/shorts"
OUT = HERE.parent / "07-a-ecouter/corrige"
VOICES = {"esaie": "HbDa7eEZNGkUODgNzru6", "jerome": "YwEKgPNrswweXodAZi29", "loic": "ojsdYNTmnPdf7yAl8rI5"}
READER = {"id": "IbbR6Av0dWuQJS0b8JVT", "model": "eleven_multilingual_v2",
          "settings": {"stability": 0.5, "similarity_boost": 0.8, "style": 0.1, "use_speaker_boost": True}}  # lecteur français neutre

# (début, fin) dans la vidéo = du début du mot fautif au début du mot suivant ; phrase juste ; mots à garder dans cette phrase
PATCHES = {
    "s2": [
        (1.20, 1.72, "Tu perds deux heures chaque matin sans t'en rendre compte.", "chaque matin"),
        (9.88, 10.28, "parce que juste deux minutes sur une appli, ça finit souvent en une demi-heure.", "une appli,"),
        (15.16, 15.74, "Deux, tu choisis ta tâche la plus importante la veille, comme ça au réveil tu attaques direct.", "la veille,"),
        (16.36, 16.82, "Deux, tu choisis ta tâche la plus importante la veille, comme ça au réveil tu attaques direct.", "au réveil"),
        (19.98, 20.62, "Trois, tes mails et tes messages, c'est à heure fixe, pas au réveil, sinon tu gères les urgences des autres.", "tes messages,"),
        (21.70, 22.76, "Trois, tes mails et tes messages, c'est à heure fixe, pas au réveil, sinon tu gères les urgences des autres.", "pas au réveil,"),
        (23.44, 23.84, "Trois, tes mails et tes messages, c'est à heure fixe, pas au réveil, sinon tu gères les urgences des autres.", "gères"),
        (26.04, 26.98, "Franchement, mises bout à bout, ça peut te rendre deux heures par jour.", "mises bout à bout,"),
    ],
}

S_APP = "parce que juste deux minutes sur une appli, ça finit souvent en une demi-heure."
S_DEUX = "Deux, tu choisis ta tâche la plus importante la veille, comme ça au réveil tu attaques direct."
S_TROIS = "Trois, tes mails et tes messages, c'est à heure fixe, pas au réveil, sinon tu gères les urgences des autres."
S_FRANC = "Franchement, mises bout à bout, ça peut te rendre deux heures par jour."
# les accroches 1 à 3 partagent le même corps, aux mêmes temps (à quelques centièmes près)
BODY_PATCHES = [
    (8.88, 9.26, S_APP, "une appli,"),
    (14.16, 14.71, S_DEUX, "la veille,"),
    (15.35, 15.80, S_DEUX, "au réveil"),
    (18.96, 19.60, S_TROIS, "tes messages,"),
    (20.68, 21.74, S_TROIS, "pas au réveil,"),
    (22.44, 22.82, S_TROIS, "gères"),
    (25.02, 25.98, S_FRANC, "mises bout à bout,"),
]
PATCHES["s1"] = [
    (15.44, 17.08, "Et je vis entre l'Afrique, l'Europe et l'Indonésie.", "l'Indonésie."),
    (18.28, 19.20, "Ton rythme, ce n'est pas celui des autres.", "celui des autres."),
]
PATCHES["h1"] = BODY_PATCHES
PATCHES["h2"] = [(2.24, 3.28, "Tu ne manques pas de temps, tu gaspilles deux heures chaque matin.", "chaque matin.")] + [
    (15.35, 17.10, S_DEUX, "au réveil tu attaques direct.") if p[3] == "au réveil" else p for p in BODY_PATCHES]  # « t'attaques » rogné sinon
PATCHES["h3"] = [(1.10, 1.48, "Et si tes matins te volaient deux heures par jour ?", "volaient")] + BODY_PATCHES
PATCHES["fix"] = [
    (1.14, 1.60, "Tu perds deux heures chaque matin sans t'en rendre compte.", "chaque matin"),
    (11.08, 11.52, S_APP, "une appli,"),
    (17.36, 17.98, S_DEUX, "la veille,"),
    (19.06, 19.56, S_DEUX, "au réveil"),
    (25.02, 25.98, S_TROIS, "pas au réveil,"),
    (26.98, 27.28, S_TROIS, "gères"),
]


def load_wav(p):
    w = wave.open(str(p))
    sr, d = w.getframerate(), w.readframes(w.getnframes())
    return sr, struct.unpack("<%dh" % (len(d) // 2), d)


def frame_energy(a, sr, t):
    """Énergie sur 10 ms autour de t."""
    i0, i1 = int(t * sr), int((t + 0.01) * sr)
    seg = a[i0:i1] or (0,)
    return sum(x * x for x in seg) / len(seg)


def valley(a, sr, t, before=0.12, after=0.06):
    """Le creux d'énergie le plus proche de t : la vraie frontière entre deux mots (Whisper se trompe de ±0,1 s)."""
    cands = [t + k * 0.01 for k in range(int(-before * 100), int(after * 100) + 1)]
    return min(cands, key=lambda x: frame_energy(a, sr, x))


def rms(a, sr, t0, t1):
    seg = a[int(t0 * sr):int(t1 * sr)] or (1,)
    return math.sqrt(sum(x * x for x in seg) / len(seg)) + 1e-9


def run(cmd):
    subprocess.run(cmd, check=True)


def sts(voice_id, wav, out):
    k = env("ELEVENLABS_API_KEY")
    b = uuid.uuid4().hex
    body = b""
    for name, val in [("model_id", "eleven_multilingual_sts_v2"), ("remove_background_noise", "false")]:
        body += f"--{b}\r\nContent-Disposition: form-data; name=\"{name}\"\r\n\r\n{val}\r\n".encode()
    body += f"--{b}\r\nContent-Disposition: form-data; name=\"audio\"; filename=\"a.wav\"\r\nContent-Type: audio/wav\r\n\r\n".encode() + Path(wav).read_bytes() + b"\r\n" + f"--{b}--\r\n".encode()
    r = urllib.request.Request(f"https://api.elevenlabs.io/v1/speech-to-speech/{voice_id}?output_format=mp3_44100_128", data=body, method="POST",
                               headers={"xi-api-key": k, "Content-Type": f"multipart/form-data; boundary={b}"})
    Path(out).write_bytes(urllib.request.urlopen(r, timeout=300).read())


def dur(p):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)], capture_output=True, text=True).stdout)


def main():
    name, tag = sys.argv[1], sys.argv[2]
    base = STS / f"{name}_full_{tag}.mp3"
    if not base.exists():
        sts(VOICES[tag], STS / f"{name}_full.wav", base)
    OUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        run(["ffmpeg", "-v", "error", "-y", "-i", str(base), "-ar", "44100", "-ac", "1", str(tmp / "base.wav")])
        cur = tmp / "base.wav"
        sr, base_a = load_wav(cur)
        tts_cache = {}
        for n, (t0, t1, sentence, keep) in enumerate(PATCHES[name]):
            cfile = STS / f"read_{hashlib.md5(sentence.encode()).hexdigest()[:10]}.json"
            if sentence not in tts_cache:
                if cfile.exists():
                    d = json.loads(cfile.read_text())
                    tts_cache[sentence] = (bytes.fromhex(d["a"]), d["al"])
                else:
                    a, al = tts_with_timestamps(sentence, READER)
                    cfile.write_text(json.dumps({"a": a.hex(), "al": al}))
                    tts_cache[sentence] = (a, al)
            audio, al = tts_cache[sentence]
            words = words_from_alignment(al)
            toks, kt = sentence.split(), keep.split()
            i = next(k for k in range(len(toks)) if toks[k:k + len(kt)] == kt)
            ws, we = words[i]["startMs"] / 1000, words[i + len(kt) - 1]["endMs"] / 1000
            # la phrase entière est convertie dans la voix cible (une conversion sur un mot isolé est inaudible) ;
            # la conversion garde le minutage, donc le mot se découpe aux mêmes temps que dans la lecture
            sid = hashlib.md5((sentence + tag).encode()).hexdigest()[:10]
            sconv = STS / f"phrase_{tag}_{sid}.mp3"
            if not sconv.exists():
                (tmp / "r.mp3").write_bytes(audio)
                run(["ffmpeg", "-v", "error", "-y", "-i", str(tmp / "r.mp3"), "-ar", "44100", "-ac", "1", str(tmp / "r.wav")])
                sts(VOICES[tag], tmp / "r.wav", sconv)
            conv = tmp / f"cut{n}.wav"
            run(["ffmpeg", "-v", "error", "-y", "-i", str(sconv), "-ss", f"{max(0, ws - 0.03):.3f}", "-to", f"{we + 0.06:.3f}", "-ar", "44100", "-ac", "1", str(conv)])
            # frontières recalées sur les creux d'énergie de la piste d'origine, pour ôter tout le mot fautif
            t0 = valley(base_a, sr, t0, before=0.05, after=0.04)
            t1 = valley(base_a, sr, t1, before=0.04, after=0.07)
            # même volume que la voix remplacée
            sr_c, ca = load_wav(conv)
            gain = rms(base_a, sr, t0, t1) / rms(ca, sr_c, 0, len(ca) / sr_c)
            # ajusté à la place du mot fautif (légère accélération ou ralentissement), fondus de 25 ms
            slot = t1 - t0
            f = min(1.7, max(0.75, dur(conv) / slot))
            run(["ffmpeg", "-v", "error", "-y", "-i", str(conv), "-af", f"volume={gain:.3f},atempo={f:.4f},apad=whole_dur={slot:.3f},atrim=0:{slot:.3f},afade=t=in:d=0.025,afade=t=out:st={max(0, slot - 0.025):.3f}:d=0.025",
                 "-ar", "44100", "-ac", "1", str(tmp / f"fit{n}.wav")])
            # le trou à la place du mot fautif (fondus de 25 ms), puis le mot juste posé dedans
            nxt = tmp / f"cur{n}.wav"
            run(["ffmpeg", "-v", "error", "-y", "-i", str(cur), "-i", str(tmp / f"fit{n}.wav"), "-filter_complex",
                 f"[0]volume='if(between(t,{t0 + 0.025:.3f},{t1 - 0.025:.3f}),0,if(between(t,{t0:.3f},{t0 + 0.025:.3f}),({t0 + 0.025:.3f}-t)/0.025,if(between(t,{t1 - 0.025:.3f},{t1:.3f}),(t-{t1 - 0.025:.3f})/0.025,1)))':eval=frame[b];"
                 f"[1]adelay={int(t0 * 1000)}:all=1[p];[b][p]amix=inputs=2:normalize=0:duration=first[a]", "-map", "[a]", str(nxt)])
            cur = nxt
            print(f"{t0:6.2f}-{t1:6.2f}  x{f:.2f}  {keep}")
        out_wav = HERE / f"{name}_{tag}_corrige.wav"
        run(["ffmpeg", "-v", "error", "-y", "-i", str(cur), "-ar", "48000", str(out_wav)])
    run(["ffmpeg", "-v", "error", "-y", "-i", str(SHORTS / f"{name}_orig.mp4"), "-i", str(out_wav), "-map", "0:v", "-map", "1:a",
         "-c:v", "copy", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-c:a", "aac", "-b:a", "192k", "-shortest", str(OUT / f"{name}_{tag}.mp4")])


if __name__ == "__main__":
    main()
