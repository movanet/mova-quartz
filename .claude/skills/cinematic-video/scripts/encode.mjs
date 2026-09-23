#!/usr/bin/env node
// Encode rendered PNG frames + WAV into a social-ready H.264 MP4.
// Uses system ffmpeg, or ffmpeg-static from node_modules if none is installed.
//
// Usage: node encode.mjs --frames ./frames --audio music.wav --fps 30 --out film.mp4 [--crf 16]
// CRF 16 suits clean 3D renders; grainy/textured 2D (the collage style) looks the same at ~20 and is half the size.

import { spawnSync } from "node:child_process"
import { createRequire } from "node:module"
import path from "node:path"

const argv = process.argv.slice(2)
const arg = (k, d) => (argv.includes(`--${k}`) ? argv[argv.indexOf(`--${k}`) + 1] : d)
const frames = path.resolve(arg("frames", "frames"))
const audio = arg("audio")
const fps = arg("fps", "30")
const out = arg("out", "film.mp4")
const crf = arg("crf", "16")

let ffmpeg = "ffmpeg"
if (spawnSync("ffmpeg", ["-version"]).status !== 0) {
  try {
    ffmpeg = createRequire(path.join(process.cwd(), "x.js"))("ffmpeg-static")
  } catch {
    console.error("No ffmpeg found. Install it (apt/brew) or `npm i ffmpeg-static`.")
    process.exit(1)
  }
}

const cmd = [
  "-y", "-framerate", fps, "-i", path.join(frames, "%05d.png"),
  ...(audio ? ["-i", audio] : []),
  // yuv420p + even dimensions + faststart = plays everywhere (iOS, Reels, TikTok, Shorts)
  "-c:v", "libx264", "-preset", "slow", "-crf", crf, "-pix_fmt", "yuv420p",
  "-profile:v", "high", "-movflags", "+faststart", "-r", fps,
  ...(audio ? ["-c:a", "aac", "-b:a", "256k", "-shortest"] : []),
  out,
]
const r = spawnSync(ffmpeg, cmd, { stdio: "inherit" })
process.exit(r.status ?? 1)
