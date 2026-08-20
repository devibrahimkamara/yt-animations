/**
 * ElevenLabs Sound Effects — SFX Benchmark Script
 * Usage: ELEVENLABS_API_KEY=xxx node scripts/test-elevenlabs.mjs
 */

import { writeFileSync, mkdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "public/audio/elevenlabs");

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error("❌  Missing ELEVENLABS_API_KEY env variable");
  console.error("    Usage: ELEVENLABS_API_KEY=your_key node scripts/test-elevenlabs.mjs");
  process.exit(1);
}

const SOUNDS = [
  {
    id: "sfx-1-chaos-arrive",
    label: "Chaos Arrive",
    prompt: "Rapid cascade of software app windows appearing on screen, fast digital UI clicks and whooshes, building energy, crisp and clean",
    duration_seconds: 1.5,
    animationFrame: 0,
  },
  {
    id: "sfx-2-sweep-exit",
    label: "Sweep Exit",
    prompt: "Cinematic whoosh sweep, multiple windows flying offscreen simultaneously in all directions, powerful and dramatic, clean tail",
    duration_seconds: 2.0,
    animationFrame: 55,
  },
  {
    id: "sfx-3-iphone-chime",
    label: "iPhone Chime",
    prompt: "Clean bright iPhone unlock chime, premium and minimal, single short bell tone",
    duration_seconds: 0.5,
    animationFrame: 130,
  },
];

mkdirSync(OUT_DIR, { recursive: true });

const results = [];

console.log("\n🎵  ElevenLabs Sound Effects — Generating 3 SFX\n");
console.log("─".repeat(60));

for (const sound of SOUNDS) {
  process.stdout.write(`⏳  ${sound.label.padEnd(20)} generating...`);
  const t0 = Date.now();

  let res;
  try {
    res = await fetch("https://api.elevenlabs.io/v1/sound-generation", {
      method: "POST",
      headers: {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: sound.prompt,
        duration_seconds: sound.duration_seconds,
        prompt_influence: 0.3,
      }),
    });
  } catch (err) {
    console.log(` NETWORK ERROR: ${err.message}`);
    results.push({ ...sound, status: "NETWORK_ERROR", latencyMs: Date.now() - t0 });
    continue;
  }

  const latencyMs = Date.now() - t0;

  if (!res.ok) {
    const body = await res.text();
    console.log(` HTTP ${res.status}: ${body.slice(0, 120)}`);
    results.push({ ...sound, status: `HTTP_${res.status}`, latencyMs, error: body.slice(0, 120) });
    continue;
  }

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const outPath = join(OUT_DIR, `${sound.id}.mp3`);
  writeFileSync(outPath, buffer);

  const sizeKB = Math.round(statSync(outPath).size / 1024);
  console.log(` ✓  ${latencyMs}ms   ${sizeKB} KB`);
  results.push({ ...sound, status: "OK", latencyMs, sizeKB, outPath });
}

console.log("─".repeat(60));
console.log("\n📊  Results Summary\n");
console.log(
  "Sound".padEnd(22) +
  "Frame".padEnd(8) +
  "Latency".padEnd(12) +
  "Size".padEnd(10) +
  "Status"
);
console.log("─".repeat(60));
for (const r of results) {
  const latency = r.latencyMs ? `${(r.latencyMs / 1000).toFixed(1)}s` : "—";
  const size = r.sizeKB ? `${r.sizeKB} KB` : "—";
  console.log(
    r.label.padEnd(22) +
    `f${r.animationFrame}`.padEnd(8) +
    latency.padEnd(12) +
    size.padEnd(10) +
    r.status
  );
}

const allOk = results.every(r => r.status === "OK");
console.log("\n" + (allOk ? "✅  All 3 files generated successfully." : "⚠️  Some files failed — see errors above."));
if (allOk) {
  console.log(`📁  Output: public/audio/elevenlabs/\n`);
}
