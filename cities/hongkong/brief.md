# Hong Kong 香港 — brief

Season: a clear December Sunday, the evening coming on. Low gold sun on the harbour, the Island's towers dropping warm
streaks into the water, neon starting to glow, windows lit floor by floor; people in light jackets and scarves.

Compass: north = +y (Kowloon, near the viewer), south = −y (the Island and the Peak), west = +x, east = −x. The camera
looks south from over Kowloon across Victoria Harbour, the classic view of the Island's wall of towers and the Peak.

**Street fingerprint: vertical density on a harbour.** Victoria Harbour runs straight across the whole map (y 24..76,
water 2.2 u below the promenades, the Island's granite seawall the face we see). Behind it the Island: tall thin
towers shoulder to shoulder, and the tram street (y = −50, Des Voeux Road) with the double-deck *ding-dings* running
the whole width on their two centre tracks, green poles carrying the span wires and contact wires, stop islands with
shelters (電車), grey-green railings along every kerb, zebras painted 望右 LOOK RIGHT. In front, Kowloon. The side
streets are markets (Graham Street on the Island, Temple Street in Kowloon) and neon blades in real characters hang
over the busiest streets. Left-hand traffic everywhere: red taxis, green and red minibuses, Citybus yellow and KMB
cream-and-red double-deckers; the tunnel road x = −50 dives into the Cross-Harbour Tunnel on the Island and comes out
of its mouths in Kowloon.

**Clever moments:**
1. **The Star Ferry crossing** (shot `ferry`, z 4.1, 12 s). Two double-ended ferries (MORNING STAR, NIGHT STAR)
   shuttle Central ↔ Tsim Sha Tsui on parallel lanes on a 40 s timetable. As the shot opens MORNING STAR glides in to
   Central's finger pier while NIGHT STAR casts off from Tsim Sha Tsui (a timetable across a tile boundary: the
   harbour is in the streets tile, the piers and their crowds in `central` and `tst`). At each berth the gangway drops,
   eight commuters walk off along the finger into the pier hall and the eight who queued along the far rail file on;
   the junk, a jetfoil, a lighter and the marine police run harbour lanes phased to pass between the ferries.
2. **The Peak Tram** (shot `peaktram`, z 6.2): the funicular's two cars on one cable, one climbing as the other
   descends, passing each other on the loop half way up, phased to pass 3 s into the shot.

## Layout (100 u grid, tiles half 37; screen: top = far)

| pos | tile | what | height |
|---|---|---|---|
| (−100,−100) top | `wanchai` | Wan Chai: tong lau with verandahs facing the tram street (pawnshop 大押 with its bat-and-coin sign, cha chaan teng 茶餐廳, one in bamboo scaffolding with workers, a 酒家 with lanterns), Tai Yuen Street's market, the Blue House, a dai pai dong under a tarp, pastel towers | towers 24–32 |
| (0,−100) upper right | `peak` | the Peak as stacked terraces of forest and villas, the Peak Tram on its viaduct with the passing loop, the Peak Tower (the 'wok') with the crowd at its terrace rail, 山頂 THE PEAK | tower 28 + roof |
| (100,−100) right | `midlevels` | four terraces on the hillside, the Mid-Levels escalator (covered, on stilts, riders going up), SoHo restaurants, Man Mo Temple 文武廟 with its incense coils and smoke, antiques, towers | 13.5 + towers |
| (−100,0) upper left | `causeway` | Times Square's tower with its giant screen, SOGO, a crossing that floods with shoppers on the green man (16 s cycle), the Noonday Gun, the typhoon shelter with sampans and yachts behind a breakwater | 46 |
| (0,0) centre | `central` | Bank of China Tower, HSBC (masts, coat-hangers, lions), Jardine House, LegCo, Statue Square with the helpers' Sunday on cardboard, Mandarin Oriental, City Hall, the Star Ferry pier 天星小輪 中環 with two fingers, the Observation Wheel | BoC 52 + masts |
| (100,0) lower right | `sheungwan` | Western Market, Shun Tak's dark towers, Wing Lok Street's dried seafood (海味, 士多), Chinese chess under a banyan, anglers on the seawall | 36 |
| (−100,100) left | `choihung` | 彩虹邨 Choi Hung Estate: rainbow slab blocks, the basketball court and the rainbow wall, a mahjong pavilion, the market 街市 | 28 |
| (0,100) lower left | `tst` | Tsim Sha Tsui: the Star Ferry pier (天星小輪 尖沙咀) and its fingers, the Clock Tower, the Cultural Centre's curved roof, the Space Museum, the Avenue of Stars with Bruce Lee, the bus terminus, Ocean Terminal with a cruise ship | clock tower 31 |
| (100,100) bottom | `mongkok` | Mong Kok: a wall of slim towers with neon blades over the street (酒家 大押 金 旺角 士多 香港 金魚 海味, KARAOKE HOTEL SAUNA), the Ladies' Market, goldfish shops (金魚), sneakers, the MTR exit 旺角, a pawnshop, a busker | 27 |

