# Isla Nova: Dino Patrol

A self-contained 3D arcade rail shooter — an original homage to 2015-era dinosaur-park
light-gun cabinets.

Served by Quartz's `Static` emitter at:

    /static/games/dino-arcade/index.html

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page shell, CSS and the HUD / screen markup |
| `game.js` | The entire game: models, AI, weapon, world, audio, loop |
| `three.min.js` | three.js r128, vendored so the game needs no CDN |

`index.html` falls back to the cdnjs copy of three.js if the vendored file is missing.

## Architecture (game.js)

1. **Helpers + `Audio`** — every sound is synthesised with WebAudio; no audio assets.
2. **Model builders** — `buildRaptor`, `buildDilo`, `buildPtero`, `buildTrike`,
   `buildRex`. Each returns `{ group, parts, height }`; animals face `+Z` with feet at
   `y = 0`. Meshes tagged `userData.crit` are head shots, `userData.mouth` is the rex's
   open mouth, `userData.noHit` is excluded from the crosshair ray.
3. **`DINO_TYPES`** — stats, palette and AI class per species.
4. **`Dino`** — one live animal: health bar sprites, walk/fly animation, and one of five
   AI routines (`stalk`, `spitter`, `flyer`, `charger`, `boss`).
5. **World** — `ZONES` describes four sectors (sky, fog, palette, wave script).
   `buildZone` generates the rail (a `CatmullRomCurve3`), terrain, road ribbon, props,
   fences, signage, pickups and weather.
6. **`Game`** — rail movement, wave gating, weapon, scoring, HUD and screens.

`window.DINO` exposes the scene graph and `Game` for debugging and automated smoke
tests.

## Tuning

- Species stats live in `DINO_TYPES`.
- Wave scripts live in `ZONES[n].beats` — `u` is the position along the rail (0–1).
- Weapon feel: `Game.weapon` (magazine, reload, reserve) and the damage constants in
  `Game.fire()`.
- `Game.assistTarget()` is the light-gun forgiveness radius: a shot that passes close to
  an animal still counts as a body hit.
