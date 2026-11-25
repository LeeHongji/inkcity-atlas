# The engine

Contents: 1 Space · 2 A tile file · 3 Depth order · 4 The recorder `g` · 5 The kit `K` · 6 People · 7 Scenery, cast,
actors and the build · 8 The scene file · 9 The page: modes, queries, controls · 10 Rendering and performance

## 1. Space

- World units `u`: one street pitch = 100 u. A place is a square tile of half-size **37 u** around its centre, so 26 u
  of street lie between neighbouring kerbs. Tile centres sit on the 100 u grid: (0,0), (100,0), (0,-100) …
- Axes: **+x runs to the lower right** of the screen, **+y to the lower left**, **+z straight up**.
  Wide px (the 1920×1080 frame at zoom 1): `sx = 960 + (X − Y)·2.92`, `sy = 603 + (X + Y)·1.59 − Z·3.46` (`prj`).
  1 u along x or y is 3.32 px of screen length; 1 u of height is 3.46 px.
- Everything a tile author writes is **tile-local**: (0,0) is the tile centre, the kerb is at ±37.
- What faces us: the face of a box at its **larger y** ('L', looks lower-left, the lit side), the face at its **larger
  x** ('R', looks lower-right, a tone darker) and the top. Far = small x and small y = top of the screen. Light comes
  from the upper left.
- Scale that keeps a world coherent: an adult ≈ 6.2 u tall (K.person), a storey ≈ 5 u, a door ≈ 5.5 u, a car ≈ 10.6 u
  long, a bench seat 1.3 u high, a tree crown 8–11 u across, a lamp 9 u.
- Wide-view zoom by world size (tiles on the 100 u grid with 26 u streets): 3×3 → z 1.0 · 2×2 → z 1.55 · a row of 3
  → z 1.5 · a row of 2 → z 1.85 · one tile → z 3. In general: the world's bounding box in wide px is
  `(Δx + Δy)·2.92` wide and `(Δx + Δy)·1.59 + tallest·3.46` high; pick
  `z = min(1920·0.78 / width, 1080·0.82 / height)` as a starting value (count margins such as a sea or a shore in the
  box) and centre on it (`cx`, a little above its middle for `cy`); then judge the wide frame by eye.
- Lanes between places are 26 u wide at `half: 37`. A village or a dense old town wants narrow lanes: give its tiles
  `half: 44–47` (lanes 6–12 u), or fill the street tile with life (stalls, trees, people), or let one place flow into the
  next by drawing the shared ground in the street tile.

**Which side is which.** The ground axes are left-handed seen from above (+x runs to the lower right, +y to the lower
left). A vehicle heading +x has +y on its right; heading +y, it has −x on its right. So right-hand traffic (Europe,
the Americas, China) puts the +x lane on the +y side of the centre line and the +y lane on the −x side; left-hand
traffic (Japan, the UK, Hong Kong) the other way round. Check it on a close-up before tuning a timetable. To swap the
side of a periodic, collision-checked timetable, run it backwards in time (t → −t): the same configurations occur, so
it stays collision-free (mirroring positions along the road does not).

## 2. A tile file

```js
'use strict';
/* what the place is, how it is built, who is there, what moves */
SF.tile('harbour', 100, 0, { rim: 30 }, function (T) {
  T.ground(function (g) { K.slab(g, 37, { top: C.pave }); /* … */ }, { rim: true });   // the ground first (flush, z 0), rim: true
  T.ground(function (g) { /* flat things painted on the ground, in the order given */ });
  T.obj([x0, y0, x1, y1], function (g) { /* a building: footprint box */ }, { name: 'shed' });
  T.obj([x, y], (g) => K.tree(g, x, y), { on: true });           // a small prop: footprint point
  T.cast([x, y], (g) => K.person(g, x, y, 0, K.who(7)), { on: true });   // the living layer
  T.actor({ at(t) { … }, draw(g, st) { … } });                   // anything that moves
});
```
`SF.tile(name, cx, cy, opts, fn)` options: `rim` = film frame at which the tile starts building (stagger them over
~0–40 to make a wave; omit for "there from frame 0", as the streets are), `castAt` (default rim + 69: when its people
pop in), `shared` (true: kept by `&only=` like the streets: a sea or river under several places), `order` (draw order among tiles; default (cx + cy) / 100, the streets use −99), `half` (default 37).
A tile named `streets` is always kept when `&only=` filters tiles. Every tile file must be listed in `dev.html`
(a `<script src>` line before `80_render.js`); `new_scene.py` copies the starter's `plaza.js` and `park.js`: rename or
delete them and edit the list. Shared helpers for several tiles go in their own file loaded before the tiles
(e.g. `src/36_helpers.js`).
If a tile throws, the page keeps running and `window.__err` names the tile; `shot.mjs` prints it as `ERR`.

