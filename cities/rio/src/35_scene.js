'use strict';
/* Rio de Janeiro: the film script. Everything place-specific lives in src/36_rio.js (the kit), src/37_traffic.js
   and src/tiles/. The Atlantic is at +x (lower right), Guanabara Bay at -y (upper right). */
const SCENE = {
  title: 'Rio de Janeiro',
  autoplay: 'build',                   // the city draws itself, then the viewer explores; no tour (R plays it; ?film records it)
  frames: 1530, hold: 1528, fade: [1505, 24],
  wide: { z: 0.83, cx: 1020, cy: 606 },
  // every shot has its own zoom: overlapping shots at one zoom would reuse each other's bakes (see pitfalls)
  shots: [
    { a: 0, z: 0.83, cx: 1020, cy: 606, name: 'build' },
    { a: 200, z: 2.3, cx: 960, cy: 200, name: 'corcovado' },
    { a: 300, z: 2.9, cx: 1310, cy: 400, name: 'centro' },
    { a: 400, z: 2.6, cx: 1560, cy: 500, name: 'paodeacucar' },
    { a: 500, z: 2.8, cx: 1380, cy: 800, name: 'copacabana' },
    { a: 600, z: 9, cx: 1420, cy: 860, name: 'praia' },
    { a: 700, z: 2.75, cx: 1130, cy: 930, name: 'ipanema' },
    { a: 800, z: 3.1, cx: 668, cy: 760, name: 'lagoa' },
    { a: 900, z: 2.85, cx: 668, cy: 385, name: 'santamarta' },
    { a: 1000, z: 3.05, cx: 960, cy: 560, name: 'lapa' },
    { a: 1100, z: 3.2, cx: 376, cy: 590, name: 'sambodromo' },
    { a: 1260, z: 8.6, cx: 380, cy: 600, name: 'desfile' },
    { a: 1370, z: 0.831, cx: 1020, cy: 606, name: 'wide' },
  ],
  boil: [0, 2, 5, 1, 4, 3, 0, 2, 5, 3, 1, 4, 2],
  visit: ['corcovado', 'centro', 'paodeacucar', 'santamarta', 'lapa', 'copacabana', 'sambodromo', 'lagoa', 'ipanema'],
  dive: { copacabana: 'praia', sambodromo: 'desfile' },
  bounds: { z: [0.5, 10], cx: [0, 2100], cy: [-120, 1200] },
};
