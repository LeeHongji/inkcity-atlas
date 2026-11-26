# inkcity Atlas: "Tokyo, redrawn" (for X)

## Brief

- **What it sells:** the rebuilt Tokyo (published 2026-11-25 in `main@42b1a1a`). Its landmarks are rebuilt from the
  real buildings and stand tall. Its signs are real Japanese, drawn in a finer pen. Its people are all doing something
  with each other. It has four seasons.
- **Scope:** the Tokyo page (`cities/tokyo/index.html`) in a desktop browser, by day. The guide, the night and the
  phone layout are not shown; the night has its own film ("Press N").
- **Format:** X, square 1080×1080, 30 fps, 30 s (under a minute, so X loops it in the feed).
  - English only, few words, in the Looseleaf hand. This is the user's standing preference: minimal English captions
    in the product's hand-drawn type, smooth sounds, no grit.
  - The end card carries the site's address.
- **Claims and their sources:**
  - The camera can go from a crowd at the Shibuya scramble to the whole city and stay sharp: the page redraws at every
    zoom (`engine/90_app.js`); the scramble's signal cycle is `cities/tokyo/src/tiles/shibuya.js`.
  - "Taller", landmarks rebuilt from the real buildings: `cities/tokyo/src/tiles/tower.js`, `station.js`, `sensoji.js`.
  - "Finer", real Japanese on every sign in a finer pen:
    - the stroke table `cities/tokyo/src/37_kana.js`;
    - the signs in `tiles/tsukiji.js` and `tiles/akiba.js`;
    - `SCENE.ink` in `src/35_scene.js`.
  - "Alive", everyone doing something together:
    - `cities/tokyo/src/38_life.js` and `engine/25_life.js`;
    - the scenes in `tiles/satellites.js` (sumo, the Odaiba beach), `tiles/sensoji.js` (incense), `tiles/akiba.js`
      (cosplay), `tiles/meiji.js` (the wedding).
  - "All year": the season switch (key S, `?season=`), and the wipe the page draws (`engine/90_app.js`, `drawWipe`).
  - The scope of the whole rebuild: commit message of 42b1a1a.
- **Where every picture comes from:** the real Tokyo page in `?f=0` mode, drawing any frame at any camera
  (`SF.seek(n, cam)`), in four hidden iframes, one per season (`?season=`). The season wipe is the page's own
  `drawWipe`, recomposed frame by frame from two seasons. The captions, the seal and the end card are the film's own.

## Product character

- **What the new Tokyo is:** a dense, colourful, busy city on warm paper, drawn by hand, where the closer you look the
  more you find: the tower's lattice, a sushi shop's sign, a wrestler's stance, a bride under a red parasol. It should
  feel like a bright Saturday in Tokyo: lively, not frantic.
- **What the product already owns that the film can use:**
  1. The Shibuya scramble at the middle of the map: every 21 s the green man comes on and the crowds cross at once.
  2. Zoom to ×10, redrawn at every zoom: a camera can go from the whole map to a single sign and stay sharp.
  3. Real Japanese drawn from a stroke table: a hanko, a seal cut with a name, is Tokyo's own mark.
  4. One key, S, for the next season, brushed on with a ragged diagonal wipe.
  5. The tour's grammar: hard cuts between close-ups full of small life.

## Three directions

| Direction | Ground and light | Type | Camera | Rhythm | Music |
|---|---|---|---|---|---|
| **A. "Tokyo, redrawn" (chosen)** | Warm paper by day; the year turns once at the end | One word stamped on per idea (Taller. Finer. Alive. All year.), a red 東京 seal | Real camera moves: a pull-back from the scramble, a dive into the tower, slow pushes, a pull-back in the snow | Pull-back, dive, then cuts on the beat, the four seasons, the pull-back | City pop at 100 BPM: electric piano, round bass, a light kit, a soft synth lead |
| B. "A day in Tokyo" | Morning to evening light | Times of day as captions | Still cameras | Even, one district each | Ambient |
| C. "Before / after" | Split screen of the old and the new Tokyo | Labels "before" and "after" | Still | Fast A/B cuts | Electronic |

**Why A:**
- A shows the four improvements one idea at a time, each with the picture that proves it. It is built from what only
  this page has: the scramble at its centre, the zoom that stays sharp, the hanko, the season key.
- B has no day-night clock to show: the night is a separate look, already filmed.
- C sells the old Tokyo as much as the new, and shows it at its worst.

## Devices taken from the product ("because it has X, the film uses Y")

1. **Because the Shibuya scramble sits at the very middle of the map, the film opens on it and pulls straight back.**
   It starts on the page's own Shibuya shot as the green man comes on: the crowds step out on the crossing call, the
   title is stamped on, and the camera pulls back (1.2–4.2 s) until all of Tokyo is on its paper. It ends the same way
   in the snow: back from the Sumida to the whole white city, the end card in the paper above it.
2. **Because the page redraws at every zoom, the camera moves for real.**
   - It pulls back from the scramble to the whole map, then dives from the whole map into Tokyo Tower in 2.4 s (log
     zoom, eased). Every frame is the page drawing at that zoom, so the lattice sharpens as it comes closer.
   - The close-ups push in slowly (about 6%).
   - The end pulls back out to the whole map.
