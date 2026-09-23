# Audio reference

## Beat grid

- `beat = 60 / BPM`. Common picks: 100 BPM = 0.6 s (calm, premium), 120 BPM = 0.5 s (energetic), 90 BPM = 0.667 s (cinematic).
- Keep the whole timeline in beats. At 100 BPM a 30 s film is exactly 50 beats. At 120 BPM, a 30 s film is 60 beats.
- Pick a BPM that makes the target length a whole number of beats, and bar-aligned (a multiple of 4) if possible, so the music ends on a bar.
- Cuts land on beats. UI events and title entrances land on beats or half-beats. Nothing lands on arbitrary times.

## The generated soundtrack (`scripts/audio.mjs`)

- **Bed:** a detuned sine/saw pad playing i–VI–III–VII in a minor key (cinematic and loopable), with kicks on beats 1 and 3 (every beat for `driving`, none for `ambient`) and hats on the off-beats.
- **SFX:**
  - `boom`: a kick plus a 38 Hz sub tail of about 2.5 s. Use it on the hero reveal.
  - `whoosh`: filtered noise that swells and pans left→right, centred on `t`. Use it on spins and whips.
  - `chime`: FM bells on root + 5th + octave. Use it on the logo.
  - `tick`: a 2.2 kHz click. Use it on taps and highlights.
  - `riser`: noise with a rising filter that *ends* at `t`. Use it before the reveal.
- **Master:** a 20 ms fade-in, a fade-out of `fadeOut` seconds to digital silence (so the film loops), tanh soft-clip, and 16-bit 48 kHz stereo output.
- `SCENE.cues()` in the template derives cues from the shot list, so the picture and sound can't drift apart. Add custom cues by editing `cues()` rather than hand-writing times.
- It's deterministic: a seeded mulberry32 PRNG, so the same cues always produce a byte-identical WAV.

## Using a supplied track instead

1. Get its BPM and first downbeat, from the user or by detection: `ffmpeg -i track.mp3 -ac 1 -ar 22050 -f f32le -` → onset envelope → autocorrelation over 60–180 BPM. Confirm it: overlay ticks at the detected beats and check that the peaks align.
2. Set `FILM.bpm` to the track's BPM and offset the whole timeline by the first downbeat (`t_film = t_track - downbeat`).
3. Trim the track to the film length on a bar line, and add a 2–3 beat fade-out.
4. Mix the SFX on top at −6 dB relative to the music. Skip the generated bed.
5. Licensing: only use tracks the user owns or has licensed. Never pull music from the web.

## Mix and loudness

- Target about −14 LUFS integrated for social platforms, with a true peak ≤ −1 dBTP. With ffmpeg, a two-pass `loudnorm` does this: `ffmpeg -i music.wav -af loudnorm=I=-14:TP=-1:LRA=11 -ar 48000 music-norm.wav` (run the measurement pass first for exact values).
- Hierarchy: boom > whoosh > bed > tick. Keep the chime clear of the bed by letting the bed fade under it.
- A silent version (`--audio` omitted in encode.mjs) is for website heroes. Reels and TikTok autoplay muted, so titles have to carry the story without sound.
