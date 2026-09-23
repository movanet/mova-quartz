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
//   "mood": "minimal",                // minimal | driving | ambient (cinematic minor) | whimsical (major, plucks)
//   "fadeOut": 2.4,                   // seconds, ends on silence so the film loops
//   "cues": [ { "t": 2.4, "sfx": "boom" }, { "t": 7.2, "sfx": "whoosh", "len": 0.6 }, ... ]
// }
// sfx: boom | whoosh | chime | tick | riser (riser ends exactly at t) | pop | paper | scribble (len = seconds)

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
for (let bar = 0; bar < bars && mood !== "whimsical"; bar++) {
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
// Plucked mallet voice (marimba-ish): sine + 4th partial, fast decay. Used by the whimsical bed.
const pluck = (t0, semi, gain, decay = 7, panL = 1, panR = 1) => {
  const f = hz(root + 12 + semi)
  for (let s = 0; s < 1.2 * SR; s++) {
    const t = s / SR
    const v = gain * (Math.sin(TAU * f * t) + 0.25 * Math.sin(TAU * 4 * f * t) * Math.exp(-t * 30)) * Math.exp(-t * decay) * Math.min(1, t * 400)
    add(Math.floor((t0 + t) * SR), v * panL, v * panR)
  }
}
if (mood === "whimsical") {
  // I - vi - IV - V in major; bass on 1, off-beat chord plucks, shaker, and a seeded pentatonic melody.
  const chords = [[0, 4, 7], [-3, 0, 4], [-7, -3, 0], [-5, -1, 2]]
  const penta = [0, 2, 4, 7, 9, 12, 14, 16]
  let step = 3
  for (let bar = 0; bar < bars; bar++) {
    const ch = chords[bar % 4], t0 = bar * BEAT * 4
    pluck(t0, ch[0] - 12, 0.22, 3)
    pluck(t0 + BEAT * 2, ch[0] - 5, 0.14, 3)
    for (let q = 0; q < 4; q++) ch.forEach((n, k) => pluck(t0 + q * BEAT + BEAT / 2, n + 12, 0.035, 9, k === 0 ? 1 : 0.6, k === 2 ? 1 : 0.6))
    for (let e = 0; e < 8; e++) {
      if (bar % 8 >= 6 || rand() < 0.35) continue // phrases breathe; two bars in eight rest
      step = Math.max(0, Math.min(penta.length - 1, step + Math.round((rand() - 0.5) * 3)))
      pluck(t0 + e * BEAT / 2, penta[step] + 12, 0.07, 6, 0.7, 1)
    }
  }
  for (let b = 0; b * BEAT / 2 < DUR; b++) {
    for (let s = 0; s < 0.04 * SR; s++) {
      const t = s / SR
      add(Math.floor((b * BEAT / 2 + t) * SR), (b % 2 ? 0.03 : 0.018) * (rand() * 2 - 1) * Math.exp(-t * 120))
    }
  }
} else if (mood !== "ambient") {
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
  pop(t0) {
    // Cut-paper element landing: short pitched blip.
    for (let s = 0; s < 0.08 * SR; s++) {
      const t = s / SR
      add(Math.floor((t0 + t) * SR), 0.18 * Math.sin(TAU * (900 - 5000 * t) * t) * Math.exp(-t * 60))
    }
  },
  paper(t0, len = 0.35) {
    // Paper rustle / slide: crackly noise with random amplitude grains.
    let g = 0
    for (let s = 0; s < len * SR; s++) {
      const t = s / SR, x = t / len
      if (s % 240 === 0) g = rand() ** 3
      add(Math.floor((t0 + t) * SR), 0.22 * Math.sin(Math.PI * x) * g * (rand() * 2 - 1))
    }
  },
  scribble(t0, len = 0.8) {
    // Pencil on paper: band-limited noise, amplitude wobbling at stroke rate.
    let lp = 0, hp = 0
    for (let s = 0; s < len * SR; s++) {
      const t = s / SR
      const n = rand() * 2 - 1
      lp += 0.35 * (n - lp); hp = n - lp
      const stroke = 0.5 + 0.5 * Math.sin(TAU * 7 * t + 2 * Math.sin(TAU * 1.3 * t))
      add(Math.floor((t0 + t) * SR), 0.06 * hp * stroke * Math.min(1, t * 20, (len - t) * 20))
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
  const half = (2 * c.t) / BEAT, onGrid = Math.abs(half - Math.round(half)) < 1e-3 // beats and half-beats
  if (!onGrid && !["whoosh", "paper", "scribble"].includes(c.sfx)) console.warn(`warning: ${c.sfx} at ${c.t}s is off the half-beat grid (beat = ${BEAT}s)`)
  SFX[c.sfx](c.t, c.len)
}

// --- Master: fade-in, fade-out to digital silence, soft clip, normalise to -1 dBFS, 16-bit WAV
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
  L[i] = Math.tanh(L[i] * g * 0.6); R[i] = Math.tanh(R[i] * g * 0.6) // gentle glue, not distortion
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]))
}
const norm = peak > 0 ? 0.89 / peak : 1 // -1 dBFS headroom
for (let i = 0; i < N; i++) {
  buf.writeInt16LE(Math.round(L[i] * norm * 32767), 44 + i * 4)
  buf.writeInt16LE(Math.round(R[i] * norm * 32767), 46 + i * 4)
}
fs.writeFileSync(out, buf)
console.log(`${out}: ${DUR}s @ ${BPM} BPM (beat ${BEAT.toFixed(3)}s), ${spec.cues?.length ?? 0} cues, pre-norm peak ${peak.toFixed(2)} -> -1 dBFS`)
