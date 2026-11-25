# Problems already met, and their fixes

Each entry: what you see → why → what fixes it. Most were found by `verify.mjs`, `perf.mjs`, `explore.mjs` or a close-up.

## Film contract

- **A frame differs by a few pixels depending on what was drawn before it** → the construction canvases of the build
  were advanced incrementally on the GPU, which rasterises slightly differently from a fresh draw; or an actor's
  drawing depends on state its `key` does not capture → seek mode rebuilds construction canvases fresh (`fresh: true`,
  already in the engine); put everything a drawing depends on into `key` (e.g. `'c' + frame` for confetti, not just a
  constant).
- **One build frame differs on a second visit, and which frame moves with how many checks ran before** → Chrome
  moves a canvas that is read back often from the GPU to the CPU partway through, and the frame visited across the
  switch rasterises differently → seek mode (`?f=`) now creates the canvas with `willReadFrequently`, so it is on the
  CPU from the first frame. Real-time playback keeps the GPU (it never reads back).
- **A frame differs by a few pixel levels after some other frames were seeked, and only in shots that share a zoom** →
  two overlapping shots at the same zoom reuse each other's bakes, and a bake made for a different region can rasterise
  its sprites on a different path → give every shot its own zoom (3.16, 3.19, 3.22 … rather than 3.2 three times).
- **The last frames are not identical** → actors keep moving behind the fade → the clock stops at `SCENE.hold`
  (`filmT`), so frames after it repeat it exactly.
- **The fade leaves nothing** → `hold − fade[0] = n` → use `hold − a = n − 1` to keep a 1/24 ghost.
- **A cut is soft** (shots too similar, or a shot mostly paper) → frame places so each cut changes most of the frame.

## Frame pacing

- **A hitch at a cut** → unfinished background jobs discarded at the cut forced synchronous re-bakes → finish jobs at
  the cut (engine does this) and prepare the next shot's bakes and poses during the current one.
- **A long frame mid-shot** → a single job step too big: compiling all boil paths at once, a bake slice of a huge
  object at high zoom, or packing 32 detailed poses in one step → slice by work or by time (the engine slices bakes
  per ~5000 points and pose packing per 1.5 ms); split a giant object into pieces.
- **Spikes after cutting to a high-zoom shot of a long canal or coast** → long boiling strokes are refilled whole every
  frame → `boil: false` on very long lines, `g.boilP` lower in busy drawings (the engine also culls boil strokes per
  stroke against the baked region now).
- **A 20–40 ms frame a frame or two after a cut, with no slow job step** → the bake that finished freed old bake
  canvases synchronously, and releasing big GPU canvases costs milliseconds each → the engine queues evicted canvases
  and frees one per frame (`reap`); seek mode frees them after each frame. `perf.mjs` prints `slowSteps` (single
  background steps over 6 ms) so a heavy frame can be blamed on a step, or found to be outside the jobs.
- **A frame or two take seconds whenever one actor is in view** → its drawing has an enormous bounding box (points
  projected twice: `g.p(...)` results passed to `g.fill`/`g.outline`, which project again), so every frame rasterises a
  giant bitmap → use the `…2` calls for wide-px points; scan `ACT_DL` for boxes far bigger than the thing (a person is
  ~12 × 22 wide px).
- **Explore never gets sharp at DPR 2 (bakes rebuilt every second, the camera still)** → the visible bakes outgrew the
  bake budget and each new bake evicted another visible one → the engine now never evicts a bake the frame on screen
  uses, and makes each bake's canvas only as big as what is drawn inside its region (a ring or a sea tile is mostly
  empty inside its box).
