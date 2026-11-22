'use strict';
/* London: the film script. Everything place-specific lives here and in src/36_london.js, src/37_timetable.js, src/tiles/. */
const SCENE = {
  title: 'London',
  autoplay: 'build',                   // the city draws itself, then the viewer explores; no tour (R plays it; ?film records it)
  frames: 1966, hold: 1964, fade: [1941, 24],
  wide: { z: 0.86, cx: 952, cy: 598 },
  // every shot has its own zoom: overlapping shots at one zoom would reuse each other's bakes (see pitfalls)
  shots: [
    { a: 0, z: 0.86, cx: 952, cy: 598, name: 'build' },
    { a: 200, z: 3.18, cx: 668, cy: 410, name: 'westminster' },
    { a: 300, z: 3.02, cx: 952, cy: 262, name: 'palace' },
    { a: 470, z: 3.26, cx: 1252, cy: 400, name: 'trafalgar' },
    { a: 570, z: 2.78, cx: 1530, cy: 520, name: 'city' },
    { a: 670, z: 3.31, cx: 1258, cy: 738, name: 'katharine' },
    { a: 770, z: 2.88, cx: 962, cy: 840, name: 'borough' },
    { a: 870, z: 9, cx: 975, cy: 998, name: 'pub' },
    { a: 970, z: 3.14, cx: 676, cy: 700, name: 'southbank' },
    { a: 1070, z: 3.06, cx: 392, cy: 560, name: 'battersea' },
    { a: 1170, z: 3.36, cx: 952, cy: 578, name: 'tower' },
    { a: 1270, z: 3.44, cx: 975, cy: 712, name: 'tbridge' },
    { a: 1700, z: 1.62, cx: 960, cy: 640, name: 'centre' },
    { a: 1810, z: 0.858, cx: 952, cy: 598, name: 'wide' },
  ],
  boil: [0, 2, 5, 1, 4, 3, 0, 2, 5, 3, 1, 4, 2, 0],
  visit: ['westminster', 'palace', 'trafalgar', 'city', 'tower', 'katharine', 'battersea', 'southbank', 'borough'],
  dive: { borough: 'pub', tower: 'tbridge' },
  bounds: { z: [0.7, 10], cx: [60, 1860], cy: [40, 1120] },
  // at night: the open Thames (a clear fill over the water the view shows: LK.C.WMASK), St Katharine's dock, the lake in
  // St James's Park and the rain's puddles carry the lights' reflections (the Thames's own colour is left out: the south
  // bank's ground hides part of that fill, and lights there would reflect on the promenade); motes over London's lawns;
  // two windows in three lit
  night: {
    water: ['rgba(163,189,189,0)', '#9DB9BC', '#8EABAE', '#A9C6C9', '#7FA0A3', '#C9DCE6', '#B3C9D6'],
    grass: ['#A8CB7E', '#A9CC7E', '#A6C97C', '#B5CF8E', '#B9CF8E'],
    lit: 0.66,
  },
};