## 3. Depth order — the thing that must be right

- `T.ground` things are flat and painted first, in the order added. Nothing standing can ever be behind them.
- `T.obj` / `T.cast` things are sorted by their **footprint** (tile-local, on the ground): `[x, y]` for a small prop
  (≤ 6 u) or `[x0, y0, x1, y1]` for a box. A is behind B when A's box ends before B's begins along x or along y; ties
  go by x + y. Give big things an honest box. **Split a long building that things stand in front of AND beside** into
  pieces, or no order can be right.
- Inside one object you paint back to front yourself (later calls cover earlier ones): that is how a building is built
  up, and how someone inside a structure is drawn (far posts, the person, near posts, the roof).
- `{ on: true }`: this thing stands on top of or inside another object's footprint (a person on a pier, a hut on a
  hill, a flag on a roof) and must come after it. `{ bias: n }` nudges the sort key (rarely needed).
- `{ under: h }`: something you can pass under (a bridge span, an arcade, a pier deck). An actor inside its footprint
  below height h is drawn under it (a boat), at or above h on it (someone crossing). Build a bridge as several objects
  back to front: far ramp, the arch's inside (what you see through the opening), the span with `under`, near ramp, the
  near parapet in pieces; split a long boat into halves so each sorts on its own. See `assets/examples/canal/`.
- Terrain that rises (a hill, a sloped lawn) is a `T.obj` with the whole tile as its footprint. Flat things lying on it
  (blankets, paths painted later) must be a `T.obj` with **the same footprint**, declared after it: equal footprints
  keep declaration order, and everything `on` inside comes after both. (`T.ground` would put them under the hill.)
- Actors are placed in the order automatically from their (x, y): they pass behind whatever stands in front of them.
  Standing objects an actor can pass behind are promoted to sprites drawn among the actors. This works across tiles,
  so a boat or a walker may cross from one place into the next. Once nothing is under construction the frame is drawn
  in two passes: every tile's base (its ground and the objects that never hide an actor) first, then all sprites and
  actors in the global depth order. So an actor is never painted over by a later tile's ground or low buildings, even
  when the first thing in front of it belongs to an earlier tile (a car behind a street pole). An actor's `bias` nudges its depth key (x + y + bias).
  Shared tiles (`streets`, or `shared: true`) are never the target of a click on a place.
- A structure round the whole world (a ring railway on a viaduct, a city wall, a coast road) is two shared tiles: the
  far half (`order` below every place) and the near half (above every place), each long side split into pieces of
  ~35 u (one object each, `under: deck` where things pass beneath). Trains on it are one actor per car, anchored on the
  front edge of the deck (its far end on a straight, a computed point on a corner) with its drawing shifted back to
  its place, and with `st.ext` (below); the front parapets and overhead wires go in two more shared tiles drawn right
  after each half (`order` −2.4 and 2.6 in Tokyo), so a car sits on the deck, under its parapet and wires and behind
  anything in front of the viaduct. See `assets/examples/tokyo/tiles/loop.js`.
- **A busy place needs more than footprints**: one actor per person (a group in one actor is ordered as one), people
  never anchored inside a box (split the box into its back and front parts), footprints that match what is drawn, and
  four engine options that every new scene should use: `SCENE.strictProps` and `SCENE.slotChain` (far props and far
  people no longer land in front of near ones), `st.ext = [hx, hy]` from a long mover's `at(t)` (a bus or a train car
  ordered by its footprint, not its centre), and `{ noHide: true }` on overhead wires and strings. All of it, with the
  survey that finds the errors (`scripts/depth-views.mjs`), is in **`references/depth.md`**.
- Water or ground shared by several places (a sea along a coast, a river through a town) belongs in one tile of its
  own, or in the `streets` tile, with `order: -99` so it is under the places, `shared: true` so `&only=` keeps it, and
  a `rim` (and `castAt`) if it should build like a place rather than be there from frame 0. Boats on it can then move
  freely along the whole coast.

## 4. The recorder `g`

Points are world `[x, y, z]` (z optional). The `…2` variants take wide-px `[sx, sy]` points for things drawn flat to
the screen (people, tree crowns, flags, faces). `g.p(x, y, z)` converts one point; `g.P([...])` a list.

