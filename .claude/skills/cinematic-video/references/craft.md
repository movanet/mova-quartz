# Craft reference

## Contents
1. Shot and camera language
2. Lighting and materials
3. The screen-swap trick (one continuous take)
4. UI animation vocabulary
5. Typography
6. Safe areas and formats
7. Motion blur and anti-aliasing
8. Adapting the template to other subjects
9. Performance and QA

---

## 1. Shot and camera language

- **One move per shot**, eased in and out (`easeInOut` cubic), for the whole shot. Moves: *push* (dolly toward the subject, ~10–15% closer), *pull* (reverse, good before an end card), *orbit* (±0.2 rad around the subject), *rise/fall* (vertical crane of ±0.4 units, looking at the subject), *drift* (lateral slide), *macro slide* (very close, travelling along an edge).
- **Vary the move between consecutive shots.** Push → orbit → rise → push reads as designed. Push → push → push reads as a template.
- **Lens:** a vertical fov of 28–32° for 9:16 and 22–26° for 16:9. A long lens flattens the subject and looks premium. A wide lens at close range distorts it and looks cheap.
- **Framing (vertical):** the subject's centre sits around y ≈ 1060 px, its top below the title band (≥ 560 px) and its bottom above 1550 px. The subject covers about 50% of the frame height, or 120%+ in macro.
- **Subject motion:** the hero angle is ±0.25–0.3 rad of Y rotation, so the side frame catches a rim light. While holding, add a slow sinusoidal drift (0.05 rad) and a vertical bob (0.015 units over 8 beats). Nothing is ever perfectly still.
- **Spins:** a half turn out of shot N (ease-in over 2 beats) and a half turn into shot N+1 (ease-out over 2 beats). The cut sits at the middle, where the phone faces away.

## 2. Lighting and materials

Light only through `scene.environment` (a PMREM of an emissive "studio" scene). Direct lights are optional and just add a specular sparkle.

| Strip | Position (subject at origin) | Size | Colour × intensity | Role |
|---|---|---|---|---|
| Warm rim | (-5, 1, -4) | 1.2 × 9 | #ffb070 × 6 | Orange edge on the left |
| Cool rim | (5, 1, -4) | 1.2 × 9 | #7fb4ff × 6 | Blue edge on the right |
| Top key | (0, 6, 1.5) | 6 × 1.5 | #ffffff × 3 | Soft sheen along the top surfaces |
| Front fill | (0, 0, 7) | 3 × 3 | #ffffff × 0.35 | Keeps black glass from going dead |

