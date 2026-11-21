# Barcelona — brief

Season: late September, the week of La Mercè (the city's festival). Warm, low golden light; people in T-shirts out
late; senyeres (the yellow-and-red Catalan flag) hang from balconies and strings of festival pennants cross the old
lanes. The plane trees are still full and green, a few just yellowing.

**Orientation.** North is up the screen. +x runs south-east (towards the sea), +y south-west. The Eixample grid is
rotated 45° to north in reality, so the map's grid axes are the city's own: streets along x run "mar-muntanya" (from
the hills down to the sea), streets along y run parallel to the coast. The sea lies along the lower-right edge.

**Street fingerprint: the Eixample grid of Ildefons Cerdà.** Every block (illa) has its four corners cut off at 45° —
the *xamfrà* — so each crossing of the grid opens into a small octagonal plaza. Every tile on the map is an octagonal
block; the streets tile draws the 20 m streets with 5 m pavements that follow the chamfers, so all sixteen crossings
are octagons seen from above. The chamfers are where the street life sits: rows of parked motorbikes, the coloured
recycling containers, Bicing docks, a kiosk, a bench, plane trees. One-way streets alternate direction, with a bus
lane on the right and a cycle lane on the left. Traffic drives on the right: black-and-yellow taxis, red TMB buses,
the open-top tourist bus, scooters, Bicing riders, white delivery vans. Grey "flower" panot paving on the pavements,
Gaudí's blue hexagonal panot and Falqués's trencadís bench-lamps on Passeig de Gràcia. On the blocks: sand-coloured
stone, green louvred shutters, curved wrought-iron balconies with senyeres, roof terraces with laundry and water tanks.

**Clever moment: castellers in Plaça Sant Jaume** (tile `gotic`, three shots). A colla in red shirts, white trousers
and black sashes walks in from the edge of the square and packs into the *pinya* round the base (inner ring arms up
on the backs in front). Then the tower rises tier by tier on a timetable: segons, terços, quarts (three per tier on
each other's shoulders), the two *dosos*, the *acotxador*, and last the child *enxaneta* climbs over the top and
raises a hand (the *aleta*) — the crowd cheers, phones go up — and the tower unwinds from the top down while the
gralla players and the drum play on. The 30 s cycle is phased so the segons start climbing as the `gotic` cut
lands; a close-up (`aleta`, z 8.4) catches the enxaneta's raised hand; a wider shot (`castell`) sees the tower come
down and the pinya break up.

**Second, smaller moment:** the cranes of the Sagrada Família slew and lift stone blocks onto the unfinished towers of
the Glory façade (a continuous cycle, not timed to the shot).

## Layout (100 u grid, octagonal tiles half 37, chamfer 10; screen: top = north = far)

| pos | tile | what | height |
|---|---|---|---|
| (−100,−100) top | `parkguell` | Park Güell: the two gingerbread lodges at the gate, the dragon stair with El Drac, the Hypostyle Hall's Doric columns holding up the sand terrace, the serpentine trencadís bench round its edge, tourists photographing, a guitarist under the colonnade | lodge tower 16, terrace 7 |
| (0,−100) upper right | `sagrada` | the Sagrada Família on its own Eixample block: Passion façade (faces us, +y) with four bell towers, Nativity towers behind, the Jesus tower (tallest, cross), Mary's star tower, the evangelists, the unfinished Glory façade (+x) with two tower cranes lifting stone, the tourist queue, a school group | 70 |
| (100,−100) right | `barceloneta` | Barceloneta: narrow four-storey fishermen's blocks with laundry, Passeig Marítim with a chiringuito, the beach — sunbathers, a volleyball game, umbrellas, a lifeguard chair, L'Estel Ferit (four stacked rusty cubes), beer sellers; swimmers and a paddle board in the sea | 16 |
| (−100,0) upper left | `gracia` | Vila de Gràcia: low houses and narrow lanes with festival pennants, Plaça de la Vila with its clock tower, terraces on Plaça del Sol, kids playing football, a guitar circle, Casa Vicens's green-and-white tiles at the corner | tower 24 |
| (0,0) centre | `passeig` | an Eixample block on Passeig de Gràcia: Casa Batlló (bone balconies, scaly dragon roof, trencadís), Casa Amatller's stepped gable, and La Pedrera's wavy stone wrapping the near chamfer (warrior chimneys on the roof); the other sides ordinary modernista houses with shops (FARMÀCIA, FORN, …); roof terraces with laundry and people | 22–26 |
| (100,0) lower right | `gotic` | Barri Gòtic: Plaça Sant Jaume between the Palau de la Generalitat and the Ajuntament (senyeres on the balconies, officials watching) — the castellers; the Cathedral's spire at the far corner; the Pont del Bisbe over a lane; bunting | spire 38 |
| (−100,100) left | `montjuic` | Montjuïc from Plaça d'Espanya: the Palau Nacional on its hill (central dome, four towers), the cascades and stairs, the Magic Fountain dancing in colour, the crowd watching, the two Venetian towers at the near end | dome 30 |
| (0,100) lower left | `rambla` | La Rambla running along x: the central promenade under plane trees, flower kiosks, a human statue, Miró's mosaic on the pavement, the Liceu, La Boqueria's iron-and-glass arch with fruit stalls and hanging jamón inside; the gegants (giants) dance down the promenade with their band | 16 |
| (100,100) bottom | `port` | Port Vell: the Columbus column at the foot of the Rambla pointing out to sea, the quay with palms, the wavy Rambla de Mar footbridge that swings open to let a golondrina through, sailboats, the cable car tower | column 52 |

Satellites (paint blobs off the grid): `tibidabo` top-left (the Sagrat Cor temple with its statue, the funfair
Ferris wheel turning and the red aeroplane ride), `glories` upper-right (Torre Glòries, the bullet tower),
`campnou` lower-left (Camp Nou with a match on).

The sea (in the streets tile, x > 147) runs the whole lower-right edge: a promenade with palms at x 137–147, then the
water with sailboats, a golondrina and a ferry. Streets along x end at the promenade.

## Depth plan
- Streets tile order −99, places by (cx + cy)/100, far satellites order −3, the near one 3.
- Eixample buildings are convex prisms on polygons (chamfered corners); a building's footprint box is its bounding box.
  Long perimeter wings are split into pieces (things stand in front of and beside them).
- Street trees, lamps and chamfer furniture are planted by the place they stand next to (at local ±41) so they sort
  with its buildings, and only where they stand behind the traffic: trees on a place's near sides (the far pavements
  of the streets in front of it), the lamp and furniture on its near corner (the far corner of that crossing), low bins
  and motorbikes on the side corners. A tree in front of a lane only overlaps some of the cars side by side, and that
  drew a scooter in the far lane over a van in the near one; nothing stands between lanes.
- Vehicles: one-way lanes on a common 30 s period; `tools/search_traffic.mjs` searched the phases so no two vehicles
  on crossing streets ever overlap (`node tools/search_traffic.mjs --check` prints 0 conflicts).
- Castellers: the tower is one actor per tier anchored at the tower's centre with increasing bias (lower tiers first);
  the pinya and the crowd are actors / cast round it, so the pinya in front covers the base.
- Park Güell's terrace and Montjuïc's hill are objects with walls; people on them are actors or cast `on` at their
  height.

## Film (30 fps)
build 0 → parkguell 200 → sagrada 300 → barceloneta 400 → port 500 → rambla 600 → boqueria 700 (z 9) → montjuic 800
→ gracia 900 → passeig 1000 → gotic 1100 (the castellers rise; the shot is named after the tile so a click on it lands there) → aleta 1292 (z 8.4) → castell 1388 → wide 1508,
fade 1645, hold 1668. `autoplay: false`.