| call | what it does |
|---|---|
| `g.fill(pts, col)` / `g.fill2(pts, col, exact)` | opaque gouache polygon; vertices get a hair of position-keyed jitter unless `exact` |
| `g.line(pts, o)` / `g.line2` | **pen stroke**: a ribbon with wobble, pressure, pooled or flicked ends, a slight over/undershoot |
| `g.fine(pts, o)` / `g.fine2` | plain thin stroke (rails, seams, mullions): cheap |
| `g.outline(pts, o)` / `g.outline2` | polygon outline; every straight run is its own stroke, so corners are joined by hand |
| `g.poly(pts, col, o)` / `g.poly2` | fill + outline |
| `g.mark(o, from)` / `g.lit(o, fn)` / `g.glow(kind, x, y, z, o)` | night: how the fills just drawn look at night, and where light comes from (§9c) |
| `g.disc2(pt, r, col)`, `g.ring2(pt, r, o)` | filled circle / circle outline (wide px) |
| `g.segs2([x0,y0,x1,y1,…], col, w)`, `g.tris2([…6 per triangle], col)` | batches of tiny marks: cheap |
| `g.scuff(poly, o)` | short dry-brush strokes in a polygon `{dir (screen radians), len, c, dens, w, spread}` |
| `g.grass(poly, o)` / `g.water(poly, o)` / `g.scratch(poly, o)` | blades in twos and threes / long shallow arcs and white crests / ruled scratches |
| `g.at(x, y, z, fn, swap)` | draw with a shifted origin; `swap` mirrors across x = y (turns a +x-facing thing to face +y). Use it to draw a kit routine that works around the origin (`K.boat`, `K.car`, `K.bike`) at a place inside a static object |

Stroke options `o`: `w` weight (1 main contour, 0.8 inner edge, 0.5–0.65 detail, 0.3 fine detail), `c` colour (default
warm ink `C.ink`), `boil` (force/forbid the boil; by default about half of the main contours boil), `close`, `ext`
(0 = no overshoot), `wob` (wobble multiplier), `taper`, `co: true` (construction-only: seen while the tile is being
drawn, never afterwards), `cons: false` (not shown in the construction pass).
Screen directions: along +x is `Math.atan2(AY, AX)`, along +y is `Math.atan2(AY, -AX)`.
Globals worth knowing: `prj(x,y,z)` / `unprj(sx,sy)`, `AX AY VZ OX OY` (projection constants), `TAU`, `clamp`,
`lerp`, `smooth`, `arcPts(cx,cy,r,a0,a1,n)` (wide-px arc), `sortAround(pts)`, `pointInPoly(x, y, flatArray)`.
Colour: palette `C.*`, `SKIN`, `HAIR`, `CLOTH`; `shade(col, t)` (t > 0 darker and warmer, t < 0 towards paper),
`mix(a, b, t)`, `K.tones(col)` → `{t, l, r}` (top, lit, shaded). Randomness: `RNG(seed)` (`r()`, `r.range`, `r.int`,
`r.pick`), `h1(n)`, `h2(a, b)`, `vnoise(x, seed)`, `vnoise2(x, y, seed)`.

## 5. The kit `K` (read `20_kit.js` for exact arguments)

