# Istanbul — brief

Season: late spring, tulip week (end of April). Fresh clear light, tulip beds in red, yellow and violet in every park,
the Judas trees (erguvan) along the shores in pink-purple bloom, plane trees in new leaf, light jackets. Ferries full
of commuters with tea in tulip glasses, gulls trailing every boat.

Compass: east = +x (lower right on screen), north = −y (upper right). The camera looks north-west from over Asia.

**Street fingerprint: a city cut by water.** The Golden Horn runs across the top of the map (y −72..−28) and meets the
Bosphorus, which runs the whole length of the map (x 28..72); the Bosphorus opens into the Üsküdar–Kadıköy bay on the
Asian side, where the Maiden's Tower stands on its rock. Europe is on the left of the water, Asia on the right, and the
water is a shallow trench (2.6 u below the quays) with stone quay walls. White ferries (*vapur*: black hull band,
yellow funnel with a black top, life rings on the rails, commuters on the open stern) run between the four piers —
Eminönü, Karaköy, Üsküdar, Kadıköy — on a timetable: they come alongside, wait, back off, pivot and steam away, trailed
by gulls. A Golden Horn ferry passes under the Galata Bridge, fishing boats and the gilded fish-sandwich boats rock at
the quays. On the skyline, lead domes and pencil minarets. On the streets: right-hand traffic, yellow taxis, yellow
dolmuş minibuses, red-and-white city buses, the white T1 tram over the Galata Bridge, the red nostalgic trams on
İstiklal and along the Kadıköy waterfront. Everywhere: simit sellers with trays on their heads and red simit carts, tea
in tulip glasses, anglers on every quay, and street cats on walls, steps, café chairs and boat decks.

**Clever moments:**
1. **The Galata Bridge in section** (shot `kopru`, z 4.3). The two-level bridge crosses the Horn on the line of the
   north–south avenue. Its upper deck (z 6, reached by ramps on both banks) carries the T1 tram, cars and a row of
   anglers along both rails; the lower deck is a string of fish restaurants open to the water, seen from the east side
   like a cutaway: diners at the tables, waiters, lamps, awnings. The anglers cast and reel in a wave that runs along
   the rail (each 0.45 s after the one before, a fish on some lines), cats wait at their buckets, the tram and cars
   cross behind them, and the Golden Horn ferry slides under the opening span in the middle — timed to the shot.
2. **Ferry rush at Eminönü** (shot `eminonu`, z 3.6, 11 s). The Kadıköy ferry comes alongside the Eminönü pier as the
   shot opens, the gangway drops, ~22 commuters pour off along the pier into the square while ~22 who have gathered
   behind the turnstiles pour on; the gangway lifts, the ferry backs out and pivots away towards Asia.

## Layout (100 u grid, tiles half 37; screen: top = far)

| pos | tile | what | height |
|---|---|---|---|
| (−100,−100) top | `galata` | Galata Tower in its cobbled square (cone roof, gallery, flag), cafés and tea tables round it, a busker; the top of İstiklal with the red nostalgic tram (kids on the back step), Tünel station; a Maraş ice-cream man in his fez teasing a child; Levantine apartment blocks with shops; the quay on the Horn with anglers | tower 47 |
| (0,−100) upper right | `karakoy` | Karaköy: the pier (KARAKÖY) on the Horn, the fish market with fishmongers under red lamps, a baklava shop with a queue, the Kılıç Ali Paşa mosque, an old bank block, a tea garden with low stools on the Bosphorus edge, cats | mosque 26 |
| (100,−100) right | `uskudar` | Üsküdar: Mihrimah Sultan (İskele) Mosque by the pier, its wide portico; the ÜSKÜDAR ferry pier; a fountain; wooden Ottoman houses; erguvan trees; the waterfront promenade where people sit on the sea wall with tea | 30 |
| (−100,0) upper left | `suleymaniye` | the Süleymaniye on its hill terrace: great dome with two half-domes, four minarets at the courtyard corners, the arcaded courtyard, rows of little medrese domes, the tomb in the cypress garden; people at the terrace wall looking at the Horn | 40 |
| (0,0) centre | `eminonu` | Eminönü: the New Mosque (cascade of half-domes, two minarets) on its terrace, the Spice Bazaar (MISIR ÇARŞISI), the square with pigeons and seed sellers, the ferry pier (the rush), the gilded balık-ekmek boats rocking at the quay with grill smoke | 32 |
| (100,0) lower right | `kizkulesi` | the bay: the Maiden's Tower on its rock (lighthouse tower with a lead cone, a little terrace), the KADIKÖY pier, rowing and fishing boats, gulls | 16 |
| (−100,100) left | `bazaar` | the Grand Bazaar in cutaway: lead-roofed vaulted streets with one street's roof open so you see into the shops (carpets, mosaic lamps, ceramics, jewellers, spices), shoppers, porters with towering loads; the gate with KAPALIÇARŞI; the Column of Constantine at Çemberlitaş by the tram | 14 |
| (0,100) lower left | `sultanahmet` | the Blue Mosque (six minarets) and Hagia Sophia (ochre, buttressed, four minarets) facing each other across Sultanahmet Park: the fountain, tulip beds, the German Fountain, the Egyptian obelisk; simit carts, a guide with a flag, cats | minarets 40 |
| (100,100) bottom | `kadikoy` | Kadıköy market: narrow lanes of fish stalls on ice, pickle shops (TURŞU), Turkish delight, a café, the bronze bull in the square, a street musician, many cats | 12 |

