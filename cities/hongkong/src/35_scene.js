'use strict';
/* Hong Kong: the film script. Everything place-specific lives here and in src/36_zh.js (the stroke table),
   src/36_hongkong.js (the kit), src/37_timetable.js (roads, trams, ferries, boats) and src/tiles/. */
const SCENE = {
  title: 'Hong Kong 香港',
  autoplay: 'build',                   // the city draws itself, then the viewer explores; no tour (R plays it; ?film records it)
  frames: 1832, hold: 1830, fade: [1807, 24],
  wide: { z: 0.84, cx: 960, cy: 560 },
  // every shot has its own zoom: overlapping shots at one zoom would reuse each other's bakes (see pitfalls)
  shots: [
    { a: 0, z: 0.84, cx: 960, cy: 560, name: 'build' },
    { a: 200, z: 2.96, cx: 1252, cy: 372, name: 'peak' },
    { a: 300, z: 6.2, cx: 1268, cy: 420, name: 'peaktram' },
    { a: 400, z: 3.08, cx: 1530, cy: 548, name: 'midlevels' },
    { a: 500, z: 3.24, cx: 960, cy: 248, name: 'wanchai' },
    { a: 600, z: 3.14, cx: 668, cy: 410, name: 'causeway' },
    { a: 700, z: 3.04, cx: 380, cy: 560, name: 'choihung' },
    { a: 800, z: 3.28, cx: 960, cy: 868, name: 'mongkok' },
    { a: 900, z: 9, cx: 752, cy: 846, name: 'temple' },
    { a: 1000, z: 3.2, cx: 668, cy: 730, name: 'tst' },
    { a: 1100, z: 3.18, cx: 1252, cy: 720, name: 'sheungwan' },
    { a: 1200, z: 2.9, cx: 960, cy: 540, name: 'central' },
    { a: 1300, z: 5.3, cx: 826, cy: 676, name: 'ferry' },
    { a: 1660, z: 0.838, cx: 960, cy: 560, name: 'wide' },
  ],
  boil: [0, 2, 5, 1, 4, 3, 0, 2, 5, 3, 1, 4, 2, 0],
  visit: ['peak', 'midlevels', 'wanchai', 'causeway', 'central', 'sheungwan', 'choihung', 'tst', 'mongkok'],
  dive: { peak: 'peaktram', mongkok: 'temple', tst: 'ferry', central: 'ferry' },
  bounds: { z: [0.7, 10], cx: [60, 1860], cy: [40, 1120] },
  // at night (December, about seven): the lit shop floors always lit, two windows in three lit; the harbour's water
  // reflects every light on its shores; lawns and the hill hold fireflies
  night: {
    windows: { '#F2DDA8': 1, '#F6E2A8': 1 },
    water: ['#9BBABA', '#86A6A8', '#B9CFCB', '#9DBDC3'],
    grass: ['#B5CF8E', '#A9C98A', '#9DBF7E', '#C7D1AE'],
    lit: 0.66,
  },
};
