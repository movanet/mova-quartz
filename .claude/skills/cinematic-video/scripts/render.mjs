#!/usr/bin/env node
// Deterministic frame renderer: loads a scene page in headless Chromium and
// screenshots one PNG per timestamp. The page owns all animation; this script
// only tells it what time it is.
//
// Page contract (see templates/scene.html):
//   window.SCENE = {
//     width, height, fps, duration,      // film spec
//     ready: Promise<void>,              // resolves when assets + fonts are loaded
//     render(t: number): Promise<void>|void  // draw the exact frame at time t (seconds)
//   }
//
// Usage:
//   node render.mjs --scene ./scene.html --out ./frames [--from 0] [--to 30] [--every 1]
//   --every N   renders only every Nth frame (fast preview / contact sheet)
//   --stills "0,2.4,7.2"  renders only those timestamps to <out>/still-<t>.png
//   --ss 1      supersampling factor passed to the page (default 2; 1 = fast preview)
//   --cues f    write the scene's derived audio cue list to f (for audio.mjs)

import http from "node:http"
import fs from "node:fs"
import path from "node:path"
import { chromium } from "playwright"

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith("--")) acc.push([a.slice(2), all[i + 1]?.startsWith("--") ? true : all[i + 1] ?? true])
    return acc
  }, []),
)
const scenePath = path.resolve(args.scene ?? "scene.html")
const outDir = path.resolve(args.out ?? "frames")
const root = path.resolve(args.root ?? process.cwd())
fs.mkdirSync(outDir, { recursive: true })

// Static server rooted at the project so the page can import
// /node_modules/three/... and load ./screens, ./models, ./fonts over http
// (file:// blocks ES modules and texture CORS).
const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml",
  ".glb": "model/gltf-binary", ".gltf": "model/gltf+json", ".fbx": "application/octet-stream", ".hdr": "application/octet-stream",
  ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf", ".otf": "font/otf",
}
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(new URL(req.url, "http://x").pathname))
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
    res.writeHead(404).end()
    return
  }
  res.writeHead(200, { "Content-Type": MIME[path.extname(p).toLowerCase()] ?? "application/octet-stream" })
  fs.createReadStream(p).pipe(res)
})
await new Promise((r) => server.listen(0, "127.0.0.1", r))
const url = `http://127.0.0.1:${server.address().port}/${path.relative(root, scenePath).split(path.sep).join("/")}${args.ss ? `?ss=${args.ss}` : ""}`

const browser = await chromium.launch({
  // GPU-less containers: SwiftShader gives identical output every run.
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--hide-scrollbars"],
})
const page = await browser.newPage({ deviceScaleFactor: 1 })
page.on("console", (m) => m.type() === "error" && console.error("[page]", m.text()))
page.on("pageerror", (e) => console.error("[page]", e.message))
await page.goto(url)
await page.waitForFunction(() => window.SCENE?.ready)
await page.evaluate(() => window.SCENE.ready)
const spec = await page.evaluate(() => {
  const { width, height, fps, duration } = window.SCENE
  return { width, height, fps, duration }
})
await page.setViewportSize({ width: spec.width, height: spec.height })
console.log(`scene: ${spec.width}x${spec.height} @ ${spec.fps}fps, ${spec.duration.toFixed(2)}s`)

// Optional scene self-checks (e.g. a screen swap visible to camera, a cut off the beat).
for (const w of await page.evaluate(() => window.SCENE.check?.() ?? [])) console.warn("CHECK:", w)
// Optional: export audio cues derived from the same timeline, for audio.mjs.
if (args.cues) {
  const cues = await page.evaluate(() => window.SCENE.cues?.())
  if (cues) fs.writeFileSync(path.resolve(args.cues), JSON.stringify(cues, null, 2))
  console.log(`cues -> ${args.cues}`)
}

const shoot = async (t, file) => {
  await page.evaluate((t) => window.SCENE.render(t), t)
  await page.screenshot({ path: file, clip: { x: 0, y: 0, width: spec.width, height: spec.height } })
}

const started = Date.now()
if (args.stills) {
  for (const t of String(args.stills).split(",").map(Number)) {
    await shoot(t, path.join(outDir, `still-${t.toFixed(2)}.png`))
  }
} else {
  const from = Math.round(Number(args.from ?? 0) * spec.fps)
  const to = Math.round(Number(args.to ?? spec.duration) * spec.fps)
  const every = Number(args.every ?? 1)
  for (let f = from; f < to; f += every) {
    // Frame index -> time. Never accumulate floats (t += 1/fps drifts).
    await shoot(f / spec.fps, path.join(outDir, `${String(f).padStart(5, "0")}.png`))
    if (f % (spec.fps * 2) === 0) {
      const done = (f - from) / (to - from)
      const eta = done > 0 ? ((Date.now() - started) / done) * (1 - done) / 1000 : 0
      console.log(`frame ${f}/${to}  ${(done * 100).toFixed(0)}%  eta ${eta.toFixed(0)}s`)
    }
  }
}
console.log(`done in ${((Date.now() - started) / 1000).toFixed(1)}s -> ${outDir}`)
await browser.close()
server.close()
