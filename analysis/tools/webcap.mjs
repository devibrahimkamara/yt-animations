// Captures web réelles pour illustrer (PLAYBOOK §4.4bis) : Chrome de bureau sur un profil vierge (aucun compte), via CDP.
// Usage :
//   node webcap.mjs shot   <url> <sortie.png> [attente_s=6] [sélecteur]
//   node webcap.mjs record <url> <dossier_frames> <durée_s> [attente_s=6] [sélecteur]   → frames JPEG horodatées (frames.txt)
//   node webcap.mjs launch   → ouvre une fenêtre Chrome persistante (profil analysis/.webcap-profile, port 9444) ;
//     Ibrahim y passe lui-même un éventuel CAPTCHA / se connecte. Les commandes shot/record s'y rattachent si elle est ouverte.
//   Options env : W=1280 H=900 DPR=2 SCROLL=px (défilement doux pendant l'enregistrement) NAV=0 (ne pas recharger l'onglet)
import WebSocket from "/Users/ibrahimkamara/yt-animations/node_modules/ws/wrapper.mjs";
import { spawn } from "child_process";
import fs from "fs";
const [mode, url, out, a3, a4, a5] = process.argv.slice(2);
const W = +(process.env.W || 1280), H = +(process.env.H || 900), DPR = +(process.env.DPR || 2);
const PERSIST = 9444;
const alive = async (p) => { try { await fetch(`http://127.0.0.1:${p}/json/version`); return true; } catch { return false; } };
const shared = mode === "launch" || (await alive(PERSIST));
const port = shared ? PERSIST : 9333 + Math.floor(Math.random() * 500);
const prof = shared ? "/Users/ibrahimkamara/yt-animations/analysis/.webcap-profile" : fs.mkdtempSync("/tmp/webcap-");
const ch = shared && (await alive(PERSIST)) ? null : spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [`--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, "--no-first-run", "--no-default-browser-check", "--autoplay-policy=no-user-gesture-required", "--mute-audio", `--window-size=${W},${H + 120}`, "about:blank"], { stdio: "ignore", detached: shared });
if (mode === "launch") { ch && ch.unref(); console.log("Chrome ouvert (port 9444)"); process.exit(0); }
const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000));
let ws, id = 0; const pend = new Map(), handlers = [];
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pend.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
async function main() {
  let tgt;
  for (let k = 0; k < 40 && !tgt; k++) { await sleep(0.25); try { tgt = shared ? (process.env.NAV === "0" ? (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page" && !t.url.startsWith("chrome")) : await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })).json()) : (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page"); } catch {} }
  ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r) => ws.on("open", r));
  ws.on("message", (m) => { const d = JSON.parse(m); if (d.id && pend.has(d.id)) { const p = pend.get(d.id); pend.delete(d.id); d.error ? p.rej(new Error(d.error.message)) : p.res(d.result); } else handlers.forEach((h) => h(d)); });
  await send("Page.enable"); await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: DPR, mobile: false });
  if (process.env.NAV !== "0") await send("Page.navigate", { url });
  const wait = +(mode === "shot" ? a3 || 6 : a4 || 6);
  await sleep(wait);
  // fermer les bandeaux cookies/connexion : refus (choix le plus protecteur), jamais d'acceptation
  await send("Runtime.evaluate", { expression: `[...document.querySelectorAll('button')].filter(b=>/^(decline|refuser|reject|tout refuser|decline optional cookies)/i.test(b.innerText.trim())).forEach(b=>b.click());document.querySelectorAll('[class*="DivModalContainer"],[class*="login-modal"]').forEach(e=>e.remove());` });
  await sleep(1);
  const sel = mode === "shot" ? a4 : a5;
  let clip;
  if (sel) { const r = await send("Runtime.evaluate", { expression: `(()=>{const e=document.querySelector(${JSON.stringify(sel)});if(!e)return null;e.scrollIntoView({block:'center'});const b=e.getBoundingClientRect();return JSON.stringify({x:b.x,y:b.y,width:b.width,height:b.height})})()`, returnByValue: true }); if (r.result.value) clip = { ...JSON.parse(r.result.value), scale: 1 }; await sleep(0.5); }
  if (mode === "shot") {
    const r = await send("Page.captureScreenshot", { format: "png", ...(clip ? { clip } : {}) });
    fs.writeFileSync(out, Buffer.from(r.data, "base64"));
    console.log("ok", out, clip ? JSON.stringify(clip) : "page");
  } else {
    fs.mkdirSync(out, { recursive: true });
    const dur = +a3, list = []; let n = 0; const t0 = Date.now();
    handlers.push(async (d) => { if (d.method !== "Page.screencastFrame") return; const f = `${out}/f${String(n++).padStart(5, "0")}.jpg`; fs.writeFileSync(f, Buffer.from(d.params.data, "base64")); list.push([f, (Date.now() - t0) / 1000]); send("Page.screencastFrameAck", { sessionId: d.params.sessionId }).catch(() => {}); });
    await send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: W * DPR, maxHeight: H * DPR, everyNthFrame: 1 });
    const sc = +(process.env.SCROLL || 0);
    for (let s = 0; s < dur * 10; s++) { if (sc && s > 15) await send("Input.dispatchMouseEvent", { type: "mouseWheel", x: W / 2, y: H / 2, deltaX: 0, deltaY: sc / (dur * 10 - 15) }); await sleep(0.1); }
    await send("Page.stopScreencast");
    fs.writeFileSync(`${out}/frames.txt`, list.map(([f, t], i) => `file '${f.split("/").pop()}'\nduration ${((list[i + 1]?.[1] ?? dur) - t).toFixed(3)}`).join("\n") + "\n");
    fs.writeFileSync(`${out}/clip.json`, JSON.stringify(clip || null));
    console.log("ok", list.length, "frames");
  }
  if (shared && process.env.NAV !== "0") await fetch(`http://127.0.0.1:${port}/json/close/${tgt.id}`).catch(() => {});
  ws.close(); if (!shared) ch.kill(); await sleep(1); if (shared) return; try { fs.rmSync(prof, { recursive: true, force: true }); } catch {}
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); if (!shared && ch) ch.kill(); process.exit(1); });
