# SFX Benchmark Results — ElevenLabs vs Stability Audio

## Performance metrics (measured)

| Service | Sound | Latency | File size | Status |
|---|---|---|---|---|
| ElevenLabs | Chaos Arrive (f0) | **2.6s** | **24 KB** MP3 | ✅ OK |
| ElevenLabs | Sweep Exit (f55) | **1.7s** | **32 KB** MP3 | ✅ OK |
| ElevenLabs | iPhone Chime (f130) | **1.9s** | **9 KB** MP3 | ✅ OK |
| Stability | Chaos Arrive (f0) | 59.7s | 32,746 KB WAV | ✅ OK |
| Stability | Sweep Exit (f55) | 15.4s | 32,746 KB WAV | ✅ OK |
| Stability | iPhone Chime (f130) | 2.5s | — | ❌ HTTP 402 (out of credits) |

---

## Technical analysis

### Latency
| Service | Sound 1 | Sound 2 | Sound 3 | Average |
|---|---|---|---|---|
| ElevenLabs | 2.6s | 1.7s | 1.9s | **2.1s** |
| Stability | 59.7s | 15.4s | — | **~37.6s** |

→ **ElevenLabs is ~18x faster** on average. For an iterative animation workflow this is a massive practical advantage.

### File size
| Service | Sound 1 | Sound 2 | Sound 3 | Total |
|---|---|---|---|---|
| ElevenLabs | 24 KB | 32 KB | 9 KB | **65 KB** |
| Stability | 32,746 KB | 32,746 KB | — | **~64 MB** |

→ Stability generated **~32 MB per sound** regardless of requested duration (1.5–2 sec requested). The model appears to output a fixed-length clip (likely 45–90 sec minimum). This makes it **unusable for short SFX in animation** — a 64 MB audio bundle for a 5.5-second video is impractical.

→ ElevenLabs MP3 output is **~1000x smaller**. Total audio addition to the render: 65 KB. Negligible.

### Reliability
| Service | Completed | Failed |
|---|---|---|
| ElevenLabs | 3/3 ✅ | 0 |
| Stability | 2/3 | 1 (HTTP 402 — out of credits after 2 generations) |

---

## Workflow complexity

| Criteria | ElevenLabs | Stability Audio |
|---|---|---|
| Request format | JSON body | multipart/form-data |
| Auth | `xi-api-key` header | `Authorization: Bearer` header |
| Duration control | `duration_seconds` — works precisely | `seconds_total` — **ignored**, outputs fixed long clip |
| Output format | MP3 (compressed, small) | WAV (uncompressed, very large) |
| API clarity | Simple, predictable | Duration param non-functional for short SFX |
| Credits efficiency | 3 SFX from free tier | 2 SFX before credit exhaustion |

---

## Verdict

**Winner: ElevenLabs — no contest.**

| Criteria | Winner |
|---|---|
| Latency | ✅ ElevenLabs (18× faster) |
| File size | ✅ ElevenLabs (1000× smaller) |
| Reliability | ✅ ElevenLabs (3/3 vs 2/3) |
| Short SFX suitability | ✅ ElevenLabs (Stability min duration is too long) |
| Workflow simplicity | ✅ ElevenLabs |
| Cost efficiency | ✅ ElevenLabs (3 free vs 2 paid) |

**Stability Audio verdict:** not suitable for short sound effects — it is designed for music generation and ambient soundscapes, not sub-3-second SFX. File sizes of 32 MB per sound make it impractical for any animation workflow.

---

## Final choice for TeemDrop01

**Using ElevenLabs set** — all 3 MP3s from `public/audio/elevenlabs/`:
- `sfx-1-chaos-arrive.mp3` → f0, volume 0.7
- `sfx-2-sweep-exit.mp3` → f55, volume 0.85
- `sfx-3-iphone-chime.mp3` → f130, volume 0.9
