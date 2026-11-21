# Venice — brief

Season: Carnival week in February. A low winter sun (kept as the usual upper-left light), a little mist where the
lagoon fades into the paper, coats, scarves and woolly hats, and everywhere masks and costumes: gowns with plumes,
the bauta under a tricorn and a black tabarro, plague doctors, jesters, tourists in gold half-masks.

**Map orientation.** +x runs south (lower right), +y runs west (lower left): the view looks north-east across the city
from over the Giudecca. San Marco's basilica (facing west) faces us; the Doge's Palace shows its piazzetta and Molo
fronts; the Bacino di San Marco is the lagoon along the lower-right edge; Murano lies upper left (north), Burano upper
right (north-east), San Giorgio Maggiore lower right across the Bacino.

**Street fingerprint: a city with no cars.** Every street of the grid is a canal, 26 u bank to bank, its green water
2 u below the paving between stone banks (an Istrian cap, brick courses, a dark weed band at the waterline); places
end at their banks in fondamenta with striped paline or in houses that rise straight from the water. Round the whole
city lies the lagoon, fading into mist at its ragged edge. Humpbacked bridges with steps carry the calli over the rii
(boats pass under the arches, people climb over them). All traffic is boats, on a timetable that never collides
(tools/search_boats.mjs, 14 lanes, junctions and stops included; boats keep right): vaporetti calling at floating
stops (Ca' d'Oro, Rialto, Vallaresso, San Zaccaria, Giardinetti), gondolas with gondoliers rowing standing up and
Carnival riders, delivery barges stacked with produce, the rubbish boat with its crane, water taxis, the ambulance boat
with its light flashing, costumed rowers. Altane on the roofs, funnel chimneys, washing across the calli, plaster in
ochre, rose and terracotta, green shutters.

**Clever moment: ACQUA ALTA in Piazza San Marco** (src/tiles/acquaalta.js). A 60 s tide cycle phased so the San Marco
shot opens just before the siren: the siren wails from the clock tower; people break off their walks and head for the
passerelle (raised walkways on trestles) and fill them in single file (every person is given a slot in the moving file
and waits beside the boards until it passes); water wells up out of the drain grates and spreads in pools that join
(each pool's wet rim is painted before all the pools, so where they meet no edge shows) until the whole square is one
sheet of water with the campanile, the basilica and the arcades reflected in it; the lagoon climbs the Molo's wall;
waders go on in boots with the water round their shins, costumes keep posing knee-deep for photographers, Quadri keeps
serving, the pigeons take refuge on the Procuratie's cornice. Then the tide turns, the sheet breaks up and drains, the
boards empty and people come back out of the arcades. The water level is a moving structure under everything standing.

Second, smaller: the Rialto. The canal timetable is shifted so a vaporetto glides in to the Rialto stop as the Rialto
shot opens, under the bridge's stairs crowded with people.

## Layout (100 u grid, tiles half 37; screen: top = far)

| pos | tile | what | height |
|---|---|---|---|
| (−100,−100) top | `zanipolo` | Campo Santi Giovanni e Paolo: the brick Dominican basilica, the Scuola Grande (the hospital) with its trompe-l'oeil front, Verrocchio's Colleoni, ambulance boats moored on the rio dei Mendicanti and a crew with a stretcher, children with a ball, a café | basilica 24 |
| (−100,0) upper-left | `cannaregio` | a campo with its well-head and a brick parish church; the Ca' d'Oro's gothic lace front on the Grand Canal with its vaporetto stop; a bacaro with spritz drinkers, a mask shop, washing across the calle, a juggling jester, children throwing confetti (the close-up) | church tower 28 |
| (−100,100) left | `squero` | a gondola boatyard: chalet-like timber houses with geraniums, the stone slipway into the rio, gondolas keel-up on trestles being tarred, a gondola launched and hauled back every 30 s, a forcola maker, an angler | 13 |
| (0,−100) upper-right | `formosa` | Campo Santa Maria Formosa in Carnival: the white church and its bell tower with the grotesque mask, a commedia dell'arte stage (Arlecchino, Pantalone, Colombina) and its audience, a costume parade led by a drummer, the frittelle stall and its queue, a balloon seller, confetti | 22 |
| (0,0) centre | `rialto` | the Rialto's San Marco bank: the Fondaco dei Tedeschi with tourists on its roof terrace, the Riva del Ferro with restaurant tables, heaters and the gondola station, Campo San Bartolomeo with Goldoni and a chestnut roaster, the Mercerie | Fondaco 17 |
| (0,100) lower-left | `mercato` | the Rialto market: the Pescheria's arcade with fishmongers at their counters, the Erberia's stalls under striped awnings, San Giacomo di Rialto's great clock, a barge unloading, a porter, gulls | 15 |
| (100,−100) right | `riva` | the Riva degli Schiavoni: the prisons, the Bridge of Sighs, the crowd photographing it from the Ponte della Paglia, the Hotel Danieli with flags, souvenir stalls, an accordion player, costumes posing; San Zaccaria; the Arsenale's gate with its lions and towers | prisons 14 |
| (100,0) lower-right | `sanmarco` | Piazza San Marco: the basilica with its domes and gold, the clock tower with its Moors, the Procuratie with Quadri's orchestra, the campanile, the Doge's Palace, the two columns, moored gondolas; ACQUA ALTA | campanile 48 |
| (100,100) bottom | `salute` | Santa Maria della Salute (the octagon, the scrolls, the great dome), the Punta della Dogana with Fortune turning on the golden ball, the Zattere with a floating café terrace, a painter at his easel | dome 33 |

Satellites (lagoon islands on their own water): `murano` upper left (a glass furnace with chimneys and a glassblower,
the lighthouse, a vaporetto), `burano` upper right (rows of brightly painted houses on a little canal, the leaning
bell tower, lace makers), `sangiorgio` lower right (Palladio's white front, the dome, the campanile, a little harbour).

## Depth plan
- The lagoon, the canals' water, the far banks' walls and all the boats are the `streets` tile (order −99, built
  first). Water at z −2; lanes keep 5 u clear of every near bank (that strip lies under the near bank's paving).
- Bridges are built by the two places they join (VN.BRIDGES / VN.bridgeParts): the far place builds the far ramp, the
  vault, the span ({ under: 0 }) and the parapet over them; the near place builds the near ramp and its parapet. So
  each part sorts with the houses beside it. The Rialto's shop rows and portico sit on the span (on: true), split
  either side of the central stair. The floating stops are built by the place whose bank they are moored to.
- Boats are drawn in pieces along their length (2 for small boats, 6 for a vaporetto), each anchored at its end
  nearest the viewer, so a boat half under an arch is right at both faces.
- The acqua alta water is one actor anchored at the far corner of the open square (behind it: the Procuratie, the
  clock tower, the basilica; everything else on the square is in front of it), keyed by its level in 20 steps.
  Pools are discs clipped to the square; the full sheet carries mirrored polygons of the buildings, clipped to it.
  The lagoon's climb up the Molo and Grand Canal walls is a band in 12 pieces, each anchored at its far end.

## Film (30 fps)
build 0 → zanipolo 200 → formosa 300 → riva 400 → salute 500 → mercato 600 → campo close-up 700 (z 9) → squero 800
→ cannaregio 900 → rialto 1000 (a vaporetto berths) → sanmarco 1100 (long: the siren, the boards, the flood) →
centre 1330 → wide 1430, fade 1591, hold 1614.
