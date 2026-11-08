"""Montage express Higgsfield General (22/10/2026) : ffmpeg seul, repris de higgs-katana/02-build/build.py.
Usage : python3 build.py [parts|audio|final|all] [seg_name ...]
"""
import os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.environ.get("HG_SRC", "/Users/ibrahimkamara/Downloads/higgs gen campaign")
FACE = f"{SRC}/Higgsfield General Campaign Footage.mp4"
SCREEN = f"{SRC}/Higgsfield General Campaign Screen Capture.mp4"
CAP = f"{ROOT}/../03-captures"
CAPVID = f"{CAP}/cap2_utile.mp4"          # ma capture du site (2940x1912), utile de 4 à 44 s
CAP_CROP = "2634:1482:153:430"           # zone de la page, sous les barres de Chrome
KLING = f"{CAP}/kling_phare.mp4"
IMGS = [f"{CAP}/img1_escalier.png", f"{CAP}/img2_visage.png", f"{CAP}/img3_phare.png", f"{CAP}/img4_lampe.png"]
REPO = os.environ.get("HG_REPO", "/Users/ibrahimkamara/yt-animations")
MUSIC = f"{REPO}/public/epidemic/higgs-influ3/hq"
SFX = f"{REPO}/public/sfx"
FONT = os.environ.get("HG_FONT", "/Users/ibrahimkamara/Library/Fonts/Inter-VariableFont_opsz,wght.ttf")
CARDS = f"{ROOT}/cards"; PARTS = f"{ROOT}/parts"
os.makedirs(CARDS, exist_ok=True); os.makedirs(PARTS, exist_ok=True)

BG = (9, 11, 8); SURF = (18, 22, 15); TXT = (242, 245, 236); LIME = (198, 243, 109); LIME_BG = (30, 39, 18)
ENC = ["-c:v", "libx264", "-preset", "fast", "-crf", "17", "-pix_fmt", "yuv420p", "-r", "30"] if sys.platform.startswith("linux") else ["-c:v", "h264_videotoolbox", "-b:v", "18M", "-pix_fmt", "yuv420p", "-r", "30"]
END = 476.8
BUBBLE_CROP = "600:600:720:110"


def font(size, weight="Bold"):
    f = ImageFont.truetype(FONT, size)
    try: f.set_variation_by_name(weight)
    except Exception: pass
    return f


def card(name, lines, size=58, pill=None, accent=None):
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
        d.rounded_rectangle([30 + pad, y, 30 + pad + pw, y + ph], ph // 2, fill=LIME_BG)
        d.text((30 + pad + size * 0.35, y + ph / 2), pill, font=fp, fill=LIME, anchor="lm")
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


def bubble_assets():
    mk, rg = f"{CARDS}/bub_mask.png", f"{CARDS}/bub_ring.png"
    m = Image.new("L", (1120, 1120), 0); ImageDraw.Draw(m).ellipse([0, 0, 1119, 1119], fill=255); m.resize((280, 280), Image.LANCZOS).save(mk)
    r = Image.new("RGBA", (1152, 1152), (0, 0, 0, 0)); ImageDraw.Draw(r).ellipse([8, 8, 1143, 1143], outline=LIME + (255,), width=16)
    r.resize((288, 288), Image.LANCZOS).save(rg)
    return mk, rg


def framed(name, src, w, h):
    """Image arrondie avec ombre, sur fond transparent."""
    path = f"{CARDS}/{name}.png"
    a = Image.open(src).convert("RGB"); a.thumbnail((w, h), Image.LANCZOS)
    im = Image.new("RGBA", (a.width + 60, a.height + 60), (0, 0, 0, 0))
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).rounded_rectangle([30, 42, a.width + 30, a.height + 42], 22, fill=(0, 0, 0, 170))
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(20)))
    m = Image.new("L", a.size, 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, a.width, a.height], 22, fill=255)
    im.paste(a, (30, 30), m)
    im.save(path)
    return path, im.size


def storyboard_bg():
    path = f"{CARDS}/sb_bg.png"
    a = Image.open(IMGS[0]).convert("RGB").resize((1920, 1080)).filter(ImageFilter.GaussianBlur(40))
    a = Image.blend(a, Image.new("RGB", (1920, 1080), BG), 0.75); a.save(path)
    return path


