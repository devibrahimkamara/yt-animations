"""Montage express Higgsfield Showroom (comparatif 9 IA vidéo, 22/10/2026). ffmpeg seul, repris de higgs-gen.
Chaque segment est rendu AVEC son audio (voix traitée, son des clips, silence), puis concat + musique + SFX au final.
Usage : python3 build.py [voice|parts|final|all] [seg ...]
Chemins : HG_DL (rushs + clips), HG_REPO, HG_FONT. Rendu libx264 sous Linux.
"""
import os, subprocess, sys, json
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.abspath(__file__))
DL = os.environ.get("HG_DL", "/Users/ibrahimkamara/Downloads")
FACE = os.environ.get("HG_FACE", f"{DL}/drive-download-20261022T104147Z-1-001/Higgsfield Showroom Footage.mp4")
SCREEN = os.environ.get("HG_SCREEN", f"{DL}/Higgsfield Showroom Screen Record.mp4")
REPO = os.environ.get("HG_REPO", "/Users/ibrahimkamara/yt-animations")
MUSIC = f"{REPO}/public/epidemic/higgs-influ3/hq"
SFX = f"{REPO}/public/sfx"
FONT = os.environ.get("HG_FONT", "/Users/ibrahimkamara/Library/Fonts/Inter-VariableFont_opsz,wght.ttf")
CARDS = f"{ROOT}/cards"; PARTS = f"{ROOT}/parts"
os.makedirs(CARDS, exist_ok=True); os.makedirs(PARTS, exist_ok=True)

BG = (9, 11, 8); SURF = (18, 22, 15); TXT = (242, 245, 236); LIME = (198, 243, 109); LIME_BG = (30, 39, 18); RED = (235, 87, 87)
LINUX = sys.platform.startswith("linux")
VENC = (["-c:v", "libx264", "-preset", "fast", "-crf", "17"] if LINUX else ["-c:v", "h264_videotoolbox", "-b:v", "18M"]) + ["-pix_fmt", "yuv420p", "-r", "30"]
AENC = ["-c:a", "pcm_s16le", "-ar", "48000", "-ac", "2"]
END = 676.3
BUBBLE_CROP = "600:600:680:60"
VOICE = f"{PARTS}/voice_proc.wav"
EUR = 0.03   # ≈ 59 $ / 1 800 crédits (offre Max annuelle)

# modèle : (fichier, crédits, mention, nom affiché)
M = {
    "kling3": ("kling 3-0.mp4", 20, "8 s · 16:9 · 1080p", "Kling 3.0"),
    "minimax": ("minimax h3.mp4", 18, "8 s · format et 2K imposés", "MiniMax H3"),
    "wan": ("wan 3-0.mp4", 28, "8 s · format auto · 1080p", "Wan 3.0"),
    "grok": ("grok 1-5.mp4", 64, "8 s · format auto · 1080p", "Grok Imagine 1.5"),
    "flux": ("flux 3.mp4", 64, "8 s · 16:9 · 1080p", "FLUX 3"),
    "gemini": ("Gemini Omni Flash 1-1.mp4", 36, "8 s · 16:9 · 1080p", "Gemini Omni Flash 1.1"),
    "seed25": ("seedance 2-5.mp4", 128, "8 s · 16:9 · 1080p", "Seedance 2.5"),
    "kling4": ("kling 4-0.mp4", 120, "8 s · 16:9 · 1080p · testé sur kling.ai", "Kling 4.0"),
}
def eur(k):
    return "crédits Kling" if k == "kling4" else f"≈ {M[k][1] * EUR:.2f} €".replace(".", ",")


def font(size, weight="Bold"):
    f = ImageFont.truetype(FONT, size)
    try: f.set_variation_by_name(weight)
    except Exception: pass
    return f