- **The screen goes black after dragging around for a while (explore, DPR 2)** → every pan retires a whole bake (a base
  and dozens of sprite canvases) and the queue freed one canvas per frame, so retired canvases held 60+ MP on top of
  the live ones until the browser dropped the page's GPU canvas → exploring now frees retired canvases within a time
  budget (tripled above 16 MP waiting) and actor bitmaps are capped at 32 MP; the film still frees one per frame,
  because freeing several big canvases in one frame hitches it (the cost lands on the GPU, not in the loop's timing).
- **A place looks like a raised plinth, and cars by its edge are half under its ground or buildings** → two errors.
  (1) `K.slab` drew a tan lip from z 0 down to −1.1 on the near sides, below the road: physically under the street, but
  drawn, so each place became a plinth with traffic at its top's height. The slab is now flush; only the map's outer edge
  shows a cut section (`cut`). (2) Frames were drawn tile by tile: a car whose first sprite in front was a street pole
  (the streets tile, order −99) was drawn before every place, then the next place's ground and kōban covered it, and the
  same ground cut off the poles' tops. The frame now draws all bases first, then sprites and actors in depth order.
- **Black screen that never comes back, with boil lines and a few people flickering on it** → Chrome restarted its GPU
  process (its hang watchdog under heavy GPU load, memory pressure, sleep/wake, a display change) and every canvas was
  wiped: bakes, sprites, actor bitmaps, pose atlases, the paper. The engine kept drawing the empty caches → every cache
  canvas now listens for `contextlost`; the loop waits for the page canvas's `contextrestored`, then `gpuReset()`
  drops every cache and re-bakes (about half a second). Test it with CDP `Browser.crashGpuProcess` in a headed Chrome.
- **Explore never gets sharp in one place, though the checks pass elsewhere** → a second map-wide tile (a river drawn
  as its own tile beside `streets`) doubled the wide bakes and pushed the total over the bake budget, so the bake just
  finished was evicted and queued again → draw a river or a sea that runs through the whole map inside the streets
  tile; keep map-wide tiles to one.
- **Zooming or dragging in explore stutters (frames of 60-280 ms), though the film is smooth** → actor bitmaps are keyed
  by exact scale, so every wheel step re-rasterised every visible person and car, and poses entering the view during a
  drag were rasterised all in one frame; bake jobs ran 26 ms a frame and kept working for views already left → the
  engine now draws stand-ins while exploring (the nearest bitmap the pose has, scaled; else the actor's last bitmap;
  else its vectors), makes exact bitmaps within ~4 ms a frame once the zoom rests (the picture at rest is unchanged),
  fits bake time to what the frame has left, caps the pixels rasterised per frame at 2.5 MP, and drops bakes queued
  for views that are gone. Measure with `scripts/interact.mjs` (also with VW=2560 VH=1440).
- **Slow blits of many actors** → separate bitmaps per pose cost a draw call and texture each; writing into an atlas
  the GPU is still reading forces copies → two alternating atlases of 2048² pages, the next shot's packed while the
  current one plays.
- **A stall when the film starts** → GPU warm-up work still queued → recording mode draws the build frames once, forces
  a sync (`getImageData`), then starts the clock.
- Timing measured while other heavy processes run is noise; run one browser at a time (the scripts queue themselves)
  and repeat a measurement before acting on a single spike.

## Drawing

- **Faces turn into scribbles, colour pokes outside outlines on small parts** → fills get ±0.15 wide px of
  hand-registration jitter, larger than an eye → `g.fill2(pts, col, true)` (exact) for anything small; eyes and brows
  as discs; small details as fills, not pen lines (line width does not shrink with the picture).
- **Chibi people: a head like a ball on a small body** → head about a fifth of the height; draw the face inside a
  skull outline with a jaw, never a skin disc pasted on a hair disc.
- **Knock-kneed, squatting legs** → bone lengths longer than hip-to-ankle distance make the reach solver bend the knee
  → lengths that just reach when standing; keep the stance leg straight in a walk and let perspective shorten it.
- **Arms akimbo while walking** → the swinging hand's target moved in a straight line instead of on the arm's arc →
  target = shoulder + (du, √(L² − du²)); elbows always point back.
- **A seated figure seen from behind shows its feet sticking out sideways** → legs drawn for a back view → hide legs
  for back-facing sitters (`K.person` does), unless on pedals.
- **Someone stands on the bench** → pose 'hold' or 'stand' with the anchor at seat height → pose 'sit'.
- **A seated figure floats above the stool** → a front-facing sitter anchored at seat height: their feet go to the
  anchor, so the hips end up 1.27 u above the seat → anchor front-facing sitters on the floor (engine.md §6).
- **A performer painted over the roof above them** → a cast figure sorts after the whole structure → draw them inside
  the structure's object between far and near parts.
- **A stall seller stands on the canopy** → the seller was a cast object `on` inside the stall's footprint, drawn after
  the whole stall, canopy included → draw the seller inside the stall's object between the back wall and the counter,
  canopy last; raise the canopy above head height.
- **People on a picnic blanket appear painted over a tower's leg** → the cast sat inside the tower's footprint, and
  anything `on` inside a footprint comes after the whole object → keep cast outside the footprints of tall things.
- **Glyphs or random choices silently missing** → `RNG(seed).int(lo, hi)` takes both bounds (inclusive); `r.int(3)` is
  NaN.
- **Signs read as misspelt gibberish when zoomed in** (RDONTRREATER…) → random pseudo-letters in Latin script look
  like real letters in the wrong order → write real words with `K.sign` / `K.text`; vary shop names per shopfront, not
  per building, or a whole row says the same thing.
- **Traffic drives on the wrong side** (Tokyo shipped with right-hand lanes) → the ground axes are left-handed seen
  from above, so "heading +x, right is +y" is easy to get backwards → engine.md §1 "Which side is which"; swap a
  searched timetable by running it backwards in time, and move the stop lines to the other half of each approach.
- **Cars float** → wheels drawn before the body are hidden by it → far wheels before, near wheels after, in arches.

- **An animal or a walker vanishes whenever it faces left** → its state used `s: -1` as a flip, but `st.s` is a scale
  (a negative bounding box never hits the view) → keep `s > 0`; put the facing in `fl` and mirror in `draw`. The
  engine now writes the mistake to `window.__err` (`shot.mjs` prints it).
- **A flag or a fountain jet floats in the air before its place is drawn** → the actor had `cast: false`, which means
  "there from frame 0" → leave it in the cast; `cast: false` is for street traffic.
- **A seller disappears behind the stall** → a full awning hides anyone standing behind the counter from this camera
  → put sellers at the end of the stall or in front of the counter.

## Depth order

- **A boat sails over the bridge instead of under it** → an actor inside a footprint was always drawn on top of it →
  `{ under: h }` on the span; draw the arch's inside as its own object before it (see the canal example).
- **A canal or sea tile steals clicks meant for the places** → its bounding box covers them → shared tiles are skipped
  by clicks (`streets` or `shared: true`).
- **A shared sea vanishes with `&only=`** → only the `streets` tile was kept → `shared: true` on the sea's tile.
- **Someone seen from behind floats above a stool** → their legs are hidden and nothing covers the gap (a bench back
  would) → `K.person` now brings the seat of the trousers down onto the seat for back-facing sitters.
- **A seat painted over the person sitting on it** → the stools were in a shared table object that sorted after the
  sitter → draw the seat in the sitter's own cast drawing, or mark the sitter `on` inside the seat's footprint.

- **People covered by the blanket they sit on** → the blanket was an object with a strange thin footprint and a
  negative bias → give it the terrain's footprint (or make it ground if the tile is flat).
- **Blankets vanish under the lawn** → moved to `T.ground` while the lawn is a terrain `T.obj` drawn after all grounds
  → same footprint as the terrain object, declared after it.
- **A whole tile's people (or cars) vanish under their own ground** → a long object in an early tile (wires strung
  across the map, a long fence in the streets tile) counts as "in front" of everything with smaller x and y whose
  screen box it overlaps, so those actors are drawn before that early tile, under the later tiles' ground → keep
  objects in the streets tile short (a pole carries only the wires to the next pole), and long structures split.
