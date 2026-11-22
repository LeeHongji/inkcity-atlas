# The inkcity Atlas promo film

A 43-second promo film ([watch it](https://leehongji.github.io/inkcity-atlas/media/inkcity-atlas-film.mp4)). Every picture in it is drawn by the real pages:
- **City shots:** each city page in `?f=0` mode draws any film frame at any camera through `SF.seek(n, cam)`. `src/city.js` loads the pages in hidden iframes and copies their canvas.
- **The guide shot:** the real Beijing page and its guide overlay, clicked by a script on a controlled clock (`tools/capture-guide.mjs`).
- **The twelve Polaroid photos:** drawn the same way, one page at a time, ahead of time (`tools/capture-twelve.mjs`). Twelve live engines in one tab run out of memory.
- **The desk scenes:** the desk, Polaroids, tape, highlights and index card are the gallery's own Looseleaf components, imported from `../gallery-src`.

The direction, shot list and picture rules are in `DIRECTION.md`. The timeline, every claim's source and every sound cue are in `plan.json`.

## Rebuild

Needs Node 18+, system Chrome, Python 3 with numpy/scipy, a working `ffmpeg`, and a copy of [guizang-product-video-skill](https://github.com/op7418/guizang-product-video-skill) (`<video-skill>` below) for its mixer and its click and typing sounds.

```sh
npm install
npx tailwindcss -i src/product.input.css -o src/product.css     # the gallery's stylesheet, scanned over the film
node tools/capture-guide.mjs                                     # public/clips/guide/*.jpg (252 frames)
node tools/capture-twelve.mjs                                    # public/clips/twelve/<city>/*.jpg (the twelve Polaroid photos)
npm run build
node stills.mjs public/poster 4.6 && mv public/poster/t004.60.png public/poster.png && rmdir public/poster && npm run build   # the opening's first frames
python3 audio/score.py && python3 audio/sfx.py                   # assets/music.wav, assets/sfx/*.wav
cp <video-skill>/assets/audio/sfx/{click,typing}.wav assets/sfx/
python3 audio/cues.py                                            # every sound cue into plan.json
python3 <video-skill>/scripts/mix_audio.py plan.json             # assets/master.wav, evidence/audio-mix.json
node render.mjs --audio assets/master.wav --output renders/inkcity-atlas-promo.mp4
node stills.mjs evidence/stills 2.5 7 25                         # any frames, in any order
```

`render.mjs` and `stills.mjs` drive system Chrome on the GPU (ANGLE on Metal). Set `FILM_SWIFTSHADER=1` to use SwiftShader instead (about 10 times slower). Set `FFMPEG` to point at a working ffmpeg if the one on `PATH` is broken.

The score and the pen, paper and desk sounds are original, synthesised from seeded noise and sines. The click and typing sounds come from the video skill's built-in set. Sources are listed in `evidence/audio-selection.json`.

## Licence

This folder started from the starter project of guizang-product-video-skill, © op7418, GNU AGPL-3.0. That covers `engine.js`, `client.jsx`, `film.jsx`, `film-store.js`, `kit/`, `adapters/`, `fixtures/`, `fake-api.js`, `product-context.jsx`, `presentations.jsx` and the `*.mjs` tools. This folder as a whole is therefore under AGPL-3.0: see `LICENSE` and `NOTICE.md`. The rest of the repository is MIT. The rendered film is not covered by the AGPL (see `NOTICE.md`).

