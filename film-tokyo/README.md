# "Tokyo, redrawn", the inkcity Atlas Tokyo film

A 30-second square film for X that shows the rebuilt Tokyo:
- it opens on the Shibuya scramble and pulls back to the whole city;
- it dives into Tokyo Tower;
- it shows the landmarks, the signs and the city's life in close-ups cut on the beat;
- it turns the Sumida bank through the four seasons;
- it ends on the whole city in the snow.

Every picture in it is drawn by the real Tokyo page:

- **The city:** `cities/tokyo/index.html` in `?f=0` mode, in hidden same-origin iframes (`src/city.js`).
  - `SF.seek(n, cam)` draws film frame n at any camera, so the pull-backs and the dive are the page redrawing at every
    zoom.
  - The film copies the middle 1080 square of the page's 1920×1080 frame.
  - One iframe per season (`?season=`); at most two are loaded at once.
- **The season wipe:** the page's own `drawWipe` (`engine/90_app.js`), recomposed frame by frame. The new season is
  drawn, then the old season's last frame on top, clipped to the same ragged, feathered edge.
- **The words:** the gallery's own Looseleaf `Lettering`, imported from `../gallery-src`.
- **The red 東京 seal:** the strokes of Tokyo's own lettering table (`cities/tokyo/src/37_kana.js`, extracted by
  `tools/seal.mjs`).

The direction, shot list and picture rules are in `DIRECTION.md`. The timeline, every claim's source and every sound
cue are in `plan.json`.

## Rebuild

Needs Node 18+, system Chrome, Python 3 with numpy/scipy, a working `ffmpeg`, and a copy of
[guizang-product-video-skill](https://github.com/op7418/guizang-product-video-skill) (`<video-skill>` below) for its
mixer. `node_modules` is a link to `../film/node_modules`.

```sh
npx tailwindcss -i src/product.input.css -o src/product.css     # the gallery's stylesheet, scanned over the film
node tools/seal.mjs                                              # src/seal.json: 東 and 京 from Tokyo's stroke table
npm run build
python3 audio/score.py && python3 audio/sfx.py                   # assets/music.wav, assets/sfx/*.wav
python3 audio/cues.py                                            # every sound cue into plan.json
python3 <video-skill>/scripts/mix_audio.py plan.json             # assets/master.wav, evidence/audio-mix.json
node render.mjs --audio assets/master.wav --output renders/tokyo-redrawn.mp4
sh tools/review.sh renders/tokyo-redrawn.mp4 evidence/review     # contact sheet, strips across every move and cut
```

For upload to X: BT.709 in TV range (the frames are full-range BT.601 JPEGs), about 8 Mbps, the sound copied.

```sh
ffmpeg -y -i renders/tokyo-redrawn.mp4 \
  -vf 'scale=in_range=pc:in_color_matrix=bt601:out_range=pc,format=rgb24,scale=out_range=tv:out_color_matrix=bt709,format=yuv420p' \
  -c:v libx264 -profile:v high -preset slow -b:v 8M -maxrate 10M -bufsize 16M -g 60 \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 -pass 1 -an -f mp4 /dev/null
ffmpeg -y -i renders/tokyo-redrawn.mp4 \
  -vf 'scale=in_range=pc:in_color_matrix=bt601:out_range=pc,format=rgb24,scale=out_range=tv:out_color_matrix=bt709,format=yuv420p' \
  -c:v libx264 -profile:v high -preset slow -b:v 8M -maxrate 10M -bufsize 16M -g 60 \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 -pass 2 -c:a copy -movflags +faststart \
  renders/tokyo-redrawn-x-1080x1080.mp4
# libx264 here leaves the colour primaries and transfer unset in the stream; write them in without re-encoding
ffmpeg -y -i renders/tokyo-redrawn-x-1080x1080.mp4 -map 0 -c copy \
  -bsf:v h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1:video_full_range_flag=0 \
  -movflags +faststart renders/tokyo-redrawn-x-tagged.mp4
```

`render.mjs` and `stills.mjs` drive system Chrome on the GPU (ANGLE on Metal). Set `FILM_SWIFTSHADER=1` to use
SwiftShader instead (about 10 times slower). Set `FFMPEG` to point at a working ffmpeg if the one on `PATH` is broken.

The score and every sound effect are original, synthesised from seeded noise and sines. Sources are listed in
`evidence/audio-selection.json`.

## Licence

This folder started from the starter project of guizang-product-video-skill, © op7418, GNU AGPL-3.0. That covers
`engine.js`, `client.jsx`, `film.jsx`, `film-store.js`, `kit/`, `adapters/`, `fixtures/`, `fake-api.js`,
`product-context.jsx`, `presentations.jsx` and the `*.mjs` tools. This folder as a whole is therefore under AGPL-3.0:
see `LICENSE` and `NOTICE.md`. The rest of the repository is MIT. The rendered film is not covered by the AGPL (see
`NOTICE.md`).
