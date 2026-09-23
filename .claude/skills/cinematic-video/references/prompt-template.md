# Prompt template: code-rendered cinematic video

Use this as (a) the brief the user fills in, or (b) your own checklist when the user gives you a one-liner. Any field left blank takes the default shown.

## The general prompt (copy, fill, send)

```text
Make me a {LENGTH=30}s {FORMAT=vertical 1080×1920 | horizontal 1920×1080 | square 1080×1080},
{FPS=30}fps {STYLE=Apple-style} film for {SUBJECT: my app / product / brand / dataset / event}.

INPUTS
- Visuals: {./screens (app screenshots, in story order) | ./model.glb | ./logo.svg | ./data.csv | URL to capture}
- Brand: colour {#RRGGBB}, font {Inter Display Semibold}, logo {./logo.png or "wordmark only"}
- Words: name "{NAME}", tagline "{TAGLINE}", CTA "{Free on App Store / Google Play | Visit example.com}"
- Language of all on-screen text: {English}
- Features/points to show, one per shot, in order:
  1. {feature}: {what to animate on screen: typing "…", highlight the …, tap …}
  2. …
- Platform: {Reels/TikTok/Shorts | YouTube | website hero (silent, loop) | keynote slide}

HOW TO BUILD IT (no AI video/image generation)
- Render with three.js/Canvas/HTML in headless Chromium (Playwright), one frame per timestamp
  (t = frame / fps), then encode with ffmpeg (H.264, yuv420p, faststart). Deterministic and frame-exact.
- The subject floats in a pure black void. Materials (titanium, glass, aluminium) lit by an
  environment map of light strips: warm rim behind-left, cool rim behind-right, soft top key.
  No floor, props, hands, gradients or lens flares.
- Use my visuals exactly as supplied: screenshots as a canvas texture with rounded corners,
  never redrawn, restyled or "improved". Animate UI on top of them (typing, reveals, highlights, taps).
- One continuous take: every content swap happens while the subject is edge-on, facing away, or
  mid-spin/whip. One camera move per shot (push, orbit, rise, drift). Motion blur on fast moves
  by averaging subframes (180° shutter); sharp when still.
- Music at {BPM=100} BPM (beat = 60/BPM s), generated in code, or {./track.mp3, aligned to its beat grid}.
  Every cut, title and UI event lands on a beat. Boom on the reveal, whoosh on spins,
  chime on the logo, soft ticks on taps/highlights. Fade to silence at the end.
- Titles: display font ~90px, white line 1 + grey (#86868b) line 2, one key word in the brand colour,
  ≤22 characters per line; in on fade + 40px slide-up + blur-to-sharp.
- Safe areas: {vertical: titles at y 230–450, nothing important below y 1550 or in the right 120px}.

STRUCTURE
cold open on a material detail → hero reveal with name → one feature per shot ({3–5}) →
{fan of 3 devices | product family | before/after} → logo + tagline + CTA → fade to black so it loops.

PROCESS
Before rendering: show me the shot list (beats, camera, screen, title, SFX) and a contact sheet
of one still per shot. Then render a low-res motion preview. Then the final.
Deliver: film.mp4, a poster frame PNG, the shot list, and the project folder so I can re-render.
```

## What changed vs. the original Reddit prompt, and why

| Original | Improved | Why |
|---|---|---|
| Hard-coded to one app, vertical, 30s | `{LENGTH}`, `{FORMAT}`, `{SUBJECT}`, `{PLATFORM}` slots | Same method works for products, logos, data, websites, horizontal/YouTube |
| "brand color #______" only | Colour + font + logo + name + tagline + CTA + language | These are the things Claude otherwise has to guess or invent |
| No per-feature intent | Numbered features with *what to animate* | UI animation is where the film earns attention; guessing it wastes renders |
| No process | Shot list → stills contact sheet → low-res preview → final | Catches composition and timing errors before an expensive full render |
| No deliverables | MP4 + poster + shot list + re-renderable project | The user can iterate without starting over |
| "Inter Display Semibold ~90px" only | + ≤22 chars/line, grey #86868b, easing spec | Stops titles wrapping into three lines and makes the look reproducible |
| Reels safe area only | Per-platform safe areas | Horizontal/website/keynote have different constraints |
| Generated music only | Or a supplied track, beat-aligned | Real campaigns often have licensed music |
| `.glb (or .fbx)` | Convert FBX → GLB before render | FBX loading in-browser is slow and fragile |

## Filled example (the original request, cleaned up)

```text
Make me a 30s vertical 1080×1920, 30fps Apple-style film for my app.

INPUTS
- Visuals: ./screens (01-home.png … 04-share.png, story order), phone model ./phone.glb (screen mesh "Screen")
- Brand: colour #FF5A36, font Inter Display Semibold, logo ./logo.png
- Words: name "Tidy", tagline "Your day, finally organised.", CTA "Free on App Store / Google Play"
- Features:
  1. Quick add: type "Lunch with Sam, Friday 1pm" into the input bar
  2. Focus view: highlight the "Today" card
  3. Shared lists: reveal the list top-to-bottom, tap the share button
- Platform: Reels/TikTok/Shorts

(HOW TO BUILD IT, STRUCTURE and PROCESS as in the template.)
```

## Variants: swap these blocks in

**Physical product (GLB):** "Inputs: ./product.glb, material notes (brushed aluminium body, glass top). Features become *details*: macro on the hinge, the port, the texture. Swap shots hide behind a 180° turn or a pass through black."

**Logo sting (5–8s):** "Inputs: ./logo.svg. Extrude the logo in three.js (SVGLoader → ExtrudeGeometry), chrome/glass material, a light-strip sweep across the face on a beat, settle, chime, fade. 1920×1080 and 1080×1920 versions."

**Data story (15–45s):** "Inputs: ./data.csv. One insight per shot. Numbers count up on the beat, bars/lines draw on with eased reveal, one highlighted series in the brand colour, the rest grey. Titles state the insight, not the metric."

**Website / SaaS:** "Inputs: https://example.com (capture full-page screenshots at 1440 and 390 wide with Playwright), laptop + phone models or procedural. Scroll the captured page inside the device screen on eased beats; features = sections."

**Event / announcement:** "Inputs: date, venue, speakers' photos. Kinetic typography only (no 3D), black void, one word per beat on the build, key date in brand colour, CTA on end card."

**Silent website hero loop:** "No audio. 8–12s, seamless loop (first frame = last frame), ≤4 MB MP4 + WebM, 1920×1080 and 1080×1350."