- **A frame around the world (a ring railway, a city wall)** → one tile cannot be both behind the far places and in
  front of the near ones → two tiles: the far half with a low `order` (before every place), the near half with a high
  one; satellites beyond each half ordered outside it. Trains on it: one actor per car anchored on the deck's front
  edge with `ext`, the parapets and wires in two more tiles drawn right after each half (engine.md §3); on
  `layer: 'top'` the near cars were drawn over everything in front of the viaduct.
- **A whole group pops in front of (or behind) a bench, a counter or a tree at once** → several people drawn by one
  actor share one anchor → one actor per person on a shared clock (the life kit does it; depth.md §1).
- **A stall keeper, a barista, a monk drawn over their own counter or belfry** → anchored inside the object's box,
  which is then never in front of them → split the object into its back and front parts (depth.md §2).
- **Station benches painted over their sitters; a row of statues over the visitor in front** → a far utility pole with
  its wires (a small prop whose screen box spans the whole wire run) counted as in front by x + y and became their
  slot, from an earlier tile → poles and wire spans as separate objects, the spans `{ noHide: true }`;
  `SCENE.strictProps`.
- **A far person drawn over a near one** → the near one's slot came early (something stands in front of them), the far
  one had none → `SCENE.slotChain` (bounded by each person's floor, so a passing car cannot drag a crowd under the
  scenery behind it).
