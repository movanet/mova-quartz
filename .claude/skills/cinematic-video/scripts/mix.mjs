#!/usr/bin/env node
// Final soundtrack: narration lines placed at their manifest times, music ducked under the voice
// (sidechain compression), loudness-normalised for web/social (-14 LUFS, -1 dBTP).
//
// Usage: node mix.mjs --narration narration/narration.json --music music.wav --out mix.wav [--lufs -14]

import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"
import { createRequire } from "node:module"

const argv = process.argv.slice(2)
const arg = (k, d) => (argv.includes(`--${k}`) ? argv[argv.indexOf(`--${k}`) + 1] : d)
const man = JSON.parse(fs.readFileSync(arg("narration", "narration/narration.json"), "utf8"))
const music = arg("music", "music.wav")
const out = arg("out", "mix.wav")
const lufs = arg("lufs", "-14")

let ffmpeg = "ffmpeg"
if (spawnSync("ffmpeg", ["-version"]).status !== 0) {
  try { ffmpeg = createRequire(path.join(process.cwd(), "x.js"))("ffmpeg-static") } catch {
    console.error("No ffmpeg found. Install it or `npm i ffmpeg-static`."); process.exit(1)
  }
}

const inputs = ["-i", music]
const parts = []
man.segments.forEach((s, i) => {
  inputs.push("-i", s.file)
  const ms = Math.round(s.start * 1000)
  // Mono voice -> stereo centre, gentle presence EQ, placed at its start time.
  parts.push(`[${i + 1}:a]aresample=48000,pan=stereo|c0=c0|c1=c0,highpass=f=80,equalizer=f=3000:t=q:w=1:g=2,adelay=${ms}|${ms}[v${i}]`)
})
const n = man.segments.length
const graph = [
  ...parts,
  `${man.segments.map((_, i) => `[v${i}]`).join("")}amix=inputs=${n}:normalize=0:duration=longest,apad=whole_dur=${man.duration}[vo]`,
  `[vo]asplit=2[vo1][vokey]`,
  // Music sits about 12 dB under the voice while it speaks and swells back in the gaps.
  `[0:a]aresample=48000,volume=0.8[mus]`,
  `[mus][vokey]sidechaincompress=threshold=0.02:ratio=8:attack=60:release=600:makeup=1[duck]`,
  `[duck][vo1]amix=inputs=2:normalize=0:duration=first,atrim=0:${man.duration},loudnorm=I=${lufs}:TP=-1:LRA=11,aresample=48000[out]`,
].join(";")
const r = spawnSync(ffmpeg, ["-y", "-v", "error", ...inputs, "-filter_complex", graph, "-map", "[out]", "-ac", "2", "-c:a", "pcm_s16le", out], { stdio: "inherit" })
if (r.status === 0) console.log(`${out}: ${n} narration lines over ducked music, ${man.duration}s, target ${lufs} LUFS${man.placeholder ? " (narration is PLACEHOLDER silence)" : ""}`)
process.exit(r.status ?? 1)
