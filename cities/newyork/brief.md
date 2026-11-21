# New York — brief

Season: late spring, a clear day; street trees and the park in full fresh leaf; t-shirts and light jackets.

**Orientation.** North is +y (the lower left of the screen), west is +x (the lower right). We look south over Manhattan:
Central Park is the near corner, Midtown fills the middle, downtown and the harbour are at the far top. This is the
classic view from above the park down the skyline, and it keeps the tallest towers on the far side of the map.

**Street fingerprint:** the Manhattan grid. Four one-way avenues (along y) and four one-way cross streets (along x) make
a 4 x 4 grid of junctions round nine blocks, the stubs running out past the map edge in dry-brush ends. Each avenue has a
green protected bike lane, a lane of parked cars floating beside it, two travel lanes and a terracotta BUS ONLY lane;
yellow cabs everywhere, MTA buses, box trucks, delivery riders with insulated boxes in the bike lanes; steam from
manholes and from orange-and-white Con Ed stacks in coned-off work zones; mast-arm signals with green street-name blades
(5 AV / 42 ST); ladder crosswalks; cobra-head lamps. On the blocks: brick walk-ups with zig-zag fire escapes, brownstones
with stoops, wooden water tanks on the roofs, subway entrances with green globes, hot-dog carts, Citi Bike docks.
Traffic drives on the right.

**Clever moment: the green wave on 5th Avenue** (x = -50, southbound; its own long shot, `wave`, z 2.08). Every junction
runs a 30 s cycle; along each avenue the offsets step by 100 u / 30 u/s, so the lights turn green block by block in the
direction of travel. On 5th Avenue the light at 42nd Street goes green 1.2 s into the shot: the pack of ten cabs that piled up in
full view behind it (its 59th Street light let them in early) surges and meets green after green down the avenue
(34th 3.3 s later, 14th 6.7 s later) while the cross streets wait at red, then the cross streets get their turn. Cars follow the Intelligent Driver Model behind their leaders and red stop lines, simulated once at load and
replayed as a timetable (`src/37_traffic.js`; `tools/traffic_check.mjs` proves no overlaps). People wait on every corner
and cross with the walk signal.

## Layout (100 u grid, tiles half 37, 6 u sidewalk ring; screen: top = far = south-east)

| pos | tile | what | tall |
|---|---|---|---|
| (−100,−100) top | `fidi` | Financial District: One World Trade Center, the Oculus, a memorial pool; the Stock Exchange's columns and giant flag, Federal Hall with Washington on the steps, the Charging Bull with its photo queue, suits with coffee | One WTC ~62 u at the far corner |
| (0,−100) upper right | `chinatown` | Chinatown meets Little Italy: Mulberry Street's red-white-green arches over outdoor tables and waiters, Canal Street fruit stands and lanterns, walk-ups with fire escapes, cast-iron SoHo lofts | 20 |
| (−100,0) upper left | `flatiron` | the Flatiron's wedge where Broadway cuts 5th Avenue, Madison Square Park, the burger-kiosk queue, dog run | Flatiron 26 |
| (0,0) centre | `empire` | the Empire State Building, setbacks and spire, Herald Square bustle at its feet | ESB ~58 u |
| (100,−100) right | `village` | Greenwich Village: Washington Square arch and fountain, chess tables, a piano busker, brownstones, the West 4th cage | 12 |
| (−100,100) left | `grand` | Grand Central (facade turned to face us), the Chrysler Building's crown at the far corner, taxis and commuters | Chrysler ~50 |
| (100,0) lower right | `chelsea` | the High Line on its steel viaduct with planting and strollers, Chelsea Market's brick, galleries, the Vessel | 18 |
| (0,100) lower left | `times` | Times Square: the bowtie plaza, billboard wall, One Times Square at the far end, the red steps with the crowd, costumed characters, the Naked-Cowboy-type busker, NYPD | 30 |
| (100,100) bottom | `park` | Central Park: Bethesda Terrace and fountain, the Lake with rowboats and Bow Bridge, Sheep Meadow sunbathers, horse carriages on the drive, joggers | low |

Satellites on paint blobs: `liberty` upper right (south: the Statue of Liberty on its island, the orange Staten Island
ferry and a Circle Line boat), `bridge` upper left (east: the Brooklyn Bridge over the East River, walkers and cyclists
on the promenade, DUMBO), `yankee` lower left (north: Yankee Stadium, a game on).

## Depth plan
- Streets tile order -99; places by (cx + cy)/100; far satellites order -3, the near one 3.
- Street objects stand only where their screen column stays over asphalt: lamps and signal poles on a street's near kerb
  (x = X + 13.3 / y = Y + 13.3) or at a junction's near, left or right corner, never its far corner.
- Corners [31..37]² of every block stay clear: the corner people (`NK.corners(T)`, timetabled by NYT) wait there.
- Tall towers sit at each tile's far corner; the people and stories stay out of their shadow.

## Film (30 fps)
build 0 → fidi 200 → chinatown 300 → village 400 → chelsea 500 → empire 600 → flatiron 700 → grand 800 → wave 900
(270 frames, the green wave) → times 1170 → steps 1270 (z 9, the red steps) → park 1370 → liberty 1470 → centre 1570 →
wide 1660, fade 1790, hold 1813. `autoplay: false`.
