"""Analyse audio locale à partir des pistes séparées par Demucs (vocals / no_vocals).
Sort : niveaux voix vs musique, sections musicales, événements SFX (transitoires au-dessus du lit musical).
Usage: python audio_analyze.py vocals.wav no_vocals.wav out.json
"""
import sys, json
import numpy as np
import librosa

voc_p, mus_p, out = sys.argv[1:4]
SR, HOP = 22050, 512
voc, _ = librosa.load(voc_p, sr=SR, mono=True)
mus, _ = librosa.load(mus_p, sr=SR, mono=True)
t_of = lambda fr: round(float(fr * HOP / SR), 2)

db = lambda x: librosa.amplitude_to_db(librosa.feature.rms(y=x, hop_length=HOP)[0], ref=1.0)
v_db, m_db = db(voc), db(mus)

# Niveaux par seconde
fps = SR / HOP
per_sec = []
for s in range(int(len(v_db) / fps)):
    a, b = int(s * fps), int((s + 1) * fps)
    per_sec.append({"t": s, "voice": round(float(np.percentile(v_db[a:b], 90)), 1),
                    "music": round(float(np.median(m_db[a:b])), 1)})

# Sections musicales : silence vs présence, et changements de texture (nouveauté spectrale)
mus_on = m_db > -45
chroma = librosa.feature.chroma_cqt(y=mus, sr=SR, hop_length=HOP)
bounds = librosa.segment.agglomerative(chroma, k=12)
sections = [t_of(b) for b in bounds]
silences, start = [], None
for i, on in enumerate(mus_on):
    if not on and start is None:
        start = i
    if on and start is not None:
        if (i - start) / fps > 0.25:
            silences.append([t_of(start), t_of(i)])
        start = None
tempo, beats = librosa.beat.beat_track(y=mus, sr=SR, hop_length=HOP)

# SFX : onsets forts dans no_vocals, nettement au-dessus du lit local (médiane glissante 3 s)
env = librosa.onset.onset_strength(y=mus, sr=SR, hop_length=HOP)
onsets = librosa.onset.onset_detect(onset_envelope=env, sr=SR, hop_length=HOP, backtrack=False)
win = int(3 * fps)
sfx = []
for o in onsets:
    a, b = max(0, o - win), min(len(m_db), o + win)
    bed = float(np.median(m_db[a:b]))
    peak = float(m_db[o:o + int(0.3 * fps)].max())
    if peak - bed > 8 and env[o] > np.percentile(env, 90):
        # durée : temps pendant lequel le niveau reste > bed+4
        e = o
        while e < len(m_db) and m_db[e] > bed + 4 and (e - o) / fps < 4:
            e += 1
        # caractère spectral : centroïde (aigu = pop/click, grave = boom/impact) + montée (whoosh)
        seg = mus[o * HOP:e * HOP + HOP]
        cen = float(librosa.feature.spectral_centroid(y=seg, sr=SR).mean()) if len(seg) > 2048 else None
        pre = m_db[max(0, o - int(0.6 * fps)):o]
        rise = float(m_db[o] - pre.min()) if len(pre) else 0.0
        sfx.append({"t": t_of(o), "dur": round((e - o) / fps, 2), "over_bed_db": round(peak - bed, 1),
                    "centroid_hz": round(cen) if cen else None, "pre_rise_db": round(rise, 1)})

json.dump({"tempo": float(np.atleast_1d(tempo)[0]), "music_sections": sections,
           "music_silences": silences, "sfx": sfx, "levels_per_sec": per_sec}, open(out, "w"), indent=1)
print(f"tempo {float(np.atleast_1d(tempo)[0]):.0f} bpm, {len(sfx)} SFX candidats, {len(silences)} coupures musique")
