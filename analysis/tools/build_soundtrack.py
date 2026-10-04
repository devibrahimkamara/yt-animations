"""Bande son complète à partir de l'audio brut (non masterisé) de chaque bloc rendu.
Chaque morceau est coupé ou complété à l'échantillon près selon le nombre d'images du bloc,
puis tout est mis bout à bout en WAV 48 kHz. Le master −14 LUFS se fait ensuite une seule fois.
Usage : build_soundtrack.py sortie.wav bloc:fichier_brut.mp4:nb_images ...
"""
import subprocess
import sys

import numpy as np
import soundfile as sf

SR = 48000
PRIMING = 2048  # retard d'encodeur AAC en début de chaque bloc (mesuré : 42,7 ms, constant)
out, specs = sys.argv[1], sys.argv[2:]
parts = []
for spec in specs:
    name, path, frames = spec.rsplit(":", 2)
    want = round(int(frames) / 30 * SR)
    raw = subprocess.run(
        ["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", path, "-vn", "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"],
        capture_output=True,
        check=True,
    ).stdout
    a = np.frombuffer(raw, np.float32).reshape(-1, 2)[PRIMING:]
    diff = len(a) - want
    print(f"{name}: {len(a)} échantillons, attendu {want} (écart {diff / SR * 1000:+.1f} ms)")
    a = a[:want] if diff >= 0 else np.vstack([a, np.zeros((-diff, 2), np.float32)])
    parts.append(a)
full = np.vstack(parts)
sf.write(out, full, SR, subtype="FLOAT")
print(f"durée totale : {len(full) / SR:.3f} s")
