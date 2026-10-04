"""Condense les mesures d'une vidéo de référence en digest.md lisible par un agent.
Usage: python digest.py <dossier>
"""
import sys, os, json
import numpy as np
import librosa

D = sys.argv[1]
S = json.load(open(f"{D}/shots.json"))["shots"]
A = json.load(open(f"{D}/audio_events.json"))

# Transcript : sous-titres YouTube json3 (ou Whisper audio.json)
words = []
if os.path.exists(f"{D}/subs.en.json3"):
    J = json.load(open(f"{D}/subs.en.json3"))
    for ev in J.get("events", []):
        t0 = ev.get("tStartMs", 0)
        for sg in ev.get("segs", []) or []:
            w = sg.get("utf8", "").strip()
            if w:
                words.append({"t": (t0 + sg.get("tOffsetMs", 0)) / 1000, "w": w})
elif os.path.exists(f"{D}/audio.json"):
    for s in json.load(open(f"{D}/audio.json"))["segments"]:
        for w in s.get("words", []):
            words.append({"t": w["start"], "w": w["word"].strip()})
dur = S[-1]["end"]
nearest_word = lambda t: min(words, key=lambda x: abs(x["t"] - t))["w"] if words else ""

out = [f"# Digest — {os.path.basename(D)}", ""]
d = np.array([s["dur"] for s in S])
a = [s for s in S if s["face_pct"] > 0.5]
out += ["## Rythme", f"- Durée {dur/60:.1f} min · {len(S)} plans · 1 coupe / {dur/len(S):.1f} s (médiane plan {np.median(d):.1f} s, max {d.max():.1f} s)",
        f"- Plans avec visage {len(a)} ({sum(s['dur'] for s in a)/dur*100:.0f} % du temps) · autres {len(S)-len(a)}",
        f"- Débit de parole ≈ {len(words)/(dur/60):.0f} mots/min" if words else "", ""]
# Coupes par minute
cpm = np.bincount([int(s["start"] // 60) for s in S], minlength=int(dur // 60) + 1)
out += ["## Coupes par minute", " ".join(f"m{i}:{c}" for i, c in enumerate(cpm)), ""]

# Zooms
zc = np.array([s["zoom_cum"] for s in a]) if a else np.array([1.0])
out += ["## Zooms (plans visage)", f"- push-in >+5 % : {(zc>1.05).sum()} · dézoom <−2 % : {(zc<0.98).sum()} · statiques ±2 % : {((zc>=0.98)&(zc<=1.02)).sum()}",
        "- Plus forts mouvements (t, durée, zoom cumulé) : " + ", ".join(f"{s['start']:.0f}s/{s['dur']:.1f}s/{(s['zoom_cum']-1)*100:+.0f}%" for s in sorted(a, key=lambda s: -abs(s['zoom_cum']-1))[:12]),
        "- Sauts de cadrage entre plans (taille visage ×) : " + ", ".join(f"{s['start']:.0f}s×{s['face_jump']}" for s in a if s.get('face_jump') and abs(s['face_jump']-1) > 0.25)[:1500], ""]

# SFX fusionnés
ev = []
for e in A["sfx"]:
    if ev and e["t"] - ev[-1]["end"] < 0.35:
        g = ev[-1]; g["end"] = max(g["end"], e["t"] + e["dur"]); g["peak"] = max(g["peak"], e["over_bed_db"]); g["rise"] = max(g["rise"], e["pre_rise_db"]); g["cen"].append(e["centroid_hz"] or 0)
    else:
        ev.append({"t": e["t"], "end": e["t"] + e["dur"], "peak": e["over_bed_db"], "rise": e["pre_rise_db"], "cen": [e["centroid_hz"] or 0]})
cuts = [s["start"] for s in S]
kinds = {}
lines = []
for g in ev:
    cen = np.mean([x for x in g["cen"] if x]) if any(g["cen"]) else 0
    L = g["end"] - g["t"]
    k = "whoosh/riser" if g["rise"] > 20 and L > 0.6 else ("impact/boom" if cen < 600 else ("pop/clic" if L < 0.3 else "swoosh/texture"))
    kinds[k] = kinds.get(k, 0) + 1
    c = min(cuts, key=lambda x: abs(x - g["t"]))
    lines.append(f"{g['t']:7.2f}s {k:14s} {L:4.2f}s +{g['peak']:4.1f}dB coupe{c-g['t']:+.2f}s « {nearest_word(g['t'])} »")
near = sum(1 for g in ev if min(abs(c - g["t"]) for c in cuts) < 0.6)
out += ["## Effets sonores (détection auto sur la piste hors-voix)", f"- {len(ev)} événements · 1 / {dur/max(len(ev),1):.1f} s · types {kinds} · {near} à <0,6 s d'une coupe", "```"] + lines + ["```", ""]

# Musique
L = A["levels_per_sec"]; v = np.array([x["voice"] for x in L]); m = np.array([x["music"] for x in L])
y, sr = librosa.load(f"{D}/sep/htdemucs/audio/no_vocals.wav", sr=22050)
r = librosa.amplitude_to_db(librosa.feature.rms(y=y, frame_length=4096, hop_length=2205)[0])
on = r > -48; segs = []; st = None
for i, x in enumerate(on):
    if x and st is None: st = i
    if not x and st is not None:
        if i - st >= 15: segs.append(f"{st/10:.0f}-{i/10:.0f}s({np.median(r[st:i]):.0f}dB)")
        st = None
out += ["## Musique", f"- Voix p90 médiane {np.median(v):.1f} dB · hors-voix médiane {np.median(m):.1f} dB (écart {np.median(v-m):.0f} dB) · présente >−45 dB {np.mean(r>-45)*100:.0f} % du temps",
        "- Niveau hors-voix par minute : " + " ".join(f"m{i//60}:{np.median(m[i:i+60]):.0f}" for i in range(0, len(m), 60)),
        "- Passages musicaux soutenus audibles : " + ", ".join(segs[:80]), ""]

# Transcript par blocs de 15 s
out += ["## Transcript horodaté (blocs de 15 s)"]
blk = {}
for w in words:
    blk.setdefault(int(w["t"] // 15), []).append(w["w"])
for k in sorted(blk):
    out.append(f"[{int(k*15//60)}:{int(k*15%60):02d}] " + " ".join(blk[k]))
out += ["", "## Plans (t début · durée · zoom cumulé · visage h/cx)"]
out += [f"{s['start']:7.1f} {s['dur']:5.1f}s z{(s['zoom_cum']-1)*100:+4.0f}% " + (f"v{s['face_h']}/{s['face_cx']}" if s['face_h'] else "—") for s in S]
open(f"{D}/digest.md", "w").write("\n".join(out))
print("digest ok", len(words), "mots")
