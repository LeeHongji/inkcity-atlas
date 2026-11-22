'use strict';
/* Chongqing: the film script. Everything place-specific lives in src/36_chongqing.js, src/37_hanzi.js,
   src/38_traffic.js and src/tiles/. */
const SCENE = {
  title: 'Chongqing 重庆',
  autoplay: 'build',                   // the city draws itself, then the viewer explores; no tour (R plays it; ?film records it)
  frames: 1546, hold: 1544, fade: [1521, 24],
  wide: { z: 0.8, cx: 960, cy: 600 },
  shots: [
    { a: 0, z: 0.8, cx: 960, cy: 600, name: 'build' },
    { a: 200, z: 2.95, cx: 960, cy: 165, name: 'eling' },
    { a: 300, z: 3.12, cx: 1240, cy: 400, name: 'kuixing' },
    { a: 400, z: 3.05, cx: 1575, cy: 505, name: 'liziba' },
    { a: 600, z: 3.2, cx: 1275, cy: 700, name: 'hongyadong' },
    { a: 700, z: 2.85, cx: 1010, cy: 965, name: 'chaotianmen' },
    { a: 800, z: 3.3, cx: 668, cy: 700, name: 'shibati' },
    { a: 900, z: 8.5, cx: 642, cy: 745, name: 'climb' },
    { a: 1000, z: 2.6, cx: 300, cy: 650, name: 'suodao' },
    { a: 1150, z: 3.22, cx: 668, cy: 430, name: 'huoguo' },
    { a: 1250, z: 3.35, cx: 960, cy: 560, name: 'jiefangbei' },
    { a: 1360, z: 0.81, cx: 960, cy: 600, name: 'wide' },
  ],
  boil: [0, 2, 5, 1, 4, 3, 0, 2, 5, 3, 1, 4],
  visit: ['eling', 'kuixing', 'liziba', 'huoguo', 'jiefangbei', 'hongyadong', 'suodao', 'shibati', 'chaotianmen'],
  dive: { shibati: 'climb' },
  bounds: { z: [0.7, 10], cx: [60, 1860], cy: [60, 1100] },
  // at night: flats two windows in three lit; shop floors, Hongyadong's halls, the old houses' paper lattices and the
  // stilt houses mostly lit; the lights reflect in the green Jialing and the brown Yangtze; no lawn fireflies in March
  night: {
    lit: 0.66,
    windows: {
      '#56606A': 0.66, '#5E6872': 0.66,                       // flats (CQ.block, Kuixing, Liziba)
      '#4A4744': 1, '#4E4A44': 1, '#4E555B': 1, '#E9C98A': 1,  // shop floors, lobbies, the shops in Liziba's wall
      '#F4C96A': 1, '#E9DEC0': 1,                              // Hongyadong's halls (and the cableway's ticket window)
      '#EFE6CF': 0.85, '#E8DDC0': 0.8, '#DCD0B2': 0.75, '#F2D58A': 1,   // old houses' lattices, stilt houses, the pavilion's gallery
    },
    water: ['#9FC2B3', '#BFAE8E'],                            // CQC.jl, CQC.yz
    grass: [],
  },
};
