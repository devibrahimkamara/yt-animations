"""Dérushage automatique (PLAYBOOK étape 0bis · passe 1 « cut »), règles : analysis/derush/REGLES.md.

Entrées : mots Whisper horodatés du micro (JSON faster-whisper), audio du micro.
Sorties (dossier de sortie) :
  - keep.json   : segments gardés [début, fin] en temps micro + liste des coupes avec leur raison
  - coupes.md   : le texte complet, coupes barrées et justifiées, cas douteux à part
Usage : derush.py micro_words.json micro.(wav|mp3) dossier_sortie [decisions.json]
  decisions.json (optionnel, recommandé) : les décisions de contenu prises par Claude en relisant la transcription
  comme un monteur (passe « cut » + passe « refining »). Sans lui, les règles automatiques de reprise servent de proposition.
"""
import difflib
import json
import re
import subprocess
import sys
import unicodedata

import numpy as np

SR = 16000
HOP = 0.01  # enveloppe d'énergie par pas de 10 ms

# ─── Réglages (REGLES.md, passe 1) ───
GAP_CUT = 0.18  # on coupe toute pause ≥ 180 ms
PAUSE_IN = 0.10  # pause gardée à l'intérieur d'une phrase
PAUSE_END = 0.20  # pause gardée en fin de phrase / d'idée
PRE_MIN, PRE_MAX = 0.05, 0.12  # marge avant un mot
POST_MIN, POST_MAX = 0.09, 0.20  # marge après un mot
MIN_KEEP = 0.25  # morceau gardé minimum
FILLERS = {"euh", "heu", "hum", "hmm", "bah", "ben", "eh", "euhm", "mmh"}
TAKE_SIGNALS = {"ok", "okay", "vasy", "bon", "attends", "voila", "alors", "donc", "euh"}  # « Ok. » isolé = signal de reprise
MARKERS = ["je recommence", "je refais", "on recommence", "on la refait", "je reprends", "coupe ça", "coupez ça", "attends attends"]


