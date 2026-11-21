---
name: inkcity
description: Build a hand-inked, flat-coloured isometric city, town, campus, neighbourhood, island or any map of places as ONE self-contained interactive HTML page that also works as a film. It opens on warm paper, the places draw themselves (pen scaffold, then broken colour, then the people pop in), a camera tour hard-cuts between close-ups full of small life (walkers, traffic, boats, a wedding, a game), it fades to a ghost, and then hands over to explore mode (drag, wheel/pinch zoom to x10, click a place, keys 0-9, Space, R). Every frame is a pure function of its number, so the page records frame-exactly to an mp4. Use this whenever someone wants an illustrated / hand-drawn / sketchy isometric map or diorama of a real or invented place, a "living map", a "city that draws itself", an animated tour of places, a looping isometric scene with tiny people, a recreatable "map animation drawn in code", or wants such a page turned into a video — even if they never say "isometric" or name this skill. Not for a single object or machine (use colorfigures) or dark glowing line-art (use iso-glow).
---

# inkcity

A living, hand-inked isometric map of places, as one HTML file: a short film that becomes an explorable picture.
The skill ships a working engine (`assets/engine/`), a small starter town that already plays, explores and passes
every check (`assets/starter/`), and scripts that render, verify, time, drive and record any scene (`scripts/`).
Your work is the places: what is there, how it is built, who is in it and what moves.

## What a finished page does

1. **Film** (on load, ~20–60 s at 30 fps): paper → each place builds in a wave (coloured pen scaffold, colour sweeping
   across, then its people, animals and traffic pop in at once) → hard cuts between shots of the places, one of them a
   close-up where faces read → back to the wide view → the whole picture fades to a faint ghost and holds.
2. **Explore** (after the film, or as soon as the viewer presses, scrolls or types): drag to pan, wheel / pinch to zoom
   (re-inked crisp at every zoom, not scaled), click a place to cut to it (click again to dive closer if the scene has a
   dive there), 1–9 jump to places, 0 / Esc the wide view, Space pause, R replay. Moving the mouse alone never
   interrupts the film.
   `autoplay` in the scene file picks the opening: `true` plays the whole tour; `'build'` plays only the build on the
   wide view (pen, colour, people) and hands over to explore where it ends, so the viewer sees the city draw itself
   and then explores on their own (any press skips the build); `false` opens in explore with the city already built.
   R always plays the tour; recording is unaffected. For a gallery of several pages `'build'` is the usual choice
   (the inkcity Atlas uses it); ask if unsure.
3. **Recording**: `?film` plays at 1920×1080 with no UI; `?f=N` draws frame N alone. Any frame drawn in any order gives
   identical pixels, so `scripts/record.mjs` encodes the film frame by frame.

The look: warm dark ink on cream paper, outlines that wobble a little and **boil** (six hand-drawn variants of the main
lines, a new one at each cut), opaque flat colour lit from the upper left (right-facing walls a tone darker), dry-brush
marks that differ by material (paving scuffs, grass blades, water arcs), tiny people with real anatomy and poses.

## Workflow

1. **Understand the places before drawing.** For each place write, at the top of its tile file: what it is, what it is
   made of and how it is built (massing, roofs, materials, how it meets the ground), who is there and what they are
   doing (3–8 small stories: a picnic, a busker, a wedding, someone fishing), and what moves. Draw from that
   understanding as an illustrator would; do not trace or pixel-match a reference, and do not loop on side-by-side
   comparisons. If the user gives a reference video or picture, look once to understand composition and mood, then make
   your own drawing of the place. Never recreate a specific existing artwork, game or film frame for frame.
   For a real city, run `scripts/landmark.py "<landmark>" --target <u>` once per landmark: a data card with its parts,
   heights, roof shapes and colours from OpenStreetMap and Wikidata, plus photos to look at once (see drawing.md §1).
