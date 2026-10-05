import json, subprocess, os, concurrent.futures as cf
RAW="/Volumes/SSD2/higgsfield INFLU 2"
edl=json.load(open('edl_monteur.json'))
os.makedirs('seg',exist_ok=True)
def job(k,x,kind):
    src=f"{RAW}/footage/{x['face']}" if kind=="face" else f"{RAW}/capture/{x['screen']}"
    t=x['face_t'] if kind=="face" else x['screen_t']
    n=round(x['e1']*30)-round(x['e0']*30)
    out=f"seg/{kind}_{k:03d}.mp4"
    if n<=0: return k,0
    vf="fps=30,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,format=yuv420p"
    subprocess.run(["ffmpeg","-v","error","-y","-hwaccel","videotoolbox","-ss",f"{t:.3f}","-i",src,"-frames:v",str(n),"-vf",vf,"-an","-c:v","h264_videotoolbox","-b:v","12M","-g","30","-r","30",out],check=True)
    return k,n
jobs=[(k,x,kind) for k,x in enumerate(edl) for kind in ("face","screen")]
with cf.ThreadPoolExecutor(4) as ex:
    for k,n in ex.map(lambda a: job(*a), jobs): pass
for kind in ("face","screen"):
    with open(f"list_{kind}.txt","w") as f:
        for k,x in enumerate(edl):
            if round(x['e1']*30)-round(x['e0']*30)>0: f.write(f"file 'seg/{kind}_{k:03d}.mp4'\n")
    subprocess.run(["ffmpeg","-v","error","-y","-f","concat","-safe","0","-i",f"list_{kind}.txt","-c","copy",f"{kind}_clean.mp4"],check=True)
    print(kind, subprocess.run(["ffprobe","-v","error","-count_packets","-select_streams","v:0","-show_entries","stream=nb_read_packets","-of","csv=p=0",f"{kind}_clean.mp4"],capture_output=True,text=True).stdout.strip(), "images (attendu", round(604.133*30),")")
