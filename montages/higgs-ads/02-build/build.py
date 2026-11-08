"""Montage express Higgsfield Ads Studio (15/10/2026) : ffmpeg seul, pas de Remotion.
Usage : python3 build.py [parts|audio|final|all] [seg_name]
"""
import os, subprocess, sys, json
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.abspath(__file__))
DL = "/Users/ibrahimkamara/Downloads"
FACE = f"{DL}/drive-download-20261015T161128Z-1-001/Higgsfield Ads Footage.mp4"
SCREEN = f"{DL}/drive-download-20261015T161128Z-1-001/Higgsfield Ads Screen Record.mp4"
RESULT = f"{DL}/hf_20261015_084030_80c51c86-12b9-4643-8dc5-95308c0f5aa8.mp4"
ADS = f"{DL}/All generations"
REPO = "/Users/ibrahimkamara/yt-animations"
MUSIC = f"{REPO}/public/epidemic/higgs-influ3/hq"
SFX = f"{REPO}/public/sfx"
FONT = "/Users/ibrahimkamara/Library/Fonts/Inter-VariableFont_opsz,wght.ttf"
CARDS = f"{ROOT}/cards"; PARTS = f"{ROOT}/parts"
os.makedirs(CARDS, exist_ok=True); os.makedirs(PARTS, exist_ok=True)

BG = (9, 11, 8); SURF = (18, 22, 15); TXT = (242, 245, 236); LIME = (198, 243, 109); LIME_BG = (30, 39, 18)
ENC = ["-c:v", "h264_videotoolbox", "-b:v", "18M", "-pix_fmt", "yuv420p", "-r", "30"]
PAYOFF_AT = 598.2   # « … on va patienter » : on insère le résultat ici
PAYOFF_DUR = 10.0


def font(size, weight="Bold"):
    f = ImageFont.truetype(FONT, size)
    try: f.set_variation_by_name(weight)
    except Exception: pass
    return f


def card(name, lines, size=58, pill=None, accent=None, width=None):
    """Carte verre sombre, texte clair, un mot clé lime (accent)."""
    path = f"{CARDS}/{name}.png"
    f = font(size); fp = font(int(size * 0.5), "SemiBold")
    pad = int(size * 0.6); gap = int(size * 0.28)
    d0 = ImageDraw.Draw(Image.new("RGBA", (10, 10)))
    widths = [d0.textlength(l, font=f) for l in lines]
    pw = d0.textlength(pill, font=fp) + size * 0.7 if pill else 0
    w = int(max(widths + [pw]) + 2 * pad) if not width else width
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


def chapter(name, num, title):
    """Carton d'étape plein écran (fond sombre translucide)."""
    path = f"{CARDS}/{name}.png"
    im = Image.new("RGBA", (1920, 1080), BG + (225,)); d = ImageDraw.Draw(im)
    fp = font(40, "SemiBold"); ft = font(92)
    pill = f"ÉTAPE {num}"; pw = d.textlength(pill, font=fp) + 56
    d.rounded_rectangle([960 - pw / 2, 380, 960 + pw / 2, 446], 33, fill=LIME_BG)
    d.text((960, 413), pill, font=fp, fill=LIME, anchor="mm")
    for i, l in enumerate(title):
        d.text((960, 540 + i * 110), l, font=ft, fill=TXT, anchor="mm")
    im.save(path)
    return path, im.size


