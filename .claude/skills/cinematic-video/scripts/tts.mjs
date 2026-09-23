#!/usr/bin/env node
// Narration via OmniVoice (k2-fsa/OmniVoice, served by VoiceStudio's HTTP API).
// Voices each script line, measures it, and lays the lines out on the film's beat grid.
// Output: <out>/<id>.wav (48 kHz mono) + <out>/narration.json, which the scene, cues and mix all read.
//
// Usage:
//   node tts.mjs --script script.json --out narration            # real voices (needs OmniVoice)
//   node tts.mjs --script script.json --out narration --placeholder  # silent stand-ins, estimated timing
//
// script.json:
// {
//   "language": "English",
//   "voice": { "instruct": "female, middle-aged, low pitch, british accent" },  // or { "profile_id": "dfa49469" }
//   "speed": 0.95, "seed": 7,
//   "bpm": 90, "leadIn": 1.2, "gapBeats": 1, "tail": 3,
//   "segments": [ { "id": "s1", "text": "What is the purpose of life?" }, ... ]
// }
//
// Env: OMNIVOICE_URL (default http://127.0.0.1:3900). VoiceStudio binds to loopback on MMAPC:
// run this on MMAPC itself (or over SSH there); see the voicestudio-speak skill.
// Unchanged lines are cached (hash of text + voice + speed + seed), so re-runs only voice what changed.

import fs from "node:fs"
import path from "node:path"
import crypto from "node:crypto"
import { spawnSync } from "node:child_process"
import { createRequire } from "node:module"

process.on("uncaughtException", (e) => { console.error(`tts: ${e.message}`); process.exit(2) })

const argv = process.argv.slice(2)
const arg = (k, d) => (argv.includes(`--${k}`) ? argv[argv.indexOf(`--${k}`) + 1] : d)
const flag = (k) => argv.includes(`--${k}`)
const spec = JSON.parse(fs.readFileSync(arg("script", "script.json"), "utf8"))
const outDir = path.resolve(arg("out", "narration"))
const placeholder = flag("placeholder")
const BASE = (process.env.OMNIVOICE_URL ?? "http://127.0.0.1:3900").replace(/\/$/, "")
const SR = 48000
fs.mkdirSync(outDir, { recursive: true })

let ffmpeg = "ffmpeg"
if (spawnSync("ffmpeg", ["-version"]).status !== 0) {
  try { ffmpeg = createRequire(path.join(process.cwd(), "x.js"))("ffmpeg-static") } catch {
    console.error("No ffmpeg found. Install it or `npm i ffmpeg-static`."); process.exit(1)
  }
}

const BEAT = 60 / (spec.bpm ?? 90)
const snapUp = (t, grid) => Math.ceil(t / grid - 1e-9) * grid
const r3 = (x) => Math.round(x * 1000) / 1000

// --- OmniVoice ----------------------------------------------------------------
async function waitReady() {
  // The port opens long before the model is loaded; only status "ok" means ready (cold start ≤ ~2 min).
  const until = Date.now() + 300_000
  let last = ""
  while (Date.now() < until) {
    try {
      const h = await (await fetch(`${BASE}/health`, { signal: AbortSignal.timeout(5000) })).json()
      if (h.status === "ok") {
        if (!String(h.device ?? "").startsWith("cuda")) console.warn(`warning: OmniVoice is on ${h.device}, not CUDA; synthesis will be slow`)
        return
      }
      if (h.step !== last) console.log(`OmniVoice starting (${h.step ?? h.status})…`), (last = h.step)
    } catch (e) {
      if (!last) throw new Error(`OmniVoice not reachable at ${BASE} (${e.cause?.code ?? e.message}). ` +
        "Run on MMAPC (VoiceStudio), set OMNIVOICE_URL, or use --placeholder to continue with estimated timing.")
    }
    await new Promise((r) => setTimeout(r, 3000))
  }
  throw new Error("OmniVoice did not become ready within 300 s")
}

