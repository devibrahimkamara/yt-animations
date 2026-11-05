"""Revoicing mot à mot : ElevenLabs lit le texte juste, puis chaque mot est calé sur le mot prononcé dans la vidéo.

La voix de Higgsfield prononce mal (« la vénère » pour « la veille », « chasse matin »…) : une conversion de voix
recopie ces sons, et un calage phrase par phrase ne suit pas la bouche. Ici, chaque mot de la lecture ElevenLabs est
étiré ou resserré pour commencer et finir au moment exact où la bouche le dit dans la vidéo (horodatage faster-whisper).
Les mots mal prononcés à l'origine sont placés entre leurs voisins.

Usage : python3 revoice_words.py <nom> --voice ID [--tag esaie] [--speed 1.0]
  → <nom>_<tag>_mots.wav (ce dossier) et ../07-a-ecouter/mots/<nom>_<tag>.mp4
"""
import argparse, difflib, json, subprocess, sys, tempfile
from pathlib import Path

sys.path.insert(0, str(Path.home() / "faceless-studio/pipeline"))
from build import tts_with_timestamps, words_from_alignment  # noqa: E402
from revoice import TEXTS, norm, whisper_words, SHORTS, HERE  # noqa: E402

OUT = HERE.parent / "07-a-ecouter/mots"


def run(cmd):
    subprocess.run(cmd, check=True)


