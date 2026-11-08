"""Montage express Higgsfield Katana (20/10/2026) : ffmpeg seul, repris de higgs-ads/02-build/build.py.
Usage : python3 build.py [parts|audio|final|all] [seg_name ...]
"""
import os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = "/Volumes/SSD2/drive-download-20261020T122157Z-1-001"
FACE = f"{SRC}/Higgsfield Katana Footage.mp4"
SCREEN = f"{SRC}/Higgsfield Katana Screen Capture.mp4"
DL = "/Users/ibrahimkamara/Downloads"
REMAKE1 = f"{DL}/video genere 1.mp4"          # preset « Rap » (11,05 s, 1080x1920)
REMAKE2 = f"{DL}/video genere 2.mp4"          # edit TikTok foot (24,53 s, 720x1080)
REF2 = f"{DL}/dez_video_no_watermark.mp4"     # référence TikTok (24,53 s, 576x864)
REF1_AT = 266.6                                # la référence du preset joue dans l'écran à 4:26,5
REF1_CROP = "490:790:715:104"
REPO = "/Users/ibrahimkamara/yt-animations"
MUSIC = f"{REPO}/public/epidemic/higgs-influ3/hq"
SFX = f"{REPO}/public/sfx"
FONT = "/Users/ibrahimkamara/Library/Fonts/Inter-VariableFont_opsz,wght.ttf"
CARDS = f"{ROOT}/cards"; PARTS = f"{ROOT}/parts"
os.makedirs(CARDS, exist_ok=True); os.makedirs(PARTS, exist_ok=True)

BG = (9, 11, 8); SURF = (18, 22, 15); TXT = (242, 245, 236); LIME = (198, 243, 109); LIME_BG = (30, 39, 18)
ENC = ["-c:v", "h264_videotoolbox", "-b:v", "18M", "-pix_fmt", "yuv420p", "-r", "30"]
END = 481.7
P1_AT, P1_DUR = 396.0, 11.8    # « j'ai hâte de voir le résultat final » → remake 1
P2_AT, P2_DUR = 465.9, 25.2    # « on va juste patienter d'avoir le résultat » → remake 2
HOOK_END = 24.5

# flous (temps source, x, y, w, h)
BLURS = [(329.0, 340.7, 815, 418, 190, 38), (357.8, 364.6, 815, 418, 190, 38),        # e-mail dans la réponse de Claude
         (405.2, 413.0, 120, 815, 250, 215), (419.0, 424.2, 120, 815, 250, 215)]       # comptes suivis TikTok
TIKTOK = [(405.2, 413.0), (419.0, 424.2)]   # lecteur TikTok noir à la capture → on y incruste la référence
TK_BOX = (778, 74, 622, 932)


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


def fullcard(name, pill, lines, accent=None, alpha=235):
    """Carton plein écran (couvre la face cam quand Ibrahim lit, ou titre d'étape)."""
    path = f"{CARDS}/{name}.png"
    im = Image.new("RGBA", (1920, 1080), BG + (alpha,)); d = ImageDraw.Draw(im)
    fp = font(40, "SemiBold"); ft = font(92)
    pw = d.textlength(pill, font=fp) + 56
    y0 = 540 - (len(lines) * 110) // 2 - 70
    d.rounded_rectangle([960 - pw / 2, y0 - 33, 960 + pw / 2, y0 + 33], 33, fill=LIME_BG)
    d.text((960, y0), pill, font=fp, fill=LIME, anchor="mm")
    for i, l in enumerate(lines):
        y = y0 + 130 + i * 110
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


