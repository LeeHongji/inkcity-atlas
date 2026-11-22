'use strict';
/* Venice: the film script. Everything place-specific lives here and in src/36_venice.js .. 39_bridges.js, src/tiles/. */
const SCENE = {
  title: 'Venice Venezia',
  autoplay: 'build',                   // the city draws itself, then the viewer explores; no tour (R plays it; ?film records it)
  frames: 1616, hold: 1614, fade: [1591, 24],
  wide: { z: 0.8, cx: 960, cy: 575 },
  // every shot has its own zoom: overlapping shots at one zoom would reuse each other's bakes (see pitfalls)
  shots: [
    { a: 0, z: 0.8, cx: 960, cy: 575, name: 'build' },
    { a: 200, z: 2.9, cx: 960, cy: 262, name: 'zanipolo' },
    { a: 300, z: 3.22, cx: 1252, cy: 425, name: 'formosa' },
    { a: 400, z: 3.16, cx: 1544, cy: 585, name: 'riva' },
    { a: 500, z: 3.3, cx: 960, cy: 895, name: 'salute' },
    { a: 600, z: 3.4, cx: 668, cy: 742, name: 'mercato' },
    { a: 700, z: 9, cx: 742, cy: 410, name: 'campo' },
    { a: 800, z: 3.24, cx: 376, cy: 585, name: 'squero' },
    { a: 900, z: 3.31, cx: 668, cy: 425, name: 'cannaregio' },
    { a: 1000, z: 3.19, cx: 862, cy: 640, name: 'rialto' },
    { a: 1100, z: 3.36, cx: 1252, cy: 740, name: 'sanmarco' },
    { a: 1330, z: 1.75, cx: 960, cy: 600, name: 'centre' },
    { a: 1430, z: 0.8, cx: 960, cy: 575, name: 'wide' },
  ],
  boil: [0, 2, 5, 1, 4, 3, 0, 2, 5, 3, 1, 4, 2],
  visit: ['zanipolo', 'formosa', 'riva', 'sanmarco', 'salute', 'mercato', 'squero', 'cannaregio', 'rialto'],
  dive: { cannaregio: 'campo' },
  bounds: { z: [0.65, 10], cx: [60, 1860], cy: [60, 1100] },
  // at night: the canals' green water (and their mouths, the strips under the far banks' walls) and the open lagoon
  // (a clear mask: the lagoon's own fill runs on under the places) carry the lights' reflections; two windows in three lit
  night: { water: ['#8DB2A2', mix('#8DB2A2', '#A6C2BA', 0.5), '#7EA393', '#789D8E', 'rgba(166,194,186,0)'], lit: 0.66 },
};
