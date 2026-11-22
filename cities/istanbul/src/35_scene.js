'use strict';
/* Istanbul: the film script. Everything place-specific lives here and in src/36_istanbul.js, src/37_timetable.js,
   src/tiles/. */
const SCENE = {
  title: 'Istanbul',
  autoplay: 'build',                   // the city draws itself, then the viewer explores; no tour (R plays it; ?film records it)
  frames: 1832, hold: 1830, fade: [1807, 24],
  wide: { z: 0.84, cx: 960, cy: 585 },
  // every shot has its own zoom: overlapping shots at one zoom would reuse each other's bakes (see pitfalls)
  shots: [
    { a: 0, z: 0.84, cx: 960, cy: 585, name: 'build' },
    { a: 200, z: 2.86, cx: 960, cy: 236, name: 'galata' },
    { a: 300, z: 3.12, cx: 1252, cy: 412, name: 'karakoy' },
    { a: 400, z: 3.22, cx: 1530, cy: 572, name: 'uskudar' },
    { a: 500, z: 3.04, cx: 1262, cy: 742, name: 'kizkulesi' },
    { a: 600, z: 3.3, cx: 960, cy: 902, name: 'kadikoy' },
    { a: 700, z: 3.16, cx: 668, cy: 716, name: 'sultanahmet' },
    { a: 800, z: 3.26, cx: 380, cy: 586, name: 'bazaar' },
    { a: 900, z: 8.6, cx: 336, cy: 584, name: 'carsi' },
    { a: 1000, z: 3.08, cx: 668, cy: 404, name: 'suleymaniye' },
    { a: 1100, z: 4.3, cx: 986, cy: 430, name: 'kopru' },
    { a: 1300, z: 3.6, cx: 1040, cy: 548, name: 'eminonu' },
    { a: 1660, z: 0.838, cx: 960, cy: 585, name: 'wide' },
  ],
  boil: [0, 2, 5, 1, 4, 3, 0, 2, 5, 3, 1, 4, 2],
  visit: ['galata', 'karakoy', 'uskudar', 'suleymaniye', 'eminonu', 'kizkulesi', 'bazaar', 'sultanahmet', 'kadikoy'],
  dive: { bazaar: 'carsi', eminonu: 'kopru' },
  bounds: { z: [0.7, 10], cx: [60, 1860], cy: [40, 1120] },
  // at night (late April, about nine): two windows in three lit; the Horn, the Bosphorus and the bay (and the open water
  // round the satellites: a clear mask, their land lies on the same blob), the Sultanahmet fountain's basin carry the
  // lights' reflections; no fireflies over the lawns this early in the year (motes rise from the tulips and trees)
  night: { lit: 0.66, water: ['#8CC2C0', '#73A9AA', '#B2D9D3', '#9CCFD0', 'rgba(159,203,199,0)'], grass: [] },
};