# ---------------------------------------------------------------- segments
# kind : face | screen | cap | media ; s0/s1 = temps source (voix synchrone)
# cards : (t0, t1, png, x, y) en temps source ; zoom : [(t0, t1, cx, cy, z)] coordonnées écran 1920x1080
def build_specs():
    C = {}
    def c(name, *a, **k): C[name] = card(name, *a, **k)
    def F(name, *a, **k): C[name] = fullcard(name, *a, **k)
    c("c20", ["Ce clip : 20 crédits"], 64, accent="20 crédits")
    c("reel", ["Le vrai prix = 20 crédits", "× le nombre de relances"], 60, accent="× le nombre de relances")
    c("x310", ["Selon Higgsfield : ×3 à ×10"], 60, accent="×3 à ×10")
    F("cout", "LE VRAI COÛT", ["20 → 60 → 100 → 200", "crédits"], accent="200")
    c("sept", ["7 astuces pour économiser", "certaines à 0 crédit"], 60, accent="0 crédit")
    c("pourquoi", ["Pourquoi la vidéo IA", "coûte aussi cher ?"], 60, accent="aussi cher ?")
    F("rates", "LE PROBLÈME", ["Ce ne sont pas les générations,", "ce sont les essais ratés"], accent="les essais ratés", size=78)
    F("gratuit", "BONNE NOUVELLE", ["Générer à 0 crédit ?", "Oui, sur certains modèles"], accent="0 crédit", size=78)
    c("collab", ["Higgsfield"], 50, pill="COLLABORATION COMMERCIALE", accent="Higgsfield")
    c("modeles", ["Le plus de modèles IA", "image et vidéo au même endroit"], 58, accent="au même endroit")
    c("bouton", ["Le prix est écrit sur le bouton", "AVANT de générer"], 54, accent="AVANT")
    c("params", ["Modèle · durée · résolution", "= le prix change"], 54, accent="le prix change")
    c("s25", ["Seedance 2.5 · 5 s : 1080p 80 → 720p 35 → 480p 15"], 46, accent="80 → 720p 35 → 480p 15")
    c("kling", ["Même plan : Seedance 2.5 = 80", "Kling 3.0 = 12 crédits"], 54, accent="Kling 3.0 = 12 crédits")
    c("tests", ["Tes tests sur un modèle moins cher,", "le rendu final sur le meilleur"], 52, accent="le rendu final")
    c("p480", ["Ou garde le modèle,", "teste en 480p : 4× moins cher"], 54, accent="4× moins cher")
    c("illim", ["Accès Illimité : générations", "illimitées sur un modèle"], 54, accent="illimitées")
    c("site", ["L'Illimité marche uniquement", "sur le site higgsfield.ai"], 56, accent="sur le site higgsfield.ai")
    c("pas", ["• MCP (Claude, ChatGPT)", "• Supercomputer", "→ toujours des crédits"], 54, accent="toujours des crédits")
    c("sb1", ["1. D'abord les images", "(le storyboard)"], 56, accent="les images")
    c("unl", ["Mode Illimité : 4 crédits → 0"], 56, accent="0")
    c("sb4", ["4 plans de storyboard", "0 crédit en Illimité"], 56, accent="0 crédit")
    c("sb2", ["2. Puis UNE seule vidéo", "Kling 3.0 · 7,5 crédits"], 56, accent="UNE seule vidéo")
    c("img5", ["Une image : 1 à 5 crédits"], 56, accent="1 à 5 crédits")
    c("prompt", ["Personnages · caméra · lumière · mouvement", "tout dans le premier prompt"], 50, accent="tout")
    c("ia", ["Astuce : fais améliorer ton prompt", "par Claude ou ChatGPT"], 52, accent="Claude ou ChatGPT")
    c("son", ["Bonus : son coupé sur Kling 3.0", "10 → 7,5 crédits"], 54, accent="10 → 7,5 crédits")
    c("rembourse", ["Bug technique = crédits", "remboursés automatiquement"], 58, accent="remboursés")
    c("rate", ["Résultat qui ne te plaît pas", "= payé quand même"], 54, accent="payé")
    c("cta", ["Essaie Higgsfield : 1er lien de la", "description + commentaire épinglé"], 52, accent="1er lien")
    c("next", ["La prochaine vidéo", "à regarder"], 56, pill="VIDÉO SUIVANTE", accent="à regarder")
    titles = {"ch1": "Regarde le prix avant de cliquer", "ch2": "Teste sur un modèle moins cher", "ch3": "Le mode Illimité",
              "ch4": "Illimité : seulement sur le site", "ch5": "L'image d'abord, la vidéo ensuite", "ch6": "Décris tout dès le 1er prompt",
              "ch7": "Un bug technique ne coûte rien"}
    for k, t in titles.items():
        C[k] = fullcard(k, f"ASTUCE {k[-1]}", [t], alpha=225, size=86)
    C["son_on"] = framed("son_on", f"{CAP}/ui/son_on_10.png", 700, 700)
    C["son_off"] = framed("son_off", f"{CAP}/ui/son_off_7-5.png", 700, 700)

    def lower(name):
        w, h = C[name][1]; return (1920 - w) // 2, 1080 - h - 40
    def top(name):
        w, h = C[name][1]; return (1920 - w) // 2, 30
    def at(t0, t1, name, pos=lower):
        x, y = pos(name); return (t0, t1, C[name][0], x, y)
    def full(t0, t1, name):
        return (t0, t1, C[name][0], 0, 0)
    def ch(t0, name):
        return (t0, t0 + 3.0, C[name][0], 0, 0)

    Z = (300, 820, 1.7)   # bouton Générer + réglages, à gauche
    S = []
    # HOOK (lecture 0–16,4 : jamais la face cam)
    S.append(dict(n="h1", kind="media", src=KLING, loop=True, s0=0.0, s1=16.4, cards=[at(0.4, 7.2, "c20", top), at(7.4, 16.2, "reel")]))
    S.append(dict(n="h2", kind="face", s0=16.4, s1=31.6, z=1.0, cards=[at(16.4, 23.8, "x310"), full(24.1, 31.4, "cout")]))
    S.append(dict(n="h3", kind="face", s0=31.6, s1=41.6, z=1.12, cards=[at(32.0, 41.2, "sept")]))
    # INTRO
    S.append(dict(n="i1", kind="face", s0=41.6, s1=62.6, z=1.0, cards=[at(46.2, 52.4, "pourquoi"), full(52.6, 55.0, "rates"), full(55.1, 63.6, "gratuit")]))
    S.append(dict(n="i2", kind="face", s0=62.6, s1=82.8, z=1.12, cards=[(63.8, 70.0, C["collab"][0], 60, 40), at(69.2, 78.0, "modeles")]))
    # TUTO : écran réduit + bulle
    S.append(dict(n="t1", kind="screen", s0=82.8, s1=140.3, zoom=[(97.0, 104.5, *Z), (113.0, 133.0, *Z)],
                  cards=[ch(82.8, "ch1"), at(86.0, 93.0, "bouton", top), at(105.5, 112.0, "params", top), at(119.0, 132.0, "s25", top)]))
    S.append(dict(n="t2", kind="screen", s0=140.3, s1=227.2, zoom=[(162.0, 181.0, *Z), (208.0, 226.0, *Z)],
                  cards=[ch(140.3, "ch2"), at(163.0, 181.0, "kling", top), at(187.0, 198.0, "tests", top), at(208.5, 225.5, "p480", top)]))
    S.append(dict(n="t3", kind="screen", s0=227.2, s1=304.9, cards=[ch(227.2, "ch3"), at(270.0, 280.0, "illim", top)]))
    S.append(dict(n="t4", kind="media", src="blur_screen", s0=304.9, s1=344.5, bubble=True,
                  cards=[ch(304.9, "ch4"), at(309.0, 318.5, "site", top), at(318.6, 336.0, "pas"), at(336.5, 344.0, "site", top)]))
    S.append(dict(n="t5a", kind="cap", s0=344.5, s1=384.5, cards=[ch(344.5, "ch5"), at(352.0, 362.0, "sb1", top), at(378.0, 384.3, "unl", top)]))
    S.append(dict(n="t5b", kind="grid", s0=384.5, s1=396.0, cards=[at(385.0, 391.6, "sb4", top), at(391.8, 395.8, "img5", top)]))
    S.append(dict(n="t5c", kind="i2v", s0=396.0, s1=407.5, cards=[at(396.3, 407.3, "sb2")]))
    S.append(dict(n="t6a", kind="media", src=KLING, loop=True, s0=407.5, s1=430.0, bubble=True,
                  cards=[ch(407.5, "ch6"), at(412.0, 424.0, "prompt"), at(424.2, 429.8, "ia")]))
    S.append(dict(n="t6b", kind="media", src="sb_bg", s0=430.0, s1=444.4, bubble=True,
                  cards=[(430.3, 444.2, C["son_on"][0], 960 - C["son_on"][1][0] - 10, 120), (433.5, 444.2, C["son_off"][0], 970, 120), at(430.3, 444.2, "son")]))
    S.append(dict(n="t7", kind="face", s0=444.4, s1=465.0, z=1.12, cards=[ch(444.4, "ch7"), at(449.0, 459.5, "rembourse"), at(459.6, 464.8, "rate")]))
    S.append(dict(n="end", kind="face", s0=465.0, s1=END, z=1.0, cards=[at(465.2, 472.6, "cta"), at(472.8, 476.6, "next")]))
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


