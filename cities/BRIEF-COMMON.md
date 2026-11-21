# inkcity Atlas — brief every city follows

The Atlas is a gallery: one living, hand-inked isometric map per city, built with the inkcity skill
(`skill/inkcity` in this repository). Tokyo (`cities/tokyo/`) is the finished reference and sets the quality bar. The user has
said Tokyo's quality is "very good" and that the quality must stay at that level.

## What a city is
- **6–9 district tiles** on the 3×3 street grid (100 u grid, tile half-size 37), plus **2–4 satellite islands** (paint
  blobs off the grid) for famous places that are too far out or too big. Each tile is one recognisable district, packed
  with its own life: people doing the thing that place is known for, vehicles, and small jokes.
- **A street fingerprint** that runs through the whole map and tells you which city this is before you read the title.
  Tokyo's is the Yamanote loop: a brick viaduct round the whole map with trains circling and izakaya in its arches.
- **One clever moment** (at most two) that gets its own long shot and is timed to that shot. Tokyo's is the Shibuya
  scramble: every light turns red for cars and about 90 people cross at once, diagonals included. The moment must be
  something only this engine can do well: crowds on timetables, traffic, things moving across tiles, a structure that
  moves (a lifting bridge, a turning wheel), done cleverly and true to the city.
- Landmarks have the right proportions and structure. Use `scripts/landmark.py` (Wikidata, OSM building:part, Commons)
  and keep each landmark's data card in `refs/`. Overpass is overloaded: the script caches results, so back off and
  don't hammer it. 1 u ≈ 0.28 m at people scale; tall landmarks are compressed, not to scale.
- A season or weather that suits the city, used consistently.

## Files (copy Tokyo's layout)
```
cities/<slug>/
  brief.md            your plan: fingerprint, clever moment(s), layout table, depth plan (like tokyo/brief.md)
  refs/*.md           landmark data cards
  dev.html            loads ../../engine/*.js, then src/35_scene.js, src/36_<slug>.js, src/tiles/*.js
  src/35_scene.js     SCENE: title, autoplay: 'build', frames, hold, fade, wide, shots, boil, visit, dive, bounds
  src/36_<slug>.js    this city's kit (its people, vehicles, signs, roofs)
  src/tiles/*.js      streets.js, one file per district, satellites.js
  index.html          the built single file: python3 <skill>/scripts/build.py dev.html index.html
```
`SCENE.title` gives the city name in English, plus local script where it differs (for example `'Tokyo 東京'`).
Set `autoplay: 'build'`: the page opens on the wide view, the city draws itself (pen, colour, people), then the viewer
explores; there is no tour of the places on load. R still plays the tour.

## Hard rules
- **Do not edit `inkcity-atlas/engine/`, the skill, or any other city's folder.** The engine is shared and tuned. If
  you hit a real engine gap, work around it in your city kit or tiles. If you can't, stop and report exactly what is
  missing and why.
- Read SKILL.md and all of `references/` (engine.md, drawing.md, pitfalls.md) before drawing. Then read Tokyo's
  `brief.md`, `src/35_scene.js`, `src/36_tokyo.js`, `src/tiles/shibuya.js`, `src/tiles/loop.js` and
  `src/tiles/streets.js` as worked examples (crowd timetables, a structure that runs across tiles, left/right-hand
  traffic). Don't copy Tokyo's look: each city has its own palette, materials and life.
- **One ground level.** Every place, street, square, quay and lawn that meets another stands at z 0, the same level as
  the road the cars drive on. `K.slab` is now flush by default (no tan lip): never draw side faces on a place's ground
  inside the map, because they make it a raised plinth with cars at its top's height. Only the outer edge of the whole
  map may show its cut section: use `K.slab(g, H, { cut: 'y' | 'x' | 'xy' })` on the sides that are the map's edge, and
  the same depth (1.1) on the streets' cut edge. Real raised ground (a hill, a podium, a terrace) is an object with its
  own walls, and sunken ground (a river below its quays) goes below z 0 inside its banks. The engine now draws every
  place's ground and fixed buildings before any moving thing, so a car on a street is never painted over by the next
  place's ground.
- **Real words on signs.** Signs in Latin letters use the engine's stroke font: `K.sign(g, face, p, a0, a1, z0, z1,
  col, 'BOULANGERIE')` and `K.text(...)` (see engine.md, "Lettering"). Never random pseudo-letters: zoomed in they read
  as misspellings. Vary names per shopfront. Cities in other scripts draw their own glyphs, like Tokyo's `TK.glyph2`.
- **Chinese signs are real characters.** The person looking at the Atlas reads Chinese, so pseudo-hanzi (random
  strokes like Tokyo's `TK.glyph2`, acceptable only for Japanese) look like miswritten characters. For Chinese cities,
  write a small stroke table in the city kit for only the characters used (about 20–40), each as polylines with
  correct structure, render every word large to check it, and use a colour block or one simple character where a sign
  is too small to read.
- **One map-wide tile.** A river or sea that crosses the whole map goes inside the streets tile, not a second
  map-wide tile (two of them overflow the bake budget and explore never gets sharp; Paris hit this).
- **Cars side by side.** An actor is drawn just before the first sprite in front of it, so a lamp, tree or pole planted
  between two lanes can put two neighbouring cars in the wrong order. Keep street furniture on the pavements, not
  between lanes, and check a close-up of a busy street (New York hit this).
- **The right side of the road.** Read engine.md §1 "Which side is which" before laying lanes: heading +x, the right
  is +y. Right-hand traffic puts the +x lane on the +y side; left-hand traffic (Japan, the UK, Hong Kong) the other
  way. Tokyo shipped on the wrong side and was fixed; check it on a close-up.
- Every shot has its own zoom (no two shots share one). Time each clever moment to its shot.
- Look at your work: render each tile's close-up and the wide view with `scripts/shot.mjs` and inspect the PNGs at full
  size. Fix depth-order mistakes (people drawn on top of things that should hide them, things poking through roofs),
  sizes, and empty or dead areas. Repeat until each tile reads clearly and is full of life.
- Tools: set `PLAYWRIGHT_FROM` to a folder whose `node_modules` has Playwright for every node script; Python is
  `python3`. The check scripts share a browser lock, so runs queue behind each other;
  that is expected (other cities are being built at the same time). Never launch your own extra headless browsers
  outside these scripts: several heavy GPU pages at once trip Chrome's GPU watchdog.
- Don't record an mp4 (disk space is short). Make no git commits. Publish nothing.
- The preview server serves the whole atlas at http://localhost:8862/ (for example `/cities/<slug>/index.html`).

## Done means
1. `index.html` is built, and on that built file these all pass:
   - `verify.mjs`: "all checks passed";
   - `perf.mjs`: 0 frames over 34 ms (one noise spike is acceptable if a rerun is clean);
   - `explore.mjs`: no errors, sharp within about 0.5 s;
   - `interact.mjs index.html 2`: every phase p95 ≤ about 21 ms.
2. Each district close-up and the wide view have been rendered, inspected, and fixed.
3. Your final report gives: the fingerprint and clever moment(s) as built; the tile list; check outputs (last lines,
   pasted); the PNG paths of the wide view and two or three best close-ups; anything you could not do, or any
   engine gap you hit.
