'use strict';
/* Tokyo: the film script. Everything place-specific lives here and in src/36_tokyo.js, src/tiles/. */
const SCENE = {
  title: 'Tokyo',
  autoplay: 'build',                   // the city draws itself, then the viewer explores; no tour (R plays it; ?film records it)
  frames: 1546, hold: 1544, fade: [1521, 24],
  wide: { z: 0.84, cx: 960, cy: 560 },
  // every shot has its own zoom: overlapping shots at one zoom would reuse each other's bakes (see pitfalls)
  shots: [
    { a: 0, z: 0.84, cx: 960, cy: 560, name: 'build' },
    { a: 200, z: 2.9, cx: 960, cy: 228, name: 'tower' },
    { a: 300, z: 3.22, cx: 1252, cy: 418, name: 'station' },
    { a: 400, z: 3.16, cx: 1544, cy: 570, name: 'akiba' },
    { a: 500, z: 3.34, cx: 1252, cy: 748, name: 'shitamachi' },
    { a: 600, z: 3.28, cx: 960, cy: 905, name: 'tsukiji' },
    { a: 700, z: 9, cx: 826, cy: 1003, name: 'gado' },
    { a: 800, z: 3.24, cx: 668, cy: 735, name: 'sensoji' },
    { a: 900, z: 3.31, cx: 376, cy: 590, name: 'sumida' },
    { a: 1000, z: 3.19, cx: 668, cy: 425, name: 'meiji' },
    { a: 1100, z: 3.36, cx: 960, cy: 560, name: 'shibuya' },
    { a: 1250, z: 1.75, cx: 960, cy: 590, name: 'centre' },
    { a: 1360, z: 0.84, cx: 960, cy: 560, name: 'wide' },
  ],
  boil: [0, 2, 5, 1, 4, 3, 0, 2, 5, 3, 1, 4, 2],
  visit: ['tower', 'station', 'akiba', 'shitamachi', 'tsukiji', 'sensoji', 'sumida', 'meiji', 'shibuya'],
  dive: { tsukiji: 'gado' },
  bounds: { z: [0.7, 10], cx: [60, 1860], cy: [60, 1100] },
  // at night: lit shop floors and izakaya interiors are always lit; two windows in three are lit
  night: { windows: { '#E9D3A6': 1, '#E9C48A': 1 }, lit: 0.66 },
};
