"""Transcription « littérale » (wav2vec2 CTC français) : écrit ce qui est réellement prononcé, y compris les débuts de
phrase abandonnés, les mots répétés et les bégaiements que Whisper efface. Sert au dérushage v3 (détection des tentatives
ratées) et au contrôle qualité automatique de l'aperçu.

Usage (serveur) : literal_asr.py audio.(wav|mp3) sortie.json [début_s fin_s]
Sortie : {"words": [{"word", "start", "end"}]}  (temps en secondes dans le fichier)
"""
import json
import subprocess
import sys

import numpy as np
import torch
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor

MODEL = "jonatasgrosman/wav2vec2-large-xlsr-53-french"
SR = 16000
CHUNK, OVER = 20.0, 2.0


def main():
    path, out = sys.argv[1:3]
    t_from = float(sys.argv[3]) if len(sys.argv) > 3 else 0.0
    t_to = float(sys.argv[4]) if len(sys.argv) > 4 else None
    cmd = ["ffmpeg", "-v", "error", "-ss", str(t_from)] + (["-t", str(t_to - t_from)] if t_to else []) + ["-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"]
    pcm = np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32)
    torch.set_num_threads(16)
    proc = Wav2Vec2Processor.from_pretrained(MODEL)
    model = Wav2Vec2ForCTC.from_pretrained(MODEL).eval()
    words = []
    step = CHUNK - OVER
    t = 0.0
    dur = len(pcm) / SR
    while t < dur:
        a, b = int(t * SR), int(min(dur, t + CHUNK) * SR)
        x = proc(pcm[a:b], sampling_rate=SR, return_tensors="pt").input_values
        with torch.inference_mode():
            logits = model(x).logits[0]
        ids = torch.argmax(logits, dim=-1)
        dec = proc.tokenizer.decode(ids, output_word_offsets=True)
        fps = logits.shape[0] / ((b - a) / SR)
        lo = 0 if t == 0 else OVER / 2  # zone de recouvrement : on prend chaque mot une seule fois
        hi = CHUNK - OVER / 2 if b < len(pcm) else 1e9
        for wo in dec.word_offsets:
            s0, s1 = wo["start_offset"] / fps, wo["end_offset"] / fps
            if lo <= s0 < hi:
                words.append({"word": wo["word"], "start": round(t_from + t + s0, 3), "end": round(t_from + t + s1, 3)})
        t += step
    json.dump({"words": words}, open(out, "w"), ensure_ascii=False)
    print(f"{len(words)} mots littéraux sur {dur:.0f} s")


if __name__ == "__main__":
    main()