def card(name, lines, size=58, pill=None, accent=None, pill_color=None):
    path = f"{CARDS}/{name}.png"
    f = font(size); fp = font(int(size * 0.5), "SemiBold")
    pad = int(size * 0.6); gap = int(size * 0.28)
    d0 = ImageDraw.Draw(Image.new("RGBA", (10, 10)))
    pw = d0.textlength(pill, font=fp) + size * 0.7 if pill else 0
    w = int(max([d0.textlength(l, font=f) for l in lines] + [pw]) + 2 * pad)
    ph = int(size * 0.95) if pill else 0
    h = int(pad * 2 + len(lines) * size * 1.18 + (ph + gap if pill else 0))
    im = Image.new("RGBA", (w + 60, h + 60), (0, 0, 0, 0))
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).rounded_rectangle([30, 40, w + 30, h + 40], 28, fill=(0, 0, 0, 150))
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(18)))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([30, 30, w + 30, h + 30], 28, fill=SURF + (238,), outline=(255, 255, 255, 26), width=2)
    y = 30 + pad
    if pill:
        pc, tc = (pill_color, BG) if pill_color else (LIME_BG, LIME)
        d.rounded_rectangle([30 + pad, y, 30 + pad + pw, y + ph], ph // 2, fill=pc)
        d.text((30 + pad + size * 0.35, y + ph / 2), pill, font=fp, fill=tc, anchor="lm")
        y += ph + gap
    for l in lines:
        x = 30 + pad
        if accent and accent in l:
            a, b = l.split(accent, 1)
            d.text((x, y), a, font=f, fill=TXT); x += d.textlength(a, font=f)
            d.text((x, y), accent, font=f, fill=LIME); x += d.textlength(accent, font=f)
            d.text((x, y), b, font=f, fill=TXT)
        else:
            d.text((x, y), l, font=f, fill=TXT)
        y += size * 1.18
    im.save(path)
    return path, im.size


def fullcard(name, pill, lines, accent=None, alpha=235, size=92):
    path = f"{CARDS}/{name}.png"
    im = Image.new("RGBA", (1920, 1080), BG + (alpha,)); d = ImageDraw.Draw(im)
    fp = font(40, "SemiBold"); ft = font(size); lh = int(size * 1.2)
    pw = d.textlength(pill, font=fp) + 56
    y0 = 540 - (len(lines) * lh) // 2 - 70
    d.rounded_rectangle([960 - pw / 2, y0 - 33, 960 + pw / 2, y0 + 33], 33, fill=LIME_BG)
    d.text((960, y0), pill, font=fp, fill=LIME, anchor="mm")
    for i, l in enumerate(lines):
        y = y0 + 130 + i * lh
        if accent and accent in l:
            a, b = l.split(accent, 1); wa, wc, wb = (d.textlength(s, font=ft) for s in (a, accent, b))
            x = 960 - (wa + wc + wb) / 2
            d.text((x, y), a, font=ft, fill=TXT, anchor="lm"); d.text((x + wa, y), accent, font=ft, fill=LIME, anchor="lm")
            d.text((x + wa + wc, y), b, font=ft, fill=TXT, anchor="lm")
        else:
            d.text((960, y), l, font=ft, fill=TXT, anchor="mm")
    im.save(path)
    return path, im.size


def prompt_card():
    path = f"{CARDS}/prompt.png"
    im = Image.new("RGBA", (1920, 1080), BG + (245,)); d = ImageDraw.Draw(im)
    fp = font(40, "SemiBold"); f = font(44, "Medium"); fb = font(44)
    pill = "LE PROMPT · IDENTIQUE POUR LES 9 IA"; pw = d.textlength(pill, font=fp) + 56
    d.rounded_rectangle([960 - pw / 2, 90, 960 + pw / 2, 156], 33, fill=LIME_BG); d.text((960, 123), pill, font=fp, fill=LIME, anchor="mm")
    txt = open(os.path.join(ROOT, "..", "00-brief", "prompt.txt"), encoding="utf-8").read().strip()
    words = txt.split(); lines = []; cur = ""
    for w in words:
        if d.textlength(cur + " " + w, font=f) > 1560: lines.append(cur); cur = w
        else: cur = (cur + " " + w).strip()
    lines.append(cur)
    y = 230
    for l in lines:
        x = 180
        for w in l.split(" "):
            hi = any(k in w for k in ("Ghislaine", "Vauquelin", "Desrosiers", "LUNÉA", "Lunéa"))
            ff = fb if hi else f
            d.text((x, y), w, font=ff, fill=LIME if hi else TXT); x += d.textlength(w + " ", font=ff)
        y += 64
    d.text((960, y + 40), "8 secondes · 16:9 · 1080p · son activé", font=font(40, "SemiBold"), fill=(170, 175, 165), anchor="mm")
    im.save(path)
    return path


def table(name, title, order, new=None, final=False):
    """Tableau de classement : order = liste de clés de M ; new = ligne mise en avant."""
    path = f"{CARDS}/{name}.png"
    im = Image.new("RGBA", (1920, 1080), BG + (240,)); d = ImageDraw.Draw(im)
    fp = font(40, "SemiBold"); fr = font(52); fm = font(42, "SemiBold")
    pw = d.textlength(title, font=fp) + 56
    d.rounded_rectangle([960 - pw / 2, 60, 960 + pw / 2, 126], 33, fill=LIME_BG); d.text((960, 93), title, font=fp, fill=LIME, anchor="mm")
    rows = list(order) + (["seed20"] if final else [])
    n = len(rows); rh = min(96, int(800 / max(n, 1)))
    y = 170 + (800 - n * rh) // 2
    for i, k in enumerate(rows):
        hi = (k == new)
        d.rounded_rectangle([300, y, 1620, y + rh - 14], 20, fill=(32, 42, 20, 255) if hi else SURF + (255,),
                            outline=LIME + (255,) if hi else (255, 255, 255, 20), width=3 if hi else 2)
        cy = y + (rh - 14) / 2
        if k == "seed20":
            d.text((360, cy), "—", font=fr, fill=(150, 150, 150), anchor="lm")
            d.text((460, cy), "Seedance 2.0", font=fr, fill=(150, 150, 150), anchor="lm")
            d.text((1580, cy), "refusé (contenu protégé)", font=fm, fill=RED, anchor="rm")
        else:
            d.text((360, cy), str(i + 1), font=fr, fill=LIME if i == 0 else TXT, anchor="lm")
            d.text((460, cy), M[k][3], font=fr, fill=TXT, anchor="lm")
            d.text((1300, cy), f"{M[k][1]} cr", font=fm, fill=(200, 205, 195), anchor="rm")
            d.text((1580, cy), eur(k), font=fm, fill=(200, 205, 195), anchor="rm")
        y += rh
    d.text((960, 1020), "Prix estimé : 1 crédit ≈ 0,03 € (offre Max annuelle) · Kling 4.0 testé sur kling.ai", font=font(28, "Medium"), fill=(140, 145, 135), anchor="mm")
    im.save(path)
    return path


def categories():
    path = f"{CARDS}/categories.png"
    im = Image.new("RGBA", (1920, 1080), BG + (240,)); d = ImageDraw.Draw(im)
    fp = font(40, "SemiBold"); fa = font(40, "SemiBold"); fb = font(56)
    t = "QUEL MODÈLE POUR QUOI ?"; pw = d.textlength(t, font=fp) + 56
    d.rounded_rectangle([960 - pw / 2, 70, 960 + pw / 2, 136], 33, fill=LIME_BG); d.text((960, 103), t, font=fp, fill=LIME, anchor="mm")
    R = [("Le meilleur rendu global", "Seedance 2.5 · 128 cr"), ("Le plus réaliste, cinématique", "FLUX 3 · 64 cr"),
         ("Meilleur rapport qualité-prix + voix FR", "Wan 3.0 · 28 cr"), ("Vidéos sans voix, petit budget", "Kling 3.0 / MiniMax H3 · ~20 cr"),
         ("La déception", "Kling 4.0")]
    y = 200
    for a, b in R:
        d.rounded_rectangle([260, y, 1660, y + 140], 24, fill=SURF + (255,), outline=(255, 255, 255, 20), width=2)
        d.text((310, y + 40), a, font=fa, fill=(170, 175, 165), anchor="lm")
        d.text((310, y + 96), b, font=fb, fill=RED if "déception" in a else LIME, anchor="lm")
        y += 160
    im.save(path)
    return path


def bubble_assets():
    mk, rg = f"{CARDS}/bub_mask.png", f"{CARDS}/bub_ring.png"
    m = Image.new("L", (1120, 1120), 0); ImageDraw.Draw(m).ellipse([0, 0, 1119, 1119], fill=255); m.resize((280, 280), Image.LANCZOS).save(mk)
    r = Image.new("RGBA", (1152, 1152), (0, 0, 0, 0)); ImageDraw.Draw(r).ellipse([8, 8, 1143, 1143], outline=LIME + (255,), width=16)
    r.resize((288, 288), Image.LANCZOS).save(rg)
    return mk, rg


# ---------------------------------------------------------------- timeline
# kind : face | screen | full (carte plein écran sur la voix) | clip (insert, son du clip) | table (insert muet) | cold | grid
def build_specs():
    C = {}
    def c(name, *a, **k): C[name] = card(name, *a, **k)
    c("q", ["Quel modèle utiliser pour ton projet,", "et combien ça coûte"], 56, accent="combien ça coûte")
    c("anglais", ["Les comparatifs d'IA vidéo :", "presque toujours en anglais"], 56, accent="en anglais")
    c("fr", ["Ici : une pub 100 % en français"], 58, accent="100 % en français")
    c("meme", ["Même prompt pour toutes les IA"], 58, accent="Même prompt")
    c("collab", ["Higgsfield"], 50, pill="COLLABORATION COMMERCIALE", accent="Higgsfield")
    c("regles", ["Tous les modèles sur Higgsfield", "même prompt · mêmes réglages"], 54, accent="même prompt · mêmes réglages")
    c("k4", ["Kling 4.0 : pas encore sur Higgsfield", "→ testé directement sur kling.ai"], 50, accent="kling.ai")
    c("fiche", ["Chaque vidéo en plein écran, avec le son", "nom · crédits · prix estimé en €"], 52, accent="crédits · prix estimé en €")
    c("refus", ["Seedance 2.0 : refusé", "« contenu protégé » · crédits remboursés"], 52, pill="ÉLIMINÉ", accent="refusé", pill_color=RED)
    c("bouton", ["Le prix s'affiche sur le bouton, avant de générer"], 46, accent="avant de générer")
    for k, (fn, cr, note, nm) in M.items():
        c(f"p_{k}", [f"{nm} · {cr} crédits"], 50, accent=f"{cr} crédits")
    c("p_seed20", ["Seedance 2.0 · 96 crédits"], 50, accent="96 crédits")
    c("cta", ["Teste les modèles sur Higgsfield : 1er lien", "de la description + commentaire épinglé"], 52, accent="1er lien")
    c("next", ["La suite logique", "à regarder ensuite"], 56, pill="VIDÉO SUIVANTE", accent="à regarder")
    C["prompt"] = (prompt_card(), (1920, 1080))
    order = []
    def T(name, ranking, new):
        return dict(n=name, kind="table", png=table(name, "CLASSEMENT PROVISOIRE", ranking, new), dur=4.0)

    def lower(name):
        w, h = C[name][1]; return (1920 - w) // 2, 1080 - h - 40
    def top(name):
        w, h = C[name][1]; return (1920 - w) // 2, 30
    def at(t0, t1, name, pos=lower):
        x, y = pos(name); return (t0, t1, C[name][0], x, y)
    def full(t0, t1, name):
        return (t0, t1, C[name][0], 0, 0)

    Z = (300, 860, 1.7)
    S = []
    S.append(dict(n="cold", kind="cold"))
    S.append(dict(n="h1", kind="grid", s0=0.0, s1=14.6))
    S.append(dict(n="h2", kind="face", s0=14.6, s1=21.4, z=1.12, cards=[at(14.8, 21.2, "q")]))
    S.append(dict(n="i1", kind="face", s0=21.4, s1=49.7, z=1.0, cards=[at(21.6, 30.3, "anglais"), at(30.5, 38.1, "fr"), at(46.6, 49.5, "meme")]))
    S.append(dict(n="i2", kind="face", s0=49.7, s1=62.4, z=1.0, cards=[full(49.8, 62.3, "prompt")]))
    S.append(dict(n="i3", kind="face", s0=62.4, s1=97.0, z=1.12, cards=[(62.6, 70.0, C["collab"][0], 60, 40), at(64.0, 77.5, "regles"), at(78.0, 94.5, "k4")]))
    # génération à l'écran (bulle) : prix sur le bouton
    S.append(dict(n="g1", kind="screen", s0=97.0, s1=231.0,
                  zoom=[(150.0, 157.0, *Z), (172.0, 178.0, *Z), (211.5, 216.0, *Z)],
                  cards=[at(101.0, 108.0, "regles", top), at(150.3, 158.0, "p_seed20", top), at(160.0, 166.0, "bouton", top),
                         at(172.0, 181.0, "p_kling3", top), at(211.0, 217.0, "p_minimax", top)]))
    S.append(dict(n="g2", kind="screen", s0=231.0, s1=347.0,
                  zoom=[(231.0, 234.5, *Z), (246.0, 250.0, *Z), (262.0, 265.0, *Z), (274.0, 277.5, *Z), (295.5, 299.5, *Z)],
                  cards=[at(231.0, 236.0, "p_wan", top), at(246.0, 252.0, "p_grok", top), at(262.0, 267.0, "p_flux", top),
                         at(274.0, 279.0, "p_gemini", top), at(295.5, 301.0, "p_seed25", top), at(306.0, 316.0, "k4", top), at(330.5, 337.0, "p_kling4", top)]))
    S.append(dict(n="f1", kind="face", s0=347.0, s1=368.2, z=1.0, cards=[at(352.0, 367.8, "fiche")]))
    # résultats : clip en entier → avis → classement provisoire
    S.append(dict(n="r0", kind="screen", s0=368.2, s1=395.4, zoom=[(372.0, 382.0, 700, 420, 1.6)], cards=[at(372.5, 383.0, "refus")]))
    seq = [("kling3", 395.4, 429.4, 432.7), ("minimax", 432.7, 464.4, 466.8), ("wan", 466.8, 499.2, 502.3), ("grok", 502.3, 520.5, 523.2),
           ("flux", 523.2, 568.85, 571.8), ("gemini", 571.8, 587.55, 594.2), ("seed25", 594.2, 624.4, 631.7)]
    rankings = {"kling3": ["kling3"], "minimax": ["minimax", "kling3"], "wan": ["wan", "minimax", "kling3"],
                "grok": ["wan", "minimax", "kling3", "grok"], "flux": ["flux", "wan", "minimax", "kling3", "grok"],
                "gemini": ["flux", "wan", "gemini", "minimax", "kling3", "grok"],
                "seed25": ["seed25", "flux", "wan", "gemini", "minimax", "kling3", "grok"]}
    for i, (k, a, b, nxt) in enumerate(seq):
        S.append(dict(n=f"c_{k}", kind="clip", key=k))
        S.append(dict(n=f"r_{k}", kind="screen", s0=a, s1=b))
        S.append(T(f"t_{k}", rankings[k], k))
        S.append(dict(n=f"r_{k}b", kind="screen", s0=b, s1=nxt))
    S.append(dict(n="c_kling4", kind="clip", key="kling4"))
    S.append(dict(n="r_kling4", kind="screen", s0=631.7, s1=648.6))
    final = ["seed25", "flux", "wan", "gemini", "minimax", "kling3", "grok", "kling4"]
    C["final"] = (table("final", "CLASSEMENT FINAL", final, None, final=True), (1920, 1080))
    C["cats"] = (categories(), (1920, 1080))
    S.append(dict(n="fin", kind="face", s0=648.6, s1=END, z=1.0,
                  cards=[full(648.7, 658.4, "final"), full(658.5, 667.6, "cats"), at(667.8, 672.6, "cta"), at(672.8, 676.2, "next")]))
    return S


def zoom_expr(zooms, base):
    t = f"({base}+in/30)"
    zz, xs, ys = "1", "0", "0"
    for t0, t1, cx, cy, z in zooms:
        r = f"(if(lt({t},{t0}),0,if(lt({t},{t0}+0.6),({t}-{t0})/0.6,if(lt({t},{t1}-0.6),1,if(lt({t},{t1}),({t1}-{t})/0.6,0)))))"
        zz += f"+({z}-1)*({r}*{r}*(3-2*{r}))"
        xs = f"if(between({t},{t0},{t1}),{cx},{xs})"; ys = f"if(between({t},{t0},{t1}),{cy},{ys})"
    x = f"max(0,min(iw-iw/zoom,({xs})-iw/zoom/2))"; y = f"max(0,min(ih-ih/zoom,({ys})-ih/zoom/2))"
    return f"zoompan=z='{zz}':x='{x}':y='{y}':d=1:s=1920x1080:fps=30"


def overlay_cards(inputs, chain, cards, base, dur):
    f = []; last = chain
    for k, (t0, t1, png, x, y) in enumerate(cards):
        a, b = max(0, t0 - base), min(dur, t1 - base)
        if b <= a: continue
        idx = inputs.count("-i"); inputs += ["-loop", "1", "-t", f"{b:.3f}", "-i", png]
        f.append(f"[{idx}:v]format=rgba,fade=in:st={a:.3f}:d=0.25:alpha=1,fade=out:st={max(a, b - 0.3):.3f}:d=0.3:alpha=1[c{k}]")
        f.append(f"[{last}][c{k}]overlay={x}:{y}:enable='between(t,{a:.3f},{b:.3f})'[o{k}]"); last = f"o{k}"
    return f, last


def add_bubble(inputs, f, last, s0, dur):
    mk, rg = bubble_assets()
    fi = inputs.count("-i"); inputs += ["-ss", f"{s0}", "-t", f"{dur}", "-i", FACE]
    mi = inputs.count("-i"); inputs += ["-loop", "1", "-t", f"{dur}", "-i", mk]
    ri = inputs.count("-i"); inputs += ["-loop", "1", "-t", f"{dur}", "-i", rg]
    f.append(f"[{last}]split[sa][sb];[sa]scale=1920:1080,gblur=sigma=30,eq=brightness=-0.12[bg];[sb]scale=1700:956[fg];[bg][fg]overlay=16:62[cmp];"
             f"[{fi}:v]fps=30,crop={BUBBLE_CROP},scale=280:280,format=rgba[fc];[{mi}:v]format=gray,scale=280:280[mk];[fc][mk]alphamerge[fm];"
             f"[cmp][fm]overlay=1616:776:shortest=1[c1];[c1][{ri}:v]overlay=1612:772:shortest=1[v0]")


def fit(lin, lout):
    return (f"[{lin}]split[fa][fb];[fa]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,gblur=sigma=40,eq=brightness=-0.25[fbg];"
            f"[fb]scale=1920:1080:force_original_aspect_ratio=decrease[ffg];[fbg][ffg]overlay=(W-w)/2:(H-h)/2,setsar=1,fps=30[{lout}]")


def clip_path(k): return f"{DL}/{M[k][0]}"
def clip_dur(k):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", clip_path(k)], capture_output=True, text=True)
    return float(r.stdout.strip())


def voice():
    """Voix traitée une fois pour toute la vidéo."""
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", FACE, "-vn", "-af",
                    "highpass=f=70,acompressor=threshold=-20dB:ratio=3:attack=5:release=120,loudnorm=I=-15:TP=-1.5:LRA=9", *AENC, VOICE], check=True)
    print("ok voice", flush=True)


