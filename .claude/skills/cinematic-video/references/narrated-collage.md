# Narrated films and the hand-drawn collage style

Read this for any film that is **voiced**: an explainer, an essay film, a "what is X?" piece, a story. It covers the hand-drawn / cut-paper collage look, narration with OmniVoice, and how picture, voice and music lock together. `templates/collage.html` together with `templates/collage-script.json` is a complete working example (the "What is the purpose of life?" film).

## Contents
1. Pipeline
2. Writing the script
3. OmniVoice narration
4. The collage look
5. Building scenes
6. Sound
7. Quality bar and self-review

---

## 1. Pipeline

```
concept → script.json ─► tts.mjs (OmniVoice) ─► narration/narration.json + one WAV per line
                                                   │  (line start times, snapped to the half-beat grid)
collage.html (scenes hang off narration lines) ◄───┘
   ├─ render.mjs → frames/            SCENE.cues() → cues.json (pops, paper, scribbles, chime)
   └─ audio.mjs (mood "whimsical") → music.wav
mix.mjs: narration placed at its times + music ducked under the voice + loudnorm -14 LUFS → mix.wav
encode.mjs: frames + mix.wav → film.mp4
```

The **narration drives the timeline**, not the other way round. Voice every line first, measure it, and hang the picture on the measured times. Never stretch or squash a voice to fit an animation.

## 2. Writing the script

- **Length:** 30–60 s is about 75–150 words at ~150 wpm, leaving room to breathe. Aim for 6–9 lines of one sentence or two short ones each. **One line = one scene = one idea.**
- **Shape:** a question or hook (≤ 8 words) → context → turn ("But…") → answer built from concrete images → a callback to the opening line as the ending. Ending on a reprise of the hook makes the film feel whole and lets it loop.
- **Write for the eye.** Every line needs something drawable, such as a coin on the pavement or a seed in the ground. Abstract lines ("purpose is multifaceted") give the illustrator nothing to draw, so rewrite them into images.
- **Write for the ear.** Use short words, and put commas where the voice should breathe. Avoid parentheses, abbreviations, numerals and symbols, because TTS reads them badly. Write "twenty twenty-six" and "percent" out in words.
- **Big questions get balance.** For a topic like the purpose of life, present several traditions fairly (philosophy, religion, personal meaning) and land on an open, humane answer rather than preaching one creed.
- Word cues: the template lets items appear on a spoken word (`at: "@seed"`). While writing, mark the word each visual should hit.

## 3. OmniVoice narration

OmniVoice (`k2-fsa/OmniVoice`) runs locally inside **VoiceStudio on MMAPC**, via an HTTP API at `127.0.0.1:3900`. It needs no API key and has no per-character cost. The `voicestudio-speak` skill documents the full API, and `scripts/tts.mjs` uses its native `POST /generate` endpoint.

- **Voice:** `voice.instruct` uses a **controlled vocabulary**, and free text returns HTTP 400. It combines gender (`female|male`), age (`child|teenager|young adult|middle-aged|elderly`), pitch (`very low pitch … very high pitch`), an optional `<x> accent` (american, australian, british, canadian, chinese, indian, japanese, korean, portuguese, russian) and optionally `whisper`. Good narrators:
  - Warm essay: `female, middle-aged, low pitch, british accent` ("The Librarian").
  - Intimate: `female, middle-aged, low pitch, whisper` ("The Calm Guide").
  - Storyteller: `male, elderly, low pitch, british accent`.
  - `GET /archetypes` lists 60 ready-made combinations.
  - Or use `voice.profile_id` for a cloned voice, such as Mova's own `dfa49469`.
- **Indonesian:** set `"language": "Indonesian"` and **omit the accent**, because there is no Indonesian accent item and adding one bends the pronunciation.
- **Consistency:** `seed` is pinned (the default is 7), so a regenerated line matches its neighbours. Keep `speed` at about 0.9–1.0, since the narration should never feel hurried. `tts.mjs` caches by text, voice, speed and seed, so editing one line re-voices only that line.
- **Where it runs:** VoiceStudio binds to loopback, so run `tts.mjs` on MMAPC itself (or over SSH there). Cold start takes up to about 2 minutes (`/health` reports `starting` while PyTorch loads), and synthesis is slower than real time (~7 s per sentence on the RTX 4060). If `/health` reports a device other than `cuda`, say so.
- **Not reachable** (for example in a cloud sandbox): run `tts.mjs --placeholder`. It writes silent stand-ins with estimated durations (~2.6 words/s), so scenes, stills and previews can go ahead, and `render.mjs` prints a `CHECK:` warning. **Do not quietly swap in a different TTS service.** The user chose OmniVoice. Finish everything else, then hand over the exact commands to re-voice and re-render on MMAPC, or ask before using another engine.
- **Licence:** the default OmniVoice weights are **CC-BY-NC (non-commercial)**. That's fine for personal, teaching and research films. For paid client work, flag it and switch to an Apache-2.0 engine in VoiceStudio (CosyVoice 3 or VoxCPM2). Never clone a third party's voice without their consent.

## 4. The collage look

The look is *whimsical, hand-made and warm*: cut-paper shapes on textured paper, animated like stop-motion.