def atempo_chain(f):
    """atempo n'accepte que 0,5 à 2 par filtre : on enchaîne si besoin."""
    parts = []
    while f > 2.0:
        parts.append(2.0)
        f /= 2.0
    while f < 0.5:
        parts.append(0.5)
        f /= 0.5
    parts.append(f)
    return ",".join(f"atempo={p:.4f}" for p in parts)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("name")
    ap.add_argument("--voice", required=True)
    ap.add_argument("--tag", required=True)
    ap.add_argument("--speed", type=float, default=1.0)
    ap.add_argument("--stability", type=float, default=0.5)
    a = ap.parse_args()
    text = TEXTS[a.name]
    voice = {"id": a.voice, "model": "eleven_multilingual_v2",
             "settings": {"stability": a.stability, "similarity_boost": 0.8, "style": 0.15, "use_speaker_boost": True, "speed": a.speed}}
    cache = HERE / f"{a.name}_{a.tag}_{a.stability}_{a.speed}.tts.json"
    if cache.exists():
        d = json.loads(cache.read_text())
        audio, al = bytes.fromhex(d["audio"]), d["alignment"]
    else:
        audio, al = tts_with_timestamps(text, voice)
        cache.write_text(json.dumps({"audio": audio.hex(), "alignment": al}))
    tw = words_from_alignment(al)
    toks = text.split()
    if len(tw) != len(toks):
        sys.exit(f"{a.name} : {len(tw)} mots ElevenLabs pour {len(toks)} mots de texte")
    ow = whisper_words(a.name)

    sm = difflib.SequenceMatcher(a=[norm(t) for t in toks], b=[norm(w["w"]) for w in ow], autojunk=False)
    m = {}
    for blk in sm.get_matching_blocks():
        for k in range(blk.size):
            m[blk.a + k] = blk.b + k

    # Début et fin cibles de chaque mot : ceux de la vidéo si le mot est reconnu, sinon répartis entre les voisins
    n = len(toks)
    tgt = [None] * n
    for i, j in m.items():
        tgt[i] = (ow[j]["s"], ow[j]["e"])
    i = 0
    while i < n:
        if tgt[i] is not None:
            i += 1
            continue
        j = i
        while j < n and tgt[j] is None:
            j += 1
        t0 = tgt[i - 1][1] if i > 0 else ow[0]["s"]
        t1 = tgt[j][0] if j < n else ow[-1]["e"]
        # répartition proportionnelle à la durée des mots dans la lecture ElevenLabs
        lens = [max(0.05, (tw[k]["endMs"] - tw[k]["startMs"]) / 1000) for k in range(i, j)]
        tot, cur = sum(lens), t0
        for k, L in zip(range(i, j), lens):
            d = (t1 - t0) * L / tot
            tgt[k] = (cur, cur + d)
            cur += d
        i = j

    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(SHORTS / f"{a.name}_orig.mp4")],
                               capture_output=True, text=True).stdout)
    OUT.mkdir(parents=True, exist_ok=True)
    report, worst = [], []
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        (tmp / "tts.mp3").write_bytes(audio)
        run(["ffmpeg", "-v", "error", "-y", "-i", str(tmp / "tts.mp3"), "-ar", "48000", "-ac", "1", str(tmp / "tts.wav")])
        parts, prev_end = [], 0.0
        for k in range(n):
            ts, te = tw[k]["startMs"] / 1000, tw[k]["endMs"] / 1000
            # on garde la fin naturelle du mot jusqu'au mot suivant s'ils se touchent (liaisons)
            os_, oe = tgt[k]
            # chaque mot commence quand la bouche le dit ; sa durée reste naturelle (Whisper compte les silences dans le mot),
            # on ne resserre que s'il déborde sur le mot suivant, et on n'étire qu'un peu
            nxt = tgt[k + 1][0] if k + 1 < n else oe + 0.3
            od = max(0.06, min(oe, nxt) - os_)
            factor = (te - ts) / od
            f = min(1.6, max(0.85, factor))
            seg = tmp / f"w{k}.wav"
            run(["ffmpeg", "-v", "error", "-y", "-ss", f"{max(0, ts - 0.015):.3f}", "-to", f"{te + 0.015:.3f}", "-i", str(tmp / "tts.wav"),
                 "-af", f"{atempo_chain(f)},afade=t=in:d=0.008", str(seg)])
            start = max(os_, prev_end - 0.01)
            prev_end = start + (te - ts + 0.03) / f
            parts.append((start, seg))
            worst.append(abs(start - os_))
            report.append(f"{os_:6.2f}-{oe:6.2f}  x{factor:4.2f}{'*' if f != factor else ' '} {'·' if k in m else '?'} {toks[k]}")
        # mélange par paquets (ffmpeg limite le nombre d'entrées d'un filtre)
        chunk_files = []
        for c in range(0, len(parts), 40):
            grp = parts[c:c + 40]
            inputs, filt = [], []
            for j, (t, seg) in enumerate(grp):
                inputs += ["-i", str(seg)]
                filt.append(f"[{j}]adelay={int(t * 1000)}:all=1[d{j}]")
            mix = "".join(f"[d{j}]" for j in range(len(grp))) + f"amix=inputs={len(grp)}:normalize=0,apad=whole_dur={dur:.3f},atrim=0:{dur:.3f}[a]"
            cf = tmp / f"c{c}.wav"
            run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(filt + [mix]), "-map", "[a]", "-ar", "48000", str(cf)])
            chunk_files.append(cf)
        out_wav = HERE / f"{a.name}_{a.tag}_mots.wav"
        ins = sum((["-i", str(c)] for c in chunk_files), [])
        run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", f"amix=inputs={len(chunk_files)}:normalize=0", "-ar", "48000", str(out_wav)])
    run(["ffmpeg", "-v", "error", "-y", "-i", str(SHORTS / f"{a.name}_orig.mp4"), "-i", str(out_wav), "-map", "0:v", "-map", "1:a",
         "-c:v", "copy", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-c:a", "aac", "-b:a", "192k", "-shortest", str(OUT / f"{a.name}_{a.tag}.mp4")])
    (HERE / f"{a.name}_{a.tag}_mots.txt").write_text("\n".join(report) + "\n")
    worst.sort()
    print(f"{a.name} {a.tag} : {len(m)}/{n} mots calés sur la vidéo, retard médian {worst[len(worst)//2]:.2f}s, max {worst[-1]:.2f}s")
    print("\n".join(r for r in report if "*" in r or "?" in r))


if __name__ == "__main__":
    main()
