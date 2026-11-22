'use strict';
/* Paris: the film script. Everything place-specific lives here and in src/36_paris.js, src/tiles/. */
const SCENE = {
  title: 'Paris',
  autoplay: 'build',                   // the city draws itself, then the viewer explores; no tour (R plays it; ?film records it)
  frames: 1546, hold: 1544, fade: [1521, 24],
  wide: { z: 0.84, cx: 960, cy: 560 },
  // every shot has its own zoom: overlapping shots at one zoom would reuse each other's bakes (see pitfalls)
  shots: [
    { a: 0, z: 0.84, cx: 960, cy: 560, name: 'build' },
    { a: 200, z: 2.9, cx: 960, cy: 222, name: 'eiffel' },
    { a: 300, z: 3.22, cx: 668, cy: 432, name: 'luxembourg' },
    { a: 400, z: 3.16, cx: 384, cy: 585, name: 'cite' },
    { a: 500, z: 3.3, cx: 668, cy: 748, name: 'marais' },
    { a: 600, z: 3.5, cx: 960, cy: 893, name: 'pigalle' },
    { a: 700, z: 9, cx: 1128, cy: 722, name: 'cafe' },
    { a: 800, z: 3.24, cx: 1252, cy: 745, name: 'opera' },
    { a: 900, z: 2.95, cx: 1548, cy: 540, name: 'montmartre' },
    { a: 1000, z: 3.19, cx: 960, cy: 590, name: 'louvre' },
    { a: 1100, z: 3.36, cx: 1252, cy: 438, name: 'etoile' },
    { a: 1260, z: 1.75, cx: 960, cy: 590, name: 'centre' },
    { a: 1360, z: 0.84, cx: 960, cy: 560, name: 'wide' },
  ],
  boil: [0, 2, 5, 1, 4, 3, 0, 2, 5, 3, 1, 4, 2],
  visit: ['eiffel', 'etoile', 'montmartre', 'opera', 'pigalle', 'marais', 'cite', 'luxembourg', 'louvre'],
  dive: { opera: 'cafe' },
  bounds: { z: [0.7, 10], cx: [60, 1860], cy: [60, 1100] },
  // at night: two windows in three lit; the Seine, the fountains' basins and the sea round Mont-Saint-Michel hold the
  // lights' reflections; motes hang over the lawns (Paris's own lawn green and Versailles's)
  night: { lit: 0.66, water: ['#9DBDBC', '#7FA2A3', '#C2D8D3', '#B9D3D6'], grass: ['#B9CC8C', '#B5CF8E'] },
};