def add_bubble(inputs, f, last, s0, dur, shrink=True):
    mk, rg = bubble_assets()
    fi = inputs.count("-i"); inputs += ["-ss", f"{s0}", "-t", f"{dur}", "-i", FACE]
    mi = inputs.count("-i"); inputs += ["-loop", "1", "-t", f"{dur}", "-i", mk]
    ri = inputs.count("-i"); inputs += ["-loop", "1", "-t", f"{dur}", "-i", rg]
    pre = (f"[{last}]split[sa][sb];[sa]scale=1920:1080,gblur=sigma=30,eq=brightness=-0.12[bg];[sb]scale=1700:956[fg];[bg][fg]overlay=16:62[cmp];"
           if shrink else f"[{last}]null[cmp];")
    f.append(pre + f"[{fi}:v]fps=30,crop={BUBBLE_CROP},scale=280:280,format=rgba[fc];[{mi}:v]format=gray,scale=280:280[mk];[fc][mk]alphamerge[fm];"
             f"[cmp][fm]overlay=1616:776:shortest=1[c1];[c1][{ri}:v]overlay=1612:772:shortest=1[v0]")


def fit(label_in, label_out):
    """Plein cadre 16:9 avec fond flou si le ratio diffère."""
    return (f"[{label_in}]split[fa][fb];[fa]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,gblur=sigma=40,eq=brightness=-0.25[fbg];"
            f"[fb]scale=1920:1080:force_original_aspect_ratio=decrease[ffg];[fbg][ffg]overlay=(W-w)/2:(H-h)/2,setsar=1,fps=30[{label_out}]")


