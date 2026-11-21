# Tokyo — brief

Season: cherry-blossom week (pink trees in several places), a clear day.

**Street fingerprint:** the Yamanote line. A red-brick arched viaduct runs right round the city as a loop, carrying two
silver-and-green trains in opposite directions, like a model railway round a diorama. Izakaya, tiny bars and shops sit
in the arches on the outside (gado-shita), facing the viewer on the near sides. Streets inside: left-hand traffic,
utility poles with sagging wires, zebra crossings, tall dark taxis, white kei vans, mamachari bicycles.

**Clever moments:**
1. **Shibuya scramble** (centre tile, its own long shot). Cars move on their greens. Then every light turns red for cars and
   ~90 people waiting at the four corners all cross at once, diagonals included, while cars queue at the stop lines.
2. **The loop.** Trains circle the whole map; the close-up is an izakaya arch where people drink at a counter while a train
   rolls overhead.

## Layout (100 u grid, tiles half 37; screen: top = far)

| pos | tile | what | height |
|---|---|---|---|
| (−100,−100) top | `tower` | Tokyo Tower in Shiba Park, Zōjō-ji's red gate, jizō rows with spinning pinwheels, a school group in yellow caps following a flag | tower 70 u |
| (−100,0) upper-left | `meiji` | forest, the great wooden torii, shrine hall with green copper roof, a wall of sake barrels; a Shintō wedding procession under a red parasol; Yoyogi lawn with rockabilly dancers | trees 10–12 |
| (0,−100) upper-right | `station` | Tokyo Station's red-brick Marunouchi building (long, two domes), platforms behind with a shinkansen, plaza with a taxi rank and ginkgo trees | 13, domes 22 |
| (−100,100) left | `sumida` | the river with stone banks, a red arch bridge, sakura both sides, blue-tarp hanami picnics, yakatabune boats passing under the bridge, falling petals | low |
| (0,0) centre | `shibuya` | the scramble: two roads crossing, zebras on four arms plus diagonals; a glass tower with a giant screen (a beckoning cat), a silver cylinder tower, Hachikō square with the dog statue and the old green train car, a kōban | 34 at the far corner, low near |
| (100,−100) right | `akiba` | Akihabara: narrow tall buildings hung with vertical signs, a crane-game arcade, a wall of capsule-toy machines, flyers, cosplayers | 20–28 |
| (0,100) lower-left | `sensoji` | Kaminarimon gate with the giant red lantern at the front, Nakamise stalls along the path, Hōzōmon, the main hall, five-storey pagoda, incense burner with smoke, rickshaws, rental kimono | pagoda 28 |
| (100,0) lower-right | `shitamachi` | old low lane: 2-storey wooden houses, futons over balcony rails, potted plants, vending machines, a sentō with chimney and steam, a tiny shrine, cats, kids with randoseru, a granny watering | 8–12, chimney 18 |
| (100,100) bottom | `tsukiji` | outer market: rows of stalls, fish on ice, a tuna being cut, turret trucks zipping, a standing sushi counter, a tamagoyaki queue, gulls | low |

Satellites (paint blobs off the grid, outside the loop): `fuji` upper-left (Mt Fuji, tea rows, a shinkansen crossing),
`skytree` upper-right (the white lattice tower by the river), `odaiba` lower-right (Rainbow Bridge over water, a
yakatabune), `ryogoku` lower-left (an outdoor sumō ring under a hanging roof, a bout, the referee, nobori banners).

## Depth plan
- Loop centre line at ±152, corner radius 16, deck z 6.5, two tracks at ±1.9. Split into `loopFar` (sides x = −152 and
  y = −152, order −2.5, behind every tile) and `loopNear` (sides x = +152, y = +152 and the four corners, order 2.5, in
  front of every tile). Far satellites order −3, near satellites order 3.
- Each long side is one object with `under: 6.5` (cars pass under the girder spans at the street ends; trains ride on
  top). Train cars are actors: the near-zone copy is `layer: 'top'` (nothing stands in front of the near loop), the
  far-zone copy sorts normally so far tiles' tall things cover it.
- Near tiles keep their outer 14 u low: the viaduct and trains hide that strip.

## Film (30 fps)
build 0 → tower 200 → station 300 → akiba 400 → shitamachi 500 → tsukiji 600 → gado close-up 700 (z 9) → sensoji 800
→ sumida 900 → meiji 1000 → shibuya 1100 (long, the scramble from the green light) → centre 1260 → wide 1360,
fade 1521, hold 1544.