- **A crowd on top of a passing bus; a person over a train car's side** → actors order by their centres' x + y → the
  mover returns `ext: [hx, hy]`.
- **Heads through a gate's lantern** → it hung at head height (people are 6.1 u tall) → hang it with its bottom at
  6.5–7 u.
- **A thing hidden by something it stands on** → missing `{ on: true }`.
- **Wrong order around a long building** → one footprint cannot be both behind and beside → split it.

## Explore mode

- **The driver's `cam` column looked stale after R** → it printed the explore camera while the film plays its own
  shots → `explore.mjs` now prints the film's shot camera in film mode.

- **`drawImage` with a zero-size canvas** → an LRU budget evicted the bitmap just created for this frame → stamp new
  bitmaps as used before evicting and never evict the one being made.
- **Moving the mouse kills the film** → only presses, wheel and keys interrupt; pointer moves update the idle timer.
- **Blurry after zoom for too long** → bake the whole tile when it is small at this zoom, else the visible region
  with a margin; re-bake ~90 ms after the wheel stops, with a bigger job budget than in the film.

- **Every person blurry when zoomed in, for seconds** → while new poses waited for a bitmap at this zoom, people
  were drawn from bitmaps of another zoom, blown up; with hundreds of lively people the queue never caught up → the
  engine now shows a person's last sharp pose at rest, draws everybody's pose now first and the next second's ahead,
  bursts for half a second after the view rests, and skips people off screen before looking their pose up.
- **Some tiles blurry for good after a zoom** → a bake just finished kept the stamp it was queued with and was the
  first thing evicted once the bake budget was full → a finished bake is stamped fresh (it is in use).
- **The wide view slow with hundreds of people (40 ms frames)** → every new pose of every lively person, at every
  zoom, drawn as vectors while waiting → see above; `poseAtlas` for the many small poses; one actor per person (a row
  of 10 keepers in one actor with 64 states made 1.7 M px² of drawings).
- **A 2-second freeze on a season switch** → every pose of ~600 actors drawn to find what can hide them →
  `SCENE.sampleKeys: 4`.
- **Night slow in the wide view** → ~3000 additive glows a frame at a 2× screen → `SCENE.lightRes: 0.5`.

## Engine and city code

- **Two cities stopped loading after an engine change** (`mkTextures is not defined`) → a new top-level name in an
  engine file (`PA`, `LK`) was also a `const` in those cities' own code, so the engine file was a SyntaxError → wrap
  new engine code in a function or put it on `K` / `SF`; grep every scene's `src/` for a name before adding a global;
  after any engine edit, load every scene that uses the engine.
- **Long lines from a person to the top of the paper** → an actor's draw used wide-px offsets from the origin (`[2.6,
  -1]`), but the drawing is made around `g.p(0, 0, 0)`, not [0, 0] → offsets relative to `g.p(0, 0, 0)` (or use world
  points with `g.p`).
- **`st.s is a scale and must be > 0`** → a facing sign was put in `st.s` → name it `fl` / `sd`.

## Process

- Copying a reference frame by frame wastes effort and gives a worse picture than drawing from understanding. Use a
  reference once; then build.
- A tile that throws does not stop the page: read `ERR [tile] …` from `shot.mjs` first.
- After editing the engine, run `verify.mjs` before anything else: determinism breaks quietly.
