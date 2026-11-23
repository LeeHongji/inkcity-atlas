# inkcity Atlas: "Press N", the night film (for X)

## Brief

- **What it sells:** the night that every inkcity Atlas city now has. Press N, or the guide's night switch, and the map
  turns to night: the same drawing under moonlight, windows lit, lamps laying pools of light, each city's landmarks lit
  the way they are lit today, lights doubled in the water, motes rising from the trees. The film shows the switch
  itself and then the twelve nights.
- **Scope:** `main@32b81e5` (published 2026-11-22), the twelve city pages in a desktop browser. The guide's phone layout
  and the gallery page are not shown.
- **Format:** X, square 1080×1080, 30 fps, 30 s (under a minute, so X loops it in the feed). English only, few words, in
  the Looseleaf hand (the user's standing preference: minimal English captions in the product's hand-drawn type; smooth
  sounds, no grit). The end card carries the site's address.
- **Claims and their sources:**
  - "Press N and the city turns to night": `engine/90_app.js` (key N, `SF.setLook`), the guide's night switch
    (`gallery-src/src/guide/Guide.tsx`).
  - The lamps come on in a wave from the middle of the view, after the day fades: `engine/90_app.js` (`drawSwap`,
    `lightT`) and `engine/80_render.js` (`drawLight`, `on()`).
  - "Lit the way they are lit today": each city's night pass, sourced city by city (`cities/BRIEF-NIGHT.md` and the
    commit message of 32b81e5).
  - Twelve cities: `cities/*/index.html`, all twelve with `SF.setLook` (checked on the live site after the push).
- **Where every picture comes from:** the real city pages in `?f=0` mode drawing any frame at any camera, by day
  (`SF.seek`) and at night (`?night`; the switch itself is the page's own draw with its `lightT` wave, the day frame laid
  over it fading exactly as `drawSwap` fades it). The keycap is the gallery's own Looseleaf `Kbd`. The twelve tiles are
  the pages' own wide views, drawn by day and at night ahead of time (`tools/grid-images.mjs`).

## Product character

- **What night is:** the city you know, at its warmest. Blue-grey moonlight on the paper, warm lamplight, a few cool LED
  landmarks, quiet motes. It should feel like a calm evening walk, not a party.
- **What the product already owns that the film can use:**
  1. The switch: one key, N. A keycap in the Looseleaf hand (`Kbd`, with a pressed state).
  2. The wave: the old look fades, then the lamps come on from the middle of the view outwards.
  3. The guide's night notes: at night its handwriting turns to pale ink with a dark halo.
  4. Each city's own night signature (the Eiffel Tower's gold, Hongyadong, Times Square, the Sambadrome...).
  5. The engine's tour grammar: hard cuts between close-ups.

## Three directions

| Direction | Ground and light | Type | Camera | Rhythm | Music |
|---|---|---|---|---|---|
| **A. "Press N" (chosen)** | One switch from cream day to blue night, then night only | Looseleaf lettering, ink by day turning to pale ink at night; a real keycap | The engine's own cameras, still; hard cuts | Slow open (the switch gets 6 s), then one city per two beats | Felt piano and a soft pad, glockenspiel for the lamps, a light pulse under the cities |
| B. "Dusk across the Atlas" | Every city crossfades day to night one after another | Captions only at the end | A slow pan across each city | Even, slow | Ambient pad |
| C. "Night lights" | Night only, close-ups of single lights | Big counters ("1,467 lights") | Macro push-ins | Fast | Synth arpeggios |

**Why A:** the feature is a key you press and a wave of light you watch; A shows exactly that once, slowly enough to
see, and then proves it everywhere with each city's own night. B repeats the switch twelve times and tires; C sells
numbers instead of the look, and its macro push-ins and counters are not the product's grammar.

## Devices taken from the product ("because it has X, the film uses Y")

1. **Because night is one key, the film turns twice on a real keycap.** The Looseleaf `Kbd` "N" is pressed on the beat
   (its pressed state, a soft key click): once to start the night, once to light all twelve.
2. **Because the lamps come on in a wave from the middle of the view, the opening frames Tokyo so the wave crosses the
   whole square.** It is the page's own draw and timing, slowed to 0.7× so the eye can follow it; a glockenspiel note
   rises with the wave.
3. **Because the guide's notes turn to pale ink at night, so do the film's captions.** The opening line is written in ink
   by day and turns pale with a dark halo as the night falls; every later caption glows on like a lamp instead of being
   written on (the last film wrote its captions on with a pen; this one does not).
4. **Because each city is lit the way it is lit today, the middle is a run of hard cuts on the beat, each city at its own
   signature camera.** A pale lettered name in the corner, nothing else.
5. **Because the switch is the same in every city, the ending lights all twelve at once.** Twelve tiles, by day, turn to
   night in a wave from the middle of the grid, and the paper around them turns to night with them.

