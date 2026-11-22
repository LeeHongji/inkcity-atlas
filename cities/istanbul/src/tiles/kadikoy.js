'use strict';
/* (100,100) Kadıköy market, on the Asian shore. What it is: the market quarter behind the Kadıköy pier. Two rows of
   three- and four-storey buildings close it on the far sides (north and west), every ground floor a shop with its
   goods spilling out: the fishmonger's marble counter of fish on ice under red lamps, the pickle shop's window of
   coloured jars, Turkish delight in towers, cheese wheels, coffee, a bookshop, a meyhane. Inside the square, rows of
   stalls under striped awnings — greens and fruit, olives, spices, flowers — and in the near corner the bronze bull of
   Kadıköy on its plinth, the meeting point, with people photographing it. Plane trees, benches, and cats everywhere.
   Who is there: shoppers with bags, sellers calling, a street musician with his saz, an old man feeding the cats, a
   simit seller, a tea boy. What moves: shoppers, cats, the tea boy, pigeons. */
SF.tile('kadikoy', 100, 100, { rim: 44 }, function (T) {
  const W0 = -28, H = 37;
  T.ground(function (g) {
    IS.ground(g, W0, -H, H, H, '#E6DECC', { cut: 'xy' });
    IS.paving(g, W0, -H, H, H, { len: 2.2, dens: 0.6 });
    g.fill(K.rect(-15, -22, H, H), '#E9E2D2');
    const sl = []; for (let x = -12; x < H; x += 3.5) { const a = g.p(x, -22, 0.01), b = g.p(x, H, 0.01); sl.push(a[0], a[1], b[0], b[1]); } g.segs2(sl, '#DCD3C0', 0.3);
  }, { rim: true });

  /* ---- the far rows of buildings, shops on their inner faces ---- */
  const north = [[-27, -16, 4, { word: 'BALIKÇI', sign: '#2E5E8A', aw: '#2E5E8A' }, 'fish'], [-14, -2, 3, { word: 'TURŞU', sign: '#7A2E3A', lit: '#E9C46A' }, 'jars'], [0, 12, 4, { word: 'LOKUM', sign: '#B8322A', aw: '#E9E2D2', stripe: '#B8322A' }, 'delight'], [14, 24, 3, { word: 'KAHVE', sign: '#6E4A33', aw: '#6E4A33' }, null], [26, 36, 4, { word: 'PEYNİR', sign: '#E6C24F' }, 'cheese']];
  north.forEach(([a, b, f, shop, goods], i) => T.obj([a, -36, b, -24], (g) => {
    if (f >= 4) IS.apt(g, a, -36, b, -24, { floors: f, fh: 3.9, col: ['#E7DCC6', '#E3C9B5', '#D9CDB8', '#EAD9BE', '#E5D0B5'][i], shops: [Object.assign({ goods: IS.kadikoyGoods(goods) }, shop)], faces: ['L', 'R'] });
    else IS.konak(g, a, -36, b, -24, { floors: f, col: IS.WALLS[(i + 3) % IS.WALLS.length], shop: Object.assign({ goods: IS.kadikoyGoods(goods) }, shop) });
  }, { name: 'shop' }));
  const west = [[-21, -9, 3, { word: 'FIRIN', sign: '#6E4A33', aw: '#C9A26B' }, 'bread'], [-7, 6, 4, { word: 'KİTAP', sign: '#2E6E5A' }, null], [8, 20, 3, { word: 'MEYHANE', sign: '#7A2E3A', aw: '#7A2E3A' }, null], [22, 35, 3, { word: 'BAKKAL', sign: '#3F6E5E', aw: '#E9E2D2', stripe: '#3F6E5E' }, 'veg']];
  west.forEach(([a, b, f, shop, goods], i) => T.obj([-27, a, -17, b], (g) => {
    if (f >= 4) IS.apt(g, -27, a, -17, b, { floors: f, fh: 3.9, col: '#DDD3C1', shops: [Object.assign({ goods: IS.kadikoyGoods(goods) }, shop)], faces: ['R', 'L'] });
    else IS.konak(g, -27, a, -17, b, { floors: f, col: IS.WALLS[(i + 6) % IS.WALLS.length], shop: null, cumba: false });
    if (f < 4) IS.shop(g, 'R', -17, a + 1, b - 1, Object.assign({ z1: 3.8, goods: IS.kadikoyGoods(goods) }, shop));
  }, { name: 'shop' }));

  /* ---- the market stalls in rows ---- */
  const STALLS = [[-8, -15, '#B8322A', 'veg'], [3, -15, '#2E6E5A', 'fruit'], [14, -15, '#E3A72F', 'olive'], [25, -15, '#2E5E8A', 'flower'], [-8, -3, '#2E6E5A', 'spice'], [3, -3, '#B8322A', 'veg'], [14, -3, '#7A2E3A', 'fruit']];
  STALLS.forEach(([x, y, a, kind], i) => T.obj([x - 2.4, y - 3.8, x + 2.4, y + 3.8], (g) => IS.stallLit(g, x, y, 'R', 1.8, () => K.stall(g, x, y, { face: 'R', L: 3.4, D: 1.8, a, b: '#F3F1EA', goods: (g2, D, L) => { const R = RNG(i * 13 + 5), cols = kind === 'veg' ? ['#6FAE6A', '#C9584B', '#E3A72F', '#8FBF73'] : kind === 'fruit' ? ['#E8573A', '#E3A72F', '#C9584B', '#F2C64A'] : kind === 'olive' ? ['#4A5A30', '#6E7A3A', '#2E2A26', '#8A7A3A'] : kind === 'flower' ? ['#E77FA0', '#D9443A', '#EBC03F', '#8A4FA0', '#F0EBDF'] : ['#B8322A', '#E3A72F', '#C9662E', '#7A2E3A']; for (let k = 0; k < 14; k++) { const p = g2.p(D - 0.6 - R() * 2.4, -L + 0.4 + R() * (2 * L - 0.8), 2.75); g2.disc2([p[0], p[1] - 0.5], 0.75, R.pick(cols)); } } })), { name: 'stall' }));
  // sellers at the stall ends, customers in front
  STALLS.forEach(([x, y], i) => { T.cast([x + 2.6, y - 4.2], (g) => IS.person(g, x + 2.6, y - 4.2, 0, IS.who(2100 + i, { dir: 1, pose: i % 3 === 0 ? 'wave' : 'hold', ph: 0.25, scarf: i % 4 === 1 ? '#5A6B5A' : undefined })), { name: 'seller' }); if (i % 2 === 0) T.cast([x + 4.4, y + 1], (g) => IS.person(g, x + 4.4, y + 1, 0, IS.who(2120 + i, { dir: 2, pose: 'hold' })), { name: 'customer' }); });

  /* ---- the near rows: fish stalls on ice and a flower seller ---- */
  for (const [x0, y0, x1, y1, aw, seed] of [[-6, 24, -1.5, 30, '#B8322A', 1], [3, 24, 7.5, 30, '#2E5E8A', 2], [26, 2, 30.5, 8, '#B8322A', 3]]) T.obj([x0, y0, x1, y1], function (g) {
    const i0 = g.cmds.length;
    K.box(g, x0, y0, x1, y1, 0, 2.4, { t: '#E9EEF0', l: '#CFD6DA', r: '#B9C1C6' }, { w: 0.6, boil: false });
    const R = RNG(seed * 61); for (let y = y0 + 0.5; y < y1 - 0.3; y += 0.9) for (let x = x0 + 0.4; x < x1 - 0.3; x += 1.2) { const p = g.p(x + R() * 0.3, y, 2.45), c = R.pick(['#C9D3D9', '#B9C4CC', '#D98A8A', '#E0C8A8']); g.fill2([[p[0] - 1.4, p[1]], [p[0], p[1] - 0.5], [p[0] + 1.2, p[1]], [p[0], p[1] + 0.5]], c, true); }
    for (const [x, y] of [[x0 + 0.2, y0 + 0.2], [x0 + 0.2, y1 - 0.2]]) { const a = g.p(x, y, 2.4), b = g.p(x, y, 7.0); g.line2([a, b], { w: 0.45, c: '#5A564E', boil: false }); }
    const can = [[x0 - 0.4, y0 - 0.3, 7.0], [x0 - 0.4, y1 + 0.3, 7.0], [x1 + 1.0, y1 + 0.3, 6.0], [x1 + 1.0, y0 - 0.3, 6.0]]; g.fill(can, aw); g.outline(can, { w: 0.55, boil: false });
    // at night a bare bulb under the canvas, the fish on the ice glistening in it
    IS.lift(g, i0, 0.52); IS.litCols(g, i0, { [aw]: true }); g.glow('lamp', (x0 + x1) / 2, (y0 + y1) / 2, 5.6, { r: 1.1 });
  }, { name: 'fish stall' });
  for (const [x, y, s] of [[-0.6, 27, 1], [8.6, 27, 2], [31.6, 5, 3]]) { T.cast([x, y], (g) => IS.person(g, x, y, 0, IS.who(2170 + s, { dir: 0, pose: s === 2 ? 'wave' : 'hold', ph: 0.2, top: '#E9E2D2', fcap: '#3B3F47', scarf: undefined, dress: undefined })), { name: 'fishmonger' }); T.cast([x + 2.6, y + 1], (g) => IS.person(g, x + 2.6, y + 1, 0, IS.who(2180 + s, { dir: 2, pose: 'hold' })), { name: 'customer' }); }
  T.cast([12, 33], (g) => { for (let k = 0; k < 4; k++) { const p = g.p(10.6 + k * 1.1, 33.4, 0); g.fill2([[p[0] - 1, p[1]], [p[0] + 1, p[1]], [p[0] + 1.2, p[1] - 2], [p[0] - 1.2, p[1] - 2]], '#8A6A4A', true); IS.tulips(g, 10.2 + k * 1.1, 32.8, 11.1 + k * 1.1, 33.6, [IS.C.tulip[k], IS.C.tulip[k + 1]], { z: 0.6, sp: 0.45 }); } IS.person(g, 15.6, 33.6, 0, IS.who(2191, { dir: 1, pose: 'hold', scarf: '#5FA58F', dress: '#5A6B7A' })); }, { name: 'flower seller' });

  /* ---- the bull of Kadıköy ---- */
  T.obj([14, 18, 24, 26], function (g) {
    K.box(g, 15, 19, 23, 25, 0, 2.2, { t: '#D9D0BC', l: '#C9BFA9', r: '#B5AA93' }, { w: 0.8 });
    const p = g.p(19, 22.6, 2.2), B = '#6E5A3A', D = '#4E3E28', s = (u, v) => [p[0] + u * 1.15, p[1] + v * 1.15];
    // the bull, head lowered, about to charge (wide px, facing lower right)
    g.fill2([s(-9, 0), s(-8.6, -5.2), s(-6, -8.4), s(0, -9.6), s(5.2, -8.6), s(7.2, -6.6), s(8.6, -4.2), s(7.6, -1.6), s(5.4, -2.4), s(4.2, -0.2), s(1, -1.6), s(-3, -1.4), s(-5.4, 0)], B, true);
    for (const [u0, u1] of [[-8.2, -7.4], [-5.6, -4.6], [3.6, 4.6], [5.8, 6.8]]) g.fill2([s(u0, -2.6), s(u1, -2.6), s(u1 + 0.2, 0), s(u0 + 0.2, 0)], D, true);
    g.fill2([s(6.4, -7.6), s(9.6, -6.2), s(11.4, -3.2), s(10.2, -1.8), s(8.0, -3.0)], B, true);
    g.line2([s(7.4, -7.2), s(7.0, -10.2), s(8.4, -11.4)], { w: 0.7, c: '#D9C49A', boil: false }); g.line2([s(8.8, -6.8), s(9.6, -9.4), s(11.2, -10.0)], { w: 0.7, c: '#D9C49A', boil: false });
    g.line2([s(-9, -4.4), s(-11, -2.4), s(-10.6, 0.4)], { w: 0.5, c: D, boil: false });
    g.fill2([s(-4, -8.6), s(2, -9.2), s(4, -7.6), s(-2, -7.4)], shade(B, -0.25), true);
    g.line2([s(-9, 0), s(-8.6, -5.2), s(-6, -8.4), s(0, -9.6), s(5.2, -8.6), s(7.2, -6.6), s(9.6, -6.2), s(11.4, -3.2), s(10.2, -1.8), s(8, -3), s(7.6, -1.6)], { w: 0.6, c: '#2E2418', boil: false });
  }, { name: 'bull' });
  T.cast([22, 28.6], (g) => { IS.person(g, 21.4, 28.8, 0, IS.who(2131, { dir: 3, pose: 'hold', phone: true })); IS.person(g, 23.2, 29.4, 0, IS.who(2132, { dir: 3, pose: 'wave', ph: 0.4, k: 0.78 })); IS.person(g, 24.6, 28.6, 0, IS.who(2133, { dir: 3, scarf: '#E8D9B8' })); }, { name: 'photographers' });

  /* ---- trees, benches, the musician, the cat man ---- */
  for (const [x, y] of [[-10, 14], [4, 28], [30, 8], [32, 26]]) T.obj([x, y], (g) => IS.plane(g, x, y, { r: 4.0, h: 5.4 }), { name: 'plane' });
  T.obj([-12, 30], (g) => IS.erguvan(g, -12, 30, { r: 3.8 }), { name: 'erguvan' });
  for (const [x, y] of [[-4, 20], [26, 33.6]]) T.obj([x, y], (g) => K.bench(g, x, y, { face: 'L', L: 2.4, col: '#7A5A3C' }), { name: 'bench' });
  T.cast([2, 12], (g) => { IS.stool2(g, g.p(2, 12, 1.3), '#7A5A3C'); const r = IS.person(g, 2, 12, 1.3, IS.who(2141, { dir: 1, pose: 'sit', beard: true, hairStyle: 'long' })); const h = r.hands[0]; g.fill2(arcPts(h[0] - 1.0, h[1] + 0.6, 1.6, 0, TAU, 10), '#A8743D', true); g.line2([[h[0] - 0.4, h[1]], [h[0] - 4.6, h[1] - 3.6]], { w: 0.5, c: '#6B4F35', boil: false, ext: 0 }); const c = g.p(3.6, 13.8, 0); g.fill2([[c[0] - 1.8, c[1]], [c[0] + 1.8, c[1]], [c[0] + 1.4, c[1] - 1], [c[0] - 1.4, c[1] - 1]], '#3F3A34', true); }, { name: 'musician' });
  for (const [x, y, s] of [[5.4, 14.6, 2142], [6.8, 13.4, 2143], [-1, 15.4, 2144]]) T.cast([x, y], (g) => IS.person(g, x, y, 0, IS.who(s, { dir: 2 })), { name: 'listener' });
  T.cast([-4, 20], (g) => { IS.person(g, -3.6, 20, 1.3, IS.who(2145, { dir: 0, pose: 'sit', hair: '#B9B3A8', hairStyle: 'bald', beard: true, cap: '#3B3F47' })); }, { on: true });
  for (const [x, y, c, p, fl] of [[-1.2, 21.2, 0, 'sit', -1], [-0.4, 18.6, 3, 'loaf', 1], [0.8, 22.4, 4, 'sit', -1], [-14, -21, 1, 'sit', 1], [12.4, -22.6, 2, 'loaf', -1], [-16, 5, 5, 'stretch', 1], [33, -22, 0, 'sit', -1], [-16.4, 24, 3, 'sit', 1]]) IS.cat(T, x, y, 0, { c, pose: p, fl });
  IS.catWalk(T, [[-12, -20], [34, -20], [34, -10], [-12, -10]], { c: 1, speed: 1.0, sit: 5 });
  IS.catWalk(T, [[-12, 8], [10, 8], [10, 2]], { c: 0, speed: 0.9, sit: 8 });
  // shoppers walking the market, a simit seller, a tea boy
  for (let i = 0; i < 6; i++) { const y = [-21, -9.2, 3, 8, -20.2, 9][i], d = i % 2 ? -1 : 1; IS.walker(T, IS.who(2150 + i, i === 3 ? { tray: true, top: '#F3F1EA', scarf: undefined } : {}), d > 0 ? [[-15, y], [35, y]] : [[35, y], [-15, y]], 1.0 + (i % 3) * 0.12, { phase: i * 0.21 }); }
  IS.walker(T, IS.who(2160, { teatray: true, top: '#F3F1EA', bot: '#6E5A44', k: 0.86, scarf: undefined, dress: undefined }), [[-15, -22], [-15, 34], [34, 34], [34, -22]], 1.2, { phase: 0.3 });
  for (let i = 0; i < 10; i++) { const R = RNG(i * 23 + 9), x0 = 4 + R() * 20, y0 = 30 + R() * 5; T.actor({ sample: 0.5, period: 19,
    at(t) { const u = ((t + 2) % 19 + 19) % 19, up = u > 15 && u < 17.6, f = up ? Math.floor(t * 8 + i) % 4 : (Math.floor(t * 2 + i * 1.7) % 3 === 0 ? 'u' : 'p'), h = up ? Math.sin(Math.PI * (u - 15) / 2.6) * 6 : 0; return { x: x0 + (up ? (u - 15) * 1.5 : 0), y: y0, z: h, key: up ? 'f' + f : f, f, up, fl: i % 2 ? 1 : -1 }; },
    draw(g, st) { const p = g.p(0, 0, 0); if (st.up) IS.gull2(g, p, st.f); else IS.pigeon2(g, p, st.fl, st.f === 'u'); } }); }
});
/* the goods spilling out of a Kadıköy shop (for IS.shop's goods hook) */
IS.kadikoyGoods = function (kind) {
  if (!kind) return null;
  return function (g, P, a0, a1) {
    const R = RNG(hstr(kind) + Math.round(a0 * 7));
    if (kind === 'fish') { const q = [P(a0 + 0.4, 0.4, 0), P(a1 - 0.4, 0.4, 0), P(a1 - 0.4, 1.8, 0), P(a0 + 0.4, 1.8, 0)]; K.box(g, Math.min(q[0][0], q[2][0]), Math.min(q[0][1], q[2][1]), Math.max(q[0][0], q[2][0]), Math.max(q[0][1], q[2][1]), 0, 1.6, { t: '#E9EEF0', l: '#CFD6DA', r: '#B9C1C6' }, { w: 0.5, boil: false }); for (let k = 0; k < 16; k++) { const p = g.p.apply(g, P(a0 + 0.8 + R() * (a1 - a0 - 1.6), 0.6 + R() * 1.0, 1.65)); g.fill2([[p[0] - 1.3, p[1]], [p[0], p[1] - 0.45], [p[0] + 1.1, p[1]], [p[0], p[1] + 0.45]], R.pick(['#C9D3D9', '#B9C4CC', '#D98A8A', '#E0C8A8']), true); } for (let k = 0; k < 3; k++) { const p = g.p.apply(g, P(a0 + 1.5 + k * (a1 - a0 - 3) / 2, 1.0, 3.6)); g.disc2(p, 0.7, '#E8573A'); g.mark({ nc: '#FF6A48' }); g.glow2('lantern', p, [p[0], -1e6], { r: 1.3, col: '#FF7A55' }); } }   // the red lamps over the fish, lit at night
    else if (kind === 'jars') { for (let k = 0; k < 10; k++) { const p = g.p.apply(g, P(a0 + 0.8 + (k % 5) * (a1 - a0 - 1.6) / 4, 0.1, 0.8 + Math.floor(k / 5) * 1.3)); g.fill2([[p[0] - 0.8, p[1]], [p[0] + 0.8, p[1]], [p[0] + 0.8, p[1] - 1.8], [p[0] - 0.8, p[1] - 1.8]], R.pick(['#C9584B', '#E3A72F', '#8FBF73', '#B84A7A', '#E8D06A']), true); g.fill2([[p[0] - 0.6, p[1] - 1.8], [p[0] + 0.6, p[1] - 1.8], [p[0] + 0.6, p[1] - 2.2], [p[0] - 0.6, p[1] - 2.2]], '#B48A3A', true); } }
    else if (kind === 'delight') { for (let k = 0; k < 4; k++) { const p = g.p.apply(g, P(a0 + 1 + k * (a1 - a0 - 2) / 3, 0.8, 0)); for (let j = 0; j < 4; j++) g.fill2([[p[0] - 1.1, p[1] - j * 0.9], [p[0] + 1.1, p[1] - j * 0.9], [p[0] + 1.1, p[1] - j * 0.9 - 0.8], [p[0] - 1.1, p[1] - j * 0.9 - 0.8]], ['#F2B6C2', '#F6F1E2', '#C9E3A8', '#F2D58A'][(j + k) % 4], true); } }
    else if (kind === 'cheese') { for (let k = 0; k < 5; k++) { const p = g.p.apply(g, P(a0 + 1 + k * (a1 - a0 - 2) / 4, 0.8, 0)); g.fill2(arcPts(p[0], p[1] - 1.0, 1.2, 0, TAU, 10).map((q) => [q[0], p[1] - 1.0 + (q[1] - p[1] + 1.0) * 0.6]), '#F2DFA0', true); g.fill2([[p[0] - 1.2, p[1] - 1.0], [p[0] + 1.2, p[1] - 1.0], [p[0] + 1.2, p[1]], [p[0] - 1.2, p[1]]], '#E9CF80', true); } }
    else if (kind === 'bread' || kind === 'veg') { for (let k = 0; k < 3; k++) { const a = a0 + 0.8 + k * (a1 - a0 - 1.6) / 2; const q = [P(a - 0.8, 0.5, 0), P(a + 0.8, 0.5, 0), P(a + 0.8, 0.5, 1.0), P(a - 0.8, 0.5, 1.0)]; g.fill(q, '#B48A5A'); const p = g.p.apply(g, P(a, 0.8, 1.0)); for (let j = 0; j < 5; j++) g.disc2([p[0] - 1.6 + j * 0.8, p[1] - 0.3 - (j % 2) * 0.4], 0.7, kind === 'bread' ? '#D9A65A' : R.pick(['#6FAE6A', '#C9584B', '#E3A72F'])); } }
  };
};
