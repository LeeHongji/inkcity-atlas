# Paris — brief

Season: early autumn, a clear café-weather afternoon. Plane trees just turning (yellow-green crowns with ochre and rust
patches, a few leaves on the pavements), light coats, trench coats and scarves, every terrace full.

**Map orientation.** North is +x (lower right), west is −y (upper right), so the view looks south-west across the city:
the left bank is the far column, Montmartre's hill stands at the right corner and the Eiffel Tower at the top.

**Street fingerprint:** the Seine and Haussmann Paris. The Seine runs right across the map in the channel x = −50
(top-right to lower-left on screen) between stone quais: a tall quai wall on the left bank with a cobbled lower quai
(people sitting with their legs over the water), bouquinistes' green boxes on the parapets, bridges at every street
(Pont d'Iéna, Pont Alexandre III with its gilded pillars, the iron Pont des Arts, Pont Neuf with its round bays), and
bateaux-mouches full of tourists sliding under the arches both ways. On the land: cream limestone Haussmann blocks,
six storeys, wrought-iron balconies on the 2nd and 5th floors, blue-grey zinc mansards with dormers and chimney pots,
café terraces (red awnings, little round tables, wicker chairs facing the street, a waiter with a tray), plane trees
along wide pavements, green Wallace fountains, Morris columns, Guimard Métro entrances, newspaper kiosks, Vélib'
stations. Right-hand traffic: small cars, black taxis, scooters, Vélib' bikes, a green-and-white bus.

**Clever moment:** Place de l'Étoile. Twelve avenues meet at the Arc de Triomphe. Every 8 s a wave of twelve vehicles
arrives at the ring from all twelve avenues at the same moment, and they swirl round anticlockwise with no lanes:
neighbours weave in and out across each other's lines (inner, outer, inner) and peel off down different avenues, and
nothing ever touches. It is collision-free by construction: the twelve stay exactly 30° apart in angle while on the
ring (a rotating clockwork), so their weaving lines cross only at different moments; exits are radial. The cycle is
phased so a wave hits the ring a second after the cut to the Étoile shot. A tricolour hangs and moves under the arch,
tourists stand on the roof terrace.

## Layout (100 u grid, tiles half 37; screen: top = far)

| pos | tile | what | height |
|---|---|---|---|
| (−100,−100) top | `eiffel` | the Eiffel Tower (four lattice legs on arches, three platforms, lifts climbing the legs), Champ de Mars lawn with picnics (wine, baguettes), souvenir sellers, a carousel, a bateau-mouche pier on the quai | tower 72 |
| (−100,0) upper-left | `luxembourg` | Luxembourg Palace across the far side, the octagonal Grand Bassin with toy sailboats pushed by children with sticks, green metal chairs (readers, sunbathers), pétanque under the trees, a puppet theatre, gravel and clipped trees | palace 14 |
| (−100,100) left | `cite` | Île de la Cité in the Seine: Notre-Dame (twin towers, rose window, flying buttresses, the rebuilt spire), the parvis with a queue, the willow tip of the island; the petit bras with the left-bank Quai de Montebello, bouquinistes and the little bookshop | towers 26, spire 34 |
| (0,−100) upper-right | `etoile` | Place de l'Étoile: the Arc de Triomphe on its island, the cobbled ring, twelve avenues lined with trees, low hôtels between them, taller Haussmann at the back; avenue d'Iéna runs to the Pont d'Iéna | arc 22 |
| (0,0) centre | `louvre` | the Louvre's wings round the Cour Napoléon, the glass pyramid and its queue, fountains, people doing the "pinch the pyramid" photo, the Arc du Carrousel; the quai with bouquinistes and the Pont des Arts landing | wings 13, pyramid 9 |
| (0,100) lower-left | `marais` | Place des Vosges (red-brick pavilions, steep slate roofs, arcades, a square garden with fountains), rue des Rosiers with the falafel queue, a café on the corner | 12–16 |
| (100,−100) right | `montmartre` | the butte: Sacré-Cœur's white domes at the top, the stairs and the funicular climbing and descending, Place du Tertre painters at easels, a vineyard, a carousel at the foot | dome 34 on the hill |
| (100,0) lower-right | `opera` | Palais Garnier (green copper dome, gilded statues, arcaded front, steps with people), the grands boulevards: Haussmann blocks, a big café terrace on the corner, a Morris column, a kiosk | 18, statues 22 |
| (100,100) bottom | `pigalle` | the Moulin Rouge with its red windmill turning, the queue, the boulevard's central promenade, a Guimard entrance (Blanche), a crêpe stand, Haussmann blocks with a tabac | 16 |

Satellites (paint blobs off the grid): `versailles` upper-left (palace front, parterres, the Grand Canal with
rowing boats), `defense` upper-right (La Grande Arche, the esplanade, glass towers), `msm` lower-left
(Mont-Saint-Michel on its rock in the tidal sands, the causeway, a shuttle bus).

## Depth plan
- The river is ground of the `streets` tile (src/tiles/seine.js is drawn into it, so the whole map has a single bake
  that covers the view: two map-wide tiles overflowed the explore bake budget at DPR 2). Its water sits at z −5.6; the
  left bank's tall quai wall (the face x = −63 looking lower-right) drops to a cobbled lower quai at z −4.4; the right
  bank's paving is drawn over the water's near strip (it hides ~6 u), so the boats keep to x ≤ −44.
- Bridges are objects of the streets tile: the vault (dark underside seen through the arches) first, then the span with
  `under: −0.6` (boats below pass under, cars and walkers on the deck stand on it), then the near parapet in pieces
  `on` the span so people on the bridge are behind it. The lower quai is shallow at this scale, so its walkers turn
  well clear of every bridge's far side (else a head shows over the deck).
- A bateau-mouche is drawn as six short pieces (one actor each, anchored at its front-most end), so a boat half under a
  bridge is right at both faces; it is a glass-roofed boat whose top stays under the arches' crowns.
- Étoile's blocks are axis-aligned boxes grown inside the wedges between the avenue strips, so no avenue lies in a
  block's footprint and the cars sort correctly against them; the near ones are low hôtels so they never hide the ring.
- Montmartre's butte is ground (a shaded height-field), not an object: as a whole-tile object it was promoted to a
  sprite by cars passing behind its footprint. Nothing lies behind its crest; buildings and people stand on it at hAt.
- Street trees and lamps are planted by the place in front of them (PA.streetSide), so they sort with its buildings.

## Film (30 fps)
build 0 → eiffel 200 → luxembourg 300 → cite 400 → marais 500 → pigalle 600 → Café de la Paix close-up 700 (z 9) →
opera 800 → montmartre 900 → louvre 1000 → etoile 1100 (long; a wave reaches the ring at 1130) → centre 1260 →
wide 1360, fade 1521, hold 1544.
