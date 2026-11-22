'use strict';
/* New York: the film script. Everything place-specific lives in src/36_newyork.js (the kit), src/37_traffic.js (the
   signal plan and the traffic timetable) and src/tiles/. North is +y (the lower left of the screen): we look south over
   Central Park at the near corner, Midtown in the middle, downtown and the harbour at the far top. */
const SCENE = {
  title: 'New York',
  autoplay: 'build',                   // the city draws itself, then the viewer explores; no tour (R plays it; ?film records it)
  frames: 1815, hold: 1813, fade: [1790, 24],
  wide: { z: 0.74, cx: 960, cy: 560 },
  // every shot has its own zoom: overlapping shots at one zoom would reuse each other's bakes (see pitfalls)
  shots: [
    { a: 0, z: 0.74, cx: 960, cy: 560, name: 'build' },
    { a: 200, z: 2.9, cx: 960, cy: 150, name: 'fidi' },
    { a: 300, z: 3.21, cx: 1252, cy: 410, name: 'chinatown' },
    { a: 400, z: 3.14, cx: 1544, cy: 575, name: 'village' },
    { a: 500, z: 3.3, cx: 1252, cy: 735, name: 'chelsea' },
    { a: 600, z: 2.76, cx: 960, cy: 528, name: 'empire' },
    { a: 700, z: 3.26, cx: 668, cy: 420, name: 'flatiron' },
    { a: 800, z: 3.05, cx: 376, cy: 520, name: 'grand' },
    { a: 900, z: 2.08, cx: 885, cy: 478, name: 'wave' },
    { a: 1170, z: 3.36, cx: 668, cy: 700, name: 'times' },
    { a: 1270, z: 9, cx: 642, cy: 788, name: 'steps' },
    { a: 1370, z: 3.28, cx: 960, cy: 900, name: 'park' },
    { a: 1470, z: 4.4, cx: 1628, cy: 222, name: 'liberty' },
    { a: 1570, z: 1.38, cx: 960, cy: 600, name: 'centre' },
    { a: 1660, z: 0.74, cx: 960, cy: 560, name: 'wide' },
  ],
  boil: [0, 2, 5, 1, 4, 3, 0, 2, 5, 3, 1, 4, 2, 0, 5],
  visit: ['fidi', 'chinatown', 'village', 'chelsea', 'empire', 'flatiron', 'grand', 'times', 'park'],
  dive: { times: 'steps' },
  bounds: { z: [0.6, 10], cx: [0, 1920], cy: [-60, 1160] },
  // at night (a late-spring evening): seven windows in ten lit; Times Square's shop floors and the theatre doors, Macy's
  // display windows and the Chelsea gallery always lit; the lights reflect in the harbour, the East River and the Lake;
  // the first fireflies of mid-June over the lawns (Central Park's own greens and the planted beds listed with the engine's)
  night: {
    lit: 0.7,
    windows: { '#E9D3A6': 1, '#F0DDAF': 1, '#EDE6D6': 1, '#F4F3EE': 1 },
    water: [C.water, C.waterD, C.waterL, '#9CC3D9'],
    grass: [C.grass, C.grassM, C.grassL, '#ADCB85', '#BFD99A', '#9FBF7E', '#A9C47E', '#C2D69F'],
  },
};