- **Stop motion:** animation steps at **12 fps** ("on twos") even though the video is 30 fps. Only the camera moves smoothly. Every piece wobbles ±0.4° per step, and outlines **boil** (re-jitter) every 2 steps. This is what makes it read as hand-made rather than as vector animation.
- **Cut paper:** each shape has a stable torn silhouette plus a white cut border (as if cut from a magazine), a paper-fibre texture multiplied over the colour, and a soft contact shadow. The shadow grows while a piece is in the air on a drop.
- **Ink:** a double-pass stroke (pressure texture) that trembles per step and is drawn on progressively. Use it for arrows, underlines, crosses, limbs, stems and scribbles.
- **Type:** handwritten (Caveat Bold) for titles and words drawn on; a print hand (Patrick Hand) for captions on a paper strip. For emphasis, use the *cutout* style (white paper stroke with a shadow). Key words go on taped paper labels.
- **Palette:** 6–8 flat, slightly dusty colours on cream or kraft. The template uses cream #f3ead8, kraft #c9a57a, ink #2b2622, tomato #e2553f, mustard #e8b33c, teal #2f8f8a, cornflower #3a6ea5, blush #ef9fb0, leaf #6aa84f and navy #26324f. Alternate background sheets (cream → kraft → teal → cream…) so the cuts read.
- **Finish:** overlay film grain (4 tiles cycling on the step), a warm vignette, open from black and close to black.
- **Transitions:** a torn paper sheet (the next scene) slides across over ¾ beat, with a paper-rustle SFX. That is the only transition. It keeps the film one continuous hand-made object.
- **Composition:** at 16:9, keep titles in the upper 45% and the characters' feet around y 930–1000. Leave the bottom 130 px for captions. At 9:16, set `width: 1080, height: 1920` and stack elements vertically. Everything is placed in frame pixels.
- **Assets:** draw everything procedurally (shapes, figures, plants, bubbles, custom functions), so nothing needs licensing. If the user supplies photos, cut them out as collage pieces: mask them with a torn outline, desaturate slightly, and add a white border.

## 5. Building scenes

Each scene is `{ line, bg, camera, items }`. `line` ties it to a narration line, so the scene starts half a beat before that line (the picture leads the voice). `camera` is one smooth move per scene: `push`, `drift` or `tilt`. Items:

| kind | key fields | notes |
|---|---|---|
| `shape` | `shape` (circle, blob, cloud, star, heart, tri, rect), `x,y,w,h,color`, `dots` | cut-paper piece |
| `text` | `text,x,y,size,color`, `cutout`, `label` (paper colour), `rot` | anim `write` draws it on |
| `ink` | `path` (`arrow` from/to/bend, `underline` x/y/w, `cross` x/y/s), `color,width` | anim `draw`; add paths to `inkPaths` (a path may return several strokes) |
| `figure` | `x,y` (feet), `s`, `color`, `pose` (stand, wave, think) | paper person |
| `plant` | `x,y` (ground), `h`, `color` | anim `grow`: stem, then leaves, then flower |
| `bubble` | `x,y,w,h,tail:[dx,dy]`, `content` (scribble, heart, star, or any short text) | speech/thought bubble |
| `custom` | `draw(p, localT, boil, LIB)` | bespoke drawing using the same primitives; animates itself |

Timing: `at` is beats from the line start, or `"@word"` to land on a spoken word (estimated from the word's position in the line). Animations: `pop`, `drop`, `grow`, `slide-l|r|u`, `write`, `draw`, `none`. `len` is in beats.

Rules of thumb: bring in 3–6 items per scene, with an entrance every 1–2 beats. Land the most important item on the line's key word. Nothing should appear in the last beat of a scene (`check()` warns about it). Keep every element's final position clear of the others and of the caption strip. Verify all of this in stills.

## 6. Sound

- **Music:** `audio.mjs` mood `whimsical` plays a major I–vi–IV–V with a plucked mallet bed, off-beat chord plucks, a shaker and a seeded pentatonic melody that rests two bars in eight. Use 84–100 BPM, and set the key in `FILM.key` (for example F).
- **Foley:** `cues()` derives `pop` (a piece lands), `scribble` (ink or handwriting drawn on) and `paper` (the sheet wipe) from the scenes, plus a `chime` at the end of the last line. Every cut sits on the half-beat grid because the narration lines do.
- **Mix:** `mix.mjs` places each line at its time, puts the voice in the centre (80 Hz high-pass, +2 dB presence), ducks the music about 12 dB under the voice with sidechain compression, and swells it back in the gaps. It then loudness-normalises to −14 LUFS / −1 dBTP. The voice must always be intelligible, so if the music competes, lower `volume=0.8` in `mix.mjs`.
- **Captions:** they're on by default (paper strip, typed along with the voice), because social video autoplays muted.

## 7. Quality bar and self-review

"High production value" means nothing looks default, nothing is placeholder in the final, and nothing collides. Before delivering, do at least **two review passes on stills** (one per scene plus each wipe) and one on a 10 fps preview. Fix everything on this checklist:

- No overlaps between titles, labels, figures and captions. Nothing clipped at the frame edge.
- Every scene visibly shows its line's key image, and each item lands on its word.
- Colour variety between consecutive scenes, and at least one "delight" moment per scene (a bounce, a wave, a flower opening).
- Audio: voice intelligible over the music, no clipping, first and last frames silent and black.
- Placeholder narration is either replaced with OmniVoice or explicitly reported as outstanding.