def norm(w):
    w = unicodedata.normalize("NFD", w.lower())
    w = "".join(c for c in w if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9']+", "", w)


def load_audio(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32)


def envelope_db(a):
    n = int(HOP * SR)
    k = len(a) // n
    rms = np.sqrt((a[: k * n].reshape(k, n) ** 2).mean(1) + 1e-12)
    return 20 * np.log10(rms + 1e-9)


def main():
    words_path, audio_path, out = sys.argv[1:4]
    decisions = json.load(open(sys.argv[4])) if len(sys.argv) > 4 else None
    segs = json.load(open(words_path))["segments"]
    W = [dict(w, i=i) for i, w in enumerate(x for s in segs for x in s["words"])]
    a = load_audio(audio_path)
    env = envelope_db(a)
    dur = len(a) / SR

    def e(t0, t1):
        i0, i1 = max(0, int(t0 / HOP)), max(int(t0 / HOP) + 1, int(t1 / HOP))
        return env[i0:i1]

    # Seuil relatif au locuteur
    speech = np.concatenate([e(w["start"], w["end"]) for w in W if w["end"] - w["start"] > 0.05])
    noise = np.percentile(env, 10)
    thr = max(np.median(speech) - 25, noise + 6)
    print(f"niveau parole médian {np.median(speech):.1f} dB · bruit de fond {noise:.1f} dB · seuil {thr:.1f} dB")

    # Marges pilotées par l'énergie (les fins de mot Whisper arrivent tôt sur les sifflantes)
    for w in W:
        s = w["start"]
        back = PRE_MIN
        while back < PRE_MAX and s - back - HOP > 0 and env[int((s - back - HOP) / HOP)] > thr:
            back += HOP
        w["a"] = max(0.0, s - back)
        f = w["end"]
        fwd = POST_MIN
        while fwd < POST_MAX and int((f + fwd) / HOP) < len(env) and env[int((f + fwd) / HOP)] > thr - 6:
            fwd += HOP
        w["b"] = min(dur, f + fwd)

    cuts = []  # (début, fin, raison, catégorie, douteux)
    drop = set()

    # Mots parasites isolés (seulement sans décisions : « eh bien », « bah » en milieu de phrase sont jugés au cas par cas)
    for w in (W if len(sys.argv) <= 4 else []):
        if norm(w["word"]) in FILLERS:
            drop.add(w["i"])
            cuts.append((w["start"], w["end"], "hésitation", "parasite", False))

    # Phrases
    sents, cur = [], []
    for w in W:
        cur.append(w)
        if re.search(r"[.!?…]\s*$", w["word"]):
            sents.append(cur)
            cur = []
    if cur:
        sents.append(cur)
    toks = [[norm(w["word"]) for w in s if norm(w["word"]) and w["i"] not in drop] for s in sents]

    if decisions:
        for c in decisions["cuts"]:
            a_, b_ = c["w"]
            for i in range(a_, b_ + 1):
                drop.add(i)
            cuts.append((W[a_]["start"], W[b_]["end"], c["why"], c["pass"], bool(c.get("doubt"))))
        heuristics = False
    else:
        heuristics = True

    # Consignes parlées au monteur
    for si, s in enumerate(sents if heuristics else []):
        txt = " ".join(toks[si])
        for m in MARKERS:
            if m in txt:
                start = sents[si - 1][0]["start"] if si else s[0]["start"]
                for w in (sents[si - 1] if si else []) + s:
                    drop.add(w["i"])
                cuts.append((start, s[-1]["end"], f"consigne « {m} »", "erreur", True))
                break

    # Signal de reprise : phrase réduite à « Ok. », « Ok. Vas-y. »… (ton signal entre deux prises)
    for si, s in enumerate(sents if heuristics else []):
        if toks[si] and set(toks[si]) <= TAKE_SIGNALS and len(toks[si]) <= 3 and any(t in ("ok", "okay", "vasy") for t in toks[si]):
            for w in s:
                drop.add(w["i"])
            cuts.append((s[0]["start"], s[-1]["end"], "signal de reprise « ok »", "erreur", False))

    # Phrases abandonnées (« … » de Whisper) : prise interrompue
    for si, s in enumerate(sents if heuristics else []):
        if re.search(r"(\.\.\.|…)\s*$", s[-1]["word"]) and not all(w["i"] in drop for w in s):
            for w in s:
                drop.add(w["i"])
            cuts.append((s[0]["start"], s[-1]["end"], "phrase abandonnée (…)", "erreur", len(toks[si]) > 12))

    # Reprises : la même phrase redite dans les 90 s (≤ 12 phrases) → on garde la dernière prise complète
    for si in range(len(sents) if heuristics else 0):
        ti = toks[si]
        if len(ti) < 3 or all(w["i"] in drop for w in sents[si]):
            continue
        for sj in range(si + 1, min(si + 13, len(sents))):
            if sents[sj][0]["start"] - sents[si][-1]["end"] > 90:
                break
            if all(w["i"] in drop for w in sents[sj]):
                continue
            tj = toks[sj]
            n = min(len(ti), len(tj))
            if n < 3:
                continue
            r = difflib.SequenceMatcher(None, ti[:n], tj[:n]).ratio()
            complete = re.search(r"[.!?]\s*$", sents[sj][-1]["word"]) is not None and not sents[sj][-1]["word"].rstrip().endswith("...")
            if r >= 0.6 and complete:
                for w in sents[si]:
                    drop.add(w["i"])
                cuts.append((sents[si][0]["start"], sents[si][-1]["end"], f"reprise : refaite à {sents[sj][0]['start'] // 60:.0f}:{sents[sj][0]['start'] % 60:04.1f} (similarité {r:.0%})", "erreur", r < 0.75))
                # les phrases intermédiaires inachevées = faux départs
                for sk in range(si + 1, sj):
                    if len(toks[sk]) < 0.7 * max(1, len(tj)):
                        for w in sents[sk]:
                            drop.add(w["i"])
                        cuts.append((sents[sk][0]["start"], sents[sk][-1]["end"], "faux départ", "erreur", True))
                break

    # Segments gardés : mots conservés, pauses raccourcies
    kept = [w for w in W if w["i"] not in drop]
    keep = []
    for k, w in enumerate(kept):
        a0, b0 = w["a"], w["b"]
        if k:
            prev = kept[k - 1]
            gap = w["start"] - prev["end"]
            end_of_sentence = re.search(r"[.!?…,:;]\s*$", prev["word"]) is not None
            target = PAUSE_END if end_of_sentence else PAUSE_IN
            if gap >= GAP_CUT and w["i"] == prev["i"] + 1:
                # Pause naturelle : la pause restante = marge après le mot précédent + marge avant le suivant
                # (≈ 140 ms dans une phrase). En fin de phrase, on allonge la traîne jusqu'à la pause cible.
                tail = prev["b"] - prev["end"]
                head = w["start"] - w["a"]
                if tail + head < target:
                    tail = min(gap - head, target - head)
                end_prev = prev["end"] + tail
                if a0 - end_prev > 0.05:
                    keep[-1][1] = end_prev
                    cuts.append((end_prev, a0, f"silence {gap * 1000:.0f} ms → {(tail + head) * 1000:.0f} ms", "silence", False))
                    keep.append([a0, b0])
                else:
                    keep[-1][1] = max(keep[-1][1], b0)
                continue
            if w["i"] != prev["i"] + 1:  # passage coupé entre les deux
                keep.append([a0, b0])
                continue
            keep[-1][1] = max(keep[-1][1], b0)
            continue
        keep.append([a0, b0])
    # fusion des morceaux trop courts ou qui se chevauchent
    merged = []
    for s in keep:
        if merged and (s[0] <= merged[-1][1] + 0.02 or s[1] - s[0] < MIN_KEEP and s[0] - merged[-1][1] < 0.3):
            merged[-1][1] = max(merged[-1][1], s[1])
        else:
            merged.append(list(s))

    # Zones voisées sans mot (hésitations effacées par Whisper) : signalées
    covered = np.zeros(len(env), bool)
    for w in W:
        covered[int(w["start"] / HOP) : int(w["end"] / HOP) + 1] = True
    voiced = env > thr + 6
    probe = voiced & ~covered
    run = 0
    suspects = []
    for i, v in enumerate(probe):
        run = run + 1 if v else 0
        if run == 15:  # ≥ 150 ms de voix sans mot
            suspects.append(round((i - 14) * HOP, 2))

    kept_dur = sum(b - a for a, b in merged)
    json.dump(
        {"threshold_db": float(thr), "duration": dur, "kept_duration": kept_dur, "keep": merged, "cuts": cuts, "unworded_voice": suspects},
        open(f"{out}/keep.json", "w"),
        indent=1,
    )

    # coupes.md
    def mmss(t):
        return f"{int(t // 60)}:{t % 60:04.1f}"

    lines = [
        "# Dérushage · passe 1 « cut » (à valider)",
        "",
        f"Durée micro : **{mmss(dur)}** → gardé : **{mmss(kept_dur)}** ({kept_dur / dur:.0%}). Seuil de silence : {thr:.1f} dBFS (relatif à ta voix).",
        "",
        "Légende : ~~barré~~ = coupé · [raison] · ⚠️ = cas douteux à trancher.",
        "",
    ]
    # Texte complet : passages coupés barrés, regroupés, avec leur raison (✂ cut · ✦ refining)
    owner = {}
    if decisions:
        for k, c in enumerate(decisions["cuts"]):
            for i in range(c["w"][0], c["w"][1] + 1):
                owner[i] = k
    para, cur_cut, buf = [], None, []

    def flush():
        nonlocal buf, cur_cut
        if not buf:
            return
        txt = "".join(buf).strip()
        if cur_cut is None:
            para.append(txt)
        else:
            c = decisions["cuts"][cur_cut] if decisions else None
            icon = "✦" if c and c["pass"] == "refining" else "✂"
            why = f" *[{icon} {c['why']}]*{' ⚠️' if c.get('doubt') else ''}" if c else ""
            para.append(f"~~{txt}~~{why}")
        buf = []

    last_t = -99
    for w in W:
        k = owner.get(w["i"]) if w["i"] in drop else None
        if w["start"] - last_t > 20 and k is None and cur_cut is None:  # nouveau paragraphe (~20 s), jamais au milieu d'une coupe
            flush()
            if para:
                lines.append(" ".join(para))
                lines.append("")
                para = []
            lines.append(f"**`{mmss(w['start'])}`**")
            last_t = w["start"]
        if k != cur_cut:
            flush()
            cur_cut = k
        buf.append(w["word"])
    flush()
    lines.append(" ".join(para))
    lines += ["", "## Cas douteux (à trancher)", ""]
    for c in cuts:
        if c[4]:
            lines.append(f"- `{mmss(c[0])} → {mmss(c[1])}` {c[2]}")
    if decisions and decisions.get("flags"):
        lines += ["", "## Points d'attention (brief de la marque)", ""] + [f"- {x}" for x in decisions["flags"]]
    if suspects:
        lines += ["", f"## Voix sans mot transcrit ({len(suspects)} zones, hésitations probables)", "", ", ".join(mmss(t) for t in suspects[:80])]
    open(f"{out}/coupes.md", "w").write("\n".join(lines) + "\n")
    by = {}
    for c in cuts:
        by[c[3]] = by.get(c[3], 0) + (c[1] - c[0])
    print(f"gardé {mmss(kept_dur)} / {mmss(dur)} · {len(merged)} segments · seuil {thr:.1f} dB · retiré : " + ", ".join(f"{k} {mmss(v)}" for k, v in by.items()))


if __name__ == "__main__":
    main()