Solids: `K.box(g, x0,y0,x1,y1, z0,z1, col|{t,l,r}, o)` · `K.rbox(g, cx,cy, halfLen, halfWid, ang, z0,z1, col, o)` (any
heading; returns the box: `B.pt(u,v,z)`, `B.quad(face,a0,a1,z0,z1)`, `B.vis[face]` for faces 'pu','nu','pv','nv') ·
`K.cyl(g, cx,cy, r, z0,z1, col, {n, top, nt})` · `K.dome` · `K.cone(g, cx,cy, r, z0, h, col)` ·
`K.gable(g, x0,y0,x1,y1, z, h, 'x'|'y', col, {end})` · `K.hip(g, x0,y0,x1,y1, z, h, col, {ridge})` · `K.STONE`.
On faces: `K.on(face, plane, a0,a1, z0,z1)` · `K.win(g, face, plane, a0,a1, z0,z1, {style:'navy'|'glass'|'dark'|'slit', arch})` ·
`K.rwin(g, B, face, a0,a1, z0,z1)` · `K.arc(cx,cy,z,r,a0,a1,n)` · `K.rect(x0,y0,x1,y1,z)`.
Plants: `K.tree(g,x,y,{r,h,col,z})` · `K.cypress` · `K.palm(g,x,y,{h,r,lean})` · `K.hedge` · `K.bush` · `K.blooms` · `K.lawn`.
People: `K.person`, `K.who` (§6).
Vehicles (heading `ang`, 0 = +x, π/2 = +y): `K.car(g, ang, {col, L, W, roof})` (wheels in arches, bumpers, door seam) ·
`K.bus(g, ang, {band})` · `K.cablecar(g, ang, {col, roof, riders})` ·
`K.boat(g, ang, {kind:'steamer'|'sail'|'ferry'|'motor'|'row', L, W, hull, stripe, rower, ph})` (a row boat's rower faces
the stern and pulls two oars; `ph` is the stroke; any other `kind` draws the bare hull to build on) · `K.bike(g, ang, {col, seed, who})` (rider on the saddle, hands on
the bars, feet on the pedals) · `K.wheels(g, B, us, r, 'far'|'near', {arch, zc})` for your own vehicles.
Furniture: `K.lamp(g,x,y,{h,n,z})` · `K.bench(g,x,y,{face:'R'|'L',L,z})` (seat height 1.3) · `K.pole(g,x,y,h)` ·
`K.stall(g,x,y,{face,L,D,a,b,goods})`.
Ground: `K.slab(g, 37, {top, cut, lip})`: a top at z 0, flush with the streets, and a rim line. `cut: 'y'|'x'|'xy'` only on
sides that are the outer edge of the whole map (the section shows from z 0 to −1.1, like the streets' cut edge).
`lip` only for a plinth standing alone on open paper (it rises from z 0).
Lettering: `K.sign(g, face, p, a0, a1, z0, z1, col, 'WORD', {ink})` (a board on a face with the word as big as fits) ·
`K.text(g, face, p, a, z0, h, str, col, {center, w, track})` (cap height h in u, baseline z0) · `K.textP(g, P, a0, z0, h,
str, col)` along any plane `P(a, z)` (a road marking, a curved front) · `K.textW(str, h)`. A hand-cut stroke font with
digits, punctuation and Latin accents (French, Spanish, Portuguese, Italian, German, Turkish). Write real words: random
pseudo-letters read as misspellings once you zoom in.
CJK (Chinese, Japanese): `K.glyphs2(g, c, s, str, table, col, {vert})` (a word in wide px, cell s) ·
`K.glyphsP(g, P, a, z, h, str, table, col, o)` (on any plane) · `K.glyphs(g, face, p, a, z, h, str, table, col, o)` (on a
face) · `K.glyphSign(g, face, p, a0, a1, z0, z1, col, word, table, o)` (a lit board, a column if it is tall). `table` is a
stroke table: real characters only, each a list of strokes in writing order on a 10 × 10 grid; four tables (Beijing,
Hong Kong, Chongqing, Tokyo; ~110 kanji and kana) are in `assets/lettering/` with the characters each has. Never draw
pseudo-characters: a reader of the language sees them as miswritten. Missing characters are listed in
`window.__glyphMissing`.
Detail: `K.awning(g, face, p, a0, a1, z, out, col, {drop, stripe})` (a shopfront awning) · `K.rooftop(g, x0, y0, x1, y1,
z, {seed, rail, tank})` (a railing, a water tank or stair hut, AC units, an aerial on a flat roof) ·
`K.nobori(g, x, y, h, col, {word, table, w})` (a banner on a pole, with a CJK word down it). drawing.md §12 says what a
finished block has.
Organic: `K.curve(pts, n, closed)` (Catmull-Rom; works on 2-D, 3-D and [u, v, r] points) · `K.blob2(g, widePxPts, col)`
(brushed unlined blob) · `K.fog(g, w, h, seed)` · `K.shotPx(shotName)` → `(px, py) => [wx, wy]` (a pixel in that shot's
frame to wide px).

## 6. People

`K.person(g, x, y, z, o)` draws a figure standing with its feet at (x, y, z): built on a skeleton posed in 2-D (hips,
shoulders, two-bone limbs placed by reach), dressed in layers, in three-quarter view. A head is about a fifth of the
height. Options:
- `dir` 0 faces lower-right, 1 lower-left, 2 upper-left (back to us), 3 upper-right (back to us).
- `pose` 'stand' | 'walk' (`ph` 0..1, eight phases are enough) | 'cheer' (`ph`) | 'wave' (`ph`) | 'hold' (hands
  together in front: bouquets, phones, cups) | 'sit' (facing us: the feet at the anchor and the hips 4.4 wide px, about 1.27 u, above
  it, so for a seat 1.3 high put the anchor on the floor in front of the seat; facing away, dir 2/3: the legs are hidden
  and the hips come down onto the seat, so put the anchor at seat height, e.g. z = 1.2 on a bench) | 'crouch' (a fielder's ready stance; `sway` −1..1) | 'kneel' (near knee on the ground,
  far knee up, hands on it: a sandcastle, a garden bed, a shoelace; give `hands` to put them to work).
- Look: `skin hair top bot shoe`, `hairStyle` short | buzz | bob | long | pony | bun | curly | bald, `dress` (colour),
  `shorts`, `bare` (short sleeves), `jacket` (colour of the shirt showing in an open jacket), `tie`, `cap`, `beard`,
  `glasses`, `blush`, `build` 0..1, `k` (size; ~0.75 for a child).
- Hands and feet: `reach [dx, dy]` (both hands to one point, with a forward lean), `hands [[dx,dy],[dx,dy]]` (each hand
  to its own point: a book, a bat, oars, a paddle), `pedal [[dx,dy],[dx,dy]]`, `glove` (colour, near hand), `lean`,
  `noLegs` (sitting in a boat or behind a counter). Offsets are screen wide px from the anchor divided by `k`.
- `lie` (screen angle of the head end): the figure lies down with its hips on the anchor (sunbathers, a hammock).
`K.person` returns attachment points in wide px: `{ crown, head, headR, hands: [near, far], hip, shoulders }`: draw
a hat on `crown`, a bouquet or a phone at `hands`, a speech mark beside `head`.
`K.who(seed, overrides)` gives a varied citizen (skin, hair and style, clothes, build, sleeves, shoes, sometimes a beard,
glasses or a cap). Put `K.who(seed)` in the actor's closure, not in `draw`, and give every person a different seed.

## 7. Scenery, cast, actors — and how a tile builds itself

In the film each tile builds: its rim → coloured construction lines → broken colour sweeping across → then, at
`castAt`, the **living layer pops in at once** (each cast item grows in over 11 frames).
- Scenery = `T.ground` + `T.obj`: slab, terrain, water, buildings, trees, fixed furniture, empty stands.
- Cast = `T.cast` (still) + `T.actor` (moving): people, animals, boats, flags, fountains' water, flower rows, balloons,
  kites — anything that reads as alive. Hidden until `castAt`.
- Coloured things get coloured lines (`c:`): dark red on red roofs, dark green on crowns. Those strokes are the
  construction lines, so a tile reads as a coloured scaffold before the paint arrives.

```js
T.actor({
  at(t) { return { x, y, z, key, /* optional */ alpha, s /* scale > 0 */, /* anything draw needs */ }; },   // null = absent
  draw(g, st) { /* draw around the origin for this state; called once per key */ },
  sample: 0.2, period: 20,   // how finely / how long to sample the path when finding what can hide it (static: sample 5)
  layer: 'top',              // always in front (flags high up, kites, confetti, fog)
  grow: false,               // no scale-in at the entrance (big things: boats, canopies, water)
  cast: false,               // present from frame 0: only for things that exist before any place builds (street traffic)
  bias: 0,                   // nudge its depth key among actors and sprites
});
```
`st.s` is a **scale** (it must be > 0: a negative one makes the actor vanish, and the engine reports it in
`window.__err`). Put left/right facing in a field of your own (`fl: ±1`) and mirror inside `draw`. A flag, a fountain
jet, a turning sail belong to their place: keep them in its cast (the default) so they appear with it, not before.

An actor is depth-sorted by its anchor (x, y): anchor a big moving thing (surf along a beach, a long boat, a crowd)
at its front-most point (largest x + y), not its middle, or it will be drawn behind things it should cover and pull
nearby objects into the moving layer. A long mover also returns `ext: [hx, hy]`, its half-size on the ground along x
and y, so it is ordered against other actors by its footprint (depth.md).

**People who stay in one place are actors too**, never `T.cast` figures: the life kit (`25_life.js`) gives a person a
seeded run of small acts (`K.idle`), a conversation (`K.group`), a photo, a game of catch, a dog walk, pigeons, all one
actor per person. Its acts drawn by `K.doing` are the parts for a place's own scenes (a stall keeper's beat, a crowd
cheering a bout). Read **`references/life.md`**.

