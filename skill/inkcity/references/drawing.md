# Drawing the places

Contents: 1 Method · 2 The look · 3 Composition of a place · 4 Buildings · 5 People · 6 Crowds · 7 Streets and
traffic · 8 Ground, water, plants · 9 Vehicles and machines · 10 Small life · 11 Checking a drawing

## 1. Method: understand the thing, then build it

Draw every element the way it is actually made, at the level of detail the zoom will show. Before writing geometry,
answer in a comment: what is it made of, how is it constructed, how does it meet the ground, what is its rhythm (bays,
storeys, posts, stripes), what is the one feature that makes it recognisable, and who uses it how. A Victorian house is
a box on a raised basement with a bay window, a cornice with brackets and a steep stoop; on a hill its floor follows
the downhill side and the walls run down the slope. A bandstand is a raised octagonal platform, slim posts, a pointed
roof, someone performing under it. A rowing boat has a pointed bow, a rower facing the stern, two oars dipping.
For a real landmark, run `scripts/landmark.py "<name>" --target <u>` once: it writes a card to `refs/` with Wikidata
facts, the OpenStreetMap parts (heights, roof shapes, colours, footprints, also scaled to the height you mean to draw)
and a few Commons photos with their licences. Use it for proportions and structure (where the decks are on a tower,
how many spires, what colour the roof is), never to import geometry at true scale: here a person is ~6 u (1 u ≈ 0.28 m)
and landmarks are drawn 10–20× shorter than true scale. Imagine it, then draw it as a finished illustration. A reference (a video, a photo) is for understanding what is there
and the mood; look once, then draw your own. Do not chase pixels or loop on comparisons: render to check that the
drawing runs, reads and is ordered correctly, not to match.

## 2. The look

- Human-drawn, not digital: a warm dark pen for silhouettes and important edges, finer and lighter lines for seams,
  rails and hatching. Long edges run nearly straight; small variation lives along the stroke. Save the darkest marks for
  doorways, recesses, hair and important corners. Many surfaces stay quiet.
- Opaque local colour under the ink, shaded by face with judgement: lit left faces, right faces a tone darker
  (`K.tones`), tops lightest; some roofs one flat colour. Marks differ by material: paving pale directional scuffs,
  grass dark tapered blades in twos and threes, water long shallow arcs and sparse white crests, the map's cut edge a few
  ruled scratches, trees C-shaped leaf marks.
- Windows: houses and cars pale glass with a white diagonal glint in a dark frame (`style:'glass'`); civic stone
  buildings solid navy panes; far windows blue slits.
- Do not give everything the same wobble, blot and density. Leave paths, water and plazas open: people need room and
  landmarks need air. A place is dense with life but not uniformly busy.
- Coloured things get coloured lines (`c: shade(col, 0.5)`): crowns, roofs, water edges, awnings.

## 3. Composition of a place

- Tall things at the far side (small x, small y): they never hide the square, and they read against the paper. A
  building of height h hides the ground up to about 1.1·h behind it along the diagonal: keep the people and the story
  out of that shadow, or move the building.
- One landmark per place (a hall, a tower, a conservatory, a bridge) plus 2–4 secondary structures, open ground,
  trees round the edges, furniture where people would sit or wait.
- 3–8 small stories, each a few figures doing one thing: two friends chatting by a fountain, a child waving at the
  water, a reader on a bench, a picnic on a blanket, a busker with listeners, a wedding on the steps, someone fishing at
  the end of a jetty, a vendor and a customer. Place figures in relation to things (facing what they look at). Every
  one of them moves: they are life-kit actors or a scene of your own, never frozen figures (life.md).
- Movement in layers: a few walkers on routes that keep clear of everything, traffic on the streets, something
  repeating in place (a flag, a fountain, a windmill, a carousel, a swing), something slow across the frame (a boat).
- Check the place at its shot zoom (~3–4.5) and in the wide view, where an adult is ~20 px tall: silhouettes and colour
  must carry it there.

## 4. Buildings

- Massing first: one box per volume (`K.box`), split where things stand both in front and beside. Then the roof
  (`K.gable`, `K.hip`, `K.cone`, `K.dome`, or a flat roof with a parapet and roof furniture), then the openings.
- Openings in rhythm on the faces we see ('L' = plane y = y1, 'R' = plane x = x1): ground floor taller and different
  (doors, shopfronts, an arcade), upper floors repeat, the top gets a cornice. Doors on the face the street or the
  square is on, with a step or stoop in front.
- Trim makes a building: a cornice band (`K.box` slightly larger, thin), sills, a bay window (a box sticking out with
  its own windows and a little roof), a chimney, a sign, an awning (`K.stall` shows stripes).
- On a slope: the ground is a height function `hAt(x, y)`; set each building's floor by its downhill side and let the
  walls run down the slope; stepped houses climb in a row (see `assets/examples/lombard.js`).
