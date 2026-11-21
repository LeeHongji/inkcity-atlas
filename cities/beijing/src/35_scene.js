'use strict';
/* Beijing: the film script. Everything place-specific lives here and in src/36_hanzi.js (the Chinese stroke table),
   src/36_beijing.js (the kit), src/37_traffic.js (traffic and the flag ceremony clock) and src/tiles/. */
const SCENE = {
  title: 'Beijing 北京',
  autoplay: 'build',                   // the city draws itself, then the viewer explores; no tour (R plays it; ?film records it)
  frames: 1867, hold: 1865, fade: [1842, 24],
  wide: { z: 0.8, cx: 990, cy: 505 },
  // every shot has its own zoom: overlapping shots at one zoom would reuse each other's bakes (see pitfalls)
  shots: [
    { a: 0, z: 0.8, cx: 990, cy: 505, name: 'build' },
    { a: 200, z: 3.05, cx: 960, cy: 268, name: 'houhai' },
    { a: 300, z: 3.12, cx: 1252, cy: 425, name: 'jingshan' },
    { a: 400, z: 3.18, cx: 1530, cy: 572, name: 'yonghegong' },
    { a: 500, z: 3.26, cx: 1252, cy: 742, name: 'wangfujing' },
    { a: 600, z: 3.34, cx: 985, cy: 895, name: 'tiantan' },            // the square dancers change formation 1.5 s in
    { a: 750, z: 3.08, cx: 390, cy: 585, name: 'qianmen' },
    { a: 850, z: 3.3, cx: 668, cy: 425, name: 'hutong' },
    { a: 950, z: 8.6, cx: 668, cy: 448, name: 'lane' },                // close-up: the hutong morning
    { a: 1050, z: 3.0, cx: 960, cy: 560, name: 'gugong' },
    { a: 1150, z: 3.38, cx: 790, cy: 690, name: 'tiananmen' },         // the honour guard crosses the held avenue
    { a: 1365, z: 7.2, cx: 714, cy: 688, name: 'flag' },               // close-up: the flag goes up
    { a: 1605, z: 1.7, cx: 960, cy: 640, name: 'centre' },
    { a: 1705, z: 0.8, cx: 990, cy: 505, name: 'wide' },
  ],
  boil: [0, 2, 5, 1, 4, 3, 0, 2, 5, 3, 1, 4, 2, 0],
  visit: ['houhai', 'jingshan', 'yonghegong', 'hutong', 'gugong', 'wangfujing', 'qianmen', 'tiananmen', 'tiantan'],
  dive: { hutong: 'lane', tiananmen: 'flag' },
  bounds: { z: [0.65, 10], cx: [60, 1860], cy: [-40, 1100] },
};
