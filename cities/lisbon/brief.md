# Lisbon — brief

Season: June, the Santo António festival. Jacarandas in purple bloom, paper garlands strung across the alleys, basil
pots (manjericos) with paper carnations on the sills, sardines grilling on street braziers, summer clothes, a clear day.

**Compass.** East = +x (lower right on screen), north = −y (upper right), so the camera looks north-west from over the
Tagus: the river is the near-left edge of the map, the city climbs away from it up its hills.

**Street fingerprint: hills, trams and tiles.** Tram 28 runs one line across the map: in from Prazeres at the west
edge past Estrela (y = -50), down between Chiado/Bica and the Carmo (x = -50), along Rua da Conceição between Rossio and
the Praça do Comércio (y = 50), down to the passing place on x = 50, then into the Alfama, where the double track becomes
one narrow track that bends past the Sé and leaves the map at the east edge. Yellow Remodelado cars (two-axle, cream window band, CARRIS on the side, a trolley pole) run it on a timetable
(src/37_traffic.js); the overhead wire is drawn only in the Alfama lane, on brackets from the house fronts (posts along
the streets became sprites that dragged most of the map into the sprite layer and overflowed the explore bake budget). Every
street is paved in grey basalt setts between white-and-black calçada pavements. Right-hand traffic: cream taxis, small
cars, tuk-tuks full of tourists, a yellow Carris bus. The ground rises in real hills inside the places, built as stepped
terraces with stone retaining walls, parapets and stairs (escadinhas); every street and square that meets another stays
at z 0. Façades in ochre, pink, white and pale blue, many clad in azulejos (blue, green, yellow patterns), terracotta
roofs, washing on lines under the windows, iron balconies. The Tagus runs along the whole near edge below a stone quay,
with orange cacilheiro ferries crossing, sailing boats, and the red 25 de Abril bridge leaving the map for Cristo Rei.

**Clever moments.**
1. **Tram 28 on the single track** (Alfama, its own long shot). The lane through the Alfama is one track wide and bends
   past the Sé. An eastbound tram reaches the passing place at the lane's mouth and waits, bell ringing; the westbound
   comes round the bend, people flatten against the house fronts as it squeezes by (each walker steps to the wall as
   the tram nears), it rolls out beside the waiting car and away up Rua da Conceição; then the waiting tram pulls into
   the lane. The timetable is phased so the waiting tram is there when the cut lands.
2. **The Bica funicular** (its own shot). Two yellow cars on one track up the steep street, linked by the cable: one
   climbs as the other descends, they pass each other at the loop in the middle, phased to happen in the shot.

## Layout (100 u grid, tiles half 37; screen: top = far)

| pos | tile | what | height |
|---|---|---|---|
| (−100,−100) top | `estrela` | Basílica da Estrela (white dome, two bell towers, portico) at the back, the Jardim da Estrela in front: duck pond, the iron bandstand with a band, jacarandas, kiosk café | dome 30 |
| (0,−100) upper-right | `arraial` | Santo António party in a little square (Mouraria): garlands and paper balloons overhead, sardine grills smoking, a stage with an accordion, a crowd dancing the marcha, beer and bifana stalls, basil pots, tables | houses 10–14 |
| (100,−100) right | `graca` | Graça on its hill: the miradouro terrace with stone pines and a kiosk, people leaning on the parapet, the church and its bell tower | terrace 8, tower 24 |
| (−100,0) upper-left | `bica` | Chiado and Bica: stepped terraces to the west; the Bica funicular up a steep street with washing between the houses; A Brasileira with the bronze Pessoa at his table; Santa Catarina viewpoint | terrace 12 |
| (0,0) centre | `rossio` | Rossio: the black-and-white wave pavement, the column of Pedro IV, two fountains, the theatre at the back, flower stalls; the Largo do Carmo on a 14 u terrace (Carmo ruins, jacarandas, café) and the Santa Justa lift with its two cabins going up and down inside the lattice, the walkway to the terrace, a queue at its foot | lift 23 |
| (100,0) lower-right | `castelo` | Castelo de São Jorge: crenellated walls and square towers on the hilltop, the flag, the esplanade with cannons, pines and peacocks; houses stepping down the slope | towers 26 |
| (−100,100) left | `belem` | Belém: the Torre de Belém standing in the river, the Padrão dos Descobrimentos on the quay, the Jerónimos front at the back, the queue at Pastéis de Belém | tower 24 |
| (0,100) lower-left | `comercio` | Praça do Comércio: yellow arcades on three sides, the Arco da Rua Augusta, King José on his horse, the Cais das Colunas steps into the water | arch 24 |
| (100,100) bottom | `alfama` | Alfama: the narrow single-track lane (moment 1), the Sé's twin towers, houses stepping up the hill to the Santa Luzia viewpoint, a fado house, washing, cats, a sardine grill | Sé 22 |

Satellites (paint blobs off the grid): `sintra` beyond the north edge (upper right: the Pena Palace on
its crag in the forest, mist drifting), `almada` lower-left across the river (Cristo Rei on his pedestal, the bridge's
abutment), `oceanario` lower-right (the Oceanário on the water, the cable car along the shore).

## Depth plan
- Streets: centre lines x, y = ±50, 26 wide (3.2 pavement each side). Tram tracks at ±2.6 from the centre (trams
  4.4 wide), car lanes at ±7.3: trams and cars never share a lane, so only crossings can conflict; the timetable is
  checked offline (tools/traffic_check.mjs) for oriented-box overlaps over the joint period.
- The river is ground of the streets tile (one map-wide tile): a promenade y 137–146 along the whole south edge, the
  quay wall face, then water at z −3 to the map's cut edge at y 222. Boats are actors of the streets tile.
- The bridge is its own shared tile (`ponte`, order 3): an anchorage block on the promenade, deck pieces of ~18 u with
  `under: 7`, two towers in the river, cars on the deck as actors.
- Hills are terraces: box objects with stone walls whose footprints are honest; buildings on them are `on: true` and
  set their floor at the terrace top. High ground sits at each tile's far corner, so it never hides its own place.
- The Alfama lane is at z 0; houses north of it are tall, south of it single-storey with roof terraces behind a long
  low planter wall, so the lane and the trams in it stay visible. The planter wall is one object in front of the whole
  lane: the trams and the lane's people all find it as their first sprite in front and are then ordered by depth among
  themselves (the people carry an invisible tail below their feet so their boxes reach it, as the trams' boxes do).
- The Sé stands east of the lane mouth and the corner by the street is a low largo, so the passing place on x = 50 is
  not hidden behind the Sé's towers in the Alfama shot.
- The Alfama miradouro (both wall pieces and the stairs) is one object: as separate objects the stairs, the wall pieces
  and the things on top formed sort cycles.

## Film (30 fps)
build 0 → estrela 200 → arraial 300 → graca 400 → castelo 500 → alfama 600 (long: the eastbound waits from just before
the cut, the westbound comes out of the lane 1.8 s in and passes it, the eastbound pulls into the lane ~6.6 s in) →
comercio 810 → belem 910 → sardines close-up 1010 (z 9) → bica 1110 (the cars meet at the loop 2.6 s in) → rossio 1210
→ centre 1310 → wide 1410, fade 1521, hold 1544. Car lane phases were searched offline (tools/traffic_check.mjs search)
after the tram phases were fixed; re-run it if the Alfama shot moves.