Variants: *brand rim* (tint one rim with the brand colour), *sweep* (animate a strip's position across the face on a beat, which means re-baking the PMREM or using a moving `RectAreaLight`), *monochrome* (both rims #ffffff for a sober look).

Materials (`MeshPhysicalMaterial`), with tone mapping `ACESFilmic` and exposure 1.0:
- Titanium: color #8a8a8f, metalness 1, roughness 0.3, clearcoat 0.3. Colour variants: natural #8a8a8f, black #3a3a3c, desert #b59a7a, blue #3d4a5c.
- Aluminium (laptop): #c7c8ca, metalness 1, roughness 0.35.
- Front glass: #050506, roughness 0.04, clearcoat 1.
- Frosted back glass: #2a2a2e, metalness 0.2, roughness 0.45.
- Screen: `MeshBasicMaterial`, `toneMapped: false` (UI colours must match the screenshots exactly).

## 3. The screen-swap trick

Content changes only while the screen can't be seen. In the template, shot *i* begins with the phone's Y rotation at `2πi − π` (its back to the camera), and `check()` warns when `cos(rotation) > 0.2` at a boundary. Other ways to hide a swap:
- **Whip pan**: the camera yaws fast (with motion blur) and the swap happens mid-whip.
- **Occluder pass**: a second device or a black foreground object crosses the lens.
- **Through black**: the subject rotates into a shadow where the env has no light.
- **Inside the UI**: when the app's own navigation produces the next screen (a push transition), animate that as UI and swap under it.

Camera cuts between shots are allowed only at those same hidden moments. That keeps the continuous-take illusion.

## 4. UI animation vocabulary (drawn into the screen canvas)

All of it is timed in beats from the shot start. The screenshot underneath is never modified.
- **type**: a pill input with text appearing at 14–20 characters/s and a brand-coloured caret that blinks every half-beat. Use for search, chat, quick-add.
- **highlight**: dim everything else to 55% black and stroke the target rect in the brand colour with a glow. Ease in over ¼ of the window and out over the last 15%.
- **reveal**: a soft-edged wipe from top to bottom, as if content is loading. Use it for lists and feeds.
- **tap**: a white ripple, 40→180 px radius, fading over 1.2 beats. Pair it with a `tick` SFX.
- Also possible: **scroll** (translate the screenshot inside the clip over a tall capture), **count-up** (numbers on the beat), **toggle** (a switch sliding to brand colour), **notification drop** (a banner that slides down with spring overshoot). Add these to `drawScreen` in the same pattern.

Put at most one UI event per 2 beats, and start the first one at least 1.5 beats after the phone settles.

## 5. Typography

- Font: Inter Display Semibold (download `InterDisplay-SemiBold.woff2` from rsms.me/inter into `./fonts`), SF Pro Display if the user has a licence, or `@fontsource/inter` 600 as a fallback. Letter spacing −0.025em, line height 1.04.
- Sizes at 1080 wide: hero name 120–140 px, feature title 84–96 px, tagline 60–68 px, CTA 36–42 px.
- Colours: line 1 #ffffff, line 2 #86868b, key word in the brand colour (one per title, marked as `*word*`). If the brand colour is dark (luminance < 0.25), use a lighter tint of it for the key word so it stays legible on black.
- Entrance: opacity 0→1, translateY 40→0 px, blur 14→0 px, expo-out over 1.2 beats, starting 1 beat after the shot starts (2 beats on the hero, after the reveal). Exit: fade + blur over 1 beat, ending 0.5 beat before the cut.
- Copy: at most 22 characters per line. Line 1 is the benefit ("Plan in seconds."), line 2 is how ("Just type what you need."). End with full stops, not exclamation marks.

## 6. Safe areas and formats

| Target | Size | Title band | Keep clear |
|---|---|---|---|
| Reels / TikTok / Shorts | 1080×1920 | y 230–450 | below y 1550, right 120 px, top 180 px |
| Instagram feed | 1080×1350 | y 120–300 | bottom 150 px |
| YouTube / web 16:9 | 1920×1080 | left third, y 380–700 | 5% margin on every side |
| Square | 1080×1080 | y 90–260 | bottom 120 px |
| Website hero loop | 1920×1080 & 1080×1350 | none (usually silent, no titles) | — |

Encode: H.264 High, yuv420p, CRF 16–18, AAC 256k, `+faststart`, 30 fps (60 only if the user asks). For web loops, also output VP9 WebM, no audio, ≤ 4 MB.

## 7. Motion blur and anti-aliasing

- The shutter is 180°, which means the subframes span half a frame interval. Subframe count scales with angular speed: 1 when still, 6 above 1 rad/s, 12 above 3 rad/s.
- Accumulate on a 2D canvas with `globalAlpha = 1/(k+1)` per subframe. That's an exact running mean with no float buffers.
- Anti-aliasing: supersample (render at 2× and downscale with `imageSmoothingQuality = "high"`). Don't rely on MSAA in SwiftShader.

## 8. Adapting the template to other subjects

Keep the skeleton: `FILM` config → `shotAt(t)` → `pose(t)` (sets every object and the camera) → `render(t)` (subframes + composite) → `overlays(t)` (DOM titles) → `check()` / `cues()`.

- **Laptop:** hinge the lid with `rotation.x`. The screen texture sits on the lid's inner plane. The cold open is a macro along the closed lid, the hero opens the lid on the boom, and swaps happen while the lid is closed or the laptop is turned away.
- **Watch:** a small subject, so use fov 20° and a closer camera. Hide swaps with a wrist turn (rotation.x) instead of a spin.
- **Physical product (GLB):** normalise the model's scale (the template already does this). Features become macro details, so the camera targets a named node's world position. Swaps are hidden with 180° turns.
- **Logo sting:** `SVGLoader` → `ExtrudeGeometry` (depth 0.2, bevel 0.02) with a chrome material (metalness 1, roughness 0.15), and animate a light strip sweeping across on a beat. 5–8 s long.
- **Data story:** skip three.js entirely. Use SVG or Canvas in the DOM, and make `render(t)` set attributes from `t`. Bars grow with expo-out on beats, numbers count up with `Intl.NumberFormat`, the key series is in the brand colour and the rest are #3a3a3c.
- **Website capture:** capture full-page PNGs with Playwright (at 1440 and 390 wide), then scroll them inside the screen clip on eased beats.
- **Pure kinetic type:** DOM only. One word or phrase per beat, scale 0.96→1 with blur-in, key word in the brand colour.

## 9. Performance and QA

- Iterate with `--ss 1 --stills` (seconds per still) and `--every 3` (a quick preview). Render the final at `--ss 2`.
- Parallelise: run N render processes with disjoint `--from/--to` ranges into the same folder. Frame names are absolute indices, so they won't collide.
- QA checklist before delivery:
  - `render.mjs` printed no `CHECK:` warnings, and `audio.mjs` printed no off-beat warnings.
  - `ffprobe` shows the expected duration (±1 frame), resolution, fps and an audio stream.
  - The contact sheet of one still per shot shows no clipped titles, nothing in the unsafe zones and no visible seams.
  - The first and last frames are black, so the film loops.
  - Every on-screen word is spelled correctly and comes from the user (no invented claims).