3. **Because Tokyo's signs are real Japanese and its notes carry red seals, the words are stamped on like a hanko.**
   - Each big word lands from a little above and larger in 0.11 s, with a soft wooden thock.
   - The title and the end card carry a red seal of 東京, cut from the city's own stroke table (`37_kana.js`).
4. **Because a season is one key and a wipe, the year turns on one place.**
   - The Sumida bank is brushed from spring to summer, autumn and winter by the page's own wipe, every 1.8 s.
   - The season's name is stamped under "All year." as the brush passes half way.
5. **Because the tour cuts between close-ups of life, the middle is hard cuts on the beat.** Five scenes of people
   doing things together, 1.2 s each.

**Unlike the last films in this workspace:**
- "The city comes folded" (`film-unfold/`, 2026-11-24) was the folded paper map unfolding. This film does not use the
  unfold at all: it opens on a crowd and pulls back, and its end card lies on the paper, not on a map's cover.
- "Press N" (the night): no keycap, no glowing captions, no names in the corner, no grid of twelve, no dark end card,
  no still cameras.

This one is daylight from start to end, moves its camera, stamps its words and ends on paper.

## Picture rules

- **Frame:** 1080×1080, 30 fps. City frames are the page's own 1920×1080 drawing, cropped to the middle 1080 square at
  1:1 (no scaling). Keep words above y = 970 (X's player bar) and inside 48 px of the sides.
- **Colour:**
  - paper `#F0EEE4`;
  - ink `#2C271C` on a paper halo `rgba(240,238,228,0.96)`;
  - seal vermilion `#C8352B` with the characters in `#F6F1E4`;
  - Looseleaf riso offset `tomato`.
- **Type:**
  - Looseleaf `Lettering` (Kevin Sans Script, bold, riso offset) for the big words: 112 px, the end card's "Tokyo" 150 px;
  - Kevin Sans Hand bold for the short lines: 46 px;
  - IBM Plex Mono 500 for the address: 32 px.

  No more than one big word and one line on screen at a time.
- **Motion:**
  - Words are stamped on (scale 1.14 → 1, y −6 → 0, 0.11 s, power3.in, a 1.5% give), or gone on a cut. The title lifts
    away (0.25 s).
  - Camera moves ease in and out (cubic). Pushes are linear and slow.
  - Cuts land on beats (100 BPM: a beat is 0.6 s).
  - Not used: crossfades between scenes, blur, shakes, particles of the film's own.

## Shot list (seconds; 100 BPM, a beat 0.6 s, a bar 2.4 s; exact sound times are in plan.json, written by audio/cues.py)

| # | Time | Shot | What we see | Words | Sound |
|---|---|---|---|---|---|
| 1 | 0.0–4.8 | open | The Shibuya scramble close up (the first frame is the full crossing, people waiting at the corners); the green man at 0.3 and the crowds step out; the camera pulls back (1.2–4.2) to the whole city on its paper | **Tokyo, redrawn.** + 東京 seal (stamped at 0.8 / 1.1) | Electric-piano chords, no drums. The crossing's cuckoo call, fainter as the camera rises; a thock for each stamp; a long falling whoosh |
| 2 | 4.8–7.2 | dive | From the whole map into Tokyo Tower, still running on the page's clock | **Taller.** · *landmarks drawn from the real buildings* (5.7 / 6.0) | The groove comes in on the downbeat; a soft rising whoosh |
| 3 | 7.2–8.4 | station | Tokyo Station's brick front and domes, a slow push | (same) | A wooden tick on the cut |
| 4 | 8.4–9.6 | sensoji | The pagoda, the hall and the Thunder Gate | (same) | Tick |
| 5 | 9.6–10.8 | tsukiji | Tsukiji's row of shop signs: 魚 寿司 牛丼 酒 | **Finer.** · *real Japanese on every sign* | Thock |
| 6 | 10.8–12.0 | signs | Akihabara's sign towers: ゲーム アニメ ホビー 電気 | (same) | Tick |
| 7 | 12.0–13.2 | sumo | A bout at Ryōgoku, the crowd round the ring | **Alive.** · *everyone is doing something* | Thock; the lead takes the hook |
| 8 | 13.2–14.4 | incense | Sensō-ji's incense burner: wafting the smoke, praying | (same) | Tick |
| 9 | 14.4–15.6 | cosplay | Cosplayers posing in Akihabara's street, photographers round them | (same) | Tick |
| 10 | 15.6–16.8 | wedding | A Shinto wedding at Meiji Jingū, the bride under the red parasol | (same) | Tick |
| 11 | 16.8–18.0 | beach | Odaiba's beach: catch, a dog walk, children chasing | (same) | Tick |
| 12 | 18.0–24.6 | seasons | The Sumida bank: spring, wiped to summer (18.6), autumn (20.4), winter (22.2) | **All year.** · *spring / summer / autumn / winter* | Thock; a brush swish per wipe; the hook again |
| 13 | 24.6–26.4 | close | Back from the snowy Sumida to the whole city in the snow, a little smaller and lower | — | The groove stops on a last hit; a falling whoosh |
| 14 | 26.4–30.0 | end | The whole white city, still alive; the end card in the paper above it | **Tokyo** + seal · *an inkcity Atlas city* · leehongji.github.io/inkcity-atlas | Thocks; bells; the last chord (D major 9) rings out |
