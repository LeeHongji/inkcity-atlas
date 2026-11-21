'use strict';
/* The film script of this scene: shots, length, the ending, keys. Everything place-specific about the page lives
   here and in src/tiles/; the engine files (00..90) are the same for every scene. */
const SCENE = {
  title: 'SF',
  frames: 1546,                        // f0..f1545 at 30 fps
  hold: 1544,                          // the clock stops on this frame: later frames repeat it exactly
  fade: [1521, 24],                    // the city fades to a pale ghost from frame a over n frames
  wide: { z: 1, cx: 960, cy: 540 },    // the establishing view (wide px: the 1920x1080 frame at zoom 1)
  // a cut at each a; z = zoom, (cx, cy) = the wide-px point at the centre of the frame
  shots: [
    { a: 0, z: 1, cx: 960, cy: 540, name: 'build' },
    { a: 200, z: 2.955, cx: 659, cy: 394, name: 'bridge' },
    { a: 300, z: 3.436, cx: 960, cy: 275, name: 'wharf' },
    { a: 400, z: 2.875, cx: 1261, cy: 394, name: 'lombard' },
    { a: 500, z: 2.955, cx: 1553, cy: 558, name: 'ferry' },
    { a: 600, z: 3.114, cx: 1252, cy: 733, name: 'chinatown' },
    { a: 700, z: 3.116, cx: 960, cy: 871, name: 'oracle' },
    { a: 800, z: 3.034, cx: 668, cy: 733, name: 'dolores' },
    { a: 900, z: 3.359, cx: 376, cy: 573, name: 'ggpark' },
    { a: 1000, z: 9.28, cx: 996, cy: 558, name: 'wedding' },
    { a: 1100, z: 3.353, cx: 960, cy: 558, name: 'civic' },
    { a: 1200, z: 2.077, cx: 960, cy: 579, name: 'centre' },
    { a: 1300, z: 1, cx: 960, cy: 540, name: 'wide' },
  ],
  boil: [0, 2, 5, 1, 4, 3, 0, 2, 5, 3, 1, 4, 2],     // which of the six line drawings each shot shows (a cut re-draws the lines)
  visit: ['bridge', 'wharf', 'lombard', 'ferry', 'chinatown', 'oracle', 'dolores', 'ggpark', 'civic'],   // keys 1-9
  dive: { civic: 'wedding' },          // clicking a place you are already looking at goes in closer
  bounds: { z: [0.9, 10], cx: [120, 1800], cy: [120, 1060] },
};
