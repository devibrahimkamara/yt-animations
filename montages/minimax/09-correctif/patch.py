# Correctif Tec-Do du 02/11 sans re-rendu Remotion : nouveau logo MiniMax Code + « Flash Preview » retiré.
# On part de la vidéo YouTube (seule copie restante du master) et on pose des patchs animés comme les cartes
# d'origine (blurIn / inOut de src/montage/lib.tsx), puis ffmpeg ré-encode en une passe.
import os, shutil, subprocess, sys
from PIL import Image, ImageFilter
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = f"{HERE}/yt/yt_1080.mp4"
OUT = sys.argv[1] if len(sys.argv) > 1 else f"{HERE}/MiniMax_montage_final_corrige_x1.00.mp4"
FPS = 30
LOGO = Image.open(f"{HERE}/logo_v2_864.png").convert("RGBA")
fr = lambda s: round(s * FPS)


def bez(x1, y1, x2, y2):
    def f(x):
        lo, hi = 0.0, 1.0
        for _ in range(40):
            m = (lo + hi) / 2
            bx = 3 * x1 * m * (1 - m) ** 2 + 3 * x2 * m * m * (1 - m) + m ** 3
            lo, hi = (m, hi) if bx < x <= 1 else (lo, m)
        m = (lo + hi) / 2
        return 3 * y1 * m * (1 - m) ** 2 + 3 * y2 * m * m * (1 - m) + m ** 3
    return f


EASE = bez(0.22, 1, 0.36, 1)
clamp = lambda v: max(0.0, min(1.0, v))
blur_p = lambda t, at, dur: EASE(clamp((t - at) / dur))
def in_out(t, end, i, o):
    a = EASE(clamp(t / i))
    x = clamp((t - (end - o)) / o)
    return min(a, 1 - x * x)


def logo(size):
    return LOGO.resize((size, size), Image.LANCZOS)


def plate(frame_t, box, src_dx=0, feather=4):
    """Morceau de carte vide pris à frame_t (décalé de src_dx px si la zone vide est à côté)."""
    p = f"{HERE}/frames/plate_{frame_t}.png"
    if not os.path.exists(p):
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", str(frame_t), "-i", SRC, "-frames:v", "1", p], check=True)
    x0, y0, x1, y1 = box
    im = Image.open(p).convert("RGBA").crop((x0 + src_dx, y0, x1 + src_dx, y1))
    a = Image.new("L", im.size, 0)
    a.paste(255, (feather, feather, im.width - feather, im.height - feather))
    im.putalpha(a.filter(ImageFilter.GaussianBlur(feather / 2)))
    return im


def bridge(frame_t, box, feather=3):
    """Remplit la zone par interpolation, ligne à ligne, entre les colonnes propres de gauche et de droite."""
    plate(frame_t, (0, 0, 8, 8))  # extrait l'image si besoin
    x0, y0, x1, y1 = box
    a = np.asarray(Image.open(f"{HERE}/frames/plate_{frame_t}.png").convert("RGB")).astype(float)
    L = a[y0:y1, x0 - 4:x0].mean(axis=1); R = a[y0:y1, x1:x1 + 4].mean(axis=1)
    w = np.linspace(0, 1, x1 - x0)[None, :, None]
    fill = L[:, None, :] * (1 - w) + R[:, None, :] * w
    im = Image.fromarray(fill.round().astype(np.uint8)).convert("RGBA")
    al = Image.new("L", im.size, 0); al.paste(255, (feather, 0, im.width - feather, im.height))
    im.putalpha(al.filter(ImageFilter.GaussianBlur(feather / 2)))
    return im


