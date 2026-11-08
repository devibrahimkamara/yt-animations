"""Aperçu de l'étape 3 (basse définition, 960×540, image calée à l'image près sur voice_full.wav).
Image : face cam, écran pendant la démo (hors passage où l'écran montre le script), insertions en maquette.
"""
import json
import os
import subprocess

D = os.path.dirname(os.path.abspath(__file__))
DL = "/Users/ibrahimkamara/Downloads"
FACE = f"{D}/../01-analyse/face_proxy.mp4"
SCREEN = f"{DL}/Higgsfield Influencler Capture-1.mp4"
REF = f"{DL}/IMG_7271.mov"
R = [f"{DL}/hf_20261006_083411_8e7d662d-9994-4b95-a487-3f5998b6f979.mp4", f"{DL}/hf_20261006_084231_4ef917f4-fe8c-4533-914f-4b4a7c95e18b.mp4",
     f"{DL}/hf_20261006_084314_59b950e6-7ac0-4e70-a12e-b7225d1af1aa.mp4", f"{DL}/hf_20261006_084353_ae96f278-419b-4d78-abc7-64dac03ab511.mp4"]
FONT = "/System/Library/Fonts/Helvetica.ttc"
T = f"{D}/_prev"
os.makedirs(T, exist_ok=True)
FPS = 30
ENC = ["-c:v", "libx264", "-preset", "veryfast", "-crf", "27", "-pix_fmt", "yuv420p", "-r", str(FPS), "-an"]


def run(cmd):
    subprocess.run(cmd, check=True, capture_output=True)


def label(txt):
    txt = txt.replace(":", "\\:").replace("'", "’")
    return f"drawtext=fontfile={FONT}:text='{txt}':x=(w-tw)/2:y=h-70:fontsize=30:fontcolor=white:box=1:boxcolor=black@0.6:boxborderw=10"


# 1. image de base sur l'horloge de la source : face cam + écran pendant la démo
pic = f"{T}/pic.mp4"
if not os.path.exists(pic):
    run(["ffmpeg", "-y", "-i", FACE, "-i", SCREEN, "-filter_complex",
         "[1:v]scale=960:540,fps=30[s];[0:v]fps=30[f];[f][s]overlay=enable='between(t,329.4,408.4)+between(t,423.5,560)'[v]",
         "-map", "[v]", *ENC, pic])

e = json.load(open(f"{D}/edl.json"))
items = e["items"] + [{"type": "end", "out": e["duration"]}]
pieces, chunk = [], []


def frames(i):
    return round(items[i + 1]["out"] * FPS) - round(items[i]["out"] * FPS)


def flush():
    global chunk
    if not chunk:
        return
    expr = "+".join(f"between(n,{s},{s + c - 1})" for s, c in chunk)
    out = f"{T}/c{len(pieces):02d}.mp4"
    run(["ffmpeg", "-y", "-i", pic, "-vf", f"select='{expr}',setpts=N/{FPS}/TB", *ENC, "-frames:v", str(sum(c for _, c in chunk)), out])
    pieces.append(out)
    chunk = []


def scaled(src, h, extra=""):
    return f"scale=-2:{h},setsar=1,fps=30{extra}"


for i, it in enumerate(items[:-1]):
    n = frames(i)
    if it["type"] == "src":
        chunk.append((round(it["src_in"] * FPS), n))
        continue
    flush()
    out = f"{T}/c{len(pieces):02d}.mp4"
    if it["label"].startswith("R1"):
        fc = (f"[0:v]{scaled(REF, 540)}[a];[1:v]{scaled(R[0], 540)}[b];[a][b]hstack,pad=960:540:(ow-iw)/2:0,{label('Cold open : ta référence ↔ ton chat')}[v]")
        run(["ffmpeg", "-y", "-i", REF, "-i", R[0], "-filter_complex", fc, "-map", "[v]", *ENC, "-frames:v", str(n), out])
    elif it["label"].startswith("R9"):
        ins = [REF] + R
        fc = "".join(f"[{k}:v]scale=-2:340,setsar=1,fps=30,tpad=stop_mode=clone:stop_duration=2[v{k}];" for k in range(5))
        fc += "".join(f"[v{k}]" for k in range(5)) + f"hstack=inputs=5,pad=960:540:(ow-iw)/2:60,{label('Climax : original · costume · pyjama · casino · sac de voyage')}[v]"
        run(["ffmpeg", "-y", *sum([["-i", x] for x in ins], []), "-filter_complex", fc, "-map", "[v]", *ENC, "-frames:v", str(n), out])
    else:
        run(["ffmpeg", "-y", "-f", "lavfi", "-i", f"color=c=0x090b08:s=960x540:r={FPS}", "-vf",
             f"drawtext=fontfile={FONT}:text='{it['label'].replace(':', chr(92) + ':')}':x=(w-tw)/2:y=(h-th)/2:fontsize=44:fontcolor=0xc6f36d", *ENC, "-frames:v", str(n), out])
    pieces.append(out)
flush()

open(f"{T}/list.txt", "w").write("".join(f"file '{p}'\n" for p in pieces))
final = f"{D}/higgs-influ3_etape3_audio.mp4"
run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", f"{T}/list.txt", "-i", f"{D}/voice_full.wav", "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", final])
print("ok", final, len(pieces), "morceaux")
