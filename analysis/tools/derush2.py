"""Dérushage v2 (PLAYBOOK étape 0bis) : coupe pilotée par le son, repères de mots par alignement forcé.

Retour d'Ibrahim sur la v1 : répétitions et bruits de voix encore audibles (Whisper les « avale » dans les mots voisins),
silences pas assez coupés.
Principe v2 :
  - la PAROLE est définie par l'énergie (passages voisés continus), pas par les horaires des mots ;
  - les mots recalés (force_align.py, débuts fiables à quelques ms) servent à placer les décisions de contenu ;
  - un passage voisé qui ne contient AUCUN mot transcrit = hésitation / bruit de bouche / répétition avalée → coupé ;
  - à l'intérieur d'un passage gardé, un bloc « * » de l'alignement ≥ 0,30 s et voisé = parole non transcrite → coupé ;
  - chaque pause est ramenée à 50 ms dans une phrase et 120 ms entre deux phrases.
Usage : derush2.py micro_aligned.json micro.(wav|mp3) decisions.json dossier_sortie
Sorties : keep.json (segments gardés, temps micro), coupes_v2.md
"""
import json
import re
import subprocess
import sys
import unicodedata

import numpy as np

SR = 16000
HOP = 0.005
BRIDGE = 0.06  # deux passages voisés séparés de moins de 60 ms = un seul (occlusives, liaisons)
PAD_IN, PAD_OUT = 0.015, 0.035  # marges sur les bords d'un passage voisé
PAUSE_IN, PAUSE_END = 0.050, 0.120
STAR_MIN = 0.30  # parole non transcrite à l'intérieur d'un passage gardé
NOISE_MIN = 0.08  # passage voisé sans mot plus court = clic, ignoré (fondu)


def norm(w):
    w = unicodedata.normalize("NFD", w.lower())
    return re.sub(r"[^a-z0-9']+", "", "".join(c for c in w if unicodedata.category(c) != "Mn"))