Streets tile (`streets`, src/tiles/streets.js + water.js + bridge.js): the water (Horn, Bosphorus, the bay's open
water), the avenue x = −50 across the map over the Galata Bridge (ramps y −94..−72 and −28..−6), the street y = 50
west of the avenue, the pedestrian Sirkeci square y = 50 between Eminönü and Sultanahmet with tulip beds, the
Üsküdar sea-wall promenade (y −63..−37, x > 72) and the Kadıköy waterfront (y 37..63, x > 72) with the nostalgic tram.

Satellites (paint blobs off the grid): `ortakoy` upper right beyond the Bosphorus's north end (the Ortaköy mosque
under the Bosphorus Bridge, a kumpir stand), `balat` upper left beyond the Horn's inner end (coloured houses on a
steep lane, the red-brick Phanar school, laundry lines), `adalar` lower right beyond the bay (Büyükada: wooden
mansions under pines, bicycles, a ferry arriving).

## Depth plan
- Streets tile order −99 (all water and streets). Places by (cx + cy)/100; far satellites −3, near ones 3.
- Water is a trench at WL −2.6. Only far banks show their quay walls (the Horn's north bank faces +y, the Bosphorus's
  west bank faces +x, the bay's north bank faces +y). Near banks hide 5.7 u of water at their foot: every hull keeps
  its near side ≥ 6 u from a near bank. Piers on near banks reach out past that line and boats dock on their far
  faces. Piers are objects (a deck on piles at z 0).
- Ferries are long: drawn in parts (`IS.boatActors`), each part an actor anchored at its own centre, so they slide
  under the Galata Bridge and past piers piece by piece.
- Galata Bridge (its own shared tile `kopru`, order −1.1, there from frame 0 like the streets): lower-deck
  restaurants (bias: before the deck), then the upper deck `{ under: 6 }` (boats under, tram/cars/anglers on), then the
  near (east) rail in pieces `{ on: true }`. Anglers are actors at z 6 on the deck. The two ramps are tiny shared tiles
  of their own (`rampN` order −1.95 after Galata, `rampS` order −1.15 after Süleymaniye), objects `{ under: 0 }`
  with the vehicles on them at z = ramp height (IT.zAve).
- Hill terraces (Galata, Süleymaniye, the New Mosque's platform) are objects with walls; things on them are `on`
  and actors on them carry their z.

## Timetables (src/37_timetable.js, checked by tools/check.js in node)
- Roads, right-hand traffic, common period 30 s: avenue x = −50 southbound x −56.4, northbound x −43.6; the T1 tram on
  the two centre tracks (−51.6 southbound, −48.4 northbound); the y = 50 street's cars turn: eastbound (y 56) turns
  right into the southbound avenue, northbound avenue cars turn left into the westbound lane (y 44), crossing the
  tracks. Phases searched so no two vehicles' boxes ever overlap.
- Water, cycle 90 s: route A Eminönü–Kadıköy, route B Karaköy–Üsküdar, route C Eminönü–Üsküdar (each one ferry:
  arrive, dwell, reverse out, pivot, steam), route D the Golden Horn ferry from the inner Horn under the bridge and out
  up the Bosphorus, and back. Phases put route A at the Eminönü pier when the `eminonu` shot opens and route D under the
  bridge in the `kopru` shot; checked for hull overlaps.

## Film (30 fps)
build 0 → galata 200 → karakoy 300 → uskudar 400 → kizkulesi 500 → kadikoy 600 → sultanahmet 700 → bazaar 800 →
carsi close-up 900 (z 8.6) → suleymaniye 1000 → kopru 1100 (z 4.3, the bridge, 200 frames) → eminonu 1300 (360
frames, the ferry rush) → wide 1660, fade 1807, hold 1830. Opens in explore (`autoplay: false`).
