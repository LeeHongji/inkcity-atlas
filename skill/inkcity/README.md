# inkcity

A skill for building a hand-inked, flat-coloured isometric map of places as one self-contained HTML page: a short film
(the places draw themselves, a camera tour with hard cuts, a fade to a ghost) that becomes an explorable picture
(pan, zoom to x10, click a place, keys). Every frame is a pure function of its number, so the page records exactly.

- `SKILL.md`: what it makes, the workflow, the rules, the tools.
- `assets/engine/`: the engine (projection, pen, kit, world, render, app).
- `assets/starter/`: a two-place town that already plays, explores and passes the checks.
- `assets/examples/`: bigger tiles (a hill street, a park) and a street grid with a traffic timetable.
- `scripts/`: new scene, frozen frames, verify, real-time perf, explore driver, build to one file, mp4 recording.
- `references/`: engine, drawing, pitfalls.
- `evals/`: test prompts and what a good result looks like.

The scripts need Node 18+ and Playwright (`npm i -D playwright`, or `PLAYWRIGHT_FROM=<folder with node_modules>`).