- Special structures are built as they are built: a conservatory from a glass drum and barrel-vaulted glass wings, a
  pagoda from stacked hip roofs with upturned tips, a windmill from a brick octagon with a gallery and a cap, its sails an
  actor turning in a slightly tilted vertical plane (see `assets/examples/ggpark.js`).

## 5. People

`K.person` does the anatomy; your job is to cast and pose them. What it encodes (keep to this if you draw figures of
your own):
- **Proportions**: about 6 heads tall (head ≈ a fifth of the height, never a ball as big as the torso); shoulders about
  two head-widths, waist narrower, hips a little wider than the waist; elbows at the waist, wrists at the crotch, knees
  halfway down the leg.
- **Three-quarter view**: the face turns with the body; the far side of the body is narrower and a shade darker; the
  far arm and leg are drawn first. Facing left is the mirror of facing right, but the light stays upper-left.
- **Construction**: limbs are tapered tubes through their joints (upper arm thicker at the shoulder, wrist slim, a
  calf), joints are found by two-bone reach, so a hand can be put on a book, a bat, an oar or a handlebar and the elbow
  falls where it must. Standing legs are straight; a walking stance leg stays straight while the swinging leg bends;
  arms swing on an arc from the shoulder, elbows pointing back.
- **Face** at close zoom: a jaw that narrows to a chin turned the way they face, two dot eyes, brows, a small nose on the
  facing side, a mouth (open when cheering), an ear behind the cheek; hair as a cap with a hairline and its own shape
  (bob, bun, pony, curls, long hair down the back). These are fills, so they vanish gracefully at small zoom.
- **Clothes** in layers: trousers or a skirt or a dress (A-line, hem sways when walking), a top with a neckline, sleeves
  short or long, an open jacket with lapels over a shirt and tie, shoes with a pale sole.
- **Situations**: sitting needs a seat at the right height (bench seat 1.3 u: anchor z = 1.3), and the seat belongs
  in the sitter's own cast drawing (or the sitter is `on` inside the seat's footprint) so the sort cannot paint the
  seat over them; someone seen from behind on a bench hides their legs; a person in a boat or behind a counter has
  `noLegs`; a performer under a roof is drawn inside the structure's object; someone at a window is an actor 0.1 u in
  front of the wall with `noLegs`; a seller works at the end of a stall or in front of its counter, because a full
  awning hides anyone standing behind it from this camera; a crowd at a distance is busts (§6). Hats, held things and
  props attach to the points `K.person` returns (`crown`, `hands`). Vary skin, hair, build, clothes widely: `K.who(seed)`.
- Crowds that move together (a scramble crossing, a procession) are one actor per person on a timetable: positions
  from a seeded plan per cycle (a seeded shuffle decides who goes where, so groups do not move as blocks), standing
  poses while waiting, walk phases while crossing. A few dozen looks shared by many people keep the pose count down.
  See `assets/examples/tokyo/tiles/shibuya.js`.
- Draw people on their own with `tools/sheet.html?z=9.3&seeds=3,8&rows=stand,walk:0.25,sit,hold,bike` before trusting
  them in a scene, at the close-up zoom and at film zoom (z ≈ 3.2).

## 6. Crowds

Hundreds of spectators are scenery, drawn with cheap marks: a bust per seat — shoulders and chest in a shirt colour
with a fine outline, a neck, a head of normal proportion with a hair cap or a cap, two eye dots — jittered a little,
some seats empty, aisles kept clear. A few fans who jump up are actors (`K.person` 'cheer') standing in reserved gaps.
Sizes that match `K.person` (wide px, k = 1): torso about 5.5 wide (±2.75) and 5 tall from the seat with sloped
shoulders; neck 1.2 wide, 1.3 tall; head radius ≈ 1.95 centred 7.6 above the seat point; eyes 0.22. Tiers about
2.4 u deep and 1 u high, so each row's busts overlap the row behind; a seat every ~1.9 u along the row. Use fills,
`fine2` and discs, not pen ribbons: there are hundreds.

## 7. Streets and traffic

- Streets are ground in their own tile: asphalt, kerbs, centre dashes broken at crossings, zebra crossings where paths
  meet, rails if there are trams.
- Traffic is a **timetable**: each vehicle loops its lane with a period and a phase; choose phases so that no two
  vehicles ever overlap at a crossing (check offline with an oriented-box test over the whole cycle). Fade vehicles in
  and out with `alpha` where lanes leave the world. Headings quantised (16–64 steps) on curves; slow down on bends.

## 8. Ground, water, plants

- Each tile stands on `K.slab` (a top colour and a rim line at z 0, flush with the streets round it) unless it is water
  or terrain. All ground that meets is one level: a lip or plinth face inside the map is a depth error (the cars drive at
  z 0). Only the map's outer edge shows the cut section (`cut`).
- Paths and ponds are closed `K.curve`s through a handful of world points; paint the darker edge, then the water, then
  `g.water` arcs, then a fine outline. Keep paths clear of ponds and buildings; walkers follow them.
