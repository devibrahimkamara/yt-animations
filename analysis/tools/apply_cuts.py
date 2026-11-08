"""Applique des coupes de rythme (cuts.ts, temps T) aux pistes face / écran / voix → *_v2 (PLAYBOOK §4.2bis).
Usage (serveur) : apply_cuts.py cuts.ts dossier_média
Images coupées à l'image près (30 i/s), voix avec fondus de 8 ms à chaque raccord."""
import re, subprocess, sys

FPS = 30


def main():
    cuts = sorted((float(a), float(b)) for a, b in re.findall(r"\[([\d.]+),\s*([\d.]+)\]", open(sys.argv[1]).read()))
    d = sys.argv[2]
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f"{d}/voice.wav"], capture_output=True, text=True).stdout)
    fr = lambda x: round(x * FPS) / FPS
    keep, t = [], 0.0
    for a, b in cuts:
        keep.append((t, fr(a)))
        t = fr(b)
    keep.append((t, dur))
    n = len(keep)
    for name, kind in (("face.mp4", "v"), ("screen.mp4", "v"), ("voice.wav", "a")):
        ins, parts = [], []
        for i, (a, b) in enumerate(keep):
            ins += ["-ss", f"{a:.4f}", "-to", f"{b:.4f}", "-i", f"{d}/{name}"]
            if kind == "v":
                parts.append(f"[{i}:v]setpts=PTS-STARTPTS[p{i}]")
            else:
                fo = max(0, b - a - 0.008)
                parts.append(f"[{i}:a]asetpts=PTS-STARTPTS,afade=t=in:d=0.008,afade=t=out:st={fo}:d=0.008[p{i}]")
        cat = "".join(f"[p{i}]" for i in range(n)) + (f"concat=n={n}:v=1:a=0[o]" if kind == "v" else f"concat=n={n}:v=0:a=1[o]")
        out = f"{d}/{name.replace('.', '_v2.')}"
        enc = ["-c:v", "libx264", "-crf", "14", "-preset", "fast", "-r", "30", "-pix_fmt", "yuv420p"] if kind == "v" else ["-c:a", "pcm_s24le"]
        subprocess.run(["ffmpeg", "-v", "error", "-y"] + ins + ["-filter_complex", ";".join(parts) + ";" + cat, "-map", "[o]"] + enc + [out], check=True)
        print(out)
    print("retiré", round(sum(fr(b) - fr(a) for a, b in cuts), 2), "s")


if __name__ == "__main__":
    main()