async function synth(seg) {
  const v = { ...spec.voice, ...seg.voice }
  const form = new FormData()
  form.set("text", seg.text)
  form.set("language", seg.language ?? spec.language ?? "English")
  form.set("speed", String(seg.speed ?? spec.speed ?? 1))
  form.set("seed", String(seg.seed ?? spec.seed ?? 7)) // pinned so a regenerated line matches its neighbours
  if (v.profile_id) form.set("profile_id", v.profile_id)
  else if (v.instruct) form.set("instruct", v.instruct) // controlled vocabulary; free text is rejected with 400
  const res = await fetch(`${BASE}/generate`, { method: "POST", body: form, signal: AbortSignal.timeout(600_000) })
  if (!res.ok) throw new Error(`OmniVoice ${res.status} on "${seg.id}": ${(await res.text()).slice(0, 300)}`)
  const ext = /wav/.test(res.headers.get("content-type") ?? "") ? "wav" : "mp3"
  const raw = path.join(outDir, `${seg.id}.raw.${ext}`)
  fs.writeFileSync(raw, Buffer.from(await res.arrayBuffer()))
  return raw
}

// --- audio helpers ------------------------------------------------------------
function toWav(src, dst) {
  // 48 kHz mono, trim leading/trailing silence so the layout reflects the words, not padding.
  const trim = "silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse"
  const r = spawnSync(ffmpeg, ["-y", "-v", "error", "-i", src, "-af", trim, "-ac", "1", "-ar", String(SR), "-c:a", "pcm_s16le", dst])
  if (r.status !== 0) throw new Error(`ffmpeg failed on ${src}: ${r.stderr}`)
}
const wavDur = (f) => (fs.statSync(f).size - 44) / (SR * 2)
function silence(dst, dur) {
  const n = Math.round(dur * SR), b = Buffer.alloc(44 + n * 2)
  b.write("RIFF", 0); b.writeUInt32LE(36 + n * 2, 4); b.write("WAVE", 8); b.write("fmt ", 12)
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(SR, 24)
  b.writeUInt32LE(SR * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write("data", 36); b.writeUInt32LE(n * 2, 40)
  fs.writeFileSync(dst, b)
}

// --- main ---------------------------------------------------------------------
const manifestPath = path.join(outDir, "narration.json")
const prev = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : { segments: [] }
const cache = Object.fromEntries(prev.segments.map((s) => [s.id, s]))
if (!placeholder) await waitReady()

let cursor = spec.leadIn ?? 1.2
const segments = []
for (const seg of spec.segments) {
  const key = crypto.createHash("sha1").update(JSON.stringify([seg.text, spec.voice, seg.voice, spec.language, spec.speed, seg.speed, spec.seed, seg.seed, placeholder])).digest("hex").slice(0, 12)
  const file = path.join(outDir, `${seg.id}.wav`)
  let dur
  if (cache[seg.id]?.hash === key && fs.existsSync(file)) {
    dur = wavDur(file)
  } else if (placeholder) {
    dur = Math.max(1.2, seg.text.split(/\s+/).length / 2.6 + 0.3) // ~156 wpm narration pace
    silence(file, dur)
  } else {
    const t0 = Date.now()
    const raw = await synth(seg)
    toWav(raw, file); fs.rmSync(raw)
    dur = wavDur(file)
    console.log(`voiced ${seg.id} (${dur.toFixed(2)}s) in ${((Date.now() - t0) / 1000).toFixed(1)}s`)
  }
  // Lines start on the half-beat grid so every cut the scene hangs off them lands in time with the music.
  const start = snapUp(cursor, BEAT / 2)
  segments.push({ id: seg.id, text: seg.text, file: path.relative(process.cwd(), file).split(path.sep).join("/"), start: r3(start), dur: r3(dur), hash: key })
  cursor = start + dur + (seg.gapBeats ?? spec.gapBeats ?? 1) * BEAT
}
const last = segments.at(-1)
const duration = r3(snapUp(last.start + last.dur + (spec.tail ?? 3), BEAT * 4)) // end on a bar line
const manifest = { bpm: spec.bpm ?? 90, beat: r3(BEAT), duration, placeholder, language: spec.language ?? "English", segments }
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
console.log(`${manifestPath}: ${segments.length} lines, film ${duration}s${placeholder ? " (PLACEHOLDER timing: re-run with OmniVoice before the final render)" : ""}`)