2. **Start from the starter:** `python3 <skill>/scripts/new_scene.py <folder>` copies a working two-place town and the
   engine; replace its `plaza.js` / `park.js` with your places and keep the `<script>` list in `dev.html` in step. Run `node <skill>/scripts/shot.mjs <folder>/dev.html out/a.png "f=200"` once to see it work (see *Tools*
   for Playwright). Read `src/35_scene.js`, `src/tiles/plaza.js`, `src/tiles/park.js`, `src/tiles/streets.js`: they are
   short, commented, and show every mechanism.
3. **Read `references/engine.md`** (space, tile API, depth order, actors, the kit, the scene file) before writing tiles,
   and **`references/drawing.md`** before drawing people, buildings, vehicles, water or crowds. For bigger examples read
   `assets/examples/lombard.js` (a hill street with stepped houses, cars on hairpins, a cable car) and
   `assets/examples/ggpark.js` (a park with a conservatory, pagoda, windmill, bison, a rink, boats); `streets.js` there is
   a street grid with a collision-free traffic timetable; `assets/examples/canal/` is a canal through a town with humped
   bridges boats pass under, gondolas and Venetian houses (helpers in `36_canal.js`); `assets/examples/tokyo/` is a whole
   city: Japanese roofs, torii, lanterns, poles and wires, vending machines, trains and people of Tokyo in `36_tokyo.js`,
   a ring railway round the world on a brick viaduct (`loop.js`), a scramble crossing with ~70 people on a timetable
   (`shibuya.js`), satellites on paint blobs (`satellites.js`). Water shared by several places
   (a coast, a river) and narrow village lanes are covered in engine.md §1 and §3.
4. **Lay out the world:** places are tiles 74 u square on a 100 u grid, with streets between (a `streets` tile). Decide
   the shot list in `src/35_scene.js`: one establishing build shot, one shot per place at zoom ~3–4.5, at least one
   close-up at ~8–10 where faces and hands read, the wide view again, the fade.
