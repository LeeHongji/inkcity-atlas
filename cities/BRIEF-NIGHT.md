# inkcity Atlas — night pass for one city

Every city gets a night. The engine already draws it (key N, `?night`, the guide's "night" switch); what makes a
night beautiful is each city saying what lights up. Tokyo is done and approved: it is the reference. The user's words
for what night should be: lamps, trees and flowers glowing ("路灯，树木等都可以发出荧光感", "粒子漂浮的荧光感"), warm
light set in the night ("暖光结合上夜晚"), many lit things ("发光物体的数量可以更多"), the shine of a city at night
("夜晚都市的光彩"). The engine supplies the moonlit grade, halos, pools, glints, haze, beams, dust and motes; you supply
the lights.

## Read first
- `skill/inkcity/references/engine.md` §9c (Night): every call you need (`SCENE.night`, `g.mark`, `g.lit`, `g.glow`,
  `light: true` in actors).
- Tokyo's night pass: `git diff HEAD -- cities/tokyo/src` (lanterns, signs, vending machines, a light on every utility
  pole, lit sakura, the tower and Skytree lit, train and boat windows, signals, the giant screen, `SCENE.night`).
- Tokyo at night: `docs/media/day-to-night.webp`, `docs/media/night/*.jpg` and the live page
  `cities/tokyo/index.html?night` (the approved look).
- Your city's own `brief.md`, `src/35_scene.js`, `src/36_<slug>.js` and tiles.

## Hard rules
1. **Edit only `cities/<slug>/src/`**, then rebuild `cities/<slug>/index.html` (below). Do not touch `engine/`,
   `gallery-src/`, `gallery/`, `skill/`, `film/`, other cities, or `cities/<slug>/out/night/base/`. Do not commit or push.
2. **The day must not change by one pixel.** Everything you add is night-only: `g.mark({ nc / win })`, `g.lit`,
   `g.glow` (draws nothing by day), `SCENE.night`, and night-only actors (below). Never change a day colour, shape or
   draw call. `node cities/tools/night-check.mjs <slug>` compares every view by day with the saved base: all must PASS.
   (The base was saved before any edit; never re-run `base`.)
3. **True to the place, in the city's own season** (your `brief.md` says which). A city's night landmarks must be how
   they are lit today. If something has stopped (Hong Kong's "A Symphony of Lights" laser show ended on 18 Nov 2026),
   leave it out. Seasonal lights only if they belong to your season.
4. **Smooth**: at night `interact.mjs` must stay p95 ≤ ~20 ms with no frame over 34 ms, close to the day numbers, and
   `verify.mjs` must pass at night (commands below).

## What to light (go through every tile)
- **Windows.** `K.win` panes light up on their own (62 % lit). Panes your city's helpers draw in their own colours:
  list them in `SCENE.night.windows = { '#colour': share }`; lit shop floors and café/restaurant interiors share 1 (they
  also throw light on the pavement). A colour used by anything else (a wall, clothes) must not be listed: wrap the
  helper's pane fill with `g.mark({ win: true })` instead. Aim for most of the city's windows lit, mostly warm.
- **Street light.** A real street at night is lit by every lamp post, every pole that carries a lamp, every lantern over
  a door. Your city's lamp posts and poles: `g.glow('lamp', x, y, z_of_the_lamp, { r, base })` in the helper (or list
  the globe colour in `SCENE.night.lamps`). A light belongs on something: a post, a pole, a wall bracket over a door, a
  bridge parapet, a quay. Do not float lights in mid-air where nothing holds them.
- **Lanterns, signs, neon, screens, menus, kiosks**: their fill `g.mark({ nc: true })` (they keep their day colour,
  lit) and a `g.glow('lantern' | 'neon', ..., { r, col })` at their centre. Listing a colour in `SCENE.night.glow`
  does both for every fill of that colour, so only list colours nothing else uses.
- **Landmarks lit the way they are lit today**: the main fills `g.mark({ nc: (c) => LIT_COLOURS[c] })` to their night
  colour, plus a few `g.glow('lantern', ...)` up their height (Tokyo Tower: warm orange; Skytree: pale blue).
