"""Aperçu audio du dérushage : coupe l'audio du micro selon keep.json, avec des raccords inaudibles.
- chaque coupe calée sur un passage à zéro (± 5 ms) ;
- fondu enchaîné à puissance constante de 10 ms à chaque raccord ;
- contrôle : saut de niveau de part et d'autre de chaque raccord (300 ms), signalé au-delà de 3 dB.
Usage : derush_audio.py micro.(wav|mp3) keep.json sortie.wav [rapport_raccords.md]
"""
import json
import subprocess
import sys

import numpy as np
import soundfile as sf

SR = 48000
XF = int(0.010 * SR)
ZC = int(0.005 * SR)


def zero_cross(a, i):
    lo, hi = max(1, i - ZC), min(len(a) - 1, i + ZC)
    seg = a[lo:hi]
    z = np.where(np.signbit(seg[:-1]) != np.signbit(seg[1:]))[0]
    return lo + int(z[np.argmin(np.abs(z + lo - i))]) if len(z) else i


def lufs_ish(x):
    """Niveau de la voix active : 90e centile des trames de 20 ms (ignore les pauses)."""
    n = int(0.02 * SR)
    k = len(x) // n
    if k < 3:
        return -99.0
    r = np.sqrt((x[: k * n].reshape(k, n) ** 2).mean(1) + 1e-12)
    return 20 * np.log10(np.percentile(r, 90) + 1e-9)


audio, keep_path, out = sys.argv[1:4]
report = sys.argv[4] if len(sys.argv) > 4 else None
a = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", audio, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout, np.float32)
keep = json.load(open(keep_path))["keep"]
pieces, joins = [], []
for s0, s1 in keep:
    i0, i1 = zero_cross(a, int(s0 * SR)), zero_cross(a, int(s1 * SR))
    pieces.append(a[i0:i1].copy())
out_a = pieces[0]
fade_in = np.sqrt(np.linspace(0, 1, XF))
fade_out = np.sqrt(np.linspace(1, 0, XF))
for k, p in enumerate(pieces[1:], 1):
    t = len(out_a) / SR
    before, after = out_a[-int(1.5 * SR) :], p[: int(1.5 * SR)]
    joins.append((t, keep[k][0], lufs_ish(after) - lufs_ish(before)))
    if len(p) > XF and len(out_a) > XF:
        tail = out_a[-XF:] * fade_out + p[:XF] * fade_in
        out_a = np.concatenate([out_a[:-XF], tail, p[XF:]])
    else:
        out_a = np.concatenate([out_a, p])
sf.write(out, out_a, SR)
print(f"aperçu : {len(out_a) / SR / 60:.1f} min, {len(joins)} raccords")
if report:
    bad = [j for j in joins if abs(j[2]) > 3 and j[2] > -20]
    with open(report, "w") as f:
        f.write(f"# Raccords à écouter ({len(bad)} sur {len(joins)})\n\nSaut du niveau de la voix > 3 dB entre les 1,5 s avant et après le raccord (prises enregistrées à des moments différents).\n\n")
        for t, src, d in bad:
            f.write(f"- `{int(t // 60)}:{t % 60:04.1f}` dans l'aperçu (micro {int(src // 60)}:{src % 60:04.1f}) : {d:+.1f} dB\n")
