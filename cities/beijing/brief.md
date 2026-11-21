# Beijing — brief

Season: golden autumn (October, National Day week): ginkgo trees gone bright yellow along every pavement with their
leaves on the ground, persimmon and jujube trees full of fruit in the courtyards, red maples on Jingshan and on the
hills of the Great Wall, cabbages stacked for the winter, red lanterns and flags out for National Day, a clear day
with kites and pigeons in the sky.

**Compass.** North = −y (upper right on screen), east = +x (lower right). The camera looks north-west from over the
south-east. The imperial axis runs along x = 0: Jingshan (north), the Forbidden City, Tiananmen Square (south), on to
the Olympic Green beyond the north edge.

**Street fingerprint: the grid and the courtyard.** Wide avenues on a strict grid (right-hand traffic: a car lane each
way either side of a double yellow line, then a white line and a bike lane each way by the kerb, full of cyclists,
delivery e-bikes and electric tricycles), Beijing taxis (golden yellow over a coloured skirt) and red-and-white buses.
Every pavement is lined with ginkgo trees in their October gold with a carpet of yellow leaves, and rows of yellow and
blue shared bikes. Between the avenues the grey world of the hutongs: siheyuan courtyard houses (grey-brick wings with
red lattice fronts round an open yard you can see into, a red gate with 福 on the doors) appear in the hutong quarter,
round Houhai, in Dashilar and behind Wangfujing; red palace walls with yellow coping frame the imperial places.

**Clever moments.**
1. **The flag ceremony on the axis** (shots `tiananmen` then the close-up `flag`). Every lane of Chang'an Avenue (the
   street at y = 50) turns red; the cars queue at their stop lines on both sides (a car-following model with a smooth
   stop and pull-away, src/37_traffic.js); the honour guard (a flag bearer with two escorts and eight rows of three,
   rifles sloped) marches out of the Tiananmen gate's central doorway, over the middle Golden Water bridge, across the
   wide zebra on the axis to the flagpole platform in the square, halts, and the flag goes up while the crowd that has
   gathered round the platform holds up its phones and the children wave little flags. The guard stands by the pole;
   at the end of the cycle the flag comes down and the guard marches back across the held avenue. 120 s cycle,
   phased so the crossing fills its shot (the head of the column is on the road as the cut lands) and the raising its
   close-up. The crowd is a timetable too: it gathers, watches, wanders off across the square, comes back.
2. **Square dancing at the Temple of Heaven** (shot `tiantan`). Two dozen dancers with red fans follow their leader
   and a portable speaker: side steps and arm moves on the beat, and every eight seconds a brisk walk into a new
   formation (four rows, then two rings turning opposite ways, then two lines facing each other). The first change of
   formation happens 1.5 s into the shot.

## Layout (100 u grid, tiles half 37; screen: top = far)

| pos | tile | what | height |
|---|---|---|---|
| (−100,−100) top | `houhai` | Shichahai: the lake with paddle boats, a canopied boat and ducks; bars with lanterns along the far shore; the humped Yinding bridge; the Drum Tower; pedicab tours along the lake lane | Drum Tower 25 |
| (0,−100) upper right | `jingshan` | Jingshan Park: the wooded hill in three terraces with the Wanchun Pavilion on top and two shoulder pavilions; a choir at its foot, tai chi; red park walls | pavilion 24 |
| (100,−100) right | `yonghegong` | the Lama Temple: pailou and ginkgo avenue, gate hall, the smoking incense burner, worshippers and monks, the main hall, the three-storey Wanfu Pavilion | 27 |
| (−100,0) upper left | `hutong` | the hutong quarter: two crossing lanes, three siheyuan (persimmon picking, washing, dumplings), a tea shop and a noodle shop, xiangqi and birdcages under a pagoda tree, the jianbing cart; lane traffic (the hutong morning) | 9 |
| (0,0) centre | `gugong` | the Forbidden City: Tiananmen gate with lanterns and flags, the Golden Water River and bridges, the palace walls and gate, the Hall of Supreme Harmony on three marble terraces, the corner tower over the moat | 24 |
| (100,0) lower right | `wangfujing` | Wangfujing: the department store (王府井 on the roof), the snack street under its 小吃 archway, old shops, the East Church with a wedding shoot, a bookstore, the tall 王府井 street sign | 23 |
| (−100,100) left | `qianmen` | Qianmen: the Zhengyangmen arrow tower, Qianmen Street with the dangdang tram and the five-bay 前门 archway, Dashilar under its iron arch, roast duck, tea and dumpling shops, a subway entrance | 26 |
| (0,100) lower left | `tiananmen` | the square: flagpole, honour guard, the crowd, the National Day flower basket, the Monument, the Great Hall, kites, a subway exit | pole 30 |
| (100,100) bottom | `tiantan` | the Temple of Heaven: the Hall of Prayer on its round triple terrace, the square dancers, shuttlecock kickers, card players under cypresses, a man writing 福 in water | 26 |

Satellites (paint blobs off the grid): `greatwall` top left (Badaling, north-west: the wall over autumn hills, hikers),
`summerpalace` upper left (Kunming Lake, Longevity Hill and its tower, the Seventeen-Arch Bridge, the Marble Boat, a
dragon boat), `olympic` upper right (north on the axis: the Bird's Nest and the Water Cube, kites), `cbd` lower right
(east: the CCTV tower, China World, the Citic tower, traffic).

## Depth plan
- Streets are one map-wide tile; the pavements, trees and bikes belong to the places (BJ.sidewalk).
- Long walls are split at gates; base courses are drawn without a top face (a top drawn after a taller box covers it).
- The moat and the lake are ground below z 0: bank faces where the land is beyond the water, land strips drawn over
  the water's edge where the land is in front.
- Jingshan's hill is one object; its trees, pavilions and visitors are `on`. Climbers on the steps have a height
  function.
- The honour guard and the Chang'an traffic are actors that cross tiles; the crossing is checked offline with the
  guard's column as a box (tools/traffic.mjs).

## Chinese lettering
src/36_hanzi.js: a stroke table of 33 characters drawn in the standard stroke order on a 10 × 10 grid, rendered like
the engine's Latin stroke font (checked at large size with tools/glyphs.html). Words on signs: 北京 天安门 地铁 出口
胡同 茶 面 饺子 烤鸭 糖葫芦 前门 大栅栏 天坛 福 小吃 王府井 煎饼. Latin signs use K.sign (BAR, LIVE MUSIC, CAFE,
BOOKSTORE).

## Film (30 fps)
build 0 → houhai 200 → jingshan 300 → yonghegong 400 → wangfujing 500 → tiantan 600 (long: the dancers change
formation) → qianmen 750 → hutong 850 → lane close-up 950 (z 8.6) → gugong 1050 → tiananmen 1150 (the guard crosses
the held avenue) → flag close-up 1365 (z 7.2, the flag goes up) → centre 1605 → wide 1705, fade 1842, hold 1865.