Market lanes (in the streets tile, MARKETS): Graham Street (Island x = 50) and Temple Street (Kowloon x = 50) with the
廟街 gate, striped stalls, a dai pai dong with a roaring wok, a fortune teller, a Cantonese opera singer with an erhu.

Satellites (paint blobs off the grid): `aberdeen` south (upper right: fishing junks dressed in flags, the fish market,
sampans), `buddha` west (lower right: the Tian Tan Buddha on his altar, pilgrims on the stair, the cable car),
`tsingma` north-west (lower left: the suspension bridge with traffic).

## Chinese lettering
Real traditional characters only, from a stroke table in `src/36_zh.js` (40 characters, each checked large on
`tools/zh.html`): 香港電車 茶餐廳 大押 押 酒家 金 街市 士多 天星小輪 中環 尖沙咀 旺角 海味 金魚 彩虹邨 山頂 望右 文武廟 廟街.
Signs too small to read carry a colour block, never scribbles.

## Depth plan
- Streets tile order −99: the streets, the harbour (HARBOUR), the market lanes (MARKETS), the tunnel portals
  (objects `under` 6 so cars vanish into them), tram poles each carrying only its own stretch of wire.
- Island tiles end at the seawall (y 24); Kowloon tiles start at y 76. Boats keep their hulls between y 26 and 71
  (Kowloon's edge hides 4.8 u of water at its foot). Piers: finger decks are objects `under: 0` (people walk on them),
  their near rails separate objects so walkers sort behind them.
- Projecting signs are their own small objects footprinted at their outer end (walkers under them sort behind).
- Terrain (the Peak's terraces, the Mid-Levels' terraces) are objects; things on them `on: true`; the escalator is a
  deck object (`under: 0`) and a glazed roof object (`under: 30`) with the riders between.

## Timetables (src/37_timetable.js, checked by tools/check.js: 0 overlapping samples)
- Roads, period 48 s, no lights: E-W cars y −59.5 (+x) / −40.5 (−x), trams −51.9 / −48.1 with a 4.5 s stop each;
  N-S cars x −43.5 (+y) / −56.5 (−y) through the tunnel. Phases searched.
- Water, 40 s: ferries A (x −5.6) and B (x 6.4), 9 s at each pier, 11 s crossings; harbour lanes y 45.2 / 51.6.
- Peak Tram 30 s; Causeway Bay crossing 16 s phased to the shot.

## Film (30 fps)
build 0 → peak 200 → peaktram 300 (z 6.2) → midlevels 400 → wanchai 500 → causeway 600 → choihung 700 → mongkok 800
→ temple 900 (z 9, Temple Street) → tst 1000 → sheungwan 1100 → central 1200 → ferry 1300 (360 frames) → wide 1660,
fade 1807, hold 1830. Opens in explore (`autoplay: false`).
