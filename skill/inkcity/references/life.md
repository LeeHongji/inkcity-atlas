# Life: nobody stands still

A living map is judged close up. When a viewer zooms in, every person should be doing something, and people near each
other should answer each other. A frozen figure (a `T.cast` person) reads as a cut-out. This file covers the engine's
life kit (`assets/engine/25_life.js`, loaded after `20_kit.js`) and how to write a place's own scenes.

## The kit

Every helper makes `T.actor()`s, **one per person**. Each person is depth-sorted at their own feet, so they stand in
front of or behind the things round them on their own account. The members of a group read one shared clock, so their
answers are in time. Every state has a small key, so the drawings are shared and cached.

| Helper | What it does |
|---|---|
| `K.idle(T, who, x, y, { acts, seed, period, z, lookTo })` | One person always busy: a seeded day of acts, each 2–6 s. `who.sit` sits them (on a bench put `z` at the seat height, 1.3). |
| `K.group(T, [{ who, x, y, z?, idle? }, ...], { laughs, period, seed })` | A conversation. One person talks with their hands while the others listen; turns often end in everybody laughing. Face each person towards the others with `who.dir`. |
| `K.photo(T, shooter, [poser, ...], { seed, pause })` | A photo. The posers make peace signs and wave, then all jump at once. The shooter holds the phone up, then checks the picture. |
| `K.toss(T, a, b, x0, y0, x1, y1, { arc, fly, hold, ball })` | Two people throwing a ball, which is its own actor in the air. |
| `K.chase(T, [who, ...], pts, speed, { gap })` | Children running a closed loop, keeping their distance. |
| `K.dogWalk(T, who, pts, speed, dogColour, { stops, phase })` | A walk on a closed route. The dog trots 3.2 u ahead on its lead (its own actor) and sometimes stops to sniff while the owner waits. |
| `K.pigeons(T, x, y, n, { seed, r, period })` | Pigeons pecking within `r`. Every so often they all flutter up and come down a little way off. |
| `K.doing(g, who, act, i, x, y, z)` | Draws one person mid-act inside your own actor's `draw` (see below). |
| `K.day(seed, acts, period)` | A seeded schedule of acts. |

The acts in `K.ACTS`, each `{ n drawings, rate per s, f(i) → K.person options, z hop?, extra(g, r, i, who) }`:
- **Standing or sitting about:** `rest`, `look` (turns; `lookTo` ±1), `talk`, `listen`, `phone` (at the ear),
  `scroll` (a phone in both hands), `laugh` (a small hop), `point`, `stretch`.
- **Together:** `wave`, `clap`, `cheer`, `jump`, `peace`, `photo`, `bow`.
- **Eating and reading:** `eat` (`who.food` colour), `drink` (`who.cup`), `read` (a book, a page turning).
- **Ritual and work:** `pray`, `sweep`.

Add your own act to `K.ACTS` (in your scene file) rather than writing a one-off actor when several people will do it.

A city with its own people (kimono, school uniforms, robes) sets `K.lifePerson = myPerson` once, in a file loaded
before the tiles. `myPerson` takes the same arguments as `K.person` and returns the same points; the kit then draws
everyone with it. Tokyo does this (`assets/examples/tokyo/38_life.js`).

## A place's own scenes

The kit covers ordinary life. What makes a place is its own life: worshippers wafting incense smoke and then praying, a
stall keeper calling, handing over a skewer and the customer eating it, an idol singing while her fans clap on the beat,
a fisherman casting and reeling in, drinkers raising their mugs together. Write each as its own actors:
1. A shared clock: a function of `t` that returns the phase (who is acting, which beat).
2. One `T.actor` per person. Its `at(t)` reads the clock and returns `{ x, y, key: act + frame, ... }`; its `draw`
   calls `K.doing(g, who, act, i)` or `K.person(...)` with `hands` set for the exact gesture.
3. Things that move between people (a ball, a skewer handed over, a fan's penlight) are drawn by whoever holds them at
   that beat, or by an actor of their own when they fly.
4. Things that people stand round (a table, a grill, a burner, a stage) are standing objects of their own, not part of
   any person's drawing.

`assets/examples/tokyo/tiles/` has many examples:
- `sensoji.js`: the incense burner, omikuji, the dango stall;
- `akiba.js`: the idol stage, the cosplay ring, crane games;
- `tsukiji.js`: stall keepers on a beat, with customers taking what is handed to them;
- `loop.js`: crate tables with a toast;
- `satellites.js`: a sumō bout and its crowd.

## Rules

- **No frozen people.** `T.cast` is for things that really are still (a sleeping cat, a statue, a parked bike). A
  person who stays in one place is a `K.idle`, or one member of a `K.group`, `K.photo` or your own scene.
- **One actor per person.** A group in one actor is drawn in front of or behind everything round it together, so a
  member standing behind a bench appears in front of it. One actor for a row of shop keepers also makes huge pose
  drawings: a row of 10 keepers with 64 states blew the pose cache. The only exception is a crowd packed inside a
  structure that nothing passes through, such as a stadium's stands, which can be a few actors drawn tier by tier.
- **Few keys, small drawings.** A person's states should be a handful of acts × 1–4 drawings. The engine draws a pose
  once per zoom, and hundreds of people on screen each changing pose several times a second have to fit in a few ms per
  frame (engine.md §10).
- **Room to act.** Keep people about 1 u apart (a person is about 1 u wide and 6 u tall) and clear of every object's
  footprint. Give walkers their own lanes, and never put a standing group on a walker's route. depth.md covers how to
  check this.
- **The clever moment is timed to its shot.** A bout, a toast or a crossing gets its phase from the shot's frame
  (engine.md §8).
- **Seeds:** every person needs a different seed (`K.who(seed)`). Adding actors shifts the seeds of everything created
  after them, so put season-only or night-only people last.
