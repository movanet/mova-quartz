#!/usr/bin/env node
// Code-generated soundtrack: a beat-locked bed plus sound effects at cue times.
// Pure math with seeded noise, so the same cues always give the same WAV.
//
// Usage: node audio.mjs --cues cues.json --out music.wav
//
// cues.json:
// {
//   "bpm": 100, "duration": 30, "sampleRate": 48000,
//   "key": "D",                       // root of the pad chord progression
//   "mood": "minimal",                // minimal | driving | ambient
//   "fadeOut": 2.4,                   // seconds, ends on silence so the film loops
//   "cues": [ { "t": 2.4, "sfx": "boom" }, { "t": 7.2, "sfx": "whoosh", "len": 0.6 }, ... ]
// }
// sfx: boom | whoosh | chime | tick | riser (riser ends exactly at t)

import fs from "node:fs"

const argv = process.argv.slice(2)
const arg = (k, d) => (argv.includes(`--${k}`) ? argv[argv.indexOf(`--${k}`) + 1] : d)
const spec = JSON.parse(fs.readFileSync(arg("cues", "cues.json"), "utf8"))
const out = arg("out", "music.wav")

const SR = spec.sampleRate ?? 48000
const BPM = spec.bpm ?? 100
const BEAT = 60 / BPM
const DUR = spec.duration
const N = Math.ceil(DUR * SR)
const L = new Float32Array(N)
const R = new Float32Array(N)
const TAU = Math.PI * 2

// Deterministic PRNG (mulberry32)
let seed = spec.seed ?? 1337
const rand = () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const NOTE = { C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5, "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11 }
const hz = (semisFromA4) => 440 * 2 ** (semisFromA4 / 12)
const root = (NOTE[spec.key ?? "D"] ?? 2) - 9 - 12 // root near the 3rd octave, relative to A4

const add = (i, l, r = l) => {
  if (i >= 0 && i < N) { L[i] += l; R[i] += r }
}

// --- Bed ---------------------------------------------------------------------
const mood = spec.mood ?? "minimal"
const bars = Math.ceil(DUR / (BEAT * 4))
// i - VI - III - VII (minor, cinematic, resolves nowhere so it can loop)
const progression = [[0, 3, 7], [-4, 0, 3], [3, 7, 10], [-2, 2, 5]]
for (let bar = 0; bar < bars; bar++) {
  const chord = progression[bar % progression.length]
  const t0 = bar * BEAT * 4
  const len = BEAT * 4
  for (const semi of chord) {
    for (const detune of [-0.06, 0.06]) {
      const f = hz(root + 12 + semi + detune)
      const pan = detune < 0 ? 0.7 : 1
      for (let s = 0; s < len * SR; s++) {
        const t = s / SR
        const env = Math.min(1, t / 0.8) * Math.min(1, (len - t) / 0.8)
        const v = 0.028 * env * (Math.sin(TAU * f * t) + 0.3 * Math.sin(TAU * 2 * f * t))
        add(Math.floor((t0 + t) * SR), v * pan, v * (1.7 - pan))
      }
    }
  }
}
const kick = (t0, gain = 0.5) => {
  for (let s = 0; s < 0.35 * SR; s++) {
    const t = s / SR
    const f = 45 + 90 * Math.exp(-t * 30)
    add(Math.floor((t0 + t) * SR), gain * Math.sin(TAU * f * t) * Math.exp(-t * 9))
  }
}
const hat = (t0, gain = 0.05) => {
  for (let s = 0; s < 0.05 * SR; s++) {
    const t = s / SR
    add(Math.floor((t0 + t) * SR), gain * (rand() * 2 - 1) * Math.exp(-t * 90))
  }
}
if (mood !== "ambient") {
  for (let b = 0; b * BEAT < DUR; b++) {
    const t = b * BEAT
    if (mood === "driving" || b % 2 === 0) kick(t, 0.35)
    hat(t + BEAT / 2)
  }
}

// --- SFX ---------------------------------------------------------------------
const SFX = {
  boom(t0) {
    kick(t0, 0.9)
    for (let s = 0; s < 2.5 * SR; s++) {
      const t = s / SR
      add(Math.floor((t0 + t) * SR), 0.35 * Math.sin(TAU * 38 * t) * Math.exp(-t * 1.6))
    }
  },
  whoosh(t0, len = 0.6) {
    // Band-limited noise swell, panned across, peaking at the midpoint.
    let lp = 0
    for (let s = 0; s < len * SR; s++) {
      const t = s / SR, x = t / len
      const env = Math.sin(Math.PI * x) ** 2
      const k = 0.02 + 0.25 * env
      lp += k * ((rand() * 2 - 1) - lp)
      const v = 0.5 * env * lp
      add(Math.floor((t0 - len / 2 + t) * SR), v * (1 - x), v * x)
    }
  },
  chime(t0) {
    for (const [semi, g] of [[24, 0.12], [31, 0.08], [36, 0.06], [43, 0.03]]) {
      const f = hz(root + 12 + semi)
      for (let s = 0; s < 3 * SR; s++) {
        const t = s / SR
        const v = g * Math.sin(TAU * f * t + 0.5 * Math.sin(TAU * f * 3.5 * t) * Math.exp(-t * 4)) * Math.exp(-t * 1.4)
        add(Math.floor((t0 + t) * SR), v, v)
      }
    }
  },
  tick(t0) {
    for (let s = 0; s < 0.03 * SR; s++) {
      const t = s / SR
      add(Math.floor((t0 + t) * SR), 0.15 * Math.sin(TAU * 2200 * t) * Math.exp(-t * 200))
    }
  },
  riser(tEnd, len = BEAT * 4) {
    let lp = 0
    for (let s = 0; s < len * SR; s++) {
      const t = s / SR, x = t / len
      lp += (0.01 + 0.3 * x * x) * ((rand() * 2 - 1) - lp)
      add(Math.floor((tEnd - len + t) * SR), 0.35 * x ** 2 * lp)
    }
  },
}
for (const c of spec.cues ?? []) {
  if (!SFX[c.sfx]) throw new Error(`unknown sfx "${c.sfx}" at ${c.t}`)
  const onBeat = Math.abs(c.t / BEAT - Math.round(c.t / BEAT)) < 1e-3
  if (!onBeat && c.sfx !== "whoosh") console.warn(`warning: ${c.sfx} at ${c.t}s is off the beat grid (beat = ${BEAT}s)`)
  SFX[c.sfx](c.t, c.len)
}

// --- Master: fade-in, fade-out to digital silence, soft clip, 16-bit WAV ------
const fadeIn = 0.02 * SR
const fadeOut = (spec.fadeOut ?? 2) * SR
const buf = Buffer.alloc(44 + N * 4)
buf.write("RIFF", 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write("WAVE", 8)
buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22)
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34)
buf.write("data", 36); buf.writeUInt32LE(N * 4, 40)
let peak = 0
for (let i = 0; i < N; i++) {
  const g = Math.min(1, i / fadeIn) * Math.min(1, (N - i) / fadeOut)
  const l = Math.tanh(L[i] * g * 1.2), r = Math.tanh(R[i] * g * 1.2)
  peak = Math.max(peak, Math.abs(l), Math.abs(r))
  buf.writeInt16LE(Math.round(l * 32000), 44 + i * 4)
  buf.writeInt16LE(Math.round(r * 32000), 46 + i * 4)
}
fs.writeFileSync(out, buf)
console.log(`${out}: ${DUR}s @ ${BPM} BPM (beat ${BEAT.toFixed(3)}s), ${spec.cues?.length ?? 0} cues, peak ${peak.toFixed(2)}`)
