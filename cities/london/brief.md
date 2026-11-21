# London — brief

Weather: a bright day just after rain. Wet pavements with puddles that hold the sky, a sheen on the roads, a few
umbrellas still up, the grass very green. Low tide: the Thames shows its mud foreshore under the embankment walls.

Compass: east = +x (lower right on screen), north = −y (upper right). The camera looks north-west from the south-east.

**Street fingerprint:** the Thames. It runs straight across the map between granite embankment walls (y 30..70, water
4.5 u below the streets), the whole map is cut through by it like a trench in a diorama, and its low-tide channel
wanders between mud and shingle beaches inside the walls. River buses, a tug with rubbish barges, a police launch and a
red-sailed Thames barge use it; HMS Belfast is moored below Tower Bridge. Two bridges carry the two north-south streets
over it, and each looks like itself: Westminster Bridge (green, low granite arches, lamps) and Tower Bridge (Gothic
towers, blue suspension chains, bascules, high walkways). Streets: left-hand traffic, red double-deckers, black cabs,
Santander bikes, double yellow lines, red bus lanes, zebra crossings with Belisha beacons, red phone boxes, pillar
boxes, the Tube roundel at station entrances, plane trees, pubs with hanging baskets and drinkers standing outside.

Geography is compressed: the river is straightened (in reality it bends north at Westminster), and the 3 km between
Westminster Bridge and Tower Bridge is one tile wide. Order along the river (west to east) and which bank things are
on are right.

**Clever moments:**
1. **Tower Bridge lifts** (its own long shot). The barriers drop and the traffic on both approaches queues; the
   bascules rise; a three-masted tall ship comes up the river from the east and glides through the gap under the high
   walkways; the bascules come down; the queued buses and cabs move off. The ship turns in the Pool of London in front
   of the Tower and leaves again through a second lift later in the 90 s cycle. The cycle is phased so the first lift
   starts as the shot cuts in.
2. **Changing of the Guard** at Buckingham Palace (its own shot): the New Guard marches in behind its band
   (bearskins, red tunics) while the crowd presses against the railings.

## Layout (100 u grid, tiles half 37; screen: top = far)

| pos | tile | what | height |
|---|---|---|---|
| (−100,−100) top | `palace` | Buckingham Palace's east front, the Victoria Memorial, the Mall, St James's Park lake with pelicans and deckchairs; the guard | palace 13, memorial 16 |
| (0,−100) upper-right | `trafalgar` | Nelson's Column and the four lions, two fountains, the National Gallery portico, St Martin-in-the-Fields, Admiralty Arch, the fourth plinth | column 40 |
| (100,−100) right | `city` | the Gherkin, the Walkie-Talkie, the Cheesegrater behind St Paul's dome; bankers, a cab rank | towers 34–46 |
| (−100,0) upper-left | `westminster` | the Palace of Westminster on the river, Elizabeth Tower by the bridge, the Abbey, Parliament Square, protesters, a bobby | tower 34 |
| (0,0) centre | `tower` | the Tower of London: White Tower, walls and towers, the moat lawn, Traitors' Gate, Beefeaters, ravens, Tower Beach | keep 16 |
| (100,0) lower-right | `katharine` | St Katharine Docks: a basin of yachts, a Thames barge, the Dickens Inn with its balconies and drinkers, Ivory House | 10–14 |
| (−100,100) left | `battersea` | Battersea Power Station with its four white chimneys (a glass lift up one), the riverside, a terrace street, a floating pig | chimneys 30 |
| (0,100) lower-left | `southbank` | the London Eye turning, Jubilee Gardens, the carousel, the Southbank Centre undercroft with skaters, book stalls, a bubble man | Eye 42 |
| (100,100) bottom | `borough` | the Shard, Borough Market under a railway viaduct with a train, food stalls, a pub with drinkers outside | Shard 72 |

Bridges are their own small shared tiles: `wbridge` (−50,50), `tbridge` (50,50). The river is drawn inside the
`streets` tile (src/tiles/thames.js defines it, streets.js calls it): only one map-wide tile, so the bakes stay
within budget.

Satellites (paint blobs off the grid): `windsor` west (upper left: the Round Tower over the Thames), `greenwich` east
(lower right: Cutty Sark, the Observatory on its hill with the time ball, the meridian line), `wembley` north (upper
right: the stadium and its arch), `stonehenge` south-west (lower left).

## Depth plan
- Tile order: north-bank tiles (default order ≤ 1), then the bridges (1.5, 1.6), then the south-bank tiles (2.0–2.2);
  far satellites −3, near ones 3. Boats are actors in the streets tile; the north bank's parapets are objects in the
  north tiles. River lanes keep every hull north of y 60.2, the line where the south bank's edge starts to hide the
  water, so no boat ever has to be covered by ground.
- Bridge decks are objects with `under: 0` (boats under, cars on). Tower Bridge: towers `under: 11.8` (cars, and a
  glimpse of the ship and the raised bascules, through the tall arches), two walkways `under: 18.5`; the bascules are
  actors whose anchor moves with their state (down: far end of the span, sorted under every car; up: north leaf just
  inside the far walkway, before the ship; south leaf inside the south tower's footprint, after the ship). Boats are
  built from primitives along their length and drawn as 2–4 part actors each anchored at its own centre
  (LK.boatActors), so a long hull slides under a bridge piece by piece.
- Crowds are one cast object per person wherever something stands between them (market stalls, the Memorial).

## Timetables (src/37_timetable.js, checked by tools/check.js)
- Tower Bridge cycle 100 s. Lift 1: barriers 18.0 s, bascules up 19–21.5, the ship (8.5 u/s) passes 21.6–26.6, down
  26.9–29.4, green 29.9. The ship slows to a stop off the Tower, pivots 180° (bow through south) and leaves through
  lift 2 (barriers 53.2, green 65.1). The cycle clock is phased so the film's `tbridge` shot opens 0.6 s before lift 1.
- Roads (left-hand traffic): free lanes 25 s laps, three vehicles each; Tower Bridge lanes ten vehicles per cycle with
  queues; lanes narrow onto the bridge (offset 8 → 4.2). `node tools/check.js` → 0 overlapping samples.
- Changing of the Guard: 60 s cycle (two groups alternate, identical uniforms), phased so the band and the New Guard
  are marching up Spur Road as the `palace` shot opens.

## Film (30 fps)
build 0 → westminster 200 → palace 300 (the guard, 170 frames) → trafalgar 470 → city 570 → katharine 670 →
borough 770 → pub close-up 870 (z 9) → southbank 970 → battersea 1070 → tower 1170 → tbridge 1270 (430 frames: the
whole lift) → centre 1700 → wide 1810, fade 1941, hold 1964. Opens in explore (`autoplay: false`).