5. **Draw each tile:** ground (slab, paving, lawns, water, paths) → standing objects (buildings back to front, trees,
   furniture) → the cast (people placed in situations) → actors (walkers with `K.walker`, traffic, boats, flags, water
   jets). After each
   tile, render it at its shot and at a close zoom (`&cam=9,cx,cy`) and fix what reads wrong. Use `tools/sheet.html` to
   draw people (or anything) on their own at any zoom.
   **One ground level:** every place, street, square and lawn that meets another stands at z 0, the level the cars
   drive on. `K.slab` is flush (no lip). Never give a place's ground side faces inside the map: they turn it into a
   raised plinth with traffic at its top's height. Only the map's outer edge shows its cut section
   (`K.slab(g, H, { cut: 'y' | 'x' | 'xy' })`, with the same depth on the streets' cut edge). Raised ground is an object
   with walls (a hill, a podium); water sits below z 0 inside its banks.
6. **Check the contract** (all must pass before you hand over):
   `node <skill>/scripts/verify.mjs dev.html` (seek determinism, hard cuts, cast entrances, fade, hold) ·
   `node <skill>/scripts/perf.mjs dev.html` (real-time pacing: mean ≈ 16.7 ms, p95 ≲ 20 ms, no frame over 34 ms after the
   first few) · `node <skill>/scripts/explore.mjs dev.html out` (every input, time to sharp after zoom, no errors) ·
   `node <skill>/scripts/interact.mjs dev.html` (zoom and drag smoothness at DPR 2: p95 ≲ 20 ms per phase).
7. **Build the single file:** `python3 <skill>/scripts/build.py dev.html index.html` (inlines every script; fails if any
   external reference is left), then run verify / perf / explore on `index.html` as well. Optionally
   `node <skill>/scripts/record.mjs index.html film.mp4` (needs ffmpeg).
8. **Hand over** `index.html` and say what the controls are, what is in each place, and which checks ran with their
   numbers. Say plainly what was not checked (for example: never watched on the user's own screen, no sound).

## Rules that keep the page working (and why)

- **Time is a pure function.** Every actor's `at(t)` and every drawing depend only on t, seeds and constants: no
  `Math.random()`, `Date`, or state carried between frames. That is what makes seeking, recording and replay exact.
  Use `RNG(seed)`, `h1`, `h2`, `vnoise`.
- **A drawing is cached by its key.** An actor's `draw(g, st)` is recorded once per `st.key`, so the key must capture
  everything the drawing depends on (direction, walk phase, heading step, wave phase). Quantise: headings to 16–48 steps,
  a walk cycle to 8 phases, a rotation to a few dozen steps. Positions stay continuous.
- **Depth is decided by footprints on the ground**, not by drawing order across objects. Give every standing thing an
  honest footprint; mark things that stand on or inside another's footprint `{ on: true }`; split a long building that
  things stand both in front of and beside; draw someone inside a structure (a bandstand, a cable car, a boat) inside
  that structure's own drawing, between its far and near parts. Flat things lying on a terrain object (blankets on a
  sloped lawn) must share the terrain's footprint so they come right after it.
- **Line weight is applied at replay, per zoom**: draw in "wide px" once; the engine re-inks it at any zoom. Use fills
  (`exact`) for anything smaller than ~1 u (faces, hands, buttons): ink lines do not shrink with the picture and the
  pen's hand-registration jitter (±0.15 wide px) would scramble small shapes.
- **Every shot has its own zoom**: two overlapping shots at the same zoom reuse each other's bakes and a frame can then
  depend on what was drawn before it. And time the clever moment to its shot (derive its phase from the shot's frame).
- **Budget**: a tile is ~20–60 statics plus 10–30 actors. The engine slices all heavy work across frames (bakes, pose
  packing); if `perf.mjs` shows a heavy frame, look at what single step got bigger, not at the average.
- Keep the page self-contained: no fonts, images or scripts from the network. All textures are generated.

## Tools

The scripts need Node 18+ and Playwright. They look for it in `PLAYWRIGHT_FROM`, then the working folder, then the
skill folder; install with `npm i -D playwright` (and `npx playwright install chromium` if there is no Chrome), or point
`PLAYWRIGHT_FROM` at any folder whose `node_modules` has it. They launch Chrome with the GPU on (`CHROME_ARGS`,
`CHROME_CHANNEL` override) and run one browser at a time, so timings are honest.

| script | use |
|---|---|
| `scripts/new_scene.py <dir>` | copy the starter town + engine into a new scene folder |
| `scripts/landmark.py "<name>" [--target u] [--radius m] [--out refs]` | a landmark's data card: OSM parts, Wikidata facts, Commons photos (cached; stdlib only) |
| `scripts/shot.mjs <page> <out.png> "<query>" …` | frozen frames: `f=N`, `f=N&cam=z,cx,cy`, `&live` (all built), `&only=a,b` (just these tiles) |
| `scripts/verify.mjs <page>` | the film contract; prints PASS/FAIL, exits 1 on failure |
| `scripts/perf.mjs <page>` | real-time playback in recording mode; frame-time stats and heavy frames |
| `scripts/explore.mjs <page> [outDir]` | drives every explore input at DPR 2; screenshots |
| `scripts/interact.mjs <page> [dpr]` | explore smoothness: frame times, draw and job time while zooming and dragging |
| `scripts/build.py <dev.html> <out.html>` | the single self-contained page |
| `scripts/record.mjs <page> [out.mp4]` | frame-exact mp4 (H.264, 1920×1080, 30 fps) |
| `assets/starter/tools/sheet.html?z=9.3&seeds=3,8&rows=stand,walk:0.25,sit,bike` | people in every direction and pose at any zoom |

## Files

`assets/engine/`: `00_core` projection, seeded noise, colour · `10_pen` the recorder `G` and pen strokes, replay,
boil · `20_kit` shared drawing kit `K` (solids, roofs, windows, plants, people, vehicles, furniture) · `30_world` tiles,
objects, depth sort, actors · `80_render` bakes, atlases, jobs, the build animation, frame drawing · `90_app` film clock,
cuts, recording, explore mode, UI. A scene adds `src/35_scene.js` (the film script) and `src/tiles/*.js` (the places).
Edit the engine only to fix a real engine problem, and say so in the hand-over; put place-specific helpers in the tile.

`references/engine.md` (read first) · `references/drawing.md` (read before drawing) · `references/pitfalls.md`
(problems already met and solved: read when something looks wrong or a check fails).