def render(seg):
    out = f"{PARTS}/{seg['n']}.mp4"; dur = seg["s1"] - seg["s0"]; kind = seg["kind"]
    inputs = []; f = []
    if kind == "face":
        inputs = ["-ss", f"{seg['s0']}", "-t", f"{dur}", "-i", FACE]
        z = seg.get("z", 1.0)
        f.append(f"[0:v]scale={int(1920 * z) // 2 * 2}:-2,crop=1920:1080:(iw-1920)/2+60:(ih-1080)/2-{int(30 * (z - 1) * 10)},setsar=1,fps=30[v0]" if z != 1.0 else "[0:v]fps=30,setsar=1[v0]")
    elif kind == "screen":
        inputs = ["-ss", f"{seg['s0']}", "-t", f"{dur}", "-i", SCREEN]
        last = "s0"; f.append(f"[0:v]fps=30,setsar=1[{last}]")
        if seg.get("zoom"):
            f.append(f"[{last}]{zoom_expr(seg['zoom'], seg['s0'])}[zm]"); last = "zm"
        add_bubble(inputs, f, last, seg["s0"], dur)
    elif kind == "cap":
        inputs = ["-ss", "4", "-t", f"{dur}", "-i", CAPVID]
        f.append(f"[0:v]crop={CAP_CROP},scale=1920:1080,setsar=1,fps=30,tpad=stop_mode=clone:stop_duration=5[s0]")
        add_bubble(inputs, f, "s0", seg["s0"], dur)
    elif kind == "media":
        src = seg["src"]
        if src == "blur_screen":
            inputs = ["-ss", "320", "-t", f"{dur}", "-i", SCREEN]
            f.append("[0:v]fps=30,scale=1920:1080,gblur=sigma=35,eq=brightness=-0.3,setsar=1[s0]")
        elif src == "sb_bg":
            inputs = ["-loop", "1", "-t", f"{dur}", "-i", storyboard_bg()]
            f.append("[0:v]fps=30,setsar=1[s0]")
        else:
            inputs = (["-stream_loop", "-1"] if seg.get("loop") else []) + ["-t", f"{dur}", "-i", src]
            f.append(fit("0:v", "s0"))
        if seg.get("bubble"):
            add_bubble(inputs, f, "s0", seg["s0"], dur, shrink=False)
        else:
            f.append("[s0]null[v0]")
    elif kind == "grid":
        inputs = ["-loop", "1", "-t", f"{dur}", "-i", storyboard_bg()]
        f.append("[0:v]fps=30,setsar=1[g0]"); last = "g0"
        for k, p in enumerate(IMGS):
            fp, (w, h) = framed(f"grid{k}", p, 760, 430)
            x = 140 + (k % 2) * 860; y = 70 + (k // 2) * 470
            ii = inputs.count("-i"); inputs += ["-loop", "1", "-t", f"{dur}", "-i", fp]
            st = 0.3 + k * 0.5
            f.append(f"[{ii}:v]format=rgba,fade=in:st={st}:d=0.35:alpha=1[i{k}];[{last}][i{k}]overlay={x}:{y}[g{k + 1}]"); last = f"g{k + 1}"
        f.append(f"[{last}]null[s0]")
        add_bubble(inputs, f, "s0", seg["s0"], dur, shrink=False)
    elif kind == "i2v":
        fp, (w, h) = framed("start", IMGS[0], 820, 470)
        inputs = ["-loop", "1", "-t", f"{dur}", "-i", storyboard_bg(), "-loop", "1", "-t", f"{dur}", "-i", fp, "-stream_loop", "-1", "-t", f"{dur}", "-i", KLING]
        f.append("[0:v]fps=30,setsar=1[b0];[b0][1:v]overlay=50:230[b1];[2:v]scale=820:-2,setsar=1,fps=30[kv];[b1][kv]overlay=1050:260[s0]")
        add_bubble(inputs, f, "s0", seg["s0"], dur, shrink=False)
    last = f[-1].split("[")[-1].rstrip("]")
    g, last = overlay_cards(inputs, last, seg.get("cards", []), seg["s0"], dur); f += g
    f.append(f"[{last}]tpad=stop_mode=clone:stop_duration=2[vout]")
    cmd = ["ffmpeg", "-v", "error", "-y"] + inputs + ["-filter_complex", ";".join(f), "-map", "[vout]", "-an", "-t", f"{dur:.3f}"] + ENC + [out]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print(seg["n"], "ERREUR", r.stderr[-1500:]); sys.exit(1)
    print("ok", seg["n"], f"{dur:.1f}s", flush=True)


def audio():
    out = f"{PARTS}/audio.wav"; total = END
    inp = ["-i", FACE, "-i", f"{MUSIC}/m0_out_there.mp3", "-i", f"{MUSIC}/m3_in_the_gloom.mp3", "-i", f"{MUSIC}/m4_sonar.mp3"]
    f = ["[0:a]highpass=f=70,acompressor=threshold=-20dB:ratio=3:attack=5:release=120,loudnorm=I=-15:TP=-1.5:LRA=9[voice]",
         "[1:a]atrim=0:83.8,afade=t=in:d=0.5,afade=t=out:st=82.3:d=1.5,loudnorm=I=-32[m0]",
         "[2:a]aloop=loop=-1:size=2e9,atrim=0:222.1,afade=t=in:d=1.5,afade=t=out:st=220.1:d=2,loudnorm=I=-32,adelay=82800:all=1[m3]",
         f"[3:a]aloop=loop=-1:size=2e9,atrim=0:{total - 304.9},afade=t=in:d=1,afade=t=out:st={total - 304.9 - 2.5}:d=2.5,loudnorm=I=-32,adelay=304900:all=1[m4]"]
    sfx = [(0.0, "impact_whoosh_deep__mk1143.mp3", 0.5), (0.4, "pop_dry_notif__mk2356.mp3", 0.4), (7.4, "pop_light_explainer__mk3005.mp3", 0.35),
           (16.4, "whoosh_cinematic_fast__mk1492.mp3", 0.45), (24.1, "impact_fast_hit__mk2180.mp3", 0.45), (32.0, "pop_long__mk2358.mp3", 0.4),
           (46.2, "pop_light_explainer__mk3005.mp3", 0.35), (52.6, "whoosh_fast__mk1490.mp3", 0.4), (55.1, "whoosh_fast__mk1490.mp3", 0.4),
           (63.8, "pop_long__mk2358.mp3", 0.4), (69.2, "pop_light_explainer__mk3005.mp3", 0.35)]
    for t in (82.8, 140.3, 227.2, 304.9, 344.5, 407.5, 444.4):
        sfx.append((t, "impact_quick_zoom__mk772.mp3", 0.45))
    for t in (97.0, 113.0, 162.0, 208.0):
        sfx.append((t, "zoom_air_vacuum__mk2608.mp3", 0.35))
    for t in (86.0, 105.5, 119.0, 163.0, 187.0, 208.5, 270.0, 309.0, 318.6, 352.0, 375.0, 385.0, 391.8, 396.3, 412.0, 424.2, 430.3, 433.5, 449.0, 459.6, 465.2):
        sfx.append((t, "pop_dry_notif__mk2356.mp3", 0.3))
    sfx += [(384.8 + k * 0.5, "click_select__mk1109.mp3", 0.25) for k in range(4)]
    sfx.append((472.8, "pop_long__mk2358.mp3", 0.4))
    labs = []
    for k, (tt, fn, vol) in enumerate(sfx):
        i = inp.count("-i"); inp += ["-i", f"{SFX}/{fn}"]
        f.append(f"[{i}:a]volume={vol},adelay={int(tt * 1000)}:all=1[s{k}]"); labs.append(f"[s{k}]")
    f.append(f"[voice][m0][m3][m4]{''.join(labs)}amix=inputs={4 + len(labs)}:normalize=0:duration=longest,atrim=0:{total},alimiter=limit=0.95[aout]")
    cmd = ["ffmpeg", "-v", "error", "-y"] + inp + ["-filter_complex", ";".join(f), "-map", "[aout]", "-ar", "48000", "-ac", "2", out]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print("audio ERREUR", r.stderr[-2000:]); sys.exit(1)
    print("ok audio", flush=True)


def final(specs):
    lst = f"{PARTS}/list.txt"
    with open(lst, "w") as fh:
        for s in specs: fh.write(f"file '{PARTS}/{s['n']}.mp4'\n")
    out = f"{ROOT}/../07-final/higgs_gen_x1.00.mp4"; os.makedirs(os.path.dirname(out), exist_ok=True)
    cmd = ["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-i", f"{PARTS}/audio.wav",
           "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-shortest", "-movflags", "+faststart", out]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print("final ERREUR", r.stderr[-2000:]); sys.exit(1)
    print("ok final", out)


if __name__ == "__main__":
    what = sys.argv[1] if len(sys.argv) > 1 else "all"
    specs = build_specs()
    only = sys.argv[2:] if len(sys.argv) > 2 else None
    if what in ("parts", "all"):
        for s in specs:
            if not only or s["n"] in only: render(s)
    if what in ("audio", "all"): audio()
    if what in ("final", "all"): final(specs)