# ---------------------------------------------------------------- segments
# kind : face | screen | split ; s0/s1 = temps source (voix synchrone)
# cards : (t0, t1, png, x, y) en temps source ; zoom : (t0, t1, cx, cy, z) en temps source, coordonnées écran 1920x1080
def build_specs():
    C = {}
    def c(name, *a, **k): C[name] = card(name, *a, **k)
    c("v148", ["Top 30 « anime edits » TikTok", "(3 mois) : 148 M de vues"], 60, accent="148 M de vues")
    c("v74", ["Edits « aura farming » :", "74 M de vues"], 60, accent="74 M de vues")
    c("recette", ["Coupes sur le beat · étalonnage", "· son viral"], 60, accent="sur le beat")
    c("droits", ["Mangas connus, extraits de films", "= pas à eux, pas monétisable"], 60, accent="pas monétisable")
    c("collab", ["Higgsfield Katana"], 50, pill="COLLABORATION COMMERCIALE", accent="Katana")
    c("roles", ["Claude = le réalisateur", "Higgsfield = le moteur vidéo"], 62, accent="le réalisateur")
    c("lien", ["Lien dans la description"], 46, accent="description")
    c("credits", ["Katana dépense tes crédits sans confirmation :", "recharge ton compte avant de lancer"], 48, accent="sans confirmation")
    c("mcp", ["Higgsfield MCP : la prise", "qui branche Higgsfield sur Claude"], 52, accent="Higgsfield MCP")
    c("analyse", ["Claude analyse la référence", "image par image"], 56, accent="image par image")
    c("tiktoklien", ["Ton propre edit ou un lien TikTok", "→ Claude va le chercher lui-même"], 50, accent="lui-même")
    c("cta", ["Essaie Higgsfield Katana : 1er lien de la", "description + commentaire épinglé"], 52, accent="1er lien")
    c("next", ["Ton influenceur IA", "ne devrait pas être humain"], 56, pill="VIDÉO SUIVANTE", accent="pas être humain")
    C["orig"] = fullcard("orig", "LA SOLUTION", ["Du contenu 100 % original", "= monétisable"], accent="100 % original")
    for k, (n, t) in {"ch1": (1, ["Installer Claude Desktop"]), "ch2": (2, ["Connecter Higgsfield à Claude"]),
                      "ch3": (3, ["Refaire un edit de la bibliothèque"]), "ch4": (4, ["Refaire un edit trouvé sur TikTok"])}.items():
        C[k] = fullcard(k, f"ÉTAPE {n}", t, alpha=225)

    def lower(name):
        w, h = C[name][1]; return (1920 - w) // 2, 1080 - h - 40
    def top(name):
        w, h = C[name][1]; return (1920 - w) // 2, 30
    def at(t0, t1, name, pos=lower):
        x, y = pos(name); return (t0, t1, C[name][0], x, y)
    def full(t0, t1, name):
        return (t0, t1, C[name][0], 0, 0)

    S = []
    S.append(dict(n="hook", kind="split", which=2, s0=0.0, s1=HOOK_END))
    S.append(dict(n="i1", kind="face", s0=HOOK_END, s1=50.0, z=1.0, cards=[at(26.7, 35.4, "v148"), at(35.6, 40.2, "v74"), at(40.4, 49.8, "recette")]))
    S.append(dict(n="i2", kind="face", s0=50.0, s1=82.0, z=1.12, cards=[at(50.2, 60.8, "droits"), full(61.0, 66.6, "orig")]))
    S.append(dict(n="i3", kind="face", s0=82.0, s1=100.6, z=1.0, cards=[(82.1, 89.5, C["collab"][0], 60, 40), at(85.8, 96.8, "roles")]))
    # TUTO : écran réduit + bulle face cam
    S.append(dict(n="e1", kind="screen", s0=100.6, s1=163.6, cards=[full(100.6, 103.8, "ch1")]))
    S.append(dict(n="e2", kind="screen", s0=163.6, s1=230.8, zoom=[(176.0, 187.5, 960, 560, 1.6), (210.5, 222.5, 900, 420, 1.5)],
                  cards=[full(163.6, 166.8, "ch2"), at(164.8, 170.0, "lien", top), at(193.0, 200.5, "credits", top), at(215.5, 222.3, "mcp", top)]))
    S.append(dict(n="e3", kind="screen", s0=230.8, s1=346.2, zoom=[(311.5, 318.0, 520, 760, 1.5)], cards=[full(230.8, 234.0, "ch3")]))
    S.append(dict(n="e3f", kind="face", s0=346.2, s1=357.8, z=1.12, cards=[at(354.5, 357.6, "tiktoklien")]))
    S.append(dict(n="e3b", kind="screen", s0=357.8, s1=P1_AT, zoom=[(378.0, 391.0, 930, 420, 1.45)], cards=[at(381.0, 389.0, "analyse", top)]))
    S.append(dict(n="pay1", kind="split", which=1, s0=P1_AT, s1=P1_AT))
    S.append(dict(n="e4", kind="screen", s0=P1_AT, s1=457.6, cards=[full(P1_AT, P1_AT + 3.2, "ch4")]))
    S.append(dict(n="e4f", kind="face", s0=457.6, s1=P2_AT, z=1.12))
    S.append(dict(n="pay2", kind="split", which=2, s0=P2_AT, s1=P2_AT))
    S.append(dict(n="end", kind="face", s0=P2_AT, s1=END, z=1.0, cards=[at(467.6, 474.2, "cta"), at(474.4, 481.5, "next")]))
    return S


