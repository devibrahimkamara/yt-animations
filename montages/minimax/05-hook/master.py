"""Master −14 LUFS / −1 dBTP (2 passes) en ×1,00 et ×1,10. Usage : python3 master.py <raw.mp4> <prefixe_sortie>"""
import json, subprocess, sys
raw, pre = sys.argv[1], sys.argv[2]
for sp in ("1.00", "1.10"):
    vf = "null" if sp == "1.00" else "setpts=PTS/1.10"
    af = "anull" if sp == "1.00" else "atempo=1.10"
    s = subprocess.run(["ffmpeg", "-hide_banner", "-i", raw, "-af", f"{af},loudnorm=I=-14:TP=-1:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
    j = json.loads(s[s.rindex("{"):s.rindex("}") + 1])
    mi = f"measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-vf", vf, "-af", f"{af},loudnorm=I=-14:TP=-1:LRA=11:{mi}:linear=true,aresample=48000", "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "256k", f"{pre}_x{sp}.mp4"], check=True)
    print("OK", f"{pre}_x{sp}.mp4")
