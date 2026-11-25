# Depth: what stands in front of what

On a busy map most visible mistakes are depth mistakes. Typical ones:
- a keeper drawn over the counter they stand behind;
- people standing inside a table, a bike rack or a wall;
- a crowd on top of a passing bus;
- a bench painted over the person sitting on it.

This file covers the rules the engine sorts by, the four errors they produce and how to fix each, and how to survey a
place for them. Read it before the life layer goes in, and do a depth pass on every place before hand-over.

## The rules

Read them in `30_world.js` (`objInFrontOfPoint`, `cmpStatic`, `sortObjs`, the sprite promotion in `SF.initWorld`)
and in the actor loop of `SF.draw` (`80_render.js`). Larger x + y is nearer the viewer.

**Standing objects** have a footprint `fp`: `[x, y]` for a small prop (≤ 6 u both ways) or `[x0, y0, x1, y1]` for a
box.
- Within a tile, A comes before B if A lies wholly on the far side of B in x (`a.x1 <= b.x0`) or in y (`a.y1 <= b.y0`).
  Otherwise they go by the sum `x0 + x1 + y0 + y1` (plus `2 * bias`).
- `{ on: true }` puts a small prop after the object whose footprint contains its centre.
- `{ under: h }`: an actor inside the footprint below height h is drawn under it (a bridge span, a porch roof).

**Actors** are placed against standing objects at their anchor `(st.x, st.y)`. An actor is drawn just before the
first object (in drawing order) that overlaps it on screen and stands in front of it, its slot:
- A **small prop** is in front if its centre's x + y (+ bias) is larger.
- A **box** is in front if the anchor lies outside it with `x < x1 && y < y1`.
- An anchor **inside** a box: the box is never in front, except an `under` box below its height.
- Among themselves, actors go by slot, then by x + y.

**Tiles** draw in order of `order` ((cx + cy) / 100 by default). A shared tile round the world (a viaduct) is split
into a far tile below every place and a near tile above every place.

### Scene options that make this more robust

Each is off by default (existing scenes stay exactly as they are). The starter turns them on. Use them in every new
scene.
- `strictProps: true`: a small prop more than 2 u wholly on the far side of a person, in x or in y, is never in
  front of them. Without it a utility pole across the street can take a person out of order.
- `slotChain: true`: a person is never drawn later than a nearer person they overlap on screen. Without it a far
  person with nothing in front of them lands on top of a near one whose slot comes early. The pull is bounded by
  what stands behind the far person (their floor), so nobody is drawn under the scenery behind them.
- `st.ext = [hx, hy]` from an actor's `at(t)`: a long mover's half-size on the ground (a bus, a train car, a van, a
  rickshaw, a boat). Movers that overlap on screen are then ordered by footprint, as standing objects are, so a person
  beside a bus is behind it or in front of it by where they stand.
- `{ noHide: true }` on an object: it is sorted among the standing objects but never decides where a person goes
  (overhead wires, lantern strings, banners on long ropes, whose bounding box is far bigger than what they cover).

## The four errors

1. **Several people (or a person and their table) drawn by one actor.** The whole group shares one anchor. Fix: one
   actor per person on a shared clock (the life kit does this); a table, a grill or a stage is an object of its own.
2. **A person anchored inside a box.** A stall keeper, a monk in a belfry or a barista in a van is drawn over the
   whole object, counter included. Fix: split the object.
   - The back part (back wall, shelves, the far posts) is one object with a footprint behind the person.
   - The front part (counter, front rail, near posts) is another, with a footprint in front of them.
   - A roof or eave that hangs in front of their head belongs to the front part. Or move the person out of the box.
3. **A footprint that doesn't match the drawing.** Awnings, signs over the pavement, umbrellas, nobori, a 10 u taxi
   declared as a point, a bike rack declared as a point but drawn 10 u long. Fix: give the footprint the ground area
   the drawing covers. Split long things into parts. Use `bias` only as a last resort.
3b. **A thin, long, diagonal thing with a huge bounding box** (wires, lantern strings). Fix: `{ noHide: true }`, or draw
   it in pieces.
4. **Two things in one place.** A person inside a bench, a crowd on a bike rack, a walker's route through a stall, a
   queue through a table, two members of a crowd on one spot. Fix: move one of them.
   - Check every route against every footprint along its whole length, and give walkers their own lanes about 1 u
     apart.
   - A route that ends in a turn needs room for the person (and a dog 3.2 u ahead) at the turn.

Also check lanterns and signs that hang over a passage: people are 6.1 u tall, so anything they walk under must hang
higher (a gate's lantern with its bottom at 6.5–7 u).

## Surveying a place

```
node <skill>/scripts/depth-views.mjs dev.html <tile> out/depth            # whole tile + four quarters, three moments
node <skill>/scripts/depth-views.mjs dev.html <tile> out/depth 520,700 night
```
1. Look at every image at full size.
2. List every overlap that cannot happen in the real place: what, where, which rule.
3. Fix each with the smallest change, re-render, and look again; a fix can create a new overlap.
4. For movers, render a frame sequence along their route (`scripts/shot.mjs` with `f=N&cam=z,cx,cy` at a few frames).

A quick probe in the page also helps:
- list every person standing inside a footprint, and every pair of people closer than 0.75 u, sampled over a minute;
- in a scene that has sampled poses, list actors whose slot falls on an object from another tile.
