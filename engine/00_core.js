'use strict';
/* core: projection, seeded noise, colour helpers.
   World units: 1 street pitch = 100 u (a tile is 74 u across with streets between). Origin = centre of the middle tile.
   +X runs to the lower right of the screen, +Y to the lower left, +Z straight up.
   "Wide px" are the pixels of the 1920x1080 wide view; every display list is stored in them. */
const SF = { tiles: [], tileBy: {}, actors: [], W: 1920, H: 1080 };
const AX = 2.92, AY = 1.59, VZ = 3.46, OX = 960, OY = 603;
const FPS = 30;

function prj(x, y, z) { return [OX + (x - y) * AX, OY + (x + y) * AY - (z || 0) * VZ]; }
/* wide px -> ground (z = 0) world coordinates */
function unprj(wx, wy) { const a = (wx - OX) / AX, b = (wy - OY) / AY; return [(a + b) / 2, (b - a) / 2]; }

/* ---------- deterministic randomness ---------- */
function hashi(n) {
  n = Math.imul(n ^ (n >>> 16), 0x7feb352d); n = Math.imul(n ^ (n >>> 15), 0x846ca68b);
  return ((n ^ (n >>> 16)) >>> 0);
}
function h1(n) { return hashi(n | 0) / 4294967296; }               // [0,1)
function h2(a, b) { return hashi((Math.imul(a | 0, 0x9e3779b1) ^ (b | 0)) + 0x632be5ab) / 4294967296; }
function hstr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function RNG(seed) {
  let a = (typeof seed === 'string' ? hstr(seed) : seed) >>> 0;
  const r = function () { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  r.range = (lo, hi) => lo + (hi - lo) * r();
  r.int = (lo, hi) => lo + Math.floor((hi - lo + 1) * r());
  r.pick = (arr) => arr[Math.floor(r() * arr.length)];
  r.sign = () => (r() < 0.5 ? -1 : 1);
  return r;
}
/* smooth 1-D value noise in [-1,1] */
function vnoise(x, seed) {
  const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
  const a = h2(i, seed) * 2 - 1, b = h2(i + 1, seed) * 2 - 1;
  return a + (b - a) * u;
}
/* smooth 2-D value noise in [0,1] */
function vnoise2(x, y, seed) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  const k = (a, b) => h2(a * 7919 + b * 104729, seed);
  const a = k(ix, iy), b = k(ix + 1, iy), c = k(ix, iy + 1), d = k(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

/* ---------- small maths ---------- */
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
const TAU = Math.PI * 2;

/* ---------- colour ---------- */
function hex2rgb(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function rgb2hex(r, g, b) { return '#' + ((1 << 24) | (clamp(Math.round(r), 0, 255) << 16) | (clamp(Math.round(g), 0, 255) << 8) | clamp(Math.round(b), 0, 255)).toString(16).slice(1); }
/* mix two hex colours */
function mix(a, b, t) { const A = hex2rgb(a), B = hex2rgb(b); return rgb2hex(lerp(A[0], B[0], t), lerp(A[1], B[1], t), lerp(A[2], B[2], t)); }
/* darker / lighter in a paint-like way (towards a warm dark / towards paper) */
function shade(c, t) { return t >= 0 ? mix(c, '#3A3226', t) : mix(c, '#F6F3EA', -t); }

/* ---------- palette (approximate targets decoded from the reference) ---------- */
const C = {
  paper: '#F0EEE4', ink: '#2C271C', ink2: '#5E574A', ink3: '#8C8576',
  street: '#DDD7C9', streetMark: '#EDE8DC', dash: '#D9B44A', kerb: '#E9E5DA', pave: '#EAE7DC', paveScuff: '#F7F5EE',
  grass: '#B5CF8E', grassM: '#95B16B', grassD: '#788F53', grassL: '#C6DBA0',
  water: '#AACBE3', waterD: '#8BA3BD', waterL: '#C9DFEE', foam: '#F6F7F3',
  slab: '#D7C2A5', slabD: '#B4A58D', earth: '#C9B79B', earthD: '#AD9C82',
  wall: '#F1EFE8', wallM: '#E3E0D6', wallD: '#CFCCC1', stone: '#DAD6CA',
  red: '#BF5B49', redD: '#A34635', redL: '#CE7265', redDeep: '#713B2A', intl: '#D4553A', intlD: '#B9432C', intlL: '#E06A4C',
  navy: '#434D58', navyD: '#2F3740', glass: '#CFE0EA', glassD: '#9DB6C8',
  gold: '#DAAD45', goldM: '#B3A467', teal: '#5B9086', tealL: '#67AD8B', tealD: '#42706A',
  concrete: '#BCBEBA', concreteD: '#A1A39F', wood: '#C9A26B', woodD: '#A07C4C', trunk: '#A0714B', trunkD: '#7C5638',
  leaf: '#8DB868', leafD: '#6E9A50', leafL: '#A6CB7E', leafInk: '#4B6B36', cyp: '#4F7A4A', cypD: '#3C6038',
  dome: '#B9CDE0', domeD: '#93A9C4', sand: '#EBDDB5', pink: '#EDA9BD', pinkD: '#D98AA4', lav: '#B9A7D6', butter: '#EBD98C', mint: '#B5DCC2', sky: '#A9CDE6', rose: '#E7A9A0',
  white: '#F8F7F2', black: '#2A2622', yellow: '#E9C543', orange: '#E08A3C', purple: '#9A7CC0', blue: '#5E8FC9', blueD: '#3F6FA8', green: '#6FAE6A', brown: '#8A5A3A', brick: '#B5624B', brickD: '#96503E',
};
const SKIN = ['#F2D3B8', '#E8BE9A', '#D9A57B', '#C08A5E', '#A06B45', '#7A4E33', '#5F3D2A'];
const HAIR = ['#2B2420', '#3D2B1F', '#5A3A24', '#7B4E2C', '#A8743D', '#D9B560', '#B24A2E', '#8E8A84', '#1F2A3C'];
const CLOTH = ['#C9584B', '#DD8E4A', '#E6C24F', '#8FBF73', '#5FA58F', '#5F8FC9', '#3F5F8F', '#8E79C0', '#D98AA4', '#F0EDE4', '#3B3F47', '#B9A27D', '#7FB7D9', '#A4C66B', '#E7A9A0', '#6C7A89'];