def zoom_expr(zooms, base):
    """Zooms fluides (ease 0,6 s) via zoompan, temps = base + in/30 ; plusieurs fenêtres possibles."""
    t = f"({base}+in/30)"
    zz, xs, ys = "1", "0", "0"
    for t0, t1, cx, cy, z in zooms:
        r = f"(if(lt({t},{t0}),0,if(lt({t},{t0}+0.6),({t}-{t0})/0.6,if(lt({t},{t1}-0.6),1,if(lt({t},{t1}),({t1}-{t})/0.6,0)))))"
        e = f"({r}*{r}*(3-2*{r}))"
        zz += f"+({z}-1)*{e}"
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


def split_dur(seg):
    return HOOK_END if seg["n"] == "hook" else (P1_DUR if seg["which"] == 1 else P2_DUR)


def render(seg):
    out = f"{PARTS}/{seg['n']}.mp4"; dur = seg["s1"] - seg["s0"]; kind = seg["kind"]
    inputs = []; f = []
    if kind == "face":
        inputs = ["-ss", f"{seg['s0']}", "-t", f"{dur}", "-i", FACE]
        z = seg.get("z", 1.0)
        f.append(f"[0:v]scale={int(1920 * z) // 2 * 2}:-2,crop=1920:1080:(iw-1920)/2:(ih-1080)/2-{int(30 * (z - 1) * 10)},setsar=1,fps=30[v0]" if z != 1.0 else "[0:v]fps=30,setsar=1[v0]")
    elif kind == "screen":
        inputs = ["-ss", f"{seg['s0']}", "-t", f"{dur}", "-i", SCREEN]
        last = "s0"; f.append(f"[0:v]fps=30,setsar=1[{last}]")
        # référence TikTok incrustée dans le lecteur noir
        for k, (t0, t1) in enumerate(TIKTOK):
            a, b = max(0, t0 - seg["s0"]), min(dur, t1 - seg["s0"])
            if b <= a: continue
            x, y, w, h = TK_BOX; ii = inputs.count("-i"); inputs += ["-stream_loop", "3", "-i", REF2]
            f.append(f"[{ii}:v]scale={w}:{h},setpts=PTS-STARTPTS+{a}/TB[tk{k}];[{last}][tk{k}]overlay={x}:{y}:enable='between(t,{a:.2f},{b:.2f})'[st{k}]"); last = f"st{k}"
        for k, (t0, t1, x, y, w, h) in enumerate(BLURS):
            a, b = max(0, t0 - seg["s0"]), min(dur, t1 - seg["s0"])
            if b <= a: continue
            f.append(f"[{last}]split[bA{k}][bB{k}];[bB{k}]crop={w}:{h}:{x}:{y},gblur=sigma=14[bC{k}];[bA{k}][bC{k}]overlay={x}:{y}:enable='between(t,{a:.2f},{b:.2f})'[vb{k}]"); last = f"vb{k}"
        if seg.get("zoom"):
            f.append(f"[{last}]{zoom_expr(seg['zoom'], seg['s0'])}[zm]"); last = "zm"
        mk, rg = bubble_assets()
        fi = inputs.count("-i"); inputs += ["-ss", f"{seg['s0']}", "-t", f"{dur}", "-i", FACE]
        mi = inputs.count("-i"); inputs += ["-loop", "1", "-t", f"{dur}", "-i", mk]
        ri = inputs.count("-i"); inputs += ["-loop", "1", "-t", f"{dur}", "-i", rg]
        f.append(f"[{last}]split[sa][sb];[sa]scale=1920:1080,gblur=sigma=30,eq=brightness=-0.12[bg];[sb]scale=1700:956[fg];[bg][fg]overlay=16:62[cmp];"
                 f"[{fi}:v]fps=30,crop=600:600:660:70,scale=280:280,format=rgba[fc];[{mi}:v]format=gray,scale=280:280[mk];[fc][mk]alphamerge[fm];"
                 f"[cmp][fm]overlay=1616:776:shortest=1[c1];[c1][{ri}:v]overlay=1612:772:shortest=1[v0]")
    elif kind == "split":
        dur = split_dur(seg)
        if seg["which"] == 1:
            inputs = ["-ss", f"{REF1_AT}", "-t", "11.1", "-i", SCREEN, "-i", REMAKE1]
            f.append(f"[0:v]crop={REF1_CROP},scale=-2:870,setsar=1,fps=30[l]")
        else:
            inputs = ["-i", REF2, "-i", REMAKE2]
            f.append("[0:v]scale=-2:870,setsar=1,fps=30[l]")
        inputs += ["-f", "lavfi", "-t", f"{dur}", "-i", "color=c=0x090b08:s=1920x1080:r=30"]
        f.append("[1:v]scale=-2:870,setsar=1,fps=30[r]")
        f.append("[2:v][l]overlay=(W/2-w)-30:190:eof_action=repeat[b1];[b1][r]overlay=W/2+30:190:eof_action=repeat[v0]")
        a1, a2 = ("L'edit d'origine", "Mon remake avec Katana")
        card("lab_o", [a1], 40, pill="RÉFÉRENCE"); card("lab_r", [a2], 40, pill="REMAKE", accent="Katana")
        lo, lr = Image.open(f"{CARDS}/lab_o.png"), Image.open(f"{CARDS}/lab_r.png")
        seg["cards"] = [(0, dur, f"{CARDS}/lab_o.png", 960 - 30 - lo.width + 30, 20), (0, dur, f"{CARDS}/lab_r.png", 960, 20)]
        seg = dict(seg, s0=0.0)
    last = f[-1].split("[")[-1].rstrip("]")
    g, last = overlay_cards(inputs, last, seg.get("cards", []), seg["s0"], dur); f += g
    f.append(f"[{last}]tpad=stop_mode=clone:stop_duration=2[vout]")
    cmd = ["ffmpeg", "-v", "error", "-y"] + inputs + ["-filter_complex", ";".join(f), "-map", "[vout]", "-an", "-t", f"{dur:.3f}"] + ENC + [out]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print(seg["n"], "ERREUR", r.stderr[-1500:]); sys.exit(1)
    print("ok", seg["n"], f"{dur:.1f}s", flush=True)


