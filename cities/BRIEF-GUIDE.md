# Writing a city's guide

Every city page now carries a **guide**: words laid over the living map in the Looseleaf hand (Kevin Sans), so a
visitor learns the city's history and its people while they explore. The words live in one file per city,
`cities/<slug>/src/guide.js`. The overlay that shows them is shared (`gallery-src/src/guide/`, published to
`gallery/guide.js`). **Do not edit the overlay, the engine, the skill, or any other city.** Tokyo is the finished
example: read `cities/tokyo/src/guide.js` first, then open `cities/tokyo/index.html` to see how it reads on screen.

## What the visitor sees
- **Opening:** the city draws itself; when the build ends, the camera eases to frame the whole city beside the
  guidebook, and handwritten **margin notes** appear in the empty paper round the map, each with a pen arrow to the
  thing it describes. The title and a short **intro** sit top left.
- **The guidebook** (a taped paper sheet, top right) lists the **places**. Choosing one glides the camera to that
  place's shot and shows its **story**; under it, **Look for** items: choosing one zooms to the detail and circles it
  in red pen. The **moment** has its own entry and a "Watch it" button that glides to its shot.

## The file (shape in `gallery-src/src/guide/types.ts`)
```js
'use strict';
window.GUIDE = {
  city: 'Paris', local: undefined, lang: 'fr',           // local: the name in another script/language, if different
  intro: '...',                                          // 2-3 sentences, about 300-380 characters
  notes: [ { at: [x, y, z], dx, dy, w, text }, ... ],    // 5-6 margin notes
  places: [ { shot, title, local, story, look: [ { at, z, r, text }, ... ] }, ... ],
  moment: { shot, title, text, when },
};
```
- `at` is a **world point** `[x, y, z]`: a tile's local point plus the tile's centre (`SF.tile('name', cx, cy, ...)`),
  z in the same units as the drawing (find heights in the tile code: `K.box(g, x0, y0, x1, y1, z0, z1)`, etc.).
- `places`: one per district tile, **in the order of `SCENE.visit`** (so keys 1-9 match), `shot` = that place's shot
  name in `src/35_scene.js`. Satellites can be places too if they have a shot; otherwise mention them in notes.
- `look`: 2-4 per place. `z` the zoom to view it (4.5-7.5), `r` the pen circle's radius in world units (5-12).
  Every item must point at something **really drawn there**: read the tile file to find it, never guess.
- `lang`: `ja`, `zh-Hans`, `zh-Hant`, `pt`, `tr`, `it`, `es`, `fr`, `ca`... Chinese and Japanese local names are
  shown in a rounded system face (or the cities' own pen strokes when every character exists in `gallery-src/src/cjk.ts`).
- Kevin Sans covers Latin with French/Spanish/Portuguese/Italian/German accents plus **ā ē ī ō ū ğ ş İ Ç Ş Ğ** (added
  for the Atlas). Avoid other special letters (ø, ß, æ, œ, ★, €) in the English text.

## Writing
- **Voice:** a well-read friend walking beside you. Concrete, warm, specific; dates, names, numbers that matter; one
  human detail per place (who lives, works, eats, prays, plays there, and why). No tourist-brochure adjectives
  ("vibrant", "bustling", "iconic", "must-see"), no hedging, no listicles.
- **Story:** 2 short paragraphs per place (about 450-650 characters in all), separated by `\n\n`. First the history
  that made the place what it is; then the life you can see in the drawing today.
- **Look for:** one short sentence each, naming the thing so the visitor can spot it ("The giant red lantern of the
  Thunder Gate."). Add a few words of why it matters when it fits.
- **Notes:** one sentence each (under about 110 characters), about things visible from the whole-city view: the
  street fingerprint, the tallest landmark, the river, each satellite island.
- **Moment:** title + 2-3 sentences that tell what to watch for, + `when` (how often it happens / where to look).
- **Accuracy matters.** The person reading knows these cities. Use only facts you are sure of; when unsure, leave it
  out. The drawing compresses geography (landmarks are moved and turned); say "here" about the drawing, never claim
  the real layout is as drawn.

## Wiring the page (once)
In `dev.html`: add `<script src="src/guide.js"></script>` just before `<script src="../../engine/80_render.js">`,
`<link rel="stylesheet" href="../../gallery/guide.css">` before `</head>`, and
`<script defer src="../../gallery/guide.js"></script>` before `</body></html>` (copy Tokyo's `dev.html`). Then rebuild:
`python3 ../../skill/inkcity/scripts/build.py dev.html index.html`.

## Placing the margin notes
The notes sit in the **empty paper round the map** in the home view (1920 x 1080, guidebook open on the right,
about 380 px wide; the title and intro take the top-left corner, about 430 x 260 px; the controls take the bottom
left, about 520 x 60 px). `dx, dy` is where the note's text sits relative to its target, in **wide px** (the screen
offset is `dx * pz`; pz is about 0.8 in the home view). Negative `dx` right-aligns the text to the left of that point.
Never put a note over the drawing, the satellites, the title, the guidebook or the controls; keep each arrow short and
not crossing another. To see where targets land, run the check and look at `00_wide.png`; iterate until clean.

## Checking (required)
From the city folder, with `PLAYWRIGHT_FROM` set to a folder whose `node_modules` has Playwright:
- `node ../../gallery-src/tools/guide-check.mjs out/guide` shoots the home view (`00_wide.png`), every place, every
  look-for item and the moment, driving the real guidebook. `--only=shot1,shot2` re-shoots some places; `--wide` only
  the home view. It must end with `no page errors`.
- Look at every PNG (make contact sheets with PIL to save time, but open the wide view and any doubtful item at full
  size). Each red circle must sit on the thing its text names; fix `at`, `z`, `r` until it does.
- Then run the skill's `verify.mjs index.html` (must end `all checks passed`).
The check scripts share one browser lock with the other agents: runs queue, that is expected. No mp4, no commits.

## Done means
`src/guide.js` written, `dev.html` wired, `index.html` rebuilt; the guide check ends with `no page errors` and every
circle and note has been inspected and lands right; `verify.mjs` passes. Report: the places and look-for counts,
the paths of `00_wide.png` and two good look-for shots, the check outputs, and any fact you left out for uncertainty.
