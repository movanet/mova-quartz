---
name: cinematic-video
description: 'Make professional animated films entirely in code, with no AI video models: (A) Apple-style product films, app promos, launch teasers and logo stings from screenshots, 3D models and brand assets; and (B) narrated explainers and essay films (for example "what is the purpose of life?") in illustrated styles such as whimsical hand-drawn cut-paper collage, voiced locally with OmniVoice (VoiceStudio). Renders three.js/Canvas/SVG scenes frame by frame in headless Chromium (Playwright), makes music and foley in code, mixes voice over ducked music, and encodes with ffmpeg. Deterministic and frame-exact. Use whenever the user wants a video, film, animation, explainer, promo, trailer, reel, teaser, motion graphic, voiced or narrated clip, "pure JavaScript animation", hand-drawn or collage animation, or an Apple-style clip for Reels, TikTok, Shorts, YouTube, a website or a class, including when they ask you to work autonomously on it.'
---

# Cinematic Video (code-rendered)

Every frame is a pure function of time `t`, rendered by a browser that you drive and encoded by ffmpeg. Nothing comes from a video or image model. That gives what AI video can't: the user's real pixels, frame-exact sync with sound and voice, art direction you fully control, and re-renders that come out identical every time.

```
                       ┌─ Mode A (product) ─ scene.html   three.js, beat-driven
assets/brief ─► plan ──┤
                       └─ Mode B (narrated) ─ script.json ─► tts.mjs (OmniVoice) ─► narration.json
                                              collage.html  Canvas 2D, narration-driven
      render.mjs → frames/   SCENE.cues() → cues.json → audio.mjs → music.wav
      Mode B only: mix.mjs  voice + ducked music → mix.wav
      encode.mjs → film.mp4 (H.264, yuv420p, AAC, faststart)
```

## Pick the mode

| | **A. Product film** | **B. Narrated film** |
|---|---|---|
| For | app/product promos, launch teasers, logo stings | explainers, essay films, stories, lessons |
| Driven by | the beat (shots are whole beats) | the narration (scenes hang off measured voice lines, snapped to the beat) |
| Look | subject in a black void, light-strip reflections | an illustrated 2D style; default hand-drawn cut-paper collage |
| Template | `templates/scene.html` | `templates/collage.html` + `templates/collage-script.json` |
| Read | `references/craft.md` | `references/narrated-collage.md` |

Both use `references/prompt-template.md` (brief A or B) and `references/audio.md`.

## Workflow

1. **Brief.** Pull the spec from the request, using the matching prompt template as a checklist. Look through the asset folders yourself. Ask only about things you can't infer or default, and never ask when the user said they're away (see *Working autonomously*).
2. **Plan first.** For Mode A, write a beat sheet (shot, beats, camera move, screen, title, SFX). For Mode B, write the **script** (one drawable idea per line, ≈150 wpm, 30–60 s is about 75–150 words), then a scene list (line → key image → items → key word).
3. **Scaffold** in a work folder, never inside the user's assets:
   - Install: `npm i three playwright ffmpeg-static @fontsource/inter @fontsource/caveat @fontsource/patrick-hand`.
   - Copy `scripts/` and the matching template, and edit its `FILM` block.
   - For other subjects or styles, keep the architecture (config → timeline → `render(t)` → `check()`/`cues()`) and replace the drawing code.
4. **Mode B: voice it.** `node scripts/tts.mjs --script script.json --out narration` voices each line with **OmniVoice** and writes `narration/narration.json` with measured, beat-snapped start times. If OmniVoice isn't reachable, use `--placeholder` and carry on (see the narrated reference).
5. **Look-dev with stills.** `node scripts/render.mjs --scene <template>.html --out stills --stills "…"` renders one still per shot or scene, plus one mid-transition. Build a contact sheet and **look at it** with the Read tool. Fix overlaps, composition, lighting and legibility here, while it's cheap. Do at least two passes.
6. **Motion check.** Render a preview with `--every 3` (plus `--ss 1` for Mode A), encode it, and check the timing, the swaps or wipes, and that each visual lands on its word.
7. **Final:**
   - Render: `render.mjs --cues cues.json` (full).
   - Music: `audio.mjs --cues cues.json --out music.wav`.
   - Mode B mix: `mix.mjs --narration narration/narration.json --music music.wav --out mix.wav`.
   - Encode: `encode.mjs --frames frames --audio (music|mix).wav --out film.mp4`.
   - Verify: duration, fps, size and audio stream, a few extracted frames, and no `CHECK:` warnings. Deliver the MP4, a poster frame, the shot list or script, and a short decision report.