def audio():
    """Voix (+ trous aux 2 résultats) + son des remakes + 3 musiques + SFX. Temps de sortie = source + décalages."""
    out = f"{PARTS}/audio.wav"; A, B = P1_AT, P2_AT; D1, D2 = P1_DUR, P2_DUR; total = END + D1 + D2
    def ot(s): return s + (D1 if s >= A else 0) + (D2 if s >= B else 0)
    inp = ["-i", FACE, "-i", REMAKE2, "-i", REMAKE1, "-i", REMAKE2,
           "-i", f"{MUSIC}/m0_out_there.mp3", "-i", f"{MUSIC}/m3_in_the_gloom.mp3", "-i", f"{MUSIC}/m4_sonar.mp3"]
    f = [f"[0:a]atrim=0:{A},asetpts=PTS-STARTPTS[va]",
         f"[0:a]atrim={A}:{B},asetpts=PTS-STARTPTS,adelay={int(D1 * 1000)}:all=1[vb]",
         f"[0:a]atrim={B}:{END},asetpts=PTS-STARTPTS,adelay={int(D2 * 1000)}:all=1[vc]",
         "[va][vb][vc]concat=n=3:v=0:a=1,highpass=f=70,acompressor=threshold=-20dB:ratio=3:attack=5:release=120,loudnorm=I=-15:TP=-1.5:LRA=9[voice]",
         # hook : son du remake 2 sous la voix ; résultats : son plein, voix absente
         f"[1:a]atrim=0:{HOOK_END},loudnorm=I=-30,afade=t=out:st={HOOK_END - 1.5}:d=1.5[hk]",
         f"[2:a]loudnorm=I=-16,afade=t=in:d=0.05,adelay={int(ot(A) * 1000 - D1 * 1000)}:all=1[p1]",
         f"[3:a]loudnorm=I=-16,afade=t=in:d=0.05,adelay={int(ot(B) * 1000 - D2 * 1000)}:all=1[p2]",
         f"[4:a]atrim=0:{100.6 - HOOK_END + 1},afade=t=in:d=1.5,afade=t=out:st={100.6 - HOOK_END - 1}:d=1.5,loudnorm=I=-32,adelay={int(HOOK_END * 1000)}:all=1[m0]",
         f"[5:a]aloop=loop=-1:size=2e9,atrim=0:{A - 100.6},afade=t=in:d=1.5,afade=t=out:st={A - 100.6 - 2}:d=2,loudnorm=I=-32,adelay=100600:all=1[m3]",
         f"[6:a]aloop=loop=-1:size=2e9,atrim=0:{B - A},afade=t=in:d=1,afade=t=out:st={B - A - 2}:d=2,loudnorm=I=-32,adelay={int(ot(A) * 1000)}:all=1[m4]",
         f"[6:a]atrim=0:{END - B},afade=t=in:d=1,afade=t=out:st={END - B - 2.5}:d=2.5,loudnorm=I=-32,adelay={int(ot(B) * 1000)}:all=1[m5]"]
    sfx = [(0.0, "impact_whoosh_deep__mk1143.mp3", 0.5), (HOOK_END, "whoosh_cinematic_fast__mk1492.mp3", 0.45),
           (26.7, "pop_light_explainer__mk3005.mp3", 0.35), (35.6, "pop_light_explainer__mk3005.mp3", 0.35), (40.4, "pop_light_explainer__mk3005.mp3", 0.35),
           (50.2, "pop_light_explainer__mk3005.mp3", 0.35), (61.0, "whoosh_fast__mk1490.mp3", 0.4), (82.1, "pop_long__mk2358.mp3", 0.4),
           (85.8, "pop_light_explainer__mk3005.mp3", 0.35),
           (100.6, "impact_quick_zoom__mk772.mp3", 0.45), (163.6, "impact_quick_zoom__mk772.mp3", 0.45), (230.8, "impact_quick_zoom__mk772.mp3", 0.45),
           (176.0, "zoom_air_vacuum__mk2608.mp3", 0.35), (210.5, "zoom_air_vacuum__mk2608.mp3", 0.35), (311.5, "zoom_air_vacuum__mk2608.mp3", 0.35),
           (378.0, "zoom_air_vacuum__mk2608.mp3", 0.35), (193.0, "pop_dry_notif__mk2356.mp3", 0.35), (215.5, "pop_dry_notif__mk2356.mp3", 0.35),
           (381.0, "pop_dry_notif__mk2356.mp3", 0.35), (354.5, "pop_dry_notif__mk2356.mp3", 0.35),
           (467.6, "pop_light_explainer__mk3005.mp3", 0.35), (474.4, "pop_long__mk2358.mp3", 0.4)]
    # temps de sortie directs (résultats + étape 4)
    sfx_out = [(ot(A) - D1 - 2.0, "riser_trailer__mk790.mp3", 0.3), (ot(A) - D1, "impact_fast_hit__mk2180.mp3", 0.5), (ot(A), "impact_quick_zoom__mk772.mp3", 0.45),
               (ot(B) - D2 - 2.0, "riser_trailer__mk790.mp3", 0.3), (ot(B) - D2, "impact_fast_hit__mk2180.mp3", 0.5), (ot(B), "whoosh_fast__mk1490.mp3", 0.4)]
    items = [(ot(t) if t < A else (t + D1 if t < B else t + D1 + D2), fn, v) for t, fn, v in sfx] + sfx_out
    labs = []
    for k, (tt, fn, vol) in enumerate(items):
        i = inp.count("-i"); inp += ["-i", f"{SFX}/{fn}"]
        f.append(f"[{i}:a]volume={vol},adelay={int(tt * 1000)}:all=1[s{k}]"); labs.append(f"[s{k}]")
    f.append(f"[voice][hk][p1][p2][m0][m3][m4][m5]{''.join(labs)}amix=inputs={8 + len(labs)}:normalize=0:duration=longest,atrim=0:{total},alimiter=limit=0.95[aout]")
    cmd = ["ffmpeg", "-v", "error", "-y"] + inp + ["-filter_complex", ";".join(f), "-map", "[aout]", "-ar", "48000", "-ac", "2", out]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print("audio ERREUR", r.stderr[-2000:]); sys.exit(1)
    print("ok audio", flush=True)


def final(specs):
    lst = f"{PARTS}/list.txt"
    with open(lst, "w") as fh:
        for s in specs: fh.write(f"file '{PARTS}/{s['n']}.mp4'\n")
    out = f"{ROOT}/../07-final/higgs_katana_x1.00.mp4"; os.makedirs(os.path.dirname(out), exist_ok=True)
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
