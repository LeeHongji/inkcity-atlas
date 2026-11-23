# "Press N", the inkcity Atlas night film

A 30-second square film for X that shows the night every Atlas city now has: one key, the day fades, the lamps come on
in a wave, then twelve cities at night and all twelve turning at once. Every picture in it is drawn by the real pages:

- **The switch:** the Tokyo page in `?f=0` mode draws its day frames with `SF.seek` and its night frames with its own
  light-up clock (`lightT`, slowed to 0.7×), with the last day frame laid over it and fading the way the page's
  `drawSwap` fades it. `src/city.js` loads the pages in hidden iframes and copies the middle 1080 square of their canvas.
- **The twelve nights:** each city page with `?night`, at its own signature camera, 40 frames into that shot.
- **The grid:** each page's wide view by day and at night, drawn ahead of time (`tools/grid-images.mjs`). Twelve live
  engines in one tab run out of memory.
- **The keycap and lettering** are the gallery's own Looseleaf `Kbd` and `Lettering`, imported from `../gallery-src`.

The direction, shot list and picture rules are in `DIRECTION.md`. The timeline, every claim's source and every sound
cue are in `plan.json`.

## Rebuild

Needs Node 18+, system Chrome, Python 3 with numpy/scipy, a working `ffmpeg`, and a copy of
[guizang-product-video-skill](https://github.com/op7418/guizang-product-video-skill) (`<video-skill>` below) for its
mixer.

```sh
npm install
npx tailwindcss -i src/product.input.css -o src/product.css     # the gallery's stylesheet, scanned over the film
node tools/grid-images.mjs                                       # public/clips/grid/<city>-day.jpg, -night.jpg
npm run build
node stills.mjs public/poster 7.2 && mv public/poster/t007.20.png public/poster.png && rmdir public/poster && npm run build   # the first frames
python3 audio/score.py && python3 audio/sfx.py                   # assets/music.wav, assets/sfx/*.wav
python3 audio/cues.py                                            # every sound cue into plan.json
python3 <video-skill>/scripts/mix_audio.py plan.json             # assets/master.wav, evidence/audio-mix.json
node render.mjs --audio assets/master.wav --output renders/press-n.mp4
sh tools/review.sh renders/press-n.mp4 evidence/review           # contact sheet, cut strips, first frames
```

For upload to X: BT.709 in TV range (the frames are full-range BT.601 JPEGs), about 8 Mbps, the sound copied.

```sh
ffmpeg -y -i renders/press-n.mp4 \
  -vf 'scale=in_range=pc:in_color_matrix=bt601:out_range=pc,format=rgb24,scale=out_range=tv:out_color_matrix=bt709,format=yuv420p' \
  -c:v libx264 -profile:v high -preset slow -b:v 8M -maxrate 10M -bufsize 16M -g 60 \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 -pass 1 -an -f mp4 /dev/null
ffmpeg -y -i renders/press-n.mp4 \
  -vf 'scale=in_range=pc:in_color_matrix=bt601:out_range=pc,format=rgb24,scale=out_range=tv:out_color_matrix=bt709,format=yuv420p' \
  -c:v libx264 -profile:v high -preset slow -b:v 8M -maxrate 10M -bufsize 16M -g 60 \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 -pass 2 -c:a copy -movflags +faststart \
  renders/press-n-x-1080x1080.mp4
# libx264 here leaves the colour primaries and transfer unset in the stream; write them in without re-encoding
ffmpeg -y -i renders/press-n-x-1080x1080.mp4 -map 0 -c copy \
  -bsf:v h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1:video_full_range_flag=0 \
  -movflags +faststart renders/press-n-x-tagged.mp4
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
