# Rio de Janeiro — brief

Season: Carnival, mid-February, high summer. A hard bright sun, deep shadows, the city in costume: glitter, feather
headdresses, sailor hats and fairy wings on ordinary people; a bloco brass band in Centro; the samba schools in the
Sambadrome. Everyone else is at the beach.

**Orientation.** The Atlantic lies along the lower-right edge (+x, south-east), Guanabara Bay along the upper-right
edge (−y, north-east). Sugarloaf stands at the right vertex where bay and ocean meet; Corcovado with the Christ at the
top vertex, looking out over the whole city towards the viewer, arms level across the screen.

**Street fingerprint: the sea, the mountains and the wave.** Every pavement in the map is Portuguese stone (pedra
portuguesa: pale limestone set with black basalt patterns). Along the whole ocean edge runs Avenida Atlântica, and on
its beach side Burle Marx's calçadão with the black-and-white wave running parallel to the shore — the one pattern
you can recognise from the air. Beyond it the sand with umbrellas, the surf and the sea. Granite mountains rise out of
the city as real objects with their own sides: Corcovado (forested flanks, a bare cliff), Sugarloaf and Morro da Urca,
the favela hill of Santa Marta, the terraces of Santa Teresa, the Arpoador rock in the surf, Pedra do Leme at the
corner. Right-hand traffic: yellow taxis with a blue stripe, city buses, white VW Kombis, motorbike taxis, orange
share bikes.

**Clever moments:**
1. **The samba school in the Sambadrome** (tile `sambodromo`, its own long shot and a close-up). A whole school
   parades along the Passarela on a timetable: the comissão de frente in step, the opening float (abre-alas) with a
   golden crowned sun turning, the mestre-sala bowing to the porta-bandeira as she spins with the flag, alas of
   dancers in rows of four, the baianas spinning their white hooped skirts, the drum queen in front of a bateria of
   surdos, caixas and tamborins, a second float with destaques in huge feathers, passistas. As the abre-alas passes,
   each section of the grandstand jumps up and waves — a wave that travels with the float. The cycle is phased so the
   float rolls into frame as the cut lands.
2. **The Sugarloaf cable cars** (tile `paodeacucar`): two glass cars on each of the two spans shuttle in opposite
   directions and pass each other mid-span, timed so they cross in the middle of their shot.

The Santa Teresa bonde (yellow, kids hanging off the side) shuttles across the white Arcos da Lapa all the time.

## Layout (100 u grid, tiles half 37, pavements to 43; screen: top = far)

| pos | tile | what | height |
|---|---|---|---|
| (−100,−100) top | `corcovado` | Corcovado: forested granite peak with the Christ on its summit platform (tourists copying the pose), the red rack train climbing, a helicopter circling; Parque Lage below (palazzo round a courtyard pool, café, lawn, marmosets) | peak 46, statue to 60 |
| (0,−100) upper right | `centro` | Cinelândia: the Theatro Municipal (green domes, gilded eagles), the Amarelinho's yellow umbrellas, the Cordão da Bola Preta bloco (brass band + polka-dot crowd) looping round the square, the VLT tram; Museum of Tomorrow on Pier Mauá out in the bay | 20 |
| (100,−100) right | `paodeacucar` | Sugarloaf and Morro da Urca as granite objects, the Praia Vermelha station with the queue, two spans of cable cars, climbers on the face, Urca's low houses, the Pista Cláudio Coutinho trail, Pedra do Leme in the surf | 40 |
| (−100,0) upper left | `santamarta` | Santa Marta favela on its hill (an object with walls): stacked brick and painted houses with blue water tanks and lajes, a laje party, the inclined funicular, kites over the roofs, the rainbow Praça Cantão, a football court, the mototaxi rank | hill 24 |
| (0,0) centre | `lapa` | the Arcos da Lapa (two tiers of white arches) with the yellow bonde, the Santa Teresa terraces at the far corner, the Selarón Steps climbing to them, Lapa's colonial bar fronts, a roda de samba, caipirinha carts | 14 |
| (100,0) lower right | `copacabana` | the beachfront: Copacabana Palace between pastel apartment blocks with people on balconies; on the beach a footvolley game, an altinha circle, umbrellas and chairs, Posto 4, kiosks, the mate and biscoito Globo sellers, a sand sculpture, surfers | 16–20 |
| (−100,100) left | `sambodromo` | the Passarela do Samba: the grandstand, frisas, the Apoteose arch, the parade | stand 13, arch 22 |
| (0,100) lower left | `lagoa` | Lagoa Rodrigo de Freitas: swan pedal boats, a rowing eight, the cycle ring, kiosks, capybaras; Jardim Botânico's imperial palm avenue along the far side | palms 20 |
| (100,100) bottom | `ipanema` | Praça General Osório with the Feira Hippie, low blocks, the Arpoador rock in the surf with surfers, Posto 9's flag, frescobol | 12 |

Satellites (paint blobs off the grid): `niteroi` upper right beyond the bay (Niemeyer's saucer on its cliff, the red
ramp), `ilhafiscal` top right in the bay (the green neo-Gothic customs house on its islet), `gavea` lower left
(Pedra da Gávea and hang-gliders spiralling down to São Conrado beach).

The sea and the bay are in the streets tile (one map-wide tile): Avenida Atlântica is the street at x = 150, the
calçadão x 157–167, sand to the shore (~186), the ocean to 205; the bay road at y = −150, its quay at −163, the bay to
−184. A ferry crosses the bay; fishing boats and a cargo ship sit out on the ocean.

## Depth plan
- Streets order −99 (pavement rings at half 43, roadways 14 u, nothing standing between lanes), places by
  (cx + cy)/100, far satellites order −3, the near one 3.
- Mountains are standing objects whose footprint is their base ellipse's box; anything on them (the statue platform,
  climbers, houses, the train) is `on`. Tall things sit at each tile's far side; beachfront blocks are the near side
  of their tile and stay ≤ 14 u.
- Hills with walls (Santa Marta, Santa Teresa) are one terrain object over their area; houses on them `on`, sorted
  by their own footprints (higher = farther back = drawn first).
- The aqueduct is split into 6 u pieces with `under: 13.2` (people pass beneath, the bonde rides on top).
- Parade: each row of dancers is one actor anchored at its front-most dancer; floats anchored at their front corner.
- Beach life of each beach tile lives at local x 57–92 (beyond the avenue) in that tile.

## Film (30 fps)
build 0 → corcovado 200 → centro 300 → paodeacucar 400 (the cars pass) → copacabana 500 → praia 600 (z 9) →
ipanema 700 → lagoa 800 → santamarta 900 → lapa 1000 → sambodromo 1100 (the parade, the stand wave) →
desfile 1260 (z 8.6) → wide 1370, fade 1505, hold 1528. `autoplay: false`.