# Chaque occurrence : début/fin timeline (= <At from to>), éléments statiques (image, x, y), animation de la carte.
# anim(t) → (opacité, décalage y, flou px), d'après le composant d'origine.
card = lambda t: (blur_p(t, 0, 0.5), 30 * (1 - blur_p(t, 0, 0.5)), 12 * (1 - blur_p(t, 0, 0.5)))
OCC = [
    # PromptHero : AbsoluteFill inOut(0, 1.4, .25, .3) × blurIn(.2, .5, 30)
    ("prompt", 4.6, 6.0, [(logo(48), 314, 407)],
     lambda t: (in_out(t, 1.4, 0.25, 0.3) * blur_p(t, 0.2, 0.5), 30 * (1 - blur_p(t, 0.2, 0.5)), 12 * (1 - blur_p(t, 0.2, 0.5)))),
    # LogoCard (l'opacité inOut est écrasée par blurIn : la carte coupe net à la fin)
    ("logocard", 15.4, 17.6, [(logo(154), 1290, 474)], card),
    # TutoMap5, étape 1 : inOut(0, 13.1, .3, .4) × blurIn(.15, .5, 30)
    ("tuto", 17.3, 30.4, [(logo(38), 138, 601)],
     lambda t: (in_out(t, 13.1, 0.3, 0.4) * blur_p(t, 0.15, 0.5), 30 * (1 - blur_p(t, 0.15, 0.5)), 12 * (1 - blur_p(t, 0.15, 0.5)))),
    # InfoCard 3:07 : logo + sur-titre « M3.1 FLASH PREVIEW » → « M3.1 » (fond copié 210 px à droite)
    ("m31", 187.47, 201.82, [(logo(56), 1163, 267)], card),
    # InfoCard « Mon avis »
    ("avis", 582.85, 596.35, [(logo(56), 1223, 337)], card),
    # InfoCard CTA 10:03 : logo
    ("cta", 596.4, 606.3, [(logo(56), 1203, 207)], card),
]
# Ligne « Avec M3.1 Flash Preview » : la carte est vide à 598,9 s (la ligne sort à +3,3 s) → plaque propre, fixe.
LINE = ("cta_line", 596.4 + 0.5, 606.3, plate(598.9, (1415, 670, 1792, 760)), 1415, 670)

M = 40  # marge pour le flou et le décalage


def measured(a, b, tile):
    """Visibilité réelle de l'ancien logo, image par image (B − R moyen sur la tuile, normalisé)."""
    x, y, s = tile
    n0, n1 = fr(a), fr(b)
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-ss", f"{n0 / FPS}", "-i", SRC, "-frames:v", str(n1 - n0),
                          "-vf", f"format=rgb24,crop={s}:{s}:{x}:{y}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True).stdout
    fr_ = np.frombuffer(raw, np.uint8).reshape(-1, s, s, 3).astype(float)
    v = (fr_[..., 2] - fr_[..., 0]).mean(axis=(1, 2))
    v = np.clip((v - 0) / np.percentile(v, 80), 0, 1)
    return list(v) + [v[-1]] * (n1 - n0 - len(v))


def build(name, a, b, items, anim, tile):
    d = f"{HERE}/build/{name}"
    shutil.rmtree(d, ignore_errors=True)
    os.makedirs(d)
    x0 = min(x for _, x, _ in items); y0 = min(y for _, _, y in items)
    x1 = max(x + im.width for im, x, _ in items); y1 = max(y + im.height for im, _, y in items)
    base = Image.new("RGBA", (x1 - x0, y1 - y0))
    for im, x, y in items:
        base.alpha_composite(im, (x - x0, y - y0))
    W, H = base.width + 2 * M, base.height + 2 * M + 32
    W += W % 2; H += H % 2
    n0, n1 = fr(a), fr(b)
    vis = measured(a, b, tile)
    for k in range(n1 - n0):
        _, dy, bl = anim(k / FPS)
        o = min(1.0, 2 * vis[k])
        c = Image.new("RGBA", (W, H))
        if o > 0.002:
            c.alpha_composite(base, (M, M + round(dy)))
            if bl > 0.05:
                c = c.convert("RGBa").filter(ImageFilter.GaussianBlur(bl)).convert("RGBA")
            al = c.getchannel("A").point(lambda v: round(v * o))
            c.putalpha(al)
        c.save(f"{d}/{k:05d}.png")
    return d, n0, n1, x0 - M, y0 - M


