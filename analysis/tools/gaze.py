"""Regard caméra / lecture du script (PLAYBOOK §4.4ter) : repère les passages où Ibrahim ne regarde pas l'objectif
(il lit son script sur l'ordinateur). Ces passages ne doivent jamais rester en face cam : illustration plein cadre.

Usage (serveur, venv) : gaze.py face.mp4 sortie.json [fps=5]
Sortie : {"fps", "samples": [[t, down, side, pitch, yaw]], "segments": [[début, fin, score]]}
  down/side = blendshapes MediaPipe (eyeLookDown / eyeLookOut-In moyennés), pitch/yaw = rotation de la tête (degrés).
"""
import json
import subprocess
import sys

import mediapipe as mp
import numpy as np
from mediapipe.tasks.python import BaseOptions, vision

W, H = 960, 540


def main():
    src, out = sys.argv[1:3]
    fps = float(sys.argv[3]) if len(sys.argv) > 3 else 5.0
    opts = vision.FaceLandmarkerOptions(base_options=BaseOptions(model_asset_path="/root/derush/face_landmarker.task"), output_face_blendshapes=True, output_facial_transformation_matrixes=True, num_faces=1, running_mode=vision.RunningMode.VIDEO)
    lm = vision.FaceLandmarker.create_from_options(opts)
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-i", src, "-vf", f"fps={fps},scale={W}:{H}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
    samples, i = [], 0
    while True:
        buf = p.stdout.read(W * H * 3)
        if len(buf) < W * H * 3:
            break
        t = i / fps
        img = mp.Image(image_format=mp.ImageFormat.SRGB, data=np.frombuffer(buf, np.uint8).reshape(H, W, 3))
        r = lm.detect_for_video(img, int(t * 1000))
        if r.face_blendshapes:
            b = {c.category_name: c.score for c in r.face_blendshapes[0]}
            m = np.array(r.facial_transformation_matrixes[0])[:3, :3]
            pitch = float(np.degrees(np.arctan2(-m[2, 1], m[2, 2])))
            yaw = float(np.degrees(np.arcsin(np.clip(m[2, 0], -1, 1))))
            down = (b["eyeLookDownLeft"] + b["eyeLookDownRight"]) / 2
            side = (b["eyeLookOutLeft"] + b["eyeLookInRight"] - b["eyeLookInLeft"] - b["eyeLookOutRight"]) / 2
            samples.append([round(t, 2), round(down, 3), round(side, 3), round(pitch, 1), round(yaw, 1)])
        else:
            samples.append([round(t, 2), None, None, None, None])
        i += 1
    json.dump({"fps": fps, "samples": samples}, open(out, "w"))
    print(f"{len(samples)} échantillons")


if __name__ == "__main__":
    main()