def ad_frame(i, label=None):
    """Visuel statique plein écran sur fond flou, étiquette d'angle optionnelle."""
    path = f"{CARDS}/ad{i}.png"
    src = Image.open(f"{ADS}/all-generations-{i}.png").convert("RGB")
    bg = src.copy(); bg = bg.resize((1920, int(1920 * bg.height / bg.width))).crop((0, 0, 1920, 1080)) if bg.height / bg.width >= 1080 / 1920 else bg.resize((1920, 1080))
    bg = bg.filter(ImageFilter.GaussianBlur(40))
    bg = Image.blend(bg, Image.new("RGB", (1920, 1080), BG), 0.72)
    s = src.copy(); s.thumbnail((1500, 1000)); x = (1920 - s.width) // 2; y = (1080 - s.height) // 2
    sh = Image.new("RGBA", (1920, 1080), (0, 0, 0, 0)); ImageDraw.Draw(sh).rounded_rectangle([x, y + 16, x + s.width, y + s.height + 16], 18, fill=(0, 0, 0, 170))
    bg = Image.alpha_composite(bg.convert("RGBA"), sh.filter(ImageFilter.GaussianBlur(24)))
    m = Image.new("L", s.size, 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, s.width, s.height], 18, fill=255)
    bg.paste(s, (x, y), m)
    if label:
        lp, _ = card(f"lab{i}", [label[1]], 50, pill=label[0], accent=label[2])
        L = Image.open(lp); bx = max(20, x - L.width + 60) if x > 520 else 20
        bg.alpha_composite(L, (bx if x - L.width > 0 else 20, 1080 - L.height - 30) if x <= 520 else (x - L.width + 40, 1080 // 2 - L.height // 2))
    bg.convert("RGB").save(path)
    return path


def bubble_assets():
    mk, rg = f"{CARDS}/bub_mask.png", f"{CARDS}/bub_ring.png"
    m = Image.new("L", (1120, 1120), 0); ImageDraw.Draw(m).ellipse([0, 0, 1119, 1119], fill=255); m.resize((280, 280), Image.LANCZOS).save(mk)
    r = Image.new("RGBA", (1152, 1152), (0, 0, 0, 0)); ImageDraw.Draw(r).ellipse([8, 8, 1143, 1143], outline=LIME + (255,), width=16)
    r.resize((288, 288), Image.LANCZOS).save(rg)
    return mk, rg


def mosaic():
    path = f"{CARDS}/mosaic.png"
    im = Image.new("RGB", (2200, 1240), BG); x = 0; y = -60
    for i in [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 2, 6]:
        a = Image.open(f"{ADS}/all-generations-{i}.png").convert("RGB"); a.thumbnail((10000, 640))
        if x + a.width * 0.5 > 2200: x = -120 if y < 0 else 0; y += 650
        if y > 1240: break
        im.paste(a, (x, y)); x += a.width + 10
    im.save(path)
    return path


# ---------------------------------------------------------------- segments
# kind : face | screen | ads | payoff | hook ; s0/s1 = temps source (voix synchrone)
# cards : (t0, t1, png, x, y) en temps source ; zoom : (t0, t1, cx, cy, z) ; blur : (t0, t1, x, y, w, h) ou "full"
def build_specs():
    C = {}
    def c(name, *a, **k): C[name] = card(name, *a, **k)
    c("zero1", ["0 studio"], 70, accent="0")
    c("zero2", ["0 photographe"], 70, accent="0")
    c("zero3", ["0 mannequin"], 70, accent="0")
    c("pack", ["Le pack pub que les marques", "paient chaque mois"], 60, accent="chaque mois")
    c("use", ["Une pub s'use vite :", "il en faut sans arrêt"], 60, accent="sans arrêt")
    c("cher", ["Tournage classique :", "équipe, caméras, semaines"], 60, accent="semaines")
    c("ia", ["Avec l'IA : livré", "en une après-midi"], 60, accent="une après-midi")
    c("collab", ["Higgsfield Ads Studio"], 46, pill="COLLABORATION COMMERCIALE", accent="Ads Studio")
    c("same", ["Statique + vidéo,", "au même endroit"], 66, accent="au même endroit")
    c("free", ["Trouver des clients :", "méthode 100 % gratuite"], 60, accent="100 % gratuite")
    c("meta", ["Bibliothèque publicitaire Meta"], 54, pill="GRATUIT", accent="Meta")
    c("masque", ["Marque masquée"], 40, pill="EXEMPLE")
    c("p99", ["99 pubs actives", "= déjà une équipe en interne"], 58, accent="99 pubs actives")
    c("cible", ["Client idéal : pubs actives ✓", "mais seulement 1 à 3 visuels"], 58, accent="1 à 3 visuels")
    c("generic", ["Pubs IA génériques", "= le client le sent"], 58, accent="le client le sent")
    c("lien", ["Lien dans la description"], 46, accent="description")
    c("kit", ["Relis et corrige le kit de marque"], 52, accent="corrige")
    c("credits", ["68 crédits, affichés", "avant de générer"], 58, accent="avant de générer")
    c("hookcta", ["Accroche / CTA activée", "→ le prompt se désactive"], 52, accent="se désactive")
    c("credits2", ["1080p : 128 crédits,", "affichés avant de générer"], 52, accent="avant de générer")
    c("cta", ["Essaie Ads Studio : 1er lien de la", "description + commentaire épinglé"], 54, accent="1er lien")
    c("next", ["Ton influenceur IA", "ne devrait pas être humain"], 56, pill="VIDÉO SUIVANTE", accent="pas être humain")
    for k, (n, t) in {"ch1": (1, ["À qui vendre ?"]), "ch2": (2, ["Le kit de marque"]), "ch3": (3, ["Le pack de pubs statiques"]),
                      "ch4": (4, ["Multiplier la pub vidéo"])}.items():
        C[k] = chapter(k, n, t)

    def lower(name):  # bas centre (face cam)
        w, h = C[name][1]; return (1920 - w) // 2, 1080 - h - 40
    def top(name):
        w, h = C[name][1]; return (1920 - w) // 2, 40
    def at(t0, t1, name, pos=lower):
        x, y = pos(name); return (t0, t1, C[name][0], x, y)
    def ch(t0, name):
        return (t0, t0 + 3.2, C[name][0], 0, 0)

    S = []
    # HOOK
    S.append(dict(n="h1", kind="mosaic", s0=0.0, s1=3.6))
    S.append(dict(n="h2", kind="split", s0=3.6, s1=6.8))
    c("sell", ["Comment les créer…", "et surtout les vendre"], 60, accent="les vendre")
    S.append(dict(n="h3", kind="ads", s0=6.8, s1=15.9, nolabels=True, order=[1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13], cards=[
        (7.6, 15.6, C["zero1"][0], 80, 220), (9.7, 15.6, C["zero2"][0], 80, 400), (10.7, 15.6, C["zero3"][0], 80, 580)]))
    S.append(dict(n="h4", kind="mosaic", s0=15.9, s1=24.6, cards=[at(16.0, 19.6, "pack"), at(19.8, 24.4, "sell")]))
    S.append(dict(n="i1", kind="face", s0=24.6, s1=41.6, z=1.0, cards=[at(26.6, 37.6, "use")]))
    S.append(dict(n="i2", kind="face", s0=41.6, s1=56.8, z=1.12, cards=[at(41.8, 50.8, "cher"), at(51.2, 56.6, "ia")]))
    S.append(dict(n="i3", kind="face", s0=56.8, s1=64.7, z=1.0))
    S.append(dict(n="i4", kind="screen", s0=64.7, s1=79.0, src0=226.4, bubble=False, cards=[
        (65.0, 78.8, C["collab"][0], 60, 40), at(71.3, 78.6, "same")]))
    S.append(dict(n="i5", kind="face", s0=79.0, s1=94.2, z=1.12, cards=[at(80.4, 86.0, "free")]))
    # ÉTAPE 1
    S.append(dict(n="e1a", kind="face", s0=94.2, s1=115.0, z=1.0, cards=[ch(94.2, "ch1")]))
    S.append(dict(n="e1b", kind="screen", s0=115.0, s1=118.5, cards=[at(116.0, 124.0, "meta", top)]))
    S.append(dict(n="e1b2", kind="face", s0=118.5, s1=127.0, z=1.12, cards=[at(116.0, 124.0, "meta")]))
    S.append(dict(n="e1c", kind="screen", s0=127.0, s1=165.0, cards=[at(147.0, 158.0, "p99", top)]))
    S.append(dict(n="e1d", kind="face", s0=165.0, s1=222.0, z=1.0, cards=[
        at(179.0, 186.0, "p99"), at(187.5, 196.0, "cible"), ch(196.1, "ch2"), at(208.0, 216.0, "generic")]))
    S.append(dict(n="e2a", kind="screen", s0=222.0, s1=272.0, boxes=[(247.0, 270.0, 690, 470, 560, 90)], cards=[at(228.6, 233.0, "lien", top)]))
    S.append(dict(n="e2b", kind="face", s0=272.0, s1=277.5, z=1.12))
    S.append(dict(n="e2c", kind="screen", s0=277.5, s1=302.0, cards=[at(278.0, 284.0, "kit", top)]))
    S.append(dict(n="e3a", kind="face", s0=302.0, s1=313.0, z=1.0, cards=[ch(302.0, "ch3")]))
    S.append(dict(n="e3", kind="screen", s0=313.0, s1=399.5, zoom=(356.5, 371.5, 1665, 974, 1.6),
                  cards=[(361.0, 371.0, C["credits"][0], 80, 60)]))
    S.append(dict(n="e3ads", kind="ads", s0=399.5, s1=453.0))
    S.append(dict(n="e4a", kind="face", s0=453.0, s1=460.0, z=1.12, cards=[ch(453.0, "ch4")]))
    S.append(dict(n="e4", kind="screen", s0=460.0, s1=550.5))
    S.append(dict(n="e4g", kind="face", s0=550.5, s1=564.0, z=1.12))
    S.append(dict(n="e4b", kind="screen", s0=564.0, s1=PAYOFF_AT, zoom=(583.0, 598.2, 310, 870, 1.6),
                  cards=[(588.5, 593.0, C["hookcta"][0], 760, 120), (593.2, 598.2, C["credits2"][0], 760, 120)]))
    S.append(dict(n="pay", kind="payoff", s0=PAYOFF_AT, s1=PAYOFF_AT))
    S.append(dict(n="end", kind="face", s0=PAYOFF_AT, s1=616.4, z=1.0, cards=[at(598.6, 604.0, "cta"), at(604.2, 616.0, "next")]))
    return S


def zoom_expr(t0, t1, cx, cy, z, base):
    """Zoom fluide (ease in/out 0,6 s) via zoompan, temps = base + in/30."""
    t = f"({base}+in/30)"
    r = f"(if(lt({t},{t0}),0,if(lt({t},{t0}+0.6),({t}-{t0})/0.6,if(lt({t},{t1}-0.6),1,if(lt({t},{t1}),({t1}-{t})/0.6,0)))))"
    e = f"({r}*{r}*(3-2*{r}))"
    zz = f"(1+({z}-1)*{e})"
    x = f"max(0,min(iw-iw/zoom,{cx}-iw/zoom/2))"; y = f"max(0,min(ih-ih/zoom,{cy}-ih/zoom/2))"
    return f"zoompan=z='{zz}':x='{x}':y='{y}':d=1:s=1920x1080:fps=30"


def overlay_cards(inputs, chain, cards, base, dur):
    """Ajoute les cartes PNG (fondu 0,25 s) ; renvoie le filtre."""
    f = []; last = chain
    for k, (t0, t1, png, x, y) in enumerate(cards):
        a, b = max(0, t0 - base), min(dur, t1 - base)
        if b <= a: continue
        idx = inputs.count("-i"); inputs += ["-loop", "1", "-t", f"{b:.3f}", "-i", png]
        f.append(f"[{idx}:v]format=rgba,fade=in:st={a:.3f}:d=0.25:alpha=1,fade=out:st={max(a, b - 0.3):.3f}:d=0.3:alpha=1[c{k}]")
        f.append(f"[{last}][c{k}]overlay={x}:{y}:enable='between(t,{a:.3f},{b:.3f})'[o{k}]"); last = f"o{k}"
    return f, last


def render(seg):
    out = f"{PARTS}/{seg['n']}.mp4"; dur = seg["s1"] - seg["s0"]; kind = seg["kind"]
    inputs = []; f = []
    if kind == "face":
        inputs = ["-ss", f"{seg['s0']}", "-t", f"{dur}", "-i", FACE]
        z = seg.get("z", 1.0)
        f.append(f"[0:v]scale={int(1920 * z) // 2 * 2}:-2,crop=1920:1080:(iw-1920)/2+{int(40 * (z - 1) * 10)}:(ih-1080)/2-{int(30 * (z - 1) * 10)},setsar=1,fps=30[v0]" if z != 1.0 else "[0:v]fps=30,setsar=1[v0]")
    elif kind == "screen":
        src0 = seg.get("src0", seg["s0"])
        inputs = ["-ss", f"{src0}", "-t", f"{dur}", "-i", SCREEN]
        chain = "[0:v]fps=30,setsar=1"
        if seg.get("zoom"):
            t0, t1, cx, cy, z = seg["zoom"]; chain += "," + zoom_expr(t0, t1, cx, cy, z, seg["s0"])
        if seg.get("blur") == "full": chain += ",gblur=sigma=28"
        f.append(chain + "[v0]")
        for k, (t0, t1, x, y, w, h) in enumerate(seg.get("boxes", [])):
            prev = f[-1].split("[")[-1].rstrip("]")
            f.append(f"[{prev}]split[bA{k}][bB{k}];[bB{k}]crop={w}:{h}:{x}:{y},gblur=sigma=18[bC{k}];[bA{k}][bC{k}]overlay={x}:{y}:enable='between(t,{t0 - seg['s0']:.2f},{t1 - seg['s0']:.2f})'[vb{k}]")
        if seg.get("bubble", True):
            prev = f[-1].split("[")[-1].rstrip("]"); mk, rg = bubble_assets()
            fi = inputs.count("-i"); inputs += ["-ss", f"{seg['s0']}", "-t", f"{dur}", "-i", FACE]
            mi = inputs.count("-i"); inputs += ["-loop", "1", "-t", f"{dur}", "-i", mk]
            ri = inputs.count("-i"); inputs += ["-loop", "1", "-t", f"{dur}", "-i", rg]
            f.append(f"[{prev}]split[sa][sb];[sa]scale=1920:1080,gblur=sigma=30,eq=brightness=-0.12[bg];[sb]scale=1700:956[fg];[bg][fg]overlay=16:62[cmp];"
                     f"[{fi}:v]fps=30,crop=600:600:700:110,scale=280:280,format=rgba[fc];[{mi}:v]format=gray,scale=280:280[mk];[fc][mk]alphamerge[fm];"
                     f"[cmp][fm]overlay=1616:776:shortest=1[c1];[c1][{ri}:v]overlay=1612:772:shortest=1[vbub]")
    elif kind == "ads":
        order = seg.get("order", [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17])
        labels = {} if seg.get("nolabels") else {2: ("ANGLE BÉNÉFICE", "Ce que tu y gagnes", "gagnes"), 16: ("ANGLE PROBLÈME", "Le problème qu'elle règle", "problème"),
                  17: ("ANGLE SITUATION", "Le moment où tu l'utilises", "moment")}
        per = dur / len(order); lst = f"{CARDS}/ads_{seg['n']}.txt"
        with open(lst, "w") as fh:
            for i in order:
                fh.write(f"file '{ad_frame(i, labels.get(i))}'\nduration {per:.3f}\n")
            fh.write(f"file '{CARDS}/ad{order[-1]}.png'\n")
        inputs = ["-f", "concat", "-safe", "0", "-i", lst]
        f.append(f"[0:v]fps=30,format=yuv420p,trim=duration={dur:.3f},setsar=1[v0]")
    elif kind == "mosaic":
        inputs = ["-loop", "1", "-t", f"{dur}", "-i", mosaic()]
        f.append(f"[0:v]scale=2200:1240,zoompan=z='1+0.06*on/{int(dur * 30)}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=1920x1080:fps=30,trim=duration={dur},setsar=1[v0]")
    elif kind in ("split", "payoff"):
        dur = 3.2 if kind == "split" else PAYOFF_DUR
        inputs = ["-ss", "522", "-t", "7", "-stream_loop", "1", "-i", SCREEN, "-stream_loop", "1", "-i", RESULT,
                  "-f", "lavfi", "-t", f"{dur}", "-i", f"color=c=0x090b08:s=1920x1080:r=30"]
        f.append("[0:v]crop=478:850:512:66,scale=-2:960,setsar=1[l]")
        f.append(f"[1:v]scale=-2:960,setsar=1,trim=duration={dur}[r]")
        f.append("[2:v][l]overlay=(W/2-w)-40:60:shortest=1[b1]")
        f.append(f"[b1][r]overlay=W/2+40:60:eof_action=repeat,trim=duration={dur},fps=30[v0]")
        if kind == "payoff":
            for nm, lines, acc, pill in [("avant", ["Vidéo d'origine"], None, "AVANT"), ("apres", ["Mon sac, même pub"], "Mon sac", "APRÈS"),
                                          ("diff", ["Changé : le sac  ·  Identique : geste, cadrage, rythme"], "le sac", None)]:
                card(nm, lines, 44, pill=pill, accent=acc)
            cards = [(0.3, dur, f"{CARDS}/avant.png", 230, 40), (0.3, dur, f"{CARDS}/apres.png", 1080, 40),
                     (3.5, dur, f"{CARDS}/diff.png", (1920 - Image.open(f'{CARDS}/diff.png').width) // 2, 1080 - Image.open(f'{CARDS}/diff.png').height - 10)]
            g, last = overlay_cards(inputs, "v0", cards, 0, dur); f += g; f.append(f"[{last}]tpad=stop_mode=clone:stop_duration=2[vout]")
        else:
            f.append("[v0]tpad=stop_mode=clone:stop_duration=2[vout]")
        dur_out = dur
    if kind not in ("split", "payoff"):
        last = f[-1].split("[")[-1].rstrip("]")
        g, last = overlay_cards(inputs, last, seg.get("cards", []), seg["s0"], dur); f += g
        f.append(f"[{last}]tpad=stop_mode=clone:stop_duration=2[vout]"); dur_out = dur
    cmd = ["ffmpeg", "-v", "error", "-y"] + inputs + ["-filter_complex", ";".join(f), "-map", "[vout]", "-an", "-t", f"{dur_out:.3f}"] + ENC + [out]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print(seg["n"], "ERREUR", r.stderr[-1500:]); sys.exit(1)
    print("ok", seg["n"], f"{dur_out:.1f}s", flush=True)


def audio(specs):
    """Voix (+ trou au payoff) + 3 musiques + SFX."""
    out = f"{PARTS}/audio.wav"; P = PAYOFF_AT; D = PAYOFF_DUR; total = 616.4 + D
    inp = ["-i", FACE, "-i", f"{MUSIC}/m0_out_there.mp3", "-i", f"{MUSIC}/m3_in_the_gloom.mp3", "-i", f"{MUSIC}/m4_sonar.mp3"]
    f = [f"[0:a]atrim=0:{P},asetpts=PTS-STARTPTS[va]", f"[0:a]atrim={P}:616.4,asetpts=PTS-STARTPTS,adelay={int(D * 1000)}:all=1[vb]",
         "[va][vb]concat=n=2:v=0:a=1,highpass=f=70,acompressor=threshold=-20dB:ratio=3:attack=5:release=120,loudnorm=I=-15:TP=-1.5:LRA=9[voice]",
         "[1:a]atrim=0:95.2,afade=t=in:d=0.5,afade=t=out:st=94.2:d=1,loudnorm=I=-31[m0]",
         f"[2:a]aloop=loop=-1:size=2e9,atrim=0:{P - 94.2 + 1},afade=t=in:d=1.5,afade=t=out:st={P - 94.2 - 1.5}:d=2.5,loudnorm=I=-32,adelay=94200:all=1[m3]",
         f"[3:a]atrim=0:{total - P + 1},afade=t=in:d=0.3,afade=t=out:st={total - P - 2.5}:d=2.5,loudnorm=I=-27,adelay={int(P * 1000)}:all=1[m4]"]
    # SFX : (temps sortie, fichier, volume)
    def ot(s): return s if s < P else s + D
    sfx = [(0.0, "impact_whoosh_deep__mk1143.mp3", 0.5), (3.6, "swoosh_fast__mk3115.mp3", 0.5), (6.8, "whoosh_cinematic_fast__mk1492.mp3", 0.45),
           (7.6, "pop_dry_notif__mk2356.mp3", 0.4), (9.7, "pop_dry_notif__mk2356.mp3", 0.4), (10.7, "pop_dry_notif__mk2356.mp3", 0.4),
           (16.0, "pop_light_explainer__mk3005.mp3", 0.35), (26.6, "pop_light_explainer__mk3005.mp3", 0.35), (41.8, "pop_light_explainer__mk3005.mp3", 0.35),
           (51.2, "pop_light_explainer__mk3005.mp3", 0.35), (64.7, "whoosh_fast__mk1490.mp3", 0.45), (71.3, "pop_long__mk2358.mp3", 0.4),
           (79.0, "whoosh_fast__mk1490.mp3", 0.4), (80.4, "pop_light_explainer__mk3005.mp3", 0.35),
           (94.2, "impact_quick_zoom__mk772.mp3", 0.45), (196.1, "impact_quick_zoom__mk772.mp3", 0.45), (302.0, "impact_quick_zoom__mk772.mp3", 0.45),
           (453.0, "impact_quick_zoom__mk772.mp3", 0.45), (356.5, "zoom_air_vacuum__mk2608.mp3", 0.35), (583.0, "zoom_air_vacuum__mk2608.mp3", 0.35),
           (361.0, "pop_dry_notif__mk2356.mp3", 0.35), (399.5, "swoosh_fast__mk3115.mp3", 0.4),
           (P - 2.0, "riser_trailer__mk790.mp3", 0.35), (P, "impact_fast_hit__mk2180.mp3", 0.55), (P + 3.5, "pop_long__mk2358.mp3", 0.4),
           (616.4 - 0.1, "click_ui_tone__mk2568.mp3", 0.0)]
    # un petit tick à chaque visuel du défilé statique
    per = (453.0 - 399.5) / 16
    sfx += [(399.5 + k * per, "click_select__mk1109.mp3", 0.25) for k in range(1, 16)]
    labs = []
    for k, (t, fn, vol) in enumerate(sfx):
        if vol == 0: continue
        i = inp.count("-i"); inp += ["-i", f"{SFX}/{fn}"]
        tt = t if fn.startswith("riser") or fn.startswith("impact_fast") else ot(t)
        if fn.startswith("pop_long") and t > P: tt = t
        f.append(f"[{i}:a]volume={vol},adelay={int(tt * 1000)}:all=1[s{k}]"); labs.append(f"[s{k}]")
    f.append(f"[voice][m0][m3][m4]{''.join(labs)}amix=inputs={4 + len(labs)}:normalize=0:duration=longest,atrim=0:{total},alimiter=limit=0.95[aout]")
    cmd = ["ffmpeg", "-v", "error", "-y"] + inp + ["-filter_complex", ";".join(f), "-map", "[aout]", "-ar", "48000", "-ac", "2", out]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print("audio ERREUR", r.stderr[-2000:]); sys.exit(1)
    print("ok audio", flush=True)


def final(specs, speed=1.10):
    lst = f"{PARTS}/list.txt"
    with open(lst, "w") as fh:
        for s in specs: fh.write(f"file '{PARTS}/{s['n']}.mp4'\n")
    out = f"{ROOT}/../07-final/higgs_ads_x{speed:.2f}.mp4"; os.makedirs(os.path.dirname(out), exist_ok=True)
    fa = f"{PARTS}/audio_fast.m4a"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{PARTS}/audio.wav", "-af", f"atempo={speed}", "-c:a", "aac", "-b:a", "256k", fa], check=True)
    cmd = ["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-i", fa,
           "-filter_complex", f"[0:v]setpts=PTS/{speed},fps=30[v]", "-map", "[v]", "-map", "1:a",
           "-c:v", "h264_videotoolbox", "-b:v", "16M", "-pix_fmt", "yuv420p", "-c:a", "copy", "-shortest", "-movflags", "+faststart", out]
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
    if what in ("audio", "all"): audio(specs)
    if what in ("final", "all"): final(specs)