Budget (measured on SwiftShader with no GPU):
- **Mode A:** a 30 s film took ~28 min at `--ss 1`, and `--ss 2` takes 2–3× that.
- **Mode B:** Canvas 2D is much cheaper, with a 42 s film taking about 10 min.
- **Stills:** about 2 s each.

Run full renders in the background and split long ones across processes with `--from/--to`.

## Working autonomously

When the user says they're away, or asks you to work until done:
- **Don't stop to ask.** Make reasonable choices (voice, palette, pacing, wording), record each in the decision report, and keep going.
- **Iterate on your own output.** Stills → fix → stills → preview → fix → final. The first render is a draft, never the deliverable. Hold it to the quality bar in `references/narrated-collage.md` §7, and to the non-negotiables below for product films.
- **Blocked on one piece?** Finish everything else. For example, if OmniVoice is unreachable, render with placeholder timing and leave exact re-run commands. Never silently substitute a different service the user didn't choose, such as another TTS or a cloud API.
- **Commit and push checkpoints** if working in a repo, so nothing is lost if the session ends.
- **Finish with a report:** what was made, where it is, the decisions taken, and anything outstanding.

## Non-negotiables (both modes)

- **Real, owned pixels.** Use the user's screenshots, logo and UI exactly as supplied (cover-fit, never redrawn, restyled or "improved"), and animate on top of them. Draw everything else in code, so there are no stock or web images to license.
- **Everything lands on time.** Mode A: cuts, titles, SFX and UI events land on beats or half-beats. Mode B: narration lines start on the half-beat grid, scenes lead their line by half a beat, and key visuals land on their spoken word (`"@word"`).
- **One camera move per shot or scene**, eased: push, orbit, rise, drift or tilt. Never combine them.
- **Hide every cut inside motion.** Mode A: swaps happen while the phone is edge-on or facing away, or mid-spin. Mode B: a torn-paper sheet wipe. Never cross-fade a visible screen.
- **Typography is restrained.**
  - Mode A: Inter Display Semibold, white plus grey (#86868b), one brand-colour key word, at most 22 characters per line.
  - Mode B: one handwritten face for titles and one print hand for captions.
- **Platform-safe layout.** Vertical: titles in the y 230–450 band, and nothing important below y 1550 or in the right 120 px. `?guides=1` shows these zones in Mode A. Mode B keeps the bottom 130 px for captions.
- **Loops cleanly.** Open from black, end on a closing image, fade to black, and fade the audio to digital silence.
- **Deterministic.** Never use `Math.random()`, `Date.now()`, `requestAnimationFrame` timing or CSS transitions. Use seeded PRNGs, compute time as `frame / fps`, and wait for fonts and textures before frame 0.
- **Mode A only:** a pure black void sculpted by light-strip reflections, and motion blur (subframe averaging) only on fast moves.
- **Mode B only:** stop-motion stepping at 12 fps with boiling lines, a smooth camera, and captions on.

## Default structures

**Mode A, 30 s at 100 BPM (50 beats):**

| # | Shot | Beats | Move | Sound |
|---|------|-------|------|-------|
| 1 | Cold open on a material detail | 4 | slow slide | riser |
| 2 | Hero reveal (spin), product name | 8 | push | whoosh → **boom** |
| 3–5 | One feature per shot: screen, UI animation, 2-line title | 8 each | orbit / rise / push | whoosh |
| 6 | Fan of 3 devices | 6 | pull | whoosh |
| 7 | Logo, tagline, CTA, fade to black | 8 | none | **chime** |

**Mode B, 30–60 s:** hook question → context → turn ("But…") → answer in concrete images → reprise of the hook as the ending. That's 6–9 lines, one scene each, alternating background sheets, with 3–6 items per scene.

## References (read when relevant)

- `references/prompt-template.md`: briefs A and B with fillable fields, each Reddit prompt cleaned up as a worked example, what was improved and why, and variants. **Read it first** when a user asks for a film, or asks you to write the prompt.
- `references/craft.md`: Mode A camera language, lighting and materials, the screen-swap trick, UI animation, typography, safe areas, adapting to other subjects, and performance.
- `references/narrated-collage.md`: Mode B. Script writing, OmniVoice (voices, language, caching, licence, what to do when it's unreachable), the collage look, the scene and item API, sound, and the quality checklist.
- `references/audio.md`: beat grids, the generated bed and SFX, using a licensed track, and loudness.

## Scripts

- `scripts/render.mjs`: static server + headless Chromium. It calls `SCENE.render(t)` for each frame and saves PNGs. Flags: `--from/--to/--every/--stills/--ss/--cues`. It prints `CHECK:` warnings from `SCENE.check()`.
- `scripts/tts.mjs`: script → OmniVoice (`POST /generate` on VoiceStudio, `OMNIVOICE_URL`, default `127.0.0.1:3900`). It waits through cold start, trims silence, resamples to 48 kHz, caches unchanged lines, and snaps line starts to the half-beat grid, producing `narration.json`. `--placeholder` gives estimated timing without a voice.
- `scripts/audio.mjs`: `cues.json` → stereo 48 kHz WAV, normalised to −1 dBFS.
  - Moods: `minimal | driving | ambient` (cinematic minor) and `whimsical` (major, plucked mallets, melody).
  - SFX: `boom | whoosh | chime | tick | riser | pop | paper | scribble`.
- `scripts/mix.mjs`: narration placed at its times, the music sidechain-ducked about 12 dB under the voice, voice EQ, and loudnorm to −14 LUFS / −1 dBTP.
- `scripts/encode.mjs`: frames + WAV → H.264 High, CRF 16, yuv420p, AAC 256k, `+faststart`. Uses system ffmpeg or `ffmpeg-static`.
- `templates/scene.html`: a Mode A phone product film (a procedural titanium phone or the user's GLB) with light-strip env map, canvas screen UI animation, motion blur, 2× supersampling, `check()` and `cues()`.
- `templates/collage.html` + `templates/collage-script.json`: a Mode B hand-drawn collage film, the "What is the purpose of life?" worked example. It has procedural paper, torn cut-outs, ink, figures, plants and bubbles, handwritten type, a stop-motion step, sheet wipes, captions, word-synced entrances, `check()` and `cues()`.
- Scrub any frame in a browser with `?t=12.5` (add `&ss=1&guides=1` for Mode A).

## Gotchas

- Serve over http (render.mjs does this). `file://` breaks ES modules, `fetch` and texture loading.
- OmniVoice binds to loopback on MMAPC, so run `tts.mjs` there or over SSH. A cold start of up to ~2 min is normal. `instruct` accepts only the controlled vocabulary. The default weights are **CC-BY-NC**, so flag this for commercial work.
- A GLB's screen mesh needs 0–1 UVs; set `FILM.screenMesh`. Convert FBX to GLB before rendering.
- Hardware MSAA under SwiftShader leaves seams along triangle edges. Supersample instead.
- Canvas textures need `needsUpdate = true` and `colorSpace = SRGBColorSpace`.
- Fonts: ship them locally (`@fontsource/*`) and call `await document.fonts.load(…)` before frame 0. CDNs may be blocked in sandboxes.
- Keep on-screen and spoken words in the user's language and meaning. Don't invent product claims or quotes. For big or contested topics, present several perspectives fairly.