- Water below a quay: paint the water, then the near bank's paving and its stone edge after it, so the strip of water
  that would show under the paving's edge is covered; the far bank's wall face shows above the water.
- Bridges, arcades, piers you can pass under: see engine.md §3 (`under`) and `assets/examples/canal/36_canal.js`.
- Trees: `K.tree` round faceted crowns (vary radius and colour), `K.cypress` for verticals, `K.palm` with drooping
  fronds; flower beds as rows of blooms (cast, so they pop in alive).

Projection habits worth knowing: a horizontal thing pointing at the viewer (a beam, a pier, an oar, a ray of light)
runs **down** the screen; one pointing away runs up. A light beam sweeping round reads best when shown crossing
sideways, as a pale wedge, and as a flash when it faces us.

## 9. Vehicles and machines

Build them as boxes on a heading (`K.rbox`) and put details on the faces you can see (`B.vis`): wheels as true
ellipses in the side plane, the far pair before the body, the near pair after it in dark wheel arches; bumpers on the
ends, a door seam and handle, glass with a glint, lights front and back. Anything that turns (sails, a carousel, a
Ferris wheel) is an actor keyed by its quantised angle, drawn far parts first, then the hub, then near parts.

## 10. Small life

Flags (a waving cloth actor on a pole), fountain jets (arcs of water falling into the basin, rings spreading), smoke,
balloons, kites, birds, ducks following each other, a dog on a lead, a skater's arc. Each is a few marks; each adds a
heartbeat. Put one or two in every place.

## 11. Checking a drawing

Render the tile at its shot, at a close zoom (`f=N&cam=9,cx,cy`) and in the wide view; look for: wrong depth (someone
under a blanket, a person in front of a roof they stand under), floating things (wheels, feet, boats), paths through
water or trees, people facing nothing, shapes that are mush at film zoom, outlines that pass through a face. Fix the
cause, not the symptom (see `pitfalls.md`).

## 12. The quality bar: a finished place

These points come from raising the inkcity Atlas's Tokyo to the standard of a hand-made isometric city film. The owner's
words were: richer detail, brighter colour, natural people, landmarks tall and recognisable, a finer pen, and every
activity really happening. Check each place against them before calling it done.

1. **The landmark is the subject.** It is real, recognisable from its silhouette and its features, and clearly bigger
   than everything round it. Draw it from the real building (`scripts/landmark.py`), not from a generic shape. Tokyo's
   numbers, with a person 6.1 u tall:
   - Tokyo Tower is 100 u, with seven bands and a fine lattice;
   - the station's domes reach 31 u, with a three-storey brick front across the whole tile;
   - Sensō-ji's pagoda is 45 u;
   - the Skytree is 124 u, at true scale against the tower.

   Secondary buildings are lower and simpler. The hierarchy should read in the wide view.
2. **No empty ground.** Every block edge is lived in:
   - shopfronts with awnings (`K.awning`), signs, banners (`K.nobori`), noren, planters, vending machines, bikes,
     benches, lamps, bins, bollards;
   - façades with window frames, sills, balconies, shutters;
   - flat roofs with a railing, a water tank, AC units and an aerial (`K.rooftop`);
   - lawns with paths, beds and people on them.

   A bare plaza or a lawn with nothing on it reads as unfinished at any zoom. Group the small fixed things into one
   object each where nobody passes between them (performance, engine.md §10).
3. **Colour belongs to the landmarks and the signs.** Use strong local colours: international orange, red brick with
   white stone, temple vermilion under dark navy roofs, sign reds, yellows, blues and greens, pink blossom. Keep
   background buildings light and pastel. `SCENE.grade` lifts every colour a little; a colour that looks right in a
   still is right.
4. **A fine pen for the inside.** `SCENE.ink` 0.8–0.85. Silhouettes get the main weight; inner lines get `w` 0.25–0.4
   and there are many of them: brick courses, window bars, roof-tile channels, lattice bracing.
5. **Real words.** Latin text in the stroke font (`K.sign`, `K.text`); Chinese and Japanese from a stroke table
   (`K.glyphs*`, `assets/lettering/`). Give each sign the word its shop would have: ラーメン, 電気, 酒, 寿司, 渋谷.
6. **Everything is happening.** People act and answer each other: a conversation, a photo, a game, a queue that
   moves, a vendor handing over food, worshippers at the incense, fans clapping on the beat. Each place has its own
   events (life.md). Each place also has something mechanical that repeats (a flag, a fountain, a bell being struck, a
   crane game's claw, a train), and something slow that crosses it.
7. **Depth holds at every zoom and every moment** (depth.md): nobody inside a counter, a bench or a wall; nobody drawn
   over a nearer person; vehicles ordered by footprint.

Render the place at its shot, at a close zoom where faces read, and in the wide view. Compare it with the best
reference you have, by these seven points rather than by pixels.
