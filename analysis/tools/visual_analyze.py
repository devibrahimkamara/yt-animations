"""Analyse visuelle locale d'une vidéo : coupes, zooms (scale inter-frames), cadrage visage.
Usage: python visual_analyze.py src.mp4 out.json
"""
import sys, json
import cv2
import numpy as np

src, out = sys.argv[1], sys.argv[2]
cap = cv2.VideoCapture(src)
fps = cap.get(cv2.CAP_PROP_FPS)
W = 480
face_det = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
orb = cv2.ORB_create(600)
bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)

frames = []
prev_gray, prev_kp, prev_des, prev_hist = None, None, None, None
i = 0
while True:
    ok, f = cap.read()
    if not ok:
        break
    h = int(f.shape[0] * W / f.shape[1])
    small = cv2.resize(f, (W, h))
    gray = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
    hsv = cv2.cvtColor(small, cv2.COLOR_BGR2HSV)
    hist = cv2.calcHist([hsv], [0, 1], None, [32, 32], [0, 180, 0, 256])
    cv2.normalize(hist, hist)
    rec = {"i": i, "t": round(i / fps, 3),
           "bright": float(gray.mean()), "sat": float(hsv[..., 1].mean())}
    if prev_hist is not None:
        rec["hdiff"] = float(cv2.compareHist(prev_hist, hist, cv2.HISTCMP_BHATTACHARYYA))
        rec["pdiff"] = float(np.abs(gray.astype(int) - prev_gray.astype(int)).mean())
    kp, des = orb.detectAndCompute(gray, None)
    scale = None
    if prev_des is not None and des is not None and len(kp) > 20 and len(prev_kp) > 20:
        m = bf.match(prev_des, des)
        if len(m) > 25:
            p0 = np.float32([prev_kp[x.queryIdx].pt for x in m])
            p1 = np.float32([kp[x.trainIdx].pt for x in m])
            M, inl = cv2.estimateAffinePartial2D(p0, p1, method=cv2.RANSAC)
            if M is not None and inl is not None and inl.sum() > 20:
                scale = float(np.sqrt(M[0, 0] ** 2 + M[1, 0] ** 2))
                rec["dx"], rec["dy"] = float(M[0, 2]), float(M[1, 2])
    rec["scale"] = scale
    if i % 3 == 0:
        faces = face_det.detectMultiScale(gray, 1.15, 5, minSize=(30, 30))
        if len(faces):
            x, y, fw, fh = max(faces, key=lambda r: r[2] * r[3])
            rec["face"] = [round(x / W, 3), round(y / h, 3), round(fw / W, 3), round(fh / h, 3)]
    frames.append(rec)
    prev_gray, prev_kp, prev_des, prev_hist = gray, kp, des, hist
    i += 1

# Détection de coupes : saut d'histogramme ou de pixels, sans scale cohérent
cuts = [0]
for r in frames[1:]:
    hard = r.get("hdiff", 0) > 0.35 or (r.get("pdiff", 0) > 28 and r["scale"] is None)
    if hard and r["i"] - cuts[-1] > 3:
        cuts.append(r["i"])
cuts.append(len(frames))

shots = []
for a, b in zip(cuts[:-1], cuts[1:]):
    seg = frames[a:b]
    sc = [r["scale"] for r in seg[1:] if r["scale"] is not None and 0.9 < r["scale"] < 1.1]
    cum = float(np.prod(sc)) if sc else 1.0
    faces = [r["face"] for r in seg if "face" in r]
    fh = float(np.median([f[3] for f in faces])) if faces else None
    fx = float(np.median([f[0] + f[2] / 2 for f in faces])) if faces else None
    shots.append({"start": seg[0]["t"], "end": round(b / fps, 3), "dur": round((b - a) / fps, 2),
                  "zoom_cum": round(cum, 3),
                  "zoom_per_s": round(cum ** (fps / max(len(seg), 1)), 4),
                  "face_h": round(fh, 3) if fh else None, "face_cx": round(fx, 3) if fx else None,
                  "face_pct": round(len(faces) / max(1, len(seg[::3])), 2),
                  "bright": round(float(np.mean([r["bright"] for r in seg])), 1),
                  "sat": round(float(np.mean([r["sat"] for r in seg])), 1)})

# Cadrage relatif au plan précédent (punch-in = même scène, visage plus grand)
for p, s in zip(shots, shots[1:]):
    if p["face_h"] and s["face_h"]:
        s["face_jump"] = round(s["face_h"] / p["face_h"], 2)

json.dump({"fps": fps, "n_frames": len(frames), "shots": shots}, open(out, "w"), indent=1)
print(f"{len(frames)} frames, {len(shots)} plans, durée moy {np.mean([s['dur'] for s in shots]):.2f}s")
