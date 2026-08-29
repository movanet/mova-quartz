---
publish: true
title: Games
---

# Games

Small, self-contained browser games built for this site. Everything runs client-side —
no accounts, no downloads, no tracking.

| Game | Genre | Play |
|------|-------|------|
| **Isla Nova: Dino Patrol** | Arcade rail shooter (3D) | [Launch](/static/games/dino-arcade/index.html) |

---

## Isla Nova: Dino Patrol

An original, fan-made homage to the dinosaur-park light-gun cabinets that showed up in
arcades around 2015. You ride shotgun in a patrol jeep on a fixed route through four
sectors of a failing wildlife park, sedating everything that charges the vehicle.

**How to play**

| Input | Action |
|-------|--------|
| Mouse | Aim |
| Left click / Space | Fire tranquilizer dart |
| Right click / `R` | Reload |
| `P` / `Esc` | Pause |
| `M` | Mute |

On a phone or tablet, tap anywhere to aim and fire.

**What's in it**

- Four sectors — Gallimimus Valley (dusk), Aviary Ridge (night storm), Herbivore Plains
  (dawn) and Paddock Nine, which ends in a Tyrannosaurus boss fight.
- Seven animal types with their own behaviour: pack-hunting raptors, an alpha, compys,
  venom-spitting dilophosaurs, diving pteranodons, charging triceratops and the rex.
- Head shots and, on the rex, shots into an open mouth do far more damage than body hits.
- Shoot the crates for darts and repairs, the amber canisters for DNA bonuses, and the
  pink beacons to airlift stranded rangers.
- Combo multiplier up to 4× for consecutive hits; missing resets it.

Every 3D model, the terrain, the weather and all of the sound effects are generated in
code at load time. The only dependency is three.js, which is vendored next to the game,
so it works offline once the page has loaded.

> [!note]
> This is an original tribute, not a port. No copyrighted characters, logos, artwork,
> audio or level data from any commercial game are used.
