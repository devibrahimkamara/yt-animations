"""Sous-titres .srt de la vidéo finale à partir des mots Whisper (source) et de l'EDL (timeline).
Corrige les noms propres mal transcrits, découpe en sous-titres de 2 lignes (≤ 42 caractères par ligne, ≤ 6 s).
Usage : make_srt.py voice_face.json edl.json corrections.json sortie.srt
"""
import json
import re
import sys

voice, edl_path, corr_path, out = sys.argv[1:5]
segs = json.load(open(voice))["segments"]
edl = [e for e in json.load(open(edl_path)) if e["src_in"] is not None]
corr = json.load(open(corr_path))  # {"motif regex": "remplacement"} appliqué sur le texte de chaque sous-titre


def to_timeline(t):
    for e in edl:
        if e["src_in"] <= t < e["src_out_or_dur"]:
            return e["out"] + (t - e["src_in"])
    return None


words = []
for s in segs:
    for w in s.get("words", []):
        a, b = to_timeline(w["start"]), to_timeline(max(w["start"], w["end"] - 0.01))
        if a is None or b is None or b < a:
            continue
        words.append((a, b, w["word"].strip()))
words.sort()

def join(tokens):
    out = ""
    for tok in tokens:
        if not out:
            out = tok
        elif tok[:1] in "'’-" or tok[:1] in ",.?!:;":
            out += tok
        else:
            out += " " + tok
    return out


subs, cur = [], []
for w in words:
    if cur:
        text = join([x[2] for x in cur + [w]])
        gap = w[0] - cur[-1][1]
        if (len(text) > 84 or w[1] - cur[0][0] > 6.0 or gap > 0.7) and w[2][:1] not in "'’-,." and cur[-1][2][-1:] not in "'’":
            subs.append(cur)
            cur = []
    cur.append(w)
if cur:
    subs.append(cur)


def wrap(text):
    if len(text) <= 42:
        return text
    best = min((abs(i - len(text) / 2), i) for i, c in enumerate(text) if c == " ")[1]
    return text[:best] + "\n" + text[best + 1 :]


def ts(t):
    h, m = int(t // 3600), int(t % 3600 // 60)
    s = t % 60
    return f"{h:02d}:{m:02d}:{int(s):02d},{int(round((s % 1) * 1000)) % 1000:03d}"


with open(out, "w") as f:
    prev_end_punct = True
    for i, sub in enumerate(subs, 1):
        text = join([x[2] for x in sub])
        for pat, rep in corr.items():
            text = re.sub(pat, rep, text)
        text = re.sub(r"[ \t]+", " ", text).strip()
        if text and prev_end_punct:
            text = text[0].upper() + text[1:]
        prev_end_punct = text[-1:] in ".?!"
        end = max(sub[-1][1] + 0.15, sub[0][0] + 1.0)
        if i < len(subs):
            end = min(end, subs[i][0][0] - 0.02)
        f.write(f"{i}\n{ts(sub[0][0])} --> {ts(end)}\n{wrap(text)}\n\n")
print(f"{len(subs)} sous-titres, {len(words)} mots")
