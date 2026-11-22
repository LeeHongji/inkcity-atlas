'use strict';
/* Lisbon: the film script. Everything place-specific lives here and in src/36_lisbon.js, src/37_traffic.js, src/tiles/. */
const SCENE = {
  title: 'Lisbon',
  autoplay: 'build',                   // the city draws itself, then the viewer explores; no tour (R plays it; ?film records it)
  frames: 1546, hold: 1544, fade: [1521, 24],
  wide: { z: 0.83, cx: 790, cy: 668 },
  // every shot has its own zoom: overlapping shots at one zoom would reuse each other's bakes (see pitfalls)
  shots: [
    { a: 0, z: 0.83, cx: 790, cy: 668, name: 'build' },
    { a: 200, z: 2.9, cx: 960, cy: 250, name: 'estrela' },
    { a: 300, z: 3.22, cx: 1252, cy: 430, name: 'arraial' },
    { a: 400, z: 3.16, cx: 1530, cy: 570, name: 'graca' },
    { a: 500, z: 3.3, cx: 1252, cy: 730, name: 'castelo' },
    { a: 600, z: 3.36, cx: 860, cy: 858, name: 'alfama' },
    { a: 810, z: 3.24, cx: 668, cy: 760, name: 'comercio' },
    { a: 910, z: 3.05, cx: 335, cy: 622, name: 'belem' },
    { a: 1010, z: 9, cx: 1249, cy: 446, name: 'sardines' },
    { a: 1110, z: 3.28, cx: 645, cy: 462, name: 'bica' },
    { a: 1210, z: 3.19, cx: 960, cy: 580, name: 'rossio' },
    { a: 1310, z: 1.6, cx: 960, cy: 640, name: 'centre' },
    { a: 1410, z: 0.83, cx: 790, cy: 668, name: 'wide' },
  ],
  boil: [0, 2, 5, 1, 4, 3, 0, 2, 5, 3, 1, 4, 2],
  visit: ['estrela', 'arraial', 'graca', 'bica', 'rossio', 'castelo', 'belem', 'comercio', 'alfama'],
  dive: { arraial: 'sardines' },
  bounds: { z: [0.65, 10], cx: [-200, 1800], cy: [60, 1260] },
  // at night (the 12th of June, Santo António): the Tagus, the ponds and fountain basins and the Oceanário's water carry
  // the lights' reflections; the sardine braziers' embers keep their glow; motes over the lawns; most windows lit
  night: {
    water: ['#8DBFC3', '#A8CDD0'],
    glow: ['#F07A2A'],
    grass: ['#B4CC86', '#B5CF8E', '#95B16B', '#C6DBA0'],
    lit: 0.68,
  },
};
