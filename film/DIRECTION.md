# inkcity Atlas: promo film direction

## Brief

- **What it sells:** inkcity Atlas, twelve hand-inked isometric cities that draw themselves and then let you explore. Each city is one offline HTML page with a handwritten guidebook. The film also sells the inkcity skill that made them, which is open source.
- **Scope:** the whole Atlas as published on 2026-11-21 (`main` at 198f611), desktop browser. The phone layout of the guide is real, but the film does not show it.
- **Format:** 16:9, 1920×1080, 30 fps (the engine's own frame clock), 43.2 s. English only, in the Looseleaf hand: lettered names and a few words each (the user asked for less text, no Chinese, 2026-11-21). Links are allowed: the film ends on the site address and the repository.
- **Claims the film makes, and where each comes from:**
  - "Twelve cities, drawn alive": the twelve folders in `cities/`, and `README.md`.
  - "Each one draws itself: pen lines, then colour, then people": `engine/80_render.js`, the build (`initCons`).
  - Each city's moment: the city table in `README.md`, and each city's `src/35_scene.js`.
  - "Every place has a story": the guide overlay, `gallery-src/src/guide/Guide.tsx`, with Beijing's words from `cities/beijing/src/guide.js`.
  - "One offline HTML page each": `README.md` line 5 and the built `cities/*/index.html`.
  - "Draw your own city / open source": `skill/inkcity/SKILL.md` and `LICENSE` (MIT).
- **Where every picture comes from:** the city frames are drawn by the real pages in `?f=0` mode through `SF.seek(n, cam)`, the same call the skill's `record.mjs` uses. The guide shot is the real Beijing page with its real overlay, clicked by a script and captured on a controlled clock (`tools/capture-guide.mjs`). The desk, Polaroids, tape, highlights and cards are the gallery's own Looseleaf components, imported from `gallery-src/src`. The twelve photos on the desk are drawn by the twelve pages the same way, one at a time and ahead of time (`tools/capture-twelve.mjs`), because twelve live engines in one tab crashed the render.

## Product character

- **What it is and how it feels:** a quiet, warm sketchbook. You watch a city appear from pen lines, then spend a while finding small lives in it. Nothing in it is loud.
- **Design language:**
  - Paper is `#F0EEE4`. Ink is `#2C271C`, with softer `#5E574A` and `#8C8576` (`engine/00_core.js`).
  - The guide's pen is red `#c8553d` (`Guide.tsx`), and the gallery desk is teal `#a8c8bb` (`looseleaf.css`).
  - The type is Kevin Sans, the Looseleaf hand (extended with ā ō ğ ş and more), with IBM Plex Mono for small labels.
  - Shading is flat broken colour, with hand-drawn lines that "boil".
- **Motifs the product already owns:**
  1. The build: construction lines sweep across the paper, then ragged colour dabs fill them, then people and cars pop in.
  2. Hard cuts between close-ups: the engine's own tour cuts, never fades.
  3. Handwritten margin notes with short curved pen arrows, and the red pen loop round a detail.
  4. The glide: the guide eases the camera from place to place.
  5. The gallery desk: taped Polaroids, each numbered "No. 01" and so on.
  6. The ghost fade: the tour ends by fading the city to a pale ghost.

## Three directions

| Direction | Ground and light | Type | Motif source | Camera | Rhythm | Music |
|---|---|---|---|---|---|---|
| **A. "A city draws itself" (chosen)** | Warm paper and ink, all daylight | Looseleaf lettering and the Kevin Sans hand, written on with a pen | The build and the guide's pen marks | The engine's own cameras: hard cuts, one glide, no fake 3D | Light and playful, 100 BPM | Plucked strings, marimba and felt piano, with pen and paper sounds |
| B. "The desk" | Teal desk, Polaroids | Looseleaf captions | The gallery page | One continuous move across the desk, pushing into each photo | Calm, editorial | Solo piano |
| C. "Twelve moments" | Full-bleed cities | Big counter numbers | The clever moments | Rapid montage, 12 cuts | Trailer-tight | Percussion |

**Why A:** the one thing nobody has seen before is a city drawing itself, and then living. A shows that, in the product's own grammar.
- **B** hides the cities behind a photo-in-a-photo for most of the film. It survives as a single beat, the twelve Polaroids.
- **C** loses the drawing. It is also too close to the last film in this workspace (Last Light Arcade: a trailer-paced montage of moments).

## Devices taken from the product ("because it has X, the film uses Y")

1. **Because every city draws itself (scaffold, then colour, then people), the film's opening and two of its cuts are the engine's real build, drawn at that shot's camera.** These are real build frames from `SF.seek`, sped up about 1.5 to 3 times; no wipe is faked over a finished picture.
2. **Because the engine's tour hard-cuts between close-ups, the moments are hard cuts on the beat.** There are no crossfades between cities. The build-ins replace a cut only twice, never back to back.
3. **Because the guide speaks in handwritten notes, the film's captions are handwritten.** Each one is revealed left to right at writing speed (a clip mask), names in the library's riso lettering and notes in the hand. The pen arrow draws with the same curve as `arrowPath` in `Guide.tsx`.
4. **Because the guide circles details in red pen, the guide beat ends on the real red loop round a family at their dumplings in a hutong courtyard.**
5. **Because every frame of a city is a pure function of its number, twelve engines can be stopped on the same frame.** The twelve Polaroids on the desk all draw their cities at the same moment.

**What differs from the previous film in this workspace (Last Light Arcade):**
- That film used a Bayer dissolve, a stepped caption box at the bottom left, title cards per section, a synthwave score and an end on the home page grid. None of those are used here.
- This film is light paper, not dusk. Its captions are written on, not stepped. Its transitions are the build and hard cuts. Its score is acoustic-feeling plucks. It ends on the skill's own town fading to a ghost under the address.

## Picture rules

- **Frame:** 1920×1080 at 30 fps; city frames are 1:1 engine frames. Ground is paper `#F0EEE4` (cities) and desk `#a8c8bb` (the twelve). Keep text above y = 940, the bottom 13 %.
- **Type:** English only, from the UI library's own hand.
  - Titles and names use Looseleaf `Lettering`: Kevin Sans Script, bold, a slight letter wobble (`Handwritten`), and a riso offset in one colour per city. The opening and end title is 156–168 px in marker orange; section titles are 96–104 px; the city name on a label is 84 px.
  - Notes are the hand (Kevin Sans Hand), 32–54 px, ink or ink2, a few words at most.
  - The prompt and links are in IBM Plex Mono 500, 28–40 px. The address carries the gallery's yellow Highlight.
- **Scale of the interface:** the guide shot is the real page at 1:1 at 1920×1080. Its story text is 15–16 px CSS, so the shot pushes the panel in: the clip is scaled 1.25× around the guidebook for the reading beat, which gives about 20 px. The headline carries the meaning; the panel is texture you can pause to read. The engine drawings are at native scale.
- **Captions on close-ups:** a taped paper label (Looseleaf Paper + Tape), bottom-left at x 72, bottom 150, rotated −1°. It holds the city's lettered name and a few words. It stays put through the montage; only its words change on each cut.
- **Motion:**
  - Eases are `power2.out` and `power3.inOut` for the glide. Nothing bounces.
  - Every cut lands on a beat (0.6 s at 100 BPM).
  - The camera moves only where the product moves it (the guide's glide). Close-ups otherwise hold still and let the city move.
  - Not used: blur transitions, crossfades between cities, particles, glow, zoom-punches, rotating 3D.

## Shot list (seconds; 100 BPM, a beat is 0.6 s, a bar 2.4 s; exact sound times are in plan.json, written by audio/cues.py)

| # | Time | Shot | Focal element | Picture and action | Copy | Sound |
|---|---|---|---|---|---|---|
| 1 | 0.0–4.8 | open | Tokyo drawing itself | The finished poster frame for 0.3 s, then Tokyo builds from blank paper (build frames 0–175 at ≈1.4×). The title is lettered on from 0.9 s | **inkcity Atlas** · twelve cities, *drawn alive.* | A soft sketching bed under the lines; one smooth pen glide per line of title; felt piano, then marimba from 2.4 s |
| 2 | 4.8–7.8 | tokyo | The Shibuya scramble | Hard cut to the shibuya camera; the crowd steps out from all four corners (frames 1140→1230) | **Tokyo** · the scramble crossing | The label is pressed down; a pen glide; the groove starts |
| 3 | 7.8–10.2 | paris | Cars round the Arc | Hard cut; cars pour into the Étoile (1128→1200) | **Paris** · round the Arc, never touching | Pen glide; a new chord on the cut |
| 4 | 10.2–13.2 | london | Tower Bridge lifting | Hard cut; the bascules rise and the tall ship slides through (1296→1440) | **London** · Tower Bridge lifts | Pen glide |
| 5 | 13.2–15.6 | venice | Acqua alta | Hard cut; water spreads over San Marco (1185→1290) | **Venice** · acqua alta | Pen glide |
| 6 | 15.6–18.6 | barcelona | The human tower | **Build-in:** the plaza draws itself at the moment camera (0.9 s), then the castellers stack up (1180→1290) | **Barcelona** · a human tower | Sketching bed on the build; pen glide |
| 7 | 18.6–21.0 | chongqing | Monorail through a tower | Hard cut; the train runs through the residential block (430→550) | **Chongqing** · through the building | Pen glide |
| 8 | 21.0–29.4 | guide | Beijing's guidebook | The real page at 1280×720 CSS px ×1.5: the build ends, the overlay fades in and glides home, notes appear. Click "The Hutongs" (24.2): glide in, story. The panel scrolls; click the dumplings (26.4): glide closer, red loop (27.2) | **Every place has a story.** · open one, and the map takes you there | Piano and bass only; soft clicks; a pen glide for the label; the red loop's one stroke |
| 9 | 29.4–34.2 | twelve | Twelve living Polaroids | Teal desk; twelve taped Polaroids land on sixteenth notes (29.7–31.35), each drawing its city at the same moment | **Twelve cities.** · each one a single page that works offline | Twelve card taps, each paired with a rising glockenspiel note; full groove |
| 10 | 34.2–39.0 | skill | A town from a sentence | Left: an index card, a prompt typed into it. Right: the skill's starter town draws itself, with a pen arrow to it | **Draw your own city.** · › Draw my home town as a living hand-inked map. | Typing; sketching bed on the build; the bass walks up |
| 11 | 39.0–43.2 | end | The address | The town fades to a ghost (the engine's own fade); the end card is lettered on | **inkcity Atlas** · leehongji.github.io/inkcity-atlas · github.com/LeeHongji/inkcity-atlas · open source, MIT | Final F major chord at 39.0, ringing out to 43.2 |