def render(seg):
    out = f"{PARTS}/{seg['n']}.mov"; kind = seg["kind"]; inputs = []; f = []; amap = None
    if kind in ("face", "screen", "grid"):
        dur = seg["s1"] - seg["s0"]
        if kind == "face":
            inputs = ["-ss", f"{seg['s0']}", "-t", f"{dur}", "-i", FACE]
            z = seg.get("z", 1.0)
            f.append(f"[0:v]scale={int(1920 * z) // 2 * 2}:-2,crop=1920:1080:(iw-1920)/2+40:(ih-1080)/2-{int(30 * (z - 1) * 10)},setsar=1,fps=30[v0]" if z != 1.0 else "[0:v]fps=30,setsar=1[v0]")
        elif kind == "screen":
            inputs = ["-ss", f"{seg['s0']}", "-t", f"{dur}", "-i", SCREEN]
            last = "s0"; f.append(f"[0:v]fps=30,setsar=1[{last}]")
            if seg.get("zoom"):
                f.append(f"[{last}]{zoom_expr(seg['zoom'], seg['s0'])}[zm]"); last = "zm"
            add_bubble(inputs, f, last, seg["s0"], dur)
        else:  # grille des 8 clips, muets, sous la voix
            keys = ["kling3", "minimax", "wan", "grok", "flux", "gemini", "seed25", "kling4"]
            inputs = ["-f", "lavfi", "-t", f"{dur}", "-i", "color=c=0x090b08:s=1920x1080:r=30"]
            f.append("[0:v]null[g0]"); last = "g0"
            for i, k in enumerate(keys):
                ii = inputs.count("-i"); inputs += ["-stream_loop", "-1", "-t", f"{dur}", "-i", clip_path(k)]
                x = 40 + (i % 4) * 465; y = 210 + (i // 4) * 290
                f.append(f"[{ii}:v]scale=445:250:force_original_aspect_ratio=increase,crop=445:250,setsar=1,fps=30,fade=in:st={0.15 * i}:d=0.3[k{i}];[{last}][k{i}]overlay={x}:{y}[g{i + 1}]")
                last = f"g{i + 1}"
            hd, _ = card("grid_t", ["9 IA vidéo · 1 seul prompt · en français"], 54, accent="1 seul prompt")
            ii = inputs.count("-i"); inputs += ["-loop", "1", "-t", f"{dur}", "-i", hd]
            f.append(f"[{last}][{ii}:v]overlay=(W-w)/2:40[v0]")
        ai = inputs.count("-i"); inputs += ["-ss", f"{seg['s0']}", "-t", f"{dur}", "-i", VOICE]; amap = f"{ai}:a"
    elif kind == "clip":
        k = seg["key"]; dur = clip_dur(k) + 0.3; seg["s0"] = 0.0
        inputs = ["-i", clip_path(k)]
        f.append(fit("0:v", "s0") + ";[s0]tpad=stop_mode=clone:stop_duration=1[v0]")
        nm, (w1, h1) = card(f"nm_{k}", [M[k][3]], 60, pill="RÉSULTAT")
        pr, (w2, h2) = card(f"pr_{k}", [f"{M[k][1]} crédits · {eur(k)}", M[k][2]], 40, accent=f"{M[k][1]} crédits")
        seg["cards"] = [(0.0, dur, nm, 20, 20), (0.0, dur, pr, 20, 1080 - h2 - 20)]
        f2 = f"[0:a]loudnorm=I=-16:TP=-1.5,apad=pad_dur=1[aa]"; f.append(f2); amap = "[aa]"
    elif kind in ("table", "cold"):
        if kind == "table":
            dur = seg["dur"]; seg["s0"] = 0.0
            inputs = ["-loop", "1", "-t", f"{dur}", "-i", seg["png"]]
            f.append("[0:v]fps=30,format=yuv420p,setsar=1,fade=in:d=0.25[v0]")
            ai = inputs.count("-i"); inputs += ["-f", "lavfi", "-t", f"{dur}", "-i", "anullsrc=r=48000:cl=stereo"]; amap = f"{ai}:a"
        else:
            # cold open : 3 extraits sur le nom piège, anonymes (IA n°1, 2, 3)
            pick = [("kling3", 3.0, 3.4), ("wan", 0.9, 3.4), ("seed25", 3.5, 3.4)]
            dur = sum(p[2] for p in pick) + 1.6; seg["s0"] = 0.0
            parts_v, parts_a = [], []
            for i, (k, ss, dd) in enumerate(pick):
                inputs += ["-ss", f"{ss}", "-t", f"{dd}", "-i", clip_path(k)]
                lab, _ = card(f"cold{i}", [f"IA n°{i + 1}"], 56)
                li = inputs.count("-i"); inputs += ["-loop", "1", "-t", f"{dd}", "-i", lab]
                f.append(fit(f"{2 * i}:v", f"cv{i}") + f";[cv{i}][{li}:v]overlay=40:40,trim=duration={dd},setpts=PTS-STARTPTS,format=yuv420p[cw{i}]")
                f.append(f"[{2 * i}:a]loudnorm=I=-16,aformat=sample_rates=48000:channel_layouts=stereo,atrim=duration={dd},asetpts=PTS-STARTPTS[ca{i}]")
                parts_v.append(f"[cw{i}]"); parts_a.append(f"[ca{i}]")
            q = fullcard("coldq", "UN SEUL PROMPT", ["Laquelle prononce le mieux", "« Ghislaine Vauquelin-Desrosiers » ?"], accent="« Ghislaine Vauquelin-Desrosiers » ?", size=70)[0]
            qi = inputs.count("-i"); inputs += ["-loop", "1", "-t", "1.6", "-i", q]
            si = inputs.count("-i"); inputs += ["-f", "lavfi", "-t", "1.6", "-i", "anullsrc=r=48000:cl=stereo"]
            f.append(f"[{qi}:v]fps=30,format=yuv420p,setsar=1[cq]")
            f.append(f"{''.join(pv + pa for pv, pa in zip(parts_v, parts_a))}[cq][{si}:a]concat=n=4:v=1:a=1[v0][ca]")
            amap = "[ca]"
    last = "v0"
    g, last = overlay_cards(inputs, last, seg.get("cards", []), seg.get("s0", 0.0), dur); f += g
    f.append(f"[{last}]format=yuv420p,trim=duration={dur:.3f}[vout]")
    amap_arg = amap if amap.startswith("[") else amap
    cmd = ["ffmpeg", "-v", "error", "-y"] + inputs + ["-filter_complex", ";".join(f), "-map", "[vout]", "-map", amap_arg,
                                                      "-t", f"{dur:.3f}"] + VENC + AENC + [out]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print(seg["n"], "ERREUR", r.stderr[-1800:]); sys.exit(1)
    print("ok", seg["n"], f"{dur:.1f}s", flush=True)


def probe(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], capture_output=True, text=True)
    return float(r.stdout.strip())


