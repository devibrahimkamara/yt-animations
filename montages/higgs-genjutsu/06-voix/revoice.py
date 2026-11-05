"""Revoicing des shorts Genjutsu : la voix française de Higgsfield fait des fautes (« l'avenir » pour « la veille »,
« mise bout à pisse »…). On régénère le texte juste avec ElevenLabs, puis on le cale phrase par phrase sur la voix
d'origine (mêmes débuts, mêmes durées) : la bouche bouge déjà sur ces phrases, la synchro reste naturelle.

Usage : python3 revoice.py <nom> [--voice ID] [--stability 0.45]
  <nom>_orig.mp4 (public/montage/higgs-genjutsu/shorts) + <nom>.fw.json (faster-whisper, mots horodatés, ce dossier)
  → <nom>_voice.wav (ce dossier) et <nom>.mp4 (la vidéo d'origine avec la nouvelle voix, à côté de l'original).
"""
import argparse, difflib, json, re, subprocess, sys, tempfile, unicodedata
from pathlib import Path

sys.path.insert(0, str(Path.home() / "faceless-studio/pipeline"))
from build import tts_with_timestamps, words_from_alignment  # noqa: E402  (clé ElevenLabs lue par le pipeline)

HERE = Path(__file__).resolve().parent
SHORTS = Path.home() / "yt-animations/public/montage/higgs-genjutsu/shorts"

# Le texte juste de chaque short (celui des sous-titres incrustés)
TEXTS = {
    "s1": "Tu as l'impression d'être en retard sur tout le monde ? Moi aussi. J'ai fait des études d'informatique… et je détestais coder. "
          "Aujourd'hui, je code tous les jours sans écrire une seule ligne, et je vis entre l'Afrique, l'Europe et l'Indonésie. "
          "Ton rythme, ce n'est pas celui des autres. Arrête de comparer ton chapitre 3 avec leur chapitre 20.",
}
BODY = ("Trois habitudes pour les récupérer. Un, pas de téléphone la première heure, parce que juste deux minutes sur une appli, "
        "ça finit souvent en une demi-heure. Deux, tu choisis ta tâche la plus importante la veille, comme ça au réveil tu attaques direct. "
        "Trois, tes mails et tes messages, c'est à heure fixe, pas au réveil, sinon tu gères les urgences des autres.")
END = " Franchement, mises bout à bout, ça peut te rendre deux heures par jour."
TEXTS["s2"] = "Tu perds deux heures chaque matin sans t'en rendre compte. " + BODY + END
TEXTS["h1"] = "Deux heures, c'est ce que ton matin te coûte chaque jour. " + BODY + END
TEXTS["h2"] = "Tu ne manques pas de temps. Tu gaspilles deux heures chaque matin. " + BODY + END
TEXTS["h3"] = "Et si tes matins te volaient deux heures par jour ? " + BODY + END
TEXTS["fix"] = "Tu perds deux heures chaque matin sans t'en rendre compte. " + BODY  # version corrigée : sans la dernière phrase


def norm(w):
    w = unicodedata.normalize("NFD", w.lower())
    w = "".join(c for c in w if unicodedata.category(c) != "Mn")
    w = re.sub(r"[^a-z0-9]", "", w)
    return {"1": "un", "2": "deux", "3": "trois", "20": "vingt"}.get(w, w)


def whisper_words(name):
    d = json.loads((HERE / f"{name}.fw.json").read_text())
    segs = d["segments"] if isinstance(d, dict) else d
    out = []
    for s in segs:
        for w in s.get("words", []):
            raw = w["word"]
            if not raw.strip():
                continue
            # faster-whisper coupe aux apostrophes (« Aujourd » + « 'hui ») : un morceau sans espace devant prolonge le mot
            if out and not raw.startswith(" "):
                out[-1]["w"] += raw.strip()
                out[-1]["e"] = w["end"]
            else:
                out.append({"w": raw.strip(), "s": w["start"], "e": w["end"]})
    return out


def phrases(text):
    """Découpe le texte en phrases (aux . , ? … ) : liste d'index de mots de début de phrase."""
    toks = text.split()
    starts, new = [], True
    for i, t in enumerate(toks):
        if new:
            starts.append(i)
        new = bool(re.search(r"[.,?!…:]$", t))
    # une phrase d'un seul mot (« Un, », « Franchement, ») se cale avec la suivante : fenêtre trop courte sinon
    merged = []
    for k, st in enumerate(starts):
        nxt = starts[k + 1] if k + 1 < len(starts) else len(toks)
        if merged and merged[-1][1] < 2:
            merged[-1] = (merged[-1][0], merged[-1][1] + nxt - st)
        else:
            merged.append((st, nxt - st))
    if len(merged) > 1 and merged[-1][1] < 2:
        merged[-2] = (merged[-2][0], merged[-2][1] + merged[-1][1])
        merged.pop()
    return toks, [st for st, _ in merged]