- **Trees, flowers, lawns**: `K.tree` / `K.palm` / `K.cypress` / `K.bush` / `K.blooms` glow already. Your own tree
  helpers: `g.glow2('tree', crownCentre, groundPt, { r, col })` at the end (Tokyo's sakura: `col: '#FFB3D3'`, pink motes),
  or list leaf colours in `SCENE.night.foliage`. Lawn colours of your own: `SCENE.night.grass` (fireflies hang over them).
- **Water**: list your water colours in `SCENE.night.water`, or lights by the water will not reflect. Bridges, quays and
  boats by the water then lay columns of light on it: a city on water should shine twice.
- **Vehicles**: `K.car` / `K.bus` lights glow already. Your own vehicles: head and tail lamps
  `g.mark({ nc: true, light: true })`; lit windows of trams, buses, trains, ferries `g.lit({ nc: '#FFE3A6' }, ...)`;
  a taxi sign, a boat's navigation lights the same. Head-lamp beams on the road come from actors whose state has `ang`.
- **People carrying light** (a lantern, a phone, a torch): `g.mark({ nc: true, light: true })` in their drawing.
- **Animated light** (a tower that sparkles, a beacon, a fountain show, a flashing sign): a night-only actor,
  `layer: 'top'`, whose `at(t)` returns `null` unless `LOOK.night` (so the day is untouched) and whose drawing marks its
  fills `{ nc: true, light: true }`. Keep it in keeping with the hand-inked look: a few marks, not a laser show.
- How much: Tokyo has 363 lights, 194 lit windows and 155 cells of warm glow (the check prints yours). A dark patch on
  the map reads as a hole; a place known for its night (a market street, a waterfront, a festival) should be the
  brightest part of the map. Warm light first; cool or coloured light only where it is true (LED landmarks, screens, a
  television in a window).

## Your city's night (verify each against a source; keep within your season)
| city | night signature |
|---|---|
| paris (early autumn) | the Eiffel Tower in its golden lighting, sparkling for a few seconds every cycle (in reality 5 min on the hour) and its beacon turning; Seine bridges' lamps and their reflections; café terraces; the Arc de Triomphe and Sacré-Cœur floodlit |
| venice (Carnival, February) | St Mark's Square lamp posts and the lit arcades and café orchestras; the Rialto lit; every canal lamp reflected; masked revellers with lanterns; vaporetto and water-taxi lights |
| hongkong (a December evening) | both sides of the harbour as walls of lit windows; Christmas light displays on harbourfront buildings (December); the Star Ferry and trams lit; the neon signs that remain in Mong Kok and Wan Chai; the Peak Tram. No laser show |
| chongqing (March) | Hongyadong's stilt houses lit gold from top to bottom; the bridges' light strings; river cruise boats lit; the Liziba train lit running through the building; red lanterns on the hotpot streets; the Jiefangbei towers |
| newyork (late spring) | the Empire State Building's top lights; Times Square's screens and signs, the brightest place on the map; office towers' lit windows; yellow cabs; Chinatown's signs and lanterns; Grand Central's windows |
| london (spring after rain) | Big Ben's lit clock faces and the floodlit Palace of Westminster; Tower Bridge and the Tower floodlit; the London Eye lit; red buses' lit decks; pubs' warm windows and lamps; wet streets doubling the lights where your map has puddles or the Thames |
| beijing (autumn) | red lanterns down the hutongs and Qianmen Street; Tiananmen Gate floodlit; the Forbidden City's corner tower lit over its moat; Houhai's lakeside bars and their reflections; Wangfujing's shop lights |
| istanbul (late April) | the mosques floodlit (Sultanahmet, Hagia Sophia, Süleymaniye); the Galata Tower lit; ferries' lights on the water; the Galata Bridge's restaurants and anglers' lamps; the Maiden's Tower lit |
| barcelona (late September, La Mercè) | the Sagrada Família floodlit; the Magic Fountain of Montjuïc in its light show (La Mercè ends with its piromusical); Casa Batlló lit; La Rambla's lamps and kiosks; the beach promenade and port lights |
| lisbon (June, Santo António) | the arraial: strings of lights and paper garlands, grills glowing with sardines; trams' warm windows; Alfama's windows; the 25 de Abril Bridge's lights; the castle and the Praça do Comércio arch floodlit |
| rio (Carnival, February) | Christ the Redeemer floodlit; the Sambódromo's floodlights with the parade going on through the night; Copacabana's promenade lamps and kiosks; the lights of the hillside favela; the Lapa Arches and their nightlife; the Sugarloaf cable car |

## Check and build (from the repo root)
```sh
node cities/tools/night-check.mjs <slug>          # day identical? night views -> cities/<slug>/out/night/*.png, sheet.jpg; light counts
cd cities/<slug>
PLAYWRIGHT_FROM=../../film PAGE_Q=night node ../../skill/inkcity/scripts/verify.mjs dev.html
PLAYWRIGHT_FROM=../../film PAGE_Q=night node ../../skill/inkcity/scripts/interact.mjs dev.html 2 night
PLAYWRIGHT_FROM=../../film node ../../skill/inkcity/scripts/interact.mjs dev.html 2 day       # to compare
cd ../..
python3 skill/inkcity/scripts/build.py cities/<slug>/dev.html cities/<slug>/index.html
```
Look at `sheet.jpg` and the close-ups yourself (read the images) after every round, next to Tokyo at night, and keep going until your city is as alive at night as Tokyo. Check the places your table
row names one by one.

## Report back
- What lights up, tile by tile, and how each night signature was done (with the source you checked).
- The light counts, the day comparison (all PASS), verify at night, interact night and day (the summary lines).
- The paths of `sheet.jpg` and the two or three best close-ups.
- Anything you could not do or are unsure of.