Moving things follow closed paths or timetables. `K.walker(T, who, points, speed, {phase, z, who})` makes a walker on a
closed route (facing from each leg, a step pair per 2.4 u so feet do not slide; `z` may be a function for slopes and
bridges). Traffic runs lanes with phases chosen so no two vehicles meet. Fade things in and out at the ends of open
paths with `alpha`. Keep roughly 10–30 actors per tile.

## 8. The scene file (`src/35_scene.js`)

```js
const SCENE = {
  title: 'Town',
  autoplay: true,                       // 'build': the build on the wide view, then explore (no tour); false: open in explore,
                                        // the city built. R plays the tour, ?tour forces it
  frames: 600, hold: 598,               // length; the clock stops at hold (later frames repeat it exactly)
  fade: [575, 24],                      // fade to a ghost from frame a over n frames; hold − a = n − 1 leaves 1/24 of the ink
  wide: { z: 1.85, cx: 960, cy: 585 },  // the establishing view (zoom + the wide-px point at the frame's centre)
  shots: [{ a: 0, z, cx, cy, name: 'build' }, { a: 150, …, name: 'plaza' }, …],   // a hard cut at each a
  boil: [0, 2, 5, 1, 4],                // which of the six line drawings each shot shows
  visit: ['plaza', 'park'],             // keys 1..9; a shot named like a tile is where a click on that tile goes
  dive: { plaza: 'fountain' },          // clicking the place you are already framing goes to this closer shot
  bounds: { z: [1.6, 12], cx: [480, 1440], cy: [330, 860] },   // explore camera limits
};
```
Options a scene may add (all off by default, so a scene without them draws as before; the starter sets the ones
marked ✓):