# tuile de l'ancien logo (x, y, côté) mesurée sur les images fixes
TILES = {"prompt": (318, 411, 38), "logocard": (1297, 481, 138), "tuto": (143, 606, 27),
         "m31": (1169, 273, 44), "avis": (1229, 343, 44), "cta": (1209, 213, 44)}
layers = [build(*o, TILES[o[0]]) for o in OCC]


def live_bridge(name, a, b, box, feather=3):
    """Sur-titre 3:07 : « FLASH PREVIEW » effacé image par image, en raccordant les colonnes propres de chaque image
    (la carte laisse un peu passer l'écran qui défile derrière : un fond figé se verrait)."""
    d = f"{HERE}/build/{name}"
    shutil.rmtree(d, ignore_errors=True); os.makedirs(d)
    x0, y0, x1, y1 = box
    n0, n1 = fr(a), fr(b)
    w, h = x1 - x0 + 8, y1 - y0
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-ss", f"{n0 / FPS}", "-i", SRC, "-frames:v", str(n1 - n0),
                          "-vf", f"format=rgb24,crop={w}:{h}:{x0 - 4}:{y0}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True).stdout
    frs = np.frombuffer(raw, np.uint8).reshape(-1, h, w, 3).astype(float)
    t = np.linspace(0, 1, x1 - x0)[None, :, None]
    al = Image.new("L", (x1 - x0, h), 0); al.paste(255, (feather, feather, x1 - x0 - feather, h - feather))
    al = al.filter(ImageFilter.GaussianBlur(feather / 2))
    vis = measured(a, b, TILES["m31"])  # la carte entre en fondu : avant elle, on ne touche pas à l'écran
    for k in range(n1 - n0):
        f_ = frs[min(k, len(frs) - 1)]
        L = f_[:, :4].mean(axis=1); R = f_[:, -4:].mean(axis=1)
        im = Image.fromarray((L[:, None] * (1 - t) + R[:, None] * t).round().astype(np.uint8)).convert("RGBA")
        im.putalpha(al.point(lambda v, o=min(1.0, 2 * vis[k]): round(v * o)))
        im.save(f"{d}/{k:05d}.png")
    return d, n0, n1, x0, y0


layers.append(live_bridge("m31_eyebrow", 187.47, 201.82, (1320, 256, 1540, 346)))
# plaque de la ligne : fixe, opaque
ln, la, lb, lim, lx, ly = LINE
os.makedirs(f"{HERE}/build", exist_ok=True)
lim.save(f"{HERE}/build/{ln}.png")

args = ["ffmpeg", "-loglevel", "error", "-stats", "-y", "-i", SRC]
for d, *_ in layers:
    args += ["-framerate", str(FPS), "-i", f"{d}/%05d.png"]
args += ["-loop", "1", "-framerate", str(FPS), "-i", f"{HERE}/build/{ln}.png"]
fc, cur = [], "0:v"
for i, (d, n0, n1, x, y) in enumerate(layers, 1):
    fc.append(f"[{i}:v]setpts=PTS+{n0}/{FPS}/TB[p{i}]")
    fc.append(f"[{cur}][p{i}]overlay={x}:{y}:eof_action=pass:enable='between(n,{n0},{n1 - 1})'[v{i}]")
    cur = f"v{i}"
j = len(layers) + 1
fc.append(f"[{cur}][{j}:v]overlay={lx}:{ly}:shortest=0:enable='between(n,{fr(la)},{fr(lb) - 1})'[out]")
args += ["-filter_complex", ";".join(fc), "-map", "[out]", "-map", "0:a", "-c:v", "h264_videotoolbox", "-b:v", "8M", "-profile:v", "high",
         "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart", "-t", "610.94", OUT]
subprocess.run(args, check=True)
print("OK", OUT)