def run(cmd):
    subprocess.run(cmd, check=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("name")
    ap.add_argument("--voice", required=True)
    ap.add_argument("--stability", type=float, default=0.45)
    ap.add_argument("--style", type=float, default=0.2)
    ap.add_argument("--speed", type=float, default=1.0)
    ap.add_argument("--min-window", type=float, default=1.0)
    a = ap.parse_args()
    text = TEXTS[a.name]
    voice = {"id": a.voice, "model": "eleven_multilingual_v2",
             "settings": {"stability": a.stability, "similarity_boost": 0.8, "style": a.style, "use_speaker_boost": True, "speed": a.speed}}
    cache = HERE / f"{a.name}_{a.voice}_{a.stability}_{a.speed}.tts.json"
    if cache.exists():
        d = json.loads(cache.read_text())
        audio, al = bytes.fromhex(d["audio"]), d["alignment"]
    else:
        audio, al = tts_with_timestamps(text, voice)
        cache.write_text(json.dumps({"audio": audio.hex(), "alignment": al}))
    tw = words_from_alignment(al)  # [{text, startMs, endMs, …}]
    ow = whisper_words(a.name)
    toks, starts = phrases(text)
    if len(tw) != len(toks):
        sys.exit(f"{a.name} : {len(tw)} mots ElevenLabs pour {len(toks)} mots de texte")

    # Correspondance mot à mot : texte juste ↔ voix d'origine (les mots mal dits ne s'alignent pas, les autres oui)
    sm = difflib.SequenceMatcher(a=[norm(t) for t in toks], b=[norm(w["w"]) for w in ow], autojunk=False)
    m = {}
    for blk in sm.get_matching_blocks():
        for k in range(blk.size):
            m[blk.a + k] = blk.b + k

    def orig_time(i, end=False):
        """Temps d'origine du mot i du texte ; s'il n'est pas aligné, interpolé entre les voisins alignés."""
        if i in m:
            return ow[m[i]]["e" if end else "s"]
        lo = max([k for k in m if k < i], default=None)
        hi = min([k for k in m if k > i], default=None)
        if lo is None:
            return ow[0]["s"]
        if hi is None:
            return ow[m[lo]]["e"]
        t0, t1 = ow[m[lo]]["e"], ow[m[hi]]["s"]
        return t0 + (t1 - t0) * (i - lo) / (hi - lo)

    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(SHORTS / f"{a.name}_orig.mp4")],
                               capture_output=True, text=True).stdout)
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        (tmp / "tts.mp3").write_bytes(audio)
        run(["ffmpeg", "-v", "error", "-y", "-i", str(tmp / "tts.mp3"), "-ar", "48000", "-ac", "1", str(tmp / "tts.wav")])
        parts, report, prev_end = [], [], 0.0
        # une phrase dont la fenêtre d'origine fait moins de --min-window s se cale avec la suivante (sinon la voix s'écrase)
        kept = [starts[0]]
        for k in range(1, len(starts)):
            if orig_time(starts[k]) - orig_time(kept[-1]) < a.min_window:
                continue
            kept.append(starts[k])
        starts = kept
        bounds = starts + [len(toks)]
        for k in range(len(starts)):
            i0, i1 = bounds[k], bounds[k + 1] - 1
            ts, te = tw[i0]["startMs"] / 1000, tw[i1]["endMs"] / 1000
            os_, oe = orig_time(i0), orig_time(i1, end=True)
            if k + 1 < len(starts):
                oe = min(oe, orig_time(bounds[k + 1]) - 0.03)
            od = max(0.2, oe - os_)
            factor = (te - ts) / od  # > 1 : la voix ElevenLabs est plus longue, on accélère
            f = min(1.4, max(0.78, factor))
            seg = tmp / f"p{k}.wav"
            run(["ffmpeg", "-v", "error", "-y", "-ss", f"{max(0, ts - 0.03):.3f}", "-to", f"{te + 0.05:.3f}", "-i", str(tmp / "tts.wav"),
                 "-af", f"atempo={f:.4f},afade=t=in:d=0.02", str(seg)])
            # jamais deux phrases l'une sur l'autre : si la précédente déborde, celle-ci attend la fin
            start = max(os_, prev_end + 0.02) if parts else os_
            prev_end = start + (te + 0.05 - max(0, ts - 0.03)) / f
            parts.append((start, seg))
            report.append(f"{os_:6.2f}-{oe:6.2f}  x{factor:4.2f}{' (borné)' if f != factor else ''}  {' '.join(toks[i0:i1 + 1])}")
        inputs, filt = [], []
        for j, (t, seg) in enumerate(parts):
            inputs += ["-i", str(seg)]
            filt.append(f"[{j}]adelay={int(t * 1000)}:all=1[d{j}]")
        mix = "".join(f"[d{j}]" for j in range(len(parts))) + f"amix=inputs={len(parts)}:normalize=0,apad=whole_dur={dur:.3f},atrim=0:{dur:.3f}[a]"
        out_wav = HERE / f"{a.name}_voice.wav"
        run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(filt + [mix]), "-map", "[a]", "-ar", "48000", str(out_wav)])
    run(["ffmpeg", "-v", "error", "-y", "-i", str(SHORTS / f"{a.name}_orig.mp4"), "-i", str(out_wav), "-map", "0:v", "-map", "1:a",
         "-c:v", "copy", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-c:a", "aac", "-b:a", "192k", "-shortest", str(SHORTS / f"{a.name}.mp4")])
    (HERE / f"{a.name}_calage.txt").write_text("\n".join(report) + "\n")
    print("\n".join(report))


if __name__ == "__main__":
    main()