| option | what it does |
|---|---|
| `ink: 0.85` ✓ | the pen: line weight × this (finer < 1) |
| `grade: { chroma: 1.25, deep: 0.15 }` ✓ | richer colour as it is painted: chroma lifts a colour from its grey, deep darkens saturated colours; greys and whites stay |
| `strictProps: true` ✓, `slotChain: true` ✓ | depth for a busy place (depth.md) |
| `poseAtlas: true` ✓ | small poses (people seen from afar) packed on shared 2048² pages: hundreds of blits from a few textures |
| `lightRes: 0.5` ✓ | at night the glow of the lights is drawn at half size and added on (same sum, a quarter of the fill) |
| `maxCanvas: 3456` ✓ | the canvas may be this many px across (default 2880): a laptop's 2× screen is drawn pixel for pixel |
| `poseBudget: 48e6` | room for more pose bitmaps (default 32 MP): hundreds of lively people at a 2× screen |
| `sampleKeys: 4` | building the world draws only the first n poses of each actor to find what can hide it, the rest later in idle time: a city of ~600 people rebuilds for a new season in 0.7 s, not 2 |
| `season`, `seasons`, `palette`, `air` | the four seasons (§9d) |
| `unfold: true` (or `?unfold`) | the city arrives as a folded paper map (§9e) |
| `night: {...}` | night (§9c) |