**Unlike the last film in this workspace** (the 43 s "Twelve cities, drawn alive"): no build-from-blank opening, no
taped paper labels, no write-on captions, no Polaroid desk, no index card, no ghost fade, no cream end card. This one
starts on a finished city, its captions glow, its middle is night, and it ends on dark paper.

## Picture rules

- **Frame:** 1080×1080, 30 fps. City frames are the pages' own 1920×1080 drawing, cropped to the middle 1080 square at
  1:1 (no scaling). Keep words above y = 970 (X's player bar) and inside 48 px of the sides.
- **Colour:** day paper `#F0EEE4`, night paper `rgb(27,31,51)` (the engine's `NIGHT.paper`), ink `#2C271C`, pale ink
  `#ECE5D5` with a dark halo `#181C2E` (the guide's night style), lamplight `#FFC979`, Looseleaf marker `#DF6B3C`.
- **Type:** Looseleaf `Lettering` (Kevin Sans Script, bold, a riso offset) for the title and city names: 92–120 px;
  the hand (Kevin Sans Hand) for the one line of words: 44–48 px; IBM Plex Mono 500 for the address: 32 px. The keycap
  is `Kbd` drawn at 3.4×. No more than one sentence on screen at a time.
- **Motion:** captions glow on (opacity 0→1 over 0.35 s with a warm bloom that settles); the keycap goes down 6 px in
  0.08 s and comes back in 0.2 s. Cuts land on beats (96 BPM: a beat is 0.625 s). Cameras are still: the light moves.
  Not used: crossfades between cities, zooms, blur, shakes, particles of the film's own.

## Shot list (seconds; 96 BPM, a beat 0.625 s, a bar 2.5 s; exact sound times are in plan.json, written by audio/cues.py)

| # | Time | Shot | What we see | Words | Sound |
|---|---|---|---|---|---|
| 1 | 0.0–7.5 | switch | Frames 0–9: the finished night (poster). Then Tokyo by day at a mid view, the tower whole at the upper right, the words on open paper at the upper left. At 1.875 the keycap N is pressed; the words turn pale with a dark halo in 0.3 s (while the paper is still light, so they never sink into the grey); the day fades over a second and the lamps come on in a wave from the middle, the tower turns orange, motes rise. Held to 7.5 | **Press N** (ink, then pale) · *and the city / turns to night.* (two lines, glows on at 3.75) | Day: a felt-piano chord. The key click, a soft drop, then a glockenspiel note per step of the wave and the night pad; a shimmer under the second line |
| 2 | 7.5–10.0 | tokyo | Tokyo, the Sumida bank: yozakura under lanterns, the river's lights, motes | **Tokyo** · *each city lit the way it is lit today* (glows on at 7.95) | The pulse starts: soft kick, shaker, bass; a light pluck on the cut |
| 3 | 10.0–11.25 | paris | The Eiffel Tower in gold, its beacon turning | **Paris** | Pluck on the cut |
| 4 | 11.25–12.5 | venice | San Marco, the campanile, lamps doubled in the water | **Venice** | Pluck |
| 5 | 12.5–13.75 | newyork | Times Square's screens | **New York** | Pluck |
| 6 | 13.75–15.0 | london | Westminster floodlit, Big Ben's dials, the Eye | **London** | Pluck |
| 7 | 15.0–16.25 | chongqing | Hongyadong gold from top to bottom | **Chongqing** | Pluck |
| 8 | 16.25–17.5 | hongkong | Central: the harbour, the Bank of China's lines, a Christmas tree | **Hong Kong** | Pluck |
| 9 | 17.5–18.75 | istanbul | The Galata Tower over the Golden Horn | **Istanbul** | Pluck |
| 10 | 18.75–20.0 | rio | The Sambadrome under its floodlights | **Rio de Janeiro** | Pluck |
| 11 | 20.0–21.25 | beijing | Tiananmen floodlit, its lanterns | **Beijing** | Pluck |
| 12 | 21.25–22.5 | barcelona | Montjuïc: the Magic Fountain and the Palau | **Barcelona** | Pluck |
| 13 | 22.5–23.75 | lisbon | The Santo António street party under its strings of lights | **Lisbon** | Pluck |
| 14 | 23.75–27.5 | grid | Twelve cities by day on one sheet of cream paper (each tile drawn without its paper); the keycap pressed at 24.375; the cities turn to night in a ring from the middle of the grid, and the paper turns in the same ring out to the edges of the frame | **Twelve cities. One key.** (glows on at 25.625, once the ring has reached the top) | The pulse stops; the key click; a rising glockenspiel run with the wave; the pad opens |
| 15 | 27.5–30.0 | end | The twelve dim; the end card on night paper | **inkcity Atlas** · *press* N *for night* · leehongji.github.io/inkcity-atlas | A shimmer; the last chord rings out |