def final(specs):
    """Concat vidéo+voix/clips, puis musique (coupée pendant les clips) + SFX."""
    lst = f"{PARTS}/list.txt"; durs = []
    with open(lst, "w") as fh:
        for s in specs:
            fh.write(f"file '{PARTS}/{s['n']}.mov'\n"); durs.append((s, probe(f"{PARTS}/{s['n']}.mov")))
    base = f"{PARTS}/concat.mov"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", base], check=True)
    total = probe(base)
    # musique : une piste continue par grande partie, volume 0 pendant les clips et le cold open
    tracks = [("m0_out_there.mp3", lambda n: n in ("h1", "h2", "i1", "i2", "i3")), ("m3_in_the_gloom.mp3", lambda n: n.startswith("g") or n == "f1"),
              ("m4_sonar.mp3", lambda n: n.startswith("r") or n.startswith("t_") or n == "fin")]
    inp = ["-i", base]; f = []; labs = []
    t = 0.0; spans = []
    for s, d in durs:
        spans.append((s["n"], s["kind"], t, t + d)); t += d
    for ti, (fn, pred) in enumerate(tracks):
        ii = inp.count("-i"); inp += ["-stream_loop", "-1", "-i", f"{MUSIC}/{fn}"]
        on = [(a, b) for n, k, a, b in spans if pred(n) and k != "clip"]
        if not on: continue
        expr = "+".join(f"between(t,{a:.2f},{b:.2f})" for a, b in on)
        f.append(f"[{ii}:a]atrim=0:{total:.2f},loudnorm=I=-32,volume='if({expr},1,0)':eval=frame,lowpass=f=12000[m{ti}]"); labs.append(f"[m{ti}]")
    sfx = []
    for n, k, a, b in spans:
        if k == "clip": sfx += [(a - 0.1, "impact_fast_hit__mk2180.mp3", 0.45)]
        elif k == "table": sfx += [(a, "whoosh_fast__mk1490.mp3", 0.4), (a + 0.3, "pop_long__mk2358.mp3", 0.35)]
        elif k == "cold": sfx += [(a, "impact_whoosh_deep__mk1143.mp3", 0.5)]
        elif n in ("g1", "f1", "r0"): sfx += [(a, "impact_quick_zoom__mk772.mp3", 0.45)]
    for k, (fn, vol) in enumerate([(x[1], x[2]) for x in sfx]):
        ii = inp.count("-i"); inp += ["-i", f"{SFX}/{fn}"]
        f.append(f"[{ii}:a]volume={vol},adelay={max(0, int(sfx[k][0] * 1000))}:all=1[s{k}]"); labs.append(f"[s{k}]")
    f.append(f"[0:a]{''.join(labs)}amix=inputs={1 + len(labs)}:normalize=0:duration=first,alimiter=limit=0.95[aout]")
    out = f"{ROOT}/../07-final/higgs_showroom_x1.00.mp4"; os.makedirs(os.path.dirname(out), exist_ok=True)
    cmd = ["ffmpeg", "-v", "error", "-y"] + inp + ["-filter_complex", ";".join(f), "-map", "0:v", "-map", "[aout]",
                                                   "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", out]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print("final ERREUR", r.stderr[-2000:]); sys.exit(1)
    json.dump([(n, k, round(a, 2), round(b, 2)) for n, k, a, b in spans], open(f"{PARTS}/timeline.json", "w"), indent=0)
    print("ok final", out, f"{total:.1f}s")


if __name__ == "__main__":
    what = sys.argv[1] if len(sys.argv) > 1 else "all"
    specs = build_specs()
    only = sys.argv[2:] if len(sys.argv) > 2 else None
    if what in ("voice", "all") and not os.path.exists(VOICE): voice()
    if what in ("parts", "all"):
        for s in specs:
            if not only or s["n"] in only: render(s)
    if what in ("final", "all"): final(specs)