Give every shot its own zoom (see pitfalls: overlapping shots at one zoom share bakes). Make the clever moment happen
during its shot: a periodic event (a light cycle, a procession, a train) gets its phase from the shot's frame, e.g.
`const sh = SCENE.shots.find((s) => s.name === 'shibuya'), OFF = PED0 - sh.a / 30` so the cycle reaches its green light
as the cut lands (see `assets/examples/tokyo/tiles/shibuya.js`).
Rhythm that works: the build ~120–200 frames (the last tile's cast in by then), shots of 90–130 frames, one close-up at
z 8–10, the wide view again for the last ~3–4 s, the fade over the last 24 frames. To frame a place: its centre in wide
px is `prj(cx, cy, 0)`; nudge cy up a little so tall buildings fit.

## 9. The page

Modes: film (default; the tour, then explore), recording (`?film`: 1920×1080, no UI, starts after the first shots are
prepared), frozen (`?f=N`, plus `&cam=z,cx,cy`, `&live` for everything built with actors at N/30 s, `&only=a,b`).
Debug flags: `&noboil`, `&noactors`, `&noatlas`, `&log` (frame times in `window.__stats`, work in `window.__work`).
Explore controls: drag, wheel / pinch (zoom to the pointer), click a place, 1–9, 0 / Esc, Space, R; two pen-drawn
icons (replay, pause) fade in on input. `window.SF.seek(n)` draws frame n (used by the scripts).

## 9b. A page overlay (captions, a guide, controls in the DOM)
The engine exposes a small API on `window.SF` for HTML laid over the canvas (the inkcity Atlas uses it for its
guidebook):
- `SF.view()` → `{mode, z, cx, cy, pz, w, h, paused, gliding}`: the camera on screen; `pz` = CSS px per wide px.
- `SF.prj(x, y, z)` → wide px of a world point; `SF.toScreen(wx, wy)` → CSS px. Re-read every frame to pin labels.
- `SF.glideTo(shotName | {z, cx, cy}, ms?)`: an eased camera move in explore (it pulls back on long trips); any user
  input cancels it. `SF.shot(name)`, `SF.wide`, `SF.extent()` (the map's wide-px box), `SF.zMin()`.
- `SF.on('explore' | 'film' | 'arrive', fn)`: explore begins (`{intro: true}` after `autoplay: 'build'`), a film
  starts, a glide arrives. `SF.togglePause()`, `SF.replay()`.
- `SF.ui = false` hides the canvas's own pen icons (the overlay draws its own controls); `SF.home = () => cam` makes
  key 0 / Esc glide there instead of cutting to `SCENE.wide`.
Keep the overlay out of `?f` / `?film` pages so recording and the checks see only the map.
- `SF.setLook({ night })` switches day and night (key N, `?night` opens at night and records at night); `SF.look.night`
  reads it, `SF.on('look', fn)` hears it, `SF.paper()` is the bare paper's colour now (an overlay looking for empty paper
  must compare with it).

## 9c. Night
Night is the same drawing: every colour goes through one moonlit grade when it is drawn (`nightColour` in
`00_core.js`: darker, its own hue kept, tinted blue), so whatever stands in front still hides what is behind. Day frames
are untouched: nothing night-only runs unless `LOOK.night`. On a switch the cached pictures are drawn again (the same
path as after a GPU reset), the old frame fades out over a second, and the lamps come on in a wave.

What lights up, and how a scene says so:
- **Windows** from `K.win` light up on their own (a share of them, mostly warm). A scene's own window colours:
  `SCENE.night.windows = { colour: share }` (share 1: always lit, a shop floor; it also throws light on the pavement in
  front). Inside a helper: `g.lit({ win: true }, () => ...)` or `g.mark({ win: 0.6 })` on the pane just filled.
- **Lights that keep their colour** (lanterns, signs, screens, a lit tower): `g.mark({ nc: true })` after the fill (its
  day colour at night), `{ nc: '#hex' }` a colour, `{ nc: (c) => ... }` from its day colour (return undefined to grade it
  as usual). `g.lit(o, fn)` marks everything filled inside `fn`. Colours listed in `SCENE.night.glow` keep their colour
  everywhere and get a halo; avoid colours a wall or a roof also uses.
- **The light itself**: `g.glow(kind, x, y, z, { r, col, base })` (or `g.glow2(kind, pt, groundPt, o)`): `'lamp'` a warm
  halo and a pool on the ground under it, `'lantern'` / `'neon'` a halo in `col`, `'tree'` / `'bloom'` a faint aura
  and motes drifting up (`col` tints them: pink over cherry blossom). `K.lamp`, `K.tree`, `K.palm`, `K.cypress`,
  `K.bush`, `K.blooms` call it already. A glow costs nothing by day, so a pole can carry a street light that only
  exists at night.
- **People and cars**: head and tail lights (`K.lights`) glow; in an actor's drawing `g.mark({ nc: true, light: true })`
  makes a fill shine with a halo (a taxi's roof lamp, a signal's lit lamp, a giant screen).
- `SCENE.night.lamps` / `foliage` list the scene's own lamp-globe and leaf colours (halos and motes without editing
  helpers); `grass` the lawn colours fireflies hang over (default the engine's grass); `water` the colours a light
  reflects in (default the engine's water); `grade` another moonlight; `lit` the share of windows lit (default 0.62).
- Drawn over the frame from all that: a warm glow where the lights are thick (thinner close up), pools of light on the
  paving, halos (a four-pointed glint on some lamps and on big lit landmarks), lit windows shining past their frames
  (a cool one flickers like a television), columns of light on water, head-lamp beams on the road (an actor whose
  state has `ang` and whose drawing has head or tail lights), dust turning in the lamplight, and motes rising or hanging
  and blinking over leaves, flowers and lawns. These are laid over the finished frame, so the engine checks what
  stands in front: a light, a lit window's glow or a reflection that a later standing object paints over is not drawn
  (a hidden lamp keeps its pool on the ground). Light the place generously: a street at night is lit by every pole, every
  shop front and most windows; a dark patch reads as a hole in the map.
- Night-only actors (a sparkle, a beacon): `layer: 'top'`, `at(t)` returns null unless `LOOK.night`. An actor's (and a
  static object's) seed comes from its creation order, so adding one shifts the drawing of everything created after
  it: create night-only things last, or the day changes.
Check at night with `PAGE_Q=night node scripts/verify.mjs` and `interact.mjs` as by day.

## 9d. The seasons
A scene with `season: 'spring', seasons: ['spring', 'summer', 'autumn', 'winter']` gets key S, `?season=`, and
`SF.setLook({ season })`: the world is built again for the new season (`SF.initWorld`) and brushed on over the old one with
a ragged wipe. Write what changes as facts about the place in that week (a real date: the cherry week, the river's
fireworks night, the last week of November, the first week of January), not as a generic filter.
- Things of one season: `{ season: 'autumn' }` (or a list) on `T.obj`, `T.cast`, `T.ground`, `T.actor`, `K.walker`.
  Things of the city's own season keep their place in the count when absent and the others count apart, so shared
  things keep their seeds and the own season draws exactly as before.
- In drawing code: `LOOK.season`. Kit options: `K.tree` `fall` (leaves drifting from it), `litter` (fallen round it),
  `glow`, `bare` (`K.bare`, a winter tree), snow on crowns and boughs when `K.snowy()`; `K.person` `coat`, `muffler`.
- `palette: { autumn: { '#lawn': '#straw' } }`: colour swaps for everything standing still in that season (lawns
  matter most: they read the season more than the trees).
- `air: { spring: { fall: ['petal'] }, autumn: { fall: ['leaf'] }, summer: { glint: true }, winter: { snow: 1, cover: 0.9 } }`:
  petals or leaves from every tree that `fall`s, glints on water, falling snow, and `cover` laying snow on every surface
  that faces up (roofs, lawns, roads, car roofs), not on walls, water or people.
- Check with `?season=...&f=N`; the city's own season must stay identical to before (render it before and after).

## 9e. The unfold
`?unfold` (or `SCENE.unfold: true`) replaces the build: the city lies on the table as a folded paper street map, a cover
with its title on top, and opens one fold at a time; each panel turns rigidly about its crease with its shadow and the
print showing through its back; when a panel lies open its buildings stand up like a pop-up book, in a wave from the
crease; the satellites are folded notes that open last; then the people pop in and the ordinary renderer takes over.
`85_unfold.js` plans the folds for a 3 × 3 grid of places cut along the street centre lines (another layout needs its
own fold plan). Without the flag nothing changes.

## 10. Rendering and performance

- Display lists are recorded once in wide px and **baked** per tile at the current zoom into canvases (sliced into
  small steps); the frame composes bakes + boil + actors. Line weight is computed at replay from the zoom
  (`lineW(z)`: 1.4 px at ×1, 2.25 at ×3, 4.8 at ×9.3).
- In the film, the next shot's bakes and its actors' poses (packed into two alternating 2048² atlas pages) are prepared
  while the current shot plays, a few ms per frame; a cut finishes whatever is left. In explore mode a zoom re-bakes
  the visible tiles ~90 ms after the wheel stops (a bake just made for the view counts as in use, so it is never the
  first to be evicted), and people are drawn from pose bitmaps made at the current zoom (LRU, `poseBudget`; small ones
  on shared pages with `poseAtlas`). While the zoom moves, a pose at another zoom stands in, scaled; at rest, a person
  whose new pose is not made yet shows their last sharp pose, never a blown-up one. The frame's few ms for new poses
  start after its bookkeeping, half for poses as they are drawn and half for everybody on screen in turn (their pose
  now, then the next second's), with a burst in the first half-second after the view comes to rest. People off screen
  are skipped before their pose is even looked up.
- Costs that matter: rasterising big fills at high zoom (bakes), building many new actor poses (each key is drawn once),
  many ribbons per drawing (pen strokes cost more than fills, `fine2`/`segs2` are cheap), and boiling lines: every
  boiling stroke in the baked region is refilled every frame. Draw very long lines (a canal edge, a coastline, a long
  roof ridge) with `boil: false`, and lower a busy drawing's share of boiling lines with `g.boilP = 0.2` at its start
  (default 0.5). If `perf.mjs` reports a
  heavy frame, read its `slowSteps` (job, ms, and what: slice, obj, grain+warm, boil, sprite, pose); the runner
  slices by time but one step cannot be split. Bake slices count points plus the device pixels each fill covers, and
  evicted canvases are freed one per frame.