def main():
    al_path, audio_path, dec_path, out = sys.argv[1:5]
    al = json.load(open(al_path))
    W = al["words"]
    dec = json.load(open(dec_path))
    pcm = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", audio_path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout, np.float32)
    n = int(HOP * SR)
    k = len(pcm) // n
    env = 20 * np.log10(np.sqrt((pcm[: k * n].reshape(k, n) ** 2).mean(1) + 1e-12))
    dur = len(pcm) / SR
    speech = np.concatenate([env[int(w["start"] / HOP) : int(w["end"] / HOP) + 1] for w in W if w["aligned"]])
    thr = max(np.median(speech) - 25, np.percentile(env, 10) + 6)

    # 1. passages voisés (énergie), ponts de 60 ms
    v = env > thr
    runs, i = [], 0
    while i < len(v):
        if v[i]:
            j = i
            while j < len(v) and v[j]:
                j += 1
            runs.append([i * HOP, j * HOP])
            i = j
        else:
            i += 1
    voiced = []
    for r in runs:
        if voiced and r[0] - voiced[-1][1] < BRIDGE:
            voiced[-1][1] = r[1]
        else:
            voiced.append(r)

    # 2. mots gardés / coupés (décisions de contenu)
    drop = set()
    for c in dec["cuts"]:
        drop.update(range(c["w"][0], c["w"][1] + 1))
    centers = [((w["start"] + w["end"]) / 2, i) for i, w in enumerate(W)]
    centers.sort()
    cs = np.array([c[0] for c in centers])

    def words_in(a, b):
        lo, hi = np.searchsorted(cs, a), np.searchsorted(cs, b)
        return [centers[x][1] for x in range(lo, hi)]

    # 3. pour chaque passage voisé : garder, couper, ou découper au mot près
    pieces, noise_cut, star_cut = [], [], []
    for a, b in voiced:
        ids = words_in(a, b)
        if not ids:
            if b - a >= NOISE_MIN:
                noise_cut.append((a, b))
            continue
        kept_ids = [x for x in ids if x not in drop]
        if not kept_ids:
            continue
        if len(kept_ids) == len(ids):
            pieces.append([a, b, kept_ids, ""])
            continue
        # passage mixte : on découpe aux frontières de mots (débuts recalés fiables)
        run = []
        for x in sorted(ids, key=lambda q: W[q]["start"]):
            if x in drop:
                if run:
                    pieces.append([max(a, W[run[0]]["start"] - 0.03), min(b, W[x]["start"] - 0.01), run, "end"])
                    run = []
            else:
                run.append(x)
        if run:
            first = W[run[0]]["start"] - 0.03
            pieces.append([max(a, first), b, run, "start" if first > a else ""])

    # 4. parole non transcrite (« * ») à l'intérieur des morceaux gardés
    # (les fenêtres d'alignement débordent sur les segments voisins : un « * » qui chevauche un mot réel n'est pas valide)
    spans = sorted((w["start"], w["end"]) for w in W)  # alignés + non alignés (chiffres : horaire Whisper)
    sa = np.array([x[0] for x in spans])
    se = np.array([x[1] for x in spans])

    def overlaps_word(u0, u1):
        return bool(np.any((sa < u1 - 0.02) & (se > u0 + 0.02)))

    stars = [u for u in al["unworded"] if u[1] - u[0] >= STAR_MIN and not overlaps_word(*u) and np.mean(env[int(u[0] / HOP) : int(u[1] / HOP)] > thr + 10) > 0.5]
    final = []
    for a, b, ids, hard in pieces:
        cuts_here = [u for u in stars if u[0] > a + 0.05 and u[1] < b - 0.05]
        cur, cur_hard = a, "start" if hard == "start" else ""
        for u0, u1 in cuts_here:
            final.append([cur, u0, ids, cur_hard + "end"])
            star_cut.append((u0, u1))
            cur, cur_hard = u1, "start"
        final.append([cur, b, ids, cur_hard + ("end" if "end" in hard else "")])

    # 5. raccords : pause cible selon la ponctuation du dernier mot du morceau précédent
    keep = []
    prev_hard_end = False
    for a, b, ids, hard in sorted(final, key=lambda p: p[0]):
        a0 = a if "start" in hard else max(0.0, a - PAD_IN)
        b0 = b if "end" in hard else min(dur, b + PAD_OUT)
        if keep:
            last_word = W[max(keep[-1][2], key=lambda q: W[q]["start"])]["word"]
            target = PAUSE_END if re.search(r"[.!?…]\s*$", last_word) else PAUSE_IN
            gap = a0 - keep[-1][1]
            if gap <= target:  # pause déjà courte : on la garde telle quelle
                keep[-1][1] = b0
                keep[-1][2] = keep[-1][2] + ids
                prev_hard_end = "end" in hard
                continue
            # on raccourcit : la pause cible est prise du côté « souple » (jamais dans un mot coupé)
            sides = [s_ for s_ in ("prev", "next") if not (s_ == "prev" and prev_hard_end) and not (s_ == "next" and "start" in hard)]
            for s_ in sides:
                if s_ == "prev":
                    keep[-1][1] = min(keep[-1][1] + target / len(sides), a0)
                else:
                    a0 = max(a0 - target / len(sides), keep[-1][1])
        keep.append([a0, b0, list(ids)])
        prev_hard_end = "end" in hard
    keep = [[round(a, 4), round(b, 4)] for a, b, _ in keep if b - a > 0.04]
    kept_dur = sum(b - a for a, b in keep)
    json.dump({"version": 2, "threshold_db": float(thr), "duration": dur, "kept_duration": kept_dur, "keep": keep, "noise_cut": noise_cut, "star_cut": star_cut}, open(f"{out}/keep.json", "w"), indent=1)

    def mmss(t):
        return f"{int(t // 60)}:{t % 60:04.1f}"

    nk = [x for x in noise_cut if any(p[0] - 3 < x[0] < p[1] + 3 for p in keep)]
    lines = [
        "# Dérushage v2 · résumé",
        "",
        f"Micro {mmss(dur)} → gardé **{mmss(kept_dur)}** · {len(keep)} morceaux · pauses ramenées à {PAUSE_IN * 1000:.0f} ms dans une phrase, {PAUSE_END * 1000:.0f} ms entre deux phrases.",
        f"- Sons voisés sans aucun mot, coupés (hésitations, bruits de bouche) : **{len(nk)}** autour des passages gardés.",
        f"- Parole non transcrite ≥ {STAR_MIN * 1000:.0f} ms au milieu d'une phrase gardée (répétitions avalées par Whisper), coupée : **{len(star_cut)}**.",
        "",
        "## Coupes « parole non transcrite » (à vérifier en priorité à l'écoute)",
        "",
    ] + [f"- micro `{mmss(a)}` ({(b - a) * 1000:.0f} ms)" for a, b in star_cut]
    open(f"{out}/coupes_v2.md", "w").write("\n".join(lines) + "\n")
    print(f"v2 : gardé {mmss(kept_dur)} / {mmss(dur)} · {len(keep)} morceaux · {len(nk)} sons sans mot · {len(star_cut)} paroles non transcrites · seuil {thr:.1f} dB")


if __name__ == "__main__":
    main()
