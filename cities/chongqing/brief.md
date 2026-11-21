# Chongqing — brief

Season: a misty early-spring morning (March). Fog lifting off the rivers, damp stone stairs and moss on every retaining
wall, the huangjue figs in fresh pale-green leaf, plum blossom on the terraces, steam from noodle pots and red steam
from the hotpot tables, people in light jackets and a few umbrellas against the drizzle.

**Compass.** East is towards the viewer (+x +y), north is to the right. The peninsula points at the viewer: the green
Jialing runs along the near-right edge (+x), the brown Yangtze along the near-left edge (+y), and they meet beyond
Chaotianmen at the bottom vertex, where the line between the two colours runs out from the tip. The ridge (Eling) is
the far top vertex. Everything tall stands towards the back; the rivers are in front.

**Street fingerprint: a city stacked on mountains.** Every place has its own levels: retaining walls of big damp stone
courses with figs spilling over them, terraces at 10, 14, 18, 22 and 28 u, long flights of stone steps, footbridges and
a public lift between a lower and an upper street, a tower whose 11th floor is a street door, stilt houses hung on
posts down the cliffs, and the rivers far below their quays on low-water pebble shoals. Bangbang porters with bamboo
poles climb the stairs in every place. Right-hand traffic on the car streets: yellow taxis, buses, moto-taxis; two
bridges over the Jialing (a plain girder bridge, and Qiansimen's white sail pylon); barges, a ferry and a cruise ship
on the rivers. Chinese signs are real simplified characters from a hand-cut stroke table (src/37_hanzi.js, checked
large with tools/glyphs.py).

**Clever moments.**
1. **Liziba: the train through the building** (shot `liziba`, z 3.05, 200 frames). Line 2's two beams run through the
   station on the 6th–8th floors of a 17-storey slab. The glazed station band shows the trains inside; a train comes
   out of the square opening in the end wall 1.5 s after the cut, crosses the viewing plaza where tourists hold up
   their phones (a couple pretend to swallow it), and dives into the tunnel under a fig-topped cliff, while the other
   train glides in from the tunnel and stops at the platform inside. Each car is two half-car actors so the end
   wall's opening covers exactly the parts still inside.
2. **The Yangtze cableway** (shot `suodao`, z 2.6, 150 frames). Two red cabins shuttle from the cliff-top station
   across the Yangtze to Nan'an; they pass each other over the middle of the river 4 s into the shot, while a container
   barge slides under them.

## Layout (100 u grid, tiles half 37; screen: top = far)

| pos | tile | what | levels / height |
|---|---|---|---|
| (−100,−100) top | `eling` | Eling Park on the ridge: the five-tiered Liangjiang Pavilion on the summit, square-dancing aunties, xiangqi under a fig hung with birdcages, a water calligrapher, the park gate | terraces 10, 22; pavilion to ~50 |
| (0,−100) upper right | `kuixing` | "8D": a tower whose 11th floor is entered from the upper road by a bridge; the upper road on a 28 u wall with a bus stop; a glass public lift; a market at the bottom | upper road 28; tower 48 |
| (100,−100) right | `liziba` | Line 2 through the 17-storey slab; the viewing plaza; the hill road at the 8th-floor level with a footbridge into the station (出口); shops built into the retaining wall; a noodle stall under the beams | hill road 19.6; slab 48 |
| (−100,0) upper left | `huoguo` | the hotpot street: five restaurants with big red signs and lanterns, 18 tables of diners round split pots, red steam, red umbrellas, waiters, a xiaomian stall | 10–14 |
| (0,0) centre | `jiefangbei` | the Liberation Monument (octagonal clock tower) in its walking square, department store with a changing screen, porters waiting with their poles, a shoe-shiner, a singer, a balloon seller | monument 28 |
| (100,0) lower right | `hongyadong` | the stilt complex stepping down the cliff in four tiers of timber, eaves and lanterns, pavilions on the roof terraces; Cangbai Road on its terrace walks into the top tier; switchback stair | terrace 22; tiers 30/23/15/9 |
| (−100,100) left | `suodao` | the Xinhua Road cableway station (长江索道) on its cliff, stilt houses on posts, a zigzag stair, a ticket queue | cliff 16 |
| (0,100) lower left | `shibati` | the Eighteen Steps: five terraces of old houses, flights between them, the 十八梯 paifang, porters climbing, a noodle stall, a teahouse, mahjong, kids kicking a shuttlecock | terraces 18/13.5/9/4.5/0 |
| (100,100) bottom | `chaotianmen` | the tip: Raffles' glass sails with the Crystal across their tops, the old square (tai chi, a tour group), the tip square on its podium (朝天门 carved in the wall) over the confluence, steps to the pontoon and a moored cruise ship | podium 8 over water at −5 |

Satellites: `nanan` lower left across the Yangtze (the cableway's far station, stilt houses), `jiangbei` lower right
across the Jialing (the Grand Theatre's stacked green glass), `wulong` upper left (the Three Natural Bridges' rock
arch over a gorge, the old courier inn).

## Depth and levels plan
- One ground level: every street (car streets y = ±50, walking streets x = ±50, the two riverside roads) and every
  place's ground is z 0 and flush (`K.slab` without sides). Raised ground is always a terrace object with its own
  walls (`CQ.terrace`), reached by stairs, a lift or bridges; the rivers lie at z −5 below quay walls and shoals.
- The streets tile holds both rivers (one map-wide tile), the quays, shoals, the colour line, the bridges (deck pieces
  `{ under: 0 }`), traffic and boats. Nothing stands on the pavements: lamps there were taken as things that hide
  cars and dragged their neighbours into the sprite layer (they were removed; explore went from never-sharp to 0.3 s).
- Tall things stand away from the car streets behind them: the hotpot restaurants ≤ 14 u, the Shibati top terrace
  starts 20 u in, Raffles 30 u in, the Hongyadong terrace 24 u in. The far edges of the top row are the map's edge.
- Liziba's slab is three objects along x (behind the beams; the beams' slice `{ under: 99 }`; the river face), trains
  are half-car actors. The Chaotianmen podium belongs to its tile (last in order) so its sprite drags nothing after it.
- The cableway's cables are drawn with the suodao ground beyond the road and as an `{ under }` object over the road.
- Boats are anchored at their far end so a bridge deck covers them correctly.
- Traffic (src/38_traffic.js): eight straight lanes with one loop length, phases searched by tools/traffic.js so no
  two vehicles ever meet at the crossings; the riverside roads end in tunnels under the Chaotianmen square.

## Film (30 fps), `autoplay: false`
build 0 → eling 200 → kuixing 300 → liziba 400 (200 frames, the train comes out 1.5 s in) → hongyadong 600 →
chaotianmen 700 → shibati 800 → climb 900 (z 8.5 close-up of the porters on the steps) → suodao 1000 (the cabins meet
4 s in, a barge below) → huoguo 1150 → jiefangbei 1250 → wide 1360, fade 1521, hold 1544.
