"""Alignement forcé (torchaudio MMS_FA, avec jeton « * ») des mots Whisper sur l'audio du micro.

Pourquoi : Whisper « nettoie » ce qu'il transcrit (hésitations, mots répétés, bruits de bouche) et étire les mots voisins
pour couvrir ces passages. L'alignement forcé recale chaque mot à quelques ms près ; un jeton « * » placé entre tous les
mots absorbe la parole non transcrite → on obtient la liste des sons sans mot (à couper au dérushage).

Usage (serveur, venv avec torch + torchaudio) : force_align.py micro_words.json micro.(wav|mp3) sortie.json
Sortie : {"words": [{word, start, end, start_whisper, end_whisper, aligned, score}], "unworded": [[début, fin], …]}
"""
import json
import subprocess
import sys
import unicodedata

import numpy as np
import torch
import torchaudio

SR = 16000
PAD = 0.6  # marge autour de chaque segment Whisper


def norm(w):
    w = unicodedata.normalize("NFD", w.lower().replace("’", "'"))
    w = "".join(c for c in w if unicodedata.category(c) != "Mn")
    return "".join(c for c in w if c in "abcdefghijklmnopqrstuvwxyz'")


def main():
    words_path, audio_path, out = sys.argv[1:4]
    segs = json.load(open(words_path))["segments"]
    pcm = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", audio_path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout, np.float32)
    wav = torch.from_numpy(pcm.copy())
    bundle = torchaudio.pipelines.MMS_FA
    model = bundle.get_model(with_star=True).eval()
    dictionary = bundle.get_dict(star="*")
    torch.set_num_threads(16)

    out_words, unworded = [], []
    for si, s in enumerate(segs):
        ws = s["words"]
        if not ws:
            continue
        t0 = max(0.0, ws[0]["start"] - PAD)
        t1 = min(len(pcm) / SR, ws[-1]["end"] + PAD)
        chunk = wav[int(t0 * SR) : int(t1 * SR)].unsqueeze(0)
        # transcription : * mot * mot * … * (les mots non alignables, ex. chiffres, restent sur l'horaire Whisper)
        items, kinds = ["*"], [None]
        for k, w in enumerate(ws):
            n = norm(w["word"])
            if n.replace("'", ""):
                items.append(n.replace("'", ""))
                kinds.append(k)
                items.append("*")
                kinds.append(None)
        try:
            with torch.inference_mode():
                emission, _ = model(chunk)
            tokens = [[dictionary[c] for c in it] for it in items]
            flat = [t for tok in tokens for t in tok]
            ali, scores = torchaudio.functional.forced_align(emission, torch.tensor([flat], dtype=torch.int32), blank=0)
            spans = torchaudio.functional.merge_tokens(ali[0], scores[0].exp())
            ratio = chunk.size(1) / emission.size(1) / SR
            # regrouper les spans par élément de la transcription
            pos, grouped = 0, []
            for tok in tokens:
                grouped.append(spans[pos : pos + len(tok)])
                pos += len(tok)
            aligned = {}
            for it, kind, g in zip(items, kinds, grouped):
                if not g:
                    continue
                a = t0 + g[0].start * ratio
                b = t0 + g[-1].end * ratio
                if kind is None:
                    if b - a >= 0.08:  # parole non transcrite (hésitation, répétition, bruit de bouche)
                        unworded.append([round(a, 3), round(b, 3)])
                else:
                    aligned[kind] = (a, b, float(np.mean([x.score for x in g])))
        except Exception as e:  # segment non alignable : on garde Whisper
            print(f"segment {si} non aligné : {e}", file=sys.stderr)
            aligned = {}
        for k, w in enumerate(ws):
            if k in aligned:
                a, b, sc = aligned[k]
                out_words.append({"word": w["word"], "start": round(a, 3), "end": round(b, 3), "start_whisper": w["start"], "end_whisper": w["end"], "aligned": True, "score": round(sc, 3)})
            else:
                out_words.append({"word": w["word"], "start": w["start"], "end": w["end"], "start_whisper": w["start"], "end_whisper": w["end"], "aligned": False, "score": 0})
    json.dump({"words": out_words, "unworded": unworded}, open(out, "w"), ensure_ascii=False)
    al = sum(w["aligned"] for w in out_words)
    print(f"{al}/{len(out_words)} mots alignés · {len(unworded)} sons sans mot ({sum(b - a for a, b in unworded):.1f} s)")


if __name__ == "__main__":
    main()
