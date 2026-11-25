# inkcity

A skill for building a hand-inked, flat-coloured isometric map of places as one self-contained HTML page: a short film
(the places draw themselves, a camera tour with hard cuts, a fade to a ghost) that becomes an explorable picture
(pan, zoom to x10, click a place, keys). Every frame is a pure function of its number, so the page records exactly.

- `SKILL.md`: what it makes, the workflow, the rules, the tools.
- `assets/engine/`: the engine (projection, pen, kit, life kit, world, render, the folded-map opening, app): night,
  four seasons, real CJK lettering, people who are always doing something.
- `assets/starter/`: a two-place town that already plays, explores and passes the checks, its people alive.
- `assets/examples/`: bigger tiles (a hill street, a park), a street grid with a traffic timetable, a canal town, and
  the whole of the inkcity Atlas's Tokyo.
- `assets/lettering/`: stroke tables of real Chinese and Japanese characters.
- `scripts/`: new scene, frozen frames, stills of every shot, depth close-ups, verify, real-time perf, explore and
  interaction drivers, build to one file, mp4 recording.
- `references/`: engine, drawing (with the quality bar), life, depth, pitfalls.
- `evals/`: test prompts and what a good result looks like.

The scripts need Node 18+ and Playwright (`npm i -D playwright`, or `PLAYWRIGHT_FROM=<folder with node_modules>`).
