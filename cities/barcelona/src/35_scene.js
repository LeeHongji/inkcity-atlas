'use strict';
/* Barcelona: the film script. Everything place-specific lives in src/36_barcelona.js (the kit) and src/tiles/.
   North is up the screen: +x runs south-east towards the sea, +y south-west. */
const SCENE = {
  title: 'Barcelona',
  autoplay: 'build',                   // the city draws itself, then the viewer explores; no tour (R plays it; ?film records it)
  frames: 1670, hold: 1668, fade: [1645, 24],
  wide: { z: 0.8, cx: 1000, cy: 560 },
  // every shot has its own zoom: overlapping shots at one zoom would reuse each other's bakes (see pitfalls)
  shots: [
    { a: 0, z: 0.8, cx: 1000, cy: 560, name: 'build' },
    { a: 200, z: 2.9, cx: 960, cy: 262, name: 'parkguell' },
    { a: 300, z: 2.62, cx: 1262, cy: 390, name: 'sagrada' },
    { a: 400, z: 3.12, cx: 1580, cy: 600, name: 'barceloneta' },
    { a: 500, z: 3.06, cx: 1000, cy: 860, name: 'port' },
    { a: 600, z: 3.3, cx: 668, cy: 745, name: 'rambla' },
    { a: 700, z: 9, cx: 652, cy: 694, name: 'boqueria' },
    { a: 800, z: 3.18, cx: 376, cy: 575, name: 'montjuic' },
    { a: 900, z: 3.24, cx: 668, cy: 430, name: 'gracia' },
    { a: 1000, z: 3.2, cx: 960, cy: 560, name: 'passeig' },
    { a: 1100, z: 3.4, cx: 1252, cy: 700, name: 'gotic' },
    { a: 1292, z: 8.4, cx: 1250, cy: 714, name: 'aleta' },
    { a: 1388, z: 2.55, cx: 1252, cy: 720, name: 'castell' },
    { a: 1508, z: 0.8, cx: 1000, cy: 560, name: 'wide' },
  ],
  boil: [0, 2, 5, 1, 4, 3, 0, 2, 5, 3, 1, 4, 2, 0],
  visit: ['parkguell', 'sagrada', 'barceloneta', 'gracia', 'passeig', 'gotic', 'montjuic', 'rambla', 'port'],
  dive: { rambla: 'boqueria', gotic: 'aleta' },
  bounds: { z: [0.6, 10], cx: [0, 2000], cy: [-80, 1180] },
  // at night: two windows in three lit; the sea along the coast and in Port Vell's basin, the Magic Fountain's basin and
  // the pond at Glòries hold the lights' reflections; fireflies hang over the lawns and Park Güell's hillside
  night: { lit: 0.66, water: ['#93C6CB', '#9FC9D2', '#AACBE3'], grass: ['#B7CC8E', '#BCD093', '#C9D39A'] },
};
