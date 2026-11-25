'use strict';
/* Tokyo: the film script. Everything place-specific lives here and in src/36_tokyo.js, src/tiles/. */
const SCENE = {
  title: 'Tokyo',
  // the pen and the paint: a finer line than the engine's default, and colours a little richer than written (engine:
  // SCENE.ink, SCENE.grade), so the landmarks' reds, the lawns and the signs read bright against the paper
  ink: 0.8, grade: { chroma: 1.35, deep: 0.22 },
  // six hundred lively people and cars: only their first four poses are drawn when the city is built (or rebuilt for a
  // season); the rest are drawn while the page is idle (engine: SCENE.sampleKeys)
  sampleKeys: 4,
  // drawn at the screen's own resolution up to 3456 px across (the engine's default stops at 2880): a laptop's 2x screen
  // is drawn pixel for pixel, a 1920-wide 2x screen at 90%; wider costs more GPU memory than it gains
  maxCanvas: 3456,
  // room for every pose of the people on screen at that size (engine default 32 MP)
  poseBudget: 48e6,
  // at night the glow of thousands of lights is drawn at half size and added on (engine: SCENE.lightRes)
  lightRes: 0.5,
  // people seen from afar are packed onto a few shared pages (engine: SCENE.poseAtlas)
  poseAtlas: true,
  // a small prop wholly on the far side of a person never stands in front of them (engine: SCENE.strictProps)
  strictProps: true,
  // a person is never drawn over a nearer person they overlap (engine: SCENE.slotChain)
  slotChain: true,
  autoplay: 'build',                   // the city draws itself, then the viewer explores; no tour (R plays it; ?film records it)
  // its own season is cherry-blossom week; S (or ?season=) builds the last Saturday of July (the Sumida fireworks), the
  // last week of November, and the first week of January
  season: 'spring', seasons: ['spring', 'summer', 'autumn', 'winter'],
  // the air of each season (engine: drawAir): petals from every cherry in bloom, leaves from every turned tree, the sun
  // glinting on the river in July, and on 6 January a snow day (as on 6 January 2022, when 10 cm fell on central Tokyo)
  air: { spring: { fall: ['petal'] }, summer: { glint: true }, autumn: { fall: ['leaf'] }, winter: { snow: 1, cover: 0.9 } },
  // the zoysia lawns: lush in July, going to straw in late November, dormant and brown in January (and under snow)
  palette: {
    summer: { '#C9DBA5': '#B9D595', '#B5CF8E': '#A2C779', '#B9CF94': '#A7CA80', '#C6DBA0': '#B4D38C', '#8DB868': '#77A657', '#A6CB7E': '#8EBB69' },
    autumn: { '#C9DBA5': '#D6D2A0', '#B5CF8E': '#C8C48A', '#B9CF94': '#CBC68E', '#C6DBA0': '#D9D39E', '#95B16B': '#AAA266', '#788F53': '#8F8650' },
    winter: { '#C9DBA5': '#D6CCA4', '#B5CF8E': '#C4B78C', '#B9CF94': '#C7BA8E', '#C6DBA0': '#D6CCA2', '#95B16B': '#A59766', '#788F53': '#8A7C52' },
  },
  frames: 1546, hold: 1544, fade: [1521, 24],
  wide: { z: 0.84, cx: 960, cy: 540 },
  // every shot has its own zoom: overlapping shots at one zoom would reuse each other's bakes (see pitfalls)
  shots: [
    { a: 0, z: 0.84, cx: 960, cy: 540, name: 'build' },
    { a: 200, z: 2.15, cx: 960, cy: 165, name: 'tower' },
    { a: 300, z: 3.5, cx: 1262, cy: 388, name: 'station' },
    { a: 400, z: 3.16, cx: 1544, cy: 560, name: 'akiba' },
    { a: 500, z: 3.34, cx: 1252, cy: 748, name: 'shitamachi' },
    { a: 600, z: 3.28, cx: 960, cy: 905, name: 'tsukiji' },
    { a: 700, z: 9, cx: 826, cy: 1003, name: 'gado' },
    { a: 800, z: 3.24, cx: 668, cy: 705, name: 'sensoji' },
    { a: 900, z: 3.31, cx: 376, cy: 590, name: 'sumida' },
    { a: 1000, z: 3.19, cx: 668, cy: 425, name: 'meiji' },
    { a: 1100, z: 3.36, cx: 960, cy: 560, name: 'shibuya' },
    { a: 1250, z: 1.75, cx: 960, cy: 590, name: 'centre' },
    { a: 1360, z: 0.84, cx: 960, cy: 540, name: 'wide' },
  ],
  boil: [0, 2, 5, 1, 4, 3, 0, 2, 5, 3, 1, 4, 2],
  visit: ['tower', 'station', 'akiba', 'shitamachi', 'tsukiji', 'sensoji', 'sumida', 'meiji', 'shibuya'],
  dive: { tsukiji: 'gado' },
  bounds: { z: [0.7, 10], cx: [60, 1860], cy: [60, 1100] },
  // at night: lit shop floors and izakaya interiors are always lit; two windows in three are lit
  night: { windows: { '#E9D3A6': 1, '#E9C48A': 1 }, lit: 0.66 },
};
